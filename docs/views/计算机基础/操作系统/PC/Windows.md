# Window

## window bat 批处理命令

- 读取文件并输出

```vb

@echo off
for /f "delims=*" %%i in (hello.csv) do (
	echo %%i
)

pause
```

- 要读取第二行只需要设置一个行数 flag，在行数为 2 的时候就输出文件内容

```vb
@echo off & setlocal enabledelayedexpansion

set lineFlag=0
for /f "delims=*" %%i in (text.txt) do (
set /a lineFlag+=1
  if !lineFlag!==2 (
    set lineContent=%%i
    echo !lineContent!
  )
)

pause
```

- 读取文件到新文件中

```vb
@echo off & color & setlocal enabledelayedexpansion
chcp 65001
:: 直接在代码中声明编码，65001是UTF-8的编码
set lineIndex=0
set lineContent=0
set filePath=22111517_ECOM_P00000130_IN_100_20221115_1511.csv
for /f "delims=*" %%i in (!filePath!) do (
	echo %%i>>"1.csv"
)
pause
```

- 字符串截取

```vb
@echo off & setlocal

set str=This is a string function demo.
:: 倒数第5位开始，取4位
echo %str:~-5,4%

pause
```

- 字符串替换

```vb
@echo off & setlocal
chcp 65001
set str=This is a string function demo.
echo %time%

echo 替换前：str=%str%
echo 空格换#：str=%str: =#%

pause
```

- 文件读取并替换

```vb
@echo off & color & setlocal enabledelayedexpansion
chcp 65001
set filePath=22111517_ECOM_P00000130_IN_100_20221115_1511.csv
for /f "delims=*" %%i in (!filePath!) do (
	set str=%%i
	set str=!str:2022-11-15=2023-01-04!
	set str=!str:add=app!
	echo !str!>>"1.csv"
)
pause
```
