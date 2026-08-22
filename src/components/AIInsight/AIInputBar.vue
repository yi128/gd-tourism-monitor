<!-- 输入栏 -->
<template>
  <div class="ai-input-bar">
    <el-input
      :model-value="modelValue"
      type="textarea"
      :autosize="{ minRows: 1, maxRows: 4 }"
      placeholder="向AI数据助手提问..."
      resize="none"
      @update:model-value="onInput"
      @keydown.enter.prevent="onSend"
    />
    <button
      class="send-btn"
      :disabled="!modelValue.trim()"
      @click="onSend"
    >
      <el-icon><Promotion /></el-icon>
    </button>
  </div>
</template>

<script setup lang="ts">
import { Promotion } from '@element-plus/icons-vue'

const props = defineProps<{
  modelValue: string
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
  (e: 'send', value: string): void
}>()

const onInput = (val: string) => {
  emit('update:modelValue', val)
}

const onSend = () => {
  const text = props.modelValue.trim()
  if (!text) return
  emit('send', text)
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
    border-radius: 10px;
    color: #fff;
    padding: 10px 14px;
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
  width: 40px;
  height: 40px;
  border-radius: 10px;
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

  .el-icon {
    font-size: 22px;
  }
}
</style>