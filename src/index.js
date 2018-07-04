import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';

import { BrowserRouter,Route } from 'react-router-dom';
import loginReducer from './reducers/loginReducer';
import { createStore } from 'redux';
import { Provider} from 'react-redux';



const store = createStore(loginReducer);
ReactDOM.render(
  <Provider store={store}>
    <BrowserRouter>
      <Route path="/" component={App}/>
    </BrowserRouter>
  </Provider>
  ,
  document.getElementById('root')
);

registerServiceWorker();
