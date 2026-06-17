import React, {useCallback, useEffect, useState, useContext } from 'react'
import axios from 'axios'
import ReactPaginate from 'react-paginate';
import { useAuth } from './AuthContext';
import AcademicSessionContext from './AcademicSessionContext';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useDropzone } from 'react-dropzone';

function AddCampusInformation() {

    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalCount, setTotalCount] = useState(0);
    const [totalPages, totalPagesGet] = useState("");
    const [getBanks, setBanks] = useState([]);
    const { user } = useAuth();
    const { academicSession } = useContext(AcademicSessionContext);
    const [getSections, setSections] = useState([]);
    const [getGroups, setGroups] = useState([]);

    const initialState = {

        phone_no: '',
        address:'',
        email: '',
        session_id: academicSession,
        campus_id: user.user.campus_id,
        user_id: user.user.user_id,
        hidden_id: ''
    }

    const [validity, setValidity] = useState({
        phone_no: true,
        address:true,
        email: true
    });


    const [editFormData, setEditFormData] = useState(initialState);

   
    const [filePreview, setFilePreview] = useState(null);


    useEffect(() => {
        if (academicSession) {
            setEditFormData(prevFormData => ({
                ...prevFormData,
                session_id: parseInt(academicSession)
            }));
        }
    }, [academicSession]);




    const validateForm = () => {
        let isValid = true;
        // Basic validation rules (customize as per your requirements)
        if (!editFormData.phone_no) {
            setValidity((prevState) => ({ ...prevState, phone_no: false }));
            isValid = false;
        }

        if (!editFormData.address) {
            setValidity((prevState) => ({ ...prevState, address: false }));
            isValid = false;
        }

        
        if (!editFormData.email) {
            setValidity((prevState) => ({ ...prevState, email: false }));
            isValid = false;
        }
      
        return isValid;
    };


    const [report, getAllReports] = useState({
        from_date: '',
        to_date: '',
        report_type: ''
    });


    const [searchCategoryReport, getSearchCategoryReport] = useState({
        search: '',
    });

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            getSearchCategoryReport(searchCategoryReport);
            
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

    const [totalItem, setTotalItemGet] = useState(10);


    const handlePageChange = ({ selected }) => {
        setCurrentPage(selected + 1);
    };

    const handleTotalItemChange = (event) => {

        const newValue = event.target.value;
        setTotalItemGet(newValue);

    }


// const onDrop = useCallback((acceptedFiles) => {
//         const file = acceptedFiles[0];
//         const blobUrl = URL.createObjectURL(file);
//         setEditFormData({ ...editFormData, student_image: file });
//         setFilePreview(blobUrl);

//     }, [editFormData]);


// const onDrop = useCallback((acceptedFiles, rejectedFiles) => {
//   // Check for rejected files (too large)
//   if (rejectedFiles && rejectedFiles.length > 0) {
//     toast.error('File size must be less than 200kb');
//     return;
//   }

//   const file = acceptedFiles[0];
//   const blobUrl = URL.createObjectURL(file);
//   setEditFormData({ ...editFormData, student_image: file });
//   setFilePreview(blobUrl);
// }, [editFormData]);


// const { getRootProps, getInputProps } = useDropzone({ 
//   onDrop,
//   accept: 'image/*', // Optional: restrict to image files
//   maxSize:  200 * 1024, // 1MB in bytes
//   multiple: false // Only allow single file upload
// });



const onDrop = useCallback((acceptedFiles, rejectedFiles) => {
  // Handle rejected files
  if (rejectedFiles && rejectedFiles.length > 0) {
    rejectedFiles.forEach(rejectedFile => {
      if (rejectedFile.errors[0].code === 'file-too-large') {
        toast.error('File size must be less than or equal to 10KB');
      } else if (rejectedFile.errors[0].code === 'file-invalid-type') {
        toast.error('Only JPG and PNG images are allowed');
      }
    });
    return;
  }

  const file = acceptedFiles[0];
  const blobUrl = URL.createObjectURL(file);
  setEditFormData({ ...editFormData, student_image: file });
  setFilePreview(blobUrl);
}, [editFormData]);

const { getRootProps, getInputProps } = useDropzone({ 
  onDrop,
  accept: {
    'image/jpeg': ['.jpeg', '.jpg'],
    'image/png': ['.png']
  },
  maxSize: 10 * 1024, // 200KB limit
  multiple: false
});



    const handleSubmit = async (e) => {
        e.preventDefault();
        if (validateForm()) {
            try {
                const response = await axios.post(process.env.REACT_APP_API_BASE_URL+'/insert-campus-information', editFormData, {
                    headers: {
            'Content-Type': 'multipart/form-data', // This is crucial
          },
                });
    
                if (editFormData.hidden_id !== "") {
                    toast.success('Data updated successfully!');
                    console.log('Data Updated successfully:', response.data);
                } else {
                    toast.success('Data Inserted successfully!');
                    console.log('Data Inserted successfully:', response.data);
                }
    
                setEditFormData(initialState); // Reset form data after successful submission
             
            } catch (error) {
                if (error.response && error.response.data && error.response.data.error) {
                    toast.error(error.response.data.error); // Show the error message from the server
                } else {
                    toast.error('An error occurred'); // Show a generic error message
                }
            }
        }
    };
    




    const edit = () => {
        axios.get(process.env.REACT_APP_API_BASE_URL+`/get-campus-info-data/${user.user.campus_id}`)
            .then(response => {
              
                const { phone_no, address, email, logo } = response.data.results[0];
              
                setEditFormData({ ...editFormData, 
                    phone_no: phone_no || '',
                    address: address || '',
                    email: email || '',
                });
                if(logo){
                    setFilePreview(process.env.REACT_APP_API_BASE_URL+`/uploads/${logo}`);
                }else{
                    setFilePreview(null);
                }
                
            })
            .catch(error => {
                console.error('Error:', error);
            });
    }



     useEffect(() => {
        if (academicSession) {
           edit();
        }
    }, [academicSession]);

      

    return (
        <>
            <div className="d-flex">
                <div className='col-md-12 p-2'>
                    <h5 className='text-warning bg-primary p-2 card-header border'> <i className="fas fa-graduation-cap"></i> Campus Information Form</h5>
                    <form className='border p-3' onSubmit={handleSubmit}>

                        <div className="form-group row">
                            <label htmlFor="inputEmail3" className="col-sm-1 col-form-label">Phone#</label>
                            <div className="col-sm-11 ">
                                <input
                                    type="text"
                                    name='phone_no'
                                    value={editFormData.phone_no}
                                    onChange={(e) => {
                                        setEditFormData({ ...editFormData, phone_no: e.target.value });
                                        setValidity({ ...validity, phone_no: true });
                                    }}
                                    className={validity.phone_no ? 'form-control' : 'form-control invalid-input'}
                                />
                            </div>
                        </div>



                         <div className="form-group row">
                            <label htmlFor="inputEmail3" className="col-sm-1 col-form-label">Address</label>
                            <div className="col-sm-11">
                                <input
                                    type="text"
                                    name='address'
                                    value={editFormData.address}
                                    onChange={(e) => {
                                        setEditFormData({ ...editFormData, address: e.target.value });
                                        setValidity({ ...validity, address: true });
                                    }}
                                    className={validity.address ? 'form-control' : 'form-control invalid-input'}
                                />
                            </div>
                        </div>


                         <div className="form-group row">
                            <label htmlFor="inputEmail3" className="col-sm-1 col-form-label">E-Mail</label>
                            <div className="col-sm-11">
                                <input
                                    type="text"
                                    name='address'
                                    value={editFormData.email}
                                    onChange={(e) => {
                                        setEditFormData({ ...editFormData, email: e.target.value });
                                        setValidity({ ...validity, email: true });
                                    }}
                                    className={validity.email ? 'form-control' : 'form-control invalid-input'}
                                />
                            </div>
                        </div>



                         {/* <div className="form-group row">
                            <label htmlFor="logo" className="col-sm-2 col-form-label">Logo</label>
                            <div className="col-sm-10">
                                <div {...getRootProps({ className: 'dropzone' })} className="border p-3 text-center drag_image_zone">
                                    <input {...getInputProps()} />
                                    {filePreview ? (
                                        <img src={filePreview} alt="Preview" style={{ width: '100px', height: 'auto' }} />
                                    ) : (
                                        <p>Drag logo here or click to upload <i className="fas fa-image" draggable="true"></i></p>
                                    )}
                                </div>
                            </div>
                        </div> */}

                        <div className="form-group row">
  <label htmlFor="logo" className="col-sm-1 col-form-label">Logo</label>
  <div className="col-sm-11">
    <div {...getRootProps({ className: 'dropzone' })} className="border p-3 text-center drag_image_zone">
      <input {...getInputProps()} />
      {filePreview ? (
        <img src={filePreview} alt="Preview" style={{ width: '100px', height: 'auto' }} />
      ) : (
        <p>Drag logo here or click to upload <i className="fas fa-image" draggable="true"></i></p>
      )}
    </div>
    <small className="text-muted">Maximum file size: 10kb (Supported formats: JPG, PNG)</small>
  </div>
</div>


                    
                        <div className="form-group row">
                            <label htmlFor="inputEmail3" className="col-sm-2 col-form-label"></label>
                            <div className="col-sm-10 d-flex justify-content-end">
                                <input type="submit" className='btn btn-sm btn-primary' value={"Save"} onClick={handleSubmit} />
                            </div>
                        </div>

                    </form>
                </div>

                
            </div>

        </>
    )



}

export default AddCampusInformation