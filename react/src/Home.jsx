import React, { useContext, useEffect, useState } from 'react'
import axios from 'axios'
import ReactPaginate from 'react-paginate';
import Select from 'react-select';
import AcademicSessionContext from './components/AcademicSessionContext'; 

function Home() {

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, totalPagesGet] = useState("");
  const [getCategories, setCategories] = useState([]);
  const { academicSession } = useContext(AcademicSessionContext);




  const [report, getAllReports] = useState({
    from_date: '',
    to_date: '',
    report_type : ''
  });



  function getReport() {
    if(report.report_type == "pdf"){
      // pdfReport();
    }else if(report.report_type == "excel"){
      // excelReport();
    }
  }


  useEffect(() => {
    console.log(academicSession);
    const fetchCategory = () => {
      axios.get(process.env.REACT_APP_API_BASE_URL+"/categories")
        .then(res => {
          setCategories(res.data.results);
        })
        .catch(err => console.log(err));
    };

    fetchCategory();
  }, [academicSession]); // Empty dependency array ensures this effect runs only once, on mount


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

  //const [itemsPerPage, setitemsPerPage] = useState(10); 

  const [totalItem, setTotalItemGet] = useState(10);

  // const itemsPerPage = 10;

  useEffect(() => {
    fetchData();
  }, [currentPage, totalItem]);


  const fetchData = () => {
    axios.get(process.env.REACT_APP_API_BASE_URL+"/items", {
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


  const calculate = (event) =>{
   let total_pieces = editFormData.total_pieces;
   let price = editFormData.price;
   let discount = editFormData.discount;
   var calculate_discount = (total_pieces * price)/100 * discount;

   setEditFormData({ ...editFormData, total_price: (total_pieces * price) - calculate_discount })
  }


  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editFormData.hidden_id !== "") {

      const itemId = editFormData.hidden_id; // Assuming you have an id field for the item to be updated

      axios.put(process.env.REACT_APP_API_BASE_URL+`/update-item/${itemId}`, editFormData)
        .then(response => {
          console.log('Data updated successfully:', response.data);

          setEditFormData({
            category: '',
            item_name: '',
            price: '',
            discount: '',
            total_pieces: '',
            total_price: '',
            alert: '',
            expire: '',
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
        const response = await fetch(process.env.REACT_APP_API_BASE_URL+'/insert_all_items', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(editFormData)
        });
        const data = await response.json();
        console.log("yes");
        // console.log('Data sent:', data);

        setEditFormData({
          category: '',
          item_name: '',
          price: '',
          discount: '',
          total_pieces: '',
          total_price: '',
          alert: '',
          expire: '',
          hidden_id: '',
          category_id: '',

        });

        // console.log(formData);

        fetchData();
      } catch (error) {
        console.error('Error:', error);
      }
    }

  };


  const editItem = (item_id_get) => {
    const itemId = item_id_get;
    axios.get(process.env.REACT_APP_API_BASE_URL+`/item-get/${itemId}`)
      .then(response => {
        const { id, category, items, price, discount, total_pieces, expire, total_price, alert } = response.data.results[0];
        console.log( discount);
        setEditFormData({
          category: parseInt(category) || '', // Providing default value if response doesn't contain category
          item_name: items || '', // Providing default value if response doesn't contain item_name
          price: price || '', // Providing default value if response doesn't contain rate
          discount: (discount !== null && discount !== undefined) ? discount : '',
          total_pieces: total_pieces || '',
          total_price: total_price || '',
          alert: alert || '',
          expire: expire || '',
          hidden_id: id || ''
        });
      })
      .catch(error => {
        console.error('Error:', error);
      });
  }

  const deleteItem = (item_id) => {


    axios.delete(process.env.REACT_APP_API_BASE_URL+`/delete-item/${item_id}`)
      .then(response => {
        console.log('Item deleted successfully:', response.data);
        fetchData();
      })
      .catch(error => {
        console.error('Error deleting item:', error);
      });


  }






  return (
    <>
      <div className="d-flex">
        <div className='col-md-6 p-2'>
          <h5 className='text-warning bg-primary p-2 card-header border'> <i className='fas fa-gift'></i> Item Form</h5>
          <form className='border p-3 border'>
            <div className="form-group row">
              <label htmlFor="inputEmail3" className="col-sm-2 col-form-label">Category</label>

              <div className="col-sm-10">
                <Select
                  options={getCategories.map(category => ({ value: category.id, label: category.category }))}
                  value={editFormData.category ? { value: editFormData.category, label: getCategories.find(category => category.id === editFormData.category)?.category } : ""}
                  onChange={(selectedOption) => setEditFormData({ ...editFormData, category: selectedOption ? selectedOption.value : "" })}
                  placeholder="Select Category"
                />
              </div>

            </div>


            <div className="form-group row">
              <label htmlFor="inputEmail3" className="col-sm-2 col-form-label">Item</label>
              <div className="col-sm-10 ">
                <input type="text" className="form-control" id="item_name" name='item_name' value={editFormData.item_name ? editFormData.item_name : ""} onChange={(e) => setEditFormData({ ...editFormData, item_name: e.target.value })} />
              </div>
            </div>


            <div className="form-group row">
              <label htmlFor="inputEmail3" className="col-sm-2 col-form-label">Price</label>
              <div className="col-sm-10">
                <input type="number" className="form-control" onKeyUp={calculate} id="price" name='price' value={editFormData.price ? editFormData.price : ""} onChange={(e) => setEditFormData({ ...editFormData, price: e.target.value })} />
              </div>
            </div>


            <div className="form-group row">
              <label htmlFor="inputEmail3" className="col-sm-2 col-form-label">Discount</label>
              <div className="col-sm-10">
                <input type="number" className="form-control" onKeyUp={calculate} id="discount" name='discount' value={editFormData.discount ? editFormData.discount : ""} onChange={(e) => setEditFormData({ ...editFormData, discount: e.target.value })} />
              </div>
            </div>


            {/* <div className="form-group row">
              <label htmlFor="inputEmail3" className="col-sm-2 col-form-label">T. (PCs)</label>
              <div className="col-sm-10">
                <input type="number" className="form-control" onKeyUp={calculate} id="total_pieces" name='total_pieces' value={editFormData.total_pieces ? editFormData.total_pieces : ""} onChange={(e) => setEditFormData({ ...editFormData, total_pieces: e.target.value })} />
              </div> */}
              {/* <div className="col-sm-4 d-none">
              <Select options={options} />
              </div> */}
            {/* </div> */}
{/* 
            <div className="form-group row">
              <label htmlFor="inputEmail3" className="col-sm-2 col-form-label">T. Price</label>
              <div className="col-sm-10">
                <input type="number" className="form-control" id="total_price" name='total_price' value={editFormData.total_price ? editFormData.total_price : ""} onChange={(e) => setEditFormData({ ...editFormData, total_price: e.target.value })} />
              </div>
            </div> */}


            
            {/* <div className="form-group row">
              <label htmlFor="inputEmail3" className="col-sm-2 col-form-label">Alert</label>
              <div className="col-sm-10">
                <input type="number" className="form-control" id="alert" name='alert' value={editFormData.alert ? editFormData.alert : ""} onChange={(e) => setEditFormData({ ...editFormData, alert: e.target.value })} />
              </div>
            </div> */}


            {/* <div className="form-group row">
              <label htmlFor="inputEmail3" className="col-sm-2 col-form-label">Expire</label>
              <div className="col-sm-10">
                <input type="date" className="form-control" id="expire" name='expire' value={editFormData.expire ? editFormData.expire : ""} onChange={(e) => setEditFormData({ ...editFormData, expire: e.target.value })} />
              </div>
            </div> */}

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
      <i className="fas fa-list"></i> Item List
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

          <div className='border p-2'>
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
                  <th>Item</th>
                  <th>Category</th>
                  <th className='text-center'>Price</th>
                  <th className='text-center'>Disc(%)</th>
                  {/* <th className='text-center'>T. PCs</th>
                  <th className='text-center'>Total</th> */}
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
                  data.map((item, index) => (
                    <tr key={index}>
                      <td>{item.id}</td>
                      <td>{item.items}</td>
                      <td>{item.category_name}</td>
                      <td className='text-center' >{item.price}</td>
                      <td className='text-center' >{item.discount}</td>
                      {/* <td className='text-center' >{item.total_pieces}</td>
                      <td className='text-center' >{item.total_price}</td> */}
                      <td className='text-center'>
                        <div><a href="#" className='btn btn-success btn-sm' onClick={() => editItem(item.id)} ><i className="fas fa-edit"></i></a></div>
                      </td>
                      <td className='text-center'>
                        <div><a href="#" className='btn btn-danger btn-sm' onClick={() => deleteItem(item.id)}><i className="fas fa-trash-alt"></i></a></div>
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

export default Home