// @flow
import React from 'react';
import PropTypes from 'prop-types';
import DocDefinition from '../lib/doc';

export default class PDFDocument extends React.Component {

  props = {
    src: PropTypes.string,
  }

  componentDidMount() {
    fetch(this.props.src)
      .then(response => response.text())
      .then(this.renderPdf)
  }

  renderPdf = (md) => {
    // const tokens = lexer(md);
    // console.log(tokens);
    const doc = new DocDefinition(md);
    console.log(doc);
    // const pdf = window.pdfMake.createPdf(doc);
    // pdf.getDataUrl((dataUrl) => {
    //   this.refIframe.src = dataUrl;
    // });
  }

  render() {
    return (
      <iframe 
        ref={ref => this.refIframe = ref} 
        width="100%"
        height="800"
        title="PDF">
      </iframe>
    )
  }
  
}