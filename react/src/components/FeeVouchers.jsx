
// FeeVouchers.jsx
import React, { useEffect, useState, useContext, useRef } from "react";
import axios from "axios";
import ReactPaginate from "react-paginate";
import { useAuth } from "./AuthContext";
import AcademicSessionContext from "./AcademicSessionContext";
import "react-toastify/dist/ReactToastify.css";
import Select from "react-select";
import { toast } from "react-toastify";
import { useReactToPrint } from "react-to-print";
import Barcode from "react-barcode";
import SingleFeeGenerate from "./SingleFeeGenerate"; // Reuse the Single Fee Voucher form for editing
import { set } from "nprogress";

function FeeVouchers() {
  const ITEMS_PER_PAGE = 10;

  // Data & UI States
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalItem, setTotalItem] = useState(10);
  const [searchQuery, setSearchQuery] = useState("");
  const [lastMonth, setLastMonth] = useState("");

  // Banks, Classes, and Sections States
  const [getBanks, setBanks] = useState([]);
  const [getClasses, setClasses] = useState([]);
  const [getSections, setSections] = useState([]);

  // Vouchers Checked and Edit-View States
  const [checkedVouchers, setCheckedVouchers] = useState([]);
  const [allChecked, setAllChecked] = useState(true);
  const [voucherData, setVoucherData] = useState([]);
  const [updatedVouchersWithHeads, setUpdatedVouchersWithHead] = useState([]);
  const [viewVoucherId, setViewVoucherId] = useState([]);
  const [showData, setShowData] = useState(false);

  // Inline Edit States
  const [showEdit, setShowEdit] = useState(false);
  const [editVoucherId, setEditVoucherId] = useState(null);

  // Heads, Bank Details & Bank Notes States for voucher view
  const [getHeads, setHeads] = useState([]);
  const [getBankDetails, setBankDetails] = useState([]);
  const [getBankNotes, setBankNotes] = useState([]);

  // const [refresh, setRefresh] = useState([]);

  const componentRef = useRef();

  // Auth & Session Contexts
  const { user } = useAuth();
  const { academicSession } = useContext(AcademicSessionContext);

  // Form data for search/filtering
  const initialState = {
    class_id: "",
    section_id: "",
    shift: "",
    search: "",
    from_month: "",
    to_month: "",
    session_id: academicSession,
    campus_id: user.user.campus_id,
    user_id: user.user.user_id,
    hidden_id: "",
  };

  const [validity, setValidity] = useState({
    class_id: true,
    section_id: true,
    shift: true,
    from_month: true,
    to_month: true,
  });

  const [editFormData, setEditFormData] = useState(initialState);

  useEffect(() => {
    if (academicSession) {
      setEditFormData((prevFormData) => ({
        ...prevFormData,
        session_id: parseInt(academicSession),
      }));
    }
  }, [academicSession]);

  // Fetch Classes based on campus_id
  useEffect(() => {
    const getClasses = (campus_id) => {
      axios
        .get(process.env.REACT_APP_API_BASE_URL+`/get-classes/${campus_id}`)
        .then((res) => {
          setClasses(res.data.results);
        })
        .catch((err) => console.log(err));
    };

    if (user && user.user.campus_id) {
      getClasses(user.user.campus_id);
    }
  }, [user]);

  // Fetch Sections based on campus_id
  useEffect(() => {
    const sections = (campus_id) => {
      axios
        .get(process.env.REACT_APP_API_BASE_URL+`/get-sections/${campus_id}`)
        .then((res) => {
          setSections(res.data.results);
        })
        .catch((err) => console.log(err));
    };

    if (user && user.user.campus_id) {
      sections(user.user.campus_id);
    }
  }, [user]);

  // Validate the editFormData (for filtering/search criteria)
  const validateForm = () => {
    let isValid = true;
    if (!editFormData.class_id && !editFormData.class_id.trim()) {
      setValidity((prevState) => ({ ...prevState, class_id: false }));
      isValid = false;
    }
    if (!editFormData.section_id.trim()) {
      setValidity((prevState) => ({ ...prevState, section_id: false }));
      isValid = false;
    }
    if (!editFormData.shift.trim()) {
      setValidity((prevState) => ({ ...prevState, shift: false }));
      isValid = false;
    }
    return isValid;
  };

  const [report, getAllReports] = useState({
    from_date: "",
    to_date: "",
    report_type: "",
  });

  const [searchCategoryReport, getSearchCategoryReport] = useState({
    search: "",
  });

  // Search data if criteria available
  function getSearchData() {
    if (
      editFormData.search.length > 1 ||
      (editFormData.class_id !== "" && editFormData.shift !== "")
    ) {
      fetchData();
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      if (editFormData.search.length > 1) {
        fetchData();
      }
    }
  };



    function convertDates(date) {
    const d = new Date(date);
    const day = d.getDate().toString().padStart(2, "0");
    const month = (d.getMonth() + 1).toString().padStart(2, "0");
    const year = d.getFullYear();
    return `${day}-${month}-${year}`;
  }

  function getReport() {
    if (report.report_type === "pdf") {
      // pdfReport();
    } else if (report.report_type === "excel") {
      // excelReport();
    }
  }

  // Fetch banks
  useEffect(() => {
    const fetchCategory = () => {
      axios
        .get(process.env.REACT_APP_API_BASE_URL+"/get-banks")
        .then((res) => {
          setBanks(res.data.results);
        })
        .catch((err) => console.log(err));
    };

    fetchCategory();
  }, []);

  // When data loads, set checked vouchers to all voucher IDs
  useEffect(() => {
    if (academicSession) {
      const initialChecked = data.map((voucher) => voucher.id);
      setCheckedVouchers(initialChecked);
    }
  }, [data, academicSession, user]);

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
      const allIds = data.map((voucher) => voucher.id);
      setCheckedVouchers(allIds);
    }
    setAllChecked(!allChecked);
  };

  // Fetch fee vouchers when form data changes
  useEffect(() => {
    if (
      editFormData.from_month !== "" &&
      editFormData.class_id !== "" &&
      editFormData.shift !== ""
    ) {
      fetchData();
    }
  }, [editFormData]);

  const fetchData = () => {
    axios
      .get(process.env.REACT_APP_API_BASE_URL+"/fee-vouchers-list", {
        params: {
          page: currentPage,
          limit: totalItem,
          search: searchCategoryReport.search,
          from_month: editFormData.from_month,
          to_month: editFormData.to_month,
          campus_id: user.user.campus_id,
          session_id: academicSession,
          class_id: editFormData.class_id,
          section_id: editFormData.section_id,
          shift: editFormData.shift,
        },
      })
      .then((res) => {
        setFilteredData(res.data.results);
        setData(res.data.results);
        setLastMonth(res.data.last_month);
        setTotalPages(Math.ceil(res.data.total) / ITEMS_PER_PAGE);
      })
      .catch((err) => console.log(err));
  };

  // Paginate the display data
  const displayData = filteredData.slice(
    currentPage * ITEMS_PER_PAGE,
    (currentPage + 1) * ITEMS_PER_PAGE
  );

  const handlePageClick = ({ selected }) => {
    setCurrentPage(selected);
  };

  // Instead of navigating to a different route on edit, show the EditFeeVoucher inline.
  const edit = (id_get) => {
    // If your EditFeeVoucher still relies on localStorage, you can set it here.
    localStorage.setItem("voucher_id", JSON.stringify(id_get));
    setEditVoucherId(id_get);
    setShowEdit(true);
  };


  useEffect(() => {
      if(showEdit == false){
        const check_refresh_list = localStorage.getItem('refresh_list') ? JSON.parse(localStorage.getItem('refresh_list')) : "";
        if(check_refresh_list == true){
          fetchData();
          localStorage.removeItem('refresh_list');
      }
    }
  }, [showEdit]);

  // Delete voucher data
  const deleteData = (id_get, full_name, class_name, section_name, for_the_month, register_no) => {

    var confirm_delete =window.confirm("Are you sure you want to delete this voucher?");

    if(!confirm_delete){
      return false;
    }

      axios
        .delete(
          process.env.REACT_APP_API_BASE_URL +
            `/delete-fee-voucher/${id_get}/${editFormData.campus_id}/${editFormData.session_id}/${user.user.user_id}/${full_name}/${class_name}/${section_name}/${for_the_month}/${register_no}`  
        )
        .then((response) => {
          console.log("Deleted successfully:", response.data);
          setData((prevData) =>
            prevData.filter((voucher) => voucher.id !== id_get)
          );
          setFilteredData((prevData) =>
            prevData.filter((voucher) => voucher.id !== id_get)
          );

          toast.success("Fee Voucher Deleted Successfully");
        })
        .catch((error) => {
          console.error("Error deleting item:", error);
        });
  };

  // Unpost voucher data
  const unpostData = (id_get, full_name) => {
    const confirm_unpost = window.confirm(
      `Unpost fee voucher of ${full_name}! Are you sure?`
    );

    if (confirm_unpost) {
      axios
        .get(
          process.env.REACT_APP_API_BASE_URL+`/unpost-fee-voucher/${id_get}/${editFormData.campus_id}/${editFormData.session_id}/${user.user.user_id}`
        )
        .then((response) => {
          toast.success("Fee Voucher Unposted Successfully");
          fetchData();
        })
        .catch((error) => {
          console.error("Error unposting fee voucher:", error);
        });
    }

  };

  // View voucher data (for printing/viewing)
  const viewData = (id_get) => {
    setViewVoucherId([id_get]);
    setShowData(true);
  };

  const handleSubmit = () => {
    setViewVoucherId(checkedVouchers);
    setShowData(true);
  };

  // Handle search query input
  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);

    if (query.trim() === "") {
      setFilteredData(data);
    } else {
      const filtered = data.filter((item) => {
        return Object.keys(item).some((key) => {
          const value = item[key];
          return (
            value !== null &&
            value !== undefined &&
            value.toString().toLowerCase().includes(query)
          );
        });
      });
      setFilteredData(filtered);
    }
  };



  

  // Fetch fee vouchers for viewing when viewVoucherId changes
  useEffect(() => {
    const fetchFeeVouchers = async (invoices, campus_id, session_id) => {
      try {
        const response = await axios.post(
          process.env.REACT_APP_API_BASE_URL+"/view-fee-vouchers",
          {
            invoices,
            campus_id,
            session_id,
          }
        );

        let vouchers = response.data.vouchers;
        let heads = response.data.heads;
        let bank_details = response.data.bankDetails;
        let arrears = response.data.arrears;
        let bank_notes = response.data.bankNotes;
        setVoucherData(vouchers);
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
      fetchFeeVouchers(viewVoucherId, user.user.campus_id, academicSession);
    }
  }, [viewVoucherId, user.user.campus_id, academicSession]);

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





  useEffect(() => {
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

    const updatedData = addHeadNameToFeeHead(getHeads, data);
    setUpdatedVouchersWithHead(updatedData);
  }, [viewVoucherId]);

  // For printing voucher view
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

  // Helper function to find class label for Select
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

  // Handle class change from Select
  const handleClassChange = (selectedOption) => {
    const [class_id, section_id] = selectedOption
      ? selectedOption.value.split(",")
      : ["", ""];
    setEditFormData({ ...editFormData, class_id, section_id });
  };



  const tableRef = useRef(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);
  const [isBlinking, setIsBlinking] = useState(true);

  // Check scroll position and toggle arrow visibility
  const checkScroll = () => {
    if (tableRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = tableRef.current;
      setShowLeftArrow(scrollLeft > 0);
      setShowRightArrow(scrollLeft < scrollWidth - clientWidth);
    }
  };

  // Scroll horizontally
  const scrollHorizontal = (direction) => {
    if (tableRef.current) {
      const scrollAmount = 300; // Adjust this value as needed
      tableRef.current.scrollBy({
        left: direction === 'right' ? scrollAmount : -scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  // Set up event listeners and initial check
  useEffect(() => {
    const table = tableRef.current;
    if (table) {
      table.addEventListener('scroll', checkScroll);
      checkScroll(); // Initial check
    }

    // Blinking effect for arrows
    const blinkInterval = setInterval(() => {
      setIsBlinking(prev => !prev);
    }, 800);

    return () => {
      if (table) table.removeEventListener('scroll', checkScroll);
      clearInterval(blinkInterval);
    };
  }, []);

  // Render the Fee Vouchers UI
  return (
    <>
      {/* Edit via Single Fee Voucher (fullscreen modal, navy/gold theme) */}
      {showEdit && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            width: "100vw",
            height: "100vh",
            backgroundColor: "#fff",
            zIndex: 10000,
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              flexShrink: 0,
              background: "linear-gradient(135deg, #111418 0%, #1a1f25 100%)",
              color: "#EBD197",
              padding: "14px 18px",
              borderBottom: "3px solid #EBD197",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <h5 style={{ margin: 0, fontSize: 16, fontWeight: 700, display: "flex", alignItems: "center", gap: 10 }}>
              <i className="fas fa-edit"></i> Edit Fee Voucher
            </h5>
            <button
              type="button"
              onClick={() => setShowEdit(false)}
              aria-label="Close"
              style={{
                background: "rgba(235,209,151,0.15)",
                border: "1px solid rgba(235,209,151,0.3)",
                color: "#EBD197",
                cursor: "pointer",
                width: 34,
                height: 34,
                borderRadius: "50%",
                fontSize: 20,
                lineHeight: 1,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              ×
            </button>
          </div>

          <div style={{ flex: 1, overflowY: "auto", WebkitOverflowScrolling: "touch" }}>
            <SingleFeeGenerate
              editVoucherId={editVoucherId}
              onSaved={() => {
                setShowEdit(false);
                fetchData();
              }}
            />
          </div>
        </div>
      )}

      <div className="d-flex">
        <div className="col-md-12 p-2">
          <div className="card-header text-warning bg-primary p-2">
            <div className="d-flex justify-content-end align-items-center">
              {/* <div>
                <i className="fas fa-list"></i> Fee Vouchers
              </div> */}

              {/* Search and Filter Options */}
              <div className="d-flex">
                <div className="me-2 mr-2 d-flex justify-content-center align-items-center">
                  <label style={{ margin: "0px" }}>From:&nbsp;</label>
                  <input
                    type="month"
                    name="from_month"
                    value={editFormData.from_month}
                    onChange={(e) => {
                      setEditFormData({
                        ...editFormData,
                        from_month: e.target.value,
                      });
                      setValidity({ ...validity, from_month: true });
                    }}
                    className={
                      validity.from_month
                        ? "form-control"
                        : "form-control invalid-input"
                    }
                  />
                </div>

                <div className="me-2 mr-2 d-flex justify-content-center align-items-center">
                  <label style={{ margin: "0px" }}>To:&nbsp;</label>
                  <input
                    type="month"
                    name="to_month"
                    value={editFormData.to_month}
                    onChange={(e) => {
                      setEditFormData({
                        ...editFormData,
                        to_month: e.target.value,
                      });
                      setValidity({ ...validity, to_month: true });
                    }}
                    className={
                      validity.to_month
                        ? "form-control"
                        : "form-control invalid-input"
                    }
                  />
                </div>

                <div className="me-2 mr-2">
                  <Select
                    options={getClasses.map((class_get) => ({
                      value: `${class_get.id},${class_get.section_id}`,
                      label: `${class_get.class} (${class_get.section_name})`,
                    }))}
                    value={
                      editFormData.class_id && editFormData.section_id
                        ? {
                            value: `${editFormData.class_id},${editFormData.section_id}`,
                            label: findClassLabel(),
                          }
                        : null
                    }
                    onChange={handleClassChange}
                    placeholder="Select Class"
                    style={{
                      zIndex: 1000,
                    }}
                  />
                </div>

                <div className="me-2 mr-2">
                  <select
                    name="shift"
                    value={editFormData.shift}
                    onChange={(e) => {
                      setEditFormData({
                        ...editFormData,
                        shift: e.target.value,
                      });
                      setValidity({ ...validity, shift: true });
                    }}
                    className={
                      validity.shift
                        ? "form-control"
                        : "form-control invalid-input"
                    }
                  >
                    <option value="">Select Shift</option>
                    <option>Morning</option>
                    <option>Evening</option>
                  </select>
                </div>

                <div className="me-2 d-none">
                  <input
                    type="text"
                    className="form-control"
                    id="search_category"
                    onKeyDown={handleKeyDown}
                    onChange={(e) =>
                      setEditFormData({
                        ...editFormData,
                        search: e.target.value,
                      })
                    }
                  />
                  <button
                    className="btn btn-sm btn-danger"
                    onClick={getSearchData}
                  >
                    Search
                  </button>
                </div>
              </div>

              <div className="d-none">
                <div className="me-2 mr-2">
                  <input
                    type="date"
                    className="form-control"
                    id="from_date"
                    onChange={(e) =>
                      getAllReports({ ...report, from_date: e.target.value })
                    }
                  />
                </div>

                <div className="me-2 mr-2">
                  <input
                    type="date"
                    className="form-control"
                    id="to_date"
                    onChange={(e) =>
                      getAllReports({ ...report, to_date: e.target.value })
                    }
                  />
                </div>

                <div className="me-2 mr-2">
                  <select
                    name="type"
                    id="type"
                    className="form-control"
                    onChange={(e) =>
                      getAllReports({ ...report, report_type: e.target.value })
                    }
                  >
                    <option value="">Select Type</option>
                    <option value="excel">Excel</option>
                    <option value="pdf">PDF</option>
                  </select>
                </div>

                <button className="btn btn-sm btn-danger" onClick={getReport}>
                  Get Report
                </button>
              </div>
            </div>
          </div>

          <div className="border p-2">
            <div className="d-flex justify-content-between pb-1">
              <div className="d-flex">
                <div>
                  <button
                    onClick={handleToggleAll}
                    className="mr-2 btn btn-warning btn-sm"
                  >
                    {allChecked ? (
                      <i className="fas fa-check-square"></i>
                    ) : (
                      <i className="fas fa-square"></i>
                    )}
                  </button>
                </div>
                <div>
                  <button
                    onClick={handleSubmit}
                    className="btn btn-warning btn-sm"
                  >
                    <i className="fa fa-eye" aria-hidden="true"></i> View
                    Voucher
                  </button>
                </div>
              </div>

              <div className="pb-0 d-flex justify-content-end">
                <div>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Search......."
                    onChange={handleSearch}
                    value={searchQuery}
                  />
                </div>
              </div>
            </div>
            {/* <div className="table-responsive p-2"> */}
            {showLeftArrow && (
        <button
          onClick={() => scrollHorizontal('left')}
          style={{
            position: 'absolute',
           left: '25px',
            top: '53%',
            transform: 'translateY(-50%)',
            zIndex: 100,
            backgroundColor: '#EBD197',
            border: 'none',
            borderRadius: '50%',
            width: '40px',
            height: '40px',
            cursor: 'pointer',
            opacity: isBlinking ? 0.7 : 1,
            transition: 'opacity 0.3s',
            boxShadow: '0 2px 5px rgba(0,0,0,0.2)'
          }}
        >
          <i className="fas fa-chevron-left" style={{ fontSize: '20px' }}></i>
        </button>
      )}
             <div className="table-container" style={{ position: 'relative' }}>
      {/* Left Arrow */}
      

      {/* Table */}
      {/* <div 
        ref={tableRef} 
        className="table-responsive p-2"
        style={{ 
          overflowX: 'auto',
          scrollBehavior: 'smooth',
          position: 'relative'
        }}
      >
              <table className="table table-hover table-sm m-0 w-100">
                <thead>
                  <tr>
                    <th  className="text-center">Check</th>
                    <th>Invoice#</th>
                    <th>Reg#</th>
                    <th>Name</th>
                    <th>Class</th>
                    <th>Section</th>
                    <th>Month</th>
                    <th style={{ backgroundColor: "#e8e8e8" }}>Arrears</th>
                    <th style={{ backgroundColor: "#e8e8e8" }}>Advance</th>
                    <th style={{ backgroundColor: "#e8e8e8" }}>Payable</th>
                    <th style={{ backgroundColor: "#e8e8e8" }}>Total</th>
                    <th>DueAmt</th>
                    <th>Due Date</th>
                    <th>Status</th>
                    <th className="text-center">Edit</th>
                    <th className="text-center">Delete</th>
                    <th className="text-center">Unpost</th>
                    <th className="text-center">View</th>
                  </tr>
                </thead>

                <tbody>
                  {displayData.map((voucher, index) => (
                    <tr key={index}>
                      <td  className="text-center">
                        <input
                          type="checkbox"
                          checked={checkedVouchers.includes(voucher.id)}
                          onChange={() => handleCheckboxChange(voucher.id)}
                          value={voucher.id}
                        />
                      </td>
                      <td>{voucher.invoice_no}</td>
                      <td className="no-wrap">
                        {voucher.register_no === ""
                          ? voucher.old_register_no
                          : voucher.register_no}
                      </td>
                      <td className="no-wrap">{voucher.full_name}</td>
                      <td className="no-wrap">{voucher.class}</td>
                      <td className="no-wrap">{voucher.section_name}</td>
                      <td className="no-wrap">{voucher.for_the_month}</td>
                      <td style={{ backgroundColor: "#e8e8e8" }}>
                        {voucher.arrears}
                      </td>
                      <td style={{ backgroundColor: "#e8e8e8" }}>
                        {voucher.first_advance_payment}
                      </td>
                      <td style={{ backgroundColor: "#e8e8e8" }}>
                        {voucher.total_amount_data}
                      </td>
                      <td style={{ backgroundColor: "#e8e8e8" }}>
                        {voucher.total_amount_data +
                          voucher.arrears +
                          voucher.first_advance_payment}
                      </td>
                      <td>
                        {voucher.after_due_date_amount +
                          voucher.arrears +
                          voucher.first_advance_payment}
                      </td>
                      <td className="no-wrap">{convertDates(voucher.due_date)}</td>
                      <td
                        style={{
                          color: voucher.status === "unpaid" ? "red" : "green",
                        }}
                      >
                        {voucher.status.toUpperCase()}
                      </td>
                    
                      <td className="text-center">
                        <div className="tooltip-container">
                          <button
                            className="btn btn-success btn-sm"
                            onClick={() => edit(voucher.id)}
                            disabled={
                              voucher.status === "paid" ||
                              voucher.is_arrear == "arrears"
                            }
                          >
                            <i className="fas fa-edit"></i>
                          </button>
                          {(voucher.status === "paid" ||
                            voucher.is_arrear == "arrears") && (
                            <span className="tooltip-text">
                              {voucher.status === "paid"
                                ? "Paid voucher is not editable"
                                : "Please remove arrear (to All Next Month Vouchers)"}
                            </span>
                          )}
                        </div>
                      </td>
                     
                      <td className="text-center">
                        <div className="tooltip-container">
                          <button
                            className="btn btn-danger btn-sm"
                            onClick={() =>
                              deleteData(
                                voucher.id,
                                voucher.full_name,
                                voucher.class,
                                voucher.section_name,
                                voucher.for_the_month,
                                voucher.register_no
                              )
                            }
                            disabled={
                              voucher.status === "paid" ||
                              voucher.is_arrear == "arrears" ||
                              JSON.parse(voucher.arrears_not_cleared).length > 0
                            }
                          >
                            <i className="fas fa-trash-alt"></i>
                          </button>
                          {(voucher.status === "paid" ||
                            voucher.is_arrear == "arrears" ||
                            JSON.parse(voucher.arrears_not_cleared).length >
                              0) && (
                            <span className="tooltip-text">
                              {voucher.status === "paid"
                                ? "Paid voucher cannot be deleted"
                                : voucher.is_arrear == "arrears"
                                ? "Please remove arrear first"
                                : "Please remove previous month arrears and then delete it"}
                            </span>
                          )}
                         
                        </div>
                      </td>
                     

                      <td className="text-center">
                        <div className="tooltip-container">
                          {voucher.status === "paid" ? (
                            <>
                              <button
                                className="btn btn-warning btn-sm"
                                onClick={() => {
                                  const arrears =
                                    typeof voucher.arrears_not_cleared ===
                                    "string"
                                      ? JSON.parse(voucher.arrears_not_cleared)
                                      : voucher.arrears_not_cleared;
                                  unpostData(
                                    voucher.id +
                                      (arrears?.length
                                        ? "," + arrears.join(",")
                                        : ""),
                                    voucher.full_name
                                  );
                                }}
                                disabled={voucher.is_arrear == "arrears"}
                              >
                                <i className="fas fa-undo"></i>
                              </button>
                              {voucher.is_arrear == "arrears" && (
                                <span className="tooltip-text">
                                  Please remove arrear (to All Next Month
                                  Vouchers)
                                </span>
                              )}
                            </>
                          ) : (
                            <span className="text-muted">-</span>
                          )}
                        </div>
                      </td>
                      <td className="text-center">
                        <div>
                          <button
                            className="btn btn-secondary btn-sm"
                            onClick={() => viewData(voucher.id)}
                          >
                            <i className="fas fa-eye"></i>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

     
            </div> */}

            <div 
  ref={tableRef} 
  className="table-responsive p-2"
  style={{ 
    overflowX: 'auto',
    scrollBehavior: 'smooth',
    position: 'relative'
  }}
>
  <table className="table table-sm m-0 w-100">
    <thead>
      <tr>
        <th className="text-center position-sticky start-0 bg-white">Check</th>
        <th className="position-sticky start-30 bg-white">Invoice#</th>
        <th className="position-sticky start-110 bg-white">Reg#</th>
        <th className="position-sticky start-180 bg-white">Name</th>
        <th>Class</th>
        <th>Section</th>
        <th>Month</th>
        <th style={{ backgroundColor: "#e8e8e8" }}>Arrears</th>
        <th style={{ backgroundColor: "#e8e8e8" }}>Advance</th>
        <th style={{ backgroundColor: "#e8e8e8" }}>Payable</th>
        <th style={{ backgroundColor: "#e8e8e8" }}>Total</th>
        <th>DueAmt</th>
        <th>Due Date</th>
        <th>Status</th>
        <th className="text-center">Edit</th>
        <th className="text-center">Delete</th>
        <th className="text-center">Unpost</th>
        <th className="text-center">View</th>
      </tr>
    </thead>

    <tbody>
      {displayData.map((voucher, index) => (
        <tr key={index}>
          <td className="text-center position-sticky start-0 bg-white">
            <input
              type="checkbox"
              checked={checkedVouchers.includes(voucher.id)}
              onChange={() => handleCheckboxChange(voucher.id)}
              value={voucher.id}
            />
          </td>
          <td className="position-sticky start-30 bg-white">{voucher.invoice_no}</td>
          <td className="no-wrap position-sticky start-110 bg-white">
            {voucher.register_no === ""
              ? voucher.old_register_no
              : voucher.register_no}
          </td>
          <td className="no-wrap position-sticky start-180 bg-white">{voucher.full_name}</td>
          <td className="no-wrap">{voucher.class}</td>
          <td className="no-wrap">{voucher.section_name}</td>
          <td className="no-wrap">{voucher.for_the_month}</td>
          <td style={{ backgroundColor: "#e8e8e8" }}>
            {voucher.arrears}
          </td>
          <td style={{ backgroundColor: "#e8e8e8" }}>
            {voucher.first_advance_payment}
          </td>
          <td style={{ backgroundColor: "#e8e8e8" }}>
            {voucher.total_amount_data}
          </td>
          <td style={{ backgroundColor: "#e8e8e8" }}>
            {voucher.total_amount_data +
              voucher.arrears +
              voucher.first_advance_payment}
          </td>
          <td>
            {voucher.after_due_date_amount +
              voucher.arrears +
              voucher.first_advance_payment}
          </td>
          <td className="no-wrap">{convertDates(voucher.due_date)}</td>
          <td
            style={{
              color: voucher.status === "unpaid" ? "red" : "green",
            }}
          >
            {voucher.status.toUpperCase()}
          </td>
        
          <td className="text-center">
            <div className="tooltip-container">
              <button
                className="btn btn-success btn-sm"
                onClick={() => edit(voucher.id)}
                disabled={
                  voucher.status === "paid" ||
                  voucher.is_arrear == "arrears"
                }
              >
                <i className="fas fa-edit"></i>
              </button>
              {(voucher.status === "paid" ||
                voucher.is_arrear == "arrears") && (
                <span className="tooltip-text">
                  {voucher.status === "paid"
                    ? "Paid voucher is not editable"
                    : "Please remove arrear (to All Next Month Vouchers)"}
                </span>
              )}
            </div>
          </td>
         
          <td className="text-center">
            <div className="tooltip-container">
              <button
                className="btn btn-danger btn-sm"
                onClick={() =>
                  deleteData(
                    voucher.id,
                    voucher.full_name,
                    voucher.class,
                    voucher.section_name,
                    voucher.for_the_month,
                    voucher.register_no
                  )
                }
                disabled={
                  voucher.status === "paid" ||
                  voucher.is_arrear == "arrears" ||
                  JSON.parse(voucher.arrears_not_cleared).length > 0
                }
              >
                <i className="fas fa-trash-alt"></i>
              </button>
              {(voucher.status === "paid" ||
                voucher.is_arrear == "arrears" ||
                JSON.parse(voucher.arrears_not_cleared).length >
                  0) && (
                <span className="tooltip-text">
                  {voucher.status === "paid"
                    ? "Paid voucher cannot be deleted"
                    : voucher.is_arrear == "arrears"
                    ? "Please remove arrear first"
                    : "Please remove previous month arrears and then delete it"}
                </span>
              )}
             
            </div>
          </td>
         

          <td className="text-center">
            <div className="tooltip-container">
              {voucher.status === "paid" ? (
                <>
                  <button
                    className="btn btn-warning btn-sm"
                    onClick={() => {
                      const arrears =
                        typeof voucher.arrears_not_cleared ===
                        "string"
                          ? JSON.parse(voucher.arrears_not_cleared)
                          : voucher.arrears_not_cleared;
                      unpostData(
                        voucher.id +
                          (arrears?.length
                            ? "," + arrears.join(",")
                            : ""),
                        voucher.full_name
                      );
                    }}
                    disabled={voucher.is_arrear == "arrears"}
                  >
                    <i className="fas fa-undo"></i>
                  </button>
                  {voucher.is_arrear == "arrears" && (
                    <span className="tooltip-text">
                      Please remove arrear (to All Next Month
                      Vouchers)
                    </span>
                  )}
                </>
              ) : (
                <span className="text-muted">-</span>
              )}
            </div>
          </td>
          <td className="text-center">
            <div>
              <button
                className="btn btn-secondary btn-sm"
                onClick={() => viewData(voucher.id)}
              >
                <i className="fas fa-eye"></i>
              </button>
            </div>
          </td>
        </tr>
      ))}
    </tbody>
  </table>
</div>
            {showRightArrow && (
        <button
          onClick={() => scrollHorizontal('right')}
          style={{
            position: 'absolute',
            right: '20px',
            top: '45%',
            transform: 'translateY(-50%)',
            zIndex: 100,
            backgroundColor: '#EBD197 ',
            border: 'none',
            borderRadius: '50%',
            width: '40px',
            height: '40px',
            cursor: 'pointer',
            opacity: isBlinking ? 0.7 : 1,
            transition: 'opacity 0.3s',
            boxShadow: '0 2px 5px rgba(0,0,0,0.2)'
          }}
        >
          <i className="fas fa-chevron-right" style={{ fontSize: '20px' }}></i>
        </button>
      )}
              <ReactPaginate
                previousLabel={"Previous"}
                nextLabel={"Next"}
                breakLabel={"..."}
                pageCount={totalPages}
                marginPagesDisplayed={2}
                pageRangeDisplayed={3}
                onPageChange={handlePageClick}
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
              // maxWidth: "1800px",
              // maxHeight: "100vh",
              height:"100vh",
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


const formatNumber = (amount) => {
  // console.log("yes test");
  return new Intl.NumberFormat('en-US').format(amount);
};

// SingleVoucher Component for rendering each voucher in the view modal
const SingleVoucher = ({ data, bankDetails, bankNotes }) => {
  const {
    invoice_no,
    shift,
    full_name,
    register_no,
    father_name,
    class_name,
    section_name,
    category,
    for_the_month,
    fee_head,
    total_amount_data,
    due_date,
    actual_due_date,
    remarks,
    after_due_date_amount,
    status,
    arrears,
    arrears_not_cleared,
    session_name,
    campus_name,
    first_advance_payment,
    bus_fee,
    attendance_amount,
    last_three_vouchers,
    address,
    phone_no,
    email
  } = data;

  const feeHeadDetails = JSON.parse(fee_head);
  //this is correct code dont delete it (place after Bank details)
  const lastThreeFeeVoucher =  {};
  // console.log("lastThreeFeeVoucher", lastThreeFeeVoucher);
  const convertDates = (date) => {
    const d = new Date(date);
    const day = d.getDate().toString().padStart(2, "0");
    const month = (d.getMonth() + 1).toString().padStart(2, "0");
    const year = d.getFullYear();
    return `${day}-${month}-${year}`;
  };

  const convertMonth = (date) => {
  const d = new Date(date);
  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", 
                     "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const month = monthNames[d.getMonth()];
  const year = d.getFullYear();
  return `${month}-${year}`;
};

  const getCurrentDate = () => {
    const today = new Date();
    const day = String(today.getDate()).padStart(2, "0");
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const year = today.getFullYear();
    return `${day}-${month}-${year}`;
  };

  const voucherBankDetails = JSON.parse(data.bank_details)
    .map((bankId) => {
      return bankDetails.find((detail) => detail.id === bankId);
    })
    .filter((detail) => detail !== undefined);

  const renderVoucherCopy = (title) => (
    <div className="voucher" style={{ position: "relative" }}>

     {/* {status == "paid" && ( */}
        <img
          src={process.env.REACT_APP_BASE_URL + `/uploads/stamp.png`}
          alt="Paid Stamp"
          style={{
            position: "absolute",
            top: "60%",
            left: "50%",
            transform: "translate(-50%, -50%) rotate(-15deg)",
            width: "95px",
            height: "95px",
            opacity: 0.3,
            zIndex: 1000,
            pointerEvents: "none"
          }}
          onError={(e) => {
            e.target.style.display = "none";
          }}
        />
       {/* )}  */}

        {status == "paid" && (
        <img
          src={process.env.REACT_APP_BASE_URL + `/uploads/paid stamp.png`}
          alt="Paid Stamp"
          style={{
            position: "absolute",
            top: "43%",
            left: "77%",
            transform: "translate(-50%, -50%) rotate(-15deg)",
            width: "95px",
            height: "95px",
            opacity: 0.3,
            zIndex: 9999,
            pointerEvents: "none"
          }}
          onError={(e) => {
            e.target.style.display = "none";
          }}
        />
       )} 
      <div
        className="voucher-header"
        style={{
          textAlign:"center"
        }}
      >
        {/* <div style={{flex:1}}>
          <img
            src={process.env.REACT_APP_BASE_URL + `/uploads/logo.png`}
            style={{ width: "80px", marginRight: "10px" }}
            onError={(e) => {
              e.target.style.display = "none";
            }}
          />
        </div> */}
        <div>
          <h5
            style={{ margin: 0, fontSize: "14px", textTransform: "uppercase",  padding:"10px", color: "black" }}
            className="title"
          >
            {/* {campus_name} */}
              Nasheman School/College
          </h5>
          <p style={{ margin: 0, fontSize: "12px" }}>{address}</p>
          <p style={{ margin: 0, fontSize: "12px" }}>{phone_no}</p>
          <p style={{ margin: 0, fontSize: "12px" }}>{email}</p>
        </div>
      </div>
      <h5 className="title" style={{ textAlign: "center", fontSize: "14px", marginTop: "8px", textTransform: "uppercase", textDecoration:"underline" }}>
        {title}
      </h5>
      <div className="voucher-fee">
        <table className="voucher_table">
          <thead>
            <tr>
              <th>Voucher#</th>
              <td>{invoice_no + " (" + shift + ")"}</td>
              <th>Month</th>
              <td>{convertMonth(for_the_month)}</td>
            </tr>
            <tr>
              <th>Iss.Date</th>
              <td>{getCurrentDate()}</td>
              <th>Due.Date</th>
              <td>{convertDates(actual_due_date)}</td>
            </tr>
            <tr>
              <th>Reg#</th>
              <td>{register_no}</td>
              <th>Session</th>
              <td>{session_name}</td>
            </tr>
            <tr>
              <th>Name</th>
              <td>{full_name}</td>
              <th>Father</th>
              <td>{father_name}</td>
            </tr>
            <tr>
              <th>Category</th>
              <td>{category}</td>
              <th>Class</th>
              <td>{class_name + " (" + section_name + ")"}</td>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td></td>
            </tr>
            <tr>
              <th colSpan={2}>Particulars</th>
              <th colSpan={2}>Amount (Rs)</th>
            </tr>
            {feeHeadDetails.map((item, index) => (
              <tr key={index}>
                <td colSpan={2}>{item.head_name}</td>
                <td colSpan={2}>{formatNumber(item.amount)}</td>
              </tr>
            ))}
            <tr>
              <td colSpan={4}></td>
            </tr>
            {first_advance_payment > 0 && (
              <tr>
                <th colSpan={2}>Advance :</th>
                <td colSpan={2}>{formatNumber(first_advance_payment)}</td>
              </tr>
            )}
            {bus_fee > 0 && (
              <tr>
                <th colSpan={2}>Bus Fee :</th>
                <td colSpan={2}>{formatNumber(bus_fee)}</td>
              </tr>
            )}

            {attendance_amount > 0 && (
              <tr>
                <th colSpan={2}>Absent&nbsp;Fine :</th>
                <td colSpan={2}>{attendance_amount}</td>
              </tr>
            )}
            {arrears && arrears !== 0 ? (
              <tr>
                <th colSpan={2}>Arrears :</th>
                <td colSpan={2}>{formatNumber(arrears)}</td>
              </tr>
            ) : null}
            <tr>
              <th colSpan={2}>Payable :</th>
              <th colSpan={2}>
                {formatNumber(
                  total_amount_data + arrears + parseInt(first_advance_payment)
                )}
              </th>
            </tr>
            <tr>
              <th colSpan={2}>Payable (After Due Date) :</th>
              <th colSpan={2}>
                {formatNumber(
                  after_due_date_amount +
                    arrears +
                    parseInt(first_advance_payment)
                )}
              </th>
            </tr>
            {/* {arrears_not_cleared && (
              <tr>
                <th colSpan={2}>Arrears Months :</th>
                <td colSpan={2}>{arrears_not_cleared}</td>
              </tr>
            )} */}

            {remarks && (
              <tr>
                <th colSpan={4}>Remarks: {remarks}</th>
              </tr>
            )}

            {voucherBankDetails.map((bankDetail, index) => (
              <React.Fragment key={index}>
                <tr>
                  <td colSpan={4}>Bank: {bankDetail.bank_name}</td>
                </tr>
                <tr>
                  <td colSpan={4}>A/C Title: {bankDetail.account_title}</td>
                </tr>
                <tr>
                  <td colSpan={4}>
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "row",
                        justifyContent: "space-between",
                        alignItems: "center",
                        width: "100%",
                      }}
                    >
                      <div style={{ flex: "0 0 50%" }}>
                        {" "}
                        {/* Column 6 equivalent (50% width) */}
                        A/C No: {bankDetail.account_no}
                      </div>
                      <div
                        style={{
                          flex: "0 0 50%",
                          display: "flex",
                          justifyContent: "flex-end",
                        }}
                      >
                        {" "}
                        {/* Column 6 equivalent (50% width) */}
                        {bankDetail.logo && (
  <img
    src={`${process.env.REACT_APP_API_BASE_URL}/uploads/${bankDetail.logo}`}
    alt="Bank Logo"
    style={{
      width: "150px",
      height: "30px",
      objectFit: "contain",
    }}
  />
)}
                      </div>
                    </div>
                  </td>
                </tr>
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
      {lastThreeFeeVoucher && lastThreeFeeVoucher.length > 0 && (
        <div
          className="last-vouchers"
          style={{
            margin: "10px 0",
            borderTop: "1px dashed #000",
            paddingTop: "10px",
          }}

      
        >
          <h6>Last Three Month Vouchers:</h6>

          {lastThreeFeeVoucher.length > 0 && (
            <div style={{ marginTop: "8px" }}>
              <table
                style={{
                  width: "100%",
                  borderCollapse: "collapse",
                  fontSize: "9px", // Smaller font
                  lineHeight: "1.2",
                }}
              >
                <thead>
                  <tr>
                    <th
                      colSpan="4"
                      style={{
                        border: "1px solid #000",
                        padding: "3px",
                        textAlign: "left",
                        backgroundColor: "#f0f0f0",
                      }}
                    >
                      Last 3 Month Vouchers:
                    </th>
                  </tr>
                  <tr>
                    <th
                      style={{
                        border: "1px solid #000",
                        padding: "3px",
                        width: "33%",
                      }}
                    >
                      Month
                    </th>
                    <th
                      style={{
                        border: "1px solid #000",
                        padding: "3px",
                        width: "33%",
                        textAlign: "center",
                      }}
                    >
                     Arrears
                    </th>
                    <th
                      style={{
                        border: "1px solid #000",
                        padding: "3px",
                        width: "33%",
                         textAlign: "center",
                      }}
                    >
                      V.Amount
                    </th>
                    <th
                      style={{
                        border: "1px solid #000",
                        padding: "3px",
                        width: "34%",
                         textAlign: "center",
                      }}
                    >
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {/* {console.log(lastThreeFeeVoucher.length)} */}
                  {lastThreeFeeVoucher.map(
                    (voucher, index) =>
                      voucher.status && (
                        <tr key={index}>
                          <td
                            style={{
                              border: "1px solid #000",
                              padding: "3px",
                              whiteSpace: "nowrap",
                            }}
                          >
                            {voucher.for_the_month}
                          </td>
                          <td
                            style={{
                              border: "1px solid #000",
                              padding: "3px",
                              textAlign: "center",
                            }}
                          >
                            {voucher.arrears}
                          </td>
                           <td
                            style={{
                              border: "1px solid #000",
                              padding: "3px",
                               textAlign: "center",
                            }}
                          >
                             {voucher.after_due_date_amount}
                          </td>

                          <td
                          style={{
                            border: "1px solid #000",
                            padding: "3px",
                            color: voucher.received_payment > 0 ? "green" : "red",
                            fontWeight: "bold",
                            textAlign: "center",
                          }}
                        >
                          {voucher.received_payment > 0 ? "Paid" : "Unpaid"}
                        </td>

                          {/* <td
                            style={{
                              border: "1px solid #000",
                              padding: "3px",
                              color:
                                voucher.status === "paid" ? "green" : "red",
                              fontWeight: "bold",
                              textAlign: "center",
                            }}
                          >
                            {(voucher.status || "").charAt(0).toUpperCase() +
                              (voucher.status || "").slice(1)}
                          </td> */}
                        </tr>
                      )
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      <div className="voucher-notes">
        <h5>Notes:</h5>
        <ul>
          {bankNotes.map((note, index) => (
            <div key={index}>
              <p dangerouslySetInnerHTML={{ __html: note.note_description }} />
            </div>
          ))}
        </ul>
      </div>
      <div
        style={{
          border: "1px solid black",
          display: "flex",
          justifyContent: "center",
        }}
      >
        <Barcode value={invoice_no.toString()} height={40} width={2} />
      </div>
    </div>
  );

  return (
    <div className="voucher-container">

      <style>
    {`
@media print {
  
  .voucher-container {
    width: 100vw !important;
    height: 100% !important;
    page-break-after: always;
    page-break-inside: avoid;
    /* transform: scale(0.95); */
    transform-origin: top left;
    /* padding: 5mm !important; */
    box-sizing: border-box;
    position: relative;
  }

  .voucher {
    width: 100% !important;
    height: 100% !important;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    page-break-after: always;
    page-break-inside: avoid;
  }

  .voucher_table {
    width: 100% !important;
    border-collapse: collapse !important;
     font-size: 10px !important; /* Reduced from 12px for compactness */
    /* margin: 5px 0 !important; */
  }

  .voucher_table th, 
  .voucher_table td {
    padding: 2px 4px !important;
    border: 1px solid #000 !important;
    text-align: left;
    vertical-align: top;
  }

  .voucher-header h5 {
    margin: 2px 0 !important;
    font-size: 12px !important;
    /* text-align: center; */
  }

  .voucher-header .title {
    font-weight: bold;
    text-decoration: underline;
  }

  .voucher-notes {
    font-size: 9px !important;
    margin-top: 5px !important;
  }

  .voucher-notes h5 {
    margin: 2px 0 !important;
    font-size: 10px !important;
  }

  .last-vouchers {
    font-size: 9px !important;
    margin: 5px 0 !important;
  }

  .last-vouchers h6 {
    margin: 2px 0 !important;
    font-size: 10px !important;
  }

  @page { 
    size: A4 landscape !important;
    /* transform: 90%; */
    margin: 0 !important;
  }

  * {
    max-width: 100% !important;
    overflow: hidden !important;
  }
}
`}
  </style>
      {renderVoucherCopy("Bank Copy")}
      {renderVoucherCopy("School Copy")}
      {renderVoucherCopy("Student Copy")}
    </div>
  );
};

export default FeeVouchers;
