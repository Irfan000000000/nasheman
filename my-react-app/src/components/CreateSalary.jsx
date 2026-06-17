import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
const CreateSalary = () => {

    // const initialFormData = {
    //     employee_name: '',
    //     employment_type: '',
    //     phone_no: '',
    //     cnic : '',
    //     hidden_id: ''
    // };

    const [fetchEmployeeData, setEmployeeData] = useState("");
    const { yearMonth, id } = useParams();


    useEffect(() => {
        axios.get(`${process.env.REACT_APP_API_BASE_URL}/get-employee-data/${id}`)
            .then(response => {
                setEmployeeData(response.data);  // Axios automatically parses JSON into response.data
                console.log(response.data);  // Log the fetched employee data
            })
            .catch(error => {
                console.error('Error fetching employee data:', error);
            });
    }, [yearMonth, id]);

    // useEffect(() => {
    //     fetch(process.env.REACT_APP_API_BASE_URL+`/get-employee-data/${id}`)
    //         .then(response => response.json())
    //         .then(data => {
    //             setEmployeeData(data);

    //             console.log(fetchEmployeeData);
                
    //         })
    //         .catch(error => {
    //             console.error('Error fetching employee data:', error);
    //         });

    // }, [yearMonth, id]);



    return (
        <div className="container-fluid">
            <div className="row d-flex justify-content-center">
                <div className="col-12 col-md-6 p-2">
                    <h6 className="text-warning bg-primary p-2 card-header border">
                        <i className="fas fa-money-bill-wave"></i> Create Salary
                    </h6>
                    <form className="border p-3 border-warning"  encType="multipart/form-data">
                        <div className="form-group row">
                            <label htmlFor="employee_name" className="col-sm-2 col-form-label">Name</label>
                            <div className="col-sm-10">
                                <input type="text" className="form-control" id="employee_name" name='employee_name' readOnly value={fetchEmployeeData.employee_name} />
                            </div>
                        </div>
                        <div className="form-group row">
                            <label htmlFor="dob" className="col-sm-2 col-form-label">Employee&nbsp;Type</label>
                            <div className="col-sm-10">
                                <input type="text" className="form-control" id="dob" name='dob' readOnly />
                            </div>
                        </div>
                      
                        <div className="form-group row">
                            <label htmlFor="phone_no" className="col-sm-2 col-form-label">Phone#</label>
                            <div className="col-sm-10">
                                <input type="text" className="form-control" id="phone_no" readOnly name='phone_no'  />
                            </div>
                            {/* value={editFormData.phone_no} onChange={(e) => setEditFormData({ ...editFormData, phone_no: e.target.value })} */}
                        </div>
                      
                        <div className="form-group row">
                            <label className="col-sm-2 col-form-label"></label>
                            <div className="col-sm-10 d-flex justify-content-end">
                                <input type="submit" className='btn btn-sm btn-primary' value={"Save"} />
                            </div>
                        </div>
                    </form>
                </div>


            </div>
        </div>
    );


};

export default CreateSalary;
