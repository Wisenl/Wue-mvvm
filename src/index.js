import Wue from 'Wue'  // webpack 中 配置了路径，可直接写模块名称

window.wm = new Wue({
  el: '#app',
  data: {
    work: 'doctor',
    age: 10,
    sun: {name: 'Jobs'},
    arr: []
  }
})
console.log('this', this)
setImmediate(()=> {
  // console.log(wm.el)
})
