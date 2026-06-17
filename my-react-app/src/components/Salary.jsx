



import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const Salary = () => {
    const [employees, setEmployees] = useState([]);
    const [attendanceData, setAttendanceData] = useState([]);
    const [selectedDate, setSelectedDate] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchEmployees = () => {
            axios.get(process.env.REACT_APP_API_BASE_URL+"/employee-list-for-attendance")
                .then(res => {
                    setEmployees(res.data.results);
                    // Initialize attendance data
                    const initialAttendanceData = res.data.results.map(employee => ({
                        employee_id: employee.id,
                        status: 'present', // default value
                        remarks: ''
                    }));
                    setAttendanceData(initialAttendanceData);
                })
                .catch(err => console.log(err));
        };

        fetchEmployees();
    }, []);

    const fetchAttendanceForDate = (date) => {
        axios.get(process.env.REACT_APP_API_BASE_URL+`/attendance/${date}`)
            .then(res => {
                const existingAttendanceData = res.data.results;

                // Create a map of existing attendance data by employee_id
                const existingAttendanceMap = new Map(
                    existingAttendanceData.map(item => [item.employee_id, item])
                );

                // Create updated attendance data with default values for new employees
                const updatedAttendanceData = employees.map(employee => {
                    if (existingAttendanceMap.has(employee.id)) {
                        return {
                            employee_id: employee.id,
                            status: existingAttendanceMap.get(employee.id).status,
                            remarks: existingAttendanceMap.get(employee.id).remarks
                        };
                    } else {
                        return {
                            employee_id: employee.id,
                            status: 'present', // default value
                            remarks: ''
                        };
                    }
                });

                setAttendanceData(updatedAttendanceData);
            })
            .catch(err => console.log(err));
    };

    const handleStatusChange = (employee_id, status) => {
        setAttendanceData(prevData =>
            prevData.map(data =>
                data.employee_id === employee_id ? { ...data, status } : data
            )
        );
    };

    const handleRemarksChange = (employee_id, remarks) => {
        setAttendanceData(prevData =>
            prevData.map(data =>
                data.employee_id === employee_id ? { ...data, remarks } : data
            )
        );
    };

    const handleDateChange = (e) => {
        const date = e.target.value;
        setSelectedDate(date);
        fetchAttendanceForDate(date);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!selectedDate) {
            setError('Please select a date for attendance.');
            return;
        }

        setError('');

        try {
            const response = await axios.post(process.env.REACT_APP_API_BASE_URL+'/submit-attendance', {
                date: selectedDate,
                attendanceData
            });
            alert(response.data.message);
        } catch (error) {
            console.error('There was an error!', error);
        }
    };


    const formatDate = (date) => {
        const d = new Date(date);
        const month = (d.getMonth() + 1).toString().padStart(2, '0');
        const day = d.getDate().toString().padStart(2, '0');
        const year = d.getFullYear();

        return `${day}-${month}-${year}`;
    };



    // const handleButtonClick = () => {
    //     if (!selectedDate) {
    //       setError('Please select a date before proceeding.');
    //     }
    //   };


    return (
        <div className='p-2'>
            <h6 className='text-warning bg-primary p-2 card-header border'><i className="fas fa-dollar-sign"></i> Salary</h6>
            <form onSubmit={handleSubmit}>
                <div className='row p-1 d-flex justify-content-center'>
                    <div className="col-3">
                        <input
                            type="month"
                            id="attendance-date"
                            value={selectedDate}
                            onChange={handleDateChange}
                            className='form-control'
                        />
                    </div>
                </div>
                {error && <p style={{ color: 'red' }}>{error}</p>}
                <div  >
                    <table className='table' style={{ border: '1px solid #dee2e6' }}>
                        <thead>
                            <tr>
                                <th>Employee Name</th>
                                <th>DOB</th>
                                <th>Phone#</th>
                                <th>Employee&nbsp;Status</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {employees.map(employee => (
                                <tr key={employee.id}>
                                    <td>{employee.employee_name}</td>
                                    <td>
                                        {formatDate(employee.dob)}
                                    </td>
                                    <td>
                                        {employee.phone_no}
                                    </td>
                                    <td>
                                        {employee.employment_status}
                                    </td>
                                    <td>

                                        {/* <button className='btn btn-sm btn-warning'>  <Link to={`/create-salary/${selectedDate}`}   className='text-dark' style={{ textDecoration: 'none' }} >Create Salary</Link> </button>
               */}

                                        <button
                                            className="btn btn-sm btn-warning"
                                            // onClick={handleButtonClick}
                                            disabled={!selectedDate} // Disable button if no date is selected
                                        >
                                            {selectedDate ? (
                                                <Link to={`/create-salary/${selectedDate}/${employee.id}`}  style={{ textDecoration: 'none' }}>
                                                    Create Salary
                                                </Link>
                                            ) : (
                                                'Create Salary'
                                            )}
                                        </button>
                                       


                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </form>
        </div>
    );
};

export default Salary;

