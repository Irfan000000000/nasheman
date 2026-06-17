
import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { useAuth } from './AuthContext';
import AcademicSessionContext from './AcademicSessionContext';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function SalaryOfEmployee() {
    const [data, setData] = useState([]);
    const [checkedEmployees, setCheckedEmployees] = useState([]); // Initially, all unchecked

    const [paidThrough, setPaidThrough] = useState([]); 

    const [employeeFields, setEmployeeFields] = useState({});
    const [searchQuery, setSearchQuery] = useState('');

    const { user } = useAuth();
    const { academicSession } = useContext(AcademicSessionContext);
    const [allChecked, setAllChecked] = useState(false); // To track check/uncheck all status
    const [validity, setValidity] = useState({
        from_month: true,
    });


    const filteredData = data.filter(employee =>
        employee.full_name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    

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
        const month = String(date.getMonth() + 1).padStart(2, '0');
        return `${year}-${month}`;
    };


    const getDaysInMonth = (year, month) => {
        return new Date(year, month, 0).getDate();
    };


    const resetForm = () => {
        setEditFormData({
            ...editFormData,
            from_month: '',
        });
        setEmployeeFields({});
        setCheckedEmployees([]);
        setAllChecked(false);
        setData([]);
    };





    const fetchBanks = async () => {
        try {
            const response = await axios.get(process.env.REACT_APP_API_BASE_URL+"/get-bank_accounts", {
                params: {
                    campus_id: user.user.campus_id // Replace or add other parameters as needed
                }
            });
            // console.log(response.data.results);
            setPaidThrough(response.data.results);
        } catch (error) {
            console.error("Error fetching banks:", error);
        }
    };



const GenerateSalary = () => {
    // let selectedMonth = editFormData.from_month ? new Date(editFormData.from_month) : new Date();
    const daysInMonth = 30;

    const getEmployees = (from_month, campus_id) => {
        axios.get(process.env.REACT_APP_API_BASE_URL+`/get-school-employees/${from_month}/${campus_id}`)
            .then(res => {

                const employees = res.data.results;

                setData(employees);

                const employeesWithExistingSalary = employees
                    .filter(employee => employee.salary_id !== null)
                    .map(employee => employee.id);

                setCheckedEmployees(employeesWithExistingSalary);
                setAllChecked(false);

                const updatedEmployeeFields = employees.reduce((acc, employee) => {

                    // daysInMonth

                     const dowValue = employee.salary_dow != null ? parseFloat(employee.salary_dow) : daysInMonth;

                    // const dowValue = employee.salary_dow != null ? parseFloat(employee.salary_dow) : employee.total_present_days;
                   
                    const netSalary = employee.salary_net_salary !== null ? employee.salary_net_salary + employee.salary_eobi + employee.salary_cpf  : employee.total_net_salary + employee.eobi + employee.cpf;
                   
                    // console.log(employee.salary_remaining,"net salary", employee.full_name);

                    let remaining = netSalary;

                    // const eobi_get_first = parseFloat(employee.salary_eobi || employee.eobi);

                    const eobi_get_first = employee.salary_eobi != null ? parseFloat(employee.salary_eobi) : employee.eobi;

                    // const cpf_get_first = parseFloat(employee.salary_cpf || employee.cpf);

                    const cpf_get_first = employee.salary_cpf != null ? parseFloat(employee.salary_cpf) : employee.cpf;

                    // const bus_charges_get_first = employee.salary_bus_charges != null ? parseFloat(employee.salary_bus_charges) : (employee.bus_status !=='Off' ?  employee.bus_charges : 0);

                    const bus_charges_get_first = employee.salary_bus_charges != null
                    ? parseFloat(employee.salary_bus_charges) || 0
                    : (employee.bus_status !== 'Off' ? parseFloat(employee.bus_charges) || 0 : 0);

                   

                    // Calculate monthly income tax and deduct from remaining
                  

                    // Adjust remaining based on DOW
                    // const dowValue = parseFloat(employee.salary_dow || daysInMonth);

                  


                    // console.log( employee.salary_net_salary, employee.salary_eobi, dowValue);

                    remaining = (remaining / daysInMonth) * dowValue;
                    // console.log(employee.full_name , remaining);

                    // const monthlyIncomeTax = (employee.salary_income_tax || calculateMonthlyIncomeTax(employee).toFixed(2));

                    const monthlyIncomeTax = (employee.salary_income_tax || 0);


                    remaining -= monthlyIncomeTax;

                    remaining -= eobi_get_first;

                    remaining -= cpf_get_first;

                    remaining -= bus_charges_get_first;

                    // Calculate graduity and other allowances, adding them to remaining
                    const graduity = parseFloat(employee.salary_graduity || 0);
                    const othersAllowance = parseFloat(employee.salary_others_allownce || 0);
                    remaining += graduity + othersAllowance;

                    // Deduct other deductions from remaining
                    const othersDeduction = parseFloat(employee.other_deduction || 0);
                    remaining -= othersDeduction;

                    // Calculate and add overtime amount to remaining
                    const overtimeAmount = employee.salary_overtime_amount !== null
                        ? parseFloat(employee.salary_overtime_amount)
                        : (employee.total_overtime_hours * employee.basic_salary) / ((daysInMonth - 8) * (employee.work_shift === "Both" ? 12 : 8));
                    remaining += overtimeAmount;

                    // Deduct security and loan deductions
                    // const securityDeduction = parseFloat(employee.salary_security_deduct || (employee.total_security_deduct_from_salary >= employee.total_security_deduction ? 0 : employee.security_deduction));
                    
                    const securityDeduction = employee.salary_security_deduct != null 
                    ? parseFloat(employee.salary_security_deduct) 
                    : parseFloat(employee.total_security_deduct_from_salary >= employee.total_security_deduction 
                        ? 0 
                        : employee.security_deduction);

                    const loanDeduction = employee.salary_loan_deduct != null 
                    ? parseFloat(employee.salary_loan_deduct) 
                    : parseFloat(employee.total_loan_deduct_from_salary >= employee.total_loan_deduction 
                    ? 0 
                    : employee.loan_deduction);
                    
                    remaining -= (securityDeduction + loanDeduction);

                    const account_no_get = employee.salary_account_no || employee.account_no;

                    const paid_through_bank = employee.salary_paid_through_id || '';

                    const remarks_get = employee.salary_remarks || '';

                    // console.log(remaining);

                    // Populate fields in acc for each employee
                    acc[employee.id] = {
                        security_deduction: securityDeduction,
                        loan_deduction: loanDeduction,
                        dow: dowValue,
                        overtime_amount: overtimeAmount.toFixed(2),
                        graduity,
                        others_allownce: othersAllowance,
                        other_deduction: othersDeduction,
                        income_tax: monthlyIncomeTax,
                        remaining: remaining.toFixed(2), // Final calculated remaining
                        account_no: account_no_get,
                        paid_through_id: paid_through_bank,
                        remarks : remarks_get
                    };
                    return acc;
                }, {});

                // Set all calculated fields at once
                setEmployeeFields(updatedEmployeeFields);

                fetchBanks();

            })
            .catch(err => console.log(err));
    };

    if (user && user.user.campus_id && editFormData.from_month) {
        const selectedMonth = editFormData.from_month;
        getEmployees(selectedMonth, user.user.campus_id);
    }
};


    
    
    const calculateMonthlyIncomeTax = (employee) => {

        // console.log( employee.total_net_salary + employee.eobi);

        const annualSalary = (employee.salary_net_salary !== null ? 
            employee.salary_net_salary +  employee.salary_eobi: employee.total_net_salary + employee.eobi) * 12;
        let annualIncomeTax = 0;
        if (annualSalary <= 600000) {
            annualIncomeTax = 0;
        } else if (annualSalary > 600000 && annualSalary <= 1200000) {
            annualIncomeTax = (annualSalary - 600000) * 0.05;
        } else if (annualSalary > 1200000 && annualSalary <= 2200000) {
            annualIncomeTax = 30000 + ((annualSalary - 1200000) * 0.15);
        } else if (annualSalary > 2200000 && annualSalary <= 3200000) {
            annualIncomeTax = 180000 + (annualSalary - 2200000) * 0.25;
        } else if (annualSalary > 3200000 && annualSalary <= 4100000) {
            annualIncomeTax = 430000 + (annualSalary - 3200000) * 0.30;
        } else if (annualSalary > 4100000) {
            annualIncomeTax = 700000 + (annualSalary - 4100000) * 0.35;
        }
        return annualIncomeTax / 12;
        
    };




    const calculateRemainingSalary = (employee) => {
        const netSalary = employee.total_net_salary || 0;
    
        const monthlyIncomeTax = calculateMonthlyIncomeTax(employee).toFixed(2);
    
        let remainingSalary = netSalary - monthlyIncomeTax;
    
        const overtimeAmount = employee.overtime_amount || 0; // Use overtime amount from the employee object
        remainingSalary += parseFloat(overtimeAmount);
    
        const graduity = employee.graduity || 0;
        const othersAllownce = employee.others_allownce || 0;
        remainingSalary += graduity + othersAllownce;
    
        const securityDeduction = employee.security_deduction || 0;
        const loanDeduction = employee.loan_deduction || 0;
        remainingSalary -= (securityDeduction + loanDeduction);
    
        return remainingSalary.toFixed(2);
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


    const toggleCheckAll = () => {
        if (allChecked) {
            setCheckedEmployees([]); // Uncheck all
        } else {
            const allEmployeeIds = data.map(employee => employee.id);
            setCheckedEmployees(allEmployeeIds); // Check all
        }
        setAllChecked(!allChecked); // Toggle the button state
    };



    const handleFieldChange = (employeeId, field, value) => {

        // console.log("yes");
        setEmployeeFields(prevFields => {
            const updatedFields = { ...prevFields };
            updatedFields[employeeId][field] = value;

            const employee = data.find(emp => emp.id === employeeId);

            const dowValue = parseFloat(updatedFields[employeeId].dow) || 0;

            const netSalary = employee.salary_net_salary !== null ? employee.salary_net_salary + employee.salary_eobi : employee.total_net_salary + (dowValue > 0 ? employee.eobi : 0);
            // console.log(netSalary, employee.salary_net_salary);

            let remaining = netSalary;
            const eobi_get = employee.salary_eobi || employee.eobi;

            // const cpf_get = employee.salary_cpf || employee.cpf;

            const bus_charges_get = employee.salary_bus_charges || (employee.bus_status !== 'Off' ? parseFloat(employee.bus_charges) || 0 : 0);
            // Calculate monthly income tax

            // Adjust remaining based on DOW
            

            const income_tax_get = parseFloat(updatedFields[employeeId].income_tax) || 0;

            // const overtime = parseFloat(updatedFields[employeeId].overtime) || 0;


            const daysInMonth = getDaysInMonth(new Date(editFormData.from_month).getFullYear(), new Date(editFormData.from_month).getMonth() + 1);
            
            if(dowValue == daysInMonth){
                remaining = (netSalary / daysInMonth) * dowValue;
            }else{
                remaining = (netSalary / 30) * dowValue;
            }
            
            const securityDeduction = parseFloat(updatedFields[employeeId].security_deduction) || 0;
            const loanDeduction = parseFloat(updatedFields[employeeId].loan_deduction) || 0;
            remaining -= (securityDeduction + loanDeduction);

            // const monthlyIncomeTax = calculateMonthlyIncomeTax(employee).toFixed(2);

            // if(remaining >= monthlyIncomeTax){
            //     remaining -= monthlyIncomeTax;
            // }

            if(remaining >= income_tax_get){
                remaining -= income_tax_get;
            }
           
            const graduity = parseFloat(updatedFields[employeeId].graduity) || 0;
            const othersAllownce = parseFloat(updatedFields[employeeId].others_allownce) || 0;
            remaining += graduity + othersAllownce;

            const othersDeduction = parseFloat(updatedFields[employeeId].other_deduction) || 0;
            remaining -= othersDeduction;

            const overtimeAmount = parseFloat(updatedFields[employeeId].overtime_amount) || 0;
            remaining += overtimeAmount;

            if(remaining >= eobi_get){
                remaining -= eobi_get;
            }


            if(remaining >= bus_charges_get){
                remaining -= bus_charges_get;
            }

            // if(remaining >= cpf_get){
            //     remaining -= cpf_get;
            // }


            updatedFields[employeeId].remaining = remaining.toFixed(2);
            return updatedFields;
        });
    };


    const validateForm = () => {
        let isValid = true;
        if (!editFormData.from_month.trim()) {
            setValidity((prevState) => ({ ...prevState, from_month: false }));
            isValid = false;
        }
        return isValid;
    };

    const handleFormSubmit = (event) => {
        event.preventDefault();

        let confirmed = window.confirm("Are you sure you want to generate salary for the month " + editFormData.from_month + "?");

        if (confirmed) {
            if (validateForm()) {
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
                        bus_charges: employee.bus_status == "On" ? employee.bus_charges : 0,
                        basic_salary: employee.basic_salary,
                        additional_increments: employee.additional_increments,
                        pessi: employee.pessi,
                        eobi: employeeFields[employee.id]?.dow > 0 ? employee.eobi : 0,
                        cpf: employeeFields[employee.id]?.dow > 0 ? employee.cpf : 0,
                        bus_charges: employeeFields[employee.id]?.dow > 0 ? employee.bus_charges : 0,
                        second_shift_honorarium: employee.second_shift_honorarium,
                        campus_id: user.user.campus_id,
                        user_id: user.user.user_id,
                        medical_allownce: employee.medical_allownce,
                        principal_allownce: employee.principal_allownce,
                        special_allownce: employee.special_allownce,
                        income_tax: employeeFields[employee.id]?.income_tax || 0,
                        // income_tax: calculateMonthlyIncomeTax(employee).toFixed(2),
                        rebate: 0,
                        overtime: employee.total_overtime_hours,
                        overtime_amount: employeeFields[employee.id]?.overtime_amount || 0,
                        net_salary: employee.total_net_salary, // Keep net salary unchanged
                        for_the_month: editFormData.from_month,
                        total_security_deduct_from_salary: employeeFields[employee.id]?.security_deduction > 0 ? employee.total_security_deduct_from_salary : 0,
                        security_deduction: employeeFields[employee.id]?.security_deduction || 0,
                        total_loan_deduct_from_salary: employeeFields[employee.id]?.loan_deduction > 0 ? employee.total_loan_deduct_from_salary : 0,
                        loan_deduction: employeeFields[employee.id]?.loan_deduction || 0,
                        dow: employeeFields[employee.id]?.dow || 0,
                        graduity: employeeFields[employee.id]?.graduity || 0,
                        others_allownce: employeeFields[employee.id]?.others_allownce || 0,
                        other_deduction: employeeFields[employee.id]?.other_deduction || 0,
                        remaining: employeeFields[employee.id]?.remaining || employee.total_net_salary,
                        remarks: employeeFields[employee.id]?.remarks || '', // Updated
                        paid_through_id: employeeFields[employee.id]?.paid_through_id || '', // Updated
                        account_no: employeeFields[employee.id]?.account_no || '', // Updated
                        salary_update_id: employee.salary_id,
                        session_id: academicSession,
                    }));

                axios.post(process.env.REACT_APP_API_BASE_URL+'/employee-salary-records', {
                    employees: selectedEmployees
                })
                    .then(response => {
                        resetForm();
                        toast.success('Salary Generated Successfully!');
                    })
                    .catch(error => {
                        toast.error('Salary Generation Failed!');
                    });
            }
        }
    };


    useEffect(() => {
        setEditFormData({
            ...editFormData,
            from_month: getCurrentMonth()
        });
    }, []);


    // Calculate the grand total of remaining salary (for all employees)
    const overallGrandTotal = Object.values(employeeFields).reduce((total, employee) => {
        return total + parseFloat(employee.remaining || 0);
    }, 0);

    // Calculate the selected grand total of remaining salary (for checked employees only)
    const selectedGrandTotal = checkedEmployees.reduce((total, employeeId) => {
        return total + parseFloat(employeeFields[employeeId]?.remaining || 0);
    }, 0);

    return (
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
                                setEditFormData({ ...editFormData, from_month: e.target.value });
                                setValidity({ ...validity, from_month: true });
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
                            
            <div className='col-md-12 p-2'>
                <div>
                    <div className='mb-2'>
                        <button className="btn btn-sm btn-warning" onClick={toggleCheckAll}>
                            {allChecked ? <i className="far fa-check-square"></i> : <i className="far fa-square"></i>}
                        </button>
                    </div>
                </div>

                <div className="card-header text-warning bg-primary p-2">
                    <div className="d-flex justify-content-between align-items-center">
                        <div>
                            <i className="fas fa-list"></i> Employees Salary
                        </div>
                    </div>
                </div>

                <div className="border p-2 scrollable-div">
    {/* Sticky Search Bar */}
    <div
        className="sticky-header"
        style={{
            position: "sticky",
            top: 0,
            left: 0,
            zIndex: 10,
            backgroundColor: "#f8f9fa",
            padding: "10px",
        }}
    >
        <div className="form-group mb-3">
            <input
                type="text"
                className="form-control"
                placeholder="Search by Employee Name"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
            />
        </div>
    </div>

    {/* Employee Table */}
    <table className="table" id="salary-table" style={{ width: "100%" }}>
                        <thead style={{ position: "sticky", top: "75px", zIndex: "1", backgroundColor: "#f8f9fa" }}>
                            <tr>
                                <th >Check</th>
                                <th>Sr#</th>
                                <th className="sticky-column">Name</th>
                                <th>G.Salary</th>
                                <th>Overtime</th>
                                <th>Inc.Tax</th>
                                <th>Loan</th>
                                <th>Security</th>
                                <th>DOW</th>
                                <th>Graduity</th>
                                <th>Add.</th>
                                <th>Deduct.</th>
                                <th>Remaining</th>
                                <th>Remarks</th>
                                <th>Paid_Through</th>
                                <th>Acc#OfEmployee</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                               
                               filteredData.map((employee, index) => (
                                    <tr key={employee.id}>
                                        <td>
                                            <input
                                                type="checkbox"
                                                checked={checkedEmployees.includes(employee.id)}
                                                onChange={() => handleCheckboxChange(employee.id)}
                                            />
                                        </td>

                                        <td>{index +  1}</td>
                                        <td style={{"minWidth" : "200px"}} className="sticky-column">{employee.full_name + " ("+employee.employee_post+") ("+ employee.pay_scale +") ("+employee.job_type+ ")"}</td>
                                        {/* <td>{employee.employee_post}</td>
                                        <td>{employee.pay_scale + " (" + employee.job_type + ")"}</td> */}
                                        <td>{employee.salary_net_salary !== null ? employee.salary_net_salary +  employee.salary_eobi + employee.salary_cpf : employee.total_net_salary + employee.cpf +  employee.eobi  }</td>


                                        <td style={{"minWidth" : "200px"}} >
                                            <input
                                                type="text"
                                                className='form-control'
                                                value={employeeFields[employee.id]?.overtime_amount || 0}
                                                onChange={(e) => handleFieldChange(employee.id, 'overtime_amount', e.target.value)}
                                                placeholder="overtime_amount"
                                                // readOnly
                                                min={0}
                                            />
                                        </td>
                                        


                                        <td style={{"minWidth" : "200px"}}>
                                            <input
                                                type="text"
                                                className='form-control'
                                                value={employeeFields[employee.id]?.income_tax || 0}
                                                onChange={(e) => handleFieldChange(employee.id, 'income_tax', e.target.value)}
                                                placeholder="Income Tax"
                                                min={0}
                                                // readOnly
                                            />
                                        </td>

                                        <td style={{"minWidth" : "200px"}}>
                                            <input
                                                 type="text"
                                                className='form-control'
                                                value={employeeFields[employee.id]?.loan_deduction || 0}
                                                placeholder="Loan Deduction"
                                                readOnly
                                                min={0}
                                            />
                                        </td>

                                        <td style={{"minWidth" : "200px"}}>
                                            <input
                                                 type="text"
                                                className='form-control'
                                                value={employeeFields[employee.id]?.security_deduction || 0}
                                                placeholder="Security Deduction"
                                                readOnly
                                                min={0}
                                            />
                                        </td>

                                        <td style={{"minWidth" : "200px"}}>
                                            <input
                                                type="text"
                                                className='form-control'
                                                value={employeeFields[employee.id]?.dow || 0}
                                                onChange={(e) => handleFieldChange(employee.id, 'dow', e.target.value)}
                                                placeholder="DOW"
                                                min={0}
                                            />
                                        </td>

                                        <td style={{"minWidth" : "200px"}}>
                                            <input
                                                type="text"
                                                className='form-control'
                                                value={employeeFields[employee.id]?.graduity || 0}
                                                onChange={(e) => handleFieldChange(employee.id, 'graduity', e.target.value)}
                                                placeholder="Graduity"
                                                min={0}
                                            />
                                        </td>

                                        <td style={{"minWidth" : "200px"}}>
                                            <input
                                                type="text"
                                                className='form-control'
                                                value={employeeFields[employee.id]?.others_allownce || 0}
                                                onChange={(e) => handleFieldChange(employee.id, 'others_allownce', e.target.value)}
                                                placeholder="Others Allowance"
                                                min={0}
                                            />
                                        </td>


                                        <td style={{"minWidth" : "200px"}}>
                                            <input
                                                type="text"
                                                className='form-control'
                                                value={employeeFields[employee.id]?.other_deduction || 0}
                                                onChange={(e) => handleFieldChange(employee.id, 'other_deduction', e.target.value)}
                                                placeholder="Others Deduction"
                                                min={0}
                                            />
                                        </td>


                                        <td style={{"minWidth" : "200px"}}>{employeeFields[employee.id]?.remaining}</td>



                                         <td style={{"minWidth" : "200px"}}>
                                            <input
                                                type="text"
                                                className='form-control'
                                                value={employeeFields[employee.id]?.remarks || ''}
                                                onChange={(e) => handleFieldChange(employee.id, 'remarks', e.target.value)}
                                                placeholder="Remarks"
                                                min={0}
                                            />
                                        </td>


                                        <td style={{"minWidth" : "200px"}}>
                                        <select name='paid_through_id'
                                        value={employeeFields[employee.id]?.paid_through_id || ''}
                                        onChange={(e) => handleFieldChange(employee.id, 'paid_through_id', e.target.value)}

                                        className={'form-control'}  >
                                        <option value="">Paid Through</option>
                                        {paidThrough.map((bank, index) => (
                                            <option key={index} value={bank.id}>
                                                {bank.bank_name}
                                            </option>
                                        ))}
                                        </select>
                                        </td>



                                        <td style={{"minWidth" : "300px"}}>
                                            <input
                                                type="text"
                                                className='form-control'
                                                value={employeeFields[employee.id]?.account_no || ''}
                                                onChange={(e) => handleFieldChange(employee.id, 'account_no', e.target.value)}
                                                placeholder="account_no"
                                            />
                                        </td>
                                    </tr>
                                ))
                            } 

                            <tr style={{ position: "sticky", bottom: "0px", zIndex: "0", backgroundColor: "#f8f9fa" }}>
                                <td colSpan="12" style={{ textAlign: 'right', fontWeight: 'bold' }}>Grand Total:</td>
                                <td colSpan="4" style={{ fontWeight: 'bold' }}>{overallGrandTotal.toFixed(2)}</td>
                            </tr>

                            <tr>
                                <td style={{ textAlign: "right" }} colSpan="16">
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
        </div>
    );
}

export default SalaryOfEmployee;