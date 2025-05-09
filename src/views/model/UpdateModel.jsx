// import axiosInstance from 'axiosInstance';
// import React, { useEffect, useState } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import { showSuccess, showError, showFormSubmitSuccess } from 'utils/sweetAlerts';
// import '../../css/form.css';
// import FormButtons from 'utils/FormButtons';
// import { CFormInput, CInputGroup, CInputGroupText } from '@coreui/react';
// import { cilBike } from '@coreui/icons';
// import CIcon from '@coreui/icons-react';
// const UpdateModel = () => {
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const [modelName, setModelName] = useState('');
//   const [prices, setPrices] = useState([]);

//   useEffect(() => {
//     fetchModelDetails();
//   }, []);

//   const fetchModelDetails = async () => {
//     try {
//       const res = await axiosInstance.get(`/models/id/${id}`);
//       const model = res.data.data.model;
//       setModelName(model.model_name);
//       setPrices(model.prices);
//     } catch (err) {
//       showError('Failed to load model details');
//     }
//   };

//   const handlePriceChange = (headerId, newValue) => {
//     setPrices((prev) =>
//       prev.map((price) =>
//         price.header_id === headerId ? { ...price, value: Number(newValue) } : price
//       )
//     );
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       await axiosInstance.patch(`/models/${id}/prices`, {
//         model_name: modelName,
//         prices: prices.map(({ header_id, value }) => ({ header_id, value })),
//       });
//       showFormSubmitSuccess('Model updated successfully!');
//       navigate('/model/model-list'); 
//     } catch (err) {
//       console.error(err);
//       showError('Failed to update model');
//     }
//   };
//   const handleCancel = () => {
//     navigate('/model/model-list');
//   };

//   return (
//     <div>
//   <h4>Update Model</h4>
//   <div className="form-container">
//     <div className="page-header">
//       <form onSubmit={handleSubmit}>
//         <div className="form-note">
//           <span className="required">*</span> Field is mandatory
//         </div>
//         <div className="user-details">
//           <div className="input-box">
//             <div className="details-container">
//               <span className="details">Model name</span>
//               <span className="required">*</span>
//             </div>
//             <CInputGroup>
//               <CInputGroupText className="input-icon">
//                 <CIcon icon={cilBike} />
//               </CInputGroupText>
//               <CFormInput
//                 type="text"
//                 value={modelName}
//                 onChange={(e) => setModelName(e.target.value)}
//                 readOnly
//                 disabled
//               />
//             </CInputGroup>
//           </div>
//           {prices.map((price, index) => (
//             <div className="input-box" key={price.header_id}>
//               <div className="details-container">
//                 <span className="details">{price.header_key}</span>
//               </div>
//               <CInputGroup>
//                 <CInputGroupText className="input-icon">
//                   <CIcon icon={cilBike} />
//                 </CInputGroupText>
//                 <CFormInput
//                   type="number"
//                   value={price.value}
//                   onChange={(e) => handlePriceChange(price.header_id, e.target.value)}
//                 />
//               </CInputGroup>
//             </div>
//           ))}
//         </div>
//         <FormButtons onCancel={handleCancel}/>
//       </form>
//     </div>
//   </div>
// </div>
//  );
// };

// export default UpdateModel;


import axiosInstance from 'axiosInstance';
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { showSuccess, showError } from 'utils/sweetAlerts';
import '../../css/form.css';
import FormButtons from 'utils/FormButtons';
import { CFormInput, CInputGroup, CInputGroupText } from '@coreui/react';
import { cilBike } from '@coreui/icons';
import CIcon from '@coreui/icons-react';

const UpdateModel = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [modelName, setModelName] = useState('');
  const [prices, setPrices] = useState([]);
  const [branchId, setBranchId] = useState(''); // Add branchId state

  useEffect(() => {
    fetchModelDetails();
  }, []);

  const fetchModelDetails = async () => {
    try {
      const res = await axiosInstance.get(`/models/id/${id}`);
      const model = res.data.data.model;
      setModelName(model.model_name);
      setPrices(model.prices);
      // Set branchId from the first price entry (assuming all prices have same branch)
      if (model.prices.length > 0) {
        setBranchId(model.prices[0].branch_id);
      }
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
      // Include branch_id in each price object
      const payload = {
        model_name: modelName,
        prices: prices.map(({ header_id, value }) => ({ 
          header_id, 
          value,
          branch_id: branchId // Add branch_id to each price
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

              {/* Display branch ID (read-only) */}
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