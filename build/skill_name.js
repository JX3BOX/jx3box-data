const path = require('path');
const { exists, readFile, parseTable, writeFile } = require('@jx3box/jx3box-build-common/file');
const { initLogger } = require('@jx3box/jx3box-build-common/logger');

let baseLogger = null;

function GetMaxKey(obj) {
    return Object.entries(obj).sort((x, y) => ~~y[0] - ~~x[0])[0][0];
}

/**
 * 读取所有技能最大等级
 */
async function readSkillMaxLevel(client) {
    let logger = baseLogger.job("readSkillMaxLevel");

    let ret = {};
    logger.info('读取所有技能最大等级');

    const skillOpenLevelPath = path.join(__dirname, `../raw/${client}/skill_open_level.txt`);
    const skillMaxLevelTable = await parseTable(await readFile(skillOpenLevelPath), {
        keepColumns: ['SkillID', 'SkillLevel'],
    });

    for (let line of skillMaxLevelTable) {
        const skillID = line['SkillID'];
        const skillLevel = line['SkillLevel'];
        if (!ret.hasOwnProperty(skillID) || ret[skillID] < skillLevel) {
            ret[skillID] = skillLevel;
        }
    }

    logger.info(`共读取 ${skillMaxLevelTable.length} 条数据`);
    return ret;
}

/**
 * 读取与构建所有技能 ID 与等级到技能名称的映射
 */
async function readAllSkillName(client) {
    let logger = baseLogger.job("buildSkillIDAndLevelToIconID");

    let skillIDLevelAndIcon = {}, skillIDLevelToName = {};
    logger.info('读取所有技能信息');
    const skillPath = path.join(__dirname, `../raw/${client}/skill.txt`);
    const skillTable = await parseTable(await readFile(skillPath), {
        keepColumns: ['SkillID', 'Level', 'IconID', 'Name'],
    });

    for (let line of skillTable) {
        const skillID = ~~line['SkillID'];
        const skillLevel = ~~line['Level'];
        const skillIcon = ~~line['IconID'];

        if(!skillIDLevelAndIcon.hasOwnProperty(skillID))
            skillIDLevelAndIcon[skillID] = {};
        skillIDLevelAndIcon[skillID][skillLevel] = skillIcon;

        if(!skillIDLevelToName.hasOwnProperty(skillID))
            skillIDLevelToName[skillID] = {};
        skillIDLevelToName[skillID][skillLevel] = line["Name"];
    }

    logger.info(`共构建 ${Object.keys(skillIDLevelAndIcon).length} / ${Object.keys(skillIDLevelToName).length} 条数据`);
    return {
        skillIDLevelAndIcon,
        skillIDLevelToName
    };
}

async function buildPlayerSkillNameToIconID(client, maxSkillLevel, skillIDLevelAndIcon, skillIDLevelToName) {
    let logger = baseLogger.job("buildSkillNameToIconID");
 
    let skillNameAndIcon = {};
    logger.info('读取玩家心法技能');

    const kungfuSkillPath = path.join(__dirname, `../raw/${client}/skill_kungfu.txt`);
    const kungFuSkillTable = await parseTable(await readFile(kungfuSkillPath), {
        keepColumns: ['Skill'],
    });

    for (let line of kungFuSkillTable) {
        const skills = (line['Skill'] || '').trim().replace('|', ';').split(';');
        for(let skill of skills) {
            // 技能表中首先要存在
            if (skill && skillIDLevelAndIcon[skill]) {
                // 如果有定义的最大等级就用定义的 否则用 Level = 0 再否则用 SkillID 里面 Level 最大的
                let maxLevel = maxSkillLevel[skill]
                if (!maxLevel || !skillIDLevelAndIcon[skill][maxLevel]) {
                    maxLevel = 0;
                    if (!skillIDLevelAndIcon[skill][maxLevel])
                        maxLevel = GetMaxKey(skillIDLevelAndIcon[skill]);
                }
                const skillName = skillIDLevelToName[skill][maxLevel];
                skillNameAndIcon[skillName] = skillIDLevelAndIcon[skill][maxLevel];
            }
        }
    }

    logger.info('读取玩家心法奇穴');
    const tenextraPointPath = path.join(__dirname, `../raw/${client}/tenextrapoint.tab`);
    const tenExtraPointsTable = await parseTable(await readFile(tenextraPointPath));
    for (let line of tenExtraPointsTable) {
        for (let i = 1; i <= 5; ++i) {
            const skillID = line[`SkillID${i}`];
            const skillLevel = line[`SkillLevel${i}`];
            if (skillID && skillLevel) {
                const skillName = skillIDLevelToName[skillID][skillLevel];
                if (skillName)
                    skillNameAndIcon[skillName] = skillIDLevelAndIcon[skillID][skillLevel];
            }
        }
    }

    logger.info('读取手动追加数据');
    const manualNameToIconPath = path.join(__dirname, `../raw/${client}/NameToIconManual.json`);
    if (await exists(manualNameToIconPath)) {
        const manualNameToIcon = JSON.parse(await readFile(manualNameToIconPath, 'utf8'));
        skillNameAndIcon = { ...skillNameAndIcon, ...manualNameToIcon };
    }

    logger.info(`共构建 ${Object.keys(skillNameAndIcon).length} 条数据`);
    return skillNameAndIcon;
}

async function main(client) {
    let logger = baseLogger;
    try {

        logger.info(`开始构建 ${client} 的技能图标映射数据...`);

        let maxSkillLevel = await readSkillMaxLevel(client);
        let { skillIDLevelAndIcon, skillIDLevelToName } = await readAllSkillName(client);
        let skillNameAndIcon = await buildPlayerSkillNameToIconID(client, maxSkillLevel, skillIDLevelAndIcon, skillIDLevelToName);

        const skillIDLevelAndIconOutputPath = path.join(__dirname, `../data/xf/skill_id_icon_${client}.json`);
        const skillNameAndIconOutputPath = path.join(__dirname, `../data/xf/skill_name_icon_${client}.json`);
        await writeFile(skillIDLevelAndIconOutputPath, JSON.stringify(skillIDLevelAndIcon, null, 4));
        await writeFile(skillNameAndIconOutputPath, JSON.stringify(skillNameAndIcon, null, 4));

        logger.success();
    } catch (e) {
        logger.fail(e);
    }
    await logger.end();
}

module.exports = client => {
    return async () => {
        baseLogger = initLogger('jx3-data/skill_name');
        await main(client);
    }
};
