/**
 * Created by wtt on 2016/11/19.
 */
const path = require('path'); // 路径处理模块

module.exports = {
    port:3000,
    host:'127.0.0.1',
    uploadDir:path.join(__dirname,'uploads') // __dirname 当前文件所属目录的绝对路径
};