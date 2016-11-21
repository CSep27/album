/**
 * Created by wtt on 2016/11/20.
 */
'use strict';
const config = require('./config');
const fs = require('fs');
const path = require('path');
const _ = require('underscore');
const formidable = require('formidable'); // 处理表单文件上传

// 首页
exports.showIndex = (req, res) => {
    fs.readFile('./views/index.html', (err, data) => {
        if (err) {
            throw  err;
        }
        res.end(data);
    });
}

// 相册页面
exports.showAlbums = (req, res) => {
    // 相册名称 a
    const albumName = req.query.albumName;
    // 相册的路径 绝对路径/uploads/a
    const albumPath = path.join(config.uploadDir, albumName);
    // 根据相册路径读出相册中的图片文件
    fs.readdir(albumPath, (err, files)=> {
        if (err) {
            throw err;
        }
        // 遍历图片文件数组files 将每一个图片文件名前加上文件夹名 a/img1 生成新的数组赋值给files
        files = files.map(filename => filename = `${albumName}/${filename}`);
        // 读取相册页面，使用模板引擎将数据替换上去，再返回给前台（后台渲染）
        fs.readFile('./views/album.html', 'utf8', (err, data)=> {
            if (err) {
                throw err;
            }
            // data就是读取到的album.html模板页面
            // 使用模板引擎将数据渲染上去后得到渲染好的页面
            const htmlStr = _.template(data)({
                imgPath: files,
                albumName: albumName
            });
            // 返回给前台
            res.end(htmlStr);
        })
    })
}

// 获取相册目录
exports.getAlbums = (req, res)=> {
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

// 添加相册
exports.addAlbum = (req, res)=> {
    // 得到上传的相册名
    const albumName = req.query.albumName;

    // 如果相册名为空，直接返回
    if (albumName.trim().length === 0) {
        res.writeHead(200, {
            'Content-type': 'text/plain;charset=utf-8'
        })
        return res.end('请输入完整的相册名');
    }

    // 读取文件目录，判断文件名是否存在
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
        // 判断相册名称是否存在
        if (albums.find(item => item === albumName)) {
            return res.end('albumname already exists');
        }
        // 创建新相册
        fs.mkdir(path.join(config.uploadDir, albumName), (err) => {
            if (err) {
                throw err;
            }
            // http协议中，302状态码表示重定向
            // 当浏览器看到这个状态吗时，会自动去响应报文中找Location
            // 找到Location，浏览器找到该地址重新发起请求
            res.writeHead('302', {
                'location': '/'
            })
            res.end();
        })
    })
}

// 上传图片
/**
 * POST /album?albumName=xxx
 * body: { image: Object }  注意：这里的 body 请求体就是文件对象
 */
exports.upload = (req,res) =>{
    // 获取查询字符串中的相册名称
    const albumName = req.query.albumName;

    // formidable 文件处理包
    const form = new formidable.IncomingForm();

    // 配置 formidable 接收文件的保存路径
    form.uploadDir = path.join(config.uploadDir,albumName);

    // 默认 formidable 对于上传的文件会改名并且不包含扩展名
    // 下面这个代码可以让它继续保持扩展名
    form.keepExtensions = true;

    // 限制用户上传文件的大小，单位是 字节
    form.maxFieldsSize = 5 * 1024 * 1024

    form.parse(req,(err,fields,files)=>{
        if(err){
            throw err;
        }
        // fields 就是 POST 表单中普通数据
        // 默认 formidable 将用户上传的文件接收保存到了 用户的临时目录中了
        // 中文目录名会编码传输
        // encodeURI(albumName) 对文件名进行编码
        res.writeHead(302, {
            'Location': `/album?albumName=${encodeURI(albumName)}`
        })
        res.end()
    })

}

// 其他请求
exports.handle404 = (req, res) => {
    res.end('404 Not Found.');
}
