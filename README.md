# Kouzelnická výprava s Baltíkem

Statická browserová hra inspirovaná principem Baltíka: dítě skládá jednoduché ikonové příkazy, spustí je a sleduje, jak se malý kouzelník pohybuje po 2D světě.

Aktuální verze už míří víc na dětský herní zážitek než na technické demo. Má kampaň, odemykání misí, hvězdy, drahokamy, náhled plánované trasy, zvuky, nápovědy a oslavu po splnění mise.

Vedle původní 2D hry je nově dostupný také samostatný režim **Baltík 3D: Stínové chodby**. Jde o retro hru z první osoby s vlastním raycastingovým enginem ve stylu počátku devadesátých let. První verze obsahuje tři levely.

## Jak spustit

Stačí otevřít `index.html` v běžném prohlížeči.

Pro lokální testování přes server lze použít například:

```powershell
python -m http.server 4173 --bind 127.0.0.1
```

Pak otevři:

```text
http://127.0.0.1:4173/index.html
```

## Co hra umí

- 6 postupně odemykaných misí
- ikonové příkazy `krok`, `otoč vlevo`, `otoč vpravo`, `kouzlo`
- mise typu dojít do cíle, rozsvítit okna a postavit cihlovou stavbu
- bonusové drahokamy na mapě
- živý náhled trasy ještě před spuštěním programu
- žádný tvrdý limit délky programu; hvězdy jen motivují ke kratším řešením
- úrovně výzvy u každé mise: lehká bez limitu, střední do minima +45 %, těžká do minima +15 %
- krokování, zastavení, undo, smazání programu a rychlé `+3 kroky`
- ukládání postupu do `localStorage`
- hvězdičkové hodnocení podle počtu kroků
- jemné nápovědy po dvou neúspěšných pokusech
- vlastní rodičovská resetovací brána bez systémového popupu
- responzivní UI pro desktop i mobil

## Baltík 3D: Stínové chodby

3D režim se spouští přes odkaz v záhlaví původní hry nebo přímo otevřením `doom-3d/index.html`.

- 3 postupně odemykané levely: Stínová zahrada, Síně beze světla a Citadela Sluneční pečeti
- softwarový raycasting bez knihoven a externích grafických podkladů
- retro nízké rozlišení, procedurálně kreslené sprity, zbraňový HUD, automapa a zvukové efekty
- pohyb pomocí WASD nebo šipek, otáčení myší či Q/E, kouzlo mezerníkem
- runy, magické ohně, několik druhů stínů a finální Strážce
- ovládání na dotykových zařízeních a ukládání postupu do `localStorage`

## Soubory

- `index.html`: struktura hry a ovládání
- `styles.css`: vizuální styl, animace, responsive layout
- `app.js`: levely, herní logika, runner, ukládání, zvuky a náhled programu
- `doom-3d/`: samostatná 3D hra, její tři mapy, raycastingový engine a retro vzhled

## GitHub Pages

Repo je připravené pro statické nasazení z kořene repozitáře.

Veřejná adresa hry:

```text
https://ptasekjan-ai.github.io/Baltik/
```

Pokud se stránka neukazuje, v nastavení repozitáře otevři `Settings > Pages` a nastav zdroj na větev `main` a složku `/ (root)`, případně na GitHub Actions podle aktuální konfigurace repozitáře.
