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
          <div class="header-actions">
            <el-icon class="action-icon" title="新建会话" @click="onNewSession"><Plus /></el-icon>
            <el-icon class="action-icon" title="历史会话" @click="showSessionList = !showSessionList">
              <Menu v-if="!showSessionList" />
              <Close v-else />
            </el-icon>
            <el-icon class="close-icon" @click="closePanel"><Close /></el-icon>
          </div>
        </div>

        <div class="ai-panel-body" :class="{ 'with-sidebar': showSessionList }">
          <div class="chat-area">
            <AIChatHistory ref="chatHistoryRef" :messages="messages" />
            <PresetTags
              v-if="!hasMessages"
              :tags="presetTags"
              @select="onPresetSelect"
            />
          </div>

          <transition name="sidebar-slide">
            <div v-if="showSessionList" class="session-sidebar">
              <SessionList
                :sessions="sessions"
                :current-session-id="currentSessionId"
                @select="onSwitchSession"
                @delete="onDeleteSession"
              />
            </div>
          </transition>
        </div>

        <div class="ai-panel-footer">
          <AIInputBar
            v-model="inputText"
            :is-loading="isLoading"
            @send="handleSend"
            @cancel="handleCancel"
          />
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, nextTick, onMounted } from 'vue'
import { ChatDotRound, MagicStick, Close, Plus, Menu } from '@element-plus/icons-vue'
import AIInputBar from './AIInputBar.vue'
import PresetTags from './PresetTags.vue'
import AIChatHistory from './AIChatHistory.vue'
import SessionList from './SessionList.vue'
import { useAIChat } from './composables/useAIChat'

const isOpen = ref(false)
const inputText = ref('')
const chatHistoryRef = ref<InstanceType<typeof AIChatHistory> | null>(null)
const showSessionList = ref(false)

const {
    sessions,
    currentSessionId,
    messages,
    isLoading,
    hasMessages,
    init,
    createSession,
    switchSession,
    deleteSession,
    sendMessage,
    cancelRequest,
} = useAIChat()

const presetTags = [
    '各市旅游收入排名前三？',
    '哪个景区最受欢迎？',
    '过夜游客主要来自哪里？',
]

onMounted(() => {
    init()
})

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

watch(messages, scrollToBottom, { deep: true })

const onPresetSelect = (tag: string) => {
    handleSend(tag)
}

const handleSend = async (text: string) => {
    if (!text.trim()) return
    await sendMessage(text)
}

const handleCancel = () => {
    cancelRequest()
}

const onNewSession = () => {
    createSession()
    inputText.value = ''
    showSessionList.value = false
}

const onSwitchSession = (id: string) => {
    switchSession(id)
}

const onDeleteSession = (id: string) => {
    deleteSession(id)
}
</script>

<style lang="scss" scoped>
.ai-insight {
  position: fixed;
  top: 60px;
  right: 200px;
  z-index: 500;
  font-family: inherit;
  width: fit-content;
}

.ai-toggle-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 12px 24px;
  background: linear-gradient(135deg, #3fa7ed 0%, #72c6f7 100%);
  border: none;
  border-radius: 26px;
  color: #fff;
  font-size: 20px;
  font-weight: 600;
  letter-spacing: 1px;
  cursor: pointer;
  box-shadow: 0 4px 16px rgba(63, 167, 237, 0.4);
  transition: all 0.3s ease;
  outline: none;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(63, 167, 237, 0.55);
  }

  &:focus {
    outline: none;
  }

  &:focus-visible {
    outline: none;
  }

  &.active {
    background: linear-gradient(135deg, #ff9a3c 0%, #ff6a88 100%);
    box-shadow: 0 4px 16px rgba(255, 106, 136, 0.5);
  }

  .ai-icon {
    font-size: 24px;
  }
}

.ai-panel {
  position: fixed;
  top: 128px;
  right: 16px;
  width: 780px;
  height: 120vh;
  max-height: 960px;
  background: linear-gradient(
    180deg,
    rgba(10, 40, 80, 0.92) 0%,
    rgba(5, 20, 50, 0.95) 100%
  );
  border: 1px solid rgba(114, 198, 247, 0.35);
  border-radius: 14px;
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
  padding: 18px 24px;
  background: linear-gradient(
    90deg,
    rgba(63, 167, 237, 0.35) 0%,
    rgba(114, 198, 247, 0.15) 100%
  );
  border-bottom: 1px solid rgba(114, 198, 247, 0.25);

  .ai-panel-title {
    display: flex;
    align-items: center;
    gap: 10px;
    color: #fff;
    font-size: 24px;
    font-weight: 600;
    letter-spacing: 1px;

    .title-icon {
      color: #72c6f7;
      font-size: 28px;
    }
  }

  .header-actions {
    display: flex;
    align-items: center;
    gap: 6px;
  }

  .action-icon {
    color: rgba(255, 255, 255, 0.7);
    font-size: 22px;
    cursor: pointer;
    padding: 6px;
    border-radius: 6px;
    transition: all 0.2s;

    &:hover {
      color: #fff;
      background: rgba(255, 255, 255, 0.1);
    }
  }

  .close-icon {
    color: rgba(255, 255, 255, 0.7);
    font-size: 24px;
    cursor: pointer;
    transition: color 0.2s;
    margin-left: 4px;

    &:hover {
      color: #fff;
    }
  }
}

.ai-panel-body {
  flex: 1;
  overflow: hidden;
  display: flex;
  flex-direction: row;
  padding: 20px;
  gap: 20px;
}

.chat-area {
  flex: 1;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  gap: 14px;
  min-width: 0;
}

.session-sidebar {
  width: 290px;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.ai-panel-footer {
  padding: 16px 20px 20px;
  border-top: 1px solid rgba(114, 198, 247, 0.2);
  background: rgba(0, 20, 50, 0.4);
}

.typing-indicator {
  color: #72c6f7;
  font-size: 16px;
  margin-bottom: 10px;
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
  transform: translateY(-12px);
}

.sidebar-slide-enter-active,
.sidebar-slide-leave-active {
  transition: all 0.25s ease;
}

.sidebar-slide-enter-from,
.sidebar-slide-leave-to {
  opacity: 0;
  transform: translateX(12px);
  width: 0;
}
</style>