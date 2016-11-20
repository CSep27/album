# 文件结构
+ views 视图文件
  - index.html 首页 可以看到所有相册
  - album.html 相册页面 从首页点击某个相册进入 可以看到所有相片的页面
+ public 静态资源 公开的资源 可以以路径的形式访问
  - css
  - img
  - js  浏览器端用到的js文件
+ node_modules 利用node的npm下载的第三方文件
+ uploads 存储图片列表
+ app.js 主文件 入口模块
+ config.js 配置文件 需要修改的数据都放在配置文件中方便修改
+ router.js 路由模块 根据不同的请求路径进行相应的处理
+ handlers.js 具体处理模块 真正用来处理的代码封装成函数放在这个模块中，在路由模块调用

# 命令
+ npm init 初始化
  - 生成package.json文件 存储项目的相关信息
  - 在package.json文件中，加入一行代码，配置项目入口文件
  - 可以直接通过 npm start 启动项目，其他人查看时不需要找入口文件了
  - 作用原理，输入 npm start 会去配置文件 scripts 对象下面找到 start 属性
  - 对应的属性值 node app.js 就是原本要启动项目时需要输入的命令
  ```
   "scripts": {
        "test": "echo \"Error: no test specified\" && exit 1",
        "start":"node app.js"    // 新增的一行
      },
   ```

# 根据url传给用户不同的页面，后台路由
+ req.url 获取请求路径
+ GET /       index.html
+ GET /album  album.html
+ 静态文件资源，以/node_module/或者/public/开头的

+ 实现方案：
- 1 直接使用if else来判断请求路径再返回页面，
  但是若url后面跟着查询字符串 此时再来判断就不准确了
- 2 引入url模块，先对url进行解析，得到pathname再进行判断
```
const http = require('http'); // 构建http服务模块
const config = require('./config'); // 配置文件模块
const url = require('url'); // 解析处理url模块

http
    .createServer((req, res) => {
        res.end('hello world');
        // 可以解析请求url地址，第二个参数如果传true 得到的query（查询字符串）属性值会以对象的形式显示
        const urlObj = url.parse(req.url, true);
        console.log(urlObj);
        /*Url {
         protocol: null,
         slashes: null,
         auth: null,
         host: null,
         port: null,
         hostname: null,
         hash: null,
         search: '?name=jack',
         query: 'name=jack',
         pathname: '/album',
         path: '/album?name=jack',
         href: '/album?name=jack' }*/
    })
    .listen(config.port,config.host,()=>{
        console.log(`server is running at port ${config.port}`);
        console.log(`     Please visit http://${config.host}:${config.port}/`);
    });
```

# 读取uploads里相册名称渲染到页面上
+ GET /getAlbums

# 添加相册 表单提交相册名称
+ GET /add?albumName=xxx
+ 表单 GET 请求提交
  表单默认会将该表单内部的所有具有 name 属性的 input
  按照 input的 name=input的value 的形式放到 url 地址栏中，发起请求
  http://127.0.0.1:3000/add?albumName=acd