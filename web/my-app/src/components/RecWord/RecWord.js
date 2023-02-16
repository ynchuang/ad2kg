import React, { useEffect, useState } from 'react';
import { List, Typography, Collapse } from "antd";
import axios from 'axios';

const { Panel } = Collapse;
const { Paragraph } = Typography;

const RecWord = ({ query }) => {
    const [loading, setLoading] = useState(false);
    const [keywords, setKeywords] = useState([])

    useEffect(() => {
        setLoading(true);
        axios.get(`http://127.0.0.1:5566/knowledgegraph/w2w`, {
            params: {
                target_query: query,
                model_query: "air"
            }
        }).then(res => {
            console.log(query)
            const d = res.data;
            setKeywords(d.rec_result);
            console.log(d.rec_result);
            setLoading(false);
        }).catch(function (error) {
            setKeywords([]);
            console.log(error.toJSON());
            setLoading(false);
        })
    }, [query])

    const keywordListItems = renderKeywordList(keywords);

    return (
        <>
            <Collapse defaultActiveKey={['1']}>
                <Panel header="Rec Word" key="1">
                    <Paragraph>{keywordListItems}</Paragraph>
                </Panel>
            </Collapse>
        </>
    );
};

function renderKeywordList(keywords) {
    if (keywords === undefined) {
        return "";
    }

    return keywords.join(", ");
}

export default RecWord;