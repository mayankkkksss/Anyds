$edge = 'C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe'
if (-not (Test-Path $edge)) {
    $edge = 'C:\Program Files\Microsoft\Edge\Application\msedge.exe'
}

# 1. Desktop hero
& $edge --headless=new --disable-gpu --enable-webgl --use-gl=angle --use-angle=swiftshader --window-size=1440,900 --screenshot http://localhost:3000/
Start-Sleep -Seconds 2
if (Test-Path "screenshot.png") {
    Move-Item -Path "screenshot.png" -Destination "E:\M\Anyds\desktop_hero_final.png" -Force
}

# 2. Mobile view
& $edge --headless=new --disable-gpu --enable-webgl --use-gl=angle --use-angle=swiftshader --window-size=390,844 --screenshot http://localhost:3000/
Start-Sleep -Seconds 2
if (Test-Path "screenshot.png") {
    Move-Item -Path "screenshot.png" -Destination "E:\M\Anyds\mobile_hero_final.png" -Force
}

Get-Item "E:\M\Anyds\*_final.png" | Select-Object Name, Length, LastWriteTime
