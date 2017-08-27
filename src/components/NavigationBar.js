// @flow
import React from 'react';
import PropTypes from 'prop-types';
import Row from 'antd/lib/row';
import Col from 'antd/lib/col';
import Button from 'antd/lib/button';
import Modal from 'antd/lib/modal';
import './NavigationBar.css';

export default class NavigationBar extends React.Component {

  state = {
    isPageSetupModalVisible: false,
  }

  setPageSetupModalVisible(isPageSetupModalVisible) {
    this.setState({ isPageSetupModalVisible })
  }

  handlePageSetupClick = (e) => {
    this.setPageSetupModalVisible(true);
  }

  render() {
    return (
      <Row className="NavigationBar" type="flex" align="middle" justify="space-around" gutter={8}>
        <Col span={23}>
          <a href="/" className="brand">
            <strong>GitPrint</strong> <em>– Easily print GitHub markdown to beautiful PDF</em>
          </a>
        </Col>
        <Col span={2} className="buttons">
          <Button 
            onClick={this.handlePageSetupClick}
            icon="file-pdf" 
            size="large">Page Setup</Button>
          <Modal
            title="Page Setup"
            visible={this.state.isPageSetupModalVisible}
            okText="Save"
            cancelText="Cancel"
            maskClosable={false}
            onOk={() => this.setPageSetupModalVisible(false)}
            onCancel={() => this.setPageSetupModalVisible(false)}
          >
            <p>some contents...</p>
            <p>some contents...</p>
            <p>some contents...</p>
          </Modal>
        </Col>
      </Row>
    );
  }

}
