
import type { SavedList } from '../types';

const STORAGE_KEY = 'ai-grocery-lists';

export const storageService = {
  getSavedLists: (): SavedList[] => {
    try {
      const listsJSON = localStorage.getItem(STORAGE_KEY);
      if (listsJSON) {
        // Basic validation to ensure it's an array
        const parsedData = JSON.parse(listsJSON);
        return Array.isArray(parsedData) ? parsedData : [];
      }
    } catch (error) {
      console.error("Failed to parse saved lists from localStorage", error);
    }
    return [];
  },
  
  saveLists: (lists: SavedList[]): void => {
    try {
      const listsJSON = JSON.stringify(lists);
      localStorage.setItem(STORAGE_KEY, listsJSON);
    } catch (error) {
      console.error("Failed to save lists to localStorage", error);
    }
  }
};
