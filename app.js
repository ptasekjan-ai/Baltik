const STORAGE_KEY = "baltik-web-save-v2";
const LEGACY_STORAGE_KEYS = ["baltik-lite-save-v1"];

const COMMAND_LIBRARY = {
  MOVE: { id: "MOVE", icon: "↑", label: "Krok vpřed", hotkey: "↑" },
  TURN_LEFT: { id: "TURN_LEFT", icon: "↶", label: "Otoč vlevo", hotkey: "←" },
  TURN_RIGHT: { id: "TURN_RIGHT", icon: "↷", label: "Otoč vpravo", hotkey: "→" },
  CAST: { id: "CAST", icon: "✨", label: "Kouzlo", hotkey: "C" },
};

const TILE_VIEW = {
  "#": { className: "tile-wall", solid: true },
  ".": { className: "tile-floor", solid: false },
  ",": { className: "tile-grass", solid: false },
  w: { className: "tile-window-off", solid: true },
  W: { className: "tile-window-on", solid: true },
  B: { className: "tile-block", solid: true },
};

const DIRECTIONS = ["N", "E", "S", "W"];
const VECTORS = {
  N: { x: 0, y: -1 },
  E: { x: 1, y: 0 },
  S: { x: 0, y: 1 },
  W: { x: -1, y: 0 },
};

const LEVELS = [
  {
    id: "maze",
    chapter: "Kapitola 1",
    title: "Bludiště s pokladem",
    summary: "Dostaň kouzelníka ke hvězdě. Zeď ho nepustí.",
    description:
      "Nejjednodušší mise na plánování kroků. Stačí jen pohyb a otáčení.",
    allowed: ["MOVE", "TURN_LEFT", "TURN_RIGHT"],
    par: 20,
    maxCommands: 26,
    map: [
      "###############",
      "#.....#.......#",
      "#.###.#.#####.#",
      "#.#...#.....#.#",
      "#.#.#####.#.#.#",
      "#.#.....#.#.#.#",
      "#.#####.#.#.#.#",
      "#.....#...#...#",
      "###.#.#####.###",
      "###############",
    ],
    start: { x: 1, y: 1, dir: "E" },
    goal: { type: "reach", x: 13, y: 7 },
    hints: [
      "Nejdřív si najdi první dlouhou chodbu, pak teprve odboč.",
      "Když narazíš do slepé cesty, vrať se otočením o dva pravé obraty.",
    ],
  },
  {
    id: "lights",
    chapter: "Kapitola 2",
    title: "Rozsviť všechna okna",
    summary: "Stoupni si před zhasnuté okno a kouzlem ho rozsviť.",
    description:
      "Přibývá kouzlo. Potřebuješ se správně natočit a čarovat do pole před sebou.",
    allowed: ["MOVE", "TURN_LEFT", "TURN_RIGHT", "CAST"],
    par: 22,
    maxCommands: 28,
    spellLabel: "Rozsviť",
    spellTargetTile: "W",
    map: [
      "###############",
      "#.............#",
      "#..ww...ww....#",
      "#..##...##....#",
      "#.............#",
      "#....####.....#",
      "#....w..w.....#",
      "#.............#",
      "#.............#",
      "###############",
    ],
    start: { x: 1, y: 8, dir: "E" },
    goal: {
      type: "lights",
      targets: [
        { x: 3, y: 2 },
        { x: 4, y: 2 },
        { x: 8, y: 2 },
        { x: 9, y: 2 },
        { x: 5, y: 6 },
        { x: 8, y: 6 },
      ],
    },
    hints: [
      "Kouzlo působí vždycky do pole před Baltíkem, ne pod něj.",
      "Některá okna je rychlejší obsloužit z jedné strany a pak pokračovat dál.",
    ],
  },
  {
    id: "house",
    chapter: "Kapitola 3",
    title: "Postav malý domek",
    summary: "Vyplň všechna označená místa kouzelnými cihlami.",
    description:
      "Tady už nejde jen dojít do cíle. Baltík musí objít stavbu a po částech ji dokončit.",
    allowed: ["MOVE", "TURN_LEFT", "TURN_RIGHT", "CAST"],
    par: 24,
    maxCommands: 32,
    spellLabel: "Postav",
    spellTargetTile: "B",
    map: [
      "###############",
      "#.............#",
      "#.............#",
      "#.....,,,.....#",
      "#....,.,.,....#",
      "#....,.,.,....#",
      "#.....,,,.....#",
      "#.............#",
      "#.............#",
      "###############",
    ],
    start: { x: 2, y: 8, dir: "N" },
    goal: {
      type: "build",
      targets: [
        { x: 6, y: 3 },
        { x: 7, y: 3 },
        { x: 8, y: 3 },
        { x: 5, y: 4 },
        { x: 7, y: 4 },
        { x: 9, y: 4 },
        { x: 5, y: 5 },
        { x: 7, y: 5 },
        { x: 9, y: 5 },
        { x: 6, y: 6 },
        { x: 7, y: 6 },
        { x: 8, y: 6 },
      ],
    },
    hints: [
      "Dívej se, kam Baltík míří. Cihla se objeví jen v políčku před ním.",
      "Nejlepší je obcházet domek po obvodu a stavět po řadách.",
    ],
  },
  {
    id: "maze_library",
    chapter: "Kapitola 4",
    title: "Cesta do knihovny",
    summary: "Projdi delší zahradou a najdi tajnou čítárnu.",
    description:
      "Druhé bludiště už chce trochu víc plánování. Odměnou je kouzelná knihovna na konci cesty.",
    allowed: ["MOVE", "TURN_LEFT", "TURN_RIGHT"],
    par: 24,
    maxCommands: 30,
    map: [
      "###############",
      "#.............#",
      "#.###########.#",
      "#...........#.#",
      "#.#########.#.#",
      "#.#.......#.#.#",
      "#.#.#####.#.#.#",
      "#.#.....#.#...#",
      "#.#####.#####.#",
      "###############",
    ],
    start: { x: 1, y: 1, dir: "E" },
    goal: { type: "reach", x: 13, y: 8 },
    hints: [
      "Podívej se, kde je nejdelší otevřená chodba, a naplánuj ji jako první.",
      "Když narazíš na vnitřní zeď, drž se chvíli pravého okraje mapy.",
    ],
  },
  {
    id: "lights_street",
    chapter: "Kapitola 5",
    title: "Noční ulice",
    summary: "Rozsviť všechna okna v delší ulici a vrať jí večerní život.",
    description:
      "Více domků, více oken a o něco delší trasa. Tahle mise už vypadá jako malý kouzelnický večerní úkol.",
    allowed: ["MOVE", "TURN_LEFT", "TURN_RIGHT", "CAST"],
    par: 28,
    maxCommands: 34,
    spellLabel: "Rozsviť",
    spellTargetTile: "W",
    map: [
      "###############",
      "#.............#",
      "#.ww...ww...w.#",
      "#.##...##...#.#",
      "#.............#",
      "#..w.....w....#",
      "#.............#",
      "#.ww...ww.....#",
      "#.............#",
      "###############",
    ],
    start: { x: 1, y: 8, dir: "E" },
    goal: {
      type: "lights",
      targets: [
        { x: 2, y: 2 },
        { x: 3, y: 2 },
        { x: 7, y: 2 },
        { x: 8, y: 2 },
        { x: 12, y: 2 },
        { x: 3, y: 5 },
        { x: 9, y: 5 },
        { x: 2, y: 7 },
        { x: 3, y: 7 },
        { x: 7, y: 7 },
        { x: 8, y: 7 },
      ],
    },
    hints: [
      "Někdy je rychlejší obsloužit celou jednu stranu ulice, než se pořád vracet.",
      "Naplánuj si, kdy se budeš jen pohybovat a kdy už musí přijít kouzlo.",
    ],
  },
  {
    id: "build_gate",
    chapter: "Kapitola 6",
    title: "Postav kamennou bránu",
    summary: "Dokonči větší stavbu z cihel a otevři cestu do bonusového nádvoří.",
    description:
      "Největší stavební mise. Potřebuje objíždět scénu a dopředu myslet, odkud bude Baltík čarovat.",
    allowed: ["MOVE", "TURN_LEFT", "TURN_RIGHT", "CAST"],
    par: 32,
    maxCommands: 38,
    spellLabel: "Postav",
    spellTargetTile: "B",
    map: [
      "###############",
      "#.............#",
      "#.....,,,.....#",
      "#....,.,.,....#",
      "#...,,...,,...#",
      "#...,,...,,...#",
      "#....,.,.,....#",
      "#.....,,,.....#",
      "#.............#",
      "###############",
    ],
    start: { x: 1, y: 8, dir: "E" },
    goal: {
      type: "build",
      targets: [
        { x: 6, y: 2 },
        { x: 7, y: 2 },
        { x: 8, y: 2 },
        { x: 5, y: 3 },
        { x: 7, y: 3 },
        { x: 9, y: 3 },
        { x: 4, y: 4 },
        { x: 5, y: 4 },
        { x: 9, y: 4 },
        { x: 10, y: 4 },
        { x: 4, y: 5 },
        { x: 5, y: 5 },
        { x: 9, y: 5 },
        { x: 10, y: 5 },
        { x: 5, y: 6 },
        { x: 7, y: 6 },
        { x: 9, y: 6 },
        { x: 6, y: 7 },
        { x: 7, y: 7 },
        { x: 8, y: 7 },
      ],
    },
    hints: [
      "U velké stavby pomáhá rozdělit si práci na horní, boční a spodní část.",
      "Když Baltík stojí správně, jedna otočka navíc často ušetří spoustu cesty.",
    ],
  },
];

const elements = {
  board: document.getElementById("board"),
  feedback: document.getElementById("feedback"),
  levelPicker: document.getElementById("levelPicker"),
  palette: document.getElementById("palette"),
  programList: document.getElementById("programList"),
  levelEyebrow: document.getElementById("levelEyebrow"),
  levelTitle: document.getElementById("levelTitle"),
  levelDescription: document.getElementById("levelDescription"),
  goalStatus: document.getElementById("goalStatus"),
  stepCounter: document.getElementById("stepCounter"),
  commandCounter: document.getElementById("commandCounter"),
  bestScore: document.getElementById("bestScore"),
  unlockedCount: document.getElementById("unlockedCount"),
  totalStars: document.getElementById("totalStars"),
  hintText: document.getElementById("hintText"),
  speedSelect: document.getElementById("speedSelect"),
  soundToggle: document.getElementById("soundToggle"),
  runButton: document.getElementById("runButton"),
  stepButton: document.getElementById("stepButton"),
  stopButton: document.getElementById("stopButton"),
  resetButton: document.getElementById("resetButton"),
  undoButton: document.getElementById("undoButton"),
  clearButton: document.getElementById("clearButton"),
  hintButton: document.getElementById("hintButton"),
  parentResetButton: document.getElementById("parentResetButton"),
};

const levelIndexById = new Map(LEVELS.map((level, index) => [level.id, index]));

const initialSave = loadSave();

const state = {
  save: initialSave,
  currentLevelId: pickInitialLevel(initialSave),
  program: [],
  playback: null,
  session: {},
  audioContext: null,
};

bootstrap();

function bootstrap() {
  elements.speedSelect.value = String(state.save.settings.speedMs);
  elements.soundToggle.checked = state.save.settings.soundOn;

  bindUi();
  setFeedback("Klikni na příkazy vpravo a pak spusť kouzlo.");
  render();
}

function bindUi() {
  elements.runButton.addEventListener("click", handleRun);
  elements.stepButton.addEventListener("click", handleStep);
  elements.stopButton.addEventListener("click", handleStop);
  elements.resetButton.addEventListener("click", resetLevel);
  elements.undoButton.addEventListener("click", undoCommand);
  elements.clearButton.addEventListener("click", clearProgram);
  elements.hintButton.addEventListener("click", showHint);
  elements.parentResetButton.addEventListener("click", parentResetProgress);

  elements.speedSelect.addEventListener("change", () => {
    state.save.settings.speedMs = Number(elements.speedSelect.value);
    persistSave();

    if (state.playback?.running) {
      handleStop();
      setFeedback("Rychlost změněna. Spusť kouzlo znovu novým tempem.");
    } else {
      render();
    }
  });

  elements.soundToggle.addEventListener("change", () => {
    state.save.settings.soundOn = elements.soundToggle.checked;
    persistSave();
  });

  elements.levelPicker.addEventListener("click", (event) => {
    const button = event.target.closest("[data-level-id]");

    if (!button) {
      return;
    }

    const { levelId } = button.dataset;

    if (!isLevelUnlocked(levelId)) {
      return;
    }

    selectLevel(levelId);
  });

  elements.palette.addEventListener("click", (event) => {
    const button = event.target.closest("[data-command-id]");

    if (!button) {
      return;
    }

    addCommand(button.dataset.commandId);
  });

  elements.programList.addEventListener("click", (event) => {
    const button = event.target.closest("[data-program-index]");

    if (!button) {
      return;
    }

    removeCommandAt(Number(button.dataset.programIndex));
  });

  window.addEventListener("keydown", handleKeyboard);
}

function handleKeyboard(event) {
  const activeTag = document.activeElement?.tagName;
  const isTypingField =
    activeTag === "INPUT" || activeTag === "TEXTAREA" || activeTag === "SELECT";

  if (isTypingField) {
    return;
  }

  const key = event.key;

  if (key === "ArrowUp") {
    event.preventDefault();
    addCommand("MOVE");
    return;
  }

  if (key === "ArrowLeft") {
    event.preventDefault();
    addCommand("TURN_LEFT");
    return;
  }

  if (key === "ArrowRight") {
    event.preventDefault();
    addCommand("TURN_RIGHT");
    return;
  }

  if (key.toLowerCase() === "c") {
    event.preventDefault();
    addCommand("CAST");
    return;
  }

  if (key === "Enter") {
    event.preventDefault();
    handleRun();
    return;
  }

  if (key === "Backspace") {
    event.preventDefault();
    undoCommand();
    return;
  }

  if (key.toLowerCase() === "r") {
    event.preventDefault();
    resetLevel();
  }
}

function currentLevel() {
  return LEVELS[levelIndexById.get(state.currentLevelId)];
}

function pickInitialLevel(save) {
  const firstIncomplete = LEVELS.find((level) => !save.results[level.id]?.completed);
  return (firstIncomplete || LEVELS[0]).id;
}

function addCommand(commandId) {
  const level = currentLevel();

  if (!level.allowed.includes(commandId) || state.playback?.running) {
    return;
  }

  if (state.playback && !state.playback.running) {
    clearPlayback();
  }

  state.program.push(commandId);
  setFeedback(`${commandLabel(commandId)} přidán do programu.`);
  render();
}

function removeCommandAt(index) {
  if (state.playback?.running || Number.isNaN(index)) {
    return;
  }

  if (index < 0 || index >= state.program.length) {
    return;
  }

  if (state.playback) {
    clearPlayback();
  }

  const [removed] = state.program.splice(index, 1);
  setFeedback(`${commandLabel(removed)} odstraněn z programu.`);
  render();
}

function undoCommand() {
  if (!state.program.length || state.playback?.running) {
    return;
  }

  if (state.playback) {
    clearPlayback();
  }

  const removed = state.program.pop();
  setFeedback(`${commandLabel(removed)} odstraněn z programu.`);
  render();
}

function clearProgram() {
  if (state.playback?.running) {
    return;
  }

  state.program = [];
  clearPlayback();
  setFeedback("Program je prázdný. Poskládej nové kouzlo.");
  render();
}

function selectLevel(levelId) {
  if (state.playback?.running) {
    stopPlaybackTimer();
  }

  state.currentLevelId = levelId;
  state.program = [];
  clearPlayback();
  setFeedback(`${currentLevel().title}: připraveno.`);
  render();
}

function resetLevel() {
  if (state.playback?.running) {
    stopPlaybackTimer();
  }

  clearPlayback();
  setFeedback("Mise se vrátila na začátek.");
  render();
}

function handleRun() {
  if (!state.program.length) {
    setFeedback("Nejdřív slož aspoň jedno kouzlo.");
    return;
  }

  if (!state.playback || state.playback.finished) {
    state.playback = createPlayback();
  }

  if (state.playback.running) {
    return;
  }

  state.playback.running = true;
  const speed = state.save.settings.speedMs;
  executeNextCommand();

  if (!state.playback?.running || state.playback.finished) {
    return;
  }

  state.playback.timer = window.setInterval(executeNextCommand, speed);
  render();
}

function handleStep() {
  if (!state.program.length) {
    setFeedback("Program je zatím prázdný.");
    return;
  }

  if (state.playback?.running) {
    return;
  }

  if (!state.playback || state.playback.finished) {
    state.playback = createPlayback();
  }

  executeNextCommand();
  render();
}

function handleStop() {
  if (!state.playback?.running) {
    return;
  }

  stopPlaybackTimer();
  setFeedback("Kouzlo se zastavilo. Můžeš pokračovat krokem nebo znovu spustit.");
  render();
}

function createPlayback() {
  return {
    runtime: createRuntime(currentLevel()),
    queue: [...state.program],
    pointer: 0,
    activeCommandIndex: -1,
    running: false,
    finished: false,
    timer: null,
  };
}

function createRuntime(level) {
  return {
    grid: level.map.map((row) => row.split("")),
    wizard: { ...level.start },
    steps: 0,
  };
}

function executeNextCommand() {
  const level = currentLevel();
  const playback = state.playback;

  if (!playback || playback.finished) {
    return;
  }

  if (playback.pointer >= playback.queue.length) {
    finishRun(false);
    return;
  }

  const commandId = playback.queue[playback.pointer];
  playback.activeCommandIndex = playback.pointer;
  playback.pointer += 1;

  const message = applyCommand(level, playback.runtime, commandId);
  const solved = isGoalMet(level, playback.runtime);

  if (solved) {
    finishRun(true);
    return;
  }

  if (playback.pointer >= playback.queue.length) {
    finishRun(false, message);
    return;
  }

  setFeedback(message);
  render();
}

function finishRun(success, detailMessage = "") {
  const level = currentLevel();
  const playback = state.playback;

  if (!playback) {
    return;
  }

  stopPlaybackTimer();
  playback.finished = true;

  if (success) {
    const stars = scoreLevel(level, playback.runtime.steps);
    storeLevelResult(level.id, playback.runtime.steps, stars);
    unlockNextLevel(level.id);
    playTone("success");
    setFeedback(`Hotovo! ${level.title} splněno za ${playback.runtime.steps} kroků.`);
  } else {
    const session = getSessionState(level.id);
    session.failedRuns += 1;
    playTone("fail");
    const prefix = detailMessage ? `${detailMessage} ` : "";

    if (session.failedRuns >= 2) {
      setFeedback(`${prefix}Úkol ještě není hotový. Nápověda je připravená.`);
    } else {
      setFeedback(`${prefix}Úkol ještě není hotový. Zkus program upravit.`);
    }
  }

  render();
}

function applyCommand(level, runtime, commandId) {
  runtime.steps += 1;

  if (commandId === "MOVE") {
    const next = tileInFront(runtime.wizard);

    if (!isInside(level, next.x, next.y)) {
      playTone("bump");
      return "Au, za okrajem světa už Baltík kouzlit neumí.";
    }

    const tile = runtime.grid[next.y][next.x];

    if (isSolid(tile)) {
      playTone("bump");
      return "Bum! Tady stojí překážka.";
    }

    runtime.wizard.x = next.x;
    runtime.wizard.y = next.y;
    playTone("step");
    return "Baltík popošel o jedno políčko.";
  }

  if (commandId === "TURN_LEFT") {
    runtime.wizard.dir = DIRECTIONS[(DIRECTIONS.indexOf(runtime.wizard.dir) + 3) % 4];
    playTone("turn");
    return "Baltík se otočil vlevo.";
  }

  if (commandId === "TURN_RIGHT") {
    runtime.wizard.dir = DIRECTIONS[(DIRECTIONS.indexOf(runtime.wizard.dir) + 1) % 4];
    playTone("turn");
    return "Baltík se otočil vpravo.";
  }

  if (commandId === "CAST") {
    const target = tileInFront(runtime.wizard);

    if (!isInside(level, target.x, target.y)) {
      playTone("bump");
      return "Kouzlo vyletělo mimo scénu.";
    }

    if (level.goal.type === "lights") {
      const tile = runtime.grid[target.y][target.x];

      if (tile === "w") {
        runtime.grid[target.y][target.x] = "W";
        playTone("cast");
        return "Okno se krásně rozsvítilo.";
      }

      playTone("bump");
      return "Tady není zhasnuté okno.";
    }

    if (level.goal.type === "build") {
      const targetKey = `${target.x},${target.y}`;
      const targets = buildTargetSet(level);

      if (!targets.has(targetKey)) {
        playTone("bump");
        return "Domek sem ještě nepatří.";
      }

      if (runtime.grid[target.y][target.x] === "B") {
        playTone("bump");
        return "Tady už cihla stojí.";
      }

      runtime.grid[target.y][target.x] = "B";
      playTone("cast");
      return "Cihla je na svém místě.";
    }

    playTone("bump");
    return "V téhle misi se ještě nečaruje.";
  }

  return "Baltík čeká na další kouzlo.";
}

function isGoalMet(level, runtime) {
  if (level.goal.type === "reach") {
    return runtime.wizard.x === level.goal.x && runtime.wizard.y === level.goal.y;
  }

  if (level.goal.type === "lights") {
    return level.goal.targets.every(({ x, y }) => runtime.grid[y][x] === "W");
  }

  if (level.goal.type === "build") {
    return level.goal.targets.every(({ x, y }) => runtime.grid[y][x] === "B");
  }

  return false;
}

function tileInFront(wizard) {
  const vector = VECTORS[wizard.dir];
  return { x: wizard.x + vector.x, y: wizard.y + vector.y };
}

function isSolid(tile) {
  return TILE_VIEW[tile]?.solid ?? false;
}

function isInside(level, x, y) {
  return y >= 0 && y < level.map.length && x >= 0 && x < level.map[0].length;
}

function render() {
  renderHero();
  renderLevelPicker();
  renderPalette();
  renderBoard();
  renderProgram();
  renderMeta();
  renderHintState();
  renderButtons();
}

function renderHero() {
  elements.unlockedCount.textContent = `${state.save.unlocked.length} / ${LEVELS.length}`;
  elements.totalStars.textContent = String(
    Object.values(state.save.results).reduce((sum, result) => sum + (result.stars || 0), 0),
  );
}

function renderLevelPicker() {
  elements.levelPicker.innerHTML = LEVELS.map((level, index) => {
    const result = state.save.results[level.id];
    const locked = !isLevelUnlocked(level.id);
    const meta = result?.stars ? `⭐ ${result.stars}` : "Bez hvězd";

    return `
      <button
        class="level-card"
        type="button"
        data-level-id="${level.id}"
        ${locked ? "disabled" : ""}
        ${level.id === state.currentLevelId ? 'aria-current="true"' : ""}
      >
        <span class="level-card__title">${index + 1}. ${level.title}</span>
        <p class="level-card__copy">${level.summary}</p>
        <p class="level-card__meta">${meta}</p>
      </button>
    `;
  }).join("");
}

function renderPalette() {
  const level = currentLevel();

  elements.palette.innerHTML = level.allowed.map((commandId) => {
    const template = COMMAND_LIBRARY[commandId];
    const label =
      commandId === "CAST" && level.spellLabel ? level.spellLabel : template.label;
    const disabled = state.playback?.running ? "disabled" : "";

    return `
      <button class="palette-button" type="button" data-command-id="${commandId}" ${disabled}>
        <span class="palette-icon">${template.icon}</span>
        <span class="palette-label">${label}</span>
        <span class="palette-hotkey">Klávesa ${template.hotkey}</span>
      </button>
    `;
  }).join("");
}

function renderBoard() {
  const level = currentLevel();
  const runtime = state.playback ? state.playback.runtime : createRuntime(level);
  const goalSet = buildTargetSet(level);
  const reachGoal = level.goal.type === "reach" ? `${level.goal.x},${level.goal.y}` : null;
  const cells = [];

  elements.levelEyebrow.textContent = level.chapter;
  elements.levelTitle.textContent = level.title;
  elements.levelDescription.textContent = level.description;

  for (let y = 0; y < runtime.grid.length; y += 1) {
    for (let x = 0; x < runtime.grid[y].length; x += 1) {
      const tile = runtime.grid[y][x];
      const view = TILE_VIEW[tile] || TILE_VIEW["."];
      const key = `${x},${y}`;
      const isGoalCell = reachGoal === key;
      const isTargetCell =
        level.goal.type === "build" && goalSet.has(key) && tile !== "B";
      const wizardClass =
        runtime.wizard.x === x && runtime.wizard.y === y
          ? `<div class="wizard wizard--${runtime.wizard.dir}"></div>`
          : "";

      cells.push(`
        <div class="cell ${view.className} ${isGoalCell ? "cell-goal" : ""} ${isTargetCell ? "cell-target" : ""}">
          ${wizardClass}
        </div>
      `);
    }
  }

  elements.board.innerHTML = cells.join("");
  elements.board.setAttribute(
    "aria-label",
    `${level.title}. Baltík stojí na ${runtime.wizard.x + 1}.${runtime.wizard.y + 1}. poli a míří na ${directionLabel(runtime.wizard.dir)}.`,
  );
}

function renderProgram() {
  const playback = state.playback;

  if (!state.program.length) {
    elements.programList.innerHTML = `
      <p class="timeline-empty">
        Program je zatím prázdný. Začni jedním krokem vpřed a pozoruj, co se stane.
      </p>
    `;
    return;
  }

  elements.programList.innerHTML = state.program.map((commandId, index) => {
    const template = COMMAND_LIBRARY[commandId];
    const active = playback?.activeCommandIndex === index ? "command-chip--active" : "";
    const disabled = state.playback?.running ? "disabled" : "";

    return `
      <button class="command-chip ${active}" type="button" data-program-index="${index}" ${disabled} title="Smazat krok">
        <span class="palette-icon">${template.icon}</span>
        <span>${commandLabel(commandId)}</span>
        <span class="command-chip__index">${index + 1}</span>
      </button>
    `;
  }).join("");
}

function renderMeta() {
  const level = currentLevel();
  const runtime = state.playback ? state.playback.runtime : createRuntime(level);
  const result = state.save.results[level.id];

  elements.goalStatus.textContent = describeGoal(level, runtime);
  elements.stepCounter.textContent = String(runtime.steps);
  elements.commandCounter.textContent = formatProgramCount(state.program.length);
  elements.bestScore.textContent = result?.bestSteps ? `${result.bestSteps} kroků` : "-";
}

function renderHintState() {
  const level = currentLevel();
  const session = getSessionState(level.id);
  const hintReady = session.failedRuns >= 2;

  elements.hintButton.disabled = !hintReady;

  if (!hintReady) {
    elements.hintText.textContent =
      "Po dvou nepovedených pokusech se odemkne jemná nápověda.";
    return;
  }

  if (session.lastHintText) {
    elements.hintText.textContent = session.lastHintText;
    return;
  }

  elements.hintText.textContent =
    "Nápověda je připravená. Klikni a dostaneš malé popostrčení, ne celé řešení.";
}

function renderButtons() {
  const hasProgram = state.program.length > 0;
  const isRunning = Boolean(state.playback?.running);

  elements.runButton.disabled = !hasProgram || isRunning;
  elements.stepButton.disabled = !hasProgram || isRunning;
  elements.stopButton.disabled = !isRunning;
  elements.resetButton.disabled = false;
  elements.undoButton.disabled = !hasProgram || isRunning;
  elements.clearButton.disabled = !hasProgram || isRunning;
}

function describeGoal(level, runtime) {
  if (level.goal.type === "reach") {
    const done = isGoalMet(level, runtime);
    return done ? "Poklad nalezen." : "Najdi hvězdu v bludišti.";
  }

  if (level.goal.type === "lights") {
    const total = level.goal.targets.length;
    const lit = level.goal.targets.filter(({ x, y }) => runtime.grid[y][x] === "W").length;
    return `Rozsviť všechna okna: ${lit} / ${total}`;
  }

  if (level.goal.type === "build") {
    const total = level.goal.targets.length;
    const built = level.goal.targets.filter(({ x, y }) => runtime.grid[y][x] === "B").length;
    return `Dokonči domek: ${built} / ${total}`;
  }

  return "Plň kouzelnickou misi.";
}

function buildTargetSet(level) {
  if (!level._targetSet) {
    level._targetSet = new Set((level.goal.targets || []).map(({ x, y }) => `${x},${y}`));
  }

  return level._targetSet;
}

function commandLabel(commandId) {
  const level = currentLevel();

  if (commandId === "CAST" && level.spellLabel) {
    return level.spellLabel;
  }

  return COMMAND_LIBRARY[commandId].label;
}

function directionLabel(direction) {
  return {
    N: "sever",
    E: "východ",
    S: "jih",
    W: "západ",
  }[direction];
}

function formatProgramCount(count) {
  if (count === 1) {
    return "1 příkaz";
  }

  if (count >= 2 && count <= 4) {
    return `${count} příkazy`;
  }

  return `${count} příkazů`;
}

function scoreLevel(level, steps) {
  if (steps <= level.par) {
    return 3;
  }

  if (steps <= level.par + 5) {
    return 2;
  }

  return 1;
}

function storeLevelResult(levelId, bestSteps, stars) {
  const current = state.save.results[levelId];
  const nextBest =
    current?.bestSteps && current.bestSteps < bestSteps ? current.bestSteps : bestSteps;
  const nextStars = Math.max(current?.stars || 0, stars);

  state.save.results[levelId] = {
    completed: true,
    bestSteps: nextBest,
    stars: nextStars,
  };

  persistSave();
}

function unlockNextLevel(levelId) {
  const index = levelIndexById.get(levelId);
  const next = LEVELS[index + 1];

  if (!next || state.save.unlocked.includes(next.id)) {
    persistSave();
    return;
  }

  state.save.unlocked.push(next.id);
  persistSave();
}

function isLevelUnlocked(levelId) {
  return state.save.unlocked.includes(levelId);
}

function getSessionState(levelId) {
  if (!state.session[levelId]) {
    state.session[levelId] = {
      failedRuns: 0,
      hintIndex: 0,
      lastHintText: "",
    };
  }

  return state.session[levelId];
}

function showHint() {
  const level = currentLevel();
  const session = getSessionState(level.id);

  if (session.failedRuns < 2) {
    setFeedback("Ještě chvíli zkoušej sám. Nápověda se odemkne po dvou pokusech.");
    return;
  }

  const hint = level.hints[Math.min(session.hintIndex, level.hints.length - 1)];
  session.lastHintText = hint;
  session.hintIndex = Math.min(session.hintIndex + 1, level.hints.length - 1);
  setFeedback(`Nápověda: ${hint}`);
  render();
}

function parentResetProgress() {
  const answer = window.prompt("Rodičovská brána: kolik je 7 + 5?");

  if (answer === null) {
    return;
  }

  if (answer.trim() !== "12") {
    setFeedback("Rodičovská brána zůstala zavřená.");
    return;
  }

  state.save = defaultSave();
  state.currentLevelId = LEVELS[0].id;
  state.program = [];
  state.playback = null;
  state.session = {};
  persistSave();
  elements.speedSelect.value = String(state.save.settings.speedMs);
  elements.soundToggle.checked = state.save.settings.soundOn;
  setFeedback("Postup byl smazán a hra je znovu od začátku.");
  render();
}

function clearPlayback() {
  stopPlaybackTimer();
  state.playback = null;
}

function stopPlaybackTimer() {
  if (state.playback?.timer) {
    window.clearInterval(state.playback.timer);
    state.playback.timer = null;
  }

  if (state.playback) {
    state.playback.running = false;
  }
}

function setFeedback(message) {
  elements.feedback.textContent = message;
}

function loadSave() {
  const fallback = defaultSave();

  try {
    const raw = [STORAGE_KEY, ...LEGACY_STORAGE_KEYS]
      .map((key) => window.localStorage.getItem(key))
      .find(Boolean);

    if (!raw) {
      return fallback;
    }

    const parsed = JSON.parse(raw);

    return normalizeSave({
      unlocked: Array.isArray(parsed.unlocked) && parsed.unlocked.length
        ? parsed.unlocked
        : fallback.unlocked,
      results: parsed.results && typeof parsed.results === "object"
        ? parsed.results
        : fallback.results,
      settings: {
        ...fallback.settings,
        ...(parsed.settings || {}),
      },
    });
  } catch (error) {
    return fallback;
  }
}

function defaultSave() {
  return {
    unlocked: [LEVELS[0].id],
    results: {},
    settings: {
      speedMs: 430,
      soundOn: true,
    },
  };
}

function normalizeSave(save) {
  const unlocked = new Set([LEVELS[0].id, ...(save.unlocked || [])]);

  LEVELS.forEach((level, index) => {
    if (save.results?.[level.id]?.completed && LEVELS[index + 1]) {
      unlocked.add(LEVELS[index + 1].id);
    }
  });

  return {
    ...save,
    unlocked: LEVELS.map((level) => level.id).filter((id) => unlocked.has(id)),
  };
}

function persistSave() {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state.save));
    LEGACY_STORAGE_KEYS.forEach((key) => window.localStorage.removeItem(key));
  } catch (error) {
    setFeedback("Uložení se nepovedlo. Hra ale běží dál.");
  }
}

function playTone(kind) {
  if (!state.save.settings.soundOn) {
    return;
  }

  const AudioContextCtor = window.AudioContext || window.webkitAudioContext;

  if (!AudioContextCtor) {
    return;
  }

  if (!state.audioContext) {
    state.audioContext = new AudioContextCtor();
  }

  if (state.audioContext.state === "suspended") {
    state.audioContext.resume();
  }

  const profile = {
    step: { frequency: 330, duration: 0.05, type: "triangle" },
    turn: { frequency: 420, duration: 0.05, type: "triangle" },
    cast: { frequency: 640, duration: 0.12, type: "sine" },
    bump: { frequency: 180, duration: 0.08, type: "square" },
    success: { frequency: 760, duration: 0.24, type: "sine" },
    fail: { frequency: 160, duration: 0.18, type: "sawtooth" },
  }[kind];

  if (!profile) {
    return;
  }

  const context = state.audioContext;
  const oscillator = context.createOscillator();
  const gain = context.createGain();
  const now = context.currentTime;

  oscillator.type = profile.type;
  oscillator.frequency.setValueAtTime(profile.frequency, now);
  gain.gain.setValueAtTime(0.0001, now);
  gain.gain.exponentialRampToValueAtTime(0.08, now + 0.01);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + profile.duration);

  oscillator.connect(gain);
  gain.connect(context.destination);

  oscillator.start(now);
  oscillator.stop(now + profile.duration + 0.02);
}
