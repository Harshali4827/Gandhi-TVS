import React, { useEffect, useState } from 'react';
import '../../css/form.css'
import { CInputGroup, CInputGroupText, CFormInput, CFormSelect, CFormSwitch } from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilListRich,cilUser } from '@coreui/icons';
import { useNavigate, useParams } from 'react-router-dom';
import { showFormSubmitError, showFormSubmitToast } from 'utils/sweetAlerts';
import axiosInstance from 'axiosInstance';
import FormButtons from 'utils/FormButtons';

function CreateRole() {
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        permissions: [
          { resource: '', actions: [] }
        ],
        is_default: false
      });
    
      const [errors, setErrors] = useState({});
      const navigate = useNavigate();
      const { id } = useParams();

      useEffect(() => {
        if(id){
          fetchRoles(id);
        }
      },[id]);

      const fetchRoles = async (id) => {
        try{
          const res = await axiosInstance.get(`/roles/${id}`)
          setFormData(res.data.data);
        } catch(error){
          console.error('Error fetching roles:', error);
        }
      }
      const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        setErrors(prev => ({ ...prev, [name]: '' }));
      };
    
      const handlePermissionChange = (index, field, value) => {
        const updatedPermissions = [...formData.permissions];
        if (field === 'actions') {
          const selectedOptions = Array.from(value.options).filter(o => o.selected).map(o => o.value);
          updatedPermissions[index][field] = selectedOptions;
        } else {
          updatedPermissions[index][field] = value;
        }
        setFormData(prev => ({ ...prev, permissions: updatedPermissions }));
      };
    
      const addPermission = () => {
        setFormData(prev => ({
          ...prev,
          permissions: [...prev.permissions, { resource: '', actions: [] }]
        }));
      };
    
      const removePermission = (index) => {
        const updatedPermissions = [...formData.permissions];
        updatedPermissions.splice(index, 1);
        setFormData(prev => ({ ...prev, permissions: updatedPermissions }));
      };
    
      const handleSubmit = async (e) => {
        e.preventDefault();
        const { name, description, permissions } = formData;
        let formErrors = {};
        if (!name) formErrors.name = 'Role name is required';
        if (!description) formErrors.description = 'Description is required';
        if (!permissions.length || !permissions.every(p => p.resource && p.actions.length)) {
          formErrors.permissions = 'Each permission must include resource and actions';
        }
    
        if (Object.keys(formErrors).length > 0) {
          setErrors(formErrors);
          return;
        }
    
        try {
          if(id){
            await axiosInstance.put(`/roles/${id}`, formData);
            await showFormSubmitToast('Role updated successfully!', () => navigate('/roles/all-role'));
          }else{
            await axiosInstance.post('/roles', formData);
          await showFormSubmitToast('Role created successfully!', () => navigate('/roles/all-role'));
          }
        } catch (error) {
          console.error('Role creation error:', error);
          showFormSubmitError(error);
        }
      };

  const handleCancel = () => {
    navigate('/roles/all-role');
  };
  return (
    <div>
       <h4>{id ? 'Edit' : 'Add'} Role</h4>
    <div className="form-container">
      <div className="page-header">
        <form  onSubmit={handleSubmit}>
          <div className="form-note">
            <span className="required">*</span> Field is mandatory
          </div>
          <div className="user-details">
          <div className="input-box">
          <div className="details-container">
          <span className="details">Role Name</span>
          <span className="required">*</span>
          </div>        
          <CInputGroup>
                <CInputGroupText className="input-icon">
                  <CIcon icon={cilUser} />
                </CInputGroupText>
                <CFormInput
                  type="text"
                  name="name"
                  onChange={handleChange}
                  value={formData.name}
                />
        </CInputGroup>
          {errors.name && <p className="error">{errors.name}</p>}
        </div>
          <div className="input-box">
          <div className="details-container">
           <span className="details">Description</span>
           <span className="required">*</span>
           </div>  
            <CInputGroup>
                <CInputGroupText className="input-icon">
                  <CIcon icon={cilListRich} />
                </CInputGroupText>
                <CFormInput
                  type="text"
                  name="description"
                  onChange={handleChange}
                  value={formData.description}
                />
            </CInputGroup>
          {errors.description && <p className="error">{errors.description}</p>}
        </div>

        <div className="input-box">
          <span className='details'>Set as default?</span>
          <CFormSwitch
           className="custom-switch"
            name="is_default"
            label={formData.is_default ? 'true' : 'false'}
            checked={formData.is_default}
            onChange={(e) =>
              setFormData(prev => ({ ...prev, is_default: e.target.checked }))
            }
          />
        </div>
        </div>
        <br></br>
         <div className="permissions-container">
          <h6>Permissions</h6>
          {formData.permissions.map((perm, index) => (
        <div className="permission-row" key={index}>
       {formData.permissions.length > 1 && (
          <span className="remove-icon" onClick={() => removePermission(index)} title="Remove Permission">
           🗑️
          </span>
       )}
      <div className="input-box-role">
        <span className="details">Module</span>
        {/* <CFormInput
          value={perm.resource}
          onChange={(e) => handlePermissionChange(index, 'resource', e.target.value)}
        /> */}
        <CFormSelect
              value={perm.resource}
              onChange={(e) => handlePermissionChange(index, 'resource', e.target.value)}
          >
            <option value="" disabled>Select Module</option>
            <option value="users">Users</option>
            <option value="role">Role</option>
            <option value="location">Location</option>
            <option value="model">Model</option>
            <option value="accessory">Accessory</option>
            <option value="headers">Headers</option>
            <option value="documents">Documents</option>
            <option value="terms_and_conditions">Terms & conditions</option>
            <option value="offers">Offers</option>
            <option value="customers">Customers</option>
            <option value="quotation">Quotation</option>
        </CFormSelect>

      </div>
      <div className="input-box-role">
        <span className="details">Actions</span>
        <div className="checkbox-group">
          {['create', 'read', 'update', 'delete','manage'].map((action) => (
            <label key={action} className="checkbox-label">
              <input
                type="checkbox"
                value={action}
                checked={perm.actions.includes(action)}
                onChange={(e) => {
                  const updatedActions = e.target.checked
                    ? [...perm.actions, action]
                    : perm.actions.filter(a => a !== action);
                  handlePermissionChange(index, 'actions', {
                    options: updatedActions.map(val => ({
                      selected: true,
                      value: val
                    }))
                  });
                }}
              />
              {action.charAt(0).toUpperCase() + action.slice(1)}
            </label>
          ))}
        </div>
      </div>
    </div>
))}

          <button type="button" onClick={addPermission}>+ Add Permission</button>
          {errors.permissions && <p className="error">{errors.permissions}</p>}
        </div>
         <FormButtons onCancel={handleCancel}/>
        </form>
      </div>
    </div>
    </div>
  );
}
export default CreateRole;
