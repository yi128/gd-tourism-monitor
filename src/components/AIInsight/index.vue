<template>
  <div class="ai-insight">
    <button class="ai-toggle-btn" :class="{ active: isOpen }" @click="togglePanel">
      <el-icon class="ai-icon"><ChatDotRound /></el-icon>
      <span>AI数据助手</span>
    </button>

    <transition name="panel-fade">
      <div v-if="isOpen" class="ai-panel">
        <div class="ai-panel-header">
          <div class="ai-panel-title">
            <el-icon class="title-icon"><MagicStick /></el-icon>
            <span>AI 数据助手</span>
          </div>
          <el-icon class="close-icon" @click="closePanel"><Close /></el-icon>
        </div>

        <div class="ai-panel-body">
          <AIChatHistory ref="chatHistoryRef" :messages="messages" />
          <PresetTags
            v-if="!hasMessages"
            :tags="presetTags"
            @select="onPresetSelect"
          />
        </div>

        <div class="ai-panel-footer">
          <div v-if="isLoading" class="typing-indicator">
            <span>AI 正在思考</span>
            <span class="dots">...</span>
          </div>
          <AIInputBar v-model="inputText" @send="handleSend" />
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, nextTick } from 'vue'
import { ChatDotRound, MagicStick, Close } from '@element-plus/icons-vue'
import AIInputBar from './AIInputBar.vue'
import PresetTags from './PresetTags.vue'
import AIChatHistory from './AIChatHistory.vue'
import { useAIChat } from './composables/useAIChat'

const isOpen = ref(false)
const inputText = ref('')
const chatHistoryRef = ref<InstanceType<typeof AIChatHistory> | null>(null)

const { messages, isLoading, hasMessages, sendMessage } = useAIChat()

const presetTags = [
  '各市旅游收入排名前三？',
  '哪个景区最受欢迎？',
  '过夜游客主要来自哪里？',
]

const togglePanel = () => {
  isOpen.value = !isOpen.value
}

const closePanel = () => {
  isOpen.value = false
}

const scrollToBottom = () => {
  nextTick(() => {
    chatHistoryRef.value?.scrollToBottom()
  })
}

// 消息变化时自动滚动
watch(messages, scrollToBottom, { deep: true })

const onPresetSelect = (tag: string) => {
  handleSend(tag)
}

const handleSend = async (text: string) => {
  if (!text.trim() || isLoading.value) return
  await sendMessage(text)  
}
</script>

<style lang="scss" scoped>
/* 你原来的样式完全保留，只加了 typing-indicator */
.ai-insight {
  position: absolute;
  top: 111px;
  right: 516px;
  z-index: 500;
  font-family: inherit;
}

.ai-toggle-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 10px 20px;
  background: linear-gradient(135deg, #3fa7ed 0%, #72c6f7 100%);
  border: none;
  border-radius: 24px;
  color: #fff;
  font-size: 18px;
  font-weight: 600;
  letter-spacing: 1px;
  cursor: pointer;
  box-shadow: 0 4px 16px rgba(63, 167, 237, 0.4);
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(63, 167, 237, 0.55);
  }

  &.active {
    background: linear-gradient(135deg, #ff9a3c 0%, #ff6a88 100%);
    box-shadow: 0 4px 16px rgba(255, 106, 136, 0.5);
  }

  .ai-icon {
    font-size: 22px;
  }
}

.ai-panel {
  position: fixed;
  top: 120px;
  right: 16px;
  width: 500px;
  height: 120vh;
  max-height: 920px;
  background: linear-gradient(
    180deg,
    rgba(10, 40, 80, 0.92) 0%,
    rgba(5, 20, 50, 0.95) 100%
  );
  border: 1px solid rgba(114, 198, 247, 0.35);
  border-radius: 12px;
  box-shadow: 0 12px 40px rgba(0, 30, 80, 0.55);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  z-index: 600;
  backdrop-filter: blur(8px);
}

.ai-panel-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 20px;
  background: linear-gradient(
    90deg,
    rgba(63, 167, 237, 0.35) 0%,
    rgba(114, 198, 247, 0.15) 100%
  );
  border-bottom: 1px solid rgba(114, 198, 247, 0.25);

  .ai-panel-title {
    display: flex;
    align-items: center;
    gap: 8px;
    color: #fff;
    font-size: 20px;
    font-weight: 600;
    letter-spacing: 1px;

    .title-icon {
      color: #72c6f7;
      font-size: 24px;
    }
  }

  .close-icon {
    color: rgba(255, 255, 255, 0.7);
    font-size: 22px;
    cursor: pointer;
    transition: color 0.2s;

    &:hover {
      color: #fff;
    }
  }
}

.ai-panel-body {
  flex: 1;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  padding: 16px;
  gap: 12px;
}

.ai-panel-footer {
  padding: 12px 16px 16px;
  border-top: 1px solid rgba(114, 198, 247, 0.2);
  background: rgba(0, 20, 50, 0.4);
}

.typing-indicator {
  color: #72c6f7;
  font-size: 14px;
  margin-bottom: 8px;
  display: flex;
  align-items: center;
  gap: 4px;

  .dots {
    animation: blink 1.5s infinite;
  }
}

@keyframes blink {
  0%, 100% { opacity: 0.3; }
  50% { opacity: 1; }
}

.panel-fade-enter-active,
.panel-fade-leave-active {
  transition: opacity 0.25s ease, transform 0.25s ease;
}

.panel-fade-enter-from,
.panel-fade-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}
</style>