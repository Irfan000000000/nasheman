

import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { useAuth } from './AuthContext';
import AcademicSessionContext from './AcademicSessionContext';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";


function IncrementsPayScaleWise() {
    const [data, setData] = useState([]);
    const [scaleData, setScaleData] = useState([]);
    const [checkedEmployees, setCheckedEmployees] = useState([]);
    const [employeeFields, setEmployeeFields] = useState({});
    const { user } = useAuth();
    const { academicSession } = useContext(AcademicSessionContext);
    const [allChecked, setAllChecked] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    const [incrementDate, setIncrementDate] = useState('');
    const [currentDate, setCurrentDate] = useState('');


    const [lastIncrementDate, getLastIncrementDate] = useState('');

    const [editFormData, setEditFormData] = useState({
        increment_type: '',
        pay_scale: null,
        increment_date: '',
        other_increment_amount: 0,
        session_id: academicSession,
        campus_id: user.user.campus_id,
        user_id: user.user.user_id,
        hidden_id: ''
    });

    const [validity, setValidity] = useState({
        increment_type: true,
        pay_scale: true,
        increment_date: true,
        other_increment_amount: true,
    });


    const resetForm = () => {
        setEditFormData({
            ...editFormData,
            increment_type: '',
            pay_scale: null,
            increment_date: '',
            other_increment_amount: 0,
        });
        setEmployeeFields({});
        setCheckedEmployees([]);
        setAllChecked(false);
        setSearchQuery('');
        setData([]);
        setScaleData([]);
    };



    const validateForm = () => {
        let isValid = true;

        if (!editFormData.increment_type.trim()) {
            setValidity((prevState) => ({ ...prevState, increment_type: false }));
            isValid = false;
        }

        if (!editFormData.increment_date) {
            setValidity((prevState) => ({ ...prevState, increment_date: false }));
            isValid = false;
        }

        if (editFormData.increment_type === 'adhoc' && editFormData.other_increment_amount < 0) {
            setValidity((prevState) => ({ ...prevState, other_increment_amount: false }));
            isValid = false;
        }

        return isValid;
    };

    const GenerateIncrement = () => {
        const getEmployees = (campus_id, increment_date) => {
            axios.get(process.env.REACT_APP_API_BASE_URL+`/get-school-employees-for-increment/${campus_id}/${editFormData.pay_scale}/${increment_date}`)
                .then(res => {
                    const employees = res.data.employees;
                    const scale_data = res.data.payScaleSalaries;
                    setData(employees);
                    setScaleData(scale_data);

                    getLastIncrementDate(res.data.lastIncrementDate);

                    const updatedEmployees = employees.map(employee => {
                        const matchedScale = scale_data.find(scale => scale.pay_scale_id === employee.pay_scale_id);

                        return {
                            ...employee,
                            new_annual_increment: editFormData.increment_type === 'annual_increment'
                                ? (matchedScale ? matchedScale.annual_increment : 0)
                                : 0
                        };
                    });

                    const autoCheckedEmployees = updatedEmployees
                        .filter(employee => {
                            return (
                                (editFormData.increment_type === 'annual_increment' && employee.annual_increment_status === 'annual_increment' && employee.update_id !== null) ||
                                (editFormData.increment_type === 'adhoc' && employee.adhoc_increment_status === 'adhoc_increment' && employee.update_id !== null)
                            );
                        })
                        .map(employee => employee.id);

                    setCheckedEmployees(autoCheckedEmployees);
                    setData(updatedEmployees);
                })
                .catch(err => console.log(err));
        };

        if (validateForm()) {
            getEmployees(user.user.campus_id, editFormData.increment_date);
        } else {
            console.error("Form validation failed. Please check the inputs.");
        }
    };

    useEffect(() => {
        if (editFormData.increment_type !== '') {
            const confirmed = window.confirm("Are you sure you want to change the increment type to  (" + editFormData.increment_type + ") with increment date (" + editFormData.increment_date + ")");
            if (confirmed) {
                if (editFormData.increment_date !== "" && data !== '') {
                    GenerateIncrement();
                }
            }
        }
    }, [editFormData.increment_type]);

    const handleCheckboxChange = (employeeId) => {
        setCheckedEmployees((prevChecked) =>
            prevChecked.includes(employeeId)
                ? prevChecked.filter((id) => id !== employeeId)
                : [...prevChecked, employeeId]
        );
    };

    const toggleCheckAll = () => {
        setAllChecked((prevAllChecked) => {
            if (prevAllChecked) {
                setCheckedEmployees([]);
            } else {
                const allEmployeeIds = data.map((employee) => employee.id);
                setCheckedEmployees(allEmployeeIds);
            }
            return !prevAllChecked;
        });
    };

    const handleFieldChange = (employeeId, field, value) => {
        setEmployeeFields((prevFields) => ({
            ...prevFields,
            [employeeId]: { ...prevFields[employeeId], [field]: value }
        }));
    };

    const filteredData = data.filter((employee) => {
        return (
            employee.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            employee.employee_post.toLowerCase().includes(searchQuery.toLowerCase()) ||
            employee.pay_scale.toString().toLowerCase().includes(searchQuery.toLowerCase())
        );
    });


    const handleChange = (value, name = null) => {
        if (name) {
            // Fix the date by setting it to noon to avoid timezone offset
            const fixedDate = new Date(value);
            fixedDate.setHours(12, 0, 0, 0); // Set time to noon (12:00 PM)
            
            setEditFormData({ ...editFormData, [name]: fixedDate.toISOString().split('T')[0] });
        } else {
            const { name, value: fieldValue } = value.target;
            setEditFormData({ ...editFormData, [name]: fieldValue });
            
            if (name === 'other_increment_amount' && editFormData.increment_type === 'adhoc') {
                const percentage = parseFloat(fieldValue) || 0;
    
                setEmployeeFields((prevFields) => {
                    const updatedFields = {};
    
                    data.forEach((employee) => {
                        const incrementAmount = (employee.basic_salary * percentage) / 100;
                        updatedFields[employee.id] = {
                            ...prevFields[employee.id],
                            increment: incrementAmount
                        };
                    });
    
                    return updatedFields;
                });
            }
        }
    };
    




    useEffect(() => {
        axios.get(process.env.REACT_APP_API_BASE_URL+'/get-last-row-increment-date')
            .then(res => {
                if (res.data && res.data.results && res.data.results.length > 0) {
                    const incrementDateValue = new Date(res.data.results[0].increment_date); // Convert to Date object
                    console.log(incrementDateValue);
                    setIncrementDate(incrementDateValue);
    
                    const today = new Date(); // Get current date as a Date object
                    console.log(today);
                    setCurrentDate(today);
                } else {
                    const today = new Date(); // Get current date as a Date object
                    console.log(today);
                    setCurrentDate(today);
                }
            })
            .catch(err => console.error('Error fetching increment date:', err));
    }, []);
    




    const handleFormSubmit = (event) => {
        event.preventDefault();

          const confirmed = window.confirm("Are You Sure! Created "+ editFormData.increment_type);

          if(confirmed){
            if (validateForm()) {
                const selectedEmployees = data
                    .filter((employee) => checkedEmployees.includes(employee.id))
                    .map((employee) => ({
                        employee_id: employee.employee_id,
                        service_book_id: employee.service_book_id,
                        full_name: employee.full_name,
                        employee_post_id: employee.employee_post_id,
                        employee_role_id: employee.employee_role_id,
                        pay_scale_id: employee.pay_scale_id,
    
                        pessi: employee.pessi,
                        eobi: employee.eobi,
                        cpf:employee.cpf,

                        medical_allownce: employee.medical_allownce,
                        principal_allownce: employee.principal_allownce,
                        special_allownce: employee.special_allownce,

                        previous_total_adhoc_new: employee.total_adhoc,
                        previous_total_increments_new: employee.previous_total_increments + employee.current_increment,
    
                        previous_total_increments: employee.previous_total_increments,
                        current_increment: employee.current_increment,
                        total_increment: employee.total_increment,
                        second_shift_honorarium: employee.second_shift_honorarium,
    
                        old_adhoc: employee.old_adhoc,
                        current_adhoc: employee.current_adhoc,
                        total_adhoc: employee.total_adhoc,
    
                        new_increment: parseFloat(employeeFields[employee.id]?.increment || employee.new_annual_increment || 0),
    
                        house_rent: employee.house_rent,
                        basic_salary: employee.basic_salary,
                        additional_increment: employee.additional_increment,
                        job_type: employee.job_type,
                        other_increment_amount: editFormData.other_increment_amount,
    
                        new_net_salary: parseFloat(employee.total_net_salary || 0) + parseFloat(employeeFields[employee.id]?.increment || employee.new_annual_increment || 0),
    
                        increment_date: editFormData.increment_date,
                        increment_type: editFormData.increment_type,
                        remarks: '',
                        salary_update_id: employee.salary_id,
                        campus_id: user.user.campus_id,
                        user_id: user.user.user_id
    
                    }));
    
                axios.post(process.env.REACT_APP_API_BASE_URL+'/insert-employee-increment-record', {
                    employees: selectedEmployees,
                })
                    .then((response) => {
                        toast.success('Increment Applied successfully!');
                        resetForm();  // Reset the form after successful submission
                    })
                    .catch((error) => {
                        console.error('Error submitting data:', error);
                    });
            }

          }
            
        
    };

    // Calculate the grand total
    const grandTotal = filteredData.reduce((total, employee) => {
        const increment = parseFloat(employeeFields[employee.id]?.increment || employee.new_annual_increment || 0);
        const netSalary = parseFloat(employee.total_net_salary || 0);
        return total + (netSalary + increment);
    }, 0);



    // const deleteData = (id_get) => {

    //     const confirmDelete = window.confirm('Are you sure! Deleted Increment of Service Book - dated : ('+ editFormData.increment_date +')');
    //     if (confirmDelete) {
    //       axios
    //         .delete(process.env.REACT_APP_API_BASE_URL+`/delete-service-book-increment/${id_get}`)
    //         .then(response => {
    //           console.log('Deleted successfully:', response.data);
    //         })
    //         .catch(error => {
    //           console.error('Error deleting item:', error);
    //         });
    //     }
    //   };



    const deleteData = (id_get) => {
        const confirmDelete = window.confirm('Are you sure! Deleted Increment of Service Book - dated : (' + editFormData.increment_date + ')');
        if (confirmDelete) {
            axios
                .delete(process.env.REACT_APP_API_BASE_URL+`/delete-service-book-increment/${id_get}`)
                .then(response => {
                    console.log('Deleted successfully:', response.data);
    
                    // Update the local state to remove the deleted employee
                    setData(prevData => prevData.filter(employee => employee.update_id !== id_get));
                    toast.success('Increment deleted successfully!');
                })
                .catch(error => {
                    console.error('Error deleting item:', error);
                });
        }
    };

    
    


    return (
        <>
            <div className='col-md-12 p-2'>
                <h5 className='text-warning bg-primary p-2 card-header border'>
                    <i className="fas fa-file-invoice"></i> Increment Salary
                </h5>

                <form className='border p-3'>
                    <div className="form-group row ml-2">
                        <label className="col-form-label">Date</label>
                        <div className="col-md-2">
                            <DatePicker
                                selected={editFormData.increment_date ? new Date(editFormData.increment_date) : null}
                                includeDates={[incrementDate, currentDate]} // Allow only incrementDate and currentDate
                                dateFormat="yyyy-MM-dd"  // Format the date
                                id="increment_date"
                                name="increment_date"
                                className="form-control"
                                placeholderText="Select Increment Date or Current Date"
                                onChange={(date) => handleChange(date, 'increment_date')} // Pass date and field name
                            />



                        </div>

                        <label htmlFor="increment_type" className="col-form-label ml-2">Increment Type</label>
                        <div className="col-md-2">
                            <select
                                className='form-control'
                                id="increment_type"
                                name="increment_type"
                                value={editFormData.increment_type}
                                onChange={handleChange}>
                                <option value="">Select Increment Type</option>
                                <option value="annual_increment">Annual Increment</option>
                                <option value="adhoc">Adhoc</option>
                            </select>


                        </div>


                        {editFormData.increment_type !== "annual_increment" && (
                            <>
                                <label className="col-form-label">Increment Amount (%)</label>
                                <div className="col-md-2">
                                    <input
                                        type="number"
                                        className='form-control'
                                        id="other_increment_amount"
                                        name="other_increment_amount"
                                        value={editFormData.other_increment_amount}
                                        onChange={handleChange} // Regular onChange event
                                        placeholder="Enter Increment %"
                                    />
                                </div>
                            </>
                        )}


                        {/* {editFormData.increment_type !== "annual_increment" && (
                            <>
                                <label className="col-form-label">Increment Amount (%)</label>
                                <div className="col-md-2">
                                    <input
                                        type="number"
                                        className='form-control'
                                        id="other_increment_amount"
                                        name="other_increment_amount"
                                        value={editFormData.other_increment_amount}
                                        onChange={(e) => handleChange(e)}
                                        placeholder="Enter Increment %"
                                    />
                                </div>
                            </>
                        )} */}


                        {/* <button
                            type="button"
                            className='btn btn-sm btn-warning ml-2'
                            onClick={GenerateIncrement}
                        >
                            <i className="fas fa-chart-line"></i> Generate
                        </button> */}


                    </div>
                </form>
            </div>

            {/* Search Input Field */}

            {/* Employee Table */}
            <div className='col-md-12 p-2'>


                <div className='d-flex justify-content-between'>


                    <div className='mb-2'>
                        <button className="btn btn-sm btn-warning" onClick={toggleCheckAll}>
                            {allChecked ? <i className="far fa-check-square"></i> : <i className="far fa-square"></i>} {/* Display checked/unchecked based on allChecked state */}
                        </button>
                    </div>


                    <div className='form-group col-md-3'>
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Search by Name, Designation, or Scale"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>

                </div>

                <div className='border p-2'>
                    <table className='table' id='salary-table'>
                        <thead>
                            <tr>
                                <th>Check</th>
                                <th>Name</th>
                                <th>Desig.</th>
                                <th>Scale</th>
                                <th>Service</th>
                                <th>Basic.Salary</th>
                                <th>Net.Salary</th>
                                <th>Increment</th>
                                <th>Total</th>
                                <th>Remarks</th>
                                <th className='text-center'>Action</th>
                            </tr>
                        </thead>

                        <tbody>
                            {filteredData.map((employee) => (
                                <tr key={employee.id}>
                                    <td>
                                        <input
                                            type="checkbox"
                                            checked={checkedEmployees.includes(employee.id)}
                                            onChange={() => handleCheckboxChange(employee.id)}
                                        />
                                    </td>
                                    <td>{employee.full_name}</td>
                                    <td>{employee.employee_post}</td>
                                    <td>{employee.pay_scale + " (" + employee.job_type + ")"}</td>
                                    <td>{employee.years_of_service + " years " + employee.months_of_service + " months "}</td>
                                    <td>{employee.basic_salary}</td>
                                    <td>{employee.total_net_salary}</td>


                                    {
                                        employee.update_id !== null &&
                                            employee.adhoc_increment_status === "adhoc_increment" &&
                                            editFormData.increment_type === "adhoc" ? (
                                            <td>{employee.current_adhoc}</td>
                                        ) :
                                            employee.update_id !== null &&
                                                employee.annual_increment_status === "annual_increment" &&
                                                editFormData.increment_type === "annual_increment" ? (
                                                <td>{employee.current_increment}</td>
                                            )
                                                : (
                                                    <td>
                                                        <input
                                                            type="number"
                                                            className='form-control'
                                                            value={employeeFields[employee.id]?.increment || employee.new_annual_increment}
                                                            onChange={(e) => handleFieldChange(employee.id, 'increment', e.target.value)}
                                                        />
                                                    </td>
                                                )
                                    }

                                    <td>{parseFloat(employee.total_net_salary || 0) + parseFloat(employeeFields[employee.id]?.increment || employee.new_annual_increment || 0)}</td>
                                    <td>
                                        <input type="text" className='form-control' placeholder="Remarks" value={editFormData.increment_type} readOnly />
                                    </td>

                                    {
                                        employee.update_id !== null &&
                                            employee.adhoc_increment_status === "adhoc_increment" &&
                                            editFormData.increment_type === "adhoc" ? (
                                            <td className='text-center'>
                                                {
                                                    editFormData.increment_date === lastIncrementDate ? (
                                                        <button className="btn btn-danger btn-sm" onClick={() => deleteData(employee.update_id)}>
                                                            <i className="fas fa-trash-alt"></i>
                                                        </button>
                                                    ) : (
                                                        "-"
                                                    )
                                                }
                                            </td>
                                        ) : employee.update_id !== null &&
                                            employee.annual_increment_status === "annual_increment" &&
                                            editFormData.increment_type === "annual_increment" ? (
                                            <td className='text-center'>
                                                {
                                                    editFormData.increment_date === lastIncrementDate ? (
                                                        <button className="btn btn-danger btn-sm" onClick={() => deleteData(employee.update_id)}>
                                                            <i className="fas fa-trash-alt"></i>
                                                        </button>
                                                    ) : (
                                                        "-"
                                                    )
                                                }
                                            </td>
                                        ) : (
                                            <td className='text-center'>
                                                -
                                            </td>
                                        )
                                    }

                                </tr>
                            ))}

                            <tr>
                                <td colSpan="9" style={{ textAlign: 'right', fontWeight: 'bold' }}>Grand Total:</td>
                                <td colSpan="3" style={{ fontWeight: 'bold' }}>{grandTotal.toFixed(2)}</td>
                            </tr>

                            <tr>
                                <td style={{ textAlign: "right" }} colSpan="11">
                                    <input
                                        type="button"
                                        className='btn btn-sm btn-primary'
                                        value="Save"
                                        onClick={handleFormSubmit}
                                    />
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    );
}

export default IncrementsPayScaleWise;



