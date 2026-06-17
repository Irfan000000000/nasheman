// import React, { useState } from 'react';
// import authService from './services/authService';

// const Register = () => {
//   const [username, setUsername] = useState('');
//   const [password, setPassword] = useState('');
//   const [message, setMessage] = useState('');

//   const handleRegister = () => {
//     authService.register(username, password)
//       .then(() => {
//         setMessage('User registered successfully');
//       })
//       .catch(error => {
//         setMessage('Registration failed');
//       });
//   };

//   return (
//     <div>
//       <h2>Register</h2>
//       <input type="text" placeholder="Username" onChange={(e) => setUsername(e.target.value)} />
//       <input type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} />
//       <button onClick={handleRegister}>Register</button>
//       {message && <p>{message}</p>}
//     </div>
//   );
// };

// export default Register;


// // src/components/Register.js
// import React, { useEffect, useState } from 'react'
// import authService from './services/authService';
// import { useNavigate } from 'react-router-dom';
// import '../App.css'; // Import CSS for styling
// import Select from 'react-select';


// import axios from 'axios'


// const Register = () => {
//   const [username, setUsername] = useState('');
//   const [password, setPassword] = useState('');
//   const [userType, setUserType] = useState('');
//   const [campus, setCampus] = useState('');
//   const [message, setMessage] = useState('');
//   const [getCampuses, setCampuses] = useState([]);
//   const navigate = useNavigate();

//   const handleRegister = () => {
//     authService.register(username, password)
//       .then(() => {
//         setMessage('User registered successfully');
//         navigate('/login');  // Navigate to the login route after successful registration
//       })
//       .catch(error => {
//         setMessage('Registration failed');
//       });
//   };


//   useEffect(() => {
//     const fetchCampuses = () => {
//       axios.get(process.env.REACT_APP_API_BASE_URL+"/get-campuses")
//         .then(res => {
//           setCampuses(res.data.results);
//         })
//         .catch(err => console.log(err));
//     };

//     fetchCampuses();
//   }, []); // Empty dependency array ensures this effect runs only once, on mount



//   return (
//     <div className="login-container">
//       <h2>Register</h2>
//       <div className="input-container">
//         {/* <i className="fas fa-user"></i> */}
//         <input
//           type="text"
//           placeholder="Type your username" className='form-control'
//           onChange={(e) => setUsername(e.target.value)}
//         />
//       </div>
//       <div className="input-container">
//         {/* <i className="fas fa-lock"></i> */}
//         <input
//           type="password"
//           placeholder="Type your password" className='form-control'
//           onChange={(e) => setPassword(e.target.value)}
//         />
//       </div>

//       <div className="input-container">
//         {/* <i className="fas fa-lock"></i> */}
//         <select name="" id="" className='form-control'>
//           <option value="">Select User Type</option>
//            <option>User</option>
//            <option>Admin</option>
//            <option>Super Admin</option>
//         </select>
//       </div>


//       <Select
//                   options={getCampuses.map(campus_get => ({ value: campus_get.id, label: campus_get.campus }))}
//                   value={ campus ? { value: campus, label: getCampuses.find(campus_get => campus_get.id === campus)?.campus } : ""}
                  
                  
//                   // onChange={(selectedOption) => setEditFormData({ ...editFormData, category: selectedOption ? selectedOption.value : "" })}
//                   // placeholder="Select Category"
//                 />


  
//       <button onClick={handleRegister} className="btn btn-sm btn-success">REGISTER</button>
//       {message && <p>{message}</p>}
//     </div>
//   );
// };

// export default Register;

// src/components/Register.js
import React, { useEffect, useState } from 'react';
import authService from './services/authService';
import { Link, useNavigate } from 'react-router-dom';
import '../App.css'; // Import CSS for styling
import Select from 'react-select';
import axios from 'axios';

const Register = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [userType, setUserType] = useState('');
  const [campus, setCampus] = useState('');
  const [message, setMessage] = useState('');
  const [getCampuses, setCampuses] = useState([]); // Ensure initial state is an empty array
  const navigate = useNavigate();

  const handleRegister = () => {
    authService.register(username, password, userType, campus)
      .then(() => {
        setMessage('User registered successfully');
        setUsername('');
        setPassword('');
        setUserType('');
        setCampus(''); // Corrected to clear the campus state
        // navigate('/login');  // Uncomment if you want to navigate after registration
      })
      .catch(error => {
        setMessage('Registration failed');
      });
  };

  useEffect(() => {
    const fetchCampuses = () => {
      axios.get(process.env.REACT_APP_API_BASE_URL+"/get-campuses")
        .then(res => {
          if (res.data && res.data.results) {
            setCampuses(res.data.results); // Ensure correct data assignment
          } else {
            console.log('Unexpected response structure:', res.data);
          }
        })
        .catch(err => console.log(err));
    };

    fetchCampuses();
  }, []); // Empty dependency array ensures this effect runs only once, on mount

  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", width:"100vw", height:"100vh" }}>
    <div className="login-container">
      <div className='pb-5'>
      <img 
        style={{ width: '150px' }} 
        src={`${process.env.REACT_APP_BASE_URL}/uploads/logo.png`} 
        alt="Logo" 
      />
      </div>
      <div className="input-container">
        <input
          type="text"
          placeholder="Type your username" className='form-control'
          value={username} // Added value to bind the state
          onChange={(e) => setUsername(e.target.value)}
        />
      </div>
      <div className="input-container">
        <input
          type="password"
          placeholder="Type your password" className='form-control'
          value={password} // Added value to bind the state
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      <div className="input-container">
        <select 
          name="userType" 
          id="userType" 
          className='form-control'
          value={userType} // Added value to bind the state
          onChange={(e) => setUserType(e.target.value)}
        >
          <option value="">Select User Type</option>
          <option value="User">User</option>
          <option value="Admin">Admin</option>
          <option value="Super Admin">Super Admin</option>
        </select>
      </div>
      <div>
        <Select className='text-left'
          options={getCampuses.map(campus_get => ({ value: campus_get.id, label: campus_get.campus_name }))}
          value={campus ? { value: campus, label: getCampuses.find(campus_get => campus_get.id === campus)?.campus_name } : null}
          onChange={(selectedOption) => setCampus(selectedOption ? selectedOption.value : "")}
          placeholder="Select Campus"
        />
      </div>
      <div className='m-3'>
        <button onClick={handleRegister} className="btn btn-sm btn-warning">REGISTER</button>
      </div>
      <div>
      <label className='mt-3' ><Link to="/login"  style={{color:'white'}}>For login click here</Link></label>
      </div>
      {message && <p>{message}</p>}
    </div>
    </div>
  );
};

export default Register;
