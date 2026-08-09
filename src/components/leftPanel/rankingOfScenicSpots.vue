<!-- 景点人流排名 -->
<template>
  <CPanel>
    <template #header>景点人流排名</template>
    <template #content>
      <vue3ScrollSeamless
        :dataList="list"
        class="list"
        :class-option="{
          limitMoveNum: 5
        }"
      >
        <div class="list-warpper">
          <article class="list__item" v-for="(item, index) in list" :key="index">
            <section class="item__index">{{ 'NO.' + (index + 1) }}</section>
            <section class="item__label">{{ item.label }}</section>
            <div class="progress">
              <span
                class="progress__conent"
                :style="{ width: getProgressWidth(item.value) }"
              ></span>
            </div>
          </article>
        </div>
      </vue3ScrollSeamless>
    </template>
  </CPanel>
</template>

<script setup lang="ts">
import { vue3ScrollSeamless } from 'vue3-scroll-seamless'
import CPanel from '@/components/common/CPanel.vue'
import { computed, useId } from 'vue'
import { useTourismStore } from '@/stores/tourism'
import { storeToRefs } from 'pinia'

const store = useTourismStore()
const { scenicSpotRanking } = storeToRefs(store)

const list = computed(() => {
  const scenicData = scenicSpotRanking.value || []
  return [...scenicData].sort((a, b) => b.value - a.value)
})

const maxValue = computed(() => {
  if (list.value.length === 0) return 1
  return Math.max(...list.value.map(item => item.value))
})

const getProgressWidth = (value: number) => {
  if (maxValue.value === 0) return '0%'
  return (value / maxValue.value) * 100 + '%'
}
</script>
<style lang="scss" scoped>
.list {
  max-height: 200px;
  outline: none;
  overflow: hidden;
  &__item {
    position: relative;
    width: 100%;
    height: 40px;
    display: flex;
    align-items: center;
    gap: 28px;
    padding: 0 12px 0 24px;
    box-sizing: border-box;
    font-size: 16px;
    &:nth-of-type(even) {
      background: linear-gradient(90deg, rgba(92, 109, 152, 0.8), rgba(92, 109, 152, 0));
    }
    .item__index {
      width: 30px;
      color: rgba(244, 168, 65, 1);
      font-weight: 500;
    }
    .item__label {
      width: 100px;
      height: 100%;
      line-height: 40px;
      overflow: hidden;
      color: #2c3e50;
    }
    .progress {
      position: relative;
      width: 156px;
      height: 5px;
      background: rgba(100, 110, 132, 1);
      overflow: hidden;
      .progress__conent {
        position: absolute;
        left: 0%;
        height: 100%;
        width: 0;
        background: linear-gradient(90deg, #ffa832, #f8c47d);
      }
    }
  }
}
.warp {
  height: 270px;
  width: 360px;
  margin: 0 auto;
  overflow: hidden;
}
</style>