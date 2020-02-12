// 创建一个可用户发布订阅的类，用于收集依赖，并在恰当的时候触发执行依赖

class Dep {
  constructor () {
    this.id = Dep.id++
    console.log('id:', this.id)
    this.subs = [] // 收集 watcher 作为依赖，如果没有用户手写的 watcher，则只会保存唯一一个渲染 watcher
  }
  static pushTarget(watcher) {
    Dep.stack.push(watcher)
    Dep.target = watcher
    console.log(Dep.target, 'Dep target')
  }
  static popTarget() {
    Dep.stack.pop()
    Dep.target = Dep.stack[Dep.stack.length -1]
  }
  // 收集依赖
  addSub(watcher) {
    this.subs.push(watcher)
  }
  notify() {
    this.subs.forEach(x => x.update())
  }
  depend() {
    Dep.target.addDep(this)
  }
}
Dep.id = 0
Dep.stack = [] // 存放 watcher
Dep.target = null // 当前 watcher
export default Dep
