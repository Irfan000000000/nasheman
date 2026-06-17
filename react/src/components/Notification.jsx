import React, { useCallback, useContext, useEffect, useState, useMemo } from "react";
import axios from "axios";
import Select from "react-select";
import { useDropzone } from "react-dropzone";
import { useAuth } from "./AuthContext";
import AcademicSessionContext from "./AcademicSessionContext";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import ReactPaginate from "react-paginate";

function Notification() {
  const { user } = useAuth();
  const { academicSession } = useContext(AcademicSessionContext);

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [isEditMode, setIsEditMode] = useState(false);
  const [showData, setShowData] = useState("");
  const [totalItem, setTotalItem] = useState(10);
  const [fileName, setFileName] = useState("");
  const [filePreview, setFilePreview] = useState(null);
  const [searchCategoryReport, setSearchCategoryReport] = useState({ search: "" });

  const typeOptions = [
    { value: "News", label: "📰 News" },
    { value: "Event", label: "📅 Event" },
    { value: "Notification", label: "🔔 Notification" },
  ];

  const styles = {
    container: {
      fontFamily: 'Arial, sans-serif',
      padding: '20px',
      backgroundColor: '#f5f5f5',
      minHeight: '100vh'
    },
    mainCard: {
      maxWidth: '900px',
      margin: '0 auto',
      backgroundColor: '#fff',
      borderRadius: '8px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
      overflow: 'hidden'
    },
    header: {
      background: 'linear-gradient(135deg, #111418 0%, #1a1f25 100%)',
      color: '#EBD197',
      padding: '14px 18px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      borderBottom: '3px solid #EBD197'
    },
    headerTitle: {
      margin: 0,
      fontSize: '16px',
      fontWeight: 700,
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
      letterSpacing: '0.2px'
    },
    button: {
      backgroundColor: '#EBD197',
      color: '#1f2329',
      border: 'none',
      padding: '8px 16px',
      borderRadius: '6px',
      cursor: 'pointer',
      fontSize: '13px',
      fontWeight: 600,
      transition: 'all 0.2s ease',
      display: 'inline-flex',
      alignItems: 'center',
      gap: '6px'
    },
    buttonDanger: { backgroundColor: '#dc3545', color: '#fff' },
    buttonSuccess: { backgroundColor: '#28a745', color: '#fff' },
    buttonPrimary: { backgroundColor: '#007bff', color: '#fff' },
    buttonSecondary: { backgroundColor: '#6c757d', color: '#fff' },
    formContainer: { padding: '20px' },
    formGroup: { flex: 1, marginBottom: '20px' },
    label: {
      display: 'block',
      marginBottom: '8px',
      fontWeight: '500',
      color: '#333',
      fontSize: '14px'
    },
    input: {
      width: '100%',
      padding: '10px',
      border: '1px solid #ddd',
      borderRadius: '4px',
      fontSize: '14px',
      boxSizing: 'border-box'
    },
    inputInvalid: { borderColor: '#dc3545' },
    errorText: { color: '#dc3545', fontSize: '12px', marginTop: '4px' },
    dropzone: {
      border: '2px dashed #ddd',
      borderRadius: '4px',
      padding: '30px 20px',
      textAlign: 'center',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      backgroundColor: '#fafafa'
    },
    modal: {
      position: 'fixed',
      top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: '20px',
      overflowY: 'auto'
    },
    modalContent: {
      backgroundColor: '#fff',
      borderRadius: '8px',
      width: '95%',
      maxWidth: '1400px',
      maxHeight: '90vh',
      overflow: 'hidden',
      boxShadow: '0 10px 40px rgba(0,0,0,0.2)',
      display: 'flex',
      flexDirection: 'column'
    },
    modalHeader: {
      background: 'linear-gradient(135deg, #111418 0%, #1a1f25 100%)',
      color: '#EBD197',
      padding: '14px 18px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      borderBottom: '3px solid #EBD197'
    },
    modalBody: { padding: '20px', overflowY: 'auto', flex: 1 },
    closeButton: {
      backgroundColor: 'transparent',
      border: 'none',
      color: '#fff',
      cursor: 'pointer',
      fontSize: '28px',
      lineHeight: '1',
      padding: '0',
      width: '30px',
      height: '30px'
    },
    table: {
      width: '100%',
      borderCollapse: 'collapse',
      backgroundColor: '#fff',
      marginTop: '20px'
    },
    th: {
      background: 'linear-gradient(135deg, #111418 0%, #1a1f25 100%)',
      color: '#EBD197',
      padding: '12px',
      textAlign: 'left',
      fontWeight: 700,
      fontSize: '13px',
      borderRight: '1px solid #2a3038'
    },
    td: {
      padding: '12px',
      borderBottom: '1px solid #ddd',
      fontSize: '14px',
      verticalAlign: 'top'
    },
    buttonGroup: {
      display: 'flex',
      gap: '8px',
      justifyContent: 'flex-end',
      marginTop: '20px'
    },
    searchContainer: {
      display: 'flex',
      gap: '10px',
      alignItems: 'center',
      flexWrap: 'wrap',
      marginBottom: '20px'
    },
    actionButtons: { display: 'flex', gap: '8px' },
    iconButton: {
      padding: '6px 12px',
      border: 'none',
      borderRadius: '4px',
      cursor: 'pointer',
      fontSize: '14px',
      transition: 'all 0.3s ease'
    },
    badge: {
      display: 'inline-block',
      padding: '3px 10px',
      borderRadius: '12px',
      fontSize: '12px',
      fontWeight: 'bold',
      color: '#fff'
    }
  };

  const initialState = {
    hidden_id: "",
    title: "",
    type: "",
    description: "",
    start_date: "",
    end_date: "",
    session_id: academicSession,
    campus_id: user?.user?.campus_id,
    created_by: user?.user?.student_unique_id,
    notification_file: null,
    current_file: "",
    is_active: 1,
  };

  const [formData, setFormData] = useState(initialState);

  const [validity, setValidity] = useState({
    title: true,
    type: true,
    description: true,
    start_date: true,
  });

  const modules = useMemo(() => ({
    toolbar: [
      [{ header: [1, 2, 3, false] }],
      ["bold", "italic", "underline", "strike"],
      [{ list: "ordered" }, { list: "bullet" }],
      ["link"],
      ["clean"],
    ],
  }), []);

  const formats = ["header", "bold", "italic", "underline", "strike", "list", "bullet", "link"];

  useEffect(() => {
    if (academicSession) {
      setFormData((prev) => ({ ...prev, session_id: parseInt(academicSession) }));
    }
  }, [academicSession]);

  useEffect(() => {
    fetchData();
  }, [currentPage, totalItem]);

  const onDrop = useCallback((acceptedFiles, rejectedFiles) => {
    if (rejectedFiles && rejectedFiles.length > 0) {
      const err = rejectedFiles[0].errors[0];
      if (err?.code === 'file-too-large') toast.error("File size must be less than 10MB");
      else if (err?.code === 'file-invalid-type') toast.error("Invalid file type");
      else toast.error("File upload failed");
      return;
    }
    const file = acceptedFiles[0];
    if (file.size > 10 * 1024 * 1024) { toast.error("File size must be less than 10MB"); return; }
    setFileName(file.name);
    setFormData((prev) => ({ ...prev, notification_file: file }));
    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = () => setFilePreview(reader.result);
      reader.readAsDataURL(file);
    } else {
      setFilePreview(null);
    }
  }, [formData]);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: {
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/png': ['.png'],
      'image/gif': ['.gif'],
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'application/vnd.ms-excel': ['.xls'],
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
      'text/plain': ['.txt']
    },
    maxFiles: 1,
    maxSize: 10 * 1024 * 1024,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setValidity((prev) => ({ ...prev, [name]: true }));
  };

  const handleTypeChange = (selectedOption) => {
    setFormData((prev) => ({ ...prev, type: selectedOption?.value || "" }));
    setValidity((prev) => ({ ...prev, type: true }));
  };

  const handleDescriptionChange = (value) => {
    setFormData((prev) => ({ ...prev, description: value }));
    setValidity((prev) => ({ ...prev, description: true }));
  };

  const validateForm = () => {
    let isValid = true;
    const newValidity = { title: true, type: true, description: true, start_date: true };

    if (!formData.title.trim()) { newValidity.title = false; isValid = false; }
    if (!formData.type) { newValidity.type = false; isValid = false; }
    if (!formData.description || formData.description.trim() === "<p><br></p>") { newValidity.description = false; isValid = false; }
    if (!formData.start_date.trim()) { newValidity.start_date = false; isValid = false; }

    setValidity(newValidity);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) { toast.error("Please fill all required fields"); return; }

    const fd = new FormData();
    for (const key in formData) { fd.append(key, formData[key]); }

    try {
      const url = isEditMode
        ? process.env.REACT_APP_API_BASE_URL + `/update-notification/${formData.hidden_id}`
        : process.env.REACT_APP_API_BASE_URL + "/insert-notification";
      const method = isEditMode ? "put" : "post";
      const response = await axios[method](url, fd, { headers: { "Content-Type": "multipart/form-data" } });

      if (response.data.error) {
        toast.error(response.data.error);
      } else {
        toast.success(`Notification ${isEditMode ? "updated" : "added"} successfully!`);
        resetForm();
        fetchData();
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error(`Failed to ${isEditMode ? "update" : "add"} notification.`);
    }
  };

  const resetForm = () => {
    setFormData({ ...initialState, session_id: academicSession, campus_id: user?.user?.campus_id, created_by: user?.user?.student_unique_id });
    setFilePreview(null);
    setFileName("");
    setIsEditMode(false);
  };

  const fetchData = () => {
    axios.get(process.env.REACT_APP_API_BASE_URL + "/notification-list", {
      params: {
        page: currentPage,
        limit: totalItem,
        search: searchCategoryReport.search,
        campus_id: user?.user?.campus_id,
        session_id: academicSession,
      },
    })
    .then((res) => {
      setData(res.data.data);
      setTotalPages(res.data.totalPages);
      setLoading(false);
    })
    .catch((err) => { console.log(err); setLoading(false); });
  };

  const handlePageChange = ({ selected }) => setCurrentPage(selected + 1);
  const handleTotalItemChange = (e) => setTotalItem(e.target.value);
  const handleKeyDown = (e) => { if (e.key === "Enter") fetchData(); };

  const handleDelete = (id) => {
    if (!window.confirm("Are you sure you want to delete?")) return;
    axios.delete(process.env.REACT_APP_API_BASE_URL + `/delete-notification/${id}/${user?.user?.campus_id}`)
      .then(() => {
        setData((prev) => prev.filter((d) => d.id !== id));
        toast.error("Notification deleted successfully");
      })
      .catch((err) => console.error("Error deleting:", err));
  };

  // Mobile tab state — desktop shows both panes side-by-side, mobile toggles
  const [mobileTab, setMobileTab] = useState('form'); // 'form' | 'list'

  const handleEditFromList = (id) => {
    editNotification(id);
    setMobileTab('form');
  };

  const editNotification = (id) => {
    axios.get(process.env.REACT_APP_API_BASE_URL + `/get-notification/${id}/${user?.user?.campus_id}`)
      .then((response) => {
        const item = response.data.results[0];
        const formatDate = (d) => {
          if (!d) return "";
          const date = new Date(d);
          return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
        };
        setFormData({
          hidden_id: item.id,
          title: item.title,
          type: item.type,
          description: item.description,
          start_date: formatDate(item.start_date),
          end_date: formatDate(item.end_date),
          session_id: academicSession,
          campus_id: user?.user?.campus_id,
          created_by: user?.user?.student_unique_id,
          notification_file: null,
          current_file: item.notification_file || "",
          is_active: item.is_active,
        });
        setFileName(item.notification_file ? item.notification_file.split("/").pop() : "");
        setIsEditMode(true);
        setShowData("");
      })
      .catch((err) => console.error("Error fetching notification:", err));
  };

  const handleDownload = async (fileName) => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/uploads/${fileName}`);
      if (!response.ok) throw new Error('File not found');
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      toast.success('File downloaded successfully');
    } catch (error) {
      toast.error('Failed to download file');
    }
  };

  const getBadgeColor = (type) => {
    if (type === "News") return "#17a2b8";
    if (type === "Event") return "#6f42c1";
    return "#ffc107";
  };

  return (
    <div className="nf-shell">
      <style>{`
        .nf-shell {
          display: flex;
          flex-direction: column;
          height: 100%;
          min-height: 100%;
          background: #f4f6fa;
          font-family: "Segoe UI", system-ui, -apple-system, sans-serif;
        }
        .nf-tabs {
          display: flex;
          background: #fff;
          border-bottom: 1px solid #e6e8eb;
          position: sticky;
          top: 0;
          z-index: 5;
        }
        .nf-tab {
          flex: 1;
          padding: 14px 12px;
          background: transparent;
          border: none;
          font-size: 14px;
          font-weight: 600;
          color: #6c757d;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          border-bottom: 3px solid transparent;
          transition: all 0.2s ease;
          -webkit-tap-highlight-color: transparent;
        }
        .nf-tab.is-active {
          color: #111418;
          border-bottom-color: #EBD197;
          background: #fffaf0;
        }
        .nf-tab .nf-badge {
          background: #EBD197;
          color: #1f2329;
          font-size: 11px;
          font-weight: 700;
          padding: 2px 8px;
          border-radius: 999px;
          min-width: 22px;
        }
        .nf-body {
          flex: 1;
          display: flex;
          flex-direction: row;
          overflow: hidden;
          min-height: 0;
        }
        .nf-pane {
          flex: 1;
          overflow-y: auto;
          -webkit-overflow-scrolling: touch;
          padding: 14px;
          box-sizing: border-box;
        }
        .nf-pane--form { background: #f4f6fa; }
        .nf-pane--list {
          background: #fff;
          border-left: 1px solid #e6e8eb;
          max-width: 420px;
          min-width: 320px;
        }
        .nf-pane--list h3 {
          margin: 0 0 12px 0;
          font-size: 15px;
          font-weight: 700;
          color: #111418;
          display: flex;
          align-items: center;
          gap: 8px;
          padding-bottom: 10px;
          border-bottom: 2px solid #EBD197;
        }
        .nf-search {
          display: flex;
          gap: 8px;
          margin-bottom: 12px;
          flex-wrap: wrap;
        }
        .nf-search input {
          flex: 1;
          min-width: 120px;
          padding: 9px 12px;
          border: 1px solid #d0d7e2;
          border-radius: 8px;
          font-size: 13px;
          background: #fff;
        }
        .nf-search input:focus { outline: none; border-color: #EBD197; box-shadow: 0 0 0 3px rgba(235,209,151,0.25); }
        .nf-search button {
          padding: 9px 14px;
          background: #111418;
          color: #EBD197;
          border: none;
          border-radius: 8px;
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          gap: 6px;
        }
        .nf-card {
          background: #fff;
          border: 1px solid #e6e8eb;
          border-left: 4px solid #EBD197;
          border-radius: 10px;
          padding: 12px;
          margin-bottom: 10px;
          box-shadow: 0 1px 3px rgba(0,0,0,0.04);
          transition: box-shadow 0.15s ease, transform 0.1s ease;
        }
        .nf-card:hover { box-shadow: 0 3px 10px rgba(0,0,0,0.08); }
        .nf-card__top {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 8px;
          gap: 8px;
          flex-wrap: wrap;
        }
        .nf-card__type {
          font-size: 11px;
          font-weight: 700;
          color: #fff;
          padding: 3px 9px;
          border-radius: 999px;
          letter-spacing: 0.3px;
          text-transform: uppercase;
        }
        .nf-card__date {
          font-size: 11px;
          color: #6c757d;
          font-weight: 600;
        }
        .nf-card__title {
          font-size: 14px;
          font-weight: 700;
          color: #1f2329;
          margin-bottom: 6px;
          line-height: 1.3;
        }
        .nf-card__desc {
          font-size: 12px;
          color: #495057;
          line-height: 1.45;
          max-height: 60px;
          overflow: hidden;
          margin-bottom: 8px;
        }
        .nf-card__desc p { margin: 0; }
        .nf-card__status {
          display: inline-block;
          font-size: 10px;
          font-weight: 700;
          padding: 2px 8px;
          border-radius: 4px;
          margin-bottom: 6px;
        }
        .nf-card__status--on { background: #d4edda; color: #155724; }
        .nf-card__status--off { background: #f8d7da; color: #842029; }
        .nf-card__actions {
          display: flex;
          gap: 6px;
          flex-wrap: wrap;
          margin-top: 8px;
          padding-top: 8px;
          border-top: 1px dashed #e6e8eb;
        }
        .nf-card__btn {
          flex: 1;
          min-width: 60px;
          padding: 7px 10px;
          border: none;
          border-radius: 6px;
          font-size: 12px;
          font-weight: 600;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 5px;
          transition: opacity 0.15s ease;
        }
        .nf-card__btn:active { opacity: 0.8; }
        .nf-card__btn--download { background: #d4edda; color: #155724; }
        .nf-card__btn--edit { background: #cfe2ff; color: #084298; }
        .nf-card__btn--delete { background: #f8d7da; color: #842029; }
        .nf-empty {
          text-align: center;
          padding: 30px 16px;
          color: #6c757d;
          font-size: 13px;
        }
        .nf-empty i { font-size: 28px; color: #d0d7e2; display: block; margin-bottom: 8px; }
        .nf-pagination-wrap { margin-top: 12px; display: flex; justify-content: center; }
        .nf-pagination-wrap .pagination {
          display: inline-flex;
          gap: 4px;
          padding-left: 0;
          margin: 0;
          list-style: none;
          flex-wrap: wrap;
          justify-content: center;
        }
        .nf-pagination-wrap .page-item .page-link {
          padding: 6px 10px;
          font-size: 12px;
          border: 1px solid #d0d7e2;
          color: #1f2329;
          background: #fff;
          border-radius: 6px;
          text-decoration: none;
          cursor: pointer;
          display: inline-block;
        }
        .nf-pagination-wrap .page-item.active .page-link {
          background: #111418;
          color: #EBD197;
          border-color: #111418;
        }
        @media (max-width: 991px) {
          .nf-pane--form { display: ${mobileTab === 'form' ? 'block' : 'none'}; }
          .nf-pane--list { display: ${mobileTab === 'list' ? 'block' : 'none'}; max-width: none; min-width: 0; border-left: none; }
        }
        @media (min-width: 992px) {
          .nf-tabs { display: none; }
          .nf-pane--form { display: block; }
          .nf-pane--list { display: block; }
        }
      `}</style>

      {/* Mobile tabs */}
      <div className="nf-tabs">
        <button
          type="button"
          className={`nf-tab ${mobileTab === 'form' ? 'is-active' : ''}`}
          onClick={() => setMobileTab('form')}
        >
          <i className={`fas ${isEditMode ? 'fa-edit' : 'fa-plus-circle'}`}></i>
          {isEditMode ? 'Edit Notification' : 'Add Notification'}
        </button>
        <button
          type="button"
          className={`nf-tab ${mobileTab === 'list' ? 'is-active' : ''}`}
          onClick={() => setMobileTab('list')}
        >
          <i className="fas fa-bell"></i>
          List
          {data && data.length > 0 && <span className="nf-badge">{data.length}</span>}
        </button>
      </div>

      <div className="nf-body">
        {/* FORM PANE */}
        <div className="nf-pane nf-pane--form">
          <div style={styles.mainCard}>
            <div style={styles.header}>
              <h5 style={styles.headerTitle}>
                <i className="fas fa-bell"></i>
                {isEditMode ? 'Edit Notification' : 'Add Notification / News / Event'}
              </h5>
              {isEditMode && (
                <button
                  type="button"
                  style={{ ...styles.button, ...styles.buttonSecondary }}
                  onClick={resetForm}
                >
                  <i className="fas fa-times"></i> Cancel Edit
                </button>
              )}
            </div>

        {/* Form */}
        <form style={styles.formContainer} onSubmit={handleSubmit}>
          <input type="hidden" name="hidden_id" value={formData.hidden_id} />
          <input type="hidden" name="current_file" value={formData.current_file} />

          {/* Title */}
          <div style={styles.formGroup}>
            <label style={styles.label}>Title *</label>
            <input
              type="text"
              name="title"
              placeholder="Enter title..."
              style={{ ...styles.input, ...(validity.title ? {} : styles.inputInvalid) }}
              value={formData.title}
              onChange={handleChange}
            />
            {!validity.title && <div style={styles.errorText}>Please enter a title</div>}
          </div>

          {/* Type */}
          <div style={styles.formGroup}>
            <label style={styles.label}>Type *</label>
            <Select
              options={typeOptions}
              value={typeOptions.find((o) => o.value === formData.type) || null}
              onChange={handleTypeChange}
              placeholder="Select Type (News / Event / Notification)"
              styles={{
                control: (base) => ({
                  ...base,
                  borderColor: validity.type ? '#ddd' : '#dc3545'
                })
              }}
            />
            {!validity.type && <div style={styles.errorText}>Please select a type</div>}
          </div>

          {/* Dates Row */}
          <div style={{ display: 'flex', gap: '15px' }}>
            <div style={{ ...styles.formGroup, flex: 1 }}>
              <label style={styles.label}>Start Date *</label>
              <input
                type="date"
                name="start_date"
                style={{ ...styles.input, ...(validity.start_date ? {} : styles.inputInvalid) }}
                value={formData.start_date}
                onChange={handleChange}
              />
              {!validity.start_date && <div style={styles.errorText}>Please select a start date</div>}
            </div>
            <div style={{ ...styles.formGroup, flex: 1 }}>
              <label style={styles.label}>End Date <span style={{ color: '#999', fontWeight: 'normal' }}>(Optional)</span></label>
              <input
                type="date"
                name="end_date"
                style={styles.input}
                value={formData.end_date}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Description */}
          <div style={styles.formGroup}>
            <label style={styles.label}>Description *</label>
            <ReactQuill
              theme="snow"
              value={formData.description}
              onChange={handleDescriptionChange}
              modules={modules}
              formats={formats}
              placeholder="Enter details..."
            />
            {!validity.description && <div style={styles.errorText}>Please enter a description</div>}
          </div>

          {/* File Upload */}
          <div style={styles.formGroup}>
            <label style={styles.label}>
              {isEditMode ? "Update File" : "Attach File"} <span style={{ color: '#999', fontWeight: 'normal' }}>(Optional, Max 10MB)</span>
            </label>
            <div
              {...getRootProps()}
              style={styles.dropzone}
              onMouseOver={(e) => e.currentTarget.style.borderColor = '#007bff'}
              onMouseOut={(e) => e.currentTarget.style.borderColor = '#ddd'}
            >
              <input {...getInputProps()} />
              {filePreview && formData.notification_file?.type?.startsWith('image/') ? (
                <div>
                  <img src={filePreview} alt="Preview" style={{ maxWidth: '200px', maxHeight: '200px', marginBottom: '10px' }} />
                  <p style={{ margin: 0, color: '#28a745', fontWeight: '500' }}>
                    <i className="fas fa-file-image"></i> {fileName}
                  </p>
                </div>
              ) : fileName ? (
                <p style={{ margin: 0, color: '#007bff', fontWeight: '500' }}>
                  <i className="fas fa-file"></i> {fileName}
                </p>
              ) : (
                <div>
                  <p style={{ margin: 0, color: '#666', marginBottom: '8px' }}>
                    <i className="fas fa-cloud-upload-alt"></i> Drag & drop a file here, or click to select
                  </p>
                  <p style={{ margin: 0, fontSize: '12px', color: '#999' }}>
                    Allowed: Images, PDF, Word, Excel (Max 10MB)
                  </p>
                </div>
              )}
            </div>
            {isEditMode && (
              <div style={{ fontSize: '12px', color: '#666', marginTop: '8px' }}>
                Leave empty to keep current file
              </div>
            )}
          </div>

          {/* Status (Edit mode only) */}
          {isEditMode && (
            <div style={styles.formGroup}>
              <label style={styles.label}>Status</label>
              <select
                name="is_active"
                value={formData.is_active}
                onChange={handleChange}
                style={{ ...styles.input, width: 'auto' }}
              >
                <option value={1}>Active</option>
                <option value={0}>Inactive</option>
              </select>
            </div>
          )}

          {/* Buttons */}
          <div style={styles.buttonGroup}>
            {isEditMode && (
              <button
                type="button"
                style={{ ...styles.button, ...styles.buttonSecondary }}
                onClick={resetForm}
                onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#5a6268'}
                onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#6c757d'}
              >
                Cancel
              </button>
            )}
            <button
              type="submit"
              style={{ ...styles.button, ...styles.buttonPrimary }}
              onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#0056b3'}
              onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#007bff'}
            >
              {isEditMode ? "Update" : "Submit"}
            </button>
          </div>
        </form>
          </div>
        </div>

        {/* LIST PANE — persistent sidebar on desktop, tab content on mobile */}
        <div className="nf-pane nf-pane--list">
          <h3>
            <i className="fas fa-bell" style={{ color: '#EBD197' }}></i>
            Notifications / News / Events
            {data && data.length > 0 && (
              <span style={{ marginLeft: 'auto', fontSize: '12px', color: '#6c757d', fontWeight: 600 }}>
                {data.length} {data.length === 1 ? 'entry' : 'entries'}
              </span>
            )}
          </h3>

          <div className="nf-search">
            <input
              type="text"
              placeholder="Search…"
              onKeyDown={handleKeyDown}
              onChange={(e) => setSearchCategoryReport({ search: e.target.value })}
              aria-label="Search notifications"
            />
            <button type="button" onClick={fetchData}>
              <i className="fas fa-search"></i>
            </button>
          </div>

          <div style={{ marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <label style={{ fontSize: '12px', color: '#6c757d', fontWeight: 600 }}>Show:</label>
            <select
              value={totalItem}
              onChange={handleTotalItemChange}
              style={{
                padding: '6px 10px',
                border: '1px solid #d0d7e2',
                borderRadius: '6px',
                fontSize: '12px',
                background: '#fff',
              }}
            >
              <option value="10">10</option>
              <option value="20">20</option>
              <option value="30">30</option>
              <option value="50">50</option>
            </select>
          </div>

          {loading ? (
            <div className="nf-empty">
              <i className="fas fa-spinner fa-spin"></i>
              Loading…
            </div>
          ) : !data || data.length === 0 ? (
            <div className="nf-empty">
              <i className="fas fa-bell-slash"></i>
              No notifications yet. Add your first one from the form.
            </div>
          ) : (
            data.map((item, index) => (
              <div key={index} className="nf-card">
                <div className="nf-card__top">
                  <span
                    className="nf-card__type"
                    style={{ background: getBadgeColor(item.type) }}
                  >
                    {item.type}
                  </span>
                  <span className="nf-card__date">
                    <i className="far fa-calendar-alt"></i> {item.start_date}
                    {item.end_date ? ` → ${item.end_date}` : ''}
                  </span>
                </div>
                <div className="nf-card__title">{item.title}</div>
                <span
                  className={`nf-card__status nf-card__status--${item.is_active == 1 ? 'on' : 'off'}`}
                >
                  {item.is_active == 1 ? '● Active' : '● Inactive'}
                </span>
                <div
                  className="nf-card__desc"
                  dangerouslySetInnerHTML={{ __html: item.description }}
                ></div>
                <div className="nf-card__actions">
                  {item.notification_file ? (
                    <button
                      type="button"
                      className="nf-card__btn nf-card__btn--download"
                      onClick={() => handleDownload(item.notification_file)}
                      title={item.notification_file}
                    >
                      <i className="fas fa-download"></i> File
                    </button>
                  ) : (
                    <button
                      type="button"
                      className="nf-card__btn"
                      style={{ background: '#f1f3f6', color: '#999', cursor: 'not-allowed' }}
                      disabled
                    >
                      <i className="fas fa-ban"></i> No file
                    </button>
                  )}
                  <button
                    type="button"
                    className="nf-card__btn nf-card__btn--edit"
                    onClick={() => handleEditFromList(item.id)}
                  >
                    <i className="fas fa-edit"></i> Edit
                  </button>
                  <button
                    type="button"
                    className="nf-card__btn nf-card__btn--delete"
                    onClick={() => handleDelete(item.id)}
                  >
                    <i className="fas fa-trash-alt"></i> Del
                  </button>
                </div>
              </div>
            ))
          )}

          {totalPages > 1 && (
            <div className="nf-pagination-wrap">
              <ReactPaginate
                previousLabel={"‹"}
                nextLabel={"›"}
                breakLabel={"…"}
                pageCount={totalPages}
                marginPagesDisplayed={1}
                pageRangeDisplayed={2}
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
          )}
        </div>
      </div>
    </div>
  );
}

export default Notification;