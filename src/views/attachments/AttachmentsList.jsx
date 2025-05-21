


import '../../css/table.css';
import {
  React, useState, useEffect, Link, Menu, MenuItem, SearchOutlinedIcon,
  FontAwesomeIcon, faCopy, faFileExcel, faFilePdf, getDefaultSearchFields, useTableFilter, usePagination, copyToClipboard, exportToExcel, exportToPdf,
  confirmDelete, showError, showSuccess, axiosInstance, CopyToClipboard,
  FaCheckCircle,
  FaTimesCircle
} from 'utils/tableImports';

const AttachmentsList = () => {
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
      const response = await axiosInstance.get(`/attachment`);
      setData(response.data.data.attachments);
      setFilteredData(response.data.data.attachments);
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
  
  const handleExcelExport = () => exportToExcel(data, 'Attachments');
  const handlePdfExport = () => exportToPdf(
    data,
    ['title','description','isForAllModels','applicableModels'],
    'Attachments'
  );
  
//   const csvExport = exportToCsv(data, 'Attachments');

  const handleDelete = async (id) => {
    const result = await confirmDelete();
    if (result.isConfirmed) {
      try {
        await axiosInstance.delete(`/attachment/${id}`);
        setData(data.filter((attachment) => attachment.id !== id));
        fetchData();
        showSuccess();
      } catch (error) {
        console.log(error);
        showError();
      }
    }
  };

  const renderAttachmentPreviews = (attachments, type) => {
    const filtered = attachments.filter(a => a.type === type);
    
    if (filtered.length === 0) return null;

    return (
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px' }}>
        {filtered.map((attachment, idx) => {
          switch (attachment.type) {
            case 'image':
              return (
                <img 
                  key={idx}
                  src={`${axiosInstance.defaults.baseURL}${attachment.url}`} 
                  alt="Attachment" 
                  style={{ 
                    width: '50px', 
                    height: '50px', 
                    objectFit: 'cover',
                    borderRadius: '4px',
                    cursor: 'pointer'
                  }}
                  onClick={() => window.open(`${axiosInstance.defaults.baseURL}${attachment.url}`, '_blank')}
                />
              );
            case 'video':
              return (
                <div 
                  key={idx}
                  style={{
                    width: '50px',
                    height: '50px',
                    backgroundColor: '#f0f0f0',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: '4px',
                    cursor: 'pointer'
                  }}
                  onClick={() => window.open(`${axiosInstance.defaults.baseURL}${attachment.url}`, '_blank')}
                >
                  <i className="fas fa-video" style={{ color: '#666' }}></i>
                </div>
              );
            case 'document':
              return (
                <div 
                  key={idx}
                  style={{
                    width: '50px',
                    height: '50px',
                    backgroundColor: '#f0f0f0',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: '4px',
                    cursor: 'pointer'
                  }}
                  onClick={() => window.open(`${axiosInstance.defaults.baseURL}${attachment.url}`, '_blank')}
                >
                  <i className="fas fa-file" style={{ color: '#666' }}></i>
                </div>
              );
            case 'youtube':
              return (
                <div 
                  key={idx}
                  style={{
                    width: '50px',
                    height: '50px',
                    backgroundColor: '#f0f0f0',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: '4px',
                    cursor: 'pointer'
                  }}
                  onClick={() => window.open(attachment.url, '_blank')}
                >
                  <i className="fab fa-youtube" style={{ color: 'red' }}></i>
                </div>
              );
            default:
              return null;
          }
        })}
      </div>
    );
  };

  return (
    <div>
      <h4>Attachments</h4>
      <div className="table-container">
       <div className="table-header">
          <div className="search-icon-data">
            <input 
              type="text" 
              placeholder="Search.."   
              onChange={(e) => handleFilter(e.target.value, getDefaultSearchFields('attachments'))}
            />
            <SearchOutlinedIcon />
          </div>
          <div className="buttons">
            {/* <CopyToClipboard text={copyToClipboard(data)}>
              <button className="btn2" title="Copy">
                <FontAwesomeIcon icon={faCopy} />
              </button>
            </CopyToClipboard>
            <button className="btn2" title="Excel" onClick={handleExcelExport}>
              <FontAwesomeIcon icon={faFileExcel} />
            </button>
            <button className="btn2" title="PDF" onClick={handlePdfExport}>
              <FontAwesomeIcon icon={faFilePdf} />
            </button> */}
            <Link to="/attachments/add-attachments">
              <button className="new-user-btn">+ New Attachment</button>
            </Link>
          </div>
        </div>
        <div className="table-responsive">
          <table className="responsive-table" style={{ overflow: 'auto' }}>
            <thead>
              <tr>
                <th>Sr.no</th>
                <th>Title</th>
                <th>Description</th>
                {/* <th>Images</th> */}
                <th>Videos</th>
                <th>Documents</th>
                <th>YouTube</th>
                <th>Apply to all models?</th>
                <th>Applicable models</th>
                <th>Created At</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {currentRecords.length === 0 ? (
                <tr>
                  <td colSpan="12">No attachments available</td>
                </tr>
              ) : (
                currentRecords.map((attachment, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{attachment.title}</td>
                    <td>{attachment.description.substring(0, 50)}{attachment.description.length > 50 ? '...' : ''}</td>
                    {/* <td>{renderAttachmentPreviews(attachment.attachments, 'image')}</td> */}
                    <td>{renderAttachmentPreviews(attachment.attachments, 'video')}</td>
                    <td>{renderAttachmentPreviews(attachment.attachments, 'document')}</td>
                    <td>{renderAttachmentPreviews(attachment.attachments, 'youtube')}</td>
                    <td>
                      {attachment.isForAllModels ? (
                        <FaCheckCircle className="status-icon active-icon" />
                      ) : (
                        <FaTimesCircle className="status-icon inactive-icon" />
                      )}
                    </td>
                    <td>
  {attachment.isForAllModels
    ? 'All'
    : Array.isArray(attachment.applicableModels) && attachment.applicableModels.length > 0
    ? attachment.applicableModels.map(model => model.model_name).join(', ')
    : '—'}
</td>
                    <td>{new Date(attachment.createdAt).toLocaleDateString()}</td>
                    <td>
                      <button
                        className="action-button"
                        onClick={(event) => handleClick(event, attachment.id)}
                      >
                        Action
                      </button>
                      <Menu
                        id={`action-menu-${attachment.id}`}
                        anchorEl={anchorEl}
                        open={menuId === attachment.id}
                        onClose={handleClose}
                      >
                        <Link className="Link" to={`/attachments/update-attachments/${attachment._id}`}>
                          <MenuItem style={{ color: 'black' }}>Edit</MenuItem>
                        </Link>
                        <MenuItem onClick={() => handleDelete(attachment._id)}>Delete</MenuItem>
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

export default AttachmentsList;