# Heatmap Calendar
A super lightweight library for heatmap calendar.

```js
const heatmap = new Heatmap({
  data: {
    "2019/10/10": {
      "url": "https://github.com",
      "title": "example"
    }
  },
  lang: {
    months: ["1月", "2月", "3月", "4月", "5月", "6月", "7月", "8月", "9月", "10月", "11月", "12月"],
    days: ["日", "一", "二", "三", "四", "五", "六"]
  },
  lattice: {
    size: 12,
    spacing: 3,
    color: '#ddd',
    highlightColor: '#cd4230'
  }
})

el.innerHTML = heatmap.toSVG()
```
