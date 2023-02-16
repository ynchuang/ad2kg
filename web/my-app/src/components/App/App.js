import React, { useState } from 'react';
import './App.css';
import { Row, Col } from 'antd';
import Graph from '../Graph/Graph';
import NodeDetails from '../NodeDetails/NodeDetails';
import RecPaper from '../RecPaper/RecPaper';
import RecWord from '../RecWord/RecWord'

function App() {
  const [nodeInfo, setNodeInfo] = useState({
    group: "",
    id: 0,
    label: "",
    shape: "",
    title: "",
    value: 0,
  });

  return (
    <div className="App">
      <header>
        <Row gutter={16}>
          <Col span={14}>
            <Row>
              <Col span={24}>
                <Graph setNodeInfo={setNodeInfo} />
              </Col>
            </Row>
            <Row>
              <Col span={24}>
                <RecPaper />
              </Col>
            </Row>
            <Row>
              <Col span={24}>
                <RecWord />
              </Col>
            </Row>
          </Col>
          <Col span={10}>
            <NodeDetails nodeInfo={nodeInfo} />
          </Col>
        </Row>
      </header >
    </div >
  );
}

export default App;
