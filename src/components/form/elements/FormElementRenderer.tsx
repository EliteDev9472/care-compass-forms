
import React from 'react';
import { FormField } from '../../../services/templateService';
import RedTextInput from './RedTextInput';
import ScoredRadio from './ScoredRadio';
import ScoreSum from './ScoreSum';
import GridInput from './GridInput';
import TextInput from './TextInput';
import ICDInput from './ICDInput';
import { ICDSearchResult } from '../../../types/form';
import RichText from './RichText';
import DropDown from './DropDown';
import Checkbox from './Checkbox';
import Radio from './Radio';
import TextLabel from './TextLabel';

interface FormElementRendererProps {
  element: FormField;
  index: number;
  value: string | boolean | string[];
  onChange: (index: number, value: string | boolean | string[]) => void;
  icdSearchProps?: ICDSearchResult;
  allValues: (string | boolean | string[])[]; // Add this prop to access all form values,
  sumupArray: number[];
}

const FormElementRenderer: React.FC<FormElementRendererProps> = ({
  element,
  index,
  value,
  onChange,
  icdSearchProps,
  allValues,
  sumupArray
}) => {
  // Check if this element should be hidden based on score sum threshold
  const shouldShow = React.useMemo(() => {
    if (element.controlledByScoreSum === undefined) return true;

    const controllingScoreSum = allValues[element.controlledByScoreSum];
    const threshold = element.threshold ?? 0;

    return Number(controllingScoreSum) >= threshold;
  }, [element.controlledByScoreSum, element.threshold, allValues]);

  if (!shouldShow) return null;

  const commonProps = { element, index, value, onChange, sumupArray };

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
      return <TextLabel {...commonProps} />
    case 'text-field':
      return <TextInput {...commonProps} />;
    case 'dropdown':
      return <DropDown {...commonProps} />;
    case 'checkbox':
      return <Checkbox {...commonProps} />;
    case 'radio':
      return <Radio {...commonProps} />;
    case 'rich-text':
      return <RichText {...commonProps} />;
    case 'heading':
      return (
        <div className="relative p-4 rounded-md mb-4 font-bold text-xl" key={index}>
          {element.label}
        </div>
      );
    default:
      return null;
  }
};

export default FormElementRenderer;
