import 'core-js/features/map';
import 'core-js/features/set';
import '@vkontakte/vkui/dist/vkui.css';
import './styles.scss';
import React from 'react';
import ReactDOM from 'react-dom';
import { App } from './app';
import { ApolloProvider } from '@apollo/client';
import { client } from 'api';
import * as serviceWorker from './serviceWorker';
import { router } from './routes';
import { RouterProvider } from 'react-router5';

if (process.env.REACT_APP_ERUDA) {
  import('./eruda').catch(console.error);
}

ReactDOM.render(
  <React.StrictMode>
    <ApolloProvider client={client}>
      <RouterProvider router={router}>
        <App />
      </RouterProvider>
    </ApolloProvider>
  </React.StrictMode>,
  document.getElementById('root'),
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
