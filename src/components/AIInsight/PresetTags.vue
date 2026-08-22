<!-- 预设标签 -->
<template>
  <div class="preset-tags" v-if="tags.length > 0">
    <p class="preset-hint">你可以问我任何关于广东省旅游数据的问题，比如：</p>
    <div class="tag-list">
      <span
        v-for="(tag, idx) in tags"
        :key="idx"
        class="tag-item"
        @click="onSelect(tag)"
      >
        {{ tag }}
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  tags: string[]
}>()

const emit = defineEmits<{
  (e: 'select', tag: string): void
}>()

const onSelect = (tag: string) => {
  emit('select', tag)
}
</script>

<style lang="scss" scoped>
.preset-tags {
  color: rgba(255, 255, 255, 0.55);
  font-size: 19px;
  line-height: 1.8;
}

.preset-hint {
  margin: 0 0 12px 0;
}

.tag-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.tag-item {
  padding: 6px 12px;
  background: rgba(114, 198, 247, 0.15);
  border: 1px solid rgba(114, 198, 247, 0.3);
  border-radius: 14px;
  color: #72c6f7;
  font-size: 18px;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: rgba(114, 198, 247, 0.25);
    color: #fff;
  }
}
</style>