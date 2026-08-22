<!-- 聊天历史 -->
<template>
  <div class="chat-history" ref="historyRef">
    <div
      v-for="(msg, idx) in messages"
      :key="msg.id ?? idx"
      class="chat-message"
      :class="msg.role"
    >
      <div class="message-avatar">
        <el-icon v-if="msg.role === 'user'"><User /></el-icon>
        <el-icon v-else><Cpu /></el-icon>
      </div>
      <div class="message-content">
        <span>{{ msg.content }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, nextTick } from 'vue'
import { User, Cpu } from '@element-plus/icons-vue'
import type { ChatMessage } from './composables/useAIChat'

const props = defineProps<{
  messages: ChatMessage[]
}>()

const historyRef = ref<HTMLElement | null>(null)

const scrollToBottom = () => {
  nextTick(() => {
    if (historyRef.value) {
      historyRef.value.scrollTop = historyRef.value.scrollHeight
    }
  })
}

defineExpose({ scrollToBottom })
</script>

<style lang="scss" scoped>
.chat-history {
  flex: 1;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 14px;
  padding-right: 4px;

  &::-webkit-scrollbar {
    width: 6px;
  }
  &::-webkit-scrollbar-thumb {
    background: rgba(114, 198, 247, 0.4);
    border-radius: 3px;
  }
}

.chat-message {
  display: flex;
  gap: 10px;
  align-items: flex-start;

  .message-avatar {
    flex-shrink: 0;
    width: 32px;
    height: 32px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(114, 198, 247, 0.25);
    color: #72c6f7;
    font-size: 20px;
  }

  .message-content {
    max-width: 80%;
    padding: 10px 14px;
    border-radius: 12px;
    color: #e8f4ff;
    font-size: 18px;
    line-height: 1.6;
    word-break: break-word;
  }

  &.user {
    flex-direction: row-reverse;

    .message-avatar {
      background: rgba(255, 154, 60, 0.3);
      color: #ffb347;
    }

    .message-content {
      background: linear-gradient(
        135deg,
        rgba(63, 167, 237, 0.7) 0%,
        rgba(114, 198, 247, 0.5) 100%
      );
      border-top-right-radius: 4px;
    }
  }

  &.assistant {
    .message-content {
      background: rgba(255, 255, 255, 0.08);
      border: 1px solid rgba(114, 198, 247, 0.2);
      border-top-left-radius: 4px;
    }
  }
}
</style>