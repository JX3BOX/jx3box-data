const { initLogger } = require('@jx3box/jx3box-build-common/logger');

/** @type {Object<string, Object<string, Function>>} */
const support_field = {
    skill_icon: {
        std: require('./build/skill_icon.js')('std'),
        origin: require('./build/skill_icon.js')('origin'),
    },

};

let build_fields = process.argv[2]?.split(',');
let build_clients = process.argv[3]
    ? process.argv[3].split(',')
    : ['std', 'origin', 'all'];
const logger = initLogger('jx3-data/main');
(async () => {
    if (!build_fields || build_fields.length == 0)
        build_fields = Object.keys(support_field);
        logger.info(
        `开始构建，本次构建包括${build_clients.join(
            ','
        )}客户端的以下表：${build_fields.join(',')}`
    );
    for (let build_field of build_fields) {
        if (!support_field.hasOwnProperty(build_field)) {
            logger.warn(`警告：${build_field}表的解包数据构建暂未受到支持`);
            continue;
        }
        let build_scripts = support_field[build_field];
        for (let build_client of build_clients) {
            if (!build_scripts.hasOwnProperty(build_client)) {
                continue;
            }
            logger.info(`执行：${build_field}:${build_client}`);
            let script = build_scripts[build_client];
            await script();
        }
    }
    logger.success('构建完成');
    await logger.end();
})();
