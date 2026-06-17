import React, { useEffect, useState, useContext, useRef } from 'react';
import axios from 'axios';
import { useAuth } from './AuthContext';
import AcademicSessionContext from './AcademicSessionContext';
import { useLocation } from 'react-router-dom';
import Barcode from 'react-barcode';
import { useReactToPrint } from 'react-to-print';

function ViewVoucher() {
  const { user } = useAuth();
  const { academicSession } = useContext(AcademicSessionContext);
  // const [selectedItems, setSelectedItems] = useState([]);
  const [getHeads, setHeads] = useState([]);
  const [getBankDetails, setBankDetails] = useState([]);
  const [getBankNotes, setBankNotes] = useState([]);
  const [data, setData] = useState([]);
  // const [updatedVouchersWithHeads, setUpdatedVouchersWithHead] = useState([]);
  const location = useLocation();
  const voucherIds = location.state?.voucherIds || [];
  const componentRef = useRef();

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

  useEffect(() => {}, [data]);

  // const initialState = {
  //   class_id: '',
  //   student_id: '',
  //   shift: '',
  //   from_month: '',
  //   to_month: '',
  //   due_date: '',
  //   actual_due_date : '',
  //   remarks: '',
  //   heads_with_amount: '',
  //   category_id: '',
  //   fee_group_id: '',
  //   amount: '',
  //   arrears: 0,
  //   arear_not_cleared_id: '',
  //   session_id: academicSession,
  //   campus_id: user.user.campus_id,
  //   user_id: user.user.user_id,
  //   hidden_id: '',
  //   first_advance_payment: 0 // Add initial state for first_advance_payment
  // };

  // const [editFormData, setEditFormData] = useState(initialState);

  // useEffect(() => {
  //   if (academicSession) {
  //     setEditFormData(prevFormData => ({
  //       ...prevFormData,
  //       session_id: parseInt(academicSession)
  //     }));
  //   }
  // }, [academicSession]);

  useEffect(() => {
    const fetchFeeVouchers = async (invoices, campus_id, session_id) => {
      try {
        const response = await axios.post(process.env.REACT_APP_API_BASE_URL+'/view-fee-vouchers', {
          invoices,
          campus_id,
          session_id,
        });
        
        let vouchers = response.data.vouchers;
        let heads = response.data.heads;
        let bank_details = response.data.bankDetails;
        let arrears = response.data.arrears; // Fetch arrears data
        let bank_notes = response.data.bankNotes; // Fetch bank notes data
        setData(vouchers);
        setHeads(heads);
        setBankDetails(bank_details);
        setBankNotes(bank_notes);

        // Map arrears to vouchers
        const vouchersWithArrears = vouchers.map(voucher => {
          const arrear = arrears.find(a => a.id === voucher.id);
          return { ...voucher, arrears_not_cleared: arrear ? arrear.arrears_not_cleared : '' };
        });

        setData(vouchersWithArrears);
      } catch (error) {
        console.error('Error fetching fee vouchers:', error);
        // Handle error states as needed
      }
    };

    if (user && user.user.campus_id && academicSession) {
      fetchFeeVouchers(voucherIds, user.user.campus_id, academicSession);
    }
  }, [user, academicSession]);

  useEffect(() => {
    function addHeadNameToFeeHead(heads, voucher_data) {
      voucher_data.forEach(item => {
        item.fee_head = JSON.parse(item.fee_head);

        item.fee_head.forEach(head => {
          const match = heads.find(headItem => headItem.id === head.id);
          if (match) {
            head.head_name = match.head_name;
          }
        });

        item.fee_head = JSON.stringify(item.fee_head);
      });

      return voucher_data;
    }

     addHeadNameToFeeHead(getHeads, data);
    // setUpdatedVouchersWithHead(updatedSecondArray);
  }, [data, getHeads]);

  return (
    <div>
      <button onClick={handlePrint} className='btn btn-warning btn-sm ml-4 mt-2'><i className="fa fa-print" aria-hidden="true"></i> Print</button>
      <div className='data' ref={componentRef}>
        {data.map((voucher, index) => (
          <SingleVoucher key={index} data={voucher} bankDetails={getBankDetails} bankNotes={getBankNotes} />
        ))}
      </div>
    </div>
  );
}

const SingleVoucher = ({ data, bankDetails, bankNotes, user }) => {
  const {
    invoice_no,
    full_name,
    register_no,
    father_name,
    class_name,
    section_name,
    category,
    // student_id,
    // category_id,
    for_the_month,
    fee_head,
    total_amount_data,
    // due_date,
    actual_due_date,
    // remarks,
    after_due_date_amount,
    // status,
    arrears,
    arrears_not_cleared,
    // created_at,
    // updated_at,
    // campus_id,
    session_name,
    campus_name,
    first_advance_payment, // Access first_advance_payment from data
    bus_fee
  } = data;
  
  const feeHeadDetails = JSON.parse(fee_head);

  function convertDates(date) {
    const d = new Date(date);
    const day = d.getDate().toString().padStart(2, '0');
    const month = (d.getMonth() + 1).toString().padStart(2, '0');
    const year = d.getFullYear();
    return `${day}-${month}-${year}`;
  }

  function getCurrentDate(){
    const today = new Date();
    const day = String(today.getDate()).padStart(2, '0');
    const month = String(today.getMonth() + 1).padStart(2, '0'); // Months are zero-based
    const year = today.getFullYear();

    const formattedDate = `${day}-${month}-${year}`;
    return formattedDate;
  }

  const voucherBankDetails = JSON.parse(data.bank_details).map(bankId => {
    return bankDetails.find(detail => detail.id === bankId);
  }).filter(detail => detail !== undefined);

  const renderVoucherCopy = (title) => (
    <div className="voucher">
      <div className="voucher-header">
        <h5>{campus_name}</h5>
        <h5 className='title'>{title}</h5>
      </div>
      <div className="voucher-fee">
        <table className="voucher_table">
          <thead>
            <tr>
              <th>Voucher#</th>
              <td>{invoice_no}</td>
              <th>Month</th>
              <td>{for_the_month}</td>
            </tr>
            <tr>
              <th>Iss.Date</th>
              <td>{getCurrentDate()}</td>
              <th>Due.Date</th>
              <td>{convertDates(actual_due_date)}</td>
            </tr>
            <tr>
              <th>Reg#</th>
              <td>{register_no}</td>
              <th>Session</th>
              <td>{session_name}</td>
            </tr>
            <tr>
              <th>Name</th>
              <td>{full_name}</td>
              <th>Father</th>
              <td>{father_name}</td>
            </tr>
            <tr>
              <th>Category</th>
              <td>{category}</td>
              <th>Class</th>
              <td>{class_name + " (" + section_name + ")"}</td>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td></td>
            </tr>
            <tr>
              <th colSpan={2}>Particulars</th>
              <th colSpan={2}>Amount (Rs)</th>
            </tr>
            {feeHeadDetails.map((item, index) => (
              <tr key={index}>
                <td colSpan={2}>{item.head_name}</td>
                <td colSpan={2}>{item.amount}</td>
              </tr>
            ))}

            <tr>
              <td colSpan={4}></td>
            </tr>
          
            
           
              {first_advance_payment > 0 && (
              <tr>
                <th colSpan={2}>Advance :</th>
                <td colSpan={2}>{first_advance_payment}</td>
              </tr>
            )}

            {bus_fee > 0 && (
              <tr>
                <th colSpan={2}>Bus Fee :</th>
                <td colSpan={2}>{bus_fee}</td>
              </tr>
            )}

            {arrears && arrears !== 0 ? (
              <tr>
                <th colSpan={2}>Arrears :</th>
                <td colSpan={2}>{arrears}</td>
              </tr>
            ) : null}
           
            <tr>
              <th colSpan={2}>Payable :</th>
              <th colSpan={2}>{total_amount_data + arrears + parseInt(first_advance_payment)}</th>
            </tr>
            <tr>
              <th colSpan={2}>Payable (After Due Date) :</th> 
              <th colSpan={2}>{after_due_date_amount + arrears + parseInt(first_advance_payment)}</th>
            </tr>

            {arrears_not_cleared && (
              <tr>
                <th colSpan={2}>Arrears Months :</th>
                <td colSpan={2}>{arrears_not_cleared}</td>
              </tr>
            )}
           
            {voucherBankDetails.map((bankDetail, index) => (
              <React.Fragment key={index}>
                <tr>
                  <td colSpan={4}>Bank: {bankDetail.bank_name}</td>
                </tr>
                <tr>
                  <td colSpan={4}>A/C Title: {bankDetail.account_title}</td>
                </tr>
                <tr>
                  <td colSpan={4}>A/C No: {bankDetail.account_no}</td>
                </tr>
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
      
      <div className="voucher-notes">
        <h5>Notes:</h5>
        <ul>
          {bankNotes.map((note, index) => (
            <div key={index}>
              <p dangerouslySetInnerHTML={{ __html: note.note_description }} />
            </div>
          ))}
        </ul>
      </div>
      <div style={{ border: '1px solid black', display: 'flex', justifyContent: 'center' }}>
        <Barcode value={invoice_no.toString()} height={40} width={2} />
      </div>
    </div>
  );

  return (
    <div className="voucher-container">
      {renderVoucherCopy('Bank Copy')}
      {renderVoucherCopy('School Copy')}
      {renderVoucherCopy('Student Copy')}
    </div>
  );
};

export default ViewVoucher;
