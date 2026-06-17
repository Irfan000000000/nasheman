import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { useAuth } from "./AuthContext";
import AcademicSessionContext from "./AcademicSessionContext";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Select from "react-select";
import ReactPaginate from 'react-paginate';

function StudentActivities() {
  const [data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [getCategories, setCategories] = useState([]);
  const [getClasses, setClasses] = useState([]);
  const [getStudents, setStudents] = useState([]);
    const [totalCount, setTotalCount] = useState(0);

  const [checkAdvance, setAdvance] = useState([]);
  const [checkAdvanceStatus, setAdvanceStatus] = useState('');

  const [getFeeHeads, setFeeHeads] = useState([]);
  const { user } = useAuth();
  const { academicSession } = useContext(AcademicSessionContext);

  //this is heads_amounts state that we selected and send to server
  const [selectedItems, setSelectedItems] = useState([]);


 const [totalItem, setTotalItemGet] = useState(10);

     const [totalPages, totalPagesGet] = useState("");


  const handlePageChange = ({ selected }) => {
        setCurrentPage(selected + 1);
    };

    const handleTotalItemChange = (event) => {

        const newValue = event.target.value;
        setTotalItemGet(newValue);

    }

  const initialState = {
    activity_date: "",
    class_id: "",
    section_id: "",
    student_id: "",
    shift: "",
    name: "",
    activity_type: "", // New field for activity type
    remarks: "",
    amount: "",
    position: "", // New field for position
    session_id: academicSession,
    campus_id: user.user.campus_id,
    user_id: user.user.user_id,
    hidden_id: "",
  };

  const [validity, setValidity] = useState({
    activity_date: true,
    class_id: true,
    section_id:true,
    student_id: true,
    shift: true,
    name: true,
    activity_type: true,
    remarks: true,
    amount: true,
    position: true
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

  const validateForm = () => {
    let isValid = true;
    // Basic validation rules (customize as per your requirements)
    if (!editFormData.class_id && !editFormData.class_id.trim()) {
      setValidity((prevState) => ({ ...prevState, class_id: false }));
      isValid = false;
    }

    if (!editFormData.shift && !editFormData.shift.trim()) {
      setValidity((prevState) => ({ ...prevState, from_month: false }));
      isValid = false;
    }

    if (!editFormData.activity_date && !editFormData.activity_date.trim()) {
      setValidity((prevState) => ({ ...prevState, due_date: false }));
      isValid = false;
    }

    if (!editFormData.student_id) {
      setValidity((prevState) => ({ ...prevState, remarks: false }));
      isValid = false;
    }

    if (!editFormData.activity_type && !editFormData.activity_type) {
      setValidity((prevState) => ({ ...prevState, shift: false }));
      isValid = false;
    }

     if (!editFormData.remarks && !editFormData.remarks) {
      setValidity((prevState) => ({ ...prevState, shift: false }));
      isValid = false;
    }

      if (!editFormData.position && !editFormData.position) {
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

  function searchCategory() {
    // fetchData();
  }



  function getReport() {
    if (report.report_type == "pdf") {
      // pdfReport();
    } else if (report.report_type == "excel") {
      // excelReport();
    }
  }

  useEffect(() => {
    const getClasses = (campus_id) => {
      axios
        .get(process.env.REACT_APP_API_BASE_URL + `/get-classes/${campus_id}`)
        .then((res) => {
          setClasses(res.data.results);
        })
        .catch((err) => console.log(err));
    };

    // Ensure user.campus_id is defined before calling fetchClasses
    if (user && user.user.campus_id) {
      getClasses(user.user.campus_id);
    }
  }, [user]); // Dependenci

  useEffect(() => {
    const getStudents = (class_id, section_id, shift, campus_id, session_id) => {
      axios
        .get(
          process.env.REACT_APP_API_BASE_URL +
            `/get-students/${class_id}/${section_id}/${campus_id}/${session_id}/${shift}`
        )
        .then((res) => {
          setStudents(res.data.results);
        })
        .catch((err) => console.log(err));
    };

    // Ensure user.campus_id is defined before calling fetchClasses
    if (
      user &&
      user.user.campus_id &&
      editFormData.class_id &&
      editFormData.section_id &&
      editFormData.shift
    ) {
      getStudents(
        editFormData.class_id,
        editFormData.section_id,
        editFormData.shift,
        user.user.campus_id,
        academicSession
      );
    }
  }, [user, editFormData.class_id, editFormData.section_id, editFormData.shift]); // Dependenci


// Create a specific handler for activities
const handleActivitySubmit = async (e) => {
  e.preventDefault();
  
   validateForm();

  try {
    // setLoading(true);
    const response = await axios.post(
      process.env.REACT_APP_API_BASE_URL + "/student-activities",
      editFormData
    );

    toast.success("Activity recorded successfully!");
    // Reset form
    setEditFormData({
      ...initialState,
      // session_id: academicSession,
      // campus_id: user.user.campus_id,
      // user_id: user.user.user_id,
    });

    fetchData(false);
    
  } catch (error) {
    console.error("Error submitting activity:", error);
    toast.error("Failed to record activity");
  } finally {
    setLoading(false);
  }
};

  useEffect(() => {
    if (editFormData.from_month) {
      const selectedMonth = new Date(editFormData.from_month);
      const dueDate = new Date(
        selectedMonth.getFullYear(),
        selectedMonth.getMonth(),
        2
      ); // Set due date to the 5th of the next month
      setEditFormData((prevFormData) => ({
        ...prevFormData,
        due_date: dueDate.toISOString().split("T")[0],
      }));
    }
  }, [editFormData.from_month]);

  const handleCheckboxChange = (id, amount, category_id, category_name) => {
    setSelectedItems((prevSelectedItems) => {
      const isSelected = prevSelectedItems.some((item) => item.id === id);
      if (isSelected) {
        // If the item is already selected, remove it
        return prevSelectedItems.filter((item) => item.id !== id);
      } else {
        // If the item is not selected, add it
        return [
          ...prevSelectedItems,
          { id, amount, category_id, category_name },
        ];
      }
    });
  };

  const handleAmountChange = (e, id) => {
    const newAmount = e.target.value;
    setSelectedItems((prevSelectedItems) => {
      return prevSelectedItems.map((item) => {
        if (item.id === id) {
          return { ...item, amount: parseInt(newAmount) };
        }
        return item;
      });
    });
  };

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

  const grandAmount = selectedItems.reduce(
    (total, item) => parseInt(total) + parseInt(item.amount),
    0
  );

  const handleStudentChange = (selectedOption) => {
    const student = getStudents.find(
      (student) => student.id === selectedOption.value
    );
    setEditFormData({
      ...editFormData,
      student_id: selectedOption ? selectedOption.value : "",
      category_id: selectedOption ? selectedOption.category_id : "", // Update category_id on change
      shift: selectedOption ? selectedOption.shift : "", // Update shift on change
      bus_fee: student ? student.bus_fee : 0, // Set bus_fee from selected student
      bus_status: student ? student.bus_status : "", // Set bus_status from selected student
    });
  };




  
    const edit = (id_get) => {
        axios.get(process.env.REACT_APP_API_BASE_URL+`/get-student-activities-data/${id_get}`)
            .then(response => {
              
                const { id, student_id, name, activity_type, activity_date, remarks, shift, position, class_id, section_id } = response.data.results[0];
                // console.log(section_name);
                setEditFormData({ ...editFormData, 
                    class_id: class_id || '',
                     section_id: section_id || '',
                    student_id: student_id || '',
                    name: name || '',
                    shift: shift || '',
                    activity_type: activity_type || '',
                    activity_date: activity_date || '',
                    remarks: remarks || '',
                    position: position || '',
                    hidden_id: id || ''
                });
            })
            .catch(error => {
                console.error('Error:', error);
            });
    }




  
    const deleteRow = (id_get) => {
        var confirm_delete = window.confirm("Deleted! Are you sure?");
        
        if (confirm_delete) {
          axios.get(process.env.REACT_APP_API_BASE_URL+`/student-activities-delete/${id_get}/${user.user.campus_id}/${academicSession}`)
            .then(response => {
              console.log('Status updated successfully:', response.data);
              // Update the state to reflect the change in status
              setData(prevData => prevData.filter(classes => classes.id !== id_get));
            })
            .catch(error => {
              console.error('Error updating status:', error);
            });
        }
      };


    const fetchData = (shouldLoad = true) => {
       if (shouldLoad) setLoading(true);
        axios.get(process.env.REACT_APP_API_BASE_URL+"/student-activities-list", {
            params: {
                page: currentPage,
                limit: totalItem,
                search: searchCategoryReport.search,
                campus_id: user.user.campus_id,
                session_id: academicSession
            }
        })
            .then(res => {
                console.log(res.data.results);
                setData(res.data.results);
                setTotalCount(0);
                totalPagesGet(res.data.totalPages);
                setLoading(false);
            })
            .catch(err => console.log(err));
    };


      


       useEffect(() => {
             fetchData(false);
         }, [currentPage, totalItem, user]);


        
    function searchCategory() {
        fetchData(false);
    }


    
 const handleKeyDown = (e) => {
  console.log("hitted");
        if (e.key === 'Enter') {
            getSearchCategoryReport(searchCategoryReport);
            fetchData(false);
        }
    };



   


  return (
    <>
      <div className="d-flex">
        <div className="col-md-4 p-2">
          <h5 className="text-warning bg-primary p-2 card-header border">
            {" "}
           <i className="fas fa-trophy"></i> Student Activities
          </h5>
          <form className="border p-3" onSubmit={handleActivitySubmit}>


            
            <div className="form-group row">
              <label htmlFor="inputEmail3" className="col-sm-2 col-form-label">
                Date
              </label>
              <div className="col-sm-10 ">
                <input
                  type="date"
                  name="activity_date"
                  value={editFormData.activity_date}
                  onChange={(e) => {
                    setEditFormData({
                      ...editFormData,
                      activity_date: e.target.value,
                    });
                    setValidity({ ...validity, activity_date: true });
                  }}
                  className={
                    validity.activity_date
                      ? "form-control"
                      : "form-control invalid-input"
                  }
                />
              </div>
            </div>
         
            <div className="form-group row">
              <label htmlFor="inputEmail3" className="col-sm-2 col-form-label">
                Class
              </label>
              <div className="col-sm-10 ">
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
                      : { value: "", label: "Select Class" }
                  }
                  onChange={handleClassChange}
                  placeholder="Select Class"
                  isClearable
                />
              </div>
            </div>

            <div className="form-group row">
              <label htmlFor="inputEmail3" className="col-sm-2 col-form-label">
                Shift
              </label>
              <div className="col-sm-10 ">
                <select
                  name="shift"
                  id="shift"
                  className={
                    validity.shift
                      ? "form-control"
                      : "form-control invalid-input"
                  }
                  value={editFormData.shift}
                  onChange={(e) => {
                    setEditFormData({
                      ...editFormData,
                      shift: e.target.value,
                    });
                    setValidity({ ...validity, shift: true });
                  }}
                >
                  <option value="">Select Shift</option>
                  <option>Morning</option>
                  <option>Evening</option>
                </select>
              </div>
            </div>

            <div className="form-group row">
              <label htmlFor="inputEmail3" className="col-sm-2 col-form-label">
                Students
              </label>
              <div className="col-sm-10 ">
                <Select
                  options={getStudents.map((student) => ({
                    value: student.id,
                    label: student.full_name,
                    category_id: student.category_id,
                    shift: student.shift,
                  }))}
                  value={
                    editFormData.student_id
                      ? {
                          value: editFormData.student_id,
                          label:
                            getStudents.find(
                              (student) =>
                                student.id === editFormData.student_id
                            )?.full_name || "",
                          category_id: editFormData.category_id,
                          shift: editFormData.shift,
                        }
                      : null
                  }
                  onChange={handleStudentChange}
                  placeholder="Select Student"
                />
              </div>
            </div>

 <div className="form-group row">
  <label htmlFor="activityType" className="col-sm-2 col-form-label">
    Type
  </label>
  <div className="col-sm-10">
    <select
      name="activity_type"  // Changed from 'remarks' to 'activity_type'
      id="activityType"
      value={editFormData.activity_type || ""}
      onChange={(e) => {
        setEditFormData({
          ...editFormData,
          activity_type: e.target.value,
        });
        setValidity({ ...validity, activity_type: true });
      }}
      className={
        validity.activity_type
          ? "form-control"
          : "form-control invalid-input"
      }
    >
      <option value="">Select Activity Type</option>
      <option value="sports">Sports</option>
      <option value="academic">Academic Competition</option>
      <option value="cultural">Cultural Event</option>
      <option value="workshop">Workshop/Seminar</option>
      <option value="field_trip">Field Trip</option>
      <option value="community_service">Community Service</option>
      <option value="performance">Performance/Show</option>
      <option value="science_fair">Science Fair</option>
      <option value="debate">Debate/Public Speaking</option>
      <option value="art_exhibition">Art Exhibition</option>
      <option value="other">Other</option>
    </select>
  </div>
</div>

        
            <div className="form-group row">
              <label htmlFor="inputEmail3" className="col-sm-2 col-form-label">
                Activity
              </label>
              <div className="col-sm-10 ">
                <input
                  type="text"
                  name="remarks"
                  value={editFormData.name}
                  onChange={(e) => {
                    setEditFormData({
                      ...editFormData,
                      name: e.target.value,
                    });
                    setValidity({ ...validity, name: true });
                  }}
                  className={
                    validity.name
                      ? "form-control"
                      : "form-control invalid-input"
                  }
                />
              </div>
            </div>


            
           
 <div className="form-group row">
  <label htmlFor="activityType" className="col-sm-2 col-form-label">
    Position
  </label>

  <div className="col-sm-10">
  <select
    name="position"  // Changed from 'activity_type' to 'position'
    id="position"
    value={editFormData.position || ""}
    onChange={(e) => {
      setEditFormData({
        ...editFormData,
        position: e.target.value,
      });
      setValidity({ ...validity, position: true });
    }}
    className={
      validity.position
        ? "form-control"
        : "form-control invalid-input"
    }
  >
    <option value="">Select Position</option>
    <option value="1st">1st Position</option>
    <option value="2nd">2nd Position</option>
    <option value="3rd">3rd Position</option>
    <option value="4th">4th Position</option>
    <option value="5th">5th Position</option>
    <option value="6th">6th Position</option>
    <option value="7th">7th Position</option>
    <option value="8th">8th Position</option>
    <option value="9th">9th Position</option>
    <option value="10th">10th Position</option>
  </select>
</div>

  </div>

            
            <div className="form-group row">
              <label htmlFor="inputEmail3" className="col-sm-2 col-form-label">
                Remarks
              </label>
              <div className="col-sm-10 ">
                <input
                  type="text"
                  name="remarks"
                  value={editFormData.remarks}
                  onChange={(e) => {
                    setEditFormData({
                      ...editFormData,
                      remarks: e.target.value,
                    });
                    setValidity({ ...validity, remarks: true });
                  }}
                  className={
                    validity.remarks
                      ? "form-control"
                      : "form-control invalid-input"
                  }
                />
              </div>
            </div>

          
<div className="form-group row">
  <div className="col-sm-10 offset-sm-2 text-right">
    <button 
      type="submit" 
      className="btn btn-primary"
      // onClick={handleSubmit}
    >
      <i className="fas fa-save"></i> Save Activity
    </button>
  </div>
</div>

          </form>
        </div>


         <div className='col-md-8 p-2' >
                    <div className="card-header text-warning bg-primary p-2">
                        <div className="d-flex justify-content-between align-items-center">
                            <div>
                                <i className="fas fa-list"></i> Student Activities List
                            </div>
                            <div className="d-flex">
                                <div className="me-2 mr-2">
                                    <input type="text" className="form-control" id="search_category" onKeyDown={handleKeyDown} onChange={(e) => getSearchCategoryReport({ ...searchCategoryReport, search: e.target.value })} />
                                </div>
                                <button className="btn btn-sm btn-danger" onClick={searchCategory} >Search</button>
                            </div>
                            <div className="d-none">
                                <div className="me-2 mr-2">
                                    <input type="date" className="form-control" id="from_date" onChange={(e) => getAllReports({ ...report, from_date: e.target.value })} />
                                </div>

                                <div className="me-2 mr-2">
                                    <input type="date" className="form-control" id="to_date" onChange={(e) => getAllReports({ ...report, to_date: e.target.value })} />
                                </div>

                                <div className="me-2 mr-2">
                                    <select name="type" id="type" className="form-control" onChange={(e) => getAllReports({ ...report, report_type: e.target.value })}>
                                        <option value="">Select Type</option>

                                        <option value="excel">Excel</option>
                                        <option value="pdf">PDF</option>
                                    </select>
                                </div>

                                <button className="btn btn-sm btn-danger" onClick={getReport} >Get Report</button>
                            </div>



                        </div>
                    </div>

                    <div className='border p-2'>
                        <div className='pb-3'>
                            <select value={totalItem} onChange={handleTotalItemChange}>
                                <option value="10">10</option>
                                <option value="20">20</option>
                                <option value="30">30</option>
                                <option value="40">40</option>
                                <option value="50">50</option>
                            </select>
                        </div>


                        <table className='table'>
                            <thead>
                                <tr>
                                    <th>Date</th>
                                    <th>Student</th>
                                      <th>Activity.Name</th>
                                      <th>Type</th>
                                       <th>Position</th>
                                      <th>Remarks</th>
                                    <th className='text-center'>Edit</th>
                                    <th className='text-center'>Delete</th>
                                </tr>
                            </thead>
                            <tbody>
                                {loading ? (
                                    <tr>
                                        <td colSpan="4">Loading...</td>
                                    </tr>
                                ) : (


                                    data.map((section_get, index) => (
                                        <tr key={section_get.id}>
                                            <td>{section_get.activity_date}</td>
                                            <td>{section_get.student_name}</td>
                                             <td>{section_get.name}</td>
                                            <td>{section_get.activity_type}</td>
                                              <td>{section_get.position}</td>
                                            <td>{section_get.remarks}</td>

                                            <td className='text-center'>
                                                <div><a href="#" className='btn btn-success btn-sm' onClick={() => edit(section_get.id)} ><i className="fas fa-edit"></i></a></div>
                                            </td>
                                            <td className='text-center'>
                                                <div><a href="#" className='btn btn-danger btn-sm' onClick={() => deleteRow(section_get.id)}><i className="fas fa-trash-alt"></i></a></div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>

                        <ReactPaginate
                            previousLabel={'Previous'}
                            nextLabel={'Next'}
                            breakLabel={'...'}
                            pageCount={totalPages}
                            marginPagesDisplayed={2}
                            pageRangeDisplayed={3}
                            onPageChange={handlePageChange}
                            containerClassName={'pagination'}
                            pageClassName={'page-item'}
                            activeClassName={'active'}
                            pageLinkClassName={'page-link'}
                            previousClassName={'page-item'}
                            previousLinkClassName={'page-link'}
                            nextClassName={'page-item'}
                            nextLinkClassName={'page-link'}
                            breakClassName={'page-item'}
                            breakLinkClassName={'page-link'}
                        />

                    </div>

                </div>

      
      </div>
    </>
  );
}

export default StudentActivities;
