
import React from 'react';

interface InputFormProps {
  prompt: string;
  setPrompt: (prompt: string) => void;
  onSubmit: () => void;
  isLoading: boolean;
}

const InputForm: React.FC<InputFormProps> = ({ prompt, setPrompt, onSubmit, isLoading }) => {
    
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        onSubmit();
    }
  }

  return (
    <div className="flex flex-col space-y-4">
        <div>
          <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-200">What's on the menu?</h2>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Describe your meal, dish, or weekly plan. For example, "Bake a chocolate cake" or "Taco night for four people".</p>
        </div>
        <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="e.g., Make spaghetti bolognese for a family dinner..."
            rows={3}
            className="w-full p-4 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:ring-2 focus:ring-brand-green focus:border-brand-green transition duration-200 bg-gray-50 dark:bg-gray-700 dark:text-white"
            disabled={isLoading}
        />
      <button
        onClick={onSubmit}
        disabled={isLoading || !prompt.trim()}
        className="w-full flex justify-center items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-brand-green hover:bg-brand-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-green disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors duration-300"
      >
        {isLoading ? (
          <>
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Generating...
          </>
        ) : (
          'Create My List'
        )}
      </button>
    </div>
  );
};

export default InputForm;
