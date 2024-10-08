import React from 'react';
import ReactDOM from 'react-dom/client';
import CssBaseline from '@mui/material/CssBaseline';

import App from './App';
import reportWebVitals from './reportWebVitals';
import ApolloProvider from './providers/ApolloProvider';
import ThemeProvider from './providers/ThemeProvider';

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);

/**
 * TODO:
 * - Add some kind of tracking like Hotjar
 */

root.render(
  <React.StrictMode>
    <ApolloProvider>
      <ThemeProvider>
        <CssBaseline />
        <App />
      </ThemeProvider>
    </ApolloProvider>
  </React.StrictMode>,
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
