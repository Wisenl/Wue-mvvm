import Wue from 'Wue'  // webpack 中 配置了路径，可直接写模块名称

window.wm = new Wue({
  el: '#app',
  data: {
    work: 'doctor',
    age: 10,
    son: {name: 'Jobs'},
    arr: [['a','b'], {a: 'a'}, 2, 3]
  },
  watch: {
    age () {
      console.log('age change')
    }
  }
})
setImmediate(()=> {
  // console.log(wm.el)
})
setTimeout(() => {
  wm.work = 'teacher'
  wm.arr[1].a = 'aa'
  wm.$nextTick(() => {
    console.log('nextTick')
  })
  wm.work = '11'
  console.log('xixixi')
  wm.$watch('work', () => {
    console.log('work change')
  })
}, 1000)
