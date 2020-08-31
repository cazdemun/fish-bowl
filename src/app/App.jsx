import React, { useState } from "react";
import { Layout, Row, Card, Button, Table, Col, Input, Divider } from 'antd';
import { MenuUnfoldOutlined, MenuFoldOutlined } from '@ant-design/icons';
import Routines from "./Routines.jsx";

import { Machine, assign } from "xstate";
import { useMachine } from "@xstate/react";
import { probability, randomInt, dateToString } from "./Utils.js";

const { Header, Footer, Content } = Layout;

const randomExp = () => {
  if (probability(0.45))
    return 0;
  if (probability(0.95))
    return randomInt(1, 21);
  return 100;
};

const drawSlip = assign((context, event) => {
  // points is the number of slips a routine is worth
  const { name, points } = event.value;
  const date = new Date();
  const newHistory = [...Array(points).keys()]
    .map(_ => ({
      key: randomInt(1, 1000000),
      timestamp: Date.now(),
      date: dateToString(date),
      name: name,
      exp: randomExp(),
    }))

  return points === 0 ? {} : {
    experience: context.experience + newHistory.reduce((acc, x) => acc + x.exp, 0),
    lastSlip: newHistory[points - 1].exp,
    history: context.history.concat(newHistory)
  }
})

const clearContext = assign((context, event) => {
  return {
    experience: 0,
    lastSlip: 0,
    history: []
  }
})

const bowlMachine = Machine(
  {
    id: "bowl",
    context: {
      experience: 0,
      zeroMessage: "Keep up the good work!",
      // type Slip = { key: Number, timestamp: UNIXTimestamp, date: String, name: String , exp: Number }
      // history: List Slip
      lastSlip: 0,
      history: []
    },
    initial: "idle",
    states: {
      idle: {
        on: {
          DRAW: {
            target: "idle",
            actions: ['drawSlip']
          },
          CLEAR: {
            target: "idle",
            actions: ['clearContext']
          }
        }
      }
    }
  },
  {
    actions: { drawSlip, clearContext }
  }
);

const columns = [
  {
    title: 'Date',
    dataIndex: 'date',
    key: 'date',
  },
  {
    title: 'Routine',
    dataIndex: 'name',
    key: 'name',
    render: (_, record) => record.name === "" ? <Input placeholder='Enter routine name' defaultValue={record.name} /> : record.name
  },
  {
    title: 'Experience',
    dataIndex: 'exp',
    key: 'exp',
    render: (_, record) => record.exp === 0 ? "Keep up the Good Work!" : record.exp
  }
]

const Bowl = ({ current, send }) => <Card title="Bowl">
  <div style={{ textAlign: "center" }}>
    <h1>Current exp:</h1>
    <p>{current.context.experience}</p>
    <h1>Last slip:</h1>
    <p>{current.context.lastSlip === 0 ? current.context.zeroMessage : current.context.lastSlip}</p>
    <Row style={{ justifyContent: "center" }}>
      <Button className="bg-secondary btn-fix"
        onClick={() => send('DRAW', { value: { name: "", points: 1 } })}>
        Draw a slip!
      </Button>
      <Button className="bg-secondary btn-fix"
        onClick={() => send('CLEAR')}>
        Clear
      </Button>
    </Row>
  </div>
</Card>

const History = ({ current }) =>
  <Card title="History">
    <Table tableLayout="fixed" pagination={{ defaultPageSize: 9 }} columns={columns} dataSource={current.context.history} />
  </Card>

const App = () => {
  const [current, send] = useMachine(bowlMachine);

  return <Row offset={4 / 2} span={20} >
    <Col span={15}>
      <Routines drawSlip={(name, points) => send('DRAW', { value: { name: name, points: points } })} />
      <Divider />
    </Col>
    <Col span={9} style={{ padding: "0px 10px" }}>
      <Bowl current={current} send={send} />
      <Divider />
      <History current={current} />
      <Divider />
    </Col>
  </Row >
}

const AppLayout = () => {
  const [state, setState] = useState({ collapsed: false });

  return (
    <Layout className="site-layout">
      <Header className="site-layout-background" style={{ padding: 0 }}>
        {React.createElement(state.collapsed ? MenuUnfoldOutlined : MenuFoldOutlined, {
          className: 'trigger',
          onClick: () => setState({ collapsed: !state.collapsed }),
        })}
        <h1 style={{ flex: "1", color: "white", fontWeight: "bold", textAlign: "center" }}>Fish Bowl (Beta)</h1>
      </Header>
      <Content
        style={{
          padding: 24,
          minHeight: 280,
          overflowY: "auto"
        }}
      >
        <App />
      </Content>
      <Footer style={{ textAlign: "right", fontWeight: "bold" }}>Created by cazdemun</Footer>
    </Layout>
  );
}

export default AppLayout;
