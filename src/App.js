// @flow
import React, { Component } from 'react';
// import Button from './components/Button';
import PDFDocument from './components/PDFDocument';

// TODO: Pick this up from the URL, use a helper to extract the raw URL
const mdUrl = 'https://raw.githubusercontent.com/adamburmister/gitprint.com/master/README.md';

class App extends Component {
  render() {
    return (
      <div className="App">
        <PDFDocument src={mdUrl} />
      </div>
    );
  }
}

export default App;
