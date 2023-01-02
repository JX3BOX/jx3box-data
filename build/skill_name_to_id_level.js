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
async function readAllSkillIDLevelAndName(client) {
    let logger = baseLogger.job("readAllSkillIDLevelAndName");

    let ret = {};
    logger.info('读取所有技能信息');
    const skillPath = path.join(__dirname, `../raw/${client}/skill.txt`);
    const skillTable = await parseTable(await readFile(skillPath), {
        keepColumns: ['SkillID', 'Level', 'Name'],
    });

    for (let line of skillTable) {
        const skillID = ~~line['SkillID'];
        const skillLevel = ~~line['Level'];

        if (!ret.hasOwnProperty(skillID))
            ret[skillID] = {};
        ret[skillID][skillLevel] = line['Name'];
    }

    logger.info(`共构建 ${Object.keys(ret).length} 条数据`);
    return ret;
}

async function buildSkillNameToIDAndLevel(client, maxSkillLevel, skillIDLevelAndName) {
    let logger = baseLogger.job("buildSkillNameToIDAndLevel");

    let ret = {};
    logger.info('构建技能名称到 ID 与等级反查映射');

    const kungfuSkillPath = path.join(__dirname, `../raw/${client}/skill_kungfu.txt`);
    const kungFuSkillTable = await parseTable(await readFile(kungfuSkillPath), {
        keepColumns: ['Skill'],
    });
    const allKungfuSkills = kungFuSkillTable.reduce((acc, cur) => {
        const skills = (cur['Skill'] || '').trim().replace('|', ';').split(';');
        for (let skill of skills)
            if (skill)
                acc.push(skill);
        return acc;
    }, []);

    for (let skillID of allKungfuSkills) {
        if (skillIDLevelAndName[skillID]) {
            // skill_open_level 或技能表中查不到的取技能表中最大
            let maxLevel = maxSkillLevel[skillID];
            if (!maxLevel || !skillIDLevelAndName[skillID][maxLevel])
                maxLevel = GetMaxKey(skillIDLevelAndName[skillID]);
            ret[skillIDLevelAndName[skillID][maxLevel]] = {
                id: skillID,
                level: maxLevel
            };
        }
    }
    logger.info(`共构建 ${Object.keys(ret).length} 条数据`);
    return ret;
}

async function main(client) {
    let logger = baseLogger;
    try {

        logger.info(`开始构建 ${client} 的技能图标映射数据...`);

        let maxSkillLevel = await readSkillMaxLevel(client);
        let allSkillIDLevelAndName = await readAllSkillIDLevelAndName(client);
        let skillNameToIDLevel = await buildSkillNameToIDAndLevel(client, maxSkillLevel, allSkillIDLevelAndName);
        const skillNameToIDLevelPath = path.join(__dirname, `../data/xf/${client}/skill_name_id_level.json`);
        await writeFile(skillNameToIDLevelPath, JSON.stringify(skillNameToIDLevel, null, 4));

        logger.success();
    } catch (e) {
        logger.fail(e);
    }
    await logger.end();
}

module.exports = client => {
    return async () => {
        baseLogger = initLogger('jx3-data/skill_name_to_id_level');
        await main(client);
    }
};
