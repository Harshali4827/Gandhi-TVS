import { exportToRolesCsv } from 'utils/tableExports';
import '../../css/table.css';
import {
  React, useState, useEffect, Link, Menu, MenuItem, SearchOutlinedIcon,
  FontAwesomeIcon, faCopy, faFileExcel, faFilePdf, faFileCsv, CSVLink,
  FaCheckCircle, FaTimesCircle, getDefaultSearchFields, useTableFilter,
  usePagination, copyToClipboard, exportToCsv, exportToExcel, exportToPdf,
  confirmDelete, showError, showSuccess, axiosInstance, CopyToClipboard
} from 'utils/tableImports';
const AllRoles = () => {
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
      const response = await axiosInstance.get(`/roles`);
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

  const handleExcelExport = () => exportToExcel(data, 'RoleDetails');


  const handlePdfExport = () => {
    const pdfData = data.map((role) => ({
      name: role.name,
      description: role.description,
      is_default: role.is_default ? 'Yes' : 'No',
      permissionss: role.permissions?.map(p => p.resource).join(', ') || 'No permissions',
      action: role.permissions?.map(p => `${p.resource}: [${p.actions.join(', ')}]`).join('\n') || 'No actions',
    }));
  
    exportToPdf(
      pdfData,
      ['name', 'description', 'is_default', 'permissionss', 'action'],
      'RoleDetails'
    );
  };
  
  const csvExport = exportToRolesCsv(data, 'RoleDetails');

  const handleDelete = async (id) => {
    const result = await confirmDelete();
    if (result.isConfirmed) {
      try {
        await axiosInstance.delete(`/roles/${id}`);
        setData(data.filter((role) => role.id !== id));
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
      <h4>All role</h4>
    <div className="table-container">
      <div className="table-header">
        <div className="search-icon-data">
          <input type="text" placeholder="Search.." onChange={(e) =>
               handleFilter(e.target.value, getDefaultSearchFields('roles'))
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
        <Link to="/roles/create-role">
          <button className="new-user-btn">+ New Role</button>
        </Link>
      </div>
      <div className="table-responsive">
        <table className="responsive-table" style={{ overflow: 'auto' }}>
          <thead>
            <tr>
               <th>Sr.no</th>
               <th>Role name</th>
               <th>Description</th>
               <th>Set as default</th>
               <th>Permission module</th>
               <th>Access</th>
               <th>Action</th>
            </tr>
          </thead>
          <tbody>
  {currentRecords.length === 0 ? (
    <tr>
      <td colSpan="7">No roles available</td>
    </tr>
  ) : (
    currentRecords.map((role, index) => (
      <tr key={index}>
        <td>{index + 1}</td>
        <td>{role.name}</td>
        <td>{role.description}</td>
        <td>
          {role.is_default ? (
            <FaCheckCircle style={{ color: 'green' }} />
          ) : (
            <FaTimesCircle style={{ color: 'red' }} />
          )}
        </td>
        <td>
          {role.permissions && role.permissions.length > 0 ? (
            role.permissions.map((perm, idx) => (
              <div key={idx}>
                <strong>{perm.resource}</strong>
              </div>
            ))
          ) : (
            'No permissions'
          )}
        </td>
        <td>
          {role.permissions && role.permissions.length > 0 ? (
            role.permissions.map((perm, idx) => (
              <div key={idx}>
                {perm.actions.join(', ')}
              </div>
            ))
          ) : (
            'No actions'
          )}
        </td>
        <td>
          <button
            className="action-button"
            onClick={(event) => handleClick(event, role.id)}
          >
            Action
          </button>
          <Menu
            id={`action-menu-${role.id}`}
            anchorEl={anchorEl}
            open={menuId === role.id}
            onClose={handleClose}
          >
            <Link className="Link" to={`/roles/update-role/${role.id}`}>
              <MenuItem>Edit</MenuItem>
            </Link>
            <MenuItem onClick={() => handleDelete(role.id)}>Delete</MenuItem>
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

export default AllRoles;
