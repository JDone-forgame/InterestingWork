@echo on
set tableconveterPath=convert-win.exe
set excelPath=.\config_dev
set exportCodePath=D:\WorkSpace\mx-RISHI\defines
set exportJsonPath=D:\WorkSpace\mx-RISHI\res
%tableconveterPath% -S %excelPath% -O %exportCodePath% -o %exportJsonPath% -L
pause