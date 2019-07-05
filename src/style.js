import styled from 'styled-components';
import { Table, Button, Modal } from 'antd';

export const Tables =styled(Table)`
  width: 700px;
  margin: 80px auto;
  .ant-table-footer{
    padding:0 !important;
  }
`
export const Buttond =styled(Button)`
  /* display:none ; */
  `
export const Buttons = styled(Button)`
  position:relative;
  margin-top:5px;
  margin-bottom:5px !important;
  left: 50%;
  transform: translate(-50%,0);
  height:50px;
`
export const Modals = styled(Modal)`
  .ant-modal-body{display:flex;
  flex-direction:column;
  input{
    margin-bottom:10px;
    width: 80%;
    height: 30px;
    outline:none;
    border: 1px solid #ccc;
  }
  }
`

