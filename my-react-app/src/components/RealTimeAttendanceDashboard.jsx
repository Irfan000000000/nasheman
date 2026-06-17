// import React, { useState, useEffect, useContext } from 'react';
// import axios from 'axios';
// import { useAuth } from './AuthContext';
// import AcademicSessionContext from './AcademicSessionContext';
// import io from 'socket.io-client'; // npm install socket.io-client

// const RealTimeAttendanceDashboard = () => {
//   const [liveAttendance, setLiveAttendance] = useState([]);
//   const [stats, setStats] = useState({
//     totalEmployees: 0,
//     present: 0,
//     absent: 0,
//     onLeave: 0,
//     notMarked: 0
//   });
//   const [lastUpdate, setLastUpdate] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [socketConnected, setSocketConnected] = useState(false);
//   const [socket, setSocket] = useState(null);
//   const [newAttendanceNotification, setNewAttendanceNotification] = useState(null);

//   const { user } = useAuth();
//   const { academicSession } = useContext(AcademicSessionContext);

//   // Socket.IO URL - change this to your server URL
//   const SOCKET_URL = process.env.REACT_APP_SOCKET_URL || 'http://localhost:3000';

//   // Format timestamp to 12-hour format
//   const formatTime = (timestamp) => {
//     if (!timestamp) return 'Not Punched';
//     const date = new Date(timestamp);
//     return date.toLocaleTimeString('en-US', {
//       hour: '2-digit',
//       minute: '2-digit',
//       second: '2-digit',
//       hour12: true
//     });
//   };

//   const formatDate = (timestamp) => {
//     if (!timestamp) return '';
//     const date = new Date(timestamp);
//     return date.toLocaleDateString('en-GB');
//   };

//   // Calculate statistics
//   const calculateStats = (attendance, total) => {
//     const present = attendance.filter(a => a.status === 'present').length;
//     const onLeave = attendance.filter(a => 
//       ['casual_leave', 'earned_leave', 'maternity_leave', 'ex_pakistan_leave'].includes(a.status)
//     ).length;
//     const absent = attendance.filter(a => a.status === 'absent').length;
//     const notMarked = total - attendance.length;

//     setStats({
//       totalEmployees: total,
//       present,
//       absent,
//       onLeave,
//       notMarked
//     });
//   };

//   // Initialize Socket.IO connection
//   useEffect(() => {
//     const newSocket = io(SOCKET_URL, {
//       transports: ['websocket', 'polling']
//     });

//     newSocket.on('connect', () => {
//       console.log('✅ Socket.IO Connected');
//       setSocketConnected(true);
//     });

//     newSocket.on('disconnect', () => {
//       console.log('❌ Socket.IO Disconnected');
//       setSocketConnected(false);
//     });

//     newSocket.on('connected', (data) => {
//       console.log('📡 Server message:', data.message);
//     });

//     // Listen for real-time attendance updates
//     newSocket.on('attendance-update', (data) => {
//       console.log('🔄 Real-time update received:', data);
      
//       // Only update if it's for the current campus
//       if (data.attendance && data.attendance.length > 0) {
//         const firstRecord = data.attendance[0];
//         if (!firstRecord.campus_id || firstRecord.campus_id === user.user.campus_id) {
//           setLiveAttendance(data.attendance);
//           calculateStats(data.attendance, data.totalEmployees);
//           setLastUpdate(new Date());
          
//           // Show notification
//           setNewAttendanceNotification('New attendance recorded!');
//           setTimeout(() => setNewAttendanceNotification(null), 3000);
          
//           // Play notification sound (optional)
//           try {
//             const audio = new Audio('/notification.mp3');
//             audio.play().catch(e => console.log('Audio play failed:', e));
//           } catch (e) {}
//         }
//       }
//     });

//     setSocket(newSocket);

//     // Cleanup on unmount
//     return () => {
//       newSocket.close();
//     };
//   }, [user.user.campus_id]);

//   // Fetch initial attendance data
//   const fetchLiveAttendance = async () => {
//     setLoading(true);
//     try {
//       const today = new Date().toISOString().split('T')[0];
//       const response = await axios.get(
//         `${process.env.REACT_APP_API_BASE_URL}/api/live-attendance/${today}/${user.user.campus_id}/${academicSession}`
//       );
      
//       const data = response.data;
//       setLiveAttendance(data.attendance);
//       calculateStats(data.attendance, data.totalEmployees);
//       setLastUpdate(new Date());
//     } catch (error) {
//       console.error('Error fetching live attendance:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Manual refresh
//   const handleManualRefresh = () => {
//     if (socket && socket.connected) {
//       const today = new Date().toISOString().split('T')[0];
//       socket.emit('request-refresh', {
//         campus_id: user.user.campus_id,
//         session_id: academicSession,
//         date: today
//       });
//     } else {
//       fetchLiveAttendance();
//     }
//   };

//   // Load initial data
//   useEffect(() => {
//     fetchLiveAttendance();
//   }, [user.user.campus_id, academicSession]);

//   const getStatusBadge = (status) => {
//     const badges = {
//       present: { bg: '#28a745', text: 'Present' },
//       absent: { bg: '#dc3545', text: 'Absent' },
//       casual_leave: { bg: '#ffc107', text: 'Casual Leave' },
//       earned_leave: { bg: '#17a2b8', text: 'Earned Leave' },
//       maternity_leave: { bg: '#e83e8c', text: 'Maternity Leave' },
//       ex_pakistan_leave: { bg: '#6610f2', text: 'Ex-Pakistan Leave' },
//       holiday: { bg: '#6c757d', text: 'Holiday' },
//       lwp: { bg: '#fd7e14', text: 'LWP' }
//     };

//     const badge = badges[status] || { bg: '#6c757d', text: status };
//     return (
//       <span style={{
//         backgroundColor: badge.bg,
//         color: 'white',
//         padding: '4px 10px',
//         borderRadius: '12px',
//         fontSize: '11px',
//         fontWeight: 'bold',
//         display: 'inline-block'
//       }}>
//         {badge.text}
//       </span>
//     );
//   };

//   const getTimeElapsed = (timestamp) => {
//     if (!timestamp) return '';
//     const now = new Date();
//     const time = new Date(timestamp);
//     const diff = Math.floor((now - time) / 1000 / 60);
    
//     if (diff < 60) return `${diff}m ago`;
//     const hours = Math.floor(diff / 60);
//     return `${hours}h ${diff % 60}m ago`;
//   };

//   return (
//     <div style={{ padding: '20px', backgroundColor: '#f8f9fa', minHeight: '100vh' }}>
//       {/* Notification Toast */}
//       {newAttendanceNotification && (
//         <div style={{
//           position: 'fixed',
//           top: '20px',
//           right: '20px',
//           backgroundColor: '#28a745',
//           color: 'white',
//           padding: '15px 25px',
//           borderRadius: '8px',
//           boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
//           zIndex: 9999,
//           animation: 'slideIn 0.3s ease-out'
//         }}>
//           <i className="fas fa-check-circle" style={{ marginRight: '10px' }}></i>
//           {newAttendanceNotification}
//         </div>
//       )}

//       {/* Header */}
//       <div style={{
//         backgroundColor: 'white',
//         padding: '20px',
//         borderRadius: '10px',
//         boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
//         marginBottom: '20px'
//       }}>
//         <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
//           <div>
//             <h3 style={{ margin: 0, color: '#333' }}>
//               <i className="fas fa-chart-line" style={{ marginRight: '10px' }}></i>
//               Live Attendance Dashboard
//             </h3>
//             <p style={{ margin: '5px 0 0 0', color: '#666', fontSize: '14px' }}>
//               {lastUpdate && `Last updated: ${lastUpdate.toLocaleTimeString('en-US', { hour12: true })}`}
//               {loading && ' - Updating...'}
//               {socketConnected && (
//                 <span style={{ marginLeft: '10px', color: '#28a745' }}>
//                   <i className="fas fa-circle" style={{ fontSize: '8px' }}></i> Live
//                 </span>
//               )}
//               {!socketConnected && (
//                 <span style={{ marginLeft: '10px', color: '#dc3545' }}>
//                   <i className="fas fa-circle" style={{ fontSize: '8px' }}></i> Disconnected
//                 </span>
//               )}
//             </p>
//           </div>
//           <div>
//             <button
//               onClick={handleManualRefresh}
//               style={{
//                 backgroundColor: '#007bff',
//                 color: 'white',
//                 border: 'none',
//                 padding: '10px 20px',
//                 borderRadius: '5px',
//                 cursor: 'pointer'
//               }}
//               disabled={loading}
//             >
//               <i className="fas fa-sync-alt" style={{ marginRight: '5px' }}></i>
//               Refresh Now
//             </button>
//           </div>
//         </div>
//       </div>

//       {/* Statistics Cards */}
//       <div style={{
//         display: 'grid',
//         gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
//         gap: '20px',
//         marginBottom: '20px'
//       }}>
//         <div style={{
//           backgroundColor: 'white',
//           padding: '20px',
//           borderRadius: '10px',
//           boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
//           borderLeft: '4px solid #007bff'
//         }}>
//           <div style={{ fontSize: '14px', color: '#666', marginBottom: '5px' }}>Total Employees</div>
//           <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#007bff' }}>
//             {stats.totalEmployees}
//           </div>
//         </div>

//         <div style={{
//           backgroundColor: 'white',
//           padding: '20px',
//           borderRadius: '10px',
//           boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
//           borderLeft: '4px solid #28a745'
//         }}>
//           <div style={{ fontSize: '14px', color: '#666', marginBottom: '5px' }}>Present</div>
//           <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#28a745' }}>
//             {stats.present}
//             <span style={{ fontSize: '16px', color: '#666', marginLeft: '10px' }}>
//               ({stats.totalEmployees > 0 ? ((stats.present / stats.totalEmployees) * 100).toFixed(1) : 0}%)
//             </span>
//           </div>
//         </div>

//         <div style={{
//           backgroundColor: 'white',
//           padding: '20px',
//           borderRadius: '10px',
//           boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
//           borderLeft: '4px solid #ffc107'
//         }}>
//           <div style={{ fontSize: '14px', color: '#666', marginBottom: '5px' }}>On Leave</div>
//           <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#ffc107' }}>
//             {stats.onLeave}
//           </div>
//         </div>

//         <div style={{
//           backgroundColor: 'white',
//           padding: '20px',
//           borderRadius: '10px',
//           boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
//           borderLeft: '4px solid #dc3545'
//         }}>
//           <div style={{ fontSize: '14px', color: '#666', marginBottom: '5px' }}>Absent</div>
//           <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#dc3545' }}>
//             {stats.absent}
//           </div>
//         </div>

//         <div style={{
//           backgroundColor: 'white',
//           padding: '20px',
//           borderRadius: '10px',
//           boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
//           borderLeft: '4px solid #6c757d'
//         }}>
//           <div style={{ fontSize: '14px', color: '#666', marginBottom: '5px' }}>Not Marked</div>
//           <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#6c757d' }}>
//             {stats.notMarked}
//           </div>
//         </div>
//       </div>

//       {/* Live Attendance Table */}
//       <div style={{
//         backgroundColor: 'white',
//         padding: '20px',
//         borderRadius: '10px',
//         boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
//       }}>
//         <h5 style={{ marginBottom: '20px', color: '#333' }}>
//           <i className="fas fa-users" style={{ marginRight: '10px' }}></i>
//           Today's Attendance ({formatDate(new Date())})
//         </h5>

//         <div style={{ overflowX: 'auto' }}>
//           <table className="table table-hover" style={{ marginBottom: 0 }}>
//             <thead style={{ backgroundColor: '#f8f9fa' }}>
//               <tr>
//                 <th style={{ padding: '12px', width: '5%' }}>Sr#</th>
//                 <th style={{ padding: '12px', width: '20%' }}>Employee Name</th>
//                 <th style={{ padding: '12px', width: '15%' }}>Designation</th>
//                 <th style={{ padding: '12px', width: '12%' }}>Status</th>
//                 <th style={{ padding: '12px', width: '15%' }}>Check-in Time</th>
//                 <th style={{ padding: '12px', width: '15%' }}>Check-out Time</th>
//                 <th style={{ padding: '12px', width: '18%' }}>Remarks</th>
//               </tr>
//             </thead>
//             <tbody>
//               {liveAttendance.length > 0 ? (
//                 liveAttendance.map((record, index) => (
//                   <tr key={record.id}>
//                     <td style={{ padding: '12px' }}>{index + 1}</td>
//                     <td style={{ padding: '12px', fontWeight: '500' }}>
//                       {record.full_name}
//                     </td>
//                     <td style={{ padding: '12px', color: '#666' }}>
//                       {record.employee_post || 'N/A'}
//                     </td>
//                     <td style={{ padding: '12px' }}>
//                       {getStatusBadge(record.status)}
//                     </td>
//                     <td style={{ padding: '12px' }}>
//                       <div style={{ color: '#28a745', fontWeight: '500' }}>
//                         {formatTime(record.first_punch)}
//                       </div>
//                       {record.first_punch && (
//                         <div style={{ fontSize: '11px', color: '#999' }}>
//                           {getTimeElapsed(record.first_punch)}
//                         </div>
//                       )}
//                     </td>
//                     <td style={{ padding: '12px' }}>
//                       <div style={{ color: '#dc3545', fontWeight: '500' }}>
//                         {formatTime(record.last_punch)}
//                       </div>
//                       {record.last_punch && (
//                         <div style={{ fontSize: '11px', color: '#999' }}>
//                           {getTimeElapsed(record.last_punch)}
//                         </div>
//                       )}
//                     </td>
//                     <td style={{ padding: '12px', color: '#666' }}>
//                       {record.remarks || '-'}
//                     </td>
//                   </tr>
//                 ))
//               ) : (
//                 <tr>
//                   <td colSpan="7" style={{ 
//                     textAlign: 'center', 
//                     padding: '40px',
//                     color: '#999'
//                   }}>
//                     {loading ? 'Loading attendance data...' : 'No attendance records found for today'}
//                   </td>
//                 </tr>
//               )}
//             </tbody>
//           </table>
//         </div>
//       </div>

//       <style jsx>{`
//         @keyframes slideIn {
//           from {
//             transform: translateX(400px);
//             opacity: 0;
//           }
//           to {
//             transform: translateX(0);
//             opacity: 1;
//           }
//         }
        
//         .table-hover tbody tr:hover {
//           background-color: #f8f9fa;
//         }
//       `}</style>
//     </div>
//   );
// };

// export default RealTimeAttendanceDashboard;



import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useAuth } from './AuthContext';
import AcademicSessionContext from './AcademicSessionContext';
import io from 'socket.io-client';

const RealTimeAttendanceDashboard = () => {
  const [liveAttendance, setLiveAttendance] = useState([]);
  const [stats, setStats] = useState({
    totalEmployees: 0,
    present: 0,
    absent: 0,
    onLeave: 0,
    notMarked: 0
  });
  const [lastUpdate, setLastUpdate] = useState(null);
  const [loading, setLoading] = useState(false);
  const [socketConnected, setSocketConnected] = useState(false);
  const [socket, setSocket] = useState(null);
  const [newAttendanceNotification, setNewAttendanceNotification] = useState(null);

  const { user } = useAuth();
  const { academicSession } = useContext(AcademicSessionContext);

  const SOCKET_URL = process.env.REACT_APP_SOCKET_URL || 'http://localhost:3000';

  const formatTime = (timestamp) => {
    if (!timestamp) return 'Not Punched';
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true
    });
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    return date.toLocaleDateString('en-GB');
  };

  const calculateStats = (attendance, total) => {
    const present = attendance.filter(a => a.status === 'present').length;
    const onLeave = attendance.filter(a => 
      ['casual_leave', 'earned_leave', 'maternity_leave', 'ex_pakistan_leave'].includes(a.status)
    ).length;
    const absent = attendance.filter(a => a.status === 'absent').length;
    const notMarked = total - attendance.length;

    setStats({
      totalEmployees: total,
      present,
      absent,
      onLeave,
      notMarked
    });
  };

  const getLocalDate = (date = new Date()) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};

  // Fetch initial attendance data - YEH HAMESHA CHALTA RAHEGA
  const fetchLiveAttendance = async () => {
    setLoading(true);
    try {
      const today = getLocalDate();
      const response = await axios.get(
        `${process.env.REACT_APP_API_BASE_URL}/api/live-attendance/${today}/${user.user.campus_id}/${academicSession}`
      );
      
      const data = response.data;
      console.log('📥 Initial data loaded:', data.attendance.length, 'records');
      setLiveAttendance(data.attendance);
      calculateStats(data.attendance, data.totalEmployees);
      setLastUpdate(new Date());
    } catch (error) {
      console.error('Error fetching live attendance:', error);
    } finally {
      setLoading(false);
    }
  };

  // Socket.IO connection - YEH UPDATES KE LIYE HAI
  useEffect(() => {
    const newSocket = io(SOCKET_URL, {
      transports: ['websocket', 'polling']
    });

    newSocket.on('connect', () => {
      console.log('✅ Socket.IO Connected');
      setSocketConnected(true);
    });

    newSocket.on('disconnect', () => {
      console.log('❌ Socket.IO Disconnected');
      setSocketConnected(false);
    });

    newSocket.on('connected', (data) => {
      console.log('📡 Server message:', data.message);
    });

    // IMPORTANT: Real-time updates ko existing data ke saath MERGE karen
    newSocket.on('attendance-update', (data) => {
      console.log('🔄 Real-time update received:', data);
      
      if (data.attendance && data.attendance.length > 0) {
        // Check if update is for current campus
        const campusMatch = data.campus_id === user.user.campus_id || 
                           !data.campus_id;
        
        if (campusMatch) {
          setLiveAttendance(prevAttendance => {
            // Create a Map of existing records by employee_id
            const attendanceMap = new Map();
            prevAttendance.forEach(record => {
              attendanceMap.set(record.employee_id, record);
            });

            // Update or add new records from socket
            data.attendance.forEach(newRecord => {
              const existingRecord = attendanceMap.get(newRecord.employee_id);
              
              // Only update if new record is more recent OR doesn't exist
              if (!existingRecord || 
                  new Date(newRecord.updated_at) > new Date(existingRecord.updated_at)) {
                attendanceMap.set(newRecord.employee_id, newRecord);
              }
            });

            // Convert Map back to array
            const mergedAttendance = Array.from(attendanceMap.values());
            
            // Sort by updated_at DESC (latest first)
            mergedAttendance.sort((a, b) => 
              new Date(b.updated_at) - new Date(a.updated_at)
            );

            console.log('✅ Merged attendance:', mergedAttendance.length, 'records');
            return mergedAttendance;
          });

          calculateStats(data.attendance, data.totalEmployees);
          setLastUpdate(new Date());
          
          // Show notification
          setNewAttendanceNotification('New attendance recorded!');
          setTimeout(() => setNewAttendanceNotification(null), 3000);
          
          // Play notification sound
          try {
            const audio = new Audio('/notification.mp3');
            audio.play().catch(e => console.log('Audio play failed:', e));
          } catch (e) {}
        }
      }
    });

    setSocket(newSocket);

    return () => {
      newSocket.close();
    };
  }, [user.user.campus_id]);

  // Load initial data on mount aur jab campus/session change ho
  useEffect(() => {
    fetchLiveAttendance();
  }, [user.user.campus_id, academicSession]);

  // Manual refresh - FULL DATA FETCH
  const handleManualRefresh = () => {
    fetchLiveAttendance();
  };

  const getStatusBadge = (status) => {
    const badges = {
      present: { bg: '#28a745', text: 'Present' },
      absent: { bg: '#dc3545', text: 'Absent' },
      casual_leave: { bg: '#ffc107', text: 'Casual Leave' },
      earned_leave: { bg: '#17a2b8', text: 'Earned Leave' },
      maternity_leave: { bg: '#e83e8c', text: 'Maternity Leave' },
      ex_pakistan_leave: { bg: '#6610f2', text: 'Ex-Pakistan Leave' },
      holiday: { bg: '#6c757d', text: 'Holiday' },
      lwp: { bg: '#fd7e14', text: 'LWP' }
    };

    const badge = badges[status] || { bg: '#6c757d', text: status };
    return (
      <span style={{
        backgroundColor: badge.bg,
        color: 'white',
        padding: '4px 10px',
        borderRadius: '12px',
        fontSize: '11px',
        fontWeight: 'bold',
        display: 'inline-block'
      }}>
        {badge.text}
      </span>
    );
  };

  const getTimeElapsed = (timestamp) => {
    if (!timestamp) return '';
    const now = new Date();
    const time = new Date(timestamp);
    const diff = Math.floor((now - time) / 1000 / 60);
    
    if (diff < 60) return `${diff}m ago`;
    const hours = Math.floor(diff / 60);
    return `${hours}h ${diff % 60}m ago`;
  };

  return (
    <div style={{ padding: '20px', backgroundColor: '#f8f9fa', minHeight: '100vh' }}>
      {/* Notification Toast */}
      {newAttendanceNotification && (
        <div style={{
          position: 'fixed',
          top: '20px',
          right: '20px',
          backgroundColor: '#28a745',
          color: 'white',
          padding: '15px 25px',
          borderRadius: '8px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
          zIndex: 9999,
          animation: 'slideIn 0.3s ease-out'
        }}>
          <i className="fas fa-check-circle" style={{ marginRight: '10px' }}></i>
          {newAttendanceNotification}
        </div>
      )}

      {/* Header */}
      <div style={{
        backgroundColor: 'white',
        padding: '20px',
        borderRadius: '10px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        marginBottom: '20px'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h3 style={{ margin: 0, color: '#333' }}>
              <i className="fas fa-chart-line" style={{ marginRight: '10px' }}></i>
              Live Attendance Dashboard
            </h3>
            <p style={{ margin: '5px 0 0 0', color: '#666', fontSize: '14px' }}>
              {lastUpdate && `Last updated: ${lastUpdate.toLocaleTimeString('en-US', { hour12: true })}`}
              {loading && ' - Updating...'}
              {socketConnected && (
                <span style={{ marginLeft: '10px', color: '#28a745' }}>
                  <i className="fas fa-circle" style={{ fontSize: '8px' }}></i> Live
                </span>
              )}
              {!socketConnected && (
                <span style={{ marginLeft: '10px', color: '#dc3545' }}>
                  <i className="fas fa-circle" style={{ fontSize: '8px' }}></i> Disconnected
                </span>
              )}
              <span style={{ marginLeft: '10px', color: '#007bff' }}>
                ({liveAttendance.length} records loaded)
              </span>
            </p>
          </div>
          <div>
            <button
              onClick={handleManualRefresh}
              style={{
                backgroundColor: '#007bff',
                color: 'white',
                border: 'none',
                padding: '10px 20px',
                borderRadius: '5px',
                cursor: 'pointer'
              }}
              disabled={loading}
            >
              <i className="fas fa-sync-alt" style={{ marginRight: '5px' }}></i>
              Refresh Now
            </button>
          </div>
        </div>
      </div>

      {/* Statistics Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '20px',
        marginBottom: '20px'
      }}>
        <div style={{
          backgroundColor: 'white',
          padding: '20px',
          borderRadius: '10px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          borderLeft: '4px solid #007bff'
        }}>
          <div style={{ fontSize: '14px', color: '#666', marginBottom: '5px' }}>Total Employees</div>
          <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#007bff' }}>
            {stats.totalEmployees}
          </div>
        </div>

        <div style={{
          backgroundColor: 'white',
          padding: '20px',
          borderRadius: '10px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          borderLeft: '4px solid #28a745'
        }}>
          <div style={{ fontSize: '14px', color: '#666', marginBottom: '5px' }}>Present</div>
          <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#28a745' }}>
            {stats.present}
            <span style={{ fontSize: '16px', color: '#666', marginLeft: '10px' }}>
              ({stats.totalEmployees > 0 ? ((stats.present / stats.totalEmployees) * 100).toFixed(1) : 0}%)
            </span>
          </div>
        </div>

        <div style={{
          backgroundColor: 'white',
          padding: '20px',
          borderRadius: '10px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          borderLeft: '4px solid #ffc107'
        }}>
          <div style={{ fontSize: '14px', color: '#666', marginBottom: '5px' }}>On Leave</div>
          <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#ffc107' }}>
            {stats.onLeave}
          </div>
        </div>

        <div style={{
          backgroundColor: 'white',
          padding: '20px',
          borderRadius: '10px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          borderLeft: '4px solid #dc3545'
        }}>
          <div style={{ fontSize: '14px', color: '#666', marginBottom: '5px' }}>Absent</div>
          <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#dc3545' }}>
            {stats.absent}
          </div>
        </div>

        <div style={{
          backgroundColor: 'white',
          padding: '20px',
          borderRadius: '10px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          borderLeft: '4px solid #6c757d'
        }}>
          <div style={{ fontSize: '14px', color: '#666', marginBottom: '5px' }}>Not Marked</div>
          <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#6c757d' }}>
            {stats.notMarked}
          </div>
        </div>
      </div>

      {/* Live Attendance Table */}
      <div style={{
        backgroundColor: 'white',
        padding: '20px',
        borderRadius: '10px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
      }}>
        <h5 style={{ marginBottom: '20px', color: '#333' }}>
          <i className="fas fa-users" style={{ marginRight: '10px' }}></i>
          Today's Attendance ({formatDate(new Date())})
        </h5>

        <div style={{ overflowX: 'auto' }}>
          <table className="table table-hover" style={{ marginBottom: 0 }}>
            <thead style={{ backgroundColor: '#f8f9fa' }}>
              <tr>
                <th style={{ padding: '12px', width: '5%' }}>Sr#</th>
                <th style={{ padding: '12px', width: '20%' }}>Employee Name</th>
                <th style={{ padding: '12px', width: '15%' }}>Designation</th>
                <th style={{ padding: '12px', width: '12%' }}>Status</th>
                <th style={{ padding: '12px', width: '15%' }}>Check-in Time</th>
                <th style={{ padding: '12px', width: '15%' }}>Check-out Time</th>
                <th style={{ padding: '12px', width: '18%' }}>Remarks</th>
              </tr>
            </thead>
            <tbody>
              {liveAttendance.length > 0 ? (
                liveAttendance.map((record, index) => (
                  <tr key={record.id}>
                    <td style={{ padding: '12px' }}>{index + 1}</td>
                    <td style={{ padding: '12px', fontWeight: '500' }}>
                      {record.full_name}
                    </td>
                    <td style={{ padding: '12px', color: '#666' }}>
                      {record.employee_post || 'N/A'}
                    </td>
                    <td style={{ padding: '12px' }}>
                      {getStatusBadge(record.status)}
                    </td>
                    <td style={{ padding: '12px' }}>
                      <div style={{ color: '#28a745', fontWeight: '500' }}>
                        {formatTime(record.first_punch)}
                      </div>
                      {record.first_punch && (
                        <div style={{ fontSize: '11px', color: '#999' }}>
                          {getTimeElapsed(record.first_punch)}
                        </div>
                      )}
                    </td>
                    <td style={{ padding: '12px' }}>
                      <div style={{ color: '#dc3545', fontWeight: '500' }}>
                        {formatTime(record.last_punch)}
                      </div>
                      {record.last_punch && (
                        <div style={{ fontSize: '11px', color: '#999' }}>
                          {getTimeElapsed(record.last_punch)}
                        </div>
                      )}
                    </td>
                    <td style={{ padding: '12px', color: '#666' }}>
                      {record.remarks || '-'}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" style={{ 
                    textAlign: 'center', 
                    padding: '40px',
                    color: '#999'
                  }}>
                    {loading ? 'Loading attendance data...' : 'No attendance records found for today'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <style jsx>{`
        @keyframes slideIn {
          from {
            transform: translateX(400px);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        
        .table-hover tbody tr:hover {
          background-color: #f8f9fa;
        }
      `}</style>
    </div>
  );
};

export default RealTimeAttendanceDashboard;