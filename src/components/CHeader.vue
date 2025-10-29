<!-- 顶部标题 -->
<template>
  <header class="header">广东省旅游指标监控平台</header>
  <!-- 文字轮播 -->
  <div class="text-carousel">
    <transition-group name="carousel" tag="div" class="carousel-container">
      <div class="text-carousel-item" :key="currentIndex" v-show="currentIndex === getCurrentItemIndex()">
        {{ getCurrentItem() }}
      </div>
    </transition-group>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'

// 轮播数据
const carouselData = ref([
  '广州长隆度假区年接待量突破2000万人次，创历史新高',
  '深圳华侨城推出数字文旅新体验，沉浸式项目受追捧',
  '珠海长隆海洋王国入选"亚洲最佳主题公园"前十强',
  '韶关丹霞山获评国家级生态旅游示范区，客流增长40%',
  '清远古龙峡玻璃桥升级，暑期单日接待量超3万人次',
  '粤港澳大湾区联合推出"一程多站"旅游线路受青睐',
  '广州塔推出云端露营项目，夜经济收入增长显著',
  '潮州古城举办国际潮文化节，带动民宿业蓬勃发展',
  '肇庆七星岩引入AI智能导览，游客满意度达95%',
  '惠州巽寮湾滨海旅游区入选国家级旅游度假区'
])

// 状态管理
const currentIndex = ref(0)
const timer = ref<number | null>(null)
const isAnimating = ref(false)
const isPaused = ref(false)

// 配置参数
const CONFIG = {
  INTERVAL: 5000, // 轮播间隔时间
  ANIMATION_DURATION: 500, // 动画持续时间
  DEBOUNCE_DELAY: 100 // 防抖延迟时间
}

// 获取当前显示的项目
const getCurrentItem = (): string => {
  if (carouselData.value.length === 0) return ''
  return carouselData.value[currentIndex.value]
}

// 获取当前项目索引
const getCurrentItemIndex = (): number => {
  return currentIndex.value
}

// 切换到下一项
const nextItem = (): void => {
  if (isAnimating.value || isPaused.value) return

  try {
    isAnimating.value = true

    setTimeout(() => {
      currentIndex.value = (currentIndex.value + 1) % carouselData.value.length
      isAnimating.value = false
    }, CONFIG.ANIMATION_DURATION)
  } catch (error) {
    console.error('轮播切换出错:', error)
    isAnimating.value = false
  }
}

// 启动轮播
const startCarousel = (): void => {
  if (timer.value) clearInterval(timer.value)
  timer.value = window.setInterval(() => {
    nextItem()
  }, CONFIG.INTERVAL)
}

onMounted(() => {
  // 启动轮播
  startCarousel()
})

onBeforeUnmount(() => {
  if (timer.value) {
    clearInterval(timer.value)
    timer.value = null
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
  pointer-events: all;
  &:hover {
    background: linear-gradient(90deg, rgba(218, 163, 88, 0.1), #3fa7ed, rgba(218, 163, 88, 0.1));
  }
}

.carousel-container {
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.text-carousel-item {
  position: absolute;
  width: 100%;
  text-align: center;
  padding: 0 20px;
  box-sizing: border-box;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  transform: translateY(0);
  opacity: 1;
}

// 轮播动画样式
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

.carousel-enter-to,
.carousel-leave-from {
  transform: translateY(0);
  opacity: 1;
}
</style>
