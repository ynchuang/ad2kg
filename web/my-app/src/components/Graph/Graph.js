import React, { useEffect, useRef, useState } from "react";
import Neovis from "neovis.js/dist/neovis.js";
import { Row, Col, Card, Input, Form, Button } from 'antd';

const CYPHER = `WITH "{QUERY}" as query 
MATCH p = (head)-[r]->(tail) 
WHERE head.name STARTS WITH query or tail.name STARTS WITH query 
RETURN p`;

const Graph = ({ setNodeInfo, query, setQuery }) => {
    const visRef = useRef();
    const neoVis = useRef();

    useEffect(() => {
        const config = {
            container_id: visRef.current.id,
            server_url: "bolt://localhost:7687",
            server_user: "neo4j",
            server_password: "neo4j1",
            labels: {
                "NER_Bio": {
                    caption: "name",
                    size: 5.0,
                    sizeCypher: "MATCH (n) WHERE id(n) = {id} RETURN SIZE((n)-[]->()) AS s;",
                    font: {
                        size: 20
                    },
                    group: 'community',
                },
                "Paper": {
                    caption: "name",
                    size: 3.0,
                    sizeCypher: "MATCH (n) WHERE id(n) = {id} RETURN SIZE((n)-[]->()) AS s;",
                    font: {
                        size: 20
                    },
                    nodes: {
                        shape: 'neo',
                    },
                    group: 'community',
                }
            },
            relationships: {
                font: {
                    size: 10
                }
            },
            initial_cypher: "MATCH p = (bio_ner_h)-[r*1..3]->(bio_ner_t) WHERE bio_ner_t.name = 35061102 or bio_ner_h.name = 35061102 RETURN p",
            arrows: true,
        };
        neoVis.current = new Neovis(config);
        neoVis.current.render();
        neoVis.current.registerOnEvent('clickNode', (e) => {
            // e: { nodeId: number; node: Node }
            console.info(e);
            setNodeInfo({
                group: e.node.group,
                id: e.node.id,
                label: e.node.label,
                shape: e.node.shape,
                title: e.node.title,
                value: e.node.value,
            });
        });
    }, []);

    const onFinish = (values) => {
        setQuery(values.input);
        let cypher = CYPHER.replace("{QUERY}", values.input);
        console.log("queryWithCypher: ", cypher);
        neoVis.current.renderWithCypher(cypher);
    };

    return (
        <>
            <Card>
                <Row>
                    <Col span={24}>
                        <Row>
                            <Col span={24}>
                                <Form
                                    name="query"
                                    onFinish={onFinish}
                                    style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                                    <Form.Item
                                        label="Input"
                                        name="input"
                                        style={{ marginBottom: 0 }}>
                                        <Input style={{ width: 200 }} />
                                    </Form.Item>
                                    <Form.Item style={{ marginBottom: 0 }}>
                                        <Button type="primary" htmlType="Submit">
                                            Submit
                                        </Button>
                                    </Form.Item>
                                </Form>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={24}>
                                <div
                                    id="graph-id"
                                    ref={visRef}
                                    style={{
                                        width: `100%`,
                                        height: `50vh`,
                                        backgroundColor: `"#d3d3d3"`,
                                    }}
                                >
                                </div>
                            </Col>
                        </Row>
                    </Col>
                </Row>
            </Card>
        </>
    );
}

export default Graph;