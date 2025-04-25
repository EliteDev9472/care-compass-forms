
import React from 'react';
import { FormElementProps } from '../../../types/form';

const DropDown: React.FC<FormElementProps> = ({ element, index, value, onChange }) => {
  return (
    <div className="relative p-4 -md mb-4 bg-white" key={index}>
      <p className='pb-4'>{element.label}</p>
      <select className="w-full px-3 py-2 border border-gray-300 rounded-md"
        value={value as string}
        onChange={(e) => onChange(index, e.target.value)}>
        <option value="">Please Select</option>
        {element.options?.map((option, idx) => (
          <option key={idx} value={option}>{option}</option>
        ))}
      </select>
    </div>


  );
};

export default DropDown;
