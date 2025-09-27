
import React, { useState, useRef, useEffect } from 'react';
import type { GroceryItemType } from '../types';
import { CheckIcon } from './icons/CheckIcon';
import { EditIcon } from './icons/EditIcon';
import { TrashIcon } from './icons/TrashIcon';

interface GroceryItemProps {
  item: GroceryItemType;
  onUpdate: (id: string, newName: string) => void;
  onToggle: (id: string) => void;
  onRemove: (id: string) => void;
}

const GroceryItem: React.FC<GroceryItemProps> = ({ item, onUpdate, onToggle, onRemove }) => {
  const [isEditing, setIsEditing] = useState(item.name === '');
  const [editedName, setEditedName] = useState(item.name);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing) {
      inputRef.current?.focus();
    }
  }, [isEditing]);
  
  const handleSave = () => {
    if (editedName.trim() !== '' && editedName.trim() !== item.name) {
      onUpdate(item.id, editedName.trim());
    } else if (editedName.trim() === '') {
        onRemove(item.id); // Remove if name is empty
    }
    setEditedName(editedName.trim());
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSave();
    }
    if (e.key === 'Escape') {
      setEditedName(item.name);
      setIsEditing(false);
      if(item.name === '') onRemove(item.id);
    }
  };

  return (
    <li className="group flex items-center bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg transition-colors duration-200 hover:bg-gray-100 dark:hover:bg-gray-700">
      <button onClick={() => onToggle(item.id)} className="flex items-center flex-grow space-x-3" aria-label={`Mark ${item.name} as ${item.checked ? 'incomplete' : 'complete'}`}>
        <div className={`w-6 h-6 rounded-md flex-shrink-0 flex items-center justify-center border-2 transition-all duration-200 ${item.checked ? 'bg-brand-green border-brand-green' : 'border-gray-300 dark:border-gray-500'}`}>
          {item.checked && <CheckIcon className="w-4 h-4 text-white" />}
        </div>
        {isEditing ? (
          <input
            ref={inputRef}
            type="text"
            value={editedName}
            onChange={(e) => setEditedName(e.target.value)}
            onBlur={handleSave}
            onKeyDown={handleKeyDown}
            className="flex-grow bg-transparent p-0 border-0 focus:ring-0 text-gray-800 dark:text-gray-200"
          />
        ) : (
          <span className={`flex-grow text-left ${item.checked ? 'line-through text-gray-400 dark:text-gray-500' : 'text-gray-800 dark:text-gray-200'}`}>
            {item.name}
          </span>
        )}
      </button>

      <div className="flex items-center space-x-2 ml-4 opacity-0 group-hover:opacity-100 transition-opacity">
        {!isEditing &&
            <button
                onClick={() => setIsEditing(true)}
                className="p-1 text-gray-500 hover:text-blue-500 dark:hover:text-blue-400"
                aria-label={`Edit ${item.name}`}
            >
                <EditIcon className="w-4 h-4" />
            </button>
        }
        <button
          onClick={() => onRemove(item.id)}
          className="p-1 text-gray-500 hover:text-red-500 dark:hover:text-red-400"
          aria-label={`Remove ${item.name}`}
        >
          <TrashIcon className="w-4 h-4" />
        </button>
      </div>
    </li>
  );
};

export default GroceryItem;
