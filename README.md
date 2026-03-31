# Kouzelník Baltík Web

Hratelný browserový prototyp inspirovaný analýzou původního světa Baltík/Baltazar. Cílem bylo zachovat to nejdůležitější:

- malý 2D svět na mřížce
- kouzelníka jako vykonavatele vůle dítěte
- skládání ikonových příkazů
- okamžité přehrání a ladění pozorováním
- jednoduché dětské mise místo složitého menu a technického balastu
- lehkou puzzle vrstvu přes limit kouzel v každé misi

## Co tu je teď

- `index.html`: rozhraní hry
- `styles.css`: dětsky čitelný fantasy vzhled bez závislostí
- `app.js`: herní logika, levely, program builder, runner, nápovědy a ukládání do `localStorage`

## Jak to spustit

Stačí otevřít `index.html` v běžném webovém prohlížeči.

Žádný build krok není potřeba. To je záměr, protože v aktuálním prostředí nejsou dostupné Node ani Python nástroje.

## GitHub Pages

Repo je připravené pro GitHub Pages dvěma způsoby:

- staticky z větve `main`
- automaticky přes workflow v `.github/workflows/deploy-pages.yml`

Veřejná adresa hry je:

- `https://ptasekjan-ai.github.io/Baltik/`

Pokud se stránka ještě neukazuje, v nastavení repozitáře otevři `Settings > Pages` a nastav zdroj na `GitHub Actions` nebo `Deploy from a branch` s větví `main` a složkou `/ (root)`.

## Co umí současná verze

- 6 misí:
  - 2 bludiště
  - 2 rozsvěcovací mise
  - 2 stavební mise
- příkazy `MOVE`, `TURN_LEFT`, `TURN_RIGHT`, `CAST`
- limit kouzel v každé misi
- tlačítka `Spustit`, `Krok`, `Stop`, `Reset mise`, `Zpět`, `Smazat vše`
- kliknutí na jednotlivý krok v programu pro jeho smazání
- lokální ukládání průchodu a hvězdiček
- jemné nápovědy po dvou neúspěšných pokusech
- rodičovská brána pro reset postupu
- klávesové zkratky pro rychlé skládání programu

## Směr další iterace

- přidat skutečné bloky `opakuj` a `když`
- doplnit vlastní sprites a animace místo placeholder stylů
- přidat volné tvoření a editor scén
- export obrázku nebo krátké animace hotové scény
- později případně převést do PWA nebo frameworkové verze
