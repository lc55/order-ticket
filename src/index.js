import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter } from 'react-router-dom'
import zhCN from 'antd/lib/locale/zh_CN';
import { ConfigProvider } from 'antd';

import App from './App'

ReactDOM.render(
    <ConfigProvider locale={zhCN}>
        <BrowserRouter>
            <App />
        </BrowserRouter>
    </ConfigProvider>
    ,
    document.getElementById('root'))