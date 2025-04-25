
import React from 'react';
import { FormElementProps } from '../../../types/form';

const RichText: React.FC<FormElementProps> = ({ element, index, value, onChange }) => {
  return (
    <div className="relative p-4 mb-4 bg-white">
      <p className='pb-4'>{element.label}</p>
      <textarea
        value={typeof value === 'string' ? value : ''}
        onChange={(e) => onChange(index, e.target.value)}
        className="w-full px-3 py-2 border border-gray-300 rounded-md"
        placeholder="Enter Text"
        rows={5}
      />
    </div>
  );
};

export default RichText;
