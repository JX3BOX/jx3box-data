const parse = require('csv-parse/lib/sync')
const fs = require('fs');
const iconv = require("iconv-lite");

// 读取心法与套路关系
let data = fs.readFileSync('./raw/bps/skill_mkungfu_kungfu.txt')
data = iconv.decode(Buffer.from(data), "gbk");

const records = parse(data, {
    delimiter: "\t",
    columns: true,
    skip_empty_lines: true
})

let kungfumap = {}
records.forEach((item) => {
    kungfumap[item.MountKungfu] = {}
    let kungfus = item.Kungfu.split(';')
    kungfumap[item.MountKungfu]['kungfus'] = kungfus
    kungfumap[item.MountKungfu]['skills'] = {}
    kungfus.forEach((K) => {
        kungfumap[item.MountKungfu]['skills'][K] = {}
    })
})

// 读取套路与技能关系
let _data = fs.readFileSync('./raw/bps/skill_kungfu.txt','utf-8')
const _records = parse(_data, {
    delimiter: "\t",
    columns: true,
    skip_empty_lines: true
})
_records.forEach((item) => {
    for(let mount in kungfumap){
        if(kungfumap[mount]['kungfus'].includes(item.KungfuID)){
            // 特殊处理
            let skills = item.Skill.replace(/\|/g,';')
            if(isNaN(skills[0])){
                skills = skills.slice(1)
            }
            if(isNaN(skills[skills.length - 1])){
                skills = skills.slice(0,-1)
            }
            kungfumap[mount]['skills'][item.KungfuID] = skills.split(';')
        }
    }
})
// console.log(kungfumap)
fs.writeFileSync('./data/bps/kungfu.json',JSON.stringify(kungfumap))
