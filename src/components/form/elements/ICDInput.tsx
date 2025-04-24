
import React from 'react';
import { FormElementProps } from '../../../types/form';
import { ICDSearchResult } from '../../../types/form';

interface ICDInputProps extends FormElementProps, Partial<ICDSearchResult> {}

const ICDInput: React.FC<ICDInputProps> = ({ 
  element, 
  index, 
  value, 
  onChange,
  loading,
  searchResults = [],
  showResults,
  onSelect,
  inputingIndex
}) => {
  return (
    <div className="relative p-4 -md mb-4 bg-white">
      <p className='pb-4'>{element.label}</p>
      <input
        type="text"
        className="w-full px-3 py-2 border border-gray-300 rounded-md"
        value={value as string}
        placeholder="Input ICD"
        onChange={(e) => onChange(index, e.target.value)}
      />
      {inputingIndex === index && loading && (
        <div className="absolute right-3 top-3 text-sm text-gray-500">Loading...</div>
      )}

      {inputingIndex === index && showResults && searchResults.length > 0 && onSelect && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto">
          {searchResults.map((result) => (
            <div
              key={result.code}
              className="px-4 py-2 cursor-pointer hover:bg-gray-100"
              onClick={() => onSelect(index, result.code, result.description)}
            >
              <div className="font-semibold">{result.code}</div>
              <div className="text-sm text-gray-600">{result.description}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ICDInput;
