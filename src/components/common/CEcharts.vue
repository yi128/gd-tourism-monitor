<template>
  <div class="echarts" ref="echartsRef"></div>
</template>

<script lang="ts" setup>
import { ref, reactive, watch, onMounted, onBeforeUnmount } from 'vue'
import * as echarts from 'echarts'
const prop = withDefaults(defineProps<{ option: any }>(), {
  option: () => {
    return {}
  }
})
const state = reactive({
  option: null
})
watch(
  () => prop.option,
  () => {
    state.option = prop.option
    if (state.option) {
      echartsInstance?.setOption(state.option)
      emit('onload', echartsInstance)
    }
  },
  { immediate: false, deep: true }
)
let echartsInstance: echarts.ECharts | null = null
const echartsRef = ref()
defineExpose({
  setDataZoom
})
const echartsResize = () => {
  console.log('resize')
  echartsInstance?.resize()
}
function setDataZoom(start: any, end: any) {
  ;(state.option as any).dataZoom[0].start = start
  ;(state.option as any).dataZoom[0].end = end
  echartsInstance?.setOption(state.option as any)
}
const emit = defineEmits(['eclick', 'onload'])
onMounted(() => {
  state.option = prop.option
  if (echartsInstance) {
    if (state.option) {
      echartsInstance?.setOption(state.option)
    }
  } else {
    echartsInstance = echarts.init(echartsRef.value as HTMLDivElement)
    echartsInstance.on('click', function (val) {
      Eaclick(val)
    })
    if (state.option) {
      echartsInstance?.setOption(state.option)
    }
  }
  window.addEventListener('resize', echartsResize)
})
const Eaclick = (val: any) => {
  emit('eclick', val)
}
onBeforeUnmount(() => {
  if (!echartsInstance) return
  window.removeEventListener('resize', echartsResize)
  echartsInstance.dispose()
})
</script>

<style scoped lang="scss">
.echarts {
  position: relative;
  width: 100%;
  height: 100%;
  margin: auto;
}
</style>
