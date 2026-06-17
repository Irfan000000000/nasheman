import React, { useEffect, useState, useContext } from 'react'
import axios from 'axios'
import { Container, Grid, Typography } from '@mui/material';
import StatCard from './StatCard';
import BarChartComponent from './BarChartComponent'; // Import the BarChart component

import BarChartComponentExpense from './BarChartComponentExpense'; // Import the BarChart component

import PieChartComponent from './PieChartComponent'; // Import the PieChart component

import { useAuth } from './AuthContext';
import AcademicSessionContext from './AcademicSessionContext';
import Calendar from './Calendar';





function Dashboard() {

  const { user } = useAuth();
  const { academicSession } = useContext(AcademicSessionContext);

  const [getTotalVoucherAmount, setTotalVoucherAmount] = useState('');
  const [getTotalRecievedVoucherAmount, setTotalRecievedVoucherAmount] = useState('');
  const [getTotalStudents, setTotalStudents] = useState('');

  const [getTotalEmployee, setTotalEmployees] = useState('');

  const [struckOffVoucher, setStruckOffVoucher] = useState('');
  
  
  const initialState = {
    present: '',
    absent: '',
    leave:'',
    total_employees:'',
    total_present_employee:'',
    total_absent_employee:'',
    total_leave_employee:''
  }


const [editFormData, setEditFormData] = useState(initialState);


  useEffect(() => {
    const getDashboardData = (campus_id, session_id) => {
        axios.get(process.env.REACT_APP_API_BASE_URL+`/get-dashboard-data/${campus_id}/${session_id}`)
            .then(res => {

              var attendance_get = res.data.attendance;
              var attendance_employee_get = res.data.total_employee_attendance;


              setEditFormData({ ...editFormData,  total_present_employee: attendance_employee_get[0].present_count, total_absent_employee:attendance_employee_get[0].absent_count, total_leave_employee: attendance_employee_get[0].leave_count, present: attendance_get[0].present_count, absent:attendance_get[0].absent_count, leave: attendance_get[0].leave_count });

               
              setTotalRecievedVoucherAmount(res.data.total_received_amount + res.data.total_received_amount_last_month_of_session);
              // setUnpaidVoucherAmount(res.data.grand_total_payable);
              // setTotalVoucherAmount(res.data.total_payable_amount - res.data.unpaid_vouchers);
               setTotalVoucherAmount(res.data.total_payable_amount - res.data.struck_off_slc_unpaid);
              setTotalStudents(res.data.total_students);

              setTotalEmployees(res.data.total_employees);

              setStruckOffVoucher(res.data.struck_off_slc_unpaid);
             
               

                
            })
            .catch(err => console.log(err));
    };

    // Ensure user.campus_id is defined before calling fetchClasses
    if (user && user.user.campus_id && academicSession) {
      getDashboardData(user.user.campus_id, academicSession);
    }
}, [user, academicSession]); // Dependenci



  return (
    <Container
      maxWidth={false}
      disableGutters
      className="dashboard-page"
      sx={{
        mt: { xs: 1.5, sm: 2.5, md: 4 },
        mb: { xs: 2, sm: 3, md: 4 },
        px: { xs: 1.25, sm: 2, md: 3 },
        width: '100%',
      }}
    >
      <Grid container spacing={{ xs: 1.5, sm: 2, md: 3 }}>

      <Grid item xs={12} sm={6} md={3}>
          <StatCard icon="students" title="Student" value={getTotalStudents || 0} description="STUDENT TOTAL STRENGTH" backgroundColor="#EBD197" />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard icon="students" title="Present" value={editFormData.present} description="STUDENT ATTENDANCE" backgroundColor="#EBD197" />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard icon="students" title="Absent" value={editFormData.absent} description="STUDENT ATTENDANCE" backgroundColor="#EBD197" />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard icon="students" title="Leave" value={editFormData.leave} description="STUDENT ATTENDANCE" backgroundColor="#EBD197" />
        </Grid>

      <Grid item xs={12} sm={6} md={3}>
          <StatCard icon="employee" title="Employee" value={getTotalEmployee} description="EMPLOYEE TOTAL STRENGTH" backgroundColor="#EBD197" />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard icon="employee" title="Present" value={editFormData.total_present_employee} description="EMPLOYEE ATTENDANCE" backgroundColor="#EBD197" />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard icon="employee" title="Absent" value={editFormData.total_absent_employee} description="EMPLOYEE ATTENDANCE" backgroundColor="#EBD197" />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard icon="employee" title="Leave" value={editFormData.total_leave_employee} description="EMPLOYEE ATTENDANCE" backgroundColor="#EBD197" />
        </Grid>
        


       
        
       
      


        <Grid item xs={12} md={8}>
          <BarChartComponent />
        </Grid>
        <Grid item xs={12} md={4}>
          <PieChartComponent />
        </Grid>


         <Grid item xs={12} sm={6} md={4}>
          <StatCard icon="voucher" title="Voucher" value={getTotalVoucherAmount || 0} description="VOUCHER AMOUNT GENERATED" backgroundColor="#EBD197" />
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <StatCard icon="voucher" title="Paid" value={getTotalRecievedVoucherAmount || 0} description="TOTAL PAID VOUCHER AMOUNT" backgroundColor="#EBD197" />
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <StatCard icon="voucher" title="Pending" value={(getTotalVoucherAmount - getTotalRecievedVoucherAmount) || 0} description="TOTAL PENDING AMOUNT" backgroundColor="#EBD197" />
        </Grid>

      



        <Grid item xs={12} sm={6} md={4}>
          <StatCard  title="Expense (PKR)" value="0" description="TOTAL EXPENSE" backgroundColor="#EBD197" />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <StatCard  title="Income (PKR)" value={getTotalRecievedVoucherAmount || 0} description="TOTAL INCOME" backgroundColor="#EBD197" />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <StatCard  title="Profit/Loss (PKR)" value="0" description="TOTAL PROFIT/LOSS" backgroundColor="#EBD197" />
        </Grid>

        
       


        {/* <Grid item xs={12} md={12}>
          <BarChartComponentExpense />
        </Grid> */}
        {/* <Grid item xs={12} md={4}>
          <PieChartComponent />
        </Grid> */}
        
      </Grid>
      <Calendar/>
    </Container>
  );
}

export default Dashboard;



