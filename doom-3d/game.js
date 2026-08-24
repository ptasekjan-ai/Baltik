import { LEVELS, validateLevels } from "./levels.js";

const STORAGE_KEY = "baltik-doom-3d-save-v1";
const SCREEN_WIDTH = 384;
const SCREEN_HEIGHT = 240;
const VIEW_HEIGHT = 184;
const HALF_VIEW = VIEW_HEIGHT / 2;
const FOV = Math.PI / 3;
const PLANE_LENGTH = Math.tan(FOV / 2);
const PLAYER_RADIUS = 0.22;
const SPELL_COST = 8;
const SPELL_RANGE = 11;

const canvas = document.getElementById("gameCanvas");
const context = canvas.getContext("2d", { alpha: false });
context.imageSmoothingEnabled = false;

const elements = {
  levelStrip: document.getElementById("levelStrip"),
  mapCode: document.getElementById("mapCode"),
  mapTitle: document.getElementById("mapTitle"),
  objectiveShort: document.getElementById("objectiveShort"),
  menuOverlay: document.getElementById("menuOverlay"),
  menuLevels: document.getElementById("menuLevels"),
  menuIntro: document.getElementById("menuIntro"),
  startButton: document.getElementById("startButton"),
  pauseOverlay: document.getElementById("pauseOverlay"),
  resumeButton: document.getElementById("resumeButton"),
  completeOverlay: document.getElementById("completeOverlay"),
  completeKicker: document.getElementById("completeKicker"),
  completeTitle: document.getElementById("completeTitle"),
  resultStats: document.getElementById("resultStats"),
  nextButton: document.getElementById("nextButton"),
  completeMenuButton: document.getElementById("completeMenuButton"),
  deadOverlay: document.getElementById("deadOverlay"),
  retryButton: document.getElementById("retryButton"),
  deadMenuButton: document.getElementById("deadMenuButton"),
  restartButton: document.getElementById("restartButton"),
  menuButton: document.getElementById("menuButton"),
  soundButton: document.getElementById("soundButton"),
  fullscreenButton: document.getElementById("fullscreenButton"),
  screenFrame: document.getElementById("screenFrame"),
  viewport: document.getElementById("viewport"),
  crosshair: document.getElementById("crosshair"),
  toast: document.getElementById("toast"),
  focusHint: document.getElementById("focusHint"),
  missionNumber: document.getElementById("missionNumber"),
  missionTitle: document.getElementById("missionTitle"),
  missionBrief: document.getElementById("missionBrief"),
  objectiveLong: document.getElementById("objectiveLong"),
  relicCounter: document.getElementById("relicCounter"),
  enemyCounter: document.getElementById("enemyCounter"),
  timeCounter: document.getElementById("timeCounter"),
  levelHint: document.getElementById("levelHint"),
};

const keys = new Set();
const touchKeys = new Set();
const zBuffer = new Float32Array(SCREEN_WIDTH);
const sprites = new Map();
const save = loadSave();
const localPreviewIndex = getLocalPreviewIndex();

let selectedLevelIndex = localPreviewIndex ?? Math.min(save.unlocked - 1, LEVELS.length - 1);
let currentLevelIndex = selectedLevelIndex;
let level = LEVELS[currentLevelIndex];
let runtime = null;
let player = null;
let mode = "menu";
let mapVisible = false;
let lastFrameTime = performance.now();
let toastUntil = 0;
let audioContext = null;
let soundEnabled = save.sound;

bootstrap();

function bootstrap() {
  try {
    validateLevels();
  } catch (error) {
    console.error(error);
    elements.menuIntro.textContent = "Levely se nepodařilo načíst. Obnov stránku nebo zkontroluj herní data.";
    elements.startButton.disabled = true;
    return;
  }

  buildSprites();
  bindControls();
  prepareLevel(selectedLevelIndex);
  showMenu();
  renderLevelSelectors();
  updateSoundButton();
  requestAnimationFrame(gameLoop);
}

function loadSave() {
  const fallback = { unlocked: 1, completed: {}, bestTimes: {}, sound: true };
  try {
    const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY) || "null");
    if (!parsed || typeof parsed !== "object") {
      return fallback;
    }
    return {
      unlocked: Math.max(1, Math.min(LEVELS.length, Number(parsed.unlocked) || 1)),
      completed: parsed.completed && typeof parsed.completed === "object" ? parsed.completed : {},
      bestTimes: parsed.bestTimes && typeof parsed.bestTimes === "object" ? parsed.bestTimes : {},
      sound: parsed.sound !== false,
    };
  } catch {
    return fallback;
  }
}

function getLocalPreviewIndex() {
  if (!['127.0.0.1', 'localhost', '::1'].includes(window.location.hostname)) {
    return null;
  }
  const value = Number(new URLSearchParams(window.location.search).get('preview'));
  return Number.isInteger(value) && value >= 1 && value <= LEVELS.length ? value - 1 : null;
}

function isLevelAvailable(index) {
  return index < save.unlocked || index === localPreviewIndex;
}

function storeSave() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(save));
  } catch {
    // Hra zůstane funkční i v prohlížeči, který lokální ukládání blokuje.
  }
}

function bindControls() {
  window.addEventListener("keydown", (event) => {
    const handledCodes = [
      "KeyW", "KeyA", "KeyS", "KeyD", "KeyQ", "KeyE",
      "ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight",
      "Space", "ShiftLeft", "ShiftRight", "Tab", "Escape", "Enter",
    ];
    if (handledCodes.includes(event.code)) {
      event.preventDefault();
    }

    if (event.code === "Escape") {
      if (mode === "playing") {
        pauseGame();
      } else if (mode === "paused") {
        resumeGame();
      }
      return;
    }

    if (event.code === "Enter" && mode === "menu") {
      startSelectedLevel();
      return;
    }

    if (event.code === "Tab" && mode === "playing" && !event.repeat) {
      mapVisible = !mapVisible;
      showToast(mapVisible ? "Automapa zapnuta" : "Automapa skryta", 1100);
      return;
    }

    if (event.code === "Space" && mode === "playing" && !event.repeat) {
      castSpell();
    }

    keys.add(event.code);
  });

  window.addEventListener("keyup", (event) => {
    keys.delete(event.code);
  });

  window.addEventListener("blur", () => {
    keys.clear();
    touchKeys.clear();
  });

  document.addEventListener("visibilitychange", () => {
    if (document.hidden && mode === "playing") {
      pauseGame();
    }
  });

  document.addEventListener("mousemove", (event) => {
    if (mode === "playing" && document.pointerLockElement === canvas) {
      player.angle = normalizeAngle(player.angle + event.movementX * 0.0032);
    }
  });

  document.addEventListener("pointerlockchange", () => {
    elements.focusHint.textContent = document.pointerLockElement === canvas
      ? "Myš ovládá pohled · Escape ji uvolní."
      : "Klikni do obrazu pro ovládání myší.";
  });

  canvas.addEventListener("click", () => {
    if (mode !== "playing") {
      return;
    }
    canvas.focus();
    if (document.pointerLockElement !== canvas && canvas.requestPointerLock) {
      canvas.requestPointerLock().catch(() => {});
    }
  });

  elements.startButton.addEventListener("click", startSelectedLevel);
  elements.resumeButton.addEventListener("click", resumeGame);
  elements.retryButton.addEventListener("click", restartLevel);
  elements.nextButton.addEventListener("click", goToNextLevel);
  elements.completeMenuButton.addEventListener("click", showMenu);
  elements.deadMenuButton.addEventListener("click", showMenu);
  elements.restartButton.addEventListener("click", restartLevel);
  elements.menuButton.addEventListener("click", showMenu);
  elements.soundButton.addEventListener("click", toggleSound);
  elements.fullscreenButton.addEventListener("click", toggleFullscreen);

  elements.levelStrip.addEventListener("click", (event) => {
    const button = event.target.closest("[data-level-index]");
    if (!button || button.disabled) {
      return;
    }
    selectLevel(Number(button.dataset.levelIndex));
  });

  elements.menuLevels.addEventListener("click", (event) => {
    const button = event.target.closest("[data-level-index]");
    if (!button || button.disabled) {
      return;
    }
    selectLevel(Number(button.dataset.levelIndex));
  });

  for (const button of document.querySelectorAll("[data-hold]")) {
    const action = button.dataset.hold;
    const stop = (event) => {
      event.preventDefault();
      touchKeys.delete(action);
    };
    button.addEventListener("pointerdown", (event) => {
      event.preventDefault();
      button.setPointerCapture?.(event.pointerId);
      touchKeys.add(action);
    });
    button.addEventListener("pointerup", stop);
    button.addEventListener("pointercancel", stop);
    button.addEventListener("pointerleave", stop);
  }

  document.querySelector("[data-action='cast']").addEventListener("pointerdown", (event) => {
    event.preventDefault();
    castSpell();
  });
}

function selectLevel(index) {
  if (!Number.isInteger(index) || index < 0 || !isLevelAvailable(index)) {
    return;
  }
  if (mode !== "menu") {
    releasePointerLock();
    mode = "menu";
    hideAllOverlays();
    elements.menuOverlay.hidden = false;
    elements.crosshair.hidden = true;
  }
  selectedLevelIndex = index;
  prepareLevel(index);
  renderLevelSelectors();
}

function prepareLevel(index) {
  currentLevelIndex = index;
  level = LEVELS[index];
  runtime = {
    entities: level.entities.map((entity, entityIndex) => ({
      ...entity,
      id: `${level.id}-${entityIndex}`,
      active: true,
      alive: entity.type === "enemy" ? true : undefined,
      lit: entity.type === "brazier" ? false : undefined,
      alerted: false,
      attackCooldown: 0.35 + entityIndex * 0.07,
      hitFlash: 0,
    })),
    elapsed: 0,
    relics: 0,
    kills: 0,
    spellCooldown: 0,
    shotFlash: 0,
    hurtFlash: 0,
    portalAnnounced: false,
    nearPortalCooldown: 0,
    bobTime: 0,
  };

  player = {
    x: level.start.x,
    y: level.start.y,
    angle: level.start.angle,
    health: 100,
    mana: 100,
  };

  mapVisible = false;
  updatePortalState(false);
  updateMissionCopy();
  updateCounters();
}

function startSelectedLevel() {
  ensureAudio();
  prepareLevel(selectedLevelIndex);
  mode = "playing";
  hideAllOverlays();
  elements.crosshair.hidden = false;
  lastFrameTime = performance.now();
  showToast(level.shortGoal, 1800);
  playSound("start");
  canvas.focus();
}

function restartLevel() {
  selectedLevelIndex = currentLevelIndex;
  startSelectedLevel();
}

function showMenu() {
  releasePointerLock();
  selectedLevelIndex = isLevelAvailable(selectedLevelIndex)
    ? selectedLevelIndex
    : Math.min(save.unlocked - 1, LEVELS.length - 1);
  prepareLevel(selectedLevelIndex);
  mode = "menu";
  hideAllOverlays();
  elements.menuOverlay.hidden = false;
  elements.crosshair.hidden = true;
  renderLevelSelectors();
}

function pauseGame() {
  if (mode !== "playing") {
    return;
  }
  mode = "paused";
  releasePointerLock();
  elements.pauseOverlay.hidden = false;
  elements.crosshair.hidden = true;
}

function resumeGame() {
  if (mode !== "paused") {
    return;
  }
  mode = "playing";
  elements.pauseOverlay.hidden = true;
  elements.crosshair.hidden = false;
  lastFrameTime = performance.now();
  canvas.focus();
}

function hideAllOverlays() {
  elements.menuOverlay.hidden = true;
  elements.pauseOverlay.hidden = true;
  elements.completeOverlay.hidden = true;
  elements.deadOverlay.hidden = true;
}

function releasePointerLock() {
  if (document.pointerLockElement === canvas && document.exitPointerLock) {
    document.exitPointerLock();
  }
}

async function toggleFullscreen() {
  try {
    if (document.fullscreenElement) {
      await document.exitFullscreen();
    } else {
      await elements.screenFrame.requestFullscreen();
    }
  } catch {
    showToast("Celá obrazovka není dostupná", 1500);
  }
}

function toggleSound() {
  soundEnabled = !soundEnabled;
  save.sound = soundEnabled;
  storeSave();
  updateSoundButton();
  if (soundEnabled) {
    ensureAudio();
    playSound("pickup");
  }
}

function updateSoundButton() {
  elements.soundButton.setAttribute("aria-pressed", String(soundEnabled));
  elements.soundButton.innerHTML = soundEnabled
    ? '<span aria-hidden="true">♪</span> Zvuk'
    : '<span aria-hidden="true">×</span> Bez zvuku';
}

function ensureAudio() {
  if (!soundEnabled || audioContext) {
    audioContext?.resume?.();
    return;
  }
  const AudioContextClass = window.AudioContext || window.webkitAudioContext;
  if (AudioContextClass) {
    audioContext = new AudioContextClass();
  }
}

function tone(frequency, duration, type = "square", volume = 0.035, delay = 0) {
  if (!soundEnabled || !audioContext) {
    return;
  }
  const start = audioContext.currentTime + delay;
  const oscillator = audioContext.createOscillator();
  const gain = audioContext.createGain();
  oscillator.type = type;
  oscillator.frequency.setValueAtTime(frequency, start);
  gain.gain.setValueAtTime(0.0001, start);
  gain.gain.exponentialRampToValueAtTime(volume, start + 0.012);
  gain.gain.exponentialRampToValueAtTime(0.0001, start + duration);
  oscillator.connect(gain);
  gain.connect(audioContext.destination);
  oscillator.start(start);
  oscillator.stop(start + duration + 0.02);
}

function playSound(name) {
  if (!soundEnabled) {
    return;
  }
  ensureAudio();
  if (name === "cast") {
    tone(220, 0.09, "sawtooth", 0.045);
    tone(720, 0.08, "square", 0.025, 0.035);
  } else if (name === "hit") {
    tone(92, 0.08, "square", 0.045);
  } else if (name === "hurt") {
    tone(64, 0.16, "sawtooth", 0.055);
  } else if (name === "pickup") {
    tone(510, 0.11, "square", 0.035);
    tone(760, 0.13, "square", 0.03, 0.07);
  } else if (name === "ignite") {
    tone(145, 0.18, "triangle", 0.05);
    tone(292, 0.22, "square", 0.025, 0.08);
  } else if (name === "portal") {
    tone(110, 0.36, "sine", 0.04);
    tone(330, 0.45, "triangle", 0.035, 0.12);
  } else if (name === "start") {
    tone(165, 0.12, "square", 0.028);
    tone(220, 0.16, "square", 0.025, 0.1);
  } else if (name === "win") {
    [262, 330, 392, 523].forEach((note, index) => tone(note, 0.25, "square", 0.03, index * 0.11));
  }
}

function gameLoop(now) {
  const delta = Math.min(0.033, Math.max(0, (now - lastFrameTime) / 1000));
  lastFrameTime = now;

  if (mode === "playing") {
    update(delta);
  } else if (mode === "menu" && runtime) {
    runtime.bobTime += delta * 0.35;
    player.angle = normalizeAngle(player.angle + delta * 0.055);
  }

  render();
  requestAnimationFrame(gameLoop);
}

function update(delta) {
  runtime.elapsed += delta;
  runtime.bobTime += delta;
  runtime.spellCooldown = Math.max(0, runtime.spellCooldown - delta);
  runtime.shotFlash = Math.max(0, runtime.shotFlash - delta);
  runtime.hurtFlash = Math.max(0, runtime.hurtFlash - delta);
  runtime.nearPortalCooldown = Math.max(0, runtime.nearPortalCooldown - delta);
  player.mana = Math.min(100, player.mana + delta * 4.2);

  updateMovement(delta);
  updateEnemies(delta);
  updatePickupsAndPortal();
  updatePortalState(true);
  updateCounters();
}

function updateMovement(delta) {
  let forward = 0;
  let strafe = 0;
  let turn = 0;

  if (isPressed("KeyW", "ArrowUp") || touchKeys.has("forward")) forward += 1;
  if (isPressed("KeyS", "ArrowDown") || touchKeys.has("back")) forward -= 1;
  if (isPressed("KeyD")) strafe += 1;
  if (isPressed("KeyA")) strafe -= 1;
  if (isPressed("KeyE", "ArrowRight") || touchKeys.has("turnRight")) turn += 1;
  if (isPressed("KeyQ", "ArrowLeft") || touchKeys.has("turnLeft")) turn -= 1;

  if (turn) {
    player.angle = normalizeAngle(player.angle + turn * delta * 2.05);
  }

  if (!forward && !strafe) {
    return;
  }

  const length = Math.hypot(forward, strafe) || 1;
  forward /= length;
  strafe /= length;
  const sprint = isPressed("ShiftLeft", "ShiftRight") ? 1.45 : 1;
  const speed = 2.35 * sprint * delta;
  const cos = Math.cos(player.angle);
  const sin = Math.sin(player.angle);
  const dx = (cos * forward - sin * strafe) * speed;
  const dy = (sin * forward + cos * strafe) * speed;

  moveWithCollision(player, dx, dy, PLAYER_RADIUS);
}

function isPressed(...codes) {
  return codes.some((code) => keys.has(code));
}

function moveWithCollision(object, dx, dy, radius) {
  const nextX = object.x + dx;
  if (canOccupy(nextX, object.y, radius)) {
    object.x = nextX;
  }
  const nextY = object.y + dy;
  if (canOccupy(object.x, nextY, radius)) {
    object.y = nextY;
  }
}

function canOccupy(x, y, radius) {
  return !isWallAt(x - radius, y - radius)
    && !isWallAt(x + radius, y - radius)
    && !isWallAt(x - radius, y + radius)
    && !isWallAt(x + radius, y + radius);
}

function isWallAt(x, y) {
  const mapX = Math.floor(x);
  const mapY = Math.floor(y);
  const row = level.map[mapY];
  return !row || row[mapX] !== ".";
}

function updateEnemies(delta) {
  for (const enemy of runtime.entities) {
    if (enemy.type !== "enemy" || !enemy.alive) {
      continue;
    }

    enemy.attackCooldown -= delta;
    enemy.hitFlash = Math.max(0, enemy.hitFlash - delta);
    const dx = player.x - enemy.x;
    const dy = player.y - enemy.y;
    const distance = Math.hypot(dx, dy);

    if (!enemy.alerted && distance < 8.5 && hasLineOfSight(enemy.x, enemy.y, player.x, player.y)) {
      enemy.alerted = true;
    }

    if (!enemy.alerted) {
      continue;
    }

    const attackDistance = enemy.boss ? 1.05 : 0.72;
    if (distance > attackDistance) {
      const speed = enemy.variant === "wisp" ? 0.62 : enemy.boss ? 0.38 : 0.48;
      const step = speed * delta;
      moveWithCollision(enemy, (dx / distance) * step, (dy / distance) * step, enemy.boss ? 0.3 : 0.23);
    } else if (enemy.attackCooldown <= 0) {
      const damage = enemy.boss ? 14 : enemy.variant === "guardian" ? 10 : 6;
      hurtPlayer(damage);
      enemy.attackCooldown = enemy.boss ? 1.18 : 1.02;
    }
  }
}

function hasLineOfSight(fromX, fromY, toX, toY) {
  const distance = Math.hypot(toX - fromX, toY - fromY);
  const steps = Math.ceil(distance / 0.11);
  for (let step = 1; step < steps; step += 1) {
    const ratio = step / steps;
    const x = fromX + (toX - fromX) * ratio;
    const y = fromY + (toY - fromY) * ratio;
    if (isWallAt(x, y)) {
      return false;
    }
  }
  return true;
}

function hurtPlayer(amount) {
  if (mode !== "playing") {
    return;
  }
  player.health = Math.max(0, player.health - amount);
  runtime.hurtFlash = 0.32;
  playSound("hurt");
  if (player.health <= 0) {
    die();
  }
}

function die() {
  mode = "dead";
  releasePointerLock();
  elements.crosshair.hidden = true;
  elements.deadOverlay.hidden = false;
}

function castSpell() {
  if (mode !== "playing" || runtime.spellCooldown > 0) {
    return;
  }
  ensureAudio();

  if (player.mana < SPELL_COST) {
    showToast("Málo many – chvíli počkej", 1200);
    tone(72, 0.08, "square", 0.03);
    runtime.spellCooldown = 0.22;
    return;
  }

  player.mana -= SPELL_COST;
  runtime.spellCooldown = 0.28;
  runtime.shotFlash = 0.14;
  playSound("cast");

  const targets = runtime.entities
    .filter((entity) => (
      (entity.type === "enemy" && entity.alive)
      || (entity.type === "brazier" && !entity.lit)
    ))
    .map((entity) => {
      const dx = entity.x - player.x;
      const dy = entity.y - player.y;
      const distance = Math.hypot(dx, dy);
      const difference = Math.abs(angleDifference(Math.atan2(dy, dx), player.angle));
      const aimWindow = Math.min(0.24, 0.035 + 0.26 / Math.max(0.5, distance));
      return { entity, distance, difference, aimWindow };
    })
    .filter(({ entity, distance, difference, aimWindow }) => (
      distance <= SPELL_RANGE
      && difference <= aimWindow
      && hasLineOfSight(player.x, player.y, entity.x, entity.y)
    ))
    .sort((a, b) => (a.difference * 5 + a.distance * 0.015) - (b.difference * 5 + b.distance * 0.015));

  const hit = targets[0]?.entity;
  if (!hit) {
    return;
  }

  if (hit.type === "brazier") {
    hit.lit = true;
    playSound("ignite");
    showToast("Starý oheň znovu hoří", 1200);
    updatePortalState(true);
    updateCounters();
    return;
  }

  hit.hp -= 1;
  hit.alerted = true;
  hit.hitFlash = 0.12;
  playSound("hit");
  if (hit.hp <= 0) {
    hit.alive = false;
    hit.active = false;
    runtime.kills += 1;
    showToast(hit.boss ? "Strážce byl zlomen" : "Stín rozptýlen", 1200);
    if (runtime.kills % 2 === 0) {
      runtime.entities.push({
        id: `drop-${runtime.elapsed}-${runtime.kills}`,
        type: "mana",
        x: hit.x,
        y: hit.y,
        active: true,
      });
    }
    updatePortalState(true);
    updateCounters();
  }
}

function updatePickupsAndPortal() {
  for (const entity of runtime.entities) {
    if (!entity.active || entity.type === "enemy" || entity.type === "brazier") {
      continue;
    }
    const distance = Math.hypot(player.x - entity.x, player.y - entity.y);
    if (distance > 0.48) {
      continue;
    }

    if (entity.type === "rune") {
      entity.active = false;
      runtime.relics += 1;
      player.mana = Math.min(100, player.mana + 24);
      playSound("pickup");
      showToast(entity.variant === "seal" ? "Sluneční pečeť nalezena" : "Runová jiskra nalezena", 1350);
    } else if (entity.type === "health") {
      if (player.health >= 100) {
        continue;
      }
      entity.active = false;
      player.health = Math.min(100, player.health + 32);
      playSound("pickup");
      showToast("Život doplněn", 1000);
    } else if (entity.type === "mana") {
      if (player.mana >= 96) {
        continue;
      }
      entity.active = false;
      player.mana = Math.min(100, player.mana + 42);
      playSound("pickup");
      showToast("Mana doplněna", 1000);
    } else if (entity.type === "portal") {
      if (entity.open) {
        completeLevel();
        return;
      }
      if (runtime.nearPortalCooldown <= 0) {
        showToast(incompleteGoalMessage(), 1600);
        runtime.nearPortalCooldown = 2.2;
      }
    }
  }
}

function incompleteGoalMessage() {
  if (level.goal.type === "collect") {
    return `Portál čeká na runy ${runtime.relics}/${level.goal.required}`;
  }
  if (level.goal.type === "ignite") {
    return `Rozžehnuto ${litBrazierCount()}/${level.goal.required} ohňů`;
  }
  return bossAlive()
    ? "Portál drží poslední Strážce"
    : `Chybí pečetě ${runtime.relics}/${level.goal.required}`;
}

function updatePortalState(announce) {
  const portal = runtime.entities.find((entity) => entity.type === "portal");
  if (!portal) {
    return;
  }
  const ready = goalIsReady();
  portal.open = ready;
  if (ready && announce && !runtime.portalAnnounced) {
    runtime.portalAnnounced = true;
    playSound("portal");
    showToast("Portál je otevřen", 1800);
  }
}

function goalIsReady() {
  if (level.goal.type === "collect") {
    return runtime.relics >= level.goal.required;
  }
  if (level.goal.type === "ignite") {
    return litBrazierCount() >= level.goal.required;
  }
  if (level.goal.type === "sealBoss") {
    return runtime.relics >= level.goal.required && !bossAlive();
  }
  return false;
}

function litBrazierCount() {
  return runtime.entities.filter((entity) => entity.type === "brazier" && entity.lit).length;
}

function bossAlive() {
  return runtime.entities.some((entity) => entity.type === "enemy" && entity.boss && entity.alive);
}

function completeLevel() {
  if (mode !== "playing") {
    return;
  }
  mode = "complete";
  releasePointerLock();
  elements.crosshair.hidden = true;
  playSound("win");

  save.completed[level.id] = true;
  const previousBest = Number(save.bestTimes[level.id]) || Infinity;
  save.bestTimes[level.id] = Math.min(previousBest, runtime.elapsed);
  save.unlocked = Math.max(save.unlocked, Math.min(LEVELS.length, currentLevelIndex + 2));
  storeSave();
  renderLevelSelectors();

  const isFinal = currentLevelIndex === LEVELS.length - 1;
  elements.completeKicker.textContent = isFinal ? "Kapitola dokončena" : `${level.code} dokončen`;
  elements.completeTitle.textContent = isFinal ? "TŘI MISE SPLNĚNY" : "PORTÁL OTEVŘEN";
  elements.resultStats.innerHTML = `
    <div><span>Čas</span><strong>${formatTime(runtime.elapsed)}</strong></div>
    <div><span>Stíny</span><strong>${runtime.kills}</strong></div>
    <div><span>Život</span><strong>${Math.ceil(player.health)}%</strong></div>
  `;
  elements.nextButton.textContent = isFinal ? "Zpět na výběr" : "Další level";
  elements.completeOverlay.hidden = false;
}

function goToNextLevel() {
  if (currentLevelIndex < LEVELS.length - 1) {
    selectedLevelIndex = currentLevelIndex + 1;
    startSelectedLevel();
  } else {
    selectedLevelIndex = 0;
    showMenu();
  }
}

function renderLevelSelectors() {
  elements.levelStrip.innerHTML = LEVELS.map((item, index) => {
    const locked = !isLevelAvailable(index);
    const completed = Boolean(save.completed[item.id]);
    return `
      <button
        class="episode-button"
        type="button"
        data-level-index="${index}"
        ${locked ? "disabled" : ""}
        ${index === selectedLevelIndex ? 'aria-current="true"' : ""}
      >
        <span class="episode-button__code">${item.code}</span>
        <span class="episode-button__name">${item.title}</span>
        <span class="episode-button__state">${locked ? "▣" : completed ? "✓" : "◇"}</span>
      </button>
    `;
  }).join("");

  elements.menuLevels.innerHTML = LEVELS.map((item, index) => {
    const locked = !isLevelAvailable(index);
    const completed = Boolean(save.completed[item.id]);
    const best = save.bestTimes[item.id] ? `Nejlépe ${formatTime(save.bestTimes[item.id])}` : "Nová mise";
    return `
      <button
        class="menu-level-button"
        type="button"
        data-level-index="${index}"
        aria-pressed="${index === selectedLevelIndex}"
        ${locked ? "disabled" : ""}
      >
        <span>${locked ? "UZAMČENO" : item.code}</span>
        <strong>${item.title}</strong>
        <small>${locked ? "Dokonči předchozí level" : completed ? `✓ ${best}` : best}</small>
      </button>
    `;
  }).join("");
}

function updateMissionCopy() {
  elements.mapCode.textContent = level.code;
  elements.mapTitle.textContent = level.title;
  elements.objectiveShort.textContent = level.shortGoal;
  elements.missionNumber.textContent = level.number;
  elements.missionTitle.textContent = level.title;
  elements.missionBrief.textContent = level.brief;
  elements.objectiveLong.textContent = level.goalText;
  elements.levelHint.textContent = level.hint;
  elements.relicCounter.parentElement.querySelector("span").textContent = level.goal.noun;
}

function updateCounters() {
  const progress = level.goal.type === "ignite" ? litBrazierCount() : runtime.relics;
  elements.relicCounter.textContent = `${progress} / ${level.goal.required}`;
  elements.enemyCounter.textContent = String(runtime.entities.filter((entity) => entity.type === "enemy" && entity.alive).length);
  elements.timeCounter.textContent = formatTime(runtime.elapsed);

  if (goalIsReady()) {
    elements.objectiveShort.textContent = "Portál otevřen";
  } else if (level.goal.type === "ignite") {
    elements.objectiveShort.textContent = `Ohně ${progress}/${level.goal.required}`;
  } else if (level.goal.type === "sealBoss") {
    elements.objectiveShort.textContent = bossAlive()
      ? `Pečetě ${progress}/${level.goal.required} · Strážce žije`
      : `Pečetě ${progress}/${level.goal.required} · Strážce padl`;
  } else {
    elements.objectiveShort.textContent = `Runy ${progress}/${level.goal.required}`;
  }
}

function showToast(message, duration = 1400) {
  elements.toast.textContent = message;
  elements.toast.classList.add("is-visible");
  toastUntil = performance.now() + duration;
  window.setTimeout(() => {
    if (performance.now() >= toastUntil - 20) {
      elements.toast.classList.remove("is-visible");
    }
  }, duration + 30);
}

function formatTime(seconds) {
  const safeSeconds = Math.max(0, Math.floor(Number(seconds) || 0));
  const minutes = Math.floor(safeSeconds / 60);
  const remainder = safeSeconds % 60;
  return `${String(minutes).padStart(2, "0")}:${String(remainder).padStart(2, "0")}`;
}

function normalizeAngle(angle) {
  let normalized = angle % (Math.PI * 2);
  if (normalized < 0) normalized += Math.PI * 2;
  return normalized;
}

function angleDifference(a, b) {
  let difference = normalizeAngle(a) - normalizeAngle(b);
  if (difference > Math.PI) difference -= Math.PI * 2;
  if (difference < -Math.PI) difference += Math.PI * 2;
  return difference;
}

function render() {
  if (!runtime || !player) {
    return;
  }
  renderWorld();
  renderSprites();
  if (mapVisible && mode === "playing") {
    renderAutomap();
  }
  renderWeapon();
  renderHud();
  renderScreenEffects();
}

function renderWorld() {
  const skyRgb = hexToRgb(level.colors.sky);
  const ceilingRgb = hexToRgb(level.colors.ceiling);
  const floorRgb = hexToRgb(level.colors.floor);

  for (let y = 0; y < HALF_VIEW; y += 2) {
    const ratio = y / HALF_VIEW;
    const color = mixRgb(skyRgb, ceilingRgb, Math.min(1, ratio * 1.2));
    context.fillStyle = rgb(color);
    context.fillRect(0, y, SCREEN_WIDTH, 2);
  }
  for (let y = HALF_VIEW; y < VIEW_HEIGHT; y += 2) {
    const ratio = (y - HALF_VIEW) / HALF_VIEW;
    const shade = 0.54 + ratio * 0.42;
    const checker = Math.floor(y / 5) % 2 ? 0.96 : 1;
    context.fillStyle = rgb(scaleRgb(floorRgb, shade * checker));
    context.fillRect(0, y, SCREEN_WIDTH, 2);
  }

  const dirX = Math.cos(player.angle);
  const dirY = Math.sin(player.angle);
  const planeX = -dirY * PLANE_LENGTH;
  const planeY = dirX * PLANE_LENGTH;

  for (let screenX = 0; screenX < SCREEN_WIDTH; screenX += 1) {
    const cameraX = (2 * screenX) / SCREEN_WIDTH - 1;
    const rayDirX = dirX + planeX * cameraX;
    const rayDirY = dirY + planeY * cameraX;
    let mapX = Math.floor(player.x);
    let mapY = Math.floor(player.y);
    const deltaDistX = rayDirX === 0 ? 1e30 : Math.abs(1 / rayDirX);
    const deltaDistY = rayDirY === 0 ? 1e30 : Math.abs(1 / rayDirY);
    const stepX = rayDirX < 0 ? -1 : 1;
    const stepY = rayDirY < 0 ? -1 : 1;
    let sideDistX = rayDirX < 0
      ? (player.x - mapX) * deltaDistX
      : (mapX + 1 - player.x) * deltaDistX;
    let sideDistY = rayDirY < 0
      ? (player.y - mapY) * deltaDistY
      : (mapY + 1 - player.y) * deltaDistY;
    let side = 0;
    let tile = "#";

    for (let guard = 0; guard < 64; guard += 1) {
      if (sideDistX < sideDistY) {
        sideDistX += deltaDistX;
        mapX += stepX;
        side = 0;
      } else {
        sideDistY += deltaDistY;
        mapY += stepY;
        side = 1;
      }
      tile = level.map[mapY]?.[mapX] || "#";
      if (tile !== ".") {
        break;
      }
    }

    const distance = Math.max(0.0001, side === 0 ? sideDistX - deltaDistX : sideDistY - deltaDistY);
    zBuffer[screenX] = distance;
    const lineHeight = Math.floor(VIEW_HEIGHT / distance);
    const drawStart = Math.max(0, Math.floor(-lineHeight / 2 + HALF_VIEW));
    const drawEnd = Math.min(VIEW_HEIGHT - 1, Math.floor(lineHeight / 2 + HALF_VIEW));
    let wallX = side === 0
      ? player.y + distance * rayDirY
      : player.x + distance * rayDirX;
    wallX -= Math.floor(wallX);
    if ((side === 0 && rayDirX > 0) || (side === 1 && rayDirY < 0)) {
      wallX = 1 - wallX;
    }

    for (let y = drawStart; y <= drawEnd; y += 2) {
      const textureY = (y - (-lineHeight / 2 + HALF_VIEW)) / Math.max(1, lineHeight);
      context.fillStyle = wallPixelColor(tile, wallX, textureY, distance, side, mapX, mapY);
      context.fillRect(screenX, y, 1, Math.min(2, drawEnd - y + 1));
    }
  }
}

function wallPixelColor(tile, u, v, distance, side, mapX, mapY) {
  let base;
  let mortar = false;
  const row = Math.floor(v * 10);

  if (tile === "B") {
    const shiftedU = u * 4 + (row % 2) * 0.5;
    mortar = (v * 10) % 1 < 0.095 || shiftedU % 1 < 0.07;
    base = mortar ? [48, 30, 29] : [137 + (row % 3) * 7, 60, 43];
  } else if (tile === "G") {
    const seam = u < 0.035 || u > 0.965 || (v * 6) % 1 < 0.055;
    const rivet = ((Math.floor(u * 16) + Math.floor(v * 18) + mapX + mapY) % 23 === 0);
    base = rivet ? [163, 147, 94] : seam ? [30, 36, 39] : [78, 91, 94];
  } else {
    const shiftedU = u * 3.5 + (row % 2) * 0.48;
    mortar = (v * 10) % 1 < 0.08 || shiftedU % 1 < 0.055;
    const variation = ((mapX * 11 + mapY * 7 + row) % 5) * 5;
    base = mortar ? [43, 39, 43] : [101 + variation, 93 + variation * 0.55, 91 + variation * 0.35];
  }

  const sideShade = side ? 0.74 : 1;
  const light = Math.max(0.23, 1 - distance / 15) * sideShade;
  const shaded = scaleRgb(base, light);
  const fogAmount = Math.min(0.7, Math.max(0, (distance - 4) / 16));
  return rgb(mixRgb(shaded, level.colors.fog, fogAmount));
}

function renderSprites() {
  const dirX = Math.cos(player.angle);
  const dirY = Math.sin(player.angle);
  const planeX = -dirY * PLANE_LENGTH;
  const planeY = dirX * PLANE_LENGTH;
  const inverseDeterminant = 1 / (planeX * dirY - dirX * planeY);

  const visible = runtime.entities
    .filter((entity) => entity.active && (entity.type !== "enemy" || entity.alive))
    .map((entity) => ({
      entity,
      distanceSquared: (player.x - entity.x) ** 2 + (player.y - entity.y) ** 2,
    }))
    .sort((a, b) => b.distanceSquared - a.distanceSquared);

  for (const { entity } of visible) {
    const sprite = sprites.get(spriteKey(entity));
    if (!sprite) {
      continue;
    }
    const spriteX = entity.x - player.x;
    const spriteY = entity.y - player.y;
    const transformX = inverseDeterminant * (dirY * spriteX - dirX * spriteY);
    const transformY = inverseDeterminant * (-planeY * spriteX + planeX * spriteY);
    if (transformY <= 0.08) {
      continue;
    }

    const scale = spriteScale(entity);
    const spriteHeight = Math.abs(Math.floor((VIEW_HEIGHT / transformY) * scale));
    const spriteWidth = Math.max(1, Math.floor(spriteHeight * (sprite.width / sprite.height)));
    const screenX = Math.floor((SCREEN_WIDTH / 2) * (1 + transformX / transformY));
    const bob = spriteBob(entity);
    const drawStartY = Math.floor(-spriteHeight / 2 + HALF_VIEW + bob);
    const drawStartX = Math.floor(-spriteWidth / 2 + screenX);
    const drawEndX = drawStartX + spriteWidth;

    for (let stripe = Math.max(0, drawStartX); stripe < Math.min(SCREEN_WIDTH, drawEndX); stripe += 1) {
      if (transformY >= zBuffer[stripe]) {
        continue;
      }
      const textureX = Math.floor(((stripe - drawStartX) / spriteWidth) * sprite.width);
      context.drawImage(
        sprite,
        Math.max(0, Math.min(sprite.width - 1, textureX)), 0, 1, sprite.height,
        stripe, drawStartY, 1, spriteHeight,
      );
    }
  }
}

function spriteKey(entity) {
  if (entity.type === "portal") return entity.open ? "portal-open" : "portal-closed";
  if (entity.type === "brazier") return entity.lit ? "brazier-lit" : "brazier-cold";
  if (entity.type === "rune") return entity.variant === "seal" ? "seal" : "rune";
  if (entity.type === "enemy") return entity.variant || "wisp";
  return entity.type;
}

function spriteScale(entity) {
  const scales = {
    portal: 1.08,
    rune: 0.48,
    brazier: 0.68,
    enemy: entity.boss ? 1.18 : entity.variant === "guardian" ? 0.82 : 0.72,
    health: 0.43,
    mana: 0.43,
  };
  return scales[entity.type] || 0.7;
}

function spriteBob(entity) {
  if (entity.type === "rune" || entity.type === "mana") {
    return Math.sin(runtime.bobTime * 3 + entity.x) * 3;
  }
  if (entity.type === "enemy" && entity.variant === "wisp") {
    return Math.sin(runtime.bobTime * 4 + entity.y) * 2;
  }
  return 0;
}

function renderWeapon() {
  if (mapVisible && mode === "playing") {
    return;
  }
  const moving = isPressed("KeyW", "KeyA", "KeyS", "KeyD", "ArrowUp", "ArrowDown") || touchKeys.size > 0;
  const bobX = moving ? Math.sin(runtime.bobTime * 8) * 3 : 0;
  const bobY = moving ? Math.abs(Math.cos(runtime.bobTime * 8)) * 2 : 0;
  const centerX = SCREEN_WIDTH / 2 + bobX;
  const bottom = VIEW_HEIGHT + bobY + 5;

  context.save();
  context.translate(centerX, bottom);
  context.fillStyle = "#1d1214";
  context.fillRect(-27, -35, 54, 38);
  context.fillStyle = "#a35c43";
  context.fillRect(-22, -31, 18, 28);
  context.fillRect(4, -31, 18, 28);
  context.fillStyle = "#e6ad78";
  context.fillRect(-20, -29, 14, 8);
  context.fillRect(6, -29, 14, 8);
  context.fillStyle = "#3a2531";
  context.fillRect(-6, -58, 12, 58);
  context.fillStyle = "#6f4861";
  context.fillRect(-4, -54, 8, 48);
  context.fillStyle = "#d8bb58";
  context.fillRect(-8, -64, 16, 10);
  context.fillStyle = runtime.shotFlash > 0 ? "#f9ffff" : "#5ae4ee";
  context.fillRect(-5, -69, 10, 8);
  if (runtime.shotFlash > 0) {
    context.fillStyle = "rgba(118, 245, 255, .75)";
    context.fillRect(-14, -76, 28, 4);
    context.fillRect(-2, -88, 4, 30);
    context.fillStyle = "rgba(255, 243, 156, .9)";
    context.fillRect(-7, -81, 14, 14);
  }
  context.restore();
}

function renderHud() {
  context.fillStyle = "#0a080b";
  context.fillRect(0, VIEW_HEIGHT, SCREEN_WIDTH, SCREEN_HEIGHT - VIEW_HEIGHT);
  context.fillStyle = "#4f4642";
  context.fillRect(0, VIEW_HEIGHT, SCREEN_WIDTH, 4);
  context.fillStyle = "#211a1d";
  context.fillRect(0, VIEW_HEIGHT + 4, SCREEN_WIDTH, 52);
  context.fillStyle = "#070608";
  context.fillRect(59, VIEW_HEIGHT + 7, 2, 46);
  context.fillRect(194, VIEW_HEIGHT + 7, 2, 46);
  context.fillRect(327, VIEW_HEIGHT + 7, 2, 46);

  drawPortrait(6, VIEW_HEIGHT + 8);
  drawHudBar(68, VIEW_HEIGHT + 23, 116, 9, player.health, "#c94335", "ŽIVOT");
  drawHudBar(203, VIEW_HEIGHT + 23, 114, 9, player.mana, "#3fc4dd", "MANA");

  context.font = "bold 9px 'Courier New', monospace";
  context.fillStyle = "#9c9185";
  context.fillText(level.goal.noun.toUpperCase(), 334, VIEW_HEIGHT + 17);
  context.fillStyle = "#f2c45e";
  context.font = "bold 15px 'Courier New', monospace";
  const progress = level.goal.type === "ignite" ? litBrazierCount() : runtime.relics;
  context.fillText(`${progress}/${level.goal.required}`, 337, VIEW_HEIGHT + 35);

  context.fillStyle = "#8d8279";
  context.font = "bold 8px 'Courier New', monospace";
  context.fillText(level.code, 68, VIEW_HEIGHT + 48);
  context.fillText(`STÍNY ${runtime.entities.filter((entity) => entity.type === "enemy" && entity.alive).length}`, 131, VIEW_HEIGHT + 48);
  context.fillText(formatTime(runtime.elapsed), 270, VIEW_HEIGHT + 48);
}

function drawPortrait(x, y) {
  context.fillStyle = "#151015";
  context.fillRect(x, y, 47, 43);
  context.fillStyle = "#4d2a70";
  context.fillRect(x + 7, y + 6, 33, 9);
  context.fillRect(x + 13, y + 1, 20, 7);
  context.fillStyle = "#dfaf7d";
  context.fillRect(x + 12, y + 15, 24, 20);
  context.fillStyle = runtime.hurtFlash > 0 ? "#fff" : "#211622";
  context.fillRect(x + 16, y + 21, 5, 4);
  context.fillRect(x + 28, y + 21, 5, 4);
  context.fillStyle = "#694334";
  context.fillRect(x + 20, y + 29, 9, 3);
  context.fillStyle = "#286d74";
  context.fillRect(x + 9, y + 35, 30, 7);
}

function drawHudBar(x, y, width, height, value, color, label) {
  context.fillStyle = "#080609";
  context.fillRect(x - 2, y - 2, width + 4, height + 4);
  context.fillStyle = "#31282b";
  context.fillRect(x, y, width, height);
  context.fillStyle = color;
  context.fillRect(x, y, Math.floor(width * Math.max(0, Math.min(100, value)) / 100), height);
  context.fillStyle = "rgba(255,255,255,.25)";
  context.fillRect(x, y, Math.floor(width * Math.max(0, Math.min(100, value)) / 100), 2);
  context.fillStyle = "#a89d91";
  context.font = "bold 8px 'Courier New', monospace";
  context.fillText(label, x, y - 5);
  context.fillStyle = "#f4e8d0";
  context.font = "bold 10px 'Courier New', monospace";
  context.fillText(String(Math.ceil(value)), x + width - 24, y - 4);
}

function renderScreenEffects() {
  if (runtime.hurtFlash > 0) {
    context.fillStyle = `rgba(188, 24, 27, ${runtime.hurtFlash * 0.72})`;
    context.fillRect(0, 0, SCREEN_WIDTH, VIEW_HEIGHT);
  }
  if (runtime.shotFlash > 0) {
    context.fillStyle = `rgba(190, 252, 255, ${runtime.shotFlash * 0.45})`;
    context.fillRect(0, 0, SCREEN_WIDTH, VIEW_HEIGHT);
  }
}

function renderAutomap() {
  const mapWidth = level.map[0].length;
  const mapHeight = level.map.length;
  const cellSize = Math.min(9, Math.floor((VIEW_HEIGHT - 24) / mapHeight));
  const width = mapWidth * cellSize;
  const height = mapHeight * cellSize;
  const offsetX = Math.floor((SCREEN_WIDTH - width) / 2);
  const offsetY = Math.floor((VIEW_HEIGHT - height) / 2);

  context.fillStyle = "rgba(5, 4, 8, .88)";
  context.fillRect(0, 0, SCREEN_WIDTH, VIEW_HEIGHT);
  context.fillStyle = "#a12f32";
  for (let y = 0; y < mapHeight; y += 1) {
    for (let x = 0; x < mapWidth; x += 1) {
      if (level.map[y][x] !== ".") {
        context.fillRect(offsetX + x * cellSize, offsetY + y * cellSize, cellSize - 1, cellSize - 1);
      }
    }
  }

  for (const entity of runtime.entities) {
    if (!entity.active) continue;
    if (entity.type === "portal") context.fillStyle = entity.open ? "#67eff2" : "#69536f";
    else if (entity.type === "rune" || entity.type === "brazier") context.fillStyle = "#f1c859";
    else if (entity.type === "enemy" && entity.alive) context.fillStyle = "#d64a3c";
    else continue;
    context.fillRect(
      offsetX + Math.floor(entity.x * cellSize) - 1,
      offsetY + Math.floor(entity.y * cellSize) - 1,
      3,
      3,
    );
  }

  const px = offsetX + player.x * cellSize;
  const py = offsetY + player.y * cellSize;
  context.save();
  context.translate(px, py);
  context.rotate(player.angle);
  context.fillStyle = "#f8f1d7";
  context.beginPath();
  context.moveTo(5, 0);
  context.lineTo(-4, -3);
  context.lineTo(-4, 3);
  context.closePath();
  context.fill();
  context.restore();

  context.fillStyle = "#e5d9c2";
  context.font = "bold 9px 'Courier New', monospace";
  context.fillText("AUTOMAPA · TAB ZAVŘÍT", 9, 14);
}

function buildSprites() {
  sprites.set("rune", makeSprite(24, 36, (ctx) => {
    ctx.fillStyle = "rgba(78, 230, 255, .22)";
    ctx.fillRect(4, 5, 16, 25);
    ctx.fillStyle = "#bdfbff";
    ctx.fillRect(10, 3, 4, 4);
    ctx.fillStyle = "#4ee2f1";
    ctx.fillRect(7, 7, 10, 5);
    ctx.fillRect(5, 12, 14, 8);
    ctx.fillRect(8, 20, 8, 8);
    ctx.fillStyle = "#177eab";
    ctx.fillRect(9, 11, 6, 13);
    ctx.fillStyle = "#eaffff";
    ctx.fillRect(11, 9, 2, 15);
    ctx.fillStyle = "#82f5ff";
    ctx.fillRect(8, 31, 8, 2);
  }));

  sprites.set("seal", makeSprite(28, 38, (ctx) => {
    ctx.fillStyle = "rgba(255, 218, 79, .22)";
    ctx.fillRect(3, 5, 22, 27);
    ctx.fillStyle = "#ffe36b";
    ctx.fillRect(11, 2, 6, 6);
    ctx.fillRect(5, 12, 18, 13);
    ctx.fillRect(8, 8, 12, 21);
    ctx.fillStyle = "#b76625";
    ctx.fillRect(11, 9, 6, 18);
    ctx.fillStyle = "#fff6ae";
    ctx.fillRect(13, 6, 2, 23);
    ctx.fillRect(6, 17, 16, 3);
    ctx.fillStyle = "#ffdd59";
    ctx.fillRect(9, 33, 10, 2);
  }));

  sprites.set("portal-closed", makePortalSprite(false));
  sprites.set("portal-open", makePortalSprite(true));
  sprites.set("brazier-cold", makeBrazierSprite(false));
  sprites.set("brazier-lit", makeBrazierSprite(true));
  sprites.set("wisp", makeWispSprite());
  sprites.set("guardian", makeGuardianSprite(false));
  sprites.set("boss", makeGuardianSprite(true));

  sprites.set("health", makeSprite(24, 34, (ctx) => {
    ctx.fillStyle = "rgba(255, 63, 57, .2)";
    ctx.fillRect(3, 8, 18, 22);
    ctx.fillStyle = "#d7d0bb";
    ctx.fillRect(8, 3, 8, 7);
    ctx.fillStyle = "#8b1d28";
    ctx.fillRect(5, 10, 14, 20);
    ctx.fillStyle = "#ee4b43";
    ctx.fillRect(8, 13, 8, 14);
    ctx.fillStyle = "#ffd5bd";
    ctx.fillRect(11, 15, 2, 10);
    ctx.fillRect(8, 19, 8, 2);
    ctx.fillStyle = "#62202a";
    ctx.fillRect(5, 30, 14, 2);
  }));

  sprites.set("mana", makeSprite(24, 34, (ctx) => {
    ctx.fillStyle = "rgba(63, 220, 255, .2)";
    ctx.fillRect(3, 5, 18, 25);
    ctx.fillStyle = "#50dcec";
    ctx.fillRect(9, 2, 6, 5);
    ctx.fillRect(6, 7, 12, 16);
    ctx.fillRect(9, 23, 6, 7);
    ctx.fillStyle = "#c6ffff";
    ctx.fillRect(11, 6, 2, 19);
    ctx.fillStyle = "#246b9b";
    ctx.fillRect(7, 11, 3, 12);
    ctx.fillStyle = "#5feaf4";
    ctx.fillRect(7, 31, 10, 2);
  }));
}

function makeSprite(width, height, draw) {
  const sprite = document.createElement("canvas");
  sprite.width = width;
  sprite.height = height;
  const ctx = sprite.getContext("2d");
  ctx.imageSmoothingEnabled = false;
  draw(ctx);
  return sprite;
}

function makePortalSprite(open) {
  return makeSprite(40, 56, (ctx) => {
    ctx.fillStyle = "rgba(0,0,0,.55)";
    ctx.fillRect(5, 16, 30, 38);
    ctx.fillStyle = "#4e4551";
    ctx.fillRect(2, 17, 7, 38);
    ctx.fillRect(31, 17, 7, 38);
    ctx.fillRect(7, 7, 26, 8);
    ctx.fillRect(4, 11, 32, 9);
    ctx.fillStyle = "#8b7b72";
    ctx.fillRect(5, 18, 3, 34);
    ctx.fillRect(32, 18, 3, 34);
    ctx.fillRect(8, 10, 24, 3);
    if (open) {
      ctx.fillStyle = "#173862";
      ctx.fillRect(9, 18, 22, 34);
      ctx.fillStyle = "#5ce7ee";
      ctx.fillRect(11, 20, 5, 30);
      ctx.fillRect(24, 20, 5, 30);
      ctx.fillStyle = "#9b5cea";
      ctx.fillRect(16, 23, 8, 26);
      ctx.fillStyle = "#e4ffff";
      ctx.fillRect(19, 19, 3, 32);
      ctx.fillStyle = "rgba(87,236,255,.35)";
      ctx.fillRect(1, 14, 38, 40);
    } else {
      ctx.fillStyle = "#151119";
      ctx.fillRect(9, 18, 22, 34);
      ctx.fillStyle = "#433247";
      ctx.fillRect(11, 24, 18, 4);
      ctx.fillRect(11, 37, 18, 4);
      ctx.fillStyle = "#76506e";
      ctx.fillRect(18, 20, 4, 31);
    }
    ctx.fillStyle = "#bd8b3f";
    ctx.fillRect(3, 22, 3, 3);
    ctx.fillRect(34, 22, 3, 3);
  });
}

function makeBrazierSprite(lit) {
  return makeSprite(32, 44, (ctx) => {
    if (lit) {
      ctx.fillStyle = "rgba(255, 118, 29, .25)";
      ctx.fillRect(5, 1, 22, 25);
      ctx.fillStyle = "#d54a1f";
      ctx.fillRect(9, 10, 14, 13);
      ctx.fillStyle = "#ff9d2f";
      ctx.fillRect(11, 5, 10, 15);
      ctx.fillStyle = "#fff07a";
      ctx.fillRect(14, 3, 5, 16);
    }
    ctx.fillStyle = "#302b30";
    ctx.fillRect(5, 21, 22, 7);
    ctx.fillStyle = "#776d67";
    ctx.fillRect(7, 22, 18, 4);
    ctx.fillStyle = "#4a4241";
    ctx.fillRect(11, 28, 10, 11);
    ctx.fillStyle = "#282327";
    ctx.fillRect(6, 39, 20, 4);
    ctx.fillStyle = "#93857a";
    ctx.fillRect(9, 39, 14, 2);
  });
}

function makeWispSprite() {
  return makeSprite(34, 48, (ctx) => {
    ctx.fillStyle = "rgba(104, 66, 151, .28)";
    ctx.fillRect(3, 7, 28, 35);
    ctx.fillStyle = "#26172e";
    ctx.fillRect(9, 7, 16, 6);
    ctx.fillRect(6, 13, 22, 19);
    ctx.fillStyle = "#4d2c62";
    ctx.fillRect(3, 25, 28, 12);
    ctx.fillRect(7, 36, 8, 8);
    ctx.fillRect(20, 36, 7, 7);
    ctx.fillStyle = "#111018";
    ctx.fillRect(10, 16, 15, 11);
    ctx.fillStyle = "#71eff5";
    ctx.fillRect(12, 19, 4, 3);
    ctx.fillRect(20, 19, 4, 3);
    ctx.fillStyle = "#bdffff";
    ctx.fillRect(13, 19, 2, 2);
    ctx.fillRect(21, 19, 2, 2);
    ctx.fillStyle = "#342040";
    ctx.fillRect(1, 29, 7, 5);
    ctx.fillRect(27, 29, 6, 5);
  });
}

function makeGuardianSprite(boss) {
  const width = boss ? 48 : 38;
  const height = boss ? 60 : 52;
  return makeSprite(width, height, (ctx) => {
    const center = Math.floor(width / 2);
    ctx.fillStyle = boss ? "rgba(207,54,35,.28)" : "rgba(142,70,59,.2)";
    ctx.fillRect(2, 4, width - 4, height - 7);
    ctx.fillStyle = boss ? "#5d1e25" : "#4c3337";
    ctx.fillRect(center - 11, 7, 22, 15);
    ctx.fillRect(center - 15, 20, 30, 23);
    ctx.fillRect(center - 18, 28, 7, 19);
    ctx.fillRect(center + 11, 28, 7, 19);
    ctx.fillStyle = boss ? "#a8322d" : "#725052";
    ctx.fillRect(center - 9, 10, 18, 9);
    ctx.fillRect(center - 12, 23, 24, 16);
    ctx.fillStyle = "#141116";
    ctx.fillRect(center - 7, 13, 14, 7);
    ctx.fillStyle = boss ? "#ffe563" : "#ff7051";
    ctx.fillRect(center - 6, 14, 4, 3);
    ctx.fillRect(center + 3, 14, 4, 3);
    ctx.fillStyle = boss ? "#d9a438" : "#382b30";
    ctx.fillRect(center - 8, 45, 7, height - 47);
    ctx.fillRect(center + 2, 45, 7, height - 47);
    if (boss) {
      ctx.fillStyle = "#d1a84e";
      ctx.fillRect(center - 14, 3, 5, 8);
      ctx.fillRect(center + 9, 3, 5, 8);
      ctx.fillRect(center - 2, 22, 4, 18);
    }
  });
}

function hexToRgb(hex) {
  const normalized = hex.replace("#", "");
  return [
    parseInt(normalized.slice(0, 2), 16),
    parseInt(normalized.slice(2, 4), 16),
    parseInt(normalized.slice(4, 6), 16),
  ];
}

function scaleRgb(color, factor) {
  return color.map((channel) => Math.max(0, Math.min(255, Math.round(channel * factor))));
}

function mixRgb(from, to, amount) {
  return from.map((channel, index) => Math.round(channel + (to[index] - channel) * amount));
}

function rgb(color) {
  return `rgb(${color[0]}, ${color[1]}, ${color[2]})`;
}

globalThis.__BALTIK3D__ = Object.freeze({
  version: "1.0.0",
  validate: () => validateLevels(),
  snapshot: () => ({
    mode,
    level: level.code,
    levelIndex: currentLevelIndex,
    player: player ? {
      x: Number(player.x.toFixed(3)),
      y: Number(player.y.toFixed(3)),
      health: Math.ceil(player.health),
      mana: Math.ceil(player.mana),
    } : null,
    objective: runtime ? {
      progress: level.goal.type === "ignite" ? litBrazierCount() : runtime.relics,
      required: level.goal.required,
      ready: goalIsReady(),
    } : null,
    livingEnemies: runtime
      ? runtime.entities.filter((entity) => entity.type === "enemy" && entity.alive).length
      : 0,
  }),
});
