import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import Select from 'react-select';
import { useNavigate } from 'react-router-dom';
import AcademicSessionContext from './AcademicSessionContext';
import { useAuth } from './AuthContext';
import ReactPaginate from 'react-paginate';
import { toast } from 'react-toastify';

const PromoteStudent = () => {
    const initialFormData = {
        class_id: '',
        section_id: '',
        promoted_class_id: '',
        promoted_section_id: '',
        promoted_session_id: '',
        status: '',
        search: ''
    };

    const [editFormData, setEditFormData] = useState(initialFormData);
    const [currentPage, setCurrentPage] = useState(0);
    const [totalItem, setTotalItemGet] = useState(10); // Default to 10 items per page
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false); // Set to false initially
    const { user } = useAuth();
    const { academicSession } = useContext(AcademicSessionContext);
    const [getClasses, setClasses] = useState([]);
    const [getSessions, setSessions] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedIds, setSelectedIds] = useState([]); // State to track selected IDs
    const [allChecked, setAllChecked] = useState(false); // State to track if all are checked

    const [selectedSession, setSelectedSession] = useState({
        value: '',
        label: 'Promoted Session'
    });

    const navigate = useNavigate();

    useEffect(() => {
        const fetchClasses = (campus_id) => {
            axios.get(process.env.REACT_APP_API_BASE_URL+`/get-classes/${campus_id}`)
                .then(res => setClasses(res.data.results))
                .catch(err => console.log(err));
        };

        if (user && user.user.campus_id) {
            fetchClasses(user.user.campus_id);
        }
    }, [user]);



    useEffect(() => {
        const fetchSession = () => {
            axios.get(process.env.REACT_APP_API_BASE_URL+'/get-sessions')
                .then(res => {
                    const sortedSessions = res.data.results.sort((a, b) => a.session_name.localeCompare(b.session_name));
                    setSessions(sortedSessions);
                })
                .catch(err => console.log(err));
        };
        fetchSession();
    }, []);



    // useEffect(() => {
    // //   console.log(editFormData.class_id, "promoted");
    // }, [editFormData.class_id]);



    const fetchData = () => {
        setLoading(true);
        axios.get(process.env.REACT_APP_API_BASE_URL+"/student-for-promotion", {
            params: {
                class_id: editFormData.class_id,
                section_id: editFormData.section_id,

                session_id: academicSession,
                campus_id: user.user.campus_id
            }
        })
            .then(res => {
                setData(res.data);
                setFilteredData(res.data);  // Set initial filtered data

                // Initialize selected IDs based on a condition (e.g., all initially selected)
                const initialSelectedIds = res.data.map(admission => admission.id);
                setSelectedIds(initialSelectedIds); // Mark all as selected

                setLoading(false); // Set loading to false after data is fetched
            })
            .catch(err => {
                console.log(err);
                setLoading(false); // Ensure loading is false if an error occurs
            });
    };

    const handleClassChange = (selectedOption) => {
        const [class_id, section_id] = selectedOption ? selectedOption.value.split(",") : ["", ""];
        setEditFormData({ ...editFormData, class_id, section_id });
    };


    const handleClassChangePromotion = (selectedOption) => {
        const [promoted_class_id, promoted_section_id] = selectedOption ? selectedOption.value.split(",") : ["", ""];
        setEditFormData({ ...editFormData, promoted_class_id, promoted_section_id });
    };




    const classOptions = [
        { value: "", label: "Select Class" },
        ...getClasses.map(class_get => ({
            value: `${class_get.id},${class_get.section_id}`,
            label: `${class_get.class} (${class_get.section_name})`
        }))
    ];


    const promotedClassOption = [
        { value: "", label: "Promoted To Class" },
        ...getClasses.map(class_get => ({
            value: `${class_get.id},${class_get.section_id}`,
            label: `${class_get.class} (${class_get.section_name})`
        }))
    ];



    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
        const searchResult = data.filter(admission =>
            admission.full_name.toLowerCase().includes(e.target.value.toLowerCase()) ||
            admission.register_no.toLowerCase().includes(e.target.value.toLowerCase())
        );
        setFilteredData(searchResult);
        setCurrentPage(0); // Reset to first page after search
    };

    const handlePageChange = ({ selected }) => {
        setCurrentPage(selected);
    };

    const paginatedData = filteredData.slice(currentPage * totalItem, (currentPage + 1) * totalItem);

    const handleCheckboxToggle = (id) => {
        setSelectedIds(prevSelectedIds => {
            if (prevSelectedIds.includes(id)) {
                return prevSelectedIds.filter(selectedId => selectedId !== id); // Remove if already selected
            } else {
                return [...prevSelectedIds, id]; // Add if not selected
            }
        });
    };

    const isSelected = (id) => selectedIds.includes(id);

    const handleToggleAll = () => {
        const allCurrentlyChecked = selectedIds.length === filteredData.length; // Check if all are currently selected
        if (allCurrentlyChecked) {
            setSelectedIds([]); // Uncheck all
            setAllChecked(false);
        } else {
            const allIds = filteredData.map(admission => admission.id);
            setSelectedIds(allIds); // Check all
            setAllChecked(true);
        }
    };

    const handleSubmit = () => {

        var confirm_promotion = window.confirm("Are You Sure! Promotion of students");

        if (confirm_promotion) {
            // Example function to handle submission of selected IDs
            // console.log("Selected IDs:", selectedIds);
            console.log(selectedIds, editFormData);
            // You can send the selectedIds to the server here
            axios.post(process.env.REACT_APP_API_BASE_URL+'/promote-students', {

                promoted_student_id: selectedIds,
                promoted_class_id: editFormData.promoted_class_id,
                promoted_section_id: editFormData.promoted_section_id,
                promoted_session_id: editFormData.promoted_session_id,

                session_id: academicSession,
                campus_id: user.user.campus_id,
                user_id: user.user.user_id

            })
                .then(response => {
                    // console.log('Submitted successfully', response.data);
                    toast.success('Promoted Successfully!');
                    setData([]);
                    setFilteredData([]);
                    setEditFormData({ ...editFormData, class_id: '', section_id: '', promoted_class_id: '', promoted_section_id: '' });

                })
                .catch(error => {
                    console.error('Error submitting IDs:', error);
                    toast.success('Error In Promotion!');
                });
        }

    };


    const sessionOptions = [
        { value: "", label: "Promoted Session" },
        ...getSessions.map(session => ({
            value: session.id,  // Assuming session has an id
            label: session.session_name  // Assuming session has a name
        }))
    ];


    const handleSessionChange = (selectedOption) => {
        const promoted_session_id = selectedOption ? selectedOption.value : "";
        setSelectedSession(selectedOption);
        setEditFormData({ ...editFormData, promoted_session_id });

    };

    return (
        <div className="container-fluid promote-page">
            <div className="row">
                <div className="col-12 col-md-12 p-2">
                    <div className="card-header text-warning bg-primary p-2 promote-page__header">
                        <div className="d-flex justify-content-between align-items-center">
                            <div>
                                <i className="fas fa-list"></i> Promote Student
                            </div>
                        </div>
                    </div>
                    <div className="border p-2 promote-page__filter-card">
                        <div className="promote-page__filter-grid">
                            <div className="promote-page__field">
                                <label>From Class</label>
                                <Select
                                    options={classOptions}
                                    value={
                                        editFormData.class_id && editFormData.section_id
                                            ? {
                                                value: `${editFormData.class_id},${editFormData.section_id}`,
                                                label: classOptions.find(
                                                    (opt) => opt.value === `${editFormData.class_id},${editFormData.section_id}`
                                                )?.label,
                                            }
                                            : { value: "", label: "Select Class" }
                                    }
                                    onChange={handleClassChange}
                                    placeholder="Select Class"
                                    className="form-select"
                                />
                            </div>

                            <button className="btn btn-primary promote-page__btn promote-page__btn--fetch" onClick={fetchData}>
                                <i className="fas fa-download"></i> Fetch
                            </button>

                            <div className="promote-page__field">
                                <label>Promoted To Class</label>
                                <Select
                                    options={promotedClassOption}
                                    value={
                                        editFormData.promoted_class_id && editFormData.promoted_section_id
                                            ? {
                                                value: `${editFormData.promoted_class_id},${editFormData.promoted_section_id}`,
                                                label: promotedClassOption.find(
                                                    (opt) => opt.value === `${editFormData.promoted_class_id},${editFormData.promoted_section_id}`
                                                )?.label,
                                            }
                                            : { value: "", label: "Promoted To Class" }
                                    }
                                    onChange={handleClassChangePromotion}
                                    placeholder="Select Class"
                                    className="form-select"
                                />
                            </div>

                            <div className="promote-page__field">
                                <label>Promoted Session</label>
                                <Select
                                    options={sessionOptions}
                                    value={selectedSession}
                                    onChange={handleSessionChange}
                                    placeholder="Promoted Session"
                                    classNamePrefix="react-select"
                                    isSearchable={true}
                                />
                            </div>



                            <button className="btn btn-warning promote-page__btn promote-page__btn--promote" onClick={handleSubmit}>
                                <i className="fas fa-arrow-up"></i> Promote
                            </button>
                        </div>
                    </div>

                    <div className='border p-2 promote-page__list-card'>
                        <div className='d-flex flex-wrap align-items-center justify-content-between promote-page__list-top'>
                            <div>
                                <button className="btn btn-warning" onClick={handleToggleAll} title={allChecked ? 'Uncheck all' : 'Check all'}>
                                    {allChecked ? <i className="far fa-square"></i> : <i className="fas fa-check-square"></i>}
                                </button>
                            </div>
                            <div className='promote-page__search'>
                                <input
                                    type="text"
                                    placeholder="Search by name or register no…"
                                    value={searchQuery}
                                    onChange={handleSearchChange}
                                    className="form-control"
                                />
                            </div>
                        </div>


                        {/* Button to toggle check/uncheck all */}
                        <div className="mb-3">
                            <div className="alert alert-warning mt-2" role="alert">
                                <strong>Note:</strong> Please! select the promoted class and session carefully before submitting. Otherwise, your class will not be promoted properly.
                            </div>
                        </div>

                        <div className="table-responsive promote-page__table-wrap">
                        <table className='table promote-page__table'>
                            <thead>
                                <tr>
                                    <th>Select</th>
                                    <th>Register#</th>
                                    <th>Old Register#</th>
                                    <th>Name</th>
                                    <th>Class</th>
                                    <th>Section</th>
                                    <th>Category</th>
                                    <th>Father</th>
                                    <th>CNIC</th>
                                    <th>Mobile#</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {loading ? (
                                    <tr>
                                        <td colSpan="11">Loading...</td>
                                    </tr>
                                ) : (
                                    paginatedData.map((admission, index) => (
                                        <tr key={index}>
                                            <td>
                                                <input
                                                    type="checkbox"
                                                    checked={isSelected(admission.id)} // Check if the ID is selected
                                                    onChange={() => handleCheckboxToggle(admission.id)} // Toggle selection
                                                />
                                            </td>
                                            <td>{admission.register_no}</td>
                                            <td>{admission.old_register_no}</td>
                                            <td>{admission.full_name}</td>
                                            <td>{admission.class}</td>
                                            <td>{admission.section_name}</td>
                                            <td>{admission.category}</td>
                                            <td>{admission.father_name}</td>
                                            <td>{admission.father_cnic}</td>
                                            <td>{admission.mobile_no}</td>
                                            <td>{admission.status}</td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                        </div>
                        <ReactPaginate
                            previousLabel={'Previous'}
                            nextLabel={'Next'}
                            breakLabel={'...'}
                            pageCount={Math.ceil(filteredData.length / totalItem)}
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
        </div>
    );
};

export default PromoteStudent;
