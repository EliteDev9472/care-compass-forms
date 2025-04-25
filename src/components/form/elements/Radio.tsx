
import React from 'react';
import { FormElementProps } from '../../../types/form';

const Radio: React.FC<FormElementProps> = ({ element, index, value, onChange }) => {
  return (
    <div className="relative p-4 -md mb-4 bg-white">
      <p className='pb-4'>{element.label}</p>
      <div className="space-y-1">
        {element.options?.map((option, idx) => (
          <div key={idx} className="flex items-center space-x-2">
            <input type="radio" name={`radio_${index}`} className="h-4 w-4" onChange={(e) => onChange(index, option)} checked={value == option} />
            <span className="text-gray-500">{option}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Radio;
