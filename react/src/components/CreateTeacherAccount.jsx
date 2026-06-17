import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { useAuth } from './AuthContext';
import AcademicSessionContext from './AcademicSessionContext';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Select from 'react-select';
import { components } from "react-select";

function CreateTeacherAccount() {
    // Context hooks
    const { user } = useAuth();
    const { academicSession } = useContext(AcademicSessionContext);

    // State for teachers data
    const [teachers, setTeachers] = useState([]);
    const [loading, setLoading] = useState(true);

    // Form state
    const initialState = {
        teacher_ids: [],
        teacher_names: '',
        session_id: academicSession,
        campus_id: user?.user?.campus_id || '',
        user_id: user?.user?.user_id || '',
        hidden_id: ''
    };

    const [formData, setFormData] = useState(initialState);

    // Custom components for multi-select
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
        MultiValue: () => null,
    };

    // Fetch teachers data
    useEffect(() => {
        const fetchTeachers = async () => {
            try {
                setLoading(true);
                const response = await axios.get(
                    `${process.env.REACT_APP_API_BASE_URL}/get-teachers/${user?.user?.campus_id}`
                );
                setTeachers(response.data || []);
            } catch (error) {
                console.error('Error fetching teachers:', error);
                toast.error('Failed to load teachers data');
                setTeachers([]);
            } finally {
                setLoading(false);
            }
        };

        if (user?.user?.campus_id) {
            fetchTeachers();
        }
    }, [user]);

    // Prepare options for select dropdown with null check
    const teacherOptions = (teachers || []).map((teacher) => ({
        value: teacher.id,
        label: `${teacher.full_name} (${teacher.employee_post})`,
    }));

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!formData.teacher_ids.length) {
            toast.error('Please select at least one teacher');
            return;
        }

        try {
            const response = await axios.post(
                `${process.env.REACT_APP_API_BASE_URL}/insert-teacher-account`,
                formData
            );
            toast.success('Teacher accounts created successfully!');
            setFormData(initialState);
        } catch (error) {
            const errorMsg = error.response?.data?.error || 'An error occurred';
            toast.error(errorMsg);
        }
    };

    // Toggle select all teachers
    const toggleSelectAll = () => {
        if (formData.teacher_ids.length === teachers.length) {
            setFormData({
                ...formData,
                teacher_ids: [],
                teacher_names: '',
            });
        } else {
            const allIds = teachers.map(teacher => teacher.id);
            const allNames = teachers.map(teacher => 
                `${teacher.full_name} (${teacher.employee_post})`
            ).join(', ');
            
            setFormData({
                ...formData,
                teacher_ids: allIds,
                teacher_names: allNames,
            });
        }
    };

    return (
        <div className="d-flex">
            <div className='col-md-6 p-2'>
                <h5 className='text-warning bg-primary p-2 card-header border'>
                    <i className="fas fa-sign-in-alt"></i> Create Teacher Accounts
                </h5>
                
                <form className='border p-3' onSubmit={handleSubmit}>
                    <div className="d-flex justify-content-end">
                        <button
                            type="button"
                            className={`btn mb-2 px-3 py-2 shadow-sm text-white fw-bold border-0 ${
                                formData.teacher_ids.length === teachers.length
                                    ? 'bg-primary'
                                    : 'bg-gradient bg-success'
                            }`}
                            onClick={toggleSelectAll}
                            disabled={loading || teachers.length === 0}
                        >
                            <i
                                className={`fas ${
                                    formData.teacher_ids.length === teachers.length 
                                        ? 'fa-times-circle' 
                                        : 'fa-check-circle'
                                } me-2`}
                            ></i>
                            {formData.teacher_ids.length === teachers.length
                                ? ' Unselect All Teachers'
                                : ' Select All Teachers'}
                        </button>
                    </div>

                    <div className="form-group row">
                        <label className="col-sm-2 col-form-label">
                            Teachers
                        </label>
                        <div className="col-sm-10">
                            {loading ? (
                                <div className="text-center py-3">
                                        Loading...
                                </div>
                            ) : (
                                <Select
                                    options={teacherOptions}
                                    isMulti
                                    closeMenuOnSelect={false}
                                    hideSelectedOptions={false}
                                    components={customComponents}
                                    placeholder={teachers.length ? "Select teachers..." : "No teachers available"}
                                    value={teacherOptions.filter(option =>
                                        formData.teacher_ids.includes(option.value)
                                    )}
                                    onChange={(selectedOptions) => {
                                        const selected = selectedOptions || [];
                                        const selectedIds = selected.map(opt => opt.value);
                                        const selectedNames = selected
                                            .map(opt => opt.label)
                                            .join(', ');

                                        setFormData({
                                            ...formData,
                                            teacher_ids: selectedIds,
                                            teacher_names: selectedNames,
                                        });
                                    }}
                                    isDisabled={loading || teachers.length === 0}
                                />
                            )}
                        </div>
                    </div>

                    <div className="form-group row">
                        <div className="col-sm-10 offset-sm-2 d-flex justify-content-end">
                            <button 
                                type="submit" 
                                className='btn btn-sm btn-primary'
                                disabled={loading || formData.teacher_ids.length === 0}
                            >
                                {loading ? 'Processing...' : 'Create Accounts'}
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default CreateTeacherAccount;