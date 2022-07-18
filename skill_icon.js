const fs = require("fs");
const path = require("path");
const csvparse = require("csv-parse");
const iconv = require("iconv-lite");

function Main(args) {
    let skillIDLevelAndIcon = {};
    let skillNameAndIcon = {};

    const fileStream = fs.createReadStream(args[0]);
    const encodingConverter = iconv.decodeStream("gbk");
    const parser = csvparse.parse({
        columns: true,
        delimiter: "\t",
        quote: null
    });

    parser.on("readable", () => {
        while ((line = parser.read()) !== null) {
            const skillName = line["Name"];
            const skillID = ~~line["SkillID"];
            const skillLevel = ~~line["Level"];
            const skillIcon = ~~line["IconID"];
            if(!skillIDLevelAndIcon.hasOwnProperty(skillID))
                skillIDLevelAndIcon[skillID] = {};
            skillIDLevelAndIcon[skillID][skillLevel] = skillIcon;
            if(skillIcon != 0) {
                if(!skillNameAndIcon.hasOwnProperty(skillName) || skillLevel > skillNameAndIcon[skillName][0])
                    skillNameAndIcon[skillName] = [skillLevel, skillIcon];
            }
        }
    });
    parser.on("end", () => {
        fs.writeFileSync(path.join(args[1], "skill_id_icon.json"), JSON.stringify(skillIDLevelAndIcon));
        Object.keys(skillNameAndIcon).map(key => {
            skillNameAndIcon[key] = skillNameAndIcon[key][1];
        });
        fs.writeFileSync(path.join(args[1], "skill_name_icon.json"), JSON.stringify(skillNameAndIcon));
    });

    fileStream.pipe(encodingConverter).pipe(parser);
}

Main(process.argv.slice(2));
