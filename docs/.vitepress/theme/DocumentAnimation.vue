<template>
  <div class="document-animation">
    <canvas ref="canvas"></canvas>
    <div class="conversion-overlay">
      <div class="format-circle" v-for="(format, index) in formats" :key="format.name"
           :style="getCircleStyle(index)">
        <div class="format-icon">
          <img :src="format.icon" :alt="format.name" />
        </div>
        <div class="format-name">{{ format.name }}</div>
      </div>
      
      <svg class="arrow-container" width="100%" height="100%">
        <defs>
          <marker id="arrowhead" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto">
            <polygon points="0 0, 10 3, 0 6" fill="#00d9ff" />
          </marker>
          <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" style="stop-color:#00d9ff;stop-opacity:0" />
            <stop offset="50%" style="stop-color:#00d9ff;stop-opacity:1" />
            <stop offset="100%" style="stop-color:#7b2cbf;stop-opacity:0" />
          </linearGradient>
        </defs>
        <path v-for="(arrow, i) in activeArrows" :key="i"
              :d="arrow.path"
              stroke="url(#lineGradient)"
              stroke-width="2"
              fill="none"
              marker-end="url(#arrowhead)"
              class="arrow-path">
        </path>
      </svg>
      
      <div class="particles">
        <div v-for="i in 30" :key="i" class="particle" 
             :style="getParticleStyle(i)"></div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, reactive } from 'vue'

const canvas = ref(null)
const activeArrows = reactive([])
let animationId = null

const formats = [
  { 
    name: 'PDF', 
    icon: 'https://img.icons8.com/fluency/96/pdf.png',
    color: '#ff4757',
    angle: 0
  },
  { 
    name: 'DOCX', 
    icon: 'https://img.icons8.com/fluency/96/ms-word.png',
    color: '#2b7de9',
    angle: 72
  },
  { 
    name: 'PNG', 
    icon: 'https://img.icons8.com/fluency/96/png.png',
    color: '#00d2d3',
    angle: 144
  },
  { 
    name: 'XLSX', 
    icon: 'https://img.icons8.com/fluency/96/ms-excel.png',
    color: '#1ee3cf',
    angle: 216
  },
  { 
    name: 'JPG', 
    icon: 'https://img.icons8.com/fluency/96/jpg.png',
    color: '#ffa502',
    angle: 288
  }
]

const getCircleStyle = (index) => {
  const angle = (index * 72) * Math.PI / 180
  const radius = 35 // 百分比
  const x = 50 + radius * Math.cos(angle)
  const y = 50 + radius * Math.sin(angle)
  
  return {
    left: `${x}%`,
    top: `${y}%`,
    '--format-color': formats[index].color,
    animationDelay: `${index * 0.2}s`
  }
}

const getParticleStyle = (i) => {
  return {
    left: `${Math.random() * 100}%`,
    top: `${Math.random() * 100}%`,
    animationDelay: `${Math.random() * 3}s`,
    animationDuration: `${3 + Math.random() * 3}s`
  }
}

let currentArrowIndex = 0

const createArrow = () => {
  const from = currentArrowIndex
  const to = (currentArrowIndex + 1) % formats.length
  
  const fromAngle = formats[from].angle * Math.PI / 180
  const toAngle = formats[to].angle * Math.PI / 180
  const radius = 35
  
  const x1 = 50 + radius * Math.cos(fromAngle)
  const y1 = 50 + radius * Math.sin(fromAngle)
  const x2 = 50 + radius * Math.cos(toAngle)
  const y2 = 50 + radius * Math.sin(toAngle)
  
  // 创建曲线路径
  const midX = (x1 + x2) / 2
  const midY = (y1 + y2) / 2
  const controlX = midX + (y2 - y1) * 0.3
  const controlY = midY - (x2 - x1) * 0.3
  
  const path = `M ${x1} ${y1} Q ${controlX} ${controlY} ${x2} ${y2}`
  
  const arrow = { path, id: Date.now() }
  activeArrows.push(arrow)
  
  setTimeout(() => {
    const index = activeArrows.findIndex(a => a.id === arrow.id)
    if (index > -1) activeArrows.splice(index, 1)
  }, 2000)
  
  currentArrowIndex = (currentArrowIndex + 1) % formats.length
}

onMounted(() => {
  if (typeof window === 'undefined') return
  
  // 启动箭头动画
  const arrowInterval = setInterval(() => {
    createArrow()
  }, 1500)
  
  // 清理
  onUnmounted(() => {
    clearInterval(arrowInterval)
    if (animationId) cancelAnimationFrame(animationId)
  })
})
</script>

<style scoped>
.document-animation {
  width: 100%;
  height: 100%;
  position: relative;
  background: radial-gradient(circle at 50% 50%, rgba(91, 44, 191, 0.1) 0%, rgba(0, 0, 0, 0) 70%);
  overflow: hidden;
}

canvas {
  position: absolute;
  width: 100%;
  height: 100%;
}

.conversion-overlay {
  position: relative;
  width: 100%;
  height: 100%;
}

.format-circle {
  position: absolute;
  width: 100px;
  height: 100px;
  transform: translate(-50%, -50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  animation: floatAnimation 3s ease-in-out infinite;
  z-index: 2;
}

@keyframes floatAnimation {
  0%, 100% { transform: translate(-50%, -50%) translateY(0px); }
  50% { transform: translate(-50%, -50%) translateY(-10px); }
}

.format-icon {
  width: 80px;
  height: 80px;
  border-radius: 20px;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border: 2px solid var(--format-color);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3),
              0 0 20px var(--format-color);
  transition: all 0.3s ease;
  animation: pulseGlow 2s ease-in-out infinite;
}

@keyframes pulseGlow {
  0%, 100% { 
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3),
                0 0 20px var(--format-color);
    transform: scale(1);
  }
  50% { 
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3),
                0 0 30px var(--format-color);
    transform: scale(1.05);
  }
}

.format-icon img {
  width: 60px;
  height: 60px;
  filter: drop-shadow(0 0 10px var(--format-color));
}

.format-name {
  color: #fff;
  font-size: 14px;
  font-weight: 600;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.5);
  letter-spacing: 1px;
}

.arrow-container {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 1;
}

.arrow-path {
  stroke-dasharray: 200;
  stroke-dashoffset: 200;
  animation: drawArrow 2s ease-in-out forwards;
  filter: drop-shadow(0 0 5px #00d9ff);
}

@keyframes drawArrow {
  to {
    stroke-dashoffset: 0;
  }
}

.particles {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
}

.particle {
  position: absolute;
  width: 4px;
  height: 4px;
  background: rgba(0, 217, 255, 0.6);
  border-radius: 50%;
  animation: particleFloat linear infinite;
  box-shadow: 0 0 10px rgba(0, 217, 255, 0.8);
}

@keyframes particleFloat {
  0% {
    transform: translateY(0) translateX(0);
    opacity: 0;
  }
  10% {
    opacity: 1;
  }
  90% {
    opacity: 1;
  }
  100% {
    transform: translateY(-100vh) translateX(20px);
    opacity: 0;
  }
}

@media (max-width: 768px) {
  .format-circle {
    width: 70px;
    height: 70px;
  }
  
  .format-icon {
    width: 60px;
    height: 60px;
  }
  
  .format-icon img {
    width: 45px;
    height: 45px;
  }
  
  .format-name {
    font-size: 11px;
  }
}
</style>

