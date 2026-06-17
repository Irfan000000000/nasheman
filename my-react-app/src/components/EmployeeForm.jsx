import React, { useCallback, useContext, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import axios from 'axios'
import Select from 'react-select';
import { useDropzone } from 'react-dropzone';
import { useAuth } from './AuthContext';
import AcademicSessionContext from './AcademicSessionContext';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useLocation } from 'react-router-dom';
import moment from 'moment';

function EmployeeForm() {

    const [getClasses, setClasses] = useState([]);
    const [difference, setDifference] = useState('');
    const [getEmployeeScale, setEmployeeScale] = useState([]);
    const [getCampuses, setCampuses] = useState([]);
    const [getSections, setSections] = useState([]);
    const [getEmployeeRoles, setEmployeeRoles] = useState([]);
    const [getEmployeePost, setEmployeePost] = useState([]);
    const [filePreview, setFilePreview] = useState(null);
    const { user } = useAuth();
    const { academicSession } = useContext(AcademicSessionContext);
    const location = useLocation();
    const { admission } = location.state || {};

    const { form } = useParams();

    const getDataLocalStorage = localStorage.getItem('employee') ? JSON.parse(localStorage.getItem('employee')) : "";

  
   
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };


// Initialize the state
const initialState = {
    hidden_id: getDataLocalStorage?.employee?.[0]?.id || "",
    register_no: getDataLocalStorage?.employee?.[0]?.register_no || "",
    appointment_date: getDataLocalStorage?.employee?.[0]?.appointment_date 
        ? formatDate(getDataLocalStorage?.employee?.[0]?.appointment_date) 
        : "",
    employee_role: getDataLocalStorage?.employee?.[0]?.employee_role_id || "",
    pay_scale: getDataLocalStorage?.employee?.[0]?.pay_scale_id ||"",
    employee_post: getDataLocalStorage?.employee?.[0]?.employee_post_id || "",
    full_name: getDataLocalStorage?.employee?.[0]?.full_name || "",
    father_name: getDataLocalStorage?.employee?.[0]?.father_name || "",
    mother_name: getDataLocalStorage?.employee?.[0]?.mother_name || "",
    mobile_no: getDataLocalStorage?.employee?.[0]?.mobile_no || "",
    gender: getDataLocalStorage?.employee?.[0]?.gender || "",
    dob: getDataLocalStorage?.employee?.[0]?.dob 
        ? formatDate(getDataLocalStorage?.employee?.[0]?.dob) 
        : "",
    cnic: getDataLocalStorage?.employee?.[0]?.cnic || "",
    marital_status: getDataLocalStorage?.employee?.[0]?.marital_status || "",
    current_address: getDataLocalStorage?.employee?.[0]?.current_address || "",
    permanent_address: getDataLocalStorage?.employee?.[0]?.permanent_address || "",
    qualification: getDataLocalStorage?.employee?.[0]?.qualification || "",
    experience: getDataLocalStorage?.employee?.[0]?.experience || "",
    work_shift: getDataLocalStorage?.employee?.[0]?.work_shift || "",
    profile_image: getDataLocalStorage?.employee?.[0]?.profile_image || "",
    status: getDataLocalStorage?.employee?.[0]?.status || "On",

    status: getDataLocalStorage?.employee?.[0]?.status || "",
    resign_retire_terminate_date: getDataLocalStorage?.employee?.[0]?.resign_retire_terminate_date || "",

    second_shift_honorarium: getDataLocalStorage?.employee?.[0]?.second_shift_honorarium || 0,

    account_no: getDataLocalStorage?.employee?.[0]?.account_no || "",
    basic_salary: getDataLocalStorage?.employee?.[0]?.basic_salary || "",
    house_rent: getDataLocalStorage?.employee?.[0]?.house_rent || 0,

    security_deduction: getDataLocalStorage?.employee?.[0]?.security_deduction || 0,
    total_security_deduction: getDataLocalStorage?.employee?.[0]?.total_security_deduction || 0,
    security_no_of_installment:  getDataLocalStorage?.employee?.[0]?.security_no_of_installment || 0,

    loan_no_of_installment:  getDataLocalStorage?.employee?.[0]?.loan_no_of_installment || 0,


    bus_status:  getDataLocalStorage?.employee?.[0]?.bus_status || 0,
    bus_charges:  getDataLocalStorage?.employee?.[0]?.bus_charges || 0,

    total_gross_salary: 0,
    actual_total_net_salary:0,

    loan_no_of_installment:  getDataLocalStorage?.employee?.[0]?.loan_no_of_installment || 0,

    loan_deduction:  getDataLocalStorage?.employee?.[0]?.loan_deduction || 0,

    loan:  getDataLocalStorage?.employee?.[0]?.total_loan_deduction || 0,

    previous_total_cpf:  getDataLocalStorage?.employee?.[0]?.previous_total_cpf || 0,
    overall_security_deduction:  getDataLocalStorage?.employee?.[0]?.overall_security_deduction || 0,

   
    medical_allownce:  getDataLocalStorage?.serviceBook?.medical_allownce || 0,
    special_allownce: getDataLocalStorage?.serviceBook?.special_allownce || 0,
    principal_allownce:  getDataLocalStorage?.serviceBook?.principal_allownce || 0,

    cpf:  getDataLocalStorage?.serviceBook?.cpf || 0,


   

    // ServiceBook data (checking if serviceBook is an object or array)

    service_book_id: getDataLocalStorage?.serviceBook?.id || 0,

    increment_date: getDataLocalStorage?.serviceBook?.increment_date || 0,


    


    annual_increment: getDataLocalStorage?.serviceBook?.annual_increment || 0,
    pessi: getDataLocalStorage?.serviceBook?.pessi || 0,
    eobi: getDataLocalStorage?.serviceBook?.eobi || 0,
    old_adhoc: getDataLocalStorage?.serviceBook?.old_adhoc || 0,
    current_adhoc: getDataLocalStorage?.serviceBook?.current_adhoc || 0,
    total_adhoc: getDataLocalStorage?.serviceBook?.total_adhoc || 0,
    total_no_of_increments: getDataLocalStorage?.serviceBook?.total_no_of_increments || 0,
    additional_increment: getDataLocalStorage?.serviceBook?.additional_increment || 0,
    current_increment: getDataLocalStorage?.serviceBook?.current_increment || 0,
    previous_total_increments: getDataLocalStorage?.serviceBook?.previous_total_increments || 0,
    total_basic_salary: getDataLocalStorage?.serviceBook?.total_basic_salary || 0,
    total_net_salary: getDataLocalStorage?.serviceBook?.total_net_salary + getDataLocalStorage?.serviceBook?.second_shift_honorarium || 0,

    // annual_increment_status: getDataLocalStorage?.serviceBook?.annual_increment_status || 0,
    // adhoc_increment_status: getDataLocalStorage?.serviceBook?.adhoc_increment_status || 0,

    job_type: getDataLocalStorage?.serviceBook?.job_type || "",
    
    // income_tax: getDataLocalStorage?.employee?.[0]?.income_tax || 0,
    // rebate: getDataLocalStorage?.employee?.[0]?.rebate || 0,

    // Additional fields
    session_id: academicSession,
    campus_id: user.user.campus_id,
    user_id: user.user.user_id,
};
    


// console.log(getDataLocalStorage?.employee?.[0]?.status);

    const [editFormData, setEditFormData] = useState(initialState);

    const [originalBaseSalary, setOriginalBaseSalary] = useState(0); // Store the original base salary




    useEffect(() => {
        if (form !== "edit") {
          localStorage.removeItem("employee");
          setEditFormData(initialState);
        }
      }, [getDataLocalStorage]); // Dependency array to run this effect only when `form` changes

    // const calculateNetSalary = (e) => {

    //     // Get the value from the field that triggered the event
    //     const fieldName = e.target.name;
    //     const fieldValue = parseFloat(e.target.value) || 0;  // Use 0 instead of ""

    //     // Update the respective field based on the triggered input
    //     setEditFormData((prevData) => {
    //         let updatedData = { ...prevData };
    //         // Update the corresponding field in the form data
    //         updatedData[fieldName] = fieldValue;
    //         // Retrieve values for calculations (use the updated data for calculations)
    //         //for sses
    //         // const baseSalary = parseFloat(originalBaseSalary) || 0;

    //         //for nasheman
    //          const baseSalary = parseFloat(updatedData.basic_salary + updatedData.house_rent) || 0;

    //         const oldAdhoc = parseFloat(updatedData.old_adhoc) || 0;
    //         const newAdhoc = parseFloat(updatedData.current_adhoc) || 0;
    //         const eobi = parseFloat(updatedData.eobi) || 0;
    //         // const pessi = parseFloat(updatedData.pessi) || 0;
    //         const additional_increment = parseFloat(updatedData.additional_increment) || 0;
    //         const security_deduction = parseFloat(updatedData.security_deduction) || 0;
    //         const previous_total_increments = parseFloat(updatedData.previous_total_increments) || 0;
    //         const current_increment = parseFloat(updatedData.current_increment) || 0;
    //         const secondShiftHonorarium = parseFloat(updatedData.second_shift_honorarium) || 0;

    //         const medical_allownce = parseFloat(updatedData.medical_allownce) || 0;
    //         const principal_allownce = parseFloat(updatedData.principal_allownce) || 0;
    //         const special_allownce = parseFloat(updatedData.special_allownce) || 0;

    //         // Calculate the total adhoc (not affecting basic salary)
    //         updatedData.total_adhoc = oldAdhoc + newAdhoc;

    //         // Adjust the base salary with additional increment and grand total increments
    //         const adjustedBaseSalary = baseSalary + additional_increment + previous_total_increments + current_increment;
    //         updatedData.total_basic_salary = adjustedBaseSalary;

            

    //         // Calculate the total net salary (base salary + total adhoc - deductions like eobi, pessi, and security deduction)
    //         updatedData.total_net_salary = adjustedBaseSalary + updatedData.total_adhoc + medical_allownce + principal_allownce + special_allownce + secondShiftHonorarium - (eobi) ;

    //         return updatedData;
    //     });
    // };




     // Function to calculate net salary, taking an optional event parameter
     const calculateNetSalary = (e = null) => {
        // Handle event-based changes, if triggered by an input event
        if (e) {
            const fieldName = e.target.name;
            const fieldValue = parseFloat(e.target.value) || 0;

            // Update the respective field based on the triggered input
            setEditFormData((prevData) => ({
                ...prevData,
                [fieldName]: fieldValue
            }));
        }

        // Perform calculations based on updated or initial data
        setEditFormData((prevData) => {

            let updatedData = { ...prevData };
            const baseSalary = parseFloat(updatedData.basic_salary + updatedData.house_rent) || 0;
            const oldAdhoc = parseFloat(updatedData.old_adhoc) || 0;
            const newAdhoc = parseFloat(updatedData.current_adhoc) || 0;
            const eobi = parseFloat(updatedData.eobi) || 0;
            const cpf = parseFloat(updatedData.cpf) || 0;
            
            const additional_increment = parseFloat(updatedData.additional_increment) || 0;
            const security_deduction = parseFloat(updatedData.security_deduction) || 0;
            const loan_deduction = parseFloat(updatedData.loan_deduction) || 0;
            const previous_total_increments = parseFloat(updatedData.previous_total_increments) || 0;
            const current_increment = parseFloat(updatedData.current_increment) || 0;
            const secondShiftHonorarium = parseFloat(updatedData.second_shift_honorarium) || 0;
            const medical_allownce = parseFloat(updatedData.medical_allownce) || 0;
            const principal_allownce = parseFloat(updatedData.principal_allownce) || 0;
            const special_allownce = parseFloat(updatedData.special_allownce) || 0;

            // Calculate the total adhoc (not affecting basic salary)
            updatedData.total_adhoc = oldAdhoc + newAdhoc;

            // Adjust the base salary with additional increment and grand total increments
            const adjustedBaseSalary = baseSalary + additional_increment + previous_total_increments + current_increment;
            updatedData.total_basic_salary = adjustedBaseSalary;

            // Calculate the total net salary
            updatedData.total_net_salary = adjustedBaseSalary + updatedData.total_adhoc + medical_allownce + principal_allownce + special_allownce + secondShiftHonorarium - (eobi + cpf);

            updatedData.actual_total_net_salary = adjustedBaseSalary + updatedData.total_adhoc + medical_allownce + principal_allownce + special_allownce + secondShiftHonorarium - (security_deduction +  loan_deduction + eobi + cpf);


            updatedData.total_gross_salary = adjustedBaseSalary + updatedData.total_adhoc + medical_allownce + principal_allownce + special_allownce + secondShiftHonorarium;

            return updatedData;
        });
    };

    // Initial calculation if getDataLocalStorage is not empty
    useEffect(() => {
        if (getDataLocalStorage) {
            // console.log("hit");
            calculateNetSalary();
        }
    }, [getDataLocalStorage]);

    


    useEffect(() => {
        setEditFormData((prevData) => {
            let updatedData = { ...prevData };
            
            // Calculate second shift honorarium if "Both" is selected for work_shift
            if (updatedData.work_shift === "Both") {
                updatedData.second_shift_honorarium = updatedData.basic_salary / 100 * 50;  // 50% of basic salary
            } else {
                updatedData.second_shift_honorarium = 0;
            }
    
            // Retrieve values for calculations
            const baseSalary = parseFloat(updatedData.basic_salary) || 0;
            const oldAdhoc = parseFloat(updatedData.old_adhoc) || 0;
            const newAdhoc = parseFloat(updatedData.current_adhoc) || 0;
            const eobi = parseFloat(updatedData.eobi) || 0;
            const cpf = parseFloat(updatedData.cpf) || 0;
            const house_rent = parseFloat(updatedData.house_rent) || 0;

            const security_deduction = parseFloat(updatedData.security_deduction) || 0;
            const loan_deduction = parseFloat(updatedData.loan_deduction) || 0;


            // const pessi = parseFloat(updatedData.pessi) || 0;
            const additional_increment = parseFloat(updatedData.additional_increment) || 0;
            const previous_total_increments = parseFloat(updatedData.previous_total_increments) || 0;
            const current_increment = parseFloat(updatedData.current_increment) || 0;
            const secondShiftHonorarium = parseFloat(updatedData.second_shift_honorarium) || 0;
    
            // Calculate the total adhoc (not affecting basic salary)
            updatedData.total_adhoc = oldAdhoc + newAdhoc;
    
            // Adjust the base salary with additional increment and grand total increments
            const adjustedBaseSalary = baseSalary + additional_increment + previous_total_increments + current_increment;
            updatedData.total_basic_salary = adjustedBaseSalary;
    
            // Calculate the total net salary (base salary + total adhoc - deductions + second shift honorarium)
            updatedData.total_net_salary = adjustedBaseSalary + updatedData.total_adhoc + house_rent + secondShiftHonorarium - (eobi + cpf);

            updatedData.actual_total_net_salary = adjustedBaseSalary + updatedData.total_adhoc + house_rent + secondShiftHonorarium - (security_deduction + loan_deduction + eobi + cpf);

            updatedData.total_gross_salary = adjustedBaseSalary + updatedData.total_adhoc + house_rent + secondShiftHonorarium;
    
            return updatedData;
        });
    }, [
        editFormData.work_shift, 
        // editFormData.basic_salary, 
        // editFormData.old_adhoc, 
        // editFormData.current_adhoc, 
        // editFormData.eobi, 
        // editFormData.pessi, 
        // editFormData.additional_increment, 
        // editFormData.previous_total_increments, 
        // editFormData.current_increment,
        editFormData.second_shift_honorarium
    ]);
    





    useEffect(() => {
        if (getDataLocalStorage.results && getDataLocalStorage.results[0]?.profile_image) {
            setFilePreview(process.env.REACT_APP_API_BASE_URL+`/uploads/${getDataLocalStorage.results[0].profile_image}`);
        } else {
            setFilePreview(null);
        }
    }, []);

    useEffect(() => {
        if (academicSession) {
            setEditFormData(prevFormData => ({
                ...prevFormData,
                session_id: parseInt(academicSession)
            }));
        }
    
       
    }, [academicSession]);

    // useEffect(() => {
    //     const fetchClasses = (campus_id) => {
    //         axios.get(process.env.REACT_APP_API_BASE_URL+`/get-classes/${campus_id}`)
    //             .then(res => {
    //                 setClasses(res.data.results);
    //             })
    //             .catch(err => console.log(err));
    //     };

    //     if (user && user.user.campus_id) {
    //         fetchClasses(user.user.campus_id);
    //     }
    // }, []);

    useEffect(() => {
        const getEmployeeScale = () => {
            axios.get(process.env.REACT_APP_API_BASE_URL+`/employee-scale`)
                .then(res => {
                    setEmployeeScale(res.data.results);
                })
                .catch(err => console.log(err));
        };

        if (user) {
            getEmployeeScale();
        }
    }, []);

    useEffect(() => {
        const fetchCampuses = (campus_id) => {
            axios.get(process.env.REACT_APP_API_BASE_URL+`/get-campuses`)
                .then(res => {
                    setCampuses(res.data.results);
                })
                .catch(err => console.log(err));
        };

        if (user && user.user.campus_id) {
            fetchCampuses(user.user.campus_id);
        }
    }, []);

    useEffect(() => {
        const fetchEmployeeRoles = (campus_id) => {
            axios.get(process.env.REACT_APP_API_BASE_URL+`/employee-roles`)
                .then(res => {
                    setEmployeeRoles(res.data.results);
                })
                .catch(err => console.log(err));
        };

        if (user && user.user.campus_id) {
            fetchEmployeeRoles(user.user.campus_id);
        }
    }, [user]);

    useEffect(() => {
        const fetchEmployeePost = (campus_id) => {
            axios.get(process.env.REACT_APP_API_BASE_URL+`/employee-post`)
                .then(res => {
                    setEmployeePost(res.data.results);
                })
                .catch(err => console.log(err));
        };

        if (user && user.user.campus_id) {
            fetchEmployeePost(user.user.campus_id);
        }
    }, []);



    useEffect(() => {

       

        if(editFormData.work_shift == "Both"){
            setEditFormData({
                ...editFormData,
                second_shift_honorarium: editFormData.basic_salary/100*50,
            });
        }else{
            setEditFormData({
                ...editFormData,
                second_shift_honorarium: 0,
            });
        }
       
       
    }, [editFormData.work_shift]);


    // useEffect(() => {
    //     const fetchSections = (campus_id) => {
    //         axios.get(process.env.REACT_APP_API_BASE_URL+`/get-sections/${campus_id}`)
    //             .then(res => {
    //                 setSections(res.data.results);
    //             })
    //             .catch(err => console.log(err));
    //     };

    //     if (user && user.user.campus_id) {
    //         fetchSections(user.user.campus_id);
    //     }
    // }, []);




    



    const calculateDifference = (appointmentDate) => {
        const now = moment();
        const appointment = moment(appointmentDate);
        const years = now.diff(appointment, 'years');
        const months = now.diff(appointment, 'months') % 12;

        let differenceText;
        if (years > 0) {
            differenceText = `${years} year${years > 1 ? 's' : ''} and ${months} month${months > 1 ? 's' : ''}`;
        } else {
            differenceText = `${months} month${months > 1 ? 's' : ''}`;
        }

        setDifference(differenceText);
        return { years, months };
    };


    useEffect(() => {
        const getSalaryData = () => {
            let id = editFormData.pay_scale;
            axios.get(process.env.REACT_APP_API_BASE_URL+`/get-salary-data-scale-wise/${id}`)
                .then(res => {
                    const salary_data = res.data.results[0];
                    const dateDifference = calculateDifference(editFormData.appointment_date);

                    if (salary_data) {
                        // calculateSalary(dateDifference, salary_data);

                        setEditFormData({
                            ...editFormData,
                            basic_salary: salary_data.basic_salary || 0,
                            annual_increment: salary_data.annual_increment || 0,
                            house_rent: salary_data.house_rent || 0,
                            total_no_of_increments: 0,
                            previous_total_increments: 0,
                            total_basic_salary: salary_data.basic_salary + salary_data.house_rent || 0,
                            total_net_salary: getDataLocalStorage == "" ? salary_data.basic_salary + salary_data.house_rent || 0 : getDataLocalStorage?.serviceBook?.total_net_salary
                        });

                        setOriginalBaseSalary(salary_data.basic_salary + salary_data.house_rent);


                    } else {
                        setEditFormData({
                            ...editFormData,
                            basic_salary: 0,
                            annual_increment: 0,
                            house_rent: 0,
                            total_no_of_increments: 0,
                            previous_total_increments: 0,
                            total_basic_salary: 0,
                            total_net_salary: 0,
                        });

                        setOriginalBaseSalary(salary_data.basic_salary + salary_data.house_rent);

                    }

                })
                .catch(err => console.log(err));
        };

        if (user && user.user.campus_id && editFormData.pay_scale !== '' && editFormData.appointment_date !== '') {

            //this setting is only for nasheman
           if(getDataLocalStorage ==''){
            getSalaryData();
           }
        }
    }, [editFormData.pay_scale, editFormData.appointment_date]);



    const onDrop = useCallback((acceptedFiles) => {
        const file = acceptedFiles[0];
        const blobUrl = URL.createObjectURL(file);
        setEditFormData({ ...editFormData, profile_image: file });
        setFilePreview(blobUrl);
    }, [editFormData]);

    const { getRootProps, getInputProps } = useDropzone({ onDrop });

    const [validity, setValidity] = useState({
        register_no: true,
        cpf:true,
        previous_total_cpf:true,
        appointment_date: true,
        // job_type: true,
        employee_role: true,
        employee_post: true,
        pay_scale: true,
        full_name: true,
        father_name: true,
        mother_name: true,
        mobile_no: true,
        gender: true,
        dob: true,
        marital_status: true,
        cnic: true,
        current_address: true,
        permanent_address: true,
        qualification: true,
        experience: true,
        work_shift: true,
        // employee_campus_id: true,
        status: true,
        account_no: true,
        basic_salary: true,
        annual_increment: true,
        house_rent: true,
        additional_increment: true,
        total_basic_salary: true,
        pessi_status: true,
        pessi: true,
        eobi_status: true,
        eobi: true,
        old_adhoc: true,
        current_adhoc: true,
        total_adhoc: true,
        total_no_of_increments: true,
        previous_total_increments: true,
        total_basic_salary: true,
        total_net_salary: true,
        security_deduction: true,
        total_security_deduction:true,
        current_increment: true,
        // security_no_of_installment: true,

        bus_charges:true,
        bus_status:true,

        // loan_no_of_installment:true,
        loan_deduction:true,
        loan:true,
        second_shift_honorarium: true,
        // income_tax: true,
        // rebate: true,

        medical_allownce:true,
        principal_allownce:true,
        special_allownce:true,
        overall_security_deduction:true

        
    });






    const handleChange = (e) => {
        const { name, value } = e.target;
        setEditFormData({ ...editFormData, [name]: value });
        setValidity({ ...validity, [name]: true });

        if (name === 'appointment_date') {
            calculateDifference(value);
        }


        if (name === 'loan_no_of_installment' || name === 'loan') {
        //    calculateLoanInstallment();
        }


    };


    useEffect(() => {
    
        if (editFormData.security_no_of_installment && editFormData.total_net_salary) {
            let totalSecurityDeduction = 0; // Declare outside the if blocks

            if(editFormData.job_type == "Regular" && editFormData.security_no_of_installment>0 ){
                 totalSecurityDeduction = 3 * editFormData.total_net_salary;
            }else if(editFormData.job_type == "Contract" && editFormData.security_no_of_installment>0){
                 totalSecurityDeduction = 1 * editFormData.total_net_salary;
            }else{
                totalSecurityDeduction = 0;
            }
          
            setEditFormData((prevData) => ({
                ...prevData,
                total_security_deduction: totalSecurityDeduction,
                security_deduction: 0
            }));

            
        }
    }, [editFormData.security_no_of_installment]);
    
    
    useEffect(() => {
        // Only run calculation when total_security_deduction has been updated
        if (editFormData.total_security_deduction) {
            // calculateInstallment();
        }
        
    }, [editFormData.security_no_of_installment, editFormData.total_security_deduction]);




    // useEffect(() => {
      
    // }, [editFormData]);


    
    // const calculateInstallment = () => {
    //     const installments = editFormData.security_no_of_installment;
    //     const total_security_deduction = editFormData.total_security_deduction;
    
    //     if (installments >= 0 && total_security_deduction >= 0) {
    //         let formattedAmount = 0;

    //         const installmentAmount = parseFloat(total_security_deduction) / parseInt(installments);
    //         if(installmentAmount !== "Infinity"){
    //              formattedAmount = installmentAmount.toFixed(2); // Format to 2 decimal places
    //         }
    //             setEditFormData((prevData) => ({
    //                 ...prevData,
    //                 security_deduction: formattedAmount == "Infinity" ? 0 : formattedAmount
    //             }));
           
           
    //     }else{
            
    //         setEditFormData((prevData) => ({
    //             ...prevData,
    //             security_deduction: 0,
    //             total_security_deduction:0
    //         }));
      
    //     }
    // };
    



    const handleSubmit = async (e) => {
        e.preventDefault();
        // console.log(validateForm());
        if (validateForm()) {
            const formData = new FormData();
            for (const key in editFormData) {
                formData.append(key, editFormData[key]);
            }

            try {
                const response = await axios.post(process.env.REACT_APP_API_BASE_URL+'/insert-school-employee', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                });

                if (editFormData.hidden_id !== "") {
                    if (response.data.error) {
                        toast.success(response.data.error);
                    } else {
                        toast.success('Data updated successfully!');
                        localStorage.removeItem('employee');
                        setEditFormData(initialState);
                    }
                } else {
                    toast.success('Data Inserted successfully!');
                }

                setEditFormData(initialState);
                setFilePreview(null);
            } catch (error) {
                console.error('There was an error!', error);
            }
        }
    };





    // const calculateLoanInstallment = () => {
    //     const installments = editFormData.loan_no_of_installment;
    //     const totalLoan = editFormData.loan;
    
    //     if (installments > 0 && totalLoan >= 0) {
    //         let formattedLoanAmount = 0;
    
    //         const loanInstallmentAmount = parseFloat(totalLoan) / parseInt(installments);
    //         if (loanInstallmentAmount !== "Infinity") {
    //             formattedLoanAmount = loanInstallmentAmount.toFixed(2); // Format to 2 decimal places
    //         }
    
    //         setEditFormData((prevData) => ({
    //             ...prevData,
    //             loan_deduction: formattedLoanAmount === "Infinity" ? 0 : formattedLoanAmount,
    //         }));
    //     } else {
    //         setEditFormData((prevData) => ({
    //             ...prevData,
    //             loan_deduction: 0,
    //             loan: 0,
    //         }));
    //     }
    // };
    


    useEffect(() => {
        if (editFormData.loan_no_of_installment && editFormData.loan) {
            // calculateLoanInstallment();
        }
    }, [editFormData.loan_no_of_installment, editFormData.loan]);
    




    const validateForm = () => {
        let isValid = true;
        let newValidity = { ...validity }; // Create a copy of validity state

        for (let key in editFormData) {
            const value = editFormData[key];

            // Skip hidden_id validation if it's a new entry
            if (key === 'hidden_id' && !editFormData.hidden_id) {
                continue; // Skip hidden_id validation
            }

            // Validate profile_image (ensure a file is uploaded)
            if (key === 'profile_image' && !editFormData.profile_image) {

                continue;
            }

            if (typeof value === 'string' && !value.trim()) {

                if(key !=="resign_retire_terminate_date"){
                    newValidity[key] = false; // Update the copy of validity state
                    console.log(`${key} is invalid due to empty string.`);
                    isValid = false;
                }
               
            } else if (typeof value === 'undefined' || value === "") {
                newValidity[key] = false; // Update the copy of validity state
                console.log(`${key} is invalid due to undefined or empty value.`);
                isValid = false;
            } else {
                newValidity[key] = true; // Mark as valid if the field is correct
            }
        }

        setValidity(newValidity); // Update the validity state after the loop
        console.log('Form validation result:', isValid);
        return isValid; // Return the final validity status
    };


    




    return (
        <>
            <div className="employee-form">
                <div className="employee-form__inner">
                    <h5 className="employee-form__title">
                        <i className="fas fa-id-card-alt"></i> Employee Form
                    </h5>

                    <form className="employee-form__body" onSubmit={handleSubmit}>
                        <div className="employee-form__section">
                            <h5 className="employee-form__section-title">
                                <i className="fas fa-user"></i> Personal Information
                            </h5>
                        </div>

                        <div className="form-group row">
                            <div className="col-md-4">
                                <label className="col-form-label">Register#</label>
                                <input
                                    type="text"
                                    className={validity.register_no ? 'form-control' : 'form-control invalid-input'}
                                    id="register_no"
                                    name="register_no"
                                    value={editFormData.register_no}
                                    onChange={handleChange}
                                />
                            </div>


                            <div className="col-md-4">
                                <label className="col-form-label">Full Name</label>
                                <input
                                    type="text"
                                    className={validity.full_name ? 'form-control' : 'form-control invalid-input'}
                                    id="full_name"
                                    name="full_name"
                                    value={editFormData.full_name}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className="col-md-4">
                                <label className="col-form-label">Father Name</label>
                                <input
                                    type="text"
                                    className={validity.father_name ? 'form-control' : 'form-control invalid-input'}
                                    id="father_name"
                                    name="father_name"
                                    value={editFormData.father_name}
                                    onChange={handleChange}
                                />
                            </div>




                        </div>


                        <div className="form-group row">
                            <div className="col-md-4">
                                <label className="col-form-label">Mother Name</label>
                                <input
                                    type="text"
                                    className={validity.mother_name ? 'form-control' : 'form-control invalid-input'}
                                    id="mother_name"
                                    name="mother_name"
                                    value={editFormData.mother_name}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className="col-md-4">
                                <label className="col-form-label">Mobile No</label>
                                <input
                                    type="text"
                                    className={validity.mobile_no ? 'form-control' : 'form-control invalid-input'}
                                    id="mobile_no"
                                    name="mobile_no"
                                    value={editFormData.mobile_no}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className="col-md-4">
                                <label className="col-form-label" htmlFor="gender">Gender</label>
                                <select
                                    className={validity.gender ? 'form-control' : 'form-control invalid-input'}
                                    id="gender"
                                    name="gender"
                                    value={editFormData.gender}
                                    onChange={handleChange}
                                >
                                    <option value="">Select Gender</option> {/* Default option */}
                                    <option value="Male">Male</option>
                                    <option value="Female">Female</option>
                                </select>
                            </div>
                        </div>

                        <div className="form-group row">
                            <div className="col-md-4">
                                <label className="col-form-label">DOB</label>
                                <input
                                    type="date"
                                    className={validity.dob ? 'form-control' : 'form-control invalid-input'}
                                    id="dob"
                                    name="dob"
                                    value={editFormData.dob}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className="col-md-4">
                                <label className="col-form-label">CNIC</label>
                                <input
                                    type="text"
                                    className={validity.cnic ? 'form-control' : 'form-control invalid-input'}
                                    id="cnic"
                                    name="cnic"
                                    value={editFormData.cnic}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className="col-md-4">
                                <label className="col-form-label" htmlFor="marital_status">Marital Status</label>
                                <select
                                    className={validity.marital_status ? 'form-control' : 'form-control invalid-input'}
                                    id="marital_status"
                                    name="marital_status"
                                    value={editFormData.marital_status}
                                    onChange={handleChange}
                                >
                                    <option value="">Select Marital Status</option> {/* Default option */}
                                    <option value="Single">Single</option>
                                    <option value="Married">Married</option>
                                    <option value="Widowed">Widowed</option>
                                </select>
                            </div>
                        </div>

                        <div className="form-group row">
                            <div className="col-md-4">
                                <label className="col-form-label">Current Address</label>
                                <input
                                    type="text"
                                    className={validity.current_address ? 'form-control' : 'form-control invalid-input'}
                                    id="current_address"
                                    name="current_address"
                                    value={editFormData.current_address}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className="col-md-4">
                                <label className="col-form-label">Permanent Address</label>
                                <input
                                    type="text"
                                    className={validity.permanent_address ? 'form-control' : 'form-control invalid-input'}
                                    id="permanent_address"
                                    name="permanent_address"
                                    value={editFormData.permanent_address}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className="col-md-4">
                                <label className="col-form-label">Qualification</label>
                                <input
                                    type="text"
                                    className={validity.qualification ? 'form-control' : 'form-control invalid-input'}
                                    id="qualification"
                                    name="qualification"
                                    value={editFormData.qualification}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>

                        <div className="form-group row">
                            <div className="col-md-4">
                                <label className="col-form-label">Experience</label>
                                <input
                                    type="text"
                                    className={validity.experience ? 'form-control' : 'form-control invalid-input'}
                                    id="experience"
                                    name="experience"
                                    value={editFormData.experience}
                                    onChange={handleChange}
                                />
                            </div>

                           

                            {/* <div className="col-md-4 d-none">
                                <label className="col-form-label">Campus</label>
                                <Select
                                    options={getCampuses.map(campus => ({ value: campus.id, label: campus.campus_name }))}
                                    value={
                                        editFormData.employee_campus_id
                                            ? { value: editFormData.employee_campus_id, label: getCampuses.find(campus => campus.id === editFormData.employee_campus_id)?.campus_name || "" }
                                            : null
                                    }
                                    onChange={(selectedOption) => setEditFormData({ ...editFormData, employee_campus_id: selectedOption ? selectedOption.value : "" })}
                                    placeholder="Select Campus"
                                />
                            </div> */}


                            <div className="col-md-4">
                                <label className="col-form-label" htmlFor="status">Status</label>
                                <select
                                    className={validity.status ? 'form-control' : 'form-control invalid-input'}
                                    id="status"
                                    name="status"
                                    value={editFormData.status}
                                    onChange={handleChange}
                                >
                                    <option value="">Select Status</option> {/* Default option */}
                                    <option value="On">On</option>
                                    <option value="Retire">Retire</option>
                                    <option value="Resign">Resign</option>
                                    <option value="Terminate">Terminate</option>
                                </select>
                            </div>

                            <div className="col-md-4">
                                <label className="col-form-label" htmlFor="resign_retire_terminate_date">Resign/Retire/Terminate Date</label>
                                <input
                                    type="date"
                                    className={'form-control'}
                                    id="resign_retire_terminate_date"
                                    name="resign_retire_terminate_date"
                                    value={editFormData.resign_retire_terminate_date}
                                    onChange={handleChange}
                                />
                            </div>


                            <div className="col-md-4">
                                <label className="col-form-label"></label>
                                <div className="col-sm-12">
                                    <div {...getRootProps({ className: 'dropzone' })} className="border p-3 text-center drag_image_zone">
                                        <input {...getInputProps()} />
                                        {filePreview ? (
                                            <img src={filePreview} alt="Preview" style={{ width: '30px', height: 'auto' }} />
                                        ) : (
                                            <p>Drag image here <i className="fas fa-image" draggable="true"></i></p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="employee-form__section">
                            <h5 className="employee-form__section-title">
                                <i className="fas fa-money-check-alt"></i> Salary Detail
                            </h5>
                        </div>

                        <div className="row">


                            <div className="col-md-4">
                                <label className="col-form-label">Roles</label>
                                <Select
                                    options={getEmployeeRoles.map(role => ({ value: role.id, label: role.employee_role }))}
                                    value={
                                        editFormData.employee_role
                                            ? { value: editFormData.employee_role, label: getEmployeeRoles.find(role => role.id === editFormData.employee_role)?.employee_role || "" }
                                            : null
                                    }
                                    onChange={(selectedOption) => setEditFormData({ ...editFormData, employee_role: selectedOption ? selectedOption.value : "" })}
                                    placeholder="Select Employee Role"
                                />
                            </div>


                            <div className="col-md-4">
                                <label className="col-form-label">Employee Post</label>
                                <Select
                                    options={getEmployeePost.map(post => ({ value: post.id, label: post.employee_post }))}
                                    value={
                                        editFormData.employee_post
                                            ? { value: editFormData.employee_post, label: getEmployeePost.find(post => post.id === editFormData.employee_post)?.employee_post || "" }
                                            : null
                                    }
                                    onChange={(selectedOption) => setEditFormData({ ...editFormData, employee_post: selectedOption ? selectedOption.value : "" })}
                                    placeholder="Select Employee Post"
                                />
                            </div>



                            <div className="col-md-4">
                                <label className="col-form-label">Appointment Date</label>
                                <input
                                    type="date"
                                    className={validity.appointment_date ? 'form-control' : 'form-control invalid-input'}
                                    id="appointment_date"
                                    name="appointment_date"
                                    value={editFormData.appointment_date}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className="col-md-4">
                                <label className="col-form-label">Difference from today: </label>
                                <div className='border' style={{ "height": "40px", "padding": "7px", "background": "#d1d1d1" }}>
                                    {difference}
                                </div>
                            </div>

                            <div className="col-md-4">
                                <label className="col-form-label">Pay Scale</label>
                                
                                <Select
                                    options={getEmployeeScale.map(scale => ({
                                        value: scale.id,
                                        label: `${scale.pay_scale} (${scale.job_type})`,
                                        job_type: scale.job_type // Add job_type in the option object
                                    }))}
                                    value={
                                        editFormData.pay_scale
                                            ? {
                                                value: editFormData.pay_scale,
                                                label: getEmployeeScale.find(scale => scale.id === editFormData.pay_scale)
                                                    ? `${getEmployeeScale.find(scale => scale.id === editFormData.pay_scale).pay_scale} (${getEmployeeScale.find(scale => scale.id === editFormData.pay_scale).job_type})`
                                                    : ""
                                            }
                                            : null
                                    }
                                    onChange={(selectedOption) =>
                                        setEditFormData({
                                            ...editFormData,
                                            pay_scale: selectedOption ? selectedOption.value : "",
                                            job_type: selectedOption ? selectedOption.job_type : "" // Assign job_type as well
                                        })
                                    }
                                    placeholder="Select Employee Pay Scale"
                                />


                            </div>

                            {/* for sses */}

                            {/* <div className="col-md-4">
                                <label className="col-form-label">Initial Basic Salary</label>
                                <input
                                    type="text"
                                    className={validity.basic_salary ? 'form-control' : 'form-control invalid-input'}
                                    style={{ background: editFormData.basic_salary > 0 ? "#d1d1d1" : "" }}
                                    // readOnly
                                    id="basic_salary"
                                    name="basic_salary"
                                    value={editFormData.basic_salary}
                                    onChange={handleChange}
                                   
                                />
                            </div> */}

                            
                            {/* for nasheman */}

                            <div className="col-md-4">
                                <label className="col-form-label">Initial Basic Salary</label>
                                <input
                                    type="text"
                                    className={validity.basic_salary ? 'form-control' : 'form-control invalid-input'}
                                    style={{ background: editFormData.basic_salary > 0 ? "#d1d1d1" : "" }}
                                    // readOnly
                                    id="basic_salary"
                                    name="basic_salary"
                                    value={editFormData.basic_salary}
                                    onChange={handleChange}
                                    onKeyUp={calculateNetSalary}
                                />
                            </div>

                            <div className="col-md-4 d-none">
                                <label className="col-form-label">Annual Increment</label>
                                <input
                                    type="text"
                                    className={validity.annual_increment ? 'form-control' : 'form-control invalid-input'}
                                    style={{ background: editFormData.annual_increment > 0 ? "#d1d1d1" : "" }}
                                    // readOnly
                                    id="annual_increment"
                                    name="annual_increment"
                                    value={editFormData.annual_increment}
                                    onChange={handleChange}
                                />
                            </div>
                                
                            
                            {/* for sses */}

                            {/* <div className="col-md-4">
                                <label className="col-form-label">House Rent</label>
                                <input
                                    type="text"
                                    className={validity.house_rent ? 'form-control' : 'form-control invalid-input'}
                                    style={{ background: editFormData.house_rent > 0 ? "#d1d1d1" : "" }}
                                    // readOnly
                                    id="house_rent"
                                    name="house_rent"
                                    value={editFormData.house_rent}
                                    onChange={handleChange}
                                   
                                />
                            </div> */}

                            
                            {/* for nasheman */}
                            <div className="col-md-4">
                                <label className="col-form-label">House Rent</label>
                                <input
                                    type="text"
                                    className={validity.house_rent ? 'form-control' : 'form-control invalid-input'}
                                    style={{ background: editFormData.house_rent > 0 ? "#d1d1d1" : "" }}
                                    // readOnly
                                    id="house_rent"
                                    name="house_rent"
                                    value={editFormData.house_rent}
                                    onChange={handleChange}
                                    onKeyUp={calculateNetSalary}
                                />
                            </div>

                            <div className="col-md-4">
                                <label className="col-form-label">Additional Increment (First Time)</label>
                                <input
                                    type="text"
                                    className={validity.additional_increment ? 'form-control' : 'form-control invalid-input'}
                                    style={{ background: editFormData.additional_increment > 0 ? "#d1d1d1" : "" }}
                                    id="additional_increment"
                                    name="additional_increment"
                                    value={editFormData.additional_increment}
                                    onKeyUp={calculateNetSalary}
                                    onChange={handleChange}
                                />
                            </div>



                            <div className="col-md-1">
                                <label className="col-form-label">Pessi</label>
                                <input
                                    type="text"
                                    className={validity.pessi ? 'form-control' : 'form-control invalid-input'}
                                    style={{ background: editFormData.pessi > 0 ? "#d1d1d1" : "" }}
                                    id="pessi"
                                    name="pessi"
                                    value={editFormData.pessi}
                                    onKeyUp={calculateNetSalary}
                                    onChange={handleChange}
                                />
                            </div>


                            <div className="col-md-1">
                                <label className="col-form-label">EOBI</label>
                                <input
                                    type="text"
                                    className={validity.eobi ? 'form-control' : 'form-control invalid-input'}
                                    style={{ background: editFormData.eobi > 0 ? "#d1d1d1" : "" }}
                                    id="eobi"
                                    name="eobi"
                                    value={editFormData.eobi}
                                    onKeyUp={calculateNetSalary}
                                    onChange={handleChange} />
                            </div>



                            <div className="col-md-1">
                                <label className="col-form-label">CPF</label>
                                <input
                                    type="text"
                                    className={validity.cpf ? 'form-control' : 'form-control invalid-input'}
                                    style={{ background: editFormData.cpf > 0 ? "#d1d1d1" : "" }}
                                    id="cpf"
                                    name="cpf"
                                    value={editFormData.cpf}
                                    onKeyUp={calculateNetSalary}
                                    onChange={handleChange}
                                />
                            </div>



                            <div className="col-md-1">
                                <label className="col-form-label">Prev.T.CPF</label>
                                <input
                                    type="text"
                                    className={validity.previous_total_cpf ? 'form-control' : 'form-control invalid-input'}
                                    style={{ background: editFormData.previous_total_cpf > 0 ? "#d1d1d1" : "" }}
                                    id="previous_total_cpf"
                                    name="previous_total_cpf"
                                    value={editFormData.previous_total_cpf}
                                    onKeyUp={calculateNetSalary}
                                    onChange={handleChange}
                                />
                            </div>




                            <div className="col-md-2">
                                <label className="col-form-label">Old Adhoc (G.Total)</label>
                                <input
                                    type="text"
                                    className={validity.old_adhoc ? 'form-control' : 'form-control invalid-input'}
                                    id="old_adhoc"
                                    name="old_adhoc"
                                    value={editFormData.old_adhoc}
                                    onChange={handleChange}
                                    onKeyUp={calculateNetSalary}
                                />
                            </div>

                            <div className="col-md-2">
                                <label className="col-form-label">Current Adhoc</label>
                                <input
                                    type="text"
                                    className={validity.current_adhoc ? 'form-control' : 'form-control invalid-input'}
                                    id="current_adhoc"
                                    name="current_adhoc"
                                    value={editFormData.current_adhoc}
                                    onChange={handleChange}
                                    onKeyUp={calculateNetSalary}
                                />
                            </div>

                            <div className="col-md-4 d-none">
                                <label className="col-form-label">Total Adhoc</label>
                                <input
                                    type="text"
                                    className={validity.total_adhoc ? 'form-control' : 'form-control invalid-input'}
                                    style={{ background: editFormData.total_adhoc > 0 ? "#d1d1d1" : "" }}
                                    id="total_adhoc"
                                    name="total_adhoc"
                                    value={editFormData.total_adhoc}
                                    readOnly
                                />
                            </div>


                            <div className="col-md-4">
                                <label className="col-form-label">Account# (Bank)</label>
                                <input
                                    type="text"
                                    className={validity.account_no ? 'form-control' : 'form-control invalid-input'}
                                    id="account_no"
                                    name="account_no"
                                    value={editFormData.account_no}
                                    onChange={handleChange}
                                />
                            </div>


                            <div className="col-md-4">
                                <label className="col-form-label" htmlFor="work_shift">Work Shift</label>
                                <select
                                    className={validity.work_shift ? 'form-control' : 'form-control invalid-input'}
                                    id="work_shift"
                                    name="work_shift"
                                    value={editFormData.work_shift}
                                    onChange={handleChange}
                                >
                                    <option value="">Select Work Shift</option> {/* Default option */}
                                    <option value="Morning">Morning</option>
                                    <option value="Evening">Evening</option>
                                    <option value="Both">Both</option>
                                </select>
                            </div>

                            <div className="col-md-4">
                                <label className="col-form-label">2nd Shift Honorarium</label>
                                <input
                                    type="text"
                                    className={validity.second_shift_honorarium ? 'form-control' : 'form-control invalid-input'}
                                    id="second_shift_honorarium"
                                    name="second_shift_honorarium"
                                    value={editFormData.second_shift_honorarium}
                                    onChange={handleChange}
                                    readOnly
                                />
                            </div>

                           


                        </div>

                        <div className="employee-form__section">
                            <h5 className="employee-form__section-title">
                                <i className="fas fa-calculator"></i> Salary Calculation
                            </h5>
                        </div>

                        <div className='row'>
                            <div className="col-md-4">
                                <label className="col-form-label">Prev. G.Total Increments (For Old Employee)</label>
                                <input
                                    type="text"
                                    className={validity.previous_total_increments ? 'form-control' : 'form-control invalid-input'}
                                    style={{ background: editFormData.previous_total_increments > 0 ? "#d1d1d1" : "" }}
                                    id="previous_total_increments"
                                    name="previous_total_increments"
                                    value={parseFloat(editFormData.previous_total_increments)}
                                    onChange={handleChange}
                                    onKeyUp={calculateNetSalary}
                                />
                            </div>


                            <div className="col-md-4">
                                <label className="col-form-label">Current Increment (For Old Employee)</label>
                                <input
                                    type="text"
                                    className={validity.current_increment ? 'form-control' : 'form-control invalid-input'}
                                    style={{ background: editFormData.current_increment > 0 ? "#d1d1d1" : "" }}
                                    id="current_increment"
                                    name="current_increment"
                                    value={parseFloat(editFormData.current_increment)}
                                    onChange={handleChange}
                                    onKeyUp={calculateNetSalary}
                                />
                            </div>


                            {/* <div className="col-md-2">
                                <label className="col-form-label">Income Tax(%)</label>
                                <input
                                    type="text"
                                    className={validity.income_tax ? 'form-control' : 'form-control invalid-input'}
                                    style={{ background: editFormData.income_tax > 0 ? "#d1d1d1" : "" }}
                                    id="income_tax"
                                    name="income_tax"
                                    value={editFormData.income_tax}
                                    onChange={handleChange}
                                />
                            </div> */}

                            {/* <div className="col-md-2">
                                <label className="col-form-label">Rebate (%) </label>
                                <input
                                    type="text"
                                    className={validity.rebate ? 'form-control' : 'form-control invalid-input'}
                                    style={{ background: editFormData.rebate > 0 ? "#d1d1d1" : "" }}
                                    id="rebate"
                                    name="rebate"
                                    value={editFormData.rebate}
                                    onChange={handleChange}
                                />
                            </div> */}

                            <div className="col-md-2 d-none">
                                <label className="col-form-label">Total Basic Salary</label>
                                <input
                                    type="text"
                                    className={validity.total_basic_salary ? 'form-control' : 'form-control invalid-input'}
                                    style={{ background: editFormData.total_basic_salary > 0 ? "#d1d1d1" : "" }}
                                    id="total_basic_salary"
                                    name="total_basic_salary"
                                    value={editFormData.total_basic_salary}
                                    onChange={handleChange}
                                />
                            </div>


                            <div className="col-md-4">
                                <label className="col-form-label">Total Gross Salary</label>
                                <input
                                    type="text"
                                    className={'form-control'}
                                    // style={{ background: editFormData.total_net_salary > 0 ? "#d1d1d1" : "" }}
                                    id="total_gross_salary"
                                    name="total_gross_salary"
                                    value={editFormData.total_gross_salary}
                                    readOnly
                                />
                            </div>



                            <div className="col-md-2 d-none">
                                <label className="col-form-label">Total Net Salary</label>
                                <input
                                    type="text"
                                    className={'form-control'}
                                    style={{ background: editFormData.actual_total_net_salary > 0 ? "#d1d1d1" : "" }}
                                    id="actual_total_net_salary"
                                    name="actual_total_net_salary"
                                    value={editFormData.actual_total_net_salary}
                                    // readOnly
                                />
                            </div>


                            <div className="col-md-2 d-none">
                                <label className="col-form-label">Total Net Salary</label>
                                <input
                                    type="text"
                                    className={validity.total_net_salary ? 'form-control' : 'form-control invalid-input'}
                                    style={{ background: editFormData.total_net_salary > 0 ? "#d1d1d1" : "" }}
                                    id="total_net_salary"
                                    name="total_net_salary"
                                    value={editFormData.total_net_salary}
                                    // readOnly
                                />
                            </div>


                        </div>


                       
                        <div className="employee-form__section">
                            <h5 className="employee-form__section-title">
                                <i className="fas fa-bus"></i> Bus Charges Detail
                            </h5>
                        </div>

                        <div className="row">

                        <div className="col-md-4">
                                <label className="col-form-label" htmlFor="bus_status">Bus Status</label>
                                <select
                                    className={validity.bus_status ? 'form-control' : 'form-control invalid-input'}
                                    id="bus_status"
                                    name="bus_status"
                                    value={editFormData.bus_status}
                                    onChange={handleChange}
                                >
                                    <option value="">Select Bus Status</option>
                                    <option>On</option>
                                    <option>Off</option>
                                </select>
                            </div>

                            <div className="col-md-4">
                                <label className="col-form-label">Bus Charges</label>
                                <input
                                    type="text"
                                    className={validity.bus_charges ? 'form-control' : 'form-control invalid-input'}
                                    style={{ background: editFormData.bus_charges > 0 ? "#d1d1d1" : "" }}
                                    id="bus_charges"
                                    name="bus_charges"
                                    
                                    onChange={handleChange}
                                    onKeyUp={calculateNetSalary}
                                    value={editFormData.bus_charges}
                                />
                            </div>

                        </div>



                        <div className="employee-form__section">
                            <h5 className="employee-form__section-title">
                                <i className="fas fa-shield-alt"></i> Security Detail
                            </h5>
                        </div>

                        <div className="row">

                            <div className="col-md-4 d-none">
                                <label className="col-form-label" htmlFor="status">Security (No of Installments)</label>
                                <select
                                    className={'form-control'}
                                    id="security_no_of_installment"
                                    name="security_no_of_installment"
                                    value={editFormData.security_no_of_installment}
                                    onChange={handleChange}
                                >
                                    {/* <option value="" >Select Security (No of Installments)</option>  */}
                                    <option>0</option>
                                    <option>1</option>
                                    <option>2</option>
                                    <option>3</option>
                                    <option>4</option>
                                    <option>5</option>
                                    <option>6</option>
                                    <option>7</option>
                                    <option>8</option>
                                    <option>9</option>
                                    <option>10</option>
                                </select>
                            </div>



                            <div className="col-md-4">
                                <label className="col-form-label">Security Deduction</label>
                                <input
                                    type="text"
                                    className={validity.security_deduction ? 'form-control' : 'form-control invalid-input'}
                                    style={{ background: editFormData.security_deduction > 0 ? "#d1d1d1" : "" }}
                                    id="security_deduction"
                                    name="security_deduction"
                                    onChange={handleChange}
                                    onKeyUp={calculateNetSalary}
                                    value={editFormData.security_deduction}
                                    // readOnly

                                />
                            </div>


                            <div className="col-md-4">
                                <label className="col-form-label">Security Deduction (Remaining)</label>
                                <input
                                    type="text"
                                    className={validity.total_security_deduction ? 'form-control' : 'form-control invalid-input'}
                                    style={{ background: editFormData.total_security_deduction > 0 ? "#d1d1d1" : "" }}
                                    id="total_security_deduction"
                                    name="total_security_deduction"
                                    // readOnly
                                    onChange={handleChange}
                                    onKeyUp={calculateNetSalary}
                                    value={editFormData.total_security_deduction}

                                />
                            </div>


                            <div className="col-md-4">
                                <label className="col-form-label">T.Security Deduction</label>
                                <input
                                    type="text"
                                    className={validity.overall_security_deduction ? 'form-control' : 'form-control invalid-input'}
                                    style={{ background: editFormData.overall_security_deduction > 0 ? "#d1d1d1" : "" }}
                                    id="overall_security_deduction"
                                    name="overall_security_deduction"
                                    // // readOnly
                                    onChange={handleChange}
                                    // onKeyUp={calculateNetSalary}
                                    value={editFormData.overall_security_deduction}

                                />
                            </div>

                          
                        </div>




                        <div className="employee-form__section">
                            <h5 className="employee-form__section-title">
                                <i className="fas fa-hand-holding-usd"></i> Loan Detail
                            </h5>
                        </div>


                        <div className="row">

                        <div className="col-md-4 d-none">
                                <label className="col-form-label" htmlFor="status">Loan (No of Installments)</label>
                                <select
                                    className={'form-control'}
                                    id="loan_no_of_installment"
                                    name="loan_no_of_installment"
                                    value={editFormData.loan_no_of_installment}
                                    onChange={handleChange}
                                >
                                    {/* <option value="" >Select Loan (No of Installments)</option>  */}
                                    <option>0</option>
                                    <option>1</option>
                                    <option>2</option>
                                    <option>3</option>
                                    <option>4</option>
                                    <option>5</option>
                                    <option>6</option>
                                    <option>7</option>
                                    <option>8</option>
                                    <option>9</option>
                                    <option>10</option>
                                </select>
                            </div>



                            
                            <div className="col-md-4">
                                <label className="col-form-label">Loan Deduction</label>
                                <input
                                    type="text"
                                    className={validity.loan_deduction ? 'form-control' : 'form-control invalid-input'}
                                    style={{ background: editFormData.loan_deduction > 0 ? "#d1d1d1" : "" }}
                                    id="loan_deduction"
                                    name="loan_deduction"
                                    // readOnly
                                    onChange={handleChange}
                                    onKeyUp={calculateNetSalary}
                                    value={editFormData.loan_deduction}
                                />
                            </div>




                            
                            <div className="col-md-4">
                                <label className="col-form-label">T.Loan</label>
                                <input
                                    type="text"
                                    className={validity.loan ? 'form-control' : 'form-control invalid-input'}
                                    style={{ background: editFormData.loan > 0 ? "#d1d1d1" : "" }}
                                    id="loan"
                                    name="loan"
                                    
                                    onChange={handleChange}
                                    onKeyUp={calculateNetSalary}
                                    value={editFormData.loan}
                                />
                            </div>

                        </div>


                        <div className="employee-form__section">
                            <h5 className="employee-form__section-title">
                                <i className="fas fa-gift"></i> Other Allowances Detail
                            </h5>
                        </div>


                        <div className="row">

                        <div className="col-md-4">
                                <label className="col-form-label">Medical Allownce</label>
                                <input
                                    type="text"
                                    className={validity.medical_allownce ? 'form-control' : 'form-control invalid-input'}
                                    style={{ background: editFormData.medical_allownce > 0 ? "#d1d1d1" : "" }}
                                    id="medical_allownce"
                                    name="medical_allownce"
                                    
                                    onChange={handleChange}
                                    onKeyUp={calculateNetSalary}
                                    value={editFormData.medical_allownce}
                                />
                            </div>


                            <div className="col-md-4">
                                <label className="col-form-label">Special Allownce</label>
                                <input
                                    type="text"
                                    className={validity.special_allownce ? 'form-control' : 'form-control invalid-input'}
                                    style={{ background: editFormData.special_allownce > 0 ? "#d1d1d1" : "" }}
                                    id="special_allownce"
                                    name="special_allownce"
                                    
                                    onChange={handleChange}
                                    onKeyUp={calculateNetSalary}
                                    value={editFormData.special_allownce}
                                />
                            </div>


                            <div className="col-md-4">
                                <label className="col-form-label">Principal Allownce</label>
                                <input
                                    type="text"
                                    className={validity.principal_allownce ? 'form-control' : 'form-control invalid-input'}
                                    style={{ background: editFormData.principal_allownce > 0 ? "#d1d1d1" : "" }}
                                    id="principal_allownce"
                                    name="principal_allownce"
                                    
                                    onChange={handleChange}
                                    onKeyUp={calculateNetSalary}
                                    value={editFormData.principal_allownce}
                                />
                            </div>


                        </div>





                        <div className="employee-form__submit-row">
                            <button type="submit" className="btn btn-primary employee-form__submit">
                                <i className="fas fa-save"></i> Submit
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
}

export default EmployeeForm;
