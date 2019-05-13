import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import { createLogger } from 'redux-logger';
import rootReducer from './reducers/rootReducer'

const initialState = {};

//by default dont expand statements in console
const logger = createLogger({ collapsed: true });

//Redux middleware is code that intercepts actions 
//coming into the store via the dispatch() method, 
//and does something.
var middleware = [thunk];

var enhancers = compose(
    applyMiddleware(...middleware)
)

console.log(process.env);
//enable redux devtools and logger only in non-production
//also always put logger middleware last per logger doc
if(process.env.REACT_APP_ENVIRONMENT !== 'production' && process.env.REACT_APP_ENVIRONMENT !== 'prod'){
    middleware.push(logger);
    const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
    enhancers = composeEnhancers(
        applyMiddleware(...middleware)
    )
}

const store = createStore(
    rootReducer, 
    initialState, 
    enhancers
);

export default store;