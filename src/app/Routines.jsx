import React, { useState, useEffect } from "react";
import { Card, Button, Table, Input, Form, message } from 'antd';
import { EditOutlined, SaveOutlined, BorderlessTableOutlined } from '@ant-design/icons';

import { Machine, assign } from "xstate";
import { useMachine } from "@xstate/react";
import { tryCatchPromise } from "./Utils";

import DefaultRoutines from "../routines.json"

const loadRoutines = assign({
  routines: () => {
    const routines = localStorage.getItem('fish-bowl-routines-raw');
    return routines ? JSON.parse(routines) : DefaultRoutines;
  }
})

const saveRoutines = assign({
  routines: (_, event) => {
    const routines = JSON.parse(event.value);
    localStorage.setItem('fish-bowl-routines-raw', JSON.stringify(routines, null, 2)) // stringify again for formatting purposes
    message.success("Routines saved!");
    return routines;
  }
})

const routinesMachine = Machine(
  {
    id: "routines",
    context: {
      // type Group = { key: String, name: String, children: Boolean }
      // type Routine = { key: String, name: String, points: Boolean } 
      // points is the number of slips a routine is worth
      // type Item = Routine | Group
      // routines: List Item
      routines: []
    },
    initial: "start",
    states: {
      start: {
        on: {
          '': {
            target: "idle",
            actions: ["loadRoutines"]
          }
        }
      },
      idle: {
        on: {
          EDIT: {
            target: "edit"
          },
        }
      },
      edit: {
        on: {
          VISUALIZE: {
            target: "idle"
          },
          SAVE: {
            target: "idle",
            actions: ["saveRoutines"]
          }
        }
      }
    }
  },
  {
    actions: { loadRoutines, saveRoutines }
  }
);

const OneShotButton = ({ children, onClick, ...props }) => {
  const [used, setUsed] = useState(false)
  return <Button
    disabled={used}
    onClick={() => { setUsed(true); onClick(); }} {...props}>
    {children}
  </Button>
}

const _columns = (drawSlip) => [
  {
    title: 'Name',
    dataIndex: 'name',
    key: 'name',
    colSpan: 3,
    render: (value) => ({
      children: value,
      props: { colSpan: 3 }
    })
  },
  {
    title: 'Points',
    dataIndex: 'points',
    key: 'points',
    colSpan: 2,
    render: (value) => ({
      children: value,
      props: { colSpan: 2, align: "center" }
    })
  },
  {
    title: '',
    dataIndex: 'draw',
    key: 'draw',
    render: (_, record) => ({
      children: record.children ? "" : <OneShotButton onClick={() => drawSlip(record.name, record.points)}>Draw</OneShotButton>,
      props: { align: "center" }
    })
  },
];

const SwitchState = ({ current, send }) => <>
  <Button
    style={{ margin: "0" }}
    disabled={current.matches('idle')}
    onClick={() => send('VISUALIZE')}
    icon={<BorderlessTableOutlined />} />
  <Button
    style={{ margin: "0" }}
    disabled={current.matches('edit')}
    onClick={() => send('EDIT')}
    icon={<EditOutlined />} />
</>

const SaveButton = () =>
  <Form.Item style={{ textAlign: 'right' }}>
    <Button
      className="bg-secondary btn-fix"
      htmlType="submit"
      icon={<SaveOutlined />}>
      Save
  </Button>
  </Form.Item>

const Routines = ({ drawSlip = (name, points) => { console.log("Not implemented!", name, points) } }) => {
  const [current, send] = useMachine(routinesMachine);
  const [form] = Form.useForm();
  const columns = _columns(drawSlip);

  // Forces the formatted string to reload
  useEffect(() => {
    if (current.matches('edit'))
      form.resetFields();
  }, [current.value, current, form])

  // Checks if data in TextArea is a valid JSON array
  const isDataAValidJsonArray = (_, value) => {
    if (value === "")
      return Promise.reject()
    return tryCatchPromise("Invalid JSON!", () => JSON.parse(value))
  }

  return <Card title="Routines" extra={<SwitchState current={current} send={send} />}>
    {(() => {
      switch (current.value) {
        case 'idle':
          return <Table
            tableLayout="fixed"
            expandable={{ indentSize: 4, defaultExpandAllRows: true }}
            columns={columns}
            dataSource={current.context.routines} />
        case 'edit':
          return < Form name="routines"
            form={form}
            initialValues={{ 'data': JSON.stringify(current.context.routines, null, 2) }}
            onFinish={(values) => send('SAVE', { value: values.data })}>
            <SaveButton />
            <Form.Item name='data'
              rules={[
                {
                  required: true,
                  message: 'Please input an array of objects in JSON format!'
                },
                { validator: isDataAValidJsonArray }
              ]}>
              <Input.TextArea autoSize />
            </Form.Item>
            <SaveButton />
          </Form >
        default:
          break;
      }
    })()}
  </Card >
}

export default Routines;