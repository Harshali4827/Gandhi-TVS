// import React, { useRef, useState, useEffect } from 'react';
// import Swal from 'sweetalert2';
// import axiosInstance from 'axiosInstance';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faFileImport } from '@fortawesome/free-solid-svg-icons';
// import '../../css/importCsv.css';

// const ImportCSV = ({ endpoint, onSuccess, buttonText = "Import CSV", acceptedFiles = ".csv" }) => {
//   const fileInputRef = useRef(null);
//   const [isLoading, setIsLoading] = useState(false);
//   const [branches, setBranches] = useState([]);
//   const [selectedBranchId, setSelectedBranchId] = useState('');
//   const [selectedType, setSelectedType] = useState('');

//   useEffect(() => {
//     const fetchBranches = async () => {
//       try {
//         const response = await axiosInstance.get('/branches');
//         setBranches(response.data.data || []);
//       } catch (error) {
//         console.error('Error fetching branches:', error);
//         Swal.fire({
//           title: 'Error!',
//           text: 'Failed to fetch branches. Please try again later.',
//           icon: 'error',
//           confirmButtonText: 'OK',
//         });
//       }
//     };

//     fetchBranches();
//   }, []);

//   const handleButtonClick = () => {
//     if (branches.length === 0) {
//       Swal.fire({
//         title: 'No Branches Available',
//         text: 'Please ensure branches exist before importing data.',
//         icon: 'warning',
//         confirmButtonText: 'OK',
//       });
//       return;
//     }

//     Swal.fire({
//       title: 'Import CSV',
//       width: 400, 
//       html: `
//         <div style="text-align:left">
//           <select id="branch-select" class="swal2-select" style="width:80%;margin-bottom:1em;">
//             <option value="">-- Select Branch --</option>
//             ${branches.map(b => `<option value="${b._id}">${b.name}</option>`).join('')}
//           </select>
//           <select id="type-select" class="swal2-select" style="width:80%;">
//             <option value="">-- Select Type --</option>
//             <option value="EV">EV</option>
//             <option value="ICE">ICE</option>
//           </select>
//         </div>
//       `,
//       showCancelButton: true,
//       confirmButtonText: 'Continue',
//       cancelButtonText: 'Cancel',
//       preConfirm: () => {
//         const branchSel = Swal.getPopup().querySelector('#branch-select');
//         const typeSel   = Swal.getPopup().querySelector('#type-select');
    
//         if (!branchSel.value) {
//           Swal.showValidationMessage('Please select a branch');
//           return false;
//         }
//         if (!typeSel.value) {
//           Swal.showValidationMessage('Please select a type (EV / ICE)');
//           return false;
//         }
    
//         return { branchId: branchSel.value, type: typeSel.value };
//       }
//     }).then((result) => {
//       if (result.isConfirmed) {
//         setSelectedBranchId(result.value.branchId);
//         setSelectedType(result.value.type);
//         fileInputRef.current.click();
//       }
//     });
    
//   };

//   const handleFileChange = async (e) => {
//     const file = e.target.files[0];
//     if (!file || !selectedBranchId || !selectedType) return;

//     if (!file.name.toLowerCase().endsWith('.csv')) {
//       Swal.fire({
//         title: 'Invalid File',
//         text: 'Please upload a CSV file.',
//         icon: 'error',
//         confirmButtonText: 'OK',
//       });
//       return;
//     }

//     setIsLoading(true);
//     const formData = new FormData();
//     formData.append('file', file);
//     formData.append('branch_id', selectedBranchId);
//     formData.append('type', selectedType);

//     try {
//       const response = await axiosInstance.post(endpoint, formData, {
//         headers: {
//           'Content-Type': 'multipart/form-data',
//         },
//       });

//       Swal.fire({
//         icon: 'success',
//         title: 'Success!',
//         text: response.data.message || 'File imported successfully!',
//       });

//       if (onSuccess) {
//         onSuccess();
//       }
//     } catch (error) {
//       console.error('Error uploading file:', error);
//       Swal.fire({
//         title: 'Error!',
//         text: error.response?.data?.message || 'Failed to import file. Please try again.',
//         icon: 'error',
//         confirmButtonText: 'OK',
//       });
//     } finally {
//       setIsLoading(false);
//       // Reset file input
//       if (fileInputRef.current) {
//         fileInputRef.current.value = '';
//       }
//       setSelectedBranchId('');
//       setSelectedType('');  
//     }
//   };

//   return (
//     <div className="import-csv-container">
//       <input
//         type="file"
//         ref={fileInputRef}
//         onChange={handleFileChange}
//         accept={acceptedFiles}
//         style={{ display: 'none' }}
//       />
//       <button
//         className="import-csv-button"
//         onClick={handleButtonClick}
//         disabled={isLoading || branches.length === 0}
//       >
//         {isLoading ? (
//           'Uploading...'
//         ) : (
//           <>
//             <FontAwesomeIcon icon={faFileImport} className="import-icon" />
//             {buttonText}
//           </>
//         )}
//       </button>
//     </div>
//   );
// };

// export default ImportCSV;




import React, { useRef, useState, useEffect } from 'react';
import axiosInstance from 'axiosInstance';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFileImport } from '@fortawesome/free-solid-svg-icons';
import '../../css/importCsv.css';

const ImportCSV = ({ endpoint, onSuccess, buttonText = "Import CSV", acceptedFiles = ".csv" }) => {
  const fileInputRef = useRef(null);
  const [isLoading, setIsLoading] = useState(false);
  const [branches, setBranches] = useState([]);
  const [selectedBranchId, setSelectedBranchId] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [branchError, setBranchError] = useState('');
  const [typeError, setTypeError] = useState('');

  useEffect(() => {
    const fetchBranches = async () => {
      try {
        const response = await axiosInstance.get('/branches');
        setBranches(response.data.data || []);
      } catch (error) {
        console.error('Error fetching branches:', error);
      }
    };

    fetchBranches();
  }, []);

  const handleButtonClick = () => {
    if (branches.length === 0) {
      alert('No branches available. Please ensure branches exist before importing data.');
      return;
    }
    setShowModal(true);
  };

  const handleModalConfirm = () => {
    let isValid = true;
    
    if (!selectedBranchId) {
      setBranchError('Please select a branch');
      isValid = false;
    } else {
      setBranchError('');
    }
    
    if (!selectedType) {
      setTypeError('Please select a type (EV / ICE)');
      isValid = false;
    } else {
      setTypeError('');
    }
    
    if (isValid) {
      setShowModal(false);
      fileInputRef.current.click();
    }
  };

  const handleModalCancel = () => {
    setShowModal(false);
    setSelectedBranchId('');
    setSelectedType('');
    setBranchError('');
    setTypeError('');
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file || !selectedBranchId || !selectedType) return;

    if (!file.name.toLowerCase().endsWith('.csv')) {
      alert('Please upload a CSV file.');
      return;
    }

    setIsLoading(true);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('branch_id', selectedBranchId);
    formData.append('type', selectedType);

    try {
      const response = await axiosInstance.post(endpoint, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      alert(response.data.message || 'File imported successfully!');

      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error('Error uploading file:', error);
      alert(error.response?.data?.message || 'Failed to import file. Please try again.');
    } finally {
      setIsLoading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      setSelectedBranchId('');
      setSelectedType('');  
    }
  };

  return (
    <div className="import-csv-container">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept={acceptedFiles}
        style={{ display: 'none' }}
      />
      <button
        className="import-csv-button"
        onClick={handleButtonClick}
        disabled={isLoading || branches.length === 0}
      >
        {isLoading ? (
          'Uploading...'
        ) : (
          <>
            <FontAwesomeIcon icon={faFileImport} className="import-icon" />
            {buttonText}
          </>
        )}
      </button>

      {showModal && (
        <div className="custom-modal">
          <div className="custom-modal-content">
            <div className="custom-modal-header">
              <h3 className="custom-modal-title">Import CSV</h3>
            </div>
            <div className="custom-modal-body">
              <select
                className="custom-modal-select"
                value={selectedBranchId}
                onChange={(e) => setSelectedBranchId(e.target.value)}
              >
                <option value="">-- Select Branch --</option>
                {branches.map(b => (
                  <option key={b._id} value={b._id}>{b.name}</option>
                ))}
              </select>
              {branchError && <div className="custom-modal-error">{branchError}</div>}
              
              <select
                className="custom-modal-select"
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
              >
                <option value="">-- Select Type --</option>
                <option value="EV">EV</option>
                <option value="ICE">ICE</option>
              </select>
              {typeError && <div className="custom-modal-error">{typeError}</div>}
            </div>
            <div className="custom-modal-footer">
              <button
                className="custom-modal-button custom-modal-button-cancel"
                onClick={handleModalCancel}
              >
                Cancel
              </button>
              <button
                className="custom-modal-button custom-modal-button-confirm"
                onClick={handleModalConfirm}
              >
                Continue
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImportCSV;