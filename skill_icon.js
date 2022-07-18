const fs = require("fs");
const csvparse = require("csv-parse");
const iconv = require("iconv-lite");

function Main(args) {
    let skillIDLevelAndIcon = {};

    const fileStream = fs.createReadStream(args[0]);
    const encodingConverter = iconv.decodeStream("gbk");
    const parser = csvparse.parse({
        columns: true,
        delimiter: "\t",
        quote: null
    });

    parser.on("readable", () => {
        while ((line = parser.read()) !== null) {
            const skillID = ~~line["SkillID"];
            const skillLevel = ~~line["Level"];
            const skillIcon = ~~line["IconID"];
            if(!skillIDLevelAndIcon.hasOwnProperty(skillID))
                skillIDLevelAndIcon[skillID] = {};
            skillIDLevelAndIcon[skillID][skillLevel] = skillIcon;
        }
    });
    parser.on("end", () => {
        fs.writeFileSync(args[1], JSON.stringify(skillIDLevelAndIcon));
    });

    fileStream.pipe(encodingConverter).pipe(parser);
}

Main(process.argv.slice(2));
