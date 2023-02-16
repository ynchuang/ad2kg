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
        if (nodeInfo.given === "") {
            return;
        }

        setLoading(true);
        let id = 0;
        if (nodeInfo.group === "Paper") {
            id = nodeInfo.label;
        } else {
            const myArray = /Source:<\/strong> (\d+)<br>/g.exec(nodeInfo.title);
            if (myArray && myArray[1] !== undefined) {
                id = myArray[1]
            }
        }

        axios.get(`knowledgegraph/details`, {
            params: {
                id: id
            }
        }).then(res => {
            const d = res.data;
            setDocInfo(checkResp(d));
            setLoading(false);
        }).catch(function (error) {
            setDocInfo(DefaultDocInfo);
            console.log(error.toJSON());
            setLoading(false);
        })
    }, [nodeInfo])


    const keywordListItems = renderKeywordList(docInfo.keyword);
    const authorListItems = renderAuthorList(docInfo.author_list);

    let detailsCard;
    if (nodeInfo.given === "") {
        detailsCard =
            <Spin spinning={loading}>
                <Card><Empty /></Card>
            </Spin>
    } else {
        detailsCard =
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
    }

    return (
        <>
            {detailsCard}
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

function checkResp(resp) {
    let out = DefaultDocInfo;

    if (resp.given !== undefined) {
        out.given = resp.given
    }
    if (resp.abstract !== undefined) {
        out.abstract = resp.abstract
    }
    if (resp.title !== undefined) {
        out.title = resp.title
    }
    if (resp.author_list !== undefined) {
        out.author_list = resp.author_list
    }
    if (resp.keyword !== undefined) {
        out.keyword = resp.keyword
    }
    if (resp.download_url !== undefined) {
        out.download_url = resp.download_url
    }
    if (resp.nih_url !== undefined) {
        out.nih_url = resp.nih_url
    }
    if (resp.pmid !== undefined) {
        out.pmid = resp.pmid
    }
    if (resp.pmcid !== undefined) {
        out.pmcid = resp.pmcid
    }
    if (resp.doi !== undefined) {
        out.doi = resp.doi
    }

    return out;
}

export default NodeDetails;