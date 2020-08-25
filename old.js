import React, { useState } from "react";
import { Card, Button, Table } from 'antd';
import { EditOutlined, SaveOutlined, BorderlessTableOutlined } from '@ant-design/icons';
import useLocalStorage from './hooks/useLocalStorage';
import TextArea from 'antd/lib/input/TextArea';

const cardStyle = {
  minWidth: "500px",
  maxWidth: "600px",
  margin: "5px",
  flex: "1",
  wordBreak: "break-all",
}

// type Routine = Single | Group
// * Single routines have points
// * Group routines have children
const defaultMorningRoutine = JSON.stringify([
  {
    key: "Meditar",
    name: "Meditar",
    points: 1
  },
  {
    key: "Lavar",
    name: "Lavar",
    children: [
      {
        key: "Lavar cara",
        name: "Lavar cara",
        points: 1
      },
      {
        key: "Lavar Pelo",
        name: "Lavar Pelo",
        points: 1
      }
    ]
  },
  {
    key: "Ejercicio",
    name: "Ejercicio",
    points: 1
  },
  {
    key: "Trabajo",
    name: "Trabajo",
    points: 3
  }
], null, 2);

const columns = [
  {
    title: 'Name',
    dataIndex: 'name',
    key: 'name',
  },
  {
    title: 'Points',
    dataIndex: 'points',
    key: 'points',
  },
  {
    title: '',
    dataIndex: 'draw',
    key: 'draw',
    render: () => <Button>Draw</Button>,
  },
];

const Routines = ({ drawSlip }) => {
  // mode: table | raw
  const [mode, setMode] = useState('table')
  // use localstorage
  const [storedRaw, setStoredRaw] = useLocalStorage('fish-bowl-routines-raw', defaultMorningRoutine)
  const [validRaw, setValidRaw] = useState(true)

  const validateRaw = (raw) => {
    try {
      JSON.parse(raw);
      setValidRaw(true)
    } catch (_) {
      console.log("Invalid JSON!")
      setValidRaw(false)
    }
  }

  return <Card
    title="Routines"
    style={cardStyle}
    extra={<>
      <Button
        style={{ margin: "0" }}
        disabled={mode === 'table' || !validRaw}
        onClick={() => setMode('table')}
        icon={<BorderlessTableOutlined />} />
      <Button
        style={{ margin: "0" }}
        disabled={mode === 'raw'}
        onClick={() => setMode('raw')}
        icon={<EditOutlined />} />
    </>}>
    {mode === "raw" && <TextArea autoSize
      defaultValue={storedRaw}
      onChange={(e) => validateRaw(e.target.value)} />}
    {(mode === "raw" && validRaw === false) && <p style={{ marginTop: "8px", marginBottom: "0px", color: "red", width: "100%", textAlign: "center" }}>Invalid routine schema, <a>here's an example!</a></p>}
    {mode === "raw" && <div style={{ width: "100%", display: "flex", justifyContent: "flex-end" }}>
      <Button
        className="bg-secondary btn-fix"
        disabled={(mode === "raw" && validRaw === false)}
        htmlType="submit"
        icon={<SaveOutlined />} />
    </div>}
    {(validRaw === true && mode === "table") && <Table dataSource={JSON.parse(storedRaw)} columns={columns} />}
  </Card>

}

export default Routines;