import React, { useEffect, useState } from 'react'
import axios from 'axios'
import ReactPaginate from 'react-paginate';
import Select from 'react-select';

function Expense() {

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, totalPagesGet] = useState("");
  const [getExpenseHead, setExpenseHead] = useState([]);


  const [report, getAllReports] = useState({
    from_date: '',
    to_date: '',
    report_type : ''
  });


  useEffect(() => {
    const fetchExpenseHead = () => {
      axios.get(process.env.REACT_APP_API_BASE_URL+"/expense-head-list")
        .then(res => {
          setExpenseHead(res.data.results);
        })
        .catch(err => console.log(err));
    };
    fetchExpenseHead();
  }, []); // Empty dependency array ensures this effect runs only once, on mount


  const [editFormData, setEditFormData] = useState({
    head_id: '',
    amount: '',
    remarks: '',
    payment_type: '',
    hidden_id: ''
  });

  //const [itemsPerPage, setitemsPerPage] = useState(10); 

  const [totalItem, setTotalItemGet] = useState(10);

  // const itemsPerPage = 10;

  useEffect(() => {
    fetchData();
  }, [currentPage, totalItem]);



  const fetchData = () => {
    axios.get(process.env.REACT_APP_API_BASE_URL+"/expenses-list", {
      params: {
        page: currentPage,
        limit: totalItem
      }
    })
      .then(res => {
        setData(res.data.results);
        setTotalCount(0);
        totalPagesGet(res.data.totalPages);
        setLoading(false);
      })
      .catch(err => console.log(err));
  };

  const handlePageChange = ({ selected }) => {
    setCurrentPage(selected + 1);
  };

  const handleTotalItemChange = (event) => {

    const newValue = event.target.value;
    setTotalItemGet(newValue);

  }


  const calculate = (event) => {
    let total_pieces = editFormData.total_pieces;
    let price = editFormData.price;
    let discount = editFormData.discount;
    var calculate_discount = (total_pieces * price) / 100 * discount;

    setEditFormData({ ...editFormData, total_price: (total_pieces * price) - calculate_discount })
  }


  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editFormData.hidden_id !== "") {

      const itemId = editFormData.hidden_id; // Assuming you have an id field for the item to be updated

      axios.put(process.env.REACT_APP_API_BASE_URL+`/expense/${itemId}`, editFormData)
        .then(response => {
          console.log('Data updated successfully:', response.data);

          setEditFormData({
            head_id: '',
            amount: '',
            remarks: '',
            payment_type: '',
            hidden_id: ''
          });

          fetchData();

          // You can perform additional actions after successful update
        })
        .catch(error => {
          console.error('Error updating data:', error);
        });


    } else {

      try {
        const response = await fetch(process.env.REACT_APP_API_BASE_URL+'/insert-expense', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(editFormData)
        });
        const data = await response.json();
      
        setEditFormData({
          head_id: '',
          amount: '',
          remarks: '',
          payment_type: '',
          hidden_id: ''
        });

        // console.log(formData);

        fetchData();
      } catch (error) {
        console.error('Error:', error);
      }
    }

  };


  const editItem = (expense_id) => {
    const expenseId = expense_id;
    axios.get(process.env.REACT_APP_API_BASE_URL+`/expense-get/${expenseId}`)
      .then(response => {
        const { id, head_id, amount, remarks, payment_type } = response.data.results[0];
      
        setEditFormData({
          head_id: parseInt(head_id) || '', 
          amount: amount || '', 
          remarks: remarks || '',
          payment_type: payment_type || '',
          hidden_id: id || ''
        });
      })
      .catch(error => {
        console.error('Error:', error);
      });
  }

  const deleteItem = (expense_id) => {


    axios.delete(process.env.REACT_APP_API_BASE_URL+`/delete-expense/${expense_id}`)
      .then(response => {
        console.log('Item deleted successfully:', response.data);
        fetchData();
      })
      .catch(error => {
        console.error('Error deleting item:', error);
      });


  }



  function getReport() {
    if(report.report_type == "pdf"){
      pdfReport();
    }else if(report.report_type == "excel"){
      excelReport();
    }
  }



  

function pdfReport(){
  

  axios.get(process.env.REACT_APP_API_BASE_URL+"/pdf-report-expense", {
    params: {
      from_date: report.from_date,
      to_date: report.to_date,
      report_type: "sale-pdf"
    },
    responseType: 'blob'  // Important to handle the PDF binary data correctly
  })
  .then(res => {
    // Create a URL for the blob object
    const url = window.URL.createObjectURL(new Blob([res.data], { type: 'application/pdf' }));
    
    // Create a link to download the file
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `report-${report.from_date}-to-${report.to_date}.pdf`); // Optionally you can set the file name dynamically
    
    // Append the link to the body, click it, and then remove it
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // Free up the created URL
    window.URL.revokeObjectURL(url);
  })
  .catch(err => console.log(err));


}
  





  
function excelReport() {
  axios.get(process.env.REACT_APP_API_BASE_URL+"/excel-report-expense", {
    params: {
      from_date: report.from_date,
      to_date: report.to_date,
    },
    responseType: 'blob'  // Important to handle the Excel binary data correctly
  })
  .then(res => {
    // Create a URL for the blob object
    const url = window.URL.createObjectURL(new Blob([res.data]));
    
    // Create a link to download the file
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `report-${report.from_date}-to-${report.to_date}.xlsx`); // Set the file name with .xlsx extension
    
    // Append the link to the body, click it, and then remove it
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // Free up the created URL
    window.URL.revokeObjectURL(url);
  })
  .catch(err => console.error(err));
}





  return (
    <>
      <div className="d-flex">
        <div className='col-md-6 p-2'>
          <h5 className='text-warning bg-primary p-2 card-header border border-warning'><i className='fas fa-receipt'></i> Expense Form</h5>
          <form className='border p-3 border-warning'>
            <div className="form-group row">
              <label htmlFor="inputEmail3" className="col-sm-2 col-form-label">Head</label>
              <div className="col-sm-10">
                <Select
                  options={getExpenseHead.map(expenseHead => ({ value: expenseHead.id, label: expenseHead.head_name }))}
                  value={getExpenseHead.find(expenseHead => expenseHead.id === editFormData.head_id) ? { value: editFormData.head_id, label: getExpenseHead.find(expenseHead => expenseHead.id === editFormData.head_id).head_name } : null}
                  onChange={(selectedOption) => setEditFormData({ ...editFormData, head_id: selectedOption ? selectedOption.value : '' })}
                  placeholder="Select Category"
                />
              </div>

            </div>


            <div className="form-group row">
              <label htmlFor="inputEmail3" className="col-sm-2 col-form-label">Pay_Amount</label>
              <div className="col-sm-10">
                <input type="number" className="form-control" id="amount" name='amount' value={editFormData.amount ? editFormData.amount : ""} onChange={(e) => setEditFormData({ ...editFormData, amount: e.target.value })} />
              </div>
            </div>



            <div className="form-group row">
              <label htmlFor="inputEmail3" className="col-sm-2 col-form-label">Pay_Type</label>
              <div className="col-sm-10 ">
               <select name="payment_type" id="payment_type" className='form-control' value={editFormData.payment_type ? editFormData.payment_type : ""} onChange={(e) => setEditFormData({ ...editFormData, payment_type: e.target.value })}>
                <option value="">Select Payment Type</option>
                <option>Online</option>
                <option>Cash</option>
               </select>
              </div>
            </div>



            <div className="form-group row">
              <label htmlFor="inputEmail3" className="col-sm-2 col-form-label">Remarks</label>
              <div className="col-sm-10">
                <input type="text" className="form-control"  id="remarks" name='remarks' value={editFormData.remarks ? editFormData.remarks : ""} onChange={(e) => setEditFormData({ ...editFormData, remarks: e.target.value })} />
              </div>
            </div>


            <div className="form-group row">
              <label htmlFor="inputEmail3" className="col-sm-2 col-form-label"></label>
              <div className="col-sm-10 d-flex justify-content-end">
                <input type="submit" className='btn btn-sm btn-primary' value={"Save"} onClick={handleSubmit} />
              </div>
            </div>



          </form>
        </div>

        <div className='col-md-6 p-2' >


        <div className="card-header text-warning bg-primary p-2">
  <div className="d-flex justify-content-between align-items-center">
    <div>
      <i className="fas fa-list"></i> Expense List
    </div>

    <div className="d-flex ">
      <div className="me-2 mr-2">
        <input type="date" className="form-control" id="from_date"  onChange={(e) => getAllReports({ ...report, from_date: e.target.value })} />
      </div>

      <div className="me-2 mr-2">
        <input type="date" className="form-control" id="to_date" onChange={(e) => getAllReports({ ...report, to_date: e.target.value })} /> {/* Changed ID for accessibility and uniqueness */}
      </div>

      <div className="me-2 mr-2">
        <select name="type" id="type" className="form-control" onChange={(e) => getAllReports({ ...report, report_type: e.target.value })}>
          <option value="">Select Type</option>
          {/* <option value="view">View</option> */}
          <option value="excel">Excel</option>
          <option value="pdf">PDF</option>
        </select>
      </div>

      <button className="btn btn-sm btn-danger" onClick={getReport} >Get Report</button>
    </div>
  </div>
</div>

          <div className='border border-warning p-2'>
            <div className='pb-3'>
              <select value={totalItem} onChange={handleTotalItemChange}>
                <option value="10">10</option>
                <option value="20">20</option>
                <option value="30">30</option>
                <option value="40">40</option>
                <option value="50">50</option>
              </select>
            </div>


            <table className='table'>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Receipt#</th>
                  <th>Head</th>
                  <th>Amount</th>
                  <th>Pay_type</th>
                  <th>Remarks</th>
                  <th className='text-center'>Edit</th>
                  <th className='text-center'>Delete</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="4">Loading...</td>
                  </tr>
                ) : (
                  data.map((expenses, index) => (
                    <tr key={index}>
                      <td>{expenses.id}</td>
                      <td>{expenses.receipt_no}</td>
                      <td>{expenses.head_name}</td>
                      <td>{expenses.amount}</td>
                      <td>{expenses.payment_type}</td>
                      <td>{expenses.remarks}</td>
                      <td className='text-center'>
                        <div><a href="#" className='btn btn-success btn-sm' onClick={() => editItem(expenses.id)} ><i className="fas fa-edit"></i></a></div>
                      </td>
                      <td className='text-center'>
                        <div><a href="#" className='btn btn-danger btn-sm' onClick={() => deleteItem(expenses.id)}><i className="fas fa-trash-alt"></i></a></div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>

            <ReactPaginate
              previousLabel={'Previous'}
              nextLabel={'Next'}
              breakLabel={'...'}
              pageCount={totalPages}
              marginPagesDisplayed={2}
              pageRangeDisplayed={3}
              onPageChange={handlePageChange}
              containerClassName={'pagination'}
              pageClassName={'page-item'}
              activeClassName={'active'}
              pageLinkClassName={'page-link'}
              previousClassName={'page-item'}
              previousLinkClassName={'page-link'}
              nextClassName={'page-item'}
              nextLinkClassName={'page-link'}
              breakClassName={'page-item'}
              breakLinkClassName={'page-link'}
            />

          </div>

        </div>
      </div>

    </>
  )



}

export default Expense;