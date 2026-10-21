$edge = 'C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe'
if (-not (Test-Path $edge)) {
    $edge = 'C:\Program Files\Microsoft\Edge\Application\msedge.exe'
}
Write-Host "Capturing editorial sections with window-size 1440,2000..."
& $edge --headless=new --disable-gpu --enable-webgl --use-gl=angle --use-angle=swiftshader --window-size=1440,2000 --screenshot="E:\M\Anyds\editorial_chapters.png" http://localhost:3000/
Start-Sleep -Seconds 3
Get-Item "E:\M\Anyds\editorial_chapters.png" | Select-Object Name, Length, LastWriteTime
