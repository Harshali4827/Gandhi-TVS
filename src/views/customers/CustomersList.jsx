import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, MenuItem } from '@mui/material';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import {
  faCopy,
  faFileExcel,
  faFilePdf,
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

  // const handleExcelExport = () => exportToExcel(data, 'CustomerDetails');
  

  
  const handleExcelExport = async () => {
    try {
      Swal.fire({
        title: 'Preparing Excel Report',
        html: 'Fetching quotations data...',
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        }
      });
  
      const response = await axiosInstance.get('/quotations');
      const quotations = response.data.data.quotations;
      
      const excelData = quotations.map(quote => {
        // Process models data
        const modelsData = quote.models.map(model => ({
          modelName: model.model_name,
          prices: model.prices.map(price => ({
            headerKey: price.header_key,
            value: price.value,
            priceType: price.category_key,
            metadata: price.metadata
          }))
        }));
  
        // Process base model data
        const baseModelPrices = quote.base_model?.prices?.map(price => ({
          headerKey: price.header_key,
          value: price.value,
          priceType: price.category_key,
          metadata: price.metadata
        })) || [];
  
        return {
          'Customer Name': quote.customer?.name || 'N/A',
          'Mobile Number': quote.customer?.mobile1 || 'N/A',
          'Address': quote.customer?.address || 'N/A',
          'Taluka': quote.customer?.taluka || 'N/A',
          'District': quote.customer?.district || 'N/A',
          'Quotation Number': quote.quotation_number,
          'Status': quote.status.charAt(0).toUpperCase() + quote.status.slice(1),
          'Created Date': new Date(quote.createdAt).toLocaleDateString(),
          'Expected Delivery': new Date(quote.expected_delivery_date).toLocaleDateString(),
          'Finance Needed': quote.finance_needed ? 'Yes' : 'No',
          'Primary Model Name': modelsData[0]?.modelName || 'N/A',
          // 'Primary Model Prices': JSON.stringify(modelsData[0]?.prices || []),
          'Base Model Name': quote.base_model?.model_name || 'N/A',
          // 'Base Model Prices': JSON.stringify(baseModelPrices),
          'Salesman Name': quote.creator?.name || 'N/A',
          'Salesman Mobile': quote.creator?.mobile || 'N/A',
        };
      });
  
      Swal.close();
      exportToExcel(excelData, 'CustomersReport');
      
    } catch (error) {
      Swal.fire('Error', 'Failed to generate Excel report', 'error');
      console.error('Excel export error:', error);
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
  return (
    <div>
        <h4>Customers</h4>
    <div className="table-container">
      <div className="table-header">
        <div className="search-icon-data">
          <input type="text" placeholder="Search.."   onChange={(e) =>
               handleFilter(e.target.value, getDefaultSearchFields('customers'))
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
         
          {/* <button className="btn2">
          <CSVLink {...csvExport}        className="csv-link">
              <FontAwesomeIcon icon={faFileCsv} />
            </CSVLink>
          </button> */}
        </div>
        {/* <Link to="/gates/add-gate">
          <button className="new-user-btn">+ New Branch</button>
        </Link> */}
      </div>
      <div className="table-responsive">
        <table className="responsive-table" style={{ overflow: 'auto' }}>
          <thead>
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
                <td colSpan="4">No customer available</td>
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
      <PaginationOptions/>
     </div>
     </div>
  );
};

export default CustomersList;
