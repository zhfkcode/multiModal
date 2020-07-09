# multi-modal
这是一个可以弹出多个弹窗，并且可以自由移动的vue插件。

Use the component:
```vue
<template>
  <div id="app">
    <img alt="Vue logo" src="./assets/logo.png">
     <dialogs :modals="dialogs">
        <template v-slot:todo="{ todo }">
          <input type="text" v-model="todo.inpt">
          <p>{{todo.name}}</p>
          <p>{{todo.id}}</p>
          <p>{{todo.content}}</p>
      </template>
    </dialogs>
    <button @click="addModel">新增modla</button>
  </div>
</template>

<script>
import Dialogs from '@/components/tslDialog/index'

export default {
  name: 'App',
  data () {
    return {
      dialogs: {}
    }
  },
  components: {
    Dialogs
  },
  methods: {
    addModel () {
      this.dialogs = { name: '新增弹窗', options: { width: 500 }, data: { name: '', phone: ''} }
    }
  }
}
</script>
```
## props
### 1.modals
Type: `Object`<br>
Required: `true`<br>
Default: `{}`

#### modals.name
弹窗标题<br>
Type: `String`<br>
Required: `true`<br>
Default: ` `

#### modals.options
弹窗样式<br>
Type: `Object`<br>
Required: `false`<br>
Default: `{}`


可设置弹窗样式<br>
*with   弹窗宽度<br>
*height   弹窗高度<br>
*left   弹窗距离左边距离<br>
*top   弹窗距离上边距离<br>

#### modals.data
每个弹窗传入的数据<br>
Type: `Object`<br>
Required: `false`<br>
Default: `{}`



