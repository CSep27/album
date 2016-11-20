/**
 * Created by wtt on 2016/11/20.
 */
"use strict";
const config = require('./config'); // 配置文件模块
const fs = require('fs'); // 文件处理模块
const url = require('url'); // 解析处理url模块
const path = require('path'); // 路径处理模块
const handlers = require('./handlers'); //

module.exports = (req, res) => {
    const urlObj = url.parse(req.url, true); // 解析请求url
    const pathname = urlObj.pathname; //  得到请求地址
    const query = urlObj.query; // 得到查询字符串

    // 处理静态资源请求
    if (pathname.startsWith('/node_modules/') || pathname.startsWith('/public/')) {
        fs.readFile(`.${pathname}`, (err, data)=> {
            if (err) {
                throw err;
            }
            res.end(data);
        })
    }
    // 根据不同的请求路径做不同的响应
    else if (pathname === '/') {
        handlers.showIndex(req, res);
    } else if (pathname === '/album') {
        handlers.showAlbums(req, res);
    } else if (pathname === '/getAlbums') {
        handlers.getAlbums(req, res);
    } else {
        handlers.handle404(req, res);
    }
}