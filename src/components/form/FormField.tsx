
import React, { useState, useEffect, useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '../../hooks/reduxHooks';
import { setSearchTerm, clearSearch, loadICDCodes } from '../../store/icdCodesSlice';
import { debounce } from 'lodash';

interface FormFieldProps {
  label: string;
  type: 'text' | 'dropdown' | 'heading' | 'icd' | 'timer' | 'textbox';
  options?: string[];
  value: string;
  onChange: (value: string) => void;
  roleVisibleTo?: string[];
}

const FormField: React.FC<FormFieldProps> = ({ 
  label, 
  type, 
  options = [], 
  value, 
  onChange,
  roleVisibleTo = []
}) => {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector(state => state.auth);
  const { searchResults, loading } = useAppSelector(state => state.icdCodes);
  const [showResults, setShowResults] = useState(false);
  const [localSearchValue, setLocalSearchValue] = useState(value);
  
  // Debounced search to prevent excessive Redux updates
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedSearch = useCallback(
    debounce((searchValue: string) => {
      dispatch(setSearchTerm(searchValue));
    }, 300),
    [dispatch]
  );
  
  // Check if current user role is allowed to see this field
  const isVisibleToCurrentUser = roleVisibleTo.length === 0 || 
    (user && roleVisibleTo.includes(user.role));
  
  useEffect(() => {
    // Load ICD codes when component mounts
    dispatch(loadICDCodes());
  }, [dispatch]);

  // When value changes from parent, update local state
  useEffect(() => {
    setLocalSearchValue(value);
  }, [value]);
  
  if (!isVisibleToCurrentUser) {
    return null;
  }
  
  if (type === 'heading') {
    return <h2 className="mt-6 mb-4 text-xl font-bold text-gray-800">{label}</h2>;
  }
  
  const handleIcdSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const searchValue = e.target.value;
    setLocalSearchValue(searchValue);
    onChange(searchValue);
    debouncedSearch(searchValue);
    setShowResults(true);
  };
  
  const handleSelectIcdCode = (code: string, description: string) => {
    const selectedValue = `${code} - ${description}`;
    setLocalSearchValue(selectedValue);
    onChange(selectedValue);
    dispatch(clearSearch());
    setShowResults(false);
  };
  
  const handleBlur = () => {
    // Delay hiding results slightly to allow for clicks
    setTimeout(() => {
      setShowResults(false);
    }, 200);
  };
  
  // For backward compatibility, treat textbox as text
  const effectiveType = type === 'textbox' ? 'text' : type;
  
  return (
    <div className="mb-4">
      <label className="block mb-2 text-sm font-medium text-gray-700">{label}</label>
      
      {effectiveType === 'text' && (
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
        />
      )}
      
      {effectiveType === 'dropdown' && (
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="">Please Select</option>
          {options.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      )}
      
      {effectiveType === 'icd' && (
        <div className="relative">
          <input
            type="text"
            value={localSearchValue}
            onChange={handleIcdSearch}
            onFocus={() => setShowResults(true)}
            onBlur={handleBlur}
            placeholder="Type to search ICD codes"
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
          
          {loading && (
            <div className="absolute right-3 top-3 text-sm text-gray-500">Loading...</div>
          )}
          
          {showResults && searchResults.length > 0 && (
            <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto">
              {searchResults.map((result) => (
                <div
                  key={result.code}
                  className="px-4 py-2 cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSelectIcdCode(result.code, result.description)}
                >
                  <div className="font-semibold">{result.code}</div>
                  <div className="text-sm text-gray-600">{result.description}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
      
      {effectiveType === 'timer' && (
        <div className="text-sm text-gray-600">
          Timer field - controlled by the timer component
        </div>
      )}
    </div>
  );
};

export default FormField;
