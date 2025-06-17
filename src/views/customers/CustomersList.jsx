// import React, { useEffect, useState } from 'react';
// import { Link } from 'react-router-dom';
// import { Menu, MenuItem } from '@mui/material';
// import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
// import { DatePicker } from '@mui/x-date-pickers/DatePicker';
// import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
// import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
// import {
//   faCopy,
//   faFileExcel,
//   faFilePdf,
//   faCalendarAlt,
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
// import TextField from '@mui/material/TextField';
// import Button from '@mui/material/Button';
// import Box from '@mui/material/Box';
// import Modal from '@mui/material/Modal';
 
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
 
//   // Date range state
//   const [startDate, setStartDate] = useState(null);
//   const [endDate, setEndDate] = useState(null);
//   const [openDateModal, setOpenDateModal] = useState(false);
 
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
 
//   const handleOpenDateModal = () => {
//     setOpenDateModal(true);
//   };
 
//   const handleCloseDateModal = () => {
//     setOpenDateModal(false);
//     setStartDate(null);
//     setEndDate(null);
//   };
 
//   const handleExcelExport = async (dateRange = false) => {
//     try {
//       let url = '/quotations/export/excel';
//       let params = {};
 
//       if (dateRange && startDate && endDate) {
//         params = {
//           startDate: startDate.toISOString().split('T')[0],
//           endDate: endDate.toISOString().split('T')[0]
//         };
//       }
 
//       const response = await axiosInstance.get(url, {
//         responseType: 'blob',
//         params: params
//       });
 
//       const blobUrl = window.URL.createObjectURL(new Blob([response.data]));
//       const link = document.createElement('a');
//       link.href = blobUrl;
 
//       let fileName = `customers_${new Date().toISOString().split('T')[0]}.xlsx`;
//       if (dateRange && startDate && endDate) {
//         fileName = `customers_${startDate.toISOString().split('T')[0]}_to_${endDate.toISOString().split('T')[0]}.xlsx`;
//       }
 
//       link.setAttribute('download', fileName);
//       document.body.appendChild(link);
//       link.click();
//       link.parentNode.removeChild(link);
//       window.URL.revokeObjectURL(blobUrl);
 
//       Swal.fire({
//         toast: true,
//         position: 'top-end',
//         icon: 'success',
//         title: 'Excel exported successfully!',
//         showConfirmButton: false,
//         timer: 3000,
//         timerProgressBar: true,
//       });
 
//       if (dateRange) {
//         handleCloseDateModal();
//       }
//     } catch (error) {
//       console.error('Error exporting Excel:', error);
//       showError(error.response?.data?.message || 'Failed to export Excel');
//     }
//   };
 
  
 
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
 
//   // Modal style
//   const modalStyle = {
//     position: 'absolute',
//     top: '50%',
//     left: '50%',
//     transform: 'translate(-50%, -50%)',
//     width: 400,
//     bgcolor: 'background.paper',
//     boxShadow: 24,
//     p: 4,
//     borderRadius: '8px',
 
//   };
 
//   return (
//     <div>
//       <h4>Customers</h4>
//       <div className="table-container">
//         <div className="table-header">
//           <div className="search-icon-data">
//             <input
//               type="text"
//               placeholder="Search.."
//               onChange={(e) => handleFilter(e.target.value, getDefaultSearchFields('customers'))}
//             />
//             <SearchOutlinedIcon />
//           </div>
//           <div className="buttons">
//             <button className="btn2" title="Excel" onClick={handleOpenDateModal}>
//               <FontAwesomeIcon icon={faFileExcel} />
//             </button>
//           </div>
//         </div>
 
//         <div className="table-responsive">
//         <div className="table-wrapper">
//           <table className="responsive-table" style={{ overflow: 'auto' }}>
//             <thead className='table-header-fixed'>
//               <tr>
//                 <th>Sr.no</th>
//                 <th>Name</th>
//                 <th>Address</th>
//                 <th>Taluka</th>
//                 <th>District</th>
//                 <th>Mobile1</th>
//                 <th>Mobile2</th>
//                 <th>Action</th>
//               </tr>
//             </thead>
//             <tbody>
//               {currentRecords.length === 0 ? (
//                 <tr>
//                   <td colSpan="8">No customer available</td>
//                 </tr>
//               ) : (
//                 currentRecords.map((customer, index) => (
//                   <tr key={index}>
//                     <td>{index + 1}</td>
//                     <td>{customer.name}</td>
//                     <td>{customer.address}</td>
//                     <td>{customer.taluka}</td>
//                     <td>{customer.district}</td>
//                     <td>{customer.mobile1}</td>
//                     <td>{customer.mobile2}</td>
//                     <td>
//                       <button
//                         className="action-button"
//                         onClick={(event) => handleClick(event, customer.id)}
//                       >
//                         Action
//                       </button>
//                       <Menu
//                         id={`action-menu-${customer.id}`}
//                         anchorEl={anchorEl}
//                         open={menuId === customer.id}
//                         onClose={handleClose}
//                       >
//                         <Link className="Link" to={`/customers/update-customer/${customer._id}`}>
//                           <MenuItem style={{ color: 'black' }}>Edit</MenuItem>
//                         </Link>
//                         <MenuItem onClick={() => handleDelete(customer.id)}>Delete</MenuItem>
//                       </Menu>
//                     </td>
//                   </tr>
//                 ))
//               )}
//             </tbody>
//           </table>
//           </div>
//         </div>
//         <PaginationOptions />
//       </div>
 
//       {/* Date Range Modal */}
//       <Modal
//         open={openDateModal}
//         onClose={handleCloseDateModal}
//         aria-labelledby="date-range-modal-title"
//         aria-describedby="date-range-modal-description"
//         fullWidth
//       >
//         <Box sx={modalStyle}>
//           <h3 id="date-range-modal-title" style={{ marginBottom: '20px', fontSize: "22px" }} >
//             <FontAwesomeIcon icon={faCalendarAlt} style={{ marginRight: '10px' }} />
//             Select Date Range
//           </h3>
 
//           <LocalizationProvider dateAdapter={AdapterDateFns}>
//             <div style={{
//               display: 'flex',
//               gap: '16px',
//               marginBottom: '20px',
//               alignItems: 'center'
//             }}>
//               <DatePicker
//                 label="Start Date"
//                 value={startDate}
//                 onChange={(newValue) => setStartDate(newValue)}
//                 renderInput={(params) => (
//                   <TextField
//                     {...params}
//                     size="small"
 
//                   />
//                 )}
//               />
//               <DatePicker
//                 label="End Date"
//                 value={endDate}
//                 onChange={(newValue) => setEndDate(newValue)}
//                 renderInput={(params) => (
//                   <TextField
//                     {...params}
//                     size="small"
 
//                   />
 
//                 )}
//                 minDate={startDate}
//               />
//             </div>
//           </LocalizationProvider>
 
//           <div style={{
//             display: 'flex',
//             justifyContent: 'space-between',
//             gap: '10px' // Added for consistent spacing
//           }}>
//             <Button
//               variant="outlined"
//               onClick={handleCloseDateModal}
//               sx={{
//                 height: '36px',
//                 minWidth: '100px',
//                 fontSize: '0.8rem',
//                 textTransform: 'none'
//               }}
//             >
//               Cancel
//             </Button>
//             <Button
//               variant="contained"
//               onClick={() => handleExcelExport(true)}
//               disabled={!startDate || !endDate}
//               color="primary"
//               sx={{
//                 height: '36px',
//                 minWidth: '140px',
//                 fontSize: '0.8rem',
//                 textTransform: 'none'
//               }}
//             >
//               Export
//             </Button>
 
 
//           </div>
//         </Box>
//       </Modal>
//     </div >
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
  const [branches, setBranches] = useState([]);
  const [selectedBranchId, setSelectedBranchId] = useState('');

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
    fetchBranches();
    fetchData();
  }, []);
  
  const fetchBranches = async () => {
    try {
      const response = await axiosInstance.get('/branches');
      setBranches(response.data.data);
    } catch (error) {
      console.log('Error fetching branches', error);
    }
  };
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
  
      if (dateRange && startDate && endDate && selectedBranchId) {
        params = {
          branchId: selectedBranchId,
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
  
      let fileName = `customers_${params.startDate}_to_${params.endDate}_branch_${selectedBranchId}.xlsx`;
  
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
      // console.error('Error exporting Excel:', error);
      // showError(error.response?.data?.message || 'Failed to export Excel');

      try {
        if (
          error.response &&
          error.response.data instanceof Blob &&
          error.response.data.type === 'application/json'
        ) {
          const errorText = await error.response.data.text();
          const errorData = JSON.parse(errorText);
          showError(errorData.message || 'Failed to export Excel');
        } else {
          showError(error.message || 'Failed to export Excel');
        }
      } catch (parseError) {
        console.error('Error parsing error response:', parseError);
        showError('Unexpected error occurred');
      }
    }
  };  
 
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
          <TextField
                 select
                //  label="Select Branch"
                 value={selectedBranchId}
                 onChange={(e) => setSelectedBranchId(e.target.value)}
                 fullWidth
                 size="small"
                 sx={{ mb: 2 }}
                 SelectProps={{ native: true }}
               >
  <option value="">-- Select Branch --</option>
  {branches.map((branch) => (
    <option key={branch._id} value={branch._id}>
      {branch.name}
    </option>
  ))}
</TextField>

          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            gap: '10px'
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
              disabled={!startDate || !endDate || !selectedBranchId}
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