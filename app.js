const STORAGE_KEY = "baltik-web-save-v3";
const LEGACY_STORAGE_KEYS = ["baltik-web-save-v2", "baltik-lite-save-v1"];

const COMMAND_LIBRARY = {
  MOVE: { id: "MOVE", icon: "↑", label: "Krok vpřed", hotkey: "↑" },
  TURN_LEFT: { id: "TURN_LEFT", icon: "↶", label: "Otoč vlevo", hotkey: "←" },
  TURN_RIGHT: { id: "TURN_RIGHT", icon: "↷", label: "Otoč vpravo", hotkey: "→" },
  CAST: { id: "CAST", icon: "✦", label: "Kouzlo", hotkey: "C" },
};

const TILE_VIEW = {
  "#": { className: "tile-wall", solid: true },
  ".": { className: "tile-floor", solid: false },
  ",": { className: "tile-grass", solid: false },
  "~": { className: "tile-water", solid: true },
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
    id: "star_garden",
    chapter: "Mise 1",
    icon: "⭐",
    title: "Hvězdná zahrada",
    summary: "Dojdi ke hvězdě a cestou sbírej třpytky.",
    description: "První výprava je krátká, barevná a skvěle ukáže, jak Baltík poslouchá program.",
    allowed: ["MOVE", "TURN_LEFT", "TURN_RIGHT"],
    minimumSteps: 20,
    map: [
      "###############",
      "#.............#",
      "#.###.....###.#",
      "#...#.....#...#",
      "#...#..#..#...#",
      "#......#......#",
      "#.####...####.#",
      "#.............#",
      "#.............#",
      "###############",
    ],
    start: { x: 1, y: 8, dir: "E" },
    goal: { type: "reach", x: 13, y: 1 },
    gems: [
      { x: 3, y: 8 },
      { x: 7, y: 7 },
      { x: 10, y: 5 },
      { x: 13, y: 3 },
    ],
    hints: [
      "Nejdřív jeď spodní cestičkou skoro až doprava.",
      "Když jsi u pravého kraje, otoč se nahoru a vystoupej ke hvězdě.",
    ],
  },
  {
    id: "lights_cottages",
    chapter: "Mise 2",
    icon: "🏠",
    title: "Rozsviť domečky",
    summary: "Stoupni si před okno a pošli do něj jiskru.",
    description: "Tady už Baltík čaruje. Okno se rozsvítí jen tehdy, když stojí přímo před ním.",
    allowed: ["MOVE", "TURN_LEFT", "TURN_RIGHT", "CAST"],
    minimumSteps: 44,
    spellLabel: "Rozsviť",
    spellTargetTile: "W",
    map: [
      "###############",
      "#.............#",
      "#..ww.....ww..#",
      "#..##.....##..#",
      "#.............#",
      "#.....w.w.....#",
      "#.....#.#.....#",
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
        { x: 10, y: 2 },
        { x: 11, y: 2 },
        { x: 6, y: 5 },
        { x: 8, y: 5 },
      ],
    },
    gems: [
      { x: 2, y: 7 },
      { x: 7, y: 4 },
      { x: 12, y: 7 },
    ],
    hints: [
      "Kouzlo letí do políčka před Baltíkem.",
      "Zkus nejdřív horní domečky a potom se vrať ke spodním oknům.",
    ],
  },
  {
    id: "little_gate",
    chapter: "Mise 3",
    icon: "🧱",
    title: "Malá brána",
    summary: "Doplň označená místa kouzelnými cihlami.",
    description: "Baltík nestaví pod sebe, ale do políčka před sebou. Obcházení stavby je hlavní fígl.",
    allowed: ["MOVE", "TURN_LEFT", "TURN_RIGHT", "CAST"],
    minimumSteps: 36,
    spellLabel: "Postav",
    spellTargetTile: "B",
    map: [
      "###############",
      "#.............#",
      "#.............#",
      "#.....,,,.....#",
      "#.....,.,.....#",
      "#.....,.,.....#",
      "#.....,,,.....#",
      "#.............#",
      "#.............#",
      "###############",
    ],
    start: { x: 2, y: 8, dir: "E" },
    goal: {
      type: "build",
      targets: [
        { x: 6, y: 3 },
        { x: 7, y: 3 },
        { x: 8, y: 3 },
        { x: 6, y: 4 },
        { x: 8, y: 4 },
        { x: 6, y: 5 },
        { x: 8, y: 5 },
        { x: 6, y: 6 },
        { x: 7, y: 6 },
        { x: 8, y: 6 },
      ],
    },
    gems: [
      { x: 4, y: 7 },
      { x: 10, y: 7 },
      { x: 7, y: 2 },
    ],
    hints: [
      "Začni dole pod bránou a dívej se nahoru.",
      "Když doplníš jednu stranu, objet bránu je často rychlejší než couvat.",
    ],
  },
  {
    id: "secret_library",
    chapter: "Mise 4",
    icon: "📚",
    title: "Tajná knihovna",
    summary: "Projdi klikatou cestu až do čítárny.",
    description: "Delší cesta už chce trochu plánování. Náhled trasy ukáže, kam program Baltíka dovede.",
    allowed: ["MOVE", "TURN_LEFT", "TURN_RIGHT"],
    minimumSteps: 20,
    map: [
      "###############",
      "#.............#",
      "#.###########.#",
      "#...........#.#",
      "#.#########.#.#",
      "#.#.......#.#.#",
      "#.#.#####.#.#.#",
      "#.......#.....#",
      "#.#####.#####.#",
      "###############",
    ],
    start: { x: 1, y: 1, dir: "E" },
    goal: { type: "reach", x: 13, y: 8 },
    gems: [
      { x: 9, y: 1 },
      { x: 4, y: 3 },
      { x: 7, y: 5 },
      { x: 13, y: 7 },
    ],
    hints: [
      "Nejdelší chodba nahoře tě dostane skoro k pravé straně.",
      "Uprostřed mapy se drž chvilku pravého okraje cesty.",
    ],
  },
  {
    id: "night_festival",
    chapter: "Mise 5",
    icon: "🌙",
    title: "Noční slavnost",
    summary: "Rozsviť ulici, aby mohla začít slavnost.",
    description: "Více oken, více rozhodování. Každá správná jiskra rozsvítí další kus městečka.",
    allowed: ["MOVE", "TURN_LEFT", "TURN_RIGHT", "CAST"],
    minimumSteps: 47,
    spellLabel: "Rozsviť",
    spellTargetTile: "W",
    map: [
      "###############",
      "#.............#",
      "#.ww...ww.....#",
      "#.##...##.....#",
      "#.............#",
      "#..w.....w....#",
      "#.............#",
      "#.ww..........#",
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
        { x: 3, y: 5 },
        { x: 9, y: 5 },
        { x: 2, y: 7 },
        { x: 3, y: 7 },
      ],
    },
    gems: [
      { x: 5, y: 4 },
      { x: 12, y: 4 },
      { x: 5, y: 8 },
      { x: 11, y: 8 },
    ],
    hints: [
      "Rozděl si ulici na horní, prostřední a spodní část.",
      "Někdy stačí stát mezi dvěma okny, otočit se a poslat dvě jiskry.",
    ],
  },
  {
    id: "castle_courtyard",
    chapter: "Mise 6",
    icon: "🏰",
    title: "Hradní nádvoří",
    summary: "Dostav velkou bránu a najdi poslední třpytky.",
    description: "Finální stavba je pořád fér, ale chce trpělivost. Dobrý plán vypadá jako kouzelný taneček.",
    allowed: ["MOVE", "TURN_LEFT", "TURN_RIGHT", "CAST"],
    minimumSteps: 42,
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
        { x: 9, y: 3 },
        { x: 4, y: 4 },
        { x: 10, y: 4 },
        { x: 4, y: 5 },
        { x: 10, y: 5 },
        { x: 5, y: 6 },
        { x: 9, y: 6 },
      ],
    },
    gems: [
      { x: 3, y: 8 },
      { x: 11, y: 8 },
      { x: 3, y: 2 },
      { x: 11, y: 2 },
      { x: 7, y: 4 },
    ],
    hints: [
      "Velkou bránu si rozděl na horní oblouk, boky a spodní řadu.",
      "Když cihla stojí, stává se překážkou. Plánuj, kudy pak Baltík projde.",
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
  challengeSummary: document.getElementById("challengeSummary"),
  goalStatus: document.getElementById("goalStatus"),
  goalPercent: document.getElementById("goalPercent"),
  goalMeter: document.getElementById("goalMeter"),
  stepCounter: document.getElementById("stepCounter"),
  commandCounter: document.getElementById("commandCounter"),
  bestScore: document.getElementById("bestScore"),
  unlockedCount: document.getElementById("unlockedCount"),
  totalGems: document.getElementById("totalGems"),
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
  tripleStepButton: document.getElementById("tripleStepButton"),
  hintButton: document.getElementById("hintButton"),
  parentResetButton: document.getElementById("parentResetButton"),
  resetGate: document.getElementById("resetGate"),
  resetAnswer: document.getElementById("resetAnswer"),
  confirmResetButton: document.getElementById("confirmResetButton"),
  celebration: document.getElementById("celebration"),
  celebrationTitle: document.getElementById("celebrationTitle"),
  celebrationStars: document.getElementById("celebrationStars"),
  celebrationText: document.getElementById("celebrationText"),
  nextLevelButton: document.getElementById("nextLevelButton"),
  replayLevelButton: document.getElementById("replayLevelButton"),
};

const levelIndexById = new Map(LEVELS.map((level, index) => [level.id, index]));
const totalGemCount = LEVELS.reduce((sum, level) => sum + gemCount(level), 0);
const initialSave = loadSave();

const state = {
  save: initialSave,
  currentLevelId: pickInitialLevel(initialSave),
  program: [],
  playback: null,
  session: {},
  audioContext: null,
  lastCompletedLevelId: null,
};

bootstrap();

function bootstrap() {
  elements.speedSelect.value = String(state.save.settings.speedMs);
  elements.soundToggle.checked = state.save.settings.soundOn;

  bindUi();
  setFeedback("Vyber kouzla vpravo. Tečkovaná stopa hned ukáže plán.");
  render();
}

function bindUi() {
  elements.runButton.addEventListener("click", handleRun);
  elements.stepButton.addEventListener("click", handleStep);
  elements.stopButton.addEventListener("click", handleStop);
  elements.resetButton.addEventListener("click", resetLevel);
  elements.undoButton.addEventListener("click", undoCommand);
  elements.clearButton.addEventListener("click", clearProgram);
  elements.tripleStepButton.addEventListener("click", addTripleStep);
  elements.hintButton.addEventListener("click", showHint);
  elements.parentResetButton.addEventListener("click", openParentResetGate);
  elements.confirmResetButton.addEventListener("click", confirmParentReset);
  elements.resetAnswer.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      confirmParentReset();
    }
  });
  elements.nextLevelButton.addEventListener("click", goToNextLevel);
  elements.replayLevelButton.addEventListener("click", replayLevel);

  elements.speedSelect.addEventListener("change", () => {
    state.save.settings.speedMs = Number(elements.speedSelect.value);
    persistSave();

    if (state.playback?.running) {
      handleStop();
      setFeedback("Rychlost je změněná. Spusť kouzlo znovu novým tempem.");
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

  if (!elements.celebration.hidden && event.key === "Escape") {
    event.preventDefault();
    hideCelebration();
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

  if (key === "Enter" || key === " ") {
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

  hideCelebration();
  state.program.push(commandId);
  setFeedback(`${commandLabel(commandId)} přidán do kouzelnické linky.`);
  render();
}

function addTripleStep() {
  const level = currentLevel();

  if (!level.allowed.includes("MOVE") || state.playback?.running) {
    return;
  }

  if (state.playback && !state.playback.running) {
    clearPlayback();
  }

  hideCelebration();
  state.program.push("MOVE", "MOVE", "MOVE");
  setFeedback("Tři kroky vpřed jsou v lince.");
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

  hideCelebration();
  const [removed] = state.program.splice(index, 1);
  setFeedback(`${commandLabel(removed)} smazán z linky.`);
  render();
}

function undoCommand() {
  if (!state.program.length || state.playback?.running) {
    return;
  }

  if (state.playback) {
    clearPlayback();
  }

  hideCelebration();
  const removed = state.program.pop();
  setFeedback(`Poslední krok smazán: ${commandLabel(removed)}. Plán se hned přepočítal.`);
  render();
}

function clearProgram() {
  if (state.playback?.running) {
    return;
  }

  state.program = [];
  clearPlayback();
  hideCelebration();
  setFeedback("Linka je prázdná. Poskládej nové kouzlo.");
  render();
}

function selectLevel(levelId) {
  if (state.playback?.running) {
    stopPlaybackTimer();
  }

  state.currentLevelId = levelId;
  state.program = [];
  clearPlayback();
  hideCelebration();
  setFeedback(`${currentLevel().title}: připraveno.`);
  render();
}

function resetLevel() {
  if (state.playback?.running) {
    stopPlaybackTimer();
  }

  clearPlayback();
  hideCelebration();
  setFeedback("Mise je zpátky na začátku. Program zůstal, ať ho můžeš hned zkusit znovu.");
  render();
}

function handleRun() {
  if (!state.program.length) {
    setFeedback("Nejdřív vlož aspoň jedno kouzlo do linky.");
    return;
  }

  hideCelebration();

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
    setFeedback("Linka je zatím prázdná.");
    return;
  }

  if (state.playback?.running) {
    return;
  }

  hideCelebration();

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
  setFeedback("Kouzlo stojí. Můžeš pokračovat po krocích nebo spustit znovu.");
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
    gems: new Set((level.gems || []).map(pointKey)),
    collectedGems: 0,
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

  const message = applyCommand(level, playback.runtime, commandId, true);
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
    const gems = playback.runtime.collectedGems;
    storeLevelResult(level.id, playback.runtime.steps, stars, gems);
    const newlyUnlocked = unlockNextLevel(level.id);
    state.lastCompletedLevelId = level.id;
    playTone("success");
    setFeedback(`Hotovo! ${level.title} splněno za ${playback.runtime.steps} kroků.`);
    showCelebration(level, playback.runtime.steps, stars, gems, newlyUnlocked);
  } else {
    const session = getSessionState(level.id);
    session.failedRuns += 1;
    playTone("fail");
    const prefix = detailMessage ? `${detailMessage} ` : "";

    if (session.failedRuns >= 2) {
      setFeedback(`${prefix}Úkol ještě není hotový. Nápověda je připravená.`);
    } else {
      setFeedback(`${prefix}Skoro. Uprav pár kouzel a zkus to znovu.`);
    }
  }

  render();
}

function applyCommand(level, runtime, commandId, withSound) {
  runtime.steps += 1;

  if (commandId === "MOVE") {
    const next = tileInFront(runtime.wizard);

    if (!isInside(level, next.x, next.y)) {
      playIf(withSound, "bump");
      return "Au, za krajem světa už cesta není.";
    }

    const tile = runtime.grid[next.y][next.x];

    if (isSolid(tile)) {
      playIf(withSound, "bump");
      return "Bum! Tady stojí překážka.";
    }

    runtime.wizard.x = next.x;
    runtime.wizard.y = next.y;

    const key = pointKey(next);
    if (runtime.gems.delete(key)) {
      runtime.collectedGems += 1;
      playIf(withSound, "gem");
      return "Cink! Baltík našel drahokam.";
    }

    playIf(withSound, "step");
    return "Baltík popošel o políčko.";
  }

  if (commandId === "TURN_LEFT") {
    runtime.wizard.dir = DIRECTIONS[(DIRECTIONS.indexOf(runtime.wizard.dir) + 3) % 4];
    playIf(withSound, "turn");
    return "Baltík se otočil vlevo.";
  }

  if (commandId === "TURN_RIGHT") {
    runtime.wizard.dir = DIRECTIONS[(DIRECTIONS.indexOf(runtime.wizard.dir) + 1) % 4];
    playIf(withSound, "turn");
    return "Baltík se otočil vpravo.";
  }

  if (commandId === "CAST") {
    const target = tileInFront(runtime.wizard);

    if (!isInside(level, target.x, target.y)) {
      playIf(withSound, "bump");
      return "Jiskra vyletěla mimo scénu.";
    }

    if (level.goal.type === "lights") {
      const tile = runtime.grid[target.y][target.x];

      if (tile === "w") {
        runtime.grid[target.y][target.x] = "W";
        playIf(withSound, "cast");
        return "Okno se rozzářilo.";
      }

      playIf(withSound, "bump");
      return "Tady zhasnuté okno není.";
    }

    if (level.goal.type === "build") {
      const targetKey = pointKey(target);
      const targets = buildTargetSet(level);

      if (!targets.has(targetKey)) {
        playIf(withSound, "bump");
        return "Sem cihla do stavby nepatří.";
      }

      if (runtime.grid[target.y][target.x] === "B") {
        playIf(withSound, "bump");
        return "Tahle cihla už stojí.";
      }

      runtime.grid[target.y][target.x] = "B";
      playIf(withSound, "cast");
      return "Cihla doskočila na místo.";
    }

    playIf(withSound, "bump");
    return "V téhle misi stačí chodit a otáčet se.";
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
  elements.totalGems.textContent = `${collectedGemTotal()} / ${totalGemCount}`;
}

function renderLevelPicker() {
  elements.levelPicker.innerHTML = LEVELS.map((level, index) => {
    const result = state.save.results[level.id];
    const locked = !isLevelUnlocked(level.id);
    const stars = renderStars(result?.stars || 0);
    const gems = `${result?.gems || 0}/${gemCount(level)} 💎`;

    return `
      <button
        class="level-card"
        type="button"
        data-level-id="${level.id}"
        ${locked ? "disabled" : ""}
        ${level.id === state.currentLevelId ? 'aria-current="true"' : ""}
      >
        <span class="level-card__number">${locked ? "🔒" : index + 1}</span>
        <span class="level-card__title">${level.icon} ${level.title}</span>
        <span class="level-card__reward">${stars} <span>${gems}</span></span>
        <span class="level-card__challenge">${formatChallengeSummary(level)}</span>
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
  const preview = !state.playback && state.program.length ? simulateProgram(level, state.program) : null;
  const goalSet = buildTargetSet(level);
  const reachGoal = level.goal.type === "reach" ? pointKey(level.goal) : null;
  const cells = [];

  elements.levelEyebrow.textContent = level.chapter;
  elements.levelTitle.textContent = level.title;
  elements.levelDescription.textContent = level.description;
  elements.challengeSummary.textContent = formatChallengeSummary(level);

  for (let y = 0; y < runtime.grid.length; y += 1) {
    for (let x = 0; x < runtime.grid[y].length; x += 1) {
      const tile = runtime.grid[y][x];
      const view = TILE_VIEW[tile] || TILE_VIEW["."];
      const key = `${x},${y}`;
      const previewStep = preview?.path.get(key);
      const hasCastMark = preview?.casts.has(key);
      const isPreviewFinal = preview?.finalKey === key;
      const isPreviewError = preview?.collisionKey === key;
      const isGoalCell = reachGoal === key;
      const isBuildTarget =
        level.goal.type === "build" && goalSet.has(key) && tile !== "B";
      const hasGem = runtime.gems.has(key);
      const wizardClass =
        runtime.wizard.x === x && runtime.wizard.y === y
          ? `<div class="wizard wizard--${runtime.wizard.dir}"></div>`
          : "";
      const stepBadge = previewStep
        ? `<span class="path-step">${previewStep}</span>`
        : "";
      const castMark = hasCastMark ? `<span class="cast-mark">✦</span>` : "";
      const classes = [
        "cell",
        view.className,
        isGoalCell ? "cell-goal" : "",
        isBuildTarget ? "cell-target" : "",
        hasGem ? "cell-gem" : "",
        previewStep ? "cell-preview" : "",
        isPreviewFinal ? "cell-preview-final" : "",
        isPreviewError ? "cell-preview-error" : "",
      ].filter(Boolean).join(" ");

      cells.push(`
        <div class="${classes}">
          ${stepBadge}
          ${castMark}
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
        Začni krokem vpřed. Stopu uvidíš ještě před spuštěním.
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
  const progress = describeProgress(level, runtime);

  elements.goalStatus.textContent = progress.label;
  elements.goalPercent.textContent = `${progress.percent}%`;
  elements.goalMeter.style.width = `${progress.percent}%`;
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
      "Po dvou pokusech se objeví jemná nápověda.";
    return;
  }

  if (session.lastHintText) {
    elements.hintText.textContent = session.lastHintText;
    return;
  }

  elements.hintText.textContent =
    "Nápověda je připravená. Bude to jen malé pošťouchnutí.";
}

function renderButtons() {
  const hasProgram = state.program.length > 0;
  const isRunning = Boolean(state.playback?.running);
  const level = currentLevel();

  elements.runButton.disabled = !hasProgram || isRunning;
  elements.stepButton.disabled = !hasProgram || isRunning;
  elements.stopButton.disabled = !isRunning;
  elements.resetButton.disabled = false;
  elements.undoButton.disabled = !hasProgram || isRunning;
  elements.clearButton.disabled = !hasProgram || isRunning;
  elements.tripleStepButton.disabled =
    isRunning || !level.allowed.includes("MOVE");
}

function simulateProgram(level, program) {
  const runtime = createRuntime(level);
  const path = new Map();
  const casts = new Map();
  let collisionKey = "";

  for (let index = 0; index < program.length; index += 1) {
    const commandId = program[index];

    if (commandId === "MOVE") {
      const next = tileInFront(runtime.wizard);

      if (!isInside(level, next.x, next.y)) {
        collisionKey = pointKey(runtime.wizard);
        break;
      }

      if (isSolid(runtime.grid[next.y][next.x])) {
        collisionKey = pointKey(next);
        break;
      }

      runtime.steps += 1;
      runtime.wizard.x = next.x;
      runtime.wizard.y = next.y;
      runtime.gems.delete(pointKey(next));

      if (!path.has(pointKey(next))) {
        path.set(pointKey(next), index + 1);
      }

      continue;
    }

    if (commandId === "TURN_LEFT") {
      runtime.steps += 1;
      runtime.wizard.dir = DIRECTIONS[(DIRECTIONS.indexOf(runtime.wizard.dir) + 3) % 4];
      continue;
    }

    if (commandId === "TURN_RIGHT") {
      runtime.steps += 1;
      runtime.wizard.dir = DIRECTIONS[(DIRECTIONS.indexOf(runtime.wizard.dir) + 1) % 4];
      continue;
    }

    if (commandId === "CAST") {
      runtime.steps += 1;
      const target = tileInFront(runtime.wizard);

      if (!isInside(level, target.x, target.y)) {
        collisionKey = pointKey(runtime.wizard);
        break;
      }

      const targetKey = pointKey(target);
      casts.set(targetKey, true);

      if (level.goal.type === "lights" && runtime.grid[target.y][target.x] === "w") {
        runtime.grid[target.y][target.x] = "W";
      }

      if (
        level.goal.type === "build" &&
        buildTargetSet(level).has(targetKey) &&
        runtime.grid[target.y][target.x] !== "B"
      ) {
        runtime.grid[target.y][target.x] = "B";
      }
    }
  }

  return {
    path,
    casts,
    collisionKey,
    finalKey: pointKey(runtime.wizard),
  };
}

function describeProgress(level, runtime) {
  const gemTotal = gemCount(level);
  const gemsDone = gemTotal - runtime.gems.size;

  if (level.goal.type === "reach") {
    const atGoal = isGoalMet(level, runtime);
    const units = gemTotal + 1;
    const done = gemsDone + (atGoal ? 1 : 0);
    return {
      label: `Hvězda ${atGoal ? "nalezená" : "čeká"} · ${gemsDone}/${gemTotal} 💎`,
      percent: atGoal ? 100 : clampPercent((done / units) * 100),
    };
  }

  if (level.goal.type === "lights") {
    const total = level.goal.targets.length;
    const lit = level.goal.targets.filter(({ x, y }) => runtime.grid[y][x] === "W").length;
    return {
      label: `Okna ${lit}/${total} · ${gemsDone}/${gemTotal} 💎`,
      percent: lit === total
        ? 100
        : clampPercent(((lit + gemsDone * 0.25) / (total + gemTotal * 0.25)) * 100),
    };
  }

  if (level.goal.type === "build") {
    const total = level.goal.targets.length;
    const built = level.goal.targets.filter(({ x, y }) => runtime.grid[y][x] === "B").length;
    return {
      label: `Cihly ${built}/${total} · ${gemsDone}/${gemTotal} 💎`,
      percent: built === total
        ? 100
        : clampPercent(((built + gemsDone * 0.25) / (total + gemTotal * 0.25)) * 100),
    };
  }

  return { label: "Plň kouzelnickou misi.", percent: 0 };
}

function buildTargetSet(level) {
  if (!level._targetSet) {
    level._targetSet = new Set((level.goal.targets || []).map(pointKey));
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
  const word = count === 1 ? "příkaz" : count >= 2 && count <= 4 ? "příkazy" : "příkazů";
  return `${count} ${word}`;
}

function challengeThresholds(level) {
  const minimum = level.minimumSteps;

  return {
    minimum,
    medium: Math.ceil(minimum * 1.45),
    hard: Math.ceil(minimum * 1.15),
  };
}

function formatChallengeSummary(level) {
  const thresholds = challengeThresholds(level);
  return `Lehká: bez limitu · Střední: do ${thresholds.medium} · Těžká: do ${thresholds.hard}`;
}

function scoreLevel(level, steps) {
  const thresholds = challengeThresholds(level);

  if (steps <= thresholds.hard) {
    return 3;
  }

  if (steps <= thresholds.medium) {
    return 2;
  }

  return 1;
}

function renderStars(stars) {
  const safeStars = Math.max(0, Math.min(3, stars));
  return `${"⭐".repeat(safeStars)}${"☆".repeat(3 - safeStars)}`;
}

function storeLevelResult(levelId, bestSteps, stars, gems) {
  const current = state.save.results[levelId];
  const nextBest =
    current?.bestSteps && current.bestSteps < bestSteps ? current.bestSteps : bestSteps;
  const nextStars = Math.max(current?.stars || 0, stars);
  const nextGems = Math.max(current?.gems || 0, gems);

  state.save.results[levelId] = {
    completed: true,
    bestSteps: nextBest,
    stars: nextStars,
    gems: nextGems,
  };

  persistSave();
}

function unlockNextLevel(levelId) {
  const index = levelIndexById.get(levelId);
  const next = LEVELS[index + 1];

  if (!next || state.save.unlocked.includes(next.id)) {
    persistSave();
    return false;
  }

  state.save.unlocked.push(next.id);
  persistSave();
  return true;
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
    setFeedback("Ještě chvilku zkoušej. Nápověda se odemkne po dvou pokusech.");
    return;
  }

  const hint = level.hints[Math.min(session.hintIndex, level.hints.length - 1)];
  session.lastHintText = hint;
  session.hintIndex = Math.min(session.hintIndex + 1, level.hints.length - 1);
  setFeedback(`Nápověda: ${hint}`);
  render();
}

function showCelebration(level, steps, stars, gems, newlyUnlocked) {
  const next = getNextLevel(level.id);
  elements.celebrationTitle.textContent = `${level.icon} ${level.title} hotovo!`;
  elements.celebrationStars.textContent = renderStars(stars);
  elements.celebrationText.textContent =
    `Za ${steps} kroků, ${gems}/${gemCount(level)} drahokamů. ${
      newlyUnlocked && next ? `Odemkla se mise ${next.title}.` : "Můžeš zkusit lepší trasu nebo pokračovat dál."
    }`;
  elements.nextLevelButton.textContent = next ? "Další mise" : "Hrát znovu od začátku";
  elements.celebration.hidden = false;
  elements.nextLevelButton.focus({ preventScroll: true });
}

function hideCelebration() {
  elements.celebration.hidden = true;
}

function goToNextLevel() {
  const level = LEVELS[levelIndexById.get(state.lastCompletedLevelId || state.currentLevelId)];
  const next = getNextLevel(level.id);

  if (next && isLevelUnlocked(next.id)) {
    selectLevel(next.id);
    return;
  }

  selectLevel(LEVELS[0].id);
}

function replayLevel() {
  hideCelebration();
  resetLevel();
}

function getNextLevel(levelId) {
  const index = levelIndexById.get(levelId);
  return LEVELS[index + 1] || null;
}

function openParentResetGate() {
  elements.resetGate.hidden = false;
  elements.resetAnswer.value = "";
  elements.resetAnswer.focus();
  setFeedback("Rodičovská brána čeká na odpověď.");
}

function confirmParentReset() {
  if (elements.resetAnswer.value.trim() !== "12") {
    setFeedback("Rodičovská brána zůstala zavřená.");
    elements.resetAnswer.select();
    return;
  }

  elements.resetGate.hidden = true;
  state.save = defaultSave();
  state.currentLevelId = LEVELS[0].id;
  state.program = [];
  state.playback = null;
  state.session = {};
  state.lastCompletedLevelId = null;
  persistSave();
  elements.speedSelect.value = String(state.save.settings.speedMs);
  elements.soundToggle.checked = state.save.settings.soundOn;
  hideCelebration();
  setFeedback("Postup byl smazán a výprava začíná znovu.");
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
  elements.feedback.classList.remove("status-bar--pulse");
  window.requestAnimationFrame(() => {
    elements.feedback.classList.add("status-bar--pulse");
  });
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
      speedMs: 440,
      soundOn: true,
    },
  };
}

function normalizeSave(save) {
  const unlocked = new Set([LEVELS[0].id, ...(save.unlocked || [])]);
  const results = {};

  LEVELS.forEach((level, index) => {
    const raw = save.results?.[level.id];

    if (raw?.completed) {
      results[level.id] = {
        completed: true,
        bestSteps: Number(raw.bestSteps) || 0,
        stars: Math.max(1, Math.min(3, Number(raw.stars) || 1)),
        gems: Math.max(0, Math.min(gemCount(level), Number(raw.gems) || 0)),
      };

      if (LEVELS[index + 1]) {
        unlocked.add(LEVELS[index + 1].id);
      }
    }
  });

  return {
    unlocked: LEVELS.map((level) => level.id).filter((id) => unlocked.has(id)),
    results,
    settings: {
      ...defaultSave().settings,
      ...(save.settings || {}),
    },
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

function playIf(enabled, kind) {
  if (enabled) {
    playTone(kind);
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

  const profiles = {
    step: [{ frequency: 330, duration: 0.05, type: "triangle", delay: 0 }],
    turn: [{ frequency: 430, duration: 0.05, type: "triangle", delay: 0 }],
    cast: [{ frequency: 680, duration: 0.12, type: "sine", delay: 0 }],
    gem: [
      { frequency: 640, duration: 0.08, type: "sine", delay: 0 },
      { frequency: 920, duration: 0.12, type: "sine", delay: 0.07 },
    ],
    bump: [{ frequency: 170, duration: 0.08, type: "square", delay: 0 }],
    success: [
      { frequency: 660, duration: 0.11, type: "sine", delay: 0 },
      { frequency: 820, duration: 0.12, type: "sine", delay: 0.1 },
      { frequency: 1040, duration: 0.22, type: "sine", delay: 0.22 },
    ],
    fail: [{ frequency: 160, duration: 0.18, type: "sawtooth", delay: 0 }],
  }[kind];

  if (!profiles) {
    return;
  }

  const context = state.audioContext;

  profiles.forEach((profile) => {
    const oscillator = context.createOscillator();
    const gain = context.createGain();
    const start = context.currentTime + profile.delay;

    oscillator.type = profile.type;
    oscillator.frequency.setValueAtTime(profile.frequency, start);
    gain.gain.setValueAtTime(0.0001, start);
    gain.gain.exponentialRampToValueAtTime(0.08, start + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.0001, start + profile.duration);

    oscillator.connect(gain);
    gain.connect(context.destination);

    oscillator.start(start);
    oscillator.stop(start + profile.duration + 0.02);
  });
}

function pointKey(point) {
  return `${point.x},${point.y}`;
}

function gemCount(level) {
  return level.gems?.length || 0;
}

function collectedGemTotal() {
  return Object.values(state.save.results).reduce((sum, result) => sum + (result.gems || 0), 0);
}

function clampPercent(value) {
  if (!Number.isFinite(value)) {
    return 0;
  }

  return Math.max(0, Math.min(100, Math.round(value)));
}
