import Wue from 'Wue'  // webpack 中 配置了路径，可直接写模块名称

window.wm = new Wue({
  el: '#app',
  data: {
    work: 'doctor',
    age: 10,
    son: {name: 'Jobs'},
    arr: [['a','b'], {a: 'a'}, 2, 3],
    day: '10',
    time: '10:10'
  },
  watch: {
    age () {
      console.log('age change')
    },
    work: {
      handler(n, o) { console.log('work changed', n, o)},
      immediate: true
    }
  },
  computed: {
    date () {
      return this.day + '-' + this.time
    }
  }
})
setImmediate(()=> {
  // console.log(wm.el)
})
setTimeout(() => {
  wm.work = 'teacher'
  wm.arr[1].a = 'aa'
  // wm.$nextTick(() => {
  //   console.log('nextTick')
  // })
  wm.work = '11'
  wm.$watch('son', () => {
    console.log('son change')
  })
}, 1000)
