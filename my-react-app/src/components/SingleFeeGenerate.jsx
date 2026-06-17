import React, { useEffect, useState, useContext, useMemo } from 'react';
import axios from 'axios';
import { useAuth } from './AuthContext';
import AcademicSessionContext from './AcademicSessionContext';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Select from 'react-select';

function SingleFeeGenerate({ editVoucherId = null, onSaved = null } = {}) {
  const { user } = useAuth();
  const { academicSession } = useContext(AcademicSessionContext);
  const isEditMode = !!editVoucherId;

  // Pending edit state — populated by the edit fetch, consumed by the fee
  // heads useEffect once the proper catalog (fee_head_details) is loaded.
  const [pendingEdit, setPendingEdit] = useState(null);

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [getClasses, setClasses] = useState([]);
  const [getStudents, setStudents] = useState([]);
  const [checkAdvance, setCheckAdvance] = useState(0);
  const [checkAdvanceStatus, setCheckAdvanceStatus] = useState('');
  const [selectedItems, setSelectedItems] = useState([]);
  const [headSearch, setHeadSearch] = useState('');
  const [mobileTab, setMobileTab] = useState('form'); // 'form' | 'heads'

  // Advance adjustment mode
  // add  → final = current + amount (positive only)
  // use  → final = current − amount (positive only, deducts from balance)
  // set  → final = amount (absolute override)
  const [advMode, setAdvMode] = useState('add');
  const [advAmount, setAdvAmount] = useState(0);

  const initialState = {
    class_id: '',
    section_id: '',
    student_id: '',
    student_unique_id: '',
    shift: '',
    from_month: '',
    to_month: '',
    due_date: '',
    remarks: '',
    heads_with_amount: '',
    category_id: '',
    fee_group_id: '',
    arrear_set: true,
    bus_fee_status: true,
    bus_status: '',
    bus_fee: 0,
    fine: 0,
    advance: 0,
    amount: '',
    session_id: academicSession,
    campus_id: user.user.campus_id,
    user_id: user.user.user_id,
    hidden_id: '',
    consolidated: false, // when true → single voucher with multiplied amounts
  };

  const [validity, setValidity] = useState({
    class_id: true, from_month: true, due_date: true, remarks: true, shift: true,
  });

  const [editFormData, setEditFormData] = useState(initialState);

  useEffect(() => {
    if (academicSession) {
      setEditFormData((prev) => ({ ...prev, session_id: parseInt(academicSession) }));
    }
  }, [academicSession]);

  // ─── EDIT MODE: load existing voucher when editVoucherId prop is set ───
  // We DON'T resolve the heads here — that's done in the fee heads
  // useEffect once the proper catalog (/get-fee-heads-details-for-vouchers,
  // which returns fee_head_details ids that match the voucher's fee_head
  // JSON ids) is loaded. Here we just stash the voucher info and set the
  // form fields so the catalog query has class/shift/category to fetch by.
  useEffect(() => {
    if (!editVoucherId || !user?.user?.campus_id || !academicSession) return;
    axios
      .get(
        `${process.env.REACT_APP_API_BASE_URL}/edit-fee-voucher/${editVoucherId}/${user.user.campus_id}/${academicSession}`
      )
      .then((res) => {
        const v = (res.data.vouchers && res.data.vouchers[0]) || null;
        if (!v) return;

        const formatDate = (s) => {
          if (!s) return '';
          const d = new Date(s);
          return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
        };
        const fromMonthRaw = v.for_the_month || '';
        const toMonthRaw = v.to_month || v.for_the_month || '';
        const toYM = (s) => (s ? String(s).slice(0, 7) : '');

        let existingFeeHead = [];
        try {
          existingFeeHead = typeof v.fee_head === 'string' ? JSON.parse(v.fee_head) : (v.fee_head || []);
        } catch (e) {
          existingFeeHead = [];
        }

        const isConsolidated = !!(v.to_month && toYM(v.to_month) !== toYM(v.for_the_month));
        let monthMul = 1;
        if (isConsolidated) {
          const fm = toYM(fromMonthRaw);
          const tm = toYM(toMonthRaw);
          if (fm && tm) {
            const [fy, fmm] = fm.split('-').map(Number);
            const [ty, tmm] = tm.split('-').map(Number);
            monthMul = Math.max(1, (ty - fy) * 12 + (tmm - fmm) + 1);
          }
        }

        // Stash voucher data for the fee heads useEffect to consume once it
        // loads the proper fee_head_details catalog. The IDs in
        // voucher.fee_head match fee_head_details.id (returned by the
        // fee-heads-details endpoint), NOT the raw heads table id (which is
        // what /edit-fee-voucher returns).
        setPendingEdit({
          voucher: v,
          existingFeeHead,
          monthMul,
        });

        // Pre-fill form. hidden_id triggers the backend's UPDATE branch.
        // Setting class/shift/category triggers the fee heads useEffect
        // which loads the right catalog and consumes pendingEdit.
        setEditFormData((prev) => ({
          ...prev,
          hidden_id: v.id,
          class_id: v.class_id || '',
          section_id: v.section_id || '',
          student_id: v.student_id || '',
          student_unique_id: v.student_unique_id || '',
          shift: v.student_shift || v.shift || prev.shift || '',
          category_id: v.category_id || '',
          from_month: toYM(fromMonthRaw),
          to_month: toYM(toMonthRaw),
          due_date: formatDate(v.due_date),
          remarks: v.remarks || '',
          fine: parseInt(v.fine) || 0,
          // Bus fee on voucher row may be zeroed (covered). Recover
          // per-month value: if voucher.bus_fee > 0, divide by monthMul.
          bus_fee: monthMul > 0 ? Math.round((parseInt(v.bus_fee) || 0) / monthMul) : (parseInt(v.bus_fee) || 0),
          consolidated: isConsolidated,
        }));
      })
      .catch((err) => {
        console.error('Failed to load voucher for edit', err);
        toast.error('Could not load voucher for editing');
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editVoucherId, user, academicSession]);

  // Number of months between from_month and to_month (inclusive). 1 when
  // not in consolidated mode (to_month defaults to from_month). Used to
  // multiply heads/bus_fee when generating a consolidated voucher.
  const monthCount = useMemo(() => {
    if (!editFormData.consolidated) return 1;
    if (!editFormData.from_month || !editFormData.to_month) return 1;
    const [fy, fm] = editFormData.from_month.split('-').map(Number);
    const [ty, tm] = editFormData.to_month.split('-').map(Number);
    const n = (ty - fy) * 12 + (tm - fm) + 1;
    return n > 0 ? n : 1;
  }, [editFormData.consolidated, editFormData.from_month, editFormData.to_month]);

  // Heads + bus + fine raw subtotal — multiplied by monthCount when consolidated
  const grandAmount = selectedItems.reduce((tot, it) => tot + (parseInt(it.amount) || 0), 0);
  const headsSubtotal = useMemo(
    () =>
      (grandAmount * monthCount)
      + ((parseInt(editFormData.bus_fee) || 0) * monthCount)
      + (parseInt(editFormData.fine) || 0),
    [grandAmount, editFormData.bus_fee, editFormData.fine, monthCount]
  );

  // ── Advance derivation (single source of truth) ──
  // Business rules (per user):
  //   USE mode (advance pays voucher):
  //     If running advance ≥ heads → voucher's actual amount is deducted from
  //     running, fee_heads = 0, voucher amount payable = 0, voucher PAID.
  //
  //   ADD mode (depositing new amount):
  //     If running advance ≥ heads → existing covers the voucher (deducted
  //     from running) and fee_heads = 0. Voucher amount payable = the new
  //     addition (so parent deposits THIS at the bank). Running = existing
  //     − heads + new_addition. Voucher stays UNPAID until the deposit is
  //     made at the bank.
  //     If running < heads → no advance covers the voucher; parent pays
  //     heads + new at the counter; running just grows by new. fee_heads
  //     stay real.
  //
  //   SET mode → re-routed to add (if new > existing) or use (if new < existing).
  const advCalc = useMemo(() => {
    const existing = Number(checkAdvance) || 0;
    const amt = Number(advAmount) || 0;
    const heads = headsSubtotal;

    // Normalize Set into Add / Use
    let mode = advMode;
    let effAmt = amt;
    if (mode === 'set') {
      const delta = amt - existing;
      if (delta === 0) { mode = 'none'; effAmt = 0; }
      else if (delta > 0) { mode = 'add'; effAmt = delta; }
      else { mode = 'use'; effAmt = -delta; }
    }

    if (effAmt === 0 || mode === 'none') {
      // No explicit user action, but if the student already has a running
      // advance balance the backend will auto-cascade-deduct it from the
      // voucher heads. Reflect that here so the UI shows the correct
      // payable amount (matches backend behaviour).
      if (heads === 0) {
        return {
          existing,
          firstAdvanceDelta: 0,
          finalAdvance: existing,
          voucherAmountPayable: 0,
          zeroFeeHeads: false,
          paidFromAdvance: false,
          effectiveMode: 'none',
        };
      }
      if (existing >= heads) {
        // Existing fully covers — voucher auto-paid, fee_heads zeroed
        return {
          existing,
          firstAdvanceDelta: 0,
          finalAdvance: existing - heads,
          voucherAmountPayable: 0,
          zeroFeeHeads: true,
          paidFromAdvance: true,
          effectiveMode: 'use-covered',
        };
      }
      if (existing > 0) {
        // Existing partially covers — voucher = heads − existing
        return {
          existing,
          firstAdvanceDelta: 0,
          finalAdvance: 0,
          voucherAmountPayable: heads - existing,
          zeroFeeHeads: false,
          paidFromAdvance: false,
          effectiveMode: 'use-partial',
        };
      }
      return {
        existing,
        firstAdvanceDelta: 0,
        finalAdvance: 0,
        voucherAmountPayable: heads,
        zeroFeeHeads: false,
        paidFromAdvance: false,
        effectiveMode: 'none',
      };
    }

    // USE — consume existing running balance to pay voucher
    if (mode === 'use') {
      if (existing >= heads && heads > 0) {
        return {
          existing,
          firstAdvanceDelta: -heads, // running deducts voucher's actual
          finalAdvance: existing - heads,
          voucherAmountPayable: 0,
          zeroFeeHeads: true,
          paidFromAdvance: true,
          effectiveMode: 'use-covered',
        };
      }
      // Existing < heads → existing fully consumed, parent pays the diff.
      // Matches backend cascade-deduct behaviour.
      if (existing > 0) {
        return {
          existing,
          firstAdvanceDelta: -existing,
          finalAdvance: 0,
          voucherAmountPayable: heads - existing,
          zeroFeeHeads: false,
          paidFromAdvance: false,
          effectiveMode: 'use-partial',
        };
      }
      // No existing — plain voucher
      return {
        existing,
        firstAdvanceDelta: 0,
        finalAdvance: 0,
        voucherAmountPayable: heads,
        zeroFeeHeads: false,
        paidFromAdvance: false,
        effectiveMode: 'use-insufficient',
      };
    }

    // ADD — depositing new advance
    if (mode === 'add') {
      const newAdd = effAmt;
      if (existing >= heads && heads > 0) {
        // Existing has the full voucher amount → deduct heads from running,
        // store fee_heads as 0, voucher amount = new deposit, status unpaid
        // until the parent banks the new deposit.
        return {
          existing,
          firstAdvanceDelta: newAdd, // +ve (only the new deposit)
          finalAdvance: existing - heads + newAdd,
          voucherAmountPayable: newAdd,
          zeroFeeHeads: true,
          paidFromAdvance: false, // unpaid: deposit pending at bank
          effectiveMode: 'add-covered',
        };
      }
      // Existing < heads — existing partially covers via cascade-deduct,
      // parent pays the diff + the new deposit at the counter/bank.
      const covered = Math.min(existing, heads);
      return {
        existing,
        firstAdvanceDelta: newAdd,
        finalAdvance: (existing - covered) + newAdd,
        voucherAmountPayable: (heads - covered) + newAdd,
        zeroFeeHeads: false,
        paidFromAdvance: false,
        effectiveMode: covered > 0 ? 'add-partial' : 'add-cash',
      };
    }

    return {
      existing,
      firstAdvanceDelta: 0,
      finalAdvance: existing,
      voucherAmountPayable: heads,
      zeroFeeHeads: false,
      paidFromAdvance: false,
      effectiveMode: 'none',
    };
  }, [advMode, advAmount, checkAdvance, headsSubtotal]);

  const firstAdvanceDelta = advCalc.firstAdvanceDelta;
  const finalAdvance = advCalc.finalAdvance;
  const paidFromAdvance = advCalc.paidFromAdvance;

  // Sync to editFormData so the existing payload picks them up.
  useEffect(() => {
    setEditFormData((prev) => ({
      ...prev,
      advance: firstAdvanceDelta,
      first_advance_payment: firstAdvanceDelta,
      advance_payments: finalAdvance,
    }));
  }, [finalAdvance, firstAdvanceDelta]);

  // Classes
  useEffect(() => {
    if (!user?.user?.campus_id) return;
    axios
      .get(process.env.REACT_APP_API_BASE_URL + `/get-classes/${user.user.campus_id}`)
      .then((res) => setClasses(res.data.results || []))
      .catch((err) => console.log(err));
  }, [user]);

  // Students for selected class/section/shift
  useEffect(() => {
    if (
      !user?.user?.campus_id ||
      !editFormData.class_id ||
      !editFormData.section_id ||
      !editFormData.shift
    ) return;
    axios
      .get(
        `${process.env.REACT_APP_API_BASE_URL}/get-students/${editFormData.class_id}/${editFormData.section_id}/${user.user.campus_id}/${academicSession}/${editFormData.shift}`
      )
      .then((res) => setStudents(res.data.results || []))
      .catch((err) => console.log(err));
  }, [user, editFormData.class_id, editFormData.section_id, editFormData.shift, academicSession]);

  // Existing advance for selected student.
  // In EDIT mode we skip this auto-fetch because we already restore the
  // pre-voucher balance (and the existing first_advance_payment / advance
  // adjustment) from the voucher itself inside the edit useEffect above.
  // If we let this fire, it would overwrite checkAdvance with the LATEST
  // balance (post-voucher), breaking the edit experience.
  useEffect(() => {
    if (isEditMode) return;
    if (!user?.user?.campus_id || !editFormData.student_id) {
      setCheckAdvance(0);
      setCheckAdvanceStatus('');
      return;
    }
    axios
      .get(
        `${process.env.REACT_APP_API_BASE_URL}/check-advance/${editFormData.student_id}/${user.user.campus_id}/${academicSession}`
      )
      .then((res) => {
        const advAmt = Number(res.data.advance_payments) || 0;
        setCheckAdvance(advAmt);
        setCheckAdvanceStatus(res.data.status || '');
        // Reset adjustment when student changes
        setAdvMode('add');
        setAdvAmount(0);
      })
      .catch((err) => {
        console.log(err);
        setCheckAdvance(0);
        setCheckAdvanceStatus('');
      });
  }, [editFormData.student_id, user, academicSession, isEditMode]);

  // Fee heads — fetches the proper fee_head_details catalog. In EDIT mode
  // it also consumes the `pendingEdit` state stashed by the edit useEffect
  // (so we can match voucher.fee_head ids to the catalog and pre-select).
  useEffect(() => {
    if (!isEditMode) setSelectedItems([]);
    const voucher_type = 'single_voucher_form';
    if (
      !user?.user?.campus_id ||
      !editFormData.class_id ||
      !editFormData.shift ||
      !editFormData.category_id
    ) return;
    axios
      .get(
        `${process.env.REACT_APP_API_BASE_URL}/get-fee-heads-details-for-vouchers/${user.user.campus_id}/${voucher_type}/${editFormData.category_id}/${editFormData.class_id}/${editFormData.shift}/`
      )
      .then((res) => {
        const fetchedData = res.data.results || [];
        setData(fetchedData);

        if (isEditMode && pendingEdit) {
          // EDIT MODE: pre-select voucher's heads using the proper catalog
          const { voucher: v, existingFeeHead, monthMul } = pendingEdit;
          const catalogById = {};
          fetchedData.forEach((c) => { catalogById[parseInt(c.id)] = c; });

          const voucherHeadIds = existingFeeHead.map((fh) => parseInt(fh.id));
          const preSelected = voucherHeadIds.map((fhId) => {
            const cat = catalogById[fhId];
            const storedAmount = parseInt(
              (existingFeeHead.find((fh) => parseInt(fh.id) === fhId) || {}).amount
            ) || 0;
            return {
              id: fhId,
              amount: cat
                ? (parseInt(cat.amount) || 0)
                : (monthMul > 0 ? Math.round(storedAmount / monthMul) : storedAmount),
              category_id: cat ? cat.category_id : v.category_id,
              category_name: (cat && cat.category)
                || (existingFeeHead.find((fh) => parseInt(fh.id) === fhId) || {}).category_name
                || '',
              head_name: (cat && cat.head_name) || `Head ${fhId}`,
            };
          });
          setSelectedItems(preSelected);

          // Seed advance adjustment state from voucher's first_advance_payment
          const voucherFirstAdv = parseInt(v.first_advance_payment) || 0;
          if (voucherFirstAdv > 0) { setAdvMode('add'); setAdvAmount(voucherFirstAdv); }
          else if (voucherFirstAdv < 0) { setAdvMode('use'); setAdvAmount(Math.abs(voucherFirstAdv)); }
          else { setAdvMode('add'); setAdvAmount(0); }

          // ─── Fetch the PREVIOUS voucher's running balance ───
          // This gives the Current Balance the student had BEFORE this
          // voucher was generated (the most reliable source for edit UX).
          axios
            .get(
              `${process.env.REACT_APP_API_BASE_URL}/check-advance/${v.student_id}/${user.user.campus_id}/${academicSession}?exclude_voucher_id=${v.id}`
            )
            .then((advRes) => {
              setCheckAdvance(Number(advRes.data.advance_payments) || 0);
              setCheckAdvanceStatus(advRes.data.status || '');
            })
            .catch((advErr) => {
              console.warn('Could not fetch previous voucher balance', advErr);
              setCheckAdvance(0);
              setCheckAdvanceStatus('');
            });

          // Consume pending so we don't re-run this
          setPendingEdit(null);
        } else if (!isEditMode) {
          // CREATE MODE: add always_checked items
          const alwaysCheckedItems = fetchedData
            .filter((item) => item.checked_status === 'always_checked')
            .map((item) => ({
              id: item.id,
              amount: item.amount,
              category_id: item.category_id,
              category_name: item.category,
              head_name: item.head_name,
            }));
          setSelectedItems((prev) => [...prev, ...alwaysCheckedItems]);
        }
        setLoading(false);
      })
      .catch((err) => console.log(err));
  }, [user, editFormData.class_id, editFormData.shift, editFormData.category_id, isEditMode, pendingEdit]);

  // Auto-derive due date as 2nd of selected month
  useEffect(() => {
    if (!editFormData.from_month) return;
    const selectedMonth = new Date(editFormData.from_month);
    const dueDate = new Date(selectedMonth.getFullYear(), selectedMonth.getMonth(), 2);
    setEditFormData((prev) => ({ ...prev, due_date: dueDate.toISOString().split('T')[0] }));
  }, [editFormData.from_month]);

  const validateForm = () => {
    let isValid = true;
    const newValidity = { class_id: true, from_month: true, due_date: true, remarks: true, shift: true };
    if (!editFormData.class_id) { newValidity.class_id = false; isValid = false; }
    if (!editFormData.from_month) { newValidity.from_month = false; isValid = false; }
    if (!editFormData.due_date) { newValidity.due_date = false; isValid = false; }
    if (!editFormData.remarks?.trim()) { newValidity.remarks = false; isValid = false; }
    if (!editFormData.shift) { newValidity.shift = false; isValid = false; }
    setValidity(newValidity);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e?.preventDefault?.();
    if (selectedItems.length === 0) { toast.error('Please select at least one fee head'); return; }
    if (!validateForm()) { toast.error('Please fill all required fields'); return; }

    // Always send the REAL fee_head amounts so backend can compute heads
    // total correctly. Backend will zero them in JSON storage when the
    // voucher is paid from advance (existing balance >= heads).
    const itemsForPayload = selectedItems;

    const groupedData = {};
    itemsForPayload.forEach((item) => {
      const { category_id, head_name, ...rest } = item;
      if (groupedData[category_id]) groupedData[category_id].push(rest);
      else groupedData[category_id] = [rest];
    });

    // Explicit advance payload — backend MUST honour these fields. The
    // legacy "advance" field is the SIGNED delta (parent's contribution),
    // while advance_payments is the FINAL running balance the backend
    // should write directly to the DB column (no further computation).
    //
    // ⚠ Backend rule we depend on:
    //    DB.advance_payments = req.advance_payments          (use as-is)
    //    DB.first_advance_payment = req.first_advance_payment (use as-is)
    //    DB.fee_status = req.paid_from_advance ? 'paid' : 'unpaid'
    //    DB.total_amount = req.voucher_amount_payable        (parent slip)
    //    DB.fee_head amounts = whatever we send (already zeroed if needed)
    const payloadForm = {
      ...editFormData,
      // SIGNED delta (this voucher's contribution to advance)
      first_advance_payment: firstAdvanceDelta,
      advance: firstAdvanceDelta,
      // FINAL running balance — backend should write this verbatim
      advance_payments: finalAdvance,
      // What parent actually pays at counter / deposits at bank
      voucher_amount_payable: advCalc.voucherAmountPayable,
      total_amount_override: advCalc.voucherAmountPayable,
      // Status hint
      paid_from_advance: advCalc.paidFromAdvance,
      fee_status_override: advCalc.paidFromAdvance ? 'paid' : 'unpaid',
      // Bookkeeping fields backend can use for accurate math
      previous_running_advance: advCalc.existing,
      original_heads_total: headsSubtotal,
      effective_mode: advCalc.effectiveMode,
    };

    // Debug — open DevTools console to verify the exact payload being sent
    // eslint-disable-next-line no-console
    console.log('[SingleFeeGenerate] Submitting voucher with payload:', {
      editFormData: payloadForm,
      groupedData,
      _summary: {
        existing_balance: advCalc.existing,
        heads_total: headsSubtotal,
        user_action: `${advCalc.effectiveMode}`,
        first_advance_payment: firstAdvanceDelta,
        new_running_balance: finalAdvance,
        voucher_amount_payable: advCalc.voucherAmountPayable,
        fee_heads_zeroed: advCalc.zeroFeeHeads,
        voucher_status: advCalc.paidFromAdvance ? 'paid' : 'unpaid',
      },
    });

    try {
      // amountsData is consumed by the backend's UPDATE branch when editing
      // a voucher. We don't expose per-arrear toggles here so just send an
      // empty array; the backend has defensive defaults too.
      const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/single-fee-voucher`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ editFormData: payloadForm, groupedData, amountsData: [] }),
      });
      if (!response.ok) throw new Error('Network response was not ok');
      const responseData = await response.json();
      if (responseData.message === 'greater_month') {
        toast.error('Voucher month should be greater than the last entry');
      } else {
        toast.success(
          isEditMode
            ? 'Voucher updated successfully!'
            : advCalc.paidFromAdvance
              ? 'Voucher generated & paid from advance!'
              : 'Fee voucher submitted successfully!'
        );
        setEditFormData((prev) => ({ ...prev, student_id: '', advance: 0, bus_fee: 0 }));
        setSelectedItems([]);
        setAdvAmount(0);
        setAdvMode('add');
        if (typeof onSaved === 'function') onSaved();
      }
    } catch (err) {
      console.error('Error:', err);
      toast.error('Submission failed');
    }
  };

  const handleCheckboxChange = (id, amount, category_id, category_name) => {
    setSelectedItems((prev) => {
      const isSel = prev.some((it) => it.id === id);
      if (isSel) return prev.filter((it) => it.id !== id);
      return [...prev, { id, amount, category_id, category_name }];
    });
  };

  const handleAmountChange = (e, id) => {
    const newAmount = e.target.value;
    setSelectedItems((prev) =>
      prev.map((it) => (it.id === id ? { ...it, amount: parseInt(newAmount) || 0 } : it))
    );
  };

  const findClassLabel = () => {
    if (!editFormData.class_id || !editFormData.section_id) return '';
    const c = getClasses.find(
      (x) => x.id === parseInt(editFormData.class_id) && x.section_id === parseInt(editFormData.section_id)
    );
    return c ? `${c.class} (${c.section_name})` : '';
  };

  const handleClassChange = (opt) => {
    if (!opt) { setEditFormData((prev) => ({ ...prev, class_id: '', section_id: '' })); return; }
    const [class_id, section_id] = opt.value.split(',');
    setEditFormData((prev) => ({ ...prev, class_id, section_id }));
  };

  const handleStudentChange = (opt) => {
    if (!opt) {
      setEditFormData((prev) => ({ ...prev, student_id: '', student_unique_id: '', bus_fee: 0, bus_status: '' }));
      return;
    }
    const stu = getStudents.find((s) => s.id === opt.value);
    setEditFormData((prev) => ({
      ...prev,
      student_id: opt.value,
      category_id: opt.category_id || '',
      shift: opt.shift || prev.shift,
      student_unique_id: opt.student_unique_id || '',
      bus_fee: stu ? stu.bus_fee : 0,
      bus_status: stu ? stu.bus_status : '',
    }));
  };

  // Voucher amount payable comes from advCalc, which handles add/use/set
  // (including the "heads − existing + new" rule when adding on top of an
  // existing running balance).
  const total = advCalc.voucherAmountPayable;

  // Filtered heads
  const filteredHeads = useMemo(() => {
    const q = headSearch.trim().toLowerCase();
    if (!q) return data;
    return data.filter((d) =>
      `${d.head_name || ''} ${d.category || ''}`.toLowerCase().includes(q)
    );
  }, [data, headSearch]);

  const formatRs = (n) => 'Rs. ' + new Intl.NumberFormat('en-US').format(Number(n) || 0);

  const classOptions = getClasses.map((c) => ({
    value: `${c.id},${c.section_id}`,
    label: `${c.class} (${c.section_name})`,
  }));

  const studentOptions = getStudents.map((s) => ({
    value: s.id,
    label: s.full_name,
    category_id: s.category_id,
    shift: s.shift,
    student_unique_id: s.student_unique_id,
  }));

  return (
    <div className="sfg-shell">
      <style>{`
        .sfg-shell {
          display: flex; flex-direction: column; min-height: 100vh;
          background: linear-gradient(180deg, #f4f6fa 0%, #eef1f6 100%);
          font-family: "Segoe UI", system-ui, -apple-system, sans-serif;
          padding-bottom: 80px;
        }
        .sfg-head {
          background: linear-gradient(135deg, #111418 0%, #1a1f25 100%);
          color: #EBD197; padding: 16px 18px;
          border-bottom: 3px solid #EBD197;
          display: flex; align-items: center; gap: 10px;
        }
        .sfg-head h2 { margin: 0; font-size: 17px; font-weight: 700; display: flex; align-items: center; gap: 10px; }

        .sfg-tabs { display: flex; background: #fff; border-bottom: 1px solid #e6e8eb; position: sticky; top: 0; z-index: 5; }
        .sfg-tab {
          flex: 1; padding: 14px 12px; background: transparent; border: none;
          font-size: 14px; font-weight: 600; color: #6c757d; cursor: pointer;
          display: flex; align-items: center; justify-content: center; gap: 8px;
          border-bottom: 3px solid transparent;
        }
        .sfg-tab.is-active { color: #111418; border-bottom-color: #EBD197; background: #fffaf0; }
        .sfg-tab .sfg-badge { background: #EBD197; color: #1f2329; font-size: 11px; font-weight: 700; padding: 2px 8px; border-radius: 999px; }

        .sfg-body { flex: 1; display: flex; flex-direction: row; min-height: 0; }
        .sfg-pane { flex: 1; padding: 14px; overflow-y: auto; box-sizing: border-box; }
        .sfg-pane--form { background: transparent; max-width: 460px; }
        .sfg-pane--heads { background: #fff; border-left: 1px solid #e6e8eb; }

        @media (max-width: 991px) {
          .sfg-pane--form { display: ${mobileTab === 'form' ? 'block' : 'none'}; max-width: none; }
          .sfg-pane--heads { display: ${mobileTab === 'heads' ? 'block' : 'none'}; border-left: none; }
        }
        @media (min-width: 992px) {
          .sfg-tabs { display: none; }
          .sfg-pane--form, .sfg-pane--heads { display: block; }
        }

        .sfg-card {
          background: #fff; border-radius: 14px; padding: 14px;
          border: 1px solid #e8ecf2; box-shadow: 0 2px 8px rgba(17,20,24,0.05);
          margin-bottom: 14px;
        }
        .sfg-card__title {
          font-size: 13px; font-weight: 700; color: #1f2329;
          display: flex; align-items: center; gap: 8px;
          margin: 0 0 12px 0; padding-bottom: 8px; border-bottom: 2px solid #EBD197;
        }
        .sfg-card__title i { color: #EBD197; }

        .sfg-row { margin-bottom: 12px; }
        .sfg-label { display: block; font-size: 11px; font-weight: 700; color: #6c757d; text-transform: uppercase; letter-spacing: 0.4px; margin-bottom: 5px; }
        .sfg-input {
          width: 100%; padding: 10px 12px; border: 1px solid #d0d7e2; border-radius: 8px;
          font-size: 13px; box-sizing: border-box; background: #fff; min-height: 42px;
        }
        .sfg-input:focus { outline: none; border-color: #EBD197; box-shadow: 0 0 0 3px rgba(235,209,151,0.25); }
        .sfg-input.is-invalid { border-color: #dc3545; }

        .sfg-radios { display: flex; gap: 8px; }
        .sfg-radio {
          flex: 1; padding: 8px 12px; border: 1.5px solid #d0d7e2; background: #fff;
          border-radius: 8px; font-size: 13px; font-weight: 600; color: #6c757d;
          cursor: pointer; display: inline-flex; align-items: center; justify-content: center; gap: 6px;
          -webkit-tap-highlight-color: transparent;
        }
        .sfg-radio.is-active { background: #fff8e6; border-color: #EBD197; color: #5b4a1a; }

        /* Advance block */
        .sfg-adv {
          background: linear-gradient(135deg, #fff8e6 0%, #fff 100%);
          border: 1px solid #EBD197; border-radius: 12px; padding: 12px;
        }
        .sfg-adv__balance {
          display: flex; align-items: center; justify-content: space-between;
          background: #111418; color: #EBD197;
          padding: 10px 14px; border-radius: 8px; margin-bottom: 10px;
        }
        .sfg-adv__balance-lbl { font-size: 11px; text-transform: uppercase; letter-spacing: 0.5px; font-weight: 700; opacity: 0.85; }
        .sfg-adv__balance-val { font-size: 16px; font-weight: 800; }
        .sfg-adv__balance-tag {
          background: #EBD197; color: #1f2329;
          font-size: 10px; font-weight: 700; padding: 2px 8px; border-radius: 999px;
          text-transform: uppercase;
        }
        .sfg-adv__modes { display: flex; gap: 6px; margin-bottom: 10px; flex-wrap: wrap; }
        .sfg-adv__mode {
          flex: 1; min-width: 90px; padding: 8px 8px;
          background: #fff; border: 1.5px solid #d0d7e2; border-radius: 8px;
          font-size: 12px; font-weight: 700; color: #6c757d; cursor: pointer;
          display: inline-flex; align-items: center; justify-content: center; gap: 5px;
          -webkit-tap-highlight-color: transparent;
        }
        .sfg-adv__mode.is-active.is-add { background: #d4edda; border-color: #198754; color: #155724; }
        .sfg-adv__mode.is-active.is-use { background: #fde2e2; border-color: #dc3545; color: #842029; }
        .sfg-adv__mode.is-active.is-set { background: #cfe2ff; border-color: #0d6efd; color: #084298; }
        .sfg-adv__chips { display: flex; gap: 6px; flex-wrap: wrap; margin-top: 8px; }
        .sfg-adv__chip {
          background: #fff; border: 1px solid #d0d7e2; border-radius: 999px;
          padding: 4px 10px; font-size: 11px; font-weight: 700; color: #1f2329;
          cursor: pointer; -webkit-tap-highlight-color: transparent;
        }
        .sfg-adv__chip:hover { border-color: #EBD197; background: #fff8e6; }
        .sfg-adv__preview {
          margin-top: 10px; padding: 10px 12px;
          background: #fff; border: 1px dashed #EBD197; border-radius: 8px;
          display: flex; justify-content: space-between; align-items: center;
          font-size: 12px;
        }
        .sfg-adv__preview-val { font-weight: 700; font-size: 14px; color: #111418; }
        .sfg-adv__diff { font-size: 11px; font-weight: 700; padding: 2px 8px; border-radius: 999px; }
        .sfg-adv__diff.is-up { background: #d4edda; color: #155724; }
        .sfg-adv__diff.is-down { background: #fde2e2; color: #842029; }

        /* Heads pane */
        .sfg-heads-head {
          display: flex; gap: 10px; align-items: center; margin-bottom: 12px; flex-wrap: wrap;
        }
        .sfg-heads-head h3 { margin: 0; font-size: 15px; font-weight: 700; color: #111418; display: flex; align-items: center; gap: 8px; padding-bottom: 6px; border-bottom: 2px solid #EBD197; }
        .sfg-search { flex: 1; min-width: 180px; padding: 9px 12px; border: 1px solid #d0d7e2; border-radius: 8px; font-size: 13px; background: #fff; }
        .sfg-search:focus { outline: none; border-color: #EBD197; box-shadow: 0 0 0 3px rgba(235,209,151,0.25); }

        .sfg-table { width: 100%; border-collapse: separate; border-spacing: 0; background: #fff; border: 1px solid #e6e8eb; border-radius: 10px; overflow: hidden; }
        .sfg-table thead th {
          background: linear-gradient(135deg, #111418, #1a1f25); color: #EBD197;
          padding: 10px 12px; text-align: left; font-weight: 700; font-size: 12px;
          border-bottom: 1px solid #2a3038;
        }
        .sfg-table tbody td { padding: 10px 12px; border-top: 1px solid #f1f3f6; font-size: 13px; vertical-align: middle; }
        .sfg-table tbody tr.is-checked td { background: #fff8e6; }
        .sfg-amt-input {
          width: 100px; padding: 6px 10px; border: 1px solid #d0d7e2; border-radius: 6px;
          font-size: 13px; text-align: right; background: #fff;
        }
        .sfg-amt-input:focus { outline: none; border-color: #EBD197; box-shadow: 0 0 0 3px rgba(235,209,151,0.25); }
        .sfg-check {
          width: 22px; height: 22px; border-radius: 6px;
          border: 2px solid #d0d7e2; background: #fff; cursor: pointer;
          display: inline-flex; align-items: center; justify-content: center;
        }
        .sfg-check.is-checked { background: #EBD197; border-color: #EBD197; }
        .sfg-check.is-checked i { color: #1f2329; font-size: 12px; }
        .sfg-check i { color: transparent; font-size: 12px; }

        .sfg-empty { text-align: center; padding: 30px 14px; color: #9aa3af; font-size: 13px; }
        .sfg-empty i { font-size: 28px; color: #d0d7e2; display: block; margin-bottom: 8px; }

        /* Summary card (sticky bottom right) */
        .sfg-summary {
          position: sticky; bottom: 12px; margin-top: 14px;
          background: #fff; border: 1px solid #e6e8eb; border-radius: 12px;
          padding: 12px; box-shadow: 0 4px 14px rgba(17,20,24,0.08);
        }
        .sfg-summary__row { display: flex; justify-content: space-between; font-size: 13px; padding: 4px 0; }
        .sfg-summary__row.is-total { border-top: 2px solid #EBD197; margin-top: 6px; padding-top: 8px; font-weight: 800; font-size: 16px; color: #111418; }

        /* Sticky save bar */
        .sfg-savebar {
          position: fixed; bottom: 0; left: 0; right: 0;
          background: #fff; border-top: 1px solid #e6e8eb;
          padding: 12px 14px; box-shadow: 0 -4px 14px rgba(17,20,24,0.08);
          display: flex; gap: 10px; align-items: center; z-index: 10;
        }
        .sfg-savebar__info { flex: 1; font-size: 13px; color: #6c757d; font-weight: 600; }
        .sfg-savebar__info strong { color: #111418; }
        .sfg-save-btn {
          background: linear-gradient(135deg, #EBD197, #d4b674); color: #1f2329; border: none;
          padding: 12px 24px; border-radius: 10px; font-size: 14px; font-weight: 700; cursor: pointer;
          display: inline-flex; align-items: center; gap: 8px; min-height: 48px;
          box-shadow: 0 4px 10px rgba(235,209,151,0.35);
        }
        .sfg-save-btn:disabled { opacity: 0.55; cursor: not-allowed; }
      `}</style>

      {/* Mobile tabs */}
      <div className="sfg-tabs">
        <button type="button" className={`sfg-tab ${mobileTab === 'form' ? 'is-active' : ''}`} onClick={() => setMobileTab('form')}>
          <i className="fas fa-user-edit"></i> Voucher
        </button>
        <button type="button" className={`sfg-tab ${mobileTab === 'heads' ? 'is-active' : ''}`} onClick={() => setMobileTab('heads')}>
          <i className="fas fa-list"></i> Fee Heads
          {selectedItems.length > 0 && <span className="sfg-badge">{selectedItems.length}</span>}
        </button>
      </div>

      <div className="sfg-body">
        {/* FORM PANE */}
        <div className="sfg-pane sfg-pane--form">
          {/* Toggles card */}
          <div className="sfg-card">
            <h3 className="sfg-card__title"><i className="fas fa-sliders-h"></i> Options</h3>
            <div className="sfg-row">
              <label className="sfg-label">Include Arrears</label>
              <div className="sfg-radios">
                <button type="button" className={`sfg-radio ${editFormData.arrear_set ? 'is-active' : ''}`} onClick={() => setEditFormData((p) => ({ ...p, arrear_set: true }))}>
                  <i className="fas fa-check"></i> Yes
                </button>
                <button type="button" className={`sfg-radio ${!editFormData.arrear_set ? 'is-active' : ''}`} onClick={() => setEditFormData((p) => ({ ...p, arrear_set: false }))}>
                  <i className="fas fa-times"></i> No
                </button>
              </div>
            </div>
            <div className="sfg-row">
              <label className="sfg-label">Include Bus Fee</label>
              <div className="sfg-radios">
                <button type="button" className={`sfg-radio ${editFormData.bus_fee_status ? 'is-active' : ''}`} onClick={() => setEditFormData((p) => ({ ...p, bus_fee_status: true }))}>
                  <i className="fas fa-bus"></i> Yes
                </button>
                <button type="button" className={`sfg-radio ${!editFormData.bus_fee_status ? 'is-active' : ''}`} onClick={() => setEditFormData((p) => ({ ...p, bus_fee_status: false }))}>
                  <i className="fas fa-ban"></i> No
                </button>
              </div>
            </div>
          </div>

          {/* Student picker card */}
          <div className="sfg-card">
            <h3 className="sfg-card__title"><i className="fas fa-user-graduate"></i> Pick Student</h3>
            <div className="sfg-row">
              <label className="sfg-label">Class</label>
              <Select
                options={classOptions}
                value={editFormData.class_id && editFormData.section_id
                  ? { value: `${editFormData.class_id},${editFormData.section_id}`, label: findClassLabel() }
                  : null}
                onChange={handleClassChange}
                placeholder="Select Class"
                isClearable
                styles={{ control: (b) => ({ ...b, minHeight: 42, borderRadius: 8 }) }}
              />
            </div>
            <div className="sfg-row">
              <label className="sfg-label">Shift</label>
              <div className="sfg-radios">
                {['Morning', 'Evening'].map((sh) => (
                  <button
                    key={sh}
                    type="button"
                    className={`sfg-radio ${editFormData.shift === sh ? 'is-active' : ''}`}
                    onClick={() => { setEditFormData((p) => ({ ...p, shift: sh })); setValidity((v) => ({ ...v, shift: true })); }}
                  >
                    <i className={`fas ${sh === 'Morning' ? 'fa-sun' : 'fa-moon'}`}></i> {sh}
                  </button>
                ))}
              </div>
            </div>
            <div className="sfg-row">
              <label className="sfg-label">Student</label>
              <Select
                options={studentOptions}
                value={editFormData.student_id
                  ? studentOptions.find((o) => o.value === editFormData.student_id) || null
                  : null}
                onChange={handleStudentChange}
                placeholder="Search and select a student…"
                isClearable
                styles={{ control: (b) => ({ ...b, minHeight: 42, borderRadius: 8 }) }}
              />
            </div>
          </div>

          {/* Voucher details */}
          <div className="sfg-card">
            <h3 className="sfg-card__title"><i className="fas fa-calendar-alt"></i> Voucher Details</h3>

            {/* Consolidated toggle */}
            <div className="sfg-row">
              <label className="sfg-label">Consolidated (Multi-Month) Voucher</label>
              <div className="sfg-radios">
                <button
                  type="button"
                  className={`sfg-radio ${!editFormData.consolidated ? 'is-active' : ''}`}
                  onClick={() => setEditFormData((p) => ({ ...p, consolidated: false, to_month: p.from_month }))}
                >
                  <i className="fas fa-file-invoice"></i> Single Month
                </button>
                <button
                  type="button"
                  className={`sfg-radio ${editFormData.consolidated ? 'is-active' : ''}`}
                  onClick={() => setEditFormData((p) => ({ ...p, consolidated: true }))}
                >
                  <i className="fas fa-layer-group"></i> Multi-Month
                </button>
              </div>
            </div>

            <div className="sfg-row">
              <label className="sfg-label">{editFormData.consolidated ? 'From Month *' : 'Month *'}</label>
              <input
                type="month"
                className={`sfg-input ${validity.from_month ? '' : 'is-invalid'}`}
                value={editFormData.from_month}
                onChange={(e) => {
                  setEditFormData((p) => ({
                    ...p,
                    from_month: e.target.value,
                    // Keep to_month synced when not consolidated
                    to_month: p.consolidated ? p.to_month : e.target.value,
                  }));
                  setValidity((v) => ({ ...v, from_month: true }));
                }}
              />
            </div>

            {editFormData.consolidated && (
              <div className="sfg-row">
                <label className="sfg-label">To Month *</label>
                <input
                  type="month"
                  className="sfg-input"
                  value={editFormData.to_month}
                  min={editFormData.from_month}
                  onChange={(e) => setEditFormData((p) => ({ ...p, to_month: e.target.value }))}
                />
                <div style={{ marginTop: 6, fontSize: 12, color: monthCount > 1 ? '#155724' : '#6c757d', fontWeight: 600 }}>
                  <i className="fas fa-info-circle"></i>
                  &nbsp;Voucher will cover <strong>{monthCount}</strong> month{monthCount === 1 ? '' : 's'} — all head amounts × {monthCount}
                </div>
              </div>
            )}
            <div className="sfg-row">
              <label className="sfg-label">Due Date *</label>
              <input
                type="date"
                className={`sfg-input ${validity.due_date ? '' : 'is-invalid'}`}
                value={editFormData.due_date}
                onChange={(e) => { setEditFormData((p) => ({ ...p, due_date: e.target.value })); setValidity((v) => ({ ...v, due_date: true })); }}
              />
            </div>
            <div className="sfg-row">
              <label className="sfg-label">Fine</label>
              <input
                type="number"
                className="sfg-input"
                value={editFormData.fine}
                onChange={(e) => setEditFormData((p) => ({ ...p, fine: e.target.value }))}
              />
            </div>
            <div className="sfg-row">
              <label className="sfg-label">Remarks *</label>
              <input
                type="text"
                className={`sfg-input ${validity.remarks ? '' : 'is-invalid'}`}
                value={editFormData.remarks}
                onChange={(e) => { setEditFormData((p) => ({ ...p, remarks: e.target.value })); setValidity((v) => ({ ...v, remarks: true })); }}
                placeholder="e.g. Tuition fee for Apr 2025"
              />
            </div>
            <div className="sfg-row">
              <label className="sfg-label">Bus Fee</label>
              <input type="number" className="sfg-input" value={editFormData.bus_fee} readOnly />
            </div>
          </div>

          {/* Advance card — robust add/use/set logic */}
          <div className="sfg-card" style={{ padding: 0, background: 'transparent', border: 'none', boxShadow: 'none' }}>
            <div className="sfg-adv">
              <h3 className="sfg-card__title" style={{ margin: '0 0 10px 0' }}>
                <i className="fas fa-piggy-bank"></i> Advance Payment
              </h3>

              <div className="sfg-adv__balance">
                <div>
                  <div className="sfg-adv__balance-lbl">Current Balance</div>
                  <div className="sfg-adv__balance-val">{formatRs(checkAdvance)}</div>
                </div>
                {checkAdvanceStatus && (
                  <span className="sfg-adv__balance-tag">{checkAdvanceStatus}</span>
                )}
              </div>

              <label className="sfg-label">What do you want to do?</label>
              <div className="sfg-adv__modes">
                <button
                  type="button"
                  className={`sfg-adv__mode is-add ${advMode === 'add' ? 'is-active' : ''}`}
                  onClick={() => setAdvMode('add')}
                >
                  <i className="fas fa-plus"></i> Add More
                </button>
                <button
                  type="button"
                  className={`sfg-adv__mode is-use ${advMode === 'use' ? 'is-active' : ''}`}
                  onClick={() => setAdvMode('use')}
                  disabled={Number(checkAdvance) <= 0}
                  style={Number(checkAdvance) <= 0 ? { opacity: 0.5, cursor: 'not-allowed' } : {}}
                >
                  <i className="fas fa-minus"></i> Use / Reduce
                </button>
                <button
                  type="button"
                  className={`sfg-adv__mode is-set ${advMode === 'set' ? 'is-active' : ''}`}
                  onClick={() => setAdvMode('set')}
                >
                  <i className="fas fa-equals"></i> Set
                </button>
              </div>

              <label className="sfg-label" style={{ marginTop: 4 }}>
                {advMode === 'add' ? 'Amount to add' : advMode === 'use' ? 'Amount to use from balance' : 'New total advance'}
              </label>
              <input
                type="number"
                className="sfg-input"
                value={advAmount}
                min={0}
                onChange={(e) => setAdvAmount(e.target.value)}
                placeholder="0"
              />
              <div className="sfg-adv__chips">
                {[100, 500, 1000, 2000, 5000].map((q) => (
                  <button
                    key={q}
                    type="button"
                    className="sfg-adv__chip"
                    onClick={() => setAdvAmount((prev) => (Number(prev) || 0) + q)}
                  >
                    + {q}
                  </button>
                ))}
                <button
                  type="button"
                  className="sfg-adv__chip"
                  style={{ color: '#842029', borderColor: '#f5c2c7', background: '#fff5f5' }}
                  onClick={() => setAdvAmount(0)}
                >
                  <i className="fas fa-times"></i> Clear
                </button>
              </div>

              <div className="sfg-adv__preview">
                <div>
                  <div style={{ fontSize: 10, color: '#6c757d', textTransform: 'uppercase', letterSpacing: '0.4px', fontWeight: 700, marginBottom: 2 }}>
                    This voucher (first_advance_payment)
                  </div>
                  <span
                    className={`sfg-adv__diff ${firstAdvanceDelta > 0 ? 'is-up' : firstAdvanceDelta < 0 ? 'is-down' : ''}`}
                    style={firstAdvanceDelta === 0 ? { background: '#f1f3f6', color: '#6c757d' } : {}}
                  >
                    {firstAdvanceDelta > 0 ? `+ ${formatRs(firstAdvanceDelta)}` : firstAdvanceDelta < 0 ? `− ${formatRs(Math.abs(firstAdvanceDelta))}` : 'No change'}
                  </span>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: 10, color: '#6c757d', textTransform: 'uppercase', letterSpacing: '0.4px', fontWeight: 700, marginBottom: 2 }}>
                    New balance (advance_payments)
                  </div>
                  <span className="sfg-adv__preview-val">{formatRs(finalAdvance)}</span>
                </div>
              </div>

              {advMode === 'use' && Number(advAmount) > Number(checkAdvance) && (
                <div style={{ marginTop: 8, padding: 8, background: '#fde2e2', color: '#842029', borderRadius: 6, fontSize: 11, fontWeight: 600 }}>
                  <i className="fas fa-exclamation-triangle"></i> Amount exceeds balance — will be capped at {formatRs(checkAdvance)}.
                </div>
              )}
            </div>
          </div>
        </div>

        {/* HEADS PANE */}
        <div className="sfg-pane sfg-pane--heads">
          <div className="sfg-heads-head">
            <h3><i className="fas fa-list" style={{ color: '#EBD197' }}></i> Fee Heads</h3>
            <input
              type="text"
              className="sfg-search"
              placeholder="🔍 Search heads…"
              value={headSearch}
              onChange={(e) => setHeadSearch(e.target.value)}
            />
          </div>

          {data.length === 0 ? (
            <div className="sfg-empty">
              <i className="fas fa-info-circle"></i>
              Pick a class, shift and student to load fee heads.
            </div>
          ) : (
            <>
              <table className="sfg-table">
                <thead>
                  <tr>
                    <th style={{ width: 50, textAlign: 'center' }}>✓</th>
                    <th>Head</th>
                    <th>Category</th>
                    <th style={{ textAlign: 'right' }}>Amount (Rs)</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredHeads.map((hd) => {
                    const sel = selectedItems.find((it) => it.id === hd.id);
                    const isChecked = !!sel;
                    return (
                      <tr key={hd.id} className={isChecked ? 'is-checked' : ''}>
                        <td style={{ textAlign: 'center' }}>
                          <span
                            className={`sfg-check ${isChecked ? 'is-checked' : ''}`}
                            onClick={() => handleCheckboxChange(hd.id, hd.amount, hd.category_id, hd.category)}
                            role="checkbox"
                            aria-checked={isChecked}
                            tabIndex={0}
                          >
                            <i className="fas fa-check"></i>
                          </span>
                        </td>
                        <td style={{ fontWeight: 600 }}>{hd.head_name}</td>
                        <td style={{ color: '#6c757d', fontSize: 12 }}>{hd.category}</td>
                        <td style={{ textAlign: 'right' }}>
                          {isChecked ? (
                            <input
                              type="number"
                              className="sfg-amt-input"
                              value={sel.amount}
                              onChange={(e) => handleAmountChange(e, hd.id)}
                            />
                          ) : (
                            <span style={{ color: '#6c757d' }}>{hd.amount}</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>

              <div className="sfg-summary">
                {editFormData.consolidated && monthCount > 1 && (
                  <div className="sfg-summary__row" style={{ background: '#fff8e6', padding: '6px 10px', borderRadius: 6, marginBottom: 6, color: '#5b4a1a', fontWeight: 700 }}>
                    <span><i className="fas fa-layer-group"></i> Consolidated Voucher</span>
                    <span>× {monthCount} months</span>
                  </div>
                )}
                <div className="sfg-summary__row">
                  <span>Heads Total {monthCount > 1 ? `(× ${monthCount})` : ''}</span>
                  <strong style={advCalc.zeroFeeHeads ? { textDecoration: 'line-through', color: '#9aa3af' } : {}}>
                    {formatRs(grandAmount * monthCount)}
                  </strong>
                </div>
                {Number(editFormData.bus_fee) > 0 && (
                  <div className="sfg-summary__row">
                    <span>Bus Fee {monthCount > 1 ? `(× ${monthCount})` : ''}</span>
                    <strong style={advCalc.zeroFeeHeads ? { textDecoration: 'line-through', color: '#9aa3af' } : {}}>
                      {formatRs((parseInt(editFormData.bus_fee) || 0) * monthCount)}
                    </strong>
                  </div>
                )}
                {Number(editFormData.fine) > 0 && (
                  <div className="sfg-summary__row">
                    <span>Fine</span>
                    <strong style={advCalc.zeroFeeHeads ? { textDecoration: 'line-through', color: '#9aa3af' } : {}}>
                      {formatRs(editFormData.fine)}
                    </strong>
                  </div>
                )}
                {(advCalc.effectiveMode === 'use-covered' || advCalc.effectiveMode === 'add-covered') && (
                  <div className="sfg-summary__row" style={{ color: '#5b4a1a' }}>
                    <span>Voucher heads deducted from running advance</span>
                    <strong>− {formatRs(headsSubtotal)}</strong>
                  </div>
                )}
                {(advCalc.effectiveMode === 'add-covered' || advCalc.effectiveMode === 'add-cash') && advCalc.firstAdvanceDelta > 0 && (
                  <div className="sfg-summary__row">
                    <span>Advance Deposit (new) — to deposit at bank</span>
                    <strong style={{ color: '#155724' }}>+ {formatRs(advCalc.firstAdvanceDelta)}</strong>
                  </div>
                )}
                {Number(finalAdvance) !== Number(checkAdvance) && (
                  <div className="sfg-summary__row" style={{ fontSize: 11, color: '#6c757d' }}>
                    <span>↳ New running balance</span>
                    <span>{formatRs(finalAdvance)}</span>
                  </div>
                )}
                <div className="sfg-summary__row is-total">
                  <span>{advCalc.paidFromAdvance ? 'Pay at counter' : 'Voucher amount payable'}</span>
                  <span>{formatRs(total)}</span>
                </div>
                {advCalc.effectiveMode === 'use-covered' && (
                  <div style={{ marginTop: 8, padding: 8, background: '#d4edda', color: '#155724', borderRadius: 6, fontSize: 11, fontWeight: 600, textAlign: 'center' }}>
                    <i className="fas fa-check-circle"></i> Voucher PAID from advance — fee heads stored as 0
                  </div>
                )}
                {advCalc.effectiveMode === 'add-covered' && (
                  <div style={{ marginTop: 8, padding: 8, background: '#fff3cd', color: '#856404', borderRadius: 6, fontSize: 11, fontWeight: 600, textAlign: 'center' }}>
                    <i className="fas fa-university"></i> Voucher UNPAID — parent deposits the new advance amount at the bank
                  </div>
                )}
                {advCalc.effectiveMode === 'use-insufficient' && (
                  <div style={{ marginTop: 8, padding: 8, background: '#fde2e2', color: '#842029', borderRadius: 6, fontSize: 11, fontWeight: 600, textAlign: 'center' }}>
                    <i className="fas fa-exclamation-triangle"></i> Running balance ({formatRs(advCalc.existing)}) is less than voucher ({formatRs(headsSubtotal)}). Advance can't cover it — voucher will be a normal one.
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Sticky save bar */}
      <div className="sfg-savebar">
        <div className="sfg-savebar__info">
          <strong>{selectedItems.length}</strong> heads · <strong>{formatRs(total)}</strong>
        </div>
        <button
          type="button"
          className="sfg-save-btn"
          onClick={handleSubmit}
          disabled={selectedItems.length === 0}
        >
          <i className="fas fa-save"></i> Generate Voucher
        </button>
      </div>
    </div>
  );
}

export default SingleFeeGenerate;
