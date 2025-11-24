<template>
  <div class="controls">
    <div class="section-title">Grid Settings</div>
    <label>
      Grid Spacing: {{ gridSpacing }}px
      <input type="range" min="15" max="100" step="1" v-model.number="gridSpacing">
    </label>

    <div class="divider"></div>

    <div class="section-title">Visuals</div>
    <label>
      Base Size: {{ particleSize }}
      <input type="range" min="1" max="12" step="0.5" v-model.number="particleSize">
    </label>
    <label>
      Pill  length: {{ pillLength }}
      <input type="range" min="1" max="20" v-model.number="pillLength">
    </label>

    <label>
      Ring Radius: {{ colorRingRadius }}
      <input type="range" min="50" max="600" v-model.number="colorRingRadius">
    </label>

    <label>
      Ring Thickness: {{ colorRingThickness }}
      <input type="range" min="10" max="200" v-model.number="colorRingThickness">
    </label>
    

    <label>
      Ring Wiggle: {{ ringWiggle }}
      <input type="range" min="0" max="150" v-model.number="ringWiggle">
    </label>

    <label>
      Particle Shape:
      <select v-model="particleShape">
        <option value="pill">Pill</option>
        <option value="circle">Circle</option>
        <option value="square">Square</option>
      </select>
    </label>

    <div class="divider"></div>

    <div class="section-title">Physics</div>
    <label>
      Repulsion Radius: {{ mouseRadius }}
      <input type="range" min="0" max="500" v-model.number="mouseRadius">
    </label>

    <label>
      Spring Tension: {{ spring }}
      <input type="range" min="1" max="50" v-model.number="spring">
    </label>
    
    <label>
      Friction (Damping): {{ friction }}
      <input type="range" min="50" max="98" v-model.number="friction">
    </label>

    <label>
      Noise: {{ noiseStrength }}
      <input type="range" min="1" max="50" v-model.number="noiseStrength">
    </label>
  </div>

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

window.addEventListener('resize', () => {
  if (canvasEl.value) {
    canvasEl.value.width = window.innerWidth;
    canvasEl.value.height = window.innerHeight;
    initGrid();
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
        currentAlpha: 0
      });
    }
  }
}

function drawPill(ctx, x, y, angle, size, length) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(angle);
  ctx.beginPath();
  ctx.roundRect(-length/2, -size, length, size*2, size);
  ctx.closePath();
  ctx.restore();
}

function drawCircle(ctx, x, y, size) {
  ctx.beginPath();
  ctx.arc(x, y, size, 0, Math.PI * 2);
  ctx.closePath();
}

onMounted(() => {
  const canvas = canvasEl.value;
  const ctx = canvas.getContext("2d", { alpha: false });

  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  initGrid();

  const noise3D = createNoise3D();
  let time = 0;
  
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

      // --- 1. PHYSICS (Standard Spring/Repulsion) ---
      const nX = noise3D(p.homeX * 0.01, p.homeY * 0.01, time) * nStr;
      const nY = noise3D(p.homeX * 0.01 + 500, p.homeY * 0.01 + 500, time) * nStr;
      const tx = p.homeX + nX;
      const ty = p.homeY + nY;

      const dx = p.x - mouse.x;
      const dy = p.y - mouse.y;
      const distSq = dx*dx + dy*dy;
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
        const innerEdge = localCenterRadius - cThick/2;
        const outerEdge = localCenterRadius + cThick/2;
        
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

      if (regionState === 2) {
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
        ctx.fillRect(p.x - drawSize, p.y - drawSize, drawSize*2, drawSize*2);
      }
    }

    animationId = requestAnimationFrame(animate);
  }

  animate();
});

onBeforeUnmount(() => cancelAnimationFrame(animationId));
</script>

<style scoped>


html, body {
  background: #111;
  margin: 0;
}

canvas {
  display: block;
}

.controls {
  position: fixed;
  top: 10px;
  left: 10px;
  width: 240px;
  max-height: 90vh;
  overflow-y: auto;
  background: rgba(20, 20, 20, 0.9);
  padding: 15px;
  border-radius: 8px;
  color: #fff;
  font-family: monospace;
  border: 1px solid #444;
  display: flex;
  flex-direction: column;
  gap: 10px;
  box-shadow: 0 4px 15px rgba(0,0,0,0.5);
  user-select: none;
  z-index: 10;
}

/* Custom Scrollbar for controls */
.controls::-webkit-scrollbar {
  width: 6px;
}
.controls::-webkit-scrollbar-track {
  background: #222;
}
.controls::-webkit-scrollbar-thumb {
  background: #444;
  border-radius: 3px;
}

.section-title {
  font-size: 13px;
  font-weight: bold;
  color: #ff0055;
  text-transform: uppercase;
  margin-top: 5px;
}

.divider {
  height: 1px;
  background: #444;
  margin: 5px 0;
}

label {
  display: flex;
  flex-direction: column;
  font-size: 11px;
  color: #bbb;
}

input[type="range"] {
  margin-top: 5px;
  cursor: grab;
  accent-color: #ff0055; 
}

select {
  background: #333;
  color: white;
  border: 1px solid #555;
  margin-top: 5px;
  padding: 4px;
  border-radius: 4px;
}
</style>