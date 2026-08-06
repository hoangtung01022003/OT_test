Set WshShell = CreateObject("WScript.Shell")
scriptDir = Left(WScript.ScriptFullName, Len(WScript.ScriptFullName) - Len(WScript.ScriptName))
WshShell.Run "cmd /c cd /d """ & scriptDir & """ && run.bat", 0, False
Set WshShell = Nothing
