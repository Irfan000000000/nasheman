import React, { useCallback, useContext, useEffect, useState } from 'react'
import axios from 'axios'
import ReactPaginate from 'react-paginate';
import Select from 'react-select';
import { useDropzone } from 'react-dropzone';
import { useAuth } from './AuthContext';
import AcademicSessionContext from './AcademicSessionContext';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useLocation } from 'react-router-dom';
import imageCompression from 'browser-image-compression';

function AdmissionForm({onClose, fetchData, refreshData = false }) {
    

    const [getClasses, setClasses] = useState([]);

    const [HouseAndClub, setHouseAndClub] = useState([]);


    const [getSections, setSections] = useState([]);
    const [getCategories, setCategories] = useState([]);
    const [filePreview, setFilePreview] = useState(null);
    const { user } = useAuth();
    const { academicSession } = useContext(AcademicSessionContext);
    const location = useLocation();
    const { admission } = location.state || {};

    console.log(location.pathname, "test path");


    const savedAdmission = localStorage.getItem('admission') ? JSON.parse(localStorage.getItem('admission')) : "";

    

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };


    const initialState = {
        hidden_id: savedAdmission && savedAdmission.results && savedAdmission.results[0]?.id || "",
        register_no: savedAdmission && savedAdmission.results && savedAdmission.results[0]?.register_no || "",
        old_register_no: savedAdmission && savedAdmission.results && savedAdmission.results[0]?.old_register_no || "",
        shift: savedAdmission && savedAdmission.results && savedAdmission.results[0]?.shift || "",
        admission_date: savedAdmission && savedAdmission.results && formatDate(savedAdmission.results[0]?.admission_date) || "",
        full_name: savedAdmission && savedAdmission.results && savedAdmission.results[0]?.full_name || "",
        father_name: savedAdmission && savedAdmission.results && savedAdmission.results[0]?.father_name || "",
        father_cnic: savedAdmission && savedAdmission.results && savedAdmission.results[0]?.father_cnic || "",
        father_mobile_no: savedAdmission && savedAdmission.results && savedAdmission.results[0]?.father_mobile_no || "",
        gender: savedAdmission && savedAdmission.results && savedAdmission.results[0]?.gender || "",
        class_id: savedAdmission && savedAdmission.results && savedAdmission.results[0]?.class_id || "",
        section_id: savedAdmission && savedAdmission.results && savedAdmission.results[0]?.section_id || "",
        dob: savedAdmission && savedAdmission.results && formatDate(savedAdmission.results[0]?.dob) || "",
        religion: savedAdmission && savedAdmission.results && savedAdmission.results[0]?.religion || "",
        cast: savedAdmission && savedAdmission.results && savedAdmission.results[0]?.cast || "",
        blood_group: savedAdmission && savedAdmission.results && savedAdmission.results[0]?.blood_group || "",
        mother_tongue: savedAdmission && savedAdmission.results && savedAdmission.results[0]?.mother_tongue || "",
        current_address: savedAdmission && savedAdmission.results && savedAdmission.results[0]?.current_address || "",
        permanent_address: savedAdmission && savedAdmission.results && savedAdmission.results[0]?.permanent_address || "",
        mobile_no: savedAdmission && savedAdmission.results && savedAdmission.results[0]?.mobile_no || "",
        student_cnic: savedAdmission && savedAdmission.results && savedAdmission.results[0]?.student_cnic || "",
        category_id: savedAdmission && savedAdmission.results && (savedAdmission.results[0]?.category_id || ""),
        house_id: savedAdmission && savedAdmission.results && (savedAdmission.results[0]?.house_id || ""),
        club_id: savedAdmission && savedAdmission.results && (savedAdmission.results[0]?.club_id || ""),
        guardian_name: savedAdmission && savedAdmission.results && (savedAdmission.results[0]?.guardian_name || ""),
        relation: savedAdmission && savedAdmission.results && (savedAdmission.results[0]?.relation || ""),
        occupation: savedAdmission && savedAdmission.results && (savedAdmission.results[0]?.occupation || ""),
        guardian_mobile_no: savedAdmission && savedAdmission.results && (savedAdmission.results[0]?.guardian_mobile_no || ""),
        guardian_address: savedAdmission && savedAdmission.results && (savedAdmission.results[0]?.guardian_address || ""),
        guardian_cnic: savedAdmission && savedAdmission.results && (savedAdmission.results[0]?.guardian_cnic || ""),
        pl_no: savedAdmission && savedAdmission.results && (savedAdmission.results[0]?.pl_no || ""),
        designation: savedAdmission && savedAdmission.results && (savedAdmission.results[0]?.designation || ""),
        department: savedAdmission && savedAdmission.results && (savedAdmission.results[0]?.department || ""),
        bus_status: savedAdmission && savedAdmission.results && savedAdmission.results[0]?.bus_status || "",
        bus_fee: savedAdmission && savedAdmission.results && savedAdmission.results[0]?.bus_fee || 0,
        bus_route: savedAdmission && savedAdmission.results && savedAdmission.results[0]?.bus_route || "",
        session_id: academicSession,
        campus_id: user.user.campus_id,
        campus_code: user.user.campus_code,
        user_id: user.user.user_id,
        status: (savedAdmission && savedAdmission.results && (savedAdmission.results[0]) ? savedAdmission.results[0].status : "New Admission"),
        student_image: savedAdmission && savedAdmission.results && (savedAdmission.results[0]?.student_image || ""),
         class_name: savedAdmission?.results?.[0]?.class_name || "",
         section_name: savedAdmission?.results?.[0]?.section_name || "",
    };

    // {console.log(initialState, savedAdmission && savedAdmission.results && (savedAdmission.results[0]?.house_id))}




    const [editFormData, setEditFormData] = useState(initialState);



    // if(location.pathname == '/admission-form'){
    //     localStorage.removeItem('admission');
    // }

    
    useEffect(() => {
        if (location.pathname === '/admission-form') {
          localStorage.removeItem('admission');
      
          setEditFormData({
            ...editFormData,
            hidden_id: "",
            register_no: "",
            old_register_no: "",
            shift: "",
            admission_date: "",
            full_name: "",
            father_name: "",
            father_cnic: "",
            father_mobile_no: "",
            gender: "",
            class_id: "",
            section_id: "",
            dob: "",
            religion: "",
            cast: "",
            blood_group: "",
            mother_tongue: "",
            current_address: "",
            permanent_address: "",
            mobile_no: "",
            student_cnic: "",
            category_id: "",
            house_id: "",
            club_id: "",
            guardian_name: "",
            relation: "",
            occupation: "",
            guardian_mobile_no: "",
            guardian_address: "",
            guardian_cnic: "",
            pl_no: "",
            designation: "",
            department: "",
            bus_status: "",
            bus_fee: "",
            session_id: academicSession,
            campus_id: user.user.campus_id,
            campus_code: user.user.campus_code,
            user_id: user.user.user_id,
            status: "New Admission",
            student_image: "",
          });
        }
      }, [location]);
      


    useEffect(() => {
        if (savedAdmission.results && savedAdmission.results[0]?.student_image) {
            setFilePreview(process.env.REACT_APP_API_BASE_URL+`/uploads/${savedAdmission.results[0].student_image}`);
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


    useEffect(() => {
        const fetchClasses = (campus_id) => {
            axios.get(process.env.REACT_APP_API_BASE_URL+`/get-classes/${campus_id}`)
                .then(res => {
                    // console.log(res.data.results)
                    setClasses(res.data.results);
                })
                .catch(err => console.log(err));
        };

        // Ensure user.campus_id is defined before calling fetchClasses
        if (user && user.user.campus_id) {
            fetchClasses(user.user.campus_id);
        }
    }, []); // Dependencies array to re-run the effect when user changes




      useEffect(() => {
        const fetchHouseAndClub = (campus_id) => {
            axios.get(process.env.REACT_APP_API_BASE_URL+`/get-houses-and-club/${campus_id}`)
                .then(res => {
                    setHouseAndClub(res.data.results);
                })
                .catch(err => console.log(err));
        };

        // Ensure user.campus_id is defined before calling fetchClasses
        if (user && user.user.campus_id) {
            fetchHouseAndClub(user.user.campus_id);
        }
    }, []); // Dependencies array to re-run the effect when user changes


    


    useEffect(() => {
        const fetchCategories = (campus_id) => {
            axios.get(process.env.REACT_APP_API_BASE_URL+`/get-categories/${campus_id}`)
                .then(res => {

                    setCategories(res.data.results);
                })
                .catch(err => console.log(err));
        };

        // Ensure user.campus_id is defined before calling fetchClasses
        if (user && user.user.campus_id) {
            fetchCategories(user.user.campus_id);
        }
    }, [user]); // Depende



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
    }, []); // Dependencies array to re-run the effect when user changes





    // const onDrop = useCallback((acceptedFiles) => {
    //     const file = acceptedFiles[0];
    //     console.log(file);
    //     setEditFormData({ ...editFormData, student_image: file });
    //     setFilePreview(URL.createObjectURL(file));
    //     console.log(URL.createObjectURL(file));
    // }, [editFormData]);

    // const onDrop = useCallback((acceptedFiles) => {
    //     const file = acceptedFiles[0];
    //     const blobUrl = URL.createObjectURL(file);
    //     setEditFormData({ ...editFormData, student_image: file });
    //     setFilePreview(blobUrl);

    // }, [editFormData]);


    // const { getRootProps, getInputProps } = useDropzone({ onDrop });





    // const onDrop = useCallback((acceptedFiles, rejectedFiles) => {
    //   // Handle rejected files
    //   if (rejectedFiles && rejectedFiles.length > 0) {
    //     rejectedFiles.forEach(rejectedFile => {
    //       if (rejectedFile.errors[0].code === 'file-too-large') {
    //         toast.error('File size must be less than 200KB');
    //       } else if (rejectedFile.errors[0].code === 'file-invalid-type') {
    //         toast.error('Only JPG and PNG images are allowed');
    //       }
    //     });
    //     return;
    //   }
    
    //   const file = acceptedFiles[0];
    //   const blobUrl = URL.createObjectURL(file);
    //   setEditFormData({ ...editFormData, student_image: file });
    //   setFilePreview(blobUrl);
    // }, [editFormData]);




//     const onDrop = useCallback(async (acceptedFiles, rejectedFiles) => {
// //   if (rejectedFiles && rejectedFiles.length > 0) {
// //     rejectedFiles.forEach(rejectedFile => {
// //       if (rejectedFile.errors[0].code === 'file-too-large') {
// //         toast.error('File size must be less than 5MB');
// //       } else if (rejectedFile.errors[0].code === 'file-invalid-type') {
// //         toast.error('Only JPG and PNG images are allowed');
// //       }
// //     });
// //     return;
// //   }

//   const file = acceptedFiles[0];
//   if (!file) return;

//   try {
//     toast.info('Compressing image...');
    
//     const options = {
//       maxSizeMB: 0.2,           // 200KB
//       maxWidthOrHeight: 800,
//       useWebWorker: true,
//     };

//     const compressedFile = await imageCompression(file, options);
//     console.log(`${(file.size/1024).toFixed(0)}KB → ${(compressedFile.size/1024).toFixed(0)}KB`);
    
//     setEditFormData({ ...editFormData, student_image: compressedFile });
//     setFilePreview(URL.createObjectURL(compressedFile));
    
//     toast.success(`Compressed: ${(compressedFile.size/1024).toFixed(0)}KB`);
//   } catch (error) {
//     toast.error('Image compression failed');
//   }
// }, [editFormData]);



const onDrop = useCallback(async (acceptedFiles, rejectedFiles) => {
  const file = acceptedFiles[0];
  if (!file) return;

  try {
    toast.info('Compressing image...');
    
    const options = {
      maxSizeMB: 0.2,
      maxWidthOrHeight: 800,
      useWebWorker: true,
    };

    const compressedBlob = await imageCompression(file, options);
    
    // ✅ FIX: Convert blob back to a File with proper name
    const originalName = file.name || 'student_image.jpg';
    const extension = originalName.split('.').pop() || 'jpg';
    const newFileName = `student_${Date.now()}.${extension}`;
    
    const compressedFile = new File(
      [compressedBlob], 
      newFileName, 
      { 
        type: compressedBlob.type || file.type,
        lastModified: Date.now()
      }
    );
    
    console.log(`${(file.size/1024).toFixed(0)}KB → ${(compressedFile.size/1024).toFixed(0)}KB`);
    console.log('Filename:', compressedFile.name); // Should print: student_1731234567890.jpg
    
    setEditFormData({ ...editFormData, student_image: compressedFile });
    setFilePreview(URL.createObjectURL(compressedFile));
    
    toast.success(`Compressed: ${(compressedFile.size/1024).toFixed(0)}KB`);
  } catch (error) {
    console.error(error);
    toast.error('Image compression failed');
  }
}, [editFormData]);


    
    // const { getRootProps, getInputProps } = useDropzone({ 
    //   onDrop,
    //   accept: {
    //     'image/jpeg': ['.jpeg', '.jpg'],
    //     'image/png': ['.png']
    //   },
    //   maxSize: 200 * 1024, // 200KB limit
    //   multiple: false
    // });


    const { getRootProps, getInputProps } = useDropzone({ 
  onDrop,
  accept: {
    'image/jpeg': ['.jpeg', '.jpg'],
    'image/png': ['.png']
  },
  maxSize: 5 * 1024 * 1024, // 5MB tak accept karo, compress karke 200KB kar dega
  multiple: false
});




    const [validity, setValidity] = useState({
        // register_no: true,
        old_register_no: true,
        shift: true,
        admission_date: true,
        full_name: true,
        father_name: true,
        father_cnic: true,
        // father_mobile_no: true,
        gender: true,
        class_id: true,
        section_id: true,
        dob: true,
        religion: true,
        cast: true,
        blood_group: true,
        mother_tongue: true,
        current_address: true,
        permanent_address: true,
        mobile_no: true,
        category_id: true,
        pl_no: true,
        designation: true,
        department: true,
        guardian_name: true,
        relation: true,
        occupation: true,
        guardian_mobile_no: true,
        guardian_address: true,
        guardian_cnic: true,
        student_cnic: true,
        status: true,
        bus_status: true,
        bus_fee: true
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name == "relation") {
            setEditFormData({
                ...editFormData,
                guardian_name: value == "Father" ? editFormData.father_name : "",
                guardian_cnic: value == "Father" ? editFormData.father_cnic : "",
                guardian_mobile_no: value == "Father" ? editFormData.father_mobile_no : "",
                guardian_address: value == "Father" ? editFormData.current_address : "",
                relation: value
            });
        } else {
            setEditFormData({ ...editFormData, [name]: value });
            // Clear validation state when user starts typing again
            setValidity({ ...validity, [name]: true });
        }

    };



    const checkFalseFields = () => {
        const invalidFields = Object.keys(validity).filter((key) => !validity[key]);
        console.log("Invalid Fields:", invalidFields);  // This will give you an array of field names that failed validation.
    };
    



    const handleSubmit = async (e) => {


        console.log(validateForm());

        e.preventDefault();
        if (validateForm()) {
            const formData = new FormData();

            // return false;
            for (const key in editFormData) {
                formData.append(key, editFormData[key]);
            }

            try {
                // Insert new item
                const response = await axios.post(process.env.REACT_APP_API_BASE_URL+'/insert-admission', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                });

                if (editFormData.hidden_id !== "") {

                    if (response.data.error) {
                        toast.success(response.data.error);
                    } else {
                        toast.success('Data updated successfully!');

                        // Refetch the updated record and repopulate the form
                        try {
                            const refreshed = await axios.get(
                                process.env.REACT_APP_API_BASE_URL + `/get-admission/${editFormData.hidden_id}`
                            );
                            const fullData = refreshed.data;
                            const record = fullData && fullData.results && fullData.results[0];

                            if (record) {
                                // Keep localStorage in sync so reopen/effects see fresh data
                                localStorage.setItem('admission', JSON.stringify(fullData));

                                setEditFormData(prev => ({
                                    ...prev,
                                    hidden_id: record.id || "",
                                    register_no: record.register_no || "",
                                    old_register_no: record.old_register_no || "",
                                    shift: record.shift || "",
                                    admission_date: record.admission_date ? formatDate(record.admission_date) : "",
                                    full_name: record.full_name || "",
                                    father_name: record.father_name || "",
                                    father_cnic: record.father_cnic || "",
                                    father_mobile_no: record.father_mobile_no || "",
                                    gender: record.gender || "",
                                    class_id: record.class_id || "",
                                    section_id: record.section_id || "",
                                    dob: record.dob ? formatDate(record.dob) : "",
                                    religion: record.religion || "",
                                    cast: record.cast || "",
                                    blood_group: record.blood_group || "",
                                    mother_tongue: record.mother_tongue || "",
                                    current_address: record.current_address || "",
                                    permanent_address: record.permanent_address || "",
                                    mobile_no: record.mobile_no || "",
                                    student_cnic: record.student_cnic || "",
                                    category_id: record.category_id || "",
                                    house_id: record.house_id || "",
                                    club_id: record.club_id || "",
                                    guardian_name: record.guardian_name || "",
                                    relation: record.relation || "",
                                    occupation: record.occupation || "",
                                    guardian_mobile_no: record.guardian_mobile_no || "",
                                    guardian_address: record.guardian_address || "",
                                    guardian_cnic: record.guardian_cnic || "",
                                    pl_no: record.pl_no || "",
                                    designation: record.designation || "",
                                    department: record.department || "",
                                    bus_status: record.bus_status || "",
                                    bus_route: record.bus_route || "",
                                    bus_fee: record.bus_fee || 0,
                                    session_id: academicSession,
                                    campus_id: user.user.campus_id,
                                    campus_code: user.user.campus_code,
                                    user_id: user.user.user_id,
                                    status: record.status || "New Admission",
                                    student_image: record.student_image || "",
                                    class_name: record.class_name || "",
                                    section_name: record.section_name || "",
                                }));

                                if (record.student_image) {
                                    // cache-bust so updated image actually shows
                                    setFilePreview(
                                        process.env.REACT_APP_API_BASE_URL + `/uploads/${record.student_image}?t=${Date.now()}`
                                    );
                                } else {
                                    setFilePreview(null);
                                }
                            }
                        } catch (fetchErr) {
                            console.error('Failed to refresh updated admission record:', fetchErr);
                        }
                    }

                    if(refreshData){
                        fetchData(false);
                    }

                } else {
                    toast.success('Data Inserted successfully!');
                    setEditFormData({
                        ...editFormData,
                        hidden_id: "",
                        register_no: "",
                        old_register_no: "",
                        shift: "",
                        admission_date: "",
                        full_name: "",
                        father_name: "",
                        father_cnic: "",
                        father_mobile_no: "",
                        gender: "",
                        class_id: "",
                        section_id: "",
                        dob: "",
                        religion: "",
                        cast: "",
                        blood_group: "",
                        mother_tongue: "",
                        current_address: "",
                        permanent_address: "",
                        mobile_no: "",
                        student_cnic: "",
                        category_id: "",
                        house_id: "",
                        club_id: "",
                        guardian_name: "",
                        relation: "",
                        occupation: "",
                        guardian_mobile_no: "",
                        guardian_address: "",
                        guardian_cnic: "",
                        pl_no: "",
                        designation: "",
                        department: "",
                        bus_status: "",
                        bus_fee: "",
                        bus_route:"",
                        session_id: academicSession,
                        campus_id: user.user.campus_id,
                        campus_code: user.user.campus_code,
                        user_id: user.user.user_id,
                        status: "New Admission",
                        student_image: "",
                      });

                    // Insert mode only — clear the preview so next entry starts blank
                    setFilePreview(null);
                }
            } catch (error) {
                console.error('There was an error!', error);
            }
        } else {
        checkFalseFields(); // This will log fields that are false
    }
    };




    const validateForm = () => {
        let isValid = true;
        // Basic validation rules (customize as per your requirements)
        // if (!editFormData.register_no.trim()) {
        //     setValidity((prevState) => ({ ...prevState, register_no: false }));
        //     isValid = false;
        // }
        if (!editFormData.old_register_no.trim()) {
            setValidity((prevState) => ({ ...prevState, old_register_no: false }));
            isValid = false;
        }
        if (!editFormData.shift.trim()) {
            setValidity((prevState) => ({ ...prevState, shift: false }));
            isValid = false;
        }
        if (!editFormData.admission_date.trim()) {
            setValidity((prevState) => ({ ...prevState, admission_date: false }));
            isValid = false;
        }
        if (!editFormData.full_name.trim()) {
            setValidity((prevState) => ({ ...prevState, full_name: false }));
            isValid = false;
        }

        if (!editFormData.father_name.trim()) {
            setValidity((prevState) => ({ ...prevState, father_name: false }));
            isValid = false;
        }

        const cnicRegex = /^[0-9]{13}$/; // Regex for a 13-digit CNIC

        if (!editFormData.father_cnic.trim()) {
            setValidity((prevState) => ({ ...prevState, father_cnic: false }));
            isValid = false;
        } else if (!cnicRegex.test(editFormData.father_cnic.trim())) {
            setValidity((prevState) => ({ ...prevState, father_cnic: false }));
            isValid = false;
        }
        

        // if (!editFormData.father_cnic.trim()) {
        //     setValidity((prevState) => ({ ...prevState, father_cnic: false }));
        //     isValid = false;
        // }

        // if (!editFormData.father_mobile_no.trim()) {
        //     setValidity((prevState) => ({ ...prevState, father_mobile_no: false }));
        //     isValid = false;
        // }



        if (!editFormData.gender.trim()) {
            setValidity((prevState) => ({ ...prevState, gender: false }));
            isValid = false;
        }
        if (!editFormData.class_id) {
            setValidity((prevState) => ({ ...prevState, class_id: false }));
            isValid = false;
        }
        if (!editFormData.section_id) {
            setValidity((prevState) => ({ ...prevState, section_id: false }));
            isValid = false;
        }
        if (!editFormData.dob.trim()) {
            setValidity((prevState) => ({ ...prevState, dob: false }));
            isValid = false;
        }
        if (!editFormData.religion.trim()) {
            setValidity((prevState) => ({ ...prevState, religion: false }));
            isValid = false;
        }
        if (!editFormData.cast.trim()) {
            setValidity((prevState) => ({ ...prevState, cast: false }));
            isValid = false;
        }
        if (!editFormData.blood_group.trim()) {
            setValidity((prevState) => ({ ...prevState, blood_group: false }));
            isValid = false;
        }

        if (!editFormData.mother_tongue.trim()) {
            setValidity((prevState) => ({ ...prevState, mother_tongue: false }));
            isValid = false;
        }
        if (!editFormData.current_address.trim()) {
            setValidity((prevState) => ({ ...prevState, current_address: false }));
            isValid = false;
        }

        if (!editFormData.permanent_address.trim()) {
            setValidity((prevState) => ({ ...prevState, permanent_address: false }));
            isValid = false;
        }

        if (!editFormData.mobile_no.trim()) {
            setValidity((prevState) => ({ ...prevState, mobile_no: false }));
            isValid = false;
        }

        if (!editFormData.student_cnic.trim()) {
            setValidity((prevState) => ({ ...prevState, student_cnic: false }));
            isValid = false;
        }

        if (!editFormData.category_id) {
            setValidity((prevState) => ({ ...prevState, category_id: false }));
            isValid = false;
        }

        if (editFormData.category_id === 1 && !editFormData.pl_no.trim()) {
            setValidity((prevState) => ({ ...prevState, pl_no: false }));
            isValid = false;
        }
        if (editFormData.category_id === 1 && !editFormData.designation.trim()) {
            setValidity((prevState) => ({ ...prevState, designation: false }));
            isValid = false;
        }
        if (editFormData.category_id === 1 && !editFormData.department.trim()) {
            setValidity((prevState) => ({ ...prevState, department: false }));
            isValid = false;
        }
        if (!editFormData.guardian_name.trim()) {
            setValidity((prevState) => ({ ...prevState, guardian_name: false }));
            isValid = false;
        }
        if (!editFormData.relation.trim()) {
            setValidity((prevState) => ({ ...prevState, relation: false }));
            isValid = false;
        }
        if (!editFormData.occupation.trim()) {
            setValidity((prevState) => ({ ...prevState, occupation: false }));
            isValid = false;
        }
        if (!editFormData.guardian_mobile_no.trim()) {
            setValidity((prevState) => ({ ...prevState, guardian_mobile_no: false }));
            isValid = false;
        }
        if (!editFormData.guardian_address.trim()) {
            setValidity((prevState) => ({ ...prevState, guardian_address: false }));
            isValid = false;
        }
        if (!editFormData.guardian_cnic.trim()) {
            setValidity((prevState) => ({ ...prevState, guardian_cnic: false }));
            isValid = false;
        }
        if (!editFormData.status) {
            setValidity((prevState) => ({ ...prevState, status: false }));
            isValid = false;
        }

        if (!editFormData.bus_status) {
            setValidity((prevState) => ({ ...prevState, bus_status: false }));
            isValid = false;
        }

        if (editFormData.bus_fee<0) {
            setValidity((prevState) => ({ ...prevState, bus_fee: false }));
            isValid = false;
        }

        return isValid;
    };



    const findClassLabel = () => {
        if (!editFormData.class_id || !editFormData.section_id) {
            return "";
        }
        const classObj = getClasses.find(class_get => class_get.id === parseInt(editFormData.class_id) && class_get.section_id === parseInt(editFormData.section_id));
        if (classObj) {
            return `${classObj.class} (${classObj.section_name})`;
        }
        return "";
    };




    const handleClassChange = (selectedOption) => {
        const [class_id, section_id] = selectedOption ? selectedOption.value.split(",") : ["", ""];

        const selectedClass = getClasses.find(c => 
            c.id === parseInt(class_id) && 
            c.section_id === parseInt(section_id)
        );

        
         setEditFormData({ 
            ...editFormData, 
            class_id,
            section_id,
            class_name: selectedClass.class,      // Add class name
            section_name: selectedClass.section_name  // Add section name
        });
    };



    return (
        <>
            <div className="admission-form">
                <div className='admission-form__inner'>
                    <h5 className='admission-form__header text-warning bg-primary card-header border'><i className='fas fa-receipt'></i> Admission Form</h5>

                    <form className='admission-form__form border' onSubmit={handleSubmit}>

                        <div className="form-group row">
                            <div className="col-md-12">
                                {/* <label className="col-form-label">Status</label><br /> */}
                                <div className="d-flex flex-wrap admission-form__status">
                                    <div className="form-check me-3">
                                        <input
                                            type="radio"
                                            id="new-admission"
                                            name="status"

                                            className={validity.status ? 'form-check-input' : 'form-check-input invalid-input'}
                                            checked={editFormData.status === 'New Admission'}
                                            onChange={() => setEditFormData({ ...editFormData, status: 'New Admission' })}

                                        />
                                        <label htmlFor="new-admission">New Admission </label>
                                    </div>

                                    <div className="form-check ml-3">
                                        <input
                                            type="radio"
                                            id="struck-off"
                                            name="status"

                                            className={validity.status ? 'form-check-input' : 'form-check-input invalid-input'}
                                            checked={editFormData.status === 'Struck Off'}
                                            onChange={() => setEditFormData({ ...editFormData, status: 'Struck Off' })}

                                        />
                                        <label htmlFor="struck-off">Struck Off </label>
                                    </div>


                                    
                                    <div className="form-check ml-3">
                                        <input
                                            type="radio"
                                            id="slc"
                                            name="status"
                                            checked={editFormData.status === 'SLC'}
                                            onChange={() => setEditFormData({ ...editFormData, status: 'SLC' })}
                                            className={validity.status ? 'form-check-input' : 'form-check-input invalid-input'}
                                        />
                                        <label htmlFor="slc">SLC </label>
                                    </div>

                                    <div className="form-check me-3 ml-3">
                                        <input
                                            type="radio"
                                            id="new-admission"
                                            name="status"
                                            className={validity.status ? 'form-check-input' : 'form-check-input invalid-input'}
                                            checked={editFormData.status === 'Promoted'}
                                            onChange={() => setEditFormData({ ...editFormData, status: 'Promoted' })}
                                            // disabled // Add this line to disable the radio button
                                        />
                                        <label htmlFor="new-admission">Promoted</label>
                                    </div>


                                </div>
                            </div>
                        </div>

                        <div>
                            <hr />
                            <h5 className='text-warning'>Student Detail</h5>
                        </div>


                        <div className="form-group row">
                            <div className="col-md-4 d-none">
                                <label className="col-form-label">Register#</label>
                                <input
                                    type="text"
                                    // className={validity.register_no ? 'form-control' : 'form-control invalid-input'}
                                    id="register_no"
                                    name="register_no"
                                    value={editFormData.register_no}
                                    onChange={handleChange}
                                />
                            </div>


                            <div className="col-md-4">
                                <label className="col-form-label">Admission Date</label>
                                <input
                                    type="date"
                                    className={validity.admission_date ? 'form-control' : 'form-control invalid-input'}
                                    id="admission_date"
                                    name="admission_date"
                                    value={editFormData.admission_date}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className="col-md-4">
                                <label className="col-form-label">Old Register#</label>
                                <input
                                    type="text"
                                    className={validity.old_register_no ? 'form-control' : 'form-control invalid-input'}
                                    id="old_register_no"
                                    name="old_register_no"
                                    value={editFormData.old_register_no}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className="col-md-4">
                                <label className="col-form-label">Shift</label>
                                <select
                                    name="shift"
                                    id="shift"
                                    className={validity.shift ? 'form-control' : 'form-control invalid-input'}
                                    value={editFormData.shift}
                                    onChange={handleChange}
                                >
                                    <option value="">Select Shift</option>
                                    <option>Morning</option>
                                    <option>Evening</option>
                                </select>
                            </div>


                        </div>



                        <div className="form-group row">



                            <div className="col-md-4">
                                <label className="col-form-label">Class</label>
                                <Select
                                    options={getClasses.map(class_get => ({
                                        value: `${class_get.id},${class_get.section_id}`,
                                        label: `${class_get.class} (${class_get.section_name})`
                                    }))}
                                    value={
                                        editFormData.class_id && editFormData.section_id
                                            ? {
                                                value: `${editFormData.class_id},${editFormData.section_id}`,
                                                label: findClassLabel()
                                            }
                                            : null
                                    }
                                    onChange={handleClassChange}
                                    placeholder="Select Class"
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
                                <label className="col-form-label">Category</label>
                                <Select
                                    options={getCategories.map(category => ({ value: category.id, label: category.category }))}
                                    value={
                                        editFormData.category_id
                                            ? { value: editFormData.category_id, label: getCategories.find(category => category.id === editFormData.category_id)?.category || "" }
                                            : null
                                    }
                                    onChange={(selectedOption) => setEditFormData({ ...editFormData, category_id: selectedOption ? selectedOption.value : "" })}
                                    placeholder="Select Category"
                                />
                            </div>

                        </div>

                        <div className="form-group row">



                            <div className="col-md-4">
                                <label className="col-form-label">Date of Birth</label>
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

                            <div className="col-md-4">
                                <label className="col-form-label"> Father CNIC (13 digits): Example - 0000000000000</label>
                                <input
                                    type="text"
                                    className={validity.father_cnic ? 'form-control' : 'form-control invalid-input'}
                                    id="father_cnic"
                                    name="father_cnic"
                                    value={editFormData.father_cnic}
                                    onChange={handleChange}
                                    // placeholder='0000000000000'
                                />
                            </div>


                        </div>





                        <div className="form-group row">




                        <div className="col-md-4">
                                <label className="col-form-label">Mobile Number (Father)</label>
                                <input
                                    type="text"
                                    className={validity.mobile_no ? 'form-control' : 'form-control invalid-input'}
                                    id="mobile_no"
                                    name="mobile_no"
                                    value={editFormData.mobile_no}
                                    onChange={handleChange}
                                />
                            </div>

                       



                            {/* <div className="col-md-4">
                                <label className="col-form-label">Father Mobile No</label>
                                <input
                                    type="text"
                                    className={validity.father_mobile_no ? 'form-control' : 'form-control invalid-input'}
                                    id="father_mobile_no"
                                    name="father_mobile_no"
                                    value={editFormData.father_mobile_no}
                                    onChange={handleChange}
                                />
                            </div> */}



                            <div className="col-md-4">
                                <label className="col-form-label">Religion</label>
                                <input
                                    type="text"
                                    className={validity.religion ? 'form-control' : 'form-control invalid-input'}
                                    id="religion"
                                    name="religion"
                                    value={editFormData.religion}
                                    onChange={handleChange}
                                />
                            </div>


                            <div className="col-md-4">
                                <label className="col-form-label">Cast</label>
                                <input
                                    type="text"
                                    className={validity.cast ? 'form-control' : 'form-control invalid-input'}
                                    id="cast"
                                    name="cast"
                                    value={editFormData.cast}
                                    onChange={handleChange}
                                />
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
                                <label className="col-form-label">Mother Tongue</label>
                                <input
                                    type="text"
                                    className={validity.mother_tongue ? 'form-control' : 'form-control invalid-input'}
                                    id="mother_tongue"
                                    name="mother_tongue"
                                    value={editFormData.mother_tongue}
                                    onChange={handleChange}
                                />
                            </div>


                          

                        </div>

                        <div className="form-group row">

                        <div className="col-md-4">
                                <label className="col-form-label">Gender</label>
                                <select
                                    name="gender"
                                    id="gender"
                                    className={validity.gender ? 'form-control' : 'form-control invalid-input'}
                                    value={editFormData.gender}
                                    onChange={handleChange}
                                >
                                    <option value="">Select Gender</option>
                                    <option>Male</option>
                                    <option>Female</option>
                                </select>
                            </div>

                            <div className="col-md-4">
                                <label className="col-form-label">Student CNIC</label>
                                <input
                                    type="text"
                                    className={validity.student_cnic ? 'form-control' : 'form-control invalid-input'}
                                    id="student_cnic"
                                    name="student_cnic"
                                    value={editFormData.student_cnic}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className="col-md-4">
                                <label className="col-form-label">Blood Group</label>
                                <input
                                    type="text"
                                    className={validity.blood_group ? 'form-control' : 'form-control invalid-input'}
                                    id="blood_group"
                                    name="blood_group"
                                    value={editFormData.blood_group}
                                    onChange={handleChange}
                                />
                            </div>

                        </div>

                        <div className="form-group row">

                           <div className="col-md-4">
    <label className="col-form-label">House</label>
    <select name="house_id" id="house_id"   value={editFormData.house_id} onChange={handleChange} className={'form-control'}>
        <option value="0">Select House</option>
        {HouseAndClub
            .filter(item => item.house_or_club === "House")
            .map(house => (
                <option key={house.id} value={house.id}>
                    {house.house_or_club_name}
                </option>
            ))}
    </select>
</div>

<div className="col-md-4">
    <label className="col-form-label">Club</label>
    <select name="club_id" onChange={handleChange} id="club_id" value={editFormData.club_id} className={'form-control'}>
        <option value="0">Select Club</option>
        {HouseAndClub
            .filter(item => item.house_or_club === "Club")
            .map(club => (
                <option key={club.id} value={club.id}>
                    {club.house_or_club_name}
                </option>
            ))}
    </select>
</div>

                            <div className="col-md-4">
                           
                                <label className="col-form-label"></label>
                                <div className="col-sm-12">
                                    <div {...getRootProps({ className: 'dropzone' })} className="border p-3 text-center drag_image_zone">
                                        <input {...getInputProps()} />
                                        {filePreview ? (
                                            <img src={filePreview} alt="Preview" style={{ width: '30px', height: 'auto' }} />
                                        ) : (
                                            <p>Drag student image here <i className="fas fa-image" draggable="true"></i></p>
                                        )}
                                    </div>
                                    <small className="text-muted">
    Accepted formats: JPG, PNG (Max 200KB)
  </small>
                                </div>
                            
                            </div>

                        </div>




                        {/* <div className="form-group row">





                          
                        </div> */}



                        <div>
                            <hr />
                            <h5 className='text-warning'>Guardian Detail</h5>
                        </div>

                        <div className="form-group row">
                            <div className="col-md-4">
                                <label className="col-form-label">Guardian Name</label>
                                <input
                                    type="text"
                                    className={validity.guardian_name ? 'form-control' : 'form-control invalid-input'}
                                    id="guardian_name"
                                    name="guardian_name"
                                    value={editFormData.guardian_name ? editFormData.guardian_name : ""}
                                    onChange={handleChange} />
                            </div>

                            <div className="col-md-4">
                                <label className="col-form-label">Relation</label>
                                <select
                                    name="relation"
                                    id="relation"
                                    className={validity.relation ? 'form-control' : 'form-control invalid-input'}
                                    value={editFormData.relation ? editFormData.relation : ""}
                                    onChange={handleChange}
                                >
                                    <option value="">Select Relation</option>
                                    <option>Father</option>
                                    <option>Mother</option>
                                    <option>Other</option>
                                </select>
                            </div>

                            <div className="col-md-4">
                                <label className="col-form-label">Occupation</label>
                                <input
                                    type="text"
                                    className={validity.occupation ? 'form-control' : 'form-control invalid-input'}
                                    id="occupation"
                                    name="occupation"
                                    value={editFormData.occupation ? editFormData.occupation : ""}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>

                        <div className="form-group row">
                            <div className="col-md-4">
                                <label className="col-form-label">Guardian Mobile No</label>
                                <input
                                    type="text"
                                    className={validity.guardian_mobile_no ? 'form-control' : 'form-control invalid-input'}
                                    id="guardian_mobile_no"
                                    name="guardian_mobile_no"
                                    value={editFormData.guardian_mobile_no ? editFormData.guardian_mobile_no : ""}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className="col-md-4">
                                <label className="col-form-label">Guardian Address</label>
                                <input
                                    type="text"
                                    className={validity.guardian_address ? 'form-control' : 'form-control invalid-input'}
                                    id="guardian_address"
                                    name="guardian_address"
                                    value={editFormData.guardian_address ? editFormData.guardian_address : ""}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className="col-md-4">
                                <label className="col-form-label">Guardian CNIC</label>
                                <input
                                    type="text"
                                    className={validity.guardian_cnic ? 'form-control' : 'form-control invalid-input'}
                                    id="guardian_cnic"
                                    name="guardian_cnic"
                                    value={editFormData.guardian_cnic ? editFormData.guardian_cnic : ""}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>


                        <div>
                            <hr />
                            <h5 className='text-warning'>Bus</h5>
                        </div>

                        <div className="form-group row">
                            <div className="col-md-4">
                                <label className="col-form-label">Bus Status</label>
                                <select onChange={handleChange} value={editFormData.bus_status ? editFormData.bus_status : ""} name="bus_status" id="bus_status" className={validity.bus_status ? 'form-control' : 'form-control invalid-input'} >
                                    <option value=""> Select Bus Status </option>
                                    <option>On</option>
                                    <option>Off</option>
                                </select>
                            </div>

                            <div className="col-md-4">
                                <label className="col-form-label">Bus Route</label>
                                <select onChange={handleChange} value={editFormData.bus_route ? editFormData.bus_route : ""} name="bus_route" id="bus_route" className={'form-control'} >
                                    <option value=""> Select Bus Route</option>
                                    <option>Taxila Bus</option>
                                    <option>Basti Bus</option>
                                    <option>State Area Bus</option>
                                    <option>Gudwal Bus</option>
                                </select>
                            </div>

                            <div className="col-md-4">
                                <label className="col-form-label">Bus Fee</label>
                                <input
                                    type="number"
                                    className={validity.bus_fee ? 'form-control' : 'form-control invalid-input'}
                                    id="bus_fee"
                                    name="bus_fee"
                                    value={editFormData.bus_fee || 0}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>


                        {editFormData.category_id === 1 && (
                            <div>
                                <h5 className='text-warning'>POF Department Detail</h5>

                                <div className="form-group row">
                                    <div className="col-md-4">
                                        <label className="col-form-label">PL#</label>
                                        <input
                                            type="text"
                                            className={validity.pl_no ? 'form-control' : 'form-control invalid-input'}
                                            id="pl_no"
                                            name="pl_no"
                                            value={editFormData.pl_no || ""}
                                            onChange={handleChange}
                                        />
                                    </div>

                                    <div className="col-md-4">
                                        <label className="col-form-label">Designation</label>
                                        <input
                                            type="text"
                                            className={validity.designation ? 'form-control' : 'form-control invalid-input'}
                                            id="designation"
                                            name="designation"
                                            value={editFormData.designation || ""}
                                            onChange={handleChange}
                                        />
                                    </div>

                                    <div className="col-md-4">
                                        <label className="col-form-label">Department</label>
                                        <input
                                            type="text"
                                            className={validity.department ? 'form-control' : 'form-control invalid-input'}
                                            id="department"
                                            name="department"
                                            value={editFormData.department || ""}
                                            onChange={handleChange}
                                        />
                                    </div>
                                </div>
                            </div>
                        )}

                        <hr />


                        <div className="form-group row admission-form__submit-row">
                            <div className="col-md-12">
                                <button type="submit" className="btn btn-primary admission-form__submit">Submit</button>
                            </div>
                        </div>
                    </form>

                </div>



            </div>

        </>
    )



}

export default AdmissionForm;