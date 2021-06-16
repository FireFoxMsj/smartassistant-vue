/* eslint-disable */
const shell = require('shelljs')

const args = process.argv.splice(2)
const plugin = args[0]
const mode = args[1]
// 本地测试插件代码
// const serve = `vue-cli-service serve --open plugins/${plugin}/main.js`
// console.log(serve, 99)
// const build = `vue-cli-service build plugins/${plugin}/main.js`
// shell.cd('C:\project\zhiting-smart')
// shell.exec('vue-cli-service serve')
// 读取package.json文件
const path = require('path') // 系统路径模块
const fs = require('fs')
// 文件模块
const file = path.join(__dirname, 'package.json') // 文件路径，__dirname为当前运行js文件的目录
let modelData = fs.readFileSync(file, 'utf-8')
modelData = JSON.parse(modelData)
// 添加插件脚本命令
if (mode === 'build') {
  // 打包插件
  modelData.scripts['build:plugin'] = `vue-cli-service build plugins/${plugin}/main.js`
} else {
  // 本地调试
  modelData.scripts['serve:plugin'] = `vue-cli-service serve --open plugins/${plugin}/main.js`
}

// 写文件
fs.writeFileSync(file, JSON.stringify(modelData, null, '\t'))
process.env.PLUGIN_NAME = plugin
// 执行插件脚本
if (mode === 'build') {
  shell.exec('npm run build:plugin')
} else {
  shell.exec('npm run serve:plugin')
}
// console.log(JSON.stringify(modelData))
