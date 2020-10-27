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

    page(container) {
        if (!container._paged) {
            container._paged = true
            container.addClass('toast-mask')
            container.display = getComputedStyle(container, null)['display']
            container.style.display = 'none'

            container.show = function() {
                container.style.display = this.display
                this.removeClass('toast-slide-right')
                this.addClass('toast-slide-left')
                return this
            }
            container.hide = function() {
                this.removeClass('toast-slide-left')
                this.addClass('toast-slide-right')
                return this
            }
        }
        return container
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
