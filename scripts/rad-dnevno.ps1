# rad-dnevno.ps1 — RAD.xlsx se puni AUTOMATSKI na kraju svakog dana
#
# ZAŠTO POSTOJI (Leon, 2026-09-05): „excel se popunjava na kraju svakog dana, to treba biti automatski."
# Do tada se `scripts/rad-xlsx.py` vrtio rukom na kraju faze — a ono što se vrti rukom, zaboravi se.
# Windows Task Scheduler zove ovu skriptu svaki dan u 23:45 (registracija dolje); ona pokrene generator
# i, ako se knjiga promijenila, commita SAMO nju na tekuću granu. Bez pusha — push na `main` je uvijek
# Leonova riječ (CLAUDE.md pravilo #2), a commit na grani je slobodan.
#
# ŠTO NE RADI NAMJERNO:
#   • ne commita na `main` (kućno pravilo: nikad automatski commit na main) — datoteku svejedno osvježi;
#   • ne pusha; ne dira nijednu drugu datoteku (`git commit -- <putanja>` uzima samo nju iz radnog stabla,
#     ostalo što je u indeksu ostaje u indeksu — bitno zbog indeks-trika na BACKLOG/PROGRESS);
#   • ne bori se s Excelom: ako Leon knjigu drži otvorenu, `save` padne, zapiše se u dnevnik i sutrašnji
#     prolaz nadoknadi sve — generator uvijek čita CIJELI git od 2026-08-29, ništa se ne gubi.
# Propušten dan (stroj ugašen) isto nadoknadi sljedeći prolaz, iz istog razloga.
#
# Dnevnik: .jank/rad-dnevno.log (gitignored). Registracija (jednom, iz PowerShella):
#   schtasks /Create /F /SC DAILY /ST 23:45 /TN "Sokrat RAD.xlsx" /TR "powershell.exe -NoProfile -ExecutionPolicy Bypass -WindowStyle Hidden -File \"<repo>\scripts\rad-dnevno.ps1\""
# Ukloni: schtasks /Delete /F /TN "Sokrat RAD.xlsx"    · Pokreni odmah: schtasks /Run /TN "Sokrat RAD.xlsx"
# Ručno i dalje radi: PYTHONUTF8=1 python scripts/rad-xlsx.py

$ErrorActionPreference = 'Stop'
$Repo = Split-Path -Parent $PSScriptRoot
Set-Location $Repo
$Log = Join-Path $Repo '.jank\rad-dnevno.log'
New-Item -ItemType Directory -Force (Split-Path $Log) | Out-Null
function Zapisi([string]$s) { Add-Content -Path $Log -Value ("{0}  {1}" -f (Get-Date -Format 'yyyy-MM-dd HH:mm:ss'), $s) }

try {
    $env:PYTHONUTF8 = '1'
    # Generator ispisuje emoji/strelice; bez ovoga dnevnik dobije cp1252 mrlje umjesto znakova.
    [Console]::OutputEncoding = [System.Text.Encoding]::UTF8
    $env:PYTHONIOENCODING = 'utf-8'
    # Task Scheduler ne mora imati isti PATH kao terminal: `python`, pa `py -3` kao rezerva.
    $py = (Get-Command python -ErrorAction SilentlyContinue).Source
    $pyArgs = @('scripts/rad-xlsx.py')
    if (-not $py) { $py = (Get-Command py -ErrorAction SilentlyContinue).Source; $pyArgs = @('-3') + $pyArgs }
    if (-not $py) { Zapisi 'GENERATOR PAO: ni python ni py nisu na PATH-u'; exit 1 }
    $out = & $py @pyArgs 2>&1
    if ($LASTEXITCODE -ne 0) { Zapisi ("GENERATOR PAO ({0}): {1}" -f $LASTEXITCODE, (($out | Select-Object -Last 3) -join ' | ')); exit 1 }
    Zapisi ("generator OK: {0}" -f (($out | Select-Object -Last 1) -join ''))

    $grana = (& git branch --show-current | Out-String).Trim()
    $promjena = & git status --porcelain -- docs/records/RAD.xlsx
    if (-not $promjena) { Zapisi 'RAD.xlsx nepromijenjen - nema commita'; exit 0 }
    if (-not $grana -or $grana -eq 'main') { Zapisi ("grana '{0}' - knjiga osvjezena, commit PRESKOCEN (na main se ne commita automatski)" -f $grana); exit 0 }

    $poruka = 'rad: dnevni zapis {0} (automatski, scripts/rad-dnevno.ps1)' -f (Get-Date -Format 'yyyy-MM-dd')
    & git commit -q -m $poruka -- docs/records/RAD.xlsx 2>&1 | Out-Null
    if ($LASTEXITCODE -ne 0) { Zapisi ("COMMIT PAO ({0})" -f $LASTEXITCODE); exit 1 }
    Zapisi ("commit na '{0}': {1}" -f $grana, ((& git log -1 --format='%h %s') -join ''))
    exit 0
} catch {
    Zapisi ("GRESKA: {0}" -f $_.Exception.Message)
    exit 1
}
