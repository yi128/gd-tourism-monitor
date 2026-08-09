<!-- src/components/TimelineSlider.vue -->
<template>
  <div class="timeline-wrapper">
    <div class="timeline-track">
      <div 
        v-for="year in years" 
        :key="year"
        :class="['timeline-node', { active: selectedYear === year }]"
        @click="setYear(year)"
      >
        <div class="node-dot" />
        <span class="node-year">{{ year }}</span>
      </div>
      <!-- 连接线 -->
      <div class="timeline-line" />
      <!-- 当前进度 -->
      <div class="timeline-progress" :style="progressStyle" />
    </div>
    
    <button class="play-btn" @click="togglePlay">
      {{ isPlaying ? '⏸' : '▶' }}
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onUnmounted } from 'vue'
import { useTourismStore } from '@/stores/tourism'
import { storeToRefs } from 'pinia'

const store = useTourismStore()
const { selectedYear } = storeToRefs(store)
const { setYear } = store

const years = [2019, 2020, 2021, 2022, 2023, 2024]
const isPlaying = ref(false)
let timer: number | null = null

const progressStyle = computed(() => {
  const idx = years.indexOf(selectedYear.value)
  const percent = (idx / (years.length - 1)) * 100
  return { width: `${percent}%` }
})

function togglePlay() {
  isPlaying.value = !isPlaying.value
}

watch(isPlaying, (playing) => {
  if (playing) {
    timer = window.setInterval(() => {
      const idx = years.indexOf(selectedYear.value)
      const next = years[(idx + 1) % years.length]
      setYear(next)
    }, 3000)
  } else {
    if (timer) clearInterval(timer)
  }
})

onUnmounted(() => {
  if (timer) clearInterval(timer)
})
</script>

<style lang="scss" scoped>
.timeline-wrapper {
  position: absolute;
  bottom: 160px;
  left: 48%;
  transform: translateX(-48%);
  display: flex;
  align-items: center;
  gap: 24px;             
  z-index: 100;
}

.timeline-track {
  position: relative;
  display: flex;
  align-items: center;
  gap: 50px;              
  padding: 0 12px;
}

.timeline-line {
  position: absolute;
  top: 50%;
  left: 24px;
  right: 24px;
  height: 3px;           
  background: rgba(255, 255, 255, 0.2);
  transform: translateY(-50%);
  z-index: 0;
}

.timeline-progress {
  position: absolute;
  top: 50%;
  left: 24px;
  height: 3px;
  background: linear-gradient(90deg, #3fa7ed, #00d4ff);
  transform: translateY(-50%);
  transition: width 0.5s ease;
  z-index: 1;
  box-shadow: 0 0 10px rgba(63, 167, 237, 0.6);
}

.timeline-node {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;             
  cursor: pointer;
  z-index: 2;
  
  .node-dot {
    width: 18px;       
    height: 18px;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.3);
    border: 2px solid rgba(255, 255, 255, 0.5);
    transition: all 0.3s ease;
  }
  
  .node-year {
    font-size: 20px;      
    color: rgba(255, 255, 255, 0.6);
    transition: all 0.3s ease;
    font-weight: 500;
    letter-spacing: 1px; 
  }
  
  &:hover {
    .node-dot {
      background: rgba(63, 167, 237, 0.5);
      border-color: #3fa7ed;
    }
    .node-year {
      color: #3fa7ed;
    }
  }
  
  &.active {
    .node-dot {
      width: 24px;       
      height: 24px;
      background: #3fa7ed;
      border-color: #fff;
      box-shadow: 0 0 14px rgba(63, 167, 237, 0.9), 0 0 28px rgba(63, 167, 237, 0.5);
    }
    .node-year {
      color: #fff;
      font-size: 24px;   
      font-weight: 700;
      text-shadow: 0 0 10px rgba(63, 167, 237, 0.8);
    }
  }
}

.play-btn {
  width: 44px;           
  height: 44px;
  border-radius: 50%;
  border: 1px solid rgba(63, 167, 237, 0.5);
  background: rgba(63, 167, 237, 0.15);
  color: #3fa7ed;
  font-size: 20px;    
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  
  &:hover {
    background: rgba(63, 167, 237, 0.3);
    box-shadow: 0 0 14px rgba(63, 167, 237, 0.5);
  }
}
</style>