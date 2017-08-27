// @flow
import vfsFonts from 'pdfmake/build/vfs_fonts';
import pdfMake from 'pdfmake/build/pdfmake';
import React from 'react';
import PropTypes from 'prop-types';
import DocDefinition from '../lib/doc';
import Spin from 'antd/lib/spin';
import Icon from 'antd/lib/icon';
import message from 'antd/lib/message';
import notification from 'antd/lib/notification';

const { vfs } = vfsFonts.pdfMake;
pdfMake.vfs = vfs;

export default class PDFDocument extends React.Component {

  props = {
    url: PropTypes.string.isRequired,
    onRendered: PropTypes.func.isRequired,
  }

  state = {
    pdfContent: null,
  }

  componentDidMount() {
    const hide = message.loading('Loading markdown...', 0);
    fetch(this.props.url)
      .then((response) => {
        hide();
        if (response.ok) {
          return response.text();
        }
      })
      .then(this.renderPdf)
      .catch((err) => {
        hide();
        message.error('Error loading markdown', 2);
        notification.open({
          message: 'Oops!',
          description: 'There was a problem rendering the markdown document to PDF.\n\n' + err.toString(),
          icon: <Icon type="frown-circle" style={{ color: '#108ee9' }} />,
          duration: 0,
        });
        console.error(err);
      });
  }

  renderPdf = (md) => {
    const pdf = pdfMake.createPdf(new DocDefinition(md));
    
    pdf.getDataUrl((dataUrl) => {
      this.setState({ pdfContent: dataUrl });
    });
    
    this.props.onRendered(pdf);
  }

  render() {
    const { pdfContent } = this.state;

    if (!pdfContent) {
      return (
        <div>
          <Spin spinning={pdfContent} />
        </div>
      );
    }

    return (
      <iframe 
        ref={ref => this.refIframe = ref} 
        src={pdfContent}
        width="100%"
        height="100%"
        scrolling="no"
        frameBorder="no"
        id="pdf"
        title="PDF">
      </iframe>
    )
  }
  
}
