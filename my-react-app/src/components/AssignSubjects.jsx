// import React, { useEffect, useState, useContext, useMemo } from 'react';
// import axios from 'axios';
// import { useAuth } from './AuthContext';
// import AcademicSessionContext from './AcademicSessionContext';
// import { toast } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';
// import Select from 'react-select';

// function AssignSubjects() {
//   const { user } = useAuth();
//   const { academicSession } = useContext(AcademicSessionContext);

//   const [getClasses, setClasses] = useState([]);
//   const [getCategories, setCategories] = useState([]);
//   const [classList, setClassList] = useState([]); // classes that already have assignments
//   const [loadingList, setLoadingList] = useState(true);
//   const [assignSubject, setAssignSubject] = useState([]); // currently assigned for selected class
//   const [loadingAssigned, setLoadingAssigned] = useState(false);
//   const [search, setSearch] = useState('');
//   const [chipFilter, setChipFilter] = useState('');
//   const [mobileTab, setMobileTab] = useState('form'); // 'form' | 'list'
//   const [saving, setSaving] = useState(false);

//   const initialState = {
//     subject_id: [],
//     class_id: '',
//     section_id: '',
//     session_id: academicSession,
//     campus_id: user?.user?.campus_id,
//     user_id: user?.user?.user_id,
//     hidden_id: '',
//   };
//   const [editFormData, setEditFormData] = useState(initialState);

//   // Keep session_id in sync
//   useEffect(() => {
//     if (academicSession) {
//       setEditFormData((prev) => ({ ...prev, session_id: parseInt(academicSession) }));
//     }
//   }, [academicSession]);

//   // Fetch subjects (catalog)
//   useEffect(() => {
//     if (!user?.user?.campus_id) return;
//     axios
//       .get(`${process.env.REACT_APP_API_BASE_URL}/get-subjects`, {
//         params: { campus_id: user.user.campus_id },
//       })
//       .then((res) => setCategories(res.data.results || []))
//       .catch((err) => console.log(err));
//   }, [user]);

//   // Fetch classes (catalog)
//   useEffect(() => {
//     if (!user?.user?.campus_id) return;
//     axios
//       .get(`${process.env.REACT_APP_API_BASE_URL}/get-classes/${user.user.campus_id}`)
//       .then((res) => setClasses(res.data.results || []))
//       .catch((err) => console.log(err));
//   }, [user]);

//   // Fetch the list of class+section pairs that already have subjects assigned
//   const fetchClassList = () => {
//     if (!user?.user?.campus_id) return;
//     setLoadingList(true);
//     axios
//       .get(`${process.env.REACT_APP_API_BASE_URL}/assign-subject-classwise-list`, {
//         params: { page: 1, limit: 500, search: '', campus_id: user.user.campus_id },
//       })
//       .then((res) => {
//         setClassList(res.data.results || []);
//         setLoadingList(false);
//       })
//       .catch((err) => {
//         console.log(err);
//         setLoadingList(false);
//       });
//   };
//   useEffect(() => { fetchClassList(); /* eslint-disable-next-line */ }, [user]);

//   // Whenever a class+section is selected, load the currently-assigned subjects
//   // and pre-check them in the chip grid.
//   useEffect(() => {
//     if (!editFormData.class_id || !editFormData.section_id || !academicSession) {
//       setAssignSubject([]);
//       return;
//     }
//     setLoadingAssigned(true);
//     axios
//       .get(`${process.env.REACT_APP_API_BASE_URL}/view-assign-subjects-list`, {
//         params: {
//           session_id: academicSession,
//           campus_id: user.user.campus_id,
//           class_id: editFormData.class_id,
//           section_id: editFormData.section_id,
//         },
//       })
//       .then((res) => {
//         const rows = res.data.results || [];
//         setAssignSubject(rows);

//         // Derive subject IDs: try .subject_id, fall back to matching by name
//         const ids = rows
//           .map((item) => {
//             if (item.subject_id != null) return item.subject_id;
//             const match = getCategories.find(
//               (c) => (c.subjects || '').toLowerCase() === (item.subjects || '').toLowerCase()
//             );
//             return match ? match.id : null;
//           })
//           .filter((v) => v != null);

//         setEditFormData((prev) => ({ ...prev, subject_id: ids, hidden_id: '' }));
//         setLoadingAssigned(false);
//       })
//       .catch((err) => {
//         console.log(err);
//         setLoadingAssigned(false);
//       });
//     // eslint-disable-next-line
//   }, [editFormData.class_id, editFormData.section_id, academicSession, getCategories]);

//   const handleClassChange = (selectedOption) => {
//     if (!selectedOption) {
//       setEditFormData((prev) => ({ ...prev, class_id: '', section_id: '', subject_id: [] }));
//       setAssignSubject([]);
//       return;
//     }
//     const [class_id, section_id] = selectedOption.value.split(',');
//     setEditFormData((prev) => ({ ...prev, class_id, section_id }));
//   };

//   const findClassLabel = () => {
//     if (!editFormData.class_id || !editFormData.section_id) return '';
//     const c = getClasses.find(
//       (x) => x.id === parseInt(editFormData.class_id) && x.section_id === parseInt(editFormData.section_id)
//     );
//     return c ? `${c.class} (${c.section_name})` : '';
//   };

//   // Quick load a class from sidebar
//   const loadClassFromList = (class_id, section_id) => {
//     setEditFormData((prev) => ({
//       ...prev,
//       class_id: String(class_id),
//       section_id: String(section_id),
//     }));
//     setMobileTab('form');
//   };

//   // Toggle subject chip
//   const toggleSubject = (id) => {
//     setEditFormData((prev) => {
//       const has = prev.subject_id.includes(id);
//       return {
//         ...prev,
//         subject_id: has ? prev.subject_id.filter((x) => x !== id) : [...prev.subject_id, id],
//       };
//     });
//   };

//   // Select all (filtered) subjects
//   const selectAllVisible = () => {
//     const visibleIds = filteredSubjects.map((s) => s.id);
//     setEditFormData((prev) => ({
//       ...prev,
//       subject_id: Array.from(new Set([...prev.subject_id, ...visibleIds])),
//     }));
//   };

//   // Clear all subjects
//   const clearAll = () => {
//     setEditFormData((prev) => ({ ...prev, subject_id: [] }));
//   };

//   // Delete one assignment from server (then refresh)
//   const deleteAssignedSubject = (assign_subject_id) => {
//     if (!window.confirm('Remove this subject from the class?')) return;
//     axios
//       .delete(`${process.env.REACT_APP_API_BASE_URL}/delete-subject/${assign_subject_id}`)
//       .then(() => {
//         setAssignSubject((prev) => prev.filter((s) => s.id !== assign_subject_id));
//         toast.success('Subject removed');
//         fetchClassList();
//       })
//       .catch((err) => {
//         console.error('Error deleting subject:', err);
//         toast.error('Could not delete');
//       });
//   };

//   const handleSubmit = async (e) => {
//     e?.preventDefault?.();
//     if (!editFormData.class_id || !editFormData.section_id) {
//       toast.error('Please select a class first');
//       return;
//     }
//     if (!editFormData.subject_id || editFormData.subject_id.length === 0) {
//       toast.error('Please pick at least one subject');
//       return;
//     }

//     // Compute the delta: only send subjects that are NOT already assigned to
//     // this class. Backend errors on duplicates, so we silently skip them.
//     const alreadyAssignedIds = new Set();
//     assignSubject.forEach((row) => {
//       if (row.subject_id != null) alreadyAssignedIds.add(row.subject_id);
//       const match = getCategories.find(
//         (c) => (c.subjects || '').toLowerCase() === (row.subjects || '').toLowerCase()
//       );
//       if (match) alreadyAssignedIds.add(match.id);
//     });
//     const newSubjectIds = editFormData.subject_id.filter(
//       (id) => !alreadyAssignedIds.has(id)
//     );

//     if (newSubjectIds.length === 0) {
//       toast.info('All selected subjects are already assigned to this class.');
//       return;
//     }

//     setSaving(true);
//     try {
//       await axios.post(
//         `${process.env.REACT_APP_API_BASE_URL}/insert-selected-subjects`,
//         { ...editFormData, subject_id: newSubjectIds },
//         { headers: { 'Content-Type': 'application/json' } }
//       );
//       const skipped = editFormData.subject_id.length - newSubjectIds.length;
//       toast.success(
//         skipped > 0
//           ? `Saved ${newSubjectIds.length} new subject(s) (${skipped} already assigned, skipped)`
//           : `Saved ${newSubjectIds.length} subject(s) successfully`
//       );
//       fetchClassList();
//       // Re-trigger the assigned-subjects effect so the gold pills refresh
//       const cid = editFormData.class_id;
//       const sid = editFormData.section_id;
//       setEditFormData((prev) => ({ ...prev, class_id: '', section_id: '' }));
//       setTimeout(() => setEditFormData((prev) => ({ ...prev, class_id: cid, section_id: sid })), 0);
//     } catch (err) {
//       const msg = err?.response?.data?.error || 'An error occurred';
//       toast.error(msg);
//     } finally {
//       setSaving(false);
//     }
//   };

//   // Filtered chip subjects
//   const filteredSubjects = useMemo(() => {
//     const q = chipFilter.trim().toLowerCase();
//     if (!q) return getCategories;
//     return getCategories.filter((s) => (s.subjects || '').toLowerCase().includes(q));
//   }, [getCategories, chipFilter]);

//   // Filtered class list (sidebar)
//   const filteredClassList = useMemo(() => {
//     const q = search.trim().toLowerCase();
//     if (!q) return classList;
//     return classList.filter((c) =>
//       `${c.class || ''} ${c.section_name || ''}`.toLowerCase().includes(q)
//     );
//   }, [classList, search]);

//   const classOptions = getClasses.map((c) => ({
//     value: `${c.id},${c.section_id}`,
//     label: `${c.class} (${c.section_name})`,
//   }));

//   const selectedCount = editFormData.subject_id.length;
//   const totalCount = getCategories.length;

//   return (
//     <div className="as-shell">
//       <style>{`
//         .as-shell {
//           display: flex; flex-direction: column;
//           min-height: 100vh;
//           background: linear-gradient(180deg, #f4f6fa 0%, #eef1f6 100%);
//           font-family: "Segoe UI", system-ui, -apple-system, sans-serif;
//           padding-bottom: 80px;
//         }
//         .as-page-header {
//           background: linear-gradient(135deg, #111418 0%, #1a1f25 100%);
//           color: #EBD197;
//           padding: 16px 18px;
//           border-bottom: 3px solid #EBD197;
//           display: flex; align-items: center; gap: 10px;
//         }
//         .as-page-header h2 { margin: 0; font-size: 17px; font-weight: 700; display: flex; align-items: center; gap: 10px; }

//         .as-tabs {
//           display: flex; background: #fff;
//           border-bottom: 1px solid #e6e8eb;
//           position: sticky; top: 0; z-index: 5;
//         }
//         .as-tab {
//           flex: 1; padding: 14px 12px;
//           background: transparent; border: none;
//           font-size: 14px; font-weight: 600; color: #6c757d;
//           cursor: pointer; display: flex; align-items: center; justify-content: center;
//           gap: 8px; border-bottom: 3px solid transparent;
//           transition: all 0.2s ease; -webkit-tap-highlight-color: transparent;
//         }
//         .as-tab.is-active { color: #111418; border-bottom-color: #EBD197; background: #fffaf0; }
//         .as-tab .as-badge { background: #EBD197; color: #1f2329; font-size: 11px; font-weight: 700; padding: 2px 8px; border-radius: 999px; min-width: 22px; }

//         .as-body { flex: 1; display: flex; flex-direction: row; min-height: 0; }
//         .as-pane { flex: 1; padding: 14px; box-sizing: border-box; overflow-y: auto; }
//         .as-pane--form { background: transparent; }
//         .as-pane--list {
//           background: #fff; border-left: 1px solid #e6e8eb;
//           max-width: 360px; min-width: 300px;
//         }

//         @media (max-width: 991px) {
//           .as-pane--form { display: ${mobileTab === 'form' ? 'block' : 'none'}; }
//           .as-pane--list { display: ${mobileTab === 'list' ? 'block' : 'none'}; max-width: none; min-width: 0; border-left: none; }
//         }
//         @media (min-width: 992px) {
//           .as-tabs { display: none; }
//           .as-pane--form { display: block; }
//           .as-pane--list { display: block; }
//         }

//         /* Form card */
//         .as-card { background: #fff; border-radius: 14px; padding: 16px; border: 1px solid #e8ecf2; box-shadow: 0 2px 8px rgba(17,20,24,0.06); margin-bottom: 14px; }
//         .as-card__title {
//           font-size: 14px; font-weight: 700; color: #1f2329;
//           display: flex; align-items: center; gap: 8px;
//           margin: 0 0 12px 0; padding-bottom: 10px; border-bottom: 2px solid #EBD197;
//         }
//         .as-card__title i { color: #EBD197; }

//         /* Counter bar */
//         .as-counter {
//           display: flex; align-items: center; justify-content: space-between;
//           background: linear-gradient(135deg, #111418, #1a1f25);
//           color: #EBD197; border-radius: 10px; padding: 10px 14px; margin-bottom: 12px;
//           font-size: 13px; font-weight: 600;
//         }
//         .as-counter strong { font-size: 16px; color: #fff; margin: 0 4px; }

//         /* Quick actions */
//         .as-actions {
//           display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: 12px;
//         }
//         .as-action-btn {
//           flex: 1; min-width: 120px;
//           background: #fff; color: #1f2329;
//           border: 1.5px solid #d0d7e2;
//           padding: 9px 14px; border-radius: 8px;
//           font-size: 13px; font-weight: 600;
//           cursor: pointer; display: inline-flex;
//           align-items: center; justify-content: center; gap: 6px;
//           transition: all 0.15s ease;
//         }
//         .as-action-btn:hover { border-color: #EBD197; background: #fffaf0; }
//         .as-action-btn--clear { color: #842029; border-color: #f5c2c7; }
//         .as-action-btn--clear:hover { background: #f8d7da; }

//         /* Chip filter input */
//         .as-filter {
//           width: 100%; padding: 10px 12px; border: 1px solid #d0d7e2; border-radius: 8px;
//           font-size: 14px; margin-bottom: 12px; background: #fff;
//           box-sizing: border-box;
//         }
//         .as-filter:focus { outline: none; border-color: #EBD197; box-shadow: 0 0 0 3px rgba(235,209,151,0.25); }

//         /* Subject chip grid */
//         .as-chips { display: grid; gap: 8px; grid-template-columns: repeat(2, minmax(0, 1fr)); }
//         @media (min-width: 600px) { .as-chips { grid-template-columns: repeat(3, minmax(0, 1fr)); } }
//         @media (min-width: 1200px) { .as-chips { grid-template-columns: repeat(4, minmax(0, 1fr)); } }

//         .as-chip {
//           background: #f7f9fc; color: #1f2329;
//           border: 1.5px solid #e0e3e8; border-radius: 10px;
//           padding: 12px 10px; cursor: pointer;
//           font-size: 13px; font-weight: 600;
//           display: flex; align-items: center; gap: 8px;
//           transition: all 0.15s ease;
//           -webkit-tap-highlight-color: transparent;
//           text-align: left; min-height: 48px;
//         }
//         .as-chip:active { transform: scale(0.97); }
//         .as-chip:hover { border-color: #d0d7e2; background: #fff; }
//         .as-chip__check {
//           width: 20px; height: 20px; border-radius: 6px;
//           border: 2px solid #d0d7e2; background: #fff;
//           display: inline-flex; align-items: center; justify-content: center;
//           flex-shrink: 0; transition: all 0.15s ease;
//         }
//         .as-chip__check i { font-size: 11px; color: transparent; }
//         .as-chip.is-checked {
//           background: #fff8e6; border-color: #EBD197;
//           color: #5b4a1a; box-shadow: 0 2px 6px rgba(235,209,151,0.25);
//         }
//         .as-chip.is-checked .as-chip__check {
//           background: #EBD197; border-color: #EBD197;
//         }
//         .as-chip.is-checked .as-chip__check i { color: #1f2329; }

//         /* Currently assigned strip */
//         .as-current {
//           display: flex; gap: 6px; flex-wrap: wrap;
//           background: #fffaf0; border: 1px dashed #EBD197;
//           border-radius: 10px; padding: 10px; margin-bottom: 12px;
//         }
//         .as-current-empty { color: #6c757d; font-size: 13px; font-style: italic; }
//         .as-current-tag {
//           display: inline-flex; align-items: center; gap: 6px;
//           background: #fff; border: 1px solid #EBD197;
//           color: #1f2329; font-size: 12px; font-weight: 600;
//           padding: 4px 4px 4px 10px; border-radius: 999px;
//         }
//         .as-current-tag button {
//           background: #fde2e2; color: #842029;
//           border: none; width: 20px; height: 20px; border-radius: 50%;
//           cursor: pointer; font-size: 12px; line-height: 1;
//           display: inline-flex; align-items: center; justify-content: center;
//         }
//         .as-current-tag button:hover { background: #f5c2c7; }

//         /* Sticky save bar */
//         .as-savebar {
//           position: fixed; bottom: 0; left: 0; right: 0;
//           background: #fff; border-top: 1px solid #e6e8eb;
//           padding: 12px 14px; box-shadow: 0 -4px 14px rgba(17,20,24,0.08);
//           display: flex; gap: 10px; align-items: center;
//           z-index: 10;
//         }
//         .as-savebar__info { flex: 1; font-size: 13px; color: #6c757d; font-weight: 600; }
//         .as-savebar__info strong { color: #111418; }
//         .as-save-btn {
//           background: linear-gradient(135deg, #EBD197 0%, #d4b674 100%);
//           color: #1f2329; border: none;
//           padding: 12px 24px; border-radius: 10px;
//           font-size: 14px; font-weight: 700; cursor: pointer;
//           display: inline-flex; align-items: center; gap: 8px;
//           box-shadow: 0 4px 10px rgba(235,209,151,0.35);
//           min-height: 48px;
//         }
//         .as-save-btn:hover { transform: translateY(-1px); box-shadow: 0 6px 14px rgba(235,209,151,0.45); }
//         .as-save-btn:disabled { opacity: 0.55; cursor: not-allowed; transform: none; }

//         /* List sidebar */
//         .as-list-h {
//           margin: 0 0 12px 0; font-size: 15px; font-weight: 700; color: #111418;
//           display: flex; align-items: center; gap: 8px;
//           padding-bottom: 10px; border-bottom: 2px solid #EBD197;
//         }
//         .as-list-search {
//           width: 100%; padding: 9px 12px; border: 1px solid #d0d7e2; border-radius: 8px;
//           font-size: 13px; margin-bottom: 12px; box-sizing: border-box;
//         }
//         .as-list-item {
//           background: #fff; border: 1px solid #e6e8eb; border-left: 4px solid #EBD197;
//           border-radius: 10px; padding: 12px;
//           margin-bottom: 8px; cursor: pointer;
//           display: flex; align-items: center; gap: 10px;
//           transition: all 0.15s ease;
//           -webkit-tap-highlight-color: transparent;
//         }
//         .as-list-item:hover { box-shadow: 0 3px 10px rgba(0,0,0,0.08); border-left-color: #d4b674; }
//         .as-list-item.is-active { background: #fff8e6; border-color: #EBD197; }
//         .as-list-item__icon {
//           width: 36px; height: 36px; border-radius: 8px;
//           background: linear-gradient(135deg, #111418, #1a1f25);
//           color: #EBD197; display: flex; align-items: center; justify-content: center;
//           font-size: 15px; flex-shrink: 0;
//         }
//         .as-list-item__body { flex: 1; min-width: 0; }
//         .as-list-item__class {
//           font-size: 13px; font-weight: 700; color: #1f2329;
//           overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
//         }
//         .as-list-item__hint { font-size: 11px; color: #6c757d; }

//         .as-empty {
//           text-align: center; padding: 40px 16px; color: #6c757d; font-size: 13px;
//         }
//         .as-empty i { font-size: 28px; color: #d0d7e2; display: block; margin-bottom: 8px; }
//       `}</style>

//       <div className="as-page-header">
//         <h2><i className="fas fa-book"></i> Assign Subjects to Classes</h2>
//       </div>

//       {/* Mobile tabs */}
//       <div className="as-tabs">
//         <button
//           type="button"
//           className={`as-tab ${mobileTab === 'form' ? 'is-active' : ''}`}
//           onClick={() => setMobileTab('form')}
//         >
//           <i className="fas fa-edit"></i>
//           Assign Form
//         </button>
//         <button
//           type="button"
//           className={`as-tab ${mobileTab === 'list' ? 'is-active' : ''}`}
//           onClick={() => setMobileTab('list')}
//         >
//           <i className="fas fa-list"></i>
//           Classes
//           {classList && classList.length > 0 && <span className="as-badge">{classList.length}</span>}
//         </button>
//       </div>

//       <div className="as-body">
//         {/* FORM PANE */}
//         <div className="as-pane as-pane--form">
//           {/* 1. Pick class */}
//           <div className="as-card">
//             <h3 className="as-card__title">
//               <i className="fas fa-school"></i> Step 1 — Pick a Class
//             </h3>
//             <Select
//               options={classOptions}
//               value={
//                 editFormData.class_id && editFormData.section_id
//                   ? { value: `${editFormData.class_id},${editFormData.section_id}`, label: findClassLabel() }
//                   : null
//               }
//               onChange={handleClassChange}
//               placeholder="Search and select a class…"
//               isClearable
//               styles={{
//                 control: (base) => ({ ...base, minHeight: '44px', borderRadius: '8px' }),
//               }}
//             />
//             {editFormData.class_id && editFormData.section_id && (
//               <div style={{ marginTop: '10px', fontSize: '12px', color: '#6c757d' }}>
//                 <i className="fas fa-check-circle" style={{ color: '#7bc47f' }}></i>
//                 &nbsp;Selected: <strong style={{ color: '#111418' }}>{findClassLabel()}</strong>
//               </div>
//             )}
//           </div>

//           {/* 2. Pick subjects (chip grid) */}
//           {editFormData.class_id && editFormData.section_id ? (
//             <div className="as-card">
//               <h3 className="as-card__title">
//                 <i className="fas fa-book-open"></i> Step 2 — Tap subjects to assign
//               </h3>

//               <div className="as-counter">
//                 <span><strong>{selectedCount}</strong> of <strong>{totalCount}</strong> subjects selected</span>
//                 <i className="fas fa-tasks"></i>
//               </div>

//               <div className="as-actions">
//                 <button type="button" className="as-action-btn" onClick={selectAllVisible}>
//                   <i className="fas fa-check-double"></i> Select All{chipFilter ? ' (visible)' : ''}
//                 </button>
//                 <button type="button" className="as-action-btn as-action-btn--clear" onClick={clearAll}>
//                   <i className="fas fa-times-circle"></i> Clear All
//                 </button>
//               </div>

//               <input
//                 type="text"
//                 className="as-filter"
//                 placeholder="🔍 Filter subjects by name…"
//                 value={chipFilter}
//                 onChange={(e) => setChipFilter(e.target.value)}
//               />

//               {filteredSubjects.length === 0 ? (
//                 <div className="as-empty">
//                   <i className="fas fa-search"></i>
//                   No subjects match your filter.
//                 </div>
//               ) : (
//                 <div className="as-chips">
//                   {filteredSubjects.map((s) => {
//                     const checked = editFormData.subject_id.includes(s.id);
//                     return (
//                       <div
//                         key={s.id}
//                         className={`as-chip ${checked ? 'is-checked' : ''}`}
//                         onClick={() => toggleSubject(s.id)}
//                         role="checkbox"
//                         aria-checked={checked}
//                         tabIndex={0}
//                       >
//                         <span className="as-chip__check"><i className="fas fa-check"></i></span>
//                         <span style={{ flex: 1, minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis' }}>
//                           {s.subjects}
//                         </span>
//                       </div>
//                     );
//                   })}
//                 </div>
//               )}
//             </div>
//           ) : (
//             <div className="as-card">
//               <div className="as-empty">
//                 <i className="fas fa-arrow-up"></i>
//                 Pick a class above to see assigned subjects and start editing.
//               </div>
//             </div>
//           )}
//         </div>

//         {/* LIST PANE — class sidebar */}
//         <div className="as-pane as-pane--list">
//           <h3 className="as-list-h">
//             <i className="fas fa-list" style={{ color: '#EBD197' }}></i>
//             Existing Classes
//             {classList && classList.length > 0 && (
//               <span style={{ marginLeft: 'auto', fontSize: '12px', color: '#6c757d', fontWeight: 600 }}>
//                 {classList.length}
//               </span>
//             )}
//           </h3>

//           <input
//             type="text"
//             className="as-list-search"
//             placeholder="🔍 Search classes…"
//             value={search}
//             onChange={(e) => setSearch(e.target.value)}
//           />

//           {loadingList ? (
//             <div className="as-empty"><i className="fas fa-spinner fa-spin"></i>Loading…</div>
//           ) : filteredClassList.length === 0 ? (
//             <div className="as-empty"><i className="fas fa-inbox"></i>No classes yet.</div>
//           ) : (
//             filteredClassList.map((c, i) => {
//               const isActive =
//                 String(c.class_id) === String(editFormData.class_id) &&
//                 String(c.section_id) === String(editFormData.section_id);
//               return (
//                 <div
//                   key={i}
//                   className={`as-list-item ${isActive ? 'is-active' : ''}`}
//                   onClick={() => loadClassFromList(c.class_id, c.section_id)}
//                   role="button"
//                   tabIndex={0}
//                 >
//                   <div className="as-list-item__icon"><i className="fas fa-school"></i></div>
//                   <div className="as-list-item__body">
//                     <div className="as-list-item__class">
//                       {c.class} ({c.section_name})
//                     </div>
//                     <div className="as-list-item__hint">
//                       Tap to edit subjects
//                     </div>
//                   </div>
//                   <i className="fas fa-chevron-right" style={{ color: '#d0d7e2' }}></i>
//                 </div>
//               );
//             })
//           )}
//         </div>
//       </div>

//       {/* Sticky save bar (always visible when class is picked) */}
//       {editFormData.class_id && editFormData.section_id && (
//         <div className="as-savebar">
//           <div className="as-savebar__info">
//             <strong>{selectedCount}</strong> subjects selected for <strong>{findClassLabel()}</strong>
//           </div>
//           <button
//             type="button"
//             className="as-save-btn"
//             onClick={handleSubmit}
//             disabled={saving || selectedCount === 0}
//           >
//             <i className={`fas ${saving ? 'fa-spinner fa-spin' : 'fa-save'}`}></i>
//             {saving ? 'Saving…' : 'Save Subjects'}
//           </button>
//         </div>
//       )}
//     </div>
//   );
// }

// export default AssignSubjects;







import React, { useEffect, useState, useContext, useMemo, useCallback } from 'react';
import axios from 'axios';
import { useAuth } from './AuthContext';
import AcademicSessionContext from './AcademicSessionContext';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Select from 'react-select';

function AssignSubjects() {
  const { user } = useAuth();
  const { academicSession } = useContext(AcademicSessionContext);

  const [getClasses, setClasses] = useState([]); // full class+section catalog (sidebar)
  const [getCategories, setCategories] = useState([]); // subjects catalog
  const [classList, setClassList] = useState([]); // classes that already have subjects assigned
  const [loadingList, setLoadingList] = useState(true);
  const [assignSubject, setAssignSubject] = useState([]); // currently assigned for selected class
  const [loadingAssigned, setLoadingAssigned] = useState(false);
  const [search, setSearch] = useState('');
  const [mobileTab, setMobileTab] = useState('list'); // 'list' | 'form'
  const [saving, setSaving] = useState(false);

  // Subjects picked in the "Assign New Subjects" dropdown, not yet saved
  const [selectedNewSubjects, setSelectedNewSubjects] = useState([]);

  const initialState = {
    class_id: '',
    section_id: '',
    session_id: academicSession,
    campus_id: user?.user?.campus_id,
    user_id: user?.user?.user_id,
    hidden_id: '',
  };
  const [editFormData, setEditFormData] = useState(initialState);

  // Keep session_id in sync
  useEffect(() => {
    if (academicSession) {
      setEditFormData((prev) => ({ ...prev, session_id: parseInt(academicSession) }));
    }
  }, [academicSession]);

  // ── Subjects catalog
  useEffect(() => {
    if (!user?.user?.campus_id) return;
    axios
      .get(`${process.env.REACT_APP_API_BASE_URL}/get-subjects`, {
        params: { campus_id: user.user.campus_id },
      })
      .then((res) => setCategories(res.data.results || []))
      .catch((err) => console.log(err));
  }, [user]);

  // ── Classes catalog (every class+section, for the sidebar)
  useEffect(() => {
    if (!user?.user?.campus_id) return;
    axios
      .get(`${process.env.REACT_APP_API_BASE_URL}/get-classes/${user.user.campus_id}`)
      .then((res) => setClasses(res.data.results || []))
      .catch((err) => console.log(err));
  }, [user]);

  // ── Classes that already have at least one subject assigned (for the
  // "✓ Set" badge in the sidebar)
  const fetchClassList = useCallback(() => {
    if (!user?.user?.campus_id) return;
    setLoadingList(true);
    axios
      .get(`${process.env.REACT_APP_API_BASE_URL}/assign-subject-classwise-list`, {
        params: { page: 1, limit: 500, search: '', campus_id: user.user.campus_id },
      })
      .then((res) => {
        setClassList(res.data.results || []);
        setLoadingList(false);
      })
      .catch((err) => {
        console.log(err);
        setLoadingList(false);
      });
  }, [user]);
  useEffect(() => { fetchClassList(); }, [fetchClassList]);

  const assignedClassKeys = useMemo(() => {
    const set = new Set();
    classList.forEach((c) => set.add(`${c.class_id}_${c.section_id}`));
    return set;
  }, [classList]);

  // ── Fetch (or refresh) the subjects currently assigned to a given class+section
  const refreshAssignedForClass = useCallback(
    (class_id, section_id) => {
      if (!class_id || !section_id || !academicSession || !user?.user?.campus_id) {
        setAssignSubject([]);
        return;
      }
      setLoadingAssigned(true);
      axios
        .get(`${process.env.REACT_APP_API_BASE_URL}/view-assign-subjects-list`, {
          params: {
            session_id: academicSession,
            campus_id: user.user.campus_id,
            class_id,
            section_id,
          },
        })
        .then((res) => {
          setAssignSubject(res.data.results || []);
          setLoadingAssigned(false);
        })
        .catch((err) => {
          console.log(err);
          setLoadingAssigned(false);
        });
    },
    [user, academicSession]
  );

  // When the selected class changes, load its assignments and clear any
  // in-progress "new subjects" selection.
  useEffect(() => {
    refreshAssignedForClass(editFormData.class_id, editFormData.section_id);
    setSelectedNewSubjects([]);
  }, [editFormData.class_id, editFormData.section_id, academicSession, refreshAssignedForClass]);

  // Pick a class from the sidebar
  const selectClass = (class_id, section_id) => {
    setEditFormData((prev) => ({ ...prev, class_id: String(class_id), section_id: String(section_id) }));
    setMobileTab('form');
  };

  const findClassLabel = () => {
    if (!editFormData.class_id || !editFormData.section_id) return '';
    const c = getClasses.find(
      (x) => x.id === parseInt(editFormData.class_id) && x.section_id === parseInt(editFormData.section_id)
    );
    return c ? `${c.class} (${c.section_name})` : '';
  };

  // ── Remove a single already-assigned subject
  const deleteAssignedSubject = (assign_subject_id) => {
    if (!window.confirm('Remove this subject from the class?')) return;
    axios
      .delete(`${process.env.REACT_APP_API_BASE_URL}/delete-subject/${assign_subject_id}`)
      .then(() => {
        setAssignSubject((prev) => prev.filter((s) => s.id !== assign_subject_id));
        toast.success('Subject removed');
        fetchClassList();
      })
      .catch((err) => {
        console.error('Error deleting subject:', err);
        toast.error('Could not delete');
      });
  };

  // ── Core save logic
  const doSave = async (subjectIdsToSave) => {
    if (!subjectIdsToSave || subjectIdsToSave.length === 0) return;
    setSaving(true);
    try {
      await axios.post(
        `${process.env.REACT_APP_API_BASE_URL}/insert-selected-subjects`,
        { ...editFormData, subject_id: subjectIdsToSave },
        { headers: { 'Content-Type': 'application/json' } }
      );
      toast.success(`Saved ${subjectIdsToSave.length} subject(s) successfully`);
      setSelectedNewSubjects([]);
      fetchClassList();
      refreshAssignedForClass(editFormData.class_id, editFormData.section_id);
    } catch (err) {
      const msg = err?.response?.data?.error || 'An error occurred';
      toast.error(msg);
    } finally {
      setSaving(false);
    }
  };

  const handleAssignNew = () => {
    if (!editFormData.class_id || !editFormData.section_id) {
      toast.error('Please select a class first');
      return;
    }
    if (selectedNewSubjects.length === 0) {
      toast.error('Please pick at least one subject');
      return;
    }
    doSave(selectedNewSubjects);
  };

  // Subject ids already assigned to the selected class — excluded from the
  // "assign new" dropdown so the same subject can't be picked twice.
  const assignedIdSet = useMemo(() => {
    const set = new Set();
    assignSubject.forEach((row) => {
      if (row.subject_id != null) {
        set.add(row.subject_id);
        return;
      }
      const match = getCategories.find(
        (c) => (c.subjects || '').toLowerCase() === (row.subjects || '').toLowerCase()
      );
      if (match) set.add(match.id);
    });
    return set;
  }, [assignSubject, getCategories]);

  const subjectOptions = useMemo(() => {
    return getCategories
      .filter((c) => !assignedIdSet.has(c.id))
      .map((c) => ({ value: c.id, label: c.subjects }))
      .sort((a, b) => a.label.localeCompare(b.label));
  }, [getCategories, assignedIdSet]);

  const selectedOptionObjects = useMemo(
    () => subjectOptions.filter((o) => selectedNewSubjects.includes(o.value)),
    [subjectOptions, selectedNewSubjects]
  );

  const filteredClassCatalog = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return getClasses;
    return getClasses.filter((c) => `${c.class || ''} ${c.section_name || ''}`.toLowerCase().includes(q));
  }, [getClasses, search]);

  return (
    <div className="as-shell">
      <style>{`
        :root {
          --as-primary: #EBD197;
          --as-primary-dark: #d4b674;
          --as-primary-light: #faf2da;
          --as-primary-soft: #ebd197b2;
          --as-danger: #dc2626;
          --as-danger-light: #fee2e2;
          --as-text: #1f2329;
          --as-muted: #6c757d;
          --as-border: #e6e8eb;
        }

        .as-shell {
          display: flex; flex-direction: column; min-height: 100vh;
          background: #f4f6f8;
          font-family: "Segoe UI", system-ui, -apple-system, sans-serif;
        }

        .as-page-header {
          background: linear-gradient(135deg, var(--as-primary) 0%, var(--as-primary-dark) 100%);
          padding: 16px 18px;
          display: flex; align-items: center; gap: 10px;
        }
        .as-page-header h2 { margin: 0; font-size: 17px; font-weight: 700; display: flex; align-items: center; gap: 10px; }

        .as-tabs {
          display: flex; background: #fff; border-bottom: 1px solid var(--as-border);
          position: sticky; top: 0; z-index: 5;
        }
        .as-tab {
          flex: 1; padding: 14px 12px; background: transparent; border: none;
          font-size: 14px; font-weight: 600; color: var(--as-muted); cursor: pointer;
          display: flex; align-items: center; justify-content: center; gap: 8px;
          border-bottom: 3px solid transparent; transition: all 0.2s ease;
          -webkit-tap-highlight-color: transparent;
        }
        .as-tab.is-active { color: var(--as-primary-dark); border-bottom-color: var(--as-primary); background: var(--as-primary-soft); }
        .as-tab .as-badge { background: var(--as-primary); color: #fff; font-size: 11px; font-weight: 700; padding: 2px 8px; border-radius: 999px; min-width: 22px; }

        .as-body { flex: 1; display: flex; flex-direction: row; gap: 16px; padding: 16px; box-sizing: border-box; min-height: 0; }
        .as-pane { flex: 1; min-height: 0; }
        .as-pane--list { max-width: 340px; min-width: 280px; }

        @media (max-width: 991px) {
          .as-pane--form { display: ${mobileTab === 'form' ? 'block' : 'none'}; }
          .as-pane--list { display: ${mobileTab === 'list' ? 'block' : 'none'}; max-width: none; min-width: 0; }
          .as-body { padding: 12px; }
        }
        @media (min-width: 992px) {
          .as-tabs { display: none; }
          .as-pane--form, .as-pane--list { display: block; }
        }

        /* ── Class list card ── */
        .as-list-card {
          background: #fff; border-radius: 14px; overflow: hidden;
          border: 1px solid var(--as-border); box-shadow: 0 2px 8px rgba(17,20,24,0.05);
        }
        .as-list-card__head {
          background: linear-gradient(135deg, var(--as-primary) 0%, var(--as-primary-dark) 100%);
          padding: 16px 18px;
        }
        .as-list-card__head h3 { margin: 0 0 4px 0; font-size: 16px; font-weight: 700; display: flex; align-items: center; gap: 8px; }
        .as-list-card__head p { margin: 0; font-size: 12px; }
        .as-list-card__body { padding: 14px; }

        .as-list-search {
          width: 100%; padding: 10px 12px; border: 1px solid var(--as-border); border-radius: 9px;
          font-size: 13px; margin-bottom: 12px; box-sizing: border-box;
        }
        .as-list-search:focus { outline: none; border-color: var(--as-primary); box-shadow: 0 0 0 3px var(--as-primary-light); }

        .as-list-scroll { max-height: 70vh; overflow-y: auto; }

        .as-class-row {
          background: #fff; border: 1.5px solid var(--as-border); border-radius: 12px;
          padding: 10px 12px; margin-bottom: 8px; cursor: pointer;
          display: flex; align-items: center; gap: 10px; transition: all 0.15s ease;
          -webkit-tap-highlight-color: transparent;
        }
        .as-class-row:hover { border-color: var(--as-primary); }
        .as-class-row.is-active { background: var(--as-primary-soft); border-color: var(--as-primary); box-shadow: 0 0 0 3px var(--as-primary-light); }
        .as-class-row__icon {
          width: 36px; height: 36px; border-radius: 10px; flex-shrink: 0;
          background: var(--as-primary); color: #1f2329;
          display: flex; align-items: center; justify-content: center; font-size: 14px;
        }
        .as-class-row__name {
          flex: 1; min-width: 0; font-size: 13px; font-weight: 700; color: var(--as-text);
          overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
        }
        .as-set-badge {
          background: #EBD197; color: #1f2329;
          font-size: 11px; font-weight: 700; padding: 3px 9px; border-radius: 999px;
          display: inline-flex; align-items: center; gap: 4px; flex-shrink: 0;
        }

        /* ── Form card (selected class) ── */
        .as-form-card {
          background: #fff; border-radius: 14px; overflow: hidden;
          border: 1px solid var(--as-border); box-shadow: 0 2px 8px rgba(17,20,24,0.05);
        }
        .as-form-card__head {
          background: linear-gradient(135deg, var(--as-primary) 0%, var(--as-primary-dark) 100%);
          color: #fff; padding: 18px 20px;
          display: flex; align-items: center; gap: 14px;
        }
        .as-form-card__icon {
          width: 48px; height: 48px; border-radius: 12px; flex-shrink: 0;
          background: rgba(255,255,255,0.2); border: 1px solid rgba(255,255,255,0.4);
          display: flex; align-items: center; justify-content: center; font-size: 19px;
        }
        .as-form-card__head h3 { margin: 0 0 2px 0; font-size: 19px; font-weight: 700; }
        .as-form-card__head p { margin: 0; font-size: 13px; color: black; font-weight: 700; }
        .as-form-card__body { padding: 20px; }

        .as-section-title {
          margin: 0 0 14px 0; font-size: 14px; font-weight: 700; color: var(--as-text);
          display: flex; align-items: center; gap: 8px;
        }
        .as-section-title i { color: var(--as-primary); }

        .as-newsubject-row { display: flex; gap: 10px; align-items: flex-start; margin-bottom: 22px; flex-wrap: wrap; }
        .as-newsubject-select { flex: 1; min-width: 240px; }
        .as-assign-btn {
          background: var(--as-primary); border: none;
          padding: 0 22px; height: 46px; border-radius: 10px;
          font-size: 14px; font-weight: 700; cursor: pointer;
          display: inline-flex; align-items: center; gap: 8px;
          box-shadow: 0 3px 8px #ebd19765;
        }
        .as-assign-btn:hover:not(:disabled) { background: var(--as-primary-dark); }
        .as-assign-btn:disabled { opacity: 0.5; cursor: not-allowed; box-shadow: none; }

        .as-assigned-list { display: flex; flex-direction: column; gap: 8px; }
        .as-assigned-row {
          display: flex; align-items: center; gap: 12px;
          background: #fff; border: 1px solid var(--as-border); border-radius: 10px;
          padding: 10px 14px;
        }
        .as-assigned-row__num {
          width: 26px; height: 26px; border-radius: 50%; flex-shrink: 0;
          background: var(--as-primary-soft); color: black;
          font-size: 12px; font-weight: 700;
          display: flex; align-items: center; justify-content: center;
        }
        .as-assigned-row__subject { flex: 1; min-width: 0; font-size: 14px; font-weight: 700; color: var(--as-text); }
        .as-remove-btn {
          background: var(--as-danger-light); color: var(--as-danger); border: none;
          padding: 8px 14px; border-radius: 8px; font-size: 12px; font-weight: 700; cursor: pointer;
          display: inline-flex; align-items: center; gap: 6px; flex-shrink: 0;
        }
        .as-remove-btn:hover { background: #fecaca; }

        .as-empty { text-align: center; padding: 30px 16px; color: var(--as-muted); font-size: 13px; }
        .as-empty i { font-size: 24px; color: #d0d7e2; display: block; margin-bottom: 8px; }
        .as-empty--big { padding: 80px 20px; }
        .as-empty--big i { font-size: 32px; }
      `}</style>

      <div className="as-page-header">
        <h2><i className="fas fa-book"></i> Assign Subjects to Classes</h2>
      </div>

      {/* Mobile tabs */}
      <div className="as-tabs">
        <button
          type="button"
          className={`as-tab ${mobileTab === 'list' ? 'is-active' : ''}`}
          onClick={() => setMobileTab('list')}
        >
          <i className="fas fa-list"></i> Classes
          {getClasses.length > 0 && <span className="as-badge">{getClasses.length}</span>}
        </button>
        <button
          type="button"
          className={`as-tab ${mobileTab === 'form' ? 'is-active' : ''}`}
          onClick={() => setMobileTab('form')}
        >
          <i className="fas fa-book-open"></i> Subjects
        </button>
      </div>

      <div className="as-body">
        {/* CLASS LIST PANE */}
        <div className="as-pane as-pane--list">
          <div className="as-list-card">
            <div className="as-list-card__head">
              <h3><i className="fas fa-school"></i> Classes</h3>
              <p>Click a class to manage its subjects</p>
            </div>
            <div className="as-list-card__body">
              <input
                type="text"
                className="as-list-search"
                placeholder="🔍 Search class…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <div className="as-list-scroll">
                {loadingList ? (
                  <div className="as-empty"><i className="fas fa-spinner fa-spin"></i>Loading…</div>
                ) : filteredClassCatalog.length === 0 ? (
                  <div className="as-empty"><i className="fas fa-inbox"></i>No classes yet.</div>
                ) : (
                  filteredClassCatalog.map((c) => {
                    const isActive =
                      String(c.id) === String(editFormData.class_id) &&
                      String(c.section_id) === String(editFormData.section_id);
                    const hasAssignments = assignedClassKeys.has(`${c.id}_${c.section_id}`);
                    return (
                      <div
                        key={`${c.id}_${c.section_id}`}
                        className={`as-class-row ${isActive ? 'is-active' : ''}`}
                        onClick={() => selectClass(c.id, c.section_id)}
                        role="button"
                        tabIndex={0}
                      >
                        <div className="as-class-row__icon"><i className="fas fa-school"></i></div>
                        <div className="as-class-row__name">{c.class} ({c.section_name})</div>
                        {hasAssignments && (
                          <span className="as-set-badge"><i className="fas fa-check"></i> Set</span>
                        )}
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>
        </div>

        {/* FORM PANE */}
        <div className="as-pane as-pane--form">
          {!editFormData.class_id || !editFormData.section_id ? (
            <div className="as-empty as-empty--big">
              <i className="fas fa-arrow-left"></i>
              Pick a class from the list to manage its subjects.
            </div>
          ) : (
            <div className="as-form-card">
              <div className="as-form-card__head">
                <div className="as-form-card__icon"><i className="fas fa-school"></i></div>
                <div>
                  <h3>{findClassLabel()}</h3>
                  <p>{assignSubject.length} subject{assignSubject.length === 1 ? '' : 's'} assigned</p>
                </div>
              </div>

              <div className="as-form-card__body">
                <h4 className="as-section-title"><i className="fas fa-plus-circle"></i> Assign New Subjects</h4>

                <div className="as-newsubject-row">
                  <div className="as-newsubject-select">
                    <Select
                      isMulti
                      options={subjectOptions}
                      value={selectedOptionObjects}
                      onChange={(opts) => setSelectedNewSubjects(opts ? opts.map((o) => o.value) : [])}
                      placeholder="Choose subjects to assign…"
                      styles={{ control: (b) => ({ ...b, minHeight: '46px', borderRadius: '10px' }) }}
                    />
                  </div>
                  <button
                    type="button"
                    className="as-assign-btn"
                    onClick={handleAssignNew}
                    disabled={saving || selectedNewSubjects.length === 0}
                  >
                    <i className={`fas ${saving ? 'fa-spinner fa-spin' : 'fa-plus'}`}></i>
                    {saving ? 'Saving…' : 'Assign'}
                  </button>
                </div>

                <h4 className="as-section-title" style={{ marginTop: 26 }}>
                  <i className="fas fa-list-check"></i> Currently Assigned Subjects
                </h4>

                {loadingAssigned ? (
                  <div className="as-empty"><i className="fas fa-spinner fa-spin"></i>Loading current assignments…</div>
                ) : assignSubject.length === 0 ? (
                  <div className="as-empty">
                    <i className="fas fa-info-circle"></i>
                    No subjects assigned yet — use the dropdown above to add some.
                  </div>
                ) : (
                  <div className="as-assigned-list">
                    {assignSubject.map((row, i) => (
                      <div className="as-assigned-row" key={row.id}>
                        <span className="as-assigned-row__num">{i + 1}</span>
                        <div className="as-assigned-row__subject">{row.subjects}</div>
                        <button
                          type="button"
                          className="as-remove-btn"
                          onClick={() => deleteAssignedSubject(row.id)}
                        >
                          <i className="fas fa-times"></i> Remove
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default AssignSubjects;