<template>
  <div class="session-list">
    <div class="session-list-header">
      <span class="list-title">历史会话</span>
      <span class="session-count">{{ sessions.length }}</span>
    </div>

    <div v-if="sessions.length === 0" class="empty-hint">
      暂无历史会话
    </div>

    <div
      v-for="s in sessions"
      :key="s.id"
      class="session-item"
      :class="{ active: s.id === currentSessionId }"
      @click="$emit('select', s.id)"
    >
      <div class="session-main">
        <el-icon class="session-icon"><ChatLineRound /></el-icon>
        <div class="session-info">
          <div class="session-title">{{ s.title }}</div>
          <div class="session-meta">
            <span>{{ s.messages.length }} 条消息</span>
            <span class="dot">·</span>
            <span>{{ formatTime(s.updatedAt) }}</span>
          </div>
        </div>
      </div>
      <el-icon
        class="delete-icon"
        @click.stop="$emit('delete', s.id)"
      ><Delete /></el-icon>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ChatLineRound, Delete } from '@element-plus/icons-vue'
import type { ChatSession } from './composables/useAIChat'

defineProps<{
  sessions: ChatSession[]
  currentSessionId: string | null
}>()

defineEmits<{
  (e: 'select', id: string): void
  (e: 'delete', id: string): void
}>()

function formatTime(ts: number) {
  const now = Date.now()
  const diff = now - ts
  const min = 60 * 1000
  const hour = 60 * min
  const day = 24 * hour

  if (diff < min) return '刚刚'
  if (diff < hour) return `${Math.floor(diff / min)} 分钟前`
  if (diff < day) return `${Math.floor(diff / hour)} 小时前`
  if (diff < 7 * day) return `${Math.floor(diff / day)} 天前`

  const d = new Date(ts)
  return `${d.getMonth() + 1}/${d.getDate()}`
}
</script>

<style lang="scss" scoped>
.session-list {
  flex: 1;
  overflow-y: auto;
  padding-right: 4px;

  &::-webkit-scrollbar {
    width: 6px;
  }
  &::-webkit-scrollbar-thumb {
    background: rgba(114, 198, 247, 0.4);
    border-radius: 3px;
  }
}

.session-list-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 4px 4px 14px;
  border-bottom: 1px solid rgba(114, 198, 247, 0.2);
  margin-bottom: 10px;

  .list-title {
    color: #e8f4ff;
    font-size: 20px;
    font-weight: 600;
    letter-spacing: 1px;
  }

  .session-count {
    background: rgba(114, 198, 247, 0.2);
    color: #72c6f7;
    font-size: 16px;
    padding: 4px 14px;
    border-radius: 14px;
  }
}

.empty-hint {
  text-align: center;
  color: rgba(255, 255, 255, 0.35);
  font-size: 18px;
  padding: 40px 0;
}

.session-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 16px;
  margin-bottom: 10px;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s;
  border: 1px solid transparent;

  &:hover {
    background: rgba(114, 198, 247, 0.1);
    border-color: rgba(114, 198, 247, 0.2);
  }

  &.active {
    background: rgba(63, 167, 237, 0.25);
    border-color: rgba(114, 198, 247, 0.45);

    .session-title {
      color: #fff;
    }
  }

  .session-main {
    display: flex;
    align-items: flex-start;
    gap: 14px;
    flex: 1;
    min-width: 0;
  }

  .session-icon {
    flex-shrink: 0;
    font-size: 22px;
    color: #72c6f7;
    margin-top: 2px;
  }

  .session-info {
    flex: 1;
    min-width: 0;
  }

  .session-title {
    color: #c8dcf0;
    font-size: 19px;
    font-weight: 500;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    line-height: 1.4;
  }

  .session-meta {
    color: rgba(255, 255, 255, 0.35);
    font-size: 16px;
    margin-top: 5px;
    display: flex;
    align-items: center;
    gap: 4px;

    .dot {
      opacity: 0.5;
    }
  }

  .delete-icon {
    flex-shrink: 0;
    color: rgba(255, 255, 255, 0.3);
    font-size: 20px;
    padding: 4px;
    border-radius: 4px;
    transition: all 0.2s;

    &:hover {
      color: #ff6a88;
      background: rgba(255, 106, 136, 0.15);
    }
  }
}
</style>