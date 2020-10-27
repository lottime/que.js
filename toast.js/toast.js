function addStyleRules(rules) {
    const style = document.createElement('style')
    style.appendChild(document.createTextNode('')) // WebKit hack
    document.head.appendChild(style)

    rules.forEach((rule, index) => {
        style.sheet.insertRule(rule, index)
    })
}

addStyleRules([
    `*, *:before, *:after {
  -moz-box-sizing: border-box;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
}`,
    `[class^="toast-"] {
  -moz-user-select: none;
  -webkit-touch-callout: none;
  -webkit-user-select: none;
  user-select: none;
  line-height: normal;
}`,
    `.toast-mask {
  position: fixed;
  z-index: 1000;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
}`,
    `.toast-progress {
  position: fixed;
  z-index: 1001;
  top: 0;
  left: 0;
  width: 0;
  height: 1px;
  background: #0c7;
  transition: width .3s linear;
}`,
    `.toast-dialog {
  display: flex;
  justify-content: center;
  align-items: center;
}`,
    `.toast-dialog-panel {
  background: #fff;
  max-width: 80%;
  max-height: 80%;
  min-width: 280px;
  border-radius: 5px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}`,
    `.toast-dialog-body {
  flex: 1;
  padding: 25px;
  overflow: auto;
}`,
    `.toast-dialog-footer {
  display: flex;
  text-align: center;
  border-top: #f6f6f6 1px solid;
}`,
    `.toast-dialog-button {
  flex: 1;
  cursor: pointer;
  line-height: 50px;
  font-weight: 700;
  color: #999;
  border-left: #f6f6f6 1px solid;
  -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
}`,
    `.toast-dialog-button:first-child {
  border: 0;
}`,
    `.toast-dialog-button:active {
  background: #eee;
}`,
    `.toast-dialog-button.primary {
  color: #333;
}`,
    `.toast-info {
  background: transparent;
  height: 0;
  display: flex;
  justify-content: center;
}`,
    `.toast-info>div {
  margin-top: 80px;
  margin-bottom: auto;
  max-width: 80%;
  padding: 10px 15px;
  border-radius: 3px;
  font-weight: 700;
  color: #fff;
}`,
    `.toast-actionsheet {
  position: fixed;
  z-index: 1001;
  left: 0;
  right: 0;
  bottom: 0;
  background: #eee;
}`,
    `.toast-actionsheet-menu {
  text-align: center;
  border-top: #f6f6f6 1px solid;
  background: #fff;
  cursor: pointer;
  line-height: 50px;
  font-weight: 700;
  -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
}`,
    `.toast-actionsheet-menu:active {
  background: #eee;
}`,
    `.toast-actionsheet-menu:first-child {
  border: 0;
}`,
    `.toast-actionsheet-menu:last-child {
  border: 0;
  margin-top: 10px;
  color: #ce2f33;
}`,
    `.toast-loading {
  position: fixed;
  z-index: 1001;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  width: 40px;
  height: 40px;
  margin: auto;
  border-radius: 50%;
  border-top: 3px solid rgba(255, 255, 255, 0.2);
  border-right: 3px solid rgba(255, 255, 255, 0.2);
  border-bottom: 3px solid rgba(255, 255, 255, 0.2);
  border-left: 2px solid rgba(255, 255, 255, 0.8);
  animation: spin 1s linear infinite;
}`,
    `[toast-title] {
  position: relative;
}`,
    `[toast-title]:before {
  content: '';
  position: absolute;
  visibility: hidden;
  top: -10px;
  left: 50%;
  margin-left: -5px;
  border-width: 5px;
  border-style: solid;
  border-color: rgba(0, 0, 0, 0.6) transparent transparent transparent;
  opacity: 0;
  transition: opacity .5s;
}`,
    `[toast-title]:after {
  content: attr(toast-title);
  position: absolute;
  visibility: hidden;
  height: 35px;
  line-height: 35px;
  top: -45px;
  left: 50%;
  transform: translate3d(-50%, 0, 0);
  background: rgba(0, 0, 0, 0.7);
  color: #fff;
  border-radius: 3px;
  padding: 0 10px;
  font-size: 13px;
  font-style: normal;
  white-space: nowrap;
  opacity: 0;
  transition: opacity .5s;
}`,
    `[toast-title]:hover:before, [toast-title]:hover:after {
  visibility: visible;
  opacity: 1;
}`,
    `.toast-fade-in {
  animation: fadeIn ease .3s forwards;
}`,
    `.toast-fade-out {
  animation: fadeOut ease .3s forwards;
}`,
    `.toast-slide-up {
  animation: slideUp ease .3s forwards;
}`,
    `.toast-slide-down {
  animation: slideDown ease .3s forwards;
}`,
    `.toast-slide-left {
  animation: slideLeft ease .3s forwards;
}`,
    `.toast-slide-right {
  animation: slideRight ease .3s forwards;
}`,
    `.toast-scale-in {
  animation: scaleIn ease .3s forwards;
}`,
    `.toast-scale-out {
  animation: scaleOut ease .3s forwards;
}`,
    `@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}`,
    `@keyframes fadeOut {
  from {
    opacity: 1;
  }
  to {
    opacity: 0;
  }
}`,
    `@keyframes slideUp {
  from {
    transform: translate3d(0, 100%, 0);
  }
  to {
    transform: translate3d(0, 0, 0);
  }
}`,
    `@keyframes slideDown {
  from {
    transform: translate3d(0, 0, 0);
  }
  to {
    transform: translate3d(0, 100%, 0);
  }
}`,
    `@keyframes slideLeft {
  from {
    transform: translate3d(100%, 0, 0);
  }
  to {
    transform: translate3d(0, 0, 0);
  }
}`,
    `@keyframes slideRight {
  from {
    transform: translate3d(0, 0, 0);
  }
  to {
    transform: translate3d(100%, 0, 0);
  }
}`,
    `@keyframes scaleIn {
  from {
    transform: scale3d(0.8, 0.8, 1);
  }
  to {
    transform: scale3d(1, 1, 1);
  }
}`,
    `@keyframes scaleOut {
  from {
    transform: scale3d(1, 1, 1);
  }
  to {
    transform: scale3d(0.8, 0.8, 1);
  }
}`,
    `@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}`,
])

window.Toast = {
    loading: {
        start() {
            if (this.instance) return
            this.instance = $('<div class="toast-loading"></div>')
            document.body.appendChild(this.instance)
        },

        done() {
            if (!this.instance) return
            this.instance.remove()
            this.instance = null
        }
    },

    /**
     * Toast Progess Component
     *
     * @example
     * Toast.progress.start()
     * Toast.progress.done()
     */
    progress: {
        start(indeterminate = true) {
            if (this.status) return
            this.instance = $('<div class="toast-progress"></div>')
            document.body.appendChild(this.instance)
            this._observe()

            if (indeterminate) {
                this.status = 1
                this._trickle = setInterval(() => {
                    if (this.status < 99) {
                        this.status += Math.round(((100 - this.status) / 3) * Math.random())
                    }
                }, 300)
            }
        },

        tick(status) {
            this.status = parseInt(status)
        },

        done() {
            if (!this.status) return
            this.status = 100
            clearInterval(this._trickle)

            setTimeout(() => {
                this.status = 0
                this.instance.remove()
            }, 300)
        },

        _observe() {
            if (this._observed) return
            this._observed = true

            let value = this.status
            Object.defineProperty(this, 'status', {
                get: () => value,
                set: v => {
                    value = v
                    this.instance.style.width = v + '%'
                }
            })
        }
    },

    /**
     * Toast Dialog Component
     *
     * @example
     * const dialog = Toast.dialog({
     *   content: 'hello world',
     *   buttons: [{
     *     label: 'OK',
     *     type: 'primary',
     *     onClick: () => alert('OK')
     *   }, {
     *     label: 'Cancel',
     *     onClick: () => alert('Cancel')
     *   }]
     * })
     *
     * dialog.hide()
     */
    dialog(options) {
        // Merge custom options
        options = Object.assign({
            content: '',
            buttons: [{
                label: '确定',
                type: 'primary',
                onClick: null
            }]
        }, options)

        // Create element container
        const instance = $(`
      <div class="toast-mask toast-dialog">
        <div class="toast-dialog-panel">
          <div class="toast-dialog-body">${options.content}</div>
          <div class="toast-dialog-footer"></div>
        </div>
      </div>
    `)
        // Add hide method to instance
        instance.hide = () => {
            Toast.current = null
            panel.addClass('toast-scale-out')
            instance.addClass('toast-fade-out')
            instance.on('animationend', () => instance.remove())
        }

        // Add custom buttons to instance
        const footer = instance.querySelector('.toast-dialog-footer')
        options.buttons.forEach(item => {
            let button = $(`<div class="toast-dialog-button ${item.type || ''}">${item.label}</div>`)
            button.on('click', () => {
                if (item.onClick) item.onClick(instance)
                else instance.hide()
            })
            footer.appendChild(button)
        })

        // Show dialog
        document.body.appendChild(instance)

        const panel = instance.querySelector('.toast-dialog-panel')
        panel.addClass('toast-scale-in')
        instance.addClass('toast-fade-in')
        Toast.current = instance
        return instance
    },

    /**
     * Toast Alert Component (Extends Dialog)
     *
     * @example
     * Toast.alert('hello world')
     */
    alert(message) {
        return this.dialog({
            content: message
        })
    },

    /**
     * Toast Confirm Component (Extends Dialog)
     *
     * @example
     * Toast.confirm('hello world', () => {
     *   alert('callback success')
     * })
     */
    confirm(message, callback) {
        return this.dialog({
            content: message,
            buttons: [{
                label: '确定',
                type: 'primary',
                onClick: (dialog) => {
                    dialog.hide()
                    callback()
                }
            }, {
                label: '取消',
                onClick: null
            }]
        })
    },

    /**
     * Toast Info Component
     *
     * @example
     * Toast.info('hello world', options)
     *
     * options = 3000
     * options = {
     *   duration: 3000,
     *   background: '#ccc'
     * }
     */
    info(message, options) {
        // Check and remove current instance
        if (Toast._singleton) {
            Toast._singleton.remove()
            Toast._singleton = null
        }

        // Merge custom options
        if (typeof options === 'number') {
            options = {
                duration: options
            }
        }
        options = Object.assign({
            duration: 3000,
            background: 'rgba(0, 0, 0, 0.6)'
        }, options)

        // Create element container
        const instance = $(`
      <div class="toast-mask toast-info">
        <div style="background:${options.background}">${message}</div>
      </div>
    `)

        // Show instance
        document.body.appendChild(instance)
        instance.addClass('toast-fade-in')
        Toast._singleton = instance

        // Auto hide delay
        setTimeout(() => {
            instance.addClass('toast-fade-out')
            instance.on('animationend', () => {
                instance.remove()
            })
        }, options.duration)
    },

    /**
     * Toast Error Component (Extends Info)
     *
     * @example
     * Toast.error('hello world', options)
     *
     * options = 3000
     * options = {
     *   duration: 3000,
     *   background: '#ccc'
     * }
     */
    error(message, options = {}) {
        if (typeof options === 'number') {
            options = {
                duration: options
            }
        }
        options.background = 'rgba(217, 37, 7, 0.6)'
        this.info(message, options)
    },

    /**
     * Toast Success Component (Extends Info)
     *
     * @example
     * Toast.success('hello world', options)
     *
     * options = 3000
     * options = {
     *   duration: 3000,
     *   background: '#ccc'
     * }
     */
    success(message, options = {}) {
        if (typeof options === 'number') {
            options = {
                duration: options
            }
        }
        options.background = 'rgba(43, 155, 23, 0.6)'
        this.info(message, options)
    },

    /**
     * Toast ActionSheet Component
     *
     * @example
     * const sheet = Toast.actionSheet([
     *   { label: 'Menu One', onClick: () => alert(1) },
     *   { label: 'Menu Two', onClick: () => alert(2) },
     *   { label: 'Menu Three', onClick: () => alert(3) },
     * ])
     *
     * sheet.hide()
     */
    actionSheet(menus = []) {
        // Create element container
        const instance = $(`
      <div>
        <div class="toast-mask"></div>
        <div class="toast-actionsheet"></div>
      </div>
    `)
        // Add hide method to instance
        instance.hide = () => {
            Toast.current = null
            mask.addClass('toast-fade-out')
            sheet.addClass('toast-slide-down')
            sheet.on('animationend', () => instance.remove())
        }

        // Add click event to mask
        const mask = instance.querySelector('.toast-mask')
        mask.onclick = () => instance.hide()

        // Add custom menus to sheet
        const sheet = instance.querySelector('.toast-actionsheet')
        menus.push({
            label: '取消',
            onClick: null
        })
        menus.forEach(item => {
            let menu = $(`<div class="toast-actionsheet-menu">${item.label}</div>`)
            menu.on('click', e => {
                instance.hide()
                item.onClick && item.onClick(e)
            })
            sheet.appendChild(menu)
        })

        // Show actionsheet
        document.body.appendChild(instance)
        mask.addClass('toast-fade-in')
        sheet.addClass('toast-slide-up')
        Toast.current = instance
        return instance
    },

    slidingPage(target) {
        target = $(target)
        if (!target._paged) {
            target._paged = true
            target.addClass('toast-mask')
            target.display = getComputedStyle(target, null)['display']
            target.style.display = 'none'

            target.show = function() {
                target.style.display = this.display
                this.removeClass('toast-slide-right')
                this.addClass('toast-slide-left')
                return this
            }
            target.hide = function() {
                this.removeClass('toast-slide-left')
                this.addClass('toast-slide-right')
                return this
            }
        }
        return target
    }

}

Object.assign(Element.prototype, {
    addClass(name) {
        this.classList.add(name)
        return this
    },
    removeClass(name) {
        this.classList.remove(name)
        return this
    },
    on(event, fn) {
        this.addEventListener(event, fn)
        return this
    },
    off(event, fn) {
        this.removeEventListener(event, fn)
        return this
    },
    remove() {
        return this.parentNode && this.parentNode.removeChild(this)
    },
})

Object.assign(window, {
    $(selector) {
        selector = selector.replace('/[\t\r\n]/mg', '').trim()
        if (selector.startsWith('<')) {
            const fragment = document.createRange().createContextualFragment(selector)
            return fragment.firstChild
        }
        return document.querySelector(selector)
    }
})
