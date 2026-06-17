import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, CartesianGrid, ResponsiveContainer } from 'recharts';
import { Card, CardContent, Typography, useMediaQuery, useTheme } from '@mui/material';

import AcademicSessionContext from './AcademicSessionContext';
import { useAuth } from './AuthContext';


function BarChartComponent() {

const [getData, setData] = useState([]);
const { user } = useAuth();
const { academicSession } = useContext(AcademicSessionContext);
const theme = useTheme();
const isXs = useMediaQuery(theme.breakpoints.down('sm'));
const isSm = useMediaQuery(theme.breakpoints.between('sm', 'md'));
const chartHeight = isXs ? 240 : isSm ? 300 : 400;
const tickFontSize = isXs ? 10 : 12;
const formatTick = (value) => {
  if (!value) return value;
  // Show DD-MM on small screens, full YYYY-MM-DD on desktop
  if (isXs) {
    const parts = String(value).split('-');
    return parts.length === 3 ? `${parts[2]}/${parts[1]}` : value;
  }
  return value;
};



useEffect(() => {
  const fetchStudentStrength = (campus_id, session_id) => {
      axios.get(process.env.REACT_APP_API_BASE_URL+`/get-student-attendance-wise-data/${campus_id}/${session_id}`)
          .then(res => {
            setData(res.data.results);
              console.log(res.data.results);
          })
          .catch(err => console.log(err));
  };

  if (user &&  academicSession) {
    fetchStudentStrength(user.user.campus_id, academicSession);
  }
}, []);



// Function to transform data
const transformData = (fetchData) => {
  const result = [];

  fetchData.forEach((item) => {
      const date = item.date;  // Use 'YYYY-MM-DD' format directly as the date
      let record = result.find((r) => r.name === date);

      if (!record) {
          // If no record exists for this date, create one
          record = { name: date, present: 0, absent: 0, holiday: 0, leave: 0 };
          result.push(record);
      }

      // Aggregate count by status
      if (item.status === "present") {
          record.present += item.count;
      } else if (item.status === "absent") {
          record.absent += item.count;
      } else if (item.status === "holiday") {
          record.holiday += item.count;
      } else if (item.status === "leave") {
          record.leave += item.count;
      }
  });

  // Add `amt` field as the total sum of present, absent, holiday, and leave counts
  result.forEach((r) => {
      r.amt = r.present + r.absent + r.holiday + r.leave;
  });

  const sortedData = result.sort((a, b) => (a.name > b.name ? 1 : -1));  // Sorting by date (ascending)

  // Return only the last 5 dates
  return sortedData.slice(-5);  // Slice to get the last 5 entries
};

const transformedData = transformData(getData);

console.log(transformedData);




  return (
    <Card sx={{ height: '100%', borderRadius: 2, boxShadow: '0 2px 6px rgba(0,0,0,0.08)' }}>
      <CardContent sx={{ p: { xs: 1.25, sm: 2 } }}>
        <Typography
          variant="h6"
          component="div"
          color="textSecondary"
          sx={{ fontSize: { xs: '0.95rem', sm: '1.1rem' }, mb: 1 }}
        >
          Daily Attendance
        </Typography>
        <ResponsiveContainer width="100%" height={chartHeight}>
          <BarChart
            data={transformedData}
            margin={{ top: 5, right: isXs ? 6 : 16, left: isXs ? -16 : 0, bottom: isXs ? 4 : 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#eef0f3" vertical={false} />
            <XAxis
              dataKey="name"
              tick={{ fontSize: tickFontSize }}
              tickFormatter={formatTick}
              interval={0}
              angle={isXs ? -30 : 0}
              textAnchor={isXs ? 'end' : 'middle'}
              height={isXs ? 50 : 30}
            />
            <YAxis tick={{ fontSize: tickFontSize }} width={isXs ? 28 : 40} />
            <Tooltip contentStyle={{ fontSize: '0.8rem' }} />
            <Legend wrapperStyle={{ fontSize: tickFontSize }} />
            <Bar dataKey="present" fill="#E6A2A2" />
            <Bar dataKey="absent" fill="#A4D4B2" />
            <Bar dataKey="leave" fill="#E91E63" />
            {/* <Bar dataKey="holiday" fill="#00BCD4" /> */}
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

export default BarChartComponent;
