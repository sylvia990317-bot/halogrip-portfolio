# HALOGRIP — 网页作品集 / VS Code 项目

这是可以独立编辑和本地运行的 Next.js 网页项目。

## 1. 准备软件

安装 Visual Studio Code 和 Node.js 22.13 或更新版本。

## 2. 用 VS Code 打开

1. 解压整个 ZIP 文件。
2. 打开 VS Code。
3. 点击 File → Open Folder，选择 `HALOGRIP_VSCode_Project` 文件夹。

## 3. 安装并运行

在 VS Code 中选择 Terminal → New Terminal，然后运行：

```bash
npm install
npm run dev
```

终端启动完成后，用浏览器打开：

http://localhost:3000

保存源码后，浏览器通常会自动更新。关闭网页服务时，在终端按 Ctrl + C。

## 4. 修改哪些文件

- `app/page.tsx`：项目文案、版块顺序、数字和图片引用。
- `app/globals.css`：背景颜色、字体大小、页面留白、手机端样式。
- `app/layout.tsx`：浏览器标题和分享预览信息。
- `app/interaction-deck.tsx`：方向盘前进、静止、刹车、倒车的交互。
- `public/media/`：方向盘渲染、草图、原型、故事板和 HUD 图片。
- `public/fonts/`：网页使用的窄体标题字体和等宽字体。

## 5. 常用修改

修改文字：打开 `app/page.tsx`，搜索原来的英文句子，直接替换。

修改颜色：打开 `app/globals.css`，搜索 `:root`：

```css
--paper: #eaeae6;     /* 页面底色 */
--red: #c93731;       /* 强调色 */
--dark: #1b1f1e;      /* 深色区块 */
```

替换图片：把新图放进 `public/media/`，然后把 `app/page.tsx` 中对应的 `/media/文件名.webp` 改成新文件名。PNG、JPG 和 WebP 都可以使用。

## 6. 发布说明

这是独立导出的项目。你在电脑上修改后，不会自动同步到原来的 ChatGPT Sites 网页。之后可以把项目部署到支持 Next.js 的平台，或者将修改后的文件交回来继续更新原网页。

---

Master’s thesis project: Sylvia Xie + Yuxin Lin

Industry partner: Autoliv × Chalmers University of Technology
