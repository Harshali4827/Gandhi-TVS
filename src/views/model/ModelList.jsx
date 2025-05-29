import ImportCSV from 'views/csv/ImportCSV';
import '../../css/table.css';
import {
  React, useState, useEffect, Link, Menu, MenuItem, SearchOutlinedIcon,
  FontAwesomeIcon, faCopy, faFileExcel, faFilePdf,
  getDefaultSearchFields, useTableFilter, usePagination,
  copyToClipboard, exportToCsv, exportToExcel,
  confirmDelete, showError, showSuccess, axiosInstance, CopyToClipboard
} from 'utils/tableImports';
import { faFilter } from '@fortawesome/free-solid-svg-icons';
import { exportToModelPdf } from 'utils/tableExports';
import { useParams } from 'react-router-dom';

const ModelList = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [menuId, setMenuId] = useState(null);
  const [headers, setHeaders] = useState([]);
  const [branches, setBranches] = useState([]);
  const [selectedBranch, setSelectedBranch] = useState(null);
  const [isFiltered, setIsFiltered] = useState(false);
  const [showBranchFilterModal, setShowBranchFilterModal] = useState(false);
const [tempSelectedBranch, setTempSelectedBranch] = useState(selectedBranch);
const [branchFilterError, setBranchFilterError] = useState('');
  const { branchId } = useParams();
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
    fetchBranches();
  }, []);
  const fetchData = async (branchId = null) => {
    try {
      let url = '/models';
      if (branchId) {
        url = `/models/all/with-prices?branch_id=${branchId}`;
        setIsFiltered(true);
      } else {
        setIsFiltered(false);
      }
      const response = await axiosInstance.get(url);
      let models = response.data.data?.models || response.data.data;
      models = models.map(model => ({
        ...model,
        _id: model._id || model.id 
      }));
      
      setData(models); 
      setFilteredData(models);
    } catch (error) {
      console.log('Error fetching data', error);
      showError(error.message);
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

  const fetchBranches = async () => {
    try {
      const response = await axiosInstance.get('/branches');
      setBranches(response.data.data || []);
    } catch (error) {
      console.log('Error fetching branches', error);
    }
  };

  const handleImportSuccess = () => {
    fetchData(selectedBranch);
  };
  const getBranchNameById = (branchId) => {
    const branch = branches.find(b => b._id === branchId);
    return branch ? branch.name : '';
  };
  
  const handleBranchFilter = () => {
    setTempSelectedBranch(selectedBranch);
    setShowBranchFilterModal(true);
  };
  
  const handleApplyBranchFilter = () => {
    setSelectedBranch(tempSelectedBranch);
    fetchData(tempSelectedBranch);
    setShowBranchFilterModal(false);
  };
  
  const handleCancelBranchFilter = () => {
    setShowBranchFilterModal(false);
    setTempSelectedBranch(selectedBranch);
    setBranchFilterError('');
  };
  
  const getPriceForHeader = (model, headerId) => {
    if (!model.prices) return '-';
    if (isFiltered) {
      const priceObj = model.prices.find(price => 
        price.header_key === headers.find(h => h._id === headerId)?.header_key
      );
      return priceObj ? priceObj.value : '-';
    }
    const priceObj = model.prices.find(price => price.header_id === headerId);
    return priceObj ? priceObj.value : '-';
  };

  const handleClick = (event, id) => {
    setAnchorEl(event.currentTarget);
    setMenuId(id);
  };

  const handleClose = () => {
    setAnchorEl(null);
    setMenuId(null);
  };

  // const handleExcelExport = () => exportToExcel(data, 'ModelDetails');
  // const handlePdfExport = () =>
  //   exportToModelPdf(
  //     data,
  //     ['model_name', ...headers.map(h => h.header_key)],
  //     'ModelDetails',
  //     headers,
  //     isFiltered
  //   );

  const handleDelete = async (id) => {
    const result = await confirmDelete();
    if (result.isConfirmed) {
      try {
        await axiosInstance.delete(`/models/${id}`);
        setData(data.filter((model) => (model._id || model.id) !== id));
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
      <h4>
     Models {selectedBranch && `(Filtered by ${getBranchNameById(selectedBranch)})`}
     </h4>

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
            <button 
              className={`btn2 ${isFiltered ? 'filter-active' : ''}`} 
              title="Filter by Branch" 
              onClick={handleBranchFilter}
            >
              <FontAwesomeIcon icon={faFilter} />
            </button>
            {/* <CopyToClipboard text={copyToClipboard(data)}>
              <button className="btn2" title="Copy">
                <FontAwesomeIcon icon={faCopy} />
              </button>
            </CopyToClipboard> */}
            {/* <button className="btn2" title="Excel" onClick={handleExcelExport}>
              <FontAwesomeIcon icon={faFileExcel} />
            </button>
            <button className="btn2" title="PDF" onClick={handlePdfExport}>
              <FontAwesomeIcon icon={faFilePdf} />
            </button> */}
            {/* <button className="btn2" title="Export CSV" onClick={handleCSVExportFromAPI}>
              <FontAwesomeIcon icon={faFileCsv} />
            </button> */}
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
        <div className="table-wrapper">
          <table className="responsive-table" style={{ overflow: 'auto' }}>
            <thead className='table-header-fixed'>
              <tr>
                <th>Sr.no</th>
                <th>Model name</th>
                {headers.map(header => (
                  <th key={header._id}>{header.header_key} Price</th>
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
                  <tr key={model._id}>
                    <td>{index + 1}</td>
                    <td>{model.model_name}</td>
                    {headers.map(header => (
                      <td key={`${model._id}-${header.id}`}>
                        {getPriceForHeader(model, header._id)}
                      </td>
                    ))}
                    <td>
                      <button
                        className="action-button"
                        onClick={(event) => handleClick(event, model._id)}
                      >
                        Action
                      </button>
                      <Menu
                        id={`action-menu-${model._id}`}
                        anchorEl={anchorEl}
                        open={menuId === model._id}
                        onClose={handleClose}
                      >
                      <Link 
                          className="Link" 
                          to={`/model/update-model/${model._id}?branch_id=${
                          selectedBranch || 
                          (model.prices && model.prices[0]?.branch_id) || 
                          ''
                        }`}
                      >
                     <MenuItem style={{ color: 'black' }}>Edit</MenuItem>
                     </Link>

                        <MenuItem onClick={() => handleDelete(model._id)}>Delete</MenuItem>
                      </Menu>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
          </div>
        </div>
        <PaginationOptions/>
      </div>
      {showBranchFilterModal && (
  <div className="custom-modal">
    <div className="custom-modal-content">
      <div className="custom-modal-header">
        <h3 className="custom-modal-title">Filter by Branch</h3>
      </div>
      <div className="custom-modal-body">
        <label htmlFor="branch-select" style={{ display: 'block', marginBottom: '8px', textAlign: 'left' }}>
          Select Branch
        </label>
        <select
          _id="branch-select"
          className="custom-modal-select"
          value={tempSelectedBranch || ''}
          onChange={(e) => setTempSelectedBranch(e.target.value || null)}
        >
          <option value="">-- All Branches --</option>
          {branches.map(branch => (
            <option key={branch._id} value={branch._id}>
              {branch.name}
            </option>
          ))}
        </select>
        {branchFilterError && <div className="custom-modal-error">{branchFilterError}</div>}
      </div>
      <div className="custom-modal-footer">
        <button
          className="custom-modal-button custom-modal-button-cancel"
          onClick={handleCancelBranchFilter}
        >
          Cancel
        </button>
        <button
          className="custom-modal-button custom-modal-button-confirm"
          onClick={handleApplyBranchFilter}
        >
          Apply Filter
        </button>
      </div>
    </div>
  </div>
)}
    </div>
  );
};

export default ModelList;
