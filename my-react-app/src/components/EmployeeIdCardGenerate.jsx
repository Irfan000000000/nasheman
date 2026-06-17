import React, { useEffect, useState, useContext, useRef } from "react";
import axios from "axios";
import { useAuth } from "./AuthContext";
import AcademicSessionContext from "./AcademicSessionContext";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import Select from "react-select";
import "react-toastify/dist/ReactToastify.css";
import { useReactToPrint } from "react-to-print";
import { QRCodeCanvas } from "qrcode.react";


function EmployeeIdCardGenerate() {
  const ITEMS_PER_PAGE = 10;
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalItem, setTotalItem] = useState(10); // State to manage items per page
  const [searchQuery, setSearchQuery] = useState("");

  const [lastMonth, setLastMonth] = useState("");

  const [showBackground, setShowBackground] = useState(false)

  // const [searchCheck, setSearchCheck] = useState(true);

  const [getBanks, setBanks] = useState([]);
  const { user } = useAuth();
  const { academicSession } = useContext(AcademicSessionContext);
  const [checkedVouchers, setCheckedVouchers] = useState([]);
  const [allChecked, setAllChecked] = useState(true);
  const [getClasses, setClasses] = useState([]);
  const [getSections, setSections] = useState([]);
  const navigate = useNavigate();


  const [voucherData, setVoucherData] = useState([]);

  const [viewVoucherId, setViewVoucherId] = useState([]);
  const [showData, setShowData] = useState(false);

  const componentRef = useRef();

  function convertDates(date) {
    const d = new Date(date);

    // Get day, month, and year
    const day = d.getDate().toString().padStart(2, "0"); // Ensure 2-digit day
    const month = (d.getMonth() + 1).toString().padStart(2, "0"); // Month is zero-indexed
    const year = d.getFullYear();

    // Return formatted date as dd-mm-yyyy
    return `${day}-${month}-${year}`;
  }

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

  const initialState = {
    shift: "",
    search: "",
    session_id: academicSession,
    campus_id: user.user.campus_id,
    user_id: user.user.user_id,
    hidden_id: "",
  };

  const [validity, setValidity] = useState({
    shift: true,
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

  useEffect(() => {
    const getClasses = (campus_id) => {
      axios
        .get(process.env.REACT_APP_API_BASE_URL+`/get-classes/${campus_id}`)
        .then((res) => {
          setClasses(res.data.results);
        })
        .catch((err) => console.log(err));
    };

    // Ensure user.campus_id is defined before calling fetchClasses
    if (user && user.user.campus_id) {
      getClasses(user.user.campus_id);
    }
  }, [user]); // Dependency

  useEffect(() => {
    const sections = (campus_id) => {
      axios
        .get(process.env.REACT_APP_API_BASE_URL+`/get-sections/${campus_id}`)
        .then((res) => {
          setSections(res.data.results);
        })
        .catch((err) => console.log(err));
    };

    // Ensure user.campus_id is defined before calling fetchClasses
    if (user && user.user.campus_id) {
      sections(user.user.campus_id);
    }
  }, [user]); // Dependency

  const validateForm = () => {
    let isValid = true;
    // Basic validation rules (customize as per your requirements)
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

  
  const [searchCategoryReport, getSearchCategoryReport] = useState({
    search: "",
  });



  useEffect(() => {
    if (academicSession) {
      const initialChecked = data.map((voucher) => voucher.id);
      setCheckedVouchers(initialChecked);
    }
  }, [data, academicSession, user]);

  const handleCheckboxChange = (id) => {
    setCheckedVouchers((prevState) =>
      prevState.includes(id)
        ? prevState.filter((voucherId) => voucherId !== id)
        : [...prevState, id]
    );
  };

  const handleToggleAll = () => {
    if (allChecked) {
      // Uncheck all
      setCheckedVouchers([]);
    } else {
      // Check all
      const allIds = data.map((voucher) => voucher.id);
      setCheckedVouchers(allIds);
    }
    setAllChecked(!allChecked);
  };

  useEffect(() => {
    if (editFormData.shift !== "") {
      fetchData();
    }
  }, [editFormData]);

  const fetchData = () => {
    axios
      .get(process.env.REACT_APP_API_BASE_URL+"/employee-id-card-generate", {
        params: {
          page: currentPage,
          limit: totalItem,
          search: searchCategoryReport.search,
          campus_id: user.user.campus_id,
          shift: editFormData.shift,
        },
      })
      .then((res) => {
        // console.log(res.data.total);
        // console.log(res.data.results);
        setFilteredData(res.data.results);
        setData(res.data.results);
        setLastMonth(res.data.last_month);
        // setTotalPages(Math.ceil(res.data.total) / ITEMS_PER_PAGE);

        // dele(res.data.totalArrears);
        // setTotalPayable(res.data.totalPayable);
      })
      .catch((err) => console.log(err));
  };

  const displayData = filteredData;

  

  const viewData = (id_get) => {
    setViewVoucherId([id_get]);
    setShowData(true);
  };

  const handleSubmit = (id_get) => {
    setViewVoucherId(checkedVouchers);
    setShowData(true);
  };

  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);

    if (query.trim() === "") {
      setFilteredData(data); // Reset to original data when search is empty
    } else {
      // Filter the data based on the searchQuery across all fields
      const filteredData = data.filter((item) => {
        return Object.keys(item).some((key) => {
          const value = item[key];
          return (
            value !== null &&
            value !== undefined &&
            value.toString().toLowerCase().includes(query)
          );
        });
      });
      setFilteredData(filteredData);
    }
  };

  useEffect(() => {
    // Fetch fee vouchers when viewVoucherId changes
    const fetchFeeVouchers = async (
      invoices,
      campus_id,
    ) => {
      try {
        const response = await axios.post(
          process.env.REACT_APP_API_BASE_URL+"/view-employee-id-card",
          {
            invoices,
            campus_id,
          }
        );

        let vouchers = response.data.vouchers;
        setVoucherData(vouchers);
      } catch (error) {
        console.error("Error fetching fee vouchers:", error);
        // Handle error states as needed
      }
    };

    if (viewVoucherId && viewVoucherId.length > 0) {
      fetchFeeVouchers(
        viewVoucherId,
        user.user.campus_id,
        academicSession,
      );
    }
  }, [viewVoucherId, user.user.campus_id, academicSession]);

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    pageStyle: `
            @media print {
                body { -webkit-print-color-adjust: exact; }
                @page { size: portrait !important; margin: 1cm; }
                  .data-grid {
        display: grid;
        grid-template-columns: repeat(2, 1fr); /* Number of columns */
        grid-gap: 10px;
        padding: 10px;
        margin: auto;
      }
     .idcard-container {
        page-break-inside: avoid;
        break-inside: avoid;
    }
    .data-grid {
        display: grid;
        grid-template-columns: 1fr 1fr; /* Adjust columns if needed */
    }
    /* Force a page break after every certain number of cards */
    .data-grid > div:nth-child(6n) {
        page-break-after: always;
    }
            }
        `,
  });

  return (
    <>
      <div className="d-flex">
        <div className="col-md-12 p-2">
          <div className="card-header text-warning bg-primary p-2">
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <i className="fas fa-list"></i> Employee ID Card Generate
              </div>

              <div className="d-flex">
                
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
                      <i className="far fa-check-square"></i>
                    ) : (
                      <i className="far fa-square"></i>
                    )}
                  </button>
                </div>
                <div>
                  <button
                    onClick={handleSubmit}
                    className="btn btn-warning btn-sm"
                  >
                    {" "}
                    <i className="fa fa-eye" aria-hidden="true"></i> View
                    ID Cards
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

            <table className="table m-0">
              <thead>
                <tr>
                  <th>Check</th>
                  <th>PL#</th>
                  <th>Name</th>
                  <th>Designation</th>
                  <th>Job Type</th>
                  <th className="text-center">View ID Card</th>
                </tr>
              </thead>

              <tbody>
                {displayData.map((voucher, index) => (
                  <tr key={index}>
                    <td>
                      <input
                        type="checkbox"
                        checked={checkedVouchers.includes(voucher.id)}
                        onChange={() => handleCheckboxChange(voucher.id)}
                        value={voucher.id}
                      />
                    </td>
                    <td>
                      {voucher.register_no}
                    </td>
                    <td>{voucher.full_name}</td>
                    <td>{voucher.employee_post + " (" + voucher.pay_scale + ")" }</td>
                    <td>{voucher.job_type}</td>
                    <td className="text-center">
                      <div>
                        <a
                          href="#"
                          className={`btn btn-warning btn-sm`}
                          onClick={() => viewData(voucher.id)}
                        >
                          <i className="fas fa-eye"></i>
                        </a>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

          </div>
        </div>
      </div>

      {showData && (
        <>
          <div
            style={{
              position: "fixed", // Fix to the viewport
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)", // Center horizontally and vertically
              zIndex: "100", // Ensure it's above other elements
              backdropFilter: "blur(10px)", // Optional: adds blur to the background
              width: "90%",
              maxWidth: "1800px",
              maxHeight: "90vh",
              backgroundColor: "white",
              // borderRadius: "10px",
              boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
              padding: "10px", // Remove padding for header part
              overflow: "hidden", // Prevent entire modal from scrolling
            }}
          >
            {/* Header section */}
            <div
              style={{
                position: "sticky", // Sticky position to keep the title fixed
                top: 0, // Stick to the top of the modal
                zIndex: 101, // Ensure it's above other content in the modal
                backgroundColor: "#007bff", // Background color for header
                color: "#ffc107",
                padding: "8px 16px", // Padding for header content
              }}
            >
              <h5 style={{ margin: 0 }}>View Employee ID Card</h5>
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
                  color: "#ffc107",
                }}
              >
                &times;
              </button>
            </div>

            {/* Scrollable content */}
            <div
              style={{
                padding: "20px", // Padding for content
                marginTop: "10px", // Margin between header and content
                width: "100%",
                overflowY: "auto", // Make content scrollable
                maxHeight: "calc(90vh - 80px)", // Adjust height relative to viewport
                paddingTop: "5px",
              }}
            >
              <button
                onClick={handlePrint}
                className="btn btn-warning btn-sm ml-4 mt-0"
              >
                <i className="fa fa-print" aria-hidden="true"></i> Print
              </button>


              <button
              onClick={() => setShowBackground((prev) => !prev)} // Toggle function
              className="btn btn-warning btn-sm ml-4 mt-0"
            >
              <i className="fa fa-eye" aria-hidden="true"></i> 
              {showBackground ? " View ID Card" : " View Background"}
            </button>

              <div 
                    className="data-grid"
                    ref={componentRef}
                    style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(2, 1fr)", // 3 columns
                        gridTemplateRows: "repeat(2, auto)", // 2 rows
                        gap: "5px", // Space between cards
                        width: "1004px", // A4 width in pixels at 96 DPI
                        height: "1123px", // A4 height in pixels at 96 DPI
                        padding: "20px", // Padding around the grid
                        margin: "auto",
                    }}
                    >
                    {voucherData.map((voucher, index) => (
                        <IdCard key={index} data={voucher} showBackground={showBackground} />
                    ))}
                    </div>

            </div>
          </div>
        </>
      )}
    </>
  );
}

const IdCard = ({ data, showBackground }) => {
  const {
    register_no,
    full_name,
    employee_post,
    pay_scale,
    job_type,
    profile_image,
    work_shift,
    campus_name,
    current_address,
    dob
  } = data;

  function convertDates(date) {
    const d = new Date(date);
    const day = d.getDate().toString().padStart(2, "0");
    const month = (d.getMonth() + 1).toString().padStart(2, "0");
    const year = d.getFullYear();
    return `${day}-${month}-${year}`;
  }

  function getCurrentDate() {
    const today = new Date();
    const day = String(today.getDate()).padStart(2, "0");
    const month = String(today.getMonth() + 1).padStart(2, "0"); // Months are zero-based
    const year = today.getFullYear();

    const formattedDate = `${day}-${month}-${year}`;
    return formattedDate;
  }

  const renderStudentCards = (title) => (
  
    <div
      style={{
        border: "1px solid #ccc",
        padding: "10px",
        paddingBottom:"20px",
        paddingTop:"20px",
        borderRadius: "8px",
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        width:"390px"
      }}
    >

{showBackground == false && (
      <>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          width: "100%",
        }}
      >
        {/* <h4 style={{ margin: "5px 0", color: "#007bff", background:"rgb(0, 123, 255)", color:"white", width:"100%", textAlign:"center", borderRadius:"8px", border :"1px solid rgb(0, 123, 255)", padding:"5px", paddingLeft:"20px", paddingRight:"20px" }}>{campus_name}</h4> */}
        {/* <h5 style={{ margin: "5px 0", color: "#ffc107" }}>{title}</h5> */}

        <h5 style={{ margin: "5px 0", color: "#007bff", background:"rgb(255, 255, 255)", color:"black", width:"100%", textAlign:"center", padding:"5px", paddingLeft:"20px", paddingRight:"20px" }}> 
        <img
            src={process.env.REACT_APP_BASE_URL+`/uploads/logo.png`}
            alt="Student"
            style={{
              width: "70px",
              height: "70px",
              objectFit: "cover",
              borderRadius: "5px",
              margin: "10px 0",
            }}
          /> {"Sir Syed School " + campus_name}</h5>

      </div>
      <div style={{ textAlign: "center" }}>
        {profile_image ? (
          <img
            src={process.env.REACT_APP_API_BASE_URL+`/uploads/${profile_image}`}
            alt="Student"
            style={{
              width: "100px",
              height: "100px",
              objectFit: "cover",
              borderRadius: "5px",
              margin: "10px 0",
            }}
          />
        ) :  (
          <p>Please Upload Image</p>
        ) }
        <table style={{ width: "370px", textAlign: "left", marginTop: "10px" }}>
          <tbody>
            <tr>
              <th style={{padding: "5px", borderBottom:"1px solid black"}} >PL#: </th>
              <td style={{padding: "5px", borderBottom:"1px solid black"}} >{register_no}</td>
            </tr>
            <tr>
              <th style={{padding: "5px", borderBottom:"1px solid black"}} >Name: </th>
              <td style={{padding: "5px", borderBottom:"1px solid black"}} >{full_name}</td>
            </tr>
            <tr>
              <th style={{padding: "5px", borderBottom:"1px solid black"}} >Post: </th>
              <td style={{padding: "5px", borderBottom:"1px solid black"}} >{`${employee_post} (${pay_scale})`}</td>
            </tr>
            <tr>
              <th style={{padding: "5px", borderBottom:"1px solid black"}} >Job Type: </th>
              <td style={{padding: "5px", borderBottom:"1px solid black"}} >{job_type}</td>
            </tr>
            <tr>
              <th style={{padding: "5px", borderBottom:"1px solid black"}} >Work Shift: </th>
              <td style={{padding: "5px", borderBottom:"1px solid black"}} >{work_shift}</td>
            </tr>
            <tr>
              <th style={{padding: "5px", borderBottom:"1px solid black"}} >DOB: </th>
              <td style={{padding: "5px", borderBottom:"1px solid black"}} >{convertDates(dob)}</td>
            </tr>
            <tr>
              <th  style={{padding: "5px", borderBottom:"1px solid black"}}>Address: </th>
              <td  style={{padding: "5px", borderBottom:"1px solid black"}}>{current_address}</td>
            </tr>
          </tbody>
        </table>
      </div>
      
      <div
  style={{
    display: "flex",
    justifyContent: "center",
    marginTop: "10px",
  }}
>
  <QRCodeCanvas 
    value={register_no.toString()} 
    size={70}  // Adjust the size if needed
    level="H"  // High error correction
    bgColor="#ffffff" 
    fgColor="#000000" 

  />
</div>
</>
)}

{showBackground && (
        <div style={{"position" : "relative"}}>
           <div
    style={{
      backgroundImage: `url(${process.env.REACT_APP_BASE_URL}/uploads/logo.png)`,
      backgroundSize: "220px 220px",
      backgroundRepeat: "no-repeat",
      backgroundPosition: "center",
      position: "absolute",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      opacity: 0.1, // ✅ Only applies to background
      zIndex: 0,
    }}
  ></div>
        <div style={{"height"  :"500px", display : "flex", flexDirection : "column", justifyContent : "center", alignItems : "center", position : "relative", zIndex : 1}}>
        <h4  style={{"textAlign" : "center"}}>Terms and Conditions</h4>
        <ul>
            <li>Keep your card in your custody carefully.</li>
            <li>Display your card overall when you are on duty.</li>
            <li>This card is <strong>non-transferable</strong>.</li>
            <li>This is a <strong>software-generated card</strong> and does not require a signature or stamp.</li>
            <li><strong>Expiry Date:</strong>__________</li>
        </ul>
        <p style={{"textAlign" : "center", "color":"red"}}><strong>IF FOUND, PLEASE RETURN</strong></p>
        <p  style={{"textAlign" : "center"}}>Visit <a href="https://sses.org.pk/website/" target="_blank">SSEI's Website</a></p>
        <p  style={{"textAlign" : "center"}}>https://sses.org.pk/website</p>

        </div>
        </div>
      )}

    </div>

  );

  return (
    <div style={{marginBottom : "20px" }}>
      {renderStudentCards("Employee Id Card")}
    </div>
  );
};

export default EmployeeIdCardGenerate;
