import React from 'react';
import './App.css';
import SearchPlaces from './features/search_location/searchPlaces';
import SearchPlacesWithRedux from './features/search_location/searchWithRedux'
function App() {
  return (
    <div className="App">
      <header className="App-header">
        <SearchPlaces/>
        <SearchPlacesWithRedux/>
      </header>
    </div>
  );
}

export default App;
