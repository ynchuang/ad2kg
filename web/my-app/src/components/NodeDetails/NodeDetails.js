import React, { useState } from 'react';

const NodeDetails = ({ nodeInfo }) => {
    return (
        <>
            <h2>NodeInfo:</h2>
            <h3>Group: {nodeInfo.group}</h3>
            <h3>Id: {nodeInfo.id}</h3>
            <h3>label: {nodeInfo.label}</h3>
            <h3>shape: {nodeInfo.shape}</h3>
            <h3>title: {nodeInfo.title}</h3>
            <h3>value: {nodeInfo.value}</h3>
        </>
    );
};



export default NodeDetails;