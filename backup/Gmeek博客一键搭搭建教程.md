
# 项目地址https://github.com/Meekdai/Gmeek

# Gmeek 搭建教程

Gmeek 是一个超轻量级的个人博客框架，完全基于 GitHub Pages、GitHub Issues 和 GitHub Actions 构建。无需本地部署，从搭建到写作仅需 **18 秒** 和 **两步**，而 **第三步** 就可以开始写作。

## 前言

Gmeek 旨在为个人博客提供一个简洁、高效的解决方案。借助 GitHub 的强大功能，你无需担心服务器配置和维护，只需简单几步即可完成博客的搭建与管理。Gmeek 利用了 GitHub Pages 进行静态页面托管，GitHub Issues 作为博客文章的创作平台，GitHub Actions 自动化部署流程，使整个流程自动化、无缝衔接。

## 特点

- **与 GitHub 同源的 UI 界面**：采用 GitHub 原生 CSS[primer.style](https://primer.style/css)，界面风格与 GitHub 无缝衔接。
- **自动化部署**：在 Issues 中完成博客写作后，自动触发 GitHub Actions 执行部署任务。
- **评论系统**：集成 [utteranc.es](https://utteranc.es/)作为评论系统，轻量且易于使用。
- **可自定义主题**：使用 Jinja2 对 HTML 进行渲染，支持通过模板自定义 UI 主题。
- **无需本地部署**：所有操作均在 GitHub 上完成，简化部署流程。

# 示例

- 官方 [Demo页面](http://meekdai.github.io/)
- 我建立的https://wanwuzhishi.github.io/

## 快速上手

按照以下步骤，可以在 **两步，18 秒**  内完成 Gmeek 博客的搭建。

### 1. 创建仓库

1. **[通过模板创建仓库](https://github.com/new?template_name=Gmeek-template&template_owner=Meekdai)**：
    - 点击[通过模板创建仓库](https://github.com/new?template_name=Gmeek-template&template_owner=Meekdai)
2. **命名仓库**：
    - 推荐将仓库命名为 `YOUR_GITHUB_USERNAME.github.io`，其中 `YOUR_GITHUB_USERNAME` 为你的 GitHub 用户名。
    - 示例：如果你的 GitHub 用户名为 `wanwuzhishi`，则仓库名称应为 `wanwuzhishi.github.io`。
    

    
![image](https://github.com/user-attachments/assets/3947d5a6-af19-49ef-aaa8-830465c7e5ad)

3. **完成仓库创建**：
    - 点击 `Create repository`  完成仓库的创建。

### 2. 启用 GitHub Pages

1. **进入仓库设置**：
    - 在新创建的仓库页面，点击上方的 `Settings` 标签。
2. **配置 Pages**：
    - 在左侧菜单中，找到并点击 `Pages`。
    - 在 `Build and deployment` 部分，设置 `Source` 为 `GitHub Actions`。
3. **保存设置**：
    - 确认设置后，页面会自动保存，并显示部署状态。

### 3. 开始写作

1. **创建 Issue 文章**：
    - 进入仓库的 `Issues` 页面，点击 `New issue` 创建一篇新的文章。
2. **添加标签**：
    - 在创建 Issue 时，至少添加一个 `Label`（标签），例如 `blog`。
3. **保存 Issue**：
    - 完成内容撰写后，点击 `Submit new issue` 提交。
4. **自动生成博客内容**：
    - 提交 Issue 后，GitHub Actions 会自动触发构建流程。
    - 片刻后，你的博客内容将生成并部署到 `https://YOUR_GITHUB_USERNAME.github.io`。
5. **查看构建进度**：
    - 可进入 `Actions` 页面查看构建的详细进度和日志。

### 4. 手动全局生成

在以下情况下，需要手动全局生成博客内容：

- 修改了 `config.json` 文件。
- 出现了构建或显示上的奇怪问题。

**操作步骤**：

1. **进入 Actions 页面**：
    - 在仓库页面，点击上方的 `Actions` 标签。
2. **找到 Build Gmeek 工作流**：
    - 在左侧工作流列表中，选择 `build Gmeek`。
3. **运行工作流**：
    - 点击 `Run workflow` 按钮，手动触发一次全局重新生成。

## 提交问题

如果在搭建或使用过程中遇到问题，可以参考以下步骤提交问题：

1. **参考快速上手**：
    - 检查是否按照快速上手中的步骤正确操作。
2. **手动全局生成**：
    - 在提交问题之前，先手动全局生成一次，确保问题不在配置文件或构建流程中。
3. **提交 Issue**：
    - 如果问题依旧存在，进入仓库的 `Issues` 页面，点击 `New issue` 提交你的问题描述。
    - 提供尽可能详细的信息，例如错误日志、截图等，以便更快定位问题。
4. **协助解决**：
    - 提交后，项目维护者会协助查看构建流程，帮助定位和解决问题。

## 总结


Gmeek 为个人博客的创建和管理提供了一个简洁、快捷且高效的解决方案。通过利用 GitHub 的强大功能，用户无需担心复杂的部署流程，只需专注于内容创作即可。如果你正在寻找一个轻量级且易于维护的博客框架，Gmeek 无疑是一个值得尝试的选择。
