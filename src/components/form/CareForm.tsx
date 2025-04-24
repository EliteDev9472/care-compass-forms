import React, { useState, useEffect, useCallback } from 'react';
import { useAppSelector } from '../../hooks/reduxHooks';
import Timer from '../timer/Timer';
import { AlignLeft, Type } from 'lucide-react';
import { FormField } from '@/services/templateService';
import { debounce } from 'lodash';
import axios from 'axios';

interface ICDCode {
  code: string;
  description: string;
}

interface CareFormProps {
  formId: string;
  initialData?: (string | boolean)[];
  onSave: (data: Record<string, any>) => void;
}

const CareForm: React.FC<CareFormProps> = ({ formId, initialData = [], onSave }) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<(string | boolean)[]>(initialData);
  const { currentForm } = useAppSelector(state =>
    state.patients
  );

  const [searchResults, setSearchResults] = useState<ICDCode[]>([]);
  const [localSearchValue, setLocalSearchValue] = useState('');
  const [showResults, setShowResults] = useState(false);
  const [inputingIndex, setInputingIndex] = useState<number>(-1);

  useEffect(() => {
    if (Object.keys(initialData).length === 0) {
      const defaultData: (string | boolean)[] = [];

      currentForm.templateFields.forEach(field => {
        if (field.type == 'checkbox')
          defaultData.push(false);
        else
          defaultData.push('');
      });

      setFormData(defaultData);
    } else {
      setFormData(initialData);
    }
  }, [initialData]);

  const handleFieldChange = (index: number, value: string | boolean) => {
    const temp = [...formData];
    temp[index] = value;
    setFormData(temp);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  const debouncedSearch = useCallback(
    debounce(async (searchValue: string) => {
      if (!searchValue.trim()) {
        setSearchResults([]);
        return;
      }

      setLoading(true);
      try {
        const response = await axios.get('/ICD.json');
        const allCodes: ICDCode[] = response.data;

        const filteredResults = allCodes
          .filter(code => {
            if (!code.code || !code.description) return false
            if (code.code.startsWith(searchValue)) return true;

            return code.description.includes(searchValue);
          })
          .slice(0, 10);
        setSearchResults(filteredResults);
      } catch (error) {
        console.error('Error fetching ICD codes:', error);
        setSearchResults([]);
      } finally {
        setLoading(false);
      }
    }, 300),
    []
  );

  const handleIcdSearch = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    setInputingIndex(index);
    const searchValue = e.target.value;
    setLocalSearchValue(searchValue);
    handleFieldChange(index, searchValue);
    debouncedSearch(searchValue);
    setShowResults(true);
  };

  const handleSelectIcdCode = (index: number, code: string, description: string) => {
    const selectedValue = `${description}`;
    setLocalSearchValue(selectedValue);
    handleFieldChange(index, selectedValue);
    setSearchResults([]);
    setShowResults(false);
  };

  const renderFormElement = (element: FormField, index: number) => {
    const { type, label, required, options, scores, gridColumns } = element;

    switch (type) {
      case 'red-text':
        return (
          <div className="relative p-4 mb-4 bg-white" key={index}>
            <p className='pb-4'>{label}</p>
            <input
              type="text"
              value={formData[index] as string}
              onChange={(e) => handleFieldChange(index, e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-red-500"
              placeholder="Enter Text"
            />
          </div>
        );

      case 'scored-radio':
        return (
          <div className="relative p-4 -md mb-4 bg-white" key={index}>
            <p className='pb-4'>{label}</p>
            <div className="space-y-1">
              {options?.map((option, idx) => (
                <div key={idx} className="flex items-center space-x-2">
                  <input 
                    type="radio" 
                    name={`radio_${index}`} 
                    className="h-4 w-4" 
                    onChange={(e) => {
                      handleFieldChange(index, option);
                      if (element.relatedScoreFieldIndex !== undefined && scores?.[idx] !== undefined) {
                        handleFieldChange(element.relatedScoreFieldIndex, scores[idx].toString());
                      }
                    }}
                    checked={formData[index] === option}
                  />
                  <span className="text-gray-500">{option} (Score: {scores?.[idx] || 0})</span>
                </div>
              ))}
            </div>
          </div>
        );

      case 'score-sum':
        return (
          <div className="relative p-4 -md mb-4 bg-white" key={index}>
            <p className='pb-4'>{label}</p>
            <input
              type="text"
              value={formData[index] as string}
              className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100"
              readOnly
            />
          </div>
        );

      case 'grid-input':
        return (
          <div className="relative p-4 -md mb-4 bg-white" key={index}>
            <p className='pb-4'>{label}</p>
            <div className={`grid grid-cols-${gridColumns || 2} gap-4`}>
              {options?.map((fieldLabel, idx) => (
                <div key={idx} className="space-y-2">
                  <label className="text-sm text-gray-600">{fieldLabel}</label>
                  <input
                    type="text"
                    value={Array.isArray(formData[index]) ? formData[index][idx] : ''}
                    onChange={(e) => {
                      const newValues = Array.isArray(formData[index]) ? [...formData[index]] : new Array(options.length).fill('');
                      newValues[idx] = e.target.value;
                      handleFieldChange(index, newValues);
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                </div>
              ))}
            </div>
          </div>
        );

      case 'heading':
        return (
          <div className="relative p-4 rounded-md mb-4 " key={index}>
            {label}
          </div>
        );

      case 'text-input':
        return (
          <div className="relative p-4 mb-4 bg-white" key={index}>
            <p className='pb-4'>{label}</p>
          </div>
        );

      case 'text-field':
        return (
          <div className="relative p-4 -md mb-4 bg-white" key={index}>
            <p className='pb-4'>{label}</p>
            <input
              type="text"
              value={formData[index] as string}
              onChange={(e) => handleFieldChange(index, e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md "
              placeholder="Enter Text"
            />
          </div>
        );

      case 'icd-text':
        return (
          <div className="relative p-4 -md mb-4 bg-white" key={index}>
            <p className='pb-4'>{label}</p>
            <input
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              value={formData[index] as string}
              placeholder="Input ICD"
              onChange={(e) => handleIcdSearch(index, e)}
            />
            {inputingIndex == index && loading && (
              <div className="absolute right-3 top-3 text-sm text-gray-500">Loading...</div>
            )}

            {inputingIndex == index && showResults && searchResults.length > 0 && (
              <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto">
                {searchResults.map((result) => (
                  <div
                    key={result.code}
                    className="px-4 py-2 cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSelectIcdCode(index, result.code, result.description)}
                  >
                    <div className="font-semibold">{result.code}</div>
                    <div className="text-sm text-gray-600">{result.description}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        );

      case 'dropdown':
        return (
          <div className="relative p-4 -md mb-4 bg-white" key={index}>
            <p className='pb-4'>{label}</p>
            <select className="w-full px-3 py-2 border border-gray-300 rounded-md"
              value={formData[index] as string}
              onChange={(e) => handleFieldChange(index, e.target.value)}>
              <option value=""> </option>
              {options?.map((option, idx) => (
                <option key={idx} value={option}>{option}</option>
              ))}
            </select>
          </div>
        );

      case 'checkbox':
        return (
          <div className="relative p-4 -md mb-4 bg-white" key={index}>
            <p className='pb-4'>{label}</p>
            <div className="flex items-center space-x-2">
              <input type="checkbox" className="h-4 w-4" checked={formData[index] as boolean} onChange={(e) => handleFieldChange(index, e.target.checked)} />
            </div>
          </div>
        );

      case 'radio':
        return (
          <div className="relative p-4 -md mb-4 bg-white" key={index}>
            <p className='pb-4'>{label}</p>
            <div className="space-y-1">
              {options?.map((option, idx) => (
                <div key={idx} className="flex items-center space-x-2">
                  <input type="radio" name={`radio_${index}`} className="h-4 w-4" onChange={(e) => handleFieldChange(index, option)} checked={formData[index] == option} />
                  <span className="text-gray-500">{option}</span>
                </div>
              ))}
            </div>
          </div>
        );

      case 'rich-text':
        return (
          <div className="relative p-4 -md mb-4 bg-white" key={index}>
            <p className='pb-4'>{label}</p>
            <div className="border border-gray-300 rounded-md p-1 mb-1 bg-gray-100">
              <textarea className="w-full p-2 h-36 bg-white" placeholder='Rich text editor preview' value={formData[index] as string} onChange={(e) => handleFieldChange(index, e.target.value)} />
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="max-w-4xl mx-auto my-8 bg-white p-6 rounded-lg shadow-md">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-center mb-6">{currentForm.name}</h1>
        <Timer formId={formId} />
      </div>

      <form onSubmit={handleSubmit}>
        {
          currentForm.templateFields.map((field, index) => {
            return renderFormElement(field, index)
          })
        }
        <div className="mt-8 flex justify-end">
          <button
            type="submit"
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Save Form
          </button>
        </div>
      </form>
    </div>
  );
};

export default CareForm;
