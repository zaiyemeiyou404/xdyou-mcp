# xdyou-mcp

西电校园数据的 MCP 服务。Cursor、Codex、DeepSeek Harness 和拾光接的是同一个进程。

能查课表、成绩、考试、校园卡、借阅、考勤、空教室、图书馆、校园网、体测、体育课、睿思、水电和空调状态。每次结果是一张卡片：正文，加上 MCP App `ui://xdyou/card.html`。认 MCP App 的主机会把课表格子、到课率和余额画出来。DeepSeek Harness 不画 MCP App，仓库里的 `dsh/xdyou-dsh-card` 把同一页嵌进工具行。

登录窗口由人完成验证码、二次验证和短信。服务不保存密码，也不读取 XDYou 的 `shared_preferences`。不会远程开水或开关空调。

## 安装

```text
npm install
npm run build
node dist/xdyou-mcp.js
```

缓存默认在用户目录的 `.xdyou`。换位置时设置 `XDYOU_SYNC_DIR`。

## 接到 agent

把 `node` 换成你的 Node 可执行文件。

Cursor `mcp.json`：

```json
{
  "mcpServers": {
    "xdyou": {
      "command": "node",
      "args": ["<本仓库>/dist/xdyou-mcp.js"],
      "env": { "XDYOU_SYNC_DIR": "<缓存目录>" }
    }
  }
}
```

Codex `config.toml`：

```toml
[mcp_servers.xdyou]
command = "node"
args = ["<本仓库>/dist/xdyou-mcp.js"]

[mcp_servers.xdyou.env]
XDYOU_SYNC_DIR = "<缓存目录>"
```

DeepSeek Harness 用同一个命令启动服务，再把 `dsh/xdyou-dsh-card` 加进桌面配置，工具行才会画出卡片。
