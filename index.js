#!/usr/bin/env node 

// w-cli -help 帮助
// w-cli -V|--version 版本号
// w-cli list 可操作列表
// w-cli init <template-name> <project-name> 初始化 模板名称 项目名称

// 原生获取用户输入命令
// console.log(process.argv)

const { program } = require('commander'); // 解析指令
const download = require('download-git-repo') // 下载git模板
const handlebars = require('handlebars') // 模板引擎替换内容
const inquirer = require('inquirer') // 用户交互选项
const fs = require('fs')
const ora = require('ora')
const chalk = require('chalk')
const logSymbols = require('log-symbols')

// -V | --version
program
  .version('0.1.0')

const templates = {
  'tpl-a': {
    url: 'https://github.com/WE1ZHANTA0/cli-template',
    downloadUrl: 'WE1ZHANTA0/cli-template',
    desc: 'a模板'
  },
  'tpl-b': {
    url: 'https://github.com/WE1ZHANTA0/cli-template',
    downloadUrl: 'https://github.com/WE1ZHANTA0/cli-template.git',
    desc: 'b模板'
  }
}

program
  .command('init <template> <project>')
  .description('初始化项目模板')
  // .option("-s, --setup_mode [mode]", "Which setup mode to use")
  .action(function(templateName, projectName){
    // 根据模板名称下载对应模板到本地并改名为projectName
    // console.log(templates[templateName])
    const templateObj = templates[templateName]
    console.log(templateObj)
    // loadding提示
    const spinner = ora('正在下载模板...').start()
    download(templateObj.downloadUrl, projectName, (err) => {
      if (err) {
        spinner.fail()
        return
      }
      spinner.succeed()
      // console.log('下载成功')
      // 把项目下package.json文件读取
      // 采集用户输入的值
      // 使用模板引擎
      // 解析替换
      inquirer.prompt([{
        type: 'input',
        name: 'name',
        default: projectName,
        message: '请输入项目名称'
      },{
        type: 'input',
        name: 'description',
        message: '请输入简述'
      },{
        type: 'input',
        name: 'author',
        message: '请输入作者名称'
      }]).then((answers) => {
        // console.log(answers)
        // 解析替换
        const filePath = `${projectName}/package.json`
        const packageContent = fs.readFileSync(filePath, 'utf-8')
        const result = handlebars.compile(packageContent)(answers)
        // console.log(result)
        fs.writeFileSync(filePath, result)
        console.log(logSymbols.success, chalk.green('初始化模板成功'))
      })
    })
  });

program
  .command('list')
  .description('查询所有可用模板')
  .action(() => {
    for (const key in templates) {
      console.log(key, templates[key].desc)
    }
  })

program.parse(process.argv);


