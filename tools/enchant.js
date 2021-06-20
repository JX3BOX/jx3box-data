const fs = require('fs');
const iconv = require("iconv-lite");
const parse = require('csv-parse/lib/sync')

// 大附魔描述
let data = fs.readFileSync('./raw/bps/commonenchant.tab')
data = iconv.decode(Buffer.from(data), "gbk");

let records = parse(data, {
    delimiter: "\t",
    columns: true,
    skip_empty_lines: true,
    quote: null
})

let output = {}
records.forEach((item) => {
    if(item.desc){
        item.desc = item.desc.replace('<text>text="','')
        item.desc = item.desc.replace('" font=12 </text>','')
    }
    output[item.enchant_id] = item.desc
})
// console.log(records)
fs.writeFileSync('./data/bps/enchant.json',JSON.stringify(output))

// 附魔属性
let _data = fs.readFileSync('./raw/bps/Enchant.tab')
_data = iconv.decode(Buffer.from(_data), "gbk");

let _records = parse(_data, {
    delimiter: "\t",
    columns: true,
    skip_empty_lines: true,
    quote: null
})

let _output = {}
_records.forEach((item) => {
    _output[item.ID] = item
})

fs.writeFileSync('./data/bps/_enchant.json',JSON.stringify(_output))
