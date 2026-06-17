import React, {
  useEffect,
  useState,
  useCallback,
  useContext,
  useRef,
} from "react";
import axios from "axios";
import ReactPaginate from "react-paginate";
import AcademicSessionContext from "./AcademicSessionContext";
import { useAuth } from "./AuthContext";
import Select from "react-select";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useReactToPrint } from "react-to-print";
import AdmissionForm from "./AdmissionForm"; // Import the inline edit component
import CharacterCertificate from './CharacterCertificate';

const AdmissionList = ({ teacherAssignments = null } = {}) => {
  const initialSession = {
    session_id: "",
  };

  const initialStates = {
    selectedOption: null,
    getSearchClass: null,
    getSearchSection: null,
    searchReport: {
      search: "",
    },
  };

  const initialFormData = {
    class_id: "",
    summary_report: "",
    shift: "",
    section_id: "",
    category_id: "",
    status: "",
    from_date: "",
    to_date: "",
    search: "",
  };

  // In teacher mode we leave class_id empty by default so the new multi-fetch
  // path in fetchData pulls students from ALL of the teacher's assigned
  // classes at once. The teacher can narrow down via the Class dropdown.
  const [editFormData, setEditFormData] = useState(initialFormData);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItem, setTotalItemGet] = useState(10);
  const [data, setData] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, totalPagesGet] = useState("");
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { academicSession } = useContext(AcademicSessionContext);

  const [showCharacterCertificate, setShowCharacterCertificate] = useState(false);
  const [selectedAdmission, setSelectedAdmission] = useState(null);

  const [getSession, setSession] = useState(initialSession);

  const [searchTerm, setSearchTerm] = useState("");

  const [openDropdownIndex, setOpenDropdownIndex] = useState(null);

  // Step 2: Add this useEffect
  useEffect(() => {
    const handleClickOutside = () => {
      setOpenDropdownIndex(null);
    };

    if (openDropdownIndex !== null) {
      document.addEventListener("click", handleClickOutside);
    }

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [openDropdownIndex]);

  const matchesSearch = (field, term) => {
    return field ? field.toString().toLowerCase().includes(term) : false;
  };

  const [getCategories, setCategories] = useState([]);

  const [showEdit, setShowEdit] = useState(false);

  const [getClasses, setClasses] = useState([]);

  const [getSections, setSections] = useState([]);

  const componentRef = useRef(); // Reference for printing

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

  const formatDate = (dateString) => {
    const date = new Date(dateString);

    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();

    return `${day}-${month}-${year}`;
  };

  // Reset function — teacher mode reset clears class too, since the empty
  // state already scopes the multi-fetch to all assigned classes.
  const resetStates = () => {
    setEditFormData(initialFormData);
  };

  const [admission, setAdmission] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (academicSession) {
      setSession((prevFormData) => ({
        ...prevFormData,
        session_id: parseInt(academicSession),
      }));
    }
  }, [academicSession]);

  useEffect(() => {
    const fetchClasses = (campus_id) => {
      axios
        .get(process.env.REACT_APP_API_BASE_URL + `/get-classes/${campus_id}`)
        .then((res) => {
          // If invoked from TeacherProfile, restrict the dropdown to only the
          // teacher's assigned class+section combinations.
          if (teacherAssignments && Array.isArray(teacherAssignments) && teacherAssignments.length > 0) {
            const allowedPairs = new Set(
              teacherAssignments
                .filter((a) => a && a.class_id != null && a.section_id != null)
                .map((a) => `${a.class_id}-${a.section_id}`)
            );
            const filtered = res.data.results.filter((c) =>
              allowedPairs.has(`${c.id}-${c.section_id}`)
            );
            setClasses(filtered);
          } else {
            setClasses(res.data.results);
          }
        })
        .catch((err) => console.log(err));
    };

    // Ensure user.campus_id is defined before calling fetchClasses
    if (user && user.user.campus_id) {
      fetchClasses(user.user.campus_id);
    }
  }, [teacherAssignments]); // Re-run when teacher assignments change

  const findClassLabel = () => {
    if (!editFormData.class_id || !editFormData.section_id) {
      return "";
    }
    const classObj = getClasses.find(
      (class_get) =>
        class_get.id === parseInt(editFormData.class_id) &&
        class_get.section_id === parseInt(editFormData.section_id)
    );
    if (classObj) {
      return `${classObj.class} (${classObj.section_name})`;
    }
    return "";
  };

  const handleClassChange = (selectedOption) => {
    const [class_id, section_id] = selectedOption
      ? selectedOption.value.split(",")
      : ["", ""];
    setEditFormData({ ...editFormData, class_id, section_id });
  };

  const classOptions = [
    { value: "", label: "Select Class" },
    ...getClasses.map((class_get) => ({
      value: `${class_get.id},${class_get.section_id}`,
      label: `${class_get.class} (${class_get.section_name})`,
    })),
  ];

  function convertDates(date) {
    const d = new Date(date);

    // Get day, month, and year
    const day = d.getDate().toString().padStart(2, "0"); // Ensure 2-digit day
    const month = (d.getMonth() + 1).toString().padStart(2, "0"); // Month is zero-indexed
    const year = d.getFullYear();

    // Return formatted date as dd-mm-yyyy
    return `${day}-${month}-${year}`;
  }

  useEffect(() => {
    const fetchSections = (campus_id) => {
      axios
        .get(process.env.REACT_APP_API_BASE_URL + `/get-sections/${campus_id}`)
        .then((res) => {
          setSections(res.data.results);
        })
        .catch((err) => console.log(err));
    };

    // Ensure user.campus_id is defined before calling fetchClasses
    if (user && user.user.campus_id) {
      fetchSections(user.user.campus_id);
    }
  }, []); // Dependencies array to re-run the effect when user changes

  const section_option = getSections.map((sections) => ({
    value: sections.id,
    label: sections.section_name, // Assuming 'category' is the property name for category name
  }));

  const classes_option = getClasses.map((classes) => ({
    value: classes.id,
    label: classes.class, // Assuming 'category' is the property name for category name
  }));

  const categories_option = getCategories.map((category) => ({
    value: category.id,
    label: category.category, // Assuming 'category' is the property name for category name
  }));

  const [report, getAllReports] = useState({
    from_date: "",
    to_date: "",
    report_type: "",
  });

  const [admissionData, setAdmissionData] = useState(null);

  const [voucherData, setVoucherData] = useState([]);

  const [activitiesData, setActivitiesData] = useState([]);

  const [disciplineData, setDisciplineData] = useState([]);

  const [getSLCdata, setSLCData] = useState(null);

  const [showData, setShowData] = useState(false);

  const [showSLCData, setSLCShow] = useState(false);

  const [showCategorySummary, setCategorySummary] = useState(false);

  const [isFetchingSummary, setIsFetchingSummary] = useState(false);

  const [categorywiseSummaryData, setCategoryWiseSummaryData] = useState([]);

  const [uniqueCategories, setUniqueCategories] = useState([]);

  const [showNewAdmissionSummary, setNewAdmissionSummary] = useState(false);

  const [isFetchingNewAdmissionSummary, setIsFetchingNewAdmissionSummary] =
    useState(false);

  const [newAdmissionSummaryData, setNewAdmissionSummaryData] = useState([]);

  const [showNewSlcSummary, setSlcSummary] = useState(false);

  const [isFetchingSlcSummary, setIsFetchingSlcSummary] = useState(false);

  const [slcSummaryData, setSlcSummaryData] = useState([]);

  const [showStatusWiseSummary, setStatusWiseSummary] = useState(false);

  const [isFetchingStatusWiseSummary, setIsFetchingStatusWiseSummary] =
    useState(false);

  const [statusWiseSummaryData, setStatuswiseSummaryData] = useState([]);

  const [showStruckOffSummary, setStruckOffSummary] = useState(false);

  const [isFetchingStruckOffSummary, setIsFetchingStruckOffSummary] =
    useState(false);

  const [StruckOffSummaryData, setStruckOffSummaryData] = useState([]);

  // Add these state variables at the top of your component
  const [isPromoted, setIsPromoted] = useState(false);
  const [promotedToClass, setPromotedToClass] = useState("");

  const viewAdmission = (admission_id, campus_id, session_id) => {
    axios
      .get(
        process.env.REACT_APP_API_BASE_URL +
          `/view-admission/${admission_id}/${campus_id}/${session_id}`
      )
      .then((response) => {
        setAdmissionData(response.data.results[0]);
        setVoucherData(response.data.results);
        setActivitiesData(response.data.activities);
        setDisciplineData(response.data.discipline);
        setShowData(true);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  const handleHide = () => {
    setShowData(false);
    setSLCShow(false);
    setAdmissionData(null);

    setCategorySummary(false);
    setCategoryWiseSummaryData([]);
    setUniqueCategories([]);

    setNewAdmissionSummary(false);
    setIsFetchingNewAdmissionSummary(false);
    setNewAdmissionSummaryData([]);

    setSlcSummary(false);
    setIsFetchingSlcSummary(false);
    setSlcSummaryData([]);

    setStatusWiseSummary(false);
    setIsFetchingStatusWiseSummary(false);
    setStatuswiseSummaryData([]);

    setStruckOffSummary(false);
    setIsFetchingStruckOffSummary(false);
    setStruckOffSummaryData([]);
  };

  function getReport() {
    if (report.report_type === "pdf") {
      // pdfReport();
    } else if (report.report_type === "excel") {
      getAdmissionExcelReport();
    }
  }

  const handleTotalItemChange = (event) => {
    const newValue = event.target.value;
    setTotalItemGet(newValue);
  };

  const editAdmission = (admission_id) => {
    axios
      .get(
        process.env.REACT_APP_API_BASE_URL + `/get-admission/${admission_id}`
      )
      .then((response) => {
        const admissionData = response.data;
        localStorage.setItem("admission", JSON.stringify(admissionData));
        setShowEdit(true);
        // navigate('/admission-form-edit');
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  const handlePageChange = ({ selected }) => {
    setCurrentPage(selected + 1);
  };

  // const handleKeyDown = (e) => {
  //     if (e.key === 'Enter') {
  //         getSearchReport(searchReport);
  //         fetchData();
  //     }
  // };

  const deleteAdmission = (
    admission_id,
    full_name,
    class_name,
    section_name,
    father_name
  ) => {
    const confirmDeletion = window.confirm("Deleted! Are you sure?");
    if (confirmDeletion) {
      // Construct the URL path with encoded parameters
      const urlPath = `/delete-admission/${admission_id}/${user.user.user_id}/${
        user.user.campus_id
      }/${academicSession}/${encodeURIComponent(
        full_name
      )}/${encodeURIComponent(class_name)}/${encodeURIComponent(
        section_name
      )}/${encodeURIComponent(father_name)}`;

      // Make sure the base URL doesn't have trailing slashes
      const baseUrl = process.env.REACT_APP_API_BASE_URL.replace(/\/+$/, "");

      axios
        .get(baseUrl + urlPath)
        .then((response) => {
          console.log("Admission deleted successfully:", response.data);
          setData((prevData) =>
            prevData.filter((admission) => admission.id !== admission_id)
          );
        })
        .catch((error) => {
          console.error("Error deleting Admission:", error);
        });
    }
  };

  // Restrict student rows to teacher's assigned class+section combos.
  // Once teacherAssignments is provided (non-null), the list is locked to
  // those classes — even an empty array means "no classes assigned, show nothing".
  const isTeacherScoped =
    teacherAssignments !== null && Array.isArray(teacherAssignments);

  const allowedClassSectionSet = React.useMemo(() => {
    if (!isTeacherScoped) return null;
    return new Set(
      teacherAssignments
        .filter((a) => a && a.class_id != null && a.section_id != null)
        .map((a) => `${a.class_id}-${a.section_id}`)
    );
  }, [isTeacherScoped, teacherAssignments]);


  const fetchData = (shouldLoad = true) => {
    if (shouldLoad) setLoading(true);

    const commonParams = {
      from_date: editFormData.from_date,
      to_date: editFormData.to_date,
      category_id: editFormData.category_id,
      status: editFormData.status,
      search: editFormData.search,
      shift: editFormData.shift,
      session_id: academicSession,
      campus_id: user.user.campus_id,
      user_id: user.user.user_id,
    };

    // Teacher mode + no specific class selected → fetch each assigned
    // class+section in parallel, merge, then paginate client-side. This
    // guarantees the teacher only ever sees students from her own classes
    // regardless of backend support for teacher_assignments.
    if (
      isTeacherScoped &&
      (!editFormData.class_id || !editFormData.section_id) &&
      teacherAssignments.length > 0
    ) {
      const seen = new Set();
      const uniquePairs = teacherAssignments
        .filter((a) => a && a.class_id != null && a.section_id != null)
        .filter((a) => {
          const key = `${a.class_id}-${a.section_id}`;
          if (seen.has(key)) return false;
          seen.add(key);
          return true;
        });

      if (uniquePairs.length === 0) {
        setData([]);
        setTotalCount(0);
        totalPagesGet(0);
        setLoading(false);
        return;
      }

      Promise.all(
        uniquePairs.map((p) =>
          axios.get(process.env.REACT_APP_API_BASE_URL + "/admission-list", {
            params: {
              ...commonParams,
              page: 1,
              limit: 1000, // pull all rows for this class; merge below
              class_id: p.class_id,
              section_id: p.section_id,
            },
          })
        )
      )
        .then((responses) => {
          const merged = responses.flatMap((r) => (r.data && r.data.results) || []);
          // Dedupe by admission id in case backend returns overlaps
          const byId = new Map();
          merged.forEach((row) => {
            if (row && row.id != null) byId.set(row.id, row);
          });
          const allRows = Array.from(byId.values());
          const total = allRows.length;
          const pages = Math.max(1, Math.ceil(total / totalItem));
          const start = (currentPage - 1) * totalItem;
          const pageRows = allRows.slice(start, start + totalItem);
          setData(pageRows);
          setTotalCount(total);
          totalPagesGet(pages);
          setLoading(false);
        })
        .catch((err) => {
          console.log(err);
          setData([]);
          setLoading(false);
        });
      return;
    }

    // Single-class fetch (admin always, or teacher with a class chosen)
    axios
      .get(process.env.REACT_APP_API_BASE_URL + "/admission-list", {
        params: {
          ...commonParams,
          page: currentPage,
          limit: totalItem,
          class_id: editFormData.class_id,
          section_id: editFormData.section_id,
          ...(isTeacherScoped
            ? { teacher_assignments: JSON.stringify(teacherAssignments) }
            : {}),
        },
      })
      .then((res) => {
        let rows = res.data.results || [];
        if (allowedClassSectionSet && rows.length > 0 && rows[0].class_id != null) {
          rows = rows.filter((r) =>
            allowedClassSectionSet.has(`${r.class_id}-${r.section_id}`)
          );
        }
        setData(rows);
        setTotalCount(res.data.overallTotal);
        totalPagesGet(res.data.totalPages);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  };

  useEffect(() => {
    if (academicSession) {
      fetchData(false);
    }
  }, [academicSession, currentPage, totalItem]);

  const searchData = () => {
    // setLoading(true);
    fetchData(false);
  };

  const viewData = () => {
    if (editFormData.summary_report == "student_summary_campuswise") {
      setIsFetchingSummary(true);
      axios
        .get(process.env.REACT_APP_API_BASE_URL + "/summary-report", {
          params: {
            session_id: academicSession,
            campus_id: user.user.campus_id,
            shift: editFormData.shift,
            from_date: editFormData.from_date,
            to_date: editFormData.to_date,
          },
        })
        .then((res) => {
          // Update state
          setCategoryWiseSummaryData(res.data.results);
          // Use the response data directly instead of the state
          if (
            res.data.results.length > 0 &&
            editFormData.summary_report === "student_summary_campuswise"
          ) {
            const categories = [
              ...new Set(res.data.results.map((item) => item.category)),
            ];
            setUniqueCategories(categories);
            // console.log(categories);
            setCategorySummary(true);
            setIsFetchingSummary(false);
          }

          // setLoading(false);
        })
        .catch((err) => {
          console.log(err);
          setIsFetchingSummary(false);
        });
    } else if (
      editFormData.summary_report == "new_admission_summary_campuswise"
    ) {
      setIsFetchingNewAdmissionSummary(true);

      axios
        .get(
          process.env.REACT_APP_API_BASE_URL + "/summary-report-new-admission",
          {
            params: {
              session_id: academicSession,
              campus_id: user.user.campus_id,
              shift: editFormData.shift,
              from_date: editFormData.from_date,
              to_date: editFormData.to_date,
            },
          }
        )
        .then((res) => {
          setNewAdmissionSummaryData(res.data.results);
          setIsFetchingNewAdmissionSummary(false);
          setNewAdmissionSummary(true);
        })
        .catch((err) => {
          console.log(err);
          setIsFetchingNewAdmissionSummary(false);
        });
    } else if (editFormData.summary_report == "slc_summary_campuswise") {
      setIsFetchingSlcSummary(true);

      axios
        .get(process.env.REACT_APP_API_BASE_URL + "/summary-report-slc", {
          params: {
            session_id: academicSession,
            campus_id: user.user.campus_id,
            shift: editFormData.shift,
            from_date: editFormData.from_date,
            to_date: editFormData.to_date,
          },
        })
        .then((res) => {
          setSlcSummaryData(res.data.results);
          setSlcSummary(true);
          setIsFetchingSlcSummary(false);
        })
        .catch((err) => {
          setIsFetchingSlcSummary(false);
        });
    } else if (editFormData.summary_report == "statuswise_summary_campuswise") {
      setIsFetchingStatusWiseSummary(true);

      axios
        .get(
          process.env.REACT_APP_API_BASE_URL + "/summary-report-all-status",
          {
            params: {
              session_id: academicSession,
              campus_id: user.user.campus_id,
              shift: editFormData.shift,
              from_date: editFormData.from_date,
              to_date: editFormData.to_date,
            },
          }
        )
        .then((res) => {
          console.log(res.data.results);
          setStatuswiseSummaryData(res.data.results);
          setStatusWiseSummary(true);
          setIsFetchingStatusWiseSummary(false);
        })
        .catch((err) => {
          setIsFetchingStatusWiseSummary(false);
        });
    } else if (editFormData.summary_report == "struck_off_summary") {
      setIsFetchingStatusWiseSummary(true);

      axios
        .get(
          process.env.REACT_APP_API_BASE_URL + "/summary-report-struck-off",
          {
            params: {
              session_id: academicSession,
              campus_id: user.user.campus_id,
              shift: editFormData.shift,
              from_date: editFormData.from_date,
              to_date: editFormData.to_date,
            },
          }
        )
        .then((res) => {
          console.log(res.data.results);
          setStruckOffSummaryData(res.data.results);
          setStruckOffSummary(true);
          setIsFetchingStruckOffSummary(false);
        })
        .catch((err) => {
          setIsFetchingStruckOffSummary(false);
        });
    } else if (editFormData.summary_report == "view_house_and_club_report") {
      // console.log(editFormData.summary_report);

      setIsFetchingStatusWiseSummary(true);

      axios
        .get(
          process.env.REACT_APP_API_BASE_URL + "/view-house-and-club-report",
          {
            params: {
              session_id: academicSession,
              campus_id: user.user.campus_id,
              shift: editFormData.shift,
              class_id: editFormData.class_id,
              section_id: editFormData.section_id,
              shift: editFormData.shift,
            },
          }
        )
        .then((res) => {
          console.log(res.data.results);
          setStruckOffSummaryData(res.data.results);
          setStruckOffSummary(true);
          setIsFetchingStruckOffSummary(false);
        })
        .catch((err) => {
          setIsFetchingStruckOffSummary(false);
        });
    }
  };

  // const groupedData = categorywiseSummaryData.reduce((acc, item) => {
  //     const key = `${item.class}-${item.section_name}`;
  //     if (!acc[key]) {
  //         acc[key] = {
  //             class: item.class,
  //             section: item.section_name,
  //             categories: {},
  //             total_students: 0
  //         };
  //     }
  //     acc[key].categories[item.category] = item.total_students;
  //     acc[key].total_students += item.total_students;
  //     return acc;
  // }, {});

  // const groupedData = categorywiseSummaryData.reduce((acc, item) => {
  //     const key = `${item.class}-${item.section_name}`;
  //     if (!acc[key]) {
  //         acc[key] = {
  //             class: item.class,
  //             section: item.section_name,
  //             categories: {},
  //             male_students: 0,
  //             female_students: 0,
  //             total_students: 0
  //         };
  //     }

  //     acc[key].categories[item.category] = item.total_students;
  //     acc[key].male_students += item.male_students;  // Add male students
  //     acc[key].female_students += item.female_students;  // Add female students
  //     acc[key].total_students += item.total_students;
  //     return acc;
  // }, {});

  //     const groupedData = categorywiseSummaryData.reduce((acc, item) => {
  //     const key = `${item.class}-${item.section_name}`;
  //     if (!acc[key]) {
  //         acc[key] = {
  //             class: item.class,
  //             parent_class: item.parent_class,
  //             section: item.section_name,
  //             categories: {},
  //             male_students: 0,
  //             female_students: 0,
  //             total_students: 0
  //         };
  //     }

  //     acc[key].categories[item.category] = item.total_students;
  //     acc[key].male_students += item.male_students;
  //     acc[key].female_students += item.female_students;
  //     acc[key].total_students += item.total_students;
  //     return acc;
  // }, {});

  // // Create a structure grouped by parent class
  // const parentClassGroups = Object.values(groupedData).reduce((acc, item) => {
  //     if (!acc[item.parent_class]) {
  //         acc[item.parent_class] = {
  //             classes: [],
  //             categories: {},
  //             male_students: 0,
  //             female_students: 0,
  //             total_students: 0
  //         };
  //     }

  //     acc[item.parent_class].classes.push(item);
  //     acc[item.parent_class].male_students += item.male_students;
  //     acc[item.parent_class].female_students += item.female_students;
  //     acc[item.parent_class].total_students += item.total_students;

  //     // Sum categories for parent class
  //     Object.keys(item.categories).forEach(category => {
  //         acc[item.parent_class].categories[category] =
  //             (acc[item.parent_class].categories[category] || 0) + item.categories[category];
  //     });

  //     return acc;
  // }, {});

  // // Flatten the data for rendering with parent headers and subtotal footers
  // const flattenedData = [];
  // Object.entries(parentClassGroups).forEach(([parentClass, group]) => {
  //     // Add parent header row
  //     flattenedData.push({
  //         ...group,
  //         isParentHeader: true,
  //         parent_class: parentClass,
  //         class: parentClass,
  //         section: ""
  //     });

  //     // Add all child rows
  //     flattenedData.push(...group.classes);

  //     // Add subtotal row
  //     flattenedData.push({
  //         ...group,
  //         isSubtotal: true,
  //         parent_class: parentClass,
  //         class: "Subtotal",
  //         section: ""
  //     });
  // });

  const groupedData = categorywiseSummaryData.reduce((acc, item) => {
    const key = `${item.class}-${item.section_name}`;
    if (!acc[key]) {
      acc[key] = {
        class: item.class,
        parent_class: item.parent_class,
        parent_id: item.parent_id, // Could be number or string
        section: item.section_name,
        categories: {},
        male_students: 0,
        female_students: 0,
        total_students: 0,
      };
    }

    acc[key].categories[item.category] = item.total_students;
    acc[key].male_students += item.male_students;
    acc[key].female_students += item.female_students;
    acc[key].total_students += item.total_students;
    return acc;
  }, {});

  // Create a structure grouped by parent class
  const parentClassGroups = Object.values(groupedData).reduce((acc, item) => {
    if (!acc[item.parent_class]) {
      acc[item.parent_class] = {
        parent_id: item.parent_id,
        classes: [],
        categories: {},
        male_students: 0,
        female_students: 0,
        total_students: 0,
      };
    }

    acc[item.parent_class].classes.push(item);
    acc[item.parent_class].male_students += item.male_students;
    acc[item.parent_class].female_students += item.female_students;
    acc[item.parent_class].total_students += item.total_students;

    Object.keys(item.categories).forEach((category) => {
      acc[item.parent_class].categories[category] =
        (acc[item.parent_class].categories[category] || 0) +
        item.categories[category];
    });

    return acc;
  }, {});

  // Sort parent classes by parent_id (handling both numbers and strings)
  const sortedParentClasses = Object.entries(parentClassGroups).sort((a, b) => {
    const aId = a[1].parent_id ?? a[0]; // Use parent_id if exists, otherwise parent_class
    const bId = b[1].parent_id ?? b[0];

    // Handle both numbers and strings
    if (typeof aId === "number" && typeof bId === "number") {
      return aId - bId; // Numeric comparison
    }
    return String(aId).localeCompare(String(bId)); // String comparison
  });

  // Flatten the sorted data
  const flattenedData = [];
  sortedParentClasses.forEach(([parentClass, group]) => {
    // Sort child classes by class name (or another field if needed)
    group.classes.sort((a, b) => a.class.localeCompare(b.class));

    // Add parent header
    flattenedData.push({
      ...group,
      isParentHeader: true,
      parent_class: parentClass,
      class: parentClass,
      section: "",
    });

    // Add sorted children
    flattenedData.push(...group.classes);

    // Add subtotal
    flattenedData.push({
      ...group,
      isSubtotal: true,
      parent_class: parentClass,
      class: "Subtotal",
      section: "",
    });
  });
  const columnsObject = {
    register_no: "REGISTER_NO",
    old_register_no: "OLD_REGISTER_NO",
    shift: "SHIFT",
    full_name: "FULL_NAME",
    gender: "GENDER",
    class_id: "CLASS",
    section_id: "SECTION",
    blood_group: "BLOOD_GROUP",
    current_address: "CURRENT_ADDRESS",
    permanent_address: "PERMANENT_ADDRESS",
    mobile_no: "MOBILE_NO",
    student_cnic: "STUDENT_CNIC",
    category_id: "CATEGORY",
    // "house_id": "HOUSE",
    // "club_id": "CLUB",
    guardian_name: "GUARDIAN_NAME",
    relation: "RELATION",
    occupation: "OCCUPATION",
    guardian_mobile_no: "GUARDIAN_MOBILE_NO",
    guardian_address: "GUARDIAN_ADDRESS",
    guardian_cnic: "GUARDIAN_CNIC",
    pl_no: "PL_NO",
    designation: "DESIGNATION",
    department: "DEPARTMENT",
    student_image: "STUDENT_IMAGE",
    session_id: "SESSION",
    campus_id: "CAMPUS",
    status: "STATUS",
    father_cnic: "FATHER_CNIC",
    father_mobile_no: "FATHER_MOBILE_NO",
    father_name: "FATHER_NAME",
  };

  // Create options array for react-select
  const options = Object.keys(columnsObject).map((key) => ({
    value: key,
    label: columnsObject[key],
  }));

  function getAdmissionExcelReport() {
    axios
      .get(process.env.REACT_APP_API_BASE_URL + "/admission-excel-report", {
        params: {
          page: currentPage,
          limit: totalItem,
          from_date: editFormData.from_date,
          to_date: editFormData.to_date,
          class_id: editFormData.class_id,
          section_id: editFormData.section_id,
          category_id: editFormData.category_id,
          status: editFormData.status,
          search: editFormData.search,
          session_id: academicSession,
          campus_id: user.user.campus_id,
        },
        responseType: "blob", // Important to handle the Excel binary data correctly
      })
      .then((res) => {
        // Check if the response is a JSON object with the message 'Data not exist'
        const contentType = res.headers["content-type"];
        if (contentType && contentType.indexOf("application/json") !== -1) {
          const reader = new FileReader();
          reader.onload = () => {
            const responseText = reader.result;
            const responseJson = JSON.parse(responseText);
            if (responseJson.message === "Data not exist") {
              // Show toaster notification
              toast.success("Data Not Exist!");
              return;
            }
          };
          reader.readAsText(res.data);
        } else {
          // Create a URL for the blob object
          const url = window.URL.createObjectURL(new Blob([res.data]));

          // Create a link to download the file
          const link = document.createElement("a");
          link.href = url;
          link.setAttribute(
            "download",
            `report-${editFormData.from_date}-to-${editFormData.to_date}.xlsx`
          ); // Set the file name with .xlsx extension

          // Append the link to the body, click it, and then remove it
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);

          // Free up the created URL
          window.URL.revokeObjectURL(url);
        }
      })
      .catch((err) => console.error(err));
  }

  useEffect(() => {
    const fetchCategories = (campus_id) => {
      axios
        .get(
          process.env.REACT_APP_API_BASE_URL + `/get-categories/${campus_id}`
        )
        .then((res) => {
          setCategories(res.data.results);
        })
        .catch((err) => console.log(err));
    };

    // Ensure user.campus_id is defined before calling fetchClasses
    if (user && user.user.campus_id) {
      fetchCategories(user.user.campus_id);
    }
  }, [user]); // Depende

  const statusOptions = [
    { value: "", label: "Select Status" },
    { value: "New Admission", label: "New Admission" },
    { value: "Struck Off", label: "Struck Off" },
    { value: "SLC", label: "SLC" },
    { value: "Promoted", label: "Promoted" },
  ];

  const handleStatusChange = (selectedOption) => {
    setEditFormData({ ...editFormData, status: selectedOption.value });
  };

  // function fetchSLCRecord(id){

  //     console.log(id);
  // }

  const fetchSLCRecord = (admission_id, campus_id, session_id) => {
    axios
      .get(
        process.env.REACT_APP_API_BASE_URL +
          `/view-SLC/${admission_id}/${campus_id}/${session_id}`
      )
      .then((response) => {
        console.log(response.data.results[0]);
        setSLCData(response.data.results[0]);
        setSLCShow(true);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };


  const viewCharacterCertificate = (admission_id, campus_id, session_id) => {
  axios
    .get(
      process.env.REACT_APP_API_BASE_URL +
        `/view-admission/${admission_id}/${campus_id}/${session_id}`
    )
    .then((response) => {
      setSelectedAdmission(response.data.results[0]);
      setShowCharacterCertificate(true);
    })
    .catch((error) => {
      console.error("Error:", error);
    });
};

  const groupedDataStatusWise = statusWiseSummaryData.reduce((acc, item) => {
    const key = `${item.class}-${item.section_name}`;
    if (!acc[key]) {
      acc[key] = {
        class: item.class,
        section_name: item.section_name,
        new_admission: 0,
        slc: 0,
        struck_off: 0,
        promoted: 0,
        total_students: 0,
      };
    }
    // Summing up based on the status
    if (item.status === "New Admission")
      acc[key].new_admission += item.total_students;
    if (item.status === "SLC") acc[key].slc += item.total_students;
    if (item.status === "Struck Off")
      acc[key].struck_off += item.total_students;
    if (item.status === "Promoted") acc[key].promoted += item.total_students;

    // Total students per class
    acc[key].total_students += item.total_students;

    return acc;
  }, {});

  // Convert grouped data to an array
  const groupedArray = Object.values(groupedDataStatusWise);

  // Function to calculate totals for each status
  const calculateTotal = (statusKey) => {
    return groupedArray.reduce((sum, item) => sum + item[statusKey], 0);
  };

  // Step 3: Add this improved CSS
  const dropdownStyles = `
    .action-dropdown {
        position: relative;
        display: inline-block;
    }


    .table td, .table th {
  padding: 0.25rem !important ;
}
    
    .action-dropdown-btn {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        padding: 6px 12px;
        border: none;
        border-radius: 6px;
        cursor: pointer;
        font-size: 16px;
        transition: all 0.3s ease;
        box-shadow: 0 2px 5px rgba(0,0,0,0.1);
        display: flex;
        align-items: center;
        gap: 5px;
    }
    
    .action-dropdown-btn:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
    }
    
    .action-dropdown-btn:active {
        transform: translateY(0);
    }
    
    .action-dropdown-menu {
        position: absolute;
        top: calc(100% + 8px);
        right: 0;
        background: white;
        min-width: 180px;
        border-radius: 8px;
        box-shadow: 0 10px 40px rgba(0,0,0,0.15);
        z-index: 1000;
        overflow: hidden;
        animation: dropdownSlideIn 0.2s ease;
        border: 1px solid #e5e7eb;
    }
    
    @keyframes dropdownSlideIn {
        from {
            opacity: 0;
            transform: translateY(-10px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    .action-dropdown-menu::before {
        content: '';
        position: absolute;
        top: -6px;
        right: 15px;
        width: 12px;
        height: 12px;
        background: white;
        transform: rotate(45deg);
        border-left: 1px solid #e5e7eb;
        border-top: 1px solid #e5e7eb;
    }
    
    .action-dropdown-item {
        color: #374151;
        padding: 12px 16px;
        text-decoration: none;
        display: flex;
        align-items: center;
        gap: 12px;
        border: none;
        background: none;
        width: 100%;
        text-align: left;
        cursor: pointer;
        font-size: 14px;
        font-weight: 500;
        transition: all 0.2s ease;
        border-bottom: 1px solid #f3f4f6;
    }
    
    .action-dropdown-item:last-child {
        border-bottom: none;
    }
    
    .action-dropdown-item:hover {
        background: #f9fafb;
        padding-left: 20px;
    }
    
    .action-dropdown-item.view-item:hover {
        background: #fef3c7;
        color: #d97706;
    }
    
    .action-dropdown-item.edit-item:hover {
        background: #d1fae5;
        color: #059669;
    }
    
    .action-dropdown-item.delete-item {
        color: #dc2626;
    }
    
    .action-dropdown-item.delete-item:hover {
        background: #fee2e2;
        color: #991b1b;
    }
    
    .action-dropdown-item i {
        font-size: 16px;
        width: 20px;
        text-align: center;
    }
    
    .action-dropdown-divider {
        height: 1px;
        background: linear-gradient(90deg, transparent, #e5e7eb, transparent);
        margin: 4px 0;
    }
`;

  return (
    <div className="container-fluid admission-list">
      {showEdit && (
        // <div className="edit-voucher-container" style={{
        //   position: "absolute",
        //   top: "0%",
        //   left: "49%",
        //   transform: "translate(-50%, 0%)",
        //   zIndex: 1000,
        //   backgroundColor: "#fff",
        //   padding: "10px",
        //   border: "1px solid #ccc",
        //   boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
        //   width: "100%",
        //   minWidth: "800px",
        // }}>
        //   {/* A close button to hide the Edit component */}
        //   <div className="d-flex justify-content-end"><button
        //     className="btn btn-primary mr-2 mb-2"
        //     onClick={() => setShowEdit(false)}
        //   >
        //    x
        //   </button>
        //   </div>

        <>
          <div
            className="admission-edit__backdrop"
            onClick={() => setShowEdit(false)}
          ></div>
          <div className="admission-edit">
            <div className="admission-edit__header">
              <i className="fas fa-edit"></i>
              <span>Edit Admission</span>
              <button
                className="admission-edit__close"
                onClick={() => setShowEdit(false)}
                aria-label="Close"
              >
                &times;
              </button>
            </div>
            <div className="admission-edit__body">
              <AdmissionForm
                onClose={() => setShowEdit(false)}
                fetchData={fetchData}
                refreshData={true}
              />
            </div>
          </div>
        </>
      )}

      {/* Shared backdrop for any open Summary Report */}
      {(showCategorySummary ||
        showNewAdmissionSummary ||
        showStatusWiseSummary ||
        showNewSlcSummary ||
        showStruckOffSummary) && (
        <div
          className="admission-summary__backdrop"
          onClick={handleHide}
        ></div>
      )}

      <div className="row">
        <div className="col-12 col-md-12 p-2">
          <div className="card-header text-warning bg-primary p-2">
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <i className="fas fa-list"></i> Admissions List
              </div>
            </div>
          </div>
          <div className="admission-list__filters">

            {/* ─── Section 1 : Search & Filter ─────────────────────────── */}
            <div className="admission-list__filter-section">
              <div className="admission-list__filter-title">
                <i className="fas fa-search"></i>
                <span>Search &amp; Filter</span>
                <small className="admission-list__filter-hint">
                  Type a keyword or refine using the filters below, then press <b>Apply</b>.
                </small>
              </div>
              {isTeacherScoped && (
                <div
                  style={{
                    margin: '6px 0 12px',
                    padding: '8px 12px',
                    background: '#fff8e6',
                    border: '1px solid #EBD197',
                    borderLeft: '4px solid #EBD197',
                    borderRadius: '8px',
                    fontSize: '13px',
                    color: '#5b4a1a',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                  }}
                >
                  <i className="fas fa-lock" style={{ color: '#b3922c' }}></i>
                  Showing only your assigned classes
                  {allowedClassSectionSet && (
                    <strong style={{ color: '#111418' }}>
                      ({allowedClassSectionSet.size})
                    </strong>
                  )}
                </div>
              )}

              {/* Primary search row */}
              <div className="admission-list__search-row">
                <div className="admission-list__search-input">
                  <i className="fas fa-search admission-list__search-icon"></i>
                  <input
                    type="text"
                    placeholder="Search by name, register no, father name…"
                    className="form-control"
                    value={editFormData.search}
                    onChange={(e) =>
                      setEditFormData({ ...editFormData, search: e.target.value })
                    }
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        fetchData(false);
                      }
                    }}
                  />
                </div>
                <button
                  className="btn btn-danger admission-list__btn-apply"
                  onClick={searchData}
                >
                  <i className="fas fa-search"></i> Apply
                </button>
                <button
                  className="btn btn-primary admission-list__btn-reset"
                  onClick={resetStates}
                >
                  <i className="fas fa-undo"></i> Reset
                </button>
              </div>

              {/* Filter fields grid — in teacher mode show ONLY Class */}
              <div className="admission-list__filter-grid">
                {!isTeacherScoped && (
                  <div className="admission-list__filter-field">
                    <label>From Date</label>
                    <input
                      type="date"
                      className="form-control"
                      id="from_date"
                      value={editFormData.from_date}
                      onChange={(e) =>
                        setEditFormData({
                          ...editFormData,
                          from_date: e.target.value,
                        })
                      }
                    />
                  </div>
                )}

                {!isTeacherScoped && (
                  <div className="admission-list__filter-field">
                    <label>To Date</label>
                    <input
                      type="date"
                      className="form-control"
                      id="to_date"
                      value={editFormData.to_date}
                      onChange={(e) =>
                        setEditFormData({
                          ...editFormData,
                          to_date: e.target.value,
                        })
                      }
                    />
                  </div>
                )}

                {!isTeacherScoped && (
                  <div className="admission-list__filter-field">
                    <label>Shift</label>
                    <select
                      name="shift"
                      id="shift"
                      className="form-control"
                      value={editFormData.shift}
                      onChange={(e) =>
                        setEditFormData({ ...editFormData, shift: e.target.value })
                      }
                    >
                      <option value="">Both</option>
                      <option>Morning</option>
                      <option>Evening</option>
                    </select>
                  </div>
                )}

                {!isTeacherScoped && (
                  <div className="admission-list__filter-field">
                    <label>Status</label>
                    <Select
                      value={statusOptions.find(
                        (option) => option.value === editFormData.status
                      )}
                      onChange={handleStatusChange}
                      options={statusOptions}
                      placeholder="Select Status"
                    />
                  </div>
                )}

                <div className="admission-list__filter-field">
                  <label>Class</label>
                  <Select
                    options={classOptions}
                    value={
                      editFormData.class_id && editFormData.section_id
                        ? {
                            value: `${editFormData.class_id},${editFormData.section_id}`,
                            label: findClassLabel(),
                          }
                        : { value: "", label: "Select Class" }
                    }
                    onChange={handleClassChange}
                    placeholder="Select Class"
                    isClearable
                  />
                </div>

                {!isTeacherScoped && (
                  <div className="admission-list__filter-field">
                    <label>Category</label>
                    <Select
                      options={getCategories.map((category) => ({
                        value: category.id,
                        label: category.category,
                      }))}
                      value={
                        editFormData.category_id
                          ? {
                              value: editFormData.category_id,
                              label:
                                getCategories.find(
                                  (category) =>
                                    category.id === editFormData.category_id
                                )?.category || "",
                            }
                          : { value: "", label: "Select Category" }
                      }
                      onChange={(selectedOption) =>
                        setEditFormData({
                          ...editFormData,
                          category_id: selectedOption ? selectedOption.value : "",
                        })
                      }
                      placeholder="Select Category"
                      isClearable
                    />
                  </div>
                )}
              </div>
            </div>

            {/* ─── Section 2 : Reports & Downloads — admin only ─── */}
            {!isTeacherScoped && (
            <div className="admission-list__filter-section">
              <div className="admission-list__filter-title">
                <i className="fas fa-chart-bar"></i>
                <span>Reports &amp; Downloads</span>
                <small className="admission-list__filter-hint">
                  Generate summary reports or export the list.
                </small>
              </div>

              <div className="admission-list__report-grid">
                {/* Summary report row */}
                <div className="admission-list__report-row">
                  <div className="admission-list__filter-field admission-list__filter-field--grow">
                    <label>Summary Report</label>
                    <select
                      className="form-control"
                      onChange={(e) =>
                        setEditFormData({
                          ...editFormData,
                          summary_report: e.target.value,
                        })
                      }
                      value={editFormData.summary_report}
                    >
                      <option value="">— Select Summary Report —</option>
                      <option value="student_summary_campuswise">
                        Students Summary
                      </option>
                      <option value="new_admission_summary_campuswise">
                        New Admission Summary
                      </option>
                      <option value="slc_summary_campuswise">SLC Summary</option>
                      <option value="struck_off_summary">Struck Off Summary</option>
                      <option value="statuswise_summary_campuswise">
                        Status Summary
                      </option>
                      <option value="view_house_and_club_report">
                        House &amp; Club Report
                      </option>
                    </select>
                  </div>
                  <button
                    className="btn btn-danger admission-list__btn-action"
                    onClick={viewData}
                  >
                    <i className="fas fa-eye"></i> View
                  </button>
                </div>

                {/* Download row */}
                <div className="admission-list__report-row">
                  <div className="admission-list__filter-field admission-list__filter-field--grow">
                    <label>Download Format</label>
                    <select
                      name="type"
                      id="type"
                      className="form-control"
                      onChange={(e) =>
                        getAllReports({ ...report, report_type: e.target.value })
                      }
                    >
                      <option value="">— Select Format —</option>
                      <option value="excel">Excel</option>
                    </select>
                  </div>
                  <button
                    className="btn btn-warning admission-list__btn-action"
                    onClick={getReport}
                  >
                    <i className="fas fa-download"></i> Download
                  </button>
                </div>
              </div>
            </div>
            )}
          </div>
          <div className="border p-2 admission-list__table-card">
            <div className="pb-3 admission-list__pagesize">
              <select value={totalItem} onChange={handleTotalItemChange} className="admission-list__pagesize-select">
                <option value="10">10</option>
                <option value="20">20</option>
                <option value="30">30</option>
                <option value="40">40</option>
                <option value="50">50</option>
              </select>
            </div>
            <div className="table-responsive admission-list__table-wrap">
            <table className="table admission-list__table">
              <thead>
                <tr>
                  <th>Sr#</th>
                  <th>Register#</th>
                  <th>Old Register#</th>
                  <th>Name</th>
                  <th>Class</th>
                  <th>Section</th>
                  <th>Category</th>
                  <th>Father</th>
                  <th>Mobile#</th>
                  <th>Status</th>

                  <th className="text-center">Action</th>
                  {/* <th className='text-center'>Edit</th>
                                    <th className='text-center'>Delete</th> */}
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="8">Loading...</td>
                  </tr>
                ) : (
                  data.map((admission, index) => (
                    <tr key={index}>
                      <td>{(currentPage - 1) * totalItem + index + 1}</td>
                      <td>{admission.register_no}</td>
                      <td>{admission.old_register_no}</td>
                      <td>{admission.full_name}</td>
                      <td>{admission.class}</td>
                      <td>{admission.section_name}</td>
                      <td>{admission.category}</td>
                      <td>{admission.father_name}</td>
                      <td>{admission.mobile_no}</td>
                      <td>
                        {admission.status === "SLC" ? (
                          <button
                            className="btn btn-primary btn-sm"
                            onClick={() =>
                              fetchSLCRecord(
                                admission.id,
                                admission.campus_id,
                                admission.session_id
                              )
                            }
                          >
                            SLC
                          </button>
                        ) : (
                          admission.status
                        )}
                      </td>

                      {/* <td className='text-center'>
                                                <button className='btn btn-warning btn-sm' onClick={() => viewAdmission(admission.id, admission.campus_id, admission.session_id)}><i className="fas fa-eye icon"></i></button>
                                            </td>
                                            <td className='text-center'>
                                                <button className='btn btn-success btn-sm' onClick={() => editAdmission(admission.id)}><i className="fas fa-edit"></i></button>
                                            </td>
                                            <td className='text-center'>
                                                <button className='btn btn-danger btn-sm' onClick={() => deleteAdmission(admission.id, admission.full_name, admission.class, admission.section_name, admission.father_name)}><i className="fas fa-trash-alt"></i></button>
                                            </td> */}

                      <td className="text-center">
                        <style>{dropdownStyles}</style>
                        <div className="action-dropdown">
                          <button
                            className="action-dropdown-btn"
                            onClick={(e) => {
                              e.stopPropagation();
                              setOpenDropdownIndex(
                                openDropdownIndex === index ? null : index
                              );
                            }}
                          >
                            <i className="fas fa-cog"></i>
                            <i
                              className="fas fa-chevron-down"
                              style={{ fontSize: "10px" }}
                            ></i>
                          </button>

                          {openDropdownIndex === index && (
                            <div className="action-dropdown-menu">
                              <button
                                className="action-dropdown-item view-item"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  viewAdmission(
                                    admission.id,
                                    admission.campus_id,
                                    admission.session_id
                                  );
                                  setOpenDropdownIndex(null);
                                }}
                              >
                                <i className="fas fa-eye"></i>
                                <span>View Details</span>
                              </button>

                              <button
                                className="action-dropdown-item edit-item"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  editAdmission(admission.id);
                                  setOpenDropdownIndex(null);
                                }}
                              >
                                <i className="fas fa-edit"></i>
                                <span>Edit Record</span>
                              </button>

                              {/* <button
                                className="action-dropdown-item edit-item"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  editAdmission(admission.id);
                                  setOpenDropdownIndex(null);
                                }}
                              >
                                <i className="fas fa-certificate"></i>
                                <span>Character Certificate</span>
                              </button> */}

                              <button
                                className="action-dropdown-item edit-item"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  viewCharacterCertificate(
                                    admission.id,
                                    admission.campus_id,
                                    admission.session_id
                                  );
                                  setOpenDropdownIndex(null);
                                }}
                              >
                                <i className="fas fa-certificate"></i>
                                <span>Character Certificate</span>
                              </button>

                              <div className="action-dropdown-divider"></div>

                              <button
                                className="action-dropdown-item delete-item"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  deleteAdmission(
                                    admission.id,
                                    admission.full_name,
                                    admission.class,
                                    admission.section_name,
                                    admission.father_name
                                  );
                                  setOpenDropdownIndex(null);
                                }}
                              >
                                <i className="fas fa-trash-alt"></i>
                                <span>Delete</span>
                              </button>
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
            </div>
            <ReactPaginate
              previousLabel={"Previous"}
              nextLabel={"Next"}
              breakLabel={"..."}
              pageCount={totalPages}
              marginPagesDisplayed={2}
              pageRangeDisplayed={3}
              onPageChange={handlePageChange}
              containerClassName={"pagination"}
              pageClassName={"page-item"}
              activeClassName={"active"}
              pageLinkClassName={"page-link"}
              previousClassName={"page-item"}
              previousLinkClassName={"page-link"}
              nextClassName={"page-item"}
              nextLinkClassName={"page-link"}
              breakClassName={"page-item"}
              breakLinkClassName={"page-link"}
            />
          </div>
        </div>
      </div>

      {showData && admissionData && (
        <div className="col-12">
          <div className="admission-view__backdrop" onClick={handleHide}></div>
          <div
            className="admission-view"
            style={{
              border: "1px solid #ddd",
              padding: "0",
              position: "fixed",
              left: "50%",
              top: "50%",
              transform: "translate(-50%, -50%)",
              zIndex: 1100,
              width: "min(1100px, 94vw)",
              maxHeight: "92vh",
              overflowY: "hidden",
              backgroundColor: "white",
              borderRadius: "12px",
              boxShadow: "0 20px 50px rgba(0, 0, 0, 0.35)",
              display: "flex",
              flexDirection: "column",
              alignItems: "stretch",
            }}
          >
            <style>
              {`
          /* Custom scrollbar styles */
          div::-webkit-scrollbar {
            width: 8px;
          }

          div::-webkit-scrollbar-track {
            background: #f1f1f1;
            border-radius: 10px;
          }

          div::-webkit-scrollbar-thumb {
            background: #888;
            border-radius: 10px;
          }

          div::-webkit-scrollbar-thumb:hover {
            background: #555;
          }
          
          .admission_detail {
            border: 1px solid black;
            border-collapse: collapse;
          }

          .admission_detail th, .admission_detail td {
            border: 1px solid gray;
            padding: 10px !important;
          }
          `}
            </style>

            {/* Fixed Close Button */}
            <button
              className="admission-view__close"
              onClick={handleHide}
              aria-label="Close"
            >
              &times;
            </button>

            {/* Non-Scrollable Heading */}
            <div className="admission-view__header">
              <i className="fas fa-user-graduate"></i>
              <span>Student Admission Details</span>
              {admissionData && admissionData.full_name && (
                <span className="admission-view__header-sub">
                  &mdash; {admissionData.full_name}
                </span>
              )}
            </div>

            {/* Scrollable Content */}
            <div className="admission-view__body">
              <div
                style={{
                  marginBottom: "20px",
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                <div
                  style={{
                    border: "2px solid #ccc",
                    borderRadius: "10px",
                    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                    width: "200px",
                    height: "200px",
                    overflow: "hidden",
                  }}
                >
                  {admissionData.student_image && (
                    <div>
                      <img
                        src={
                          process.env.REACT_APP_API_BASE_URL +
                          `/uploads/${admissionData.student_image}`
                        }
                        alt="Student"
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                          borderRadius: "5px",
                        }}
                      />
                    </div>
                  )}
                </div>
              </div>

              <table class="admission_detail" style={{ width: "100%" }}>
                <thead>
                  <tr>
                    <th colSpan="6" style={{ background: "#ddd" }}>
                      Student Details
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <th>Session</th>
                    <td>{admissionData.session_name}</td>
                    <th>Reg#</th>
                    <td>{admissionData.register_no}</td>
                    <th>Old_Reg#</th>
                    <td>{admissionData.old_register_no}</td>
                  </tr>
                  <tr>
                    <th>Name</th>
                    <td>{admissionData.full_name}</td>
                    <th>Class</th>
                    <td>{`${admissionData.class_name} (${admissionData.section_name})`}</td>
                    <th className="text-primary">Category</th>
                    <td className="text-primary">
                      {admissionData.category_name}
                    </td>
                  </tr>
                  <tr>
                    <th>Adm Date</th>
                    <td>{formatDate(admissionData.admission_date)}</td>
                    <th>Shift</th>
                    <td>{admissionData.shift}</td>
                    <th>Gender</th>
                    <td>{admissionData.gender}</td>
                  </tr>
                  <tr>
                    <th>DOB</th>
                    <td>{formatDate(admissionData.dob)}</td>
                    <th>Religion</th>
                    <td>{admissionData.religion}</td>
                    <th>Cast</th>
                    <td>{admissionData.cast}</td>
                  </tr>
                  <tr>
                    <th>BG</th>
                    <td>{admissionData.blood_group}</td>
                    <th>M_Tongue</th>
                    <td>{admissionData.mother_tongue}</td>
                    <th>C_Address</th>
                    <td>{admissionData.current_address}</td>
                  </tr>
                  <tr>
                    <th>P_Address</th>
                    <td>{admissionData.permanent_address}</td>
                    <th>Mobile No</th>
                    <td>{admissionData.mobile_no}</td>
                    <th>Student CNIC</th>
                    <td>{admissionData.student_cnic}</td>
                  </tr>
                  <tr>
                    <th>Status</th>
                    <td>{admissionData.status}</td>
                    <th>Father CNIC</th>
                    <td>{admissionData.father_cnic}</td>
                    {/* <th>Mobile#</th>
                                            <td>{admissionData.father_mobile_no}</td> */}
                    <th>Bus Status</th>
                    <td>{admissionData.bus_status || "-"}</td>
                  </tr>
                  <tr>
                    <th>Bus Fee</th>
                    <td>
                      {admissionData.bus_fee && admissionData.bus_route !== ""
                        ? admissionData.bus_fee +
                          " (" +
                          admissionData.bus_route +
                          ")"
                        : 0}
                    </td>
                    <th>Pendency Status</th>
                    <td>{admissionData.status_for_pendings || "-"}</td>
                    <th>User Name</th>
                    <td>{admissionData.username || "-"}</td>
                  </tr>
                </tbody>

                <thead>
                  <tr>
                    <th colSpan="6" style={{ background: "#ddd" }}>
                      Guardian Details
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <th>Name</th>
                    <td>{admissionData.guardian_name}</td>
                    <th>Relation</th>
                    <td>{admissionData.relation}</td>
                    <th>Occupation</th>
                    <td>{admissionData.occupation}</td>
                  </tr>
                  <tr>
                    <th>Mobile No</th>
                    <td>{admissionData.guardian_mobile_no}</td>
                    <th>Address</th>
                    <td>{admissionData.guardian_address}</td>
                    <th>CNIC</th>
                    <td>{admissionData.guardian_cnic}</td>
                  </tr>
                  {admissionData.pl_no && (
                    <tr>
                      <th>PL No</th>
                      <td>{admissionData.pl_no}</td>
                      <th>Designation</th>
                      <td>{admissionData.designation}</td>
                      <th>Department</th>
                      <td>{admissionData.department}</td>
                    </tr>
                  )}
                </tbody>

                <thead>
                  <tr>
                    <th colSpan="6" style={{ background: "#ddd" }}>
                      Father Job Detail (If POF)
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <th>PL No</th>
                    <td>{admissionData.pl_no || "-"}</td>
                    <th>Designation</th>
                    <td>{admissionData.designation || "-"}</td>
                    <th>Department</th>
                    <td>{admissionData.department || "-"}</td>
                  </tr>

                  <tr>
                    <th>House</th>
                    <td>{admissionData.house_name || "-"}</td>
                    <th>Club</th>
                    <td>{admissionData.club_name || "-"}</td>
                  </tr>
                </tbody>
              </table>

              <table class="admission_detail" style={{ width: "100%" }}>
                <thead>
                  <tr>
                    <th colSpan="10" style={{ background: "#ddd" }}>
                      Student Voucher Ledger
                    </th>
                  </tr>
                  <tr>
                    <th>Sr.No</th>
                    <th>Month</th>
                    <th>Advance</th>
                    {/* <th>Arrears</th> */}
                    <th>T.Amount</th>
                    <th>Due Date</th>
                    <th>Received Payment</th>
                    <th>Payment Date</th>
                    <th>Status</th>
                    <th>Remaining</th>
                  </tr>
                </thead>
                <tbody>
                  {voucherData.length > 0 ? (
                    <>
                      {voucherData
                        .filter(
                          (voucher) =>
                            voucher.for_the_month &&
                            voucher.for_the_month.length > 0
                        ) // Filter rows based on for_the_month
                        .map((voucher, index) => (
                          <tr key={index}>
                            <td>{index + 1}</td>
                            <td>{voucher.for_the_month}</td>{" "}
                            {/* Display for_the_month since we know it's valid */}
                            <td>
                              {voucher.first_advance_payment !== null
                                ? voucher.first_advance_payment
                                : 0}
                            </td>
                            {/* <td>{voucher.arrears !== null ? voucher.arrears : 0}</td> */}
                            <td>
                              {voucher.total_amount !== null
                                ? voucher.total_amount
                                : 0}
                            </td>
                            <td>
                              {voucher.due_date
                                ? convertDates(voucher.due_date)
                                : "-"}
                            </td>
                            <td>
                              {voucher.recieved_payment !== null
                                ? voucher.recieved_payment
                                : 0}
                            </td>
                            <td>
                              {voucher.payment_date
                                ? convertDates(voucher.payment_date)
                                : "-"}
                            </td>
                            <td
                              style={{
                                color:
                                  voucher.fee_status === "paid"
                                    ? "green"
                                    : "red",
                              }}
                            >
                              {voucher.fee_status || "-"}
                            </td>
                            <td>
                              {voucher.fee_status === "paid"
                                ? 0
                                : voucher.total_amount}
                            </td>
                          </tr>
                        ))}
                      <tr>
                        <td colSpan="8" className="text-right">
                          <strong>Remaining:</strong>
                        </td>
                        <td>
                          <strong>
                            {voucherData
                              .filter(
                                (voucher) =>
                                  voucher.for_the_month &&
                                  voucher.for_the_month.length >= 0
                              ) // Apply the same filter for grand total
                              .reduce(
                                (total, voucher) =>
                                  total +
                                  (voucher.fee_status == "paid"
                                    ? 0
                                    : voucher.total_amount),
                                0
                              )}
                          </strong>
                        </td>
                      </tr>
                    </>
                  ) : (
                    <tr>
                      <td colSpan="9" style={{ textAlign: "center" }}>
                        No vouchers exist
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>

              <table class="admission_detail" style={{ width: "100%" }}>
                <thead>
                  <tr>
                    <th colSpan="10" style={{ background: "#ddd" }}>
                      Student Activities
                    </th>
                  </tr>
                  <tr>
                    <th>Sr.No</th>
                    <th>Date</th>
                    <th>Name</th>
                    <th>Activity Type</th>
                    <th>Position</th>
                    <th>Remarks</th>
                  </tr>
                </thead>
                <tbody>
                  {activitiesData.length > 0 ? (
                    <>
                      {activitiesData.map((voucher, index) => (
                        <tr key={index}>
                          <td>{index + 1}</td>
                          <td>{convertDates(voucher.activity_date)}</td>{" "}
                          {/* Display for_the_month since we know it's valid */}
                          <td>{voucher.name}</td>
                          <td>{voucher.activity_type}</td>
                          <td>{voucher.position}</td>
                          <td>{voucher.remarks}</td>
                        </tr>
                      ))}
                    </>
                  ) : (
                    <tr>
                      <td colSpan="6" style={{ textAlign: "center" }}>
                        No Activity exist
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>

              <table class="admission_detail" style={{ width: "100%" }}>
                <thead>
                  <tr>
                    <th colSpan="10" style={{ background: "#ddd" }}>
                      Student Discipline
                    </th>
                  </tr>
                  <tr>
                    <th>Sr.No</th>
                    <th>Date.Of.Incident</th>
                    <th>Type.of.Incident</th>
                    <th>Action</th>
                    <th>Description</th>
                    <th>Reporting.Teacher</th>
                  </tr>
                </thead>
                <tbody>
                  {disciplineData.length > 0 ? (
                    <>
                      {disciplineData.map((voucher, index) => (
                        <tr key={index}>
                          <td>{index + 1}</td>
                          <td>{convertDates(voucher.date_of_incident)}</td>{" "}
                          {/* Display for_the_month since we know it's valid */}
                          <td>{voucher.type_of_incident}</td>
                          <td>{voucher.action_taken}</td>
                          <td>{voucher.description}</td>
                          <td>{voucher.reporting_teacher}</td>
                        </tr>
                      ))}
                    </>
                  ) : (
                    <tr>
                      <td colSpan="6" style={{ textAlign: "center" }}>
                        No Disciplinary Action Exist
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {showCategorySummary && (
        <div
          className="admission-summary-modal"
          style={{
            border: "1px solid #ddd",
            padding: "10px",
            position: "fixed",
            left: "50%",
            top: "50%",
            transform: "translate(-50%, -50%)",
            zIndex: "100",
            backdropFilter: "blur(10px)",
            minWidth: "350px",
            height: "90vh",
            overflowY: "auto",
            backgroundColor: "white",
            borderRadius: "10px",
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            width: "80%",
          }}
        >
          <style>
            {`
                            /* Custom scrollbar styles */
                            div::-webkit-scrollbar {
                                width: 8px;
                            }

                            div::-webkit-scrollbar-track {
                                background: #f1f1f1;
                                border-radius: 10px;
                            }

                            div::-webkit-scrollbar-thumb {
                                background: #888;
                                border-radius: 10px;
                            }

                            div::-webkit-scrollbar-thumb:hover {
                                background: #555;
                            }

                            table#category_summary {
                                border: 1px solid black;
                                border-collapse: collapse;
                            }

                            table#category_summary th, table#category_summary td {
                                border: 1px solid gray;
                                padding: 10px !important;
                            }
                        `}
          </style>

          {/* Close Button */}
          <button
            onClick={handleHide}
            style={{
              position: "absolute",
              top: "16px",
              right: "16px",
              background: "transparent",
              border: "none",
              fontSize: "20px",
              cursor: "pointer",
              zIndex: "200",
            }}
          >
            &times;
          </button>

          {/* Non-Scrollable Heading */}
          <div
            style={{
              width: "100%",
              backgroundColor: "rgb(235, 209, 151)",
              padding: "5px",
              borderBottom: "1px solid #ddd",
              position: "sticky",
              top: "0",
              zIndex: "150",
              textAlign: "center",
              fontSize: "18px",
              fontWeight: "bold",
              color: "black",
            }}
          >
            Student Summary Grand Report
          </div>

          <div
            style={{
              width: "100%",
              backgroundColor: "#1976d2", // Deep blue background
              padding: "15px 0",
              borderBottom: "2px solid black", // Gold accent border
              position: "sticky",
              top: "0",
              zIndex: "150",
              textAlign: "center",
              boxShadow: "0 2px 10px rgba(0,0,0,0.2)",
              background: "linear-gradient(135deg, #1976d2 0%, #0d47a1 100%)", // Gradient effect
            }}
          >
            <div
              style={{
                fontSize: "24px",
                fontWeight: "700",
                color: "#ffffff",
                letterSpacing: "1px",
                textShadow: "1px 1px 3px rgba(0,0,0,0.3)",
                marginBottom: "5px",
              }}
            >
              STUDENT DEMOGRAPHIC ANALYSIS
            </div>
            <div
              style={{
                fontSize: "18px",
                fontWeight: "500",
                color: "rgb(235, 209, 151)", // Gold color for subtitle
                fontStyle: "italic",
                letterSpacing: "0.5px",
              }}
            >
              Class-wise • Section-wise • Category-wise Comprehensive Report
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                gap: "20px",
                marginTop: "10px",
              }}
            ></div>
          </div>

          {/* Scrollable Content */}
          <div style={{ width: "100%", padding: "20px", overflowY: "auto" }}>
            <table
              id="category_summary"
              style={{ width: "100%" }}
              border="1"
              cellPadding="10"
            >
              <thead
                style={{
                  position: "sticky",
                  top: "0",
                  backgroundColor: "white",
                  backgroundColor: "rgb(211, 211, 211)",
                }}
              >
                <tr>
                  <th>Class</th>
                  <th>Section</th>
                  {uniqueCategories.map((category, index) => (
                    <th key={index}>{category}</th>
                  ))}
                  <th style={{ backgroundColor: "rgb(211,211,211)" }}>Male</th>
                  <th style={{ backgroundColor: "rgb(211,211,211)" }}>
                    Female
                  </th>
                  <th>Total Students</th>
                </tr>
              </thead>
              <tbody>
                {flattenedData.map((item, index) => {
                  if (item.isParentHeader) {
                    return (
                      <tr
                        key={`header-${index}`}
                        style={{
                          backgroundColor: "rgba(235, 209, 151, 0.55)",
                          fontWeight: "bold",
                          borderBottom: "2px solid #333",
                        }}
                      >
                        <td
                          colSpan={5 + uniqueCategories.length}
                          style={{ textAlign: "left", paddingLeft: "20px" }}
                        >
                          {item.parent_class}
                        </td>
                      </tr>
                    );
                  } else if (item.isSubtotal) {
                    return (
                      <tr
                        key={`subtotal-${index}`}
                        style={{
                          backgroundColor: "#f0f0f0",
                          fontWeight: "bold",
                          borderTop: "1px solid #999",
                        }}
                      >
                        <td>{item.class}</td>
                        <td></td>
                        {uniqueCategories.map((category) => (
                          <td key={category}>
                            {item.categories[category] || 0}
                          </td>
                        ))}
                        <td style={{ backgroundColor: "rgb(211,211,211,1)" }}>
                          {item.male_students}
                        </td>
                        <td style={{ backgroundColor: "rgb(211,211,211,1)" }}>
                          {item.female_students}
                        </td>
                        <td>{item.total_students}</td>
                      </tr>
                    );
                  } else {
                    return (
                      <tr key={`row-${index}`}>
                        <td>{item.class}</td>
                        <td>{item.section}</td>
                        {uniqueCategories.map((category) => (
                          <td key={category}>
                            {item.categories[category] || 0}
                          </td>
                        ))}
                        <td style={{ backgroundColor: "rgb(211,211,211,1)" }}>
                          {item.male_students}
                        </td>
                        <td style={{ backgroundColor: "rgb(211,211,211,1)" }}>
                          {item.female_students}
                        </td>
                        <td>{item.total_students}</td>
                      </tr>
                    );
                  }
                })}
              </tbody>
              <tfoot>
                <tr style={{ backgroundColor: "#f9f9f9" }}>
                  <td colSpan="2" style={{ fontWeight: "bold" }}>
                    Grand Total
                  </td>
                  {uniqueCategories.map((category) => {
                    const totalForCategory = Object.values(groupedData).reduce(
                      (sum, item) => sum + (item.categories[category] || 0),
                      0
                    );
                    return (
                      <td key={category} style={{ fontWeight: "bold" }}>
                        {totalForCategory}
                      </td>
                    );
                  })}
                  <td
                    style={{
                      fontWeight: "bold",
                      backgroundColor: "rgb(211,211,211,1)",
                    }}
                  >
                    {Object.values(groupedData).reduce(
                      (sum, item) => sum + item.male_students,
                      0
                    )}
                  </td>
                  <td
                    style={{
                      fontWeight: "bold",
                      backgroundColor: "rgb(211,211,211,1)",
                    }}
                  >
                    {Object.values(groupedData).reduce(
                      (sum, item) => sum + item.female_students,
                      0
                    )}
                  </td>
                  <td style={{ fontWeight: "bold" }}>
                    {Object.values(groupedData).reduce(
                      (sum, item) => sum + item.total_students,
                      0
                    )}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      )}

      {showNewAdmissionSummary && (
        <div
          className="admission-summary-modal"
          style={{
            border: "1px solid #ddd",
            padding: "10px",
            position: "fixed",
            left: "50%",
            top: "50%",
            transform: "translate(-50%, -50%)",
            zIndex: "100",
            backdropFilter: "blur(10px)",
            minWidth: "350px",
            maxHeight: "80vh",
            overflowY: "auto",
            backgroundColor: "white",
            borderRadius: "10px",
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            width: "1000px",
          }}
        >
          <style>
            {`
          /* Custom scrollbar styles */
          div::-webkit-scrollbar {
              width: 8px;
          }
          div::-webkit-scrollbar-track {
              background: #f1f1f1;
              border-radius: 10px;
          }
          div::-webkit-scrollbar-thumb {
              background: #888;
              border-radius: 10px;
          }
          div::-webkit-scrollbar-thumb:hover {
              background: #555;
          }
          table#admission_Summary {
              border: 1px solid black;
              border-collapse: collapse;
          }
          table#admission_Summary th, table#admission_Summary td {
              border: 1px solid gray;
              padding: 10px !important;
          }
        `}
          </style>

          {/* Close Button */}
          <button
            onClick={handleHide}
            style={{
              position: "absolute",
              top: "16px",
              right: "16px",
              background: "transparent",
              border: "none",
              fontSize: "20px",
              cursor: "pointer",
              zIndex: "200", // Ensures it stays on top of other elements
            }}
          >
            &times;
          </button>

          {/* Non-Scrollable Heading */}
          <div
            style={{
              width: "100%",
              backgroundColor: "rgb(235, 209, 151)",
              padding: "5px",
              borderBottom: "1px solid #ddd",
              position: "sticky",
              top: "0",
              zIndex: "150",
              textAlign: "center",
              fontSize: "18px",
              fontWeight: "bold",
              color: "black",
            }}
          >
            Grand Report (New Admissions Summary)
          </div>

          {/* Scrollable Content */}
          <div style={{ width: "100%", padding: "20px", overflowY: "auto" }}>
            <table
              id="admission_Summary"
              border="1"
              cellPadding="10"
              style={{ width: "100%" }}
            >
              <thead>
                <tr>
                  <th>Sr#</th>
                  <th>Class</th>
                  <th>Strength</th>
                </tr>
              </thead>
              <tbody>
                {newAdmissionSummaryData.map((item, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{item.class}</td>
                    <td>{item.total_students}</td>
                  </tr>
                ))}
                {/* Grand Total Row */}
                <tr style={{ fontWeight: "bold", backgroundColor: "#f9f9f9" }}>
                  <td colSpan="2" style={{ textAlign: "right" }}>
                    Grand Total
                  </td>
                  <td>
                    {newAdmissionSummaryData.reduce(
                      (total, item) => total + item.total_students,
                      0
                    )}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {showStatusWiseSummary && (
        <div
          className="admission-summary-modal"
          style={{
            border: "1px solid #ddd",
            padding: "10px",
            position: "fixed",
            left: "50%",
            top: "50%",
            transform: "translate(-50%, -50%)",
            zIndex: "100",
            backdropFilter: "blur(10px)",
            minWidth: "350px",
            maxHeight: "80vh",
            overflowY: "auto",
            backgroundColor: "white",
            borderRadius: "10px",
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            width: "1500px",
          }}
        >
          <style>
            {`
          /* Custom scrollbar styles */
          div::-webkit-scrollbar {
              width: 8px;
          }
          div::-webkit-scrollbar-track {
              background: #f1f1f1;
              border-radius: 10px;
          }
          div::-webkit-scrollbar-thumb {
              background: #888;
              border-radius: 10px;
          }
          div::-webkit-scrollbar-thumb:hover {
              background: #555;
          }
          table#status_Summary {
              border: 1px solid black;
              border-collapse: collapse;
          }
          table#status_Summary th, table#status_Summary td {
              border: 1px solid gray;
              padding: 10px !important;
          }
        `}
          </style>

          {/* Close Button */}
          <button
            onClick={handleHide}
            style={{
              position: "absolute",
              top: "16px",
              right: "16px",
              background: "transparent",
              border: "none",
              fontSize: "20px",
              cursor: "pointer",
              zIndex: "200",
            }}
          >
            &times;
          </button>

          {/* Non-Scrollable Heading */}
          <div
            style={{
              width: "100%",
              backgroundColor: "rgb(235, 209, 151)",
              padding: "5px",
              borderBottom: "1px solid #ddd",
              position: "sticky",
              top: "0",
              zIndex: "150",
              textAlign: "center",
              fontSize: "18px",
              fontWeight: "bold",
              color: "black",
            }}
          >
            Grand Report (Status Wise Summary)
          </div>

          {/* Scrollable Content */}
          <div style={{ width: "100%", padding: "20px", overflowY: "auto" }}>
            <table
              id="status_Summary"
              border="1"
              cellPadding="10"
              style={{ width: "100%" }}
            >
              <thead>
                <tr>
                  <th>Sl.</th>

                  <th>Grade</th>
                  <th>Section</th>
                  <th>New Admission</th>
                  <th>SLC</th>
                  <th>Struck Off</th>
                  <th>Promoted</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                {groupedArray.map((item, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{item.class}</td>
                    <td>{item.section_name}</td>
                    <td>{item.new_admission}</td>
                    <td>{item.slc}</td>
                    <td>{item.struck_off}</td>
                    <td>{item.promoted}</td>
                    <td>{item.total_students}</td>
                  </tr>
                ))}
                {/* Total row */}
                <tr style={{ backgroundColor: "#f9f9f9" }}>
                  <td
                    colSpan="3"
                    style={{ textAlign: "center", fontWeight: "bold" }}
                  >
                    Total
                  </td>
                  <td style={{ fontWeight: "bold" }}>
                    {calculateTotal("new_admission")}
                  </td>
                  <td style={{ fontWeight: "bold" }}>
                    {calculateTotal("slc")}
                  </td>
                  <td style={{ fontWeight: "bold" }}>
                    {calculateTotal("struck_off")}
                  </td>
                  <td style={{ fontWeight: "bold" }}>
                    {" "}
                    {calculateTotal("promoted")}
                  </td>
                  <td style={{ fontWeight: "bold" }}>
                    {calculateTotal("total_students")}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {showNewSlcSummary && (
        <div
          className="admission-summary-modal"
          style={{
            border: "1px solid #ddd",
            padding: "10px",
            position: "fixed",
            left: "50%",
            top: "50%",
            transform: "translate(-50%, -50%)",
            zIndex: "100",
            backdropFilter: "blur(10px)",
            minWidth: "350px",
            maxHeight: "80vh",
            overflowY: "auto",
            backgroundColor: "white",
            borderRadius: "10px",
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            width: "1200px",
          }}
        >
          <style>
            {`
          /* Custom scrollbar styles */
          div::-webkit-scrollbar {
            width: 8px;
          }
          div::-webkit-scrollbar-track {
            background: #f1f1f1;
            border-radius: 10px;
          }
          div::-webkit-scrollbar-thumb {
            background: #888;
            border-radius: 10px;
          }
          div::-webkit-scrollbar-thumb:hover {
            background: #555;
          }
          table#SLC_Summary {
            border: 1px solid black;
            border-collapse: collapse;
          }
          table#SLC_Summary th, table#SLC_Summary td {
            border: 1px solid gray;
            padding: 10px !important;
          }
        `}
          </style>

          {/* Close Button */}
          <button
            onClick={handleHide}
            style={{
              position: "absolute",
              top: "16px",
              right: "16px",
              background: "transparent",
              border: "none",
              fontSize: "20px",
              cursor: "pointer",
              zIndex: "200", // Ensures it stays on top of other elements
            }}
          >
            &times;
          </button>

          {/* Non-Scrollable Heading */}
          <div
            style={{
              width: "100%",
              backgroundColor: "rgb(235, 209, 151)",
              padding: "5px",
              borderBottom: "1px solid #ddd",
              position: "sticky",
              top: "0",
              zIndex: "150",
              textAlign: "center",
              fontSize: "18px",
              fontWeight: "bold",
              color: "black",
            }}
          >
            Grand Report (SLC Summary)
          </div>

          {/* Scrollable Content */}
          <div style={{ width: "100%", padding: "20px", overflowY: "auto" }}>
            <table
              id="SLC_Summary"
              border="1"
              cellPadding="10"
              style={{ width: "100%" }}
            >
              <thead>
                <tr>
                  <th>Sr#</th>
                  <th>Class</th>
                  <th>Strength</th>
                </tr>
              </thead>
              <tbody>
                {slcSummaryData.map((item, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{item.class}</td>
                    <td>{item.total_students}</td>
                  </tr>
                ))}
                {/* Grand Total Row */}
                <tr style={{ fontWeight: "bold", backgroundColor: "#f9f9f9" }}>
                  <td colSpan="2" style={{ textAlign: "right" }}>
                    Grand Total
                  </td>
                  <td>
                    {slcSummaryData.reduce(
                      (total, item) => total + item.total_students,
                      0
                    )}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {showStruckOffSummary &&
        editFormData.summary_report == "struck_off_summary" && (
          <div
            className="admission-summary-modal"
            style={{
              border: "1px solid #ddd",
              padding: "10px",
              position: "fixed",
              left: "50%",
              top: "50%",
              transform: "translate(-50%, -50%)",
              zIndex: "100",
              backdropFilter: "blur(10px)",
              minWidth: "350px",
              maxHeight: "80vh",
              overflowY: "auto",
              backgroundColor: "white",
              borderRadius: "10px",
              boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              width: "1200px",
            }}
          >
            <style>
              {`
          /* Custom scrollbar styles */
          div::-webkit-scrollbar {
            width: 8px;
          }
          div::-webkit-scrollbar-track {
            background: #f1f1f1;
            border-radius: 10px;
          }
          div::-webkit-scrollbar-thumb {
            background: #888;
            border-radius: 10px;
          }
          div::-webkit-scrollbar-thumb:hover {
            background: #555;
          }
          table#SruckOff_Summary {
            border: 1px solid black;
            border-collapse: collapse;
          }
          table#SruckOff_Summary th, table#SruckOff_Summary td {
            border: 1px solid gray;
            padding: 10px !important;
          }
        `}
            </style>

            {/* Close Button */}
            <button
              onClick={handleHide}
              style={{
                position: "absolute",
                top: "16px",
                right: "16px",
                background: "transparent",
                border: "none",
                fontSize: "20px",
                cursor: "pointer",
                zIndex: "200", // Ensures it stays on top of other elements
              }}
            >
              &times;
            </button>

            {/* Non-Scrollable Heading */}
            <div
              style={{
                width: "100%",
                backgroundColor: "rgb(235, 209, 151)",
                padding: "5px",
                borderBottom: "1px solid #ddd",
                position: "sticky",
                top: "0",
                zIndex: "150",
                textAlign: "center",
                fontSize: "18px",
                fontWeight: "bold",
                color: "black",
              }}
            >
              Grand Report (Struck Off Summary)
            </div>

            {/* Scrollable Content */}
            <div style={{ width: "100%", padding: "20px", overflowY: "auto" }}>
              <table
                id="SruckOff_Summary"
                border="1"
                cellPadding="10"
                style={{ width: "100%" }}
              >
                <thead>
                  <tr>
                    <th>Sr#</th>
                    <th>Class</th>
                    <th>Strength</th>
                  </tr>
                </thead>
                <tbody>
                  {StruckOffSummaryData.map((item, index) => (
                    <tr key={index}>
                      <td>{index + 1}</td>
                      <td>{item.class}</td>
                      <td>{item.total_students}</td>
                    </tr>
                  ))}
                  {/* Grand Total Row */}
                  <tr
                    style={{ fontWeight: "bold", backgroundColor: "#f9f9f9" }}
                  >
                    <td colSpan="2" style={{ textAlign: "right" }}>
                      Grand Total
                    </td>
                    <td>
                      {StruckOffSummaryData.reduce(
                        (total, item) => total + item.total_students,
                        0
                      )}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

      {showStruckOffSummary &&
        editFormData.summary_report == "view_house_and_club_report" && (
          <div
            className="admission-summary-modal"
            style={{
              border: "1px solid #ddd",
              padding: "10px",
              position: "fixed",
              left: "50%",
              top: "50%",
              transform: "translate(-50%, -50%)",
              zIndex: "100",
              backdropFilter: "blur(10px)",
              width: "80%",
              maxHeight: "80vh",
              overflowY: "auto",
              backgroundColor: "white",
              borderRadius: "10px",
              boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <style>
              {`
                    /* Custom scrollbar styles */
                    div::-webkit-scrollbar {
                        width: 8px;
                    }
                    div::-webkit-scrollbar-track {
                        background: #f1f1f1;
                        border-radius: 10px;
                    }
                    div::-webkit-scrollbar-thumb {
                        background: #888;
                        border-radius: 10px;
                    }
                    div::-webkit-scrollbar-thumb:hover {
                        background: #555;
                    }
                    table#SruckOff_Summary {
                        border: 1px solid black;
                        border-collapse: collapse;
                    }
                    table#SruckOff_Summary th, table#SruckOff_Summary td {
                        border: 1px solid gray;
                        padding: 10px !important;
                    }
                `}
            </style>

            {/* Close Button */}
            <button
              onClick={handleHide}
              style={{
                position: "absolute",
                top: "16px",
                right: "16px",
                background: "transparent",
                border: "none",
                fontSize: "20px",
                cursor: "pointer",
                zIndex: "200",
              }}
            >
              &times;
            </button>

            {/* Non-Scrollable Heading */}
            <div
              style={{
                width: "100%",
                backgroundColor: "rgb(235, 209, 151)",
                padding: "5px",
                borderBottom: "1px solid #ddd",
                position: "sticky",
                top: "0",
                zIndex: "150",
                textAlign: "center",
                fontSize: "18px",
                fontWeight: "bold",
                color: "black",
              }}
            >
              Grand Report (House And Club)
            </div>

            {/* Search Filter */}
            <div
              style={{
                width: "100%",
                padding: "10px 20px",
                position: "sticky",
                top: "50px",
                backgroundColor: "white",
                zIndex: "140",
                borderBottom: "1px solid #eee",
              }}
            >
              <input
                type="text"
                placeholder="Search by name, class, house, or club..."
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{
                  width: "100%",
                  padding: "8px 15px",
                  // borderRadius: '20px',
                  border: "1px solid #ddd",
                  fontSize: "14px",
                  outline: "none",
                  // boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                }}
              />
            </div>

            {/* Scrollable Content */}
            <div style={{ width: "100%", padding: "20px", overflowY: "auto" }}>
              <table
                id="SruckOff_Summary"
                border="1"
                cellPadding="10"
                style={{ width: "100%" }}
              >
                <thead>
                  <tr>
                    <th>Sr#</th>
                    <th>Class</th>
                    <th>Section</th>
                    <th>Name</th>
                    <th>House</th>
                    <th>Club</th>
                  </tr>
                </thead>
                <tbody>
                  {StruckOffSummaryData.filter((item) => {
                    if (!searchTerm) return true;
                    const term = searchTerm.toLowerCase();
                    return (
                      matchesSearch(item.class_name, term) ||
                      matchesSearch(item.section_name, term) ||
                      matchesSearch(item.full_name, term) ||
                      matchesSearch(item.house_name, term) ||
                      matchesSearch(item.club_name, term)
                    );
                  }).map((item, index) => (
                    <tr key={index}>
                      <td>{index + 1}</td>
                      <td>{item.class_name}</td>
                      <td>{item.section_name}</td>
                      <td>{item.full_name}</td>
                      <td>{item.house_name}</td>
                      <td>{item.club_name}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

      {showSLCData && getSLCdata && (
        <div className="col-12">
          <div
            className="slc-modal-overlay"
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: "rgba(0, 0, 0, 0.7)",
              zIndex: 1100,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "20px",
            }}
          >
            <style>
              {`
          /* Scrollbar styles */
          .slc-scroll-container::-webkit-scrollbar {
            width: 8px;
          }
          .slc-scroll-container::-webkit-scrollbar-track {
            background: #f1f1f1;
            border-radius: 10px;
          }
          .slc-scroll-container::-webkit-scrollbar-thumb {
            background: #888;
            border-radius: 10px;
          }
          .slc-scroll-container::-webkit-scrollbar-thumb:hover {
            background: #555;
          }

          /* Print styles - Portrait A4 */
          @media print {
            body * {
              visibility: hidden;
            }
            
            .slc-certificate-wrapper, .slc-certificate-wrapper * {
              visibility: visible;
            }

            .promotion_hide{
                display:none !important;
            }

            .checkbox_hide{
             display:none !important;
            }
            
            .slc-certificate-wrapper {
              position: absolute;
              left: 0;
              top: 0;
              width: 210mm;
              height: 297mm;
              margin: 0;
              padding: 0;
            }
            
            .slc-modal-overlay {
              background: white !important;
              position: static !important;
              padding: 0 !important;
            }
            
            .print-hide {
              display: none !important;
            }
            
            .slc-scroll-container {
              overflow: visible !important;
              max-height: none !important;
              box-shadow: none !important;
            }

            @page {
              size: A4 portrait;
              margin: 0;
            }
          }

          /* Certificate Styles */
          .certificate-outer-border {
            border: 8px solid #0f172a;
            position: relative;
            background: white;
          }

          .certificate-inner-border {
            position: absolute;
            top: 16px;
            left: 16px;
            right: 16px;
            bottom: 16px;
            border: 2px solid #0f172a;
          }

          .certificate-corner-design {
            position: absolute;
            width: 40px;
            height: 40px;
            border: 3px solid #b8860b;
          }

          .corner-tl {
            top: 24px;
            left: 24px;
            border-right: none;
            border-bottom: none;
          }

          .corner-tr {
            top: 24px;
            right: 24px;
            border-left: none;
            border-bottom: none;
          }

          .corner-bl {
            bottom: 24px;
            left: 24px;
            border-right: none;
            border-top: none;
          }

          .corner-br {
            bottom: 24px;
            right: 24px;
            border-left: none;
            border-top: none;
          }
        `}
            </style>

            <div
              className="slc-scroll-container"
              style={{
                backgroundColor: "white",
                borderRadius: "8px",
                maxWidth: "850px",
                width: "100%",
                maxHeight: "95vh",
                overflowY: "auto",
                boxShadow: "0 20px 60px rgba(0, 0, 0, 0.3)",
                position: "relative",
              }}
            >
              {/* Close Button */}
              <button
                onClick={handleHide}
                className="print-hide"
                style={{
                  position: "absolute",
                  top: "15px",
                  right: "15px",
                  // background: "#dc2626",
                  color: "black",
                  border: "none",
                  width: "40px",
                  height: "40px",
                  borderRadius: "50%",
                  fontSize: "24px",
                  cursor: "pointer",
                  zIndex: "1000",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontWeight: "bold",
                  // boxShadow: "0 4px 12px rgba(220, 38, 38, 0.4)",
                  transition: "all 0.2s",
                }}
                // onMouseOver={(e) => e.target.style.background = "#b91c1c"}
                // onMouseOut={(e) => e.target.style.background = "#dc2626"}
              >
                ×
              </button>

              {/* Certificate Content */}
              <div
                ref={componentRef}
                className="slc-certificate-wrapper"
                style={{
                  padding: "40px",
                  minHeight: "auto",
                  paddingBottom: "0px",
                }}
              >
                <div className="certificate-outer-border">
                  <div className="certificate-inner-border"></div>

                  {/* Corner Designs */}
                  <div className="certificate-corner-design corner-tl"></div>
                  <div className="certificate-corner-design corner-tr"></div>
                  <div className="certificate-corner-design corner-bl"></div>
                  <div className="certificate-corner-design corner-br"></div>

                  {/* Main Content */}
                  <div
                    style={{
                      padding: "30px 50px",
                      position: "relative",
                      zIndex: "1",
                    }}
                  >
                    {/* School Logo */}
                    <div style={{ textAlign: "center", marginBottom: "25px" }}>
                      <div
                        style={{
                          width: "110px",
                          height: "110px",
                          margin: "0 auto",
                          // background: "linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)",
                          borderRadius: "50%",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          border: "4px solid #b8860b",
                          boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
                        }}
                      >
                        <img
                          src={
                            process.env.REACT_APP_BASE_URL +
                            `/uploads/nasheman_logo.png`
                          }
                          alt="School Logo"
                          style={{
                            maxWidth: "85%",
                            maxHeight: "85%",
                            objectFit: "contain",
                          }}
                          onError={(e) => {
                            e.target.style.display = "none";
                            e.target.parentElement.innerHTML =
                              '<div style="color: white; font-size: 42px; font-weight: bold; font-family: serif;">SS</div>';
                          }}
                        />
                      </div>
                    </div>

                    {/* School Name */}
                    <div style={{ textAlign: "center", marginBottom: "8px" }}>
                      <h4
                        style={{
                          fontFamily: "'Serif', 'Times New Roman', serif",
                          fontWeight: "bold",
                          color: "#0f172a",
                          margin: "0",
                          fontWeight: "bolder",
                          textDecoration: "underline",
                          lineHeight: 1.5,
                        }}
                      >
                        NASHEMAN SCHOOL & COLLGE FOR SPEICAL EDUCATION &
                        REHABILITATION CENTER
                      </h4>
                    </div>

                    {/* Campus Name */}
                    <div style={{ textAlign: "center", marginBottom: "5px" }}>
                      {/* <p
                  style={{
                    fontFamily: "'Serif', 'Times New Roman', serif",
                    fontSize: "18px",
                    color: "#475569",
                    margin: "0",
                  }}
                >
                  {getSLCdata.campus_name}
                </p> */}
                    </div>

                    {/* School Motto */}
                    <div style={{ textAlign: "center", marginBottom: "10px" }}>
                      <p
                        style={{
                          fontFamily: "'Serif', 'Times New Roman', serif",
                          fontSize: "14px",
                          color: "#64748b",
                          fontStyle: "italic",
                          margin: "0",
                        }}
                      >
                        "Excellence in Education"
                      </p>
                    </div>

                    {/* Certificate Title */}
                    <div style={{ textAlign: "center", marginBottom: "10px" }}>
                      <div
                        style={{
                          display: "inline-block",
                          borderTop: "3px solid #b8860b",
                          borderBottom: "3px solid #b8860b",
                          padding: "12px 50px",
                        }}
                      >
                        <h2
                          style={{
                            fontFamily: "'Serif', 'Times New Roman', serif",
                            fontSize: "28px",
                            fontWeight: "bold",
                            color: "#0f172a",
                            margin: "0",
                            letterSpacing: "4px",
                            textTransform: "uppercase",
                          }}
                        >
                          School Leaving Certificate
                        </h2>
                      </div>
                    </div>

                    {/* Certificate Details */}
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        marginBottom: "10px",
                        fontFamily: "'Serif', 'Times New Roman', serif",
                        fontSize: "13px",
                      }}
                    >
                      <div>
                        <p style={{ margin: "4px 0", color: "#334155" }}>
                          <strong>Certificate No:</strong>{" "}
                          {getSLCdata.slc_invoice_no}
                        </p>
                        <p style={{ margin: "4px 0", color: "#334155" }}>
                          <strong>Registration No:</strong>{" "}
                          {getSLCdata.register_no}
                        </p>
                        <p style={{ margin: "4px 0", color: "#334155" }}>
                          <strong>Shift:</strong> {getSLCdata.shift}
                        </p>
                      </div>
                      <div style={{ textAlign: "right" }}>
                        <p style={{ margin: "4px 0", color: "#334155" }}>
                          <strong>Issue Date:</strong>{" "}
                          {new Date().toLocaleDateString("en-GB")}
                        </p>
                      </div>
                    </div>

                    {/* Main Certificate Text */}
                    <div
                      style={{
                        fontFamily: "'Serif', 'Times New Roman', serif",
                        fontSize: "16px",
                        lineHeight: "2",
                        textAlign: "justify",
                        color: "#1e293b",
                        margin: "10px 0",
                      }}
                    >
                      <p style={{ marginBottom: "22px" }}>
                        This is to certify that{" "}
                        <strong
                          style={{
                            borderBottom: "2px solid #0f172a",
                            paddingBottom: "2px",
                            color: "#0f172a",
                          }}
                        >
                          {getSLCdata.full_name}
                        </strong>
                        , daughter/son of{" "}
                        <strong
                          style={{
                            borderBottom: "2px solid #0f172a",
                            paddingBottom: "2px",
                            color: "#0f172a",
                          }}
                        >
                          {getSLCdata.father_name}
                        </strong>
                        , was a bonafide student of{" "}
                        <strong style={{ color: "#0f172a" }}>
                          {getSLCdata.campus_name}
                        </strong>
                        , and was studying in Class{" "}
                        <strong style={{ color: "#0f172a" }}>
                          {getSLCdata.class_name}
                        </strong>
                        , Department{" "}
                        <strong style={{ color: "#0f172a" }}>
                          ({getSLCdata.section_name})
                        </strong>{" "}
                        during the academic session.
                      </p>

                      {/* <p style={{ marginBottom: "22px" }}>
                        His/Her Date of Birth as per school records is{" "}
                        <strong
                          style={{
                            borderBottom: "2px solid #0f172a",
                            paddingBottom: "2px",
                            color: "#0f172a",
                          }}
                        >
                          {new Date(getSLCdata.dob).toLocaleDateString("en-GB")}
                        </strong>
                        .
                      </p> */}

                      <p style={{ marginBottom: "22px" }}>
                        The student has been granted this School Leaving
                        Certificate on{" "}
                        <strong
                          style={{
                            borderBottom: "2px solid #0f172a",
                            paddingBottom: "2px",
                            color: "#0f172a",
                          }}
                        >
                          {new Date(getSLCdata.status_date).toLocaleDateString(
                            "en-GB"
                          )}
                        </strong>{" "}
                        upon request. All school dues have been cleared up to{" "}
                        <strong style={{ color: "#0f172a" }}>
                          {new Date(
                            `${getSLCdata.for_the_month}-01`
                          ).toLocaleString("en-US", { month: "long" })}{" "}
                          {new Date(getSLCdata.for_the_month).getFullYear()}
                        </strong>
                        .
                      </p>

                      {/* <p style={{ marginBottom: "0" }}>
                  The student's conduct and character during their tenure at this institution were{" "}
                  <strong style={{ color: "#0f172a" }}>satisfactory</strong>.
                </p> */}
                    </div>

                    <div className="form-group checkbox_hide">
                      <div className="form-check">
                        <input
                          type="checkbox"
                          className="form-check-input"
                          id="promotionCheck"
                          checked={isPromoted}
                          onChange={(e) => {
                            setIsPromoted(e.target.checked);
                            if (!e.target.checked) {
                              setPromotedToClass("");
                            }
                          }}
                        />
                        <label
                          className="form-check-label"
                          htmlFor="promotionCheck"
                        >
                          Student is Promoted
                        </label>
                      </div>
                    </div>

                    {isPromoted && (
                      <div className="form-group mt-2 promotion_hide">
                        <label htmlFor="promotedClass">Promoted to Class</label>
                        <input
                          type="text"
                          className="form-control"
                          id="promotedClass"
                          placeholder="Enter class name (e.g., 9th, 10th)"
                          value={promotedToClass}
                          onChange={(e) => setPromotedToClass(e.target.value)}
                        />
                      </div>
                    )}

                    <p
                      style={{
                        marginBottom:
                          isPromoted && promotedToClass ? "22px" : "22px",
                      }}
                    >
                      The student's conduct and character during their tenure at
                      this institution were{" "}
                      <strong style={{ color: "#0f172a" }}>Good</strong>
                      .
                    </p>

                    {isPromoted && promotedToClass && (
                      <p style={{ marginBottom: "22px" }}>
                        This student is promoted to{" "}
                        <strong
                          style={{
                            borderBottom: "2px solid #0f172a",
                            paddingBottom: "2px",
                            color: "#0f172a",
                          }}
                        >
                          {promotedToClass}
                        </strong>{" "}
                        class.
                      </p>
                    )}

                    {/* Signatures Section */}
                    <div>
                      <div
                        style={{
                          display: "grid",
                          gridTemplateColumns: "1fr 1fr",
                          gap: "60px",
                          fontFamily: "'Serif', 'Times New Roman', serif",
                        }}
                      >
                        {/* Guardian Signature */}
                        <div style={{ textAlign: "center" }}>
                          <div style={{ marginBottom: "40px" }}></div>
                          <div
                            style={{
                              borderTop: "2px solid #0f172a",
                              paddingTop: "10px",
                            }}
                          >
                            <p
                              style={{
                                margin: "0",
                                fontWeight: "bold",
                                fontSize: "15px",
                                color: "#0f172a",
                              }}
                            >
                              Guardian's Signature
                            </p>
                          </div>
                        </div>

                        {/* Principal Signature */}
                        <div style={{ textAlign: "center" }}>
                          <div style={{ marginBottom: "40px" }}></div>
                          <div
                            style={{
                              borderTop: "2px solid #0f172a",
                              paddingTop: "10px",
                            }}
                          >
                            <p
                              style={{
                                margin: "0",
                                fontWeight: "bold",
                                fontSize: "15px",
                                color: "#0f172a",
                              }}
                            >
                              Principal's Signature
                            </p>
                            <p
                              style={{
                                margin: "5px 0 0 0",
                                fontSize: "13px",
                                color: "#64748b",
                              }}
                            >
                              (Official School Seal)
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Footer Note */}
                    <div
                      style={{
                        marginTop: "10px",
                        paddingTop: "15px",
                        borderTop: "1px solid #cbd5e1",
                        textAlign: "center",
                      }}
                    >
                      <p
                        style={{
                          fontFamily: "'Serif', 'Times New Roman', serif",
                          fontSize: "11px",
                          color: "#64748b",
                          fontStyle: "italic",
                          margin: "0",
                        }}
                      >
                        Note: This is an official document of Nasheman. Any
                        alteration, erasure, or tampering will render it
                        invalid.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Print Button */}
              <div
                className="print-hide"
                style={{ padding: "20px", textAlign: "center" }}
              >
                <button
                  onClick={handlePrint}
                  className="btn btn-sm btn-primary"
                >
                  <i className="fa fa-print" aria-hidden="true"></i> Print
                  Certificate
                </button>
              </div>
            </div>
          </div>
        </div>
      )}



      {showCharacterCertificate && (
      <CharacterCertificate 
        admissionData={selectedAdmission}
        onClose={() => setShowCharacterCertificate(false)}
      />
    )}



      
    </div>
  );
};

export default AdmissionList;
