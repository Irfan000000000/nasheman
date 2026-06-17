// import React, { useRef } from 'react';
// import { useReactToPrint } from 'react-to-print';

// const CharacterCertificate = ({ admissionData, onClose }) => {
//   const componentRef = useRef();

//   const handlePrint = useReactToPrint({
//     content: () => componentRef.current,
//   });

//   const getMonthYear = () => {
//     const date = new Date();
//     return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
//   };

//   return (
//     <div className="col-12">
//       <div
//         className="slc-modal-overlay"
//         style={{
//           position: "fixed",
//           top: 0,
//           left: 0,
//           right: 0,
//           bottom: 0,
//           backgroundColor: "rgba(0, 0, 0, 0.7)",
//           zIndex: "999",
//           display: "flex",
//           alignItems: "center",
//           justifyContent: "center",
//           padding: "20px",
//         }}
//       >
//         <style>
//           {`
//             .slc-scroll-container::-webkit-scrollbar {
//               width: 8px;
//             }
//             .slc-scroll-container::-webkit-scrollbar-track {
//               background: #f1f1f1;
//               border-radius: 10px;
//             }
//             .slc-scroll-container::-webkit-scrollbar-thumb {
//               background: #888;
//               border-radius: 10px;
//             }
//             .slc-scroll-container::-webkit-scrollbar-thumb:hover {
//               background: #555;
//             }

//             @media print {
//               body * {
//                 visibility: hidden;
//               }
              
//               .slc-certificate-wrapper, .slc-certificate-wrapper * {
//                 visibility: visible;
//               }
              
//               .slc-certificate-wrapper {
//                 position: absolute;
//                 left: 0;
//                 top: 0;
//                 width: 210mm;
//                 height: 297mm;
//                 margin: 0;
//                 padding: 0;
//               }
              
//               .slc-modal-overlay {
//                 background: white !important;
//                 position: static !important;
//                 padding: 0 !important;
//               }
              
//               .print-hide {
//                 display: none !important;
//               }
              
//               .slc-scroll-container {
//                 overflow: visible !important;
//                 max-height: none !important;
//                 box-shadow: none !important;
//               }

//               @page {
//                 size: A4 portrait;
//                 margin: 0;
//               }
//             }
//           `}
//         </style>

//         <div
//           className="slc-scroll-container"
//           style={{
//             backgroundColor: "white",
//             borderRadius: "8px",
//             maxWidth: "850px",
//             width: "100%",
//             maxHeight: "95vh",
//             overflowY: "auto",
//             boxShadow: "0 20px 60px rgba(0, 0, 0, 0.3)",
//             position: "relative",
//           }}
//         >
//           <button
//             onClick={onClose}
//             className="print-hide"
//             style={{
//               position: "absolute",
//               top: "15px",
//               right: "15px",
//               color: "black",
//               border: "none",
//               width: "40px",
//               height: "40px",
//               borderRadius: "50%",
//               fontSize: "24px",
//               cursor: "pointer",
//               zIndex: "1000",
//               display: "flex",
//               alignItems: "center",
//               justifyContent: "center",
//               fontWeight: "bold",
//               transition: "all 0.2s",
//             }}
//           >
//             ×
//           </button>

//           <div
//             ref={componentRef}
//             className="slc-certificate-wrapper"
//             style={{
//               padding: "40px",
//               minHeight: "auto",
//               paddingBottom: "0px",
//             }}
//           >
//             <div style={{ padding: "60px 40px" }}>
//               {/* Header */}
//               <div style={{ textAlign: "center", marginBottom: "30px" }}>
//                 <div style={{ marginBottom: "15px" }}>
//                   <img 
//                     src={process.env.REACT_APP_BASE_URL + `/uploads/nasheman_logo.png`}
//                     alt="School Logo" 
//                     style={{
//                       width: "100px",
//                       height: "100px",
//                       margin: "0 auto",
//                       display: "block"
//                     }}
//                   />
//                 </div>
//                 <h3 style={{
//                   fontSize: "14px",
//                   fontWeight: "600",
//                   color: "#374151",
//                   margin: "8px 0"
//                 }}>
//                   NASHEMAN SCHOOL & COLLEGE FOR SPECIAL
//                 </h3>
//                 <h4 style={{
//                   fontSize: "12px",
//                   color: "#6b7280",
//                   margin: "4px 0"
//                 }}>
//                   Education and Rehabilitation Wah Cantt
//                 </h4>
//                 <div style={{
//                   marginTop: "20px",
//                   paddingTop: "20px",
//                   borderTop: "2px solid #1f2937"
//                 }}></div>
//               </div>

//               {/* Title */}
//               <div style={{ textAlign: "center", marginBottom: "40px" }}>
//                 <h1 style={{
//                   fontSize: "32px",
//                   fontWeight: "bold",
//                   color: "#1f2937",
//                   textDecoration: "underline",
//                   textUnderlineOffset: "8px",
//                   textDecorationThickness: "2px",
//                   margin: "0"
//                 }}>
//                   CHARACTER CERTIFICATE
//                 </h1>
//               </div>

//               {/* Content */}
//               <div style={{
//                 textAlign: "justify",
//                 lineHeight: "2",
//                 color: "#1f2937",
//                 marginBottom: "80px",
//                 fontSize: "15px"
//               }}>
//                 <p style={{ marginBottom: "24px" }}>
//                   It is certified that <span style={{ fontWeight: "bold", textTransform: "uppercase" }}>{admissionData.full_name}</span> D/O <span style={{ fontWeight: "bold", textTransform: "uppercase" }}>{admissionData.father_name}</span> was a bonafide student of Nasheman School/College for Special Education & Rehabilitation Center Wah Cantt and {admissionData.gender === 'Female' ? 'she' : 'he'} passed {admissionData.gender === 'Female' ? 'her' : 'his'} {admissionData.class_name} in {new Date().getFullYear()}. {admissionData.gender === 'Female' ? 'She' : 'He'} was Punctual, Obedient and Hardworking student. We wish {admissionData.gender === 'Female' ? 'her' : 'him'} best of luck in future.
//                 </p>
//               </div>

//               {/* Signature */}
//               <div style={{ display: "flex", justifyContent: "flex-end" }}>
//                 <div style={{ textAlign: "right" }}>
//                   <div style={{ marginBottom: "80px" }}></div>
//                   <div style={{
//                     borderTop: "2px solid #1f2937",
//                     paddingTop: "10px",
//                     minWidth: "200px"
//                   }}>
//                     <p style={{
//                       margin: "0",
//                       fontWeight: "bold",
//                       color: "#1f2937"
//                     }}>Principal</p>
//                     <p style={{
//                       margin: "4px 0",
//                       fontSize: "14px",
//                       color: "#374151"
//                     }}>Nasheman College</p>
//                     <p style={{
//                       margin: "4px 0",
//                       fontSize: "14px",
//                       color: "#6b7280"
//                     }}>(Miss Sajeela Khan)</p>
//                     <p style={{
//                       margin: "4px 0",
//                       fontSize: "14px",
//                       color: "#6b7280"
//                     }}>{getMonthYear()}</p>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>

//           <div className="print-hide" style={{ padding: "20px", textAlign: "center" }}>
//             <button
//               onClick={handlePrint}
//               className="btn btn-sm btn-primary"
//             >
//               <i className="fa fa-print" aria-hidden="true"></i> Print Certificate
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default CharacterCertificate;



import React, { useRef, useState } from 'react';
import { useReactToPrint } from 'react-to-print';

const CharacterCertificate = ({ admissionData, onClose }) => {
  const componentRef = useRef();
  const [customGrade, setCustomGrade] = useState('');

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

  const getMonthYear = () => {
    const date = new Date();
    return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  };

  return (
    <div className="col-12">
      <div
        className="slc-modal-overlay"
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: "rgba(0, 0, 0, 0.7)",
          zIndex: "999",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "20px",
        }}
      >
        <style>
          {`
            .slc-scroll-container::-webkit-scrollbar {
              width: 8px;
            }
            .slc-scroll-container::-webkit-scrollbar-track {
              background: #f1f1f1;
              border-radius: 10px;
            }
            .slc-scroll-container::-webkit-scrollbar-thumb {
              background: #888;
              border-radius: 10px;
            }
            .slc-scroll-container::-webkit-scrollbar-thumb:hover {
              background: #555;
            }

            @media print {
              body * {
                visibility: hidden;
              }
              
              .slc-certificate-wrapper, .slc-certificate-wrapper * {
                visibility: visible;
              }
              
              .slc-certificate-wrapper {
                position: absolute;
                left: 0;
                top: 0;
                width: 210mm;
                height: 297mm;
                margin: 0;
                padding: 0;
              }
              
              .slc-modal-overlay {
                background: white !important;
                position: static !important;
                padding: 0 !important;
              }
              
              .print-hide {
                display: none !important;
              }
              
              .slc-scroll-container {
                overflow: visible !important;
                max-height: none !important;
                box-shadow: none !important;
              }

              @page {
                size: A4 portrait;
                margin: 0;
              }
            }
          `}
        </style>

        <div
          className="slc-scroll-container"
          style={{
            backgroundColor: "white",
            borderRadius: "8px",
            maxWidth: "850px",
            width: "100%",
            maxHeight: "95vh",
            overflowY: "auto",
            boxShadow: "0 20px 60px rgba(0, 0, 0, 0.3)",
            position: "relative",
          }}
        >
          <button
            onClick={onClose}
            className="print-hide"
            style={{
              position: "absolute",
              top: "15px",
              right: "15px",
              color: "black",
              border: "none",
              width: "40px",
              height: "40px",
              borderRadius: "50%",
              fontSize: "24px",
              cursor: "pointer",
              zIndex: "1000",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: "bold",
              transition: "all 0.2s",
            }}
          >
            ×
          </button>

          {/* Input field for custom grade - only visible on screen */}
          <div className="print-hide" style={{ padding: "20px", borderBottom: "1px solid #e5e7eb" }}>
            <label style={{ 
              display: "block", 
              marginBottom: "8px", 
              fontWeight: "600",
              color: "#374151"
            }}>
              Custom Grade/Class:
            </label>
            <input
              type="text"
              value={customGrade}
              onChange={(e) => setCustomGrade(e.target.value)}
              placeholder="e.g., 10th Grade, A+ Grade, Matric"
              style={{
                width: "100%",
                padding: "10px 12px",
                border: "1px solid #d1d5db",
                borderRadius: "6px",
                fontSize: "14px",
                outline: "none",
                transition: "border-color 0.2s"
              }}
              onFocus={(e) => e.target.style.borderColor = "#3b82f6"}
              onBlur={(e) => e.target.style.borderColor = "#d1d5db"}
            />
            <small style={{ color: "#6b7280", fontSize: "12px", display: "block", marginTop: "4px" }}>
              This will appear in the certificate after "he/she passed his/her"
            </small>
          </div>

          <div
            ref={componentRef}
            className="slc-certificate-wrapper"
            style={{
              padding: "40px",
              minHeight: "auto",
              paddingBottom: "0px",
            }}
          >
            <div style={{ padding: "60px 40px" }}>
              {/* Header */}
              <div style={{ textAlign: "center", marginBottom: "30px" }}>
                <div style={{ marginBottom: "15px" }}>
                  <img 
                    src={process.env.REACT_APP_BASE_URL + `/uploads/nasheman_logo.png`}
                    alt="School Logo" 
                    style={{
                      width: "100px",
                      height: "100px",
                      margin: "0 auto",
                      display: "block"
                    }}
                  />
                </div>
                <h3 style={{
                  fontSize: "14px",
                  fontWeight: "600",
                  color: "#374151",
                  margin: "8px 0"
                }}>
                  NASHEMAN SCHOOL & COLLEGE FOR SPECIAL
                </h3>
                <h4 style={{
                  fontSize: "12px",
                  color: "#6b7280",
                  margin: "4px 0"
                }}>
                  Education and Rehabilitation Wah Cantt
                </h4>
                <div style={{
                  marginTop: "20px",
                  paddingTop: "20px",
                  borderTop: "2px solid #1f2937"
                }}></div>
              </div>

              {/* Title */}
              <div style={{ textAlign: "center", marginBottom: "40px" }}>
                <h1 style={{
                  fontSize: "32px",
                  fontWeight: "bold",
                  color: "#1f2937",
                  textDecoration: "underline",
                  textUnderlineOffset: "8px",
                  textDecorationThickness: "2px",
                  margin: "0"
                }}>
                  CHARACTER CERTIFICATE
                </h1>
              </div>

              {/* Content */}
              <div style={{
                textAlign: "justify",
                lineHeight: "2",
                color: "#1f2937",
                marginBottom: "80px",
                fontSize: "15px"
              }}>
                <p style={{ marginBottom: "24px" }}>
                  It is certified that <span style={{ fontWeight: "bold", textTransform: "uppercase" }}>{admissionData.full_name}</span> D/O <span style={{ fontWeight: "bold", textTransform: "uppercase" }}>{admissionData.father_name}</span> was a bonafide student of Nasheman School/College for Special Education & Rehabilitation Center Wah Cantt and {admissionData.gender === 'Female' ? 'she' : 'he'} passed {admissionData.gender === 'Female' ? 'her' : 'his'} <span style={{ fontWeight: "bold" }}>{customGrade || admissionData.class_name}</span> in {new Date().getFullYear()}. {admissionData.gender === 'Female' ? 'She' : 'He'} was Punctual, Obedient and Hardworking student. We wish {admissionData.gender === 'Female' ? 'her' : 'him'} best of luck in future.
                </p>
              </div>

              {/* Signature */}
              <div style={{ display: "flex", justifyContent: "flex-end" }}>
                <div style={{ textAlign: "right" }}>
                  <div style={{ marginBottom: "80px" }}></div>
                  <div style={{
                    borderTop: "2px solid #1f2937",
                    paddingTop: "10px",
                    minWidth: "200px"
                  }}>
                    <p style={{
                      margin: "0",
                      fontWeight: "bold",
                      color: "#1f2937"
                    }}>Principal</p>
                    <p style={{
                      margin: "4px 0",
                      fontSize: "14px",
                      color: "#374151"
                    }}>Nasheman College</p>
                    <p style={{
                      margin: "4px 0",
                      fontSize: "14px",
                      color: "#6b7280"
                    }}>(Miss Sajeela Khan)</p>
                    <p style={{
                      margin: "4px 0",
                      fontSize: "14px",
                      color: "#6b7280"
                    }}>{getMonthYear()}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="print-hide" style={{ padding: "20px", textAlign: "center" }}>
            <button
              onClick={handlePrint}
              className="btn btn-sm btn-primary"
            >
              <i className="fa fa-print" aria-hidden="true"></i> Print Certificate
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CharacterCertificate;