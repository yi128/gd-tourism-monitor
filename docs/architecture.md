# 广东省智慧旅游数据监控平台 — 架构说明

本文描述当前仓库的实际架构，对应 `src/` 现有实现。项目是单页数据大屏：无 Vue Router、无业务后端、无 axios。图表数据来自本地静态文件；唯一外部 HTTP 是 SiliconFlow 的流式对话接口。

---

## 1. 整体项目架构

```
index.html
    └── src/main.ts
            ├── Pinia（createPinia）
            ├── Element Plus + 图标
            └── App = src/page/index.vue
                    ├── 大屏布局（Header / 左右栏 / 地图 / Footer）
                    ├── autofit.js（1920×1080 缩放）
                    └── AI 悬浮面板
```

分层可以看成四条并行管道，在页面上交汇：

| 层 | 职责 | 关键路径 |
|---|---|---|
| 视图 | 大屏与 AI 面板 UI | `src/page`、`src/components` |
| 旅游状态 | 当前年份与图表派生数据 | `src/stores/tourism.ts` |
| 静态数据 | 城市、年份快照、地图 Geo | `src/data`、`src/assets/data` |
| AI 流水线 | 分类 → 预处理 → Prompt → SSE | `src/ai`、`src/services/aiService.ts`、`useAIChat` |

**数据与请求边界**

- 大屏数字、排名、热词全部来自 `src/data/cityStats.ts`，经 Pinia getter 供给组件。
- AI 回答前会把 **当前 store 快照** 写成文本塞进 system prompt，避免模型凭空编数字。
- 对话消息、多会话列表 **不在 Pinia**，由 `useAIChat` 持有，并写入 `localStorage`。

**技术栈（实现层面）**

Vue 3 Composition API + `<script setup>`、TypeScript、Vite、Pinia、ECharts、Element Plus、Sass、autofit.js、vue3-odometer。路径别名：`@` → `src`，`@stores` → `src/stores`。

---

## 2. Vue 页面结构

应用只有一个页面组件：`src/page/index.vue`。`main.ts` 直接 `createApp(App)` 挂载它。

```
layout-container
├── header-container          CHeader          标题 + 年份新闻轮播
├── main-container
│   ├── left-panel-container  LeftPanel        左侧三张图
│   ├── map-container
│   │   ├── TimelineSlider                    2019–2024 选年 / 自动播放
│   │   └── CMap                              广东地图
│   ├── right-panel-container RightPanel       右侧三张图
│   └── AIDataAssistant       AIInsight        右上角可折叠对话层
└── footer-container          CFooter          KPI + odometer
```

`onMounted` 时对 `body` 初始化 autofit（`dw: 1920`，`dh: 1080`，`resize: true`）。

### 左右栏实际挂载的图

**左栏** `leftPanel.vue`

- `rankingOfScenicSpots.vue` — 景点人流排名
- `visitorSourceTop5.vue` — 游客来源地 TOP5
- `receptionOfTourists.vue` — 季度接待游客对比

**右栏** `rightPanel.vue`

- `cityRevenueRank.vue` — 各市旅游收入排名
- `tourismSpendTop5.vue` — 旅游消费构成 TOP5
- `realTimeHotWords.vue` — 实时热词

以下组件已实现并消费 store，但 **当前未挂进左右栏**：`ageDistribution.vue`、`industryRevenue.vue`、`top5Tourists.vue`。

### 通用与图表封装

- `common/CEcharts.vue` — ECharts 容器
- `common/CPanel.vue` — 面板外壳
- `modules/echartMap.ts` + `CMap.vue` — 地图 option
- `composables/useChartConfig.ts`、`useChartHighlight.ts` — 图表配置与循环高亮

### AI 面板内部结构

`components/AIInsight/index.vue`：

- `AIChatHistory.vue` — 当前会话气泡
- `PresetTags.vue` — 空会话快捷问题
- `SessionList.vue` — 历史会话侧栏
- `AIInputBar.vue` — 输入与发送
- `composables/useAIChat.ts` — 对话状态与请求调度

---

## 3. Pinia 数据流

唯一 store：`useTourismStore`（`src/stores/tourism.ts`），Composition 写法。

```
cityStats.ts（cities + yearSnapshots）
        │
        ▼
useTourismStore
  state: selectedYear（默认 2024）
  getters: 按 selectedYear 从静态数据派生
  actions: setYear / getCityTrend
        │
        ├── TimelineSlider  ──setYear──► selectedYear
        ├── CHeader / CFooter / 左右图表  ◄── storeToRefs(getters)
        └── useAIChat 发消息时读取当前快照，写入 Prompt
```

### State 与 Actions

| 名称 | 作用 |
|---|---|
| `selectedYear` | 当前展示年份 |
| `setYear(year)` | 时间轴点击或自动播放改年 |
| `getCityTrend(name)` | 某市历年 visitors / revenue（地图下钻与 AI 趋势问） |

### 主要 Getters

- 核心：`currentSnapshot`、`currentCityStats`、`mapMarkers`、`provinceTotal`、`revenueRanking`、`visitorRanking`
- AI 辅助：`recoveryRate`、`yoyGrowth`、`cityGrowthRanking`
- 面板：`quarterlyReception`、`ageDistribution`、`visitorSourceTop5`、`scenicSpotRanking`、`cityRevenueRank`、`industryRevenue`、`top5Tourists`、`tourismSpendTop5`、`realTimeHotWords`、`footerStats`

改年之后所有 computed 自动重算，已用 `storeToRefs` 的组件同步刷新。AI 使用的是 **发送当下** 的 store 值，不会在流式过程中跟着年份再变一轮 Prompt。

对话历史、`isLoading`、SSE 缓冲 **不属于** 本 store。

---

## 4. AI 对话流程

胶水层：`src/components/AIInsight/composables/useAIChat.ts`。  
面板在 `onMounted` 调用 `init()`：从 `localStorage` 键 `gd-tourism-ai-sessions` 恢复会话；没有则新建一条。

### 发送一条消息

```
AIInputBar / PresetTags
        │  text
        ▼
useAIChat.sendMessage
        │
        ├─ 确保有当前会话
        ├─ push user 消息
        ├─ 若是会话第一条：用问题前 20 字作为 title
        ├─ push 空的 assistant（isStreaming: true）
        ├─ isLoading = true
        │
        ├─ classifyQuestion(text)          src/ai/questionClassifier.ts
        │     ranking | comparison | trend | general
        │
        ├─ 按类型调用 preprocessor         src/ai/preprocessor.ts
        │     输入：currentCityStats / currentSnapshot / getCityTrend 等
        │     输出：dataText + context
        │
        ├─ buildPrompt(type, result)       src/ai/prompt.ts
        │
        ├─ 组装 messages：
        │     system + 最近 4 条非空非流式历史 + 当前 user
        │
        └─ streamChat(history, onChunk)    src/services/aiService.ts
              chunk 追加 assistant.content
              done 时 isStreaming = false，更新 updatedAt
              失败则把错误写进该条 assistant
```

问题分类是 **本地正则**，不消耗 token。预处理把真实数字格式化成文本，Prompt 要求模型禁止编造数据。

### 多会话

- `sessions` + `currentSessionId`；`messages` 是当前会话的 computed。
- `createSession` / `switchSession` / `deleteSession`；UI 侧栏由 `SessionList` 触发。
- `watch(sessions, { deep: true })` 写回 localStorage。流式更新也会触发持久化。

---

## 5. SSE 流式通信流程

实现文件：`src/services/aiService.ts` 的 `streamChat`。

不使用浏览器 `EventSource`（该 API 只支持 GET、不便带 Bearer）。采用 **POST `fetch` + `ReadableStream`**，解析 OpenAI 兼容的 SSE 文本帧。

```
streamChat(messages, onChunk)
        │
        ├─ 读取 VITE_SILICONFLOW_API_KEY
        ├─ POST https://api.siliconflow.cn/v1/chat/completions
        │     Authorization: Bearer <key>
        │     body: model = deepseek-ai/DeepSeek-V3
        │           stream = true
        │           temperature = 0.7
        │           max_tokens = 2048
        │
        ├─ res.body.getReader() + TextDecoder
        ├─ 按 \n 拆行，不完整行留在 buffer
        ├─ 忽略空行、data: [DONE]、非 data: 前缀
        ├─ JSON.parse(data 后的 payload)
        ├─ content = choices[0].delta.content
        └─ onChunk({ done: false, content })
              读流结束后 onChunk({ done: true, content: '' })
```

`useAIChat` 收到 chunk 时：未结束则把 `content` 拼到当前会话最后一条 assistant；`done` 则去掉 `isStreaming`。`AIChatHistory` 由父组件对 `messages` 做 deep watch 后滚到底部。

环境变量未配置时直接抛错，大屏其它功能不受影响。

---

## 6. 主要目录职责

```
gd-tourism-dashboard-open-main/
├── src/
│   ├── main.ts                 创建应用、注册 Pinia / Element Plus
│   ├── page/index.vue          唯一页面：大屏骨架 + autofit
│   ├── stores/tourism.ts       唯一 Pinia store（旅游年份与派生数据）
│   ├── data/cityStats.ts       城市实体、年份快照（图表与 AI 的数据源）
│   ├── ai/
│   │   ├── questionClassifier.ts   问题类型（正则）
│   │   ├── preprocessor.ts         Store 数据 → Prompt 文本
│   │   └── prompt.ts               system prompt 构建
│   ├── services/aiService.ts   SiliconFlow HTTP + SSE 解析（唯一网络出口）
│   ├── composables/            图表配置、高亮（非 AI）
│   ├── modules/echartMap.ts    广东地图 ECharts option
│   ├── components/
│   │   ├── common/             CPanel、CEcharts
│   │   ├── leftPanel/          左侧图表
│   │   ├── rightPanel/         右侧图表
│   │   ├── AIInsight/          AI 面板与 useAIChat
│   │   ├── CHeader / CFooter / CMap / TimelineSlider
│   │   └── leftPanel.vue / rightPanel.vue
│   ├── assets/                 图片、字体、Geo、部分静态表
│   ├── styles/index.scss       全局样式
│   └── types/                  补充类型
├── docs/                       项目文档（本文件）
├── .cursor/rules/              Cursor 开发规范（非运行时）
├── vite.config.ts
└── package.json
```

| 目录 / 文件 | 职责摘要 |
|---|---|
| `src/page` | 单页布局，不承载业务计算 |
| `src/stores` | 旅游状态；不放聊天 |
| `src/data` | 权威静态数据与类型 |
| `src/ai` | 无网络的意图与 Prompt |
| `src/services` | 外部 API |
| `src/composables` | 图表侧可复用逻辑 |
| `src/components` | 大屏与 AI UI |
| `src/modules` | 地图 option 等非组件模块 |
| `src/assets` | 静态资源 |

---

## 相关实现入口（便于跳转）

- 入口：`src/main.ts`
- 页面：`src/page/index.vue`
- Store：`src/stores/tourism.ts`
- 静态数据：`src/data/cityStats.ts`
- 对话胶水：`src/components/AIInsight/composables/useAIChat.ts`
- SSE：`src/services/aiService.ts`
---
