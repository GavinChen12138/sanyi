# 项目概览 (Project Overview)

这是一个基于 React 的 Web 应用程序，旨在帮助浙江省考生进行"三位一体"（San Yi）综合评价招生初审入围筛选。用户可以通过输入选考科目和学考等级，计算折算分数，并查看符合报考条件的院校和专业组。

## 项目结构 (Project Structure)

```
.
├── .git/                # Git 版本控制目录
├── .gitignore           # Git 忽略文件配置
├── Dockerfile           # Docker 构建配置
├── README.md            # 项目说明文档
├── eslint.config.js     # ESLint 配置文件
├── etc/                 # 其他配置文件目录
├── index.html           # HTML 入口文件
├── nginx.conf           # Nginx 部署配置
├── package-lock.json    # 依赖版本锁定文件
├── package.json         # 项目依赖和脚本配置
├── postcss.config.cjs   # PostCSS 配置文件
├── public/              # 静态资源目录
├── src/                 # 源代码目录
│   ├── App.css          # App 组件样式
│   ├── App.tsx          # 主应用组件 (核心逻辑)
│   ├── assets/          # 静态资源 (图片等)
│   ├── components/      # React 组件
│   │   ├── ResultList.tsx # 结果列表展示组件
│   │   └── Welcome.tsx    # 欢迎/引导页面组件
│   ├── data/            # 数据文件
│   │   └── schools.json   # 院校招生数据 (评分规则、要求等)
│   ├── index.css        # 全局样式 (Tailwind 指令)
│   ├── main.tsx         # 应用入口文件
│   ├── types/           # TypeScript 类型定义
│   │   └── index.ts       # 核心数据模型定义
│   └── vite-env.d.ts    # Vite 环境变量类型定义
├── tailwind.config.js   # Tailwind CSS 配置
├── tsconfig.app.json    # 应用程序 TypeScript 配置
├── tsconfig.json        # TypeScript 根配置
├── tsconfig.node.json   # Node 相关 TypeScript 配置
└── vite.config.ts       # Vite 构建配置
```

## 核心算法与关键逻辑 (Core Algorithms & Key Logic)

### 1. 分数折算算法 (Score Calculation)
**位置**: `src/App.tsx` -> `calculateScore`

该算法根据用户输入的各科学考等级（A/B/C/D/E）和每个院校专业组特定的折算规则，计算出总折算分。

*   **输入**:
    *   `grades`: 用户输入的各科等级 (例如: `{ 语文: 'A', 数学: 'B', ... }`)
    *   `school`: 院校专业组数据，包含各等级对应的分值 (例如: `{ A_rate: 10, B_rate: 8, ... }`)
*   **逻辑**:
    *   遍历用户的所有科目等级。
    *   根据等级匹配学校定义的对应分值（A -> `A_rate`, B -> `B_rate`, ...）。
    *   累加所有科目的分值得到 `totalScore`。

### 2. 报考资格校验 (Eligibility Check)
**位置**: `src/App.tsx` -> `handleSubmit` & `checkSubjectRequirements`

在计算分数的同时，系统会校验用户是否满足报考条件。

*   **科目要求校验**:
    *   **逻辑**: 检查用户的选考科目 (`selectedSubjects`) 是否包含该专业组要求的所有必选科目 (`required_subjects`)。
    *   **实现**: `requiredSubjects.every(subject => selectedSubjects.includes(subject))`
*   **分数线校验**:
    *   **逻辑**: 检查计算出的 `totalScore` 是否达到该专业组的入围分数线 (`score`)。
    *   **判定**: `isEligible = subjectsMatch && totalScore >= school.score`

### 3. 实时数据统计 (Real-time Statistics)
**位置**: `src/App.tsx` -> `gradeCount`

在用户输入成绩时，实时统计各等级的数量，用于底部摘要栏展示。

*   **逻辑**: 遍历 `subjectGrades` 对象，统计 A, B, C, D, E 各个等级出现的次数。

## 文件功能与作用 (File Functions & Purposes)

### 核心代码 (src/)

*   **`src/App.tsx`**:
    *   **功能**: 应用程序的主入口组件。
    *   **作用**:
        *   **状态管理**: 管理 `showWelcome` (欢迎页显示), `selectedSubjects` (选考科目), `subjectGrades` (学考等级)。
        *   **流程控制**: 控制从欢迎页 -> 输入页 -> 结果页的流转。
        *   **核心计算**: 执行上述的分数折算和资格校验算法。
        *   **界面渲染**: 组合 `Welcome`, `ResultList` 和输入表单。

*   **`src/components/Welcome.tsx`**:
    *   **功能**: 引导/欢迎页面。
    *   **作用**: 展示产品价值主张，提供"开始测试"的入口，提升用户体验。

*   **`src/components/ResultList.tsx`**:
    *   **功能**: 展示筛选和计算后的结果列表。
    *   **作用**:
        *   **数据展示**: 接收计算结果，按学校分组展示。
        *   **视觉优化**: 移动端卡片式布局，清晰展示折算分和报考状态。
        *   **图片导出**: 集成 `html2canvas`，支持将结果生成图片保存。

*   **`src/data/schools.json`**:
    *   **功能**: 核心数据源。
    *   **作用**: 存储所有院校专业组的配置信息（折算规则、科目要求、分数线），是算法计算的依据。

*   **`src/types/index.ts`**:
    *   **功能**: 类型定义。
    *   **作用**: 定义了系统的核心数据结构，保证数据流转的类型安全。

### 配置文件

*   **`package.json`**: 定义项目依赖（React, Vite, Tailwind等）和运行脚本。
*   **`vite.config.ts`**: Vite 构建工具配置。
*   **`tailwind.config.js`**: Tailwind CSS 样式配置。

## 技术栈 (Technology Stack)

*   **前端框架**: [React 19](https://react.dev/)
*   **构建工具**: [Vite](https://vitejs.dev/)
*   **编程语言**: [TypeScript](https://www.typescriptlang.org/)
*   **样式方案**: [Tailwind CSS](https://tailwindcss.com/)
*   **核心库**:
    *   `html2canvas`: 截图生成图片。
