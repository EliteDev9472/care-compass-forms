
import React from 'react';
import { FormField } from '../../../services/templateService';
import RedTextInput from './RedTextInput';
import ScoredRadio from './ScoredRadio';
import ScoreSum from './ScoreSum';
import GridInput from './GridInput';
import TextInput from './TextInput';
import ICDInput from './ICDInput';
import { ICDSearchResult } from '../../../types/form';

interface FormElementRendererProps {
  element: FormField;
  index: number;
  value: string | boolean | string[];
  onChange: (index: number, value: string | boolean | string[]) => void;
  icdSearchProps?: ICDSearchResult;
}

const FormElementRenderer: React.FC<FormElementRendererProps> = ({
  element,
  index,
  value,
  onChange,
  icdSearchProps
}) => {
  const commonProps = { element, index, value, onChange };

  switch (element.type) {
    case 'red-text':
      return <RedTextInput {...commonProps} />;
    case 'scored-radio':
      return <ScoredRadio {...commonProps} />;
    case 'score-sum':
      return <ScoreSum {...commonProps} />;
    case 'grid-input':
      return <GridInput {...commonProps} />;
    case 'icd-text':
      return <ICDInput {...commonProps} {...icdSearchProps} />;
    case 'text-input':
    case 'text-field':
      return <TextInput {...commonProps} />;
    case 'heading':
      return (
        <div className="relative p-4 rounded-md mb-4" key={index}>
          {element.label}
        </div>
      );
    default:
      return null;
  }
};

export default FormElementRenderer;
