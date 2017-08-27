// @flow
import './App.css';
import React, { Component } from 'react';
import NavigationBar from './components/NavigationBar';
import PDFDocument from './components/PDFDocument';

import Layout, { Header, Content } from 'antd/lib/layout';

// TODO: Pick this up from the URL, use a helper to extract the raw URL
// const mdUrl = 'https://daringfireball.net/projects/markdown/syntax.text';
const mdUrl = 'https://gist.githubusercontent.com/adamburmister/1f0b09c4f0252141b3d418aadbd65fb4/raw/1a374c9a5b8365ce189ce833ce05b7b21421e3ee/gistfile1.txt';

class App extends Component {
  
  handleOnRendered = (pdf) => {
    this.setState({ pdf });
  }

  render() {
    return (
      <Layout style={{ height: '100%' }}>
        <Header style={{ background: '#fff' }}>
          <NavigationBar />
        </Header>
        <Content className="pdfDocContainer" style={{ position: 'relative' }}>
          <PDFDocument url={mdUrl} onRendered={this.handleOnRendered} />
        </Content>
      </Layout>
    );
  }
}

export default App;
