// AcademicSessionContext.js
import React, { createContext, useState } from 'react';

const AcademicSessionContext = createContext();

export const AcademicSessionProvider = ({ children }) => {
  const [academicSession, setAcademicSession] = useState('');
  const [classSession, setClassSession] = useState('');

  return (
    <AcademicSessionContext.Provider value={{ academicSession, setAcademicSession, classSession, setClassSession }}>
      {children}
    </AcademicSessionContext.Provider>
  );
};

export default AcademicSessionContext;
