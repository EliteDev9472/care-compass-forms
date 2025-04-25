
import { ICDCode } from '../services/icdService';
import { FormField } from '../services/templateService';

export interface FormElementProps {
  element: FormField;
  index: number;
  value: string | boolean | string[];
  onChange: (index: number, value: string | boolean | string[]) => void;
  sumupArray?: number[];
}

export interface ICDSearchResult {
  loading: boolean;
  searchResults: ICDCode[];
  showResults: boolean;
  onSelect: (index: number, code: string, description: string) => void;
  inputingIndex: number;
}
