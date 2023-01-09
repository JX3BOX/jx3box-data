# Data
- raw\NameToIconManual.json: 部分技能~~受 Lua 脚本控制而切换，无法自动从表中解析，需要在此文件手动写入~~为虚技能需要查 `skill_replace` 进行替换，下次一定改

## 更新
- 技能名称及图标映射表：
    - ui\Scheme\Case\skill.txt -> raw\{client}\skill.txt
    - ui\Scheme\Case\skill_open_level.txt -> raw\{client}\skill_open_level.txt
    - ui\Scheme\Case\tenextrapoint.tab -> raw\{client}\tenextrapoint.tab
    - ui\Scheme\Case\skill_kungfu.txt -> raw\{client}\skill_kungfu.txt
    - ui\Scheme\Case\skill_replace.txt -> raw\{client}\skill_replace.txt

## Build
- 技能名称 / ID 到图标：`node index.js skill_icon`
- 技能名称到 ID 与等级：`node index.js skill_name_to_id_level`

## Todo
+ /fb/fb_map.json 修改正式服/怀旧服状态，新副本ID与BOSS
+ /xf/xf.json  kungfuID为推栏接口内置ID
