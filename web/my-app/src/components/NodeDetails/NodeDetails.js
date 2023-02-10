import React, { useEffect, useState } from 'react';
import axios from 'axios';

const defaultDocInfo = {
    "given": "",
    "abstract": "",
    "title": "",
    "author_list": [],
    "keyword": [],
    "download_url": "",
    "nih_url": "",
}

const NodeDetails = ({ nodeInfo }) => {
    const [docInfo, setDocInfo] = useState(defaultDocInfo);

    useEffect(() => {
        let id = 0;
        if (nodeInfo.group == "Paper") {
            id = nodeInfo.label;
        } else {
            const myArray = /Source:<\/strong> (\d+)<br>/g.exec(nodeInfo.title);
            if (myArray && myArray[1] !== undefined) {
                id = myArray[1]
            }
        }

        axios.get(`http://127.0.0.1:5566/knowledgegraph/details`, {
            params: {
                id: id
            }
        }).then(res => {
            const d = res.data;
            setDocInfo(d);
            console.log(d);
        }).catch(function (error) {
            setDocInfo(defaultDocInfo);
            console.log(error.toJSON());
        })
    }, [nodeInfo])


    const keywordListItems = renderKeywordList(docInfo.keyword);
    const authorListItems = renderAuthorList(docInfo.author_list);

    return (
        <>
            <h2>DocInfo:</h2>
            <h3> ID: {docInfo.given}</h3>
            <h3> Title: {docInfo.title}</h3>
            <h3> Abstract: {docInfo.abstract}</h3>
            <h3> Author:</h3>
            <ul>{authorListItems}</ul>
            <h3> Keyword:</h3>
            <ul>{keywordListItems}</ul>
            <h3> Download URL: {docInfo.download_url}</h3>
            <h3> NIH URL: {docInfo.nih_url}</h3>
            <h2>-----</h2>
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

function renderKeywordList(keywords) {
    if (!keywords) {
        return <li></li>
    }
    return keywords.map((keyword) =>
        <li key={keyword}>
            {keyword}
        </li>);
}

function renderAuthorList(authors) {
    if (!authors) {
        return <li></li>
    }

    return authors.map((author) =>
        <li>
            {author.ForeName + author.LastName}
        </li>);
}


export default NodeDetails;