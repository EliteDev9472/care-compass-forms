
import { ICDCode } from '../services/icdService';
import { FormField } from '../services/templateService';

export interface FormElementProps {
  element: FormField;
  index: number;
  value: string | boolean;
  onChange: (index: number, value: string | boolean) => void;
}

export interface ICDSearchResult {
  loading: boolean;
  searchResults: ICDCode[];
  showResults: boolean;
  onSelect: (index: number, code: string, description: string) => void;
  inputingIndex: number;
}
