
import React from 'react';
import { ShoppingCartIcon } from './icons/ShoppingCartIcon';
import { HomeIcon } from './icons/HomeIcon';

interface HeaderProps {
    onGoHome?: () => void;
}

const Header: React.FC<HeaderProps> = ({ onGoHome }) => {
  return (
    <header className="py-6">
      <div className="container mx-auto px-4 md:px-8 flex items-center justify-center relative">
        {onGoHome && (
            <button 
                onClick={onGoHome} 
                className="absolute left-4 md:left-8 p-2 text-gray-500 hover:text-brand-green dark:text-gray-400 dark:hover:text-brand-light rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                aria-label="Go to Home Screen"
            >
                <HomeIcon className="w-6 h-6" />
            </button>
        )}
        <div className="flex items-center space-x-3">
          <ShoppingCartIcon className="w-8 h-8 text-brand-green" />
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-white text-center">
            AI Grocery List
          </h1>
        </div>
      </div>
    </header>
  );
};

export default Header;
