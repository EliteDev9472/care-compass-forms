
import axios from 'axios';
import { debounce } from 'lodash';

export interface ICDCode {
  code: string;
  description: string;
}

export const searchICDCodes = debounce(async (
  searchValue: string,
  setLoading: (value: boolean) => void,
  setSearchResults: (results: ICDCode[]) => void
) => {
  if (!searchValue.trim()) {
    setSearchResults([]);
    return;
  }

  setLoading(true);
  try {
    const response = await axios.get('/ICD.json');
    const allCodes: ICDCode[] = response.data;

    const filteredResults = allCodes
      .filter(code => {
        if (!code.code || !code.description) return false;
        if (code.code.startsWith(searchValue)) return true;
        return code.description.includes(searchValue);
      })
      .slice(0, 10);
    setSearchResults(filteredResults);
  } catch (error) {
    console.error('Error fetching ICD codes:', error);
    setSearchResults([]);
  } finally {
    setLoading(false);
  }
}, 300);
