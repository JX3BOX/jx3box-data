const parse = require('csv-parse/lib/sync')
const fs = require('fs');

let data = fs.readFileSync('./raw/fb/dungeonnpc.txt')

const records = parse(data, {
    delimiter: "\t",
    columns: true,
    skip_empty_lines: true
})

// fs.writeFileSync('./data/fb/fb_boss.json',JSON.stringify(records))


let arr = []
for(let record of records){
    if(record.NpcID) arr.push(parseInt(record.NpcID))
}
fs.writeFileSync('./data/fb/fb_boss_ids.json',JSON.stringify(arr))

console.log(arr)