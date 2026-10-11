$edge = 'C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe'
if (-not (Test-Path $edge)) {
    $edge = 'C:\Program Files\Microsoft\Edge\Application\msedge.exe'
}

Write-Host "Capturing to desktop_hero_v3.png with virtual-time-budget=6000..."
& $edge --headless=new --disable-gpu --enable-webgl --use-gl=angle --use-angle=swiftshader --virtual-time-budget=6000 --window-size=1440,900 --screenshot="E:\M\Anyds\desktop_hero_v3.png" http://localhost:3000/
Start-Sleep -Seconds 3

Get-Item "E:\M\Anyds\desktop_hero_v3.png" | Select-Object Name, Length, LastWriteTime
