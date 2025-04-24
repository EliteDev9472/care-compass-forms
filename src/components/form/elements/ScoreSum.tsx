
import React from 'react';
import { FormElementProps } from '../../../types/form';

const ScoreSum: React.FC<FormElementProps> = ({ element, index, value }) => {
  return (
    <div className="relative p-4 -md mb-4 bg-white">
      <p className='pb-4'>{element.label}</p>
      <input
        type="text"
        value={typeof value === 'string' ? value : ''}
        className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100"
        readOnly
      />
    </div>
  );
};

export default ScoreSum;
