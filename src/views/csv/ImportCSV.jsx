// import React, { useRef, useState } from 'react';
// import Swal from 'sweetalert2';
// import axiosInstance from 'axiosInstance';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faFileImport } from '@fortawesome/free-solid-svg-icons';
// import '../../css/importCsv.css';

// const ImportCSV = ({ endpoint, onSuccess, buttonText = "Import CSV", acceptedFiles = ".csv" }) => {
//   const fileInputRef = useRef(null);
//   const [isLoading, setIsLoading] = useState(false);

//   const handleButtonClick = () => {
//     fileInputRef.current.click();
//   };

//   const handleFileChange = async (e) => {
//     const file = e.target.files[0];
//     if (!file) return;

//     // Validate file type
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
//         disabled={isLoading}
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
import Swal from 'sweetalert2';
import axiosInstance from 'axiosInstance';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFileImport } from '@fortawesome/free-solid-svg-icons';
import '../../css/importCsv.css';

const ImportCSV = ({ endpoint, onSuccess, buttonText = "Import CSV", acceptedFiles = ".csv" }) => {
  const fileInputRef = useRef(null);
  const [isLoading, setIsLoading] = useState(false);
  const [branches, setBranches] = useState([]);
  const [selectedBranchId, setSelectedBranchId] = useState('');

  useEffect(() => {
    const fetchBranches = async () => {
      try {
        const response = await axiosInstance.get('/branches');
        setBranches(response.data.data || []);
      } catch (error) {
        console.error('Error fetching branches:', error);
        Swal.fire({
          title: 'Error!',
          text: 'Failed to fetch branches. Please try again later.',
          icon: 'error',
          confirmButtonText: 'OK',
        });
      }
    };

    fetchBranches();
  }, []);

  const handleButtonClick = () => {
    if (branches.length === 0) {
      Swal.fire({
        title: 'No Branches Available',
        text: 'Please ensure branches exist before importing data.',
        icon: 'warning',
        confirmButtonText: 'OK',
      });
      return;
    }

    Swal.fire({
      title: 'Import CSV',
      html: `
        <div>
          <label for="branch-select" style="display: block; margin-bottom: 8px; text-align: left;">Select Branch</label>
          <select 
            id="branch-select" 
            class="swal2-select"
            style="display: block; width:90%; margin-bottom: 1em;"
          >
            <option value="">-- Select Branch --</option>
            ${branches.map(branch => `
              <option value="${branch._id}">${branch.name}</option>
            `).join('')}
          </select>
        </div>
      `,
      showCancelButton: true,
      confirmButtonText: 'Continue',
      cancelButtonText: 'Cancel',
      preConfirm: () => {
        const select = Swal.getPopup().querySelector('#branch-select');
        if (!select.value) {
          Swal.showValidationMessage('Please select a branch');
          return false;
        }
        return select.value;
      }
    }).then((result) => {
      if (result.isConfirmed) {
        setSelectedBranchId(result.value);
        fileInputRef.current.click();
      }
    });
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file || !selectedBranchId) return;

    // Validate file type
    if (!file.name.toLowerCase().endsWith('.csv')) {
      Swal.fire({
        title: 'Invalid File',
        text: 'Please upload a CSV file.',
        icon: 'error',
        confirmButtonText: 'OK',
      });
      return;
    }

    setIsLoading(true);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('branch_id', selectedBranchId);

    try {
      const response = await axiosInstance.post(endpoint, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      Swal.fire({
        icon: 'success',
        title: 'Success!',
        text: response.data.message || 'File imported successfully!',
      });

      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error('Error uploading file:', error);
      Swal.fire({
        title: 'Error!',
        text: error.response?.data?.message || 'Failed to import file. Please try again.',
        icon: 'error',
        confirmButtonText: 'OK',
      });
    } finally {
      setIsLoading(false);
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      setSelectedBranchId('');
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
    </div>
  );
};

export default ImportCSV;