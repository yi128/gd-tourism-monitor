<!-- 左侧数据面板 -->
<template>
  <!-- 独立于面板的折叠按钮 -->
  <div class="collapse-handle-independent" :class="{ 'collapsed': isCollapsed }" @click="toggleCollapse">
    <el-icon>
      <ArrowRight v-if="isCollapsed" />
      <ArrowLeft v-else />
    </el-icon>
  </div>
  
  <div class="left-panel" :class="{ 'collapsed': isCollapsed }">
    <!-- 面板内容 -->
    <div class="panel-content">
      <!-- 景点人流排名 -->
      <rankingOfScenicSpots />
      <!-- 游客来源地TOP5 -->
      <visitorSourceTop5 />
      <!-- 季度接待游客比 -->
      <receptionOfTourists />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { ArrowLeft, ArrowRight } from '@element-plus/icons-vue'
import rankingOfScenicSpots from './leftPanel/rankingOfScenicSpots.vue'
import visitorSourceTop5 from './leftPanel/visitorSourceTop5.vue'
import receptionOfTourists from './leftPanel/receptionOfTourists.vue'

const isCollapsed = ref(false)

const toggleCollapse = () => {
  isCollapsed.value = !isCollapsed.value
}
</script>

<style lang="scss" scoped>
.collapse-handle-independent {
  position: absolute;
  left: 500px; 
  top: 50%;
  transform: translateY(-50%);
  width: 30px;
  height: 60px;
  background: #80d0ff;
  border-radius: 0 4px 4px 0;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: black;
  z-index: 100;
  transition: left 0.3s ease;
  
  &:hover {
    background: rgba(255, 255, 255, 0.3);
  }
  
  
  &.collapsed {
    left: 0;
  }
}

.left-panel {
  position: absolute;
  width: 500px;
  height: 100%;
  left: 0;
  top: 0;
  box-sizing: border-box;
  left: -500px;
  animation: entranceAnimation ease-in-out 0.75s forwards;
  transition: transform 0.3s ease;
  
  &.collapsed {
    transform: translateX(-100%);
  }
}

.panel-content {
  width: 100%;
  height: 100%;
  display: grid;
  gap: 24px;
  padding: 111px 0 34px 16px;
  box-sizing: border-box;
  grid-template-columns: 1fr;
  grid-template-rows: repeat(3, 1fr);
}

@keyframes entranceAnimation {
  0% {
    left: -500px;
  }
  100% {
    left: 0;
  }
}
</style>