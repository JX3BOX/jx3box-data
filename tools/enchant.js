const fs = require('fs');
const iconv = require("iconv-lite");
const parse = require('csv-parse/lib/sync')

let data = fs.readFileSync('./raw/bps/commonenchant.tab')
data = iconv.decode(Buffer.from(data), "gbk");

let records = parse(data, {
    delimiter: "\t",
    columns: true,
    skip_empty_lines: true,
    quote: null
})

records.forEach((item) => {
    item.desc = item.desc.replace('<text>text="','')
    item.desc = item.desc.replace('" font=12 </text>','')
})
// console.log(records)

fs.writeFileSync('./data/bps/enchant.json',JSON.stringify(records))