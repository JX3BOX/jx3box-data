const parse = require('csv-parse/lib/sync')
const fs = require('fs');

let data = fs.readFileSync('./raw/common/MapList.tab')

const records = parse(data, {
    delimiter: "\t",
    columns: true,
    skip_empty_lines: true
})


fs.writeFileSync('./data/common/maplist.json',JSON.stringify(records))

// console.log(records)

