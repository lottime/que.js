/**
 * --------------------------------------------------------
 * Que - A Simple Javascript MVVM Framework (in ES6)
 * Version: 2.2.0
 * Author: Aichen
 * References: https://github.com/vuejs/vue
 *             https://github.com/qieguo2016/Vueuv
 *             https://es6.ruanyifeng.com
 * Copyright (c) 2019 Cloudseat.net
 * --------------------------------------------------------
 */

class Que {

  /**
   * Que main class
   * Proxy, observe, compile and execute 'ready' method in options
   */
  constructor(options = {}) {
    const proxy = this._proxy(options)
    new Observer(options.data)

    document.addEventListener('DOMContentLoaded', function() {
      new Compiler(document.body, proxy)
      proxy.ready && proxy.ready(decodeURI(location.pathname), location.search.slice(1))
    })
    document.addEventListener('deviceready', () => {
      proxy.onDeviceReady && proxy.onDeviceReady()
    }, false)
  }

  /**
   * Proxy all methods of 'options' to 'options.data'
   */
  _proxy(options) {
    Object.keys(options).forEach(key => {
      if (typeof options[key] === 'function') {
        options.data[key] = options[key]
      }
    })
    return options.data
  }

}

/* --------------------------------------------------------
 * Static http request functions
 * ----------------------------------------------------- */

Que.get = function(options) {
  options.method = 'GET'
  return this.request(options)
}

Que.post = function(options) {
  options.method = 'POST'
  return this.request(options)
}

Que.put = function(options) {
  options.method = 'PUT'
  return this.request(options)
}

Que.delete = function(options) {
  options.method = 'DELETE'
  return this.request(options)
}

Que.request = function(options) {
  const config = {
    url: './',
    data: null,
    method: 'GET',
    async: true,
    withCredentials: false,
    contentType: 'application/json',
    timeout: 60 * 1000,
    headers: {},
    onabort: function() {},
    ontimeout: function() {},
    success: function() {},
    fail: function() {},
  }

  // Assign options
  const xhr = new XMLHttpRequest()
  Object.assign(config, options)

  // Open request
  xhr.open(config.method, config.url, config.async)
  xhr.timeout = config.timeout
  xhr.withCredentials = config.withCredentials
  xhr.onerror = config.fail

  // Set request headers
  xhr.setRequestHeader('Content-Type', config.contentType)
  for (let key in config.headers) {
    if (config.headers.hasOwnProperty(key)) {
      xhr.setRequestHeader(key, config.headers[key])
    }
  }

  // Handle response
  xhr.onload = function() {
    let res = Que.parseJson(this.response)
    if (this.status === 200) {
      config.success(res)
    } else {
      config.fail(res, this.status)
    }
  }

  // Send request
  if (Que.isJson(config.data)) {
    config.data = JSON.stringify(config.data)
  }
  xhr.send(config.data)
}

Que.isJson = function(obj) {
  return typeof obj == 'object' && Object.prototype.toString.call(obj).toLowerCase() == '[object object]' && !obj.length
}

Que.parseJson = function(text) {
  try {
    return JSON.parse(text)
  } catch(e) {
    return text
  }
}

Que.customEvents = {}
Que.directive = function(event, binding) {
  Que.customEvents[event] = binding
}

/* --------------------------------------------------------
 * Observer Class
 * ----------------------------------------------------- */

class Observer {

  constructor(data) {
    this.observe(data)
  }

  /**
   * Observe all properties in data
   */
  observe(data) {
    if (data && typeof data === 'object') {
      Object.keys(data).forEach(key => {
        this.observeObject(data, key, data[key])
      })
    }
  }

  /**
   * Observe property value's change
   * Add watcher when 'get' and notify watcher when 'set'
   */
  observeObject(data, key, value) {
    let dep = new Dep()
    this.observeRecursive(value, dep)

    Object.defineProperty(data, key, {
      enumerable: true,
      configurable: false,

      get: () => {
        Dep.target && dep.addSub(Dep.target)
        return value
      },
      set: newValue => {
        if (value !== newValue) {
          value = newValue
          // BUG: The follow line code will cause a problem when 'this.xxx = this.yyy'
          // You must use this: this.xxx = Object.create(this.yyy)
          this.observeRecursive(value, dep)
          dep.notify()
        }
      },
    })
  }

  /**
   * Observe object/array recursive
   */
  observeRecursive(value, dep) {
    if (Array.isArray(value)) {
      value.__proto__ = this.definePrototype(dep)
      value.forEach(item => this.observe(item))
    } else {
      this.observe(value)
    }
  }

  /**
   * Rewrite array's prototype methods
   */
  definePrototype(dep) {
    const arrayPrototype = Object.create(Array.prototype)
    const arrayMethods = ['push', 'pop', 'shift', 'unshift', 'splice', 'sort', 'reverse']
    const self = this

    arrayMethods.forEach(method => {
      let original = arrayPrototype[method]

      Object.defineProperty(arrayPrototype, method, {
        enumerable: true,
        writable: true,
        configurable: true,

        value: function() {
          const result = original.apply(this, arguments)
          let inserted = null

          switch (method) {
            case 'push':
            case 'unshift':
              inserted = arguments
              break
            case 'splice':
              if (arguments.length > 2) {
                inserted = Array.prototype.slice.call(arguments, 2)
              }
              break
          }
          if (inserted) {
            self.observeRecursive(inserted, dep)
          }

          dep.notify({
            method,
            args: arguments
          })
          return result
        }
      })
    })
    return arrayPrototype
  }

}

/* --------------------------------------------------------
 * Dependence Class
 * ----------------------------------------------------- */

class Dep {

  constructor() {
    this.subs = {}
  }

  addSub(target) {
    if (!this.subs[target.id]) {
      this.subs[target.id] = target
    }
  }

  removeSub(target) {
    delete this.subs[target.id]
  }

  /**
   * options parameter only for array changed
   * @param options = {method, args}
   */
  notify(options) {
    Object.keys(this.subs).forEach(id => {
      this.subs[id].update(options)
    })
  }

}

/* --------------------------------------------------------
 * Watcher Class
 * ----------------------------------------------------- */

class Watcher {

  /**
   * @param scope Data scope for compute expression
   * @param expr Expression from Directive
   * @param callback Function for notify
   */
  constructor(scope, expr, callback) {
    this.scope = scope
    this.expr = expr
    this.callback = callback
    this.id = ++Watcher.id

    this.compute = Parser.buildFunction(expr)
    this.update()
  }

  update(options) {
    let value = this.get()
    value = value == undefined ? '' : value
    this.callback(value, options)
  }

  /**
   * 'Get' method will trigger 'Observer' listening
   * then add 'Watcher' instance to 'Dep'
   */
  get() {
    Dep.target = this
    let value = this.compute(this.scope)
    Dep.target = null
    return value
  }

}

Watcher.id = 0

/* --------------------------------------------------------
 * Directive Class
 * ----------------------------------------------------- */

class Directive {

  constructor(node, scope, options) {
    this.node = node
    this.scope = scope
    Object.assign(this, options)

    // Generates watcher observe based on compiled DOM node
    this.init && this.init()
    if (this.expr && this.update) {
      this.watcher = new Watcher(this.scope, this.expr, (v, o) => this.update(v, o))
    }
  }

  /**
   * Create anchor of node position
   */
  createAnchor(node) {
    let anchor = document.createTextNode('')
    node = node || this.node
    node.replace(anchor)
    return anchor
  }

}

/* --------------------------------------------------------
 * Text Directive Object
 * ----------------------------------------------------- */

Directive.text = {
  update(value) {
    this.node.textContent = value
  }
}

/* --------------------------------------------------------
 * Attribute Directive Object
 * ----------------------------------------------------- */

Directive.attr = {
  update(value) {
    if (this.name == 'data-src') {
      this.node.removeAttribute('data-src')
      this.node.setAttribute('src', value)
    } else {
      this.node.setAttribute(this.name, value)
    }
  }
}

/* --------------------------------------------------------
 * Hidden Directive Object
 * ----------------------------------------------------- */

Directive.hidden = {
  update(value) {
    if (value) {
      this.node.removeAttribute(this.name)
    } else {
      this.node.setAttribute(this.name, !value)
    }
  }
}

/* --------------------------------------------------------
 * Model Directive Object
 * Only supports input type="text" and textarea
 * ----------------------------------------------------- */

Directive.model = {
  init() {
    this.node.removeAttribute(this.name)
    this.node.addEventListener('input', e => {
      // 由于eval语句双向设置value时会再次触发update方法更新文本框内容
      // 造成光标自动跳到末尾，故增加标志位用于判断更新来源
      this.node.isInputing = true
      // CAN NOT ASSIGN BY '[]' MODE
      // this.scope[this.expr] = e.currentTarget.value
      eval('this.scope.' + this.expr + '=e.currentTarget.value')
    })
    this.node.addEventListener('blur', e => {
      this.node.isInputing = false
    })
  },

  update(value) {
    // 如果由input监听触发则不重复更新文本框内容（input本身即由用户手动更新）
    if (!this.node.isInputing)
    this.node.value = value
  }
}

/* --------------------------------------------------------
 * Event Directive Object
 * ----------------------------------------------------- */

Directive.event = {
  init() {
    const method = this.scope[this.fn]
    this.node.removeAttribute('@' + this.name)

    if (typeof method === 'function') {
      const binding = Que.customEvents[this.name]
      if (binding) {
        binding(this.node, e => {
          e.currentTarget = this.node
          method.call(this.scope, e)
        })
      } else {
        this.node.addEventListener(this.name, e => {
          method.call(this.scope, e)
        })
      }
    }
  }
}

/* --------------------------------------------------------
 * If Directive Object
 * ----------------------------------------------------- */

Directive.if = {

  init() {
    // Pre binding 'else' node to current directive if exists
    let nextNode = this.node.nextElementSibling
    if (nextNode && nextNode.hasAttribute('else')) {
      nextNode.removeAttribute('else')
      this.elseNode = nextNode
      this.elseAnchor = this.createAnchor(nextNode)
      this.compile(nextNode, this.scope)
    }
    this.anchor = this.createAnchor()
    this.compile(this.node, this.scope)
  },

  update(value) {
    if (value) {
      // MUST BE USE 'REPLACE' INSTEAD OF 'INSERT'
      // OTHERWISE WILL CAUSE ARRAY LENGTH CHANGE WHEN COMPILING
      this.anchor.replace(this.node)
      if (this.elseNode) this.elseNode.replace(this.elseAnchor)
    } else {
      this.node.replace(this.anchor)
      if (this.elseNode) this.elseAnchor.replace(this.elseNode)
    }
  },

}

/* --------------------------------------------------------
 * Foreach Directive Object
 * ----------------------------------------------------- */

Directive.foreach = {

  init() {
    this.anchor = this.createAnchor()
    this.itemNodes = []

    // Expression as 'item in/of list'
    const regForeach = /(.+) (?:in|of) (.+)/
    const regIterator = /\((.+),(.+)\)/
    const inMatch = this.expr.match(regForeach)

    if (inMatch) {
      this.expr = inMatch[2]
      this.alias = inMatch[1].trim()

      // Expression as '(item, index) in/of list'
      let itMatch = inMatch[1].match(regIterator)
      if (itMatch) {
        this.alias = itMatch[1].trim()
        this.index = itMatch[2].trim()
      }
    }
  },

  update(array, options) {
    // Clear all item nodes
    let node = null
    while (node = this.itemNodes.pop()) {
      node.remove()
    }

    // Update all nodes totally
    array && array.forEach((value, i) => {
      let scope = Object.create(this.scope)
      scope[this.alias] = value
      if (this.index) scope[this.index] = i

      let cloneNode = this.node.cloneNode(true)
      this.anchor.insert(cloneNode)
      this.itemNodes.push(cloneNode)
      this.compile(cloneNode, scope)
    })
  }

}

/* --------------------------------------------------------
 * Compiler Class
 * ----------------------------------------------------- */

class Compiler {
  constructor(el, scope) {
    const fragment = Compiler.createFragment(el)
    this.compile(fragment, scope)
    el.appendChild(fragment)
  }

  createDirective(node, scope, options) {
    const drctHandler = Directive[options.type]
    if (drctHandler) {
      Object.assign(options, drctHandler)
      options.compile = this.compile.bind(this)
      new Directive(node, scope, options)
    }
  }

  compile(node, scope) {
    if (node.nodeType === 1 && node.tagName != 'SCRIPT') {
      this.compileElementNode(node, scope)
    } else
    if (node.nodeType === 11) {
      this.compileElementNodes(node, scope)
    } else
    if (node.nodeType === 3) {
      this.compileTextNode(node, scope)
    }
  }

  compileElementNode(node, scope) {
    // Skip compile 'for' or 'if' directive
    let drct = Compiler.checkTerminalDirective(node)
    if (drct) {
      node.removeAttribute(drct.type)
      this.createDirective(node, scope, drct)
      return
    }

    // Compile attributes with directive
    const attrs = [].slice.call(node.attributes)
    attrs.forEach(attr => {
      drct = Compiler.checkDirective(attr)
      if (drct) this.createDirective(node, scope, drct)
    })

    // Compile child nodes recursively
    this.compileElementNodes(node, scope)
  }

  compileElementNodes(node, scope) {
    const children = node.childNodes
    if (children && children.length) {
      children.forEach(child => this.compile(child, scope))
    }
  }

  compileTextNode(node, scope) {
    const text = node.wholeText.trim()
    if (text) {
      const expr = Parser.parseMustache(text)
      if (expr) {
        this.createDirective(node, scope, {
          type: 'text',
          expr
        })
      }
    }
  }

  static createFragment(el) {
    const fragment = document.createDocumentFragment()
    let child = null
    while (child = el.firstChild) {
      if (this.isIgnorableNode(child)) {
        el.removeChild(child)
      } else {
        fragment.appendChild(child)
      }
    }
    return fragment
  }

  static isIgnorableNode(el) {
    const regIgnorable = /^[\t\n\r]+/
    return (el.nodeType == 8) || (el.nodeType == 3 && regIgnorable.test(el.textContent))
  }

  static checkTerminalDirective(node) {
    const terminals = ['foreach', 'if']
    let drct = null
    terminals.some(t => {
      if (node.hasAttribute(t)) {
        return drct = {
          type: t,
          expr: node.getAttribute(t),
        }
      }
    })
    return drct
  }

  static checkDirective(attr) {
    if (attr.name.indexOf('@') === 0) {
      return {
        type: 'event',
        name: attr.name.substring(1),
        fn: attr.value
      }
    }
    const matches = attr.name.match(/(hidden|model)/)
    if (matches) {
      return {
        type: matches[1],
        name: attr.name,
        expr: attr.value,
      }
    }
    const expr = Parser.parseMustache(attr.value)
    if (expr) {
      return {
        type: 'attr',
        name: attr.name,
        expr: expr,
      }
    }
  }

}

/* --------------------------------------------------------
 * Expression Parser Class
 * ----------------------------------------------------- */

class Parser {

  /**
   * Parse expression with mustache syntax to constant and variable formula:
   * 'a {{b+"text"}} c {{d+Math.PI}}' => '"a " + b + "text" + " c" + d + Math.PI'
   */
  static parseMustache(text) {
    const matches = text.match(this.regMustache)
    if (matches) {
      const tokens = []
      const pieces = text.split(this.regMustache)

      pieces.forEach(piece => {
        if (matches.indexOf('{{' + piece + '}}') > -1) {
          tokens.push('(' + piece + ')')
        } else if (piece) {
          tokens.push('"' + piece + '"')
        }
      })
      return tokens.join('+')
    }
  }

  static compute(expr, scope) {
    return this.buildFunction(expr)(scope)
  }

  /**
   * Parse expression and return executable function
   * For complex expression, it seems 'eval' more simpler,
   * but strict mode not Supported 'with' keyword
   */
  static buildFunction(expr) {
    let fn = this.cache[expr]
    if (!fn) {
      let body = this.isSimple(expr) ? 'vm.' + expr : this.parseComplex(expr)
      fn = this.cache[expr] = new Function('vm', 'return ' + body)
    }
    return fn
  }

  /**
   * Simple expression like 'a.b', it can parse to 'scope.a.b'
   */
  static isSimple(expr) {
    return this.regSimple.test(expr) && !this.regKeyword.test(expr)
  }

  /**
   * Complex expression like 'a.b + a.c', it will parse to 'scope.a.b + scope.a.c'
   */
  static parseComplex(expr) {
    const strCache = []

    // Extract the characters in quotation and replace them with ordinal numbers
    // and cache them
    expr = expr.replace(this.regQuote, $ => {
      let i = strCache.length
      strCache[i] = $
      return '"' + i + '"'
    })

    // Clear blank characters
    expr = expr.replace(/\s/g, '')

    // Extract words and replace them with variable forms
    expr = (' ' + expr).replace(this.regIdent, $ => {
      let begin = $.charAt(0)
      let path = $.slice(1)
      return this.regKeyword.test(path) ? $ : begin + 'vm.' + path
    })

    // Replace the characters in quotation with ordinal numbers
    expr = expr.replace(/"(\d+)"/g, ($, i) => {
      return strCache[i]
    })
    return expr
  }
}

Parser.cache = {} // Cache is necessary!
Parser.regMustache = /\{\{(.+?)\}\}/g
Parser.regSimple = /^[A-Za-z_$][\w$]*(?:\.[A-Za-z_$][\w$]*|\['.*?'\]|\[".*?"\]|\[\d+\]|\[[A-Za-z_$][\w$]*\])*$/
Parser.regKeyword = /^(?:true|false|null|undefined|Infinity|NaN|Math)$/
Parser.regQuote = /'(?:[^'\\]|\\.)*'|"(?:[^"\\]|\\.)*"/g
Parser.regIdent = /[^\w$\.](?:[A-Za-z_$][\w$]*)/g

/* ------------------------------------------------------
 * DOM Elements prototype extensions
 * Copyright (c) 2018 Cloudseat.net
 * Released under the MIT License.
 * --------------------------------------------------- */
;
[Element, Text, DocumentFragment].forEach(e => {
  Object.assign(e.prototype, {
    insert(node) {
      return this.parentNode && this.parentNode.insertBefore(node, this)
    },
    replace(node) {
      return this.parentNode && this.parentNode.replaceChild(node, this)
    },
    remove() {
      return this.parentNode && this.parentNode.removeChild(this)
    }
  })
})
