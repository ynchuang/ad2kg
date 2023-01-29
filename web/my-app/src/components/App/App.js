import React, { useState } from 'react';
import './App.css';
import SearchForm from '../SearchForm/SearchForm';
import Graph from '../Graph/Graph';

function App() {
  const [query, setQuery] = useState('');
  const [nodeInfo, setNodeInfo] = useState({
    group: "NER_Bio",
    id: 20,
    label: "MCI",
    shape: "dot",
    title: "<strong>name:</strong> MCI<br><strong>Source:</strong> 33436035<br><strong>id:</strong> MCI<br>",
    value: 5,
  });

  return (
    <div className="App">
      <header>
        <div className="container">
          <SearchForm query={query} setQuery={setQuery} />
          <Graph setNodeInfo={setNodeInfo} />
          <h1>Query: {query}</h1>
          <h2>NodeInfo:</h2>
          <h3>Group: {nodeInfo.group}</h3>
          <h3>Id: {nodeInfo.id}</h3>
          <h3>label: {nodeInfo.label}</h3>
          <h3>shape: {nodeInfo.shape}</h3>
          <h3>title: {nodeInfo.title}</h3>
          <h3>value: {nodeInfo.value}</h3>
        </div>
      </header>
    </div>
  );
}

export default App;
