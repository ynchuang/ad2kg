import React, { useEffect, useState } from 'react';
import { List, Typography, Collapse, Spin } from "antd";
import axios from 'axios';

const { Panel } = Collapse;
const { Text, Paragraph } = Typography;

const RecPaper = ({ query }) => {
    const [loading, setLoading] = useState(false);
    const [titles, setTitles] = useState([])

    useEffect(() => {
        if (query === "") {
            return;
        }

        setLoading(true);
        axios.get(`http://127.0.0.1:5566/knowledgegraph/w2p`, {
            params: {
                target_query: query,
                model_query: "air"
            }
        }).then(res => {
            const d = res.data;
            setTitles(d.rec_title_result);
            // console.log(d.rec_result);
            setLoading(false);
        }).catch(function (error) {
            setTitles([]);
            console.log(error.toJSON());
            setLoading(false);
        })
    }, [query])

    return (
        <>
            <Collapse accordion>
                <Panel header="Rec Paper" key="1">
                    <Spin spinning={loading}>
                        <List
                            bordered
                            dataSource={titles}
                            renderItem={(item) => (
                                <List.Item>
                                    {item}
                                </List.Item>
                            )}
                        />
                    </Spin>
                </Panel>
            </Collapse>
        </>
    );
};

export default RecPaper;