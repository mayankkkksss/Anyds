                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    $edge = 'C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe'
if (-not (Test-Path $edge)) {
    $edge = 'C:\Program Files\Microsoft\Edge\Application\msedge.exe'
}

Write-Host "Using Edge at: $edge"

# 1. Desktop Hero (1440x900)
& $edge --headless=new --disable-gpu --enable-webgl --use-gl=angle --use-angle=swiftshader --window-size=1440,900 --screenshot="E:\M\Anyds\desktop_hero_final.png" http://localhost:3000/
Start-Sleep -Seconds 3

# 2. Mobile View (390x844)
& $edge --headless=new --disable-gpu --enable-webgl --use-gl=angle --use-angle=swiftshader --window-size=390,844 --screenshot="E:\M\Anyds\mobile_hero_final.png" http://localhost:3000/
Start-Sleep -Seconds 3

# 3. Full-page Scroll Journey View (1440x4000)
& $edge --headless=new --disable-gpu --enable-webgl --use-gl=angle --use-angle=swiftshader --window-size=1440,4000 --screenshot="E:\M\Anyds\fullpage_v2.png" http://localhost:3000/
Start-Sleep -Seconds 4

Get-Item "E:\M\Anyds\fullpage_v2.png" | Select-Object Name, Length, LastWriteTime
