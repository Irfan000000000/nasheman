
// // const express = require("express"); //express package initiated
// // const app = express(); // express instance has been created and will be access by app variable
// // const cors = require("cors");
// // const dotenv = require("dotenv");

// // const PDFDocument = require('pdfkit');
// // const fs = require('fs');
// // const printer = require('pdf-to-printer');


// // const bodyParser = require('body-parser');

// // app.use(bodyParser.json());
// // app.use(bodyParser.urlencoded({ extended: true }));


// // const connection = require("./config/db");
// // // dotenv.config();

// // app.use(cors());
// // // app.use(express.urlencoded({ extended: false }));
// // // app.use(express.json());

// // app.get("/", (req, res) => {
// //   res.send("API running");
// // });








// // app.post('/insert_all_items', (req, res) => {
// //   console.log('Request body:', req.body); // Log request body

// //   const sql = 'INSERT INTO items (items, category, price, discount, total_pieces, total_price ,  expire, alert) VALUES (?, ?, ?, ?, ?, ?, ?, ?)';
// //   const values = [req.body.item_name, req.body.category, req.body.price, req.body.discount, req.body.total_pieces, req.body.total_price, req.body.expire, req.body.alert];
// //   console.log('SQL query:', sql);
// //   console.log('Values:', values);

// //   connection.query(sql, values, (err, result) => {
// //     // return res.send(result);
// //     if (err) {
// //       console.error('Error inserting data:', err);
// //       return res.status(500).json({ error: 'Error inserting data' }); // Send JSON error response
// //     }
// //     console.log('Data inserted successfully');
// //     res.status(200).json({ message: 'Data inserted successfully' }); // Send JSON success response
// //   });
// // });



// // app.get('/items', (req, res) => {
// //   // Extract page and limit from query parameters, default to page 1 and limit 5 if not provided
// //   const page = parseInt(req.query.page) || 1;
// //   const limit = parseInt(req.query.limit) || 5;
// //   const offset = (page - 1) * limit;

// //   // SQL query to select paginated results
// //   const sql = `SELECT items.*, categories.category AS category_name FROM items INNER JOIN categories ON items.category = categories.id LIMIT ${limit} OFFSET ${offset}`;
// //   // Execute the query
// //   connection.query(sql, (error, results) => {
// //     if (error) {
// //       console.error('Error executing SQL query: ', error);
// //       return res.status(500).json({ error: 'Internal server error' });
// //     }

// //     // Query to get total count of items
// //     const countSql = 'SELECT COUNT(*) as total FROM items';

// //     // Execute the count query
// //     connection.query(countSql, (countError, countResult) => {
// //       if (countError) {
// //         console.error('Error executing count SQL query: ', countError);
// //         return res.status(500).json({ error: 'Internal server error' });
// //       }

// //       const totalItems = countResult[0].total;

// //       // Calculate total pages based on total count and limit
// //       const totalPages = Math.ceil(totalItems / limit);

// //       // Send paginated results and pagination metadata as JSON
// //       res.json({
// //         totalItems,
// //         currentPage: page,
// //         totalPages,
// //         results
// //       });
// //     });
// //   });
// // });



// // app.get('/item-get/:item_id', (req, res) => {

// //   const item_id = req.params.item_id;

// //   const sql = `SELECT * FROM items where id = ${item_id}`;
// //   // Execute the query
// //   connection.query(sql, (error, results) => {
// //     if (error) {
// //       console.error('Error executing SQL query: ', error);
// //       return res.status(500).json({ error: 'Internal server error' });
// //     }

// //     res.json({
// //       results
// //     });
// //   });
// // });






// // // PUT route to update an item by ID

// // // PUT route to update an item by ID
// // app.put('/update-item/:id', (req, res) => {
// //   const itemId = parseInt(req.params.id); // Corrected to req.params.id
// //   const { category, item_name, price, discount, total_pieces, expire, total_price, alert } = req.body; // Updated item data from the request body

// //   // Build the UPDATE query with all the columns to be updated
// //   const sql = 'UPDATE items SET category = ?, items = ?, price = ?,  discount = ?, total_pieces = ?, expire = ?, total_price = ?, alert = ? WHERE id = ?';
// //   const values = [category, item_name, price, discount, total_pieces, expire, total_price, alert, itemId];

// //   connection.query(sql, values, (error, results) => {
// //     if (error) {
// //       console.error('Error updating item:', error);
// //       res.status(500).json({ error: 'Error updating item' });
// //     } else {
// //       console.log('Item updated successfully');
// //       res.status(200).json({ message: 'Item updated successfully' });
// //     }
// //   });
// // });




// // app.delete('/delete-item/:item_id', (req, res) => {
// //   const itemId = parseInt(req.params.item_id);

// //   const sql = 'DELETE FROM items WHERE id = ?';
// //   const values = [itemId];

// //   connection.query(sql, values, (error, results) => {
// //     if (error) {
// //       console.error('Error updating item:', error);
// //       res.status(500).json({ error: 'Error updating item' });
// //     } else {
// //       console.log('Item updated successfully');
// //       res.status(200).json({ message: 'Item deleted successfully' });
// //     }
// //   });
// // });



// // app.get('/categories', (req, res) => {

// //   const sql = 'SELECT * FROM categories';

// //   connection.query(sql, (error, results) => {
// //     if (error) {
// //       console.error('Error:', error);
// //       res.status(500).json({ error: 'Error updating item' });
// //     } else {
// //       console.log('Fetch Successfully');
// //       res.status(200).json({ results });
// //     }
// //   });
// // });





// // // Example route using the connection
// // app.get('/get-item-details/:item_id', (req, res) => {
// //   const itemId = parseInt(req.params.item_id);

// //   connection.getConnection((err, connection) => {
// //     if (err) {
// //       console.error('Error:', err);
// //       res.status(500).json({ error: 'Error' });
// //       return;
// //     }

// //     const sql = `
// //       SELECT 
// //           items.id,
// //           items.items,
// //           items.price,
// //           items.discount,
// //           COALESCE(stock_total.total_stock_quantity, 0) AS total_stock_quantity,
// //           COALESCE(invoice_total.total_invoice_quantity, 0) AS total_invoice_quantity
// //       FROM 
// //           items
// //       LEFT JOIN 
// //           (SELECT item_id, SUM(quantity) AS total_stock_quantity FROM stock GROUP BY item_id) AS stock_total 
// //           ON items.id = stock_total.item_id
// //       LEFT JOIN 
// //           (SELECT item, SUM(quantity) AS total_invoice_quantity FROM invoice GROUP BY item) AS invoice_total 
// //           ON items.id = invoice_total.item
// //       WHERE 
// //           items.id = ?;
// //     `;
// //     const values = [itemId];

// //     connection.query(sql, values, (error, results) => {
// //       connection.release(); // Release the connection

// //       if (error) {
// //         console.error('Error:', error);
// //         res.status(500).json({ error: 'Error' });
// //       } else {
// //         console.log('Fetch Successfully');
// //         res.status(200).json({ results });
// //       }
// //     });
// //   });
// // });



// // //   app.post('/insert-invoice', (req, res) => {
// // //     console.log('Request body:', req.body); // Log request body]

// // //     const items = req.body; // Assuming the array of items is sent in the request body

// // //     const check_invoice_no = "SELECT invoice_no FROM invoice ORDER BY invoice_no DESC LIMIT 1";

// // //     const values = items.map(item => [1000,item.item, item.rate, item.quantity, item.discount, item.total]); // Extracting values from each item

// // //     const sql = 'INSERT INTO invoice (invoice_no, item, rate, quantity, discount, total) VALUES ?'; // Use ? placeholder for multiple value insertion
// // //     console.log('SQL query:', sql);
// // //     console.log('Values:', values);

// // //     connection.query(sql, [values], (err, result) => {
// // //         if (err) {
// // //             console.error('Error inserting data:', err);
// // //             return res.status(500).json({ error: 'Error inserting data' }); // Send JSON error response
// // //         }

// // //         res.status(200).json({ message: 'Data inserted successfully' }); // Send JSON success response
// // //     });
// // // });



// // app.post('/insert-invoice', (req, res) => {

// //   const items = req.body; // Assuming the array of items is sent in the request body



// //   // Query to retrieve the last invoice number
// //   const check_invoice_no = "SELECT invoice_no FROM invoice ORDER BY invoice_no DESC LIMIT 1";

// //   connection.query(check_invoice_no, (error, results) => {
// //     if (error) {
// //       console.error('Error retrieving last invoice number:', error);
// //       return res.status(500).json({ error: 'Error retrieving last invoice number' });
// //     }

// //     let nextInvoiceNo;

// //     if (results == "") {
// //       nextInvoiceNo = 1000;
// //     } else {

// //       const lastInvoiceNo = results[0].invoice_no;
// //       nextInvoiceNo = lastInvoiceNo + 1;

// //     }

// //     // Prepare values for insertion
// //     const values = items.map(item => [nextInvoiceNo, item.item, item.price, item.quantity, item.discount, item.total]);

// //     // SQL query to insert invoice data
// //     const sql = 'INSERT INTO invoice (invoice_no, item, price, quantity, discount, total) VALUES ?';
// //     console.log('SQL query:', sql);
// //     console.log('Values:', values);

// //     // Execute the insert query
// //     connection.query(sql, [values], (err, result) => {
// //       if (err) {
// //         console.error('Error inserting data:', err);
// //         return res.status(500).json({ error: 'Error inserting data' });
// //       }




// //       function getCurrentTimestamp() {
// //         const now = new Date();
// //         const year = now.getFullYear();
// //         const month = String(now.getMonth() + 1).padStart(2, '0');
// //         const day = String(now.getDate()).padStart(2, '0');
// //         const hours = String(now.getHours()).padStart(2, '0');
// //         const minutes = String(now.getMinutes()).padStart(2, '0');
// //         const seconds = String(now.getSeconds()).padStart(2, '0');
// //         const milliseconds = String(now.getMilliseconds()).padStart(3, '0');

// //         return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}.${milliseconds}`;
// //       }

// //       let currentTimestamp = getCurrentTimestamp();





// //       const rawData = items.map(item => ({
// //         "invoice_no": nextInvoiceNo,
// //         "timestamp": currentTimestamp,
// //         "item": item.item_name,
// //         "price": item.price,
// //         "quantity": item.quantity,
// //         "discount": item.discount,
// //         "total": item.total
// //       }));




// //       function convertDataFormat(rawData) {
// //         // Transform the raw data into the desired items format
// //         const convertedItems = rawData.map(entry => ({
// //           itemNumber: entry.item,
// //           description: `${entry.item}`,
// //           price: parseFloat(entry.price),
// //           quantity: parseInt(entry.quantity),
// //           discount: parseFloat(entry.discount),
// //           total: parseFloat(entry.total),
// //           timestamp: entry.timestamp // Add timestamp property
// //         }));

// //         // Calculate the invoice total
// //         const invoiceTotal = convertedItems.reduce((acc, item) => acc + item.total, 0);

// //         // Build the data to print object
// //         const dataToPrint = {
// //           title: `Invoice #${rawData[0].invoice_no}`,
// //           date: `${rawData[0].timestamp}`, // Corrected access to timestamp
// //           items: convertedItems,
// //           total: invoiceTotal.toFixed(2) // Convert to 2 decimal places
// //         };

// //         return dataToPrint;
// //       }

// //       const dataToPrint = convertDataFormat(rawData);



// //       function generatePDF(data) {
// //         const doc = new PDFDocument();
// //         const stream = fs.createWriteStream('printable_document.pdf');
// //         doc.pipe(stream);

// //         // Styling constants
// //         const pageMargin = 50;
// //         const lineHeight = 25;
// //         const itemIndent = 200;

// //         // Draw a header
// //         doc.fontSize(15).fillColor('#333').text(data.title, { align: 'center' });
// //         doc.moveDown(0);

// //         // Draw a header
// //         doc.fontSize(15).fillColor('#333').text(data.date, { align: 'center' });
// //         doc.moveDown(0);


// //         // Table headers
// //         const tableHeaderVerticalPosition = 120; // Adjust this value to reduce space between header and table headers
// //         doc.fontSize(12).fillColor('#333').font('Helvetica-Bold').text('Item', pageMargin, tableHeaderVerticalPosition);
// //         doc.text('Price', pageMargin + itemIndent, tableHeaderVerticalPosition, { width: 100, align: 'center' });
// //         doc.text('Qty', pageMargin + itemIndent + 100, tableHeaderVerticalPosition, { width: 50, align: 'center' });
// //         doc.text('Disc(%)', pageMargin + itemIndent + 150, tableHeaderVerticalPosition, { width: 70, align: 'center' });
// //         doc.text('Total', pageMargin + itemIndent + 220, tableHeaderVerticalPosition, { width: 100, align: 'center' });
// //         doc.strokeColor('#dddddd').lineWidth(1).moveTo(pageMargin, tableHeaderVerticalPosition + 20).lineTo(pageMargin + itemIndent + 320, tableHeaderVerticalPosition + 20).stroke();

// //         let verticalPosition = tableHeaderVerticalPosition + 40;

// //         // Line items
// //         data.items.forEach(item => {
// //           doc.fontSize(12).fillColor('#333').text(item.description, pageMargin, verticalPosition);
// //           doc.text(`${item.price.toFixed(2)}`, pageMargin + itemIndent, verticalPosition, { width: 100, align: 'center' });
// //           doc.text(`${item.quantity}`, pageMargin + itemIndent + 100, verticalPosition, { width: 50, align: 'center' });
// //           doc.text(`${item.discount}%`, pageMargin + itemIndent + 150, verticalPosition, { width: 70, align: 'center' });
// //           doc.text(`${item.total.toFixed(2)}`, pageMargin + itemIndent + 220, verticalPosition, { width: 100, align: 'center' });
// //           verticalPosition += lineHeight;
// //         });

// //         // Draw a line above the grand total
// //         doc.strokeColor('#dddddd').moveTo(pageMargin, verticalPosition).lineTo(pageMargin + itemIndent + 320, verticalPosition).stroke();

// //         // Grand Total
// //         const grandTotal = data.items.reduce((acc, item) => acc + item.total, 0);
// //         doc.fontSize(10).fillColor('#333').font('Helvetica-Bold').text(`G. Total : Rs. ${grandTotal.toFixed(2)}`, pageMargin + itemIndent + 185, verticalPosition + 20, { width: 120, align: 'center' });

// //         // Finalize the PDF and end the stream
// //         doc.end();
// //         stream.on('finish', function () {
// //           // Print PDF using pdf-to-printer
// //           const pdfPath = 'printable_document.pdf';
// //           const printerName = 'Microsoft Print to PDF'; // Replace with the actual printer name

// //           printer.print(pdfPath, { printer: printerName })
// //             .then(() => res.send("Printed"))
// //             .catch((error) => console.error('Error printing PDF:', error));

// //         });
// //       }
// //       generatePDF(dataToPrint);


// //     });
// //   });
// // });





// // app.post('/insert-stock', (req, res) => {

// //   const items = req.body; // Assuming the array of items is sent in the request body



// //   // Query to retrieve the last invoice number
// //   const check_invoice_no = "SELECT invoice_no FROM stock ORDER BY invoice_no DESC LIMIT 1";

// //   connection.query(check_invoice_no, (error, results) => {
// //     if (error) {
// //       console.error('Error retrieving last invoice number:', error);
// //       return res.status(500).json({ error: 'Error retrieving last invoice number' });
// //     }

// //     let nextInvoiceNo;

// //     if (results == "") {
// //       nextInvoiceNo = 1000;
// //     } else {

// //       const lastInvoiceNo = results[0].invoice_no;
// //       nextInvoiceNo = lastInvoiceNo + 1;

// //     }




// //     // Prepare values for insertion
// //     const values = items.map(item => [nextInvoiceNo, item.item, item.price, item.quantity, item.discount, item.total, item.priceOption, item.discountOption, item.remarks]);

// //     // SQL query to insert invoice data
// //     const sql = 'INSERT INTO stock (invoice_no, item_id, price, quantity, discount, total, price_option, discount_option, remarks) VALUES ?';
// //     // console.log('SQL query:', sql);
// //     // console.log('Values:', values);

// //     // Execute the insert query
// //     connection.query(sql, [values], (err, result) => {
// //       if (err) {
// //         console.error('Error inserting data:', err);
// //         return res.status(500).json({ error: 'Error inserting data' });
// //       }



// //       // Create a new array to store the desired objects
// //       const newData = [];

// //       // Iterate through data and add objects to the new array based on conditions
// //       items.forEach(item => {
// //         const newItem = {
// //           item: item.item,
// //         };
// //         if (item.priceOption === "update") {
// //           newItem.priceOption = "update";
// //           newItem.price = item.price;
// //         }
// //         if (item.discountOption === "update") {
// //           newItem.discountOption = "update";
// //           newItem.discount = item.discount;
// //         }
// //         if (newItem.priceOption || newItem.discountOption) {
// //           newData.push(newItem);
// //         }
// //       });


// //       // Construct and execute update query for each object
// //       newData.forEach(data => {
// //         let sql = 'UPDATE items SET ';
// //         const values = [];

// //         // Check if priceOption is present and add price to the query
// //         if (data.priceOption === 'update') {
// //           sql += 'price = ?, ';
// //           values.push(data.price);
// //         }

// //         // Check if discountOption is present and add discount to the query
// //         if (data.discountOption === 'update') {
// //           sql += 'discount = ?, ';
// //           values.push(data.discount);
// //         }

// //         // Remove the trailing comma and space
// //         sql = sql.slice(0, -2);

// //         // Add the WHERE clause
// //         sql += ' WHERE id = ?';

// //         // Push the item_id to values array
// //         values.push(data.item);

// //         // Execute the query
// //         connection.query(sql, values, (err, result) => {
// //           if (err) {
// //             console.error('Error updating data:', err);
// //             return;
// //           }
// //           console.log(`Data updated successfully for item ${data.item}.`);
// //         });
// //       });



// //       return res.status(200).json({ "items": newData });

// //     });
// //   });
// // });





// // app.get('/get-invoice-list', (req, res) => {
// //   // Extract page and limit from query parameters, default to page 1 and limit 5 if not provided
// //   const page = parseInt(req.query.page) || 1;
// //   const limit = parseInt(req.query.limit) || 5;
// //   const offset = (page - 1) * limit;

// //   // SQL query to select paginated results
// //   const sql = `SELECT invoice, SUM(total) AS total_amount, SUM(quantity) AS total_quantity FROM invoice GROUP BY invoice_no LIMIT ${limit} OFFSET ${offset}`;
// //   // Execute the query
// //   connection.query(sql, (error, results) => {
// //     if (error) {
// //       console.error('Error executing SQL query: ', error);
// //       return res.status(500).json({ error: 'Internal server error' });
// //     }

// //     // Query to get total count of items
// //     const countSql = 'SELECT COUNT(*) as total_count  FROM invoice GROUP BY invoice_no';

// //     // Execute the count query
// //     connection.query(countSql, (countError, countResult) => {
// //       if (countError) {
// //         console.error('Error executing count SQL query: ', countError);
// //         return res.status(500).json({ error: 'Internal server error' });
// //       }

// //       const totalItems = countResult[0].total;

// //       // Calculate total pages based on total count and limit
// //       const totalPages = Math.ceil(totalItems / limit);

// //       // Send paginated results and pagination metadata as JSON
// //       res.json({
// //         totalItems,
// //         currentPage: page,
// //         totalPages,
// //         results
// //       });
// //     });
// //   });
// // });





// // // Close all database connections when the Node.js process exits
// // process.on('exit', () => {
// //   console.log('Closing all database connections...');
// //   connection.end((err) => {
// //       if (err) {
// //           console.error('Error closing database connections:', err);
// //       } else {
// //           console.log('All database connections closed successfully.');
// //       }
// //   });
// // });

// // // Log an error if an uncaught exception occurs
// // process.on('uncaughtException', (err) => {
// //   console.error('Uncaught exception:', err);
// //   // Close all database connections before exiting due to uncaught exception
// //   connection.end(() => {
// //       process.exit(1);
// //   });
// // });

// // // Start the server
// // app.listen(process.env.PORT, function (err) {
// //   if (err) console.log(err);
// //   console.log(`listening to port ${process.env.PORT}`);
// // });



// // // app.listen(process.env.PORT, function (err) {
// // //   if (err) console.log(err);
// // //   console.log(`listening to port ${process.env.PORT}`);
// // // });








// function generateMonths(fromMonth, toMonth) {
//   const months = [];
//   const start = new Date(fromMonth + "-01");
//   const end = new Date(toMonth + "-01");

//   let current = start;
//   while (current <= end) {
//     const month = current.getMonth() + 1; // getMonth() is zero-based
//     const year = current.getFullYear();
//     months.push(`${year}-${month.toString().padStart(2, '0')}`);
//     current.setMonth(current.getMonth() + 1);
//   }

//   return months;
// }

// function mergeDataAndCalculateTotals(results, data1) {
//   return results.map(result => {
//     const categoryId = result.category_id.toString();
//     const data = data1[categoryId] || [];
//     const totalAmount = data.reduce((sum, item) => sum + (item.amount || 0), 0);
//     return { ...result, data, total_amount_data: totalAmount };
//   });
// }

// function queryAsync(sql, params = []) {
//   return new Promise((resolve, reject) => {
//     connection.query(sql, params, (err, results) => {
//       if (err) return reject(err);
//       resolve(results);
//     });
//   });
// }

// async function fetchAdvanceData(from_month, campus_id, session_id) {
//   const getLastStatusAndArrearsQuery = `
//     SELECT fv.id AS voucher_id, fv.student_id, fv.advance_payments, fv.advance_status, fv.payment_received_through_bank, fv.scroll_no
//     FROM fee_vouchers fv
//     JOIN (
//       SELECT student_id, MAX(for_the_month) AS last_month
//       FROM fee_vouchers
//       WHERE for_the_month < ? AND advance_status = 'Advance'  AND (status = 'paid' OR status = 'partially_paid')
//       GROUP BY student_id
//     ) last_entries
//     ON fv.student_id = last_entries.student_id 
//     AND fv.for_the_month = last_entries.last_month
//     JOIN students s ON fv.student_id = s.id
//     WHERE s.campus_id = ? AND s.session_id = ? AND s.status IN ('New Admission', 'Promoted') AND s.status_on_off = 'On'`;

//   const advanceResults = await queryAsync(getLastStatusAndArrearsQuery, [from_month, campus_id, session_id]);

//   const advanceMap = {};
//   advanceResults.forEach(row => {
//     advanceMap[row.student_id] = {
//       last_status: row.advance_status,
//       advance_payments: row.advance_payments,
//       voucher_id: row.voucher_id,
//       payment_received_through_bank: row.payment_received_through_bank,
//       scroll_no: row.scroll_no
//     };
//   });

//   console.log(advanceMap);

//   return advanceMap;
// }

// async function fetchArrearsData(mergedResults, from_month, campus_id, session_id) {
//   const getLastStatusAndArrearsQuery = `
//     SELECT fv.id AS voucher_id, fv.student_id, fv.status AS last_status, 
//           fv.after_due_date_amount AS after_due_amount, fv.arrears AS total_arrears, fv.arrears_not_cleared, fv.first_advance_payment
//           FROM fee_vouchers fv
//           JOIN (
//             SELECT student_id, MAX(for_the_month) AS last_month
//             FROM fee_vouchers
//             WHERE for_the_month < ?  AND (status = 'unpaid' OR status = 'partially_paid')
//             GROUP BY student_id
//           ) last_entries
//           ON fv.student_id = last_entries.student_id 
//           AND fv.for_the_month = last_entries.last_month
//           JOIN students s ON fv.student_id = s.id 
//           WHERE s.campus_id = ? AND s.session_id = ? AND s.status IN ('New Admission', 'Promoted') AND s.status_on_off = 'On'`;

//   const arrearsResults = await queryAsync(getLastStatusAndArrearsQuery, [from_month, campus_id, session_id]);

//   const arrearsMap = {};
//   arrearsResults.forEach(row => {
//     const previousTotalArrears = row.total_arrears;
//     const currentTotalArrears = row.after_due_amount + previousTotalArrears + parseInt(row.first_advance_payment);
//     const arrearGap = currentTotalArrears - previousTotalArrears;
    
//     arrearsMap[row.student_id] = {
//       last_status: row.last_status,
//       total_arrears: currentTotalArrears,
//       arrears_not_cleared: JSON.parse(row.arrears_not_cleared || '[]'),
//       voucher_id: row.voucher_id,
//       arrear_gap: arrearGap
//     };
//   });

//   console.log(arrearsMap);
//   return arrearsMap;
// }

// async function fetchBusFeeDetails(campus_id, session_id) {
//   const getBusFeeQuery = `
//     SELECT id AS student_id, bus_fee
//     FROM students
//     WHERE campus_id = ? AND session_id = ? AND bus_status = 'On' AND status IN ('New Admission', 'Promoted') AND status_on_off = 'On'
//   `;

//   try {
//     const busFeeResults = await queryAsync(getBusFeeQuery, [campus_id, session_id]);
//     const busFeeMap = {};
//     busFeeResults.forEach(row => {
//       busFeeMap[row.student_id] = row.bus_fee;
//     });

//     return busFeeMap;
//   } catch (err) {
//     console.error('Error fetching bus fee details:', err);
//     throw err;
//   }
// }

// app.post('/fee-voucher', async (req, res) => {
//   let arrear_checked = false; // assuming this is true based on your requirements
//   const { class_id, shift, from_month, to_month, due_date, remarks, session_id, campus_id, user_id, arrear_set, bus_fee_status } = req.body.editFormData;
//   const data1 = req.body.groupedData;

//   // this is alternate set because I dont want to customize code. it already set to false
//   if (arrear_set == true) {
//     arrear_checked = false;
//   } else {
//     arrear_checked = true;
//   }

//   const months = generateMonths(from_month, to_month);

//   let sql;
//   let sqlParams;

//   if (shift === "") {
//     sql = `
//           SELECT s.id, s.category_id, s.campus_id, s.session_id
//           FROM students s
//           JOIN school_categories c ON s.category_id = c.id
//           WHERE s.class_id = ? 
//             AND s.campus_id = ? 
//             AND s.session_id = ?
//             AND s.status IN ('New Admission', 'Promoted')
//             AND s.status_on_off = 'On'
//             AND s.status_for_pendings = 'On'
//           ORDER BY s.category_id`;
//     sqlParams = [class_id, campus_id, session_id];

//   } else {

//     sql = `
//           SELECT s.id, s.category_id, s.campus_id, s.session_id
//           FROM students s
//           JOIN school_categories c ON s.category_id = c.id
//           WHERE s.class_id = ? 
//             AND s.shift = ? 
//             AND s.campus_id = ? 
//             AND s.session_id = ?
//             AND s.status IN ('New Admission', 'Promoted')
//             AND s.status_on_off = 'On'
//             AND s.status_for_pendings = 'On'
//           ORDER BY s.category_id`;

//     sqlParams = [class_id, shift, campus_id, session_id];
//   }

//   const getLastInvoiceNoQuery = 'SELECT invoice_no FROM fee_vouchers ORDER BY invoice_no DESC LIMIT 1';

//   try {
//     const lastInvoiceResult = await queryAsync(getLastInvoiceNoQuery);
//     let invoiceNo = lastInvoiceResult.length > 0 ? parseInt(lastInvoiceResult[0].invoice_no) + 1 : 1000;

//     const studentResults = await queryAsync(sql, sqlParams);
//     const mergedResults = mergeDataAndCalculateTotals(studentResults, data1);

//     const advanceMap = await fetchAdvanceData(from_month, campus_id, session_id);

//     if (!arrear_checked) {
//       const arrearsResults = await fetchArrearsData(mergedResults, from_month, campus_id, session_id);
//       await fetchBankDetailsAndProcessVouchers(mergedResults, months, arrearsResults, advanceMap, invoiceNo, from_month, to_month, due_date, remarks, campus_id, session_id, res, bus_fee_status);
//     } else {
//       await fetchBankDetailsAndProcessVouchers(mergedResults, months, {}, advanceMap, invoiceNo, from_month, to_month, due_date, remarks, campus_id, session_id, res, bus_fee_status, arrear_checked);
//     }
//   } catch (err) {
//     console.error('Error processing fee vouchers:', err);
//     res.status(500).json({ error: 'Error processing fee vouchers' });
//   }
// });

// async function fetchBankDetailsAndProcessVouchers(mergedResults, months, arrearsMap, advanceMap, invoiceNo, from_month, to_month, due_date, remarks, campus_id, session_id, res, bus_fee_status, arrear_checked = false) {
//   const getBankDetailsQuery = `
//     SELECT id AS bank_id
//     FROM bank_details
//     WHERE campus_id = ? AND status = 'On'
//   `;

//   try {
//     const bankDetailsResults = await queryAsync(getBankDetailsQuery, [campus_id]);
//     const bankDetails = bankDetailsResults.map(row => row.bank_id);

//     await processAndInsertMultiple(mergedResults, months, arrearsMap, advanceMap, invoiceNo, from_month, to_month, due_date, remarks, campus_id, session_id, res, bus_fee_status, arrear_checked, bankDetails);
//   } catch (err) {
//     console.error('Error fetching bank details:', err);
//     res.status(500).json({ error: 'Error fetching bank details' });
//   }
// }


// async function processAndInsertMultiple(mergedResults, months, arrearsMap, advanceMap, invoiceNo, from_month, to_month, due_date, remarks, campus_id, session_id, res, bus_fee_status, arrear_checked = false, bankDetails) {
//   const checkExistingEntriesQuery = `
//     SELECT student_id, for_the_month
//     FROM fee_vouchers
//     WHERE student_id IN (SELECT id FROM students WHERE campus_id = ? AND session_id = ? AND status IN ('New Admission', 'Promoted') AND status_on_off = 'On' AND status_for_pendings = 'On')
//     AND for_the_month BETWEEN ? AND ?
//   `;

//   try {
//     const existingEntries = await queryAsync(checkExistingEntriesQuery, [campus_id, session_id, from_month, to_month]);
//     const busFeeMap = bus_fee_status ? await fetchBusFeeDetails(campus_id, session_id) : {};

//     const existingEntriesSet = new Set(existingEntries.map(entry => `${entry.student_id}-${entry.for_the_month}`));

//     const finalResults = mergedResults.flatMap(result => {
//       return months.map(month => {
//         const key = `${result.id}-${month}`;
//         const arrearsInfo = arrearsMap[result.id];
//         const advanceInfo = advanceMap[result.id];
//         // Adding bus fee to total amount if bus_fee_status is true
//         let bus_fee = bus_fee_status ? (busFeeMap[result.id] || 0) : 0;
//         let total_amount_data = result.total_amount_data + bus_fee;
//         let status = "unpaid";

//         if (!existingEntriesSet.has(key)) {

//           let arrears_not_cleared = arrear_checked ? null : (arrearsInfo ? [...arrearsInfo.arrears_not_cleared] : []);

//           if (advanceInfo && advanceInfo.advance_payments >= (total_amount_data + (arrearsInfo && arrearsInfo.total_arrears ? arrearsInfo.total_arrears : 0))) {
//             status = 'paid';
//           }

//           if ((advanceInfo && advanceInfo.advance_payments > 0) && (advanceInfo && advanceInfo.advance_payments < (total_amount_data + (arrearsInfo && arrearsInfo.total_arrears ? arrearsInfo.total_arrears : 0)))) {
//             status = 'partially_paid';
//           }

//           if (month === from_month && arrearsInfo) {
//             if ((arrearsInfo.last_status === 'unpaid' || arrearsInfo.last_status === 'partially_paid') && arrearsInfo.total_arrears > 0) {
//               arrears_not_cleared.push(arrearsInfo.voucher_id.toString());
//               return {
//                 student_id: result.id,
//                 category_id: result.category_id,
//                 campus_id: result.campus_id,
//                 session_id: result.session_id,
//                 fee_head: JSON.stringify(result.data),

//                 total_amount_data: ((advanceInfo && advanceInfo.advance_payments > 0) && ((advanceInfo && advanceInfo.advance_payments ? advanceInfo.advance_payments : 0) < (total_amount_data + (arrearsInfo && arrearsInfo.total_arrears ? arrearsInfo.total_arrears : 0)))) ? total_amount_data - (advanceInfo && advanceInfo.advance_payments ? advanceInfo.advance_payments : 0) : total_amount_data,
//                 after_due_date_amount: ((advanceInfo && advanceInfo.advance_payments > 0) && ((advanceInfo && advanceInfo.advance_payments ? advanceInfo.advance_payments : 0) < (total_amount_data + (arrearsInfo && arrearsInfo.total_arrears ? arrearsInfo.total_arrears : 0)))) ? total_amount_data - (advanceInfo && advanceInfo.advance_payments ? advanceInfo.advance_payments : 0) + 25 : total_amount_data + 25,

//                 for_the_month: month,
//                 due_date,
//                 remarks,
//                 invoice_no: invoiceNo++,
//                 arrears: (advanceInfo && advanceInfo.advance_payments >= (total_amount_data + (arrearsInfo && arrearsInfo.total_arrears ? arrearsInfo.total_arrears : 0))) ? 0 : (arrearsInfo && arrearsInfo.total_arrears ? arrearsInfo.total_arrears : 0),
//                 status,
//                 arrears_not_cleared: (advanceInfo && advanceInfo.advance_payments >= (total_amount_data + (arrearsInfo && arrearsInfo.total_arrears ? arrearsInfo.total_arrears : 0))) ? '[]' : JSON.stringify(arrears_not_cleared),
//                 bank_details: JSON.stringify(bankDetails),
//                 advance_payments: (advanceInfo && advanceInfo.advance_payments >= (total_amount_data + (arrearsInfo && arrearsInfo.total_arrears ? arrearsInfo.total_arrears : 0))) ? advanceInfo.advance_payments - (total_amount_data + (arrearsInfo && arrearsInfo.total_arrears ? arrearsInfo.total_arrears : 0)) : 0,
//                 advance_status: (advanceInfo && advanceInfo.advance_payments >= (total_amount_data + (arrearsInfo && arrearsInfo.total_arrears ? arrearsInfo.total_arrears : 0))) ? "Advance" : ((advanceInfo && advanceInfo.advance_payments > 0) && ((advanceInfo && advanceInfo.advance_payments) < (total_amount_data + (arrearsInfo && arrearsInfo.total_arrears ? arrearsInfo.total_arrears : 0)))) ? "Advance" : "Exhaust",

//                 payment_date: (advanceInfo && advanceInfo.advance_payments >= (total_amount_data + (arrearsInfo && arrearsInfo.total_arrears ? arrearsInfo.total_arrears : 0))) ? new Date().toISOString().split('T')[0] : "-",
//                 recieved_payment: (advanceInfo && advanceInfo.advance_payments >= (total_amount_data + (arrearsInfo && arrearsInfo.total_arrears ? arrearsInfo.total_arrears : 0))) ? total_amount_data + (arrearsInfo && arrearsInfo.total_arrears ? arrearsInfo.total_arrears : 0) : 0,
//                 scroll_no: (advanceInfo && advanceInfo.advance_payments >= (total_amount_data + (arrearsInfo && arrearsInfo.total_arrears ? arrearsInfo.total_arrears : 0))) ? advanceInfo.scroll_no : null,
//                 payment_received_through_bank: (advanceInfo && advanceInfo.advance_payments >= (total_amount_data + (arrearsInfo && arrearsInfo.total_arrears ? arrearsInfo.total_arrears : 0))) ? advanceInfo.payment_received_through_bank : null,
//                 bus_fee: bus_fee,
//                 arrears_gap: arrearsInfo ? arrearsInfo.arrear_gap : 0 ,
//                 arrear_gap_from_payable: arrearsInfo ? arrearsInfo.arrear_gap - total_amount_data: 0 ,
//                 voucher_created_form : "Multiple"
//               };
//             } else {
//               total_amount_data += arrearsInfo.total_arrears;
//             }
//           }

//           return {
//             student_id: result.id,
//             category_id: result.category_id,
//             campus_id: result.campus_id,
//             session_id: result.session_id,
//             fee_head: JSON.stringify(result.data),

//             total_amount_data: ((advanceInfo && advanceInfo.advance_payments > 0) && ((advanceInfo && advanceInfo.advance_payments ? advanceInfo.advance_payments : 0) < (total_amount_data + (arrearsInfo && arrearsInfo.total_arrears ? arrearsInfo.total_arrears : 0)))) ? total_amount_data - (advanceInfo && advanceInfo.advance_payments ? advanceInfo.advance_payments : 0) : total_amount_data,
//             after_due_date_amount: ((advanceInfo && advanceInfo.advance_payments > 0) && ((advanceInfo && advanceInfo.advance_payments ? advanceInfo.advance_payments : 0) < (total_amount_data + (arrearsInfo && arrearsInfo.total_arrears ? arrearsInfo.total_arrears : 0)))) ? total_amount_data - (advanceInfo && advanceInfo.advance_payments ? advanceInfo.advance_payments : 0) + 25 : total_amount_data + 25,

//             for_the_month: month,
//             due_date,
//             remarks,
//             invoice_no: invoiceNo++,
//             arrears: (advanceInfo && advanceInfo.advance_payments >= (total_amount_data + (arrearsInfo && arrearsInfo.total_arrears ? arrearsInfo.total_arrears : 0))) ? 0 : (arrearsInfo && arrearsInfo.total_arrears ? arrearsInfo.total_arrears : 0),
//             status,
//             arrears_not_cleared: (advanceInfo && advanceInfo.advance_payments >= (total_amount_data + (arrearsInfo && arrearsInfo.total_arrears ? arrearsInfo.total_arrears : 0))) ? '[]' : JSON.stringify(arrears_not_cleared),
//             bank_details: JSON.stringify(bankDetails),
//             advance_payments: (advanceInfo && advanceInfo.advance_payments >= (total_amount_data + (arrearsInfo && arrearsInfo.total_arrears ? arrearsInfo.total_arrears : 0))) ? advanceInfo.advance_payments - (total_amount_data + (arrearsInfo && arrearsInfo.total_arrears ? arrearsInfo.total_arrears : 0)) : 0,
//             advance_status: (advanceInfo && advanceInfo.advance_payments >= (total_amount_data + (arrearsInfo && arrearsInfo.total_arrears ? arrearsInfo.total_arrears : 0))) ? "Advance" : ((advanceInfo && advanceInfo.advance_payments > 0) && ((advanceInfo && advanceInfo.advance_payments) < (total_amount_data + (arrearsInfo && arrearsInfo.total_arrears ? arrearsInfo.total_arrears : 0)))) ? "Advance" : "Exhaust",

//             payment_date: (advanceInfo && advanceInfo.advance_payments >= (total_amount_data + (arrearsInfo && arrearsInfo.total_arrears ? arrearsInfo.total_arrears : 0))) ? new Date().toISOString().split('T')[0] : "-",
//             recieved_payment: (advanceInfo && advanceInfo.advance_payments >= (total_amount_data + (arrearsInfo && arrearsInfo.total_arrears ? arrearsInfo.total_arrears : 0))) ? total_amount_data + (arrearsInfo && arrearsInfo.total_arrears ? arrearsInfo.total_arrears : 0) : 0,
//             scroll_no: (advanceInfo && advanceInfo.advance_payments >= (total_amount_data + (arrearsInfo && arrearsInfo.total_arrears ? arrearsInfo.total_arrears : 0))) ? advanceInfo.scroll_no : null,
//             payment_received_through_bank: (advanceInfo && advanceInfo.advance_payments >= (total_amount_data + (arrearsInfo && arrearsInfo.total_arrears ? arrearsInfo.total_arrears : 0))) ? advanceInfo.payment_received_through_bank : null,
//             bus_fee: bus_fee,
//             arrears_gap: arrearsInfo ? arrearsInfo.arrear_gap : 0, // New field
//             arrear_gap_from_payable: arrearsInfo ? arrearsInfo.arrear_gap - total_amount_data: 0 ,
//             voucher_created_form : "Multiple"
//           };
//         } else {
//           return null;
//         }
//       }).filter(entry => entry !== null);
//     });

//     if (finalResults.length === 0) {
//       return res.status(200).json({
//         message: 'No new fee vouchers to insert',
//         arrear_not_cleared: finalResults.map(result => result.arrears_not_cleared)
//       });
//     }

//     const insertQuery = `
//       INSERT INTO fee_vouchers
//       (student_id, category_id, campus_id, session_id, fee_head, total_amount_data, after_due_date_amount, for_the_month, due_date, remarks, invoice_no, arrears, status, arrears_not_cleared, bank_details, advance_payments, advance_status, payment_date, recieved_payment, scroll_no, payment_received_through_bank, bus_fee, arrears_gap, arrear_gap_from_payable, voucher_created_form)
//       VALUES ?
//     `;

//     const values = finalResults.map(result => [
//       result.student_id,
//       result.category_id,
//       result.campus_id,
//       result.session_id,
//       result.fee_head,
//       result.total_amount_data,
//       result.after_due_date_amount,
//       result.for_the_month,
//       result.due_date,
//       result.remarks,
//       result.invoice_no,
//       result.arrears,
//       result.status,
//       result.arrears_not_cleared,
//       result.bank_details,
//       result.advance_payments,
//       result.advance_status,
//       result.payment_date,
//       result.recieved_payment,
//       result.scroll_no,
//       result.payment_received_through_bank,
//       result.bus_fee,
//       result.arrears_gap, // New field
//       result.arrear_gap_from_payable,
//       result.voucher_created_form
//     ]);

//     const insertResult = await queryAsync(insertQuery, [values]);

//     // Check and update student status for arrears > 3 months
//     const studentsToUpdate = finalResults.filter(result => {
//       const arrearsDuration = JSON.parse(result.arrears_not_cleared).length;
//       console.log(result.arrears_not_cleared, arrearsDuration);

//       return arrearsDuration > 1;
//     }).map(result => result.student_id);

//     if (studentsToUpdate.length > 0) {
//       const updateStudentStatusQuery = `
//         UPDATE students
//         SET status_for_pendings = 'Off'
//         WHERE id IN (?)
//       `;
//       await queryAsync(updateStudentStatusQuery, [studentsToUpdate]);
//     }

//     res.status(200).json({
//       message: 'Fee vouchers inserted successfully',
//       insertResult,
//       arrear_not_cleared: finalResults.map(result => result.arrears_not_cleared)
//     });
//   } catch (err) {
//     console.error('Error processing fee vouchers:', err);
//     res.status(500).json({ error: 'Error processing fee vouchers' });
//   }
// }








// app.post('/single-fee-voucher', async (req, res) => {

//   let arrear_checked = false;
//   const { hidden_id, student_id, from_month, to_month, due_date, remarks, session_id, arrears, advance_payments, first_advance_payment, campus_id, user_id, arrear_set, bus_fee_status, bus_fee } = req.body.editFormData;
//   const data1 = req.body.groupedData;

//   if (arrear_set == true) {
//     arrear_checked = false;
//   } else {
//     arrear_checked = true;
//   }

//   const months = generateMonths(from_month, to_month);

//   const getLastInvoiceNoQuery = 'SELECT invoice_no FROM fee_vouchers ORDER BY invoice_no DESC LIMIT 1';

//   try {
//     if (hidden_id !== '') {

//       if (first_advance_payment > 0 && arrears > 0) {
//         return res.status(200).json({ error: 'Arrears should be cleared before making advance payments.' });
//       }

//       // Update query
//       var arrears_id_data = req.body.amountsData;
//       let arrears_id = arrears_id_data
//         .filter(item => item.status !== false)
//         .map(item => item.id.toString());

//       if (arrears === 0) {
//         arrears_id = [];
//       }

//       const get_category = req.body.editFormData["category_id"];
//       const get_heads_data = req.body.groupedData[get_category];

//       const grandSum = Object.values(data1).flat().reduce((total, item) => total + item.amount, 0);

//       // After adding fine
//       const after_due_date_amount_get = grandSum + 25;

//       const transform_head_detail = get_heads_data.map(item => ({
//         id: item.id,
//         amount: item.amount,
//         category_name: item.category_name
//       }));

//       const fee_head_detail_get = JSON.stringify(transform_head_detail);

//       let getAdvanceQuery = `
//         SELECT advance_payments
//         FROM fee_vouchers
//         WHERE student_id = ?
//           AND for_the_month < ?
//           AND campus_id = ?
//           AND session_id = ?
//           AND advance_status = 'Advance' 
//           AND status IN ('paid', 'partially_paid')
//         ORDER BY for_the_month DESC
//         LIMIT 1
//       `;

//       connection.query(getAdvanceQuery, [student_id, from_month, campus_id, session_id], (err, results) => {
//         if (err) {
//           console.error('Error fetching advance payments:', err);
//           return res.status(500).json({ error: 'Error fetching advance payments' });
//         }

//         let advancePayments = 0;
//         if (results.length > 0 && results[0].advance_payments) {
//           advancePayments = results[0].advance_payments;
//         }

//         let updateQuery;
//         let updateValues;

//         if (first_advance_payment > 0 && arrears <= 0) {
//           updateQuery = `
//             UPDATE fee_vouchers
//             SET
//               student_id = ?,
//               category_id = ?,
//               for_the_month = ?,
//               fee_head = ?,
//               total_amount_data = ?,
//               due_date = ?,
//               after_due_date_amount = ?,
//               arrears_not_cleared = ?,
//               arrears = ?,
//               remarks = ?,
//               advance_payments = ?,
//               advance_status = 'Advance',
//               first_advance_payment = ?
//             WHERE id = ?
//           `;

//           updateValues = [
//             student_id,
//             get_category,
//             from_month,
//             fee_head_detail_get,
//             grandSum + bus_fee,
//             due_date,
//             after_due_date_amount_get + bus_fee,
//             JSON.stringify(arrears_id),
//             arrears,
//             remarks,
//             parseInt(advancePayments) + parseInt(first_advance_payment),
//             first_advance_payment,
//             hidden_id
//           ];
//         } else {
//           updateQuery = `
//             UPDATE fee_vouchers
//             SET
//               student_id = ?,
//               category_id = ?,
//               for_the_month = ?,
//               fee_head = ?,
//               total_amount_data = ?,
//               due_date = ?,
//               after_due_date_amount = ?,
//               arrears_not_cleared = ?,
//               arrears = ?,
//               remarks = ?
//             WHERE id = ?
//           `;

//           updateValues = [
//             student_id,
//             get_category,
//             from_month,
//             fee_head_detail_get,
//             grandSum + bus_fee,
//             due_date,
//             after_due_date_amount_get + bus_fee,
//             JSON.stringify(arrears_id),
//             arrears,
//             remarks,
//             hidden_id
//           ];
//         }

//         connection.query(updateQuery, updateValues, (err, result) => {
//           if (err) {
//             console.error('Error updating data:', err);
//             return res.status(500).json({ error: 'Error updating data' });
//           } else {
//             return res.json({ message: 'Data updated successfully!' });
//           }
//         });
//       });

//     } else {
//       // Insert new record
//       const lastInvoiceResult = await queryAsync(getLastInvoiceNoQuery);
//       let invoiceNo = lastInvoiceResult.length > 0 ? parseInt(lastInvoiceResult[0].invoice_no) + 1 : 1000;

//       // Fetch student details
//       const studentQuery = `
//         SELECT s.id, s.category_id, s.campus_id, s.session_id
//         FROM students s
//         WHERE s.id = ?
//       `;
//       const studentResult = await queryAsync(studentQuery, [student_id]);
//       if (studentResult.length === 0) {
//         return res.status(404).json({ error: 'Student not found' });
//       }
//       const studentData = studentResult[0];

//       // Merge student data with provided fee data
//       const mergedData = mergeDataAndCalculateTotals([studentData], data1);

//       // Fetch advance data
//       const advanceMap = await fetchAdvanceData(from_month, campus_id, session_id);

//       // Fetch arrears data
//       const arrearsMap = arrear_checked ? {} : await fetchArrearsData(mergedData, from_month, campus_id, session_id);

//       // Fetch bus fee data if bus_fee_status is true
//       const busFeeMap = bus_fee_status ? await fetchBusFee(student_id, campus_id, session_id) : 0;

//       // Fetch bank details and process voucher
//       await fetchBankDetailsAndProcessSingleVoucher(mergedData, months, arrearsMap, advanceMap, invoiceNo, from_month, to_month, due_date, remarks, campus_id, session_id, busFeeMap, res, arrear_checked);
//     }
//   } catch (err) {
//     console.error('Error processing fee voucher:', err);
//     res.status(500).json({ error: 'Error processing fee voucher' });
//   }
// });

// async function fetchBankDetailsAndProcessSingleVoucher(mergedResults, months, arrearsMap, advanceMap, invoiceNo, from_month, to_month, due_date, remarks, campus_id, session_id, busFeeMap, res, arrear_checked = false) {
//   const getBankDetailsQuery = `
//     SELECT id AS bank_id
//     FROM bank_details
//     WHERE campus_id = ? AND status = 'On'
//   `;

//   try {
//     const bankDetailsResults = await queryAsync(getBankDetailsQuery, [campus_id]);
//     const bankDetails = bankDetailsResults.map(row => row.bank_id);

//     await processAndInsertSingleVoucher(mergedResults, months, arrearsMap, advanceMap, invoiceNo, from_month, to_month, due_date, remarks, campus_id, session_id, busFeeMap, res, arrear_checked, bankDetails);
//   } catch (err) {
//     console.error('Error fetching bank details:', err);
//     res.status(500).json({ error: 'Error fetching bank details' });
//   }
// }

// async function fetchBusFee(student_id, campus_id, session_id) {
//   const getBusFeeQuery = `
//     SELECT bus_fee
//     FROM students
//     WHERE id = ?
//     AND campus_id = ?
//     AND session_id = ?
//     AND bus_status = "On"
//   `;

//   try {
//     const busFeeResults = await queryAsync(getBusFeeQuery, [student_id, campus_id, session_id]);
//     if (busFeeResults.length === 0) {
//       return 0;
//     }

//     return busFeeResults[0].bus_fee;
//   } catch (err) {
//     console.error('Error fetching bus fee:', err);
//     throw err;
//   }
// }



// async function processAndInsertSingleVoucher(mergedResults, months, arrearsMap, advanceMap, invoiceNo, from_month, to_month, due_date, remarks, campus_id, session_id, busFeeMap, res, arrear_checked = false, bankDetails) {
//   const checkExistingEntriesQuery = `
//     SELECT student_id, for_the_month
//     FROM fee_vouchers
//     WHERE student_id = ? AND for_the_month BETWEEN ? AND ?
//   `;

//   try {
//     const existingEntries = await queryAsync(checkExistingEntriesQuery, [mergedResults[0].id, from_month, to_month]);

//     const existingEntriesSet = new Set(existingEntries.map(entry => `${entry.student_id}-${entry.for_the_month}`));

//     const finalResults = mergedResults.flatMap(result => {
//       return months.map(month => {
//         const key = `${result.id}-${month}`;
//         const arrearsInfo = arrearsMap[result.id];
//         const advanceInfo = advanceMap[result.id];
//         let bus_fee = (busFeeMap || 0); // Using bus fee from the separate query
//         let total_amount_data = result.total_amount_data + bus_fee; // Adding bus fee to total amount
//         let status = "unpaid";

//         if (!existingEntriesSet.has(key)) {
//           let arrears_not_cleared = arrear_checked ? [] : (arrearsInfo ? [...arrearsInfo.arrears_not_cleared] : []);

//           if (advanceInfo && advanceInfo.advance_payments >= (total_amount_data + (arrearsInfo && arrearsInfo.total_arrears ? arrearsInfo.total_arrears : 0))) {
//             status = 'paid';
//           }

//           if (advanceInfo && advanceInfo.advance_payments > 0 && advanceInfo.advance_payments < (total_amount_data + (arrearsInfo && arrearsInfo.total_arrears ? arrearsInfo.total_arrears : 0))) {
//             status = 'partially_paid';
//           }

//           if (month === from_month && arrearsInfo) {
//             if ((arrearsInfo.last_status === 'unpaid' || arrearsInfo.last_status === 'partially_paid') && arrearsInfo.total_arrears > 0) {
//               arrears_not_cleared.push(arrearsInfo.voucher_id.toString());
//               return {
//                 student_id: result.id,
//                 category_id: result.category_id,
//                 campus_id: result.campus_id,
//                 session_id: result.session_id,
//                 fee_head: JSON.stringify(result.data),
//                 total_amount_data: (advanceInfo && advanceInfo.advance_payments > 0 && advanceInfo.advance_payments < (total_amount_data + (arrearsInfo && arrearsInfo.total_arrears ? arrearsInfo.total_arrears : 0))) ? total_amount_data - (advanceInfo.advance_payments || 0) : total_amount_data,
//                 after_due_date_amount: (advanceInfo && advanceInfo.advance_payments > 0 && advanceInfo.advance_payments < (total_amount_data + (arrearsInfo && arrearsInfo.total_arrears ? arrearsInfo.total_arrears : 0))) ? total_amount_data - (advanceInfo.advance_payments || 0) + 25 : total_amount_data + 25,
//                 for_the_month: month,
//                 due_date,
//                 remarks,
//                 invoice_no: invoiceNo++,
//                 arrears: (advanceInfo && advanceInfo.advance_payments >= (total_amount_data + (arrearsInfo && arrearsInfo.total_arrears ? arrearsInfo.total_arrears : 0))) ? 0 : (arrearsInfo ? arrearsInfo.total_arrears : 0),
//                 status,
//                 arrears_not_cleared: (advanceInfo && advanceInfo.advance_payments >= (total_amount_data + (arrearsInfo ? arrearsInfo.total_arrears : 0))) ? '[]' : JSON.stringify(arrears_not_cleared),
//                 bank_details: JSON.stringify(bankDetails),
//                 advance_payments: (advanceInfo && advanceInfo.advance_payments >= (total_amount_data + (arrearsInfo ? arrearsInfo.total_arrears : 0))) ? advanceInfo.advance_payments - (total_amount_data + (arrearsInfo ? arrearsInfo.total_arrears : 0)) : 0,
//                 advance_status: (advanceInfo && advanceInfo.advance_payments >= (total_amount_data + (arrearsInfo ? arrearsInfo.total_arrears : 0))) ? "Advance" : (advanceInfo && advanceInfo.advance_payments > 0 && advanceInfo.advance_payments < (total_amount_data + (arrearsInfo ? arrearsInfo.total_arrears : 0))) ? "Advance" : "Exhaust",
//                 payment_date: (advanceInfo && advanceInfo.advance_payments >= (total_amount_data + (arrearsInfo ? arrearsInfo.total_arrears : 0))) ? new Date().toISOString().split('T')[0] : "-",
//                 recieved_payment: (advanceInfo && advanceInfo.advance_payments >= (total_amount_data + (arrearsInfo ? arrearsInfo.total_arrears : 0))) ? total_amount_data + (arrearsInfo ? arrearsInfo.total_arrears : 0) : 0,
//                 scroll_no: (advanceInfo && advanceInfo.advance_payments >= (total_amount_data + (arrearsInfo ? arrearsInfo.total_arrears : 0))) ? advanceInfo.scroll_no : null,
//                 payment_received_through_bank: (advanceInfo && advanceInfo.advance_payments >= (total_amount_data + (arrearsInfo ? arrearsInfo.total_arrears : 0))) ? advanceInfo.payment_received_through_bank : null,
//                 bus_fee: bus_fee, // Adding bus fee here
//                 arrears_gap: arrearsInfo ? arrearsInfo.arrear_gap : 0, // New field
//                 arrear_gap_from_payable: arrearsInfo ? arrearsInfo.arrear_gap - total_amount_data : 0 ,
//                 voucher_created_form : "Single"
//               };
//             } else {
//               total_amount_data += arrearsInfo.total_arrears;
//             }
//           }

//           return {
//             student_id: result.id,
//             category_id: result.category_id,
//             campus_id: result.campus_id,
//             session_id: result.session_id,
//             fee_head: JSON.stringify(result.data),
//             total_amount_data: (advanceInfo && advanceInfo.advance_payments > 0 && advanceInfo.advance_payments < (total_amount_data + (arrearsInfo ? arrearsInfo.total_arrears : 0))) ? total_amount_data - (advanceInfo.advance_payments || 0) : total_amount_data,
//             after_due_date_amount: (advanceInfo && advanceInfo.advance_payments > 0 && advanceInfo.advance_payments < (total_amount_data + (arrearsInfo ? arrearsInfo.total_arrears : 0))) ? total_amount_data - (advanceInfo.advance_payments || 0) + 25 : total_amount_data + 25,
//             for_the_month: month,
//             due_date,
//             remarks,
//             invoice_no: invoiceNo++,
//             arrears: (advanceInfo && advanceInfo.advance_payments >= (total_amount_data + (arrearsInfo ? arrearsInfo.total_arrears : 0))) ? 0 : (arrearsInfo && arrearsInfo.total_arrears ? arrearsInfo.total_arrears : 0),
//             status,
//             arrears_not_cleared: (advanceInfo && advanceInfo.advance_payments >= (total_amount_data + (arrearsInfo ? arrearsInfo.total_arrears : 0))) ? '[]' : JSON.stringify(arrears_not_cleared),
//             bank_details: JSON.stringify(bankDetails),
//             advance_payments: (advanceInfo && advanceInfo.advance_payments >= (total_amount_data + (arrearsInfo ? arrearsInfo.total_arrears : 0))) ? advanceInfo.advance_payments - (total_amount_data + (arrearsInfo ? arrearsInfo.total_arrears : 0)) : 0,
//             advance_status: (advanceInfo && advanceInfo.advance_payments >= (total_amount_data + (arrearsInfo ? arrearsInfo.total_arrears : 0))) ? "Advance" : (advanceInfo && advanceInfo.advance_payments > 0 && advanceInfo.advance_payments < (total_amount_data + (arrearsInfo ? arrearsInfo.total_arrears : 0))) ? "Advance" : "Exhaust",
//             payment_date: (advanceInfo && advanceInfo.advance_payments >= (total_amount_data + (arrearsInfo ? arrearsInfo.total_arrears : 0))) ? new Date().toISOString().split('T')[0] : "-",
//             recieved_payment: (advanceInfo && advanceInfo.advance_payments >= (total_amount_data + (arrearsInfo ? arrearsInfo.total_arrears : 0))) ? total_amount_data + (arrearsInfo ? arrearsInfo.total_arrears : 0) : 0,
//             scroll_no: (advanceInfo && advanceInfo.advance_payments >= (total_amount_data + (arrearsInfo ? arrearsInfo.total_arrears : 0))) ? advanceInfo.scroll_no : null,
//             payment_received_through_bank: (advanceInfo && advanceInfo.advance_payments >= (total_amount_data + (arrearsInfo ? arrearsInfo.total_arrears : 0))) ? advanceInfo.payment_received_through_bank : null,
//             bus_fee: bus_fee, // Adding bus fee here
//             arrears_gap: arrearsInfo ? arrearsInfo.arrear_gap : 0, // New field
//             arrear_gap_from_payable: arrearsInfo ? arrearsInfo.arrear_gap - total_amount_data : 0 ,
//             voucher_created_form : "Single"
//           };
//         } else {
//           return null;
//         }
//       }).filter(entry => entry !== null);
//     });

//     if (finalResults.length === 0) {
//       return res.status(200).json({
//         message: 'No new fee vouchers to insert',
//         arrear_not_cleared: finalResults.map(result => result.arrears_not_cleared)
//       });
//     }

//     const insertQuery = `
//       INSERT INTO fee_vouchers
//       (student_id, category_id, campus_id, session_id, fee_head, total_amount_data, after_due_date_amount, for_the_month, due_date, remarks, invoice_no, arrears, status, arrears_not_cleared, bank_details, advance_payments, advance_status, payment_date, recieved_payment, scroll_no, payment_received_through_bank, bus_fee, arrears_gap, arrear_gap_from_payable, voucher_created_form)
//       VALUES ?
//     `;

//     const values = finalResults.map(result => [
//       result.student_id,
//       result.category_id,
//       result.campus_id,
//       result.session_id,
//       result.fee_head,
//       result.total_amount_data,
//       result.after_due_date_amount,
//       result.for_the_month,
//       result.due_date,
//       result.remarks,
//       result.invoice_no,
//       result.arrears,
//       result.status,
//       result.arrears_not_cleared,
//       result.bank_details,
//       result.advance_payments,
//       result.advance_status,
//       result.payment_date,
//       result.recieved_payment,
//       result.scroll_no,
//       result.payment_received_through_bank,
//       result.bus_fee,
//       result.arrears_gap, // New field
//       result.arrear_gap_from_payable,
//       result.voucher_created_form
//     ]);

//     const insertResult = await queryAsync(insertQuery, [values]);

//     // Check and update student status for arrears > 3 months
//     const studentsToUpdate = finalResults.filter(result => {
//       const arrearsDuration = JSON.parse(result.arrears_not_cleared).length;
//       return arrearsDuration > 1;

//     }).map(result => result.student_id);

//     if (studentsToUpdate.length > 0) {
//       const updateStudentStatusQuery = `
//         UPDATE students
//         SET status_for_pendings = 'Off'
//         WHERE id IN (?)
//       `;
//       await queryAsync(updateStudentStatusQuery, [studentsToUpdate]);
//     }

//     res.status(200).json({
//       message: 'Fee voucher inserted successfully',
//       insertResult,
//       arrear_not_cleared: finalResults.map(result => result.arrears_not_cleared)
//     });
//   } catch (err) {
//     console.error('Error processing fee voucher:', err);
//     res.status(500).json({ error: 'Error processing fee voucher' });
//   }
// }




///this is my fee voucher code






function generateMonths(fromMonth, toMonth) {
  const months = [];
  const start = new Date(fromMonth + "-01");
  const end = new Date(toMonth + "-01");

  let current = start;
  while (current <= end) {
    const month = current.getMonth() + 1; // getMonth() is zero-based
    const year = current.getFullYear();
    months.push(`${year}-${month.toString().padStart(2, '0')}`);
    current.setMonth(current.getMonth() + 1);
  }

  return months;
}

function mergeDataAndCalculateTotals(results, data1) {
  return results.map(result => {
    const categoryId = result.category_id.toString();
    const data = data1[categoryId] || [];
    const totalAmount = data.reduce((sum, item) => sum + (item.amount || 0), 0);
    return { ...result, data, total_amount_data: totalAmount };
  });
}

function queryAsync(sql, params = []) {
  return new Promise((resolve, reject) => {
    connection.query(sql, params, (err, results) => {
      if (err) return reject(err);
      resolve(results);
    });
  });
}

async function fetchAdvanceData(from_month, campus_id, session_id) {
  const getLastStatusAndArrearsQuery = `
    SELECT fv.id AS voucher_id, fv.student_id, fv.advance_payments, fv.advance_status, fv.payment_received_through_bank, fv.scroll_no
    FROM fee_vouchers fv
    JOIN (
      SELECT student_id, MAX(for_the_month) AS last_month
      FROM fee_vouchers
      WHERE for_the_month < ? AND advance_status = 'Advance'  AND (status = 'paid' OR status = 'partially_paid')
      GROUP BY student_id
    ) last_entries
    ON fv.student_id = last_entries.student_id 
    AND fv.for_the_month = last_entries.last_month
    JOIN students s ON fv.student_id = s.id
    WHERE s.campus_id = ? AND s.session_id = ? AND s.status IN ('New Admission', 'Promoted') AND s.status_on_off = 'On'`;

  const advanceResults = await queryAsync(getLastStatusAndArrearsQuery, [from_month, campus_id, session_id]);

  const advanceMap = {};
  advanceResults.forEach(row => {
    advanceMap[row.student_id] = {
      last_status: row.advance_status,
      advance_payments: row.advance_payments,
      voucher_id: row.voucher_id,
      payment_received_through_bank: row.payment_received_through_bank,
      scroll_no: row.scroll_no
    };
  });

  console.log(advanceMap);

  return advanceMap;
}


// warn dont remove it
async function fetchArrearsData(mergedResults, from_month, campus_id, session_id) {

  const getLastStatusAndArrearsQuery = `
    SELECT fv.id AS voucher_id, fv.student_id, fv.status AS last_status, 
          fv.after_due_date_amount AS after_due_amount, fv.arrears AS total_arrears, fv.arrears_not_cleared, fv.first_advance_payment
          FROM fee_vouchers fv
          JOIN (
            SELECT student_id, MAX(for_the_month) AS last_month
            FROM fee_vouchers
            WHERE for_the_month < ?  AND (status = 'unpaid' OR status = 'partially_paid')
            GROUP BY student_id
          ) last_entries
          ON fv.student_id = last_entries.student_id 
          AND fv.for_the_month = last_entries.last_month
          JOIN students s ON fv.student_id = s.id 
          WHERE s.campus_id = ? AND s.session_id = ? AND s.status IN ('New Admission', 'Promoted') AND s.status_on_off = 'On'`;

  const arrearsResults = await queryAsync(getLastStatusAndArrearsQuery, [from_month, campus_id, session_id]);

  const arrearsMap = {};``
  arrearsResults.forEach(row => {
    const previousTotalArrears = row.total_arrears;
    const currentTotalArrears = row.after_due_amount + previousTotalArrears + parseInt(row.first_advance_payment);
    const arrearGap = currentTotalArrears - previousTotalArrears;

    arrearsMap[row.student_id] = {
      last_status: row.last_status,
      total_arrears: currentTotalArrears,
      arrears_not_cleared: JSON.parse(row.arrears_not_cleared || '[]'),
      voucher_id: row.voucher_id,
      arrear_gap: arrearGap
    };
  });

  console.log(arrearsMap);
  return arrearsMap;
}



// async function fetchArrearsData(mergedResults, from_month, campus_id, session_id) {
//   const threeMonthsAgo = new Date(from_month + "-01");
//   threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);
//   const threeMonthsAgoFormatted = `${threeMonthsAgo.getFullYear()}-${(threeMonthsAgo.getMonth() + 1).toString().padStart(2, '0')}`;

//   const getLastStatusAndArrearsQuery = `
//     SELECT fv.id AS voucher_id, fv.student_id, fv.status AS last_status, 
//           fv.after_due_date_amount AS after_due_amount, fv.arrears AS total_arrears, 
//           fv.arrears_not_cleared, fv.first_advance_payment, fv.for_the_month
//     FROM fee_vouchers fv
//     JOIN students s ON fv.student_id = s.id 
//     WHERE fv.for_the_month >= ? AND fv.for_the_month < ? 
//     AND s.campus_id = ? AND s.session_id = ? 
//     AND s.status IN ('New Admission', 'Promoted') 
//     AND s.status_on_off = 'On'
//     AND (fv.status = 'unpaid' OR fv.status = 'partially_paid')
//     ORDER BY fv.student_id, fv.for_the_month`;

//   const arrearsResults = await queryAsync(getLastStatusAndArrearsQuery, [threeMonthsAgoFormatted, from_month, campus_id, session_id]);

//   const arrearsMap = {};
//   arrearsResults.forEach(row => {
//     if (!arrearsMap[row.student_id]) {
//       arrearsMap[row.student_id] = {
//         total_arrears: 0,
//         arrears_not_cleared: [],
//         arrear_gap: 0
//       };
//     }

//     const currentTotalArrears = row.after_due_amount + arrearsMap[row.student_id].total_arrears + parseInt(row.first_advance_payment);
//     const arrearGap = currentTotalArrears - arrearsMap[row.student_id].total_arrears;

//     arrearsMap[row.student_id].total_arrears = currentTotalArrears;
//     arrearsMap[row.student_id].arrears_not_cleared.push(row.voucher_id.toString());
//     arrearsMap[row.student_id].arrear_gap += arrearGap;
//   });

//   console.log(arrearsMap);
//   return arrearsMap;
// }







async function fetchBusFeeDetails(campus_id, session_id) {
  const getBusFeeQuery = `
    SELECT id AS student_id, bus_fee
    FROM students
    WHERE campus_id = ? AND session_id = ? AND bus_status = 'On' AND status IN ('New Admission', 'Promoted') AND status_on_off = 'On'
  `;

  try {
    const busFeeResults = await queryAsync(getBusFeeQuery, [campus_id, session_id]);
    const busFeeMap = {};
    busFeeResults.forEach(row => {
      busFeeMap[row.student_id] = row.bus_fee;
    });

    return busFeeMap;
  } catch (err) {
    console.error('Error fetching bus fee details:', err);
    throw err;
  }
}

app.post('/fee-voucher', async (req, res) => {
  let arrear_checked = false; // assuming this is true based on your requirements
  const { class_id, shift, from_month, to_month, due_date, remarks, session_id, campus_id, user_id, arrear_set, bus_fee_status } = req.body.editFormData;
  const data1 = req.body.groupedData;

  // this is alternate set because I dont want to customize code. it already set to false
  if (arrear_set == true) {
    arrear_checked = false;
  } else {
    arrear_checked = true;
  }

  const months = generateMonths(from_month, to_month);

  let sql;
  let sqlParams;

  if (shift === "") {
    sql = `
          SELECT s.id, s.category_id, s.campus_id, s.session_id
          FROM students s
          JOIN school_categories c ON s.category_id = c.id
          WHERE s.class_id = ? 
            AND s.campus_id = ? 
            AND s.session_id = ?
            AND s.status IN ('New Admission', 'Promoted')
            AND s.status_on_off = 'On'
            AND s.status_for_pendings = 'On'
          ORDER BY s.category_id`;
    sqlParams = [class_id, campus_id, session_id];

  } else {

    sql = `
          SELECT s.id, s.category_id, s.campus_id, s.session_id
          FROM students s
          JOIN school_categories c ON s.category_id = c.id
          WHERE s.class_id = ? 
            AND s.shift = ? 
            AND s.campus_id = ? 
            AND s.session_id = ?
            AND s.status IN ('New Admission', 'Promoted')
            AND s.status_on_off = 'On'
            AND s.status_for_pendings = 'On'
          ORDER BY s.category_id`;

    sqlParams = [class_id, shift, campus_id, session_id];
  }

  const getLastInvoiceNoQuery = 'SELECT invoice_no FROM fee_vouchers ORDER BY invoice_no DESC LIMIT 1';

  try {
    const lastInvoiceResult = await queryAsync(getLastInvoiceNoQuery);
    let invoiceNo = lastInvoiceResult.length > 0 ? parseInt(lastInvoiceResult[0].invoice_no) + 1 : 1000;

    const studentResults = await queryAsync(sql, sqlParams);
    const mergedResults = mergeDataAndCalculateTotals(studentResults, data1);

    const advanceMap = await fetchAdvanceData(from_month, campus_id, session_id);

    if (!arrear_checked) {
      const arrearsResults = await fetchArrearsData(mergedResults, from_month, campus_id, session_id);
      await fetchBankDetailsAndProcessVouchers(mergedResults, months, arrearsResults, advanceMap, invoiceNo, from_month, to_month, due_date, remarks, campus_id, session_id, res, bus_fee_status);
    } else {
      await fetchBankDetailsAndProcessVouchers(mergedResults, months, {}, advanceMap, invoiceNo, from_month, to_month, due_date, remarks, campus_id, session_id, res, bus_fee_status, arrear_checked);
    }
  } catch (err) {
    console.error('Error processing fee vouchers:', err);
    res.status(500).json({ error: 'Error processing fee vouchers' });
  }
});

async function fetchBankDetailsAndProcessVouchers(mergedResults, months, arrearsMap, advanceMap, invoiceNo, from_month, to_month, due_date, remarks, campus_id, session_id, res, bus_fee_status, arrear_checked = false) {
  const getBankDetailsQuery = `
    SELECT id AS bank_id
    FROM bank_details
    WHERE campus_id = ? AND status = 'On'
  `;

  try {
    const bankDetailsResults = await queryAsync(getBankDetailsQuery, [campus_id]);
    const bankDetails = bankDetailsResults.map(row => row.bank_id);

    await processAndInsertMultiple(mergedResults, months, arrearsMap, advanceMap, invoiceNo, from_month, to_month, due_date, remarks, campus_id, session_id, res, bus_fee_status, arrear_checked, bankDetails);
  } catch (err) {
    console.error('Error fetching bank details:', err);
    res.status(500).json({ error: 'Error fetching bank details' });
  }
}




async function processAndInsertMultiple(mergedResults, months, arrearsMap, advanceMap, invoiceNo, from_month, to_month, due_date, remarks, campus_id, session_id, res, bus_fee_status, arrear_checked = false, bankDetails) {
  const checkExistingEntriesQuery = `
    SELECT student_id, for_the_month
    FROM fee_vouchers
    WHERE student_id IN (SELECT id FROM students WHERE campus_id = ? AND session_id = ? AND status IN ('New Admission', 'Promoted') AND status_on_off = 'On' AND status_for_pendings = 'On')
    AND for_the_month BETWEEN ? AND ?
  `;

  try {
    const existingEntries = await queryAsync(checkExistingEntriesQuery, [campus_id, session_id, from_month, to_month]);
    const busFeeMap = bus_fee_status ? await fetchBusFeeDetails(campus_id, session_id) : {};

    const existingEntriesSet = new Set(existingEntries.map(entry => `${entry.student_id}-${entry.for_the_month}`));

    const finalResults = mergedResults.flatMap(result => {
      return months.map(month => {
        const key = `${result.id}-${month}`;
        const arrearsInfo = arrearsMap[result.id];
        const advanceInfo = advanceMap[result.id];
        let bus_fee = bus_fee_status ? (busFeeMap[result.id] || 0) : 0;
        let total_amount_data = result.total_amount_data + bus_fee;
        let status = "unpaid";

        if (!existingEntriesSet.has(key)) {

          let arrears_not_cleared = arrear_checked ? [] : (arrearsInfo ? [...arrearsInfo.arrears_not_cleared] : []);

          if (advanceInfo && advanceInfo.advance_payments >= (total_amount_data + (arrearsInfo && arrearsInfo.total_arrears ? arrearsInfo.total_arrears : 0))) {
            status = 'paid';
          }

          if ((advanceInfo && advanceInfo.advance_payments > 0) && (advanceInfo && advanceInfo.advance_payments < (total_amount_data + (arrearsInfo && arrearsInfo.total_arrears ? arrearsInfo.total_arrears : 0)))) {
            status = 'partially_paid';
          }

          if (month === from_month && arrearsInfo) {
            if ((arrearsInfo.last_status === 'unpaid' || arrearsInfo.last_status === 'partially_paid') && arrearsInfo.total_arrears > 0) {
              arrears_not_cleared.push(arrearsInfo.voucher_id.toString());
              return {
                student_id: result.id,
                category_id: result.category_id,
                campus_id: result.campus_id,
                session_id: result.session_id,
                fee_head: JSON.stringify(result.data),
                total_amount_data: ((advanceInfo && advanceInfo.advance_payments > 0) && ((advanceInfo && advanceInfo.advance_payments ? advanceInfo.advance_payments : 0) < (total_amount_data + (arrearsInfo && arrearsInfo.total_arrears ? arrearsInfo.total_arrears : 0)))) ? total_amount_data - (advanceInfo && advanceInfo.advance_payments ? advanceInfo.advance_payments : 0) : total_amount_data,
                after_due_date_amount: ((advanceInfo && advanceInfo.advance_payments > 0) && ((advanceInfo && advanceInfo.advance_payments ? advanceInfo.advance_payments : 0) < (total_amount_data + (arrearsInfo && arrearsInfo.total_arrears ? arrearsInfo.total_arrears : 0)))) ? total_amount_data - (advanceInfo && advanceInfo.advance_payments ? advanceInfo.advance_payments : 0) + 25 : total_amount_data + 25,
                for_the_month: month,
                due_date,
                remarks,
                invoice_no: invoiceNo++,
                arrears: (advanceInfo && advanceInfo.advance_payments >= (total_amount_data + (arrearsInfo && arrearsInfo.total_arrears ? arrearsInfo.total_arrears : 0))) ? 0 : (arrearsInfo && arrearsInfo.total_arrears ? arrearsInfo.total_arrears : 0),
                status,
                arrears_not_cleared: (advanceInfo && advanceInfo.advance_payments >= (total_amount_data + (arrearsInfo && arrearsInfo.total_arrears ? arrearsInfo.total_arrears : 0))) ? '[]' : JSON.stringify(arrears_not_cleared),
                bank_details: JSON.stringify(bankDetails),
                advance_payments: (advanceInfo && advanceInfo.advance_payments >= (total_amount_data + (arrearsInfo && arrearsInfo.total_arrears ? arrearsInfo.total_arrears : 0))) ? advanceInfo.advance_payments - (total_amount_data + (arrearsInfo && arrearsInfo.total_arrears ? arrearsInfo.total_arrears : 0)) : 0,
                advance_status: (advanceInfo && advanceInfo.advance_payments >= (total_amount_data + (arrearsInfo && arrearsInfo.total_arrears ? arrearsInfo.total_arrears : 0))) ? "Advance" : ((advanceInfo && advanceInfo.advance_payments > 0) && ((advanceInfo && advanceInfo.advance_payments) < (total_amount_data + (arrearsInfo && arrearsInfo.total_arrears ? arrearsInfo.total_arrears : 0)))) ? "Advance" : "Exhaust",
                payment_date: (advanceInfo && advanceInfo.advance_payments >= (total_amount_data + (arrearsInfo && arrearsInfo.total_arrears ? arrearsInfo.total_arrears : 0))) ? new Date().toISOString().split('T')[0] : "-",
                recieved_payment: (advanceInfo && advanceInfo.advance_payments >= (total_amount_data + (arrearsInfo && arrearsInfo.total_arrears ? arrearsInfo.total_arrears : 0))) ? total_amount_data + (arrearsInfo && arrearsInfo.total_arrears ? arrearsInfo.total_arrears : 0) : 0,
                scroll_no: (advanceInfo && advanceInfo.advance_payments >= (total_amount_data + (arrearsInfo && arrearsInfo.total_arrears ? arrearsInfo.total_arrears : 0))) ? advanceInfo.scroll_no : null,
                payment_received_through_bank: (advanceInfo && advanceInfo.advance_payments >= (total_amount_data + (arrearsInfo && arrearsInfo.total_arrears ? arrearsInfo.total_arrears : 0))) ? advanceInfo.payment_received_through_bank : null,
                bus_fee: bus_fee,
                arrears_gap: arrearsInfo ? arrearsInfo.arrear_gap : 0,
                // arrear_gap_from_payable: arrearsInfo ? arrearsInfo.arrear_gap - total_amount_data: 0,
                voucher_created_form: "Multiple"
              };
            } else {
              total_amount_data += arrearsInfo.total_arrears;
            }
          }

          return {
            student_id: result.id,
            category_id: result.category_id,
            campus_id: result.campus_id,
            session_id: result.session_id,
            fee_head: JSON.stringify(result.data),
            total_amount_data: ((advanceInfo && advanceInfo.advance_payments > 0) && ((advanceInfo && advanceInfo.advance_payments ? advanceInfo.advance_payments : 0) < (total_amount_data + (arrearsInfo && arrearsInfo.total_arrears ? arrearsInfo.total_arrears : 0)))) ? total_amount_data - (advanceInfo && advanceInfo.advance_payments ? advanceInfo.advance_payments : 0) : total_amount_data,
            after_due_date_amount: ((advanceInfo && advanceInfo.advance_payments > 0) && ((advanceInfo && advanceInfo.advance_payments ? advanceInfo.advance_payments : 0) < (total_amount_data + (arrearsInfo && arrearsInfo.total_arrears ? arrearsInfo.total_arrears : 0)))) ? total_amount_data - (advanceInfo && advanceInfo.advance_payments ? advanceInfo.advance_payments : 0) + 25 : total_amount_data + 25,
            for_the_month: month,
            due_date,
            remarks,
            invoice_no: invoiceNo++,
            arrears: (advanceInfo && advanceInfo.advance_payments >= (total_amount_data + (arrearsInfo && arrearsInfo.total_arrears ? arrearsInfo.total_arrears : 0))) ? 0 : (arrearsInfo && arrearsInfo.total_arrears ? arrearsInfo.total_arrears : 0),
            status,
            arrears_not_cleared: (advanceInfo && advanceInfo.advance_payments >= (total_amount_data + (arrearsInfo && arrearsInfo.total_arrears ? arrearsInfo.total_arrears : 0))) ? '[]' : JSON.stringify(arrears_not_cleared),
            bank_details: JSON.stringify(bankDetails),
            advance_payments: (advanceInfo && advanceInfo.advance_payments >= (total_amount_data + (arrearsInfo && arrearsInfo.total_arrears ? arrearsInfo.total_arrears : 0))) ? advanceInfo.advance_payments - (total_amount_data + (arrearsInfo && arrearsInfo.total_arrears ? arrearsInfo.total_arrears : 0)) : 0,
            advance_status: (advanceInfo && advanceInfo.advance_payments >= (total_amount_data + (arrearsInfo && arrearsInfo.total_arrears ? arrearsInfo.total_arrears : 0))) ? "Advance" : ((advanceInfo && advanceInfo.advance_payments > 0) && ((advanceInfo && advanceInfo.advance_payments) < (total_amount_data + (arrearsInfo && arrearsInfo.total_arrears ? arrearsInfo.total_arrears : 0)))) ? "Advance" : "Exhaust",
            payment_date: (advanceInfo && advanceInfo.advance_payments >= (total_amount_data + (arrearsInfo && arrearsInfo.total_arrears ? arrearsInfo.total_arrears : 0))) ? new Date().toISOString().split('T')[0] : "-",
            recieved_payment: (advanceInfo && advanceInfo.advance_payments >= (total_amount_data + (arrearsInfo && arrearsInfo.total_arrears ? arrearsInfo.total_arrears : 0))) ? total_amount_data + (arrearsInfo && arrearsInfo.total_arrears ? arrearsInfo.total_arrears : 0) : 0,
            scroll_no: (advanceInfo && advanceInfo.advance_payments >= (total_amount_data + (arrearsInfo && arrearsInfo.total_arrears ? arrearsInfo.total_arrears : 0))) ? advanceInfo.scroll_no : null,
            payment_received_through_bank: (advanceInfo && advanceInfo.advance_payments >= (total_amount_data + (arrearsInfo && arrearsInfo.total_arrears ? arrearsInfo.total_arrears : 0))) ? advanceInfo.payment_received_through_bank : null,
            bus_fee: bus_fee,
            arrears_gap: arrearsInfo ? arrearsInfo.arrear_gap : 0,
            // arrear_gap_from_payable: arrearsInfo ? arrearsInfo.arrear_gap - total_amount_data: 0,
            voucher_created_form: "Multiple"
          };
        } else {
          return null;
        }
      }).filter(entry => entry !== null);
    });

    // Extracting voucher_ids that are stored in arrears_not_cleared
    const voucherIdsToUpdate = finalResults.reduce((acc, result) => {
      const arrearsIds = JSON.parse(result.arrears_not_cleared || '[]');
      return acc.concat(arrearsIds);
    }, []);

    if (voucherIdsToUpdate.length > 0) {
      const updateArrearsQuery = `
        UPDATE fee_vouchers
        SET is_arrear = 'arrears'
        WHERE id IN (?)
      `;
      await queryAsync(updateArrearsQuery, [voucherIdsToUpdate]);
    }

    if (finalResults.length === 0) {
      return res.status(200).json({
        message: 'No new fee vouchers to insert',
        arrear_not_cleared: finalResults.map(result => result.arrears_not_cleared)
      });
    }

    const insertQuery = `
      INSERT INTO fee_vouchers
      (student_id, category_id, campus_id, session_id, fee_head, total_amount_data, after_due_date_amount, for_the_month, due_date, remarks, invoice_no, arrears, status, arrears_not_cleared, bank_details, advance_payments, advance_status, payment_date, recieved_payment, scroll_no, payment_received_through_bank, bus_fee, arrears_gap, voucher_created_form)
      VALUES ?
    `;

    const values = finalResults.map(result => [
      result.student_id,
      result.category_id,
      result.campus_id,
      result.session_id,
      result.fee_head,
      result.total_amount_data,
      result.after_due_date_amount,
      result.for_the_month,
      result.due_date,
      result.remarks,
      result.invoice_no,
      result.arrears,
      result.status,
      result.arrears_not_cleared,
      result.bank_details,
      result.advance_payments,
      result.advance_status,
      result.payment_date,
      result.recieved_payment,
      result.scroll_no,
      result.payment_received_through_bank,
      result.bus_fee,
      result.arrears_gap,
      // result.arrear_gap_from_payable,
      result.voucher_created_form
    ]);

    const insertResult = await queryAsync(insertQuery, [values]);

    // Check and update student status for arrears > 3 months
    const studentsToUpdate = finalResults.filter(result => {
      const arrearsDuration = JSON.parse(result.arrears_not_cleared).length;
      return arrearsDuration > 1;
    }).map(result => result.student_id);

    if (studentsToUpdate.length > 0) {
      const updateStudentStatusQuery = `
        UPDATE students
        SET status_for_pendings = 'Off'
        WHERE id IN (?)
      `;
      await queryAsync(updateStudentStatusQuery, [studentsToUpdate]);
    }

    res.status(200).json({
      message: 'Fee vouchers inserted successfully',
      insertResult,
      arrear_not_cleared: finalResults.map(result => result.arrears_not_cleared)
    });
  } catch (err) {
    console.error('Error processing fee vouchers:', err);
    res.status(500).json({ error: 'Error processing fee vouchers' });
  }
}






//dont delete this
// app.post('/single-fee-voucher', async (req, res) => {

//   let arrear_checked = false;
//   const { hidden_id, student_id, from_month, to_month, due_date, remarks, session_id, arrears, advance_payments, first_advance_payment, campus_id, user_id, arrear_set, bus_fee_status, bus_fee } = req.body.editFormData;
//   const data1 = req.body.groupedData;

//   if (arrear_set === true) {
//     arrear_checked = false;
//   } else {
//     arrear_checked = true;
//   }

//   const months = generateMonths(from_month, to_month);

//   const getLastInvoiceNoQuery = 'SELECT invoice_no FROM fee_vouchers ORDER BY invoice_no DESC LIMIT 1';

//   try {

//     if (hidden_id !== '') {

//       if (first_advance_payment > 0 && arrears > 0) {
//         return res.status(200).json({ error: 'Arrears should be cleared before making advance payments.' });
//       }

//       // Fetch arrears_not_cleared from fee_vouchers for hidden_id
//       let fetchArrearsQuery = `
//         SELECT arrears_not_cleared, after_due_date_amount
//         FROM fee_vouchers 
//         WHERE id = ?
//       `;

//       connection.query(fetchArrearsQuery, [hidden_id], (err, result) => {
//         if (err) {
//           console.error('Error fetching arrears_not_cleared:', err);
//           return res.status(500).json({ error: 'Error fetching arrears_not_cleared' });
//         }

//         let arrearsNotCleared = [];
//         if (result.length > 0 && result[0].arrears_not_cleared) {
//           arrearsNotCleared = JSON.parse(result[0].arrears_not_cleared);
//         }

//         var arrears_id_data = req.body.amountsData;
//         let arrears_id = arrears_id_data
//           .filter(item => item.status !== false)
//           .map(item => item.id.toString());

//         if (arrears === 0) {
//           arrears_id = [];
//         }

//         // Compare fetched arrearsNotCleared with arrears_id array
//         let missingArrears = arrearsNotCleared.filter(id => !arrears_id.includes(id));

//         // Update is_arrears for missing arrears IDs
//         if (missingArrears.length > 0) {
//           let updateArrearsQuery = `
//             UPDATE fee_vouchers
//             SET is_arrear = ''
//             WHERE id IN (?)
//           `;

//           connection.query(updateArrearsQuery, [missingArrears], (err, updateResult) => {
//             if (err) {
//               console.error('Error updating is_arrears:', err);
//               return res.status(500).json({ error: 'Error updating is_arrears' });
//             }
//           });
//         }

//         // Proceed with your existing update logic

//         const get_category = req.body.editFormData["category_id"];
//         const get_heads_data = req.body.groupedData[get_category];

//         const grandSum = Object.values(data1).flat().reduce((total, item) => total + item.amount, 0);

//         // After adding fine
//         const after_due_date_amount_get = grandSum + 25;

//         const transform_head_detail = get_heads_data.map(item => ({
//           id: item.id,
//           amount: item.amount,
//           category_name: item.category_name
//         }));

//         const fee_head_detail_get = JSON.stringify(transform_head_detail);

//         let getAdvanceQuery = `
//           SELECT advance_payments
//           FROM fee_vouchers
//           WHERE student_id = ?
//             AND for_the_month < ?
//             AND campus_id = ?
//             AND session_id = ?
//             AND advance_status = 'Advance' 
//             AND status IN ('paid', 'partially_paid')
//           ORDER BY for_the_month DESC
//           LIMIT 1
//         `;

//         connection.query(getAdvanceQuery, [student_id, from_month, campus_id, session_id], (err, results) => {
//           if (err) {
//             console.error('Error fetching advance payments:', err);
//             return res.status(500).json({ error: 'Error fetching advance payments' });
//           }

//           let advancePayments = 0;
//           if (results.length > 0 && results[0].advance_payments) {
//             advancePayments = results[0].advance_payments;
//           }

//           let updateQuery;
//           let updateValues;

//           if (first_advance_payment > 0 && arrears <= 0) {
//             updateQuery = `
//               UPDATE fee_vouchers
//               SET
//                 student_id = ?,
//                 category_id = ?,
//                 for_the_month = ?,
//                 fee_head = ?,
//                 total_amount_data = ?,
//                 due_date = ?,
//                 after_due_date_amount = ?,
//                 arrears_not_cleared = ?,
//                 arrears = ?,
//                 remarks = ?,
//                 advance_payments = ?,
//                 advance_status = 'Advance',
//                 first_advance_payment = ?
//               WHERE id = ?
//             `;

//             updateValues = [
//               student_id,
//               get_category,
//               from_month,
//               fee_head_detail_get,
//               grandSum + bus_fee,
//               due_date,
//               after_due_date_amount_get + bus_fee,
//               JSON.stringify(arrears_id),
//               arrears,
//               remarks,
//               parseInt(advancePayments) + parseInt(first_advance_payment),
//               first_advance_payment,
//               hidden_id
//             ];
//           } else {



//             updateQuery = `
//               UPDATE fee_vouchers
//               SET
//                 student_id = ?,
//                 category_id = ?,
//                 for_the_month = ?,
//                 fee_head = ?,
//                 total_amount_data = ?,
//                 due_date = ?,
//                 after_due_date_amount = ?,
//                 arrears_not_cleared = ?,
//                 arrears = ?,
//                 is_arrear = ?,
//                 remarks = ?
//               WHERE id = ?
//             `;

//             updateValues = [
//               student_id,
//               get_category,
//               from_month,
//               fee_head_detail_get,
//               grandSum + bus_fee,
//               due_date,
//               after_due_date_amount_get + bus_fee,
//               JSON.stringify(arrears_id),
//               arrears,
//               arrears_id.length <= 0 ? "" : "arrears",
//               remarks,
//               hidden_id
//             ];

//           }

//           connection.query(updateQuery, updateValues, (err, result) => {
//             if (err) {
//               console.error('Error updating data:', err);
//               return res.status(500).json({ error: 'Error updating data' });
//             } else {
//               return res.json({ message: 'Data updated successfully!' });
//             }
//           });
//         });
//       });
//     } else {
//       // Insert new record
//       const lastInvoiceResult = await queryAsync(getLastInvoiceNoQuery);
//       let invoiceNo = lastInvoiceResult.length > 0 ? parseInt(lastInvoiceResult[0].invoice_no) + 1 : 1000;

//       // Fetch student details
//       const studentQuery = `
//         SELECT s.id, s.category_id, s.campus_id, s.session_id
//         FROM students s
//         WHERE s.id = ?
//       `;
//       const studentResult = await queryAsync(studentQuery, [student_id]);
//       if (studentResult.length === 0) {
//         return res.status(404).json({ error: 'Student not found' });
//       }
//       const studentData = studentResult[0];

//       // Merge student data with provided fee data
//       const mergedData = mergeDataAndCalculateTotals([studentData], data1);

//       // Fetch advance data
//       const advanceMap = await fetchAdvanceData(from_month, campus_id, session_id);

//       // Fetch arrears data
//       const arrearsMap = arrear_checked ? {} : await fetchArrearsData(mergedData, from_month, campus_id, session_id);

//       // Fetch bus fee data if bus_fee_status is true
//       const busFeeMap = bus_fee_status ? await fetchBusFee(student_id, campus_id, session_id) : 0;

//       // Fetch bank details and process voucher
//       await fetchBankDetailsAndProcessSingleVoucher(mergedData, months, arrearsMap, advanceMap, invoiceNo, from_month, to_month, due_date, remarks, campus_id, session_id, busFeeMap, res, arrear_checked);
//     }
//   } catch (err) {
//     console.error('Error processing fee voucher:', err);
//     res.status(500).json({ error: 'Error processing fee voucher' });
//   }
// });



app.post('/single-fee-voucher', async (req, res) => {
  let arrear_checked = false;
  const { hidden_id, student_id, from_month, to_month, due_date, remarks, session_id, arrears, advance_payments, first_advance_payment, campus_id, user_id, arrear_set, bus_fee_status, bus_fee } = req.body.editFormData;
  const data1 = req.body.groupedData;

  if (arrear_set === true) {
    arrear_checked = false;
  } else {
    arrear_checked = true;
  }

  const months = generateMonths(from_month, to_month);

  const getLastInvoiceNoQuery = 'SELECT invoice_no FROM fee_vouchers ORDER BY invoice_no DESC LIMIT 1';

  try {
    if (hidden_id !== '') {

      if (first_advance_payment > 0 && arrears > 0) {
        return res.status(200).json({ error: 'Arrears should be cleared before making advance payments.' });
      }

      // Fetch arrears_not_cleared and after_due_date_amount from fee_vouchers for hidden_id
      let fetchArrearsQuery = `
        SELECT arrears_not_cleared, after_due_date_amount
        FROM fee_vouchers 
        WHERE id = ?
      `;

      connection.query(fetchArrearsQuery, [hidden_id], (err, result) => {
        if (err) {
          console.error('Error fetching arrears_not_cleared:', err);
          return res.status(500).json({ error: 'Error fetching arrears_not_cleared' });
        }

        let arrearsNotCleared = [];
        let currentAfterDueDateAmount = 0;
        
        if (result.length > 0) {
          if (result[0].arrears_not_cleared) {
            arrearsNotCleared = JSON.parse(result[0].arrears_not_cleared);
          }
          currentAfterDueDateAmount = result[0].after_due_date_amount || 0;
        }

        var arrears_id_data = req.body.amountsData;
        let arrears_id = arrears_id_data
          .filter(item => item.status !== false)
          .map(item => item.id.toString());

        if (arrears === 0) {
          arrears_id = [];
        }

        // Compare fetched arrearsNotCleared with arrears_id array
        let missingArrears = arrearsNotCleared.filter(id => !arrears_id.includes(id));

        // Calculate the missingArrears amount
        const missingArrearsAmount = currentAfterDueDateAmount + parseInt(advance_payments || 0);

        // Update is_arrears for missing arrears IDs
        if (missingArrears.length > 0) {
          let updateArrearsQuery = `
            UPDATE fee_vouchers
            SET is_arrear = ''
            WHERE id IN (?)
          `;

          connection.query(updateArrearsQuery, [missingArrears], (err, updateResult) => {
            if (err) {
              console.error('Error updating is_arrears:', err);
              return res.status(500).json({ error: 'Error updating is_arrears' });
            }
          });
        }

        // Update after_due_date_amount for the hidden_id with missingArrearsAmount
        let updateDueDateAmountQuery = `
          UPDATE fee_vouchers
          SET after_due_date_amount = ?
          WHERE id = ?
        `;

        connection.query(updateDueDateAmountQuery, [missingArrearsAmount, hidden_id], (err, updateResult) => {
          if (err) {
            console.error('Error updating after_due_date_amount:', err);
            return res.status(500).json({ error: 'Error updating after_due_date_amount' });
          }
        });

        // Proceed with your existing update logic

        const get_category = req.body.editFormData["category_id"];
        const get_heads_data = req.body.groupedData[get_category];

        const grandSum = Object.values(data1).flat().reduce((total, item) => total + item.amount, 0);

        // After adding fine
        const after_due_date_amount_get = grandSum + 25;

        const transform_head_detail = get_heads_data.map(item => ({
          id: item.id,
          amount: item.amount,
          category_name: item.category_name
        }));

        const fee_head_detail_get = JSON.stringify(transform_head_detail);

        let getAdvanceQuery = `
          SELECT advance_payments
          FROM fee_vouchers
          WHERE student_id = ?
            AND for_the_month < ?
            AND campus_id = ?
            AND session_id = ?
            AND advance_status = 'Advance' 
            AND status IN ('paid', 'partially_paid')
          ORDER BY for_the_month DESC
          LIMIT 1
        `;

        connection.query(getAdvanceQuery, [student_id, from_month, campus_id, session_id], (err, results) => {
          if (err) {
            console.error('Error fetching advance payments:', err);
            return res.status(500).json({ error: 'Error fetching advance payments' });
          }

          let advancePayments = 0;
          if (results.length > 0 && results[0].advance_payments) {
            advancePayments = results[0].advance_payments;
          }

          let updateQuery;
          let updateValues;

          if (first_advance_payment > 0 && arrears <= 0) {
            updateQuery = `
              UPDATE fee_vouchers
              SET
                student_id = ?,
                category_id = ?,
                for_the_month = ?,
                fee_head = ?,
                total_amount_data = ?,
                due_date = ?,
                after_due_date_amount = ?,
                arrears_not_cleared = ?,
                arrears = ?,
                remarks = ?,
                advance_payments = ?,
                advance_status = 'Advance',
                first_advance_payment = ?
              WHERE id = ?
            `;

            updateValues = [
              student_id,
              get_category,
              from_month,
              fee_head_detail_get,
              grandSum + bus_fee,
              due_date,
              after_due_date_amount_get + bus_fee,
              JSON.stringify(arrears_id),
              arrears,
              remarks,
              parseInt(advancePayments) + parseInt(first_advance_payment),
              first_advance_payment,
              hidden_id
            ];
          } else {
            updateQuery = `
              UPDATE fee_vouchers
              SET
                student_id = ?,
                category_id = ?,
                for_the_month = ?,
                fee_head = ?,
                total_amount_data = ?,
                due_date = ?,
                after_due_date_amount = ?,
                arrears_not_cleared = ?,
                arrears = ?,
                is_arrear = ?,
                remarks = ?
              WHERE id = ?
            `;

            updateValues = [
              student_id,
              get_category,
              from_month,
              fee_head_detail_get,
              grandSum + bus_fee,
              due_date,
              after_due_date_amount_get + bus_fee,
              JSON.stringify(arrears_id),
              arrears,
              arrears_id.length <= 0 ? "" : "arrears",
              remarks,
              hidden_id
            ];
          }

          connection.query(updateQuery, updateValues, (err, result) => {
            if (err) {
              console.error('Error updating data:', err);
              return res.status(500).json({ error: 'Error updating data' });
            } else {
              return res.json({ message: 'Data updated successfully!' });
            }
          });
        });
      });
    } else {
      // Insert new record
      const lastInvoiceResult = await queryAsync(getLastInvoiceNoQuery);
      let invoiceNo = lastInvoiceResult.length > 0 ? parseInt(lastInvoiceResult[0].invoice_no) + 1 : 1000;

      // Fetch student details
      const studentQuery = `
        SELECT s.id, s.category_id, s.campus_id, s.session_id
        FROM students s
        WHERE s.id = ?
      `;
      const studentResult = await queryAsync(studentQuery, [student_id]);
      if (studentResult.length === 0) {
        return res.status(404).json({ error: 'Student not found' });
      }
      const studentData = studentResult[0];

      // Merge student data with provided fee data
      const mergedData = mergeDataAndCalculateTotals([studentData], data1);

      // Fetch advance data
      const advanceMap = await fetchAdvanceData(from_month, campus_id, session_id);

      // Fetch arrears data
      const arrearsMap = arrear_checked ? {} : await fetchArrearsData(mergedData, from_month, campus_id, session_id);

      // Fetch bus fee data if bus_fee_status is true
      const busFeeMap = bus_fee_status ? await fetchBusFee(student_id, campus_id, session_id) : 0;

      // Fetch bank details and process voucher
      await fetchBankDetailsAndProcessSingleVoucher(mergedData, months, arrearsMap, advanceMap, invoiceNo, from_month, to_month, due_date, remarks, campus_id, session_id, busFeeMap, res, arrear_checked);
    }
  } catch (err) {
    console.error('Error processing fee voucher:', err);
    res.status(500).json({ error: 'Error processing fee voucher' });
  }
});


async function fetchBankDetailsAndProcessSingleVoucher(mergedResults, months, arrearsMap, advanceMap, invoiceNo, from_month, to_month, due_date, remarks, campus_id, session_id, busFeeMap, res, arrear_checked = false) {
  const getBankDetailsQuery = `
    SELECT id AS bank_id
    FROM bank_details
    WHERE campus_id = ? AND status = 'On'
  `;

  try {
    const bankDetailsResults = await queryAsync(getBankDetailsQuery, [campus_id]);
    const bankDetails = bankDetailsResults.map(row => row.bank_id);

    await processAndInsertSingleVoucher(mergedResults, months, arrearsMap, advanceMap, invoiceNo, from_month, to_month, due_date, remarks, campus_id, session_id, busFeeMap, res, arrear_checked, bankDetails);
  } catch (err) {
    console.error('Error fetching bank details:', err);
    res.status(500).json({ error: 'Error fetching bank details' });
  }
}

async function fetchBusFee(student_id, campus_id, session_id) {
  const getBusFeeQuery = `
    SELECT bus_fee
    FROM students
    WHERE id = ?
    AND campus_id = ?
    AND session_id = ?
    AND bus_status = "On"
  `;

  try {
    const busFeeResults = await queryAsync(getBusFeeQuery, [student_id, campus_id, session_id]);
    if (busFeeResults.length === 0) {
      return 0;
    }

    return busFeeResults[0].bus_fee;
  } catch (err) {
    console.error('Error fetching bus fee:', err);
    throw err;
  }
}



async function processAndInsertSingleVoucher(mergedResults, months, arrearsMap, advanceMap, invoiceNo, from_month, to_month, due_date, remarks, campus_id, session_id, busFeeMap, res, arrear_checked = false, bankDetails) {
  const checkExistingEntriesQuery = `
    SELECT student_id, for_the_month
    FROM fee_vouchers
    WHERE student_id = ? AND for_the_month BETWEEN ? AND ?
  `;

  try {
    const existingEntries = await queryAsync(checkExistingEntriesQuery, [mergedResults[0].id, from_month, to_month]);

    const existingEntriesSet = new Set(existingEntries.map(entry => `${entry.student_id}-${entry.for_the_month}`));

    const finalResults = mergedResults.flatMap(result => {
      return months.map(month => {
        const key = `${result.id}-${month}`;
        const arrearsInfo = arrearsMap[result.id];
        const advanceInfo = advanceMap[result.id];
        let bus_fee = (busFeeMap || 0); // Using bus fee from the separate query
        let total_amount_data = result.total_amount_data + bus_fee; // Adding bus fee to total amount
        let status = "unpaid";

        if (!existingEntriesSet.has(key)) {
          let arrears_not_cleared = arrear_checked ? [] : (arrearsInfo ? [...arrearsInfo.arrears_not_cleared] : []);

          if (advanceInfo && advanceInfo.advance_payments >= (total_amount_data + (arrearsInfo && arrearsInfo.total_arrears ? arrearsInfo.total_arrears : 0))) {
            status = 'paid';
          }

          if (advanceInfo && advanceInfo.advance_payments > 0 && advanceInfo.advance_payments < (total_amount_data + (arrearsInfo && arrearsInfo.total_arrears ? arrearsInfo.total_arrears : 0))) {
            status = 'partially_paid';
          }

          if (month === from_month && arrearsInfo) {
            if ((arrearsInfo.last_status === 'unpaid' || arrearsInfo.last_status === 'partially_paid') && arrearsInfo.total_arrears > 0) {
              arrears_not_cleared.push(arrearsInfo.voucher_id.toString());
              return {
                student_id: result.id,
                category_id: result.category_id,
                campus_id: result.campus_id,
                session_id: result.session_id,
                fee_head: JSON.stringify(result.data),
                total_amount_data: (advanceInfo && advanceInfo.advance_payments > 0 && advanceInfo.advance_payments < (total_amount_data + (arrearsInfo && arrearsInfo.total_arrears ? arrearsInfo.total_arrears : 0))) ? total_amount_data - (advanceInfo.advance_payments || 0) : total_amount_data,
                after_due_date_amount: (advanceInfo && advanceInfo.advance_payments > 0 && advanceInfo.advance_payments < (total_amount_data + (arrearsInfo && arrearsInfo.total_arrears ? arrearsInfo.total_arrears : 0))) ? total_amount_data - (advanceInfo.advance_payments || 0) + 25 : total_amount_data + 25,
                for_the_month: month,
                due_date,
                remarks,
                invoice_no: invoiceNo++,
                arrears: (advanceInfo && advanceInfo.advance_payments >= (total_amount_data + (arrearsInfo && arrearsInfo.total_arrears ? arrearsInfo.total_arrears : 0))) ? 0 : (arrearsInfo ? arrearsInfo.total_arrears : 0),
                status,
                arrears_not_cleared: (advanceInfo && advanceInfo.advance_payments >= (total_amount_data + (arrearsInfo ? arrearsInfo.total_arrears : 0))) ? '[]' : JSON.stringify(arrears_not_cleared),
                bank_details: JSON.stringify(bankDetails),
                advance_payments: (advanceInfo && advanceInfo.advance_payments >= (total_amount_data + (arrearsInfo ? arrearsInfo.total_arrears : 0))) ? advanceInfo.advance_payments - (total_amount_data + (arrearsInfo ? arrearsInfo.total_arrears : 0)) : 0,
                advance_status: (advanceInfo && advanceInfo.advance_payments >= (total_amount_data + (arrearsInfo ? arrearsInfo.total_arrears : 0))) ? "Advance" : (advanceInfo && advanceInfo.advance_payments > 0 && advanceInfo.advance_payments < (total_amount_data + (arrearsInfo ? arrearsInfo.total_arrears : 0))) ? "Advance" : "Exhaust",
                payment_date: (advanceInfo && advanceInfo.advance_payments >= (total_amount_data + (arrearsInfo ? arrearsInfo.total_arrears : 0))) ? new Date().toISOString().split('T')[0] : "-",
                recieved_payment: (advanceInfo && advanceInfo.advance_payments >= (total_amount_data + (arrearsInfo ? arrearsInfo.total_arrears : 0))) ? total_amount_data + (arrearsInfo ? arrearsInfo.total_arrears : 0) : 0,
                scroll_no: (advanceInfo && advanceInfo.advance_payments >= (total_amount_data + (arrearsInfo ? arrearsInfo.total_arrears : 0))) ? advanceInfo.scroll_no : null,
                payment_received_through_bank: (advanceInfo && advanceInfo.advance_payments >= (total_amount_data + (arrearsInfo ? arrearsInfo.total_arrears : 0))) ? advanceInfo.payment_received_through_bank : null,
                bus_fee: bus_fee, // Adding bus fee here
                arrears_gap: arrearsInfo ? arrearsInfo.arrear_gap : 0, // New field
                // arrear_gap_from_payable: arrearsInfo ? arrearsInfo.arrear_gap - total_amount_data : 0 ,
                voucher_created_form: "Single"
              };
            } else {
              total_amount_data += arrearsInfo.total_arrears;
            }
          }

          return {
            student_id: result.id,
            category_id: result.category_id,
            campus_id: result.campus_id,
            session_id: result.session_id,
            fee_head: JSON.stringify(result.data),
            total_amount_data: (advanceInfo && advanceInfo.advance_payments > 0 && advanceInfo.advance_payments < (total_amount_data + (arrearsInfo ? arrearsInfo.total_arrears : 0))) ? total_amount_data - (advanceInfo.advance_payments || 0) : total_amount_data,
            after_due_date_amount: (advanceInfo && advanceInfo.advance_payments > 0 && advanceInfo.advance_payments < (total_amount_data + (arrearsInfo ? arrearsInfo.total_arrears : 0))) ? total_amount_data - (advanceInfo.advance_payments || 0) + 25 : total_amount_data + 25,
            for_the_month: month,
            due_date,
            remarks,
            invoice_no: invoiceNo++,
            arrears: (advanceInfo && advanceInfo.advance_payments >= (total_amount_data + (arrearsInfo ? arrearsInfo.total_arrears : 0))) ? 0 : (arrearsInfo && arrearsInfo.total_arrears ? arrearsInfo.total_arrears : 0),
            status,
            arrears_not_cleared: (advanceInfo && advanceInfo.advance_payments >= (total_amount_data + (arrearsInfo ? arrearsInfo.total_arrears : 0))) ? '[]' : JSON.stringify(arrears_not_cleared),
            bank_details: JSON.stringify(bankDetails),
            advance_payments: (advanceInfo && advanceInfo.advance_payments >= (total_amount_data + (arrearsInfo ? arrearsInfo.total_arrears : 0))) ? advanceInfo.advance_payments - (total_amount_data + (arrearsInfo ? arrearsInfo.total_arrears : 0)) : 0,
            advance_status: (advanceInfo && advanceInfo.advance_payments >= (total_amount_data + (arrearsInfo ? arrearsInfo.total_arrears : 0))) ? "Advance" : (advanceInfo && advanceInfo.advance_payments > 0 && advanceInfo.advance_payments < (total_amount_data + (arrearsInfo ? arrearsInfo.total_arrears : 0))) ? "Advance" : "Exhaust",
            payment_date: (advanceInfo && advanceInfo.advance_payments >= (total_amount_data + (arrearsInfo ? arrearsInfo.total_arrears : 0))) ? new Date().toISOString().split('T')[0] : "-",
            recieved_payment: (advanceInfo && advanceInfo.advance_payments >= (total_amount_data + (arrearsInfo ? arrearsInfo.total_arrears : 0))) ? total_amount_data + (arrearsInfo ? arrearsInfo.total_arrears : 0) : 0,
            scroll_no: (advanceInfo && advanceInfo.advance_payments >= (total_amount_data + (arrearsInfo ? arrearsInfo.total_arrears : 0))) ? advanceInfo.scroll_no : null,
            payment_received_through_bank: (advanceInfo && advanceInfo.advance_payments >= (total_amount_data + (arrearsInfo ? arrearsInfo.total_arrears : 0))) ? advanceInfo.payment_received_through_bank : null,
            bus_fee: bus_fee, // Adding bus fee here
            arrears_gap: arrearsInfo ? arrearsInfo.arrear_gap : 0, // New field
            // arrear_gap_from_payable: arrearsInfo ? arrearsInfo.arrear_gap - total_amount_data : 0 ,
            voucher_created_form: "Single"
          };
        } else {
          return null;
        }
      }).filter(entry => entry !== null);
    });

    // Extracting voucher_ids that are stored in arrears_not_cleared
    const voucherIdsToUpdate = finalResults.reduce((acc, result) => {
      const arrearsIds = JSON.parse(result.arrears_not_cleared || '[]');
      return acc.concat(arrearsIds);
    }, []);

    if (voucherIdsToUpdate.length > 0) {
      const updateArrearsQuery = `
        UPDATE fee_vouchers
        SET is_arrear = 'arrears'
        WHERE id IN (?)
      `;
      await queryAsync(updateArrearsQuery, [voucherIdsToUpdate]);
    }

    if (finalResults.length === 0) {
      return res.status(200).json({
        message: 'No new fee vouchers to insert',
        arrear_not_cleared: finalResults.map(result => result.arrears_not_cleared)
      });
    }

    const insertQuery = `
      INSERT INTO fee_vouchers
      (student_id, category_id, campus_id, session_id, fee_head, total_amount_data, after_due_date_amount, for_the_month, due_date, remarks, invoice_no, arrears, status, arrears_not_cleared, bank_details, advance_payments, advance_status, payment_date, recieved_payment, scroll_no, payment_received_through_bank, bus_fee, arrears_gap, voucher_created_form)
      VALUES ?
    `;

    const values = finalResults.map(result => [
      result.student_id,
      result.category_id,
      result.campus_id,
      result.session_id,
      result.fee_head,
      result.total_amount_data,
      result.after_due_date_amount,
      result.for_the_month,
      result.due_date,
      result.remarks,
      result.invoice_no,
      result.arrears,
      result.status,
      result.arrears_not_cleared,
      result.bank_details,
      result.advance_payments,
      result.advance_status,
      result.payment_date,
      result.recieved_payment,
      result.scroll_no,
      result.payment_received_through_bank,
      result.bus_fee,
      result.arrears_gap, // New field
      // result.arrear_gap_from_payable,
      result.voucher_created_form
    ]);

    const insertResult = await queryAsync(insertQuery, [values]);

    // Check and update student status for arrears > 3 months
    const studentsToUpdate = finalResults.filter(result => {
      const arrearsDuration = JSON.parse(result.arrears_not_cleared).length;
      return arrearsDuration > 1;
    }).map(result => result.student_id);

    if (studentsToUpdate.length > 0) {
      const updateStudentStatusQuery = `
        UPDATE students
        SET status_for_pendings = 'Off'
        WHERE id IN (?)
      `;
      await queryAsync(updateStudentStatusQuery, [studentsToUpdate]);
    }

    res.status(200).json({
      message: 'Fee voucher inserted successfully',
      insertResult,
      arrear_not_cleared: finalResults.map(result => result.arrears_not_cleared)
    });
  } catch (err) {
    console.error('Error processing fee voucher:', err);
    res.status(500).json({ error: 'Error processing fee voucher' });
  }
}


//new fee voucher code











function generateMonths(fromMonth, toMonth) {
  const months = [];
  const start = new Date(fromMonth + "-01");
  const end = new Date(toMonth + "-01");

  let current = start;
  while (current <= end) {
    const month = current.getMonth() + 1; // getMonth() is zero-based
    const year = current.getFullYear();
    months.push(`${year}-${month.toString().padStart(2, '0')}`);
    current.setMonth(current.getMonth() + 1);
  }

  return months;
}

function mergeDataAndCalculateTotals(results, data1) {
  return results.map(result => {
    const categoryId = result.category_id.toString();
    const data = data1[categoryId] || [];
    const totalAmount = data.reduce((sum, item) => sum + (item.amount || 0), 0);
    return { ...result, data, total_amount_data: totalAmount };
  });
}

function queryAsync(sql, params = []) {
  return new Promise((resolve, reject) => {
    connection.query(sql, params, (err, results) => {
      if (err) return reject(err);
      resolve(results);
    });
  });
}

async function fetchAdvanceData(from_month, campus_id, session_id) {
  const getLastStatusAndArrearsQuery = `
    SELECT fv.id AS voucher_id, fv.student_id, fv.advance_payments, fv.advance_status, fv.payment_received_through_bank, fv.scroll_no
    FROM fee_vouchers fv
    JOIN (
      SELECT student_id, MAX(for_the_month) AS last_month
      FROM fee_vouchers
      WHERE for_the_month < ? AND advance_status = 'Advance'  AND (status = 'paid' OR status = 'partially_paid')
      GROUP BY student_id
    ) last_entries
    ON fv.student_id = last_entries.student_id 
    AND fv.for_the_month = last_entries.last_month
    JOIN students s ON fv.student_id = s.id
    WHERE s.campus_id = ? AND s.session_id = ? AND s.status IN ('New Admission', 'Promoted') AND s.status_on_off = 'On'`;

  const advanceResults = await queryAsync(getLastStatusAndArrearsQuery, [from_month, campus_id, session_id]);

  const advanceMap = {};
  advanceResults.forEach(row => {
    advanceMap[row.student_id] = {
      last_status: row.advance_status,
      advance_payments: row.advance_payments,
      voucher_id: row.voucher_id,
      payment_received_through_bank: row.payment_received_through_bank,
      scroll_no: row.scroll_no
    };
  });

  console.log(advanceMap);

  return advanceMap;
}


async function fetchArrearsData(mergedResults, from_month, campus_id, session_id) {
  let formattedMonth = `${from_month}-01`;

  const getLastThreeMonthsArrearsQuery = `
      SELECT fv.id AS voucher_id, fv.student_id, fv.status AS last_status, 
            fv.after_due_date_amount AS after_due_amount, fv.arrears AS total_arrears, fv.arrears_not_cleared, fv.first_advance_payment,
            fv.for_the_month
      FROM fee_vouchers fv
      JOIN students s ON fv.student_id = s.id 
      WHERE fv.for_the_month < ? 
      AND fv.for_the_month >= DATE_SUB(?, INTERVAL 4 MONTH)
      AND (fv.status = 'unpaid' OR fv.status = 'partially_paid')
      AND s.campus_id = ? AND s.session_id = ?
      AND s.status IN ('New Admission', 'Promoted') 
      AND s.status_on_off = 'On'
      ORDER BY fv.student_id, fv.for_the_month DESC`;

  const arrearsResults = await queryAsync(getLastThreeMonthsArrearsQuery, [formattedMonth, formattedMonth, campus_id, session_id]);

  const arrearsMap = {};
  arrearsResults.forEach(row => {
      if (!arrearsMap[row.student_id]) {
          arrearsMap[row.student_id] = {
              arrears_not_cleared: [],
              total_arrears: 0
          };
      }

      const currentTotalArrears = row.after_due_amount + parseInt(row.first_advance_payment, 10);

      // Initialize arrears_not_cleared with existing data if present
      let arrearsIds = [];
      if (row.arrears_not_cleared) {
          try {
              arrearsIds = JSON.parse(row.arrears_not_cleared);
          } catch (e) {
              // Handle case where arrears_not_cleared is not valid JSON, treat it as a single ID
              arrearsIds = [row.arrears_not_cleared];
          }
      }

      // Add the current voucher ID to the arrears_not_cleared array only if it is not already present
      if (!arrearsIds.includes(row.voucher_id)) {
          arrearsIds.push(row.voucher_id);
      }

      // Update the arrearsMap with the unique arrearsIds and total_arrears
      arrearsMap[row.student_id].arrears_not_cleared = [...new Set([...arrearsMap[row.student_id].arrears_not_cleared, ...arrearsIds])];
      arrearsMap[row.student_id].total_arrears += currentTotalArrears;
  });

  console.log(arrearsMap);
  return arrearsMap;
}


async function fetchBusFeeDetails(campus_id, session_id) {
  const getBusFeeQuery = `
    SELECT id AS student_id, bus_fee
    FROM students
    WHERE campus_id = ? AND session_id = ? AND bus_status = 'On' AND status IN ('New Admission', 'Promoted') AND status_on_off = 'On'
  `;

  try {
    const busFeeResults = await queryAsync(getBusFeeQuery, [campus_id, session_id]);
    const busFeeMap = {};
    busFeeResults.forEach(row => {
      busFeeMap[row.student_id] = row.bus_fee;
    });

    return busFeeMap;
  } catch (err) {
    console.error('Error fetching bus fee details:', err);
    throw err;
  }
}

app.post('/fee-voucher', async (req, res) => {
  let arrear_checked = false; // assuming this is true based on your requirements
  const { class_id, shift, from_month, to_month, due_date, remarks, session_id, campus_id, user_id, arrear_set, bus_fee_status } = req.body.editFormData;
  const data1 = req.body.groupedData;

  // this is alternate set because I dont want to customize code. it already set to false
  if (arrear_set == true) {
    arrear_checked = false;
  } else {
    arrear_checked = true;
  }

  const months = generateMonths(from_month, to_month);

  let sql;
  let sqlParams;

  if (shift === "") {
    sql = `
          SELECT s.id, s.category_id, s.campus_id, s.session_id
          FROM students s
          JOIN school_categories c ON s.category_id = c.id
          WHERE s.class_id = ? 
            AND s.campus_id = ? 
            AND s.session_id = ?
            AND s.status IN ('New Admission', 'Promoted')
            AND s.status_on_off = 'On'
            AND s.status_for_pendings = 'On'
          ORDER BY s.category_id`;
    sqlParams = [class_id, campus_id, session_id];

  } else {

    sql = `
          SELECT s.id, s.category_id, s.campus_id, s.session_id
          FROM students s
          JOIN school_categories c ON s.category_id = c.id
          WHERE s.class_id = ? 
            AND s.shift = ? 
            AND s.campus_id = ? 
            AND s.session_id = ?
            AND s.status IN ('New Admission', 'Promoted')
            AND s.status_on_off = 'On'
            AND s.status_for_pendings = 'On'
          ORDER BY s.category_id`;

    sqlParams = [class_id, shift, campus_id, session_id];
  }

  const getLastInvoiceNoQuery = 'SELECT invoice_no FROM fee_vouchers ORDER BY invoice_no DESC LIMIT 1';

  try {
    const lastInvoiceResult = await queryAsync(getLastInvoiceNoQuery);
    let invoiceNo = lastInvoiceResult.length > 0 ? parseInt(lastInvoiceResult[0].invoice_no) + 1 : 1000;

    const studentResults = await queryAsync(sql, sqlParams);
    const mergedResults = mergeDataAndCalculateTotals(studentResults, data1);

    const advanceMap = await fetchAdvanceData(from_month, campus_id, session_id);

    if (!arrear_checked) {
      const arrearsResults = await fetchArrearsData(mergedResults, from_month, campus_id, session_id);
      await fetchBankDetailsAndProcessVouchers(mergedResults, months, arrearsResults, advanceMap, invoiceNo, from_month, to_month, due_date, remarks, campus_id, session_id, res, bus_fee_status);
    } else {
      await fetchBankDetailsAndProcessVouchers(mergedResults, months, {}, advanceMap, invoiceNo, from_month, to_month, due_date, remarks, campus_id, session_id, res, bus_fee_status, arrear_checked);
    }
  } catch (err) {
    console.error('Error processing fee vouchers:', err);
    res.status(500).json({ error: 'Error processing fee vouchers' });
  }
});

async function fetchBankDetailsAndProcessVouchers(mergedResults, months, arrearsMap, advanceMap, invoiceNo, from_month, to_month, due_date, remarks, campus_id, session_id, res, bus_fee_status, arrear_checked = false) {
  const getBankDetailsQuery = `
    SELECT id AS bank_id
    FROM bank_details
    WHERE campus_id = ? AND status = 'On'
  `;

  try {
    const bankDetailsResults = await queryAsync(getBankDetailsQuery, [campus_id]);
    const bankDetails = bankDetailsResults.map(row => row.bank_id);

    await processAndInsertMultiple(mergedResults, months, arrearsMap, advanceMap, invoiceNo, from_month, to_month, due_date, remarks, campus_id, session_id, res, bus_fee_status, arrear_checked, bankDetails);
  } catch (err) {
    console.error('Error fetching bank details:', err);
    res.status(500).json({ error: 'Error fetching bank details' });
  }
}




async function processAndInsertMultiple(mergedResults, months, arrearsMap, advanceMap, invoiceNo, from_month, to_month, due_date, remarks, campus_id, session_id, res, bus_fee_status, arrear_checked = false, bankDetails) {
  const checkExistingEntriesQuery = `
    SELECT student_id, for_the_month
    FROM fee_vouchers
    WHERE student_id IN (SELECT id FROM students WHERE campus_id = ? AND session_id = ? AND status IN ('New Admission', 'Promoted') AND status_on_off = 'On' AND status_for_pendings = 'On')
    AND for_the_month BETWEEN ? AND ?
  `;

  try {
    const existingEntries = await queryAsync(checkExistingEntriesQuery, [campus_id, session_id, from_month, to_month]);
    const busFeeMap = bus_fee_status ? await fetchBusFeeDetails(campus_id, session_id) : {};

    const existingEntriesSet = new Set(existingEntries.map(entry => `${entry.student_id}-${entry.for_the_month}`));

    const finalResults = mergedResults.flatMap(result => {
      return months.map(month => {
          const key = `${result.id}-${month}`;
          const arrearsInfo = arrearsMap[result.id];
          const advanceInfo = advanceMap[result.id];
          let bus_fee = bus_fee_status ? (busFeeMap[result.id] || 0) : 0;
          let total_amount_data = result.total_amount_data + bus_fee;
          let status = "unpaid";
  
          if (!existingEntriesSet.has(key)) {
              let arrears_not_cleared = arrear_checked ? [] : (arrearsInfo ? [...arrearsInfo.arrears_not_cleared] : []);
  
              if (advanceInfo && advanceInfo.advance_payments >= total_amount_data) {
                  status = 'paid';
              }
  
              if (advanceInfo && advanceInfo.advance_payments > 0 && advanceInfo.advance_payments < total_amount_data) {
                  status = 'partially_paid';
              }
  
              if (month === from_month && arrearsInfo) {
                  if ((arrearsInfo.last_status === 'unpaid' || arrearsInfo.last_status === 'partially_paid') && arrearsInfo.total_arrears > 0) {
                      arrears_not_cleared.push(arrearsInfo.voucher_id.toString());
                      return {
                          // Return the fee voucher object for this case
                          student_id: result.id,
                          category_id: result.category_id,
                          campus_id: result.campus_id,
                          session_id: result.session_id,
                          fee_head: JSON.stringify(result.data),
                          total_amount_data: (advanceInfo && advanceInfo.advance_payments > 0 && advanceInfo.advance_payments < total_amount_data) 
                              ? total_amount_data - advanceInfo.advance_payments 
                              : total_amount_data,
                          after_due_date_amount: (advanceInfo && advanceInfo.advance_payments > 0 && advanceInfo.advance_payments < total_amount_data)
                              ? total_amount_data - advanceInfo.advance_payments + 25
                              : total_amount_data + 25,
                          for_the_month: month,
                          due_date,
                          remarks,
                          invoice_no: invoiceNo++,
                          arrears: arrearsInfo ? arrearsInfo.total_arrears : 0, // Arrears field still exists if needed
                          status,
                          arrears_not_cleared: JSON.stringify(arrears_not_cleared),
                          bank_details: JSON.stringify(bankDetails),
                          advance_payments: advanceInfo ? advanceInfo.advance_payments : 0,
                          advance_status: (advanceInfo && advanceInfo.advance_payments >= total_amount_data) ? "Advance" : "Exhaust",
                          payment_date: (advanceInfo && advanceInfo.advance_payments >= total_amount_data) ? new Date().toISOString().split('T')[0] : "-",
                          recieved_payment: (advanceInfo && advanceInfo.advance_payments >= total_amount_data) ? total_amount_data : 0,
                          scroll_no: (advanceInfo && advanceInfo.advance_payments >= total_amount_data) ? advanceInfo.scroll_no : null,
                          payment_received_through_bank: (advanceInfo && advanceInfo.advance_payments >= total_amount_data) ? advanceInfo.payment_received_through_bank : null,
                          bus_fee: bus_fee,
                          arrears_gap: arrearsInfo ? arrearsInfo.arrear_gap : 0,
                          voucher_created_form: "Multiple"
                      };
                  } 
              }
  
              // General case without adding arrears to total_amount_data
              return {
                  student_id: result.id,
                  category_id: result.category_id,
                  campus_id: result.campus_id,
                  session_id: result.session_id,
                  fee_head: JSON.stringify(result.data),
                  total_amount_data: (advanceInfo && advanceInfo.advance_payments > 0 && advanceInfo.advance_payments < total_amount_data) 
                      ? total_amount_data - advanceInfo.advance_payments 
                      : total_amount_data,
                  after_due_date_amount: (advanceInfo && advanceInfo.advance_payments > 0 && advanceInfo.advance_payments < total_amount_data)
                      ? total_amount_data - advanceInfo.advance_payments + 25
                      : total_amount_data + 25,
                  for_the_month: month,
                  due_date,
                  remarks,
                  invoice_no: invoiceNo++,
                  arrears: arrearsInfo ? arrearsInfo.total_arrears : 0, // Arrears field still exists if needed
                  status,
                  arrears_not_cleared: JSON.stringify(arrears_not_cleared),
                  bank_details: JSON.stringify(bankDetails),
                  advance_payments: advanceInfo ? advanceInfo.advance_payments : 0,
                  advance_status: (advanceInfo && advanceInfo.advance_payments >= total_amount_data) ? "Advance" : "Exhaust",
                  payment_date: (advanceInfo && advanceInfo.advance_payments >= total_amount_data) ? new Date().toISOString().split('T')[0] : "-",
                  recieved_payment: (advanceInfo && advanceInfo.advance_payments >= total_amount_data) ? total_amount_data : 0,
                  scroll_no: (advanceInfo && advanceInfo.advance_payments >= total_amount_data) ? advanceInfo.scroll_no : null,
                  payment_received_through_bank: (advanceInfo && advanceInfo.advance_payments >= total_amount_data) ? advanceInfo.payment_received_through_bank : null,
                  bus_fee: bus_fee,
                  arrears_gap: arrearsInfo ? arrearsInfo.arrear_gap : 0,
                  voucher_created_form: "Multiple"
              };
          } else {
              return null;
          }
      }).filter(entry => entry !== null);
  });
  

    // Extracting voucher_ids that are stored in arrears_not_cleared
    const voucherIdsToUpdate = finalResults.reduce((acc, result) => {
      const arrearsIds = JSON.parse(result.arrears_not_cleared || '[]');
      return acc.concat(arrearsIds);
    }, []);

    if (voucherIdsToUpdate.length > 0) {
      const updateArrearsQuery = `
        UPDATE fee_vouchers
        SET is_arrear = 'arrears'
        WHERE id IN (?)
      `;
      await queryAsync(updateArrearsQuery, [voucherIdsToUpdate]);
    }

    if (finalResults.length === 0) {
      return res.status(200).json({
        message: 'No new fee vouchers to insert',
        arrear_not_cleared: finalResults.map(result => result.arrears_not_cleared)
      });
    }

    const insertQuery = `
      INSERT INTO fee_vouchers
      (student_id, category_id, campus_id, session_id, fee_head, total_amount_data, after_due_date_amount, for_the_month, due_date, remarks, invoice_no, arrears, status, arrears_not_cleared, bank_details, advance_payments, advance_status, payment_date, recieved_payment, scroll_no, payment_received_through_bank, bus_fee, arrears_gap, voucher_created_form)
      VALUES ?
    `;

    const values = finalResults.map(result => [
      result.student_id,
      result.category_id,
      result.campus_id,
      result.session_id,
      result.fee_head,
      result.total_amount_data,
      result.after_due_date_amount,
      result.for_the_month,
      result.due_date,
      result.remarks,
      result.invoice_no,
      result.arrears,
      result.status,
      result.arrears_not_cleared,
      result.bank_details,
      result.advance_payments,
      result.advance_status,
      result.payment_date,
      result.recieved_payment,
      result.scroll_no,
      result.payment_received_through_bank,
      result.bus_fee,
      result.arrears_gap,
      // result.arrear_gap_from_payable,
      result.voucher_created_form
    ]);

    const insertResult = await queryAsync(insertQuery, [values]);

    // Check and update student status for arrears > 3 months
    const studentsToUpdate = finalResults.filter(result => {
      const arrearsDuration = JSON.parse(result.arrears_not_cleared).length;
      return arrearsDuration > 1;
    }).map(result => result.student_id);

    if (studentsToUpdate.length > 0) {
      const updateStudentStatusQuery = `
        UPDATE students
        SET status_for_pendings = 'Off'
        WHERE id IN (?)
      `;
      await queryAsync(updateStudentStatusQuery, [studentsToUpdate]);
    }

    res.status(200).json({
      message: 'Fee vouchers inserted successfully',
      insertResult,
      arrear_not_cleared: finalResults.map(result => result.arrears_not_cleared)
    });
  } catch (err) {
    console.error('Error processing fee vouchers:', err);
    res.status(500).json({ error: 'Error processing fee vouchers' });
  }
}



app.post('/single-fee-voucher', async (req, res) => {
  let arrear_checked = false;
  const { hidden_id, student_id, from_month, to_month, due_date, remarks, session_id, arrears, advance_payments, first_advance_payment, campus_id, user_id, arrear_set, bus_fee_status, bus_fee } = req.body.editFormData;
  const data1 = req.body.groupedData;

  if (arrear_set === true) {
    arrear_checked = false;
  } else {
    arrear_checked = true;
  }

  const months = generateMonths(from_month, to_month);

  const getLastInvoiceNoQuery = 'SELECT invoice_no FROM fee_vouchers ORDER BY invoice_no DESC LIMIT 1';

  try {
    if (hidden_id !== '') {

      if (first_advance_payment > 0 && arrears > 0) {
        return res.status(200).json({ error: 'Arrears should be cleared before making advance payments.' });
      }

      // Fetch arrears_not_cleared and after_due_date_amount from fee_vouchers for hidden_id
      let fetchArrearsQuery = `
        SELECT arrears_not_cleared, after_due_date_amount
        FROM fee_vouchers 
        WHERE id = ?
      `;

      connection.query(fetchArrearsQuery, [hidden_id], (err, result) => {
        if (err) {
          console.error('Error fetching arrears_not_cleared:', err);
          return res.status(500).json({ error: 'Error fetching arrears_not_cleared' });
        }

        let arrearsNotCleared = [];
        let currentAfterDueDateAmount = 0;
        
        if (result.length > 0) {
          if (result[0].arrears_not_cleared) {
            arrearsNotCleared = JSON.parse(result[0].arrears_not_cleared);
          }
          currentAfterDueDateAmount = result[0].after_due_date_amount || 0;
        }

        var arrears_id_data = req.body.amountsData;
        let arrears_id = arrears_id_data
          .filter(item => item.status !== false)
          .map(item => item.id.toString());

        if (arrears === 0) {
          arrears_id = [];
        }

        // Compare fetched arrearsNotCleared with arrears_id array
        let missingArrears = arrearsNotCleared.filter(id => !arrears_id.includes(id));

        // Calculate the missingArrears amount
        const missingArrearsAmount = currentAfterDueDateAmount + parseInt(advance_payments || 0);

        // Update is_arrears for missing arrears IDs
        if (missingArrears.length > 0) {
          let updateArrearsQuery = `
            UPDATE fee_vouchers
            SET is_arrear = ''
            WHERE id IN (?)
          `;

          connection.query(updateArrearsQuery, [missingArrears], (err, updateResult) => {
            if (err) {
              console.error('Error updating is_arrears:', err);
              return res.status(500).json({ error: 'Error updating is_arrears' });
            }
          });
        }

        // Update after_due_date_amount for the hidden_id with missingArrearsAmount
        let updateDueDateAmountQuery = `
          UPDATE fee_vouchers
          SET after_due_date_amount = ?
          WHERE id = ?
        `;

        connection.query(updateDueDateAmountQuery, [missingArrearsAmount, hidden_id], (err, updateResult) => {
          if (err) {
            console.error('Error updating after_due_date_amount:', err);
            return res.status(500).json({ error: 'Error updating after_due_date_amount' });
          }
        });

        // Proceed with your existing update logic

        const get_category = req.body.editFormData["category_id"];
        const get_heads_data = req.body.groupedData[get_category];

        const grandSum = Object.values(data1).flat().reduce((total, item) => total + item.amount, 0);

        // After adding fine
        const after_due_date_amount_get = grandSum + 25;

        const transform_head_detail = get_heads_data.map(item => ({
          id: item.id,
          amount: item.amount,
          category_name: item.category_name
        }));

        const fee_head_detail_get = JSON.stringify(transform_head_detail);

        let getAdvanceQuery = `
          SELECT advance_payments
          FROM fee_vouchers
          WHERE student_id = ?
            AND for_the_month < ?
            AND campus_id = ?
            AND session_id = ?
            AND advance_status = 'Advance' 
            AND status IN ('paid', 'partially_paid')
          ORDER BY for_the_month DESC
          LIMIT 1
        `;

        connection.query(getAdvanceQuery, [student_id, from_month, campus_id, session_id], (err, results) => {
          if (err) {
            console.error('Error fetching advance payments:', err);
            return res.status(500).json({ error: 'Error fetching advance payments' });
          }

          let advancePayments = 0;
          if (results.length > 0 && results[0].advance_payments) {
            advancePayments = results[0].advance_payments;
          }

          let updateQuery;
          let updateValues;

          if (first_advance_payment > 0 && arrears <= 0) {
            updateQuery = `
              UPDATE fee_vouchers
              SET
                student_id = ?,
                category_id = ?,
                for_the_month = ?,
                fee_head = ?,
                total_amount_data = ?,
                due_date = ?,
                after_due_date_amount = ?,
                arrears_not_cleared = ?,
                arrears = ?,
                remarks = ?,
                advance_payments = ?,
                advance_status = 'Advance',
                first_advance_payment = ?
              WHERE id = ?
            `;

            updateValues = [
              student_id,
              get_category,
              from_month,
              fee_head_detail_get,
              grandSum + bus_fee,
              due_date,
              after_due_date_amount_get + bus_fee,
              JSON.stringify(arrears_id),
              arrears,
              remarks,
              parseInt(advancePayments) + parseInt(first_advance_payment),
              first_advance_payment,
              hidden_id
            ];
          } else {
            updateQuery = `
              UPDATE fee_vouchers
              SET
                student_id = ?,
                category_id = ?,
                for_the_month = ?,
                fee_head = ?,
                total_amount_data = ?,
                due_date = ?,
                after_due_date_amount = ?,
                arrears_not_cleared = ?,
                arrears = ?,
                is_arrear = ?,
                remarks = ?
              WHERE id = ?
            `;

            updateValues = [
              student_id,
              get_category,
              from_month,
              fee_head_detail_get,
              grandSum + bus_fee,
              due_date,
              after_due_date_amount_get + bus_fee,
              JSON.stringify(arrears_id),
              arrears,
              arrears_id.length <= 0 ? "" : "arrears",
              remarks,
              hidden_id
            ];
          }

          connection.query(updateQuery, updateValues, (err, result) => {
            if (err) {
              console.error('Error updating data:', err);
              return res.status(500).json({ error: 'Error updating data' });
            } else {
              return res.json({ message: 'Data updated successfully!' });
            }
          });
        });
      });
    } else {
      // Insert new record
      const lastInvoiceResult = await queryAsync(getLastInvoiceNoQuery);
      let invoiceNo = lastInvoiceResult.length > 0 ? parseInt(lastInvoiceResult[0].invoice_no) + 1 : 1000;

      // Fetch student details
      const studentQuery = `
        SELECT s.id, s.category_id, s.campus_id, s.session_id
        FROM students s
        WHERE s.id = ?
      `;
      const studentResult = await queryAsync(studentQuery, [student_id]);
      if (studentResult.length === 0) {
        return res.status(404).json({ error: 'Student not found' });
      }
      const studentData = studentResult[0];

      // Merge student data with provided fee data
      const mergedData = mergeDataAndCalculateTotals([studentData], data1);

      // Fetch advance data
      const advanceMap = await fetchAdvanceData(from_month, campus_id, session_id);

      // Fetch arrears data
      const arrearsMap = arrear_checked ? {} : await fetchArrearsData(mergedData, from_month, campus_id, session_id);

      // Fetch bus fee data if bus_fee_status is true
      const busFeeMap = bus_fee_status ? await fetchBusFee(student_id, campus_id, session_id) : 0;

      // Fetch bank details and process voucher
      await fetchBankDetailsAndProcessSingleVoucher(mergedData, months, arrearsMap, advanceMap, invoiceNo, from_month, to_month, due_date, remarks, campus_id, session_id, busFeeMap, res, arrear_checked);
    }
  } catch (err) {
    console.error('Error processing fee voucher:', err);
    res.status(500).json({ error: 'Error processing fee voucher' });
  }
});


async function fetchBankDetailsAndProcessSingleVoucher(mergedResults, months, arrearsMap, advanceMap, invoiceNo, from_month, to_month, due_date, remarks, campus_id, session_id, busFeeMap, res, arrear_checked = false) {
  const getBankDetailsQuery = `
    SELECT id AS bank_id
    FROM bank_details
    WHERE campus_id = ? AND status = 'On'
  `;

  try {
    const bankDetailsResults = await queryAsync(getBankDetailsQuery, [campus_id]);
    const bankDetails = bankDetailsResults.map(row => row.bank_id);

    await processAndInsertSingleVoucher(mergedResults, months, arrearsMap, advanceMap, invoiceNo, from_month, to_month, due_date, remarks, campus_id, session_id, busFeeMap, res, arrear_checked, bankDetails);
  } catch (err) {
    console.error('Error fetching bank details:', err);
    res.status(500).json({ error: 'Error fetching bank details' });
  }
}

async function fetchBusFee(student_id, campus_id, session_id) {
  const getBusFeeQuery = `
    SELECT bus_fee
    FROM students
    WHERE id = ?
    AND campus_id = ?
    AND session_id = ?
    AND bus_status = "On"
  `;

  try {
    const busFeeResults = await queryAsync(getBusFeeQuery, [student_id, campus_id, session_id]);
    if (busFeeResults.length === 0) {
      return 0;
    }

    return busFeeResults[0].bus_fee;
  } catch (err) {
    console.error('Error fetching bus fee:', err);
    throw err;
  }
}



async function processAndInsertSingleVoucher(mergedResults, months, arrearsMap, advanceMap, invoiceNo, from_month, to_month, due_date, remarks, campus_id, session_id, busFeeMap, res, arrear_checked = false, bankDetails) {
  const checkExistingEntriesQuery = `
    SELECT student_id, for_the_month
    FROM fee_vouchers
    WHERE student_id = ? AND for_the_month BETWEEN ? AND ?
  `;

  try {
    const existingEntries = await queryAsync(checkExistingEntriesQuery, [mergedResults[0].id, from_month, to_month]);

    const existingEntriesSet = new Set(existingEntries.map(entry => `${entry.student_id}-${entry.for_the_month}`));

    const finalResults = mergedResults.flatMap(result => {
      return months.map(month => {
        const key = `${result.id}-${month}`;
        const arrearsInfo = arrearsMap[result.id];
        const advanceInfo = advanceMap[result.id];
        let bus_fee = (busFeeMap || 0); // Using bus fee from the separate query
        let total_amount_data = result.total_amount_data + bus_fee; // Adding bus fee to total amount
        let status = "unpaid";

        if (!existingEntriesSet.has(key)) {
          let arrears_not_cleared = arrear_checked ? [] : (arrearsInfo ? [...arrearsInfo.arrears_not_cleared] : []);

          if (advanceInfo && advanceInfo.advance_payments >= (total_amount_data + (arrearsInfo && arrearsInfo.total_arrears ? arrearsInfo.total_arrears : 0))) {
            status = 'paid';
          }

          if (advanceInfo && advanceInfo.advance_payments > 0 && advanceInfo.advance_payments < (total_amount_data + (arrearsInfo && arrearsInfo.total_arrears ? arrearsInfo.total_arrears : 0))) {
            status = 'partially_paid';
          }

          if (month === from_month && arrearsInfo) {
            if ((arrearsInfo.last_status === 'unpaid' || arrearsInfo.last_status === 'partially_paid') && arrearsInfo.total_arrears > 0) {
              arrears_not_cleared.push(arrearsInfo.voucher_id.toString());
              return {
                student_id: result.id,
                category_id: result.category_id,
                campus_id: result.campus_id,
                session_id: result.session_id,
                fee_head: JSON.stringify(result.data),
                total_amount_data: (advanceInfo && advanceInfo.advance_payments > 0 && advanceInfo.advance_payments < (total_amount_data + (arrearsInfo && arrearsInfo.total_arrears ? arrearsInfo.total_arrears : 0))) ? total_amount_data - (advanceInfo.advance_payments || 0) : total_amount_data,
                after_due_date_amount: (advanceInfo && advanceInfo.advance_payments > 0 && advanceInfo.advance_payments < (total_amount_data + (arrearsInfo && arrearsInfo.total_arrears ? arrearsInfo.total_arrears : 0))) ? total_amount_data - (advanceInfo.advance_payments || 0) + 25 : total_amount_data + 25,
                for_the_month: month,
                due_date,
                remarks,
                invoice_no: invoiceNo++,
                arrears: (advanceInfo && advanceInfo.advance_payments >= (total_amount_data + (arrearsInfo && arrearsInfo.total_arrears ? arrearsInfo.total_arrears : 0))) ? 0 : (arrearsInfo ? arrearsInfo.total_arrears : 0),
                status,
                arrears_not_cleared: (advanceInfo && advanceInfo.advance_payments >= (total_amount_data + (arrearsInfo ? arrearsInfo.total_arrears : 0))) ? '[]' : JSON.stringify(arrears_not_cleared),
                bank_details: JSON.stringify(bankDetails),
                advance_payments: (advanceInfo && advanceInfo.advance_payments >= (total_amount_data + (arrearsInfo ? arrearsInfo.total_arrears : 0))) ? advanceInfo.advance_payments - (total_amount_data + (arrearsInfo ? arrearsInfo.total_arrears : 0)) : 0,
                advance_status: (advanceInfo && advanceInfo.advance_payments >= (total_amount_data + (arrearsInfo ? arrearsInfo.total_arrears : 0))) ? "Advance" : (advanceInfo && advanceInfo.advance_payments > 0 && advanceInfo.advance_payments < (total_amount_data + (arrearsInfo ? arrearsInfo.total_arrears : 0))) ? "Advance" : "Exhaust",
                payment_date: (advanceInfo && advanceInfo.advance_payments >= (total_amount_data + (arrearsInfo ? arrearsInfo.total_arrears : 0))) ? new Date().toISOString().split('T')[0] : "-",
                recieved_payment: (advanceInfo && advanceInfo.advance_payments >= (total_amount_data + (arrearsInfo ? arrearsInfo.total_arrears : 0))) ? total_amount_data + (arrearsInfo ? arrearsInfo.total_arrears : 0) : 0,
                scroll_no: (advanceInfo && advanceInfo.advance_payments >= (total_amount_data + (arrearsInfo ? arrearsInfo.total_arrears : 0))) ? advanceInfo.scroll_no : null,
                payment_received_through_bank: (advanceInfo && advanceInfo.advance_payments >= (total_amount_data + (arrearsInfo ? arrearsInfo.total_arrears : 0))) ? advanceInfo.payment_received_through_bank : null,
                bus_fee: bus_fee, // Adding bus fee here
                arrears_gap: arrearsInfo ? arrearsInfo.arrear_gap : 0, // New field
                // arrear_gap_from_payable: arrearsInfo ? arrearsInfo.arrear_gap - total_amount_data : 0 ,
                voucher_created_form: "Single"
              };
            } else {
              total_amount_data += arrearsInfo.total_arrears;
            }
          }

          return {
            student_id: result.id,
            category_id: result.category_id,
            campus_id: result.campus_id,
            session_id: result.session_id,
            fee_head: JSON.stringify(result.data),
            total_amount_data: (advanceInfo && advanceInfo.advance_payments > 0 && advanceInfo.advance_payments < (total_amount_data + (arrearsInfo ? arrearsInfo.total_arrears : 0))) ? total_amount_data - (advanceInfo.advance_payments || 0) : total_amount_data,
            after_due_date_amount: (advanceInfo && advanceInfo.advance_payments > 0 && advanceInfo.advance_payments < (total_amount_data + (arrearsInfo ? arrearsInfo.total_arrears : 0))) ? total_amount_data - (advanceInfo.advance_payments || 0) + 25 : total_amount_data + 25,
            for_the_month: month,
            due_date,
            remarks,
            invoice_no: invoiceNo++,
            arrears: (advanceInfo && advanceInfo.advance_payments >= (total_amount_data + (arrearsInfo ? arrearsInfo.total_arrears : 0))) ? 0 : (arrearsInfo && arrearsInfo.total_arrears ? arrearsInfo.total_arrears : 0),
            status,
            arrears_not_cleared: (advanceInfo && advanceInfo.advance_payments >= (total_amount_data + (arrearsInfo ? arrearsInfo.total_arrears : 0))) ? '[]' : JSON.stringify(arrears_not_cleared),
            bank_details: JSON.stringify(bankDetails),
            advance_payments: (advanceInfo && advanceInfo.advance_payments >= (total_amount_data + (arrearsInfo ? arrearsInfo.total_arrears : 0))) ? advanceInfo.advance_payments - (total_amount_data + (arrearsInfo ? arrearsInfo.total_arrears : 0)) : 0,
            advance_status: (advanceInfo && advanceInfo.advance_payments >= (total_amount_data + (arrearsInfo ? arrearsInfo.total_arrears : 0))) ? "Advance" : (advanceInfo && advanceInfo.advance_payments > 0 && advanceInfo.advance_payments < (total_amount_data + (arrearsInfo ? arrearsInfo.total_arrears : 0))) ? "Advance" : "Exhaust",
            payment_date: (advanceInfo && advanceInfo.advance_payments >= (total_amount_data + (arrearsInfo ? arrearsInfo.total_arrears : 0))) ? new Date().toISOString().split('T')[0] : "-",
            recieved_payment: (advanceInfo && advanceInfo.advance_payments >= (total_amount_data + (arrearsInfo ? arrearsInfo.total_arrears : 0))) ? total_amount_data + (arrearsInfo ? arrearsInfo.total_arrears : 0) : 0,
            scroll_no: (advanceInfo && advanceInfo.advance_payments >= (total_amount_data + (arrearsInfo ? arrearsInfo.total_arrears : 0))) ? advanceInfo.scroll_no : null,
            payment_received_through_bank: (advanceInfo && advanceInfo.advance_payments >= (total_amount_data + (arrearsInfo ? arrearsInfo.total_arrears : 0))) ? advanceInfo.payment_received_through_bank : null,
            bus_fee: bus_fee, // Adding bus fee here
            arrears_gap: arrearsInfo ? arrearsInfo.arrear_gap : 0, // New field
            // arrear_gap_from_payable: arrearsInfo ? arrearsInfo.arrear_gap - total_amount_data : 0 ,
            voucher_created_form: "Single"
          };
        } else {
          return null;
        }
      }).filter(entry => entry !== null);
    });

    // Extracting voucher_ids that are stored in arrears_not_cleared
    const voucherIdsToUpdate = finalResults.reduce((acc, result) => {
      const arrearsIds = JSON.parse(result.arrears_not_cleared || '[]');
      return acc.concat(arrearsIds);
    }, []);

    if (voucherIdsToUpdate.length > 0) {
      const updateArrearsQuery = `
        UPDATE fee_vouchers
        SET is_arrear = 'arrears'
        WHERE id IN (?)
      `;
      await queryAsync(updateArrearsQuery, [voucherIdsToUpdate]);
    }

    if (finalResults.length === 0) {
      return res.status(200).json({
        message: 'No new fee vouchers to insert',
        arrear_not_cleared: finalResults.map(result => result.arrears_not_cleared)
      });
    }

    const insertQuery = `
      INSERT INTO fee_vouchers
      (student_id, category_id, campus_id, session_id, fee_head, total_amount_data, after_due_date_amount, for_the_month, due_date, remarks, invoice_no, arrears, status, arrears_not_cleared, bank_details, advance_payments, advance_status, payment_date, recieved_payment, scroll_no, payment_received_through_bank, bus_fee, arrears_gap, voucher_created_form)
      VALUES ?
    `;

    const values = finalResults.map(result => [
      result.student_id,
      result.category_id,
      result.campus_id,
      result.session_id,
      result.fee_head,
      result.total_amount_data,
      result.after_due_date_amount,
      result.for_the_month,
      result.due_date,
      result.remarks,
      result.invoice_no,
      result.arrears,
      result.status,
      result.arrears_not_cleared,
      result.bank_details,
      result.advance_payments,
      result.advance_status,
      result.payment_date,
      result.recieved_payment,
      result.scroll_no,
      result.payment_received_through_bank,
      result.bus_fee,
      result.arrears_gap, // New field
      // result.arrear_gap_from_payable,
      result.voucher_created_form
    ]);

    const insertResult = await queryAsync(insertQuery, [values]);

    // Check and update student status for arrears > 3 months
    const studentsToUpdate = finalResults.filter(result => {
      const arrearsDuration = JSON.parse(result.arrears_not_cleared).length;
      return arrearsDuration > 1;
    }).map(result => result.student_id);

    if (studentsToUpdate.length > 0) {
      const updateStudentStatusQuery = `
        UPDATE students
        SET status_for_pendings = 'Off'
        WHERE id IN (?)
      `;
      await queryAsync(updateStudentStatusQuery, [studentsToUpdate]);
    }

    res.status(200).json({
      message: 'Fee voucher inserted successfully',
      insertResult,
      arrear_not_cleared: finalResults.map(result => result.arrears_not_cleared)
    });
  } catch (err) {
    console.error('Error processing fee voucher:', err);
    res.status(500).json({ error: 'Error processing fee voucher' });
  }
}



