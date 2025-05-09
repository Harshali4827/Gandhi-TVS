import { exportToUserCsv, exportToUserPdf } from 'utils/tableExports';
import '../../css/table.css';
import {
  React, useState, useEffect, Link, Menu, MenuItem, SearchOutlinedIcon,
  FontAwesomeIcon, faCopy, faFileExcel, faFilePdf, faFileCsv, CSVLink,
  FaCheckCircle, FaTimesCircle, getDefaultSearchFields, useTableFilter,
  usePagination, copyToClipboard, exportToCsv, exportToExcel, exportToPdf,
  confirmDelete, showError, showSuccess, axiosInstance, CopyToClipboard
} from 'utils/tableImports';
  
const UsersList = () => {
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
      const response = await axiosInstance.get(`/users`);
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

  const handleExcelExport = () => exportToExcel(data, 'UsersDetails');
  const handlePdfExport = () => {
    const headers = [
      'Username',
      'Email',
      'Full Name',
      'Mobile Number',
      'Branch',
      'Role',
      'Created By',
      'Is Active',
    ];
  
    const body = data.map(user => [
      user.username,
      user.email,
      user.full_name,
      user.mobile || '',
      user.branch_id?.name || 'N/A',
      user.role_id?.name || 'N/A',
      user.created_by?.username || 'N/A',
      user.is_active ? 'Active' : 'Inactive',
    ]);
  
    exportToUserPdf(headers, body, 'UsersDetails');
  };
  
  
  const csvExport = exportToUserCsv(data, 'UsersDetails');

  const handleDelete = async (id) => {
    const result = await confirmDelete();
    if (result.isConfirmed) {
      try {
        await axiosInstance.delete(`/users/${id}`);
        setData(data.filter((user) => user.id !== id));
        fetchData();
        showSuccess();
      } catch (error) {
        console.log(error);
        let message = 'Failed to delete. Please try again.';

        if (error.response) {
          const res = error.response.data;
          message = res.message || res.error || message;
        } else if (error.request) {
          message = 'No response from server. Please check your network.';
        } else if (error.message) {
          message = error.message;
        }
      
        showError(message);
      }
    }
  };
  const handleToggleActive = async (userId) => {
    try {
      const response = await axiosInstance.patch(`/users/${userId}/toggle-active`);
      console.log(response.data.message);
      handleClose();
    } catch (error) {
      console.error("Error toggling user status:", error);
    }
  };
  return (
    <div className="table-container">
      <div className="table-header">
        <div className="search-icon-data">
          <input type="text" placeholder="Search.." onChange={(e) =>
               handleFilter(e.target.value, getDefaultSearchFields('users'))
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
          <CSVLink {...csvExport} className="csv-link">
              <FontAwesomeIcon icon={faFileCsv} />
            </CSVLink>
          </button>
        </div>
        <Link to="/users/add-user">
          <button className="new-user-btn">+ New User</button>
        </Link>
      </div>
      <div className="table-responsive">
        <table className="responsive-table" style={{ overflow: 'auto' }}>
          <thead>
            <tr>
               <th>Sr.no</th>
               <th>Username</th>
               <th>Email</th>
               <th>Full name</th>
               <th>Mobile number</th>
               <th>Branch</th>
               <th>Role</th>
               <th>Last login</th>
               <th>Created by</th>
               <th>Is active</th>
               <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {currentRecords.length === 0 ? (
              <tr>
                <td colSpan="4">No users available</td>
              </tr>
            ) : (
              currentRecords.map((user, index) => (
                <tr key={index}>
                 <td>{index + 1}</td>
                  <td>{user.username}</td>
                  <td>{user.email}</td>
                  <td>{user.full_name}</td>
                  <td>{user.mobile}</td>
                  <td>{user.branch_id?.name || 'N/A'}</td>
                  <td>{user.role_id?.name || 'N/A'}</td>
                  {/* <td>{user.last_login}</td> */}
                  <td>
                       {user.last_login ? new Date(user.last_login).toLocaleString() : ''}
                  </td>
                  <td>{user.created_by?.username || 'N/A'}</td>
                  <td>
                    <span className={`status-text ${user.is_active}`}>
                      {user.is_active === true ? (
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
                      onClick={(event) => handleClick(event, user.id)}
                    >
                      Action
                    </button>
                     <Menu
                      id={`action-menu-${user.id}`}
                      anchorEl={anchorEl}
                      open={menuId === user.id}
                      onClose={handleClose}
                    >
                      <Link className="Link" to={`/users/update-user/${user.id}`}>
                        <MenuItem>Edit</MenuItem>
                      </Link>
                      <MenuItem onClick={() => handleDelete(user.id)}>Delete</MenuItem>
                      <MenuItem onClick={() => handleToggleActive(user.id)}>
                          {user.is_active ? "Mark as Inactive" : "Mark as Active"}
                      </MenuItem>
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

export default UsersList;
