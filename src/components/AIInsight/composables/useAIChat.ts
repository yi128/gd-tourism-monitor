// TODO: 接入 AI 后端后实现此文件
// - 管理 SSE / WebSocket 连接
// - 维护消息状态结构
// - 处理流式渲染

export interface ChatMessage {
    id?: string
    role: 'user' | 'assistant'
    content: string
}