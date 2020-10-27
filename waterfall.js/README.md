# Waterfall Layout
A super lightweight library for waterfall layout.

## Usage

```html
<div class="grid">
  <div><br>1</div>
  <div><br><br>2</div>
  <div><br><br><br><br>3</div>
  <div><br>4</div>
  <div><br><br><br>5</div>
  <div><br>6</div>
  <div><br><br>7</div>
  <div><br><br><br><br><br><br>8</div>
  <div><br><br><br><br>9</div>
  <div><br><br><br><br><br>10</div>
</div>
```

```js
const waterfall = new Waterfall('.grid')
waterfall.render()
window.onresize = () => waterfall.render()
```

Or add items dynamically:

```html
<div class="grid"></div>
```

```js
const waterfall = new Waterfall('.grid')
window.onresize = () => waterfall.render()
for (let i = 0; i < 10; i++) {
  const div = document.createElement('div')
  document.body.appendChild(div)
  waterfall.add(div)
}
```

## Precautions

If the item contains an image, you may need to call `render` function again when image loaded.
