import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { useAuth } from "./AuthContext";
import AcademicSessionContext from "./AcademicSessionContext";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Select from "react-select";

function CreateTimeTable() {
  const defaultRow = {
    id: "",
    subject: "",
    teacher: "",
    timeFrom: "",
    timeTo: "",
    roomNo: "",
    campus_id: "",
    session_id: "",
  };

  const { user } = useAuth();
  const { academicSession } = useContext(AcademicSessionContext);
  const [rows, setRows] = useState([{ ...defaultRow }]);

  const [timeTableData, setTimeTableData] = useState([]);

  const [teachers, setTeachers] = useState([]);

  const [subjects, setSubjects] = useState([]);

  // const [showStruckOffSummary, setStruckOffSummary] = useState(false);

  const [showData, setShowData] = useState(false);


  const initialFormData = {
    shift: "Morning",
    class_id: "",
    section_id: "",
    teacher_id_get:""
  };

  const [editFormData, setEditFormData] = useState(initialFormData);
  const [getClasses, setClasses] = useState([]);

  const handleChange = (index, field, value) => {
    const updated = [...rows];
    updated[index][field] = value;
    setRows(updated);
  };

  const addRow = () => setRows([...rows, { ...defaultRow }]);

  const deleteRow = (index) => {
    const updated = rows.filter((_, i) => i !== index);
    setRows(updated);
  };

  

  const deleteTimeTableRowAlready = (id, index) => {
    var confirm_delete = window.confirm(
      "Are you sure you want to delete this timetable entry?"
    );
    if (confirm_delete) {
      axios
        .get(
          process.env.REACT_APP_API_BASE_URL +
            `/delete-timetable/${id}/${user.user.campus_id}/${academicSession}`
        )
        .then((response) => {
          // Handle success response
          console.log("Timetable Deleted Successfully:", response.data);
          toast.success("Timetable Deleted Successfully!");
          // Remove the row from the state after successful deletion
          const updatedRows = [...rows];
          updatedRows.splice(index, 1); // Removes the row at the specified index
          setRows(updatedRows); // Update the rows state
        })
        .catch((error) => {
          // Handle error response
          console.error("Error deleting:", error);
          toast.error("Error deleting timetable!");
        });
    }
  };




  const viewTimeTable = () => {

    if(editFormData.teacher_id_get !== "" && editFormData.class_id !== "" && editFormData.section_id !== ""){
      // start from view class wise time table
    }
    
    axios.get(`${process.env.REACT_APP_API_BASE_URL}/view-timetable`, {
  params: {  // Axios automatically formats this as query params
    class_id: editFormData.class_id,       // optional
    section_id: editFormData.section_id,   // optional
    shift: editFormData.shift,             // required
    campus_id: user.user.campus_id,        // required
    session_id: academicSession,           // required
    teacher_id_get: editFormData.teacher_id_get // optional
  }
}).then((response) => {
        // Handle success response
        setTimeTableData(response.data.results); //
        setShowData(true);
        // console.log("Timetable fetched successfully:", response.data.results);
        // You can do something with the response data here, like updating the state to display the timetable
      })
      .catch((error) => {
        // Handle error response
        console.error("Error fetching timetable:", error);
        toast.error("Error fetching timetable!");  // You can use toast to show an error message to the user
      });
  };
  




  const moveRow = (index, direction) => {
    const newRows = [...rows];
    const newIndex = index + direction;
    if (newIndex < 0 || newIndex >= newRows.length) return;
    const temp = newRows[newIndex];
    newRows[newIndex] = newRows[index];
    newRows[index] = temp;
    setRows(newRows);
  };

  //   const handleSave = () => {
  //     console.log("Saved Data:", rows);
  //   };

  const days = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    // "Sunday",
  ];
  const [activeDay, setActiveDay] = useState("Monday");

  const handleSave = async () => {
    const enrichedRows = rows.map((row, index) => ({
      ...row,
      campus_id: user.user.campus_id,
      session_id: academicSession,
      shift: editFormData.shift,
      class_id: editFormData.class_id,
      section_id: editFormData.section_id,
      day: activeDay,
      period: index + 1, // Assuming period is the index + 1
    }));

    console.log(enrichedRows);

    try {
      const response = await axios.post(
        process.env.REACT_APP_API_BASE_URL + "/bulk-insert-timetable",
        enrichedRows,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      toast.success("Data Inserted successfully!");
    } catch (error) {
      if (error.response?.data?.error) {
        toast.error(error.response.data.error);
      } else {
        toast.error("An error occurred");
      }
    }
  };

  useEffect(() => {
    const fetchTeachers = (campus_id) => {
      axios
        .get(process.env.REACT_APP_API_BASE_URL + `/get-teachers-for-time-table/${campus_id}`)
        .then((res) => {
          // console.log(res.data.results);
          setTeachers(res.data.results);
        })
        .catch((err) => console.log(err));
    };

    // Ensure user.campus_id is defined before calling fetchClasses
    if (user && user.user.campus_id) {
      fetchTeachers(user.user.campus_id);
    }
  }, [user]); // Dependencies array to re-run the effect when user changes

 
  useEffect(() => {
    const fetchTimeTable = (
      campus_id,
      session_id,
      class_id,
      section_id,
      shift,
      day
    ) => {
      axios
        .get(
          process.env.REACT_APP_API_BASE_URL +
            `/if-timetable-already-exist/${campus_id}/${session_id}/${class_id}/${section_id}/${shift}/${day}`
        )
        .then((res) => {
          const fetchedRows = res.data.results.map((item) => ({
            id: item.id,
            subject: item.subject_id,
            teacher: item.teacher_id,
            timeFrom: item.time_from,
            timeTo: item.time_to,
            roomNo: item.room_no,
            campus_id,
            session_id,
            day,
          }));
          setRows(fetchedRows);
        })
        .catch((err) => console.log(err));
    };

    if (
      user &&
      user.user.campus_id &&
      academicSession &&
      editFormData.class_id &&
      editFormData.section_id &&
      editFormData.shift &&
      activeDay
    ) {
      fetchTimeTable(
        user.user.campus_id,
        academicSession,
        editFormData.class_id,
        editFormData.section_id,
        editFormData.shift,
        activeDay
      );
    }
  }, [
    activeDay,
    editFormData.class_id,
    editFormData.section_id,
    editFormData.shift,
    user,
    academicSession,
  ]);

  useEffect(() => {
    const fetchTeachers = (campus_id) => {
      axios
        .get(
          process.env.REACT_APP_API_BASE_URL +
            `/get-subjects-for-timetable/${campus_id}/${editFormData.class_id}/${editFormData.section_id}`
        )
        .then((res) => {
          console.log(res.data.results);
          setSubjects(res.data.results);
        })
        .catch((err) => console.log(err));
    };

    // Ensure user.campus_id is defined before calling fetchClasses
    if (user && editFormData.class_id !=='') {
      fetchTeachers(user.user.campus_id);
    }
  }, [editFormData.class_id, editFormData.section_id]); // Dependencies array to re-run the effect when user changes

 

  useEffect(() => {
    const fetchClasses = (campus_id) => {
      axios
        .get(process.env.REACT_APP_API_BASE_URL + `/get-classes/${campus_id}`)
        .then((res) => {
          // console.log(res.data.results)
          setClasses(res.data.results);
        })
        .catch((err) => console.log(err));
    };

    // Ensure user.campus_id is defined before calling fetchClasses
    if (user && user.user.campus_id) {
      fetchClasses(user.user.campus_id);
    }
  }, []); // Dependencies array to re-run the effect when user changes

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


  const groupedData = days.reduce((acc, day) => {
    acc[day] = timeTableData.filter(item => item.day === day);
    return acc;
  }, {});



  const handleHide = () => {
    setShowData(false);
  }

  return (
    <div className="d-flex">
      <div className="col-md-12 p-2">
        <h5 className="text-warning bg-primary p-2 card-header border">
          {" "}
          <i className="fas fa-clock"></i> Create Time Table
        </h5>
        
        <div className="row mb-4">
          <div className="col-md-2">
            {/* <label htmlFor="shift">Select Shift</label> */}
            <select
              id="shift"
              className="form-control mt-4"
              value={editFormData.shift}
              onChange={(e) => {
                setEditFormData({ ...editFormData, shift: e.target.value });
              }}
            >
              {/* <option value="">Select Shift</option> */}
              <option>Morning</option>
              <option>Evening</option>
            </select>
          </div>

          <div className="col-md-2 mt-4">
            {/* <label htmlFor="class">Select Class</label> */}
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
            />
          </div>
         
          <div className="col-md-8 d-flex justify-content-end align-items-center mt-4">

          
          
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

              isClearable
              onChange={handleClassChange}
              placeholder="Class Wise Time Table"
              className="mr-3"
            />
          

          <select
            className="form-control me-2 mr-3 col-md-3"
            value={editFormData.teacher_id_get}
            onChange={(e) => {
              setEditFormData({ ...editFormData, teacher_id_get: e.target.value });
          }}
          >
            <option value="">Teachers Time Table</option>
            {teachers.map((t) => (
              <option key={t.id} value={t.id}>
                {t.full_name}
              </option>
            ))}
          </select>



  
                  <select
                  name="shift"
                  id="shift"
                  className={'form-control col-md-2 mr-2'}
                  value={editFormData.shift}
                  onChange={(e) => {
                    setEditFormData({ ...editFormData, shift: e.target.value });
                }}
                  >
                  {/* <option value="">Select Shift</option> */}
                  <option>Morning</option>
                  <option>Evening</option>
              </select>
          


          
  
  <button className="btn btn-warning"  onClick={() => viewTimeTable()}><i className="fas fa-eye"></i> View Time Tables</button>
</div>


        </div>
        <div>
          <ul className="nav nav-tabs">
            {days.map((day) => (
              <li className="nav-item" key={day}>
                <button
                  className={` bg-primary text-warning mr-2 nav-link ${
                    activeDay === day
                      ? "active text-warning border-bottom border-warning"
                      : ""
                  }`}
                  onClick={() => setActiveDay(day)}
                >
                  {day}
                </button>
              </li>
            ))}
          </ul>

          <table className="table table-striped table-bordered mt-3">
            <thead>
              <tr>
                <th className="text-left">Subject</th>
                <th className="text-left">Teacher</th>
                <th className="text-left">Time From</th>
                <th className="text-left">Time To</th>
                <th className="text-left">Room No</th>
                <th style={{ width: "120px" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, index) => (
                <tr key={index}>
                  <td>
                    <select
                      className="form-control"
                      value={row.subject}
                      onChange={(e) =>
                        handleChange(index, "subject", e.target.value)
                      }
                    >
                      <option value="">Select Subject</option>
                      {subjects.map((s) => (
                        <option key={s.id} value={s.id}>
                          {s.subjects}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td>
                    <select
                      className="form-control"
                      value={row.teacher}
                      onChange={(e) =>
                        handleChange(index, "teacher", e.target.value)
                      }
                    >
                      <option value="">Select Teacher</option>
                      {teachers.map((t) => (
                        <option key={t.id} value={t.id}>
                          {t.full_name}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td>
                    <input
                      type="time"
                      className="form-control"
                      value={row.timeFrom}
                      onChange={(e) =>
                        handleChange(index, "timeFrom", e.target.value)
                      }
                    />
                  </td>
                  <td>
                    <input
                      type="time"
                      className="form-control"
                      value={row.timeTo}
                      onChange={(e) =>
                        handleChange(index, "timeTo", e.target.value)
                      }
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      className="form-control"
                      value={row.roomNo}
                      onChange={(e) =>
                        handleChange(index, "roomNo", e.target.value)
                      }
                    />
                  </td>
                  <td>
                    <div className="btn-group-vertical d-flex justify-content-center">
                      <button
                        className="btn btn-sm btn-outline-secondary mb-1"
                        onClick={() => moveRow(index, -1)}
                        disabled={index === 0}
                        title="Move Up"
                      >
                        <i className="fas fa-arrow-up"></i>
                      </button>
                      <button
                        className="btn btn-sm btn-outline-secondary mb-1"
                        onClick={() => moveRow(index, 1)}
                        disabled={index === rows.length - 1}
                        title="Move Down"
                      >
                        <i className="fas fa-arrow-down"></i>
                      </button>
                      {row.id !== "" ? (
                        <button
                          className="btn btn-sm btn-outline-danger"
                          onClick={() =>
                            deleteTimeTableRowAlready(row.id, index)
                          }
                          title="Delete"
                        >
                          Delete
                        </button>
                      ) : (
                        <button
                          className="btn btn-sm btn-outline-danger"
                          onClick={() => deleteRow(index)}
                          title="Delete"
                        >
                          Delete
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="d-flex justify-content-between mt-4">
            <button className="btn btn-warning" onClick={addRow}>
              <i className="fas fa-plus me-1"></i> Add Row
            </button>
            <button className="btn btn-primary" onClick={handleSave}>
              <i className="fas fa-save me-1"></i> Save
            </button>
          </div>
        </div>



        { showData && (
                    <div
                        style={{
                            border: '1px solid #ddd',
                            padding: '10px',
                            position: 'fixed',
                            left: '50%',
                            top: '50%',
                            transform: 'translate(-50%, -50%)',
                            zIndex: '100',
                            backdropFilter: 'blur(10px)',
                            minWidth: '350px',
                            maxHeight: '80vh',
                            overflowY: 'auto',
                            backgroundColor: 'white',
                            borderRadius: '10px',
                            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            width: '1500px'
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
                                position: 'absolute',
                                top: '16px',
                                right: '16px',
                                background: 'transparent',
                                border: 'none',
                                fontSize: '20px',
                                cursor: 'pointer',
                                zIndex: '200', // Ensures it stays on top of other elements
                            }}
                        >
                            &times;
                        </button>

                       
                        <div
                            style={{
                                width: '100%',
                                backgroundColor: '#007bff',
                                padding: '5px',
                                borderBottom: '1px solid #ddd',
                                position: 'sticky',
                                top: '0',
                                zIndex: '150',
                                textAlign: 'center',
                                fontSize: '18px',
                                fontWeight: 'bold',
                                color: '#ffc107'
                            }}
                        >
                            Time Table 
                        </div>

                        {/* Scrollable Content */}
                      <div style={{ width: '100%', padding: '20px', overflowY: 'auto' }}>
                            
                      <div className="timetable-container">
                            {days.map((day) => (
                              <div className="day-column" key={day}>
                                <h5>{day}</h5>
                                {groupedData[day].length > 0 ? (
                                  groupedData[day].map((item, index) => (
                                    <div key={index} className="shift-box">
                                      <h5 style={{"textAlign":"left"}}>Shift: {item.shift}</h5>
                                      <h5 style={{"textAlign":"left"}}>Period#: {item.period}</h5>
                                      <h5 style={{"textAlign":"left"}}>Teacher: {item.full_name}</h5>
                                      <p><strong>Class:</strong> {item.class}</p>
                                      <p><strong>Subject:</strong> {item.subjects}</p>
                                      <p><strong>Time:</strong> {item.time_from} - {item.time_to}</p>
                                      <p><strong>Room Number:</strong> {item.room_no}</p>
                                     
                                    </div>
                                  ))
                                ) : (
                                  <div className="shift-box">
                                    <p>Not Scheduled</p>
                                  </div>
                                )}
                              </div>
                            ))}
                        </div>
                      </div>

                    </div>
                )
            }

        

      </div>
              
      


    </div>

    
  );
}

export default CreateTimeTable;
