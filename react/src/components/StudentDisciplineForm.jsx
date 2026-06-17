import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { useAuth } from "./AuthContext";
import AcademicSessionContext from "./AcademicSessionContext";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Select from "react-select";
import ReactPaginate from 'react-paginate';

function StudentDisciplineForm() {
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
    date_of_incident: "",
    class_id: "",
    section_id: "",
    student_id: "",
    shift: "",
    type_of_incident: "",
    action_taken: "", // New field for activity type
    description: "",
    reporting_teacher: "",
    session_id: academicSession,
    campus_id: user.user.campus_id,
    user_id: user.user.user_id,
    hidden_id: "",
  };

  const [validity, setValidity] = useState({
    date_of_incident: true,
    class_id: true,
    section_id:true,
    student_id: true,
    shift: true,
    type_of_incident: true,
    action_taken: true,
    description: true,
    reporting_teacher: true
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
      setValidity((prevState) => ({ ...prevState, shift: false }));
      isValid = false;
    }

    if (!editFormData.date_of_incident && !editFormData.date_of_incident.trim()) {
      setValidity((prevState) => ({ ...prevState, date_of_incident: false }));
      isValid = false;
    }

    if (!editFormData.student_id) {
      setValidity((prevState) => ({ ...prevState, student_id: false }));
      isValid = false;
    }

    if (!editFormData.type_of_incident) {
      setValidity((prevState) => ({ ...prevState, type_of_incident: false }));
      isValid = false;
    }

     if (!editFormData.action_taken) {
      setValidity((prevState) => ({ ...prevState, action_taken: false }));
      isValid = false;
    }

    if (!editFormData.description) {
      setValidity((prevState) => ({ ...prevState, description: false }));
      isValid = false;
    }

    if (!editFormData.reporting_teacher) {
      setValidity((prevState) => ({ ...prevState, reporting_teacher: false }));
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
      process.env.REACT_APP_API_BASE_URL + "/student-discipline",
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
        axios.get(process.env.REACT_APP_API_BASE_URL+`/get-student-discipline-data/${id_get}`)
            .then(response => {

              console.log(response.data.results[0]);
              
                const { id, student_id, name, type_of_incident, date_of_incident, action_taken, shift, description, class_id, section_id, reporting_teacher} = response.data.results[0];
                // console.log(section_name);
                setEditFormData({ ...editFormData, 
                    class_id: class_id || '',
                     section_id: section_id || '',
                    student_id: student_id || '',
                    name: name || '',
                    shift: shift || '',
                    type_of_incident: type_of_incident || '',
                    date_of_incident: date_of_incident || '',
                      action_taken: action_taken || '',
                    description: description || '',
                     reporting_teacher: reporting_teacher || '',
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
          axios.get(process.env.REACT_APP_API_BASE_URL+`/student-discipline-delete/${id_get}/${user.user.campus_id}/${academicSession}`)
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
        axios.get(process.env.REACT_APP_API_BASE_URL+"/student-discipline-list", {
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
        <div className="col-md-5 p-2">
          <h5 className="text-warning bg-primary p-2 card-header border">
            {" "}
          <i class="fas fa-exclamation-triangle"></i> Student Discipline Form
          </h5>
          <form className="border p-3" onSubmit={handleActivitySubmit}>


            
            <div className="form-group row">
              <label htmlFor="inputEmail3" className="col-sm-3 col-form-label">
                Date of Incident
              </label>
              <div className="col-sm-9">
                <input
                  type="date"
                  name="date_of_incident"
                  value={editFormData.date_of_incident}
                  onChange={(e) => {
                    setEditFormData({
                      ...editFormData,
                      date_of_incident: e.target.value,
                    });
                    setValidity({ ...validity, date_of_incident: true });
                  }}
                  className={
                    validity.date_of_incident
                      ? "form-control"
                      : "form-control invalid-input"
                  }
                />
              </div>
            </div>
         
            <div className="form-group row">
              <label htmlFor="inputEmail3" className="col-sm-3 col-form-label">
                Class
              </label>
              <div className="col-sm-9">
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
              <label htmlFor="inputEmail3" className="col-sm-3 col-form-label">
                Shift
              </label>
              <div className="col-sm-9">
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
              <label htmlFor="inputEmail3" className="col-sm-3 col-form-label">
                Students
              </label>
              <div className="col-sm-9">
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
  <label htmlFor="activityType" className="col-sm-3 col-form-label">
    Type of Incident:
  </label>
  <div className="col-sm-9">
    <select
      name="type_of_incident"  // Changed from 'remarks' to 'activity_type'
      id="type_of_incident"
      value={editFormData.type_of_incident || ""}
      onChange={(e) => {
        setEditFormData({
          ...editFormData,
          type_of_incident: e.target.value,
        });
        setValidity({ ...validity, type_of_incident: true });
      }}
      className={
        validity.type_of_incident
          ? "form-control"
          : "form-control invalid-input"
      }
    >
       <option value="">Select Type of Incident</option>
    <option value="tardiness">Tardiness</option>
    <option value="disruption">Classroom Disruption</option>
    <option value="bullying">Bullying</option>
    <option value="cheating">Cheating</option>
    <option value="other">Other</option>
    </select>
  </div>
</div>


<div className="form-group row">
  <label htmlFor="activityType" className="col-sm-3 col-form-label">
    Action Taken
  </label>
  <div className="col-sm-9">
    <select
      name="action_taken"  // Changed from 'remarks' to 'activity_type'
      id="action_taken"
      value={editFormData.action_taken || ""}
      onChange={(e) => {
        setEditFormData({
          ...editFormData,
          action_taken: e.target.value,
        });
        setValidity({ ...validity, action_taken: true });
      }}
      className={
        validity.action_taken
          ? "form-control"
          : "form-control invalid-input"
      }
    >
        <option value="">Select Action Taken</option>
    <option value="warning">Verbal Warning</option>
    <option value="written">Written Warning</option>
    <option value="detention">Detention</option>
    <option value="suspension">Suspension</option>
    <option value="other">Other</option>
    </select>
  </div>
</div>
        
            <div className="form-group row">
              <label htmlFor="inputEmail3" className="col-sm-3 col-form-label">
                Description 
              </label>
              <div className="col-sm-9">
                <textarea
                  type="text"
                  name="description"
                  value={editFormData.description}
                  onChange={(e) => {
                    setEditFormData({
                      ...editFormData,
                      description: e.target.value,
                    });
                    setValidity({ ...validity, description: true });
                  }}
                  className={
                    validity.description
                      ? "form-control"
                      : "form-control invalid-input"
                  }
                />
              </div>
            </div>


            <div className="form-group row">
              <label htmlFor="inputEmail3" className="col-sm-3 col-form-label">
                Reporting Teacher:
              </label>
              <div className="col-sm-9">
                <input
                  type="text"
                  name="reporting_teacher"
                  value={editFormData.reporting_teacher}
                  onChange={(e) => {
                    setEditFormData({
                      ...editFormData,
                      reporting_teacher: e.target.value,
                    });
                    setValidity({ ...validity, reporting_teacher: true });
                  }}
                  className={
                    validity.reporting_teacher
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
      Save
    </button>
  </div>
</div>

          </form>
        </div>


         <div className='col-md-7 p-2' >
                    <div className="card-header text-warning bg-primary p-2">
                        <div className="d-flex justify-content-between align-items-center">
                            <div>
                                <i className="fas fa-list"></i> Student Discipline List
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
                                      <th>Type</th>
                                       <th>Action</th>
                                      <th>Descrip.</th>
                                      <th>Reporting</th>
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
                                            <td>{section_get.date_of_incident}</td>
                                            <td>{section_get.student_name}</td>
                                            <td>{section_get.type_of_incident}</td>
                                            <td>{section_get.action_taken}</td>
                                            <td>{section_get.description}</td>
                                            <td>{section_get.reporting_teacher}</td>

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

export default StudentDisciplineForm;
