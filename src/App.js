import React from 'react';

import { Input, Popconfirm, Form } from 'antd';
import { Tables, Buttons, Modals, Buttond} from './style';
const EditableContext = React.createContext();

const EditableRow = ({ form, index, ...props }) => (
  <EditableContext.Provider value={form}>
    <tr {...props} />
  </EditableContext.Provider>
);

const EditableFormRow = Form.create()(EditableRow);

class EditableCell extends React.Component {
  state = {
    editing: false,
  };



  renderCell = form => {
    this.form = form;
    const { children, dataIndex, record, title } = this.props;
    const { editing } = this.state;
    return editing ? (
      <Form.Item style={{ margin: 0 }}>
        {form.getFieldDecorator(dataIndex, {
          rules: [
            {
              required: true,
              message: `${title} is required.`,
            },
          ],
          initialValue: record[dataIndex],
        })(<Input ref={node => (this.input = node)} onPressEnter={this.save} onBlur={this.save} />)}
      </Form.Item>
    ) : (
      <div
        className="editable-cell-value-wrap"
        style={{ paddingRight: 24 }}
        onClick={this.toggleEdit}
      >
        {children}
      </div>
    );
  };

  render() {
    const {
      editable,
      dataIndex,
      title,
      record,
      index,
      handleSave,
      children,
      ...restProps
    } = this.props;
    return (
      <td {...restProps}>
        {editable ? (
          <EditableContext.Consumer>{this.renderCell}</EditableContext.Consumer>
        ) : (
          children
        )}
      </td>
    );
  }
}

export default class EditTable extends React.Component {
  constructor(props) {
    super(props);
    this.columns = [
      {
        title: '日期',
        dataIndex: 'date'
      },
      {
        title: '姓名',
        dataIndex: 'name'
      },
      {
        title: '地址',
        dataIndex: 'address'
      },
      {
        title: '删除',
        dataIndex: 'operation',
        render: (text, record) =>
          this.state.dataSource.length >= 1 ? (
            <Popconfirm title="Sure to delete?" onConfirm={() => this.handleDelete(record.id)}>
              <Buttond type="danger">Delete</Buttond>
            </Popconfirm>
          ) : null,
      },
    ];
    //  state
    this.state = {
      visible: false,
      dataSource: [],
      count: 2,
    };
  };
  //  获取初始数据
  componentDidMount(){
    this.getMsg()
  }

  //  删除表格方法
  handleDelete = id => {
    fetch(`http://localhost:9090/user/${id}`,{
      method:'DELETE'
    }).then(res=>{
      const dataSource = [...this.state.dataSource];
    this.setState({ dataSource: dataSource.filter(item => item.id !== id) });
    })
  };

  //  弹出层方法
  showModal = () => {
    this.setState({
      visible: true,
    });
  };
// 添加
  handleOk = () => {
    console.log(this)
    let msg = JSON.stringify({
      date:new Date().getTime(),
      name:this.refs.name.value,
      address:this.refs.address.value
      })
    fetch('http://localhost:9090/user/',{
      method: 'POST',
      headers:{
        'Content-Type': 'application/json'
      },
      body:msg
    }).then(res =>{console.log(this.getMsg())})
    .catch(err=>{console.log(err)})
    this.setState({
      visible: false,
    });
  };

  handleCancel = e => {
    this.setState({
      visible: false,
    });
  };
  //  获取数据
  getMsg (){
    fetch('http://localhost:9090/user/')
    .then(response=> response.json())
    .then(res => {
      //  转换日期
      let oldDate;
      let msg= res.map(item=>{
        oldDate=new Date(item['date']);
        item['date']=`${oldDate.toJSON().split("T")[0]} ${oldDate.toTimeString().split(" ")[0]}`
        return item
      })
      this.setState({
        dataSource: msg
      })
    })
  }
//  渲染组件
render() {
    const { dataSource } = this.state;
    const components = {
      body: {
        row: EditableFormRow,
        cell: EditableCell,
      },
    };

    const columns = this.columns.map(col => {
      if (!col.editable) {
        return col;
      }
      return {
        ...col,
        onCell: record => ({
          record,
          editable: col.editable,
          dataIndex: col.dataIndex,
          title: col.title,
          handleSave: this.handleSave,
        }),
      };
    });
    return (
      <div>
          {/* 弹出信息收集框 */}
        <Modals
          title="录入信息"
          destroyOnClose
          visible={this.state.visible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
        >
          <label>姓名：<input ref="name"/></label>
          <label>地址：<input ref="address"/></label>
        </Modals>
        <Tables
          rowKey={(dataSource)=>dataSource.id}
          components={components}
          rowClassName={() => 'editable-row'}
          bordered
          pagination={false}
          dataSource={dataSource}
          columns={columns}
          footer={()=>{return <Buttons  onClick={this.showModal} type="primary" style={{ marginBottom: 16 }}>
          录入信息
        </Buttons>}}
        />
      </div>
    );
  }
}

