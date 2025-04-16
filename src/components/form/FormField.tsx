
import React, { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../hooks/reduxHooks';
import { setSearchTerm, clearSearch } from '../../store/icdCodesSlice';

interface FormFieldProps {
  label: string;
  type: 'text' | 'dropdown' | 'heading' | 'icd';
  options?: string[];
  value: string;
  onChange: (value: string) => void;
}

const FormField: React.FC<FormFieldProps> = ({ 
  label, 
  type, 
  options = [], 
  value, 
  onChange 
}) => {
  const dispatch = useAppDispatch();
  const { searchResults } = useAppSelector(state => state.icdCodes);
  const [showResults, setShowResults] = useState(false);
  
  if (type === 'heading') {
    return <h2 className="mt-6 mb-4 text-xl font-bold text-gray-800">{label}</h2>;
  }
  
  const handleIcdSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const searchValue = e.target.value;
    onChange(searchValue);
    dispatch(setSearchTerm(searchValue));
    setShowResults(true);
  };
  
  const handleSelectIcdCode = (code: string, description: string) => {
    onChange(`${code} - ${description}`);
    dispatch(clearSearch());
    setShowResults(false);
  };
  
  return (
    <div className="mb-4">
      <label className="block mb-2 text-sm font-medium text-gray-700">{label}</label>
      
      {type === 'text' && (
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
        />
      )}
      
      {type === 'dropdown' && (
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
      
      {type === 'icd' && (
        <div className="relative">
          <input
            type="text"
            value={value}
            onChange={handleIcdSearch}
            onFocus={() => setShowResults(true)}
            placeholder="Type to search ICD codes"
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
          
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
    </div>
  );
};

export default FormField;
