class Heatmap {
    constructor(options = {}) {
        this.options = __merge(Heatmap.DEFAULT_OPTIONS, options)
        this.spacing = this.options.lattice.size + this.options.lattice.spacing

        this.svg = new Element('svg', {
            xmlns: 'http://www.w3.org/2000/svg',
            style: Heatmap.DEFAULT_STYLES.svg
        })

        this.buildWeeks()
        this.buildDates()
        this.svg.setAttribute({
            width: this.canvasWidth,
            height: this.spacing * 8
        })
    }

    buildWeeks() {
        const days = this.options.lang.days
        if (!Array.isArray(days)) {
            throw new Error('lang["days"] must be an array')
        }
        this.weekWidth = 0
        days.forEach((w, i) => {
            this.weekWidth = Math.max(this.weekWidth, (w.length - 1) * 5)
            let text = new Element('text', {
                x: 0,
                y: Heatmap.HEADER_HEIGHT + (i + 1) * this.spacing
            })
            text.setText(w)
            this.svg.append(text)
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
            let weekGroup = new Element('g', {
                transform: `translate(${_x}, ${this.spacing})`
            })
            this.svg.append(weekGroup)

            // 创建每星期的日期元素
            // 先判断从星期几开始绘制
            let startDay = i == 1 ? date.getDay() : 0
            for (let j = startDay; j <= 6; j++) {
                let dateFmt = this.format(date)

                // 创建日期方块元素
                let rect = new Element('rect', {
                    x: 0, // 每个日期的 x 轴由所在的星期组 weekGroup 设置
                    y: j * this.spacing,
                    width: this.options.lattice.size,
                    height: this.options.lattice.size,
                    onmouseover: 'this.style.opacity=1',
                    onmouseout: 'this.style.opacity=0.6',
                    'data-date': dateFmt,
                    style: __merge(Heatmap.DEFAULT_STYLES.rect, {
                        fill: this.options.lattice.color
                    })
                })

                // 创建日期的鼠标提示元素
                let title = new Element('title')
                title.setText(dateFmt)

                // 如果该日期存在数据负载则重设样式、增加点击事件
                let payload = this.options.data[dateFmt]
                if (payload) {
                    title.setText(title.text + '\n' + payload.title)
                    rect.setClick('location.href=this.dataset.link')
                    rect.setAttribute({
                        'data-link': payload.url,
                        style: {
                            fill: this.options.lattice.highlightColor,
                            cursor: 'pointer'
                        }
                    })
                }

                // 添加各元素
                rect.append(title)
                weekGroup.append(rect)

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
            throw new Error('lang["months"] must be an array')
        }
        let text = new Element('text', {
            x: x,
            y: Heatmap.HEADER_HEIGHT
        })
        text.setText(months[m])
        this.svg.append(text)
    }

    format(date) {
        let m = date.getMonth() + 1
        let d = date.getDate()
        return date.getFullYear() + '/' + (m < 10 ? '0' + m : m) + '/' + (d < 10 ? '0' + d : d)
    }

    toSVG() {
        return this.svg.toXml()
    }
}

Heatmap.HEADER_HEIGHT = 10

Heatmap.DEFAULT_OPTIONS = {
    data: {},
    lattice: {
        size: 12,
        spacing: 3,
        highlightColor: '#cd4230',
        color: '#ddd'
    },
    lang: {
        days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        months: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
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

/**
 * 虚拟 DOM 元素类
 * { tag, attrs, text, children }
 */
class Element {
    constructor(tag, attrs = {}) {
        this.tag = tag
        this.attrs = attrs
        this.children = []
    }
    append(element) {
        this.children.push(element)
    }
    setText(text) {
        this.text = text
    }
    setClick(fn) {
        this.attrs.onclick = fn
    }
    setAttribute(attrs) {
        this.attrs = __merge(this.attrs, attrs)
    }
    toXml() {
        // 将 style 对象转换成 "a:1;b:2" 形式的字符串
        if (this.attrs.style) {
            const styles = []
            for (let key in this.attrs.style) {
                styles.push(`${key}:${this.attrs.style[key]}`)
            }
            this.attrs.style = styles.join(';')
        }

        // 将 atrrs 对象转换成 "a=1 b=2" 形式的字符串
        let attrs = []
        for (let key in this.attrs) {
            attrs.push(` ${key}="${this.attrs[key]}"`)
        }
        attrs = attrs.join('')

        // 元素开始标签
        const xml = []
        xml.push(`<${this.tag}${attrs}>`)

        // 元素 innerHTML 或子元素
        if (this.text) {
            xml.push(this.text)
        } else {
            this.children.forEach(child => xml.push(child.toXml()))
        }

        // 元素结束标签
        xml.push(`</${this.tag}>`)
        return xml.join('')
    }
}

function __merge(...objs) {
    const result = {}
    const isObject = o => {
        return o && typeof o === 'object' && !o.length
    }
    objs.forEach(obj => {
        for (let key in obj) {
            const value = obj[key]
            if (isObject(result[key]) && isObject(value)) {
                result[key] = __merge(result[key], value)
            } else
            if (value) {
                result[key] = value
            }
        }
    })
    return result
}
