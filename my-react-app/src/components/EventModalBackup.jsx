// client/src/components/EventModal.js
import React, { useEffect, useState, useContext } from "react";
import { useAuth } from "./AuthContext";
import AcademicSessionContext from "./AcademicSessionContext";
import Select from "react-select";
import axios from "axios";
import { components } from "react-select";

const EventModal = ({ event, date, onClose, onSubmit, onDelete }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [allDay, setAllDay] = useState(false);
  const [isPublished, setIsPublished] = useState(true);
  const [getClasses, setClasses] = useState([]);

  const [getSections, setSections] = useState([]);

  const { user } = useAuth();
  const { academicSession } = useContext(AcademicSessionContext);

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

  const initialState = {
    class_id: [],
    session_id: academicSession,
    campus_id: user?.user?.campus_id,
    user_id: user?.user?.user_id,
    hidden_id: "",
  };

  const [editFormData, setEditFormData] = useState(initialState);

  useEffect(() => {
    const toLocalDatetimeString = (date) => {
      if (!date) return "";
      const localDate = new Date(date);
      localDate.setMinutes(
        localDate.getMinutes() - localDate.getTimezoneOffset()
      );
      return localDate.toISOString().slice(0, 16);
    };

    if (event) {
      setTitle(event.title);
      setDescription(event.description || "");
      setStart(
        event.start
          ? toLocalDatetimeString(event.start)
          : toLocalDatetimeString(new Date())
      );
      setEnd(
        event.end
          ? toLocalDatetimeString(event.end)
          : toLocalDatetimeString(new Date())
      );
      setAllDay(event.allDay || false);
      setIsPublished(
        event.isPublished !== undefined ? event.isPublished : true
      );
    } else if (date) {
      const dateStr = toLocalDatetimeString(date);
      setStart(dateStr);
      setEnd(dateStr);
    }
  }, [event, date]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      title,
      description,
      start,
      end,
      allDay,
      isPublished,
      class_id: editFormData.class_id,
      campus_id: user.user.campus_id,
      session_id: academicSession,
    });
  };

  useEffect(() => {
    const fetchAllClasses = () => {
      axios
        .get(
          process.env.REACT_APP_API_BASE_URL +
            `/get-classes/` +
            user.user.campus_id
        )
        .then((res) => {
          setClasses(res.data.results);
        })
        .catch((err) => console.log(err));
    };
    fetchAllClasses();
  }, [user]);

  const classOptions = getClasses.map((classes) => ({
    value: classes.id,
    label: `${classes.class} (${classes.section_name})`,
  }));

  useEffect(() => {
    if (getClasses.length > 0) {
      const allIds = event ? event.class_id : getClasses.map((classes) => classes.id);
      const allNames = getClasses
        .map((classes) => `${classes.class} (${classes.section_name})`)
        .join(", ");

      setEditFormData((prevState) => ({
        ...prevState,
        class_id: allIds,
        class_name: allNames,
      }));
    }
  }, [getClasses, event]);

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0, 0, 0, 0.6)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 1000,
        backdropFilter: "blur(3px)",
      }}
    >
      <div
        style={{
          backgroundColor: "white",
          borderRadius: "12px",
          boxShadow: "0 10px 25px rgba(0, 0, 0, 0.2)",
          width: "90%",
          maxWidth: "500px",
          padding: "25px",
          position: "relative",
          maxHeight: "90vh",
          overflowY: "auto",
        }}
      >
        <span
          style={{
            position: "absolute",
            top: "15px",
            right: "20px",
            fontSize: "28px",
            fontWeight: "bold",
            color: "#888",
            cursor: "pointer",
            transition: "color 0.2s",
          }}
          onClick={onClose}
          onMouseEnter={(e) => (e.target.style.color = "#333")}
          onMouseLeave={(e) => (e.target.style.color = "#888")}
        >
          &times;
        </span>

        <h2
          style={{
            color: "#2c3e50",
            marginBottom: "20px",
            fontSize: "24px",
            borderBottom: "2px solid #f0f0f0",
            paddingBottom: "10px",
          }}
        >
          {event ? "Edit Event" : "Add New Event"}
        </h2>

        <form
          onSubmit={handleSubmit}
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "10px",
          }}
        >
          <div className="d-flex justify-content-end">
            <button
              type="button"
              className={`btn shadow-sm text-white fw-bold border-0 ${
                editFormData.class_id.length === getClasses.length
                  ? "bg-warning"
                  : "bg-danger"
              }`}
              style={{ transition: "all 0.3s ease" }}
              onClick={() => {
                const allIds = getClasses.map((cls) => cls.id);
                const allNames = getClasses
                  .map((cls) => `${cls.class} (${cls.section_name})`)
                  .join(", ");

                if (editFormData.class_id.length === getClasses.length) {
                  // Unselect all
                  setEditFormData({
                    ...editFormData,
                    class_id: [],
                    class_name: "",
                  });
                } else {
                  // Select all
                  setEditFormData({
                    ...editFormData,
                    class_id: allIds,
                    class_name: allNames,
                  });
                }

              }}
            >
              <i
                className={`fas ${
                  editFormData.class_id.length === getClasses.length
                    ? "fa-times-circle"
                    : "fa-check-circle"
                } me-2`}
              ></i>
              {editFormData.class_id.length === getClasses.length
                ? " Unselect All Classes"
                : " Select All Classes"}
            </button>
          </div>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "8px",
            }}
          >
            <label
              style={{
                fontWeight: "600",
                color: "#2c3e50",
                fontSize: "14px",
              }}
            >
              Class:
            </label>

            <Select
              name="class_ids"
              options={classOptions} // Remove SELECT_ALL_OPTION from options
              isMulti
              closeMenuOnSelect={false}
              hideSelectedOptions={false}
              components={customComponents}
              placeholder="Select classes..."
              value={classOptions.filter((option) =>
                editFormData.class_id.includes(option.value)
              )}
              onChange={(selectedOptions) => {
                // Remove all logic related to SELECT_ALL_OPTION
                const filteredOptions = selectedOptions || [];
                const selectedIds = filteredOptions.map((opt) => opt.value);
                const selectedNames = filteredOptions
                  .map((opt) => opt.label)
                  .join(", ");

                setEditFormData({
                  ...editFormData,
                  class_id: selectedIds,
                  class_name: selectedNames,
                });

              
              }}
              className={"react-select-container"}
              classNamePrefix="react-select"
            />
          </div>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "8px",
            }}
          >
            <label
              style={{
                fontWeight: "600",
                color: "#2c3e50",
                fontSize: "14px",
              }}
            >
              Title:
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              style={{
                padding: "12px",
                border: "1px solid #ddd",
                borderRadius: "6px",
                fontSize: "16px",
                transition: "border 0.3s",
                outline: "none",
              }}
              onFocus={(e) => (e.target.style.borderColor = "#3498db")}
              onBlur={(e) => (e.target.style.borderColor = "#ddd")}
            />
          </div>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "8px",
            }}
          >
            <label
              style={{
                fontWeight: "600",
                color: "#2c3e50",
                fontSize: "14px",
              }}
            >
              Description:
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              style={{
                padding: "12px",
                border: "1px solid #ddd",
                borderRadius: "6px",
                fontSize: "16px",
                minHeight: "80px",
                resize: "vertical",
                transition: "border 0.3s",
                outline: "none",
              }}
              onFocus={(e) => (e.target.style.borderColor = "#3498db")}
              onBlur={(e) => (e.target.style.borderColor = "#ddd")}
            />
          </div>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "8px",
            }}
          >
            <label
              style={{
                fontWeight: "600",
                color: "#2c3e50",
                fontSize: "14px",
              }}
            >
              Start:
            </label>
            <input
              type="datetime-local"
              value={start}
              onChange={(e) => setStart(e.target.value)}
              required
              style={{
                padding: "12px",
                border: "1px solid #ddd",
                borderRadius: "6px",
                fontSize: "16px",
                transition: "border 0.3s",
                outline: "none",
              }}
              onFocus={(e) => (e.target.style.borderColor = "#3498db")}
              onBlur={(e) => (e.target.style.borderColor = "#ddd")}
            />
          </div>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "8px",
            }}
          >
            <label
              style={{
                fontWeight: "600",
                color: "#2c3e50",
                fontSize: "14px",
              }}
            >
              End:
            </label>
            <input
              type="datetime-local"
              value={end}
              onChange={(e) => setEnd(e.target.value)}
              required
              style={{
                padding: "12px",
                border: "1px solid #ddd",
                borderRadius: "6px",
                fontSize: "16px",
                transition: "border 0.3s",
                outline: "none",
              }}
              onFocus={(e) => (e.target.style.borderColor = "#3498db")}
              onBlur={(e) => (e.target.style.borderColor = "#ddd")}
            />
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <input
              type="checkbox"
              checked={allDay}
              onChange={(e) => setAllDay(e.target.checked)}
              style={{
                width: "18px",
                height: "18px",
                accentColor: "#3498db",
              }}
            />
            <label
              style={{
                color: "#2c3e50",
                fontSize: "14px",
              }}
            >
              All-day event
            </label>
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <input
              type="checkbox"
              checked={isPublished}
              onChange={(e) => setIsPublished(e.target.checked)}
              style={{
                width: "18px",
                height: "18px",
                accentColor: isPublished ? "#28a745" : "#6c757d",
              }}
            />
            <label
              style={{
                color: "#2c3e50",
                fontSize: "14px",
                fontWeight: "600",
              }}
            >
              Publish event (visible on calendar)
            </label>
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              gap: "12px",
              marginTop: "20px",
            }}
          >
            {event && (
              <button
                type="button"
                onClick={onDelete}
                style={{
                  padding: "10px 20px",
                  backgroundColor: "#e74c3c",
                  color: "white",
                  border: "none",
                  borderRadius: "6px",
                  cursor: "pointer",
                  fontWeight: "600",
                  transition: "all 0.2s",
                  fontSize: "14px",
                }}
                onMouseEnter={(e) =>
                  (e.target.style.backgroundColor = "#c0392b")
                }
                onMouseLeave={(e) =>
                  (e.target.style.backgroundColor = "#e74c3c")
                }
              >
                Delete
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              style={{
                padding: "10px 20px",
                backgroundColor: "#f0f0f0",
                color: "#333",
                border: "none",
                borderRadius: "6px",
                cursor: "pointer",
                fontWeight: "600",
                transition: "all 0.2s",
                fontSize: "14px",
              }}
              onMouseEnter={(e) => (e.target.style.backgroundColor = "#ddd")}
              onMouseLeave={(e) => (e.target.style.backgroundColor = "#f0f0f0")}
            >
              Cancel
            </button>
            <button
              type="submit"
              style={{
                padding: "10px 20px",
                backgroundColor: "#3498db",
                color: "white",
                border: "none",
                borderRadius: "6px",
                cursor: "pointer",
                fontWeight: "600",
                transition: "all 0.2s",
                fontSize: "14px",
              }}
              onMouseEnter={(e) => (e.target.style.backgroundColor = "#2980b9")}
              onMouseLeave={(e) => (e.target.style.backgroundColor = "#3498db")}
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EventModal;
