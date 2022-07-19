# Data
- raw\NameToIconManual.json: 部分技能受 Lua 脚本控制而切换，无法自动从表中解析，需要在此文件手动写入

## 更新
- 技能对应图标：
    - ui\Scheme\Case\skill.txt -> raw\skill.txt
    - ui\Scheme\Case\skill_open_level.txt -> raw\skill_open_level.txt
    - ui\Scheme\Case\tenextrapoint.tab -> raw\tenextrapoint.tab
    - ui\Scheme\Case\skill_kungfu.txt -> raw\skill_kungfu.txt

## Build
- 技能对应图标：`npm run skillicon`

## Todo
+ /fb/fb_map.json 修改正式服/怀旧服状态，新副本ID与BOSS
+ /xf/xf.json  kungfuID为推栏接口内置ID
