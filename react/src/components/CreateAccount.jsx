import React, { useEffect, useState, useContext } from 'react'
import axios from 'axios'
import ReactPaginate from 'react-paginate';
import { useAuth } from './AuthContext';
import AcademicSessionContext from './AcademicSessionContext';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { components } from "react-select";
import Select from 'react-select';


function CreateAccount() {

    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalCount, setTotalCount] = useState(0);
    const [totalPages, totalPagesGet] = useState("");
    const [getBanks, setBanks] = useState([]);
    const { user } = useAuth();
    const { academicSession } = useContext(AcademicSessionContext);
    const [getSections, setSections] = useState([]);
      const [getClasses, setClasses] = useState([]);


      const customComponents = {
        Option: (props) => {
          return (
            <components.Option {...props}>
              <input
                type="checkbox"
                checked={props.isSelected}
                onChange={() => {}}
                style={{ marginRight: 8 }}
              />
              {props.label}
            </components.Option>
          );
        },
        MultiValue: () => null, // hide selected tags (optional)
      };


    const initialState = {

        class_id:[],
        session_id: academicSession,
        campus_id: user.user.campus_id,
        user_id: user.user.user_id,
        hidden_id: ''
    }

    const [validity, setValidity] = useState({
        class_id: true,
    });


    const [editFormData, setEditFormData] = useState(initialState);


    useEffect(() => {
        if (academicSession) {
            setEditFormData(prevFormData => ({
                ...prevFormData,
                session_id: parseInt(academicSession)
            }));
        }
    }, [academicSession]);



    useEffect(() => {
        const fetchSections = (campus_id) => {
            axios.get(process.env.REACT_APP_API_BASE_URL+`/get-sections/${campus_id}`)
                .then(res => {

                    setSections(res.data.results);
                })
                .catch(err => console.log(err));
        };

        // Ensure user.campus_id is defined before calling fetchClasses
        if (user && user.user.campus_id) {
            fetchSections(user.user.campus_id);
        }
    }, [user]); // Dependencies array to re-run the effect when user changes




    
      useEffect(() => {
        const getClasses = (campus_id) => {
          axios
            .get(process.env.REACT_APP_API_BASE_URL + `/get-classes/${campus_id}`)
            .then((res) => {
              setClasses(res.data.results);
    
              // console.log(res.data.results, "these are results");
            })
            .catch((err) => console.log(err));
        };
    
        if (user && user.user.campus_id) {
          getClasses(user.user.campus_id);
        }
      }, [user]);
    


    const classOptions = getClasses.map((classes) => ({
        value: classes.id,
        label: `${classes.class} (${classes.section_name})`,
      }));
    
    
      useEffect(() => {
        if (getClasses.length > 0) {
          const allIds = getClasses.map(classes => classes.id);
          const allNames = getClasses.map(classes => `${classes.class} (${classes.section_name})`).join(", ");
          
          setEditFormData(prevState => ({
            ...prevState,
            class_id: allIds,
            class_name: allNames
          }));
        }
      }, [getClasses]);




 






    const [report, getAllReports] = useState({
        from_date: '',
        to_date: '',
        report_type: ''
    });


    const [searchCategoryReport, getSearchCategoryReport] = useState({
        search: '',
    });




    function searchCategory() {
        fetchData();
    }


    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            getSearchCategoryReport(searchCategoryReport);
            fetchData();
        }
    };




    function getReport() {
        if (report.report_type == "pdf") {
            // pdfReport();
        } else if (report.report_type == "excel") {
            // excelReport();
        }
    }


    useEffect(() => {
        const fetchCategory = () => {
            axios.get(process.env.REACT_APP_API_BASE_URL+"/get-banks")
                .then(res => {
                    setBanks(res.data.results);
                })
                .catch(err => console.log(err));
        };

        fetchCategory();
    }, []); // Empty dependency array ensures this effect runs only once, on mount




    //const [itemsPerPage, setitemsPerPage] = useState(10); 

    const [totalItem, setTotalItemGet] = useState(10);

    // const itemsPerPage = 10;

    useEffect(() => {
        fetchData();
    }, [currentPage, totalItem, user]);





    const fetchData = () => {
        axios.get(process.env.REACT_APP_API_BASE_URL+"/sections-list", {
            params: {
                page: currentPage,
                limit: totalItem,
                search: searchCategoryReport.search,
                campus_id: user.user.campus_id
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

    const handlePageChange = ({ selected }) => {
        setCurrentPage(selected + 1);
    };

    const handleTotalItemChange = (event) => {

        const newValue = event.target.value;
        setTotalItemGet(newValue);

    }






    const handleSubmit = async (e) => {
        e.preventDefault();
        // if (validateForm()) {
            try {
                const response = await axios.post(process.env.REACT_APP_API_BASE_URL+'/insert-student-account', editFormData, {
                    headers: {
                        'Content-Type': 'application/json', // Set content type to JSON
                    },
                });

                console.log(response.data.students);
    
                    toast.success('Students Account Created Successfully!');

                setEditFormData(initialState); // Reset form data after successful submission
                // fetchData();
    
            } catch (error) {
                if (error.response && error.response.data && error.response.data.error) {
                    toast.error(error.response.data.error); // Show the error message from the server
                } else {
                    toast.error('An error occurred'); // Show a generic error message
                }
            }
        // }
    };
    




    const edit = (id_get) => {
        axios.get(process.env.REACT_APP_API_BASE_URL+`/get-section-data/${id_get}`)
            .then(response => {
              
                const { id, section_name } = response.data.results[0];
                console.log(section_name);
                setEditFormData({ ...editFormData, 
                    section_name: section_name || '',
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
          axios.put(process.env.REACT_APP_API_BASE_URL+`/soft-delete-section/${id_get}`)
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
      

    const totalClasses = getClasses.length;
    const selectedCount = editFormData.class_id.length;
    const allSelected = totalClasses > 0 && selectedCount === totalClasses;

    return (
        <div className="account-form">
            <div className="account-form__inner">

                <div className="account-form__hero">
                    <div className="account-form__hero-icon">
                        <i className="fas fa-user-shield"></i>
                    </div>
                    <div className="account-form__hero-text">
                        <h4>Create Student Accounts</h4>
                        <p>
                            Select one or more classes below to generate student login accounts in bulk.
                        </p>
                    </div>
                </div>

                <form className="account-form__card" onSubmit={handleSubmit}>

                    <div className="account-form__stats">
                        <div className="account-form__stats-pill">
                            <i className="fas fa-layer-group"></i>
                            <span><strong>{selectedCount}</strong> of <strong>{totalClasses}</strong> classes selected</span>
                        </div>

                        <button
                            type="button"
                            className={`account-form__btn-toggle ${allSelected ? 'is-active' : ''}`}
                            onClick={() => {
                                const allIds = getClasses.map((cls) => cls.id);
                                const allNames = getClasses
                                    .map((cls) => `${cls.class} (${cls.section_name})`)
                                    .join(', ');

                                if (allSelected) {
                                    setEditFormData({
                                        ...editFormData,
                                        class_id: [],
                                        class_name: '',
                                    });
                                } else {
                                    setEditFormData({
                                        ...editFormData,
                                        class_id: allIds,
                                        class_name: allNames,
                                    });
                                }

                                setValidity({ ...validity, class_id: true });
                            }}
                        >
                            <i className={`fas ${allSelected ? 'fa-times-circle' : 'fa-check-circle'}`}></i>
                            {allSelected ? ' Unselect All' : ' Select All'}
                        </button>
                    </div>

                    <div className="account-form__field">
                        <label htmlFor="class_ids" className="account-form__label">
                            Classes
                        </label>
                        <Select
                            inputId="class_ids"
                            name="class_ids"
                            options={classOptions}
                            isMulti
                            closeMenuOnSelect={false}
                            hideSelectedOptions={false}
                            components={customComponents}
                            placeholder="Choose classes…"
                            value={classOptions.filter((option) =>
                                editFormData.class_id.includes(option.value)
                            )}
                            onChange={(selectedOptions) => {
                                const filteredOptions = selectedOptions || [];
                                const selectedIds = filteredOptions.map((opt) => opt.value);
                                const selectedNames = filteredOptions
                                    .map((opt) => opt.label)
                                    .join(", ");

                                setEditFormData({
                                    ...editFormData,
                                    class_id: selectedIds,
                                    class_name: selectedNames,
                                });

                                setValidity({ ...validity, class_id: true });
                            }}
                            className={
                                validity.class_id
                                    ? "react-select-container"
                                    : "react-select-container invalid-input"
                            }
                            classNamePrefix="react-select"
                        />
                        <small className="account-form__hint">
                            Tip: every student in the chosen classes will receive a fresh login account.
                        </small>
                    </div>

                    <div className="account-form__actions">
                        <button
                            type="submit"
                            className="btn btn-primary account-form__submit"
                            onClick={handleSubmit}
                            disabled={selectedCount === 0}
                        >
                            <i className="fas fa-save"></i> Create Accounts
                        </button>
                    </div>

                </form>

                <div className="account-form__note">
                    <i className="fas fa-info-circle"></i>
                    Existing accounts will not be duplicated. Only students without an account will receive credentials.
                </div>

            </div>
        </div>
    )



}

export default CreateAccount