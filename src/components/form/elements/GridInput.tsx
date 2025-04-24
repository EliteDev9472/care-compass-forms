
import React from 'react';
import { FormElementProps } from '../../../types/form';

const GridInput: React.FC<FormElementProps> = ({ element, index, value, onChange }) => {
  return (
    <div className="relative p-4 -md mb-4 bg-white">
      <p className='pb-4'>{element.label}</p>
      <div className={`grid grid-cols-${element.gridColumns || 2} gap-4`}>
        {element.options?.map((fieldLabel, idx) => (
          <div key={idx} className="space-y-2">
            <label className="text-sm text-gray-600">{fieldLabel}</label>
            <input
              type="text"
              value={Array.isArray(value) ? value[idx] : ''}
              onChange={(e) => {
                const newValues = Array.isArray(value) ? [...value] : new Array(element.options?.length || 0).fill('');
                newValues[idx] = e.target.value;
                onChange(index, newValues);
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default GridInput;
