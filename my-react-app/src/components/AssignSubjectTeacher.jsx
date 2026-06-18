// import React, { useEffect, useState, useContext, useMemo, useCallback } from 'react';
// import axios from 'axios';
// import { useAuth } from './AuthContext';
// import AcademicSessionContext from './AcademicSessionContext';
// import { toast } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';
// import Select from 'react-select';

// function AssignSubjectTeacher() {
//   const { user } = useAuth();
//   const { academicSession } = useContext(AcademicSessionContext);

//   const [teachers, setTeachers] = useState([]);
//   const [getCategories, setCategories] = useState([]); // subject-class-section combos
//   const [teacherList, setTeacherList] = useState([]); // teachers that have any assignment
//   const [loadingList, setLoadingList] = useState(true);
//   const [assignSubject, setAssignSubject] = useState([]); // current assignments for selected teacher
//   const [loadingAssigned, setLoadingAssigned] = useState(false);
//   const [search, setSearch] = useState('');
//   const [chipFilter, setChipFilter] = useState('');
//   const [mobileTab, setMobileTab] = useState('form'); // 'form' | 'list'
//   const [saving, setSaving] = useState(false);

//   // Map: subject_id -> { teacher_id, teacher_name, assign_id, subjects, class_name, section_name }
//   const [assignmentMap, setAssignmentMap] = useState({});

//   // Conflict popup state
//   const [conflictModal, setConflictModal] = useState(null); // { conflicts: [...], onReplace, onCancel }

//   // Master table modal state
//   const [showMaster, setShowMaster] = useState(false);
//   const [masterFilter, setMasterFilter] = useState('');
//   const [masterView, setMasterView] = useState('teacher'); // 'teacher' | 'class'

//   const initialState = {
//     teacher_id: '',
//     subject_id: [],
//     class_id: '',
//     shift: 'Morning', // default Morning so user doesn't have to pick first
//     section_id: '',
//     session_id: academicSession,
//     campus_id: user?.user?.campus_id,
//     user_id: user?.user?.user_id,
//     hidden_id: '',
//   };
//   const [editFormData, setEditFormData] = useState(initialState);

//   // Class filter for the chip grid (subject-class-section combo)
//   // Stored as "class_id-section_id" string, or '' for none picked yet
//   const [chipClass, setChipClass] = useState('');

//   useEffect(() => {
//     if (academicSession) {
//       setEditFormData((prev) => ({ ...prev, session_id: parseInt(academicSession) }));
//     }
//   }, [academicSession]);

//   // ── Subjects catalog (subject-class-section combos)
//   useEffect(() => {
//     if (!user?.user?.campus_id) return;
//     axios
//       .get(`${process.env.REACT_APP_API_BASE_URL}/get-subjects-for-teacher/${user.user.campus_id}`)
//       .then((res) => setCategories(res.data.results || []))
//       .catch((err) => console.log(err));
//   }, [user]);

//   // ── Teachers catalog
//   useEffect(() => {
//     if (!user?.user?.campus_id) return;
//     axios
//       .get(`${process.env.REACT_APP_API_BASE_URL}/get-teachers-for-time-table/${user.user.campus_id}`)
//       .then((res) => setTeachers(res.data.results || []))
//       .catch((err) => console.log(err));
//   }, [user]);

//   // ── Teachers that already have assignments (sidebar list)
//   const fetchTeacherList = useCallback(() => {
//     if (!user?.user?.campus_id) return;
//     setLoadingList(true);
//     axios
//       .get(`${process.env.REACT_APP_API_BASE_URL}/assign-subject-teachers-list`, {
//         params: { page: 1, limit: 500, search: '', campus_id: user.user.campus_id },
//       })
//       .then((res) => {
//         setTeacherList(res.data.results || []);
//         setLoadingList(false);
//       })
//       .catch((err) => {
//         console.log(err);
//         setLoadingList(false);
//       });
//   }, [user]);
//   useEffect(() => { fetchTeacherList(); }, [fetchTeacherList]);

//   // ── Build the global subject→teacher map (used for conflict detection)
//   // The /view-assign-subjects-to-teacher-list response rows may NOT include
//   // a subject_id field — only subjects (name) + class_name + section_name.
//   // So we match on (name + class + section) against the catalog to derive
//   // the real subject id used in the chip grid.
//   const buildAssignmentMap = useCallback(async () => {
//     if (!user?.user?.campus_id || !academicSession || teacherList.length === 0 || getCategories.length === 0) return;
//     try {
//       const responses = await Promise.all(
//         teacherList.map((t) =>
//           axios
//             .get(`${process.env.REACT_APP_API_BASE_URL}/view-assign-subjects-to-teacher-list`, {
//               params: {
//                 campus_id: user.user.campus_id,
//                 teacher_id: t.id,
//                 session_id: academicSession,
//               },
//             })
//             .then((res) => ({ teacher: t, rows: res.data.results || [] }))
//             .catch(() => ({ teacher: t, rows: [] }))
//         )
//       );

//       // Build a quick lookup index over the catalog: name|class|section → id
//       const norm = (v) => (v || '').toString().trim().toLowerCase();
//       const catalogIndex = {};
//       getCategories.forEach((c) => {
//         const key = `${norm(c.subjects)}|${norm(c.class_name)}|${norm(c.section_name)}`;
//         catalogIndex[key] = c.id;
//       });

//       const map = {};
//       responses.forEach(({ teacher, rows }) => {
//         rows.forEach((row) => {
//           let subId =
//             row.subject_id != null ? row.subject_id :
//             row.assign_subject_id != null ? row.assign_subject_id :
//             null;
//           if (subId == null) {
//             // Fallback: match by name+class+section against the catalog
//             const key = `${norm(row.subjects)}|${norm(row.class_name)}|${norm(row.section_name)}`;
//             if (catalogIndex[key] != null) subId = catalogIndex[key];
//           }
//           if (subId == null) return;
//           map[subId] = {
//             assign_id: row.id, // record id (used for delete)
//             teacher_id: teacher.id,
//             teacher_name: teacher.full_name,
//             subjects: row.subjects,
//             class_name: row.class_name,
//             section_name: row.section_name,
//           };
//         });
//       });
//       setAssignmentMap(map);
//     } catch (err) {
//       console.error('Failed to build assignment map', err);
//     }
//   }, [user, academicSession, teacherList, getCategories]);

//   useEffect(() => { buildAssignmentMap(); }, [buildAssignmentMap]);

//   // ── When teacher selected, fetch their current assignments + pre-check chips
//   useEffect(() => {
//     if (!editFormData.teacher_id || !academicSession) {
//       setAssignSubject([]);
//       return;
//     }
//     setLoadingAssigned(true);
//     axios
//       .get(`${process.env.REACT_APP_API_BASE_URL}/view-assign-subjects-to-teacher-list`, {
//         params: {
//           campus_id: user.user.campus_id,
//           teacher_id: editFormData.teacher_id,
//           session_id: academicSession,
//         },
//       })
//       .then((res) => {
//         const rows = res.data.results || [];
//         setAssignSubject(rows);
//         const ids = rows
//           .map((row) => {
//             if (row.subject_id != null) return row.subject_id;
//             const match = getCategories.find(
//               (c) =>
//                 (c.subjects || '').toLowerCase() === (row.subjects || '').toLowerCase() &&
//                 (c.class_name || '') === (row.class_name || '') &&
//                 (c.section_name || '') === (row.section_name || '')
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
//   }, [editFormData.teacher_id, academicSession, getCategories]);

//   const handleTeacherChange = (selectedOption) => {
//     if (!selectedOption) {
//       setEditFormData((prev) => ({ ...prev, teacher_id: '', subject_id: [] }));
//       setAssignSubject([]);
//       return;
//     }
//     setEditFormData((prev) => ({ ...prev, teacher_id: selectedOption.value }));
//   };

//   const findTeacherName = () => {
//     if (!editFormData.teacher_id) return '';
//     const t = teachers.find((x) => x.id === parseInt(editFormData.teacher_id));
//     return t ? t.full_name : '';
//   };

//   // Quick load a teacher from sidebar
//   const loadTeacherFromList = (teacher_id) => {
//     setEditFormData((prev) => ({ ...prev, teacher_id: String(teacher_id) }));
//     setMobileTab('form');
//   };

//   // Toggle chip
//   const toggleSubject = (id) => {
//     setEditFormData((prev) => {
//       const has = prev.subject_id.includes(id);
//       return {
//         ...prev,
//         subject_id: has ? prev.subject_id.filter((x) => x !== id) : [...prev.subject_id, id],
//       };
//     });
//   };

//   const selectAllVisible = () => {
//     const ids = filteredSubjects.map((s) => s.id);
//     setEditFormData((prev) => ({ ...prev, subject_id: Array.from(new Set([...prev.subject_id, ...ids])) }));
//   };

//   const clearAll = () => setEditFormData((prev) => ({ ...prev, subject_id: [] }));

//   // Delete a single assignment
//   const deleteAssignedSubject = (assign_subject_id) => {
//     if (!window.confirm('Remove this subject from this teacher?')) return;
//     axios
//       .delete(`${process.env.REACT_APP_API_BASE_URL}/delete-subject-teacher/${assign_subject_id}`)
//       .then(() => {
//         setAssignSubject((prev) => prev.filter((s) => s.id !== assign_subject_id));
//         toast.success('Subject removed');
//         fetchTeacherList();
//         buildAssignmentMap();
//       })
//       .catch((err) => {
//         console.error('Error deleting:', err);
//         toast.error('Could not delete');
//       });
//   };

//   // ── Core save logic — runs the actual POST after conflict resolution
//   const doSave = async (subjectIdsToSave, conflictsToDelete = []) => {
//     // Silently skip subjects already assigned to THIS teacher — backend errors
//     // on duplicates; we only ever send the delta. Conflicts (assigned to a
//     // different teacher) are kept since they are deleted first then re-added.
//     const myTeacherId = parseInt(editFormData.teacher_id);
//     const alreadyMine = new Set();
//     Object.entries(assignmentMap).forEach(([sid, info]) => {
//       if (info && parseInt(info.teacher_id) === myTeacherId) {
//         alreadyMine.add(parseInt(sid));
//       }
//     });
//     assignSubject.forEach((row) => {
//       if (row.subject_id != null) alreadyMine.add(parseInt(row.subject_id));
//       const match = getCategories.find(
//         (c) =>
//           (c.subjects || '').toLowerCase() === (row.subjects || '').toLowerCase() &&
//           (c.class_name || '') === (row.class_name || '') &&
//           (c.section_name || '') === (row.section_name || '')
//       );
//       if (match) alreadyMine.add(parseInt(match.id));
//     });
//     const conflictSubjectIds = new Set(conflictsToDelete.map((c) => parseInt(c.subject_id)));

//     const newOnly = subjectIdsToSave.filter(
//       (id) => !alreadyMine.has(parseInt(id)) || conflictSubjectIds.has(parseInt(id))
//     );
//     const skipped = subjectIdsToSave.length - newOnly.length;

//     if (newOnly.length === 0) {
//       toast.info('All selected subjects are already assigned to this teacher.');
//       return;
//     }

//     setSaving(true);
//     try {
//       // 1) Delete conflicting assignments first
//       if (conflictsToDelete.length > 0) {
//         await Promise.all(
//           conflictsToDelete.map((c) =>
//             axios
//               .delete(`${process.env.REACT_APP_API_BASE_URL}/delete-subject-teacher/${c.assign_id}`)
//               .catch((e) => console.warn('Could not delete conflict', c.assign_id, e))
//           )
//         );
//       }

//       // 2) Insert the new (delta) assignment
//       const payload = { ...editFormData, subject_id: newOnly };
//       await axios.post(
//         `${process.env.REACT_APP_API_BASE_URL}/insert-assign-subject-teacher`,
//         payload,
//         { headers: { 'Content-Type': 'application/json' } }
//       );

//       let successMsg;
//       if (conflictsToDelete.length > 0 && skipped > 0) {
//         successMsg = `Replaced ${conflictsToDelete.length}, saved ${newOnly.length - conflictsToDelete.length} new (${skipped} already assigned, skipped)`;
//       } else if (conflictsToDelete.length > 0) {
//         successMsg = `Replaced ${conflictsToDelete.length} subject(s) and saved!`;
//       } else if (skipped > 0) {
//         successMsg = `Saved ${newOnly.length} new subject(s) (${skipped} already assigned, skipped)`;
//       } else {
//         successMsg = `Saved ${newOnly.length} subject(s) successfully`;
//       }
//       toast.success(successMsg);

//       // Refresh everything
//       fetchTeacherList();
//       const tid = editFormData.teacher_id;
//       setEditFormData((prev) => ({ ...prev, teacher_id: '' }));
//       setTimeout(() => setEditFormData((prev) => ({ ...prev, teacher_id: tid })), 0);
//       setTimeout(() => buildAssignmentMap(), 300);
//     } catch (err) {
//       const msg = err?.response?.data?.error || 'An error occurred';
//       toast.error(msg);
//     } finally {
//       setSaving(false);
//     }
//   };

//   const handleSubmit = (e) => {
//     e?.preventDefault?.();
//     if (!editFormData.shift) {
//       toast.error('Please select a shift');
//       return;
//     }
//     if (!editFormData.teacher_id) {
//       toast.error('Please select a teacher');
//       return;
//     }
//     if (!editFormData.subject_id || editFormData.subject_id.length === 0) {
//       toast.error('Please pick at least one subject');
//       return;
//     }

//     // Conflict detection — find subjects assigned to *another* teacher
//     const myTeacher = parseInt(editFormData.teacher_id);
//     const conflicts = [];
//     editFormData.subject_id.forEach((sid) => {
//       const existing = assignmentMap[sid];
//       if (existing && parseInt(existing.teacher_id) !== myTeacher) {
//         conflicts.push({
//           subject_id: sid,
//           assign_id: existing.assign_id,
//           teacher_id: existing.teacher_id,
//           teacher_name: existing.teacher_name,
//           subjects: existing.subjects,
//           class_name: existing.class_name,
//           section_name: existing.section_name,
//         });
//       }
//     });

//     if (conflicts.length > 0) {
//       // Open the popup
//       setConflictModal({
//         conflicts,
//         onReplace: () => {
//           setConflictModal(null);
//           doSave(editFormData.subject_id, conflicts);
//         },
//         onKeepOnlyNonConflicts: () => {
//           const conflictIds = new Set(conflicts.map((c) => c.subject_id));
//           const cleanedIds = editFormData.subject_id.filter((id) => !conflictIds.has(id));
//           setConflictModal(null);
//           if (cleanedIds.length === 0) {
//             toast.info('No subjects left after removing conflicts');
//             return;
//           }
//           doSave(cleanedIds, []);
//         },
//         onCancel: () => setConflictModal(null),
//       });
//       return;
//     }

//     doSave(editFormData.subject_id, []);
//   };

//   // Distinct class+section pairs from the subjects catalog (for the Class dropdown)
//   // Key uses class_name|section_name since the catalog response only carries names
//   // (no class_id / section_id). Sep '|' is safe — class names won't contain it.
//   const chipClassOptions = useMemo(() => {
//     const seen = new Set();
//     const opts = [];
//     getCategories.forEach((s) => {
//       const cn = (s.class_name || '').trim();
//       const sn = (s.section_name || '').trim();
//       if (!cn && !sn) return;
//       const key = `${cn}|${sn}`;
//       if (seen.has(key)) return;
//       seen.add(key);
//       opts.push({ value: key, label: sn ? `${cn} (${sn})` : cn });
//     });
//     opts.sort((a, b) => a.label.localeCompare(b.label));
//     return opts;
//   }, [getCategories]);

//   // All subjects currently picked (selection state) — always visible as a chip
//   // grid so user sees every assigned subject across every class, regardless of
//   // the Class filter below.
//   const assignedChips = useMemo(() => {
//     if (!editFormData.subject_id || editFormData.subject_id.length === 0) return [];
//     // Index catalog by id for quick lookup
//     const byId = {};
//     getCategories.forEach((s) => { byId[s.id] = s; });
//     // Build chips from selection, preferring catalog entry; fall back to raw
//     // assignSubject rows if a selected id is missing from the catalog.
//     const chips = [];
//     editFormData.subject_id.forEach((sid) => {
//       if (byId[sid]) {
//         chips.push(byId[sid]);
//         return;
//       }
//       // Fallback synthetic chip from the raw assignment row
//       const row = assignSubject.find(
//         (r) => r.subject_id === sid || r.id === sid
//       );
//       if (row) {
//         chips.push({
//           id: sid,
//           subjects: row.subjects,
//           class_name: row.class_name,
//           section_name: row.section_name,
//         });
//       }
//     });
//     return chips;
//   }, [editFormData.subject_id, getCategories, assignSubject]);

//   // "Add more" chip pool — class filter REQUIRED; excludes already-picked ids.
//   const addableChips = useMemo(() => {
//     if (!chipClass) return [];
//     const [cn, sn] = chipClass.split('|');
//     const selectedSet = new Set(editFormData.subject_id);
//     const inClass = getCategories.filter(
//       (s) =>
//         (s.class_name || '').trim() === cn &&
//         (s.section_name || '').trim() === sn &&
//         !selectedSet.has(s.id)
//     );
//     const q = chipFilter.trim().toLowerCase();
//     if (!q) return inClass;
//     return inClass.filter((s) => (s.subjects || '').toLowerCase().includes(q));
//   }, [getCategories, chipClass, chipFilter, editFormData.subject_id]);

//   // Kept for backward-compat references (counter uses .length etc.)
//   const filteredSubjects = addableChips;

//   const filteredTeacherList = useMemo(() => {
//     const q = search.trim().toLowerCase();
//     if (!q) return teacherList;
//     return teacherList.filter((t) => (t.full_name || '').toLowerCase().includes(q));
//   }, [teacherList, search]);

//   // Set of teacher IDs that have at least one subject ACTUALLY assigned.
//   // Derived strictly from assignmentMap (built by inspecting each teacher's
//   // /view-assign-subjects-to-teacher-list response). We deliberately do NOT
//   // mark every teacher in teacherList as assigned, because that endpoint
//   // returns all teachers regardless of whether they have any subjects.
//   const assignedTeacherIds = useMemo(() => {
//     const s = new Set();
//     Object.values(assignmentMap).forEach((v) => {
//       if (v && v.teacher_id != null) s.add(String(v.teacher_id));
//     });
//     return s;
//   }, [assignmentMap]);

//   const teacherOptions = teachers.map((t) => {
//     const has = assignedTeacherIds.has(String(t.id));
//     return {
//       value: String(t.id),
//       label: t.full_name,
//       hasAssignments: has,
//     };
//   });

//   // ── Master matrix data (teacher × class → subjects[]) ──
//   const masterMatrix = useMemo(() => {
//     // Group all assignments by teacher_id, then by class_name|section_name
//     const teacherMap = {}; // { teacher_id: { teacher_name, byClass: { key: { class_name, section_name, subjects: [] } } } }
//     const classKeys = new Set(); // unique "class|section" keys across all teachers

//     Object.values(assignmentMap).forEach((a) => {
//       if (!a || a.teacher_id == null) return;
//       const tid = String(a.teacher_id);
//       if (!teacherMap[tid]) {
//         teacherMap[tid] = { teacher_name: a.teacher_name, byClass: {} };
//       }
//       const ck = `${(a.class_name || '').trim()}|${(a.section_name || '').trim()}`;
//       classKeys.add(ck);
//       if (!teacherMap[tid].byClass[ck]) {
//         teacherMap[tid].byClass[ck] = {
//           class_name: a.class_name,
//           section_name: a.section_name,
//           subjects: [],
//         };
//       }
//       teacherMap[tid].byClass[ck].subjects.push(a.subjects);
//     });

//     // Sort class columns by class_name then section_name
//     const classCols = Array.from(classKeys)
//       .map((k) => {
//         const [cn, sn] = k.split('|');
//         return { key: k, class_name: cn, section_name: sn, label: sn ? `${cn} (${sn})` : cn };
//       })
//       .sort((a, b) => a.label.localeCompare(b.label));

//     // Teacher rows sorted by name
//     const rows = Object.entries(teacherMap)
//       .map(([tid, info]) => ({ teacher_id: tid, ...info }))
//       .sort((a, b) => (a.teacher_name || '').localeCompare(b.teacher_name || ''));

//     return { rows, classCols };
//   }, [assignmentMap]);

//   const filteredMasterRows = useMemo(() => {
//     const q = masterFilter.trim().toLowerCase();
//     if (!q) return masterMatrix.rows;
//     return masterMatrix.rows.filter((r) => (r.teacher_name || '').toLowerCase().includes(q));
//   }, [masterMatrix.rows, masterFilter]);

//   const totalAssignments = useMemo(() => Object.keys(assignmentMap).length, [assignmentMap]);

//   // ── Class-wise master view (class → list of {subject, teacher_name}) ──
//   const masterByClass = useMemo(() => {
//     const classMap = {}; // { "class|section": { class_name, section_name, items: [...] } }
//     Object.values(assignmentMap).forEach((a) => {
//       if (!a) return;
//       const ck = `${(a.class_name || '').trim()}|${(a.section_name || '').trim()}`;
//       if (!classMap[ck]) {
//         classMap[ck] = {
//           key: ck,
//           class_name: a.class_name,
//           section_name: a.section_name,
//           items: [],
//         };
//       }
//       classMap[ck].items.push({
//         subject: a.subjects,
//         teacher_name: a.teacher_name,
//         teacher_id: a.teacher_id,
//       });
//     });
//     // Sort items inside each class by subject name
//     const rows = Object.values(classMap).map((c) => ({
//       ...c,
//       items: c.items.sort((x, y) => (x.subject || '').localeCompare(y.subject || '')),
//     }));
//     rows.sort((a, b) => {
//       const la = `${a.class_name} ${a.section_name}`;
//       const lb = `${b.class_name} ${b.section_name}`;
//       return la.localeCompare(lb);
//     });
//     return rows;
//   }, [assignmentMap]);

//   const filteredMasterClassRows = useMemo(() => {
//     const q = masterFilter.trim().toLowerCase();
//     if (!q) return masterByClass;
//     return masterByClass
//       .map((c) => ({
//         ...c,
//         items: c.items.filter(
//           (it) =>
//             (it.subject || '').toLowerCase().includes(q) ||
//             (it.teacher_name || '').toLowerCase().includes(q)
//         ),
//       }))
//       .filter(
//         (c) =>
//           c.items.length > 0 ||
//           `${c.class_name} ${c.section_name}`.toLowerCase().includes(q)
//       );
//   }, [masterByClass, masterFilter]);

//   // Custom react-select option renderer with a green check icon for teachers
//   // that already have at least one subject assigned.
//   const renderTeacherOption = (opt) => (
//     <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
//       {opt.hasAssignments ? (
//         <span
//           title="Has assigned subjects"
//           style={{
//             display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
//             width: 18, height: 18, borderRadius: '50%',
//             background: '#d4edda', color: '#155724',
//             fontSize: 11, flexShrink: 0,
//           }}
//         >
//           <i className="fas fa-check"></i>
//         </span>
//       ) : (
//         <span
//           style={{
//             display: 'inline-flex', width: 18, height: 18, borderRadius: '50%',
//             background: '#f1f3f6', flexShrink: 0,
//           }}
//         />
//       )}
//       <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
//         {opt.label}
//       </span>
//     </div>
//   );

//   const selectedCount = editFormData.subject_id.length;
//   const totalCount = getCategories.length;

//   return (
//     <div className="ast-shell">
//       <style>{`
//         .ast-shell {
//           display: flex; flex-direction: column; min-height: 100vh;
//           background: linear-gradient(180deg, #f4f6fa 0%, #eef1f6 100%);
//           font-family: "Segoe UI", system-ui, -apple-system, sans-serif;
//           padding-bottom: 80px;
//         }
//         .ast-page-header {
//           background: linear-gradient(135deg, #111418 0%, #1a1f25 100%);
//           color: #EBD197; padding: 16px 18px;
//           border-bottom: 3px solid #EBD197;
//           display: flex; align-items: center; gap: 10px;
//         }
//         .ast-page-header h2 { margin: 0; font-size: 17px; font-weight: 700; display: flex; align-items: center; gap: 10px; }

//         .ast-tabs {
//           display: flex; background: #fff; border-bottom: 1px solid #e6e8eb;
//           position: sticky; top: 0; z-index: 5;
//         }
//         .ast-tab {
//           flex: 1; padding: 14px 12px; background: transparent; border: none;
//           font-size: 14px; font-weight: 600; color: #6c757d; cursor: pointer;
//           display: flex; align-items: center; justify-content: center; gap: 8px;
//           border-bottom: 3px solid transparent; transition: all 0.2s ease;
//           -webkit-tap-highlight-color: transparent;
//         }
//         .ast-tab.is-active { color: #111418; border-bottom-color: #EBD197; background: #fffaf0; }
//         .ast-tab .ast-badge { background: #EBD197; color: #1f2329; font-size: 11px; font-weight: 700; padding: 2px 8px; border-radius: 999px; min-width: 22px; }

//         .ast-body { flex: 1; display: flex; flex-direction: row; min-height: 0; }
//         .ast-pane { flex: 1; padding: 14px; box-sizing: border-box; overflow-y: auto; }
//         .ast-pane--list { background: #fff; border-left: 1px solid #e6e8eb; max-width: 360px; min-width: 300px; }

//         @media (max-width: 991px) {
//           .ast-pane--form { display: ${mobileTab === 'form' ? 'block' : 'none'}; }
//           .ast-pane--list { display: ${mobileTab === 'list' ? 'block' : 'none'}; max-width: none; min-width: 0; border-left: none; }
//         }
//         @media (min-width: 992px) {
//           .ast-tabs { display: none; }
//           .ast-pane--form, .ast-pane--list { display: block; }
//         }

//         .ast-card { background: #fff; border-radius: 14px; padding: 16px; border: 1px solid #e8ecf2; box-shadow: 0 2px 8px rgba(17,20,24,0.06); margin-bottom: 14px; }
//         .ast-card__title {
//           font-size: 14px; font-weight: 700; color: #1f2329;
//           display: flex; align-items: center; gap: 8px; margin: 0 0 12px 0;
//           padding-bottom: 10px; border-bottom: 2px solid #EBD197;
//         }
//         .ast-card__title i { color: #EBD197; }

//         .ast-step-row { display: grid; gap: 10px; grid-template-columns: 1fr; margin-bottom: 12px; }
//         @media (min-width: 600px) { .ast-step-row { grid-template-columns: 180px 1fr; align-items: center; } }
//         .ast-step-label { font-size: 12px; font-weight: 700; color: #6c757d; text-transform: uppercase; letter-spacing: 0.4px; }

//         .ast-shift-group { display: flex; gap: 8px; flex-wrap: wrap; }
//         .ast-shift-btn {
//           flex: 1; min-width: 120px;
//           background: #f7f9fc; border: 1.5px solid #e0e3e8;
//           padding: 10px 14px; border-radius: 8px;
//           font-size: 13px; font-weight: 600; cursor: pointer;
//           display: inline-flex; align-items: center; justify-content: center; gap: 6px;
//           transition: all 0.15s ease; -webkit-tap-highlight-color: transparent;
//           min-height: 44px;
//         }
//         .ast-shift-btn.is-active {
//           background: #fff8e6; border-color: #EBD197; color: #5b4a1a;
//           box-shadow: 0 2px 6px rgba(235,209,151,0.25);
//         }

//         .ast-counter {
//           display: flex; align-items: center; justify-content: space-between;
//           background: linear-gradient(135deg, #111418, #1a1f25); color: #EBD197;
//           border-radius: 10px; padding: 10px 14px; margin-bottom: 12px;
//           font-size: 13px; font-weight: 600;
//         }
//         .ast-counter strong { font-size: 16px; color: #fff; margin: 0 4px; }

//         .ast-actions { display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: 12px; }
//         .ast-action-btn {
//           flex: 1; min-width: 120px; background: #fff; color: #1f2329;
//           border: 1.5px solid #d0d7e2; padding: 9px 14px; border-radius: 8px;
//           font-size: 13px; font-weight: 600; cursor: pointer;
//           display: inline-flex; align-items: center; justify-content: center; gap: 6px;
//           transition: all 0.15s ease;
//         }
//         .ast-action-btn:hover { border-color: #EBD197; background: #fffaf0; }
//         .ast-action-btn--clear { color: #842029; border-color: #f5c2c7; }
//         .ast-action-btn--clear:hover { background: #f8d7da; }

//         .ast-filter {
//           width: 100%; padding: 10px 12px; border: 1px solid #d0d7e2; border-radius: 8px;
//           font-size: 14px; margin-bottom: 12px; background: #fff; box-sizing: border-box;
//         }
//         .ast-filter:focus { outline: none; border-color: #EBD197; box-shadow: 0 0 0 3px rgba(235,209,151,0.25); }

//         .ast-chips { display: grid; gap: 8px; grid-template-columns: repeat(1, minmax(0, 1fr)); }
//         @media (min-width: 600px) { .ast-chips { grid-template-columns: repeat(2, minmax(0, 1fr)); } }
//         @media (min-width: 1200px) { .ast-chips { grid-template-columns: repeat(3, minmax(0, 1fr)); } }

//         .ast-chip {
//           background: #f7f9fc; color: #1f2329;
//           border: 1.5px solid #e0e3e8; border-radius: 10px;
//           padding: 10px 12px; cursor: pointer;
//           font-size: 13px; font-weight: 600; transition: all 0.15s ease;
//           -webkit-tap-highlight-color: transparent;
//           display: flex; align-items: center; gap: 10px; min-height: 56px;
//           position: relative;
//         }
//         .ast-chip:active { transform: scale(0.97); }
//         .ast-chip:hover { border-color: #d0d7e2; background: #fff; }
//         .ast-chip__check {
//           width: 20px; height: 20px; border-radius: 6px;
//           border: 2px solid #d0d7e2; background: #fff;
//           display: inline-flex; align-items: center; justify-content: center; flex-shrink: 0;
//         }
//         .ast-chip__check i { font-size: 11px; color: transparent; }
//         .ast-chip.is-checked {
//           background: #fff8e6; border-color: #EBD197; color: #5b4a1a;
//           box-shadow: 0 2px 6px rgba(235,209,151,0.25);
//         }
//         .ast-chip.is-checked .ast-chip__check { background: #EBD197; border-color: #EBD197; }
//         .ast-chip.is-checked .ast-chip__check i { color: #1f2329; }
//         .ast-chip__body { flex: 1; min-width: 0; }
//         .ast-chip__subject { font-size: 13px; font-weight: 700; color: #1f2329; line-height: 1.2; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
//         .ast-chip.is-checked .ast-chip__subject { color: #5b4a1a; }
//         .ast-chip__class { font-size: 11px; color: #6c757d; margin-top: 2px; font-weight: 500; }
//         .ast-chip__warn {
//           position: absolute; top: 6px; right: 8px;
//           background: #fff3cd; color: #856404;
//           font-size: 9px; font-weight: 700; padding: 2px 6px;
//           border-radius: 999px; letter-spacing: 0.3px; text-transform: uppercase;
//           border: 1px solid #f5dc6f;
//         }

//         .ast-current {
//           display: flex; gap: 6px; flex-wrap: wrap;
//           background: #fffaf0; border: 1px dashed #EBD197;
//           border-radius: 10px; padding: 10px; margin-bottom: 12px;
//         }
//         .ast-current-empty { color: #6c757d; font-size: 13px; font-style: italic; }
//         .ast-current-tag {
//           display: inline-flex; align-items: center; gap: 6px;
//           background: #fff; border: 1px solid #EBD197;
//           color: #1f2329; font-size: 12px; font-weight: 600;
//           padding: 4px 4px 4px 10px; border-radius: 999px;
//         }
//         .ast-current-tag button {
//           background: #fde2e2; color: #842029;
//           border: none; width: 20px; height: 20px; border-radius: 50%;
//           cursor: pointer; font-size: 12px; line-height: 1;
//           display: inline-flex; align-items: center; justify-content: center;
//         }

//         .ast-savebar {
//           position: fixed; bottom: 0; left: 0; right: 0;
//           background: #fff; border-top: 1px solid #e6e8eb;
//           padding: 12px 14px; box-shadow: 0 -4px 14px rgba(17,20,24,0.08);
//           display: flex; gap: 10px; align-items: center; z-index: 10;
//         }
//         .ast-savebar__info { flex: 1; font-size: 13px; color: #6c757d; font-weight: 600; min-width: 0; }
//         .ast-savebar__info strong { color: #111418; }
//         .ast-save-btn {
//           background: linear-gradient(135deg, #EBD197 0%, #d4b674 100%);
//           color: #1f2329; border: none; padding: 12px 24px; border-radius: 10px;
//           font-size: 14px; font-weight: 700; cursor: pointer;
//           display: inline-flex; align-items: center; gap: 8px;
//           box-shadow: 0 4px 10px rgba(235,209,151,0.35); min-height: 48px;
//         }
//         .ast-save-btn:disabled { opacity: 0.55; cursor: not-allowed; }

//         .ast-list-h {
//           margin: 0 0 12px 0; font-size: 15px; font-weight: 700; color: #111418;
//           display: flex; align-items: center; gap: 8px;
//           padding-bottom: 10px; border-bottom: 2px solid #EBD197;
//         }
//         .ast-list-search {
//           width: 100%; padding: 9px 12px; border: 1px solid #d0d7e2; border-radius: 8px;
//           font-size: 13px; margin-bottom: 12px; box-sizing: border-box;
//         }
//         .ast-list-item {
//           background: #fff; border: 1px solid #e6e8eb; border-left: 4px solid #EBD197;
//           border-radius: 10px; padding: 12px; margin-bottom: 8px; cursor: pointer;
//           display: flex; align-items: center; gap: 10px; transition: all 0.15s ease;
//           -webkit-tap-highlight-color: transparent;
//         }
//         .ast-list-item:hover { box-shadow: 0 3px 10px rgba(0,0,0,0.08); border-left-color: #d4b674; }
//         .ast-list-item.is-active { background: #fff8e6; border-color: #EBD197; }
//         .ast-list-item__icon {
//           width: 36px; height: 36px; border-radius: 50%;
//           background: linear-gradient(135deg, #111418, #1a1f25);
//           color: #EBD197; display: flex; align-items: center; justify-content: center;
//           font-size: 14px; flex-shrink: 0; font-weight: 700;
//         }
//         .ast-list-item__body { flex: 1; min-width: 0; }
//         .ast-list-item__name { font-size: 13px; font-weight: 700; color: #1f2329; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
//         .ast-list-item__hint { font-size: 11px; color: #6c757d; }

//         .ast-empty { text-align: center; padding: 40px 16px; color: #6c757d; font-size: 13px; }
//         .ast-empty i { font-size: 28px; color: #d0d7e2; display: block; margin-bottom: 8px; }

//         /* Conflict modal */
//         .ast-modal {
//           position: fixed; inset: 0; z-index: 9999;
//           background: rgba(17,20,24,0.55);
//           display: flex; align-items: center; justify-content: center;
//           padding: 14px;
//         }
//         .ast-modal__box {
//           background: #fff; border-radius: 14px;
//           width: 100%; max-width: 560px; max-height: 90vh;
//           overflow: hidden; display: flex; flex-direction: column;
//           box-shadow: 0 20px 60px rgba(0,0,0,0.4);
//         }
//         .ast-modal__head {
//           background: linear-gradient(135deg, #f59e0b, #d97706);
//           color: #fff; padding: 14px 18px;
//           display: flex; align-items: center; gap: 10px;
//           border-bottom: 3px solid #b45309;
//         }
//         .ast-modal__head i { font-size: 22px; }
//         .ast-modal__head h3 { margin: 0; font-size: 16px; font-weight: 700; }
//         .ast-modal__body { padding: 18px; overflow-y: auto; flex: 1; }
//         .ast-modal__intro { color: #495057; font-size: 14px; margin-bottom: 14px; line-height: 1.5; }
//         .ast-conflict {
//           background: #fffbeb; border: 1px solid #fcd34d; border-left: 4px solid #f59e0b;
//           border-radius: 10px; padding: 10px 12px; margin-bottom: 8px;
//         }
//         .ast-conflict__subject { font-weight: 700; font-size: 13px; color: #1f2329; margin-bottom: 4px; }
//         .ast-conflict__teacher { font-size: 12px; color: #92400e; display: flex; align-items: center; gap: 6px; }
//         .ast-conflict__teacher i { color: #d97706; }
//         .ast-modal__foot {
//           padding: 12px 18px; border-top: 1px solid #e6e8eb;
//           display: flex; gap: 8px; flex-wrap: wrap;
//         }
//         .ast-modal-btn {
//           flex: 1; min-width: 130px;
//           padding: 11px 14px; border-radius: 8px;
//           font-size: 13px; font-weight: 700; cursor: pointer;
//           border: none; display: inline-flex; align-items: center; justify-content: center; gap: 6px;
//           min-height: 44px;
//         }
//         .ast-modal-btn--replace { background: #dc3545; color: #fff; }
//         .ast-modal-btn--replace:hover { background: #c82333; }
//         .ast-modal-btn--keep { background: #EBD197; color: #1f2329; }
//         .ast-modal-btn--keep:hover { background: #d4b674; }
//         .ast-modal-btn--cancel { background: #f1f3f6; color: #495057; }

//         /* Master Table modal */
//         .ast-master {
//           position: fixed; inset: 0; z-index: 9998;
//           background: #fff; display: flex; flex-direction: column;
//         }
//         .ast-master__head {
//           background: linear-gradient(135deg, #111418 0%, #1a1f25 100%);
//           color: #EBD197; padding: 14px 18px;
//           display: flex; align-items: center; justify-content: space-between; gap: 10px;
//           border-bottom: 3px solid #EBD197; flex-shrink: 0;
//         }
//         .ast-master__head h3 { margin: 0; font-size: 17px; font-weight: 700; display: flex; align-items: center; gap: 10px; }
//         .ast-master__close {
//           background: rgba(235,209,151,0.15); border: 1px solid rgba(235,209,151,0.3);
//           color: #EBD197; cursor: pointer; width: 34px; height: 34px; border-radius: 50%;
//           font-size: 20px; line-height: 1;
//           display: flex; align-items: center; justify-content: center;
//         }
//         .ast-master__toolbar {
//           padding: 12px 18px; background: #f7f9fc; border-bottom: 1px solid #e6e8eb;
//           display: flex; gap: 10px; align-items: center; flex-wrap: wrap; flex-shrink: 0;
//         }
//         .ast-master__stats {
//           display: flex; gap: 12px; flex-wrap: wrap;
//           font-size: 12px; color: #6c757d; font-weight: 600;
//         }
//         .ast-master__stats strong { color: #111418; font-size: 14px; }
//         .ast-master__filter {
//           flex: 1; min-width: 180px;
//           padding: 9px 12px; border: 1px solid #d0d7e2; border-radius: 8px;
//           font-size: 13px; background: #fff;
//         }
//         .ast-master__body { flex: 1; overflow: auto; -webkit-overflow-scrolling: touch; padding: 14px; }
//         .ast-master__table {
//           width: 100%; border-collapse: separate; border-spacing: 0;
//           background: #fff; font-size: 12px;
//           border: 1px solid #e6e8eb; border-radius: 10px; overflow: hidden;
//         }
//         .ast-master__table th, .ast-master__table td {
//           border: 1px solid #e6e8eb; padding: 8px 10px; vertical-align: top;
//         }
//         .ast-master__table thead th {
//           background: linear-gradient(135deg, #111418 0%, #1a1f25 100%);
//           color: #EBD197; font-weight: 700; font-size: 11px;
//           text-align: center; position: sticky; top: 0; z-index: 2;
//           white-space: nowrap;
//         }
//         .ast-master__teacher-col {
//           position: sticky; left: 0; background: #f7f9fc; z-index: 1;
//           font-weight: 700; color: #111418; min-width: 160px; max-width: 220px;
//         }
//         .ast-master__teacher-col-head {
//           position: sticky; left: 0; z-index: 3 !important; min-width: 160px; text-align: left !important;
//         }
//         .ast-master__subj-tag {
//           display: inline-block;
//           background: #fff8e6; color: #1f2329;
//           border: 1px solid #EBD197;
//           font-size: 11px; font-weight: 600;
//           padding: 3px 7px; border-radius: 999px;
//           margin: 2px 3px 2px 0;
//           white-space: nowrap;
//         }
//         .ast-master__cell-empty { color: #d0d7e2; text-align: center; font-size: 18px; }
//         .ast-master__row-count {
//           background: #EBD197; color: #1f2329;
//           font-size: 10px; font-weight: 700;
//           padding: 2px 7px; border-radius: 999px; margin-left: 6px;
//         }
//         .ast-master__empty {
//           text-align: center; padding: 60px 16px; color: #6c757d;
//         }
//         .ast-master__empty i { font-size: 40px; color: #d0d7e2; display: block; margin-bottom: 12px; }

//         /* View-switch tabs inside master modal */
//         .ast-master__viewtabs { display: inline-flex; gap: 4px; background: #fff; border: 1px solid #d0d7e2; border-radius: 8px; padding: 3px; }
//         .ast-master__viewtab {
//           background: transparent; border: none; padding: 7px 14px; cursor: pointer;
//           font-size: 12px; font-weight: 700; color: #6c757d; border-radius: 6px;
//           display: inline-flex; align-items: center; gap: 6px;
//           transition: all 0.15s ease;
//         }
//         .ast-master__viewtab.is-active {
//           background: linear-gradient(135deg, #111418, #1a1f25);
//           color: #EBD197;
//         }

//         /* Class-grouped cards */
//         .ast-master__class-card {
//           background: #fff; border: 1px solid #e6e8eb; border-radius: 12px;
//           margin-bottom: 14px; overflow: hidden;
//           box-shadow: 0 1px 3px rgba(0,0,0,0.04);
//         }
//         .ast-master__class-head {
//           background: linear-gradient(135deg, #111418, #1a1f25); color: #EBD197;
//           padding: 10px 14px; display: flex; align-items: center; justify-content: space-between;
//           border-bottom: 2px solid #EBD197;
//         }
//         .ast-master__class-name { font-size: 14px; font-weight: 700; display: flex; align-items: center; gap: 8px; }
//         .ast-master__class-count {
//           background: #EBD197; color: #1f2329;
//           font-size: 11px; font-weight: 700; padding: 2px 8px; border-radius: 999px;
//         }
//         .ast-master__class-grid {
//           display: grid; gap: 0;
//           grid-template-columns: 1fr;
//         }
//         @media (min-width: 600px) {
//           .ast-master__class-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
//         }
//         @media (min-width: 992px) {
//           .ast-master__class-grid { grid-template-columns: repeat(3, minmax(0, 1fr)); }
//         }
//         .ast-master__pair {
//           padding: 10px 14px; border-top: 1px solid #f1f3f6; border-right: 1px solid #f1f3f6;
//           display: flex; align-items: center; gap: 10px;
//         }
//         .ast-master__pair-subject {
//           background: #fff8e6; color: #1f2329;
//           border: 1px solid #EBD197;
//           font-size: 12px; font-weight: 700;
//           padding: 4px 10px; border-radius: 6px;
//           white-space: nowrap;
//         }
//         .ast-master__pair-teacher {
//           font-size: 13px; color: #1f2329; font-weight: 600;
//           overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
//           display: flex; align-items: center; gap: 6px;
//         }
//         .ast-master__pair-teacher i { color: #6c757d; font-size: 10px; }
//         .ast-master__pair-arrow { color: #d0d7e2; font-size: 11px; }
//       `}</style>

//       <div className="ast-page-header" style={{ justifyContent: 'space-between' }}>
//         <h2><i className="fas fa-chalkboard-teacher"></i> Assign Subjects to Teacher</h2>
//         <button
//           type="button"
//           onClick={() => setShowMaster(true)}
//           style={{
//             background: '#EBD197', color: '#1f2329',
//             border: 'none', padding: '8px 14px', borderRadius: '8px',
//             fontSize: 13, fontWeight: 700, cursor: 'pointer',
//             display: 'inline-flex', alignItems: 'center', gap: 6,
//             boxShadow: '0 2px 6px rgba(0,0,0,0.15)',
//           }}
//         >
//           <i className="fas fa-table"></i> Master Table
//         </button>
//       </div>

//       {/* Mobile tabs */}
//       <div className="ast-tabs">
//         <button
//           type="button"
//           className={`ast-tab ${mobileTab === 'form' ? 'is-active' : ''}`}
//           onClick={() => setMobileTab('form')}
//         >
//           <i className="fas fa-edit"></i> Assign Form
//         </button>
//         <button
//           type="button"
//           className={`ast-tab ${mobileTab === 'list' ? 'is-active' : ''}`}
//           onClick={() => setMobileTab('list')}
//         >
//           <i className="fas fa-list"></i> Teachers
//           {teacherList && teacherList.length > 0 && <span className="ast-badge">{teacherList.length}</span>}
//         </button>
//       </div>

//       <div className="ast-body">
//         {/* FORM PANE */}
//         <div className="ast-pane ast-pane--form">
//           {/* Step 1: Shift */}
//           <div className="ast-card">
//             <h3 className="ast-card__title"><i className="fas fa-sun"></i> Step 1 — Select Shift</h3>
//             <div className="ast-shift-group">
//               {['Morning', 'Evening'].map((sh) => (
//                 <button
//                   key={sh}
//                   type="button"
//                   className={`ast-shift-btn ${editFormData.shift === sh ? 'is-active' : ''}`}
//                   onClick={() => setEditFormData((prev) => ({ ...prev, shift: sh }))}
//                 >
//                   <i className={`fas ${sh === 'Morning' ? 'fa-sun' : 'fa-moon'}`}></i> {sh}
//                 </button>
//               ))}
//             </div>
//           </div>

//           {/* Step 2: Teacher */}
//           <div className="ast-card">
//             <h3 className="ast-card__title"><i className="fas fa-user-tie"></i> Step 2 — Pick Teacher</h3>
//             <Select
//               options={teacherOptions}
//               value={
//                 editFormData.teacher_id
//                   ? (teacherOptions.find((o) => o.value === String(editFormData.teacher_id))
//                       || { value: editFormData.teacher_id, label: findTeacherName() })
//                   : null
//               }
//               onChange={handleTeacherChange}
//               placeholder="Search and select a teacher…"
//               isClearable
//               formatOptionLabel={renderTeacherOption}
//               styles={{ control: (b) => ({ ...b, minHeight: '44px', borderRadius: '8px' }) }}
//             />
//             {editFormData.teacher_id && (
//               <div style={{ marginTop: 10, fontSize: 12, color: '#6c757d' }}>
//                 <i className="fas fa-check-circle" style={{ color: '#7bc47f' }}></i>
//                 &nbsp;Selected: <strong style={{ color: '#111418' }}>{findTeacherName()}</strong>
//               </div>
//             )}
//           </div>

//           {/* Step 3: Subjects (chips) */}
//           {editFormData.teacher_id ? (
//             <div className="ast-card">
//               <h3 className="ast-card__title">
//                 <i className="fas fa-book-open"></i> Step 3 — Tap subjects to assign
//               </h3>

//               <div className="ast-counter">
//                 <span><strong>{selectedCount}</strong> subjects selected for this teacher</span>
//                 <i className="fas fa-tasks"></i>
//               </div>

//               {/* ── A) CURRENTLY ASSIGNED — always visible, all classes ── */}
//               <div style={{ marginBottom: 14 }}>
//                 <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
//                   <h4 style={{ margin: 0, fontSize: 13, fontWeight: 700, color: '#1f2329', display: 'flex', alignItems: 'center', gap: 6 }}>
//                     <i className="fas fa-check-circle" style={{ color: '#7bc47f' }}></i>
//                     Currently Assigned ({assignedChips.length})
//                   </h4>
//                   {assignedChips.length > 0 && (
//                     <button type="button" className="ast-action-btn ast-action-btn--clear" style={{ flex: 'none', minWidth: 'auto', padding: '6px 10px', fontSize: 12 }} onClick={clearAll}>
//                       <i className="fas fa-times-circle"></i> Remove All
//                     </button>
//                   )}
//                 </div>

//                 {loadingAssigned ? (
//                   <div className="ast-current ast-current-empty">
//                     <i className="fas fa-spinner fa-spin"></i>&nbsp;Loading current assignments…
//                   </div>
//                 ) : assignedChips.length === 0 ? (
//                   <div className="ast-current">
//                     <span className="ast-current-empty">
//                       <i className="fas fa-info-circle"></i> No subjects assigned yet — pick a class below to add some
//                     </span>
//                   </div>
//                 ) : (
//                   <div className="ast-chips">
//                     {assignedChips.map((s) => (
//                       <div
//                         key={s.id}
//                         className="ast-chip is-checked"
//                         onClick={() => toggleSubject(s.id)}
//                         role="checkbox"
//                         aria-checked={true}
//                         tabIndex={0}
//                       >
//                         <span className="ast-chip__check"><i className="fas fa-check"></i></span>
//                         <div className="ast-chip__body">
//                           <div className="ast-chip__subject">{s.subjects}</div>
//                           <div className="ast-chip__class">
//                             <i className="fas fa-school" style={{ marginRight: 4 }}></i>
//                             {s.class_name}{s.section_name ? ` (${s.section_name})` : ''}
//                           </div>
//                         </div>
//                       </div>
//                     ))}
//                   </div>
//                 )}
//               </div>

//               {/* ── B) ADD MORE — class filter required ── */}
//               <div style={{ borderTop: '1px dashed #e0e3e8', paddingTop: 14, marginTop: 4 }}>
//                 <h4 style={{ margin: '0 0 10px 0', fontSize: 13, fontWeight: 700, color: '#1f2329', display: 'flex', alignItems: 'center', gap: 6 }}>
//                   <i className="fas fa-plus-circle" style={{ color: '#EBD197' }}></i>
//                   Add More Subjects
//                 </h4>

//                 <div style={{ marginBottom: 12 }}>
//                   <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#6c757d', textTransform: 'uppercase', letterSpacing: '0.4px', marginBottom: 6 }}>
//                     <i className="fas fa-school" style={{ color: '#EBD197', marginRight: 6 }}></i>
//                     Filter by Class
//                   </label>
//                   <Select
//                     options={chipClassOptions}
//                     value={chipClassOptions.find((o) => o.value === chipClass) || null}
//                     onChange={(opt) => { setChipClass(opt ? opt.value : ''); setChipFilter(''); }}
//                     placeholder="Pick a class to see its subjects…"
//                     isClearable
//                     styles={{ control: (b) => ({ ...b, minHeight: '44px', borderRadius: '8px' }) }}
//                   />
//                 </div>

//                 {chipClass && (
//                   <>
//                     <input
//                       type="text"
//                       className="ast-filter"
//                       placeholder="🔍 Refine by subject name…"
//                       value={chipFilter}
//                       onChange={(e) => setChipFilter(e.target.value)}
//                     />

//                     {addableChips.length > 0 && (
//                       <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 8 }}>
//                         <button type="button" className="ast-action-btn" style={{ flex: 'none', minWidth: 'auto', padding: '6px 12px', fontSize: 12 }} onClick={selectAllVisible}>
//                           <i className="fas fa-check-double"></i> Select All in this Class
//                         </button>
//                       </div>
//                     )}
//                   </>
//                 )}

//                 {!chipClass ? (
//                   <div className="ast-empty">
//                     <i className="fas fa-school"></i>
//                     Pick a class above to see additional subjects you can add.
//                   </div>
//                 ) : addableChips.length === 0 ? (
//                   <div className="ast-empty">
//                     <i className="fas fa-check"></i>
//                     All subjects in this class are already assigned to this teacher.
//                   </div>
//                 ) : (
//                   <div className="ast-chips">
//                     {addableChips.map((s) => {
//                       const checked = editFormData.subject_id.includes(s.id);
//                       const existing = assignmentMap[s.id];
//                       const isConflict = existing && parseInt(existing.teacher_id) !== parseInt(editFormData.teacher_id || 0);
//                       return (
//                         <div
//                           key={s.id}
//                           className={`ast-chip ${checked ? 'is-checked' : ''}`}
//                           onClick={() => toggleSubject(s.id)}
//                           role="checkbox"
//                           aria-checked={checked}
//                           tabIndex={0}
//                           title={isConflict ? `Already assigned to ${existing.teacher_name}` : ''}
//                         >
//                           <span className="ast-chip__check"><i className="fas fa-check"></i></span>
//                           <div className="ast-chip__body">
//                             <div className="ast-chip__subject">{s.subjects}</div>
//                             <div className="ast-chip__class">
//                               <i className="fas fa-school" style={{ marginRight: 4 }}></i>
//                               {s.class_name} ({s.section_name})
//                             </div>
//                           </div>
//                           {isConflict && <span className="ast-chip__warn" title={existing.teacher_name}>Assigned</span>}
//                         </div>
//                       );
//                     })}
//                   </div>
//                 )}
//               </div>
//             </div>
//           ) : (
//             <div className="ast-card">
//               <div className="ast-empty">
//                 <i className="fas fa-arrow-up"></i>
//                 Select a shift and teacher first.
//               </div>
//             </div>
//           )}
//         </div>

//         {/* TEACHER LIST PANE */}
//         <div className="ast-pane ast-pane--list">
//           <h3 className="ast-list-h">
//             <i className="fas fa-users" style={{ color: '#EBD197' }}></i>
//             Assigned Teachers
//             {teacherList && teacherList.length > 0 && (
//               <span style={{ marginLeft: 'auto', fontSize: 12, color: '#6c757d', fontWeight: 600 }}>
//                 {teacherList.length}
//               </span>
//             )}
//           </h3>

//           <input
//             type="text"
//             className="ast-list-search"
//             placeholder="🔍 Search teachers…"
//             value={search}
//             onChange={(e) => setSearch(e.target.value)}
//           />

//           {loadingList ? (
//             <div className="ast-empty"><i className="fas fa-spinner fa-spin"></i>Loading…</div>
//           ) : filteredTeacherList.length === 0 ? (
//             <div className="ast-empty"><i className="fas fa-inbox"></i>No teachers yet.</div>
//           ) : (
//             filteredTeacherList.map((t, i) => {
//               const isActive = String(t.id) === String(editFormData.teacher_id);
//               const init = (t.full_name || '').split(' ').filter(Boolean).slice(0, 2).map((w) => w[0]).join('').toUpperCase();
//               const hasAssignments = assignedTeacherIds.has(String(t.id));
//               return (
//                 <div
//                   key={i}
//                   className={`ast-list-item ${isActive ? 'is-active' : ''}`}
//                   onClick={() => loadTeacherFromList(t.id)}
//                   role="button"
//                   tabIndex={0}
//                 >
//                   <div className="ast-list-item__icon" style={{ position: 'relative' }}>
//                     {init || <i className="fas fa-user"></i>}
//                     {hasAssignments && (
//                       <span
//                         title="Has assigned subjects"
//                         style={{
//                           position: 'absolute',
//                           bottom: -2, right: -2,
//                           width: 16, height: 16, borderRadius: '50%',
//                           background: '#28a745', color: '#fff',
//                           display: 'flex', alignItems: 'center', justifyContent: 'center',
//                           fontSize: 9, border: '2px solid #fff',
//                           boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
//                         }}
//                       >
//                         <i className="fas fa-check"></i>
//                       </span>
//                     )}
//                   </div>
//                   <div className="ast-list-item__body">
//                     <div className="ast-list-item__name">
//                       {t.full_name}
//                       {hasAssignments && (
//                         <i
//                           className="fas fa-check-circle"
//                           style={{ color: '#28a745', marginLeft: 6, fontSize: 12 }}
//                           title="Has assigned subjects"
//                         ></i>
//                       )}
//                     </div>
//                     <div className="ast-list-item__hint">
//                       {hasAssignments ? 'Subjects assigned · tap to edit' : 'Tap to assign'}
//                     </div>
//                   </div>
//                   <i className="fas fa-chevron-right" style={{ color: '#d0d7e2' }}></i>
//                 </div>
//               );
//             })
//           )}
//         </div>
//       </div>

//       {/* Sticky save bar */}
//       {editFormData.teacher_id && (
//         <div className="ast-savebar">
//           <div className="ast-savebar__info">
//             <strong>{selectedCount}</strong> selected for <strong>{findTeacherName()}</strong>
//             {editFormData.shift && <> · {editFormData.shift}</>}
//           </div>
//           <button
//             type="button"
//             className="ast-save-btn"
//             onClick={handleSubmit}
//             disabled={saving || selectedCount === 0 || !editFormData.shift}
//           >
//             <i className={`fas ${saving ? 'fa-spinner fa-spin' : 'fa-save'}`}></i>
//             {saving ? 'Saving…' : 'Save Subjects'}
//           </button>
//         </div>
//       )}

//       {/* Master Table modal */}
//       {showMaster && (
//         <div className="ast-master" role="dialog" aria-modal="true">
//           <div className="ast-master__head">
//             <h3><i className="fas fa-table"></i> Master Assignment Table</h3>
//             <button type="button" className="ast-master__close" onClick={() => setShowMaster(false)} aria-label="Close">×</button>
//           </div>

//           <div className="ast-master__toolbar">
//             <div className="ast-master__viewtabs">
//               <button
//                 type="button"
//                 className={`ast-master__viewtab ${masterView === 'teacher' ? 'is-active' : ''}`}
//                 onClick={() => { setMasterView('teacher'); setMasterFilter(''); }}
//               >
//                 <i className="fas fa-chalkboard-teacher"></i> By Teacher
//               </button>
//               <button
//                 type="button"
//                 className={`ast-master__viewtab ${masterView === 'class' ? 'is-active' : ''}`}
//                 onClick={() => { setMasterView('class'); setMasterFilter(''); }}
//               >
//                 <i className="fas fa-school"></i> By Class
//               </button>
//             </div>
//             <div className="ast-master__stats">
//               {masterView === 'teacher' ? (
//                 <>
//                   <span><strong>{masterMatrix.rows.length}</strong> teachers</span>
//                   <span>·</span>
//                   <span><strong>{masterMatrix.classCols.length}</strong> classes</span>
//                 </>
//               ) : (
//                 <>
//                   <span><strong>{masterByClass.length}</strong> classes</span>
//                   <span>·</span>
//                   <span><strong>{masterMatrix.rows.length}</strong> teachers</span>
//                 </>
//               )}
//               <span>·</span>
//               <span><strong>{totalAssignments}</strong> assignments</span>
//             </div>
//             <input
//               type="text"
//               className="ast-master__filter"
//               placeholder={masterView === 'teacher' ? '🔍 Filter by teacher name…' : '🔍 Filter by class / subject / teacher…'}
//               value={masterFilter}
//               onChange={(e) => setMasterFilter(e.target.value)}
//             />
//           </div>

//           <div className="ast-master__body">
//             {masterView === 'teacher' ? (
//               masterMatrix.rows.length === 0 ? (
//                 <div className="ast-master__empty">
//                   <i className="fas fa-inbox"></i>
//                   No assignments yet. Assign subjects to a teacher to see them here.
//                 </div>
//               ) : filteredMasterRows.length === 0 ? (
//                 <div className="ast-master__empty">
//                   <i className="fas fa-search"></i>
//                   No teacher matches your filter.
//                 </div>
//               ) : (
//                 <table className="ast-master__table">
//                   <thead>
//                     <tr>
//                       <th className="ast-master__teacher-col-head">Teacher</th>
//                       {masterMatrix.classCols.map((c) => (
//                         <th key={c.key}>{c.label}</th>
//                       ))}
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {filteredMasterRows.map((row) => {
//                       const totalForTeacher = Object.values(row.byClass).reduce(
//                         (sum, cell) => sum + cell.subjects.length,
//                         0
//                       );
//                       return (
//                         <tr key={row.teacher_id}>
//                           <td className="ast-master__teacher-col">
//                             {row.teacher_name}
//                             <span className="ast-master__row-count">{totalForTeacher}</span>
//                           </td>
//                           {masterMatrix.classCols.map((c) => {
//                             const cell = row.byClass[c.key];
//                             if (!cell || cell.subjects.length === 0) {
//                               return <td key={c.key} className="ast-master__cell-empty">·</td>;
//                             }
//                             return (
//                               <td key={c.key}>
//                                 {cell.subjects.map((sub, i) => (
//                                   <span key={i} className="ast-master__subj-tag">{sub}</span>
//                                 ))}
//                               </td>
//                             );
//                           })}
//                         </tr>
//                       );
//                     })}
//                   </tbody>
//                 </table>
//               )
//             ) : (
//               // ── BY CLASS view (single row per class, subject+teacher pairs in one cell) ──
//               masterByClass.length === 0 ? (
//                 <div className="ast-master__empty">
//                   <i className="fas fa-inbox"></i>
//                   No assignments yet.
//                 </div>
//               ) : filteredMasterClassRows.length === 0 ? (
//                 <div className="ast-master__empty">
//                   <i className="fas fa-search"></i>
//                   Nothing matches your filter.
//                 </div>
//               ) : (
//                 <table className="ast-master__table ast-master__class-table">
//                   <thead>
//                     <tr>
//                       <th style={{ width: 50 }}>#</th>
//                       <th className="ast-master__teacher-col-head" style={{ minWidth: 180 }}>Class</th>
//                       <th>Subjects &amp; Teachers</th>
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {filteredMasterClassRows.map((cls, ci) => (
//                       <tr key={cls.key}>
//                         <td style={{ textAlign: 'center', verticalAlign: 'middle', background: '#fff8e6', fontWeight: 700, color: '#5b4a1a' }}>
//                           {ci + 1}
//                         </td>
//                         <td className="ast-master__teacher-col" style={{ verticalAlign: 'middle' }}>
//                           <i className="fas fa-school" style={{ color: '#EBD197', marginRight: 6 }}></i>
//                           {cls.class_name}{cls.section_name ? ` (${cls.section_name})` : ''}
//                           <div style={{ fontSize: 10, color: '#6c757d', fontWeight: 600, marginTop: 4 }}>
//                             {cls.items.length} subject{cls.items.length === 1 ? '' : 's'}
//                           </div>
//                         </td>
//                         <td style={{ padding: '8px 10px' }}>
//                           {cls.items.length === 0 ? (
//                             <span style={{ color: '#9aa3af', fontStyle: 'italic', fontSize: 12 }}>No subjects assigned</span>
//                           ) : (
//                             <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
//                               {cls.items.map((it, i) => (
//                                 <span
//                                   key={i}
//                                   style={{
//                                     display: 'inline-flex',
//                                     alignItems: 'center',
//                                     background: '#fff8e6',
//                                     border: '1px solid #EBD197',
//                                     borderRadius: 6,
//                                     overflow: 'hidden',
//                                     fontSize: 11,
//                                     fontWeight: 600,
//                                   }}
//                                   title={`${it.subject} → ${it.teacher_name}`}
//                                 >
//                                   <span style={{ padding: '4px 8px', background: '#fff8e6', color: '#5b4a1a' }}>
//                                     {it.subject}
//                                   </span>
//                                   <span style={{ padding: '4px 8px', background: '#111418', color: '#EBD197', display: 'inline-flex', alignItems: 'center', gap: 4 }}>
//                                     <i className="fas fa-user" style={{ fontSize: 9 }}></i>
//                                     {it.teacher_name || '—'}
//                                   </span>
//                                 </span>
//                               ))}
//                             </div>
//                           )}
//                         </td>
//                       </tr>
//                     ))}
//                   </tbody>
//                 </table>
//               )
//             )}
//           </div>
//         </div>
//       )}

//       {/* Conflict popup */}
//       {conflictModal && (
//         <div className="ast-modal" role="dialog" aria-modal="true">
//           <div className="ast-modal__box">
//             <div className="ast-modal__head">
//               <i className="fas fa-exclamation-triangle"></i>
//               <h3>Subjects already assigned</h3>
//             </div>
//             <div className="ast-modal__body">
//               <p className="ast-modal__intro">
//                 These subjects are <strong>already assigned to another teacher</strong>.
//                 Choose what to do:
//               </p>
//               {conflictModal.conflicts.map((c, i) => (
//                 <div key={i} className="ast-conflict">
//                   <div className="ast-conflict__subject">
//                     {c.subjects} <small style={{ color: '#6c757d', fontWeight: 500 }}>· {c.class_name} ({c.section_name})</small>
//                   </div>
//                   <div className="ast-conflict__teacher">
//                     <i className="fas fa-chalkboard-teacher"></i>
//                     Currently assigned to: <strong>{c.teacher_name}</strong>
//                   </div>
//                 </div>
//               ))}
//               <p style={{ marginTop: 14, fontSize: 12, color: '#6c757d' }}>
//                 <strong>Replace</strong> will move these subjects from the old teacher to <strong>{findTeacherName()}</strong>.
//               </p>
//             </div>
//             <div className="ast-modal__foot">
//               <button
//                 type="button"
//                 className="ast-modal-btn ast-modal-btn--cancel"
//                 onClick={conflictModal.onCancel}
//               >
//                 <i className="fas fa-arrow-left"></i> Cancel
//               </button>
//               <button
//                 type="button"
//                 className="ast-modal-btn ast-modal-btn--keep"
//                 onClick={conflictModal.onKeepOnlyNonConflicts}
//               >
//                 <i className="fas fa-filter"></i> Skip Conflicts
//               </button>
//               <button
//                 type="button"
//                 className="ast-modal-btn ast-modal-btn--replace"
//                 onClick={conflictModal.onReplace}
//               >
//                 <i className="fas fa-exchange-alt"></i> Replace
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

// export default AssignSubjectTeacher;









import React, { useEffect, useState, useContext, useMemo, useCallback } from 'react';
import axios from 'axios';
import { useAuth } from './AuthContext';
import AcademicSessionContext from './AcademicSessionContext';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Select from 'react-select';

function AssignSubjectTeacher() {
  const { user } = useAuth();
  const { academicSession } = useContext(AcademicSessionContext);

  const [teachers, setTeachers] = useState([]);
  const [getCategories, setCategories] = useState([]); // subject-class-section combos
  const [teacherList, setTeacherList] = useState([]); // all teachers for the sidebar
  const [loadingList, setLoadingList] = useState(true);
  const [assignSubject, setAssignSubject] = useState([]); // current assignments for selected teacher
  const [loadingAssigned, setLoadingAssigned] = useState(false);
  const [search, setSearch] = useState('');
  const [mobileTab, setMobileTab] = useState('list'); // 'list' | 'form'
  const [saving, setSaving] = useState(false);

  // Subjects picked in the "Assign New Subjects" dropdown, not yet saved
  const [selectedNewSubjects, setSelectedNewSubjects] = useState([]);

  // Map: subject_id -> { teacher_id, teacher_name, assign_id, subjects, class_name, section_name }
  const [assignmentMap, setAssignmentMap] = useState({});

  // Conflict popup state
  const [conflictModal, setConflictModal] = useState(null);

  // Master table modal state
  const [showMaster, setShowMaster] = useState(false);
  const [masterFilter, setMasterFilter] = useState('');
  const [masterView, setMasterView] = useState('teacher'); // 'teacher' | 'class'

  const initialState = {
    teacher_id: '',
    class_id: '',
    shift: 'Morning',
    section_id: '',
    session_id: academicSession,
    campus_id: user?.user?.campus_id,
    user_id: user?.user?.user_id,
    hidden_id: '',
  };
  const [editFormData, setEditFormData] = useState(initialState);

  useEffect(() => {
    if (academicSession) {
      setEditFormData((prev) => ({ ...prev, session_id: parseInt(academicSession) }));
    }
  }, [academicSession]);

  // ── Subjects catalog (subject-class-section combos)
  useEffect(() => {
    if (!user?.user?.campus_id) return;
    axios
      .get(`${process.env.REACT_APP_API_BASE_URL}/get-subjects-for-teacher/${user.user.campus_id}`)
      .then((res) => setCategories(res.data.results || []))
      .catch((err) => console.log(err));
  }, [user]);

  // ── Teachers catalog
  useEffect(() => {
    if (!user?.user?.campus_id) return;
    axios
      .get(`${process.env.REACT_APP_API_BASE_URL}/get-teachers-for-time-table/${user.user.campus_id}`)
      .then((res) => setTeachers(res.data.results || []))
      .catch((err) => console.log(err));
  }, [user]);

  // ── Teachers list for the sidebar
  const fetchTeacherList = useCallback(() => {
    if (!user?.user?.campus_id) return;
    setLoadingList(true);
    axios
      .get(`${process.env.REACT_APP_API_BASE_URL}/assign-subject-teachers-list`, {
        params: { page: 1, limit: 500, search: '', campus_id: user.user.campus_id },
      })
      .then((res) => {
        setTeacherList(res.data.results || []);
        setLoadingList(false);
      })
      .catch((err) => {
        console.log(err);
        setLoadingList(false);
      });
  }, [user]);
  useEffect(() => { fetchTeacherList(); }, [fetchTeacherList]);

  // Matches a raw assignment row back to its catalog subject id, since some
  // API responses only carry subject name + class + section, not the id.
  const norm = (v) => (v || '').toString().trim().toLowerCase();
  const matchCatalogId = useCallback(
    (row) => {
      if (row.subject_id != null) return row.subject_id;
      if (row.assign_subject_id != null) return row.assign_subject_id;
      const match = getCategories.find(
        (c) =>
          norm(c.subjects) === norm(row.subjects) &&
          norm(c.class_name) === norm(row.class_name) &&
          norm(c.section_name) === norm(row.section_name)
      );
      return match ? match.id : null;
    },
    [getCategories]
  );

  // ── Build the global subject→teacher map (used for conflict detection)
  const buildAssignmentMap = useCallback(async () => {
    if (!user?.user?.campus_id || !academicSession || teacherList.length === 0 || getCategories.length === 0) return;
    try {
      const responses = await Promise.all(
        teacherList.map((t) =>
          axios
            .get(`${process.env.REACT_APP_API_BASE_URL}/view-assign-subjects-to-teacher-list`, {
              params: {
                campus_id: user.user.campus_id,
                teacher_id: t.id,
                session_id: academicSession,
              },
            })
            .then((res) => ({ teacher: t, rows: res.data.results || [] }))
            .catch(() => ({ teacher: t, rows: [] }))
        )
      );

      const map = {};
      responses.forEach(({ teacher, rows }) => {
        rows.forEach((row) => {
          const subId = matchCatalogId(row);
          if (subId == null) return;
          map[subId] = {
            assign_id: row.id, // record id (used for delete)
            teacher_id: teacher.id,
            teacher_name: teacher.full_name,
            subjects: row.subjects,
            class_name: row.class_name,
            section_name: row.section_name,
          };
        });
      });
      setAssignmentMap(map);
    } catch (err) {
      console.error('Failed to build assignment map', err);
    }
  }, [user, academicSession, teacherList, getCategories, matchCatalogId]);

  useEffect(() => { buildAssignmentMap(); }, [buildAssignmentMap]);

  // ── Fetch (or refresh) the subjects currently assigned to a given teacher
  const refreshAssignedForTeacher = useCallback(
    (teacher_id) => {
      if (!teacher_id || !academicSession || !user?.user?.campus_id) {
        setAssignSubject([]);
        return;
      }
      setLoadingAssigned(true);
      axios
        .get(`${process.env.REACT_APP_API_BASE_URL}/view-assign-subjects-to-teacher-list`, {
          params: {
            campus_id: user.user.campus_id,
            teacher_id,
            session_id: academicSession,
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

  // When the selected teacher changes, load their assignments and clear any
  // in-progress "new subjects" selection.
  useEffect(() => {
    refreshAssignedForTeacher(editFormData.teacher_id);
    setSelectedNewSubjects([]);
  }, [editFormData.teacher_id, academicSession, refreshAssignedForTeacher]);

  // Pick a teacher from the sidebar
  const selectTeacher = (teacher_id) => {
    setEditFormData((prev) => ({ ...prev, teacher_id: String(teacher_id) }));
    setMobileTab('form');
  };

  const findTeacherName = () => {
    if (!editFormData.teacher_id) return '';
    const t = teachers.find((x) => x.id === parseInt(editFormData.teacher_id));
    return t ? t.full_name : '';
  };

  // ── Remove a single already-assigned subject
  const deleteAssignedSubject = (assign_subject_id) => {
    if (!window.confirm('Remove this subject from this teacher?')) return;
    axios
      .delete(`${process.env.REACT_APP_API_BASE_URL}/delete-subject-teacher/${assign_subject_id}`)
      .then(() => {
        setAssignSubject((prev) => prev.filter((s) => s.id !== assign_subject_id));
        toast.success('Subject removed');
        fetchTeacherList();
        buildAssignmentMap();
      })
      .catch((err) => {
        console.error('Error deleting:', err);
        toast.error('Could not delete');
      });
  };

  // ── Core save logic — runs the actual POST after conflict resolution
  const doSave = async (subjectIdsToSave, conflictsToDelete = []) => {
    if (!subjectIdsToSave || subjectIdsToSave.length === 0) return;
    setSaving(true);
    try {
      // 1) Delete conflicting assignments first
      if (conflictsToDelete.length > 0) {
        await Promise.all(
          conflictsToDelete.map((c) =>
            axios
              .delete(`${process.env.REACT_APP_API_BASE_URL}/delete-subject-teacher/${c.assign_id}`)
              .catch((e) => console.warn('Could not delete conflict', c.assign_id, e))
          )
        );
      }

      // 2) Insert the new assignments
      const payload = { ...editFormData, subject_id: subjectIdsToSave };
      await axios.post(
        `${process.env.REACT_APP_API_BASE_URL}/insert-assign-subject-teacher`,
        payload,
        { headers: { 'Content-Type': 'application/json' } }
      );

      const successMsg =
        conflictsToDelete.length > 0
          ? `Replaced ${conflictsToDelete.length} and saved ${subjectIdsToSave.length} subject(s)`
          : `Saved ${subjectIdsToSave.length} subject(s) successfully`;
      toast.success(successMsg);

      setSelectedNewSubjects([]);
      fetchTeacherList();
      refreshAssignedForTeacher(editFormData.teacher_id);
      buildAssignmentMap();
    } catch (err) {
      const msg = err?.response?.data?.error || 'An error occurred';
      toast.error(msg);
    } finally {
      setSaving(false);
    }
  };

  // ── Assign the subjects currently chosen in the dropdown
  const handleAssignNew = () => {
    if (!editFormData.shift) {
      toast.error('Please select a shift');
      return;
    }
    if (!editFormData.teacher_id) {
      toast.error('Please select a teacher');
      return;
    }
    if (selectedNewSubjects.length === 0) {
      toast.error('Please pick at least one subject');
      return;
    }

    // Conflict detection — subjects already assigned to *another* teacher
    const myTeacher = parseInt(editFormData.teacher_id);
    const conflicts = [];
    selectedNewSubjects.forEach((sid) => {
      const existing = assignmentMap[sid];
      if (existing && parseInt(existing.teacher_id) !== myTeacher) {
        conflicts.push({
          subject_id: sid,
          assign_id: existing.assign_id,
          teacher_id: existing.teacher_id,
          teacher_name: existing.teacher_name,
          subjects: existing.subjects,
          class_name: existing.class_name,
          section_name: existing.section_name,
        });
      }
    });

    if (conflicts.length > 0) {
      setConflictModal({
        conflicts,
        onReplace: () => {
          setConflictModal(null);
          doSave(selectedNewSubjects, conflicts);
        },
        onKeepOnlyNonConflicts: () => {
          const conflictIds = new Set(conflicts.map((c) => c.subject_id));
          const cleaned = selectedNewSubjects.filter((id) => !conflictIds.has(id));
          setConflictModal(null);
          if (cleaned.length === 0) {
            toast.info('No subjects left after removing conflicts');
            return;
          }
          doSave(cleaned, []);
        },
        onCancel: () => setConflictModal(null),
      });
      return;
    }

    doSave(selectedNewSubjects, []);
  };

  // Subject ids already assigned to the selected teacher — excluded from the
  // "assign new" dropdown so the same subject can't be picked twice.
  const assignedIdSet = useMemo(() => {
    const set = new Set();
    assignSubject.forEach((row) => {
      const sid = matchCatalogId(row);
      if (sid != null) set.add(sid);
    });
    return set;
  }, [assignSubject, matchCatalogId]);

  // Dropdown options — every catalog subject not already assigned to this
  // teacher. Subjects assigned to someone else are still shown, flagged with
  // a small warning so the user can knowingly replace them.
  const subjectOptions = useMemo(() => {
    return getCategories
      .filter((c) => !assignedIdSet.has(c.id))
      .map((c) => {
        const existing = assignmentMap[c.id];
        const isConflict = existing && parseInt(existing.teacher_id) !== parseInt(editFormData.teacher_id || 0);
        return {
          value: c.id,
          label: `${c.subjects} — ${c.class_name}${c.section_name ? ` (${c.section_name})` : ''}`,
          conflictTeacher: isConflict ? existing.teacher_name : null,
        };
      })
      .sort((a, b) => a.label.localeCompare(b.label));
  }, [getCategories, assignedIdSet, assignmentMap, editFormData.teacher_id]);

  const selectedOptionObjects = useMemo(
    () => subjectOptions.filter((o) => selectedNewSubjects.includes(o.value)),
    [subjectOptions, selectedNewSubjects]
  );

  const formatSubjectOption = (opt) => (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
      <span>{opt.label}</span>
      {opt.conflictTeacher && (
        <span
          style={{
            fontSize: 10, fontWeight: 700, color: '#92400e', background: '#fef3c7',
            border: '1px solid #fcd34d', borderRadius: 999, padding: '2px 7px', whiteSpace: 'nowrap',
          }}
        >
          assigned to {opt.conflictTeacher}
        </span>
      )}
    </div>
  );

  const filteredTeacherList = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return teacherList;
    return teacherList.filter((t) => (t.full_name || '').toLowerCase().includes(q));
  }, [teacherList, search]);

  // Set of teacher IDs that have at least one subject actually assigned.
  const assignedTeacherIds = useMemo(() => {
    const s = new Set();
    Object.values(assignmentMap).forEach((v) => {
      if (v && v.teacher_id != null) s.add(String(v.teacher_id));
    });
    return s;
  }, [assignmentMap]);

  // ── Master matrix data (teacher × class → subjects[]) ──
  const masterMatrix = useMemo(() => {
    const teacherMap = {};
    const classKeys = new Set();

    Object.values(assignmentMap).forEach((a) => {
      if (!a || a.teacher_id == null) return;
      const tid = String(a.teacher_id);
      if (!teacherMap[tid]) {
        teacherMap[tid] = { teacher_name: a.teacher_name, byClass: {} };
      }
      const ck = `${(a.class_name || '').trim()}|${(a.section_name || '').trim()}`;
      classKeys.add(ck);
      if (!teacherMap[tid].byClass[ck]) {
        teacherMap[tid].byClass[ck] = {
          class_name: a.class_name,
          section_name: a.section_name,
          subjects: [],
        };
      }
      teacherMap[tid].byClass[ck].subjects.push(a.subjects);
    });

    const classCols = Array.from(classKeys)
      .map((k) => {
        const [cn, sn] = k.split('|');
        return { key: k, class_name: cn, section_name: sn, label: sn ? `${cn} (${sn})` : cn };
      })
      .sort((a, b) => a.label.localeCompare(b.label));

    const rows = Object.entries(teacherMap)
      .map(([tid, info]) => ({ teacher_id: tid, ...info }))
      .sort((a, b) => (a.teacher_name || '').localeCompare(b.teacher_name || ''));

    return { rows, classCols };
  }, [assignmentMap]);

  const filteredMasterRows = useMemo(() => {
    const q = masterFilter.trim().toLowerCase();
    if (!q) return masterMatrix.rows;
    return masterMatrix.rows.filter((r) => (r.teacher_name || '').toLowerCase().includes(q));
  }, [masterMatrix.rows, masterFilter]);

  const totalAssignments = useMemo(() => Object.keys(assignmentMap).length, [assignmentMap]);

  const masterByClass = useMemo(() => {
    const classMap = {};
    Object.values(assignmentMap).forEach((a) => {
      if (!a) return;
      const ck = `${(a.class_name || '').trim()}|${(a.section_name || '').trim()}`;
      if (!classMap[ck]) {
        classMap[ck] = {
          key: ck,
          class_name: a.class_name,
          section_name: a.section_name,
          items: [],
        };
      }
      classMap[ck].items.push({
        subject: a.subjects,
        teacher_name: a.teacher_name,
        teacher_id: a.teacher_id,
      });
    });
    const rows = Object.values(classMap).map((c) => ({
      ...c,
      items: c.items.sort((x, y) => (x.subject || '').localeCompare(y.subject || '')),
    }));
    rows.sort((a, b) => {
      const la = `${a.class_name} ${a.section_name}`;
      const lb = `${b.class_name} ${b.section_name}`;
      return la.localeCompare(lb);
    });
    return rows;
  }, [assignmentMap]);

  const filteredMasterClassRows = useMemo(() => {
    const q = masterFilter.trim().toLowerCase();
    if (!q) return masterByClass;
    return masterByClass
      .map((c) => ({
        ...c,
        items: c.items.filter(
          (it) =>
            (it.subject || '').toLowerCase().includes(q) ||
            (it.teacher_name || '').toLowerCase().includes(q)
        ),
      }))
      .filter(
        (c) =>
          c.items.length > 0 ||
          `${c.class_name} ${c.section_name}`.toLowerCase().includes(q)
      );
  }, [masterByClass, masterFilter]);

  const teacherInitials = (name) =>
    (name || '').split(' ').filter(Boolean).slice(0, 2).map((w) => w[0]).join('').toUpperCase();

  return (
    <div className="ast-shell">
      <style>{`
        :root {
          --ast-primary: #EBD197;
          --ast-primary-dark: #d4b674;
          --ast-primary-light: #faf2da;
          --ast-primary-soft: #ebd197b2;
          --ast-danger: #dc2626;
          --ast-danger-light: #fee2e2;
          --ast-text: #1f2329;
          --ast-muted: #6c757d;
          --ast-border: #e6e8eb;
        }

        .ast-shell {
          display: flex; flex-direction: column; min-height: 100vh;
          background: #f4f6f8;
          font-family: "Segoe UI", system-ui, -apple-system, sans-serif;
        }

        .ast-page-header {
          background: linear-gradient(135deg, var(--ast-primary) 0%, var(--ast-primary-dark) 100%);
          padding: 16px 18px;
          display: flex; align-items: center; justify-content: space-between; gap: 10px;
        }
        .ast-page-header h2 { margin: 0; font-size: 17px; font-weight: 700; display: flex; align-items: center; gap: 10px; }
        .ast-master-btn {
          background: rgba(255,255,255,0.18); border: 1px solid rgba(255,255,255,0.35);
           padding: 8px 14px; border-radius: 8px;
          font-size: 13px; font-weight: 700; cursor: pointer;
          display: inline-flex; align-items: center; gap: 6px;
        }
        .ast-master-btn:hover { background: rgba(255,255,255,0.28); }

        .ast-tabs {
          display: flex; background: #fff; border-bottom: 1px solid var(--ast-border);
          position: sticky; top: 0; z-index: 5;
        }
        .ast-tab {
          flex: 1; padding: 14px 12px; background: transparent; border: none;
          font-size: 14px; font-weight: 600; color: var(--ast-muted); cursor: pointer;
          display: flex; align-items: center; justify-content: center; gap: 8px;
          border-bottom: 3px solid transparent; transition: all 0.2s ease;
          -webkit-tap-highlight-color: transparent;
        }
        .ast-tab.is-active { color: var(--ast-primary-dark); border-bottom-color: var(--ast-primary); background: var(--ast-primary-soft); }
        .ast-tab .ast-badge { background: var(--ast-primary); color: #fff; font-size: 11px; font-weight: 700; padding: 2px 8px; border-radius: 999px; min-width: 22px; }

        .ast-body { flex: 1; display: flex; flex-direction: row; gap: 16px; padding: 16px; box-sizing: border-box; min-height: 0; }
        .ast-pane { flex: 1; min-height: 0; }
        .ast-pane--list { max-width: 340px; min-width: 280px; }

        @media (max-width: 991px) {
          .ast-pane--form { display: ${mobileTab === 'form' ? 'block' : 'none'}; }
          .ast-pane--list { display: ${mobileTab === 'list' ? 'block' : 'none'}; max-width: none; min-width: 0; }
          .ast-body { padding: 12px; }
        }
        @media (min-width: 992px) {
          .ast-tabs { display: none; }
          .ast-pane--form, .ast-pane--list { display: block; }
        }

        /* ── Teacher list card ── */
        .ast-list-card {
          background: #fff; border-radius: 14px; overflow: hidden;
          border: 1px solid var(--ast-border); box-shadow: 0 2px 8px rgba(17,20,24,0.05);
        }
        .ast-list-card__head {
          background: linear-gradient(135deg, var(--ast-primary) 0%, var(--ast-primary-dark) 100%);
         padding: 16px 18px;
        }
        .ast-list-card__head h3 { margin: 0 0 4px 0; font-size: 16px; font-weight: 700; display: flex; align-items: center; gap: 8px; }
        .ast-list-card__head p { margin: 0; font-size: 12px;}
        .ast-list-card__body { padding: 14px; }

        .ast-list-search {
          width: 100%; padding: 10px 12px; border: 1px solid var(--ast-border); border-radius: 9px;
          font-size: 13px; margin-bottom: 12px; box-sizing: border-box;
        }
        .ast-list-search:focus { outline: none; border-color: var(--ast-primary); box-shadow: 0 0 0 3px var(--ast-primary-light); }

        .ast-list-scroll { max-height: 70vh; overflow-y: auto; }

        .ast-teacher-row {
          background: #fff; border: 1.5px solid var(--ast-border); border-radius: 12px;
          padding: 10px 12px; margin-bottom: 8px; cursor: pointer;
          display: flex; align-items: center; gap: 10px; transition: all 0.15s ease;
          -webkit-tap-highlight-color: transparent;
        }
        .ast-teacher-row:hover { border-color: var(--ast-primary); }
        .ast-teacher-row.is-active { background: var(--ast-primary-soft); border-color: var(--ast-primary); }
        .ast-teacher-row__avatar {
          width: 36px; height: 36px; border-radius: 50%; flex-shrink: 0;
          background: var(--ast-primary); color: #1f2329;
          display: flex; align-items: center; justify-content: center;
          font-size: 13px; font-weight: 700;
        }
        .ast-teacher-row__name {
          flex: 1; min-width: 0; font-size: 13px; font-weight: 700; color: var(--ast-text);
          overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
        }
        .ast-set-badge {
          background: #EBD197; color: #1f2329;
          font-size: 11px; font-weight: 700; padding: 3px 9px; border-radius: 999px;
          display: inline-flex; align-items: center; gap: 4px; flex-shrink: 0;
        }

        /* ── Form card (selected teacher) ── */
        .ast-form-card {
          background: #fff; border-radius: 14px;
          border: 1px solid var(--ast-border); box-shadow: 0 2px 8px rgba(17,20,24,0.05);
        }
        .ast-form-card__head {
          background: linear-gradient(135deg, var(--ast-primary) 0%, var(--ast-primary-dark) 100%);
          color: #fff; padding: 18px 20px;
          display: flex; align-items: center; gap: 14px;
        }
        .ast-form-card__avatar {
          width: 48px; height: 48px; border-radius: 50%; flex-shrink: 0;
          background: var(--ast-primary); color: #1f2329; border: 2px solid #1f2329;
          display: flex; align-items: center; justify-content: center;
          font-size: 17px; font-weight: 700;
        }
        .ast-form-card__head h3 { margin: 0 0 2px 0; font-size: 19px; font-weight: 700; color: black; }
        .ast-form-card__head p { margin: 0; font-size: 13px; color: black; font-weight: 700; }
        .ast-form-card__body { padding: 20px; }

        .ast-section-title {
          margin: 0 0 14px 0; font-size: 14px; font-weight: 700; color: var(--ast-text);
          display: flex; align-items: center; gap: 8px;
        }
        .ast-section-title i { color: var(--ast-primary); }

        .ast-shift-group { display: flex; gap: 10px; flex-wrap: wrap; margin-bottom: 16px; }
        .ast-shift-btn {
          flex: 1; min-width: 140px;
          background: #f7f9fc; border: 1.5px solid var(--ast-border);
          padding: 12px 14px; border-radius: 10px;
          font-size: 14px; font-weight: 600; cursor: pointer; color: var(--ast-text);
          display: inline-flex; align-items: center; justify-content: center; gap: 8px;
          transition: all 0.15s ease; min-height: 46px;
        }
        .ast-shift-btn.is-active {
          background: var(--ast-primary-soft); border-color: var(--ast-primary);
        }

        .ast-newsubject-row { display: flex; gap: 10px; align-items: flex-start; margin-bottom: 22px; flex-wrap: wrap; }
        .ast-newsubject-select { flex: 1; min-width: 240px; }
        .ast-assign-btn {
          background: var(--ast-primary);  border: none;
          padding: 0 22px; height: 46px; border-radius: 10px;
          font-size: 14px; font-weight: 700; cursor: pointer;
          display: inline-flex; align-items: center; gap: 8px;
          box-shadow: 0 3px 8px #ebd19765;
        }
        .ast-assign-btn:hover:not(:disabled) { background: var(--ast-primary-dark); }
        .ast-assign-btn:disabled { opacity: 0.5; cursor: not-allowed; box-shadow: none; }

        .ast-assigned-list { display: flex; flex-direction: column; gap: 8px; }
        .ast-assigned-row {
          display: flex; align-items: center; gap: 12px;
          background: #fff; border: 1px solid var(--ast-border); border-radius: 10px;
          padding: 10px 14px;
        }
        .ast-assigned-row__num {
          width: 26px; height: 26px; border-radius: 50%; flex-shrink: 0;
          background: var(--ast-primary-soft); color: black;
          font-size: 12px; font-weight: 700;
          display: flex; align-items: center; justify-content: center;
        }
        .ast-assigned-row__body { flex: 1; min-width: 0; }
        .ast-assigned-row__subject { font-size: 14px; font-weight: 700; color: var(--ast-text); }
        .ast-assigned-row__meta { font-size: 12px; color: var(--ast-muted); margin-top: 2px; }
        .ast-remove-btn {
          background: var(--ast-danger-light); color: var(--ast-danger); border: none;
          padding: 8px 14px; border-radius: 8px; font-size: 12px; font-weight: 700; cursor: pointer;
          display: inline-flex; align-items: center; gap: 6px; flex-shrink: 0;
        }
        .ast-remove-btn:hover { background: #fecaca; }

        .ast-empty { text-align: center; padding: 30px 16px; color: var(--ast-muted); font-size: 13px; }
        .ast-empty i { font-size: 24px; color: #d0d7e2; display: block; margin-bottom: 8px; }
        .ast-empty--big { padding: 80px 20px; }
        .ast-empty--big i { font-size: 32px; }

        /* ── Conflict modal ── */
        .ast-modal {
          position: fixed; inset: 0; z-index: 9999;
          background: rgba(17,20,24,0.55);
          display: flex; align-items: center; justify-content: center;
          padding: 14px;
        }
        .ast-modal__box {
          background: #fff; border-radius: 14px;
          width: 100%; max-width: 560px; max-height: 90vh;
          overflow: hidden; display: flex; flex-direction: column;
          box-shadow: 0 20px 60px rgba(0,0,0,0.4);
        }
        .ast-modal__head {
          background: linear-gradient(135deg, #f59e0b, #d97706);
          color: #fff; padding: 14px 18px;
          display: flex; align-items: center; gap: 10px;
        }
        .ast-modal__head i { font-size: 22px; }
        .ast-modal__head h3 { margin: 0; font-size: 16px; font-weight: 700; }
        .ast-modal__body { padding: 18px; overflow-y: auto; flex: 1; }
        .ast-modal__intro { color: #495057; font-size: 14px; margin-bottom: 14px; line-height: 1.5; }
        .ast-conflict {
          background: #fffbeb; border: 1px solid #fcd34d; border-left: 4px solid #f59e0b;
          border-radius: 10px; padding: 10px 12px; margin-bottom: 8px;
        }
        .ast-conflict__subject { font-weight: 700; font-size: 13px; color: var(--ast-text); margin-bottom: 4px; }
        .ast-conflict__teacher { font-size: 12px; color: #92400e; display: flex; align-items: center; gap: 6px; }
        .ast-conflict__teacher i { color: #d97706; }
        .ast-modal__foot {
          padding: 12px 18px; border-top: 1px solid var(--ast-border);
          display: flex; gap: 8px; flex-wrap: wrap;
        }
        .ast-modal-btn {
          flex: 1; min-width: 130px;
          padding: 11px 14px; border-radius: 8px;
          font-size: 13px; font-weight: 700; cursor: pointer;
          border: none; display: inline-flex; align-items: center; justify-content: center; gap: 6px;
          min-height: 44px;
        }
        .ast-modal-btn--replace { background: var(--ast-danger); color: #fff; }
        .ast-modal-btn--replace:hover { background: #c82333; }
        .ast-modal-btn--keep { background: var(--ast-primary-soft); }
        .ast-modal-btn--keep:hover { background: var(--ast-primary); }
        .ast-modal-btn--cancel { background: #f1f3f6; color: #495057; }

        /* ── Master Table modal ── */
        .ast-master {
          position: fixed; inset: 0; z-index: 9998;
          background: #fff; display: flex; flex-direction: column;
        }
        .ast-master__head {
          background: linear-gradient(135deg, var(--ast-primary) 0%, var(--ast-primary-dark) 100%);
          color: #fff; padding: 14px 18px;
          display: flex; align-items: center; justify-content: space-between; gap: 10px; flex-shrink: 0;
        }
        .ast-master__head h3 { margin: 0; font-size: 17px; font-weight: 700; display: flex; align-items: center; gap: 10px; }
        .ast-master__close {
          background: rgba(255,255,255,0.18); border: 1px solid rgba(255,255,255,0.35);
          color: #fff; cursor: pointer; width: 34px; height: 34px; border-radius: 50%;
          font-size: 20px; line-height: 1;
          display: flex; align-items: center; justify-content: center;
        }
        .ast-master__toolbar {
          padding: 12px 18px; background: #f7f9fc; border-bottom: 1px solid var(--ast-border);
          display: flex; gap: 10px; align-items: center; flex-wrap: wrap; flex-shrink: 0;
        }
        .ast-master__stats {
          display: flex; gap: 12px; flex-wrap: wrap;
          font-size: 12px; color: var(--ast-muted); font-weight: 600;
        }
        .ast-master__stats strong { color: var(--ast-text); font-size: 14px; }
        .ast-master__filter {
          flex: 1; min-width: 180px;
          padding: 9px 12px; border: 1px solid var(--ast-border); border-radius: 8px;
          font-size: 13px; background: #fff;
        }
        .ast-master__body { flex: 1; overflow: auto; -webkit-overflow-scrolling: touch; padding: 14px; }
        .ast-master__table {
          width: 100%; border-collapse: separate; border-spacing: 0;
          background: #fff; font-size: 12px;
          border: 1px solid var(--ast-border); border-radius: 10px; overflow: hidden;
        }
        .ast-master__table th, .ast-master__table td {
          border: 1px solid var(--ast-border); padding: 8px 10px; vertical-align: top;
        }
        .ast-master__table thead th {
          background: linear-gradient(135deg, var(--ast-primary) 0%, var(--ast-primary-dark) 100%);
          color: #fff; font-weight: 700; font-size: 11px;
          text-align: center; position: sticky; top: 0; z-index: 2;
          white-space: nowrap;
        }
        .ast-master__teacher-col {
          position: sticky; left: 0; background: #f7f9fc; z-index: 1;
          font-weight: 700; color: var(--ast-text); min-width: 160px; max-width: 220px;
        }
        .ast-master__teacher-col-head {
          position: sticky; left: 0; z-index: 3 !important; min-width: 160px; text-align: left !important;
        }
        .ast-master__subj-tag {
          display: inline-block;
          background: var(--ast-primary-light); color: #5b4a1a;
          border: 1px solid var(--ast-primary);
          font-size: 11px; font-weight: 600;
          padding: 3px 7px; border-radius: 999px;
          margin: 2px 3px 2px 0;
          white-space: nowrap;
        }
        .ast-master__cell-empty { color: #d0d7e2; text-align: center; font-size: 18px; }
        .ast-master__row-count {
          background: var(--ast-primary); color: #fff;
          font-size: 10px; font-weight: 700;
          padding: 2px 7px; border-radius: 999px; margin-left: 6px;
        }
        .ast-master__empty { text-align: center; padding: 60px 16px; color: var(--ast-muted); }
        .ast-master__empty i { font-size: 40px; color: #d0d7e2; display: block; margin-bottom: 12px; }

        .ast-master__viewtabs { display: inline-flex; gap: 4px; background: #fff; border: 1px solid var(--ast-border); border-radius: 8px; padding: 3px; }
        .ast-master__viewtab {
          background: transparent; border: none; padding: 7px 14px; cursor: pointer;
          font-size: 12px; font-weight: 700; color: var(--ast-muted); border-radius: 6px;
          display: inline-flex; align-items: center; gap: 6px;
          transition: all 0.15s ease;
        }
        .ast-master__viewtab.is-active { background: var(--ast-primary); color: #fff; }
      `}</style>

      {/* Header */}
      <div className="ast-page-header">
        <h2><i className="fas fa-chalkboard-teacher"></i> Assign Subjects to Teacher</h2>
        <button type="button" className="ast-master-btn" onClick={() => setShowMaster(true)}>
          <i className="fas fa-table"></i> Master Table
        </button>
      </div>

      {/* Mobile tabs */}
      <div className="ast-tabs">
        <button
          type="button"
          className={`ast-tab ${mobileTab === 'list' ? 'is-active' : ''}`}
          onClick={() => setMobileTab('list')}
        >
          <i className="fas fa-users"></i> Teachers
          {teacherList.length > 0 && <span className="ast-badge">{teacherList.length}</span>}
        </button>
        <button
          type="button"
          className={`ast-tab ${mobileTab === 'form' ? 'is-active' : ''}`}
          onClick={() => setMobileTab('form')}
        >
          <i className="fas fa-book-open"></i> Subjects
        </button>
      </div>

      <div className="ast-body">
        {/* TEACHER LIST PANE */}
        <div className="ast-pane ast-pane--list">
          <div className="ast-list-card">
            <div className="ast-list-card__head">
              <h3><i className="fas fa-users"></i> Teachers</h3>
              <p>Click a teacher to manage their subjects</p>
            </div>
            <div className="ast-list-card__body">
              <input
                type="text"
                className="ast-list-search"
                placeholder="🔍 Search teacher…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <div className="ast-list-scroll">
                {loadingList ? (
                  <div className="ast-empty"><i className="fas fa-spinner fa-spin"></i>Loading…</div>
                ) : filteredTeacherList.length === 0 ? (
                  <div className="ast-empty"><i className="fas fa-inbox"></i>No teachers yet.</div>
                ) : (
                  filteredTeacherList.map((t) => {
                    const isActive = String(t.id) === String(editFormData.teacher_id);
                    const hasAssignments = assignedTeacherIds.has(String(t.id));
                    return (
                      <div
                        key={t.id}
                        className={`ast-teacher-row ${isActive ? 'is-active' : ''}`}
                        onClick={() => selectTeacher(t.id)}
                        role="button"
                        tabIndex={0}
                      >
                        <div className="ast-teacher-row__avatar">
                          {teacherInitials(t.full_name) || <i className="fas fa-user"></i>}
                        </div>
                        <div className="ast-teacher-row__name">{t.full_name}</div>
                        {hasAssignments && (
                          <span className="ast-set-badge"><i className="fas fa-check"></i> Set</span>
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
        <div className="ast-pane ast-pane--form">
          {!editFormData.teacher_id ? (
            <div className="ast-empty ast-empty--big">
              <i className="fas fa-arrow-left"></i>
              Pick a teacher from the list to manage their subjects.
            </div>
          ) : (
            <div className="ast-form-card">
              <div className="ast-form-card__head">
                <div className="ast-form-card__avatar">{teacherInitials(findTeacherName())}</div>
                <div>
                  <h3>{findTeacherName()}</h3>
                  <p>{assignSubject.length} subject{assignSubject.length === 1 ? '' : 's'} assigned</p>
                </div>
              </div>

              <div className="ast-form-card__body">
                <h4 className="ast-section-title"><i className="fas fa-plus-circle"></i> Assign New Subjects</h4>

                <div className="ast-shift-group">
                  {['Morning', 'Evening'].map((sh) => (
                    <button
                      key={sh}
                      type="button"
                      className={`ast-shift-btn ${editFormData.shift === sh ? 'is-active' : ''}`}
                      onClick={() => setEditFormData((prev) => ({ ...prev, shift: sh }))}
                    >
                      <i className={`fas ${sh === 'Morning' ? 'fa-sun' : 'fa-moon'}`}></i> {sh}
                    </button>
                  ))}
                </div>

                <div className="ast-newsubject-row">
                  <div className="ast-newsubject-select">
                    <Select
                      isMulti
                      options={subjectOptions}
                      value={selectedOptionObjects}
                      onChange={(opts) => setSelectedNewSubjects(opts ? opts.map((o) => o.value) : [])}
                      placeholder="Choose subjects to assign…"
                      formatOptionLabel={formatSubjectOption}
                      styles={{ control: (b) => ({ ...b, minHeight: '46px', borderRadius: '10px' }) }}
                    />
                  </div>
                  <button
                    type="button"
                    className="ast-assign-btn"
                    onClick={handleAssignNew}
                    disabled={saving || selectedNewSubjects.length === 0}
                  >
                    <i className={`fas ${saving ? 'fa-spinner fa-spin' : 'fa-plus'}`}></i>
                    {saving ? 'Saving…' : 'Assign'}
                  </button>
                </div>

                <h4 className="ast-section-title" style={{ marginTop: 26 }}>
                  <i className="fas fa-list-check"></i> Currently Assigned Subjects
                </h4>

                {loadingAssigned ? (
                  <div className="ast-empty"><i className="fas fa-spinner fa-spin"></i>Loading current assignments…</div>
                ) : assignSubject.length === 0 ? (
                  <div className="ast-empty">
                    <i className="fas fa-info-circle"></i>
                    No subjects assigned yet — use the dropdown above to add some.
                  </div>
                ) : (
                  <div className="ast-assigned-list">
                    {assignSubject.map((row, i) => (
                      <div className="ast-assigned-row" key={row.id}>
                        <span className="ast-assigned-row__num">{i + 1}</span>
                        <div className="ast-assigned-row__body">
                          <div className="ast-assigned-row__subject">{row.subjects}</div>
                          <div className="ast-assigned-row__meta">
                            {row.class_name}{row.section_name ? ` — ${row.section_name}` : ''}
                          </div>
                        </div>
                        <button
                          type="button"
                          className="ast-remove-btn"
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

      {/* Master Table modal */}
      {showMaster && (
        <div className="ast-master" role="dialog" aria-modal="true">
          <div className="ast-master__head">
            <h3><i className="fas fa-table"></i> Master Assignment Table</h3>
            <button type="button" className="ast-master__close" onClick={() => setShowMaster(false)} aria-label="Close">×</button>
          </div>

          <div className="ast-master__toolbar">
            <div className="ast-master__viewtabs">
              <button
                type="button"
                className={`ast-master__viewtab ${masterView === 'teacher' ? 'is-active' : ''}`}
                onClick={() => { setMasterView('teacher'); setMasterFilter(''); }}
              >
                <i className="fas fa-chalkboard-teacher"></i> By Teacher
              </button>
              <button
                type="button"
                className={`ast-master__viewtab ${masterView === 'class' ? 'is-active' : ''}`}
                onClick={() => { setMasterView('class'); setMasterFilter(''); }}
              >
                <i className="fas fa-school"></i> By Class
              </button>
            </div>
            <div className="ast-master__stats">
              {masterView === 'teacher' ? (
                <>
                  <span><strong>{masterMatrix.rows.length}</strong> teachers</span>
                  <span>·</span>
                  <span><strong>{masterMatrix.classCols.length}</strong> classes</span>
                </>
              ) : (
                <>
                  <span><strong>{masterByClass.length}</strong> classes</span>
                  <span>·</span>
                  <span><strong>{masterMatrix.rows.length}</strong> teachers</span>
                </>
              )}
              <span>·</span>
              <span><strong>{totalAssignments}</strong> assignments</span>
            </div>
            <input
              type="text"
              className="ast-master__filter"
              placeholder={masterView === 'teacher' ? '🔍 Filter by teacher name…' : '🔍 Filter by class / subject / teacher…'}
              value={masterFilter}
              onChange={(e) => setMasterFilter(e.target.value)}
            />
          </div>

          <div className="ast-master__body">
            {masterView === 'teacher' ? (
              masterMatrix.rows.length === 0 ? (
                <div className="ast-master__empty">
                  <i className="fas fa-inbox"></i>
                  No assignments yet. Assign subjects to a teacher to see them here.
                </div>
              ) : filteredMasterRows.length === 0 ? (
                <div className="ast-master__empty">
                  <i className="fas fa-search"></i>
                  No teacher matches your filter.
                </div>
              ) : (
                <table className="ast-master__table">
                  <thead>
                    <tr>
                      <th className="ast-master__teacher-col-head">Teacher</th>
                      {masterMatrix.classCols.map((c) => (
                        <th key={c.key}>{c.label}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {filteredMasterRows.map((row) => {
                      const totalForTeacher = Object.values(row.byClass).reduce(
                        (sum, cell) => sum + cell.subjects.length,
                        0
                      );
                      return (
                        <tr key={row.teacher_id}>
                          <td className="ast-master__teacher-col">
                            {row.teacher_name}
                            <span className="ast-master__row-count">{totalForTeacher}</span>
                          </td>
                          {masterMatrix.classCols.map((c) => {
                            const cell = row.byClass[c.key];
                            if (!cell || cell.subjects.length === 0) {
                              return <td key={c.key} className="ast-master__cell-empty">·</td>;
                            }
                            return (
                              <td key={c.key}>
                                {cell.subjects.map((sub, i) => (
                                  <span key={i} className="ast-master__subj-tag">{sub}</span>
                                ))}
                              </td>
                            );
                          })}
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              )
            ) : masterByClass.length === 0 ? (
              <div className="ast-master__empty">
                <i className="fas fa-inbox"></i>
                No assignments yet.
              </div>
            ) : filteredMasterClassRows.length === 0 ? (
              <div className="ast-master__empty">
                <i className="fas fa-search"></i>
                Nothing matches your filter.
              </div>
            ) : (
              <table className="ast-master__table">
                <thead>
                  <tr>
                    <th style={{ width: 50 }}>#</th>
                    <th className="ast-master__teacher-col-head" style={{ minWidth: 180 }}>Class</th>
                    <th>Subjects &amp; Teachers</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredMasterClassRows.map((cls, ci) => (
                    <tr key={cls.key}>
                      <td style={{ textAlign: 'center', verticalAlign: 'middle', background: 'var(--ast-primary-light)', fontWeight: 700, color: '#5b4a1a' }}>
                        {ci + 1}
                      </td>
                      <td className="ast-master__teacher-col" style={{ verticalAlign: 'middle' }}>
                        <i className="fas fa-school" style={{ color: 'var(--ast-primary-dark)', marginRight: 6 }}></i>
                        {cls.class_name}{cls.section_name ? ` (${cls.section_name})` : ''}
                        <div style={{ fontSize: 10, color: '#6c757d', fontWeight: 600, marginTop: 4 }}>
                          {cls.items.length} subject{cls.items.length === 1 ? '' : 's'}
                        </div>
                      </td>
                      <td style={{ padding: '8px 10px' }}>
                        {cls.items.length === 0 ? (
                          <span style={{ color: '#9aa3af', fontStyle: 'italic', fontSize: 12 }}>No subjects assigned</span>
                        ) : (
                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                            {cls.items.map((it, i) => (
                              <span
                                key={i}
                                style={{
                                  display: 'inline-flex', alignItems: 'center',
                                  border: '1px solid var(--ast-primary)', borderRadius: 6, overflow: 'hidden',
                                  fontSize: 11, fontWeight: 600,
                                }}
                                title={`${it.subject} → ${it.teacher_name}`}
                              >
                                <span style={{ padding: '4px 8px', background: 'var(--ast-primary-light)', color: '#5b4a1a' }}>
                                  {it.subject}
                                </span>
                                <span style={{ padding: '4px 8px', background: '#1f2329', color: 'var(--ast-primary)', display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                                  <i className="fas fa-user" style={{ fontSize: 9 }}></i>
                                  {it.teacher_name || '—'}
                                </span>
                              </span>
                            ))}
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      )}

      {/* Conflict popup */}
      {conflictModal && (
        <div className="ast-modal" role="dialog" aria-modal="true">
          <div className="ast-modal__box">
            <div className="ast-modal__head">
              <i className="fas fa-exclamation-triangle"></i>
              <h3>Subjects already assigned</h3>
            </div>
            <div className="ast-modal__body">
              <p className="ast-modal__intro">
                These subjects are <strong>already assigned to another teacher</strong>.
                Choose what to do:
              </p>
              {conflictModal.conflicts.map((c, i) => (
                <div key={i} className="ast-conflict">
                  <div className="ast-conflict__subject">
                    {c.subjects} <small style={{ color: '#6c757d', fontWeight: 500 }}>· {c.class_name} ({c.section_name})</small>
                  </div>
                  <div className="ast-conflict__teacher">
                    <i className="fas fa-chalkboard-teacher"></i>
                    Currently assigned to: <strong>{c.teacher_name}</strong>
                  </div>
                </div>
              ))}
              <p style={{ marginTop: 14, fontSize: 12, color: '#6c757d' }}>
                <strong>Replace</strong> will move these subjects from the old teacher to <strong>{findTeacherName()}</strong>.
              </p>
            </div>
            <div className="ast-modal__foot">
              <button type="button" className="ast-modal-btn ast-modal-btn--cancel" onClick={conflictModal.onCancel}>
                <i className="fas fa-arrow-left"></i> Cancel
              </button>
              <button type="button" className="ast-modal-btn ast-modal-btn--keep" onClick={conflictModal.onKeepOnlyNonConflicts}>
                <i className="fas fa-filter"></i> Skip Conflicts
              </button>
              <button type="button" className="ast-modal-btn ast-modal-btn--replace" onClick={conflictModal.onReplace}>
                <i className="fas fa-exchange-alt"></i> Replace
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AssignSubjectTeacher;