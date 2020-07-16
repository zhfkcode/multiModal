<template>
  <div class="dialog-drag"
    :id='id'
    :style='dialogStyle'
    @mousedown="startClick"
    :class='(!drag) ? "fixed":""'
    v-show="isshow"
  >
    <div class="dialog-header"  @mousedown='mouseDown'>
      <div class="title">
        <slot name="title">
          <span>{{title}}</span>
        </slot>
      </div>
      <div class="buttons">
        <span class='changmodel button' @click.stop='changModel'></span>
        <span class='pin button' @click.stop='setDrag'>
        </span>
        <span class='close button' v-if='buttonClose' @click.stop='close'>
        </span>
      </div>
    </div>
    <div class="dialog-body">
      <slot></slot>
    </div>
  </div>
</template>
<script>
export default {
  name: 'dialog-drag',
  props: ['id', 'title', 'options', 'eventCb'],
  data () {
    return {
      width: 0,
      height: 0,
      zIndex: 0,
      offset: {
        x: 0,
        y: 0
      },
      left: 0,
      top: 0,
      isshow: true,
      buttonClose: true,
      buttonPin: true,
      dragEnabled: true,
      drag: true,
      // touch: null,
      overEvent: null,
      centered: false,
      dropEnabled: false,
      dragCursor: 'default',
      dragging: false,
      clickButton: false,
      pX: 0,
      pY: 0,
      availableOptions: [
        'left',
        'top',
        'width',
        'height',
        'buttonClose',
        'centered',
        'dropEnabled',
        'dragCursor',
        'zIndex'
      ]
    }
  },
  created () {
    this.setOptions(this.options)
  },
  mounted () {
    document.addEventListener('mousemove', this.mouseMove, { passive: true })
    document.addEventListener('mouseup', this.mouseUp)
    if (this.centered) {
      const vm = this
      this.$nextTick(() => {
        vm.center()
        vm.emit('load')
      })
    } else {
      this.emit('load')
    }
  },
  beforeDestroy () {
    document.removeEventListener('mousemove', this.mouseMove)
    document.removeEventListener('mouseup', this.mouseUp)
  },
  watch: {
    options (newValue) {
      // console.log('ddddd')
      this.setOptions(newValue)
      if (newValue.centered) this.center()
    }
  },
  computed: {
    dialogStyle () {
      const style = { left: this.left + 'px', top: this.top + 'px' }
      if (this.width) style.width = this.width + 'px'
      if (this.height) style.height = this.height + 'px'
      if (this.zIndex) style.zIndex = this.zIndex
      // if (this.drag) {
      //   style['user-select'] = 'none'
      //   style.cursor = this.dragCursor
      // }
      return style
    }
  },
  methods: {
    mouseOut (event) {
      this.move(event)
    },
    mouseOver (event) {
      setTimeout(this.mouseMove(event), 50)
    },
    close () {
      this.clickButton = 'close'
      this.emit('close')
    },
    mouseDown (event) {
      if (!this.dragging) this.focus()
      if (!this.dropEnabled) {
        if (this.drag) event.preventDefault()
        this.startMove(event)
      }
    },
    mouseMove (event) {
      if (this.dragging && this.drag) {
        setTimeout(this.move(event), 50)
      }
    },
    mouseUp (event) {
      event.preventDefault()
      if (!this.dropEnabled) {
        this.stopMove()
        this.emit('dragEnd')
      }
    },
    stopMove () {
      this.dragging = false
      this.pX = 0
      this.pY = 0
    },
    emit (eventName, data) {
      data = data || {
        id: this.id,
        left: this.left,
        top: this.top,
        x: this.left,
        y: this.top,
        z: this.zIndex,
        width: this.$el.clientWidth,
        height: this.$el.clientHeight
      }
      if (this.eventCb) {
        const ef = this.eventCb
        if (ef && typeof (ef) === 'function') {
          data = ef(data)
        }
      }
      this.$emit(eventName, data)
    },
    move (event) {
      if (this.drag && this.dragEnabled) {
        if (event.clientX === 0) event = this.overEvent // for firefox
        if (event && event.clientX && event.clientY) {
          const x = event.clientX
          const y = event.clientY
          // 边界处理
          const limitLeft = document.body.offsetWidth - this.$el.clientWidth
          const limitTop = document.body.offsetHeight - this.$el.clientHeight
          const left = x + this.offset.x
          const top = y + this.offset.y
          this.left = left < 0 ? 0 : left > limitLeft ? limitLeft : left
          this.top = top < 0 ? 0 : top > limitTop ? limitTop : top
          this.dragging++
          this.emit('move')
        }
      }
    },
    clearSelection () {
      if (document.selection) {
        document.selection.empty()
      } else if (window.getSelection) {
        window.getSelection().removeAllRanges()
      }
    },
    changModel () {
      this.$emit('change-model')
    },
    startMove (event) {
      const x = this.left - event.clientX
      const y = this.top - event.clientY
      this.offset = { x, y }
      this.dragging = 1
      // this.emit('drag-start')
    },
    startClick () {
      this.emit('drag-start')
    },
    focus (event) {
      if (this.drag) this.clearSelection()
      const vm = this
      setTimeout(() => {
        if (!vm.clickButton) vm.emit('focus')
      }, 200)
    },
    center () {
      let wh = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight
      let ww = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth
      ww = ww || this.$parent.$parent.$el.clientWidth
      wh = wh || this.$parent.$parent.$el.clientHeight
      this.left = (ww / 2) - (this.$el.clientWidth / 2)
      this.top = (wh / 2) - (this.$el.clientHeight / 2)
    },
    setDrag () {
      if (this.dragEnabled) {
        this.drag = !this.drag
        this.emit('pin')
      }
    },
    setOptions (options) {
      if (options) {
        if (options.x) options.left = options.x
        if (options.y) options.top = options.y
        if (options.z) options.zIndex = options.z
        this.drag = (this.options.pinned) ? false : this.drag
        // available options
        const ops = this.availableOptions
        for (const op of ops) {
          // eslint-disable-next-line no-prototype-builtins
          if (this.options.hasOwnProperty(op)) {
            this.$set(this, op, this.options[op])
          }
        }
      }
    }
  }
}
</script>

<style lang="scss">
.dialog-drag {
  z-index: 101;
  width: auto;
  position: absolute;
  background:linear-gradient(320deg,rgba(21,30,57,1) 0%,rgba(1,41,87,1) 100%);
  border:1px solid;
  border-image:linear-gradient(139deg, rgba(83,140,206,1), rgba(5,77,125,1)) 1 1;
  height: auto;
  color: #fff;
  .dialog-header {
    position: relative;
    text-align: left;
    padding: 18px 28px 10px;
    line-height:29px;
    font-size:20px;
    color: #fff;
    cursor: move;
    .buttons {
      position: absolute;
      right: 0;
      top: 0;
      margin: 23px 26px 0 0;
      z-index: 105;
    }
    .button {
      display: inline-block;
      width: 20px;
      height: 20px;
      margin-left: 15px;
      cursor: pointer;
      background-repeat: no-repeat;
      background-position: 0 0;
      background-size: contain;
      // &:hover {
      //   color: #1aad8d;
      // }
    }
    .button.changmodel {
      // cursor: pointer;
      background-image: url(./images/unsort.png);
      // background-size: 100% 100%;
    }
    .button.close {
      background-image: url(./images/icon-close.png) ;
      // background-size: 100% 100%;
      // cursor: pointer;
    }
    .button.pin {
      background-image: url(./images/lock.png);
    }
  }
  .dialog-body {
    padding: 1em;
  }
}
.dialog-drag.fixed {
  border-color: #1aad8d;
  user-select: auto;
   .button.pin{
    font-weight: bold;
    background-image: url(./images/unlock.png);
  }
  .dialog-header {
    cursor: default;
  }
}
@keyframes dialog-anim {
  0% {
    opacity: 0;
    transform: scaleX(0.1);
  }
  50% {
    transform: rotate(1deg);
  }
  100% {
    opacity: 1;
  }
}
</style>
