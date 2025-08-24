import React, { createContext, useState } from 'react';

export const SearchContext = createContext();


export const SearchContextProvider = ({ children }) => {
  const [searchResults, setSearchResults] = useState([]);
  const [searchSuggestion,setSearchSuggestion]=useState([])
  const [isSearching, setIsSearching] = useState(false)
  const [isSearchingSuggest, setIsSearchingSuggest] = useState(false)
  return (
    <SearchContext.Provider value={{
      searchResults, setSearchResults,
      searchSuggestion,setSearchSuggestion,
      isSearching, setIsSearching,
      isSearchingSuggest, setIsSearchingSuggest
    }}>
      {children}
    </SearchContext.Provider>
  );
};