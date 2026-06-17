// src/SessionsContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from './AuthContext'; // Import useAuth from AuthContext
const SessionsContext = createContext();

export const useSessions = () => useContext(SessionsContext);

export const SessionsProvider = ({ children }) => {

  const { user } = useAuth(); // Access user from AuthContext

  const [getSessions, setSessions] = useState([]);

  useEffect(() => {

    if (user && user.user.user_type !== "Student") {
    console.log("Fetching sessions...");
    // Fetch sessions only once when component mounts
    const fetchSessions = () => {
      axios.get(process.env.REACT_APP_API_BASE_URL+"/get-sessions")
        .then(res => {

          var sessions = res.data.results;
          sessions.sort((a, b) => {
            // Extract the start year from session_name
            const startYearA = parseInt(a.session_name.split('-')[0], 10);
            const startYearB = parseInt(b.session_name.split('-')[0], 10);
        
            return startYearA - startYearB;
        });

        
          setSessions(sessions);
          console.log("Sessions fetched:", res.data.results);
        })
        .catch(err => console.log("Error fetching sessions:", err));
    };
    fetchSessions();
  }

  }, [user]);




  useEffect(() => {
    if (user && user.user.user_type === "Student") {
      console.log("Fetching sessions...");
      // Fetch sessions only once when component mounts
      const fetchSessionsClasses = () => {
        axios.get(`${process.env.REACT_APP_API_BASE_URL}/get-student-lms-classes/${user.user.student_unique_id}`)
          .then(res => {
            var sessions = res.data.results;
            // console.log(class_session);

            sessions.sort((a, b) => {
              // Extract the start year from session_name
              const startYearA = parseInt(a.session_name.split('-')[0], 10);
              const startYearB = parseInt(b.session_name.split('-')[0], 10);
              return startYearA - startYearB;
            });
  
            setSessions(sessions);
            // console.log("Sessions fetched:", res.data.results);
          })
          .catch(err => console.log("Error fetching sessions:", err));
      };
      fetchSessionsClasses();
    }
  }, [user]);
  



  return (
    <SessionsContext.Provider value={{ getSessions, setSessions }}>
      {children}
    </SessionsContext.Provider>
  );
};
