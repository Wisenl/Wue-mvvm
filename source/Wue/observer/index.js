
export default class Observer {
  constructor (data) {
    Observer.walk(data)
  }

  static observe(data, key, val) {
    Observer.walk(val)
    Object.defineProperty(data, key, {
      get() {
        console.log('取值')
        return val
      },
      set(newVal) {
        if (val === newVal) return
        console.log('设值')
        val = newVal
      }
    })
  }

  static walk(data) {
    if (typeof data === 'object' && data !== null) {
      Object.entries(data).map(([key, val]) => {
        Observer.observe(data, key, val)
      })
    }
  }
}
