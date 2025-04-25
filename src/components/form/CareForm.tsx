
import React, { useState, useEffect, useMemo } from 'react';
import { useAppSelector } from '../../hooks/reduxHooks';
import Timer from '../timer/Timer';
import { searchICDCodes } from '../../services/icdService';
import FormElementRenderer from './elements/FormElementRenderer';

interface CareFormProps {
  formId: string;
  initialData?: (string | boolean | string[])[];
  onSave: (data: (string | boolean | string[])[]) => void;
  sumupArray: number[];
  setSumupArray: (data: number[]) => void;
  thresHold: number;
}

const CareForm: React.FC<CareFormProps> = ({ formId, initialData = [], onSave, sumupArray, setSumupArray, thresHold, }) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<(string | boolean | string[])[]>(initialData);
  const { currentForm } = useAppSelector(state => state.patients);
  const [searchResults, setSearchResults] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [inputingIndex, setInputingIndex] = useState<number>(-1);

  useEffect(() => {
    const fetchData = async () => {
      if (Object.keys(initialData).length === 0) {
        const defaultData: (string | boolean | string[])[] = await currentForm.templateFields.map(field => {
          return field.type === 'checkbox' ? false :
            field.type === 'grid-input' ? [] :
              ''
        });
        setFormData(defaultData);
      } else {
        setFormData(initialData);
      }
    }
    fetchData();
  }, [initialData, currentForm.templateFields]);

  const handleFieldChange = (index: number, value: string | boolean | string[]) => {
    if (currentForm.templateFields[index].type == 'scored-radio' && typeof (value) == 'string' && !Number.isNaN(parseInt(value))) {
      const temp = [...sumupArray]
      temp[index] = parseInt(value);
      setSumupArray(temp);
    }
    const newFormData = [...formData];
    newFormData[index] = value;
    console.log(newFormData)
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
        <h1 className="text-3xl font-bold text-center mb-6">{currentForm.name}</h1>
        <Timer formId={formId} />
      </div>

      <form onSubmit={handleSubmit} className='h-[70vh] overflow-y-scroll'>
        {currentForm.templateFields.map((field, index) => {
          if (field.condition && field.type != 'scored-radio' && [...sumupArray].reduce((a, b) => { return a + b }, 0) < thresHold)
            return <></>
          else
            return (
              <FormElementRenderer
                key={index}
                element={field}
                index={index}
                value={formData[index]}
                onChange={handleFieldChange}
                allValues={formData}
                sumupArray={sumupArray}
                icdSearchProps={field.type === 'icd-text' ? {
                  loading,
                  searchResults,
                  showResults,
                  onSelect: handleSelectIcdCode,
                  inputingIndex
                } : undefined}
              />
            )

        })}
        <div className="mt-8 flex justify-end">
          <button
            type="submit"
            className="mr-4 px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Save Form
          </button>
        </div>
      </form>
    </div>
  );
};

export default CareForm;
