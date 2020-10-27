# Toast UI Framework
A lightweight UI framework for toast componets.

## Installation
```
<script src="toast.js"></script>
```

## Simple Usage

- **Tips**
```
<div toast-title="hello world"></div>
```

- **Message**
```
Toast.info('hello world')
Toast.error('hello world')
Toast.success('hello world')
```

- **Progess**
```
Toast.progress.start()
setTimeout(() => {
  Toast.progress.done()
}, 3000)
```

- **Loading**
```
Toast.loading.start()
setTimeout(() => {
  Toast.loading.done()
}, 3000)
```

- **Dialog**
```
Toast.alert('hello world')

Toast.confirm('hello world', () => {
  console.log('OK')
})

const dialog = Toast.dialog({
  content: 'hello world',
  buttons: [{
    label: 'OK',
    type: 'primary',
    onClick: () => alert('OK')
  }, {
    label: 'Cancel',
    type: 'default',
    onClick: () => alert('Cancel')
  }]
})
dialog.hide()
```

- **Action Sheet**
```
const sheet = Toast.actionSheet([
  { label: 'Menu One', onClick: () => alert(1) },
  { label: 'Menu Two', onClick: () => alert(2) },
  { label: 'Menu Three', onClick: () => alert(3) },
])
sheet.hide()
```

- **Sliding Page**
```
const page = Toast.slidingPage('#container-id')
page.show()
page.hide()
```
