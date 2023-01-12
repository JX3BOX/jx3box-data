# Data
- raw\NameToIconManual.json: 部分技能~~受 Lua 脚本控制而切换，无法自动从表中解析，需要在此文件手动写入~~为虚技能需要查 `skill_replace` 进行替换，下次一定改

## 更新
- 技能名称及图标映射表：

    #### 共通：
        - ui\Scheme\Case\skill.txt -> raw\{client}\skill.txt
        - ui\Scheme\Case\skill_open_level.txt -> raw\{client}\skill_open_level.txt
        - ui\Scheme\Case\skill_kungfu.txt -> raw\{client}\skill_kungfu.txt
        - ui\Scheme\Case\skill_replace.txt -> raw\{client}\skill_replace.txt
    #### 正式服：
        - ui\Scheme\Case\tenextrapoint.tab -> raw\std\tenextrapoint.tab
    #### 怀旧服：
        - scripts\skill\天赋\TalentTab.lua -> raw\origin\tenextrapoint.tab

## Build
- 技能名称 / ID 到图标：`node index.js skill_icon`
- 技能名称到 ID 与等级：
    正式服：`node index.js skill_name_to_id_level std`
    怀旧服：**（注：怀旧服涉及到已编译的 Lua 脚本，必须使用 Windows 构建）**
    ```
        build/lua51.exe build/origin_talent.lua
        node index.js skill_name_to_id_level origin
    ```

## Todo
+ /fb/fb_map.json 修改正式服/怀旧服状态，新副本ID与BOSS
+ /xf/xf.json  kungfuID为推栏接口内置ID
