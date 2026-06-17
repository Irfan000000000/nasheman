import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { useAuth } from './AuthContext';
import AcademicSessionContext from './AcademicSessionContext';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import ReactPaginate from 'react-paginate';

function BankNotes() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0); // Added this line
  const { user } = useAuth();
  const { academicSession } = useContext(AcademicSessionContext);

  const initialState = {
    note_title: '',
    note_description: '',
    session_id: academicSession,
    campus_id: user.user.campus_id,
    user_id: user.user.user_id,
    hidden_id: ''
  };

  const [editFormData, setEditFormData] = useState(initialState);
  const [validity, setValidity] = useState({
    note_title: true,
    note_description: true,
  });

  useEffect(() => {
    if (academicSession) {
      setEditFormData(prevFormData => ({
        ...prevFormData,
        session_id: parseInt(academicSession)
      }));
    }
  }, [academicSession]);

  const validateForm = () => {
    let isValid = true;
    if (!editFormData.note_title.trim()) {
      setValidity(prevState => ({ ...prevState, note_title: false }));
      isValid = false;
    }
    if (!editFormData.note_description.trim()) {
      setValidity(prevState => ({ ...prevState, note_description: false }));
      isValid = false;
    }
    return isValid;
  };

  const handleSubmit = async e => {
    e.preventDefault();
    if (validateForm()) {
      try {
        const response = await axios.post(process.env.REACT_APP_API_BASE_URL+'/insert-bank-note', editFormData, {
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (editFormData.hidden_id !== '') {
          toast.success('Note updated successfully!');
        } else {
          toast.success('Note inserted successfully!');
        }

        setEditFormData({
          ...initialState,
          session_id: academicSession,
          campus_id: user.user.campus_id,
          user_id: user.user.user_id,
          hidden_id: ''
        });

        fetchData(); // Fetch data after form submission
      } catch (error) {
        console.error('There was an error!', error);
      }
    }
  };

  useEffect(() => {
    fetchData();
  }, [currentPage]);

  const fetchData = () => {
    axios
      .get(process.env.REACT_APP_API_BASE_URL+'/bank-notes-list', {
        params: {
          page: currentPage,
          limit: 10,
          campus_id: user.user.campus_id
        },
      })
      .then(res => {
        setData(res.data.results);
        setTotalPages(res.data.totalPages); // Update totalPages
        setLoading(false);
      })
      .catch(err => console.log(err));
  };

  const handlePageChange = ({ selected }) => {
    setCurrentPage(selected + 1);
  };

  const edit = id => {
    axios
      .get(process.env.REACT_APP_API_BASE_URL+`/bank-note-get/${id}`)
      .then(response => {
        const { id, note_title, note_description } = response.data.results[0];
        setEditFormData({
          note_title: note_title || '',
          note_description: note_description || '',
          hidden_id: id || '',
        });
      })
      .catch(error => {
        console.error('Error:', error);
      });
  };

  
  const deleteRow = (id_get, status) => {
    const confirmDelete = window.confirm('Deleted! Are you sure');

    if (confirmDelete) {
      axios
        .get(process.env.REACT_APP_API_BASE_URL+`/soft-delete-bank-notes/${id_get}/${status}`)
        .then(response => {
          console.log('Deleted successfully:', response.data);
          fetchData();
          // Update the state to remove the deleted item
        //   setData(prevData => prevData.filter(item => item.id !== id_get));
        })
        .catch(error => {
          console.error('Error deleting item:', error);
        });
    }
  };

  return (
    <>
      <div className="d-flex">
        <div className="col-md-6 p-2">
          <h5 className="text-warning bg-primary p-2 card-header border">
            <i className="fas fa-sticky-note"></i> Bank Notes Form
          </h5>
          <form className="border p-3" onSubmit={handleSubmit}>
            <div className="form-group row">
              <label htmlFor="note_title" className="col-sm-2 col-form-label">Title *</label>
              <div className="col-sm-10">
                <input
                  type="text"
                  name="note_title"
                  value={editFormData.note_title}
                  onChange={e => {
                    setEditFormData({ ...editFormData, note_title: e.target.value });
                    setValidity({ ...validity, note_title: true });
                  }}
                  className={validity.note_title ? 'form-control' : 'form-control invalid-input'}
                />
              </div>
            </div>
            <div className="form-group row">
              <label htmlFor="note_description" className="col-sm-2 col-form-label">Description *</label>
              <div className="col-sm-10">
                <ReactQuill
                  theme="snow"
                  value={editFormData.note_description}
                  onChange={value => {
                    setEditFormData({ ...editFormData, note_description: value });
                    setValidity({ ...validity, note_description: true });
                  }}
                />
              </div>
            </div>
            <div className="form-group row">
              <div className="col-sm-10 offset-sm-2 d-flex justify-content-end">
                <input type="submit" className="btn btn-sm btn-primary" value="Save" />
              </div>
            </div>
          </form>
        </div>

        <div className="col-md-6 p-2">
          <div className="card-header text-warning bg-primary p-2">
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <i className="fas fa-list"></i> Bank Notes
              </div>
            </div>
          </div>

          <div className="border p-2">
            <table className="table">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Description</th>
                  <th className="text-center">Edit</th>
                  <th className="text-center">Status</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="4">Loading...</td>
                  </tr>
                ) : (
                  data.map((note, index) => (
                    <tr key={index}>
                      <td>{note.note_title}</td>
                      <td dangerouslySetInnerHTML={{ __html: note.note_description }}></td>
                      <td className="text-center">
                        <button className="btn btn-success btn-sm" onClick={() => edit(note.id)}>
                          <i className="fas fa-edit"></i>
                        </button>
                      </td>
                      <td className='text-center'>
                        <div><a href="#" className={`btn btn-sm ${note.status == 'On' ? 'btn-success' : 'btn-danger'}`} onClick={() => deleteRow(note.id, note.status)}> <i className={`fas ${note.status == 'On' ? 'fa-toggle-on' : 'fa-toggle-off'}`}></i></a></div>
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
              pageCount={totalPages} // Ensure this is defined
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
  );
}

export default BankNotes;
