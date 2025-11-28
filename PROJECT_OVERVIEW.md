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
│   │   └── ResultList.tsx # 结果列表展示组件
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

## 文件功能与作用 (File Functions & Purposes)

### 核心代码 (src/)

*   **`src/App.tsx`**:
    *   **功能**: 应用程序的主入口组件。
    *   **作用**:
        *   管理用户状态：选考科目 (`selectedSubjects`)、各科成绩 (`subjectGrades`)。
        *   实现核心业务逻辑：
            *   `calculateScore`: 根据学校的评分规则（A/B/C/D/E 等级折算分）计算总分。
            *   `checkSubjectRequirements`: 检查用户的选考科目是否满足学校要求。
            *   `handleSubmit`: 提交用户选择，遍历所有学校数据进行计算和筛选。
        *   渲染界面：包含科目选择器、成绩输入器，以及结果展示区域（条件渲染）。

*   **`src/components/ResultList.tsx`**:
    *   **功能**: 展示筛选和计算后的结果列表。
    *   **作用**:
        *   接收 `results` (计算结果)、`selectedSubjects` 和 `subjectGrades` 作为 props。
        *   提供筛选功能：`showEligibleOnly` (只看可报考)。
        *   展示数据：按学校分组展示专业组、折算分和报考状态。
        *   **图片导出**: 使用 `html2canvas` 将结果列表（包含二维码）保存为图片。
        *   响应式设计：提供桌面端表格视图和移动端卡片视图。

*   **`src/data/schools.json`**:
    *   **功能**: 存储院校数据。
    *   **作用**: 包含各个院校专业组的详细信息，如：
        *   `school`: 学校名称
        *   `group`: 专业组名称
        *   `*_rate`: 各等级（A-E）对应的折算分数
        *   `required_subjects`: 必选科目要求
        *   `score`: 入围分数线

*   **`src/types/index.ts`**:
    *   **功能**: 定义 TypeScript 类型接口。
    *   **作用**: 确保类型安全，定义了 `SubjectType` (科目), `GradeType` (等级), `UserSelection` (用户选择), `MajorGroup` (学校数据结构), `CalculationResult` (计算结果) 等核心类型。

### 配置文件

*   **`package.json`**: 定义项目依赖（React, Vite, Tailwind等）和运行脚本（dev, build）。
*   **`vite.config.ts`**: Vite 构建工具的配置。
*   **`tailwind.config.js`**: Tailwind CSS 的样式配置。
*   **`tsconfig.json`**: TypeScript 编译选项配置。
*   **`Dockerfile` & `nginx.conf`**: 用于容器化部署和 Nginx 服务器配置。

## 技术栈 (Technology Stack)

*   **前端框架**: [React 19](https://react.dev/)
*   **构建工具**: [Vite](https://vitejs.dev/)
*   **编程语言**: [TypeScript](https://www.typescriptlang.org/)
*   **样式方案**: [Tailwind CSS](https://tailwindcss.com/)
*   **工具库**:
    *   `html2canvas`: 用于将 DOM 元素截图并保存为图片。
    *   `axios`: HTTP 客户端 (虽然在目前的核心逻辑中主要使用本地 JSON 数据)。
*   **代码规范**: ESLint
