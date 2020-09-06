const parse = require('csv-parse/lib/sync')
const fs = require("fs");

let data = fs.readFileSync("./raw/house/landinfo.txt");
let record = parse(data, { delimiter: "\t", quote: null });
let housedata = {
    '455' : [],
    '471' : [],
    '486' : []
}
record.forEach((item, i) => {
    let house = {
        x:0,
        y:0,
        name: "",
        area: 0,
        price : 0,
    };
    if (i > 1) {
        house.name = item[3] + item[2];
        house.area = parseInt(item[6]);
        house.price = parseInt(item[8]);
        house.x = parseInt(item[10]);
        house.y = parseInt(item[11]);
        let mapid = item[0]

        housedata[mapid].push(house)
    }
});
fs.writeFileSync('./data/house/area.json',JSON.stringify(housedata))
