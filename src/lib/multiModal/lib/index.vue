<template>
<!-- <div class="" id="app"> -->
  <!-- <div class="menu-container">
    <button class="btn" @click='newDialog(style)'>new dialog</button>
  </div> -->
  <div class="dialogs" :class="{flex:isFlex,modal:singleModal}">
    <transition-group
    @before-enter="beforeEnter"
    @enter="enter"
    @leave="leave"
    mode="out-in"
    v-if="singlePop"
>
    <dialog-drag
    v-for='(dialog) in dialogs'
        :class='"dialog-" + dialog.id'
        :key='dialog.id'
        :id='dialog.id'
        :ref='"dialog-" + dialog.id'
        @close='removeDialog'
        @drag-end='dialogDragEnd'
        @drag-start='selectDialog'
        @move='dialogDragEnd'
        @change-model="changeModel"
        :options='dialog.options'
        v-show="selected.id ==dialog.id"
    >
    <span slot='title'>{{ dialog.name }}</span>
    <slot name="todo" v-bind:todo="dialog"></slot>
    </dialog-drag>
    </transition-group>
    <template v-else>
      <dialog-drag
    v-for='(dialog) in dialogs'
        :class='"dialog-" + dialog.id'
        :key='dialog.id'
        :id='dialog.id'
        :ref='"dialog-" + dialog.id'
        @close='removeDialog'
        @drag-end='dialogDragEnd'
        @drag-start='selectDialog'
        @move='dialogDragEnd'
        @change-model="changeModel"
        :options='dialog.options'
    >
    <span slot='title'>{{ dialog.name }}</span>
    <slot name="todo" v-bind:todo="dialog"></slot>
    </dialog-drag>
    </template>
    <div class="pop-docks" v-if="singlePop && droppeds.length">
      <transition-group name="trans"  tag="div" class="pop-dock">
      <div class="dock-item additem" v-for="item in droppeds" :key="item.id" @click="dockSelect(item)">
        <span class="close-btn" @click.stop="unDrop(item.id)">×</span>
        <p class="text">{{item.name}}</p>
      </div>
      </transition-group>
    </div>
  </div>
<!-- </div> -->
</template>

<script>
import DialogDrag from './tslDialog'

export default {
  name: 'multi-dialog',
  props: {
    modals: {
      type: Object,
      default: () => {
        return {}
      }
    },
    singlePop: {
      type: Boolean,
      default: false
    },
    baseZIndex: {
      type: Number,
      default: 100
    }
  },
  components: {
    DialogDrag
  },
  data () {
    return {
      dialogs: [],
      dialogId: 1,
      singleModal: false,
      isFlex: false,
      styles: [],
      style: null,
      selected: {},
      // dialogWidth: 400,
      droppeds: [],
      isShow: 0
    }
  },
  created () {
  },
  watch: {
    modals (newValue) {
      const newDia = this.dialog(newValue)
      if (newValue.options.centered) {
        this.dialogs = [newDia]
        this.singleModal = true
      } else {
        this.dialogs.push(newDia)
        if (this.singlePop) {
          // eslint-disable-next-line no-unused-expressions
          this.selected && this.selected.id ? this.droppeds.push(this.selected) : ''
          this.selected = newDia
        }
      }
    }
  },
  methods: {
    drop (id) {
      const index = this.findDialog(id)
      if (index !== null) {
        this.droppeds.push(this.dialogs[index])
        this.dialogs.splice(index, 1)
      }
    },
    unDrop (id) {
      const index = this.findDialog(id, this.droppeds)
      const indexDia = this.findDialog(id)
      if (index !== null) {
        this.dialogs.splice(indexDia, 1)
        this.droppeds.splice(index, 1)
      }
    },
    newDialog (sId) {
      return this.dialogs.push(this.dialog(this.styles[0]))
    },
    removeDialog (dialog) {
      this.singleModal = false
      const id = dialog.id
      const index = this.findDialog(id)
      this.dialogs.splice(index, 1)
      if (this.selected && this.selected.id === id) this.selected = {}
      if (!this.dialogs.length) this.dialogId = 1
    },
    findDialog (id, dialogs) {
      if (!dialogs) dialogs = this.dialogs
      const index = dialogs.findIndex((val) => {
        return val.id === id
      })
      return (index > -1) ? index : null
    },
    dialog (style) {
      const id = String(this.dialogId)
      this.dialogId++
      const name = style.name
      let options = {}
      const data = style.data ? style.data : {}
      if (style.options) options = Object.assign({}, style.options)
      if (!options.left) options.left = 20 * id
      if (!options.top) options.top = 10 * id
      options.z = this.baseZIndex + this.dialogId
      return { id, name, style, options, data }
    },
    dialogDragEnd (obj) {
      const index = this.findDialog(obj.id)
      this.$set(this.dialogs[index], 'options', { left: obj.left })
      this.$set(this.dialogs[index], 'options', { top: obj.top })
    },
    selectDialog (obj) {
      if (this.selected.id) this.$refs['dialog-' + this.selected.id][0].$el.style.transition = ''
      // eslint-disable-next-line eqeqeq
      if (this.selected && this.selected.id == obj.id) return
      const index = this.findDialog(obj.id)
      this.selected = this.dialogs[index]
      const len = this.dialogs.length
      const remin = this.dialogId - obj.id
      for (let idv = 0; idv < len; idv++) {
        // eslint-disable-next-line eqeqeq
        if (idv == index) {
          this.$set(this.dialogs[idv], 'options', { zIndex: this.baseZIndex + this.dialogId })
        } else {
          const zIndex = this.dialogs[idv].options.zIndex
          const res = zIndex > (this.baseZIndex + remin) ? zIndex - 1 : zIndex
          this.$set(this.dialogs[idv], 'options', { zIndex: res })
        }
      }
    },
    dockSelect (obj) {
      const index = this.findDialog(obj.id, this.droppeds)
      if (index !== null) {
        this.droppeds.splice(index, 1)
        // eslint-disable-next-line no-unused-expressions
        this.selected && this.selected.id ? this.droppeds.push(this.selected) : ''
        this.selectDialog(obj)
      }
    },
    getCenter (he, wi) {
      const wh = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight
      const ww = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth
      if (!he || !wi) {
        return {
          left: 0,
          top: 0
        }
      }
      const disx = (ww / 2) - (wi / 2)
      const disy = (wh / 2) - (he / 2)
      return {
        left: disx < 0 ? 0 : disx,
        top: disy < 0 ? 0 : disy
      }
    },
    changeModel () {
      if (this.singlePop) return
      this.isFlex = !this.isFlex
    },
    beforeEnter (el) {
      el.style.transform = 'scale(0)'
      el.style.opacity = 0
      el.style.top = el.style.top !== '0px' ? window.innerHeight + 'px' : 0 + 'px'
    },
    enter (el, done) {
      // 不让过渡失效，可用this.$nextTick()代替
      // eslint-disable-next-line no-unused-expressions
      el.offsetWidth
      const res = this.getCenter(el.offsetHeight, el.offsetWidth)
      // enter 表示动画 开始之后的样式，这里，可以设置小球完成动画之后的，结束状态
      el.style.transform = 'scale(1)'
      el.style.top = res.top + 'px'
      el.style.left = res.left + 'px'
      el.style.transition = 'all 1s ease-out'
      el.style.opacity = 1
      this.$set(this.selected, 'options', { left: res.left, top: res.top })
      done()
    },
    leave (el, done) {
      this.$nextTick(() => {
        el.style.transform = 'scale(0)'
        el.style.opacity = 0
        el.style.top = window.innerHeight + 'px'
        el.style.transition = 'all 0.5s linear'
      })
    }
  }
}
</script>
<style lang="scss">
p{
  margin: 0;
  padding: 0;
}
.flex{
  display: flex;
  justify-content: space-around;
  align-items: center;
  flex-wrap: wrap;
  position: fixed;
  z-index: 100;
  top:0;
  width: 100%;
  height: 100%;
  overflow: scroll;

}
.flex .dialog-drag {
  position: static;
}
.flex .dialog-drag .dialog-header .button.changmodel  {
  background-image: url(./images/sort.png);
}
.dialogs {
  position: fixed;
  top:0;
  left: 0;
  // width: 100%;
  // height: 100%;
  // background: rgba(0,0,0,.6);
  z-index: 100;
}
.modal.dialogs {
  width: 100%;
  height: 100%;
  background: rgba(0,0,0,.6);
}
.faset-enter-active{
  transition: all 1s ease;
}
// 底部窗口坞的样式
.pop-dock {
  position: fixed;
  bottom: 0;
  left: 50%;
  max-width: 60%;
  min-width: 30%;
  height: 50px;
  display: flex;
  // justify-content: space-around;
  align-items: center;
  transform: translate(-50%, -10%);
  background: #001C3C;
  overflow: auto;
  border-radius: 5px;
  transition: all 1s;
}
.dock-item {
  position: relative;
  margin-left: 10px;
  padding:0 5px;
  flex: 0 0 30px;
  align-items: center;
  width: 40px;
  height: 40px;
  font-size: 12px;
  color: #fff;
  background: #203661;
  border-radius: 5px;
  cursor: default;
  opacity: 1;
}
.dock-item .text {
   display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
}
.dock-item:hover .close-btn{
  display: inline-block;
}
.close-btn {
  display: none;
  position: absolute;
  right: -3px;
  top: -11px;
  font-size: 18px;
  cursor: pointer;
}
.trans-enter,.trans-leave-to {
  opacity: 0;
  transform: translateY(30px);
}
.trans-move {
  transition: all 0.5s;;
}
.trans-enter-active, .trans-leave-active{
  // opacity: 1;
  transition: all 1s;
}
.trans-leave-active {
  position: absolute;
}
</style>
