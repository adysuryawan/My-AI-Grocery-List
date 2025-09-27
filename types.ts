
export interface GroceryItemType {
  id: string;
  name: string;
  category: string;
  checked: boolean;
}

export interface GeminiGroceryItem {
    name: string;
    category: string;
}

export interface SavedList {
  id: string;
  name: string;
  items: GroceryItemType[];
  createdAt: string;
}
