
import React, { useState, useEffect, useMemo } from 'react';
import { useAppSelector } from '../../hooks/reduxHooks';
import Timer from '../timer/Timer';
import { searchICDCodes } from '../../services/icdService';
import FormElementRenderer from './elements/FormElementRenderer';
import { useSearchParams } from 'react-router-dom';

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
  const { user } = useAppSelector(state => state.auth)

  const [searchParams] = useSearchParams();
  const isArchiveMode = searchParams.get('mode') === 'archive';

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

    if (currentForm.templateFields[index].type == 'icd-text') {
      setInputingIndex(index);
      searchICDCodes(value, setLoading, setSearchResults);
      setShowResults(true);
    }

    const newFormData = [...formData];
    newFormData[index] = value;
    setFormData(newFormData);
  };

  // const handleIcdSearch = (index: number, value: string) => {
  //   setInputingIndex(index);
  //   handleFieldChange(index, value);
  //   searchICDCodes(value, setLoading, setSearchResults);
  //   setShowResults(true);
  // };

  const handleSelectIcdCode = (index: number, code: string, description: string) => {
    const selectedValue = `${description}`;
    handleFieldChange(index, selectedValue);
    setSearchResults([]);
    setShowResults(false);
  };

  const SubmitForm = () => {
    onSave(formData);
  }
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  };

  return (
    <div className="max-w-6xl mx-auto my-8 bg-white p-6 rounded-lg shadow-md">
      <div className="mb-2">
        <h1 className="text-3xl font-bold text-center mb-6">{currentForm.name}</h1>

        {user?.role == 'staff' && <Timer formId={formId} />}
        {user?.role == 'admin' && !isArchiveMode && <Timer formId={formId} />}
      </div>

      <form onSubmit={handleSubmit}>
        <div className='w-full h-[64vh] overflow-y-scroll'>
          {currentForm.templateFields.map((field, index) => {
            if (field.condition && field.type != 'scored-radio' && [...sumupArray].reduce((a, b) => { return a + b }, 0) < thresHold)
              return <></>
            else if (field.type == 'icd-text')
              return (<div className="relative p-4 -md mb-4 bg-white">
                <p className='pb-4'>{field.label}</p>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  value={formData[index] as string}
                  placeholder="Input ICD"
                  onChange={(e) => { handleFieldChange(index, e.target.value) }}
                />
                {inputingIndex === index && loading && (
                  <div className="absolute right-3 top-3 text-sm text-gray-500">Loading...</div>
                )}

                {inputingIndex === index && showResults && searchResults.length > 0 && handleSelectIcdCode && (
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
              </div>)
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
        </div>
      </form>
      <div className="mt-8 flex justify-end">
        <button
          className="mr-4 px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          onClick={SubmitForm}
        >
          Save Form
        </button>
      </div>
    </div>
  );
};

export default CareForm;
