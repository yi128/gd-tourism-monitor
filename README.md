# 🏛️ 广东省智慧旅游数据监控平台

<div align="center">

![Vue](https://img.shields.io/badge/Vue-3.5.13-4FC08D?style=for-the-badge&logo=vue.js&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.7.2-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-6.1.0-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![ECharts](https://img.shields.io/badge/ECharts-5.6.0-AA344D?style=for-the-badge&logo=apache-echarts&logoColor=white)
![ElementPlus](https://img.shields.io/badge/Element_Plus-2.11.5-409EFF?style=for-the-badge&logo=element&logoColor=white)


[在线预览](https://690384f3cb62760008e17eb0--snazzy-pony-43de35.netlify.app/) • [项目介绍](#项目介绍) • [功能特色](#功能特色) • [技术栈](#技术栈) • [快速开始](#快速开始)

</div>

---

## 📦 项目来源

<div align="center" style="margin-bottom: 8px;">
  <img src="https://img.shields.io/badge/用途-学习参考-orange?style=flat-square" alt="项目用途" />
  <img src="https://img.shields.io/badge/领域-数据可视化-yellow?style=flat-square" alt="技术领域" />
</div>


> 本项目为数据可视化大屏的学习演示项目，采用现代化的前端技术栈。主要展示 ECharts 在复杂数据可视化场景中的应用，包括地图可视化、动态图表、实时数据更新等特性。项目代码结构清晰，注释完整，旨在为开发者提供数据大屏开发的技术参考和实践案例。


## 📊 项目介绍

广东省智慧旅游数据监控平台是一个基于 Vue 3 + TypeScript + ECharts 构建的数据可视化项目。

![大屏预览](/public/doc/大屏预览.png)

---

## ✨ 功能特色

### 🗺️ 地理信息展示

- **广东省地图**：精确的地理边界和行政区划
- **3D柱状图**：各城市旅游数据立体展示
- **动态高亮**：循环高亮显示不同城市数据

### 📈 数据可视化组件

#### 左侧面板

- **游客来源地分布**：3D立方体柱状图，循环高亮效果
- **各景点人流量排名**：实时滚动排名，进度条可视化
- **年度各季度接待游客比**：双年度对比折线图

#### 右侧面板

- **各市旅游收入排名**：渐变柱状图，循环高亮展示
- **实时热词**：散点图展示热门旅游关键词
- **旅游消费构成TOP5**：特殊形状柱状图，数值标签显示

### 🎨 界面特色

- **天蓝色主题**：渐变色蓝色背景，对应广东的沿海特征
- **动态效果**：流畅的动画和过渡效果
- **响应式设计**：适配不同屏幕尺寸
- **自定义字体**：独特的LED数字字体

### 🤖 AI 数据助手

- **悬浮面板**：可折叠的 AI 对话面板，覆盖在右侧图表之上
- **模块化架构**：输入框、对话历史、预设标签独立组件，职责清晰
- **组合式胶水层**：`useAIChat` composable 管理消息状态与 SSE 连接
- **流式渲染预留**：对话历史组件支持流式输出扩展
- **预设问题标签**：空状态下提供快捷提问入口

---

## 🛠️ 技术栈

| 技术                     | 版本   | 用途           |
| ------------------------ | ------ | -------------- |
| **Vue**                  | 3.5.13 | 前端框架       |
| **TypeScript**           | 5.7.2  | 类型安全       |
| **Vite**                 | 6.1.0  | 构建工具       |
| **ECharts**              | 5.6.0  | 数据可视化     |
| **Element Plus**         | 2.11.5 | UI 组件库      |
| **Pinia**                | 2.3.1  | 状态管理       |
| **Sass**                 | 1.89.2 | CSS预处理器    |
| **Vue3-scroll-seamless** | 1.0.6  | 无缝滚动       |
| **autofit.js**           | 3.2.8  | 大屏自适应缩放 |
| **vue3-odometer**        | 0.1.3  | 数字翻牌效果   |

### 🎯 核心技术特性

- **Vue 3 Composition API**：现代化的组件开发方式
- **TypeScript**：完整的类型定义和类型安全
- **ECharts 5**：强大的数据可视化能力
- **自定义图形**：3D立方体、特殊形状等自定义图表
- **动态高亮**：定时器控制的循环高亮效果
- **autofit.js 大屏自适应缩放**：自动适配不同分辨率，保证大屏展示效果
- **Pinia 状态管理**：集中管理旅游数据快照与响应式状态
- **Element Plus**：提供输入框、图标等 UI 基础组件
- **Composables 架构**：`useAIChat` 胶水层解耦 AI 对话逻辑与 UI

---

## 🚀 快速开始

### 环境要求

- Node.js >= 16.0.0
- pnpm >= 7.0.0

### 安装依赖

```bash
# 克隆项目
git clone https://github.com/your-username/gd-tourism-monitor.git

# 进入项目目录
cd gd-tourism-monitor

# 安装依赖
pnpm install
```

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
广东省智慧旅游数据监控平台/
├── src/
│   ├── components/          # 组件目录
│   │   ├── common/         # 通用组件（CPanel、CEcharts）
│   │   ├── leftPanel/      # 左侧面板组件
│   │   ├── rightPanel/     # 右侧面板组件
│   │   ├── AIInsight/      # AI 数据助手模块
│   │   │   ├── index.vue          # 组装器：布局 + 数据流
│   │   │   ├── AIInputBar.vue     # 输入框组件
│   │   │   ├── PresetTags.vue     # 预设标签组件
│   │   │   ├── AIChatHistory.vue  # 对话历史组件
│   │   │   └── composables/
│   │   │       └── useAIChat.ts   # 胶水层：SSE + 消息状态
│   │   ├── CHeader.vue     # 顶部标题
│   │   ├── CFooter.vue     # 底部
│   │   ├── CMap.vue        # 地图组件
│   │   └── TimelineSlider.vue # 时间轴
│   ├── composables/        # 组合式函数
│   │   ├── useChartConfig.ts
│   │   └── useChartHighlight.ts
│   ├── stores/             # Pinia 状态管理
│   │   └── tourism.ts
│   ├── modules/            # 业务模块
│   │   └── echartMap.ts
│   ├── data/               # 数据文件
│   │   └── cityStats.ts
│   ├── page/               # 页面入口
│   │   └── index.vue
│   ├── assets/             # 静态资源
│   │   ├── data/          # 数据文件
│   │   └── images/        # 图片资源
│   ├── styles/            # 样式文件
│   ├── types/             # 类型定义
│   └── main.ts            # 应用入口
├── public/                # 公共资源
├── design/                # 设计源文件
└── package.json          # 项目配置
```


---

## 🎨 设计亮点

### 🔧 交互体验

- **循环高亮**：自动循环高亮不同数据项
- **无缝滚动**：流畅的列表滚动效果
- **响应式布局**：适配不同设备屏幕
- **实时更新**：动态数据更新和展示
- **AI 悬浮面板**：可折叠的 AI 助手面板，支持流式对话扩展
- **预设问题**：空状态下一键发送预设提问

---

## 🤝 贡献

欢迎提交 Issue 和 Pull Request 改进项目。

### 开发规范

- 使用 TypeScript 进行类型安全开发
- 遵循 Vue 3 Composition API 最佳实践
- 保持代码风格一致，使用 ESLint + Prettier
- 添加适当的注释和文档
- AIInsight 模块遵循 **组装器 + 纯子组件 + composables 胶水层** 的分层架构

### 提交规范

```bash
feat: 添加新功能
fix: 修复bug
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

- [Vue.js](https://vuejs.org/) - 渐进式JavaScript框架
- [ECharts](https://echarts.apache.org/) - 数据可视化图表库
- [Vite](https://vitejs.dev/) - 下一代前端构建工具
- [TypeScript](https://www.typescriptlang.org/) - JavaScript的超集

---

<div align="center">

**🌟 如果这个项目对您有帮助，请给它一个 Star！**

Made with ❤️ in Guangdong, China

</div>