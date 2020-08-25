import React, { useState, useEffect } from "react";
import { Card, Button, Table, Input, Form, message } from 'antd';
import { EditOutlined, SaveOutlined, BorderlessTableOutlined } from '@ant-design/icons';
import useLocalStorage from './hooks/useLocalStorage';

const cardRoutinesStyle = {
  minWidth: "500px",
  margin: "5px",
  flex: "1",
  wordBreak: "break-all",
}

// type Routine = Single | Group
// type Group = Category | Separator
// * Single routines have points
// * Group routines have children
const dataSource = [
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
];

const OneShotButton = (props) => {
  const [used, setUsed] = useState(false)
  return <Button disabled={used} onClick={() => {
    setUsed(true);
    props.onClick()
  }} >{props.children}</Button>
}

const _columns = (drawSlip) => [
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
    render: (_, record) => record.children ? null : <OneShotButton onClick={() => drawSlip(record.name, record.points)}>Draw</OneShotButton>,
  },
];

const Routines = ({ drawSlip = (name, points) => { console.log("Not implemented!", name, points) } }) => {
  // mode: table | raw | error
  const [mode, setMode] = useState('table')
  const [form] = Form.useForm();
  const [storedRaw, setStoredRaw] = useLocalStorage('fish-bowl-routines-raw', JSON.stringify(dataSource, null, 2))
  const columns = _columns(drawSlip);

  const validateRaw = raw => {
    try {
      JSON.parse(raw)
      setMode('raw')
    } catch {
      console.log("Invalid JSON!")
      setMode('error')
    }
  }

  // This is a way to 'format' the json when saving
  useEffect(() => {
    if (mode === "raw" || mode === "error")
      form.resetFields(); // since default values are the same as the changed one, this one hack works
  }, [storedRaw])

  const onSubmit = values => {
    [values.raw]
      .map(JSON.parse)
      .map(res => JSON.stringify(res, null, 2))
      .map(setStoredRaw)
      .map(message.success("Routines saved!"))
  }

  const SwitchModeExtra = ({ mode, setMode }) => <>
    <Button
      style={{ margin: "0" }}
      disabled={mode === 'table' || mode === 'error'}
      onClick={() => setMode('table')}
      icon={<BorderlessTableOutlined />} />
    <Button
      style={{ margin: "0" }}
      disabled={mode === 'raw' || mode === 'error'}
      onClick={() => setMode('raw')}
      icon={<EditOutlined />} />
  </>

  return <Card
    title="Routines"
    style={cardRoutinesStyle}
    extra={< SwitchModeExtra mode={mode} setMode={setMode} />}>
    {(() => {
      switch (mode) {
        case 'table':
          return <Table
            tableLayout="fixed"
            expandable={{ indentSize: 4, defaultExpandAllRows: true }}
            columns={columns}
            dataSource={JSON.parse(storedRaw)} />
        case 'raw':
        case 'error':
          return < Form form={form}
            name="routines-raw"
            onFinish={onSubmit}
            initialValues={{ 'raw': storedRaw }
            }>
            {mode === "error" && <p style={{ color: "red" }}> Invalid JSON! </p>}
            <Form.Item name='raw'>
              <Input.TextArea
                autoSize
                onChange={(e) => validateRaw(e.target.value)} />
            </Form.Item>
            {mode === "error" && <p style={{ color: "red" }}> Invalid JSON! </p>}
            <Form.Item style={{ textAlign: 'right' }}>
              <Button
                className="bg-secondary btn-fix"
                disabled={(mode === "table" || mode === "error")}
                htmlType="submit"
                icon={<SaveOutlined />} />
            </Form.Item>
          </Form >
        default:
          break;
      }
    })()}
  </Card >
}

export default Routines;