//not added filter functionality
import ImportCSV from 'views/csv/ImportCSV';
import '../../css/table.css';
import {
  React, useState, useEffect, Link, Menu, MenuItem, SearchOutlinedIcon,
  FontAwesomeIcon, faCopy, faFileExcel, faFilePdf, faFileCsv, CSVLink, getDefaultSearchFields, useTableFilter,usePagination, copyToClipboard, exportToCsv, exportToExcel, exportToPdf,
  confirmDelete, showError, showSuccess, axiosInstance, CopyToClipboard
} from 'utils/tableImports';

const ModelList = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [menuId, setMenuId] = useState(null);
  const [headers, setHeaders] = useState([]); 
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
    fetchHeaders();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axiosInstance.get(`/models`);
      setData(response.data.data.models); 
      setFilteredData(response.data.data.models);
    } catch (error) {
      console.log('Error fetching data', error);
    }
  };

  const fetchHeaders = async () => {
    try {
      const response = await axiosInstance.get('/headers');
      setHeaders(response.data.data.headers);
    } catch (error) {
      console.log('Error fetching headers', error);
    }
  };

  const handleImportSuccess = () => {
    fetchData();
  };
  
  const handleClick = (event, id) => {
    setAnchorEl(event.currentTarget);
    setMenuId(id);
  };

  const handleClose = () => {
    setAnchorEl(null);
    setMenuId(null);
  };

  const handleExcelExport = () => exportToExcel(data, 'ModelDetails');
  const handlePdfExport = () => exportToPdf(
    data,
    ['model_name', ...headers.map(header => header.header_key)], 
    'ModelDetails'
  );
  
  const csvExport = exportToCsv(data, 'ModelDetails');

  const handleDelete = async (id) => {
    const result = await confirmDelete();
    if (result.isConfirmed) {
      try {
        await axiosInstance.delete(`/models/${id}`);
        setData(data.filter((model) => model.id !== id));
        fetchData();
        showSuccess();
      } catch (error) {
        console.log(error);
        showError();
      }
    }
  };
  const handleCSVExportFromAPI = async () => {
    try {
      const response = await axiosInstance.get('/csv/export-template?filled=true', {
        responseType: 'blob', 
      });
  
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'exported_data.csv'); 
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error('CSV export failed:', error);
      showError('Failed to export CSV.');
    }
  };
  const getPriceForHeader = (model, headerId) => {
    const priceObj = model.prices.find(price => price.header_id === headerId);
    return priceObj ? priceObj.value : '-';
  };

  return (
    <div>
      <h4>Models</h4>
    <div className="table-container">
      <div className="table-header">
        <div className="search-icon-data">
          <input 
            type="text" 
            placeholder="Search.."   
            onChange={(e) => handleFilter(e.target.value, getDefaultSearchFields('models'))}
          />
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
           <button className="btn2" title="Export CSV from API" onClick={handleCSVExportFromAPI}>
                  <FontAwesomeIcon icon={faFileCsv} />
           </button>

          <ImportCSV
            endpoint="/csv/import" 
            onSuccess={handleImportSuccess}
            buttonText="Import CSV"
          />
        </div>
        <Link to="/model/add-model">
          <button className="new-user-btn">+ New Model</button>
        </Link>
      </div>
      <div className="table-responsive">
        <table className="responsive-table" style={{ overflow: 'auto' }}>
          <thead>
            <tr>
              <th>Sr.no</th>
              <th>Model name</th>
              {headers.map(header => (
                <th key={header.id}>{header.header_key} Price</th>
              ))}
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {currentRecords.length === 0 ? (
              <tr>
                <td colSpan={headers.length + 3}>No models available</td>
              </tr>
            ) : (
              currentRecords.map((model, index) => (
                <tr key={model.id}>
                  <td>{index + 1}</td>
                  <td>{model.model_name}</td>
                  {headers.map(header => (
                    <td key={`${model.id}-${header.id}`}>
                      {getPriceForHeader(model, header._id)}
                    </td>
                  ))}
                  <td>
                    <button
                      className="action-button"
                      onClick={(event) => handleClick(event, model.id)}
                    >
                      Action
                    </button>
                    <Menu
                      id={`action-menu-${model.id}`}
                      anchorEl={anchorEl}
                      open={menuId === model.id}
                      onClose={handleClose}
                    >
                      <Link className="Link" to={`/model/update-model/${model.id}`}>
                        <MenuItem style={{ color: 'black' }}>Edit</MenuItem>
                      </Link>
                      <MenuItem onClick={() => handleDelete(model.id)}>Delete</MenuItem>
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

export default ModelList;