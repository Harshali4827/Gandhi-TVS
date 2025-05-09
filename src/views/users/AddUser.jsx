import React, { useState, useEffect } from 'react';
import '../../css/form.css'
import { CInputGroup, CInputGroupText, CFormInput, CFormSelect,} from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilEnvelopeClosed,cilLocationPin,cilPhone, cilUser } from '@coreui/icons';
import { useNavigate, useParams } from 'react-router-dom';
import { showFormSubmitError, showFormSubmitToast } from 'utils/sweetAlerts';
import axiosInstance from 'axiosInstance';
import { jwtDecode } from 'jwt-decode';
function AddUser() {
const [formData,setFormData] = useState({
    username:'',
    email:'',
    full_name:'',
    branch_id:'',
    role_id:'',
    mobile:'',
    created_by:''
  })
  const [roles, setRoles] = useState([]); 
  const [branches, setBranches] = useState([]);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const {id} = useParams();
  
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded = jwtDecode(token);
        if (decoded && decoded.user_id) {
          setFormData((prevData) => ({
            ...prevData,
            created_by: decoded.user_id
          }));
        }
      } catch (error) {
        console.error('Invalid token:', error);
      }
    }
  }, []);
  
  useEffect(() => {
    if(id){
      fetchUser(id);
    }
  },[id])

  const fetchUser = async (id) => {
    try{
      const res =  await axiosInstance.get(`/users/${id}`)
      const userData = res.data.data;
      const normalizedData = {
      ...userData,
      branch_id: userData.branch_id?._id || '',
      role_id: userData.role_id?._id || '',
    };
    setFormData(normalizedData);
    } catch(error){
      console.error('Error fetching users',error)
    }
  }
  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const response = await axiosInstance.get('/roles');
        setRoles(response.data.data || []);
      } catch (error) {
        console.error('Error fetching roles:', error);
        showFormSubmitError(error);
      }
    };

    fetchRoles();
  }, []);
  useEffect(() => {
    const fetchBranches = async () => {
      try {
        const response = await axiosInstance.get('/branches');
        setBranches(response.data.data || []);
      } catch (error) {
        console.error('Error fetching branches:', error);
        showFormSubmitError(error);
      }
    };

    fetchBranches();
  }, []);
   const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    // setErrors((prevErrors) => ({ ...prevErrors, [name]: '' }));
    if (name === 'username') {
      const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;
      if (!value) {
        setErrors((prev) => ({ ...prev, username: 'This field is required' }));
      } else if (!usernameRegex.test(value)) {
        setErrors((prev) => ({
          ...prev,
          username: 'Username must be 3-20 characters, only letters, numbers, and underscores',
        }));
      } else {``
        setErrors((prev) => ({ ...prev, username: '' }));
      }
    } else {
      setErrors((prevErrors) => ({ ...prevErrors, [name]: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let formErrors = {};

    if (!formData.username) formErrors.username = 'This field is required';
    if (!formData.email) formErrors.email = 'This field is required';
    if (!formData.full_name) formErrors.full_name = 'This field is required';
    if (!formData.mobile) formErrors.mobile = 'This field is required';
    if (!formData.branch_id) formErrors.branch_id = 'This field is required';
    if (!formData.role_id) formErrors.role_id = 'This field is required';
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }
    const payload = {
      ...formData,
      branch_id: String(formData.branch_id),
      role_id: String(formData.role_id),
    };
    console.log('Submitting payload:', payload);

    try {
      if(id){
        await axiosInstance.put(`/users/${id}`, payload);
        await showFormSubmitToast('User updated successfully!', 
          () => navigate('/users/users-list'));
      }else{
        await axiosInstance.post('/users/register',payload);
        await showFormSubmitToast('User added successfully!', 
          () => navigate('/users/users-list'));
      }
    } catch (error) {
      console.error('Error details:', error);
      showFormSubmitError(error)
    }
  };

  const handleCancel = () => {
    navigate('/users/users-list');
  };
  return (
    <div>
       <h4>{id ? 'Edit' : 'Add'} User</h4>
    <div className="form-container">
      <div className="page-header">
        <form  onSubmit={handleSubmit}>
          <div className="form-note">
            <span className="required">*</span> Field is mandatory
          </div>
          <div className="user-details">
             <div className="input-box">
              <div className="details-container">
                <span className="details">Username</span>
                <span className="required">*</span>
              </div>
              <CInputGroup>
                <CInputGroupText className="input-icon">
                  <CIcon icon={cilUser} />
                </CInputGroupText>
                <CFormInput
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                />
              </CInputGroup>
              {errors.username && <p className="error">{errors.username}</p>}
            </div>
            <div className="input-box">
            <div className="details-container">
              <span className="details">Email</span>
              <span className="required">*</span>
              </div>
              <CInputGroup>
                <CInputGroupText className="input-icon">
                  <CIcon icon={cilEnvelopeClosed} />
                </CInputGroupText>
                <CFormInput
                  type="text"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                />
              </CInputGroup>
              {errors.email && <p className="error">{errors.email}</p>}
            </div>
            <div className="input-box">
            <div className="details-container">
              <span className="details">Full name</span>
              <span className="required">*</span>
              </div>
              <CInputGroup>
                <CInputGroupText className="input-icon">
                  <CIcon icon={cilUser} />
                </CInputGroupText>
                <CFormInput
                  type="text"
                  name="full_name"
                  value={formData.full_name}
                  onChange={handleChange}
                />
              </CInputGroup>
              {errors.full_name && <p className="error">{errors.full_name}</p>}
            </div>
            <div className="input-box">
            <div className="details-container">
              <span className="details">Branch</span>
              <span className="required">*</span>
              </div>
              <CInputGroup>
                <CInputGroupText className="input-icon">
                  <CIcon icon={cilLocationPin} />
                </CInputGroupText>
                <CFormSelect 
                    name="branch_id" 
                    value={formData.branch_id} 
                    onChange={handleChange}
                  >
                    <option value="">-Select-</option>
                    {branches.map((branch) => (
                      <option key={branch._id} value={branch._id}>
                        {branch.name}
                      </option>
                    ))}
                  </CFormSelect>
              </CInputGroup>
              {errors.branch_id && <p className="error">{errors.branch_id}</p>}
            </div>
            <div className="input-box">
            <div className="details-container">
              <span className="details">Role</span>
              <span className="required">*</span>
              </div>
              <CInputGroup>
                <CInputGroupText className="input-icon">
                  <CIcon icon={cilUser} />
                </CInputGroupText>
                <CFormSelect 
                    name="role_id" 
                    value={formData.role_id} 
                    onChange={handleChange}
                  >
                    <option value="">-Select-</option>
                    {roles.map((role) => (
                      <option key={role._id} value={role._id}>
                        {role.name}
                      </option>
                    ))}
                  </CFormSelect>
              </CInputGroup>
              {errors.role_id && <p className="error">{errors.role_id}</p>}
            </div>
            <div className="input-box">
            <div className="details-container">
              <span className="details">Mobile number</span>
              <span className="required">*</span>
              </div>
              <CInputGroup>
                <CInputGroupText className="input-icon">
                  <CIcon icon={cilPhone} />
                </CInputGroupText>
                <CFormInput
                  type="text"
                  name="mobile"
                  value={formData.mobile}
                  onChange={handleChange}
                />
              </CInputGroup>
              {errors.mobile && <p className="error">{errors.mobile}</p>}
            </div>
          </div>
          <div className="button-row">
            <button type="submit" className="simple-button primary-button">
              Save
            </button>
            <button type="button" className="simple-button secondary-button" onClick={handleCancel}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
    </div>
  );
}
export default AddUser;
