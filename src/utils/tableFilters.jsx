import React, { useState } from "react";

export const useTableFilter = (initialData) => {
    const [data, setData] = useState(initialData);
    const [filteredData, setFilteredData] = useState(initialData);
  
    const handleFilter = (searchValue, searchFields) => {
      if (!searchValue) {
        setFilteredData(data);
        return;
      }
  
      const searchTerm = searchValue.toLowerCase();
      const filtered = data.filter(row => 
        searchFields.some(field => 
          String(row[field] || '').toLowerCase().includes(searchTerm)
        )
      );
  
      setFilteredData(filtered);
    };
  
    return {
      data,
      setData,
      filteredData,
      setFilteredData,
      handleFilter,
    };
  };
  
  export const getDefaultSearchFields = (tableType) => {
    const fieldMap = {
      branch: ['name', 'address', 'city', 'state','pincode','email','phone','gst_number'],
      users: ['username','email','full_name', 'mobile_number','branch_id','role'],
      roles: ['name', 'description', 'permissions.resource', 'permissions.actions'],
      models:['model_name'],
      headers:['header_key','category_key','key','type','priority','page_no','hsn_code','gst_rate'],
      documents:['name','description'],
      conditions:['title','content','order'],
      offers:['title','description','applyToAllModels','applicableModels'],
      customers:['name','address','taluka','district','mobile1','mobile2'],
      attachments:['title','description'],
    };
  
    return fieldMap[tableType] || Object.keys(fieldMap.branch);
  };