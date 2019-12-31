# vue-dusion-keyboard

> 基于vue的一款js键盘，支持`拼音输入`和`手写输入`，临时[demo地址](http://jsrtj.fotoit.cn/iis/keyboard-demo/)
---

## 安装
### npm安装
```
npm install vue-dusion-keyboard -S
```
在 main.js 中写入以下内容全局注册：
```
import VueDusionKeyboard from 'vue-dusion-keyboard'
Vue.use(VueDusionKeyboard)
```

### 标签引入
```
<script src="./vue-dusion-keyboard.js"></script>
```

---
## 使用
在非`all`模式下，input标签添加属性`data-mode`，然后在合适位置放置组件`<vue-dusion-keyboard></vue-dusion-keyboard>`即可。
```
<input type="text" data-mode="en_cap" />
<vue-dusion-keyboard float></vue-dusion-keyboard>
```

组件添加`all`属性即可为所有input标签注册弹出键盘
```
<vue-dusion-keyboard all float :blurHide="true" hand></vue-dusion-keyboard>
```

**对于js动态生成的输入框，vue-dusion-keyboard提供以下两种方法注册**
- 当有新的input标签生成时，重新调用`sign_up_keyboard`方法注册。
```
window.sign_up_keyboard();
```
- (已过时，不建议)调用组件内部显示和隐藏的方法
```
//添加ref属性 ref="keyboard"
<vue-dusion-keyboard ref="keyboard" all float hand></vue-dusion-keyboard>
//input标签上注册事件
<input type="text" @focus="$refs.keyboard.show_keyboard" @blur="$refs.keyboard.hide_keyboard" />
```
- (已过时，不建议)将显示和隐藏的方法挂载在window对象上
```
//组件添加window属性
<vue-dusion-keyboard window all float :blurHide="true" hand></vue-dusion-keyboard>
//input标签上注册事件
<input type="text" onfocus="$show_keyboard(event)" onblur="$hide_keyboard(event)" />
```
---

## 模式

### 离线模式
组件默认为离线模式，离线模式需要运行在[electron](https://electronjs.org)环境下，所需的控件有：
##### nodejs模块:
- `ffi`
- `ref`
- `iconv`
##### C++库:
- `XDLL.dll` : 放置在electron根目录的`plug\\handWrite\\XDLL.dll`下，暂不提供。
##### 手写字库:
- `hz.mrd` : 中文字库，放置在`XDLL.dll`同目录下，暂不提供。
- `English.mrd` : 英文字库，放置在`XDLL.dll`同目录下，暂不提供。

### 互联网模式
组件上添加`hand-write-api`属性即可切换互联网模式，可以直接运行在浏览器中
> 手写输入互联网接口地址见临时[demo地址](http://jsrtj.fotoit.cn/iis/keyboard-demo/)。<br>注意：临时地址仅供学习之用，随时可能关闭。
---
## Animate.css
此项目引用了[animate.css](https://daneden.github.io/animate.css/)，用于键盘显示隐藏的过渡动画，内置fadeInUp和fadeOutDown，如需其他效果，请引入animate.css文件，然后配置属性`enter-active-class`和`leave-active-class`

---
## Axios
由于调用手写输入接口需要，本项目引入了`axios`。

---
## input标签属性
|属性|说明|类型|可选值|默认值|
|:-:|:-|:-|:-|:-|
|**data-mode**|弹出输入法的类型：<br>`en_let` 英文小写<br>`en_cap` 英文大写<br>`cn` 中文<br>`hand` 手写|String|`en_let`<br>`en_cap`<br>`cn`<br>`hand`|`en_let`|

## 组件属性
|属性|说明|类型|可选值|默认值|
|:-:|:-|:-|:-|:-|
|**all**|是否为所有`input`标签注册弹出输入法|Boolean|true/false|false|
|**float**|是否使输入法组件浮动在当前`input`标签下方|Boolean|true/false|false|
|**hand**|是否启用手写输入，默认禁用|Boolean|true/false|false|
|**blurHide**|当`input`标签失去焦点时是否隐藏输入组件|Boolean|true/false|true|
|**size**|组件大小，mini最小支持宽度1080px，默认最小宽度则是1330px|String|primary/mini|primary|
|**enter-active-class**|输入组件弹出来的动画效果，基于[Animate.css](https://daneden.github.io/animate.css/)|String|见 [Animate.css](https://daneden.github.io/animate.css/) 官网|fadeInUp|
|**leave-active-class**|输入组件隐藏时的动画效果|String|同上|fadeOutDown|
|**hand-write-api**|手写输入接口地址，不传则为离线electron模式|String|见[demo](http://jsrtj.fotoit.cn/iis/keyboard-demo/)|无
|**window**|是否将显示和隐藏的方法挂载在window对象上，<br>方法名前面将会加上'$'|Boolean|true/false|false|

## 组件方法
|方法名|说明|参数|
|:-:|:-|:-|
|sign_up_keyboard|重新注册input显示键盘,当页面有新的input标签出现时调用此方法|event|
|show_keyboard|(已过时，不建议)注册显示键盘事件|event|
|hide_keyboard|(已过时，不建议)注册隐藏键盘事件|event|

### 更新
- **v1.0.2**<br>
1.添加动态创建的input标签呼出键盘的解决方案
- **v1.0.3**<br>
1.修复all模式下键盘隐藏事件无效。
- **v1.0.4**<br>
1.继续修复all模式下键盘隐藏事件无效的问题。
- **v1.0.5**<br>
1.添加全局方法`sign_up_keyboard()`，当页面有新的input标签出现时调用此方法即可。<br>
2.添加`size`属性，最小宽度支持到`1080`。
- **v1.0.6**<br>
1.修复离线模式下手写报错的bug<br>
2.修复当input标签或其父元素设置了css属性zoom时，键盘弹出位置不正确的问题


