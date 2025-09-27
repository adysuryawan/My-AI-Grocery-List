
import React from 'react';
import type { GroceryItemType } from '../types';
import GroceryItem from './GroceryItem';
import { PlusIcon } from './icons/PlusIcon';
import { TrashIcon } from './icons/TrashIcon';

interface GroceryListProps {
  items: GroceryItemType[];
  onAddItem: () => void;
  onUpdateItem: (id: string, newName: string) => void;
  onToggleItem: (id: string) => void;
  onRemoveItem: (id: string) => void;
  onClearList: () => void;
}

const GroceryList: React.FC<GroceryListProps> = ({ items, onAddItem, onUpdateItem, onToggleItem, onRemoveItem, onClearList }) => {
  if (items.length === 0) {
    return null;
  }

  const groupedItems = items.reduce((acc, item) => {
    const category = item.category || 'Uncategorized';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(item);
    return acc;
  }, {} as Record<string, GroceryItemType[]>);

  const categories = Object.keys(groupedItems).sort();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-200">Your Shopping List</h3>
         <button
            onClick={onClearList}
            className="flex items-center space-x-2 text-sm text-red-500 hover:text-red-700 dark:hover:text-red-400 transition-colors"
            aria-label="Clear list"
          >
            <TrashIcon className="w-4 h-4" />
            <span>Clear List</span>
          </button>
      </div>
      {categories.map(category => (
        <div key={category}>
          <h4 className="font-bold text-brand-green dark:text-brand-light mb-2 border-b-2 border-brand-green/20 pb-1">{category}</h4>
          <ul className="space-y-2">
            {groupedItems[category].map(item => (
              <GroceryItem
                key={item.id}
                item={item}
                onUpdate={onUpdateItem}
                onToggle={onToggleItem}
                onRemove={onRemoveItem}
              />
            ))}
          </ul>
        </div>
      ))}
       <button
          onClick={onAddItem}
          className="w-full flex items-center justify-center space-x-2 text-sm text-brand-green hover:text-brand-dark dark:text-brand-light dark:hover:text-white border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg py-2 transition-colors duration-200"
        >
          <PlusIcon className="w-4 h-4" />
          <span>Add Item</span>
        </button>
    </div>
  );
};

export default GroceryList;
