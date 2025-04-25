
import React from 'react';
import { FormElementProps } from '../../../types/form';

const ScoreSum: React.FC<FormElementProps> = ({ element, index, value, sumupArray }) => {
  return (
    <div className="relative p-4 -md mb-4 bg-white">
      <p className='pb-4'>{element.label}</p>
      <div className="flex gap-4">
        <input
          type="text"
          value={[...sumupArray].reduce((a, b) => { return a + b }, 0).toString()}
          className="flex-1 px-3 py-2 border border-gray-300 rounded-md bg-gray-100"
          readOnly
        />
        {/* {element.threshold !== undefined && (
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500">Threshold:</span>
            <input
              type="text"
              value={element.threshold}
              className="w-20 px-3 py-2 border border-gray-300 rounded-md bg-gray-100"
              readOnly
            />
          </div>
        )} */}
      </div>
    </div>
  );
};

export default ScoreSum;
