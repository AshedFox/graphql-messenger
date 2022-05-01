import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import {createGlobalStyle} from "styled-components";

const Global = createGlobalStyle`
  *,
  *::before,
  *::after {
    box-sizing: border-box;
    padding: 0;
    margin: 0;
  }

  body {
    min-height: 100vh;
    scroll-behavior: smooth;
    text-rendering: optimizeSpeed;
    line-height: 1.2;
    font-family: 'Open Sans', sans-serif;
    font-weight: 500;
  }

  ul[class],
  ol[class] {
    list-style: none;
  }

  a {
    text-decoration: none;
    color: inherit;
  }

  img {
    max-width: 100%;
    display: block;
  }

  input,
  button,
  textarea,
  select {
    font: inherit;
  }

  @media (prefers-reduced-motion: reduce) {
    * {
      animation-duration: 0.01ms !important;
      animation-iteration-count: 1 !important;
      transition-duration: 0.01ms !important;
      scroll-behavior: auto !important;
    }
  }
`

ReactDOM.render(
    <React.StrictMode>
        <Global/>
        <App/>
    </React.StrictMode>,
    document.getElementById('root')
);
