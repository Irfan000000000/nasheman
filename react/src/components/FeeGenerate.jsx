import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { useAuth } from './AuthContext';
import AcademicSessionContext from './AcademicSessionContext';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ReactPaginate from 'react-paginate';
import Select from 'react-select';
import { components } from "react-select";
import SingleFeeGenerate from './SingleFeeGenerate';
import FeeVouchers from './FeeVouchers';
// const SELECT_ALL_OPTION = {
//   value: "*",
//   label: "Select All Classes",
// };

const customComponents = {
  Option: (props) => {
    return (
      <components.Option {...props}>
        <input
          type="checkbox"
          checked={props.isSelected}
          onChange={() => {}}
          style={{ marginRight: 8 }}
        />
        {props.label}
      </components.Option>
    );
  },
  MultiValue: () => null, // hide selected tags (optional)
};

function FeeGenerate() {
  const [data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  // const [loading, setLoading] = useState(true);
  // const [getCategories, setCategories] = useState([]);
  const [getClasses, setClasses] = useState([]);
  // const [getFeeHeads, setFeeHeads] = useState([]);
  const { user } = useAuth();
  const { academicSession } = useContext(AcademicSessionContext);
  const [filteredData, setFilteredData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [checkHead, setCheckHead] = useState('');
  const [mobileTab, setMobileTab] = useState('form'); // 'form' | 'heads'
  const itemsPerPage = 10;

  // Calculate the offset and the slice of data to display on the current page
  const offset = currentPage * itemsPerPage;
  const currentItems = filteredData.slice(offset, offset + itemsPerPage);
  const pageCount = Math.ceil(filteredData.length / itemsPerPage);

  // Handle page click
  const handlePageClick = ({ selected }) => {
    setCurrentPage(selected);
  };

  const handleSearch = () => {
    const filtered = data.filter(
      (item) =>
        item.head_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.category.toLowerCase().includes(searchTerm.toLowerCase()) || 
        item.shift.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredData(filtered);
    setCurrentPage(0); // Reset to the first page after search
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  // State to keep track of selected items
  const [selectedItems, setSelectedItems] = useState([]);

  // Initialize selected items when data changes
  // useEffect(() => {
  //     const initialSelectedItems = data.map(head_detail => ({
  //         id: head_detail.id,
  //         amount: head_detail.amount,
  //         category_id: head_detail.category_id,
  //         category_name: head_detail.category,
  //         head_name: head_detail.head_name,
  //     }));
  //     setSelectedItems(initialSelectedItems);
  // }, [data]);

  // Extract unique head names for group selection
  const uniqueHeadNames = [...new Set(data.map((item) => item.head_name))];

  const initialState = {
    class_id: [],
    class_name: "",
    shift: "",
    from_month: "",
    to_month: "",
    due_date: "",
    remarks: "",
    heads_with_amount: "",
    category_id: "",
    fee_group_id: "",
    amount: "",
    fine: 0,
    arrear_set: true,
    bus_fee_status: true,
    session_id: academicSession,
    campus_id: user.user.campus_id,
    user_id: user.user.user_id,
    hidden_id: "",
    consolidated: false, // when true → ONE voucher/student with multiplied amounts
  };

  const [validity, setValidity] = useState({
    class_id: true,
    shift: true,
    from_month: true,
    due_date: true,
  });

  const [editFormData, setEditFormData] = useState(initialState);

  // Update session_id when academicSession changes
  useEffect(() => {
    if (academicSession) {
      setEditFormData((prevFormData) => ({
        ...prevFormData,
        session_id: parseInt(academicSession),
      }));
    }
  }, [academicSession]);

  // Validate form data
  const validateForm = () => {
    let isValid = true;
    if (!editFormData.class_id) {
      setValidity((prevState) => ({ ...prevState, class_id: false }));
      isValid = false;
    }
    // if (!editFormData.shift.trim()) {
    //   setValidity((prevState) => ({ ...prevState, shift: false }));
    //   isValid = false;
    // }
    if (!editFormData.from_month.trim()) {
      setValidity((prevState) => ({ ...prevState, from_month: false }));
      isValid = false;
    }
    if (!editFormData.due_date.trim()) {
      setValidity((prevState) => ({ ...prevState, due_date: false }));
      isValid = false;
    }

    return isValid;
  };

  // const [report, getAllReports] = useState({
  //   from_date: "",
  //   to_date: "",
  //   report_type: "",
  // });

  useEffect(() => {
    const getClasses = (campus_id) => {
      axios
        .get(process.env.REACT_APP_API_BASE_URL + `/get-classes/${campus_id}`)
        .then((res) => {
          setClasses(res.data.results);

          // console.log(res.data.results, "these are results");
        })
        .catch((err) => console.log(err));
    };

    if (user && user.user.campus_id) {
      getClasses(user.user.campus_id);
    }
  }, [user]);


  //this is old code and this is accurate ..............................
//   useEffect(() => {
//       setSelectedItems([]); // Reset selected items when class_id or shift changes
//       const getClasses = async (campus_id, class_id, shift) => {
//           try {
//               const voucher_type = 'multiple_voucher_form';
//               const res = await axios.get(process.env.REACT_APP_API_BASE_URL+`/get-fee-heads-details-for-vouchers/${campus_id}/${class_id}/${shift}/${voucher_type}`);
//               setData(res.data.results);
//               setFilteredData(res.data.results); // Initialize filtered data

//           } catch (err) {
//               console.log(err);
//           } finally {
//               setLoading(false);
//           }
//       };

//       if (user?.user?.campus_id && editFormData.class_id && editFormData.shift) {
//           setLoading(true);
//           getClasses(user.user.campus_id, editFormData.class_id, editFormData.shift);
//       }
//   }, [editFormData.class_id, editFormData.shift, user]);




// useEffect(() => {
//     setSelectedItems([]); // Reset selected items when class_id or shift changes
//     const getHeadsDetail = async (campus_id) => {
//         try {
//             const voucher_type = 'multiple_voucher_form';
//             const res = await axios.get(process.env.REACT_APP_API_BASE_URL+`/get-fee-heads-details-for-vouchers/${campus_id}/${voucher_type}`);
//             setData(res.data.results);
//             setFilteredData(res.data.results); // Initialize filtered data

//         } catch (err) {
//             console.log(err);
//         } finally {
//             setLoading(false);
//         }
//     };

//     if (user?.user?.campus_id) {
//         setLoading(true);
//         getHeadsDetail(user.user.campus_id);
//     }
// }, [user]);





  //this is new code (if any issue occur then delete this code) ..............................
  useEffect(() => {
    // console.log("hitted");
    setSelectedItems([]); // Reset selected items when class_id or shift changes
    const getHeadsDetail = async (campus_id) => {
      try {
        const voucher_type = "multiple_voucher_form";
        const res = await axios.get(
          process.env.REACT_APP_API_BASE_URL +
            `/get-fee-heads-details-for-vouchers/${campus_id}/${voucher_type}`);
        const fetchedData = res.data.results;

        // Pre-select the "always_checked" fee heads
        const selectedAlwaysChecked = fetchedData.filter(
          (item) => item.checked_status === "always_checked"
        );
        const alwaysCheckedItems = selectedAlwaysChecked.map((item) => ({
          id: item.id,
          amount: item.amount,
          category_id: item.category_id,
          category_name: item.category,
          head_name: item.head_name,
          fee_group_id: item.fee_group_id,
          shift_head: item.shift
        }));

        setData(fetchedData);
        setFilteredData(fetchedData);
        setSelectedItems((prevSelectedItems) => [
          ...prevSelectedItems,
          ...alwaysCheckedItems,
        ]); // Add always checked items to selected
      } catch (err) {
        console.log(err);
      } finally {
        // setLoading(false);
      }
    };

    if (user?.user?.campus_id) {
      // setLoading(true);
      getHeadsDetail(
        user.user.campus_id
      );
    }
  }, [user]);






  const handleSubmit = async (e) => {
    e.preventDefault();
    if (selectedItems.length <= 0) {
      toast.error("No fee head selected!");
      return;
    }
    if (validateForm()) {
      let groupedData = {};
      selectedItems.forEach((item) => {
        //DONT DELETE BELOW CODE
        // const { category_id, ...rest } = item;

        const { category_id, shift_head, fee_group_id, head_name, ...rest } = item;

        let category_detail = category_id+shift_head+fee_group_id;

        if (groupedData[category_detail]) {
          groupedData[category_detail].push(rest);
        } else {
          groupedData[category_detail] = [rest];
        }
      });


    //   console.log(groupedData);

    //   return false;

      const combinedData = {
        editFormData,
        groupedData,
      };

      try {
        const response = await axios.post(
          process.env.REACT_APP_API_BASE_URL + "/fee-voucher",
          combinedData,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        const responseData = response.data;

        if (responseData.message === "greater_month") {
          toast.error("Voucher month should be greater! Last Entry Voucher");
        } else {
          toast.success("Fee vouchers inserted successfully!");
          setEditFormData({ ...editFormData, class_id: "" });
          // setSelectedItems([]); // Reset selected items when class_id or shift changes
          // setEditFormData({ ...editFormData, class_id: '' });
        }
      } catch (error) {
        console.error("Error:", error);
        // Handle axios error response
        if (error.response) {
          // Server responded with a status other than 2xx
          console.error("Server Response Error:", error.response);
        } else if (error.request) {
          // No response received
          console.error("No Response from Server:", error.request);
        } else {
          // Other errors
          console.error("Error:", error.message);
        }
      }

      // try {
      //     const response = await fetch(process.env.REACT_APP_API_BASE_URL+'/fee-voucher', {
      //         method: 'POST',
      //         headers: {
      //             'Content-Type': 'application/json',
      //         },
      //         body: JSON.stringify(combinedData),
      //     });

      //     if (!response.ok) {
      //         throw new Error('Network response was not ok');
      //     }

      //     const responseData = await response.json();

      //     if (responseData.message === "greater_month") {
      //         toast.error("Voucher month should be greater! Last Entry Voucher");
      //     } else {
      //         toast.success('Fee vouchers inserted successfully!');
      //         // setEditFormData({ ...editFormData, class_id: '' });
      //     }
      // } catch (error) {
      //     console.error('Error:', error);
      // }
    }
  };

  const handleCheckboxChange = (
    id,
    amount,
    category_id,
    category_name,
    head_name
  ) => {
    setSelectedItems((prevSelectedItems) => {
      const isSelected = prevSelectedItems.some((item) => item.id === id);
      if (isSelected) {
        return prevSelectedItems.filter((item) => item.id !== id);
      } else {
        return [
          ...prevSelectedItems,
          { id, amount, category_id, category_name, head_name },
        ];
      }
    });
  };

  // Handle group checkbox change for each head_name
  const handleGroupCheckboxChange = (head_name) => {
    const itemsToToggle = data.filter((item) => item.head_name === head_name);
    const areAllSelected = itemsToToggle.every((item) =>
      selectedItems.some((selected) => selected.id === item.id)
    );

    if (areAllSelected) {
      // Remove all items with the given head_name
      setSelectedItems((prevSelectedItems) =>
        prevSelectedItems.filter((item) => item.head_name !== head_name)
      );
    } else {
      // Add all items with the given head_name
      const itemsToAdd = itemsToToggle
        .filter(
          (item) => !selectedItems.some((selected) => selected.id === item.id)
        )
        .map((item) => ({
          id: item.id,
          amount: item.amount,
          category_id: item.category_id,
          category_name: item.category,
          head_name: item.head_name,
          fee_group_id: item.fee_group_id,
          shift_head: item.shift
        }));
      setSelectedItems((prevSelectedItems) => [
        ...prevSelectedItems,
        ...itemsToAdd,
      ]);
    }
  };

  useEffect(() => {
    if (editFormData.from_month) {
      const selectedMonth = new Date(editFormData.from_month);
      const dueDate = new Date(
        selectedMonth.getFullYear(),
        selectedMonth.getMonth(),
        2
      ); // Set due date to the 5th of the next month
      setEditFormData((prevFormData) => ({
        ...prevFormData,
        due_date: dueDate.toISOString().split("T")[0],
      }));
    }
  }, [editFormData.from_month]);

  const isReadOnly = true; // This can be dynamic

  const classOptions = getClasses.map((classes) => ({
    value: classes.id,
    label: `${classes.class} (${classes.section_name})`,
  }));


  useEffect(() => {
    if (getClasses.length > 0) {
      const allIds = getClasses.map(classes => classes.id);
      const allNames = getClasses.map(classes => `${classes.class} (${classes.section_name})`).join(", ");
      
      setEditFormData(prevState => ({
        ...prevState,
        class_id: allIds,
        class_name: allNames
      }));
    }
  }, [getClasses]);



  function headSet(head){
    setCheckHead(head);
  }


  return (
    <>

{checkHead === 'single_fee_voucher_form' && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            width: "100vw",
            height: "100vh",
            backgroundColor: "#fff",
            zIndex: 10000,
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              flexShrink: 0,
              background: "linear-gradient(135deg, #111418 0%, #1a1f25 100%)",
              color: "#EBD197",
              padding: "14px 18px",
              borderBottom: "3px solid #EBD197",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <h5 style={{ margin: 0, fontSize: 16, fontWeight: 700, display: "flex", alignItems: "center", gap: 10 }}>
              <i className="fas fa-file-invoice-dollar"></i> Single Fee Voucher
            </h5>
            <button
              type="button"
              onClick={() => setCheckHead('')}
              aria-label="Close"
              style={{
                background: "rgba(235,209,151,0.15)",
                border: "1px solid rgba(235,209,151,0.3)",
                color: "#EBD197",
                cursor: "pointer",
                width: 34,
                height: 34,
                borderRadius: "50%",
                fontSize: 20,
                lineHeight: 1,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              ×
            </button>
          </div>

          <div style={{ flex: 1, overflowY: "auto", WebkitOverflowScrolling: "touch" }}>
            <SingleFeeGenerate/>
          </div>
        </div>
      )}



{/*       
{checkHead === 'fee_vouchers_list' && (
        <>
          <div
            style={{
              position: "fixed",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              zIndex: "100",
              backdropFilter: "blur(10px)",
              width: "100%",
              height: "100%",
              // maxWidth: "1800px",
              // maxHeight: "90vh",
              backgroundColor: "white",
              boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
              padding: "10px",
              // backgroundColor: "#f8f9fa",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                position: "sticky",
                top: 0,
                zIndex: 100,
                backgroundColor: "#EBD197",
                color: "black",
                padding: "8px 16px",
              }}
            >
              <h5 style={{ margin: 0 }}>Fee Vouchers List</h5>
              <button
                onClick={() => setCheckHead('')}
                style={{
                  position: "absolute",
                  top: "5px",
                  right: "15px",
                  background: "transparent",
                  border: "none",
                  fontSize: "20px",
                  cursor: "pointer",
                  color: "#ffc107",
                }}
              >
                &times;
              </button>
            </div>

            <div
              style={{
                padding: "20px",
                marginTop: "10px",
                width: "100%",
                overflowY: "auto",
                height:"100%",
                // maxHeight: "calc(90vh - 80px)",
                paddingTop: "5px",
              }}
            >
              <FeeVouchers/>
             
            </div>
          </div>
        </>
      )} */}


      <div className="mvg-shell">
        <style>{`
          .mvg-shell {
            display: flex; flex-direction: column; min-height: 100vh;
            background: linear-gradient(180deg, #f4f6fa 0%, #eef1f6 100%);
            font-family: "Segoe UI", system-ui, -apple-system, sans-serif;
            padding-bottom: 80px;
          }
          .mvg-head {
            background: linear-gradient(135deg, #111418 0%, #1a1f25 100%);
            color: #EBD197; padding: 16px 18px;
            border-bottom: 3px solid #EBD197;
            display: flex; align-items: center; justify-content: space-between; gap: 10px;
            flex-wrap: wrap;
          }
          .mvg-head h2 { margin: 0; font-size: 17px; font-weight: 700; display: flex; align-items: center; gap: 10px; }
          .mvg-head__btn {
            background: #EBD197; color: #1f2329; border: none;
            padding: 8px 14px; border-radius: 8px; font-size: 13px; font-weight: 700;
            cursor: pointer; display: inline-flex; align-items: center; gap: 6px;
            box-shadow: 0 2px 6px rgba(0,0,0,0.15);
          }

          .mvg-tabs { display: flex; background: #fff; border-bottom: 1px solid #e6e8eb; position: sticky; top: 0; z-index: 5; }
          .mvg-tab {
            flex: 1; padding: 14px 12px; background: transparent; border: none;
            font-size: 14px; font-weight: 600; color: #6c757d; cursor: pointer;
            display: flex; align-items: center; justify-content: center; gap: 8px;
            border-bottom: 3px solid transparent;
          }
          .mvg-tab.is-active { color: #111418; border-bottom-color: #EBD197; background: #fffaf0; }
          .mvg-tab .mvg-badge { background: #EBD197; color: #1f2329; font-size: 11px; font-weight: 700; padding: 2px 8px; border-radius: 999px; }

          .mvg-body { flex: 1; display: flex; flex-direction: row; min-height: 0; }
          .mvg-pane { flex: 1; padding: 14px; overflow-y: auto; box-sizing: border-box; }
          .mvg-pane--form { background: transparent; max-width: 460px; }
          .mvg-pane--heads { background: #fff; border-left: 1px solid #e6e8eb; }

          @media (max-width: 991px) {
            .mvg-pane--form { display: ${mobileTab === 'form' ? 'block' : 'none'}; max-width: none; }
            .mvg-pane--heads { display: ${mobileTab === 'heads' ? 'block' : 'none'}; border-left: none; }
          }
          @media (min-width: 992px) {
            .mvg-tabs { display: none; }
            .mvg-pane--form, .mvg-pane--heads { display: block; }
          }

          .mvg-card { background: #fff; border-radius: 14px; padding: 14px; border: 1px solid #e8ecf2; box-shadow: 0 2px 8px rgba(17,20,24,0.05); margin-bottom: 14px; }
          .mvg-card__title {
            font-size: 13px; font-weight: 700; color: #1f2329;
            display: flex; align-items: center; gap: 8px;
            margin: 0 0 12px 0; padding-bottom: 8px; border-bottom: 2px solid #EBD197;
          }
          .mvg-card__title i { color: #EBD197; }
          .mvg-row { margin-bottom: 12px; }
          .mvg-label { display: block; font-size: 11px; font-weight: 700; color: #6c757d; text-transform: uppercase; letter-spacing: 0.4px; margin-bottom: 5px; }
          .mvg-input {
            width: 100%; padding: 10px 12px; border: 1px solid #d0d7e2; border-radius: 8px;
            font-size: 13px; box-sizing: border-box; background: #fff; min-height: 42px;
          }
          .mvg-input:focus { outline: none; border-color: #EBD197; box-shadow: 0 0 0 3px rgba(235,209,151,0.25); }
          .mvg-input.is-invalid { border-color: #dc3545; }
          .mvg-radios { display: flex; gap: 8px; }
          .mvg-radio {
            flex: 1; padding: 9px 12px; border: 1.5px solid #d0d7e2; background: #fff;
            border-radius: 8px; font-size: 13px; font-weight: 600; color: #6c757d;
            cursor: pointer; display: inline-flex; align-items: center; justify-content: center; gap: 6px;
            -webkit-tap-highlight-color: transparent; min-height: 42px;
          }
          .mvg-radio.is-active { background: #fff8e6; border-color: #EBD197; color: #5b4a1a; }

          .mvg-select-all {
            width: 100%; padding: 10px 14px;
            background: #111418; color: #EBD197;
            border: none; border-radius: 8px;
            font-size: 13px; font-weight: 700;
            cursor: pointer; display: inline-flex; align-items: center; justify-content: center; gap: 8px;
            margin-bottom: 8px; min-height: 44px;
            transition: opacity 0.15s ease;
          }
          .mvg-select-all.is-all { background: #d4edda; color: #155724; }
          .mvg-select-all:hover { opacity: 0.9; }

          .mvg-heads-group { display: grid; gap: 6px; }
          .mvg-head-chip {
            background: #f7f9fc; border: 1.5px solid #e0e3e8; border-radius: 8px;
            padding: 10px 12px; cursor: pointer; display: flex; align-items: center; gap: 10px;
            -webkit-tap-highlight-color: transparent; transition: all 0.15s ease;
          }
          .mvg-head-chip:active { transform: scale(0.98); }
          .mvg-head-chip.is-checked {
            background: #fff8e6; border-color: #EBD197;
            box-shadow: 0 2px 6px rgba(235,209,151,0.2);
          }
          .mvg-head-chip__check {
            width: 22px; height: 22px; border-radius: 6px;
            border: 2px solid #d0d7e2; background: #fff;
            display: inline-flex; align-items: center; justify-content: center; flex-shrink: 0;
          }
          .mvg-head-chip.is-checked .mvg-head-chip__check { background: #EBD197; border-color: #EBD197; }
          .mvg-head-chip__check i { color: transparent; font-size: 12px; }
          .mvg-head-chip.is-checked .mvg-head-chip__check i { color: #1f2329; }
          .mvg-head-chip__name { font-size: 13px; font-weight: 600; color: #1f2329; flex: 1; }

          .mvg-heads-h {
            margin: 0 0 12px 0; font-size: 15px; font-weight: 700; color: #111418;
            display: flex; align-items: center; gap: 8px;
            padding-bottom: 8px; border-bottom: 2px solid #EBD197;
          }
          .mvg-search {
            width: 100%; padding: 9px 12px; border: 1px solid #d0d7e2; border-radius: 8px;
            font-size: 13px; background: #fff; box-sizing: border-box; margin-bottom: 12px;
          }
          .mvg-search:focus { outline: none; border-color: #EBD197; box-shadow: 0 0 0 3px rgba(235,209,151,0.25); }

          .mvg-table { width: 100%; border-collapse: separate; border-spacing: 0; background: #fff; border: 1px solid #e6e8eb; border-radius: 10px; overflow: hidden; font-size: 12px; }
          .mvg-table thead th {
            background: linear-gradient(135deg, #111418, #1a1f25); color: #EBD197;
            padding: 10px 12px; text-align: left; font-weight: 700; font-size: 11px;
            border-bottom: 1px solid #2a3038; white-space: nowrap;
          }
          .mvg-table tbody td { padding: 9px 12px; border-top: 1px solid #f1f3f6; vertical-align: middle; }
          .mvg-table tbody tr.is-checked td { background: #fff8e6; }
          .mvg-check {
            width: 22px; height: 22px; border-radius: 6px;
            border: 2px solid #d0d7e2; background: #fff;
            display: inline-flex; align-items: center; justify-content: center;
          }
          .mvg-check.is-checked { background: #EBD197; border-color: #EBD197; }
          .mvg-check i { color: transparent; font-size: 12px; }
          .mvg-check.is-checked i { color: #1f2329; }

          .mvg-empty { text-align: center; padding: 30px 14px; color: #9aa3af; font-size: 13px; }
          .mvg-empty i { font-size: 28px; color: #d0d7e2; display: block; margin-bottom: 8px; }

          .mvg-pagination-wrap { margin-top: 12px; display: flex; justify-content: center; }
          .mvg-pagination-wrap .pagination {
            display: inline-flex; gap: 4px; padding-left: 0; margin: 0;
            list-style: none; flex-wrap: wrap; justify-content: center;
          }
          .mvg-pagination-wrap .page-item .page-link {
            padding: 6px 10px; font-size: 12px;
            border: 1px solid #d0d7e2; color: #1f2329; background: #fff;
            border-radius: 6px; text-decoration: none; cursor: pointer; display: inline-block;
          }
          .mvg-pagination-wrap .page-item.active .page-link {
            background: #111418; color: #EBD197; border-color: #111418;
          }

          .mvg-savebar {
            position: fixed; bottom: 0; left: 0; right: 0;
            background: #fff; border-top: 1px solid #e6e8eb;
            padding: 12px 14px; box-shadow: 0 -4px 14px rgba(17,20,24,0.08);
            display: flex; gap: 10px; align-items: center; z-index: 10;
          }
          .mvg-savebar__info { flex: 1; font-size: 13px; color: #6c757d; font-weight: 600; }
          .mvg-savebar__info strong { color: #111418; }
          .mvg-save-btn {
            background: linear-gradient(135deg, #EBD197, #d4b674); color: #1f2329; border: none;
            padding: 12px 24px; border-radius: 10px; font-size: 14px; font-weight: 700; cursor: pointer;
            display: inline-flex; align-items: center; gap: 8px; min-height: 48px;
            box-shadow: 0 4px 10px rgba(235,209,151,0.35);
          }
          .mvg-save-btn:disabled { opacity: 0.55; cursor: not-allowed; }
        `}</style>

        <div className="mvg-head">
          <h2><i className="fas fa-file-invoice"></i> Multiple Voucher Generate</h2>
          <button
            type="button"
            className="mvg-head__btn"
            onClick={() => headSet('single_fee_voucher_form')}
          >
            <i className="fas fa-receipt"></i> Single Fee Voucher
          </button>
        </div>

        {/* Mobile tabs */}
        <div className="mvg-tabs">
          <button type="button" className={`mvg-tab ${mobileTab === 'form' ? 'is-active' : ''}`} onClick={() => setMobileTab('form')}>
            <i className="fas fa-edit"></i> Voucher Form
          </button>
          <button type="button" className={`mvg-tab ${mobileTab === 'heads' ? 'is-active' : ''}`} onClick={() => setMobileTab('heads')}>
            <i className="fas fa-list"></i> Heads
            {selectedItems.length > 0 && <span className="mvg-badge">{selectedItems.length}</span>}
          </button>
        </div>

        <div className="mvg-body">
          {/* FORM PANE */}
          <div className="mvg-pane mvg-pane--form">
            {/* Options */}
            <div className="mvg-card">
              <h3 className="mvg-card__title"><i className="fas fa-sliders-h"></i> Options</h3>
              <div className="mvg-row">
                <label className="mvg-label">Include Arrears</label>
                <div className="mvg-radios">
                  <button type="button" className={`mvg-radio ${editFormData.arrear_set ? 'is-active' : ''}`} onClick={() => setEditFormData({ ...editFormData, arrear_set: true })}>
                    <i className="fas fa-check"></i> Yes
                  </button>
                  <button type="button" className={`mvg-radio ${!editFormData.arrear_set ? 'is-active' : ''}`} onClick={() => setEditFormData({ ...editFormData, arrear_set: false })}>
                    <i className="fas fa-times"></i> No
                  </button>
                </div>
              </div>
              <div className="mvg-row">
                <label className="mvg-label">Include Bus Fee</label>
                <div className="mvg-radios">
                  <button type="button" className={`mvg-radio ${editFormData.bus_fee_status ? 'is-active' : ''}`} onClick={() => setEditFormData({ ...editFormData, bus_fee_status: true })}>
                    <i className="fas fa-bus"></i> Yes
                  </button>
                  <button type="button" className={`mvg-radio ${!editFormData.bus_fee_status ? 'is-active' : ''}`} onClick={() => setEditFormData({ ...editFormData, bus_fee_status: false })}>
                    <i className="fas fa-ban"></i> No
                  </button>
                </div>
              </div>
            </div>

            {/* Voucher Details */}
            <div className="mvg-card">
              <h3 className="mvg-card__title"><i className="fas fa-calendar-alt"></i> Voucher Details</h3>

              {/* Consolidated toggle */}
              <div className="mvg-row">
                <label className="mvg-label">Consolidated (Multi-Month) Voucher</label>
                <div className="mvg-radios">
                  <button
                    type="button"
                    className={`mvg-radio ${!editFormData.consolidated ? 'is-active' : ''}`}
                    onClick={() => setEditFormData({ ...editFormData, consolidated: false, to_month: editFormData.from_month })}
                  >
                    <i className="fas fa-file-invoice"></i> Single Month
                  </button>
                  <button
                    type="button"
                    className={`mvg-radio ${editFormData.consolidated ? 'is-active' : ''}`}
                    onClick={() => setEditFormData({ ...editFormData, consolidated: true })}
                  >
                    <i className="fas fa-layer-group"></i> Multi-Month
                  </button>
                </div>
              </div>

              <div className="mvg-row">
                <label className="mvg-label">{editFormData.consolidated ? 'From Month *' : 'Month *'}</label>
                <input
                  type="month"
                  className={`mvg-input ${validity.from_month ? '' : 'is-invalid'}`}
                  value={editFormData.from_month}
                  onChange={(e) => {
                    setEditFormData({
                      ...editFormData,
                      from_month: e.target.value,
                      to_month: editFormData.consolidated ? editFormData.to_month : e.target.value,
                    });
                    setValidity({ ...validity, from_month: true });
                  }}
                />
              </div>

              {editFormData.consolidated && (() => {
                const fm = editFormData.from_month;
                const tm = editFormData.to_month;
                let monthCount = 1;
                if (fm && tm) {
                  const [fy, fmm] = fm.split('-').map(Number);
                  const [ty, tmm] = tm.split('-').map(Number);
                  monthCount = Math.max(1, (ty - fy) * 12 + (tmm - fmm) + 1);
                }
                return (
                  <div className="mvg-row">
                    <label className="mvg-label">To Month *</label>
                    <input
                      type="month"
                      className="mvg-input"
                      value={editFormData.to_month}
                      min={editFormData.from_month}
                      onChange={(e) => setEditFormData({ ...editFormData, to_month: e.target.value })}
                    />
                    <div style={{ marginTop: 6, fontSize: 12, color: monthCount > 1 ? '#155724' : '#6c757d', fontWeight: 600 }}>
                      <i className="fas fa-info-circle"></i>
                      &nbsp;One voucher per student covering <strong>{monthCount}</strong> month{monthCount === 1 ? '' : 's'} — all head amounts × {monthCount}
                    </div>
                  </div>
                );
              })()}
              <div className="mvg-row">
                <label className="mvg-label">Due Date *</label>
                <input
                  type="date"
                  className={`mvg-input ${validity.due_date ? '' : 'is-invalid'}`}
                  value={editFormData.due_date}
                  onChange={(e) => {
                    setEditFormData({ ...editFormData, due_date: e.target.value });
                    setValidity({ ...validity, due_date: true });
                  }}
                />
              </div>
              <div className="mvg-row">
                <label className="mvg-label">Fine</label>
                <input
                  type="number"
                  className="mvg-input"
                  value={editFormData.fine}
                  onChange={(e) => setEditFormData({ ...editFormData, fine: e.target.value })}
                />
              </div>
              <div className="mvg-row">
                <label className="mvg-label">Remarks</label>
                <input
                  type="text"
                  className="mvg-input"
                  value={editFormData.remarks}
                  onChange={(e) => setEditFormData({ ...editFormData, remarks: e.target.value })}
                  placeholder="e.g. Tuition fee for the month"
                />
              </div>
            </div>

            {/* Classes */}
            <div className="mvg-card">
              <h3 className="mvg-card__title"><i className="fas fa-school"></i> Classes</h3>
              <button
                type="button"
                className={`mvg-select-all ${editFormData.class_id.length === getClasses.length ? 'is-all' : ''}`}
                onClick={() => {
                  const allIds = getClasses.map((cls) => cls.id);
                  const allNames = getClasses.map((cls) => `${cls.class} (${cls.section_name})`).join(', ');
                  if (editFormData.class_id.length === getClasses.length) {
                    setEditFormData({ ...editFormData, class_id: [], class_name: '' });
                  } else {
                    setEditFormData({ ...editFormData, class_id: allIds, class_name: allNames });
                  }
                  setValidity({ ...validity, class_id: true });
                }}
              >
                <i className={`fas ${editFormData.class_id.length === getClasses.length ? 'fa-times-circle' : 'fa-check-circle'}`}></i>
                {editFormData.class_id.length === getClasses.length
                  ? `Unselect All (${getClasses.length})`
                  : `Select All Classes (${getClasses.length})`}
              </button>
              <Select
                name="class_ids"
                options={classOptions}
                isMulti
                closeMenuOnSelect={false}
                hideSelectedOptions={false}
                components={customComponents}
                placeholder="Or pick specific classes…"
                value={classOptions.filter((option) => editFormData.class_id.includes(option.value))}
                onChange={(selectedOptions) => {
                  const filteredOptions = selectedOptions || [];
                  const selectedIds = filteredOptions.map((opt) => opt.value);
                  const selectedNames = filteredOptions.map((opt) => opt.label).join(', ');
                  setEditFormData({ ...editFormData, class_id: selectedIds, class_name: selectedNames });
                  setValidity({ ...validity, class_id: true });
                }}
                className={validity.class_id ? 'react-select-container' : 'react-select-container invalid-input'}
                classNamePrefix="react-select"
                styles={{ control: (b) => ({ ...b, minHeight: 42, borderRadius: 8 }) }}
              />
              <div style={{ marginTop: 8, fontSize: 12, color: '#6c757d' }}>
                <i className="fas fa-check-circle" style={{ color: '#7bc47f', marginRight: 4 }}></i>
                <strong style={{ color: '#111418' }}>{editFormData.class_id.length}</strong> of {getClasses.length} classes selected
              </div>
            </div>

            {/* Select Heads */}
            {data.length > 0 && (
              <div className="mvg-card">
                <h3 className="mvg-card__title"><i className="fas fa-wallet"></i> Select Heads</h3>
                <div className="mvg-heads-group">
                  {uniqueHeadNames.map((head_name, index) => {
                    const allInGroup = data.filter((item) => item.head_name === head_name);
                    const checked = allInGroup.every((item) => selectedItems.some((sel) => sel.id === item.id));
                    return (
                      <div
                        key={index}
                        className={`mvg-head-chip ${checked ? 'is-checked' : ''}`}
                        onClick={() => handleGroupCheckboxChange(head_name)}
                        role="checkbox"
                        aria-checked={checked}
                        tabIndex={0}
                      >
                        <span className="mvg-head-chip__check"><i className="fas fa-check"></i></span>
                        <span className="mvg-head-chip__name">{head_name}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* HEADS PANE */}
          <div className="mvg-pane mvg-pane--heads">
            <h3 className="mvg-heads-h">
              <i className="fas fa-list" style={{ color: '#EBD197' }}></i>
              Heads Detail (Category Wise)
              {selectedItems.length > 0 && (
                <span style={{ marginLeft: 'auto', fontSize: 12, color: '#6c757d', fontWeight: 600 }}>
                  {selectedItems.length} selected
                </span>
              )}
            </h3>
            <input
              type="text"
              className="mvg-search"
              placeholder="🔍 Search by head / category / shift…"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={handleKeyDown}
            />

            {data.length === 0 ? (
              <div className="mvg-empty"><i className="fas fa-spinner fa-spin"></i>Loading heads…</div>
            ) : (
              <>
                <div style={{ overflowX: 'auto' }}>
                  <table className="mvg-table">
                    <thead>
                      <tr>
                        <th style={{ width: 40, textAlign: 'center' }}>✓</th>
                        <th>Group</th>
                        <th>Head</th>
                        <th>Category</th>
                        <th>Shift</th>
                        <th style={{ textAlign: 'right' }}>Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                      {currentItems.map((head_detail, index) => {
                        const isChecked = selectedItems.some((it) => it.id === head_detail.id);
                        return (
                          <tr key={index} className={isChecked ? 'is-checked' : ''}>
                            <td style={{ textAlign: 'center' }}>
                              <span className={`mvg-check ${isChecked ? 'is-checked' : ''}`}>
                                <i className="fas fa-check"></i>
                              </span>
                            </td>
                            <td style={{ color: '#6c757d', fontSize: 11 }}>{head_detail.fee_group_name}</td>
                            <td style={{ fontWeight: 600 }}>{head_detail.head_name}</td>
                            <td>{head_detail.category}</td>
                            <td><span style={{ fontSize: 10, background: '#f1f3f6', padding: '2px 8px', borderRadius: 4, fontWeight: 600, color: '#495057' }}>{head_detail.shift}</span></td>
                            <td style={{ textAlign: 'right', fontWeight: 600 }}>{head_detail.amount}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                {pageCount > 1 && (
                  <div className="mvg-pagination-wrap">
                    <ReactPaginate
                      previousLabel={'‹'}
                      nextLabel={'›'}
                      breakLabel={'…'}
                      pageCount={pageCount}
                      marginPagesDisplayed={1}
                      pageRangeDisplayed={3}
                      onPageChange={handlePageClick}
                      containerClassName={'pagination'}
                      activeClassName={'active'}
                      pageClassName={'page-item'}
                      pageLinkClassName={'page-link'}
                      previousClassName={'page-item'}
                      previousLinkClassName={'page-link'}
                      nextClassName={'page-item'}
                      nextLinkClassName={'page-link'}
                      breakClassName={'page-item'}
                      breakLinkClassName={'page-link'}
                    />
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        {/* Sticky save bar */}
        <div className="mvg-savebar">
          <div className="mvg-savebar__info">
            <strong>{editFormData.class_id.length}</strong> classes · <strong>{selectedItems.length}</strong> heads selected
          </div>
          <button
            type="button"
            className="mvg-save-btn"
            onClick={handleSubmit}
            disabled={selectedItems.length === 0 || editFormData.class_id.length === 0}
          >
            <i className="fas fa-save"></i> Generate Vouchers
          </button>
        </div>
      </div>
    </>
  );
}

export default FeeGenerate;







