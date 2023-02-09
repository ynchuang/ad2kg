import React, { useState } from 'react';
import './App.css';
import SearchForm from '../SearchForm/SearchForm';
import Graph from '../Graph/Graph';
import NodeDetails from '../NodeDetails/NodeDetails';

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
        <div className="container">
          {/* <SearchForm query={query} setQuery={setQuery} /> */}
          <div style={{ display: "flex" }}>
            <div style={{ flex: "60%" }}>
              <Graph setNodeInfo={setNodeInfo} />
            </div>
            <div style={{ flex: "40%" }}>
              <NodeDetails nodeInfo={nodeInfo} />
            </div>
          </div>

        </div>
      </header >
    </div >
  );
}

export default App;
