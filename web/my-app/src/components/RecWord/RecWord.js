import React, { useEffect, useState } from 'react';
import { List, Typography, Collapse } from "antd";

const { Panel } = Collapse;
const { Paragraph } = Typography;

const RecWord = ({ }) => {
    return (
        <>
            <Collapse defaultActiveKey={['1']}>
                <Panel header="Rec PaWordper" key="1">
                    <List>
                        <Paragraph>xxx</Paragraph>
                        <Paragraph>xxx</Paragraph>
                        <Paragraph>xxx</Paragraph>
                    </List>
                </Panel>
            </Collapse>
        </>
    );
};

export default RecWord;