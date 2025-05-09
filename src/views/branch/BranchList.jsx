import '../../css/table.css';
import {
  React, useState, useEffect, Link, Menu, MenuItem, SearchOutlinedIcon,
  FontAwesomeIcon, faCopy, faFileExcel, faFilePdf, faFileCsv, CSVLink,
  FaCheckCircle, FaTimesCircle, getDefaultSearchFields, useTableFilter,
  usePagination, copyToClipboard, exportToCsv, exportToExcel, exportToPdf,
  confirmDelete, showError, showSuccess, axiosInstance, CopyToClipboard
} from 'utils/tableImports';

const BranchList = () => {
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
  } = usePagination(filteredData);
  
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axiosInstance.get(`/branches`);
      setData(response.data.data);
      setFilteredData(response.data.data);

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

  const handleExcelExport = () => exportToExcel(data, 'BranchDetails');

 const handlePdfExport = () => exportToPdf(
    data,
    ['name', 'address', 'city', 'state', 'pincode', 'phone', 'email', 'gst_number'],
    'BranchDetails'
  );
  
  const csvExport = exportToCsv(data, 'BranchDetails');

  const handleDelete = async (id) => {
    const result = await confirmDelete();
    if (result.isConfirmed) {
      try {
        await axiosInstance.delete(`/branches/${id}`);
        setData(data.filter((branch) => branch.id !== id));
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
               handleFilter(e.target.value, getDefaultSearchFields('branch'))
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
         
          <button className="btn2">
          <CSVLink {...csvExport}        className="csv-link">
              <FontAwesomeIcon icon={faFileCsv} />
            </CSVLink>
          </button>
        </div>
        <Link to="/branch/add-branch">
          <button className="new-user-btn">+ New Branch</button>
        </Link>
      </div>
      <div className="table-responsive">
        <table className="responsive-table" style={{ overflow: 'auto' }}>
          <thead>
            <tr>
              <th>Sr.no</th>
               <th>Branch name</th>
               <th>Address</th>
               <th>City</th>
               <th>State</th>
               <th>Pincode</th>
               <th>Phone</th>
               <th>Email</th>
               <th>GST Number</th>
               <th>Is active</th>
               <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {currentRecords.length === 0 ? (
              <tr>
                <td colSpan="4">No branch available</td>
              </tr>
            ) : (
              currentRecords.map((branch, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{branch.name}</td>
                  <td>{branch.address}</td>
                  <td>{branch.city}</td>
                  <td>{branch.state}</td>
                  <td>{branch.pincode}</td>
                  <td>{branch.phone}</td>
                  <td>{branch.email}</td>
                  <td>{branch.gst_number}</td>
                
                  <td>
                    <span className={`status-text ${branch.is_active}`}>
                      {branch.is_active === true ? (
                        <>
                          <FaCheckCircle className="status-icon active-icon" />
                        </>
                      ) : (
                        <>
                          <FaTimesCircle className="status-icon inactive-icon" />
                        </>
                      )}
                    </span>
                  </td> 
                  <td>
                    <button
                      className="action-button"
                      onClick={(event) => handleClick(event, branch.id)}
                    >
                      Action
                    </button>
                    <Menu
                      id={`action-menu-${branch.id}`}
                      anchorEl={anchorEl}
                      open={menuId === branch.id}
                      onClose={handleClose}
                    >
                      <Link className="Link" to={`/branch/update-branch/${branch.id}`}>
                        <MenuItem>Edit</MenuItem>
                      </Link>
                      <MenuItem onClick={() => handleDelete(branch.id)}>Delete</MenuItem>
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
  );
};

export default BranchList;
