class Waterfall {
    constructor(selector, columnCount = 3, spacing = 10) {
        this.container = document.querySelector(selector)
        this.container.style.position = 'relative'
        this.columnCount = columnCount
        this.spacing = spacing
        this.columnCache = new Array(this.columnCount)
        this._init()
    }
    render() {
        this._init()
        const items = this.container.children
        for (let i = 0; i < items.length; i++) {
            this.add(items[i])
        }
    }
    add(el) {
        const column = this._findLowestColumn()
        el.transition = el.style.transition
        el.style.transition = 'none' // 动画影响 offsetHeight 的获取
        el.style.position = 'absolute'
        el.style.left = column.x + 'px'
        el.style.top = column.y + 'px'
        el.style.width = this.columnWidth + 'px'

        this.columnCache[column.i] = column.y + el.offsetHeight
        el.style.transition = el.transition

        const max = Math.max.apply(null, this.columnCache)
        this.container.style.height = max + 'px'
    }
    _init() {
        this.columnCache.fill(0)
        this.columnWidth = (this.container.offsetWidth - this.spacing * (this.columnCount - 1)) / this.columnCount
    }
    _findLowestColumn() {
        const min = Math.min.apply(null, this.columnCache)
        const index = this.columnCache.indexOf(min)
        return {
            i: index,
            x: index > 0 ? index * (this.columnWidth + this.spacing) : 0,
            y: min > 0 ? min + this.spacing : 0
        }
    }
}
