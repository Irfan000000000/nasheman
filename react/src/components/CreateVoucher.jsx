import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import Select from 'react-select';
import { useAuth } from './AuthContext';
import AcademicSessionContext from './AcademicSessionContext';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const CreateVoucher = () => {
   
    const { user } = useAuth();
    const { academicSession } = useContext(AcademicSessionContext);
    const [showData, setShowData] = useState(false);

    const [getMainHead, setMainHeads] = useState([]);
    const [getSubHead, setSubHeads] = useState([]);
     const [loading, setLoading] = useState(true);


     const [scrollVouchers, setScrollVouchers] = useState([]);
     const [filteredVouchers, setFilteredVouchers] = useState(scrollVouchers);


    const [financeVoucherData, setFinanceVoucherData] = useState(null);
    const [showFeeVoucherInvoice, setShowFeeVoucherInvoice] = useState(false);


    const [voucherInvoiceNumber, setVoucherInvoiceNumber] = useState('');
    const [voucherNumber, setVoucherNumber] = useState('');


    const [oldVoucherNumber, setOldVoucherNumber] = useState('');
    const [oldVoucherType, setOldVoucherType] = useState('');
    const [newVoucherType, setNewVoucherType] = useState('');



    const initialState = {
        main_head_id: '',
        sub_head_id: '',
        debit: 0,
        credit: 0,
        main_head_name: '',
        voucher_date: '',
        cheque_no: '',
        voucher_type: '',
        description: '',
        voucher_subject: '',
        search_frontend : '',
        voucher_invoice_no:'',
        voucher_number:'',
        hidden_id:'',
        campus_id: user.user.campus_id,
        session_id: academicSession

    }

    // const [editFormData, setEditFormData] = useState({initialState});

    const [editFormData, setEditFormData] = useState({ ...initialState });


    const [validity, setValidity] = useState({
        main_head_id: true,
        voucher_date: true,
        cheque_no: true,
        voucher_type: true,
        description: true,
        voucher_subject: true
    });


    const [validityForLedger, setValidityForLedger] = useState({
        main_head_id: true,
        sub_head_id:true,
        // debit:true,
        // credit:true
    });
    
    const [entries, setEntries] = useState([]);
    const [isEditing, setIsEditing] = useState(false);
    const [currentEditIndex, setCurrentEditIndex] = useState(null);

    // Fetch main heads
    useEffect(() => {
        const fetchMainHeads = () => {
            axios.get(process.env.REACT_APP_API_BASE_URL+"/get-account-main-heads")
                .then(res => {
                    setMainHeads(res.data.results);
                })
                .catch(err => console.log(err));
        };
        fetchMainHeads();
    }, []);



    // useEffect(() => {
    //     setEntries((prevEntries) =>
    //         prevEntries.map(entry => ({
    //             ...entry, 
    //             voucher_date: editFormData.voucher_date || entry.voucher_date,
    //             voucher_subject: editFormData.voucher_subject || entry.voucher_subject,
    //             cheque_no: editFormData.cheque_no || entry.cheque_no,
    //             voucher_type: editFormData.voucher_type || entry.voucher_type,
    //             description: editFormData.description || entry.description,
    //             voucher_number : editFormData.voucher_type == oldVoucherType ? oldVoucherNumber : entry.voucher_number,
    //         }))
    //     );
    // }, [editFormData]);




    useEffect(() => {
        setEntries((prevEntries) =>
            prevEntries.map(entry => {
                // Compute the new voucher number
                const updatedVoucherNumber = editFormData.voucher_type === oldVoucherType ? oldVoucherNumber : '';
                
                // Log values before returning
                console.log("Voucher Number Update:", {
                    "Entry Voucher Number": entry.voucher_number,
                    "Edit Form Voucher Type": editFormData.voucher_type,
                    "Old Voucher Type": oldVoucherType,
                    "Old Voucher Number": oldVoucherNumber,
                    "Updated Voucher Number": updatedVoucherNumber
                });
    
                return {
                    ...entry, 
                    voucher_date: editFormData.voucher_date || entry.voucher_date,
                    voucher_subject: editFormData.voucher_subject || entry.voucher_subject,
                    cheque_no: editFormData.cheque_no || entry.cheque_no,
                    voucher_type: editFormData.voucher_type || entry.voucher_type,
                    description: editFormData.description || entry.description,
                    voucher_number: updatedVoucherNumber,
                };
            })
        );

        setNewVoucherType(editFormData.voucher_type == oldVoucherType ? oldVoucherType : editFormData.voucher_type);
    }, [editFormData]);
    
    
    



    // Fetch sub heads based on selected main head
    useEffect(() => {
        const fetchSubHeads = (main_head_id) => {
            axios.get(process.env.REACT_APP_API_BASE_URL+`/get-account-sub-heads/${main_head_id}`)
                .then(res => {
                    setSubHeads(res.data.results);
                })
                .catch(err => console.log(err));
        };
        if (editFormData.main_head_id) {
            fetchSubHeads(editFormData.main_head_id);
        }
    }, [editFormData.main_head_id]);


    

    // Handle form submission (Add new row or Edit existing row)
    const handleSubmit = (e) => {
        e.preventDefault();

        
        if(validateLedger()){

            if (isEditing) {
                const updatedEntries = [...entries];
                updatedEntries[currentEditIndex] = { ...editFormData };
                setEntries(updatedEntries);
                setIsEditing(false);
                setCurrentEditIndex(null);
            } else {
                setEntries([...entries, { ...editFormData }]);
            }
    
            // Reset the form after submission
            setEditFormData(() => ({
                ...editFormData,
                // main_head_id: '',
                // sub_head_id: '',
                debit:'0',
                credit:'0'
            }));
            
        }
        
        

        // getSubHead([])
        
    };



    // const editFinanceVoucher = (finance_voucher_invoice_no, campus_id, session_id) => {

    //     axios.get(process.env.REACT_APP_API_BASE_URL+`/get-finance-voucher/${finance_voucher_invoice_no}/${campus_id}/${session_id}`)
    //         .then(response => {

    //             console.log(response.data);

    //             // const admissionData = response.data;
    //             // localStorage.setItem('admission', JSON.stringify(admissionData));
    //             // setShowEdit(true);
    //             // // navigate('/admission-form-edit');

    //         })
    //         .catch(error => {
    //             console.error('Error:', error);
    //         });
    // }



    const editFinanceVoucher = (finance_voucher_invoice_no, campus_id, session_id) => {
    axios.get(process.env.REACT_APP_API_BASE_URL+`/get-finance-voucher/${finance_voucher_invoice_no}/${campus_id}/${session_id}`)
        .then(response => {
            console.log(response.data);
            
            const voucherData = response.data.results;

            // Assuming response contains only one voucher entry or a list, extract the first one
            if (voucherData.length > 0) {
                const selectedVoucher = voucherData[0]; 

                setVoucherInvoiceNumber(selectedVoucher.voucher_invoice_no);
                setVoucherNumber(selectedVoucher.voucher_number);

                setEditFormData({
                    ...editFormData,  // Retain other form states
                    voucher_date: selectedVoucher.voucher_date || '',
                    cheque_no: selectedVoucher.cheque_no || '',
                    voucher_type: selectedVoucher.voucher_type || '',
                    description: selectedVoucher.description || '',
                    voucher_subject: selectedVoucher.voucher_subject || '',
                    voucher_invoice_no:  selectedVoucher.voucher_invoice_no || '',
                    // voucher_number: selectedVoucher.voucher_number || '',
                    session_id: selectedVoucher.session_id,
                    campus_id: selectedVoucher.campus_id
                });
                setOldVoucherType(selectedVoucher.voucher_type);
                setOldVoucherNumber(selectedVoucher.voucher_number);

                // Also set the entries list if there are multiple line items
                if (voucherData.length > 0) {
                    setEntries(voucherData);
                }

            }

            setShowData(false);
            
        })
        .catch(error => {
            console.error('Error fetching finance voucher:', error);
        });


       
    };


    

    const deleteFinanceVoucher = (invoice_no, campus_id, session_id) => {
        const confirmDeletion = window.confirm('Deleted Voucher! Are you sure?');
        if (confirmDeletion) {
            axios
                .delete(process.env.REACT_APP_API_BASE_URL+`/delete-finance-voucher/${invoice_no}/${campus_id}/${session_id}`)
                .then(response => {
                    console.log('Deleted successfully:', response.data);
                    // Update the state to remove the deleted admission
                    setFilteredVouchers(prevData => prevData.filter(finance_voucher => finance_voucher.voucher_invoice_no !== invoice_no));
                })
                .catch(error => {
                    console.error('Error deleting:', error);
                });
        }
    };





    // Calculate totals for Debit and Credit columns
    const calculateTotal = (type) => {
        return entries.reduce((sum, entry) => sum + parseFloat(entry[type] || 0), 0);
    };

    // Save all entries (e.g., to an API or local storage)
    // const handleSave = () => {
    //     // Save logic goes here (e.g., API call or local storage)
    //     console.log("Saving entries:", entries);
    // };



    const validateForm = () => {
        let isValid = true;
       
        if (!editFormData.voucher_date) {
            setValidity((prevState) => ({ ...prevState, voucher_date: false }));
            isValid = false;
        }


        if (!editFormData.cheque_no) {
            setValidity((prevState) => ({ ...prevState, cheque_no: false }));
            isValid = false;
        }

        if (!editFormData.voucher_type) {
            setValidity((prevState) => ({ ...prevState, voucher_type: false }));
            isValid = false;
        }

        if (!editFormData.description) {
            setValidity((prevState) => ({ ...prevState, description: false }));
            isValid = false;
        }

        if (!editFormData.voucher_subject) {
            setValidity((prevState) => ({ ...prevState, voucher_subject: false }));
            isValid = false;
        }

        return isValid;
    };


    
    const validateLedger = () => {
        let isValid = true;
       
        if (!editFormData.main_head_id) {
            setValidityForLedger((prevState) => ({ ...prevState, main_head_id: false }));
            isValid = false;
        }

        if (!editFormData.sub_head_id) {
            setValidityForLedger((prevState) => ({ ...prevState, sub_head_id: false }));
            isValid = false;
        }

        // if (!editFormData.debit) {
        //     setValidityForLedger((prevState) => ({ ...prevState, debit: false }));
        //     isValid = false;
        // }

        // if (!editFormData.credit) {
        //     setValidityForLedger((prevState) => ({ ...prevState, credit: false }));
        //     isValid = false;
        // }

        return isValid;
    };

    
    const handleSave = async (e) => {
        e.preventDefault();
        // console.log("save enteries", entries);
        // console.log(validateForm());

        if (validateForm()) {
        if(calculateTotal('debit') == calculateTotal('credit')){

                try {
                    let campus_id = user.user.campus_id;
                    const payload = {
                        entries,
                        voucherInvoiceNumber,
                        voucherNumber,
                        oldVoucherType,
                        newVoucherType,
                        campus_id
                      };
    
                    const response = await axios.post(process.env.REACT_APP_API_BASE_URL+'/insert-create-voucher-finance', payload, {
                        headers: {
                            'Content-Type': 'application/json', // Set content type to JSON
                        },
                    });
    
                    // if (editFormData.hidden_id !== "") {
                    //     toast.success('Data updated successfully!');
                    //     console.log('Data Updated successfully:', response.data);
                        
                    // } else {
                        toast.success('Data Saved successfully!');
                        console.log('Data Saved successfully:', response.data);
                    // }
    
                    setEditFormData({
                        ...initialState, // Copy the initialState
                        main_head_id: '',
                        sub_head_id: '',
                        debit: 0,
                        credit: 0,
                        main_head_name: '',
                        voucher_date: '',
                        cheque_no: '',
                        voucher_type: '',
                        description: '',
                        voucher_subject: '',
                        session_id: academicSession, // Retain session_id
                        campus_id:user.user.campus_id
                    });
    
                     setEntries([]);
                     setVoucherInvoiceNumber('');
                     setVoucherNumber('');
                     setOldVoucherNumber('');
                     setOldVoucherType('');
                     setNewVoucherType('');
    
                } catch (error) {
                    // console.error('There was an error!', error);
                   
                }
    
      

        }else{
            toast.error('Debit and Credit amounts must be equal!');
        }

    };




}
    

    const handleMainHead = (e) => {
        setEditFormData({ ...editFormData, main_head_id: e.value, main_head_name: e.label });
        setValidity({ ...validity, main_head_id: true });
    };




    const handleParentHeadChange = (e) => {
                // Set the selected code in the form data
                setEditFormData({ ...editFormData, sub_head_id: e.value, sub_head_name:e.label });
                // Filter levels based on the selected Parent Head's leve
                // Mark the validity of the field as true
                setValidity({ ...validity, sub_head_id: true });
    };

    // const handleEditRow = (index) => {
    //     const rowData = entries[index];
    //     console.log("this is row data", rowData);
    //     // setEditFormData({ ...rowData });

    //     setEditFormData({
    //         ...rowData,  // Load existing row data into the form
    //         main_head_id: rowData.main_head_id,
    //         main_head_name: rowData.main_head_name,
    //         sub_head_id: rowData.sub_head_id,
    //         sub_head_name: rowData.sub_head_name,
    //     });

    //     setIsEditing(true);
    //     setCurrentEditIndex(index);
    // };


    const handleEditRow = (index) => {
        const rowData = entries[index];

        // // Find the matching Main Head and Sub Head from available options
        // const selectedMainHead = getMainHead.find(head => head.id === rowData.main_head_id);
        // const selectedSubHead = getSubHead.find(sub => sub.id === rowData.sub_head_id);
    
        setEditFormData({
            ...rowData
        });
    
        setIsEditing(true);
        setCurrentEditIndex(index);
    };
    

    const handleRemoveRow = (index) => {
        const updatedEntries = entries.filter((_, i) => i !== index);
        setEntries(updatedEntries);
    };


    const handleDeleteRow = (id) => {

        const confirmDeletion = window.confirm('Deleted! Are you sure?');
        if (confirmDeletion) {
            axios
                .delete(process.env.REACT_APP_API_BASE_URL+`/delete-finance-voucher-sub-head/${id}`)
                .then(response => {
                    toast.error('Deleted Successfully!');
                   const updatedEntries = entries.filter((entry) => entry.id !== id);
                   setEntries(updatedEntries);
                  
                })
                .catch(error => {
                    console.error('Error deleting Admission:', error);
                });
        }
        
    };



    const handleDebitChange = (index, value) => {
        const updatedEntries = [...entries];
        updatedEntries[index].debit = value;
        setEntries(updatedEntries);
    };

    const handleCreditChange = (index, value) => {
        const updatedEntries = [...entries];
        updatedEntries[index].credit = value;
        setEntries(updatedEntries);
    };

    const options = [
        { value: 'Journal Voucher', label: 'Journal Voucher' },
        { value: 'Bank Payment Voucher', label: 'Bank Payment Voucher' },
        { value: 'Bank Receipt Voucher', label: 'Bank Receipt Voucher' }
    ];



    useEffect(() => {
        console.log('User:', user);
        console.log('Academic Session:', academicSession);
    }, [user, academicSession]);


    // useEffect(() => {
    //     console.log(voucherNumber, voucherInvoiceNumber);
    // }, [voucherNumber, voucherInvoiceNumber]);

    
    

    const fetchData = () => {
        setLoading(true);

        const { from_date, to_date} = editFormData;

        let url = '';
        let params = {
            campus_id: user.user.campus_id,
            session_id: academicSession,
        };

        setLoading(false);
        setShowData(true);
        url = process.env.REACT_APP_API_BASE_URL+'/get-finance-fee-voucher';
        
        axios.get(url, { params })
            .then(res => {
               
                    setScrollVouchers([]);
                    setFilteredVouchers([]);
                    setScrollVouchers(res.data.feeVouchers);
                    setFilteredVouchers(res.data.feeVouchers)
                    setLoading(false);
                    setShowData(true);
            })
            .catch(err => {
                console.log(err);
                setLoading(false);
            });
    };


    const exportReportToExcel = () => {}


    const getReportTitle = () => {
       return "Finance Vouchers Report";
    };


  

    // useEffect(() => {
    //     if (editFormData.search_frontend) {
    //       const searchQuery = editFormData.search_frontend.toLowerCase();
    //       const filtered = scrollVouchers.filter((voucher) =>
          
    //         voucher.voucher_invoice_no.includes(searchQuery) ||
    //         voucher.voucher_subject.includes(searchQuery) 
           
    //       );
    //       setFilteredVouchers(filtered);
    //     } else {
    //       setFilteredVouchers(scrollVouchers); // Show all vouchers if search query is empty
    //     }
    //   }, [editFormData.search_frontend, scrollVouchers]); // Add dependencies here

    
    useEffect(() => {
        if (editFormData.search_frontend) {
            const searchQuery = editFormData.search_frontend.toLowerCase();
            const filtered = scrollVouchers.filter((voucher) =>
                String(voucher.voucher_invoice_no || "").includes(searchQuery) || 
                String(voucher.voucher_subject || "").toLowerCase().includes(searchQuery) ||
                String(voucher.voucher_number || "").toLowerCase().includes(searchQuery)
            );
            setFilteredVouchers(filtered);
        } else {
            setFilteredVouchers(scrollVouchers); // Show all vouchers if search query is empty
        }
    }, [editFormData.search_frontend, scrollVouchers]);
    


      const viewFinanceVoucher = (finance_voucher_invoice_no, campus_id, session_id) => {

        axios.get(process.env.REACT_APP_API_BASE_URL+`/view-finance-voucher/${finance_voucher_invoice_no}/${campus_id}/${session_id}`)
            .then(response => {
                // console.log(response.data.results);
                setFinanceVoucherData(response.data.results);
                setShowFeeVoucherInvoice(true);
            })
            .catch(error => {
                console.error('Error:', error);
            });

    };


    const handleHide = () => {
        setShowFeeVoucherInvoice(false);
        setFinanceVoucherData(null);
    }



    return (
        <div className='pt-1 pb-1'>
            <h5 className='text-warning bg-primary p-2 card-header border'>
                <i className="fas fa-university"></i> Create Voucher
            </h5>
            

            <form onSubmit={handleSubmit} className='p-2 border'>
            <div className='d-flex justify-content-end'>
            {/* <a className='btn btn-sm btn-warning' onClick={fetchData} href='#'><i className='fas fa-book'></i> General Ledger</a> */}
            <a className='btn btn-sm btn-warning ml-2' onClick={fetchData} href='#'><i className='fas fa-eye'></i>  View Vouchers List</a>
           </div>
                <div className="form-group row mt-3">

                    
                    <label htmlFor="voucher_subject" className="col-sm-1 col-form-label">V.Subject</label>
                    <div className="col-sm-5">
                        <input
                            type="text"
                            name="voucher_subject"
                            value={editFormData.voucher_subject}
                            onChange={(e) => {
                                setEditFormData({ ...editFormData, voucher_subject: e.target.value });
                                setValidity({ ...validity, voucher_subject: true });
                            }}
                            className={validity.voucher_subject ? 'form-control' : 'form-control invalid-input'}
                            placeholder="Voucher Subject...."
                        />
                    </div>
                  
                </div>
                <div className="form-group row">
                    <label htmlFor="voucher_date" className="col-sm-1 col-form-label">V.Date</label>
                    <div className="col-sm-5">
                        <input
                            type="date"
                            name="voucher_date"
                            value={editFormData.voucher_date}
                            onChange={(e) => {
                                setEditFormData({ ...editFormData, voucher_date: e.target.value });
                                setValidity({ ...validity, voucher_date: true });
                            }}
                            className={validity.voucher_date ? 'form-control' : 'form-control invalid-input'}
                        />
                    </div>
                    <label htmlFor="cheque_no" className="col-sm-1 col-form-label">TT/DD/Cheque#</label>
                    <div className="col-sm-5">
                        <input
                            type="text"
                            name="cheque_no"
                            value={editFormData.cheque_no}
                           
                            onChange={(e) => {
                                setEditFormData({ ...editFormData, cheque_no: e.target.value });
                                setValidity({ ...validity, cheque_no: true });
                            }}
                            className={validity.cheque_no ? 'form-control' : 'form-control invalid-input'} 
                            placeholder="Cheque No...."
                        />
                    </div>
                </div>
                <div className="form-group row">
                <label htmlFor="voucher_type" className="col-sm-1 col-form-label">V.Type</label>
                    <div className="col-sm-5">
                        <select
                            value={editFormData.voucher_type}
                            onChange={(e) => {
                                setEditFormData({ ...editFormData, voucher_type: e.target.value });
                                setValidity({ ...validity, voucher_type: true });
                            }}
                            className={validity.voucher_type ? 'form-control' : 'form-control invalid-input'} 
                            
                            >
                            <option value="" disabled>Select Voucher Type</option>
                            {options.map((option) => (
                                <option key={option.value} value={option.value}>{option.label}</option>
                            ))}
                        </select>
                    </div>
                    <label htmlFor="description" className="col-sm-1 col-form-label">Description</label>
                    <div className="col-sm-5">
                        <input
                            type="text"
                            name="description"
                            value={editFormData.description}
                            onChange={(e) => {
                                setEditFormData({ ...editFormData, description: e.target.value });
                                setValidity({ ...validity, description: true });
                            }}
                            className={validity.description ? 'form-control' : 'form-control invalid-input'} 
                            placeholder="Description...."
                        />
                    </div>
                </div>

                <h5 className='mt-5 text-warning'>Add Voucher</h5>
                <hr />
                <div className="form-group row">
                    <label htmlFor="main_head" className="col-sm-1 col-form-label">Main Head</label>
                    <div className="col-sm-5">
                        {/* <Select
                            name="main_head_name"
                            onChange={handleMainHead}
                            options={getMainHead.map(mainHead => ({
                                value: mainHead.id,
                                label: `${mainHead.main_head_name}`
                            }))}
                            placeholder="Select Main Heads"
                        /> */}

                    <Select
                        name="main_head_id"
                        value={getMainHead.find(head => head.id === editFormData.main_head_id) 
                            ? { value: editFormData.main_head_id, label: editFormData.main_head_name }
                            : null}
                        // onChange={e => setEditFormData({ 
                        //     ...editFormData, 
                        //     main_head_id: e.value, 
                        //     main_head_name: e.label,
                        //     sub_head_id: '', // Reset sub head when main head changes
                        //     sub_head_name: '' 
                        // } )}

                        className={validityForLedger.main_head_id ? '' : 'invalid-input'} 

                        onChange={(e) => {
                            setEditFormData({ ...editFormData, 
                                main_head_id: e.value,
                                main_head_name: e.label,
                                sub_head_id: '',
                                sub_head_name: '' 
                            });
                            setValidityForLedger({ ...validityForLedger, main_head_id: true });
                        }}
                        options={getMainHead.map(mainHead => ({
                            value: mainHead.id,
                            label: mainHead.main_head_name
                        }))}
                        placeholder="Select Main Heads"
                    />


                    </div>
                    <label htmlFor="sub_head" className="col-sm-1 col-form-label">Sub Head</label>
                    <div className="col-sm-5">
                       {/* <Select
                            name="sub_head_id"
                            onChange={handleParentHeadChange} // Handle value change
                            options={getSubHead.map(subHead => ({
                                value: subHead.id,
                                label: `${subHead.name} (${subHead.code}) (Level - ${subHead.level})`
                            }))}
                            placeholder="Select Sub Heads"
                        /> */}


                        <Select
                            name="sub_head_id"
                            value={getSubHead.find(sub => sub.id === editFormData.sub_head_id) 
                                ? { value: editFormData.sub_head_id, label: editFormData.sub_head_name }
                                : null}
                                className={validityForLedger.sub_head_id ? '' : 'invalid-input'} 
                            // onChange={e => setEditFormData({ 
                            //     ...editFormData, 
                            //     sub_head_id: e.value, 
                            //     sub_head_name: e.label 
                            // })}

                            onChange={(e) => {
                                setEditFormData({ ...editFormData, 
                                    sub_head_id: e.value,
                                    sub_head_name: e.label,
                                });
                                setValidityForLedger({ ...validityForLedger, sub_head_id: true });
                            }}

                            options={getSubHead.map(subHead => ({
                                value: subHead.id,
                                label: `${subHead.name} (${subHead.code}) (Level - ${subHead.level})`
                            }))}
                            placeholder="Select Sub Heads"
                        />
                    </div>
                </div>
                <div className="form-group row">
                    <label htmlFor="debit" className="col-sm-1 col-form-label">Debit</label>
                    <div className="col-sm-2">
                        <input
                            type="number"
                            name="debit"
                            value={editFormData.debit}
                            onChange={(e) => setEditFormData({ ...editFormData, debit: e.target.value })}
                            className="form-control"
                            placeholder="Debit"
                        />
                    </div>
                    <label htmlFor="credit" className="col-sm-1 col-form-label">Credit</label>
                    <div className="col-sm-2">
                        <input
                            type="number"
                            name="credit"
                            value={editFormData.credit}
                            onChange={(e) => setEditFormData({ ...editFormData, credit: e.target.value })}
                            className="form-control"
                            placeholder="Credit"
                        />
                    </div>
                </div>

                <button type="submit" className="btn btn-warning">
                    {isEditing ? 'Update' : 'Add'}
                </button>
            </form>

            <div className="table-responsive mt-4">
                <table className="table table-bordered">
                    <thead>
                        <tr>
                            <th>Main Head</th>
                            <th>Sub Head</th>
                            <th>Debit</th>
                            <th>Credit</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {entries.map((entry, index) => (
                            <tr key={index}>
                                <td>{entry.main_head_name}</td>
                                <td>{entry.sub_head_name}</td>
                                <td>
                                    <input
                                        type="number"
                                        value={entry.debit}
                                        onChange={(e) => handleDebitChange(index, e.target.value)}
                                        className="form-control"
                                    />
                                </td>
                                <td>
                                    <input
                                        type="number"
                                        value={entry.credit}
                                        onChange={(e) => handleCreditChange(index, e.target.value)}
                                        className="form-control"
                                    />
                                </td>
                                <td>
                                    <button
                                        onClick={() => handleEditRow(index)}
                                        className="btn btn-warning btn-sm"><i className="fas fa-edit"></i></button>
                                        {console.log(entry.id, "test")}
                                    {entry.id !== undefined  ? (
                                        <button
                                            onClick={() => handleDeleteRow(entry.id)}
                                            className="btn btn-danger btn-sm ml-2"
                                        >
                                       <i className="fas fa-trash-alt"></i>
                                        </button>
                                    ) : (
                                        <button
                                            onClick={() => handleRemoveRow(index)}
                                            className="btn btn-danger btn-sm ml-2"
                                        >
                                           <i className="fas fa-trash-alt"></i>
                                        </button>
                                    )}

                                    
                                </td>
                            </tr>
                        ))}
                        <tr>
                            <td colSpan="2"><strong>Total</strong></td>
                            <td><strong>{calculateTotal('debit')}</strong></td>
                            <td><strong>{calculateTotal('credit')}</strong></td>
                            <td></td>
                        </tr>
                    </tbody>
                </table>

                <button onClick={handleSave} className="btn btn-primary">Save</button>
            </div>


             <div className="col-12">
                                    {showData && (
                                        <div style={{
                                            border: '1px solid #ddd',
                                            padding: '10px',
                                            position: 'fixed',
                                            left: '50%',
                                            top: '50%',
                                            transform: 'translate(-50%, -50%)',
                                            zIndex: '100',
                                            backdropFilter: 'blur(10px)',
                                            width: '90%',
                                            maxWidth: '1800px',
                                            maxHeight: '90vh',
                                            overflow: 'hidden',  // Prevent the whole modal from scrolling
                                            backgroundColor: 'white',
                                            // borderRadius: '10px',
                                            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                                            textAlign: 'left',
                                            display: 'flex',
                                            flexDirection: 'column',
                                            alignItems: 'center'
                                        }}>
                                            <h5 style={{
                                                backgroundColor: "#007bff",
                                                color: "#ffc107",
                                                textAlign: "left",
                                                padding: "8px",
                                                width: "100%",
                                                marginBottom: "0"
                                            }}>{getReportTitle()}</h5>
                                            <button
                                                onClick={() => setShowData(false)}
                                                style={{
                                                    position: 'absolute',
                                                    top: '15px',
                                                    right: '15px',
                                                    background: 'transparent',
                                                    border: 'none',
                                                    fontSize: '20px',
                                                    cursor: 'pointer',
                                                    color: "#ffc107"
                                                }}
                                            >
                                                &times;
                                            </button>
                                            <div className='p-2 d-flex justify-content-end w-100'>
                                                {/* <button className="btn btn-sm btn-warning" onClick={generateExcel}>Download Excel</button> */}
                                                <button onClick={exportReportToExcel} className="btn btn-success m-2">
                                                Export to Excel
                                            </button>
                                            </div>
                                            <div style={{ width: '100%', overflowY: 'auto', maxHeight: 'calc(90vh - 80px)' }}>  {/* Make the content area scrollable */}
                                            
                                            <div className='d-flex justify-content-end'>
                                           
                                            </div>
                                                
                                                    <div className=''>
                                                        {loading ? (
                                                            <p>Loading...</p>
                                                        ) : 
                                                        (
                                                            <div className=''>
                                            <div className='d-flex justify-content-end'>
                                            <input
                                                    type="text"
                                                    className='form-control col-md-3 mb-1'
                                                    value={editFormData.search_frontend}
                                                    onChange={(e) => setEditFormData({ ...editFormData, search_frontend: e.target.value })}
                                                    placeholder='Search............'
                                                />
                                            </div>
                                            <table border="1" className='p-0 table table-hover' style={{ borderTop: "0px" }}>
                                                <thead style={{ borderBottom: "0px" }}>
                                                    <tr>

                                                        <th>VoucherID</th>
                                                        <th>Voucher#</th>
                                                        <th>Description</th>
                                                        <th>Type</th>
                                                        <th>Voucher.Date</th>
                                                        <th>Action</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    
                                                    {filteredVouchers.map(voucher => (
                                                        <tr key={voucher.voucher_invoice_no}>
                                                            <td>{voucher.voucher_invoice_no}</td>
                                                            <td>{voucher.voucher_number}</td>
                                                            <td>{voucher.description}</td>
                                                            <td>{voucher.voucher_type}</td>
                                                            <td>{voucher.voucher_date}</td>
                                                            
                                                            <td>
                                                            <button className='btn btn-warning' onClick={() => viewFinanceVoucher(voucher.voucher_invoice_no, voucher.campus_id, voucher.session_id)} ><i className='fas fa-eye'></i></button>
                                                            <button className='btn btn-success ml-2' onClick={() => editFinanceVoucher(voucher.voucher_invoice_no, voucher.campus_id, voucher.session_id)} ><i className='fas fa-edit'></i></button>
                                                            <button className='btn btn-danger ml-2' onClick={() => deleteFinanceVoucher(voucher.voucher_invoice_no, voucher.campus_id, voucher.session_id)}> <i className='fas fa-trash-alt' ></i></button>
                                                            </td>
                                                        </tr>
                                                    ))}

                                                </tbody>
                                            </table>


                                            {/* {hoveredVoucher && (
                                                <div
                                                    style={{
                                                        position: 'absolute',
                                                        top: `${hoverPosition.y + 20}px`, // Adjust the position based on the hover location
                                                        left: `${hoverPosition.x}px`,
                                                        backgroundColor: '#f9f9f9',
                                                        border: '1px solid #ccc',
                                                        padding: '10px',
                                                        zIndex: 1000,
                                                        boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
                                                        whiteSpace: 'nowrap',
                                                    }}
                                                >
                                                    {formatMonths(hoveredVoucher.months)}
                                                </div>
                                            )} */}


                                            {/* <div className='pt-3 pb-3' style={{ "fontSize": "15px" }}>
                                                <b className='p-2 text-danger' style={{ "border": "1px solid black" }} ><label htmlFor="" >Grand Total: </label> {filteredVouchers.reduce((total, voucher) => total + voucher.payable_amount_after_due_date, 0)}</b>
                                            </div> */}

                                        </div>
                                                        //    <div>yes</div>
                                                       
                                                        )}
                                                    </div>
                                               
                                            </div>
                                        </div>
                                    )}
                                </div>



            {
                showFeeVoucherInvoice && financeVoucherData && (
                    <div className="col-12">
                        <div
                            style={{
                                border: '1px solid #ddd',
                                padding: '10px',
                                position: 'fixed',
                                left: '50%',
                                top: '50%',
                                transform: 'translate(-50%, -50%)',
                                zIndex: '1000',
                                backdropFilter: 'blur(10px)',
                                width: '90%',
                                maxHeight: '80vh',
                                overflowY: 'auto',
                                backgroundColor: 'white',
                                borderRadius: '10px',
                                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
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
          
          .admission_detail {
            border: 1px solid black;
            border-collapse: collapse;
          }

          .admission_detail th, .admission_detail td {
            border: 1px solid gray;
            padding: 10px !important;
          }
          `}
                            </style>

                            {/* Fixed Close Button */}
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

                            {/* Non-Scrollable Heading */}
                            <div
                                style={{
                                    width: '100%',
                                    backgroundColor: '#007bff',
                                    padding: '5px',
                                    borderBottom: '1px solid #ddd',
                                    position: 'sticky',
                                    top: '0',
                                    zIndex: '150',
                                    textAlign: 'left',
                                    fontSize: '18px',
                                    fontWeight: 'bold',
                                    color: '#ffc107',
                                    
                                }}
                            >
                                Voucher Summary Report
                            </div>

                            {/* Scrollable Content */}
                            <div style={{ width: '100%', padding: '20px', overflowY: 'auto' }}>
                                

                                <table class='admission_detail' style={{ width: '100%' }}>
                                    <thead>
                                        <tr>
                                            {/* <th colSpan="6" style={{ background: '#ddd' }}>
                                            Voucher Summary Report
                                            </th> */}
                                        </tr>
                                        <tr>
                                            <th>Sr#	</th>
                                            <th>Voucher ID</th>
                                            <th>Code</th>
                                            <th>Category</th>
                                            <th>Debit</th>
                                            <th>Credit</th>
                                        </tr>
                                    </thead>


                                    <tbody>
                                        {financeVoucherData.length > 0 ? (
                                            <>
                                                {financeVoucherData.map((voucher, index) => (
                                                        <tr key={index}>
                                                            <td>{index + 1}</td>
                                                            <td>{voucher.voucher_invoice_no}</td> {/* Display for_the_month since we know it's valid */}
                                                            <th>{voucher.code}</th>
                                                            <th>{voucher.category}</th>
                                                            <th>{voucher.debit}</th>
                                                            <th>{voucher.credit}</th>
                                                        </tr>
                                                    ))}
                                                <tr>
                                                    <td colSpan="4" className="text-right"><strong></strong></td>
                                                    <td>
                                                        <strong>
                                                            {financeVoucherData.reduce((total, voucher) => total + voucher.debit, 0)}
                                                        </strong>
                                                    </td>
                                                    <td>
                                                        <strong>
                                                            {financeVoucherData.reduce((total, voucher) => total + voucher.credit, 0)}
                                                        </strong>
                                                    </td>
                                                </tr>
                                            </>
                                        ) : (
                                            <tr>
                                                <td colSpan="10" style={{ textAlign: 'center' }}>No vouchers exist</td>
                                            </tr>
                                        )}
                                    </tbody>
                                   

                                    
                                    

                                   
                                    
                                </table>

                              



                            </div>
                        </div>
                    </div>
                )
            }


        </div>
    );
};

export default CreateVoucher;

