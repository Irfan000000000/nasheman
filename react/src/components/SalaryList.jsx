import React, { useEffect, useState, useContext } from 'react'
import axios from 'axios'
import { useAuth } from './AuthContext';
import AcademicSessionContext from './AcademicSessionContext';
import 'react-toastify/dist/ReactToastify.css';




function SalaryList() {


    const [data, setData] = useState([]);
    const [checkedEmployees, setCheckedEmployees] = useState([]);
    const [employeeFields, setEmployeeFields] = useState({});
    const { user } = useAuth();
    const { academicSession } = useContext(AcademicSessionContext);

    const [editFormData, setEditFormData] = useState({
        from_month: '',
        session_id: academicSession,
        campus_id: user.user.campus_id,
        user_id: user.user.user_id,
        hidden_id: ''
    });


    const getCurrentMonth = () => {
        const date = new Date();
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based, so add 1
        return `${year}-${month}`;
    };


    const getDaysInMonth = (year, month) => {
        return new Date(year, month, 0).getDate();
    };





    const GenerateSalary = () => {
        // If editFormData.from_month is not set, use the current month
        let selectedMonth = editFormData.from_month ? new Date(editFormData.from_month) : new Date();
        const daysInMonth = getDaysInMonth(selectedMonth.getFullYear(), selectedMonth.getMonth() + 1);

        const getEmployees = (from_month, campus_id) => {
            axios.get(process.env.REACT_APP_API_BASE_URL+`/get-school-employees/${from_month}/${campus_id}`)
                .then(res => {
                    const employees = res.data.results;
                    setData(employees);

                    // Set initial checked employees and default remaining amounts (net salary as default)
                    setCheckedEmployees(employees.map(employee => employee.id));
                    setEmployeeFields(employees.reduce((acc, employee) => {
                        acc[employee.id] = {
                            security_deduction: employee.total_security_deduct_from_salary < employee.total_security_deduction ? employee.security_deduction : 0,
                            dow: daysInMonth,
                            graduity: 0,
                            others_allownce: 0,
                            remaining: employee.total_security_deduct_from_salary < employee.total_security_deduction ? employee.total_net_salary - employee.security_deduction : employee.total_net_salary
                        };
                        return acc;
                    }, {}));
                })
                .catch(err => console.log(err));
        };

        if (user && user.user.campus_id && editFormData.from_month) {
            const selectedMonth = editFormData.from_month;
            getEmployees(selectedMonth, user.user.campus_id);
        }
    };




    const handleCheckboxChange = (employeeId) => {
        setCheckedEmployees(prevChecked => {
            if (prevChecked.includes(employeeId)) {
                return prevChecked.filter(id => id !== employeeId);
            } else {
                return [...prevChecked, employeeId];
            }
        });
    };



    const handleFieldChange = (employeeId, field, value) => {
        setEmployeeFields(prevFields => {
            const updatedFields = { ...prevFields };
            updatedFields[employeeId][field] = value;

            // Find the employee in the data array
            const employee = data.find(emp => emp.id === employeeId);
            const netSalary = employee?.total_net_salary || 0; // Start with the total net salary
            let remaining = netSalary;

            // Use the selected month from the edit form data for days in the month calculation
            const selectedMonth = new Date(editFormData.from_month);
            const daysInMonth = new Date(selectedMonth.getFullYear(), selectedMonth.getMonth() + 1, 0).getDate(); // Get days in month

            // Calculate remaining salary based on DOW (Days of Work)
            const dowValue = parseFloat(updatedFields[employeeId].dow) || 0; // Fallback to 0 if not a number
            remaining = (netSalary / daysInMonth) * dowValue; // Adjust by days of work

            // Apply deductions and additions (graduity and others allowance)
            const graduityValue = parseFloat(updatedFields[employeeId].graduity) || 0;
            const othersAllownceValue = parseFloat(updatedFields[employeeId].others_allownce) || 0;
            remaining += graduityValue + othersAllownceValue; // Add allowances

            // Subtract any security deductions if applicable
            if (employee.security_no_of_installment > 0 && (employee.total_security_deduct_from_salary < employee.total_security_deduction)) {
                remaining -= employee.security_deduction;
            }

            // Update remaining salary with two decimal accuracy
            updatedFields[employeeId].remaining = remaining.toFixed(2);

            return updatedFields;
        });
    };


    const handleFormSubmit = (event) => {

        event.preventDefault(); // Prevent the form from submitting and refreshing the page

        const selectedEmployees = data
            .filter(employee => checkedEmployees.includes(employee.id))
            .map(employee => ({
                employee_id: employee.employee_id,
                service_book_id: employee.service_book_id,
                full_name: employee.full_name,
                employee_post_id: employee.employee_post_id,
                employee_role_id: employee.employee_role_id,
                pay_scale_id: employee.pay_scale_id,

                previous_adhoc: employee.old_adhoc,
                current_adhoc: employee.current_adhoc,

                previous_increments: employee.previous_total_increments,
                current_increment: employee.current_increment,

                house_rent: employee.house_rent,

                net_salary: employee.total_net_salary,

                for_the_month:editFormData.from_month,

                total_security_deduct_from_salary: employeeFields[employee.id]?.security_deduction > 0 ? employee.total_security_deduct_from_salary : 0,
                security_deduction: employeeFields[employee.id]?.security_deduction || 0,  // DOW value
                dow: employeeFields[employee.id]?.dow || 0,  // DOW value
                graduity: employeeFields[employee.id]?.graduity || 0,  // Graduity value
                others_allownce: employeeFields[employee.id]?.others_allownce || 0,
                remaining: employeeFields[employee.id]?.remaining || employee.total_net_salary,  // Remaining salary
                remarks: '' // Placeholder for remarks (you can update this if needed)
            }));

        // Replace with actual API call
        axios.post(process.env.REACT_APP_API_BASE_URL+'/employee-salary-records', {
            employees: selectedEmployees
        })
            .then(response => {
                console.log('Data successfully submitted', response);
                // Handle success response
            })
            .catch(error => {
                console.error('Error submitting data', error);
                // Handle error response
            });
    };




    useEffect(() => {
        setEditFormData({
            ...editFormData,
            from_month: getCurrentMonth()
        });
    }, []);




    return (
        <>
            <div className='col-md-12 p-2'>
                <h5 className='text-warning bg-primary p-2 card-header border'>
                    <i className="fas fa-file-invoice"></i> Employee Salary Generate
                </h5>

                <form className='border p-3'>
                    <div className="form-group row">
                        <label htmlFor="inputEmail3" className="col-sm-1 col-form-label">Month</label>
                        <div className="col-sm-5">
                            <input
                                type="month"
                                name='amount'
                                value={editFormData.from_month}
                                onChange={(e) => {
                                    setEditFormData({
                                        ...editFormData,
                                        from_month: e.target.value,
                                    });
                                }}
                                className='form-control'
                            />
                        </div>
                        <button
                            type="button"
                            className='btn btn-sm btn-warning'
                            onClick={GenerateSalary}
                        >
                            <i className="fas fa-wallet"></i> Generate Salary
                        </button>

                    </div>
                </form>
            </div>

            <div className='col-md-12 p-2'>
                <div className="card-header text-warning bg-primary p-2">
                    <div className="d-flex justify-content-between align-items-center">
                        <div>
                            <i className="fas fa-list"></i> Employees Salary
                        </div>
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
                                <th>Net.Salary</th>
                                <th>Security</th>
                                <th>DOW</th>
                                <th>Graduity</th>
                                <th>Other</th>
                                <th>Remaining</th>
                                <th>Remarks</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                data.map(employee => (
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
                                        <td>{employee.total_net_salary}</td>

                                        <td>
                                            <input
                                                type="number"
                                                className='form-control'
                                                value={employeeFields[employee.id]?.security_deduction || 0}
                                                onChange={(e) => handleFieldChange(employee.id, 'security_deduction', e.target.value)}
                                                placeholder="Security Deduction"
                                                readOnly
                                            />
                                        </td>

                                        <td>
                                            <input
                                                type="number"
                                                className='form-control'
                                                value={employeeFields[employee.id]?.dow || 0}
                                                onChange={(e) => handleFieldChange(employee.id, 'dow', e.target.value)}
                                                placeholder="DOW"
                                            />
                                        </td>
                                        <td>
                                            <input
                                                type="number"
                                                className='form-control'
                                                value={employeeFields[employee.id]?.graduity || 0}
                                                onChange={(e) => handleFieldChange(employee.id, 'graduity', e.target.value)}
                                                placeholder="Graduity"
                                            />
                                        </td>

                                        <td>
                                            <input
                                                type="number"
                                                className='form-control'
                                                value={employeeFields[employee.id]?.others_allownce || 0}
                                                onChange={(e) => handleFieldChange(employee.id, 'others_allownce', e.target.value)} // Fix field name here
                                                placeholder="Others Allowance"
                                            />
                                        </td>

                                        <td>{employeeFields[employee.id]?.remaining}</td>
                                        <td><input type="text" className='form-control' placeholder="Remarks" /></td>
                                    </tr>
                                ))
                            }
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

export default SalaryList;



