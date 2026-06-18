import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { useAuth } from "./AuthContext";
import AcademicSessionContext from "./AcademicSessionContext";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Select from "react-select";

function EditFeeVoucher({ onClose, fetchData }) {
  const [data, setData] = useState([]);

  const [getUpdatedData, setUpdatedData] = useState([]);

  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [getCategories, setCategories] = useState([]);
  const [getClasses, setClasses] = useState([]);
  const [getStudents, setStudents] = useState([]);
  const [getFeeHeads, setFeeHeads] = useState([]);
  const { user } = useAuth();
  const { academicSession } = useContext(AcademicSessionContext);

  const [getEditFeeVoucher, setEditFeeVoucher] = useState(0);

  const [getArrearIdData, setArrearsIdData] = useState([]);
  const [amountsData, setAmountsData] = useState([]);
  // const [totalAmount, setTotalAmount] = useState(0);

  //this is heads_amounts state that we selected and send to server
  const [selectedItems, setSelectedItems] = useState([]);

  const [getStoreFeeVoucherHead, setStoreFeeVoucherHead] = useState([]);

  const voucher_id_get = localStorage.getItem("voucher_id")
    ? JSON.parse(localStorage.getItem("voucher_id"))
    : "";

  const [advanceExist, setAdvanceExist] = useState(false);

  useEffect(() => {
    setEditFeeVoucher(voucher_id_get);
  }, [getEditFeeVoucher, voucher_id_get]);

  useEffect(() => {
    const initialSelectedItems = data
      .filter((head_detail) => head_detail.status === "checked_now")
      .map((head_detail) => ({
        id: head_detail.id,
        amount: head_detail.amount,
        category_id: head_detail.category_id,
        category_name: head_detail.category,
      }));
    setSelectedItems(initialSelectedItems);
  }, [data]);

  const initialState = {
    class_id: "",
    section_id: "",
    student_unique_id:"",
    student_id: "",
    shift: "",
    from_month: "",
    to_month: "",
    due_date: "",
    remarks: "",
    heads_with_amount: "",
    category_id: "",
    fee_group_id: "",
    amount: "",
    arrears: 0,
    is_previous_session_arrear:"",
    bus_status: true,
    bus_fee: 0,
    first_advance_payment: 0,
    remaining_advance: 0,
    hidden_advance_payment:0,
    fine: 0,
    status: "",
    arear_not_cleared_id: "",
    session_id: academicSession,
    campus_id: user.user.campus_id,
    user_id: user.user.user_id,
    hidden_id: "",
  };

  const [validity, setValidity] = useState({
    class_id: true,
    // student_id: true,
    shift: true,
    from_month: true,
    // to_month: true,
    due_date: true,
    remarks: true,
  });

  const [editFormData, setEditFormData] = useState(initialState);

  useEffect(() => {
    if (academicSession) {
      setEditFormData((prevFormData) => ({
        ...prevFormData,
        session_id: parseInt(academicSession),
      }));
    }
  }, [academicSession]);

  const validateForm = () => {
    let isValid = true;
    // Basic validation rules (customize as per your requirements)
    if (!editFormData.class_id && !editFormData.class_id.trim()) {
      setValidity((prevState) => ({ ...prevState, class_id: false }));
      isValid = false;
    }

    // if (!editFormData.student_id && !editFormData.student_id.trim()) {
    //     setValidity((prevState) => ({ ...prevState, student_id: false }));
    //     isValid = false;
    // }

    if (!editFormData.shift && !editFormData.shift.trim()) {
      setValidity((prevState) => ({ ...prevState, shift: false }));
      isValid = false;
    }

    if (!editFormData.from_month && !editFormData.from_month.trim()) {
      setValidity((prevState) => ({ ...prevState, from_month: false }));
      isValid = false;
    }

    // if (!editFormData.to_month && !editFormData.to_month.trim()) {
    //     setValidity((prevState) => ({ ...prevState, to_month: false }));
    //     isValid = false;
    // }

    if (!editFormData.due_date && !editFormData.due_date.trim()) {
      setValidity((prevState) => ({ ...prevState, due_date: false }));
      isValid = false;
    }

    if (!editFormData.remarks && !editFormData.remarks.trim()) {
      setValidity((prevState) => ({ ...prevState, remarks: false }));
      isValid = false;
    }

    return isValid;
  };

  const [report, getAllReports] = useState({
    from_date: "",
    to_date: "",
    report_type: "",
  });

  const [searchCategoryReport, getSearchCategoryReport] = useState({
    search: "",
  });

  function searchCategory() {
    // fetchData();
  }

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      getSearchCategoryReport(searchCategoryReport);
      // fetchData();
    }
  };

  function getReport() {
    if (report.report_type == "pdf") {
      // pdfReport();
    } else if (report.report_type == "excel") {
      // excelReport();
    }
  }

  useEffect(() => {
    const getClasses = (campus_id) => {
      axios
        .get(process.env.REACT_APP_API_BASE_URL + `/get-classes/${campus_id}`)
        .then((res) => {
          setClasses(res.data.results);
        })
        .catch((err) => console.log(err));
    };

    // Ensure user.campus_id is defined before calling fetchClasses
    if (user && user.user.campus_id) {
      getClasses(user.user.campus_id);
    }
  }, [user]); // Dependenci

  useEffect(() => {
    const getClasses = (voucher_id, campus_id, session_id) => {
      axios
        .get(
          process.env.REACT_APP_API_BASE_URL +
            `/edit-fee-voucher/${voucher_id}/${campus_id}/${session_id}`
        )
        .then((res) => {
          let heads = setFeeHeads(res.data.heads);



          const {
            id,
            invoice_no,
            student_id,
            student_unique_id,
            category_id,
            for_the_month,
            fee_head,
            total_amount_data,
            due_date,
            remarks,
            first_advance_payment,
            after_due_date_amount,
            status,
            arrears_not_cleared,
            arrears,
            is_previous_session_arrear,
            created_at,
            updated_at,
            campus_id,
            session_id,
            full_name,
            student_shift,
            class_id,
            section_id,
            category,
            bus_fee,
            advance_payments,
            fine,
          } = res.data.vouchers[0];

          // console.log(
          //   res.data.vouchers[0],
          //   "this is voucher data",
          //   res.data.vouchers[0].fee_head
          // );

          setStoreFeeVoucherHead(JSON.parse(fee_head));

          const formatDate = (dateString) => {
            const date = new Date(dateString);
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, "0");
            const day = String(date.getDate()).padStart(2, "0");
            return `${year}-${month}-${day}`;
          };

          const due_date_format = due_date ? formatDate(due_date) : "";

          console.log(arrears, "this is arrears");

          setEditFormData({
            class_id: class_id || "",
            section_id: section_id || "",
            student_unique_id: student_unique_id,
            student_id: student_id || "",
            shift: student_shift || "",
            from_month: for_the_month || "",
            due_date: due_date_format || "",
            remarks: remarks || "",
            fine: fine || "",
            category_id: category_id || "",
            amount: total_amount_data || "",
            arrears: arrears || 0,
            is_previous_session_arrear: is_previous_session_arrear || "",
            arear_not_cleared_id: JSON.parse(arrears_not_cleared) || "",
            first_advance_payment: first_advance_payment || 0,
            hidden_advance_payment: first_advance_payment || 0,
            status: status || "",
            remaining_advance: advance_payments,
            bus_fee: bus_fee || 0,
            session_id: academicSession || "",
            campus_id: user.user.campus_id,
            user_id: user.user.user_id,
            hidden_id: id,
          });
        })
        .catch((err) => console.log(err));
    };

    // Ensure user.campus_id is defined before calling fetchClasses
    if (user && user.user.campus_id && getEditFeeVoucher && academicSession) {
      getClasses(getEditFeeVoucher, user.user.campus_id, academicSession);
    }
  }, [getEditFeeVoucher, user, academicSession]); // Dependenci

  useEffect(() => {
    const getStudents = (
      class_id,
      section_id,
      campus_id,
      session_id,
      shift
    ) => {
      axios
        .get(
          process.env.REACT_APP_API_BASE_URL +
            `/get-students/${class_id}/${section_id}/${campus_id}/${session_id}/${shift}`
        )
        .then((res) => {
          setStudents(res.data.results);
        })
        .catch((err) => console.log(err));
    };

    // Ensure user.campus_id is defined before calling fetchClasses
    if (
      user &&
      user.user.campus_id &&
      editFormData.class_id &&
      editFormData.section_id &&
      editFormData.shift
    ) {
      getStudents(
        editFormData.class_id,
        editFormData.section_id,
        user.user.campus_id,
        academicSession,
        editFormData.shift
      );
    }
  }, [
    user,
    editFormData.class_id,
    editFormData.section_id,
    editFormData.shift,
  ]); // Dependenci

  // console.log("yes");

  useEffect(() => {
    if (editFormData.arear_not_cleared_id.length > 0) {
      const getArrears = async () => {
        try {
          const response = await fetch(
            process.env.REACT_APP_API_BASE_URL + "/fetch-data-arrears-id",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                // Add any other headers if needed, like authorization headers
              },
              body: JSON.stringify(editFormData), // Convert your data to JSON format
            }
          );

          if (!response.ok) {
            throw new Error("Network response was not ok");
          }

          const responseData = await response.json();

          // setArrearsIdData(responseData.results);

          // console.log(responseData.results);
          
          console.log(resultsWithStatus);

          const resultsWithStatus = responseData.results.map((result) => ({
            ...result,
            status: "Pending", // Example status value, you can change it accordingly
          }));

          setAmountsData(resultsWithStatus);
        } catch (error) {
          console.error("Error:", error);
          toast.error("An error occurred. Please try again.");
        }
      };

      if (user && user.user.campus_id && editFormData.class_id) {
        getArrears(editFormData.class_id, user.user.campus_id, academicSession);
      }
    }
  }, [user, editFormData.arear_not_cleared_id]); // Dependenci

  

  const handleCheckboxChangeArrearsMonth = async (id) => {
    const updatedData = amountsData.map((item) => {
      if (item.id === id) {
        return {
          ...item,
          status: !item.status, // Toggle status
        };
      }
      return item;
    });

    setAmountsData(updatedData);

    // Find the item that was unchecked
    const uncheckedItem = updatedData.find(
      (item) => item.id === id && item.status === false
    );
    var confirmArrears = window.confirm(
      "Are you sure you want to remove arrears!"
    );
    if (confirmArrears) {
      if (uncheckedItem) {
        try {
          const response = await fetch(
            process.env.REACT_APP_API_BASE_URL + "/update-arrears",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                arrear_id: uncheckedItem.id,
                student_id: editFormData.student_id,
                hidden_id: editFormData.hidden_id,
                month: editFormData.from_month,
              }),
            }
          );

          if (response.ok) {
            // Filter out the unchecked item if the update was successful
            const newAmountsData = updatedData.filter((item) => item.id !== id);
            setAmountsData(newAmountsData);
            toast.success("Arrear Removed Successfully!");
            fetchData();
          } else {
            throw new Error("Failed to update status on server");
          }
        } catch (error) {
          console.error("Error updating status:", error);
          toast.error("Failed to update status.");
        }
      }
    }
  };

  useEffect(() => {
    let fee_voucher_heads = getStoreFeeVoucherHead
      ? getStoreFeeVoucherHead
      : "";

    const getHeadsDetail = (campus_id, class_id, shift, category_id) => {
      const voucher_type = "single_voucher_form";
      axios
        .get(
          process.env.REACT_APP_API_BASE_URL +
            `/get-fee-heads-details-for-vouchers/${campus_id}/${voucher_type}/${category_id}/${class_id}/${shift}/`
        )
        .then((res) => {
          var get_data = res.data.results;

          // updating amount of fee voucher
          get_data.forEach((item) => {
            const matchingItem = fee_voucher_heads.find(
              (secondItem) =>
                secondItem.id === item.id &&
                secondItem.category_name === item.category
            );
            if (matchingItem) {
              item.amount = matchingItem.amount;
              item.status = "checked_now";
            }
          });

          setData(get_data);

          setLoading(false);
        })
        .catch((err) => console.log(err));
    };

    // Ensure user.campus_id is defined before calling fetchClasses
    if (
      user &&
      user.user.campus_id &&
      editFormData.class_id &&
      editFormData.shift &&
      editFormData.category_id
    ) {
      getHeadsDetail(
        user.user.campus_id,
        editFormData.class_id,
        editFormData.shift,
        editFormData.category_id
      );
    }
  }, [
    editFormData.class_id,
    editFormData.shift,
    editFormData.category_id,
    getStoreFeeVoucherHead,
  ]); // Dependenci


  // useEffect(() => {
  //   setEditFormData({ ...editFormData, arrears: totalAmount });
  // }, [totalAmount]); // Depend

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      let groupedData = {};
      // Iterate through each item in the data array

      selectedItems.forEach((item) => {
        const { category_id, ...rest } = item;

        // Check if the category_id already exists in groupedData
        if (groupedData[category_id]) {
          // If exists, push the item to the existing array
          groupedData[category_id].push(rest);
        } else {
          // If doesn't exist, create a new array with the item
          groupedData[category_id] = [rest];
        }
      });

      const combinedData = {
        editFormData,
        groupedData,
        amountsData,
      };

      try {
        const response = await fetch(
          process.env.REACT_APP_API_BASE_URL + "/single-fee-voucher",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              // Add any other headers if needed, like authorization headers
            },
            body: JSON.stringify(combinedData), // Convert your data to JSON format
          }
        );

        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        const responseData = await response.json();
        if (responseData.message == "greater_month") {
          toast.error("Voucher month shoudld be greater! Last Entry Voucher");
        } else {
          console.log(responseData.data);
          if (responseData.message) {
            setEditFormData(initialState);
            toast.success(responseData.message);
            localStorage.removeItem("voucher_id");
            localStorage.setItem("refresh_list", true);
            fetchData();
            onClose(false);
          } else if (responseData.error !== "") {
            console.log(responseData.error);
            toast.error(responseData.error); // Changed toast.success to toast.error for error messages
          }
        }

        console.log("Response:", responseData);
      } catch (error) {
        console.error("Error:", error);
      }
    }
  };

  const handleClassChange = (selectedOption) => {
    const [class_id, section_id] = selectedOption
      ? selectedOption.value.split(",")
      : ["", ""];
    setEditFormData({ ...editFormData, class_id, section_id });
  };

  const findClassLabel = () => {
    if (!editFormData.class_id || !editFormData.section_id) {
      return "";
    }
    const classObj = getClasses.find(
      (class_get) =>
        class_get.id === parseInt(editFormData.class_id) &&
        class_get.section_id === parseInt(editFormData.section_id)
    );
    if (classObj) {
      return `${classObj.class} (${classObj.section_name})`;
    }
    return "";
  };

  const handleCheckboxChange = (id, amount, category_id, category_name) => {
    setSelectedItems((prevSelectedItems) => {
      console.log(prevSelectedItems);
      const isSelected = prevSelectedItems.some((item) => item.id === id);
      if (isSelected) {
        // If the item is already selected, remove it
        return prevSelectedItems.filter((item) => item.id !== id);
      } else {
        // If the item is not selected, add it
        return [
          ...prevSelectedItems,
          { id, amount, category_id, category_name },
        ];
      }
    });
  };

  const handleAmountChange = (e, id) => {
    const newAmount = e.target.value;
    setSelectedItems((prevSelectedItems) => {
      return prevSelectedItems.map((item) => {
        if (item.id === id) {
          return { ...item, amount: parseInt(newAmount) };
        }
        return item;
      });
    });
  };

  const grandAmount =
    selectedItems.reduce((total, item) => total + item.amount, 0) +
    parseInt(editFormData.arrears || 0) +
    parseInt(editFormData.advance_payments || 0);

  const handleStudentChange = (selectedOption) => {
    const student = getStudents.find(
      (student) => student.id === selectedOption.value
    );
    setEditFormData({
      ...editFormData,
      student_id: selectedOption ? selectedOption.value : "",
      student_unique_id : selectedOption ? selectedOption.student_unique_id : "",
      category_id: selectedOption ? selectedOption.category_id : "", // Update category_id on change
      shift: selectedOption ? selectedOption.shift : "", // Update shift on change
      bus_fee: student ? student.bus_fee : 0, // Set bus_fee from selected student
      bus_status: student ? student.bus_status : "", // Set bus_status from selected student
    });
  };

  return (
    <>
      <div className="d-flex">
        <div className="col-md-4 p-2">
          {/* <h5 className='text-warning bg-primary p-2 card-header border'> <i className="fas fa-file-invoice"></i> Edit Fee Voucher</h5> */}
          <form className="border p-3">
            <div className="form-group row">
              <label htmlFor="inputEmail3" className="col-sm-2 col-form-label">
                Class
              </label>
              <div className="col-sm-10 ">
                <Select
                  options={getClasses.map((class_get) => ({
                    value: `${class_get.id},${class_get.section_id}`,
                    label: `${class_get.class} (${class_get.section_name})`,
                  }))}
                  value={
                    editFormData.class_id && editFormData.section_id
                      ? {
                          value: `${editFormData.class_id},${editFormData.section_id}`,
                          label: findClassLabel(),
                        }
                      : null
                  }
                  onChange={handleClassChange}
                  placeholder="Select Class"
                    isDisabled={editFormData.status === 'paid'}
                />
              </div>
            </div>

            <div className="form-group row">
              <label htmlFor="inputEmail3" className="col-sm-2 col-form-label">
                Shift
              </label>
              <div className="col-sm-10 ">
                <select
                  disabled={editFormData.status === 'paid'}
                  name="fee_head_id"
                  value={editFormData.shift}
                  onChange={(e) => {
                    setEditFormData({ ...editFormData, shift: e.target.value });
                    setValidity({ ...validity, shift: true });
                  }}
                  className={
                    validity.shift
                      ? "form-control"
                      : "form-control invalid-input"
                  }
                >
                  <option value="">Select Shift</option>
                  <option>Morning</option>
                  <option>Evening</option>
                </select>
              </div>
            </div>

            <div className="form-group row">
              <label htmlFor="inputEmail3" className="col-sm-2 col-form-label">
                Students
              </label>
              <div className="col-sm-10 ">
                <Select
                  options={getStudents.map((student) => ({
                    value: student.id,
                    label: student.full_name,
                    category_id: student.category_id,
                    shift: student.shift,
                    student_unique_id:student.student_unique_id
                  }))}
                  value={
                    editFormData.student_id
                      ? {
                          value: editFormData.student_id,
                          label:
                            getStudents.find(
                              (student) =>
                                student.id === editFormData.student_id
                            )?.full_name || "",
                          category_id: editFormData.category_id,
                          shift: editFormData.shift,
                          student_unique_id:editFormData.student_unique_id
                        }
                      : null
                  }
                  onChange={handleStudentChange}
                  placeholder="Select Student"
                  isDisabled={editFormData.status === 'paid'}
                />
              </div>
            </div>

            <div className="form-group row">
              <label htmlFor="inputEmail3" className="col-sm-2 col-form-label">
                Month
              </label>
              <div className="col-sm-10 ">
                <input
                  readOnly={editFormData.status === 'paid'}
                  type="month"
                  name="amount"
                  value={editFormData.from_month}
                  onChange={(e) => {
                    setEditFormData({
                      ...editFormData,
                      from_month: e.target.value,
                      to_month: e.target.value,
                    });
                    setValidity({ ...validity, from_month: true });
                  }}
                  className={
                    validity.from_month
                      ? "form-control"
                      : "form-control invalid-input"
                  }
                />
              </div>
            </div>

            <div className="form-group row">
              <label htmlFor="inputEmail3" className="col-sm-2 col-form-label">
                Due_Date
              </label>
              <div className="col-sm-10 ">
                <input
                  readOnly={editFormData.status === 'paid'}
                  type="date"
                  name="due_date"
                  value={editFormData.due_date}
                  onChange={(e) => {
                    setEditFormData({
                      ...editFormData,
                      due_date: e.target.value,
                    });
                    setValidity({ ...validity, due_date: true });
                  }}
                  className={
                    validity.due_date
                      ? "form-control"
                      : "form-control invalid-input"
                  }
                />
              </div>
            </div>

            <div className="form-group row">
              <label htmlFor="inputEmail3" className="col-sm-2 col-form-label">
                Remarks
              </label>
              <div className="col-sm-10 ">
                <input
                  readOnly={editFormData.status === 'paid'}
                  type="text"
                  name="remarks"
                  value={editFormData.remarks}
                  onChange={(e) => {
                    setEditFormData({
                      ...editFormData,
                      remarks: e.target.value,
                    });
                    setValidity({ ...validity, remarks: true });
                  }}
                  className={
                    validity.remarks
                      ? "form-control"
                      : "form-control invalid-input"
                  }
                />
              </div>
            </div>

            <div className="form-group row">
              <label htmlFor="inputEmail3" className="col-sm-2 col-form-label">
                Fine
              </label>
              <div className="col-sm-10 ">
                <input
                 readOnly={editFormData.status === 'paid'}
                  type="number"
                  name="fine"
                  className="form-control"
                  value={editFormData.fine == "" ? 0 : editFormData.fine}
                  onChange={(e) => {
                    setEditFormData({ ...editFormData, fine: e.target.value });
                  }}
                />
              </div>
            </div>

            <div className="form-group row">
              {console.log(editFormData.arrears, "near input field")}
              <label htmlFor="inputEmail3" className="col-sm-2 col-form-label">
                Arrears
              </label>
              <div className="col-sm-10 ">
                <input
                  type="number"
                  name="arrears"
                  className="form-control"
                  value={editFormData.arrears}
                  readOnly={amountsData.length > 0 ||  editFormData.status === 'paid'}
                  onChange={(e) => {
                    setEditFormData({
                      ...editFormData,
                      arrears: e.target.value,
                    });
                  }}
                />
              </div>
            </div>

            <div className="form-group row">
              <label htmlFor="inputEmail3" className="col-sm-2 col-form-label">
                Advance
              </label>
              <div className="col-sm-10 ">
                <input
                  type="number"
                  name="arrears"
                  className="form-control"
                  value={editFormData.first_advance_payment}
                  onChange={(e) => {
                    setEditFormData({
                      ...editFormData,
                      first_advance_payment: e.target.value,
                    });
                  }}
                />
              </div>
            </div>


             <div className="form-group row d-none">
              <label htmlFor="inputEmail3" className="col-sm-2 col-form-label">
               Previous Advance
              </label>
              <div className="col-sm-10 ">
                <input
                  type="number"
                  name="hidden_advance_payment"
                  className="form-control"
                  value={editFormData.hidden_advance_payment}
                />
              </div>
            </div>


            <div className="form-group row">
              <label htmlFor="inputEmail3" className="col-sm-2 col-form-label">
                Bus_Fee
              </label>
              <div className="col-sm-10 ">
                <input
                  type="text"
                  name="bus_fee"
                  value={editFormData.bus_fee}
                  readOnly
                  className={"form-control"}
                />
              </div>
            </div>

            <div
              className={`form-group row ${
                amountsData.length > 0 ? "" : "d-none"
              }`}
            >
              <label htmlFor="inputEmail3" className="col-md-6 col-form-label ">
                Previous Arrears (Month)
              </label>
              <div className="col-sm-6">
                <div>
                  {amountsData.map((result) => (
                    <div key={result.id}>
                      <input
                        type="checkbox"
                        id={`checkbox${result.id}`}
                        value={result.id}
                        checked={result.status}
                        onChange={() =>
                          handleCheckboxChangeArrearsMonth(result.id)
                        }
                      />
                      <label htmlFor={`checkbox${result.id}`}>
                        {result.for_the_month}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </form>
        </div>

        <div className="col-md-8 p-2">
          <div className="card-header text-warning bg-primary p-2">
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <i className="fas fa-list"></i> Heads Detail Category Wise
              </div>

              {/* search category */}

              <div className="d-flex">
                <div className="me-2 mr-2">
                  <input
                    type="text"
                    className="form-control"
                    id="search_category"
                    onKeyDown={handleKeyDown}
                    onChange={(e) =>
                      getSearchCategoryReport({
                        ...searchCategoryReport,
                        search: e.target.value,
                      })
                    }
                  />
                </div>
                <button
                  className="btn btn-sm btn-danger"
                  onClick={searchCategory}
                >
                  Search
                </button>
              </div>

              <div className="d-none">
                <div className="me-2 mr-2">
                  <input
                    type="date"
                    className="form-control"
                    id="from_date"
                    onChange={(e) =>
                      getAllReports({ ...report, from_date: e.target.value })
                    }
                  />
                </div>

                <div className="me-2 mr-2">
                  <input
                    type="date"
                    className="form-control"
                    id="to_date"
                    onChange={(e) =>
                      getAllReports({ ...report, to_date: e.target.value })
                    }
                  />
                </div>

                <div className="me-2 mr-2">
                  <select
                    name="type"
                    id="type"
                    className="form-control"
                    onChange={(e) =>
                      getAllReports({ ...report, report_type: e.target.value })
                    }
                  >
                    <option value="">Select Type</option>

                    <option value="excel">Excel</option>
                    <option value="pdf">PDF</option>
                  </select>
                </div>

                <button className="btn btn-sm btn-danger" onClick={getReport}>
                  Get Report
                </button>
              </div>
            </div>
          </div>

          <div className="border p-2">
            <table className="table">
              <thead>
                <tr>
                  {/* <th>ID</th> */}
                  <th>Head</th>
                  <th>Category</th>

                  <th>Amount</th>
                  <th className="text-center">Active</th>
                </tr>
              </thead>
              <tbody>
                {data.map((head_detail, index) => (
                  <tr key={index}>
                    <td>{head_detail.head_name}</td>
                    <td>{head_detail.category}</td>
                    <td>
                      {/* head_detail.amount */}
                      {selectedItems.some(
                        (item) => item.id === head_detail.id
                      ) ? (
                        <input
                          type="number"
                          value={
                            selectedItems.find(
                              (item) => item.id === head_detail.id
                            )?.amount || 0
                          }
                          onChange={(e) =>
                            handleAmountChange(e, head_detail.id)
                          }
                        />
                      ) : (
                        head_detail.amount
                      )}
                    </td>
                    <td className="text-center">
                      <div>
                        <input
                          disabled={editFormData.status === 'paid'}
                          type="checkbox"
                          id={`head_detail_${head_detail.id}`}
                          checked={selectedItems.some(
                            (item) => item.id === head_detail.id
                          )}
                          onChange={() =>
                            handleCheckboxChange(
                              head_detail.id,
                              head_detail.amount,
                              head_detail.category_id,
                              head_detail.category
                            )
                          }
                        />
                      </div>
                    </td>
                  </tr>
                ))}
                <tr>
                  <td style={{ textAlign: "right" }} colSpan={"4"}>
                    <input
                      type="submit"
                      className="btn btn-sm btn-primary"
                      value={"Save"}
                      onClick={handleSubmit}
                    />
                  </td>
                </tr>
              </tbody>
              <tfoot>
                {selectedItems.length > 0 && (
                  <tr>
                    <td style={{ fontWeight: "bolder" }}>Grand Total</td>
                    <td>{grandAmount + editFormData.bus_fee}</td>
                  </tr>
                )}
                {selectedItems.length === 0 && (
                  <tr>
                    <td colSpan="2">No Head selected</td>
                  </tr>
                )}
              </tfoot>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}

export default EditFeeVoucher;

