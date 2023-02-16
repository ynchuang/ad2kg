import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Card, List, Space, Button, Typography, Spin, Empty } from "antd";

const { Title, Paragraph } = Typography;

export const DefaultDocInfo = {
    "given": "",
    "abstract": "",
    "title": "",
    "author_list": [],
    "keyword": [],
    "download_url": "",
    "nih_url": "",
    "pmid": "",
    "pmcid": "",
    "doi": ""
}

const NodeDetails = ({ nodeInfo }) => {
    const [docInfo, setDocInfo] = useState(DefaultDocInfo);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setLoading(true);
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
            setLoading(false);
        }).catch(function (error) {
            setDocInfo(DefaultDocInfo);
            console.log(error.toJSON());
            setLoading(false);
        })
    }, [nodeInfo])


    const keywordListItems = renderKeywordList(docInfo.keyword);
    const authorListItems = renderAuthorList(docInfo.author_list);

    return (
        <>
            <Spin spinning={loading}>
                <Card>
                    <Space wrap>
                        <Button>Like</Button>
                        <Button>Dislike</Button>
                        <Button>Report</Button>
                    </Space>
                    <List>
                        <Title level={4}>{docInfo.title}</Title>
                        <Paragraph>{authorListItems}</Paragraph>
                        <Paragraph>PMID: {docInfo.pmid}</Paragraph>
                        <Paragraph>PMCID: {docInfo.pmcid}</Paragraph>
                        <Paragraph>DOI: {docInfo.doi}</Paragraph>
                        <Paragraph>Keyword: {keywordListItems}</Paragraph>
                    </List>
                    <Space wrap>
                        <Button href={docInfo.download_url}>Full text links</Button>
                        <Button>Cite</Button>
                    </Space>
                    <Title level={4}>Abstract</Title>
                    <Paragraph>{docInfo.abstract}</Paragraph>
                </Card>
            </Spin>
        </>
    );
};

function renderKeywordList(keywords) {
    if (keywords === undefined) {
        return "";
    }

    return keywords.join(", ");
}

function renderAuthorList(authors) {
    if (authors === undefined) {
        return "";
    }

    return authors.map((author) =>
        author.ForeName + author.LastName
    ).join(", ");
}


export default NodeDetails;