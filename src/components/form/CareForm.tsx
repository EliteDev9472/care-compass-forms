
import React, { useState, useEffect } from 'react';
import { useAppSelector } from '../../hooks/reduxHooks';
import Timer from '../timer/Timer';
import { searchICDCodes } from '../../services/icdService';
import FormElementRenderer from './elements/FormElementRenderer';

interface CareFormProps {
  formId: string;
  initialData?: (string | boolean | string[])[];
  onSave: (data: (string | boolean | string[])[]) => void;
}

const CareForm: React.FC<CareFormProps> = ({ formId, initialData = [], onSave }) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<(string | boolean | string[])[]>(initialData);
  const { currentForm } = useAppSelector(state => state.patients);
  const [searchResults, setSearchResults] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [inputingIndex, setInputingIndex] = useState<number>(-1);

  useEffect(() => {
    if (Object.keys(initialData).length === 0) {
      const defaultData: (string | boolean | string[])[] = currentForm.templateFields.map(field => 
        field.type === 'checkbox' ? false : 
        field.type === 'grid-input' ? [] : 
        ''
      );
      setFormData(defaultData);
    } else {
      setFormData(initialData);
    }
  }, [initialData, currentForm.templateFields]);

  const handleFieldChange = (index: number, value: string | boolean | string[]) => {
    const newFormData = [...formData];
    newFormData[index] = value;
    setFormData(newFormData);
  };

  const handleIcdSearch = (index: number, value: string) => {
    setInputingIndex(index);
    handleFieldChange(index, value);
    searchICDCodes(value, setLoading, setSearchResults);
    setShowResults(true);
  };

  const handleSelectIcdCode = (index: number, code: string, description: string) => {
    const selectedValue = `${description}`;
    handleFieldChange(index, selectedValue);
    setSearchResults([]);
    setShowResults(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="max-w-4xl mx-auto my-8 bg-white p-6 rounded-lg shadow-md">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-center mb-6">{currentForm.name}</h1>
        <Timer formId={formId} />
      </div>

      <form onSubmit={handleSubmit}>
        {currentForm.templateFields.map((field, index) => (
          <FormElementRenderer
            key={index}
            element={field}
            index={index}
            value={formData[index]}
            onChange={handleFieldChange}
            icdSearchProps={field.type === 'icd-text' ? {
              loading,
              searchResults,
              showResults,
              onSelect: handleSelectIcdCode,
              inputingIndex
            } : undefined}
          />
        ))}
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
