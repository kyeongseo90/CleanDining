import React from 'react';
import {BrowserRouter, Routes, Route} from 'react-router-dom';
import DetailPage from './DetailPage';
import FindGps from './FindGps';
import SearchPlace from './SearchPlace';
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/keywordSearch" element={<SearchPlace />}></Route>
        <Route path="/parentLocation" element={<FindGps />}></Route>
        <Route path="/detailPage" element={<DetailPage />}></Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
