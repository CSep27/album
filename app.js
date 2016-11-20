/**
 * Created by wtt on 2016/11/19.
 */
"use strict";

const http = require('http'); // 构建http服务模块
const config = require('./config'); // 配置文件模块
const router = require('./router'); // 路由模块

//   /       index.html
//   /album  album.html

http
    .createServer((req, res) => {
        router(req, res);
    })
    .listen(config.port, config.host, ()=> {
        console.log(`server is running at port ${config.port}`);
        console.log(`     Please visit http://${config.host}:${config.port}/`);
    });