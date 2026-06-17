

import React, { useEffect, useState } from "react";
import axios from "axios";

// Process data into a proper hierarchy
// const processHierarchy = (data) => {
//     const hierarchy = {};

//     data.forEach((item) => {
//         const { main_head_name, code, level } = item;

//         // Ensure the main head exists
//         if (!hierarchy[main_head_name]) {
//             hierarchy[main_head_name] = { children: {} };
//         }

//         if (level === 2) {
//             // Add level 2 directly under the main head
//             hierarchy[main_head_name].children[code] = { ...item, children: {} };
//         } else if (level === 3) {
//             // Add level 3 under the appropriate level 2 item
//             const parentCode = Math.floor(code / 100); // Parent is the first two digits
//             if (hierarchy[main_head_name].children[parentCode]) {
//                 hierarchy[main_head_name].children[parentCode].children[code] = {
//                     ...item,
//                     children: {},
//                 };
//             }
//         } else if (level === 4) {
//             // Add level 4 under the appropriate level 3 item
//             const parentCode = Math.floor(code / 100); // Parent is the first three digits
//             Object.values(hierarchy[main_head_name].children).forEach((subHead) => {
//                 if (subHead.children[parentCode]) {
//                     subHead.children[parentCode].children[code] = { ...item };
//                 }
//             });
//         }
//     });

//     return hierarchy;
// };


const processHierarchy = (data) => {
    const hierarchy = {};

    // Sort data by level to ensure Level 2 is processed before Level 3
    const sortedData = data.sort((a, b) => a.level - b.level);

    sortedData.forEach((item) => {
        const { main_head_name, code, level, name } = item;

        // Ensure the main head exists
        if (!hierarchy[main_head_name]) {
            hierarchy[main_head_name] = { children: {} };
        }

        if (level === 2) {
            // Add Level 2 items directly under the main head
            hierarchy[main_head_name].children[code] = { ...item, children: {} };
        
        } else if (level === 3) {
            // For Level 3, identify the parent Level 2
            let parentCode;

            // Special handling for specific cases like '51'
            if (String(code).startsWith('51') && main_head_name === 'Reserves & Funds') {
                parentCode = '51';
            } else {
                parentCode = String(code).substring(0, 2); // Default logic for other Level 3 codes
            }

            if (hierarchy[main_head_name].children[parentCode]) {
                hierarchy[main_head_name].children[parentCode].children[code] = {
                    ...item,
                    children: {},
                };
               
            } 
        } else if (level === 4) {
            // For Level 4, identify the parent Level 3
            const parentCode = String(code).substring(0, 4); // Match the first four digits
            Object.values(hierarchy[main_head_name].children).forEach((level2Item) => {
                if (level2Item.children[parentCode]) {
                    level2Item.children[parentCode].children[code] = { ...item };
                    
                }
            });
        }
    });

    return hierarchy;
};


// Filter the hierarchy based on the search query
const filterHierarchy = (hierarchy, query) => {
    if (!query) return hierarchy; // If query is empty, return the full hierarchy

    const filteredHierarchy = {};

    Object.keys(hierarchy).forEach((mainHead) => {
        const mainHeadData = hierarchy[mainHead];
        const filteredChildren = {};

        Object.keys(mainHeadData.children).forEach((level2Key) => {
            const level2 = mainHeadData.children[level2Key];
            const filteredLevel3 = {};

            // Filter Level 3 and its children (Level 4)
            Object.keys(level2.children).forEach((level3Key) => {
                const level3 = level2.children[level3Key];
                const filteredLevel4 = Object.keys(level3.children).filter(
                    (level4Key) =>
                        level3.children[level4Key].name.toLowerCase().includes(query)
                );

                if (
                    level3.name.toLowerCase().includes(query) ||
                    filteredLevel4.length > 0
                ) {
                    filteredLevel3[level3Key] = {
                        ...level3,
                        children: filteredLevel4.reduce((acc, key) => {
                            acc[key] = level3.children[key];
                            return acc;
                        }, {}),
                    };
                }
            });

            if (
                level2.name.toLowerCase().includes(query) ||
                Object.keys(filteredLevel3).length > 0
            ) {
                filteredChildren[level2Key] = {
                    ...level2,
                    children: filteredLevel3,
                };
            }
        });

        if (
            mainHead.toLowerCase().includes(query) ||
            Object.keys(filteredChildren).length > 0
        ) {
            filteredHierarchy[mainHead] = {
                ...mainHeadData,
                children: filteredChildren,
            };
        }
    });

    return filteredHierarchy;
};

// Render the hierarchical rows
const renderRows = (data) => {
    return Object.keys(data).map((mainHead) => {
        const mainHeadData = data[mainHead];

        return (
            <React.Fragment key={mainHead}>
                {/* Main Head Row */}
                <tr style={{ backgroundColor: "#f8f9fa", fontWeight: "bold" }}>
                    <td>{mainHead}</td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                </tr>

                {/* Render Level 2 Items */}
                {Object.keys(mainHeadData.children).map((level2Key) => {
                    const level2 = mainHeadData.children[level2Key];
                    return (
                        <React.Fragment key={level2.code}>
                            <tr>
                                <td></td>
                                <td>{level2.name + " (" + level2.code + ")"}</td>
                                <td></td>
                                <td></td>
                                <td>
                                    <button className="btn btn-sm btn-warning">Edit</button>
                                </td>
                            </tr>

                            {/* Render Level 3 Items */}
                            {Object.keys(level2.children).map((level3Key) => {
                                const level3 = level2.children[level3Key];
                                return (
                                    <React.Fragment key={level3.code}>
                                        <tr>
                                            <td></td>
                                            <td></td>
                                            <td>{level3.name + " (" + level3.code + ")"}</td>
                                            <td></td>
                                            <td>
                                                <button className="btn btn-sm btn-warning">Edit</button>
                                            </td>
                                        </tr>

                                        {/* Render Level 4 Items */}
                                        {Object.keys(level3.children).map((level4Key) => {
                                            const level4 = level3.children[level4Key];
                                            return (
                                                <tr key={level4.code}>
                                                    <td></td>
                                                    <td></td>
                                                    <td></td>
                                                    <td>{level4.name + " (" + level4.code + ")"}</td>
                                                    <td>
                                                        <button className="btn btn-sm btn-warning">Edit</button>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </React.Fragment>
                                );
                            })}
                        </React.Fragment>
                    );
                })}
            </React.Fragment>
        );
    });
};

const ChartsOfAccount = () => {
    const [data, setData] = useState([]);
    const [filteredData, setFilteredData] = useState({});
    const [searchQuery, setSearchQuery] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        axios
            .get(process.env.REACT_APP_API_BASE_URL+"/charts-of-account") // Replace with your API endpoint
            .then((res) => {
                const hierarchicalData = processHierarchy(res.data.results);
                setData(hierarchicalData);
                setFilteredData(hierarchicalData); // Set filtered data to the full dataset initially
                setLoading(false);
            })
            .catch((err) => console.error(err));
    }, []);

    const handleSearch = (e) => {
        const query = e.target.value.toLowerCase();
        setSearchQuery(query);

        const result = filterHierarchy(data, query);
        setFilteredData(result);
    };

    return (
        <div>
           
           <div className='col-md-12 p-2'>
           <h5 className='text-warning bg-primary p-2 card-header border'><i className='fas fa-chart-line'></i> Charts of Account</h5>
                <div className="mb-3 mt-3 d-flex justify-content-end">
                    <input
                        type="text"
                        className="form-control col-md-4"
                        placeholder="Search..."
                        value={searchQuery}
                        onChange={handleSearch}
                    />
                </div>
                {loading ? (
                    <p>Loading...</p>
                ) : (
                    <table className="table table-bordered">
                        <thead>
                            <tr>
                                <th>Main Head (Level-1)</th>
                                <th>Sub Head-1 (Level-2)</th>
                                <th>Sub Head-2 (Level-3)</th>
                                <th>Sub Head-3 (Level-4)</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>{renderRows(filteredData)}</tbody>
                    </table>
                )}
            </div>
        </div>
    );
};

export default ChartsOfAccount;


