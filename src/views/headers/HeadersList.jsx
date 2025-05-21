import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, MenuItem } from '@mui/material';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import {
  faCopy,
  faFileExcel,
  faFilePdf,
  faFileCsv,
} from '@fortawesome/free-solid-svg-icons';
import '../../css/table.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { getDefaultSearchFields, useTableFilter } from 'utils/tableFilters';
import { usePagination } from 'utils/pagination.jsx'; 
import { copyToClipboard, exportToExcel, exportToPdf} from 'utils/tableExports';
import CopyToClipboard from 'react-copy-to-clipboard';
import axiosInstance from 'axiosInstance';
import { confirmDelete, showError, showSuccess } from 'utils/sweetAlerts';

const HeadersList = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [menuId, setMenuId] = useState(null);
  const [csvDialogOpen, setCsvDialogOpen] = useState(false);
  const [selectedType, setSelectedType] = useState('');


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
  
  useEffect(() => {
    fetchData();
  }, []);
  const fetchData = async () => {
    try {
      const response = await axiosInstance.get(`/headers?sort=priority`);
      setData(response.data.data.headers);
      setFilteredData(response.data.data.headers);

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

  const handleExcelExport = () => exportToExcel(data, 'HeadersDetails');
  const handlePdfExport = () => exportToPdf(
    data,
    ['name', 'address', 'city', 'state', 'pincode', 'phone', 'email', 'gst_number'],
    'HeadersDetails'
  );
  
  const handleDelete = async (id) => {
    const result = await confirmDelete();
    if (result.isConfirmed) {
      try {
        await axiosInstance.delete(`/headers/${id}`);
        setData(data.filter((header) => header.id !== id));
        fetchData();
        showSuccess();
      } catch (error) {
        console.log(error);
        showError();
      }
    }
  };
  return (
    <div className="table-container">
      <div className="table-header">
        <div className="search-icon-data">
          <input type="text" placeholder="Search.."   onChange={(e) =>
               handleFilter(e.target.value, getDefaultSearchFields('headers'))
          }/>
          <SearchOutlinedIcon />
        </div>
        <div className="buttons">
        <CopyToClipboard text={copyToClipboard(data)}>
            <button className="btn2" title="Copy">
              <FontAwesomeIcon icon={faCopy} />
            </button>
          </CopyToClipboard>
          <button className="btn2" title="Excel" onClick={handleExcelExport}>
            <FontAwesomeIcon icon={faFileExcel} />
          </button>
          <button className="btn2" title="PDF" onClick={handlePdfExport}>
            <FontAwesomeIcon icon={faFilePdf} />
          </button>
          {/* <button className="btn2" title="Export CSV" onClick={handleCSVExportFromAPI}>
                  <FontAwesomeIcon icon={faFileCsv} />
           </button> */}
           <button className="btn2" title="Export CSV" onClick={() => setCsvDialogOpen(true)}>
               <FontAwesomeIcon icon={faFileCsv} />
          </button>

        </div>
        <Link to="/headers/add-header">
          <button className="new-user-btn">+ New Header</button>
        </Link>
      </div>
      <div className="table-responsive">
        <table className="responsive-table" style={{ overflow: 'auto' }}>
          <thead>
            <tr>
              <th>Sr.no</th>
               <th>Name</th>
               <th>Category key</th>
               <th>Type</th>
               <th>Priority number</th>
               <th>Page number</th>
               <th>HSN code</th>
               <th>GST rate</th>
               <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {currentRecords.length === 0 ? (
              <tr>
                <td colSpan="4">No headers available</td>
              </tr>
            ) : (
              currentRecords.map((header, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{header.header_key}</td>
                  <td>{header.category_key}</td>
                  <td>{header.metadata?.type || ''}</td>
                  <td>{header.priority}</td>
                  <td>{header.metadata?.page_no || ''}</td>
                  <td>{header.metadata?.hsn_code || ''}</td>
                  <td>{header.metadata?.gst_rate || ''}</td>

                  <td>
                    <button
                      className="action-button"
                      onClick={(event) => handleClick(event, header._id)}
                    >
                      Action
                    </button>
                    <Menu
                      id={`action-menu-${header._id}`}
                      anchorEl={anchorEl}
                      open={menuId === header._id}
                      onClose={handleClose}
                    >
                      <Link className="Link" to={`/headers/update-header/${header._id}`}>
                        <MenuItem style={{ color: 'black' }}>Edit</MenuItem>
                      </Link>
                      {/* <MenuItem onClick={() => handleDelete(header._id)}>Delete</MenuItem> */}
                    </Menu>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      <PaginationOptions/>
      {csvDialogOpen && (
  <div className="modal-backdrop">
    <div className="modal-content">
      <select
        value={selectedType}
        onChange={(e) => setSelectedType(e.target.value)}
        style={{ padding: '8px', width: '100%', marginBottom: '10px' }}
      >
        <option value="">-- Select Model Type --</option>
        <option value="EV">EV</option>
        <option value="ICE">ICE</option>
      </select>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <button onClick={() => setCsvDialogOpen(false)} 
          style={{
            padding: '8px 8px',
            backgroundColor: '#dc4226',
            color: '#fff',
            border: '1px solid #ccc',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: '500',
            transition: 'all 0.3s ease',
            minWidth: '100px',
            ':hover': {
              backgroundColor: '#dc4226',
            }
          }}
          >Cancel</button>
        <button
          onClick={async () => {
            if (!selectedType) {
              showError('Please select a type.');
              return;
            }
            try {
              const response = await axiosInstance.get(`/csv/export-template?filled=true&type=${selectedType}`, {
                responseType: 'blob',
              });

              const url = window.URL.createObjectURL(new Blob([response.data]));
              const link = document.createElement('a');
              link.href = url;
              link.setAttribute('download', `exported_data_${selectedType}.csv`);
              document.body.appendChild(link);
              link.click();
              link.remove();
              setCsvDialogOpen(false);
              setSelectedType('');
            } catch (error) {
              console.error('CSV export failed:', error);
              showError('Failed to export CSV.');
              setCsvDialogOpen(false);
            }
          }}
          style={{
            padding: '8px 16px',
            backgroundColor: '#243c7c',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: '500',
            transition: 'all 0.3s ease',
            minWidth: '100px',
            ':hover': {
              backgroundColor: '#243c7c',
            }
          }}
        >
          Export
        </button>
      </div>
    </div>
  </div>
)}

     </div>
  );
};

export default HeadersList;
