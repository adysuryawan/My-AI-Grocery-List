
import React from 'react';
import type { SavedList } from '../types';
import { TrashIcon } from './icons/TrashIcon';

interface LoadListScreenProps {
  lists: SavedList[];
  onLoad: (id: string) => void;
  onDelete: (id: string) => void;
  onBack: () => void;
}

const LoadListScreen: React.FC<LoadListScreenProps> = ({ lists, onLoad, onDelete, onBack }) => {

  const handleDelete = (e: React.MouseEvent, id: string, name: string) => {
    e.stopPropagation(); // Prevent the onLoad event from firing
    if(window.confirm(`Are you sure you want to delete the list "${name}"?`)){
        onDelete(id);
    }
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 md:p-8">
      <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">Your Saved Lists</h2>
      {lists.length > 0 ? (
        <ul className="space-y-3">
          {lists.sort((a,b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).map(list => (
            <li key={list.id}>
                <div
                    onClick={() => onLoad(list.id)}
                    className="group flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg hover:bg-brand-green/10 dark:hover:bg-brand-green/20 cursor-pointer transition-colors duration-200"
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && onLoad(list.id)}
                >
                    <div>
                        <p className="font-semibold text-gray-800 dark:text-gray-100">{list.name}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            Saved on {new Date(list.createdAt).toLocaleDateString()}
                        </p>
                    </div>
                    <button
                        onClick={(e) => handleDelete(e, list.id, list.name)}
                        className="p-2 text-gray-400 hover:text-red-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity focus:opacity-100"
                        aria-label={`Delete list ${list.name}`}
                    >
                        <TrashIcon className="w-5 h-5" />
                    </button>
                </div>
            </li>
          ))}
        </ul>
      ) : (
        <div className="text-center py-10 px-4 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg">
            <p className="text-gray-500 dark:text-gray-400">You don't have any saved lists yet.</p>
            <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">Create a new list to get started!</p>
        </div>
      )}
    </div>
  );
};

export default LoadListScreen;
