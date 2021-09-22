const parse = require('csv-parse/lib/sync')
const fs = require('fs');
const iconv = require("iconv-lite");

let data = fs.readFileSync('./raw/common/MapList.tab')
data = iconv.decode(Buffer.from(data), "gbk");

const records = parse(data, {
    delimiter: "\t",
    columns: true,
    skip_empty_lines: true
})

// fs.writeFileSync('./data/common/maplist.json',JSON.stringify(records))

// console.log(records)
let idmap = []
let mapindex = {}
let mapids = {}
records.forEach((item) => {
    idmap.push({
        DisplayName : item.DisplayName,
        ID : ~~item.ID
    })
    mapindex[item.ID] = item.DisplayName
    mapids[item.DisplayName] = item.ID
})

// console.log(idmap)
fs.writeFileSync('./data/common/map_list.json',JSON.stringify(idmap))
fs.writeFileSync('./data/common/map_index.json',JSON.stringify(mapindex))
fs.writeFileSync('./data/common/map_id.json',JSON.stringify(mapids))





