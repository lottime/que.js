class Heatmap {
    constructor(selector, options = {}) {
        this.options = this.merge(Heatmap.DEFAULT_OPTIONS, options)
        this.spacing = this.options.lattice.size + this.options.lattice.spacing

        this.svg = this.createElement('svg')
        this.svg.styles(Heatmap.DEFAULT_STYLES.svg)
        this.buildWeeks()
        this.buildDates()

        document.querySelector(selector).appendChild(this.svg.attrs({
            width: this.canvasWidth,
            height: this.spacing * 8
        }))
    }

    buildWeeks() {
        const days = this.options.lang.days
        if (!Array.isArray(days)) {
            throw new Error('`days` must be an array')
        }
        this.weekWidth = 0
        days.forEach((w, i) => {
            this.weekWidth = Math.max(this.weekWidth, (w.length - 1) * 5)
            let text = this.createElement('text', {
                x: 0,
                y: (i + 1) * this.spacing + Heatmap.HEADER_HEIGHT
            })
            text.innerHTML = w
            this.svg.appendChild(text)
        })
    }

    buildDates() {
        let date = new Date()
        let today = this.format(date)
        date.setFullYear(date.getFullYear() - 1) // 从去年的今天开始绘制

        let _x = 0 // 当前绘制方块的 x 值
        let prevMonth = -1

        for (let i = 1; i <= 54; i++) {
            _x = i * this.spacing + this.weekWidth

            // 创建星期组元素
            let weekGroup = this.createElement('g', {
                transform: `translate(${_x}, ${this.spacing})`
            })
            this.svg.appendChild(weekGroup)

            // 创建每星期的日期元素
            // 先判断从星期几开始绘制
            let startDay = i == 1 ? date.getDay() : 0
            for (let j = startDay; j <= 6; j++) {
                let dateFmt = this.format(date)

                // 创建日期方块元素
                let rect = this.createElement('rect', {
                    x: 0, // 每个日期的 x 轴由所在的星期组 weekGroup 设置
                    y: j * this.spacing,
                    width: this.options.lattice.size,
                    height: this.options.lattice.size,
                    onmouseover: 'this.style.opacity=1',
                    onmouseout: 'this.style.opacity=0.6',
                    'data-date': dateFmt,
                })
                rect.styles(this.merge(Heatmap.DEFAULT_STYLES.rect, {
                    fill: this.options.lattice.color
                }))

                // 创建日期的鼠标提示元素
                let title = this.createElement('title')
                title.innerHTML = dateFmt

                // 如果该日期存在数据负载则重设样式、增加点击事件
                let payload = this.options.data[dateFmt]
                if (payload) {
                    title.innerHTML += '\n' + payload.title
                    rect.styles({
                        fill: this.options.lattice.highlightColor,
                        cursor: 'pointer'
                    })
                    rect.attrs({
                        'data-link': payload.url
                    })
                    rect.onclick = function() {
                        location.href = this.dataset.link
                    }
                }

                // 添加各元素
                rect.appendChild(title)
                weekGroup.appendChild(rect)

                // 缓存月份的x轴供创建月份时使用
                let month = date.getMonth()
                if (prevMonth != month) {
                    prevMonth = month
                    this.buildMonths(month, _x)
                }

                // 绘制到当天为止
                if (dateFmt == today) {
                    this.canvasWidth = (i + 1) * this.spacing + this.weekWidth
                    return
                }
                date.setDate(date.getDate() + 1)
            }
        }
    }

    buildMonths(m, x) {
        const months = this.options.lang.months
        if (!Array.isArray(months)) {
            throw new Error('`months` must be an array')
        }
        let text = this.createElement('text', {
            x: x,
            y: Heatmap.HEADER_HEIGHT
        })
        text.innerHTML = months[m]
        this.svg.appendChild(text)
    }

    createElement(tag, _attrs) {
        let element = document.createElementNS('http://www.w3.org/2000/svg', tag);
        element.attrs = function(attrs) {
            for (let key in attrs) this.setAttribute(key, attrs[key])
            return element
        }
        element.styles = function(styles) {
            for (let key in styles) this.style[key] = styles[key]
            return element
        }
        element.attrs(_attrs)
        return element
    }

    format(date) {
        let m = date.getMonth() + 1
        let d = date.getDate()
        return date.getFullYear() + '/' + (m < 10 ? '0' + m : m) + '/' + (d < 10 ? '0' + d : d)
    }

    merge(...objs) {
        const result = {}
        const isObject = o => {
            return typeof o === 'object' && !o.length
        }
        objs.forEach(obj => {
            for (let key in obj) {
                const value = obj[key]
                if (isObject(result[key]) && isObject(value)) {
                    result[key] = this.merge(result[key], value)
                } else {
                    result[key] = value
                }
            }
        })
        return result
    }
}

Heatmap.HEADER_HEIGHT = 10

Heatmap.DEFAULT_OPTIONS = {
    data: {},
    lattice: {
        size: 12,
        spacing: 3,
        color: '#ddd',
        highlightColor: '#cd4230'
    },
    lang: {
        days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        months: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
    }
}

Heatmap.DEFAULT_STYLES = {
    svg: {
        fill: '#999',
        'font-size': '11px',
    },
    rect: {
        opacity: 0.6,
        transition: 'all .3s'
    }
}
