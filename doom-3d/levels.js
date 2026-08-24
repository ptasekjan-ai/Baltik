export const LEVELS = [
  {
    id: "shadow-garden",
    code: "E1M1",
    number: "01",
    title: "Stínová zahrada",
    shortGoal: "Najdi tři runy",
    brief: "Známá zahrada zmizela pod kamennou klenbou. Tři modré runy znovu probudí výstupní portál.",
    goalText: "Najdi tři ztracené runy a vstup do portálu.",
    hint: "Runy zpívají a lehce se vznášejí. Rozhlížej se i v bočních chodbách.",
    goal: { type: "collect", required: 3, noun: "Runy" },
    start: { x: 1.5, y: 13.5, angle: -0.08 },
    colors: {
      sky: "#12152c",
      ceiling: "#24213a",
      floor: "#40372d",
      fog: [18, 18, 31],
      accent: "#64e8ff",
    },
    map: [
      "################",
      "#......#.......#",
      "#.####.#.#####.#",
      "#.#....#.....#.#",
      "#.#.######.#.#.#",
      "#.#........#...#",
      "#.######.#####.#",
      "#......#.......#",
      "######.#.#####.#",
      "#......#.....#.#",
      "#.#########.#..#",
      "#.........#....#",
      "#.#######.####.#",
      "#..............#",
      "################",
    ],
    entities: [
      { type: "portal", x: 13.5, y: 1.5 },
      { type: "rune", x: 3.5, y: 11.5 },
      { type: "rune", x: 7.5, y: 5.5 },
      { type: "rune", x: 14.5, y: 3.5 },
      { type: "enemy", variant: "wisp", x: 8.5, y: 13.5, hp: 2 },
      { type: "enemy", variant: "wisp", x: 10.5, y: 7.5, hp: 2 },
      { type: "enemy", variant: "wisp", x: 12.5, y: 3.5, hp: 2 },
      { type: "health", x: 1.5, y: 7.5 },
      { type: "mana", x: 10.5, y: 5.5 },
    ],
  },
  {
    id: "ember-halls",
    code: "E1M2",
    number: "02",
    title: "Síně beze světla",
    shortGoal: "Rozžehni čtyři ohně",
    brief: "Městská světla zhasla. Čtyři kamenné ohně čekají na zásah jiskrovým kouzlem.",
    goalText: "Najdi a kouzlem rozžehni všechny čtyři ohně.",
    hint: "Míř na studený kamenný pohár. Když se rozhoří, uslyšíš hluboký tón.",
    goal: { type: "ignite", required: 4, noun: "Ohně" },
    start: { x: 1.5, y: 13.5, angle: 0 },
    colors: {
      sky: "#1c0e18",
      ceiling: "#30202a",
      floor: "#4a2e24",
      fog: [25, 12, 18],
      accent: "#ffb13d",
    },
    map: [
      "BBBBBBBBBBBBBBBB",
      "B......B.......B",
      "B.BBB..B.BBBBB.B",
      "B.B....B.....B.B",
      "B.B.BBBBBB.B.B.B",
      "B.B........B...B",
      "B.BBBB.BB.BBBB.B",
      "B......BB......B",
      "BBB.BBBBBBBB.B.B",
      "B...B......B.B.B",
      "B.BBB.BBBB.B.B.B",
      "B.....B....B...B",
      "B.BBBBB.BBBBBB.B",
      "B..............B",
      "BBBBBBBBBBBBBBBB",
    ],
    entities: [
      { type: "portal", x: 14.5, y: 1.5 },
      { type: "brazier", x: 2.5, y: 1.5 },
      { type: "brazier", x: 12.5, y: 3.5 },
      { type: "brazier", x: 5.5, y: 7.5 },
      { type: "brazier", x: 10.5, y: 11.5 },
      { type: "enemy", variant: "wisp", x: 4.5, y: 13.5, hp: 2 },
      { type: "enemy", variant: "wisp", x: 3.5, y: 5.5, hp: 2 },
      { type: "enemy", variant: "guardian", x: 9.5, y: 7.5, hp: 3 },
      { type: "enemy", variant: "wisp", x: 13.5, y: 5.5, hp: 2 },
      { type: "health", x: 6.5, y: 5.5 },
      { type: "mana", x: 12.5, y: 9.5 },
      { type: "mana", x: 5.5, y: 11.5 },
    ],
  },
  {
    id: "sun-seal",
    code: "E1M3",
    number: "03",
    title: "Citadela Sluneční pečeti",
    shortGoal: "Zlom poslední stín",
    brief: "Za kovovými zdmi čekají dvě pečeti a Strážce hlubin. Teprve jeho porážka otevře cestu ven.",
    goalText: "Najdi dvě pečetě, poraz Strážce a dojdi k portálu.",
    hint: "Strážce vydrží víc zásahů. Využívej sloupy, doplň manu a nenech se zahnat do rohu.",
    goal: { type: "sealBoss", required: 2, noun: "Pečetě" },
    start: { x: 1.5, y: 13.5, angle: 0 },
    colors: {
      sky: "#0c1015",
      ceiling: "#1d252d",
      floor: "#30363a",
      fog: [8, 12, 16],
      accent: "#ffe164",
    },
    map: [
      "GGGGGGGGGGGGGGGG",
      "G......G.......G",
      "G.GGGG.G.GGGGG.G",
      "G.G............G",
      "G.G.GGGGGG.GGG.G",
      "G...G....G...G.G",
      "GGG.G.GG.G.G.G.G",
      "G...G.G..G.G...G",
      "G.GGG.G.GG.GGG.G",
      "G.....G........G",
      "G.GGGGG.GGGGGG.G",
      "G.G............G",
      "G.G.GGGGGGGGGG.G",
      "G..............G",
      "GGGGGGGGGGGGGGGG",
    ],
    entities: [
      { type: "portal", x: 14.5, y: 1.5 },
      { type: "rune", variant: "seal", x: 5.5, y: 1.5 },
      { type: "rune", variant: "seal", x: 3.5, y: 11.5 },
      { type: "enemy", variant: "guardian", x: 4.5, y: 13.5, hp: 3 },
      { type: "enemy", variant: "guardian", x: 10.5, y: 13.5, hp: 3 },
      { type: "enemy", variant: "wisp", x: 3.5, y: 7.5, hp: 2 },
      { type: "enemy", variant: "wisp", x: 12.5, y: 9.5, hp: 2 },
      { type: "enemy", variant: "boss", x: 9.5, y: 3.5, hp: 9, boss: true },
      { type: "health", x: 5.5, y: 9.5 },
      { type: "health", x: 13.5, y: 3.5 },
      { type: "mana", x: 8.5, y: 7.5 },
      { type: "mana", x: 11.5, y: 11.5 },
    ],
  },
];

function isFloor(level, x, y) {
  const row = level.map[y];
  return Boolean(row && row[x] === ".");
}

function key(x, y) {
  return `${x},${y}`;
}

export function validateLevels(levels = LEVELS) {
  const issues = [];

  for (const level of levels) {
    const height = level.map.length;
    const width = level.map[0]?.length || 0;

    if (height < 3 || width < 3 || level.map.some((row) => row.length !== width)) {
      issues.push(`${level.id}: mapa není obdélníková`);
      continue;
    }

    for (let x = 0; x < width; x += 1) {
      if (isFloor(level, x, 0) || isFloor(level, x, height - 1)) {
        issues.push(`${level.id}: otevřený horní nebo dolní okraj`);
      }
    }
    for (let y = 0; y < height; y += 1) {
      if (isFloor(level, 0, y) || isFloor(level, width - 1, y)) {
        issues.push(`${level.id}: otevřený boční okraj`);
      }
    }

    const startX = Math.floor(level.start.x);
    const startY = Math.floor(level.start.y);
    if (!isFloor(level, startX, startY)) {
      issues.push(`${level.id}: start leží ve zdi`);
      continue;
    }

    const queue = [[startX, startY]];
    const visited = new Set([key(startX, startY)]);
    for (let index = 0; index < queue.length; index += 1) {
      const [x, y] = queue[index];
      for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
        const nx = x + dx;
        const ny = y + dy;
        if (isFloor(level, nx, ny) && !visited.has(key(nx, ny))) {
          visited.add(key(nx, ny));
          queue.push([nx, ny]);
        }
      }
    }

    for (const entity of level.entities) {
      const entityKey = key(Math.floor(entity.x), Math.floor(entity.y));
      if (!visited.has(entityKey)) {
        issues.push(`${level.id}: ${entity.type} na ${entityKey} není dosažitelný`);
      }
    }

    if (level.entities.filter((entity) => entity.type === "portal").length !== 1) {
      issues.push(`${level.id}: level musí mít právě jeden portál`);
    }
    if (level.goal.type === "collect" && level.entities.filter((entity) => entity.type === "rune").length < level.goal.required) {
      issues.push(`${level.id}: chybí runy pro splnění cíle`);
    }
    if (level.goal.type === "ignite" && level.entities.filter((entity) => entity.type === "brazier").length < level.goal.required) {
      issues.push(`${level.id}: chybí ohně pro splnění cíle`);
    }
    if (level.goal.type === "sealBoss" && !level.entities.some((entity) => entity.boss)) {
      issues.push(`${level.id}: chybí finální Strážce`);
    }
  }

  if (issues.length) {
    throw new Error(`Neplatné levely:\n${issues.join("\n")}`);
  }

  return {
    levelCount: levels.length,
    codes: levels.map((level) => level.code),
    reachable: true,
  };
}
