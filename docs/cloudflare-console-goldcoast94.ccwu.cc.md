# Cloudflare 控制台填写项清单 — goldcoast94.ccwu.cc

目标：将 `goldcoast94.ccwu.cc` 通过 Cloudflare 中国网络前置，回源到 Vercel 项目 `knowledge-yfm7.vercel.app`。下方为控制台可直接复制的填写项、API 示例与验证命令（已替换为你的域名）。

---
## 1) DNS（添加 CNAME / Apex 注意事项）
- 若使用子域（推荐）：
  - 类型：CNAME
  - 名称（Name）：`www` 或 你想要的子域（例如 `japanese`）
  - 内容（Target）：`knowledge-yfm7.vercel.app`
  - TTL：自动
  - Proxy status：Proxied (橙色云)
- 若想把根域名 `goldcoast94.ccwu.cc` 指向 Vercel（Apex）：
  - Cloudflare 支持在 DNS 中代理 apex（通过其内部实现），在 DNS 面板为 `goldcoast94.ccwu.cc` 添加 A/AAAA 记录并启用代理，或使用 Cloudflare 提供的 CNAME Flattening/ANAME 特性；也可以在 Cloudflare 中把根域指向 `knowledge-yfm7.vercel.app` 的 CNAME（Cloudflare 会处理 flattening）。

API 示例（创建子域 CNAME）：
```bash
curl -X POST "https://api.cloudflare.com/client/v4/zones/{{ZONE_ID}}/dns_records" \
 -H "Authorization: Bearer {{CF_API_TOKEN}}" \
 -H "Content-Type: application/json" \
 --data '{"type":"CNAME","name":"www","content":"knowledge-yfm7.vercel.app","ttl":1,"proxied":true}'
```

---
## 2) SSL/TLS 设置
- SSL/TLS -> Overview
  - SSL/TLS encryption mode：`Full (strict)`
  - Always Use HTTPS：On
  - Automatic HTTPS Rewrites：On

说明：Vercel 默认为项目提供有效证书，选择 `Full (strict)` 可确保回源和边缘之间也是加密并验证证书。

---
## 3) 回源（Origin）与主机头
- Origin Hostname：`knowledge-yfm7.vercel.app`
- Origin Protocol Policy：`HTTPS`（HTTPS Only）
- Host Header：建议填 `goldcoast94.ccwu.cc`（当你在 Vercel 添加并验证此域名后），若暂未在 Vercel 添加域名，可填 `knowledge-yfm7.vercel.app`。

注意：请在 Vercel 控制台为 `goldcoast94.ccwu.cc` 或你使用的子域添加 Domain 并完成验证，以避免回源 Host 不匹配导致的错误页面。

---
## 4) 缓存策略（推荐规则）
1) 静态资源长期缓存（优先）
 - 匹配：`https://goldcoast94.ccwu.cc/_next/static/*`、`https://goldcoast94.ccwu.cc/static/*`、`https://goldcoast94.ccwu.cc/images/*`
 - 设置：Cache Level = Cache Everything；Edge Cache TTL = 31536000（1 year）；Browser Cache TTL = 31536000；Origin Cache Control = Ignore

2) 页面（HTML）短缓存
 - 匹配：`https://goldcoast94.ccwu.cc/*`
 - 设置：Cache Level = Cache Everything；Edge Cache TTL = 3600（1 hour）；Browser Cache TTL = 0（no-cache）；Origin Cache Control = Ignore

3) 动态/API 路径不缓存
 - 匹配：`https://goldcoast94.ccwu.cc/api/*`
 - 设置：Bypass Cache 或 Origin Cache Control = Respect

（提示）使用 Cloudflare Rulesets/Transform Rules 更灵活，Page Rules 可快速实现上述行为。

---
## 5) 性能 & 可选项
- HTTP/2 & HTTP/3：On
- Brotli：On
- Enable Argo：可选（付费，可改善跨境稳定性）
- Workers：如需更复杂的缓存或路由可用 Cloudflare Workers（进阶）

---
## 6) 验证与调试命令（在国内网络下执行）
检查页面头与缓存：
```bash
curl -I -L https://goldcoast94.ccwu.cc/
```
期望看到：`CF-Cache-Status: HIT|MISS`、`Age`、以及符合上面配置的 `cache-control`。

检查静态资源缓存：
```bash
curl -I https://goldcoast94.ccwu.cc/_next/static/chunks/<some-file>.js
```

性能总耗时检测：
```bash
curl -s -o /dev/null -w "time_total:%{time_total} time_connect:%{time_connect} time_starttransfer:%{time_starttransfer}\n" https://goldcoast94.ccwu.cc/
```

---
## 7) Cloudflare API：创建 Page Rule 示例
```bash
curl -X POST "https://api.cloudflare.com/client/v4/zones/{{ZONE_ID}}/pagerules" \
 -H "Authorization: Bearer {{CF_API_TOKEN}}" \
 -H "Content-Type: application/json" \
 --data '{
  "targets": [ { "target": "url", "constraint": { "operator": "matches", "value": "https://goldcoast94.ccwu.cc/*" } } ],
  "actions": [ { "id": "cache_level", "value": "cache_everything" }, { "id": "edge_cache_ttl", "value": 3600 }, { "id": "browser_cache_ttl", "value": 0 } ],
  "priority": 1
}'
```

---
## 8) 备案与临时策略
- 若域名尚未ICP备案，建议：
  1) 暂使用 `*.vercel.app` 子域（无需备案）作为临时访问入口；
  2) 将静态构建内容（`out/` 或 `public`）上传到阿里 OSS 并通过国内 CDN 加速静态资源；
  3) 同时推进 ICP 备案以便长期使用自有域名。

---
## 9) 我可以继续为你做的事
- 我可以把这个文件推送到了仓库（已完成）。
- 若你愿意，我可以基于你的 `CF_API_TOKEN` 与 `ZONE_ID` 自动运行上面的 API 命令来：创建 DNS 记录、创建 Page Rule 并验证缓存（我会给出安全提示并解释如何生成最小权限的 API Token）。

需要我现在帮你自动用 API 创建 DNS+规则吗？（需要你提供 `CF_API_TOKEN` 与 `ZONE_ID` 或让我指导如何生成）
