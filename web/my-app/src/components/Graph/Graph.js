import React, { useEffect, useRef, useState } from "react";
import Neovis from "neovis.js/dist/neovis.js";

const Graph = ({ setNodeInfo }) => {
    const [query, setQuery] = useState('');
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

    const handleSubmit = (event) => {
        event.preventDefault();
        console.log(query);

        if (query.length > 3) {
            console.log("queryWithCypher")
            neoVis.current.renderWithCypher(query);
        } else {
            console.log("reload");
            neoVis.current.reload();
        }
    };

    return (
        <>
            <div className="row">
                <form onSubmit={handleSubmit}>
                    <label>
                        Query:
                        <input type="text" value={query} onChange={(event) => setQuery(event.target.value)} />
                    </label>
                    <input type="submit" value="Submit" />
                </form>
            </div>
            <div
                id="graph-id"
                ref={visRef}
                style={{
                    width: `100%`,
                    height: `800px`,
                    backgroundColor: `"#d3d3d3"`,
                }}
            />
        </>
    );
}

export default Graph;