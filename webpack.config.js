const webpack = require("webpack")
const glob = require("glob")

function getEntry() {
  const entry = {}
  // src目录下所有的页面获取
  glob.sync('./src/page/*/*/index.js')
    .forEach(item => {
      let name = item.match(/\/pages\/(.+)\/index.js/)
      name = name[1]
      entry[name] = item
    })

  return entry
}

module.exports = {
  entry: getEntry()
}
