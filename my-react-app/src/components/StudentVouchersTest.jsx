import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useReactToPrint } from "react-to-print";
import SingleVoucher from "./SingleVoucher";

// PUBLIC component — no login required.
// Enter a student_unique_id, fetch all that student's fee vouchers (matched by
// fee_vouchers.student_unique_id, campus fixed server-side) and render them with
// the exact same table + voucher view as the admin FeeVouchers.jsx component.
// Backed by GET /public/student-vouchers/:student_unique_id.
function StudentVouchersTest() {
  // Lookup
  const [uniqueId, setUniqueId] = useState("");
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  // Data & UI States (mirrors FeeVouchers.jsx)
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  // Vouchers Checked and View States
  const [checkedVouchers, setCheckedVouchers] = useState([]);
  const [allChecked, setAllChecked] = useState(true);
  const [voucherData, setVoucherData] = useState([]);
  const [updatedVouchersWithHeads, setUpdatedVouchersWithHead] = useState([]);
  const [viewVoucherId, setViewVoucherId] = useState([]);
  const [showData, setShowData] = useState(false);

  // Heads, Bank Details & Bank Notes States for voucher view
  const [getHeads, setHeads] = useState([]);
  const [getBankDetails, setBankDetails] = useState([]);
  const [getBankNotes, setBankNotes] = useState([]);

  const componentRef = useRef();

  function convertDates(date) {
    const d = new Date(date);
    const day = d.getDate().toString().padStart(2, "0");
    const month = (d.getMonth() + 1).toString().padStart(2, "0");
    const year = d.getFullYear();
    return `${day}-${month}-${year}`;
  }

  // Fetch vouchers by student_unique_id
  const fetchData = (e) => {
    e?.preventDefault?.();
    if (!uniqueId) {
      toast.error("Please enter a student unique id");
      return;
    }

    setLoading(true);
    setSearched(true);
    setShowData(false);
    setViewVoucherId([]);
    axios
      .get(
        `${process.env.REACT_APP_API_BASE_URL}/public/student-vouchers/${uniqueId}`
      )
      .then((res) => {
        const results = res.data.results || [];
        setData(results);
        setFilteredData(results);
        setSearchQuery("");
        if (results.length === 0) {
          toast.info("No vouchers found for this student");
        }
      })
      .catch((err) => {
        console.error("Error fetching student vouchers:", err);
        toast.error("Failed to fetch vouchers");
        setData([]);
        setFilteredData([]);
      })
      .finally(() => setLoading(false));
  };

  // When data loads, check all voucher IDs by default
  useEffect(() => {
    setCheckedVouchers(data.map((voucher) => voucher.id));
  }, [data]);

  // Toggle individual voucher checkbox
  const handleCheckboxChange = (id) => {
    setCheckedVouchers((prevState) =>
      prevState.includes(id)
        ? prevState.filter((voucherId) => voucherId !== id)
        : [...prevState, id]
    );
  };

  // Toggle all checkboxes
  const handleToggleAll = () => {
    if (allChecked) {
      setCheckedVouchers([]);
    } else {
      setCheckedVouchers(data.map((voucher) => voucher.id));
    }
    setAllChecked(!allChecked);
  };

  // No pagination — show every voucher in one scrollable table.
  const displayData = filteredData;

  // View a single voucher
  const viewData = (id_get) => {
    setViewVoucherId([id_get]);
    setShowData(true);
  };

  // View all checked vouchers
  const handleSubmit = () => {
    setViewVoucherId(checkedVouchers);
    setShowData(true);
  };

  // Handle search query input (client-side, over loaded vouchers).
  // Matches by invoice number (and any other field). Matching vouchers are
  // floated to the TOP of the table while non-matching rows stay below, so a
  // single search instantly surfaces the voucher you're looking for.
  const rowMatches = (item, query) =>
    Object.keys(item).some((key) => {
      const value = item[key];
      return (
        value !== null &&
        value !== undefined &&
        value.toString().toLowerCase().includes(query)
      );
    });

  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);

    if (query.trim() === "") {
      setFilteredData(data);
      return;
    }

    const matched = data.filter((item) => rowMatches(item, query));
    const rest = data.filter((item) => !rowMatches(item, query));
    setFilteredData([...matched, ...rest]);
  };

  // Fetch fee vouchers for viewing when viewVoucherId changes.
  // A student's vouchers can span multiple sessions, so group the requested
  // invoice ids by session_id and fetch each group (campus_id comes from the
  // voucher row — it's a column on fee_vouchers).
  useEffect(() => {
    const fetchFeeVouchers = async () => {
      try {
        const selected = data.filter((v) => viewVoucherId.includes(v.id));
        if (selected.length === 0) return;

        // group by `${campus_id}|${session_id}`
        const groups = {};
        selected.forEach((v) => {
          const key = `${v.campus_id}|${v.session_id}`;
          if (!groups[key]) groups[key] = [];
          groups[key].push(v.id);
        });

        const responses = await Promise.all(
          Object.entries(groups).map(([key, invoices]) => {
            const [campus_id, session_id] = key.split("|");
            return axios.post(
              `${process.env.REACT_APP_API_BASE_URL}/view-fee-vouchers`,
              {
                invoices,
                campus_id: parseInt(campus_id),
                session_id: parseInt(session_id),
              }
            );
          })
        );

        let vouchers = [];
        let heads = [];
        let bank_details = [];
        let arrears = [];
        let bank_notes = [];
        responses.forEach((response) => {
          vouchers = vouchers.concat(response.data.vouchers || []);
          heads = heads.concat(response.data.heads || []);
          bank_details = bank_details.concat(response.data.bankDetails || []);
          arrears = arrears.concat(response.data.arrears || []);
          bank_notes = bank_notes.concat(response.data.bankNotes || []);
        });

        setHeads(heads);
        setBankDetails(bank_details);
        setBankNotes(bank_notes);

        const vouchersWithArrears = vouchers.map((voucher) => {
          const arrear = arrears.find((a) => a.id === voucher.id);
          return {
            ...voucher,
            arrears_not_cleared: arrear ? arrear.arrears_not_cleared : "",
          };
        });

        setVoucherData(vouchersWithArrears);
      } catch (error) {
        console.error("Error fetching fee vouchers:", error);
      }
    };

    if (viewVoucherId && viewVoucherId.length > 0) {
      fetchFeeVouchers();
    }
  }, [viewVoucherId, data]);

  // Add head names to voucher fee_head details when heads are available
  useEffect(() => {
    if (getHeads && voucherData && voucherData.length > 0) {
      function addHeadNameToFeeHead(heads, voucher_data) {
        voucher_data.forEach((item) => {
          item.fee_head = JSON.parse(item.fee_head);
          item.fee_head.forEach((head) => {
            const match = heads.find((headItem) => headItem.id === head.id);
            if (match) {
              head.head_name = match.head_name;
            }
          });
          item.fee_head = JSON.stringify(item.fee_head);
        });
        return voucher_data;
      }

      const updatedData = addHeadNameToFeeHead(getHeads, voucherData);
      setUpdatedVouchersWithHead(updatedData);
    }
  }, [getHeads, voucherData]);

  // For printing voucher view
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

  // Derived student profile + summary stats for the header banner
  const student = data.length > 0 ? data[0] : null;
  const paidCount = data.filter((v) => v.status === "paid").length;
  const unpaidCount = data.length - paidCount;
  const totalDue = data
    .filter((v) => v.status !== "paid")
    .reduce(
      (sum, v) =>
        sum +
        (v.after_due_date_amount || 0) +
        (v.arrears || 0) +
        (v.first_advance_payment || 0),
      0
    );
  const fmt = (n) => new Intl.NumberFormat("en-US").format(n || 0);

  return (
    <>
      <div className="d-flex">
        <div className="col-md-12 p-2">
          {/* ── Professional search hero ── */}
          <div
            style={{
              background:
                "linear-gradient(135deg, #111418 0%, #1a1f25 60%, #232a32 100%)",
              borderRadius: "14px",
              borderBottom: "3px solid #EBD197",
              padding: "28px 24px",
              marginBottom: "16px",
              boxShadow: "0 8px 24px rgba(0,0,0,0.18)",
            }}
          >
            <div className="text-center mb-3">
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: 56,
                  height: 56,
                  borderRadius: "50%",
                  background: "rgba(235,209,151,0.12)",
                  border: "1px solid rgba(235,209,151,0.35)",
                  marginBottom: 10,
                }}
              >
                <i
                  className="fas fa-file-invoice-dollar"
                  style={{ color: "#EBD197", fontSize: 22 }}
                ></i>
              </div>
              <h4
                style={{
                  color: "#EBD197",
                  fontWeight: 700,
                  margin: 0,
                  letterSpacing: "0.5px",
                }}
              >
                Student Fee Vouchers
              </h4>
              <p
                style={{
                  color: "rgba(255,255,255,0.65)",
                  margin: "6px 0 0",
                  fontSize: 13,
                }}
              >
                Enter your Student Unique ID to view and print all fee vouchers
              </p>
            </div>

            <form
              onSubmit={fetchData}
              style={{ maxWidth: 560, margin: "0 auto" }}
            >
              <div
                className="d-flex"
                style={{
                  background: "#fff",
                  borderRadius: "10px",
                  overflow: "hidden",
                  boxShadow: "0 2px 10px rgba(0,0,0,0.25)",
                }}
              >
                <span
                  style={{
                    display: "flex",
                    alignItems: "center",
                    padding: "0 16px",
                    color: "#8a93a2",
                  }}
                >
                  <i className="fas fa-id-card"></i>
                </span>
                <input
                  type="number"
                  placeholder="Enter Student Unique ID"
                  value={uniqueId}
                  onChange={(e) => setUniqueId(e.target.value)}
                  style={{
                    flex: 1,
                    border: "none",
                    outline: "none",
                    fontSize: 16,
                    padding: "14px 6px",
                  }}
                />
                <button
                  type="submit"
                  disabled={loading}
                  style={{
                    border: "none",
                    background:
                      "linear-gradient(135deg, #EBD197 0%, #d8b974 100%)",
                    color: "#111418",
                    fontWeight: 700,
                    padding: "0 26px",
                    cursor: loading ? "not-allowed" : "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                  }}
                >
                  {loading ? (
                    <>
                      <i className="fas fa-spinner fa-spin"></i> Searching…
                    </>
                  ) : (
                    <>
                      <i className="fas fa-search"></i> Search
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>

          {searched && !loading && filteredData.length === 0 && (
            <div
              className="text-center p-5 mb-3"
              style={{
                border: "1px dashed #cdd3db",
                borderRadius: "12px",
                color: "#6c757d",
                background: "#f8f9fa",
              }}
            >
              <i
                className="fas fa-folder-open"
                style={{ fontSize: 34, opacity: 0.5 }}
              ></i>
              <h6 className="mt-3 mb-1">No vouchers found</h6>
              <div style={{ fontSize: 13 }}>
                We couldn't find any fee vouchers for this Student Unique ID.
                Please double-check the ID and try again.
              </div>
            </div>
          )}

          {/* ── Student summary banner ── */}
          {student && (
            <div
              className="mb-3"
              style={{
                background: "#fff",
                border: "1px solid #e9edf2",
                borderLeft: "4px solid #EBD197",
                borderRadius: "12px",
                padding: "16px 20px",
                boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
              }}
            >
              <div className="d-flex flex-wrap justify-content-between align-items-center">
                <div className="d-flex align-items-center" style={{ gap: 14 }}>
                  <div
                    style={{
                      width: 48,
                      height: 48,
                      borderRadius: "50%",
                      background: "#111418",
                      color: "#EBD197",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 20,
                    }}
                  >
                    <i className="fas fa-user-graduate"></i>
                  </div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 16 }}>
                      {student.full_name}
                    </div>
                    <div style={{ fontSize: 13, color: "#6c757d" }}>
                      {(student.register_no || student.old_register_no) && (
                        <span className="mr-2">
                          <i className="fas fa-hashtag"></i>{" "}
                          {student.register_no || student.old_register_no}
                        </span>
                      )}
                      {student.class && (
                        <span>
                          &nbsp;·&nbsp;{student.class}
                          {student.section_name
                            ? ` (${student.section_name})`
                            : ""}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="d-flex flex-wrap" style={{ gap: 10 }}>
                  <div
                    style={{
                      textAlign: "center",
                      padding: "6px 14px",
                      borderRadius: 8,
                      background: "#f1f3f7",
                      minWidth: 80,
                    }}
                  >
                    <div style={{ fontWeight: 700, fontSize: 18 }}>
                      {data.length}
                    </div>
                    <div style={{ fontSize: 11, color: "#6c757d" }}>
                      Vouchers
                    </div>
                  </div>
                  <div
                    style={{
                      textAlign: "center",
                      padding: "6px 14px",
                      borderRadius: 8,
                      background: "rgba(25,135,84,0.1)",
                      color: "#198754",
                      minWidth: 80,
                    }}
                  >
                    <div style={{ fontWeight: 700, fontSize: 18 }}>
                      {paidCount}
                    </div>
                    <div style={{ fontSize: 11 }}>Paid</div>
                  </div>
                  <div
                    style={{
                      textAlign: "center",
                      padding: "6px 14px",
                      borderRadius: 8,
                      background: "rgba(220,53,69,0.1)",
                      color: "#dc3545",
                      minWidth: 80,
                    }}
                  >
                    <div style={{ fontWeight: 700, fontSize: 18 }}>
                      {unpaidCount}
                    </div>
                    <div style={{ fontSize: 11 }}>Unpaid</div>
                  </div>
                  <div
                    style={{
                      textAlign: "center",
                      padding: "6px 14px",
                      borderRadius: 8,
                      background: "#111418",
                      color: "#EBD197",
                      minWidth: 110,
                    }}
                  >
                    <div style={{ fontWeight: 700, fontSize: 18 }}>
                      Rs {fmt(totalDue)}
                    </div>
                    <div style={{ fontSize: 11 }}>Outstanding</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {data.length > 0 && (
            <div
              style={{
                // background: "#fff",
                // border: "1px solid #e9edf2",
                // borderRadius: 12,
                // boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
                overflow: "hidden",
              }}
            >
              <style>{`
                .sv-table { margin: 0; }
                .sv-table thead th {
                  background: #EBD197;
                  color: #111418;
                  font-weight: 600;
                  font-size: 12px;
                  letter-spacing: 0.4px;
                  text-transform: uppercase;
                  border: none;
                  padding: 12px 14px;
                  white-space: nowrap;
                }
                .sv-table tbody td {
                  padding: 12px 14px;
                  vertical-align: middle;
                  border-top: 1px solid #f0f2f5;
                }
                .sv-table tbody tr:hover { background: #f7f9fc; }
                .sv-badge {
                  display: inline-block;
                  padding: 3px 12px;
                  border-radius: 999px;
                  font-size: 11px;
                  font-weight: 700;
                  letter-spacing: 0.3px;
                }
              `}</style>

              {/* Toolbar */}
              <div
                className="d-flex flex-wrap justify-content-between align-items-center"
                style={{
                  gap: 10,
                  padding: "12px 16px",
                  borderBottom: "1px solid #eef1f5",
                }}
              >
                <div className="d-flex align-items-center" style={{ gap: 8 }}>
                  <button
                    onClick={handleToggleAll}
                    className="btn btn-sm btn-outline-secondary"
                  >
                    {allChecked ? (
                      <i className="fas fa-check-square"></i>
                    ) : (
                      <i className="far fa-square"></i>
                    )}
                    &nbsp;Select all
                  </button>
                  <button
                    onClick={handleSubmit}
                    className="btn btn-sm"
                    disabled={checkedVouchers.length === 0}
                    style={{
                      background: "#111418",
                      color: "#EBD197",
                      fontWeight: 600,
                    }}
                  >
                    <i className="fa fa-eye" aria-hidden="true"></i> View / Print
                    ({checkedVouchers.length})
                  </button>
                </div>

                <div style={{ position: "relative" }}>
                  <span
                    style={{
                      position: "absolute",
                      left: 12,
                      top: "50%",
                      transform: "translateY(-50%)",
                      color: "#8a93a2",
                    }}
                  >
                    <i className="fas fa-search"></i>
                  </span>
                  <input
                    type="text"
                    className="form-control"
                    style={{ paddingLeft: 34, minWidth: 260 }}
                    placeholder="Search by Invoice#, Name, Month…"
                    onChange={handleSearch}
                    value={searchQuery}
                  />
                </div>
              </div>

              {/* Table */}
              <div className="table-responsive" style={{ boxShadow :"none" }}>
                <table className="table sv-table">
                  <thead>
                    <tr>
                      <th style={{ width: 44 }}></th>
                      <th>Invoice#</th>
                      <th>Month</th>
                      <th>Class</th>
                      <th className="text-end">Payable (Rs)</th>
                      <th>Due Date</th>
                      <th className="text-center">Status</th>
                      <th className="text-center">Voucher</th>
                    </tr>
                  </thead>

                  <tbody>
                    {displayData.map((voucher, index) => {
                      const matched =
                        searchQuery.trim() !== "" &&
                        rowMatches(voucher, searchQuery);
                      const paid = voucher.status === "paid";
                      const payable =
                        voucher.total_amount_data +
                        voucher.arrears +
                        voucher.first_advance_payment;
                      return (
                        <tr
                          key={index}
                          style={
                            matched ? { backgroundColor: "#fff8e6" } : undefined
                          }
                        >
                          <td className="text-center">
                            <input
                              type="checkbox"
                              checked={checkedVouchers.includes(voucher.id)}
                              onChange={() => handleCheckboxChange(voucher.id)}
                              value={voucher.id}
                            />
                          </td>
                          <td style={{ fontWeight: 600 }}>
                            {voucher.invoice_no}
                          </td>
                          <td className="no-wrap">{voucher.for_the_month}</td>
                          <td className="no-wrap">
                            {voucher.class}
                            {voucher.section_name
                              ? ` (${voucher.section_name})`
                              : ""}
                          </td>
                          <td className="text-end" style={{ fontWeight: 600 }}>
                            {fmt(payable)}
                          </td>
                          <td className="no-wrap">
                            {convertDates(voucher.due_date)}
                          </td>
                          <td className="text-center">
                            <span
                              className="sv-badge"
                              style={{
                                background: paid
                                  ? "rgba(25,135,84,0.12)"
                                  : "rgba(220,53,69,0.12)",
                                color: paid ? "#198754" : "#dc3545",
                              }}
                            >
                              {(voucher.status || "").toUpperCase()}
                            </span>
                          </td>
                          <td className="text-center">
                            <button
                              className="btn btn-sm btn-outline-dark"
                              onClick={() => viewData(voucher.id)}
                              title="View voucher"
                            >
                              <i className="fas fa-eye"></i>
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              <div
                className="d-flex justify-content-end"
                style={{
                  fontSize: 12,
                  color: "#6c757d",
                  padding: "2px 0px",
                  // borderTop: "1px solid #eef1f5",
                }}
              >
                Showing all {displayData.length} voucher
                {displayData.length === 1 ? "" : "s"}
              </div>
            </div>
          )}
        </div>
      </div>

      {showData && (
        <>
          <div
            style={{
              position: "fixed",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              zIndex: "9999",
              backdropFilter: "blur(10px)",
              width: "100%",
              height: "100vh",
              backgroundColor: "white",
              boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
              padding: "10px",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                position: "sticky",
                top: 0,
                zIndex: 101,
                backgroundColor: "#EBD197",
                color: "black",
                padding: "8px 16px",
              }}
            >
              <h5 style={{ margin: 0 }}>View Voucher</h5>
              <button
                onClick={() => setShowData(false)}
                style={{
                  position: "absolute",
                  top: "5px",
                  right: "15px",
                  background: "transparent",
                  border: "none",
                  fontSize: "20px",
                  cursor: "pointer",
                  color: "black",
                }}
              >
                &times;
              </button>
            </div>

            <div
              style={{
                padding: "20px",
                marginTop: "10px",
                width: "100%",
                overflowY: "auto",
                maxHeight: "calc(90vh - 20px)",
                paddingTop: "5px",
              }}
            >
              <button
                onClick={handlePrint}
                className="btn btn-warning btn-sm ml-4 mt-0"
              >
                <i className="fa fa-print" aria-hidden="true"></i> Print
              </button>

              <div className="data" ref={componentRef}>
                {voucherData.map((voucher, index) => (
                  <SingleVoucher
                    key={index}
                    data={voucher}
                    bankDetails={getBankDetails}
                    bankNotes={getBankNotes}
                  />
                ))}
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}

export default StudentVouchersTest;
