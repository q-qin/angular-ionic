# 基于gulp+Ionic+angularjs1.x写的webapp


### 安装

项目地址：（`git clone`）

```shell
git clone https://github.com/q-qin/github.git
```

通过`npm`安装本地服务第三方依赖模块(需要已安装[Node.js](https://nodejs.org/))

```
npm install
```
```
npm install -g gulp
```

启动服务(http://localhost:8080)

```
gulp server
```

发布代码
```
gulp
```

### 开发

### 目录结构
<pre>
.
├── README.md           
├── gulpfile.js        // 构建服务和gulp配置
├── package.json       // 项目配置文件
├── apps               // 生产目录
│   ├── css            // css
│   ├── html	       // 静态html
│   ├── images         // 图片
│   ├── lib            // 导入库
│   ├── scripts        // js逻辑
│   ├── templates      // 页面
│   └── index.html     // 入口页
</pre>


