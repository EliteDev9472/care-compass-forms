
import React, { useState, useEffect, useCallback } from 'react';
import { useAppSelector } from '../../hooks/reduxHooks';
import Timer from '../timer/Timer';
import { AlignLeft, Type } from 'lucide-react';
import { FormField } from '@/services/templateService';


interface ReviewFormProps {
  formId: string;
  initialData?: (string | boolean)[];
}

const ReviewForm: React.FC<ReviewFormProps> = ({ formId, initialData = [] }) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<(string | boolean)[]>(initialData);
  const { currentForm } = useAppSelector(state =>
    state.patients
  );


  // Initialize form data from template if no initial data
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



  const renderFormElement = (element: FormField, index: number) => {
    const { type, label, required, options } = element;

    switch (type) {
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
            <input
              type="text"
              value={currentForm.data[index] as string}
              className="w-full px-3 py-2 border border-gray-300 rounded-md "
              placeholder="Enter Text"
              disabled={true}
            />
          </div>
        );

      case 'text-field':
        return (
          <div className="relative p-4 -md mb-4 bg-white" key={index}>
            <p className='pb-4'>{label}</p>
          </div>
        );

      case 'icd-text':
        return (
          <div className="relative p-4 -md mb-4 bg-white" key={index}>
            <p className='pb-4'>{label}</p>
            <input
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              value={currentForm.data[index] as string}
              placeholder="Input ICD"
              disabled={true}
            />
          </div>
        );

      case 'dropdown':
        return (
          <div className="relative p-4 -md mb-4 bg-white" key={index}>
            <p className='pb-4'>{label}</p>
            <select className="w-full px-3 py-2 border border-gray-300 rounded-md"
              value={currentForm.data[index] as string} disabled={true}>
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
              <input type="checkbox" className="h-4 w-4" checked={currentForm.data[index] as boolean} disabled={true} />
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
                  <input type="radio" name={`radio_${index}`} className="h-4 w-4" checked={currentForm.data[index] == option} disabled={true} />
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
              <div className="flex space-x-1 border-b p-1">
                <button disabled className="p-1 text-gray-400"><Type size={16} /></button>
                <button disabled className="p-1 text-gray-400"><AlignLeft size={16} /></button>
              </div>
              <textarea className="w-full p-2 h-36 bg-white" placeholder='Rich text editor preview' value={currentForm.data[index] as string} disabled={true} />
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
      <form>
        {
          currentForm.templateFields.map((field, index) => {
            return renderFormElement(field, index)
          })
        }
      </form>
    </div>
  );
};

export default ReviewForm;
