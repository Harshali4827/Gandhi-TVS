import axiosInstance from 'axiosInstance';
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { showSuccess, showError } from 'utils/sweetAlerts';
import '../../css/form.css';
import FormButtons from 'utils/FormButtons';
import { CFormInput, CInputGroup, CInputGroupText } from '@coreui/react';
import { cilBike } from '@coreui/icons';
import CIcon from '@coreui/icons-react';

const UpdateModel = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const branchId = queryParams.get('branch_id') || '';
  const [modelName, setModelName] = useState('');
  const [prices, setPrices] = useState([]);

  useEffect(() => {
    fetchModelDetails();
  }, [id,branchId]);

  const fetchModelDetails = async () => {
    try {
      const res = await axiosInstance.get(`/models/${id}/with-prices?branch_id=${branchId}`);
      const model = res.data.data.model;
      setModelName(model.model_name);
      setPrices(model.prices);
    } catch (err) {
      showError('Failed to load model details');
    }
  };

  const handlePriceChange = (headerId, newValue) => {
    setPrices((prev) =>
      prev.map((price) =>
        price.header_id === headerId ? { ...price, value: Number(newValue) } : price
      )
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        model_name: modelName,
        prices: prices.map(({ header_id, value }) => ({ 
          header_id, 
          value,
          branch_id: branchId
        })),
      };
      
      await axiosInstance.patch(`/models/${id}/prices`, payload);
      showSuccess('Model updated successfully!');
      navigate('/model/model-list'); 
    } catch (err) {
      console.error(err);
      showError(err.response?.data?.message || 'Failed to update model');
    }
  };

  const handleCancel = () => {
    navigate('/model/model-list');
  };

  return (
    <div>
      <h4>Update Model</h4>
      <div className="form-container">
        <div className="page-header">
          <form onSubmit={handleSubmit}>
            <div className="form-note">
              <span className="required">*</span> Field is mandatory
            </div>
            <div className="user-details">
              <div className="input-box">
                <div className="details-container">
                  <span className="details">Model name</span>
                  <span className="required">*</span>
                </div>
                <CInputGroup>
                  <CInputGroupText className="input-icon">
                    <CIcon icon={cilBike} />
                  </CInputGroupText>
                  <CFormInput
                    type="text"
                    value={modelName}
                    onChange={(e) => setModelName(e.target.value)}
                    readOnly
                    disabled
                  />
                </CInputGroup>
              </div>
              <div className="input-box">
                <div className="details-container">
                  <span className="details">Branch ID</span>
                </div>
                <CInputGroup>
                  <CInputGroupText className="input-icon">
                    <CIcon icon={cilBike} />
                  </CInputGroupText>
                  <CFormInput
                    type="text"
                    value={branchId}
                    readOnly
                    disabled
                  />
                </CInputGroup>
              </div>

              {prices.map((price, index) => (
                <div className="input-box" key={price.header_id}>
                  <div className="details-container">
                    <span className="details">{price.header_key}</span>
                  </div>
                  <CInputGroup>
                    <CInputGroupText className="input-icon">
                      <CIcon icon={cilBike} />
                    </CInputGroupText>
                    <CFormInput
                      type="number"
                      value={price.value}
                      onChange={(e) => handlePriceChange(price.header_id, e.target.value)}
                    />
                  </CInputGroup>
                </div>
              ))}
            </div>
            <FormButtons onCancel={handleCancel}/>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UpdateModel;