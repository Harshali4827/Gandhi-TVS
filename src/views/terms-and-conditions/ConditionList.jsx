import '../../css/table.css';
import {
  React, useState, useEffect, Link, Menu, MenuItem, SearchOutlinedIcon,
  FontAwesomeIcon, faCopy, faFileExcel, faFilePdf, faFileCsv, CSVLink, getDefaultSearchFields, useTableFilter,usePagination, copyToClipboard, exportToCsv, exportToExcel, exportToPdf,
  confirmDelete, showError, showSuccess, axiosInstance, CopyToClipboard,
  FaCheckCircle,
  FaTimesCircle
} from 'utils/tableImports';

const ConditionList = () => {
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
      const response = await axiosInstance.get(`/terms-conditions`);
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
  const handleExcelExport = () => exportToExcel(data, 'TermsAndConditions');
  const handlePdfExport = () => exportToPdf(
    data,
    ['title','content','order'],
    'TermsAndConditions'
  );
  
  const csvExport = exportToCsv(data, 'TermsAndConditions');

  const handleDelete = async (id) => {
    const result = await confirmDelete();
    if (result.isConfirmed) {
      try {
        await axiosInstance.delete(`/terms-conditions/${id}`);
        setData(data.filter((condition) => condition.id !== id));
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
        <h4>Terms and Conditions</h4>
    <div className="table-container">
      <div className="table-header">
        <div className="search-icon-data">
          <input type="text" placeholder="Search.."   onChange={(e) =>
               handleFilter(e.target.value, getDefaultSearchFields('conditions'))
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
          <CSVLink {...csvExport} className="csv-link">
              <FontAwesomeIcon icon={faFileCsv} />
            </CSVLink>
          </button> */}
        </div>
        <Link to="/conditions/add-condition">
          <button className="new-user-btn">+ New condition</button>
        </Link>
      </div>
      <div className="table-responsive">
        <table className="responsive-table" style={{ overflow: 'auto' }}>
          <thead>
            <tr>
              <th>Sr.no</th>
               <th>Title</th>
               <th>Content</th>
               <th>Order</th>
               <th>Is active</th>
               <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {currentRecords.length === 0 ? (
              <tr>
                <td colSpan="4">No model available</td>
              </tr>
            ) : (
              currentRecords.map((condition, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{condition.title}</td>
                  <td>{condition.content}</td>
                  <td>{condition.order}</td>
                  <td>
                    <span className={`status-text ${condition.isActive}`}>
                      {condition.isActive === true ? (
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
                      onClick={(event) => handleClick(event, condition._id)}
                    >
                      Action
                    </button>
                    <Menu
                      id={`action-menu-${condition._id}`}
                      anchorEl={anchorEl}
                      open={menuId === condition._id}
                      onClose={handleClose}
                    >
                      <Link className="Link" to={`/conditions/update-condition/${condition._id}`}>
                        <MenuItem>Edit</MenuItem>
                      </Link>
                      <MenuItem onClick={() => handleDelete(condition._id)}>Delete</MenuItem>
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

export default ConditionList;
