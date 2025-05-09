import '../../css/table.css';
import {
  React, useState, useEffect, Link, Menu, MenuItem, SearchOutlinedIcon,
  FontAwesomeIcon, faCopy, faFileExcel, faFilePdf, getDefaultSearchFields, useTableFilter,usePagination, copyToClipboard, exportToCsv, exportToExcel, exportToPdf,
  confirmDelete, showError, showSuccess, axiosInstance, CopyToClipboard,
  FaCheckCircle,
  FaTimesCircle
} from 'utils/tableImports';

const DocumentList = () => {
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
      const response = await axiosInstance.get(`/finance-documents`);
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
  const handleExcelExport = () => exportToExcel(data, 'Documents');
  const handlePdfExport = () => exportToPdf(
    data,
    ['name','isRequired','description'],
    'Documents'
  );
  
  const csvExport = exportToCsv(data, 'Documents');

  const handleDelete = async (id) => {
    const result = await confirmDelete();
    if (result.isConfirmed) {
      try {
        await axiosInstance.delete(`/finance-documents/${id}`);
        setData(data.filter((gate) => gate.id !== id));
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
               handleFilter(e.target.value, getDefaultSearchFields('documents'))
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
           <Link to="/documents/add-document">
          <button className="new-user-btn">+ New Document</button>
        </Link>
        </div>
      </div>
      <div className="table-responsive">
        <table className="responsive-table" style={{ overflow: 'auto' }}>
          <thead>
            <tr>
              <th>Sr.no</th>
               <th>Document name</th>
               <th>Description</th>
               <th>Is required</th>
               <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {currentRecords.length === 0 ? (
              <tr>
                <td colSpan="4">No model available</td>
              </tr>
            ) : (
              currentRecords.map((document, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{document.name}</td>
                  <td>{document.description}</td>
                  {/* <td>{document.isRequired}</td> */}
                  <td>
                    <span className={`status-text ${document.isRequired}`}>
                      {document.isRequired === true ? (
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
                      onClick={(event) => handleClick(event, document._id)}
                    >
                      Action
                    </button>
                    <Menu
                      id={`action-menu-${document._id}`}
                      anchorEl={anchorEl}
                      open={menuId === document._id}
                      onClose={handleClose}
                    >
                      <Link className="Link" to={`/documents/update-document/${document._id}`}>
                        <MenuItem style={{ color: 'black' }}>Edit</MenuItem>
                      </Link>
                      <MenuItem onClick={() => handleDelete(document._id)}>Delete</MenuItem>
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

export default DocumentList;
