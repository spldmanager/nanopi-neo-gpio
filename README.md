# nanopi-neo-gpio

`nanopi-neo-gpio`是一个基于nanopi neo2/air的gpio调用模块;


### 安装
```
npm install nanopi-neo-gpio
```

### 使用

```js
const pin = 7
var gpio = require('nanopi-neo-gpio');
gpio.setOn(pin)
gpio.setOff(pin)
gpio.addPinEventListener(pin,'out')
