import React from "react";
import Barcode from "react-barcode";

const formatNumber = (amount) => {
  return new Intl.NumberFormat("en-US").format(amount);
};

// SingleVoucher Component for rendering each voucher in the view modal.
// Shared between FeeVouchers.jsx (admin) and StudentVouchersTest.jsx (public).
const SingleVoucher = ({ data, bankDetails, bankNotes }) => {
  const {
    invoice_no,
    shift,
    full_name,
    register_no,
    father_name,
    class_name,
    section_name,
    category,
    for_the_month,
    to_month,
    fee_head,
    total_amount_data,
    due_date,
    actual_due_date,
    remarks,
    after_due_date_amount,
    status,
    arrears,
    arrears_not_cleared,
    session_name,
    campus_name,
    first_advance_payment,
    bus_fee,
    attendance_amount,
    last_three_vouchers,
    address,
    phone_no,
    email,
  } = data;

  const feeHeadDetails = JSON.parse(fee_head);
  //this is correct code dont delete it (place after Bank details)
  const lastThreeFeeVoucher = {};
  // console.log("lastThreeFeeVoucher", lastThreeFeeVoucher);
  const convertDates = (date) => {
    const d = new Date(date);
    const day = d.getDate().toString().padStart(2, "0");
    const month = (d.getMonth() + 1).toString().padStart(2, "0");
    const year = d.getFullYear();
    return `${day}-${month}-${year}`;
  };

  const convertMonth = (date) => {
    const d = new Date(date);
    const monthNames = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    const month = monthNames[d.getMonth()];
    const year = d.getFullYear();
    return `${month}-${year}`;
  };

  const getCurrentDate = () => {
    const today = new Date();
    const day = String(today.getDate()).padStart(2, "0");
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const year = today.getFullYear();
    return `${day}-${month}-${year}`;
  };

  const voucherBankDetails = JSON.parse(data.bank_details)
    .map((bankId) => {
      return bankDetails.find((detail) => detail.id === bankId);
    })
    .filter((detail) => detail !== undefined);

  const renderVoucherCopy = (title) => (
    <div className="voucher" style={{ position: "relative" }}>
      {/* {status == "paid" && ( */}
      <img
        src={process.env.REACT_APP_BASE_URL + `/uploads/stamp.png`}
        alt="Paid Stamp"
        style={{
          position: "absolute",
          top: "70%",
          left: "70%",
          transform: "translate(-50%, -50%) rotate(-15deg)",
          width: "95px",
          height: "95px",
          opacity: 0.3,
          zIndex: 1000,
          pointerEvents: "none",
        }}
        onError={(e) => {
          e.target.style.display = "none";
        }}
      />
      {/* )}  */}

      {status == "paid" && (
        <img
          src={process.env.REACT_APP_BASE_URL + `/uploads/paid stamp.png`}
          alt="Paid Stamp"
          style={{
            position: "absolute",
            top: "43%",
            left: "77%",
            transform: "translate(-50%, -50%) rotate(-15deg)",
            width: "95px",
            height: "95px",
            opacity: 0.3,
            zIndex: 9999,
            pointerEvents: "none",
          }}
          onError={(e) => {
            e.target.style.display = "none";
          }}
        />
      )}
      <div
        className="voucher-header"
        style={{
          textAlign: "center",
        }}
      >
        {/* <div style={{flex:1}}>
          <img
            src={process.env.REACT_APP_BASE_URL + `/uploads/logo.png`}
            style={{ width: "80px", marginRight: "10px" }}
            onError={(e) => {
              e.target.style.display = "none";
            }}
          />
        </div> */}
        <div>
          <h5
            style={{
              backgroundColor: "rgba(216, 216, 216, 0.384)",
              margin: 0,
              fontSize: "14px",
              textTransform: "uppercase",
              padding: "5px",
              color: "black",
            }}
            className="title"
          >
            {/* {campus_name} */}
            Nasheman School/College
          </h5>
          <p style={{ margin: 0, fontSize: "12px" }}>{address}</p>
          <p style={{ margin: 0, fontSize: "12px" }}>{phone_no}</p>
          <p style={{ margin: 0, fontSize: "12px" }}>{email}</p>
        </div>
      </div>
      <h5
        className="title"
        style={{
          textAlign: "center",
          fontSize: "14px",
          textTransform: "uppercase",
          textDecoration: "underline",
        }}
      >
        {title}
      </h5>
      <div className="voucher-fee">
        <table className="voucher_table">
          <thead>
            <tr>
              <th>Month</th>
              <td colSpan={3} style={{ fontWeight: 700 }}>
                {to_month && to_month !== for_the_month
                  ? `${convertMonth(for_the_month)} to ${convertMonth(
                      to_month
                    )}`
                  : convertMonth(for_the_month)}
              </td>
            </tr>
            <tr>
              <th>Voucher#</th>
              <td>{invoice_no + " (" + shift + ")"}</td>
              <th>Due.Date</th>
              <td>{convertDates(actual_due_date)}</td>
            </tr>
            <tr>
              <th>Iss.Date</th>
              <td>{getCurrentDate()}</td>
              <th>Session</th>
              <td>{session_name}</td>
            </tr>
            <tr>
              <th>Reg#</th>
              <td>{register_no}</td>
              <th>Father</th>
              <td>{father_name}</td>
            </tr>
            <tr>
              <th>Name</th>
              <td>{full_name}</td>
              <th>Class</th>
              <td>{class_name + " (" + section_name + ")"}</td>
            </tr>
            <tr>
              <th>Category</th>
              <td colSpan={3}>{category}</td>
            </tr>
          </thead>
          <tbody>
            {/* <tr>
              <td></td>
            </tr> */}
            <tr>
              <th colSpan={2}>Particulars</th>
              <th colSpan={2}>Amount (Rs)</th>
            </tr>
            {feeHeadDetails.map((item, index) => (
              <tr key={index}>
                <td colSpan={2}>{item.head_name}</td>
                <td colSpan={2}>{formatNumber(item.amount)}</td>
              </tr>
            ))}
            <tr>
              <td colSpan={4}></td>
            </tr>
            {first_advance_payment > 0 && (
              <tr>
                <th colSpan={2}>Advance :</th>
                <td colSpan={2}>{formatNumber(first_advance_payment)}</td>
              </tr>
            )}
            {bus_fee > 0 && (
              <tr>
                <th colSpan={2}>Bus Fee :</th>
                <td colSpan={2}>{formatNumber(bus_fee)}</td>
              </tr>
            )}

            {attendance_amount > 0 && (
              <tr>
                <th colSpan={2}>Absent&nbsp;Fine :</th>
                <td colSpan={2}>{attendance_amount}</td>
              </tr>
            )}
            {arrears && arrears !== 0 ? (
              <tr>
                <th colSpan={2}>Arrears :</th>
                <td colSpan={2}>{formatNumber(arrears)}</td>
              </tr>
            ) : null}
            <tr>
              <th colSpan={2}>Payable :</th>
              <th colSpan={2}>
                {formatNumber(
                  total_amount_data + arrears + parseInt(first_advance_payment)
                )}
              </th>
            </tr>
            <tr>
              <th colSpan={2}>Payable (After Due Date) :</th>
              <th colSpan={2}>
                {formatNumber(
                  after_due_date_amount +
                    arrears +
                    parseInt(first_advance_payment)
                )}
              </th>
            </tr>
            {/* {arrears_not_cleared && (
              <tr>
                <th colSpan={2}>Arrears Months :</th>
                <td colSpan={2}>{arrears_not_cleared}</td>
              </tr>
            )} */}

            {remarks && (
              <tr>
                <th colSpan={4}>Remarks: {remarks}</th>
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
                  <td colSpan={4}>
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "row",
                        justifyContent: "space-between",
                        alignItems: "center",
                        width: "100%",
                      }}
                    >
                      <div style={{ flex: "0 0 50%" }}>
                        {" "}
                        {/* Column 6 equivalent (50% width) */}
                        A/C No: {bankDetail.account_no}
                      </div>
                      <div
                        style={{
                          flex: "0 0 50%",
                          display: "flex",
                          justifyContent: "flex-end",
                        }}
                      >
                        {" "}
                        {/* Column 6 equivalent (50% width) */}
                        {bankDetail.logo && (
                          <img
                            src={`${process.env.REACT_APP_API_BASE_URL}/uploads/${bankDetail.logo}`}
                            alt="Bank Logo"
                            style={{
                              width: "150px",
                              height: "30px",
                              objectFit: "contain",
                            }}
                          />
                        )}
                      </div>
                    </div>
                  </td>
                </tr>
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
      {lastThreeFeeVoucher && lastThreeFeeVoucher.length > 0 && (
        <div
          className="last-vouchers"
          style={{
            margin: "10px 0",
            borderTop: "1px dashed #000",
            paddingTop: "10px",
          }}
        >
          <h6>Last Three Month Vouchers:</h6>

          {lastThreeFeeVoucher.length > 0 && (
            <div style={{ marginTop: "8px" }}>
              <table
                style={{
                  width: "100%",
                  borderCollapse: "collapse",
                  fontSize: "9px", // Smaller font
                  lineHeight: "1.2",
                }}
              >
                <thead>
                  <tr>
                    <th
                      colSpan="4"
                      style={{
                        border: "1px solid #000",
                        padding: "3px",
                        textAlign: "left",
                        backgroundColor: "#f0f0f0",
                      }}
                    >
                      Last 3 Month Vouchers:
                    </th>
                  </tr>
                  <tr>
                    <th
                      style={{
                        border: "1px solid #000",
                        padding: "3px",
                        width: "33%",
                      }}
                    >
                      Month
                    </th>
                    <th
                      style={{
                        border: "1px solid #000",
                        padding: "3px",
                        width: "33%",
                        textAlign: "center",
                      }}
                    >
                      Arrears
                    </th>
                    <th
                      style={{
                        border: "1px solid #000",
                        padding: "3px",
                        width: "33%",
                        textAlign: "center",
                      }}
                    >
                      V.Amount
                    </th>
                    <th
                      style={{
                        border: "1px solid #000",
                        padding: "3px",
                        width: "34%",
                        textAlign: "center",
                      }}
                    >
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {/* {console.log(lastThreeFeeVoucher.length)} */}
                  {lastThreeFeeVoucher.map(
                    (voucher, index) =>
                      voucher.status && (
                        <tr key={index}>
                          <td
                            style={{
                              border: "1px solid #000",
                              padding: "3px",
                              whiteSpace: "nowrap",
                            }}
                          >
                            {voucher.for_the_month}
                          </td>
                          <td
                            style={{
                              border: "1px solid #000",
                              padding: "3px",
                              textAlign: "center",
                            }}
                          >
                            {voucher.arrears}
                          </td>
                          <td
                            style={{
                              border: "1px solid #000",
                              padding: "3px",
                              textAlign: "center",
                            }}
                          >
                            {voucher.after_due_date_amount}
                          </td>

                          <td
                            style={{
                              border: "1px solid #000",
                              padding: "3px",
                              color:
                                voucher.received_payment > 0 ? "green" : "red",
                              fontWeight: "bold",
                              textAlign: "center",
                            }}
                          >
                            {voucher.received_payment > 0 ? "Paid" : "Unpaid"}
                          </td>

                          {/* <td
                            style={{
                              border: "1px solid #000",
                              padding: "3px",
                              color:
                                voucher.status === "paid" ? "green" : "red",
                              fontWeight: "bold",
                              textAlign: "center",
                            }}
                          >
                            {(voucher.status || "").charAt(0).toUpperCase() +
                              (voucher.status || "").slice(1)}
                          </td> */}
                        </tr>
                      )
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

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
      <div
        style={{
          border: "1px solid black",
          display: "flex",
          justifyContent: "center",
        }}
      >
        <Barcode value={invoice_no.toString()} height={40} width={2} />
      </div>
    </div>
  );

  return (
    <div className="voucher-container">
      <style>
        {`
@media print {

  .voucher-container {
    width: 100vw !important;
    height: 100% !important;
    page-break-after: always;
    page-break-inside: avoid;
    /* transform: scale(0.95); */
    transform-origin: top left;
    /* padding: 5mm !important; */
    box-sizing: border-box;
    position: relative;
  }

  .voucher {
    width: 100% !important;
    height: 100% !important;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    page-break-after: always;
    page-break-inside: avoid;
  }

  .voucher_table {
    width: 100% !important;
    border-collapse: collapse !important;
     font-size: 10px !important; /* Reduced from 12px for compactness */
    /* margin: 5px 0 !important; */
  }

  .voucher_table th,
  .voucher_table td {
    padding: 2px 4px !important;
    border: 1px solid #000 !important;
    text-align: left;
    vertical-align: top;
  }

  .voucher-header h5 {
    margin: 2px 0 !important;
    font-size: 12px !important;
    /* text-align: center; */
  }

  .voucher-header .title {
    font-weight: bold;
    text-decoration: underline;
  }

  .voucher-notes {
    font-size: 9px !important;
    margin-top: 5px !important;
  }

  .voucher-notes h5 {
    margin: 2px 0 !important;
    font-size: 10px !important;
  }

  .last-vouchers {
    font-size: 9px !important;
    margin: 5px 0 !important;
  }

  .last-vouchers h6 {
    margin: 2px 0 !important;
    font-size: 10px !important;
  }

  @page {
    size: A4 landscape !important;
    /* transform: 90%; */
    margin: 0 !important;
  }

  * {
    max-width: 100% !important;
    overflow: hidden !important;
  }
}
`}
      </style>
      {renderVoucherCopy("Bank Copy")}
      {renderVoucherCopy("School Copy")}
      {renderVoucherCopy("Student Copy")}
    </div>
  );
};

export default SingleVoucher;
export { formatNumber };
