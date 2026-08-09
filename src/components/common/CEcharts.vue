<template>
  <div class="echarts" ref="echartsRef"></div>
</template>

<script lang="ts" setup>
import { ref, reactive, watch, onMounted, onBeforeUnmount } from 'vue'
import * as echarts from 'echarts'

const prop = withDefaults(defineProps<{ option: any }>(), {
  option: () => ({})
})

const state = reactive({ option: null as any })
let echartsInstance: echarts.ECharts | null = null
let hasOnloaded = false   // ✅ 新增：防止重复 emit
const echartsRef = ref()

const emit = defineEmits(['eclick', 'onload'])

const tryEmitOnload = () => {
  if (hasOnloaded || !echartsInstance) return
  hasOnloaded = true
  emit('onload', echartsInstance)
}

// watch 保持原样，处理 option 后续变化
watch(
  () => prop.option,
  () => {
    state.option = prop.option
    if (state.option) {
      echartsInstance?.setOption(state.option)
      tryEmitOnload()   // ✅ 用 tryEmitOnload 替代直接 emit
    }
  },
  { immediate: false, deep: true }
)

onMounted(() => {
  state.option = prop.option
  
  if (!echartsInstance) {
    echartsInstance = echarts.init(echartsRef.value as HTMLDivElement)
    echartsInstance.on('click', (val: any) => {
      emit('eclick', val)
    })
  }
  
  if (state.option) {
    echartsInstance.setOption(state.option)
  }
  
  window.addEventListener('resize', echartsResize)
  
  // ✅ 关键修复：初始化完成后立即通知父组件
  tryEmitOnload()
})

function echartsResize() {
  echartsInstance?.resize()
}

onBeforeUnmount(() => {
  window.removeEventListener('resize', echartsResize)
  echartsInstance?.dispose()
})

defineExpose({ setDataZoom: () => {} })  // 保留你原来的 expose
</script>

<style scoped lang="scss">
.echarts {
  position: relative;
  width: 100%;
  height: 100%;
  margin: auto;
}
</style>
