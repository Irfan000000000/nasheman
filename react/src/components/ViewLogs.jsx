import React, { useEffect, useState, useContext } from 'react'
import axios from 'axios'
import ReactPaginate from 'react-paginate';
import { useAuth } from './AuthContext';
import AcademicSessionContext from './AcademicSessionContext';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function ViewLogs() {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalCount, setTotalCount] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const { user } = useAuth();
    const { academicSession } = useContext(AcademicSessionContext);
    
    const [searchParams, setSearchParams] = useState({
        search: '',
    });
    const [totalItem, setTotalItem] = useState(10);

    const fetchData = () => {
        setLoading(true);
        axios.get(process.env.REACT_APP_API_BASE_URL+"/logs-list", {
            params: {
                page: currentPage,
                limit: totalItem,
                search: searchParams.search,
                campus_id: user?.user?.campus_id,
                session_id: academicSession,
            }
        })
        .then(res => {
            setData(res.data.results);
            setTotalCount(res.data.total);
            setTotalPages(res.data.totalPages);
            setLoading(false);
        })
        .catch(err => {
            console.log(err);
            setLoading(false);
        });
    };

    useEffect(() => {
        if (user?.user?.campus_id && academicSession) {
            fetchData();
        }
    }, [currentPage, totalItem, user, academicSession]);

    const handlePageChange = ({ selected }) => {
        setCurrentPage(selected + 1);
    };

    const handleTotalItemChange = (event) => {
        setTotalItem(event.target.value);
    }

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            fetchData();
        }
    };

    const handleSearch = () => {
        setCurrentPage(1); // Reset to first page when searching
        fetchData();
    };

    const formatDateTime = (timestamp) => {
        if (!timestamp) return '-';
        const date = new Date(timestamp);
        return {
            date: date.toLocaleDateString(),
            time: date.toLocaleTimeString()
        };
    };

    return (
        <div className="d-flex">
            <div className='col-md-12 p-2'>
                <div className="card-header text-warning bg-primary p-2">
                    <div className="d-flex justify-content-between align-items-center">
                        <div>
                            <i className="fas fa-list"></i> Logs Detail
                        </div>
                        <div className="d-flex">
                            <div className="me-2 mr-2">
                                <input 
                                    type="text" 
                                    className="form-control" 
                                    placeholder="Search logs..."
                                    value={searchParams.search}
                                    onKeyDown={handleKeyDown}
                                    onChange={(e) => setSearchParams({...searchParams, search: e.target.value})} 
                                />
                            </div>
                            <button className="btn btn-sm btn-danger" onClick={handleSearch}>
                                Search
                            </button>
                        </div>
                    </div>
                </div>

                <div className='border p-2'>
                    <div className='pb-3 d-flex justify-content-between align-items-center'>
                        <div>
                            <span className="me-2">Items per page:</span>
                            <select 
                                value={totalItem} 
                                onChange={handleTotalItemChange}
                                className="form-select form-select-sm d-inline-block w-auto"
                            >
                                <option value="5">5</option>
                                <option value="10">10</option>
                                <option value="20">20</option>
                                <option value="30">30</option>
                                <option value="50">50</option>
                            </select>
                        </div>
                        <div>
                            Total Records: {totalCount}
                        </div>
                    </div>

                    <div className="table-responsive">
                        <table className='table table-striped table-hover'>
                            <thead className="table-primary">
                                <tr>
                                    <th>#</th>
                                    <th>Action</th>
                                    <th>Table</th>
                                    <th>Remarks</th>
                                    {/* <th>Descrip.</th> */}
                                    <th>User</th>
                                    <th>Time</th>
                                    <th>Date</th>
                                </tr>
                            </thead>
                            <tbody>
                                {loading ? (
                                    <tr>
                                        <td colSpan="8" className="text-center">
                                            Loading...
                                        </td>
                                    </tr>
                                ) : data.length === 0 ? (
                                    <tr>
                                        <td colSpan="8" className="text-center">No logs found</td>
                                    </tr>
                                ) : (
                                    data.map((log, index) => {
                                        const { date, time } = formatDateTime(log.timestamp);
                                        return (
                                            <tr key={log.id}>
                                                <td>{(currentPage - 1) * totalItem + index + 1}</td>
                                                <td>
                                                    <span className={`btn btn-sm text-white ${
                                                        log.action === 'CREATE' ? 'bg-success' :
                                                        log.action === 'UPDATE' ? 'bg-primary' :
                                                        log.action === 'DELETE' ? 'bg-danger' :
                                                        log.action === 'POSTING' ? 'bg-info' :
                                                        log.action === 'UNPOST' ? 'bg-warning' : 'bg-secondary'
                                                    }`}>
                                                        {log.action}
                                                    </span>
                                                </td>
                                                <td>{log.table_name}</td>
                                                <td>{log.remarks}</td>
                                                {/* <td>{log.description}</td> */}
                                                <td>{log.username || 'System'}</td>
                                                {/* <td>{log.campus_name}</td> */}
                                                <td>{time}</td>
                                                <td>{date}</td>
                                            </tr>
                                        );
                                    })
                                )}
                            </tbody>
                        </table>
                    </div>

                    {totalPages > 1 && (
                        <ReactPaginate
                            previousLabel={'Previous'}
                            nextLabel={'Next'}
                            breakLabel={'...'}
                            pageCount={totalPages}
                            marginPagesDisplayed={2}
                            pageRangeDisplayed={3}
                            onPageChange={handlePageChange}
                            containerClassName={'pagination justify-content-center'}
                            pageClassName={'page-item'}
                            activeClassName={'active'}
                            pageLinkClassName={'page-link'}
                            previousClassName={'page-item'}
                            previousLinkClassName={'page-link'}
                            nextClassName={'page-item'}
                            nextLinkClassName={'page-link'}
                            breakClassName={'page-item'}
                            breakLinkClassName={'page-link'}
                            forcePage={currentPage - 1}
                        />
                    )}
                </div>
            </div>
        </div>
    );
}

export default ViewLogs;