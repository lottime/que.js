# 项目介绍

!> 跳过废话，[点击这里](#五-开始我的表演) 直接开始表演。

## 一. 为何重复造轮子

现有的 MVVM 框架已经够多够好了，为什么还要自己折腾呢？原因不一而足，体积小巧如 art-template 则功能太简单，卓越强大如 Vue，为了兼顾各种环境和功能，体积又难免偏大。最让强迫症患者抓狂的是，这些框架们的语法多少有些不尽人意。

我想要的，就是引入一个小小的 JS 文件就能直接开搞，不要 watch 不要 compute 不要 component，越接近原生越好，能快速渲染页面即可。语法上要求所有指令直接绑定在 DOM元 素上，而不是另起一行写循环或判断；methods 和 data 并列，而不是单独建立 methods 对象。最接近需求框架是微信小程序，可惜它无法直接应用于 Web 项目。

为此，我借鉴了许多经典，掉进过大量深坑，耗费了无数昼夜，浓缩出这个大约 8K 的小玩意，其核心源自 Vue 的早期版本（新版本看不懂），故取名为 Que（即 Cute-Vue）。麻雀虽小，至少目前对我来说够用了。

## 二. 实现了哪些功能

Que.js 支持七种常用指令，除 Text 和 Attribute 以外，其他指令的表达式都不需要加`{{}}`花括号。

### 1. Text
```html
<div>{{text}}</div>
```

### 2. Attribute
```html
<div class="item {{title}}" data-index="{{index}}"></div>
```

### 3. Hidden
```html
<div hidden="errcode == 0">message</div>
```

### 4. Model
```html
<input model="username"/>
```

### 5. Event
```html
<button @click="change">test</button>
```

### 6. If
```html
<div if="flag == 1"></div>
```

### 7. Foreach
```html
<ul>
  <li foreach="(item, index) in list">{{index}} - {{item}}</li>
</ul>
```

### 8. Image

为防止 img 标签直接使用 src 属性产生 404 错误，可改用 data-src
```html
<img data-src="{{imagesrc}}"/>
```

## 三. 它是如何运行的

物以类聚，整个 que.js 包含七个独立的类，完全可以分别形成文件。类之间的运行关系如下：
![UML](https://seatwork.github.io/que.js/assets/uml.png)

## 四. 兼容性怎么样

不怎么样。因大量使用 ES6 语法，且仅在 Chrome上 进行过测试，所以，估计，那些不够现代的浏览器无法使用。

## 五. 开始我的表演

### 1. 引入框架
```html
<script src="//cdn.jsdelivr.net/gh/seatwork/que.js/que.min.js"></script>
```

### 2. 编写 HTML
```html
<h1>{{title}}</h1>
<ul>
  <li foreach="(user, index) in users">
    <b>{{index+1}}</b> - <span>{{user.name}}</span>: <span>{{user.age}}</span>
    <span if="user.sex==1">male</span>
    <span else>female</span>
  </li>
</ul>
<button @click="change">change</button>
```

### 3. 编写 Javascript
```js
new Que({
  data: {
    title: 'No Title',
    users: []
  },
  ready() {
    this.users = [
      { name:'lucy', age:23, sex:0 },
      { name:'john', age:28, sex:1 },
      { name:'jack', age:25, sex:1 },
    ]
  },
  change() {
    this.title = 'User List'
    this.users.push({
      name: 'rose', age: 99, sex:0
    })
  }
})
```

## 六. THANKS

* https://github.com/vuejs/vue
* https://github.com/qieguo2016/Vueuv
* https://es6.ruanyifeng.com

## 七. TODO

1. 是否需卸载无用的Watcher对象？
2. 列表渲染由全量更新改为部分更新？
3. 编译和渲染改用流行的虚拟DOM？
