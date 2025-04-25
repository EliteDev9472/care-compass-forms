
import React from 'react';
import { FormElementProps } from '../../../types/form';

const Checkbox: React.FC<FormElementProps> = ({ element, index, value, onChange }) => {
  return (
    <div className="relative p-4 -md mb-4 bg-white">
      <p className='pb-4'>{element.label}</p>
      <div className="flex items-center space-x-2">
        <input type="checkbox" className="h-4 w-4" checked={value as boolean} onChange={(e) => onChange(index, e.target.checked)} />
      </div>
    </div>
  );
};

export default Checkbox;
