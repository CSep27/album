/**
 * Created by wtt on 2016/11/20.
 */
'use strict';
const config = require('./config');
const fs = require('fs');
const path = require('path');

// 首页
exports.showIndex = (req,res) =>{
    fs.readFile('./views/index.html', (err, data) => {
        if (err) {
            throw  err;
        }
        res.end(data);
    });
}

// 相册页面
exports.showAlbums = (req,res) =>{
    fs.readFile('./views/album.html', (err, data)=> {
        if (err) {
            throw  err;
        }
        res.end(data);
    });
}

// 获取相册目录
exports.getAlbums = (req,res)=>{
    // 读取文件目录
    fs.readdir(config.uploadDir, (err, files)=> {
        if (err) {
            throw err;
        }
        // 存放相册文件夹
        let albums = [];
        // files是一个数组，可能包含文件，也可能包含文件夹
        files.forEach(item => {
            // 当前文件路径
            const currentPath = path.join(config.uploadDir, item)
            // 判断当前文件是否是文件夹
            if (fs.statSync(currentPath).isDirectory()) {
                // 是 就放进相册文件夹数组中
                albums.push(item);
            }
        })
        // 设置返回值的类型，文件目录可能是中文
        res.writeHead(200, {
            'Content-type': 'text/plain;charset=utf-8'
        })
        // 将数组以对象的形式转化成json格式字符串，返回给客户端
        // JSON.stringify()可以直接传数组，但是最好给数组取个名字，以对象的形式传入
        res.end(JSON.stringify({
            albums // es6中，当对象的键和值名称相同时，可以只写一个
        }))
    })
}

// 其他请求
exports.handle404 = (req,res) =>{
    res.end('404 Not Found.');
}