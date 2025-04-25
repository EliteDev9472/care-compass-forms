
import React from 'react';
import { FormElementProps } from '../../../types/form';

const RedTextInput: React.FC<FormElementProps> = ({ element, index, value, onChange }) => {
  return (
    <div className="relative p-4 mb-4 bg-white">
      <p className='pb-4 text-red-600'>{element.label}</p>
    </div>
  );
};

export default RedTextInput;
