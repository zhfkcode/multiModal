import flagComponent from './index.vue'

const VueFlagList = {
  install: function (Vue) {
    if (typeof window !== 'undefined' && window.Vue) {
      Vue = window.Vue
    }
    Vue.component('Dialogs', flagComponent)
  }
}

export default VueFlagList
