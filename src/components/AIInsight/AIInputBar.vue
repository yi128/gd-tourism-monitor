<!-- 输入栏 -->
<template>
  <div class="ai-input-bar">
    <el-input
      :model-value="modelValue"
      type="textarea"
      :autosize="{ minRows: 1, maxRows: 4 }"
      :placeholder="isLoading ? 'AI 正在生成回答，可直接输入新问题...' : '向AI数据助手提问...'"
      resize="none"
      @update:model-value="onInput"
      @keydown.enter.prevent="onSend"
    />
    <button
      class="send-btn"
      :class="{ cancel: isLoading }"
      :disabled="!isLoading && !modelValue.trim()"
      @click="onSend"
    >
      <el-icon v-if="isLoading"><VideoPause /></el-icon>
      <el-icon v-else><Promotion /></el-icon>
    </button>
  </div>
</template>

<script setup lang="ts">
import { Promotion, VideoPause } from '@element-plus/icons-vue'

const props = defineProps<{
  modelValue: string
  isLoading?: boolean
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
  (e: 'send', value: string): void
  (e: 'cancel'): void
}>()

const onInput = (val: string) => {
  emit('update:modelValue', val)
}

const onSend = () => {
  if (props.isLoading) {
    emit('cancel')
    return
  }
  const text = props.modelValue.trim()
  if (!text) return
  emit('send', text)
  emit('update:modelValue', '')
}
</script>

<style lang="scss" scoped>
.ai-input-bar {
  display: flex;
  align-items: flex-end;
  gap: 8px;

  :deep(.el-textarea__inner) {
    background: rgba(255, 255, 255, 0.06);
    border: 1px solid rgba(114, 198, 247, 0.3);
    border-radius: 12px;
    color: #fff;
    padding: 12px 16px;
    font-size: 18px;
    line-height: 1.5;
    resize: none;
    box-shadow: none;

    &::placeholder {
      color: rgba(255, 255, 255, 0.4);
    }

    &:focus {
      border-color: #72c6f7;
      background: rgba(255, 255, 255, 0.1);
    }
  }
}

.send-btn {
  flex-shrink: 0;
  width: 46px;
  height: 46px;
  border-radius: 12px;
  border: none;
  background: linear-gradient(135deg, #3fa7ed 0%, #72c6f7 100%);
  color: #fff;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;

  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(63, 167, 237, 0.5);
  }

  &:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }

  &.cancel {
    background: linear-gradient(135deg, #ff6a6a 0%, #ff4757 100%);

    &:hover {
      box-shadow: 0 4px 12px rgba(255, 71, 87, 0.5);
    }
  }

  .el-icon {
    font-size: 26px;
  }
}
</style>