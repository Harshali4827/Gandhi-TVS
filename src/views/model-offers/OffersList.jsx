import config from 'config';
import '../../css/table.css';
import {
  React, useState, useEffect, Link, Menu, MenuItem, SearchOutlinedIcon,
  FontAwesomeIcon, faCopy, faFileExcel, faFilePdf, getDefaultSearchFields, useTableFilter,usePagination, copyToClipboard, exportToCsv, exportToExcel, exportToPdf,
  confirmDelete, showError, showSuccess, axiosInstance, CopyToClipboard,
  FaCheckCircle,
  FaTimesCircle
} from 'utils/tableImports';

const OffersList = () => {
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
      const response = await axiosInstance.get(`/offers`);
      setData(response.data.data.offers);
      setFilteredData(response.data.data.offers);

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
  const handleExcelExport = () => exportToExcel(data, 'Offers');
  const handlePdfExport = () => exportToPdf(
    data,
    ['title','description','isActive','applyToAllModels','applicableModels'],
    'Offers'
  );
  
  const csvExport = exportToCsv(data, 'Offers');

  const handleDelete = async (id) => {
    const result = await confirmDelete();
    if (result.isConfirmed) {
      try {
        await axiosInstance.delete(`/offers/${id}`);
        setData(data.filter((offer) => offer.id !== id));
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
      <h4>Offers</h4>
    <div className="table-container">
      <div className="table-header">
        <div className="search-icon-data">
          <input type="text" placeholder="Search.."   onChange={(e) =>
               handleFilter(e.target.value, getDefaultSearchFields('offers'))
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
           <Link to="/offers/add-offer">
          <button className="new-user-btn">+ New Offer</button>
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
               <th>URL</th>
               <th>Image</th>
               <th>Apply to all models?</th>
               <th>Applicable models</th>
               <th>Is active</th>
               <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {currentRecords.length === 0 ? (
              <tr>
                <td colSpan="4">No offer available</td>
              </tr>
            ) : (
              currentRecords.map((offer, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{offer.title}</td>
                  <td>{offer.description}</td>
                  <td><Link to={offer.url}>{offer.url}</Link></td>
                  <td>
  {offer.image ? (
    <img
      src={`${axiosInstance.defaults.baseURL}${offer.image}`}
      alt="Offer"
      style={{ width: '50px', height: '50px', objectFit: 'cover' }}
    />
  ) : (
    'No Image'
  )}
</td>

                  <td>{offer.applyToAllModels ? 'Yes' : 'No'}</td>
                  <td>
  {offer.applyToAllModels
    ? 'All'
    : Array.isArray(offer.applicableModels) && offer.applicableModels.length > 0
    ? offer.applicableModels.map(model => model.model_name).join(', ')
    : '—'}
</td>


                  <td>
                    <span className={`status-text ${offer.isActive}`}>
                      {offer.isActive === true ? (
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
                      onClick={(event) => handleClick(event, offer.id)}
                    >
                      Action
                    </button>
                    <Menu
                      id={`action-menu-${offer.id}`}
                      anchorEl={anchorEl}
                      open={menuId === offer.id}
                      onClose={handleClose}
                    >
                      <Link className="Link" to={`/offers/update-offer/${offer._id}`}>
                        <MenuItem style={{ color: 'black' }}>Edit</MenuItem>
                      </Link>
                      <MenuItem onClick={() => handleDelete(offer._id)}>Delete</MenuItem>
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

export default OffersList;
