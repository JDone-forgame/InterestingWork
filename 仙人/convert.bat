@echo on
set tableconveterPath=convert-win.exe
set excelPath=.\config_dev
set exportCodePath=D:\WorkSpace\InterestingWork\mx-RISHI\defines
set exportJsonPath=D:\WorkSpace\InterestingWork\mx-RISHI\res
%tableconveterPath% -S %excelPath% -O %exportCodePath% -o %exportJsonPath% -L
pause