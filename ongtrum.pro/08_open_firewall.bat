@echo off
chcp 65001 >nul
:: Mo cong tuong lua cho Web (80, 443) va port app truc tiep (3000)

echo Yeu cau quyen Administrator de chay lenh nay...
netsh advfirewall firewall add rule name="Allow Web (Port 80)" dir=in action=allow protocol=TCP localport=80
netsh advfirewall firewall add rule name="Allow Secure Web (Port 443)" dir=in action=allow protocol=TCP localport=443
netsh advfirewall firewall add rule name="Allow OngtrumApp (Port 3000)" dir=in action=allow protocol=TCP localport=3000

echo [OK] Da mo cong 80, 443, 3000.
