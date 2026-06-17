import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { Card, CardContent, Typography } from '@mui/material';

function BarChartComponentExpense() {
  // Dummy data for the chart
  const dummyData = [
    { name: 'January', expense: 4000, income: 2400 },
    { name: 'February', expense: 3000, income: 1398 },
    { name: 'March', expense: 2000, income: 9800 },
    { name: 'April', expense: 2780, income: 3908 },
    { name: 'May', expense: 1890, income: 4800 },
    { name: 'June', expense: 2390, income: 3800 },
    { name: 'July', expense: 3490, income: 4300 },
    { name: 'August', expense: 3490, income: 2000 },
    { name: 'September', expense: 3490, income: 6000 },
    { name: 'October', expense: 3490, income: 4000 },
    { name: 'November', expense: 3490, income: 4300 },
    { name: 'December', expense: 3490, income: 1000 },
  ];

  return (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <Typography variant="h6" component="div" color="textSecondary">
          Monthly Expense & Income
        </Typography>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={dummyData}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="expense" fill="#ffc107" />
            <Bar dataKey="income" fill="#1b1a1e" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

export default BarChartComponentExpense;
