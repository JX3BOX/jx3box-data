const parse = require('csv-parse/lib/sync')
const fs = require('fs');

let data = fs.readFileSync('./raw/fb/bossindex.txt')

let map = {}
const records = parse(data, {
    delimiter: "\t",
    quote: '"',
    columns: true,
    skip_empty_lines: true,
    ltrim: true, 
    rtrim: true,
})
for(let item of records){
    if(item.OtherName){
        if(!map[item.OtherName]){
            map[item.OtherName] = []
        }
        map[item.OtherName].push({
            mapid :  item.MapID,
            level : item.Layer3Name,
            boss : item.BOSS,
            bossindex : item.BossIndex
        })
    }
}
// console.log(map)
fs.writeFileSync('./data/fb/fb_drop.json',JSON.stringify(map))
