# 🏛️ 广东省智慧旅游数据监控平台

<div align="center">

![Vue](https://img.shields.io/badge/Vue-3.5.13-4FC08D?style=for-the-badge&logo=vue.js&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.7.2-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-6.1.0-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![ECharts](https://img.shields.io/badge/ECharts-6.0.0-AA344D?style=for-the-badge&logo=apache-echarts&logoColor=white)
![Element Plus](https://img.shields.io/badge/Element_Plus-2.11.5-409EFF?style=for-the-badge&logo=element&logoColor=white)

[在线预览](https://690384f3cb62760008e17eb0--snazzy-pony-43de35.netlify.app/) • [项目介绍](#项目介绍) • [功能特色](#功能特色) • [技术栈](#技术栈) • [快速开始](#快速开始)

</div>

---

## 📦 项目来源

<div align="center" style="margin-bottom: 8px;">
  <img src="https://img.shields.io/badge/用途-学习参考-orange?style=flat-square" alt="项目用途" />
  <img src="https://img.shields.io/badge/领域-数据可视化-yellow?style=flat-square" alt="技术领域" />
  <img src="https://img.shields.io/badge/特色-AI 数据助手-purple?style=flat-square" alt="AI 特色" />
</div>

> 本项目为数据可视化大屏的学习演示项目，采用现代化的前端技术栈。主要展示 ECharts 在复杂数据可视化场景中的应用，包括地图可视化、动态图表、实时数据更新等特性。项目代码结构清晰，注释完整，旨在为开发者提供数据大屏开发的技术参考和实践案例。

## 📊 项目介绍

广东省智慧旅游数据监控平台是一个基于 Vue 3 + TypeScript + ECharts 构建的数据可视化大屏项目。项目通过丰富的图表类型和动态效果，全景展示广东省主要城市的旅游数据，涵盖游客量、旅游收入、热点景区、消费构成等维度。

![大屏预览](/src/assets/images/背景.png)

---

## ✨ 功能特色

### 🗺️ 地理信息展示

- **广东省地图**：精确的地理边界和行政区划
- **3D柱状图**：各城市旅游数据立体展示
- **动态高亮**：循环高亮显示不同城市数据
- **地图标记**：Top5 城市游客量标记展示

### 📈 数据可视化组件

#### 左侧面板（支持折叠/展开）

- **各景点人流量排名**：实时滚动排名，进度条可视化
- **游客来源地 TOP5**：来源省份占比展示
- **年度各季度接待游客比**：双年度对比折线图

#### 右侧面板（支持折叠/展开）

- **各市旅游收入排名**：渐变柱状图，循环高亮展示
- **旅游消费构成 TOP5**：特殊形状柱状图，数值标签显示
- **实时热词**：散点图展示热门旅游关键词

> 注：项目还实现了 `ageDistribution`（游客年龄分布）、`industryRevenue`（行业收入）、`top5Tourists`（TOP5 游客城市）等图表组件，可根据需要替换挂载到面板中。

### ⏱️ 时间轴与底部 KPI

- **年份时间轴**：2019–2024 年份选择器，支持手动切换与自动轮播播放
- **底部 KPI 面板**：收入、游客量、出游支出三大核心指标，带数字翻牌动画与实时波动模拟
- **顶部新闻轮播**：当前年份旅游热点新闻自动轮播，支持悬停暂停

### 🎨 界面特色

- **天蓝色主题**：渐变色蓝色背景，对应广东的沿海特征
- **动态效果**：流畅的动画和过渡效果
- **响应式设计**：适配不同屏幕尺寸
- **自定义字体**：独特的 LED 数字字体
- **面板折叠**：左右侧面板支持一键折叠/展开，释放地图可视区域

### 🤖 AI 数据助手

本项目集成了完整的 AI 问答流水线，基于 SiliconFlow API + DeepSeek-V3 模型，支持流式输出与多会话管理。

#### 架构分层

```
用户问题
    ↓
意图识别（questionClassifier）→ 结构化 Query（intent + cities + metric + topN + yearRange）
    ↓
数据查询 / 计算引擎（dataQuery）→ 结构化结果（ranking / comparison / trend / general）
    ↓
Prompt 构建器（prompt）→ System Prompt（身份 + 真实数据 + 回答要求）
    ↓
LLM（SiliconFlow API）→ SSE 流式输出 → 渲染
```

#### 模块说明

| 模块              | 文件                                                | 职责                                                                         |
| ----------------- | --------------------------------------------------- | ---------------------------------------------------------------------------- |
| **意图识别层**    | `src/ai/questionClassifier.ts`                      | 本地正则关键词匹配，0 token 消耗，提取意图 + 城市 + 指标 + TopN + 年份范围   |
| **数据查询引擎**  | `src/ai/dataQuery.ts`                               | 接收结构化 Query，从 Store 取数并计算，输出结构化结果（排名/对比/趋势/通用） |
| **Prompt 构建器** | `src/ai/prompt.ts`                                  | 基于结构化结果动态生成 System Prompt，注入真实数据，设置回答规则和格式要求   |
| **AI 服务**       | `src/services/aiService.ts`                         | 封装 SiliconFlow SSE 接口，实现流式对话和增量渲染                            |
| **聊天胶水层**    | `src/components/AIInsight/composables/useAIChat.ts` | 编排新链路：classify → executeQuery → buildPrompt → streamChat               |

#### 功能亮点

- **结构化 Query**：意图识别层输出 `StructuredQuery`（intent + cities + metric + topN + yearRange），参数提取更精准
- **数据查询引擎**：独立的 `dataQuery.ts` 模块，支持排名排序、对比筛选、趋势计算（增长率/恢复率/峰值谷值）
- **结构化结果**：查询引擎输出 `StructuredResult`，不同类型（ranking/comparison/trend/general）有明确的数据结构
- **动态 Prompt 构建**：基于结构化结果动态格式化数据文本，不同意图对应不同的回答要求
- **零成本意图识别**：本地正则关键词匹配，无需调用 AI 即可完成问题分类（<1ms）
- **数据前置注入**：回答前先从 Store 取真实数据塞进 Prompt，防止 AI 编造数字
- **流式输出**：基于 SSE 的逐字生成体验
- **可折叠悬浮面板**：覆盖在右侧图表之上，支持随时展开/收起
- **预设问题标签**：空状态下提供快捷提问入口
- **多会话管理**：支持创建、切换、删除会话，历史会话列表持久化到 localStorage
- **会话标题自动生成**：第一条用户消息自动提取为会话标题

---

## 🛠️ 技术栈

| 技术                        | 版本   | 用途                |
| --------------------------- | ------ | ------------------- |
| **Vue**                     | 3.5.13 | 前端框架            |
| **TypeScript**              | 5.7.2  | 类型安全            |
| **Vite**                    | 6.1.0  | 构建工具            |
| **ECharts**                 | 6.0.0  | 数据可视化          |
| **Element Plus**            | 2.11.5 | UI 组件库           |
| **@element-plus/icons-vue** | 2.3.2  | Element Plus 图标集 |
| **Pinia**                   | 2.3.1  | 状态管理            |
| **Sass**                    | 1.89.2 | CSS 预处理器        |
| **Vue3-scroll-seamless**    | 1.0.6  | 无缝滚动            |
| **autofit.js**              | 3.2.8  | 大屏自适应缩放      |
| **vue3-odometer**           | 0.1.3  | 数字翻牌效果        |
| **unplugin-auto-import**    | 20.2.0 | API 自动导入        |
| **unplugin-vue-components** | 29.1.0 | 组件自动注册        |
| **SiliconFlow API**         | -      | AI 对话后端         |

### 🎯 核心技术特性

- **Vue 3 Composition API**：现代化的组件开发方式
- **TypeScript**：完整的类型定义和类型安全
- **ECharts 6**：强大的数据可视化能力
- **自定义图形**：3D立方体、特殊形状等自定义图表
- **动态高亮**：定时器控制的循环高亮效果
- **autofit.js 大屏自适应缩放**：自动适配不同分辨率，保证大屏展示效果
- **Pinia 状态管理**：集中管理旅游数据快照与响应式状态
- **Element Plus**：提供输入框、图标等 UI 基础组件
- **Composables 架构**：`useAIChat` 胶水层解耦 AI 对话逻辑与 UI
- **SSE 流式对话**：与 SiliconFlow API 实时交互，支持增量渲染
- **localStorage 持久化**：AI 会话历史自动保存与恢复

---

## 🚀 快速开始

### 环境要求

- Node.js >= 16.0.0
- pnpm >= 7.0.0

### 安装依赖

```bash
# 克隆项目
git clone https://github.com/zcs13/gd-tourism-dashboard-open.git

# 进入项目目录
cd gd-tourism-dashboard-open

# 安装依赖
pnpm install
```

### 配置环境变量

复制 `.env` 文件并填入你的 SiliconFlow API Key（用于 AI 数据助手功能）：

```bash
cp .env.example .env
```

```env
VITE_SILICONFLOW_API_KEY=your-api-key-here
```

> 💡 API Key 获取地址：[https://siliconflow.cn](https://siliconflow.cn)。AI 助手未配置 API Key 时，其他功能不受影响，仅 AI 对话会报错提示。

### 开发运行

```bash
# 启动开发服务器
pnpm dev

# 构建生产版本
pnpm build

# 预览生产版本
pnpm preview
```

### 大屏自适应说明

本项目已集成 [autofit.js](https://github.com/xiaokaike/autofit.js) 插件，自动适配各种分辨率，开箱即用，无需手动调整。默认基准分辨率为 1920×1080，适合主流大屏场景。

### 项目结构

```
gd-tourism-dashboard-open-main/
├── src/
│   ├── ai/                        # AI 问答核心模块
│   │   ├── questionClassifier.ts  # 意图识别层：提取 StructuredQuery（意图 + 参数）
│   │   ├── dataQuery.ts           # 数据查询引擎：StructuredQuery → StructuredResult
│   │   ├── prompt.ts              # Prompt 构建器：StructuredResult → System Prompt
│   │   └── __tests__/             # 链路测试
│   │       └── workflow.test.ts   # 覆盖意图识别 / 数据查询 / Prompt / 端到端
│   ├── components/
│   │   ├── common/                # 通用组件
│   │   │   ├── CPanel.vue         # 面板容器
│   │   │   └── CEcharts.vue       # ECharts 封装
│   │   ├── leftPanel.vue          # 左侧面板容器（支持折叠）
│   │   ├── leftPanel/             # 左侧图表组件
│   │   │   ├── ageDistribution.vue       # 游客年龄分布（已实现，未挂载）
│   │   │   ├── rankingOfScenicSpots.vue  # 景点人流量排名
│   │   │   ├── receptionOfTourists.vue   # 季度接待游客
│   │   │   └── visitorSourceTop5.vue     # 游客来源 TOP5
│   │   ├── rightPanel.vue         # 右侧面板容器（支持折叠）
│   │   ├── rightPanel/            # 右侧图表组件
│   │   │   ├── cityRevenueRank.vue       # 各市收入排名
│   │   │   ├── industryRevenue.vue        # 行业收入（已实现，未挂载）
│   │   │   ├── realTimeHotWords.vue       # 实时热词
│   │   │   ├── top5Tourists.vue           # TOP5 游客城市（已实现，未挂载）
│   │   │   └── tourismSpendTop5.vue       # 旅游消费 TOP5
│   │   ├── AIInsight/             # AI 数据助手模块
│   │   │   ├── index.vue          # 组装器：布局 + 数据流
│   │   │   ├── AIInputBar.vue     # 输入框组件
│   │   │   ├── PresetTags.vue     # 预设标签组件
│   │   │   ├── AIChatHistory.vue  # 对话历史组件
│   │   │   ├── SessionList.vue    # 历史会话列表组件
│   │   │   └── composables/
│   │   │       └── useAIChat.ts   # 胶水层：SSE + 消息状态 + 多会话管理
│   │   ├── CHeader.vue            # 顶部标题 + 新闻轮播
│   │   ├── CFooter.vue            # 底部 KPI 数字翻牌器
│   │   ├── CMap.vue               # 广东省地图
│   │   └── TimelineSlider.vue     # 2019-2024 时间轴滑块（支持自动播放）
│   ├── composables/               # 组合式函数
│   │   ├── useChartConfig.ts      # 图表配置生成
│   │   └── useChartHighlight.ts   # 循环高亮效果
│   ├── services/                  # 服务层
│   │   └── aiService.ts           # SiliconFlow SSE API 封装
│   ├── stores/                    # Pinia 状态管理
│   │   └── tourism.ts             # 旅游数据快照（10 城市 × 6 年）
│   ├── modules/                   # 业务模块
│   │   └── echartMap.ts           # ECharts 地图模块
│   ├── data/                      # 静态数据
│   │   └── cityStats.ts           # 城市统计数据（2019-2024）
│   ├── assets/
│   │   ├── data/                  # 地理数据、排名数据
│   │   └── images/                # 背景、图标等图片资源
│   ├── page/
│   │   └── index.vue              # 页面入口（单页应用）
│   ├── styles/
│   │   └── index.scss             # 全局样式
│   ├── types/
│   │   └── index.d.ts             # 类型定义
│   └── main.ts                    # 应用入口
├── public/                        # 公共资源（地图 GeoJSON、字体）
├── docs/
│   └── architecture.md            # 详细架构说明文档
├── design/                        # 设计源文件（PSD）
├── .env                           # 环境变量（API Key）
├── index.html
├── vite.config.ts
├── tsconfig.json
└── package.json
```

---

## 🎨 设计亮点

### 🔧 交互体验

- **循环高亮**：自动循环高亮不同数据项
- **无缝滚动**：流畅的列表滚动效果
- **响应式布局**：适配不同设备屏幕
- **实时更新**：动态数据更新和展示
- **AI 悬浮面板**：可折叠的 AI 助手面板，支持流式对话与多会话切换
- **预设问题标签**：空状态下一键发送预设提问
- **3D 效果**：立方体柱状图、柱状图立体展示
- **面板折叠**：左右侧面板可折叠，优化地图可视区域
- **时间轴自动播放**：年份数据自动轮播展示
- **数字翻牌动画**：底部 KPI 指标动态变化，模拟实时数据

---

## 🤝 贡献

欢迎提交 Issue 和 Pull Request 改进项目。

### 开发规范

- 使用 TypeScript 进行类型安全开发
- 遵循 Vue 3 Composition API 最佳实践
- 保持代码风格一致（ESLint + Prettier）
- AIInsight 模块遵循 **组装器 + 纯子组件 + composables 胶水层** 的分层架构
- AI 问答流水线遵循 **意图识别 → 结构化 Query → 数据查询 → 结构化结果 → Prompt → LLM → SSE** 的分层设计

### 提交规范

```bash
feat: 添加新功能
fix: 修复 bug
docs: 更新文档
style: 代码格式调整
refactor: 代码重构
test: 添加测试
chore: 构建过程或辅助工具的变动
```

---

## 📄 许可证

本项目采用 [MIT License](LICENSE) 开源许可证。

---

## 🙏 致谢

感谢以下开源项目和技术社区的支持：

- [Vue.js](https://vuejs.org/) - 渐进式 JavaScript 框架
- [ECharts](https://echarts.apache.org/) - 数据可视化图表库
- [Vite](https://vitejs.dev/) - 下一代前端构建工具
- [TypeScript](https://www.typescriptlang.org/) - JavaScript 的超集
- [Element Plus](https://element-plus.org/) - Vue 3 UI 组件库
- [SiliconFlow](https://siliconflow.cn/) - AI 模型 API 服务
- [autofit.js](https://github.com/xiaokaike/autofit.js) - 大屏自适应缩放

---

<div align="center">

**🌟 如果这个项目对您有帮助，请给它一个 Star！**

Made with ❤️ in Guangdong, China

</div>