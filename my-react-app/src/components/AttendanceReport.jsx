// import React from 'react';

// const AttendanceReport = ({ attendanceData }) => {
//   // Function to get month name from a date (e.g., "2025-01-01" => "January")
//   const getMonthName = (dateString) => {
//     const date = new Date(dateString);
//     const options = { month: 'long' };
//     return date.toLocaleString('en-US', options);
//   };

//   // Function to generate an empty attendance array for 31 days
//   const createEmptyAttendance = (daysInMonth) => {
//     return Array.from({ length: daysInMonth }, () => '-');
//   };

//   // Function to get the number of days in a month
//   const getDaysInMonth = (month) => {
//     const date = new Date(month + ' 1, 2025'); // Set a fixed year to calculate
//     return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
//   };

//   // Group attendance data by month and day
//   const attendanceByMonth = () => {
//     const months = {};

//     attendanceData.forEach((entry) => {
//       const monthName = getMonthName(entry.date); // Get the month from the date
//       const day = new Date(entry.date).getDate(); // Get the day from the date

//       if (!months[monthName]) {
//         const daysInMonth = getDaysInMonth(monthName); // Get the number of days for this month
//         months[monthName] = createEmptyAttendance(daysInMonth); // Initialize empty data for the month
//       }

//       months[monthName][day - 1] = entry.status === 'present' ? 'present' : 'absent'; // Mark attendance
//     });

//     return Object.keys(months).map((month) => ({
//       month,
//       attendance: months[month],
//     }));
//   };

//   // Get the attendance data grouped by month
//   const attendanceDataByMonth = attendanceByMonth();

//   return (
//     <div>
//       <table id="category_summary" style={{ "width": "100%" }} border="1" cellPadding="10">
//         <thead>
//           <tr>
//             <th>Month</th>
//             {[...Array(31)].map((_, i) => (
//               <th key={i}>{i + 1}</th>
//             ))}
//           </tr>
//         </thead>
//         <tbody>
//           {attendanceDataByMonth.map((monthData, index) => (
//             <tr key={index}>
//               <td>{monthData.month}</td>
//               {monthData.attendance.map((status, i) => (
//                 <td key={i}>{status === "present" ? "P" : status === "absent" ? "A" : status === "leave" ? "L" : status}</td>
//               ))}
//               <td>-</td> {/* You can implement cumulative data here if needed */}
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );
// };

// export default AttendanceReport;



// import React from 'react';

// const AttendanceReport = ({ attendanceData }) => {
//   // Function to get month name from a date (e.g., "2025-01-01" => "January")
//   const getMonthName = (dateString) => {
//     const date = new Date(dateString);
//     const options = { month: 'long' };
//     return date.toLocaleString('en-US', options);
//   };

//   // Function to generate an empty attendance array for 31 days
//   const createEmptyAttendance = (daysInMonth) => {
//     return Array.from({ length: daysInMonth }, () => '-');
//   };

//   // Function to get the number of days in a month
//   const getDaysInMonth = (month) => {
//     const date = new Date(month + ' 1, 2025'); // Set a fixed year to calculate
//     return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
//   };

//   // Group attendance data by month and day
//   const attendanceByMonth = () => {
//     const months = {};

//     attendanceData.forEach((entry) => {
//       const monthName = getMonthName(entry.date); // Get the month from the date
//       const day = new Date(entry.date).getDate(); // Get the day from the date

//       if (!months[monthName]) {
//         const daysInMonth = getDaysInMonth(monthName); // Get the number of days for this month
//         months[monthName] = createEmptyAttendance(daysInMonth); // Initialize empty data for the month
//       }

//       months[monthName][day - 1] = entry.status === 'present' ? 'present' : entry.status === 'absent' ? 'absent' : 'leave'; // Mark attendance
//     });

//     return Object.keys(months).map((month) => ({
//       month,
//       attendance: months[month],
//     }));
//   };

//   // Get the attendance data grouped by month
//   const attendanceDataByMonth = attendanceByMonth();

//   return (
//     <div>
//       <table id="category_summary" style={{ "width": "100%" }} border="1" cellPadding="10">
//         <thead>
//           <tr>
//             <th>Month</th>
//             {[...Array(31)].map((_, i) => (
//               <th key={i}>{i + 1}</th>
//             ))}
//             <th>Total P</th>
//             <th>Total A</th>
//             <th>Total L</th>
//           </tr>
//         </thead>
//         <tbody>
//           {attendanceDataByMonth.map((monthData, index) => {
//             const presentCount = monthData.attendance.filter(status => status === 'present').length;
//             const absentCount = monthData.attendance.filter(status => status === 'absent').length;
//             const leaveCount = monthData.attendance.filter(status => status === 'leave').length;

//             return (
//               <tr key={index}>
//                 <td>{monthData.month}</td>
//                 {monthData.attendance.map((status, i) => (
//                   <td key={i}>
//                     {status === "present" ? "P" : status === "absent" ? "A" : status === "leave" ? "L" : "-"}
//                   </td>
//                 ))}
//                 <td>{presentCount}</td>
//                 <td>{absentCount}</td>
//                 <td>{leaveCount}</td>
//               </tr>
//             );
//           })}
//         </tbody>
//       </table>
//     </div>
//   );
// };

// export default AttendanceReport;



// import React from 'react';

// const AttendanceReport = ({ attendanceData }) => {
//   // Function to get month name from a date (e.g., "2025-01-01" => "January")
//   const getMonthName = (dateString) => {
//     const date = new Date(dateString);
//     const options = { month: 'long' };
//     return date.toLocaleString('en-US', options);
//   };

//   // Function to generate an empty attendance array for the specific number of days
//   const createEmptyAttendance = (daysInMonth) => {
//     return Array.from({ length: daysInMonth }, () => '-');
//   };

//   // Function to get the number of days in a month
//   const getDaysInMonth = (month) => {
//     const date = new Date(month + ' 1, 2025'); // Set a fixed year to calculate
//     return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
//   };

//   // Group attendance data by month and day
//   const attendanceByMonth = () => {
//     const months = {};

//     attendanceData.forEach((entry) => {
//       const monthName = getMonthName(entry.date); // Get the month from the date
//       const day = new Date(entry.date).getDate(); // Get the day from the date

//       if (!months[monthName]) {
//         const daysInMonth = getDaysInMonth(monthName); // Get the number of days for this month
//         months[monthName] = createEmptyAttendance(daysInMonth); // Initialize empty data for the month
//       }

//       // Mark attendance based on status
//       months[monthName][day - 1] = entry.status === 'present' ? 'present' : entry.status === 'absent' ? 'absent' : 'leave';
//     });

//     return Object.keys(months).map((month) => ({
//       month,
//       attendance: months[month],
//     }));
//   };

//   // Get the attendance data grouped by month
//   const attendanceDataByMonth = attendanceByMonth();

//   return (
//     <div>
//       <table id="category_summary" style={{ "width": "100%" }} border="1" cellPadding="10">
//         <thead>
//           <tr>
//             <th>Month</th>
//             {[...Array(31)].map((_, i) => (
//               <th key={i}>{i + 1}</th>
//             ))}
//             <th>Total P</th>
//             <th>Total A</th>
//             <th>Total L</th>
//           </tr>
//         </thead>
//         <tbody>
//           {attendanceDataByMonth.map((monthData, index) => {
//             const presentCount = monthData.attendance.filter(status => status === 'present').length;
//             const absentCount = monthData.attendance.filter(status => status === 'absent').length;
//             const leaveCount = monthData.attendance.filter(status => status === 'leave').length;

//             // Calculate the correct number of days for the month
//             const daysInMonth = getDaysInMonth(monthData.month);

//             return (
//               <tr key={index}>
//                 <td>{monthData.month}</td>
//                 {/* Render the attendance status for each day in the month */}
//                 {monthData.attendance.map((status, i) => (
//                   <td key={i}>
//                     {status === "present" ? "P" : status === "absent" ? "A" : status === "leave" ? "L" : "-"}
//                   </td>
//                 ))}
//                 {/* Render empty cells for remaining days if month has fewer than 31 days */}
//                 {Array.from({ length: 31 - daysInMonth }).map((_, i) => (
//                   <td key={`empty-${i}`}></td>
//                 ))}
//                 <td>{presentCount}</td>
//                 <td>{absentCount}</td>
//                 <td>{leaveCount}</td>
//               </tr>
//             );
//           })}
//         </tbody>
//       </table>
//     </div>
//   );
// };

// export default AttendanceReport;



import React from 'react';

const AttendanceReport = ({ attendanceData }) => {
  // Function to get month and year from a date (e.g., "2025-01-01" => "January 2025")
  const getMonthNameAndYear = (dateString) => {
    const date = new Date(dateString);
    const options = { month: 'long', year: 'numeric' };
    return date.toLocaleString('en-US', options); // Returns "January 2025"
  };

  // Function to generate an empty attendance array for the specific number of days
  const createEmptyAttendance = (daysInMonth) => {
    return Array.from({ length: daysInMonth }, () => '-');
  };

  // Function to get the number of days in a month
  const getDaysInMonth = (month) => {
    const date = new Date(month + ' 1, 2025'); // Set a fixed year to calculate
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  // Group attendance data by month and day
  const attendanceByMonth = () => {
    const months = {};

    attendanceData.forEach((entry) => {
      const monthNameAndYear = getMonthNameAndYear(entry.date); // Get the month and year from the date
      const day = new Date(entry.date).getDate(); // Get the day from the date

      if (!months[monthNameAndYear]) {
        const daysInMonth = getDaysInMonth(monthNameAndYear); // Get the number of days for this month
        months[monthNameAndYear] = createEmptyAttendance(daysInMonth); // Initialize empty data for the month
      }

      // Mark attendance based on status
      months[monthNameAndYear][day - 1] = entry.status === 'present' ? 'present' : entry.status === 'absent' ? 'absent' : 'leave';
    });

    return Object.keys(months).map((month) => ({
      month,
      attendance: months[month],
    }));
  };

  // Get the attendance data grouped by month
  const attendanceDataByMonth = attendanceByMonth();

  const statusCellClass = (status) => {
    switch (status) {
      case 'present': return 'attendance-report__cell attendance-report__cell--p';
      case 'absent': return 'attendance-report__cell attendance-report__cell--a';
      case 'leave': return 'attendance-report__cell attendance-report__cell--l';
      default: return 'attendance-report__cell';
    }
  };

  const statusLabel = (status) => {
    switch (status) {
      case 'present': return 'P';
      case 'absent': return 'A';
      case 'leave': return 'L';
      default: return '-';
    }
  };

  return (
    <div className="attendance-report">
      <div className="attendance-report__legend">
        <span className="attendance-report__legend-item">
          <span className="attendance-report__cell attendance-report__cell--p">P</span> Present
        </span>
        <span className="attendance-report__legend-item">
          <span className="attendance-report__cell attendance-report__cell--a">A</span> Absent
        </span>
        <span className="attendance-report__legend-item">
          <span className="attendance-report__cell attendance-report__cell--l">L</span> Leave
        </span>
      </div>

      <div className="table-responsive attendance-report__wrap">
        <table id="category_summary" className="attendance-report__table">
          <thead>
            <tr>
              <th className="attendance-report__month-th">Month &amp; Year</th>
              {[...Array(31)].map((_, i) => (
                <th key={i} className="attendance-report__day-th">{i + 1}</th>
              ))}
              <th className="attendance-report__total-th attendance-report__total-th--p">T.P</th>
              <th className="attendance-report__total-th attendance-report__total-th--a">T.A</th>
              <th className="attendance-report__total-th attendance-report__total-th--l">T.L</th>
            </tr>
          </thead>
          <tbody>
            {attendanceDataByMonth.map((monthData, index) => {
              const presentCount = monthData.attendance.filter(status => status === 'present').length;
              const absentCount = monthData.attendance.filter(status => status === 'absent').length;
              const leaveCount = monthData.attendance.filter(status => status === 'leave').length;

              const daysInMonth = getDaysInMonth(monthData.month);

              return (
                <tr key={index}>
                  <td className="attendance-report__month-td">{monthData.month}</td>
                  {monthData.attendance.map((status, i) => (
                    <td key={i} className={statusCellClass(status)}>
                      {statusLabel(status)}
                    </td>
                  ))}
                  {Array.from({ length: 31 - daysInMonth }).map((_, i) => (
                    <td key={`empty-${i}`} className="attendance-report__cell attendance-report__cell--empty"></td>
                  ))}
                  <td className="attendance-report__total attendance-report__total--p">{presentCount}</td>
                  <td className="attendance-report__total attendance-report__total--a">{absentCount}</td>
                  <td className="attendance-report__total attendance-report__total--l">{leaveCount}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AttendanceReport;

