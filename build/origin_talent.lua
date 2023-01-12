function WorkDir()
    return debug.getinfo(2, "S").source:sub(2):match("(.*\\)")
end

function ExecuteFileGetExport(file)
    local code = loadfile(file)
    local env = {}
    setfenv(code, env)
    code()
    return env
end

function TraverseNestedTable(table, delegate)
    for k, v in pairs(table) do
        if type(v) == "table" then
            TraverseNestedTable(v, delegate)
        else
            delegate(v)
        end
    end
end

local workDir = WorkDir()
local talent = ExecuteFileGetExport(workDir .. "..\\raw\\origin\\TalentTab.lua")["TALENT_TAB"]
local hashTable = {}
TraverseNestedTable(talent, function(i)
    hashTable[i] = true
end)
os.execute("mkdir " .. workDir .. "..\\temp\\ >nul 2>nul")
local output = io.open(workDir .. "..\\temp\\talent.txt", "w")
for i, _ in pairs(hashTable) do
    output:write(tostring(i) .. "\n")
end
output:close()
