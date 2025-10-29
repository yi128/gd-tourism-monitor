<!-- 右侧数据面板 - 精确控制版本 -->
<template>
  <!-- 独立于面板的折叠按钮 -->
  <div class="collapse-handle-independent" :class="{ 'collapsed': isCollapsed }" @click="toggleCollapse">
    <el-icon>
      <ArrowLeft v-if="isCollapsed" />
      <ArrowRight v-else />
    </el-icon>
  </div>
  
  <div class="right-panel" :class="{ 'collapsed': isCollapsed }">
    <div class="panel-content">
      <!-- 各市旅游收入排名 -->
      <cityRevenueRank />
      <!-- 旅游消费构成TOP5 -->
      <tourismSpendTop5 />
      <!-- 广东省实时热词 -->
      <realTimeHotWords />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { ArrowLeft, ArrowRight } from '@element-plus/icons-vue'
import cityRevenueRank from './rightPanel/cityRevenueRank.vue'
import tourismSpendTop5 from './rightPanel/tourismSpendTop5.vue'
import realTimeHotWords from './rightPanel/realTimeHotWords.vue'

const isCollapsed = ref(false)

const toggleCollapse = () => {
  isCollapsed.value = !isCollapsed.value
}
</script>

<style lang="scss" scoped>
.collapse-handle-independent {
  position: absolute;
  right: 500px;
  top: 50%;
  transform: translateY(-50%);
  width: 30px;
  height: 60px;
  background: #72c6f7;
  border-radius: 4px 0 0 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: black;
  z-index: 100;
  transition: right 0.3s ease;
  
  &:hover {
    background: rgba(255, 255, 255, 0.3);
  }
  

  &.collapsed {
    right: 0;
  }
}

.right-panel {
  position: absolute;
  width: 500px;
  height: 100%;
  right: 0;
  top: 0;
  box-sizing: border-box;
  right: -500px;
  animation: entranceAnimation ease-in-out 0.75s forwards;
  transition: transform 0.3s ease;
  
  &.collapsed {
    transform: translateX(100%);
  }
}

.panel-content {
  width: 100%;
  height: 100%;
  display: grid;
  gap: 24px;
  padding: 111px 16px 34px 0;
  box-sizing: border-box;
  grid-template-columns: 1fr;
  grid-template-rows: repeat(3, 1fr);
}

@keyframes entranceAnimation {
  0% {
    right: -500px;
  }
  100% {
    right: 0;
  }
}
</style>