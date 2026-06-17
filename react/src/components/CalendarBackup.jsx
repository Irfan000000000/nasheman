// // client/src/components/Calendar.js
// import React, { useState, useEffect } from 'react';
// import FullCalendar from '@fullcalendar/react';
// import dayGridPlugin from '@fullcalendar/daygrid';
// import timeGridPlugin from '@fullcalendar/timegrid';
// import interactionPlugin from '@fullcalendar/interaction';
// import axios from 'axios';
// import EventModal from './EventModal';

// const Calendar = () => {
//   const [events, setEvents] = useState([]);
//   const [showModal, setShowModal] = useState(false);
//   const [selectedEvent, setSelectedEvent] = useState(null);
//   const [selectedDate, setSelectedDate] = useState(null);

//   // Fetch events from backend
//   useEffect(() => {
//     fetchEvents();
//   }, []);

// const fetchEvents = async () => {
//   try {
//     const response = await axios.get(process.env.REACT_APP_API_BASE_URL+'/api/events');
//     setEvents(response.data.map(event => ({
//       id: event.id,
//       title: event.title,
//       start: event.start ? new Date(event.start) : new Date(), // Ensure Date object
//       end: event.end ? new Date(event.end) : new Date(),       // Ensure Date object
//       allDay: event.allDay,
//       description: event.description || ''                     // Ensure description exists
//     })));
//   } catch (error) {
//     console.error('Error fetching events:', error);
//   }
// };

//   const handleDateClick = (arg) => {
//     setSelectedEvent(null);
//     setSelectedDate(arg.date);
//     setShowModal(true);
//   };



// const handleEventClick = (arg) => {
//   const event = arg.event;
//   setSelectedEvent({
//     id: event.id,
//     title: event.title,
//     start: event.start ? event.start : new Date(), // Fallback to current date if null
//     end: event.end ? event.end : new Date(),       // Fallback to current date if null
//     allDay: event.allDay,
//     description: event.extendedProps.description || '' // Ensure description exists
//   });
//   setShowModal(true);
// };



//   const handleEventSubmit = async (eventData) => {
//     try {
//       if (selectedEvent) {
//         // Update existing event
//         await axios.put(process.env.REACT_APP_API_BASE_URL+`/api/events/${selectedEvent.id}`, eventData);
//       } else {
//         // Create new event
//         await axios.post(process.env.REACT_APP_API_BASE_URL+'/api/events', eventData);
//       }
//       fetchEvents();
//       setShowModal(false);
//     } catch (error) {
//       console.error('Error saving event:', error);
//     }
//   };

//   const handleDeleteEvent = async () => {
//     try {
//       await axios.delete(process.env.REACT_APP_API_BASE_URL+`/api/events/${selectedEvent.id}`);
//       fetchEvents();
//       setShowModal(false);
//     } catch (error) {
//       console.error('Error deleting event:', error);
//     }
//   };

//   return (
//     <div className="calendar-container">
//       <FullCalendar
//         plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
//         initialView="dayGridMonth"
//         headerToolbar={{
//           left: 'prev,next today',
//           center: 'title',
//           right: 'dayGridMonth,timeGridWeek,timeGridDay'
//         }}
//         events={events}
//         dateClick={handleDateClick}
//         eventClick={handleEventClick}
//         editable={true}
//         selectable={true}
//       />

//       {showModal && (
//         <EventModal
//           event={selectedEvent}
//           date={selectedDate}
//           onClose={() => setShowModal(false)}
//           onSubmit={handleEventSubmit}
//           onDelete={handleDeleteEvent}
//         />
//       )}
//     </div>
//   );
// };

// export default Calendar;


// client/src/components/Calendar.js
// import React, { useState, useEffect } from 'react';
// import FullCalendar from '@fullcalendar/react';
// import dayGridPlugin from '@fullcalendar/daygrid';
// import timeGridPlugin from '@fullcalendar/timegrid';
// import interactionPlugin from '@fullcalendar/interaction';
// import axios from 'axios';
// import EventModal from './EventModal';

// const Calendar = () => {
//   const [events, setEvents] = useState([]);
//   const [showModal, setShowModal] = useState(false);
//   const [selectedEvent, setSelectedEvent] = useState(null);
//   const [selectedDate, setSelectedDate] = useState(null);

//   // Fetch events from backend
//   useEffect(() => {
//     fetchEvents();
//   }, []);

//   const fetchEvents = async () => {
//     try {
//       const response = await axios.get(process.env.REACT_APP_API_BASE_URL+'/api/events');
//       setEvents(response.data.map(event => ({
//         id: event.id,
//         title: event.title,
//         start: event.start ? new Date(event.start) : new Date(),
//         end: event.end ? new Date(event.end) : new Date(),
//         allDay: event.allDay,
//         description: event.description || '',
//         backgroundColor: event.color || '#667eea'
//       })));
//     } catch (error) {
//       console.error('Error fetching events:', error);
//     }
//   };

//   const handleDateClick = (arg) => {
//     setSelectedEvent(null);
//     setSelectedDate(arg.date);
//     setShowModal(true);
//   };

//   const handleEventClick = (arg) => {
//     const event = arg.event;
//     setSelectedEvent({
//       id: event.id,
//       title: event.title,
//       start: event.start ? event.start : new Date(),
//       end: event.end ? event.end : new Date(),
//       allDay: event.allDay,
//       description: event.extendedProps.description || '',
//       color: event.backgroundColor
//     });
//     setShowModal(true);
//   };

//   const handleEventSubmit = async (eventData) => {
//     try {
//       if (selectedEvent) {
//         await axios.put(process.env.REACT_APP_API_BASE_URL+`/api/events/${selectedEvent.id}`, eventData);
//       } else {
//         await axios.post(process.env.REACT_APP_API_BASE_URL+'/api/events', eventData);
//       }
//       fetchEvents();
//       setShowModal(false);
//     } catch (error) {
//       console.error('Error saving event:', error);
//     }
//   };

//   const handleDeleteEvent = async () => {
//     try {
//       await axios.delete(process.env.REACT_APP_API_BASE_URL+`/api/events/${selectedEvent.id}`);
//       fetchEvents();
//       setShowModal(false);
//     } catch (error) {
//       console.error('Error deleting event:', error);
//     }
//   };

//   return (
//     <div style={{
//       padding: '2rem',
//       maxWidth: '1200px',
//       margin: '0 auto',
//       fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
//     }}>
//       <div style={{
//         backgroundColor: '#ffffff',
//         borderRadius: '12px',
//         boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
//         padding: '20px',
//         marginBottom: '20px'
//       }}>
//         <h1 style={{
//           color: '#4a5568',
//           margin: '0 0 20px 0',
//           fontWeight: '600',
//           fontSize: '1.8rem'
//         }}>Event Calendar</h1>
        
//         <FullCalendar
//           plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
//           initialView="dayGridMonth"
//           headerToolbar={{
//             left: 'prev,next today',
//             center: 'title',
//             right: 'dayGridMonth,timeGridWeek,timeGridDay'
//           }}
//           events={events}
//           dateClick={handleDateClick}
//           eventClick={handleEventClick}
//           editable={true}
//           selectable={true}
//         //   height="80vh"
//           contentHeight="auto"
//           dayMaxEvents={true}
//           nowIndicator={true}
//           eventDisplay="block"
//           eventTimeFormat={{
//             hour: '2-digit',
//             minute: '2-digit',
//             meridiem: 'short'
//           }}
//           styles={{
//             '& .fc-header-toolbar': {
//               marginBottom: '1em'
//             },
//             '& .fc-day-header': {
//               padding: '10px',
//               backgroundColor: '#f8fafc',
//               borderColor: '#e2e8f0',
//               color: '#4a5568',
//               fontWeight: '600',
//               textTransform: 'uppercase',
//               fontSize: '0.8em'
//             },
//             '& .fc-day': {
//               borderColor: '#e2e8f0',
//               transition: 'all 0.2s ease',
//               '&:hover': {
//                 backgroundColor: '#f8fafc'
//               }
//             },
//             '& .fc-event': {
//               cursor: 'pointer',
//               transition: 'all 0.2s ease',
//               border: 'none',
//               borderRadius: '6px',
//               padding: '4px 8px',
//               fontSize: '0.85em',
//               margin: '2px 0',
//               borderLeft: '3px solid rgba(255,255,255,0.5)',
//               '&:hover': {
//                 opacity: 0.9,
//                 boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
//               }
//             },
//             '& .fc-today': {
//               backgroundColor: 'rgba(102, 126, 234, 0.1)'
//             },
//             '& .fc-button': {
//               backgroundColor: '#667eea',
//               borderColor: '#667eea',
//               color: '#fff',
//               borderRadius: '6px',
//               padding: '6px 12px',
//               fontSize: '0.9em',
//               fontWeight: '500',
//               '&:hover': {
//                 backgroundColor: '#5a67d8',
//                 borderColor: '#5a67d8'
//               },
//               '&:active': {
//                 backgroundColor: '#4c51bf',
//                 borderColor: '#4c51bf'
//               }
//             },
//             '& .fc-button-primary:not(:disabled).fc-button-active': {
//               backgroundColor: '#4c51bf',
//               borderColor: '#4c51bf'
//             }
//           }}
//         />
//       </div>

//       {showModal && (
//         <EventModal
//           event={selectedEvent}
//           date={selectedDate}
//           onClose={() => setShowModal(false)}
//           onSubmit={handleEventSubmit}
//           onDelete={handleDeleteEvent}
//         />
//       )}
//     </div>
//   );
// };

// export default Calendar;








// client/src/components/Calendar.js
import React, { useState, useEffect, useContext } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import axios from 'axios';
import EventModal from './EventModal';
import { FiList, FiX, FiEdit2, FiTrash2 } from 'react-icons/fi';
import { useAuth } from "./AuthContext";
import AcademicSessionContext from "./AcademicSessionContext"
const Calendar = () => {
  const [events, setEvents] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [showEventList, setShowEventList] = useState(false);
  const [filter, setFilter] = useState('all'); // 'all', 'published', 'unpublished'

  const [isFetchEvent, setIsFetchData] = useState(false);

     const { user } = useAuth();
      const { academicSession } = useContext(AcademicSessionContext);
    


  useEffect(() => {
    // console.log(showEventList);
    if(showEventList && events.length === 0) {
      fetchEvents();
    }
  }, [showEventList]);


  useEffect(() => {
    // console.log(showEventList);
    if(!isFetchEvent){
        fetchEvents();
        setIsFetchData(true);
    }
     
  }, [showEventList]);

  // const fetchEvents = async () => {
  //   try {
  //     const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/events/${user.user.campus_id}/${academicSession}`);

  //     console.log(new Date(response.data[0].end).toISOString());
    
  //     setEvents(response.data.map(event => ({
  //       id: event.id,
  //       title: event.title,
  //       start: event.start ? new Date(event.start).toISOString() : new Date(),
  //       end: event.end ? new Date(event.end).toISOString() : new Date(),
  //       allDay: event.allDay,
  //       description: event.description || '',
  //       backgroundColor: event.color || (event.isPublished ? '#667eea' : '#6c757d'),
  //       isPublished: event.isPublished || false,
  //       class_id: event.class_id || []
  //     })));
  //   } catch (error) {
  //     console.error('Error fetching events:', error);
  //   }
  // };




const fetchEvents = async () => {
  try {
    const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/events/${user.user.campus_id}/${academicSession}`);

    // console.log(moment.tz(response.data[0].end, 'Asia/Karachi').toDate())
    setEvents(response.data.map(event => ({
      id: event.id,
      title: event.title,
      start: event.start ? new Date(event.start) : new Date(),
        end: event.end ? new Date(event.end) : null,
      allDay: event.allDay,
      description: event.description || '',
      backgroundColor: event.color || (event.isPublished ? '#667eea' : '#6c757d'),
      isPublished: event.isPublished || false,
      class_id: event.class_id || []
    })));
  } catch (error) {
    console.error('Error fetching events:', error);
  }
};

  const handleDateClick = (arg) => {
    setSelectedEvent(null);
    setSelectedDate(arg.date);
    setShowModal(true);
  };

  const handleEventClick = (arg) => {
    const event = arg.event;
    console.log(event.end);
    // console.log(event.extendedProps.class_id);
    setSelectedEvent({
      id: event.id,
      title: event.title,
      start: event.start ? event.start : new Date(),
      end: event.end ? event.end : new Date(),
      allDay: event.allDay,
      description: event.extendedProps.description || '',
      color: event.backgroundColor,
      isPublished: event.extendedProps.isPublished || false,
      class_id: event.extendedProps.class_id || [] // Make sure this is included
    });
    setShowModal(true);
  };

  const handleEventSubmit = async (eventData) => {
    try {
      if (selectedEvent) {
        await axios.put(`${process.env.REACT_APP_API_BASE_URL}/api/events/${selectedEvent.id}`, eventData);
      } else {
        await axios.post(`${process.env.REACT_APP_API_BASE_URL}/api/events`, eventData);
      }
      fetchEvents();
      setShowModal(false);
    } catch (error) {
      console.error('Error saving event:', error);
    }
  };

  const handleDeleteEvent = async (eventId) => {
    try {
      await axios.delete(`${process.env.REACT_APP_API_BASE_URL}/api/events/${eventId}`);
      fetchEvents();
      if (selectedEvent?.id === eventId) {
        setShowModal(false);
      }
    } catch (error) {
      console.error('Error deleting event:', error);
    }
  };

  const filteredEvents = events.filter(event => {
    if (filter === 'published') return event.isPublished;
    if (filter === 'unpublished') return !event.isPublished;
    return true;
  });

  return (
    <div style={{
      paddingTop: '2rem',
      // maxWidth: '1400px',
      margin: '0 auto',
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      // background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
      // minHeight: '100vh',
      position: 'relative'
    }}>
      <button 
        onClick={() => setShowEventList(!showEventList)}
        style={{
          position: 'absolute',
          top: '20px',
          right: '20px',
          zIndex: 10,
          backgroundColor: '#EBD197',
          color: 'black',
          border: 'none',
          borderRadius: '6px',
          padding: '10px 15px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          cursor: 'pointer',
          fontWeight: '600',
          boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
        }}
      >
        {showEventList ? <FiX size={18} /> : <FiList size={18} />}
        {showEventList ? 'Hide List' : 'Show Event List'}
      </button>

      <div style={{
        display: 'flex',
        // gap: '20px',
        transition: 'all 0.3s ease'
      }}>
        <div style={{
          flex: showEventList ? '0 0 300px' : '0 0 0',
          overflow: 'hidden',
          transition: 'all 0.3s ease',
          height: showEventList ? 'auto' : 0,
          opacity: showEventList ? 1 : 0
        }}>
          <div style={{
            backgroundColor: '#ffffff',
            borderRadius: '12px',
            boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
            padding: '20px',
            marginBottom: '20px',
            height: '80vh',
            overflowY: 'auto'
          }}>
            <h2 style={{
              color: '#4a5568',
              marginBottom: '20px',
              display: 'flex',
              alignItems: 'center',
              gap: '10px'
            }}>
              <FiList size={20} />
              Event List
            </h2>
            
            <div style={{
              display: 'flex',
              gap: '10px',
              marginBottom: '20px'
            }}>
              <button
                onClick={() => setFilter('all')}
                style={{
                  padding: '8px 12px',
                  backgroundColor: filter === 'all' ? '#667eea' : '#e2e8f0',
                  color: filter === 'all' ? 'white' : '#4a5568',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '14px'
                }}
              >
                All
              </button>
              <button
                onClick={() => setFilter('published')}
                style={{
                  padding: '8px 12px',
                  backgroundColor: filter === 'published' ? '#28a745' : '#e2e8f0',
                  color: filter === 'published' ? 'white' : '#4a5568',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '14px'
                }}
              >
                Published
              </button>
              <button
                onClick={() => setFilter('unpublished')}
                style={{
                  padding: '8px 12px',
                  backgroundColor: filter === 'unpublished' ? '#6c757d' : '#e2e8f0',
                  color: filter === 'unpublished' ? 'white' : '#4a5568',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '14px'
                }}
              >
                Unpublished
              </button>
            </div>

            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '10px'
            }}>
              {filteredEvents.length === 0 ? (
                <p style={{ color: '#6c757d', textAlign: 'center' }}>No events found</p>
              ) : (
                filteredEvents.map(event => (
                  <div key={event.id} style={{
                    backgroundColor: event.isPublished ? 'rgba(102, 126, 234, 0.1)' : 'rgba(108, 117, 125, 0.1)',
                    padding: '12px',
                    borderRadius: '8px',
                    borderLeft: `4px solid ${event.backgroundColor}`,
                    position: 'relative'
                  }}>
                    <h3 style={{
                      margin: '0 0 5px 0',
                      color: '#2c3e50',
                      fontSize: '16px'
                    }}>
                      {event.title}
                    </h3>
                    <p style={{
                      margin: '0 0 5px 0',
                      color: '#6c757d',
                      fontSize: '14px'
                    }}>
                      {event.start.toLocaleString()}
                      {event.end && ` - ${event.end.toLocaleString()}`}
                    </p>
                    {event.description && (
                      <p style={{
                        margin: '0 0 5px 0',
                        color: '#6c757d',
                        fontSize: '14px',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis'
                      }}>
                        {event.description}
                      </p>
                    )}
                    <div style={{
                      display: 'flex',
                      gap: '8px',
                      marginTop: '10px'
                    }}>
                      <button
                        onClick={() => {
                          setSelectedEvent({
                            id: event.id,
                            title: event.title,
                            start: event.start,
                            end: event.end,
                            allDay: event.allDay,
                            description: event.description,
                            isPublished: event.isPublished
                          });
                          setShowModal(true);
                        }}
                        style={{
                          padding: '5px 10px',
                          backgroundColor: '#ffc107',
                          color: 'white',
                          border: 'none',
                          borderRadius: '4px',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '5px',
                          fontSize: '12px'
                        }}
                      >
                        <FiEdit2 size={14} />
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteEvent(event.id)}
                        style={{
                          padding: '5px 10px',
                          backgroundColor: '#e74c3c',
                          color: 'white',
                          border: 'none',
                          borderRadius: '4px',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '5px',
                          fontSize: '12px'
                        }}
                      >
                        <FiTrash2 size={14} />
                        Delete
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        <div style={{
          flex: 1,
          backgroundColor: '#ffffff',
          borderRadius: '12px',
          boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
          padding: '20px',
          marginBottom: '20px',
          transition: 'all 0.3s ease',
          width: showEventList ? 'calc(100% - 320px)' : '100%'
        }}>
          <h1 style={{
            color: '#4a5568',
            margin: '0 0 20px 0',
            fontWeight: '600',
            fontSize: '1.8rem'
          }}>
            Event Calendar
          </h1>
          
          <FullCalendar
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
            initialView="dayGridMonth"
            headerToolbar={{
              left: 'prev,next today',
              center: 'title',
              right: 'dayGridMonth,timeGridWeek,timeGridDay'
            }}
            events={events.filter(event => event.isPublished)}
            dateClick={handleDateClick}
            eventClick={handleEventClick}
            editable={true}
            selectable={true}
            height="80vh"
            contentHeight="auto"
            dayMaxEvents={true}
            nowIndicator={true}
            eventDisplay="block"
            eventTimeFormat={{
              hour: '2-digit',
              minute: '2-digit',
              meridiem: 'short'
            }}
            eventDidMount={(arg) => {
              if (!arg.event.extendedProps.isPublished) {
                arg.el.style.opacity = '0.6';
                arg.el.style.borderLeft = '3px dashed rgba(255,255,255,0.5)';
              }
            }}
          />
        </div>
      </div>

      {showModal && (
        <EventModal
          event={selectedEvent}
          date={selectedDate}
          onClose={() => setShowModal(false)}
          onSubmit={handleEventSubmit}
          onDelete={() => handleDeleteEvent(selectedEvent.id)}
        />
      )}
    </div>
  );
};

export default Calendar;