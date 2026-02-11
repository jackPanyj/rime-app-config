<p align="center">
  <img src="src-tauri/icons/128x128@2x.png" width="100" alt="RIME Config logo" />
</p>

<h1 align="center">RIME Config</h1>

<p align="center">
  可视化配置你的 RIME 输入法，告别手动编辑 YAML。
</p>

<p align="center">
  <a href="https://github.com/jackPanyj/rime-app-config/releases">
    <img src="https://img.shields.io/github/v/release/jackPanyj/rime-app-config?style=flat-square" alt="Release" />
  </a>
  <a href="https://github.com/jackPanyj/rime-app-config/blob/main/LICENSE">
    <img src="https://img.shields.io/github/license/jackPanyj/rime-app-config?style=flat-square" alt="License" />
  </a>
</p>

---

RIME 是一款强大的开源输入法引擎，但配置过程需要手动编辑多个 YAML 文件，对普通用户并不友好。**RIME Config** 提供了一个直观的桌面界面，让你用鼠标点点就能完成所有配置。

<!-- 截图区域 - 将截图放入 docs/screenshots/ 目录 -->
<!-- ![Dashboard](docs/screenshots/dashboard.png) -->

## 功能亮点

**仪表盘** — 一目了然地查看 RIME 安装信息、激活的输入方案和关键配置状态。

**全局配置** — 调整候选词数量、配置中英文切换按键、设置快捷键、管理输入方案列表。

**输入方案管理** — 浏览已安装的方案，编辑开关选项，配置模糊拼音规则。

**外观主题** — 选择和预览配色方案，调整候选栏布局参数。

**自定义短语** — 可视化管理短语词库，支持表格编辑，告别手动编码。

**实时 YAML 预览** — 所有修改实时映射为 YAML，清楚看到每个操作对配置文件的影响。

## 下载安装

前往 [Releases](https://github.com/jackPanyj/rime-app-config/releases) 页面下载适用于你系统的安装包：

| 平台 | 文件 |
|------|------|
| macOS (Apple Silicon) | `.dmg` |
| macOS (Intel) | `.dmg` |
| Windows | `.msi` / `.exe` |
| Linux | `.deb` / `.AppImage` |

## 从源码构建

### 前置要求

- [Node.js](https://nodejs.org/) >= 18
- [pnpm](https://pnpm.io/)
- [Rust](https://www.rust-lang.org/tools/install)
- Tauri 系统依赖 — 参考 [Tauri 官方文档](https://tauri.app/start/prerequisites/)

### 开发

```bash
pnpm install
pnpm tauri dev
```

### 构建

```bash
pnpm tauri build
```

## 技术栈

[Tauri 2](https://tauri.app/) · [React 19](https://react.dev/) · TypeScript · [Tailwind CSS 4](https://tailwindcss.com/) · [Radix UI](https://www.radix-ui.com/) · [Zustand](https://zustand.docs.pmnd.rs/)

## License

[MIT](LICENSE)
