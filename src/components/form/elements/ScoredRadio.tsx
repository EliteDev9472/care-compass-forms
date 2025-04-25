
import React from 'react';
import { FormElementProps } from '../../../types/form';

const ScoredRadio: React.FC<FormElementProps> = ({ element, index, value, onChange }) => {
  return (
    <div className="relative p-4 -md mb-4 bg-white">
      <p className='pb-4'>{element.label}</p>
      <div className="space-y-1">
        {element.options?.map((option, idx) => (
          <div key={idx} className="flex items-center space-x-2">
            <input
              type="radio"
              name={`radio_${index}`}
              className="h-4 w-4"
              onChange={() => {

                if (element.type == 'scored-radio') {
                  onChange(index, element.scores[idx].toString());
                  onChange(index, option);
                }
                else
                  onChange(index, option);
                // const score = element.scores[idx];
                // // Update all related score sums with this radio's score
                // if (element.scores?.[idx] !== undefined) {
                //   if (element.relatedScoreFieldIndex !== undefined) {
                //     console.log(element.scores, idx)

                //     onChange(element.relatedScoreFieldIndex, element.scores[idx].toString());
                //   }
                // }
              }}
              checked={value === option}
            />
            <span className="text-gray-500">{option} (Score: {element.scores?.[idx] || 0})</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ScoredRadio;
