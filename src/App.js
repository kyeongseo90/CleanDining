import React from 'react';
import {BrowserRouter, Routes, Route} from 'react-router-dom';
import CreateNewParty from './CreateNewParty.js';
//import DetailPage from './FindPeopleWith.js/index.js';
import FindGps from './FindGps.js';
import SearchPlace from './SearchPlace.js';
import ShowParty from './ShowParty.js';
import FindPeopleWith from './FindPeopleWith.js';
import WatchDetailInfo from './WatchDetailInfo.js';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/"></Route>
        <Route path="/keywordSearch" element={<SearchPlace />}></Route>
        <Route path="/parentLocation" element={<FindGps />}></Route>
        <Route path="/findPeopleWith/:id/:grade" element={<FindPeopleWith />}></Route>
        <Route path="/watchDetailInfo/:id" element={<WatchDetailInfo />}></Route>
        <Route path="/createNewParty/:id" element={<CreateNewParty/>}></Route>
        <Route path="/showParty/:id" element={<ShowParty />}></Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
