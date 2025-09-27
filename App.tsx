
import React, { useState, useCallback, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import type { GroceryItemType, SavedList } from './types';
import { generateGroceryList } from './services/geminiService';
import { storageService } from './services/storageService';

import Header from './components/Header';
import InputForm from './components/InputForm';
import GroceryList from './components/GroceryList';
import Loader from './components/Loader';
import Footer from './components/Footer';
import StartScreen from './components/StartScreen';
import LoadListScreen from './components/LoadListScreen';
import { SaveIcon } from './components/icons/SaveIcon';


type View = 'start' | 'load' | 'list';

const App: React.FC = () => {
  const [view, setView] = useState<View>('start');
  const [prompt, setPrompt] = useState<string>('');
  const [groceryList, setGroceryList] = useState<GroceryItemType[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const [savedLists, setSavedLists] = useState<SavedList[]>([]);
  const [activeListId, setActiveListId] = useState<string | null>(null);
  const [listName, setListName] = useState<string>('');
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle');


  useEffect(() => {
    setSavedLists(storageService.getSavedLists());
  }, []);

  const handleGenerateList = useCallback(async () => {
    if (!prompt.trim() || isLoading) return;
    setIsLoading(true);
    setError(null);
    setGroceryList([]);

    try {
      const items = await generateGroceryList(prompt);
      const newList = items.map(item => ({
        ...item,
        id: uuidv4(),
        checked: false,
      }));
      setGroceryList(newList);
      if (!activeListId) {
        setListName(prompt.length > 50 ? prompt.substring(0, 47) + '...' : prompt);
      }
    } catch (err) {
      setError('Failed to generate the grocery list. Please check your API key and try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [prompt, isLoading, activeListId]);

  const handleAddItem = useCallback(() => {
    setGroceryList(prevList => [
      ...prevList,
      { id: uuidv4(), name: '', category: 'Uncategorized', checked: false },
    ]);
  }, []);

  const handleUpdateItem = useCallback((id: string, updatedName: string) => {
    setGroceryList(prevList =>
      prevList.map(item =>
        item.id === id ? { ...item, name: updatedName } : item
      )
    );
  }, []);

  const handleToggleItem = useCallback((id: string) => {
    setGroceryList(prevList =>
      prevList.map(item =>
        item.id === id ? { ...item, checked: !item.checked } : item
      )
    );
  }, []);

  const handleRemoveItem = useCallback((id: string) => {
    setGroceryList(prevList => prevList.filter(item => item.id !== id));
  }, []);
  
  const handleClearList = useCallback(() => {
    setGroceryList([]);
  }, []);

  // --- Navigation and List Management Handlers ---

  const handleStartNewList = () => {
    setGroceryList([]);
    setPrompt('');
    setError(null);
    setActiveListId(null);
    setListName('My New List');
    setView('list');
  };

  const handleLoadList = (listId: string) => {
    const listToLoad = savedLists.find(l => l.id === listId);
    if (listToLoad) {
      setGroceryList(listToLoad.items);
      setListName(listToLoad.name);
      setActiveListId(listToLoad.id);
      setPrompt('');
      setError(null);
      setView('list');
    }
  };

  const handleDeleteList = (listId: string) => {
    const updatedLists = savedLists.filter(l => l.id !== listId);
    setSavedLists(updatedLists);
    storageService.saveLists(updatedLists);
  };
  
  const handleSaveList = () => {
    if (!listName.trim() || groceryList.length === 0) {
      alert("Please enter a name for the list and ensure it's not empty.");
      return;
    }
    setSaveStatus('saving');
    
    let updatedLists: SavedList[];
    
    if (activeListId) { // Update existing list
      updatedLists = savedLists.map(l => 
        l.id === activeListId 
          ? { ...l, name: listName.trim(), items: groceryList, createdAt: new Date().toISOString() } 
          : l
      );
    } else { // Save new list
      const newList: SavedList = {
        id: uuidv4(),
        name: listName.trim(),
        items: groceryList,
        createdAt: new Date().toISOString()
      };
      updatedLists = [...savedLists, newList];
      setActiveListId(newList.id);
    }
    
    setSavedLists(updatedLists);
    storageService.saveLists(updatedLists);
    
    setTimeout(() => setSaveStatus('saved'), 100);
    setTimeout(() => setSaveStatus('idle'), 2000);
  };

  const handleGoHome = () => {
    setGroceryList([]);
    setPrompt('');
    setError(null);
    setActiveListId(null);
    setListName('');
    setView('start');
  };


  const renderContent = () => {
    switch (view) {
      case 'start':
        return <StartScreen onNewList={handleStartNewList} onLoadList={() => setView('load')} />;
      case 'load':
        return <LoadListScreen lists={savedLists} onLoad={handleLoadList} onDelete={handleDeleteList} onBack={handleGoHome} />;
      case 'list':
        return (
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 md:p-8 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-gray-200 dark:border-gray-700 pb-6">
                <input
                    type="text"
                    value={listName}
                    onChange={(e) => setListName(e.target.value)}
                    placeholder="Enter list name"
                    className="flex-grow text-2xl font-bold bg-transparent focus:outline-none -ml-1 p-1 rounded-md focus:bg-gray-100 dark:focus:bg-gray-700 transition-colors"
                    aria-label="List Name"
                />
                <button 
                    onClick={handleSaveList} 
                    disabled={saveStatus !== 'idle' || groceryList.length === 0}
                    className={`flex-shrink-0 flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white transition-colors duration-300 w-full sm:w-auto ${
                        saveStatus === 'saved'
                        ? 'bg-blue-500'
                        : 'bg-brand-green hover:bg-brand-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-green'
                    } disabled:bg-gray-400 disabled:cursor-not-allowed`}
                >
                    <SaveIcon className="w-5 h-5 mr-2" />
                    {saveStatus === 'saved' ? 'Saved!' : 'Save List'}
                </button>
            </div>
            
            <InputForm
              prompt={prompt}
              setPrompt={setPrompt}
              onSubmit={handleGenerateList}
              isLoading={isLoading}
            />
            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg relative" role="alert">
                <strong className="font-bold">Oops! </strong>
                <span className="block sm:inline">{error}</span>
              </div>
            )}
            
            <div className="relative">
              {isLoading && <Loader />}
              {!isLoading && groceryList.length > 0 && <div className="border-t border-gray-200 dark:border-gray-700 my-6"></div>}
              <GroceryList
                items={groceryList}
                onAddItem={handleAddItem}
                onUpdateItem={handleUpdateItem}
                onToggleItem={handleToggleItem}
                onRemoveItem={handleRemoveItem}
                onClearList={handleClearList}
              />
            </div>
          </div>
        );
      default:
        return <StartScreen onNewList={handleStartNewList} onLoadList={() => setView('load')} />;
    }
  };


  return (
    <div className="min-h-screen flex flex-col font-sans text-gray-800 dark:text-gray-200">
      <Header onGoHome={view !== 'start' ? handleGoHome : undefined} />
      <main className="flex-grow container mx-auto p-4 md:p-8 w-full max-w-3xl">
        {renderContent()}
      </main>
      <Footer />
    </div>
  );
};

export default App;
