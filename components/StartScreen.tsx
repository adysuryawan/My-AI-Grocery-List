
import React from 'react';
import { PlusIcon } from './icons/PlusIcon';
import { FolderIcon } from './icons/FolderIcon';

interface StartScreenProps {
  onNewList: () => void;
  onLoadList: () => void;
}

const StartScreen: React.FC<StartScreenProps> = ({ onNewList, onLoadList }) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 text-center flex flex-col items-center space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Welcome!</h2>
        <p className="mt-2 text-gray-600 dark:text-gray-400">What would you like to do today?</p>
      </div>
      <div className="w-full max-w-sm space-y-4">
        <button
          onClick={onNewList}
          className="w-full flex items-center justify-center p-6 bg-brand-green text-white rounded-xl shadow-md hover:bg-brand-dark transition-transform transform hover:-translate-y-1 duration-300"
        >
          <PlusIcon className="w-8 h-8 mr-4" />
          <span className="text-xl font-semibold">Create a New List</span>
        </button>
        <button
          onClick={onLoadList}
          className="w-full flex items-center justify-center p-6 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-xl shadow-md hover:bg-gray-300 dark:hover:bg-gray-600 transition-transform transform hover:-translate-y-1 duration-300"
        >
          <FolderIcon className="w-8 h-8 mr-4" />
          <span className="text-xl font-semibold">Load a Saved List</span>
        </button>
      </div>
    </div>
  );
};

export default StartScreen;
