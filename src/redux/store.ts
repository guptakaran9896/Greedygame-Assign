  
import { applyMiddleware, createStore } from 'redux';
import thunkMiddleware from 'redux-thunk';
import { composeWithDevTools } from 'redux-devtools-extension';
import rootReducer from './reducers';

const configureStore = (preloadedState = {}) => {
  const middleWares = [thunkMiddleware];
  const middleWareEnhancers = applyMiddleware(...middleWares);
  const enhancers = composeWithDevTools(middleWareEnhancers);
  const store = createStore(rootReducer, preloadedState, enhancers);
  return store;
};

export default configureStore();