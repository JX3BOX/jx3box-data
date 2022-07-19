const fs = require("fs");
const path = require("path");
const csvparse = require("csv-parse/sync");
const iconv = require("iconv-lite");

function GetValueFromMaxKey(obj) {
    return Object.entries(obj).sort((x, y) => ~~y[0] - ~~x[0])[0][1];
}

function Main(args) {
    let skillIDToName = {};
    let skillIDLevelAndIcon = {};
    let skillNameAndIcon = {};

    /* 1. 所有技能 ID 与 Level 转 IconID */
    // 读所有技能 ID 等级与图标数据
    const skillTable = csvparse.parse(iconv.decode(fs.readFileSync(path.join(args[0], "skill.txt"), "binary"), "gbk"), {
        columns: true,
        delimiter: "\t",
        quote: null
    });
    // 构建技能 ID 与等级到图标的映射，以及 ID 到名称的映射以用于后面心法查询
    skillTable.forEach(line => {
        const skillID = ~~line["SkillID"];
        const skillLevel = ~~line["Level"];
        const skillIcon = ~~line["IconID"];
        if(!skillIDLevelAndIcon.hasOwnProperty(skillID))
            skillIDLevelAndIcon[skillID] = {};
        skillIDLevelAndIcon[skillID][skillLevel] = skillIcon;
        skillIDToName[skillID] = line["Name"];
    });

    /* 2. 玩家技能与奇穴名称转 IconID */
    // 读所有心法对应面板技能表
    const kungFuSkillTable = csvparse.parse(iconv.decode(fs.readFileSync(path.join(args[0], "skill_kungfu.txt"), "binary"), "gbk"), {
        columns: true,
        delimiter: "\t",
        quote: null
    });
    kungFuSkillTable.forEach(line => {
        let skills = (line["Skill"] || "").trim().replace("|", ";").split(";");
        skills.forEach(skill => {
            if(skill && skillIDToName[skill])
                skillNameAndIcon[skillIDToName[skill]] = GetValueFromMaxKey(skillIDLevelAndIcon[skill]);
        });
    });
    // 读所有心法对应奇穴技能表
    const tenExtraPointsTable = csvparse.parse(iconv.decode(fs.readFileSync(path.join(args[0], "tenextrapoint.tab"), "binary"), "gbk"), {
        columns: true,
        delimiter: "\t",
        quote: null
    });
    tenExtraPointsTable.forEach(line => {
        for(let i = 1; i <= 5; ++i) {
            const skillID = line[`SkillID${i}`];
            const skillLevel = line[`SkillLevel${i}`];
            if(skillID && skillLevel) {
                const skillName = skillIDToName[skillID];
                if(skillName)
                    skillNameAndIcon[skillName] = skillIDLevelAndIcon[skillID][skillLevel];
            }
        }
    });

    fs.writeFileSync(path.join(args[1], "skill_id_icon.json"), JSON.stringify(skillIDLevelAndIcon, null, 4));
    fs.writeFileSync(path.join(args[1], "skill_name_icon.json"), JSON.stringify(skillNameAndIcon, null, 4));
}

iconv.skipDecodeWarning = true;
Main(process.argv.slice(2));
