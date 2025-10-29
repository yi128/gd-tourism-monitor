<template>
  <div class="layout-container">
    <!-- 顶部标题 -->
    <div class="header-container">
      <CHeader />
    </div>
    <!-- 中间区域(数据面板) -->
    <div class="main-container">
      <!-- 左侧数据面板 -->
      <div class="left-panel-container">
        <LeftPanel />
      </div>
      <!-- 中间地图区域 -->
      <div class="map-container">
        <CMap />
      </div>
      <!-- 右侧数据面板 -->
      <div class="right-panel-container">
        <RightPanel />
      </div>
    </div>
    <!-- 底部组件 -->
    <div class="footer-container">
      <CFooter />
    </div>
  </div>
</template>

<script setup lang="ts">
import CHeader from '@/components/CHeader.vue'
import CMap from '@/components/CMap.vue'
import LeftPanel from '@/components/leftPanel.vue'
import RightPanel from '@/components/rightPanel.vue'
import CFooter from '@/components/CFooter.vue'
import { onMounted } from 'vue'
import autofit from 'autofit.js'
onMounted(() => {
  autofit.init({
    el: 'body',
    dh: 1080,
    dw: 1920,
    resize: true
  })
})
</script>

<style lang="scss" scoped>
.layout-container{
  background: linear-gradient(135deg, #e6f7ff 0%, #b3e0ff 50%, #80d0ff 100%);
}
.map-container {
  padding: 0;
  width: calc(100% - 200px); 
  height: 100%;
  margin: 0 auto; 
  position: relative;
}
</style>