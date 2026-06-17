import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Card, CardContent, Typography, useMediaQuery, useTheme } from '@mui/material';
import AcademicSessionContext from './AcademicSessionContext';
import { useAuth } from './AuthContext';

// const data = [
//   { name: 'Class A', value: 40 },
//   { name: 'Class B', value: 50 },
//   { name: 'Class C', value: 30 },
//   { name: 'Class D', value: 30 },
// ];





const COLORS = [
  '#F44336', '#2196F3', '#4CAF50', '#FFC107', '#9C27B0', '#FF5722', 
  '#00BCD4', '#8BC34A', '#FF9800', '#E91E63', '#3F51B5', '#009688', 
  '#CDDC39', '#FFEB3B', '#673AB7', '#FF4081', '#607D8B', '#795548', 
  '#512DA8', '#2196F3', '#009688', '#D32F2F', '#1976D2', '#388E3C', 
  '#F57C00', '#7B1FA2', '#0288D1', '#8E24AA', '#0288D1', '#F44336', 
  '#00E676', '#673AB7', '#9E9D24', '#FF1744', '#B2FF59', '#FF9100', 
  '#3D5AFE', '#9C27B0', '#8BC34A', '#FF4081', '#6200EA', '#FF6D00'
];





function PieChartComponent() {


const [getData, setData] = useState([]);
const { user } = useAuth();
const { academicSession } = useContext(AcademicSessionContext);
const theme = useTheme();
const isXs = useMediaQuery(theme.breakpoints.down('sm'));
const isSm = useMediaQuery(theme.breakpoints.between('sm', 'md'));
const chartHeight = isXs ? 260 : isSm ? 320 : 400;
const outerRadiusPct = isXs ? '70%' : '80%';

useEffect(() => {
        const fetchStudentStrength = (campus_id, session_id) => {
            axios.get(process.env.REACT_APP_API_BASE_URL+`/get-total-students-class-wise/${campus_id}/${session_id}`)
                .then(res => {
                  setData(res.data.results);
                    console.log(res.data.results);
                })
                .catch(err => console.log(err));
        };
    
        if (user &&  academicSession) {
          fetchStudentStrength(user.user.campus_id, academicSession);
        }
    }, [academicSession]);



    const data = getData.map(item => ({
      name: item.parent_class,
      value: item.student_count
  }));

  return (
    <Card sx={{ height: '100%', borderRadius: 2, boxShadow: '0 2px 6px rgba(0,0,0,0.08)' }}>
      <CardContent sx={{ p: { xs: 1.25, sm: 2 } }}>
        <Typography
          variant="h6"
          component="div"
          color="textSecondary"
          sx={{ textAlign: 'center', fontSize: { xs: '0.95rem', sm: '1.1rem' }, mb: 1 }}
        >
          Class Wise Strength
        </Typography>
        <ResponsiveContainer width="100%" height={chartHeight}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius={outerRadiusPct}
              fill="#8884d8"
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip contentStyle={{ fontSize: '0.8rem' }} />
            <Legend wrapperStyle={{ fontSize: isXs ? 10 : 12 }} />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

export default PieChartComponent;
