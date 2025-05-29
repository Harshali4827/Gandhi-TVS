// import React, { useEffect, useState } from 'react';
// import { Link } from 'react-router-dom';
// import { Menu, MenuItem } from '@mui/material';
// import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
// import {
//   faCopy,
//   faFileExcel,
//   faFilePdf,
// } from '@fortawesome/free-solid-svg-icons';
// import '../../css/table.css';
// import Swal from 'sweetalert2';

// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { getDefaultSearchFields, useTableFilter } from 'utils/tableFilters';
// import { usePagination } from 'utils/pagination.jsx'; 
// import { copyToClipboard, exportToCsv, exportToExcel, exportToPdf } from 'utils/tableExports';
// import CopyToClipboard from 'react-copy-to-clipboard';
// import axiosInstance from 'axiosInstance';
// import { confirmDelete, showError, showSuccess } from 'utils/sweetAlerts';

// const CustomersList = () => {
//   const [anchorEl, setAnchorEl] = useState(null);
//   const [menuId, setMenuId] = useState(null);
//   const {
//     data,
//     setData,
//     filteredData,
//     setFilteredData,
//     handleFilter,
//   } = useTableFilter([]);
  
//   const {
//     currentRecords,
//     PaginationOptions
//   } = usePagination(Array.isArray(filteredData) ? filteredData : []);


//   useEffect(() => {
//     fetchData();
//   }, []);

//   const fetchData = async () => {
//     try {
//       const response = await axiosInstance.get(`/customers`);
//       setData(response.data.data.customers);
//       setFilteredData(response.data.data.customers);

//     } catch (error) {
//       console.log('Error fetching data', error);
//     }
//   };

//   const handleClick = (event, id) => {
//     setAnchorEl(event.currentTarget);
//     setMenuId(id);
//   };

//   const handleClose = () => {
//     setAnchorEl(null);
//     setMenuId(null);
//   };

// const handleExcelExport = async () => {
//     try {
//       const response = await axiosInstance.get('/quotations/export/excel', {
//         responseType: 'blob', 
//       });

//       const url = window.URL.createObjectURL(new Blob([response.data]));
//       const link = document.createElement('a');
//       link.href = url;
//       link.setAttribute('download', `customers_${new Date().toISOString().split('T')[0]}.xlsx`);
//       document.body.appendChild(link);
//       link.click();
//       link.parentNode.removeChild(link);
//       window.URL.revokeObjectURL(url);
  
//       Swal.fire({
//         toast: true,
//         position: 'top-end',
//         icon: 'success',
//         title: 'Excel exported successfully!',
//         showConfirmButton: false,
//         timer: 3000,
//         timerProgressBar: true,
//       });
  
//     } catch (error) {
//       console.error('Error exporting Excel:', error);
//       showError(error.response?.data?.message || 'Failed to export Excel');
//     }
//   };

//  const handlePdfExport = () => exportToPdf(
//     data,
//     ['name', 'address', 'taluka', 'district', 'mobile1', 'mobile2'],
//     'CustomersDetails'
//   );
  
//   const csvExport = exportToCsv(data, 'CustomersDetails');

//   const handleDelete = async (id) => {
//     const result = await confirmDelete();
//     if (result.isConfirmed) {
//       try {
//         await axiosInstance.delete(`/customers/${id}`);
//         setData(data.filter((customer) => customer.id !== id));
//         fetchData();
//         showSuccess();
//       } catch (error) {
//         console.log(error);
//         showError();
//       }
//     }
//   };
//   return (
//     <div>
//         <h4>Customers</h4>
//     <div className="table-container">
//       <div className="table-header">
//         <div className="search-icon-data">
//           <input type="text" placeholder="Search.."   onChange={(e) =>
//                handleFilter(e.target.value, getDefaultSearchFields('customers'))
//           }/>
//           <SearchOutlinedIcon />
//         </div>
//         <div className="buttons">
//         {/* <CopyToClipboard text={copyToClipboard(data)}>
//             <button className="btn2" title="Copy">
//               <FontAwesomeIcon icon={faCopy} />
//             </button>
//           </CopyToClipboard> */}
//           <button className="btn2" title="Excel" onClick={handleExcelExport}>
//             <FontAwesomeIcon icon={faFileExcel} />
//           </button>
//           {/* <button className="btn2" title="PDF" onClick={handlePdfExport}>
//             <FontAwesomeIcon icon={faFilePdf} />
//           </button> */}
         
//           {/* <button className="btn2">
//           <CSVLink {...csvExport}        className="csv-link">
//               <FontAwesomeIcon icon={faFileCsv} />
//             </CSVLink>
//           </button> */}
//         </div>
//         {/* <Link to="/gates/add-gate">
//           <button className="new-user-btn">+ New Branch</button>
//         </Link> */}
//       </div>
//       <div className="table-responsive">
//         <table className="responsive-table" style={{ overflow: 'auto' }}>
//           <thead>
//             <tr>
//               <th>Sr.no</th>
//                <th>Name</th>
//                <th>Address</th>
//                <th>Taluka</th>
//                <th>District</th>
//                <th>Mobile1</th>
//                <th>Mobile2</th>
//                <th>Action</th>
//             </tr>
//           </thead>
//           <tbody>
//             {currentRecords.length === 0 ? (
//               <tr>
//                 <td colSpan="4">No customer available</td>
//               </tr>
//             ) : (
//               currentRecords.map((customer, index) => (
//                 <tr key={index}>
//                   <td>{index + 1}</td>
//                   <td>{customer.name}</td>
//                   <td>{customer.address}</td>
//                   <td>{customer.taluka}</td>
//                   <td>{customer.district}</td>
//                   <td>{customer.mobile1}</td>
//                   <td>{customer.mobile2}</td>
//                   <td>
//                     <button
//                       className="action-button"
//                       onClick={(event) => handleClick(event, customer.id)}
//                     >
//                       Action
//                     </button>
//                     <Menu
//                       id={`action-menu-${customer.id}`}
//                       anchorEl={anchorEl}
//                       open={menuId === customer.id}
//                       onClose={handleClose}
//                     >
//                       <Link className="Link" to={`/customers/update-customer/${customer._id}`}>
//                         <MenuItem style={{ color: 'black' }}>Edit</MenuItem>
//                       </Link>
//                       <MenuItem onClick={() => handleDelete(customer.id)}>Delete</MenuItem>
//                     </Menu>
//                   </td>
//                 </tr>
//               ))
//             )}
//           </tbody>
//         </table>
//       </div>
//       <PaginationOptions/>
//      </div>
//      </div>
//   );
// };
// export default CustomersList;







import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, MenuItem } from '@mui/material';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import {
  faCopy,
  faFileExcel,
  faFilePdf,
  faCalendarAlt,
} from '@fortawesome/free-solid-svg-icons';
import '../../css/table.css';
import Swal from 'sweetalert2';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { getDefaultSearchFields, useTableFilter } from 'utils/tableFilters';
import { usePagination } from 'utils/pagination.jsx';
import { copyToClipboard, exportToCsv, exportToExcel, exportToPdf } from 'utils/tableExports';
import CopyToClipboard from 'react-copy-to-clipboard';
import axiosInstance from 'axiosInstance';
import { confirmDelete, showError, showSuccess } from 'utils/sweetAlerts';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
 
const CustomersList = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [menuId, setMenuId] = useState(null);
  const {
    data,
    setData,
    filteredData,
    setFilteredData,
    handleFilter,
  } = useTableFilter([]);
 
  const {
    currentRecords,
    PaginationOptions
  } = usePagination(Array.isArray(filteredData) ? filteredData : []);
 
  // Date range state
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [openDateModal, setOpenDateModal] = useState(false);
 
  useEffect(() => {
    fetchData();
  }, []);
 
  const fetchData = async () => {
    try {
      const response = await axiosInstance.get(`/customers`);
      setData(response.data.data.customers);
      setFilteredData(response.data.data.customers);
    } catch (error) {
      console.log('Error fetching data', error);
    }
  };
 
  const handleClick = (event, id) => {
    setAnchorEl(event.currentTarget);
    setMenuId(id);
  };
 
  const handleClose = () => {
    setAnchorEl(null);
    setMenuId(null);
  };
 
  const handleOpenDateModal = () => {
    setOpenDateModal(true);
  };
 
  const handleCloseDateModal = () => {
    setOpenDateModal(false);
    setStartDate(null);
    setEndDate(null);
  };
 
  const handleExcelExport = async (dateRange = false) => {
    try {
      let url = '/quotations/export/excel';
      let params = {};
 
      if (dateRange && startDate && endDate) {
        params = {
          startDate: startDate.toISOString().split('T')[0],
          endDate: endDate.toISOString().split('T')[0]
        };
      }
 
      const response = await axiosInstance.get(url, {
        responseType: 'blob',
        params: params
      });
 
      const blobUrl = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = blobUrl;
 
      let fileName = `customers_${new Date().toISOString().split('T')[0]}.xlsx`;
      if (dateRange && startDate && endDate) {
        fileName = `customers_${startDate.toISOString().split('T')[0]}_to_${endDate.toISOString().split('T')[0]}.xlsx`;
      }
 
      link.setAttribute('download', fileName);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
 
      Swal.fire({
        toast: true,
        position: 'top-end',
        icon: 'success',
        title: 'Excel exported successfully!',
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
      });
 
      if (dateRange) {
        handleCloseDateModal();
      }
    } catch (error) {
      console.error('Error exporting Excel:', error);
      showError(error.response?.data?.message || 'Failed to export Excel');
    }
  };
 
  const handlePdfExport = () => exportToPdf(
    data,
    ['name', 'address', 'taluka', 'district', 'mobile1', 'mobile2'],
    'CustomersDetails'
  );
 
  const csvExport = exportToCsv(data, 'CustomersDetails');
 
  const handleDelete = async (id) => {
    const result = await confirmDelete();
    if (result.isConfirmed) {
      try {
        await axiosInstance.delete(`/customers/${id}`);
        setData(data.filter((customer) => customer.id !== id));
        fetchData();
        showSuccess();
      } catch (error) {
        console.log(error);
        showError();
      }
    }
  };
 
  // Modal style
  const modalStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 4,
    borderRadius: '8px',
 
  };
 
  return (
    <div>
      <h4>Customers</h4>
      <div className="table-container">
        <div className="table-header">
          <div className="search-icon-data">
            <input
              type="text"
              placeholder="Search.."
              onChange={(e) => handleFilter(e.target.value, getDefaultSearchFields('customers'))}
            />
            <SearchOutlinedIcon />
          </div>
          <div className="buttons">
            <button className="btn2" title="Excel" onClick={handleOpenDateModal}>
              <FontAwesomeIcon icon={faFileExcel} />
            </button>
          </div>
        </div>
 
        <div className="table-responsive">
        <div className="table-wrapper">
          <table className="responsive-table" style={{ overflow: 'auto' }}>
            <thead className='table-header-fixed'>
              <tr>
                <th>Sr.no</th>
                <th>Name</th>
                <th>Address</th>
                <th>Taluka</th>
                <th>District</th>
                <th>Mobile1</th>
                <th>Mobile2</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {currentRecords.length === 0 ? (
                <tr>
                  <td colSpan="8">No customer available</td>
                </tr>
              ) : (
                currentRecords.map((customer, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{customer.name}</td>
                    <td>{customer.address}</td>
                    <td>{customer.taluka}</td>
                    <td>{customer.district}</td>
                    <td>{customer.mobile1}</td>
                    <td>{customer.mobile2}</td>
                    <td>
                      <button
                        className="action-button"
                        onClick={(event) => handleClick(event, customer.id)}
                      >
                        Action
                      </button>
                      <Menu
                        id={`action-menu-${customer.id}`}
                        anchorEl={anchorEl}
                        open={menuId === customer.id}
                        onClose={handleClose}
                      >
                        <Link className="Link" to={`/customers/update-customer/${customer._id}`}>
                          <MenuItem style={{ color: 'black' }}>Edit</MenuItem>
                        </Link>
                        <MenuItem onClick={() => handleDelete(customer.id)}>Delete</MenuItem>
                      </Menu>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
          </div>
        </div>
        <PaginationOptions />
      </div>
 
      {/* Date Range Modal */}
      <Modal
        open={openDateModal}
        onClose={handleCloseDateModal}
        aria-labelledby="date-range-modal-title"
        aria-describedby="date-range-modal-description"
        fullWidth
      >
        <Box sx={modalStyle}>
          <h3 id="date-range-modal-title" style={{ marginBottom: '20px', fontSize: "22px" }} >
            <FontAwesomeIcon icon={faCalendarAlt} style={{ marginRight: '10px' }} />
            Select Date Range
          </h3>
 
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <div style={{
              display: 'flex',
              gap: '16px',
              marginBottom: '20px',
              alignItems: 'center'
            }}>
              <DatePicker
                label="Start Date"
                value={startDate}
                onChange={(newValue) => setStartDate(newValue)}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    size="small"
 
                  />
                )}
              />
              <DatePicker
                label="End Date"
                value={endDate}
                onChange={(newValue) => setEndDate(newValue)}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    size="small"
 
                  />
 
                )}
                minDate={startDate}
              />
            </div>
          </LocalizationProvider>
 
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            gap: '10px' // Added for consistent spacing
          }}>
            <Button
              variant="outlined"
              onClick={handleCloseDateModal}
              sx={{
                height: '36px',
                minWidth: '100px',
                fontSize: '0.8rem',
                textTransform: 'none'
              }}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              onClick={() => handleExcelExport(true)}
              disabled={!startDate || !endDate}
              color="primary"
              sx={{
                height: '36px',
                minWidth: '140px',
                fontSize: '0.8rem',
                textTransform: 'none'
              }}
            >
              Export
            </Button>
 
 
          </div>
        </Box>
      </Modal>
    </div >
  );
};
  
export default CustomersList;