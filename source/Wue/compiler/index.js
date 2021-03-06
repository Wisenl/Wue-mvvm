export function getWmValue (wm, str) { // son.name
  const keys = str.split('.') // [son, name]
  return keys.reduce((res, curr) => {
    res = res[curr]
    return res
  }, wm)
}

function compile(fragmentEl, wm) {
  Array.from(fragmentEl.childNodes).forEach(x => {
    if (x.nodeType === 3) {
      if (!x.temp) {
        x.temp = x.textContent
      }
      x.textContent = x.temp.replace(/\{\{((?:.|\r?\n)+?)\}\}/g, function (...args) {
        return getWmValue(wm, args[1].trim())
      })
    } else if (x.nodeType === 1) {
      compile(x, wm)
    }
  })
}

export default function (wm) {
  let fragmentEl = document.createDocumentFragment()
  let childEl
  while (childEl = wm.$el.firstChild) {
    fragmentEl.appendChild(childEl)
  }
  compile(fragmentEl, wm)
  wm.$el.appendChild(fragmentEl)
}
