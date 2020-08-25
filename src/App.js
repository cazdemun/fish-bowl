import React, { useState } from "react";
import { Layout, Row, Card, Button, Table, Col, Input } from 'antd';
import {
  MenuUnfoldOutlined,
  MenuFoldOutlined,
} from '@ant-design/icons';
import Routines from "./Routines";

const { Header, Footer, Content } = Layout;

const probability = n => !!n && Math.random() <= n;

function randomInt(mi, ma) {
  const min = Math.ceil(mi);
  const max = Math.floor(ma);
  return Math.floor(Math.random() * (max - min)) + min;
}

// maybe exp
const drawSlip = () =>
  new Promise((resolve, reject) => {
    if (probability(0.45)) {
      resolve(0);
    }
    if (probability(0.95)) {
      resolve(randomInt(1, 21));
    } else {
      resolve(100);
    }
  });

const createRegister = (points, name = "") =>
  new Promise((resolve, reject) => {
    const date = new Date();
    resolve({
      key: Math.random(),
      point: points === 0 ? 'Keep up the good work!' : points,
      timestamp: Date.now(),
      date: dateToString(date),
      name: name
    });
  });

const dateToString = d => {
  const ye = new Intl.DateTimeFormat("en", { year: "numeric" }).format(d);
  const mo = new Intl.DateTimeFormat("en", { month: "2-digit" }).format(d);
  const da = new Intl.DateTimeFormat("en", { day: "2-digit" }).format(d);

  const h = new Intl.DateTimeFormat("en", {
    hour: "numeric",
    minute: "numeric"
  }).format(d);

  return `${da}-${mo}-${ye} ${h}`;
};

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
    render: (_, record) => <Input placeholder='Enter routine name' defaultValue={record.name} />
  },
  {
    title: 'Points',
    dataIndex: 'point',
    key: 'point',
  }
]

const cardStyle = {
  minWidth: "500px",
  margin: "5px",
  flex: "1",
  wordBreak: "break-all",
  textAlign: "center"
}

const AppContent = () => {
  const [exp, setExp] = useState(0);
  const [lastSlip, setLastSlip] = useState("Keep up the good work!");
  const [history, setHistory] = useState([]);

  return <Col offset={4 / 2} span={20} style={{ width: "100%", padding: "5px" }}>
    <Card title="Bowl" style={cardStyle}>
      <h1>Current exp:</h1>
      <p>{exp}</p>
      <h1>Last slip:</h1>
      <p>{lastSlip}</p>
      <Row style={{ justifyContent: "center" }}>
        <Button
          className="bg-secondary mx-3 mb-5 mt-3 px-5 py-2 font-bold"
          onClick={() =>
            drawSlip()
              .then(maybePoints => {
                if (maybePoints === 0) {
                  setLastSlip("Keep up the good work!");
                } else {
                  setLastSlip(maybePoints);
                  setExp(exp + maybePoints);
                }
                return createRegister(maybePoints);
              })
              .then(newRegister => {
                setHistory([...history, newRegister]);
              })
              .catch(err => console.log(err))
          }
        >
          Draw a slip!
          </Button>
        <Button
          className="bg-secondary mx-3 mb-5 mt-3 px-5 py-2 font-bold"
          onClick={() => {
            setHistory([]);
            setExp(0);
            setLastSlip("Keep up the good work!");
          }}
        >
          Clear
          </Button>
      </Row>
    </Card>
    <Routines drawSlip={(name, points) => {
      [...Array(points).keys()]
        .map(_ =>
          drawSlip()
            .then(maybePoints => {
              if (maybePoints === 0) {
                setLastSlip("Keep up the good work!");
              } else {
                setLastSlip(maybePoints);
                setExp(exp + maybePoints);
              }
              return createRegister(maybePoints, name);
            })
            .then(newRegister => {
              setHistory([...history, newRegister]);
            })
            .catch(err => console.log(err)));
    }} />
    <Card title="History" style={cardStyle}>
      <Table tableLayout="fixed" pagination={{ defaultPageSize: 5 }} columns={columns} dataSource={history} />
    </Card>
  </Col>
}

const App = () => {
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
        <AppContent />
      </Content>
      <Footer style={{ textAlign: "right", fontWeight: "bold" }}>Created by cazdemun</Footer>
    </Layout>
  );
}

export default App;
