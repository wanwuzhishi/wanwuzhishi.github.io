# 项目地址https://github.com/Pintree-io/pintree
# 下方文本全盘照搬项目原文，推荐去看原文
# Pintree

[English](README.md) | [中文](README.zh.md)

Pintree 是一个开源项目，旨在将浏览器书签导出成导航网站。通过简单的几步操作，就可以将书签转换成一个美观且易用的导航页面。

![](https://tuwwzs.pages.dev/file/1729088850082_Clip_2024-10-16_22-27-15.png)

## 项目功能和目标

- 导出浏览器书签
- 将书签文件转换成JSON格式
- 生成静态导航网站

## 安装和运行

### 步骤 1：下载浏览器书签

1. 安装 [Pintree Bookmarks Exporter](https://microsoftedge.microsoft.com/addons/detail/pintree-bookmarks-exporte/binmofchlenaimbnocogbpebiodjlgkm) 插件。
2. 使用插件导出浏览器书签，并保存 JSON 文件到本地。

![](https://tuwwzs.pages.dev/file/1729088930803_Clip_2024-10-16_22-28-39.png)

### 步骤 2：Fork 项目

1. 访问 [Pintree GitHub 仓库](https://github.com/Pintree-io/pintree)。
2. 点击页面右上角的 `Fork` 按钮，将项目 Fork 到您的 GitHub 账号中。

![](https://tuwwzs.pages.dev/file/1729089095760_step2.png)

### 步骤 3：替换 JSON 文件

1. 打开您 GitHub 账号中的 `pintree` 仓库（即刚才 Fork 的项目）。
2. 点击仓库中的 `json` 文件夹。
3. 点击 `Upload files` 按钮，选择刚才下载的 JSON 文件，并上传。
4. 确保上传的文件命名为 `pintree.json`，并选择 `Commit changes`。

![](https://tuwwzs.pages.dev/file/1729089110492_step3.png)

### 步骤 4：启用 GitHub Pages

1. 在您的 `pintree` 仓库页面，点击 `Settings`。
2. 找到 `Pages` 选项。
3. 在 `Source` 下拉菜单中，选择 `gh-pages` 分支，然后点击 `Save`。
4. 几分钟后，您的静态网站将会在 `https://yourusername.github.io/pintree` 上可用。记得替换 `yourusername`。

![](https://tuwwzs.pages.dev/file/1729089110692_step4.png)

--- 