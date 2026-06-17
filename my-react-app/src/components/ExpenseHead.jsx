import React, { useEffect, useState } from 'react'
import axios from 'axios'
import ReactPaginate from 'react-paginate';


function ExpenseHead() {

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  // const [totalCount, setTotalCount] = useState(0);
  const [totalPages, totalPagesGet] = useState("");
  // const [getCategories, setCategories] = useState([]);
  const [searchHeads, setSearchHeads] = useState("");


  // useEffect(() => {
  //   const fetchCategory = () => {
  //     axios.get(process.env.REACT_APP_API_BASE_URL+"/categories")
  //       .then(res => {
  //         setCategories(res.data.results);
  //       })
  //       .catch(err => console.log(err));
  //   };

  //   fetchCategory();
  // }, []); // Empty dependency array ensures this effect runs only once, on mount


  const [editFormData, setEditFormData] = useState({
    head_name: '',
    status: '',
    hidden_id: ''
  });

  //const [itemsPerPage, setitemsPerPage] = useState(10); 

  const [totalItem, setTotalItemGet] = useState(10);

  // const itemsPerPage = 10;


  const handleTotalItemChange = (event) => {
    const newValue = event.target.value;
   
    if (event.target.id == "search-heads") {
      if (event.key == "Enter") {
        setSearchHeads(newValue);
      }
    } else {
      setTotalItemGet(newValue);
    }
}


  useEffect(() => {
    fetchData();
  }, [currentPage, totalItem, searchHeads]);


  const fetchData = () => {

    axios.get(process.env.REACT_APP_API_BASE_URL+"/expense-heads", {
      params: {
        page: currentPage,
        limit: totalItem,
        getSearch: searchHeads
      }
    }).then(res => {
        setData(res.data.results);
        // setTotalCount(0);
        totalPagesGet(res.data.totalPages);
        setLoading(false);
      })
      .catch(err => console.log(err));
  };

  const handlePageChange = ({ selected }) => {
    setCurrentPage(selected + 1);
  };



  




  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editFormData.hidden_id !== "") {

      const expense_head = editFormData.hidden_id; // Assuming you have an id field for the item to be updated

      axios.put(process.env.REACT_APP_API_BASE_URL+`/update-expense-head/${expense_head}`, editFormData)
        .then(response => {
          console.log('Data updated successfully:', response.data);

          setEditFormData({
            head_name: '',
            status : '',
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
        const response = await fetch(process.env.REACT_APP_API_BASE_URL+'/insert-expense-head', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(editFormData)
        });
        // const data = await response.json();
        // console.log("yes");
        // console.log('Data sent:', data);

        setEditFormData({
            head_name: '',
            status : '',
            hidden_id: ''
        });

        // console.log(formData);

        fetchData();
      } catch (error) {
        console.error('Error:', error);
      }
    }

  };


  const editItem = (head_id) => {
    const expense_head_id = head_id;
    axios.get(process.env.REACT_APP_API_BASE_URL+`/epxense-head/${expense_head_id}`)
      .then(response => {
        const { id, head_name, status } = response.data.results[0];
        setEditFormData({
          head_name: head_name || '', // Providing default value if response doesn't contain item_name
          status: status || '', // Providing default value if response doesn't contain rate
          hidden_id: id || ''
        });
      })
      .catch(error => {
        console.error('Error:', error);
      });
  }

  const deleteItem = (expense_head_id_for_deletion) => {
    axios.delete(process.env.REACT_APP_API_BASE_URL+`/delete-expense-head/${expense_head_id_for_deletion}`)
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
          <h5 className='text-center text-warning bg-primary p-1 card-header border border-warning'>Expense Head Form</h5>
          <form className='border p-3 border-warning'>
            

            <div className="form-group row">
              <label htmlFor="inputEmail3" className="col-sm-2 col-form-label">Head Name</label>
              <div className="col-sm-10 ">
                <input type="text" className="form-control" id="head_name" name='head_name' value={editFormData.head_name ? editFormData.head_name : ""} onChange={(e) => setEditFormData({ ...editFormData, head_name: e.target.value })} />
              </div>
            </div>

            
            <div className="form-group row">
              <label htmlFor="inputEmail3" className="col-sm-2 col-form-label">Status</label>
              <div className="col-sm-10">
                <select name="status" id="status" className='form-control' value={editFormData.status ? editFormData.status : ""} onChange={(e) => setEditFormData({ ...editFormData, status: e.target.value })}>
                    <option value="">Select Status</option>
                    <option>On</option>
                    <option>Off</option>
                </select>

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


      

          <div className='border border-warning p-2'>
            <div className='pb-3 d-flex justify-content-between'>
              <select value={totalItem} onChange={handleTotalItemChange}>
                <option value="10">10</option>
                <option value="20">20</option>
                <option value="30">30</option>
                <option value="40">40</option>
                <option value="50">50</option>
              </select>

              <div>
                  <input type="text" placeholder='Search Expense Head' className='form-control' id='search-heads' onKeyUp={handleTotalItemChange} />
                </div>

            </div>


            <table className='table'>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Head</th>
                  <th className='text-center'>Status</th>
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
                      <td>{item.head_name}</td>
                      <td className='text-center' >{item.status}</td>
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

export default ExpenseHead;