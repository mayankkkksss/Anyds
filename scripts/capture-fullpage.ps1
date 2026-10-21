$edge = 'C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe'
if (-not (Test-Path $edge)) {
    $edge = 'C:\Program Files\Microsoft\Edge\Application\msedge.exe'
}

# 1. Desktop hero (1440x900)
& $edge --headless=new --disable-gpu --enable-webgl --use-gl=angle --use-angle=swiftshader --window-size=1440,900 --screenshot=E:\M\Anyds\desktop_view.png http://localhost:3000/
Start-Sleep -Seconds 3

# 2. Mobile view (390x844)
& $edge --headless=new --disable-gpu --enable-webgl --use-gl=angle --use-angle=swiftshader --window-size=390,844 --screenshot=E:\M\Anyds\mobile_view.png http://localhost:3000/
Start-Sleep -Seconds 3

# 3. Full-page Editorial Scroll (1440x3600)
& $edge --headless=new --disable-gpu --enable-webgl --use-gl=angle --use-angle=swiftshader --window-size=1440,3600 --screenshot=E:\M\Anyds\fullpage_view.png http://localhost:3000/
Start-Sleep -Seconds 3

Get-Item "E:\M\Anyds\*_view.png" | Select-Object Name, Length, LastWriteTime
