import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableRow, Link } from '@mui/material';

function preventDefault(event) {
  event.preventDefault();
}

const rows = [
  { id: 0, date: '16 Mar, 2024', name: 'Elvis Presley', shipTo: 'Tupelo, MS', paymentMethod: 'VISA ⠀•••• 3719', amount: 312.44 },
  { id: 1, date: '16 Mar, 2024', name: 'Paul McCartney', shipTo: 'London, UK', paymentMethod: 'VISA ⠀•••• 2574', amount: 866.99 },
  // Add more rows here
];

function Orders() {
  return (
    <React.Fragment>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>Date</TableCell>
            <TableCell>Name</TableCell>
            <TableCell>Ship To</TableCell>
            <TableCell>Payment Method</TableCell>
            <TableCell align="right">Sale Amount</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <TableRow key={row.id}>
              <TableCell>{row.date}</TableCell>
              <TableCell>{row.name}</TableCell>
              <TableCell>{row.shipTo}</TableCell>
              <TableCell>{row.paymentMethod}</TableCell>
              <TableCell align="right">{`$${row.amount}`}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Link color="primary" href="#" onClick={preventDefault} sx={{ mt: 3 }}>
        See more orders
      </Link>
    </React.Fragment>
  );
}

export default Orders;
