<template>
<!-- <div class="" id="app"> -->
  <!-- <div class="menu-container">
    <button class="btn" @click='newDialog(style)'>new dialog</button>
  </div> -->
  <div class="dialogs" :class="{flex:isFlex,modal:singleModal}">
    <dialog-drag
    v-for='(dialog) in dialogs'
        :class='dialog.style.name'
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
  </div>
<!-- </div> -->
</template>

<script>
import DialogDrag from './tslDialog'

export default {
  name: 'example',
  props: {
    modals: {
      type: Object,
      default: () => {
        return {}
      }
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
      selected: null,
      // dialogWidth: 400,
      droppeds: []
    }
  },
  created () {
  },
  watch: {
    modals (newValue) {
      if (newValue.options.centered) {
        this.dialogs = [this.dialog(newValue)]
        this.singleModal = true
      } else {
        this.dialogs.push(this.dialog(newValue))
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
      if (index !== null) {
        this.dialogs.push(this.droppeds[index])
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
      if (this.selected && this.selected.id === id) this.selected = null
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
      // const content = style.content || ''
      let options = {}
      const data = style.data ? style.data : {}
      if (style.options) options = Object.assign({}, style.options)
      if (!options.left) options.left = 20 * id
      if (!options.top) options.top = 10 * id
      options.zIndex = id
      return { id, name, style, options, data }
    },
    dialogDragEnd (obj) {
      const index = this.findDialog(obj.id)
      this.$set(this.dialogs[index].options, 'left', obj.left)
      this.$set(this.dialogs[index].options, 'top', obj.top)
    },
    selectDialog (obj) {
      // eslint-disable-next-line eqeqeq
      if (this.selected && this.selected.id == obj.id) return
      const index = this.findDialog(obj.id)
      this.selected = this.dialogs[index]
      const len = this.dialogs.length
      const remin = this.dialogId - obj.id
      for (let idv = 0; idv < len; idv++) {
        // eslint-disable-next-line eqeqeq
        if (idv == index) {
          this.$set(this.dialogs[idv], 'options', { zIndex: this.dialogId })
        } else {
          const zIndex = this.dialogs[idv].options.zIndex
          const res = zIndex > remin ? zIndex - 1 : zIndex
          this.$set(this.dialogs[idv], 'options', { zIndex: res })
          //  this.$set(this.dialogs[idv].options, 'zIndex', 0)
        }
        // this.$forceUpdate()
      }
    },
    changeModel () {
      this.isFlex = !this.isFlex
    }
  }
}
</script>
<style lang="scss">
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
</style>
