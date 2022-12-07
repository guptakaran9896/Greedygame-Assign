import React from 'react';
import {BrowserRouter, Redirect, Route} from 'react-router-dom';

import Home from './components/home';

import './App.css';

function App() {
 
  return (
    <div className="App">
      <div className={'sideBar'}>

      </div>
      <div className={'content'}>
          <BrowserRouter>
              <Route path={'/'}>
                <Redirect to={'/analytics'}/>
              </Route>
              <Route path="/analytics" component={Home}/>
          </BrowserRouter>
      </div>
    </div>
  );
}

export default App;
