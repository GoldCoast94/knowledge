# Cloudflare 中国（China Network）接入指南 — 回源到 Vercel

此文档针对将自有域名通过 Cloudflare（含中国网络服务）前置并回源到 Vercel 的可执行配置。假定你的 Vercel URL 为 `knowledge-yfm7.vercel.app`，自有域名例如 `example.com` 或 `japanese.example.com`。

注意事项
- Cloudflare 中国网络通常为企业级服务，需要开通相应产品；绑定自有域名并在大陆提供加速时通常需要完成 ICP 备案。若尚未备案，可参考文档中“未备案选项”。
- 本指南只生成控制台可直接使用的设置项；我不会代替你登录 Cloudflare 控制台。

一、准备工作

1. 确认域名并准备证书
   - 自有域名：`japanese.example.com`（将用于 CNAME）
   - 若域名已备案，继续；若未备案，请在后面阅读“未备案选项”。

2. 选择接入方式（推荐）
   - 推荐将域名接入 Cloudflare（将 Cloudflare 的 Nameserver 替换原有 Nameserver），使用 Cloudflare 做 DNS 与 CDN。
   - 如果无法改 NS，可使用 CNAME flatten（Cloudflare 支持根域 CNAME 转发）或按提供商指引用代管方式。

二、Cloudflare 控制台配置步骤（逐项填写）

1. 添加站点并验证域名（Cloudflare 仪表盘）
   - 在 Cloudflare 中添加站点，完成域名验证，替换 Nameserver（或选择 CNAME 代管方案）。

2. DNS 配置
   - 添加 `CNAME japanese` 指向 `knowledge-yfm7.vercel.app`，启用 Cloudflare Proxy（橙色云）。
   - 若需要根域（`example.com`）也加速，使用 Cloudflare 的 CNAME flatten 或把 `www` 指向 CNAME，再用 Page Rule 将根域重定向到 `www`。

3. SSL/TLS 设置
   - `SSL/TLS` -> `Overview`：选择 `Full (strict)`（若你使用 Vercel 自带证书或 Origin CA）。
   - 启用 `Always Use HTTPS` 与 `Automatic HTTPS Rewrites`。

4. 回源（Origin）设置
   - 回源域名（Origin Hostname）：`knowledge-yfm7.vercel.app`
   - 回源协议（Origin Protocol Policy）：`HTTPS`（或 `HTTPS Only`）
   - 主机头（Host Header）：设置为你自己的域名（例如 `japanese.example.com`），确保 Vercel 正确处理请求的 Host。Vercel 可通过绑定域名方式处理自定义 Host；若未绑定，可将 Host 留为 `knowledge-yfm7.vercel.app`。
   - 回源证书：使用 `Full (strict)` 时，Vercel 已提供有效证书；无需上传自签证书。

5. 缓存规则（推荐）
   - 在 `Rules` -> `Transform Rules` 或 `Cache` 中配置以下规则（UI 填写或使用 API）：
     1) 静态资源长期缓存（Edge & Browser）
        - 匹配：`/_next/static/*`、`/static/*`、`/images/*`
        - Cache Level：`Cache Everything`
        - Edge Cache TTL：`31536000`（1 year）
        - Browser Cache TTL：`31536000`（1 year）
        - Query String Handling：`Ignore Query String`（对静态资源启用）

     2) 页面（HTML）短缓存，由边缘缓存并较短回源验证
        - 匹配：`/*`（或仅页面路径）
        - Cache Level：`Cache Everything`
        - Edge Cache TTL：`3600`（1 hour）或根据你对内容新鲜度的需求调整
        - Browser Cache TTL：`0`（或 `no-cache`，保持浏览器每次向 CDN 校验）

     3) 动态/API 路径不缓存
        - 匹配：`/api/*`
        - 缓存：Bypass（不缓存）或设置 `Origin Cache Control: Respect` 并确保回源返回合适的头

6. 性能与协议
   - 启用 `HTTP/2` 和 `HTTP/3 (QUIC)`。
   - 启用 `Brotli` 与 `Gzip` 压缩。
   - 可视情况启用 `Argo Smart Routing`（付费），能显著改善跨境路由稳定性与时延，但需要额外费用。

7. 安全与防护
   - WAF：按需开启并放宽对静态资源的检查规则，避免误拦。
   - 设置速率限制（Rate Limiting）保护 API。

三、验证步骤（配置完成后执行）

1. DNS 生效后，从国内机器执行：
```bash
curl -I -L https://japanese.example.com/
```
检查响应头：
- `CF-Cache-Status`（应为 HIT）
- `Age`（缓存存在时间）
- `cache-control`（是否为你设置的值）
- `server` / `cf-ray` / `cf-cache-status`

2. 检查静态资源（示例）：
```bash
curl -I https://japanese.example.com/_next/static/chunks/xxxx.js
```
确保 `Cache-Control` 为长缓存，`CF-Cache-Status: HIT`。

四、关于 ICP（备案）与临时方案

- 如果你的域名已在工信部备案：使用自有域名直接接入 Cloudflare，过程简单。
- 若未备案：可选方案
  1) 使用 Cloudflare 提供的加速域名或二级域名（企业级合作），该方案通常由 Cloudflare 与本地合作伙伴处理，但可能附带额外成本与限制。
  2) 临时使用 `*.vercel.app` 子域（无需备案），但不能使用自定义域名显示为你的品牌域名。

五、回退与测试建议

- 初期只将 `www` 或子域（如 `japanese.example.com`）接入 Cloudflare，保留根域不变，验证无误后再切换根域。
- 在 Cloudflare 中启用 `Development Mode` 便于调试回源问题（会短时关闭缓存）。

六、我可为你做的代办项（我会生成并提交到仓库）
- 生成一份 `docs/cdn-cloudflare-china.md`（已创建）并推送（本文件）。
- 生成你在 Cloudflare 控制台需要填入的“字段清单”和检查脚本（我可继续生成并提交）。

七、验证命令（示例）
```bash
# 检查页面头
curl -I -L https://japanese.example.com/

# 检查静态资源缓存
curl -I https://japanese.example.com/_next/static/chunks/xxxxx.js

# 查看完整请求耗时
curl -s -o /dev/null -w "time_total:%{time_total} time_connect:%{time_connect} time_starttransfer:%{time_starttransfer}\n" https://japanese.example.com/
```

如需我继续，我可以：
- 基于你的自有域名生成一份“控制台填写项清单”（包括回源 Host Header、TTL、Page Rule 内容）并提交到仓库；
- 或者按你的授权生成 Cloudflare API 调用脚本供你运行（需要提供 `CF_API_TOKEN` 与 `ZONE_ID`）。

请告诉我：
- 你希望我直接生成并提交“控制台填写项清单”吗？（是/否）