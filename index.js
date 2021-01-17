import ReactDOM from 'react-dom';
import { Provider } from 'react-redux'
import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import Layout from './components/Layout';
import BasicCompiler from './services/BasicCompiler';
import rootReducer from './reducers';
import './index.css';

addEventListener('load', () => {
  const compiler = new BasicCompiler(document);
  const store = createStore(
    rootReducer, 
    applyMiddleware(thunk.withExtraArgument({ compiler }))
  );
  ReactDOM.render(
    <Provider store={store}>
      <Layout />      
    </Provider>,
    document.getElementById('root')
  );
})
