const fs = require('fs');

let root = './raw/fb/'
let list = JSON.parse(fs.readFileSync(`${root}fb_list.json`,'utf-8'))
let _map = {}

for(let level1 of list){
    // console.log(level1)
    _map[level1['devide_name']] = {}
    _map[level1['devide_name']]['name'] = level1['devide_name']
    _map[level1['devide_name']]['level'] = level1['devide_level']
    _map[level1['devide_name']]['dungeon'] = {}
    for(let level2 of level1['dungeon_infos']){
        _map[level1['devide_name']]['dungeon'][level2['name']] = level2
        let cat_id = level2['cat_id']
        let data = JSON.parse(fs.readFileSync(`${root}fb_detail/${cat_id}.json`,'utf-8'))
        level2['detail'] = data
    }
}

fs.writeFileSync('./data/fb/fb_list.json',JSON.stringify(_map))