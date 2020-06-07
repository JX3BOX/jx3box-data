const parse = require('csv-parse/lib/sync')
const fs = require("fs");

let data = fs.readFileSync("./raw/house/landinfo.txt");
let record = parse(data, { delimiter: "\t", quote: null });
let housedata = []
record.forEach((item, i) => {
    let house = {
        style: {
            width: 10,
            height: 10,
            left: 0,
            top: 0,
        },
        name: "",
        link: "#",
        area: 0,
    };
    if (i > 1) {
        house.name = item[3] + item[2];
        house.area = parseInt(item[6]);
        house.style.left = parseInt(item[10]);
        house.style.top = parseInt(item[11]);

        housedata.push(house)
    }
});
let all = {
    '广陵邑' : []
}
all.广陵邑 = housedata
// console.log(all)
fs.writeFileSync('./data/house/area.json',JSON.stringify(all))
