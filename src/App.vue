<template>
  <div id="app">
    <img alt="Vue logo" src="./assets/logo.png">
     <dialogs :modals="dialogs" :singlePop="isSingle">
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
// import Dialogs from '@/components/tslDialog/index'

export default {
  name: 'App',
  data () {
    return {
      dialogs: {},
      count: 1,
      isSingle: true
    }
  },
  // components: {
  //   Dialogs
  // },
  methods: {
    addModel () {
      this.count++
      this.dialogs = { name: this.count + '新增弹窗', options: { width: 500 } }
    }
  }
}
</script>

<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
  height: 100vh;
}
</style>
