


import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Select from 'react-select';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ReactPaginate from 'react-paginate';

const Invoice = () => {
  const notify = () => {
    toast.success("Your Invoice Saved!");
  };
  const [formData, setFormData] = useState({
    item: '',
    price: '',
    quantity: '',
    discount: '',
    rate_after_discount: '',
    total: '',
    stock: '',
    stock_remain: '',
    item_name: '',
    hidden_id: '',
    invoice_no: '',
  });



  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, totalPagesGet] = useState("");
  const [getCategories, setCategories] = useState([]);

  const [totalItem, setTotalItemGet] = useState(5);

  const [searchInvoice, setSearchInvoice] = useState("");

  const [tableData, setTableData] = useState([]);
  const [editIndex, setEditIndex] = useState(null);
  const [invoiceList, setIvoiceList] = useState([]);

  const [getItems, setItems] = useState([]);


  const [invoiceTable, updateInvoiceTable] = useState([]);


  const [isVisible, setIsVisible] = useState(false);

  const [invoiceData, showInvoiceData] = useState([]);


  const [report, getAllReports] = useState({
    from_date: '',
    to_date: '',
    report_type: ''
  });

  // const handleToggleVisibility = () => {

  // };




  function excelReport() {
    axios.get(process.env.REACT_APP_API_BASE_URL+"/excel-report", {
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




  function getReport() {
    if (report.report_type == "pdf") {
      pdfReport();
    } else if (report.report_type == "excel") {
      excelReport();
    }
  }




  function pdfReport() {


    axios.get(process.env.REACT_APP_API_BASE_URL+"/pdf-report", {
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


  const dataDivStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    backgroundColor: 'white',
    padding: '20px',
    borderRadius: '8px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    zIndex: 1000, // Ensure it's above other content
  };

  const tableProperties = {
    border: '1px solid black',
    padding: '3px',
    borderCollapse: 'collapse',
  }

  const [editFormData, setEditFormData] = useState({
    category: '',
    item_name: '',
    total_pieces: '',
    price: '',
    discount: '',
    total_price: '',
    alert: '0',
    expire: '',
    hidden_id: ''
  });



  const handleTotalItemChange = (event) => {
    const newValue = event.target.value;

    if (event.target.id == "search-invoice") {

      if (event.key == "Enter") {
        setSearchInvoice(newValue);
        console.log("Search started with: ", newValue);
      }


    } else {
      setTotalItemGet(newValue);
    }
  }




  const fetchData = () => {


    axios.get(process.env.REACT_APP_API_BASE_URL+"/get-invoice-list", {
      params: {
        page: currentPage,
        limit: totalItem,
        getSearch: searchInvoice
      }
    })
      .then(res => {
        setIvoiceList(res.data.results);
        setTotalCount(0);
        totalPagesGet(res.data.totalPages);
        setLoading(false);
      })
      .catch(err => console.log(err));



  };


  // const itemsPerPage = 10;
  useEffect(() => {
    fetchData();
  }, [currentPage, totalItem, searchInvoice, invoiceTable]);



  useEffect(() => {
    // const fetchItems = () => {
    axios.get(process.env.REACT_APP_API_BASE_URL+"/get-invoice-list")
      .then(res => {
        setIvoiceList(res.data.results);
      })
      .catch(err => console.log(err));
    // };

    // fetchItems();
  }, []);




  useEffect(() => {
    const fetchItems = () => {
      axios.get(process.env.REACT_APP_API_BASE_URL+"/items")
        .then(res => {
          setItems(res.data.results);

        })
        .catch(err => console.log(err));
    };

    fetchItems();
  }, []);




  const handlePageChange = ({ selected }) => {
    setCurrentPage(selected + 1);
  };


  const editInvoice = (invoice_no_get) => {
    axios.get(process.env.REACT_APP_API_BASE_URL+`/get-invoice-no/${invoice_no_get}`)
      .then(response => {
        const invoiceData = response.data.results; // Original data from the API

        console.log(invoiceData);
        // Transforming each item in the array
        const transformedData = invoiceData.map(item => {
          return {
            // Assuming you want to keep some original properties
            item: item.item,
            hidden_id: item.id,
            item_name: item.item_name, // Rename property
            price: parseFloat(item.price).toFixed(2), // Format and keep original
            quantity: item.quantity, // Keep original
            discount: item.discount, // Keep original
            rate_after_discount: item.price - (item.price / 100 * item.discount), // Calculate new property
            total: (item.price - (item.price / 100 * item.discount)) * item.quantity,
            stock: item.stock,
            stock_remain: item.stock_remain,
            invoice_no: item.invoice_no
          };
        });




        // {tableData.map((data, index) => (
        //   <tr key={index}>
        //     <td style={{ display: 'none' }} >{data.item}</td>
        //     <td style={{ display: 'none' }} >{data.hidden_id}</td>
        //     <td className=''>{data.item_name}</td>
        //     <td className='text-center'>{data.price}</td>
        //     <td className='text-center'>{data.quantity}</td>
        //     <td className='text-center'>{data.discount}</td>
        //     <td className='text-center'>{data.rate_after_discount}</td>
        //     <td className='text-center'>{data.total}</td>
        //     <td className='text-center'>
        //       <button className='btn btn-sm btn-warning mr-2' onClick={() => handleEdit(index)}><i className="fas fa-edit"></i></button>
        //       <button className='btn btn-sm btn-danger' onClick={() => handleDelete(index)}><i className="fas fa-trash-alt"></i></button>
        //     </td>
        //   </tr>
        // ))}



        setTableData(transformedData); // Set transformed data to state
      })
      .catch(error => {
        console.error('Error:', error);
      });



    // const invoice_no = invoice_no_get;
    // axios.get(process.env.REACT_APP_API_BASE_URL+`/get-invoice-no/${invoice_no}`)
    //   .then(response => {

    //     const invoiceData  = response.data.results;
    //     setTableData(invoiceData);


    //   })
    //   .catch(error => {
    //     console.error('Error:', error);
    //   });

  }

  const deleteInvoice = (invoice_no) => {


    axios.delete(process.env.REACT_APP_API_BASE_URL+`/delete-invoice/${invoice_no}`)
      .then(response => {
        console.log('Item deleted successfully:', response.data);
        fetchData();
      })
      .catch(error => {
        console.error('Error deleting item:', error);
      });


  }


  const ViewInvoice = (invoice_no) => {


    axios.get(process.env.REACT_APP_API_BASE_URL+`/view-invoice/${invoice_no}`)
      .then(response => {
        console.log(response.data.results);
        setIsVisible(true);
        showInvoiceData(response.data.results);

      })
      .catch(error => {
        console.error('Error deleting item:', error);
      });


  }




  const handleInputChange = (event) => {
    const { name, value } = event.target;
    if (name === 'item') {
      const selectedItem = getItems.find(item => item.id === parseInt(value));
      const itemName = selectedItem ? selectedItem.items : '';
      setFormData({
        ...formData,
        [name]: value,
        item_name: itemName,
      });
      getItemRate(value);
    } else {
      const updatedFormData = {
        ...formData,
        [name]: value,
      };
      if (name === 'rate' || name === 'quantity' || name === 'discount') {
        const price = parseFloat(updatedFormData.price);
        const quantity = parseFloat(updatedFormData.quantity);
        const discount = parseFloat(updatedFormData.discount);
        const stock_get = parseFloat(updatedFormData.stock);

        // Calculate total
        let total = price * quantity;

        // Apply discount if provided
        if (!isNaN(discount)) {
          var discount_get = (price * quantity) / 100 * discount;
          var final_amount = (price * quantity) - discount_get;
          total = final_amount;
        }
        // Set total in formData
        updatedFormData.total = total.toFixed(2);
        if (!isNaN(stock_get) && !isNaN(quantity)) {
          updatedFormData.stock_remain = stock_get - quantity;
        }

      }
      setFormData(updatedFormData);
    }
  };

  const getItemRate = (itemId) => {

    axios.get(process.env.REACT_APP_API_BASE_URL+`/get-item-details/${itemId}`)
      .then(response => {
        console.log(response.data.results);
        var item_rate = response.data.results[0]["price"];
        var discount_rate = response.data.results[0]["discount"];
        var stock_quantity = response.data.results[0]["total_stock_quantity"];
        var total_sale = response.data.results[0]["total_invoice_quantity"];
        var difference = stock_quantity - total_sale
        setFormData(prevState => ({
          ...prevState,
          price: item_rate,
          discount: discount_rate,
          rate_after_discount: item_rate - (item_rate / 100 * discount_rate),
          stock: difference
        }));
      })
      .catch(error => {
        console.error('Error:', error);
      });
  }


  const handleSubmit = (event) => {
    event.preventDefault();

    // Ensure editIndex is not null and within the bounds of tableData
    if (editIndex !== null && editIndex >= 0 && editIndex < tableData.length) {
      // Use functional updates to ensure we are working with the latest state
      setTableData(currentTableData => {
        const updatedTableData = [...currentTableData];
        // Update the item at editIndex with formData
        updatedTableData[editIndex] = { ...formData }; // Ensure we're copying formData to avoid direct state mutation

        return updatedTableData;
      });

      // Reset editIndex and form data after update
      setEditIndex(null);
      resetFormData();
    } else {
      // Handle adding a new item case or invalid editIndex
      // Your existing logic for adding new items
      setTableData(currentTableData => [formData, ...currentTableData]);
      resetFormData();
    }
  };





  const resetFormData = () => {
    setFormData({
      item: '',
      price: '',
      quantity: '',
      discount: '',
      rate_after_discount: '',
      total: '',
      stock_remain: '',
      stock: '',
      item_name: '',
      hidden_id: '',
      invoice_no: ''
    });
  };

  const handleEdit = (index) => {
    setFormData(tableData[index]);
    setEditIndex(index);
  };

  const handleDelete = (index) => {
    const updatedTableData = [...tableData];
    updatedTableData.splice(index, 1);
    setTableData(updatedTableData);
  };

  const handleSaveAllData = async () => {

    try {
      const response = await fetch(process.env.REACT_APP_API_BASE_URL+'/insert-invoice', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(tableData)
      });

      console.log(response.Invoice);

      if (!response.ok) {
        throw new Error('Failed to insert data');
      }


      const data = await response.json();

      resetFormData();
      setTableData([]);
      updateInvoiceTable([]);
      notify();
    } catch (error) {
      console.error('Error sending data:', error);
      // Handle error, show error message to the user, etc.
    }



  };







  // Calculate totals before the return statement in your component
  const totals = tableData.reduce(
    (acc, item) => {
      acc.totalQuantity += parseFloat(item.quantity) || 0;
      acc.totalAmount += parseFloat(item.total) || 0;
      return acc;
    },
    { totalQuantity: 0, totalAmount: 0 }
  );


  const calculateDiscount = (get_discount) => {
    const get_created_discount = get_discount.target.value;
    const rate_get = formData.price;
    setFormData(prevState => ({
      ...prevState,
      rate_after_discount: rate_get - (rate_get / 100 * get_created_discount)
    }));


  }




  return (
    <div className="d-flex">


      <div>
        {/* <button onClick={handleToggleVisibility} style={{margin: '20px'}}>
        {isVisible ? 'Close' : 'View'}
      </button> */}

        {isVisible && (
          <div style={dataDivStyle}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>  <h5>Invoice</h5> <a href="#" onClick={() => setIsVisible(false)} ><i className='fa fa-window-close'></i></a></div>

            <table className='tableStyle'>
              <thead>
                <tr>
                  <th>Item</th>
                  <th>Price</th>
                  <th>Quantity</th>
                  <th>Discount</th>
                  <th>After_Discount</th>
                  <th>Total</th>
                  {/* <th>Created_At</th> */}
                </tr>
              </thead>
              <tbody>
                {invoiceData.map((item) => (
                  <tr>
                    <td> {item.item_name} </td>
                    <td> {item.price} </td>
                    <td> {item.quantity} </td>
                    <td> {item.discount} </td>
                    <td style={{ color: 'green' }}>  {item.price - (item.price / 100 * item.discount)} </td>
                    <td> {item.total} </td>
                    {/* <td> {item.created_at} </td> */}
                  </tr>
                ))}
                <tr>
                  <td colSpan="5" className='text-right'><b>Grand Total (Rs.):</b></td>
                  {/* Calculate and display the overall total */}
                  <td className='text-left'>
                    {invoiceData.reduce((acc, item) => acc + parseFloat(item.total), 0)}
                  </td>
                </tr>
              </tbody>
            </table >


          </div>
        )}
      </div>


      <div className='col-md-6 p-2'>
        <div className='border'>
          <h5 className='text-warning bg-primary p-2 card-header'> <i className='fas fa-shopping-cart'></i> Invoice Form</h5>
          <form className='p-3' onSubmit={handleSubmit}  >
            <div className="form-group row">
              <label htmlFor="item" className="col-sm-2 col-form-label">Item</label>
              <div className="col-sm-10">
                <Select
                  id="item"
                  name="item"
                  // value={formData.item ? { value: formData.item, label: formData.item_name } : null}
                  value={formData.item ? { value: formData.item, label: formData.item_name } : null}

                  options={getItems.map(item => ({ value: item.id, label: item.items+" ("+item.category_name+")" }))}
                  onChange={selectedOption => {
                    setFormData({
                      ...formData,
                      item: selectedOption.value,
                      item_name: selectedOption.label
                    });

                    getItemRate(selectedOption.value);
                  }}
                  placeholder="Select item"
                />

              </div>
            </div>




            <div className="form-group row">
              <label htmlFor="rate" className="col-sm-2 col-form-label">Price</label>
              <div className="col-sm-4">
                <input readOnly
                  type="text"
                  id="price"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  placeholder="Actual Price"
                  className='form-control'
                />
              </div>


              <div className="col-sm-2">
                <input
                  type="text"
                  id="discount"
                  name="discount"
                  value={formData.discount}
                  onChange={handleInputChange}
                  onKeyUp={calculateDiscount}
                  placeholder="Discount"
                  className='form-control'
                />
              </div>



              <div className="col-sm-4">
                <input readOnly
                  type="text"
                  id="rate_after_discount"
                  name="rate_after_discount"
                  value={formData.rate_after_discount}
                  onChange={handleInputChange}
                  placeholder="Rate After Discount"
                  className='form-control'
                />
              </div>
            </div>

            <div className="form-group row">
              <label htmlFor="quantity" className="col-sm-2 col-form-label">Quantity</label>
              <div className="col-sm-4">
                <input
                  type="text"
                  id="quantity"
                  name="quantity"
                  value={formData.quantity}
                  onChange={handleInputChange}
                  placeholder="Quantity"
                  className='form-control'
                />
              </div>


              <div className="col-sm-2">
                <input readOnly
                  type="text"
                  id="stock"
                  name="stock"
                  value={formData.stock}
                  onChange={handleInputChange}
                  placeholder="Stock....."
                  className='form-control' />
              </div>


              <div className="col-sm-4">
                <input readOnly
                  type="text"
                  id="remaining"
                  name="remaining"
                  value={formData.stock_remain}
                  onChange={handleInputChange}
                  placeholder="Remaining Stock......."
                  className='form-control'
                />
              </div>
            </div>

            <div className="form-group row">
              <label htmlFor="total" className="col-sm-2 col-form-label">Total</label>
              <div className="col-sm-10">
                <input
                  type="text"
                  id="total"
                  name="total"
                  value={formData.total}
                  readOnly
                  placeholder="Total"
                  className='form-control'
                />
              </div>
            </div>

            <div className="form-group row">
              <label className="col-sm-2 col-form-label"></label>
              <div className="col-sm-10 d-flex justify-content-end">
                <button type="submit" className='btn btn-sm btn-primary'> <i className="fas fa-credit-card"></i> {editIndex !== null ? 'Update' : 'Add Item'}</button>
              </div>
            </div>

            <input
              type="hidden"
              name="invoice_no"
              value={formData.invoice_no}
              className='form-control'
            />
          </form>
        </div>

        <div className='fixed_div'>
          <div>
            <div className="card-header text-warning bg-primary p-2">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <i className="fas fa-list"></i> Invoice List
                </div>

                <div className="d-flex">
                  <div className="me-2 mr-2">
                    <input type="date" className="form-control" id="from_date" onChange={(e) => getAllReports({ ...report, from_date: e.target.value })} />
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


            <div className='border p-2'>
              <div className='pb-3 d-flex justify-content-between'>
                <div>
                  <select value={totalItem} onChange={handleTotalItemChange}>
                    <option value="10">10</option>
                    <option value="20">20</option>
                    <option value="30">30</option>
                    <option value="40">40</option>
                    <option value="50">50</option>
                  </select>
                </div>





                <div>
                  <input type="text" placeholder='Search Invoice' className='form-control' id='search-invoice' onKeyUp={handleTotalItemChange} />
                </div>


              </div>


              <table className='table'>
                <thead>
                  <tr>
                    <th className='text-center' >Invoice#</th>
                    <th className='text-center' >Quantity</th>
                    <th className='text-center' >Total</th>
                    <th className='text-center'>View</th>
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
                    invoiceList.map((invoice_data, index) => (
                      <tr key={index}>
                        <td className='text-center'>{invoice_data.invoice_no}</td>
                        <td className='text-center'>{invoice_data.total_quantity}</td>
                        <td className='text-center'>{invoice_data.total_amount}</td>

                        <td className='text-center'>
                          <div><button href="#" className='btn btn-warning btn-sm' onClick={() => ViewInvoice(invoice_data.invoice_no)}><i className="fas fa-eye"></i>

                            {/* {isVisible ? 'Close' : 'View'} */}

                          </button></div>
                        </td>

                        <td className='text-center'>
                          <div><a href="#" className='btn btn-success btn-sm' onClick={() => editInvoice(invoice_data.invoice_no)} ><i className="fas fa-edit"></i></a></div>
                        </td>
                        <td className='text-center'>
                          <div><a href="#" className='btn btn-danger btn-sm' onClick={() => deleteInvoice(invoice_data.invoice_no)}><i className="fas fa-trash-alt"></i></a></div>
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

      </div>

      <div className='col-md-6 p-2'>

        <div className='table-responsive'>


          <div>
            <h5 className='text-warning bg-primary p-2 card-header'>
              <div className='row'>
                <div className="col">
                  <i className="fas fa-receipt"></i>  Invoice
                </div>
                <div className="col d-flex justify-content-end mr-1">
                  <button className='btn btn-sm btn-warning' onClick={handleSaveAllData}>  <i className="fas fa-print"></i> Save Invoice</button>
                </div>

              </div>
            </h5>
          </div>


          <table className='table table-striped'>
            <thead>
              <tr>
                <td colSpan={7}>
                  <div className="row d-flex justify-content-center">
                    <div className="col-3">
                      <label htmlFor="" className='text-center d-block'> <li className='fas fa-weight-hanging'></li> Total Quantity</label>
                      <input type="text" className='form-control text-center bg-primary text-white' value={totals.totalQuantity.toFixed(2)} disabled placeholder='Total Quantity' id='total_amount' />
                    </div>
                    <div className="col-3">
                      <label htmlFor="" className='text-center d-block '>
                        <li className='fas fa-calculator'></li> Total Amount
                      </label>
                      <input type="text" className='form-control text-center bg-primary text-white' value={totals.totalAmount.toFixed(2)} disabled placeholder='Total Amount' id='total_amount' />
                    </div>
                  </div>
                </td>

              </tr>
              <tr>
                <th>Item</th>
                <th className='text-center'>Rate</th>
                <th className='text-center'>Quantity</th>
                <th className='text-center'>Disc(%)</th>
                <th className='text-center'>After_Disc</th>
                <th className='text-center'>Total</th>
                <th colSpan={2} className='text-center'>  </th>
              </tr>
            </thead>
            <tbody>

              {tableData.map((data, index) => (
                <tr key={index}>
                  <td style={{ display: 'none' }} >{data.item}</td>
                  <td style={{ display: 'none' }} >{data.hidden_id}</td>
                  <td className=''>{data.item_name}</td>
                  <td className='text-center'>{data.price}</td>
                  <td className='text-center'>{data.quantity}</td>
                  <td className='text-center'>{data.discount}</td>
                  <td className='text-center'>{data.rate_after_discount}</td>
                  <td className='text-center'>{data.total}</td>
                  <td className='text-center'>
                    <button className='btn btn-sm btn-warning mr-2' onClick={() => handleEdit(index)}><i className="fas fa-edit"></i></button>
                    <button className='btn btn-sm btn-danger' onClick={() => handleDelete(index)}><i className="fas fa-trash-alt"></i></button>
                  </td>
                </tr>
              ))}



              {/* <tr>
                <td colSpan={5}></td><td className='text-center'> <button className='btn btn-sm btn-warning' onClick={handleSaveAllData}>  <i className="fas fa-print"></i> Save Invoice</button> </td>
              </tr> */}
            </tbody>
          </table>


        </div>


      </div>


    </div>
  );
};

export default Invoice;


