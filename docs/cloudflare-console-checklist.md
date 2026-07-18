# Cloudflare 控制台填写项清单（可复制粘贴）

目标：将域名通过 Cloudflare 中国网络前置，回源到 Vercel（knowledge-yfm7.vercel.app）。下面是控制台中每一项可直接复制的填写值与说明。

请在替换时把 `{{YOUR_DOMAIN}}` 换成你的自有域名（例如 `japanese.example.com`），把 `{{ZONE_ID}}` 与 `{{CF_API_TOKEN}}` 留空直到在 Cloudflare 控制台/账户中获取。

---
## 1) DNS（添加 CNAME）
- 类型：CNAME
- 名称（Name）：`{{YOUR_DOMAIN_SUBDOMAIN}}`（例如 `japanese` 或 `www`）
- 内容（Target）：`knowledge-yfm7.vercel.app`
- TTL：自动
- Proxy status：Proxied (橙色云)

示例：如果你要用 `japanese.example.com`，Name 填 `japanese`，Target 填 `knowledge-yfm7.vercel.app`。

API 示例（创建 CNAME）：
```bash
curl -X POST "https://api.cloudflare.com/client/v4/zones/{{ZONE_ID}}/dns_records" \
 -H "Authorization: Bearer {{CF_API_TOKEN}}" \
 -H "Content-Type: application/json" \
 --data '{"type":"CNAME","name":"japanese","content":"knowledge-yfm7.vercel.app","ttl":1,"proxied":true}'
```

---
## 2) SSL/TLS 设置
- SSL/TLS -> Overview
  - SSL/TLS encryption mode：`Full (strict)`
  - Always Use HTTPS：On
  - Automatic HTTPS Rewrites：On

（说明）Full (strict) 要求回源（Vercel）有有效证书，Vercel 自带证书可以满足。

---
## 3) 回源（Origin）与主机头
- Origin Hostname（回源域名）：`knowledge-yfm7.vercel.app`
- Origin Protocol Policy：`HTTPS`（或 `HTTPS Only`）
- Host Header（当 Cloudflare 要求自定义 Host）：建议填 `{{YOUR_DOMAIN}}`（即你绑定到 Vercel 的自有域名），这样 Vercel 会正确匹配域名并返回对应页面；若未在 Vercel 添加自定义域名，可临时设为 `knowledge-yfm7.vercel.app`。

注意：在 Vercel 仪表盘中把你的自有域名添加到项目（Domains）并完成验证，有助于 Host 为自有域名时回源显示正确内容。

---
## 4) 缓存策略（Page Rules / Transform Rules）
下面给出三条主要规则，Cloudflare 控制台可用 Page Rules 或 Rulesets / Transform Rules 实现。优先用 Transform Rules（规则引擎），若不熟悉可用 Page Rules 实现等效行为。

1) 静态资源长期缓存（优先级高）
- 匹配模式：`https://{{YOUR_DOMAIN}}/_next/static/*` 以及 `https://{{YOUR_DOMAIN}}/static/*` 和 `https://{{YOUR_DOMAIN}}/images/*`
- 设置：Cache Level = Cache Everything；Edge Cache TTL = 31536000（1 year）；Browser Cache TTL = 31536000；Origin Cache Control = Ignore

2) 页面（HTML）短缓存（全站通用）
- 匹配模式：`https://{{YOUR_DOMAIN}}/*`
- 设置：Cache Level = Cache Everything；Edge Cache TTL = 3600（1 hour）；Browser Cache TTL = 0（no-cache）；Origin Cache Control = Ignore

3) 动态/API 路径不缓存
- 匹配模式：`https://{{YOUR_DOMAIN}}/api/*`
- 设置：Bypass Cache（或 Origin Cache Control = Respect，回源决定缓存）

示例 API：使用 Page Rules（先创建规则，再调整顺序）

---
## 5) 性能 & 其它建议（控制台选项）
- Enable HTTP/2 & HTTP/3：On
- Brotli：On
- Always Online：Off（对动态站点不建议）
- Enable Argo：可选（付费，能优化跨境稳定性）

---
## 6) 验证与调试命令（务必在国内网络执行）
替换 `{{YOUR_DOMAIN}}` 后执行：

检查页面头与缓存：
```bash
curl -I -L https://{{YOUR_DOMAIN}}/ 
```
期望看到：`CF-Cache-Status: HIT`、`Age`、以及 `cache-control` 为你配置的值。

检查静态资源缓存：
```bash
curl -I https://{{YOUR_DOMAIN}}/_next/static/chunks/<some-file>.js
```

完整耗时检测：
```bash
curl -s -o /dev/null -w "time_total:%{time_total} time_connect:%{time_connect} time_starttransfer:%{time_starttransfer}\n" https://{{YOUR_DOMAIN}}/
```

---
## 7) Cloudflare API：创建 Page Rule（示例）
创建一个 Page Rule（示例用于缓存 HTML）：
```bash
curl -X POST "https://api.cloudflare.com/client/v4/zones/{{ZONE_ID}}/pagerules" \
 -H "Authorization: Bearer {{CF_API_TOKEN}}" \
 -H "Content-Type: application/json" \
 --data '{
  "targets": [ { "target": "url", "constraint": { "operator": "matches", "value": "https://{{YOUR_DOMAIN}}/*" } } ],
  "actions": [ { "id": "cache_level", "value": "cache_everything" }, { "id": "edge_cache_ttl", "value": 3600 }, { "id": "browser_cache_ttl", "value": 0 } ],
  "priority": 1
}'
```

注意：Cloudflare 的新规则引擎（Rulesets/Transform Rules）更强大，上述 Page Rules 接口能作为快速配置示例。

---
## 8) 备案未完成的临时处理方案
- 若域名未备案但需尽快改善大陆访问：
  1) 继续使用 `*.vercel.app` 子域为主站（无需备案），并通过 Cloudflare 对 `vercel.app` 的 CNAME 代理不可行，因此需使用 Cloudflare 合作的“企业直连/合作域名”或考虑国内云镜像。
  2) 若选择国内镜像（短期方案），将静态输出 `out/` 上传到阿里 OSS 并配置 CDN，快速提升静态文件访问速度（但首页仍需考虑动态页面）。

---
## 9) 我可以替你生成的文件
我可以把上面的“控制台填写项清单”替换占位并生成：
- `docs/cloudflare-console-{{YOUR_DOMAIN}}.md`（填写完你的域名后生成），包含可直接复制的 API 命令与验证脚本。

要我现在为某个具体域名生成并推送该文件吗？请回复域名（例如 `japanese.example.com`）。
