<template>
  <header class="header">广东省旅游指标监控平台</header>
  
  <!-- 文字轮播 -->
  <div class="text-carousel" @mouseenter="pause" @mouseleave="resume">
    <transition name="carousel" mode="out-in">
      <div 
        v-if="carouselData.length > 0" 
        :key="currentIndex" 
        class="text-carousel-item"
      >
        {{ carouselData[currentIndex] }}
      </div>
      <div v-else class="text-carousel-item" key="empty">加载中...</div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { storeToRefs } from 'pinia'
import { useTourismStore } from '@/stores/tourism'

const store = useTourismStore()
const { currentSnapshot } = storeToRefs(store)
const carouselData = computed(() => currentSnapshot.value?.news ?? [])

const currentIndex = ref(0)
let timer: number | null = null
const INTERVAL = 5000

const nextItem = () => {
  if (carouselData.value.length === 0) return
  currentIndex.value = (currentIndex.value + 1) % carouselData.value.length
}

const startCarousel = () => {
  if (timer) clearInterval(timer)
  timer = window.setInterval(nextItem, INTERVAL)
}

const pause = () => {
  if (timer) clearInterval(timer)
}

const resume = () => {
  startCarousel()
}

onMounted(() => {
  startCarousel()
})

onBeforeUnmount(() => {
  if (timer) {
    clearInterval(timer)
    timer = null
  }
})
</script>

<style lang="scss" scoped>
.header {
  position: absolute;
  margin: 0 12px;
  top: 12px;
  width: calc(100% - 24px);
  height: 87px;
  background: url('@/assets/images/顶部标题.png') no-repeat center center;
  background-size: 100% 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 40px;
  font-weight: 800;
  letter-spacing: 12px;
  color: rgb(70, 137, 243);
}

.text-carousel {
  position: absolute;
  top: 120px;
  left: 50%;
  width: 744px;
  height: 43px;
  transform: translateX(-50%);
  background: linear-gradient(90deg, rgba(218, 163, 88, 0), #3fa7ed, rgba(218, 163, 88, 0));
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 22px;
  overflow: hidden;
  cursor: pointer;

  &:hover {
    background: linear-gradient(90deg, rgba(218, 163, 88, 0.1), #3fa7ed, rgba(218, 163, 88, 0.1));
  }
}

.text-carousel-item {
  width: 100%;
  text-align: center;
  padding: 0 20px;
  box-sizing: border-box;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.carousel-enter-active,
.carousel-leave-active {
  transition: all 0.5s ease-in-out;
}

.carousel-enter-from {
  transform: translateY(100%);
  opacity: 0;
}

.carousel-leave-to {
  transform: translateY(-100%);
  opacity: 0;
}
</style>