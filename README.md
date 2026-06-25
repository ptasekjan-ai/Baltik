# Kouzelnická výprava s Baltíkem

Statická browserová hra inspirovaná principem Baltíka: dítě skládá jednoduché ikonové příkazy, spustí je a sleduje, jak se malý kouzelník pohybuje po 2D světě.

Aktuální verze už míří víc na dětský herní zážitek než na technické demo. Má kampaň, odemykání misí, hvězdy, drahokamy, náhled plánované trasy, zvuky, nápovědy a oslavu po splnění mise.

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
- krokování, zastavení, undo, smazání programu a rychlé `+3 kroky`
- ukládání postupu do `localStorage`
- hvězdičkové hodnocení podle počtu kroků
- jemné nápovědy po dvou neúspěšných pokusech
- vlastní rodičovská resetovací brána bez systémového popupu
- responzivní UI pro desktop i mobil

## Soubory

- `index.html`: struktura hry a ovládání
- `styles.css`: vizuální styl, animace, responsive layout
- `app.js`: levely, herní logika, runner, ukládání, zvuky a náhled programu

## GitHub Pages

Repo je připravené pro statické nasazení z kořene repozitáře.

Veřejná adresa hry:

```text
https://ptasekjan-ai.github.io/Baltik/
```

Pokud se stránka neukazuje, v nastavení repozitáře otevři `Settings > Pages` a nastav zdroj na větev `main` a složku `/ (root)`, případně na GitHub Actions podle aktuální konfigurace repozitáře.
