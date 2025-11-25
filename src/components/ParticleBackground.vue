<template>
  <canvas ref="canvasEl"></canvas>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, watch } from "vue";
import { createNoise3D } from "simplex-noise";

// ===== STATE =====
const gridSpacing = ref(25);
const mouseRadius = ref(180);
const spring = ref(2);
const friction = ref(80);
const noiseStrength = ref(15);

const particleSize = ref(1);
const pillLength = ref(5);

const colorRingRadius = ref(250);
const colorRingThickness = ref(75);
const ringWiggle = ref(20);
const particleShape = ref("pill");

const canvasEl = ref(null);
let animationId;
let particles = [];

watch(gridSpacing, () => initGrid());

let lastWidth = 0;

window.addEventListener('resize', () => {
  if (canvasEl.value) {
    // On mobile, scrolling hides/shows address bar which triggers resize.
    // We only want to re-init grid if width changes (orientation change or desktop resize)
    const newWidth = window.innerWidth;
    if (newWidth !== lastWidth) {
      lastWidth = newWidth;
      canvasEl.value.width = window.innerWidth;
      canvasEl.value.height = window.innerHeight;
      initGrid();
    } else {
      // Just update height without destroying particles
      canvasEl.value.height = window.innerHeight;
    }
  }
});

function initGrid() {
  if (!canvasEl.value) return;
  particles = [];

  const spacing = gridSpacing.value;
  const cols = Math.ceil(canvasEl.value.width / spacing);
  const rows = Math.ceil(canvasEl.value.height / spacing);

  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      const px = x * spacing;
      const py = y * spacing;
      particles.push({
        homeX: px,
        homeY: py,
        x: px,
        y: py,
        vx: 0,
        vy: 0,
        // We now transition size and opacity independently
        currentSize: 0,
        currentAlpha: 0,
        textTarget: null,
        twinkleTimer: 0
      });
    }
  }
}

function drawPill(ctx, x, y, angle, size, length) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(angle);
  ctx.beginPath();
  ctx.roundRect(-length / 2, -size, length, size * 2, size);
  ctx.closePath();
  ctx.restore();
}

function drawCircle(ctx, x, y, size) {
  ctx.beginPath();
  ctx.arc(x, y, size, 0, Math.PI * 2);
  ctx.closePath();
}

onMounted(() => {
  // === EVENT LISTENERS ===
  window.addEventListener('excite_particles', () => {
    noiseStrength.value *= 10
    colorRingRadius.value /= 1.3
  })
  window.addEventListener('normalize_particles', () => {
    noiseStrength.value /= 10
    colorRingRadius.value *= 1.3
  })

  const canvas = canvasEl.value;
  const ctx = canvas.getContext("2d", { alpha: false });

  lastWidth = window.innerWidth;
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  initGrid();

  const noise3D = createNoise3D();
  let time = 0;

  // === TEXT MODE STATE ===
  let isTextMode = false;

  window.addEventListener('show_particle_text', (e) => {
    isTextMode = true;
    const { text, layout } = e.detail;
    calculateTextTargets(text, layout);
  });

  window.addEventListener('hide_particle_text', () => {
    isTextMode = false;
    // Reset targets so particles float back
    particles.forEach(p => p.textTarget = null);
  });

  function calculateTextTargets(text, layout = 'bottom') {
    const offCanvas = document.createElement('canvas');
    const offCtx = offCanvas.getContext('2d');
    offCanvas.width = canvas.width;
    offCanvas.height = canvas.height;

    offCtx.fillStyle = "white";
    offCtx.textAlign = "center";
    offCtx.textBaseline = "middle";

    if (layout === 'bottom') {
      offCtx.font = "900 150px Satoshi";
      offCtx.fillText(text, canvas.width / 2, canvas.height - 150);
    } else if (layout === 'sides') {
      // Render on Left and Right sides
      // Use smaller font to fit
      offCtx.font = "900 80px Satoshi";

      // Left Side
      offCtx.save();
      offCtx.translate(canvas.width * 0.15, canvas.height / 2);
      offCtx.rotate(-Math.PI / 2);
      offCtx.fillText(text, 0, 0);
      offCtx.restore();

      // Right Side
      offCtx.save();
      offCtx.translate(canvas.width * 0.85, canvas.height / 2);
      offCtx.rotate(Math.PI / 2);
      offCtx.fillText(text, 0, 0);
      offCtx.restore();
    }

    const imageData = offCtx.getImageData(0, 0, canvas.width, canvas.height).data;
    const targets = [];

    // Scan for pixels (step by 6 to reduce density)
    const step = 6;
    for (let y = 0; y < canvas.height; y += step) {
      for (let x = 0; x < canvas.width; x += step) {
        const alpha = imageData[(y * canvas.width + x) * 4 + 3];
        if (alpha > 128) {
          targets.push({ x, y });
        }
      }
    }

    // Reset assignments
    particles.forEach(p => p.textTarget = null);

    if (layout === 'bottom') {
      // For bottom layout (Lawcrative), user wants particles to come from the "top of the grid".
      // We simply assign the first N particles (which are at the top) to the targets.
      // This creates a "raining down" effect.
      for (let i = 0; i < targets.length && i < particles.length; i++) {
        particles[i].textTarget = targets[i];
      }
    } else {
      // For sides layout (Tech Stack), use greedy proximity assignment.
      // This ensures text on the left grabs left particles, and text on the right grabs right particles.

      // Use all particles as candidates
      const candidatePool = particles;

      // Greedy assignment: For each target, find closest available candidate
      targets.forEach(target => {
        let closestDist = Infinity;
        let closestIdx = -1;

        for (let i = 0; i < candidatePool.length; i++) {
          const p = candidatePool[i];
          if (p.textTarget) continue; // Already assigned

          const dx = p.x - target.x;
          const dy = p.y - target.y;
          const distSq = dx * dx + dy * dy;

          if (distSq < closestDist) {
            closestDist = distSq;
            closestIdx = i;
          }
        }

        if (closestIdx !== -1) {
          candidatePool[closestIdx].textTarget = target;
        }
      });
    }
  }

  const mouse = { x: -999, y: -999 };
  window.addEventListener("mousemove", (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });

  function animate() {
    // Use a slightly transparent clear to create very subtle trails
    ctx.fillStyle = "rgba(17, 17, 17, 0.6)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    time += 0.005;

    const mRadius = mouseRadius.value;
    const k = spring.value / 100;
    const f = friction.value / 100;
    const nStr = noiseStrength.value;
    const pShape = particleShape.value;
    const cRadius = colorRingRadius.value;
    const cThick = colorRingThickness.value;
    const wiggle = ringWiggle.value;
    const baseSize = particleSize.value;
    const baseLen = pillLength.value;

    // === VISUAL CONFIG ===
    const outsideScale = 0.3;  // Size factor when outside
    const innerHoleScale = 0.15; // Size factor when inside the hole (tiny)

    const dimAlpha = 0.15;     // Opacity when outside
    const brightAlpha = 1.0;   // Opacity when on ring or in hole

    const lerpSpeed = 0.05;    // Transition speed

    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];

      let tx, ty;

      // --- 1. PHYSICS (Standard vs Text Mode) ---
      if (isTextMode && p.textTarget) {
        // Move to text target
        tx = p.textTarget.x;
        ty = p.textTarget.y;

        // Add slight noise wiggle to text so it feels alive
        const nX = noise3D(tx * 0.01, ty * 0.01, time) * 2;
        const nY = noise3D(tx * 0.01 + 500, ty * 0.01 + 500, time) * 2;
        tx += nX;
        ty += nY;

      } else {
        // Standard noise movement
        const nX = noise3D(p.homeX * 0.01, p.homeY * 0.01, time) * nStr;
        const nY = noise3D(p.homeX * 0.01 + 500, p.homeY * 0.01 + 500, time) * nStr;
        tx = p.homeX + nX;
        ty = p.homeY + nY;
      }

      const dx = p.x - mouse.x;
      const dy = p.y - mouse.y;
      const distSq = dx * dx + dy * dy;
      const dist = Math.sqrt(distSq);

      if (dist < mRadius) {
        const force = (mRadius - dist) / mRadius;
        const angle = Math.atan2(dy, dx);
        const push = force * 6;
        p.vx += Math.cos(angle) * push;
        p.vy += Math.sin(angle) * push;
      }

      p.vx += (tx - p.x) * k;
      p.vy += (ty - p.y) * k;
      p.vx *= f;
      p.vy *= f;
      p.x += p.vx;
      p.y += p.vy;

      // --- 2. ZONE LOGIC (Determine 3 states) ---
      // State 0: Outside Far
      // State 1: On Ring
      // State 2: Inside Hole
      let regionState = 0;

      // Optimization: Only calculate complex noise geometry if broadly within possibility
      if (dist < cRadius + cThick + wiggle + 100) {
        const angleToMouse = Math.atan2(dy, dx);
        const noiseVal = noise3D(
          Math.cos(angleToMouse) * 1.5,
          Math.sin(angleToMouse) * 1.5,
          time * 0.4
        );

        // Calculate precise boundaries for this specific angle
        const localCenterRadius = cRadius + (noiseVal * wiggle);
        const innerEdge = localCenterRadius - cThick / 2;
        const outerEdge = localCenterRadius + cThick / 2;

        if (dist < innerEdge) {
          regionState = 2; // Inside Hole
        } else if (dist >= innerEdge && dist <= outerEdge) {
          regionState = 1; // On Ring
        } else {
          regionState = 0; // Outside
        }
      }

      // --- 3. DETERMINE TARGETS based on State ---
      let targetSize, targetAlpha;

      if (isTextMode && p.textTarget) {
        // Text Mode: Bright and visible
        targetSize = baseSize * 1.5;
        targetAlpha = 1.0;
      } else if (regionState === 2) {
        // Inside Hole: Tiny size, Bright opacity
        targetSize = baseSize * innerHoleScale * 2;
        targetAlpha = brightAlpha + 0.3;
      } else if (regionState === 1) {
        // On Ring: Full size, Bright opacity
        targetSize = baseSize;
        targetAlpha = brightAlpha;
      } else {
        // Outside: Medium size, Dim opacity
        targetSize = baseSize * outsideScale;
        targetAlpha = dimAlpha + 0.2;

        // Twinkle Logic (Randomly brighten particles to simulate life, especially on mobile)
        if (p.twinkleTimer > 0) {
          p.twinkleTimer--;
          targetAlpha = brightAlpha;
          targetSize = baseSize * 0.8; // Slightly larger than normal outside state
        } else {
          // Random chance to start twinkling (approx 1 in 2000 per frame)
          if (Math.random() < 0.0005) {
            p.twinkleTimer = Math.random() * 60 + 30; // 0.5 to 1.5 seconds
          }
        }
      }

      // --- 4. SMOOTH TRANSITIONS (Lerp independently) ---
      p.currentSize += (targetSize - p.currentSize) * lerpSpeed;
      p.currentAlpha += (targetAlpha - p.currentAlpha) * lerpSpeed;

      // --- 5. DRAW ---
      ctx.fillStyle = `rgba(158, 255, 237, ${p.currentAlpha})`;

      // Ensure size doesn't go negative during fast transitions and is big enough to render
      const drawSize = Math.max(0.1, p.currentSize);

      if (pShape === "pill") {
        const angle = Math.atan2(mouse.y - p.y, mouse.x - p.x);
        // Scale pill length proportionally to its size, but keep a minimum aspect ratio
        const curLen = Math.max(drawSize * 2, baseLen * (drawSize / baseSize));
        drawPill(ctx, p.x, p.y, angle, drawSize, curLen);
        ctx.fill();
      } else if (pShape === "circle") {
        drawCircle(ctx, p.x, p.y, drawSize);
        ctx.fill();
      } else if (pShape === "square") {
        ctx.fillRect(p.x - drawSize, p.y - drawSize, drawSize * 2, drawSize * 2);
      }
    }

    animationId = requestAnimationFrame(animate);
  }

  animate();
});

onBeforeUnmount(() => cancelAnimationFrame(animationId));
</script>

<style scoped>
canvas {
  display: block;
}
</style>