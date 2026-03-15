# Supabase 数据同步配置指南

## 概述

本指南将帮助你将项目从 localStorage 迁移到 Supabase，实现多设备数据同步。

## 第一步：创建 Supabase 项目

1. 访问 [supabase.com](https://supabase.com) 并注册账号
2. 点击 "New Project" 创建新项目
3. 填写项目信息：
   - 项目名称：例如 "选品系统"
   - 数据库密码：设置一个安全的密码
   - 区域：选择离你最近的区域
4. 点击 "Create new project" 等待项目创建完成（可能需要几分钟）

## 第二步：获取项目配置

1. 在项目仪表板左侧菜单，点击 "Settings" → "API"
2. 复制以下信息：
   - **Project URL**（例如：`https://xxxxx.supabase.co`）
   - **anon public**（API Key）
3. 打开 `supabase.js` 文件，替换前两行的配置：

```javascript
const SUPABASE_URL = '你的Project URL';
const SUPABASE_ANON_KEY = '你的anon public Key';
```

## 第三步：创建数据库表

1. 在 Supabase 项目左侧菜单，点击 "SQL Editor"
2. 点击 "New Query"
3. 复制 `supabase-schema.sql` 文件的全部内容
4. 粘贴到 SQL Editor 中
5. 点击 "Run" 执行 SQL 脚本
6. 看到 "Success" 提示表示表创建成功

## 第四步：在页面中引入 Supabase

在所有需要使用 Supabase 的 HTML 页面中（index.html、列表清单.html、后台管理.html），在 `</head>` 标签前添加以下代码：

```html
<script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
<script src="supabase.js"></script>
```

## 第五步：迁移现有数据（可选）

如果你在 localStorage 中已有数据，可以按以下步骤迁移：

1. 在浏览器中打开项目页面
2. 打开浏览器开发者工具（F12）
3. 切换到 Console（控制台）标签
4. 运行以下命令：

```javascript
migrateFromLocalStorage();
```

## 第六步：修改页面代码

### 重要提示

由于代码修改较为复杂，建议使用双模式：
- 优先使用 Supabase
- Supabase 不可用时降级到 localStorage

### 修改要点

1. **数据读取**：从 `getOwnerProducts()` 或 `getAllProducts()` 获取数据
2. **数据保存**：使用 `saveProducts()` 保存数据
3. **业主凭证**：使用 `getOwnerCredentials()`、`addOwnerCredential()`、`deleteOwnerCredential()`
4. **日志**：使用 `getAdminLogs()`、`addAdminLog()`、`clearAdminLogs()`

## 常见问题

### Q: Supabase 免费吗？
A: 是的，Supabase 提供免费套餐，对于小项目完全够用。

### Q: 数据安全吗？
A: Supabase 使用 PostgreSQL 数据库，数据加密存储。你可以通过 RLS（行级安全性）进一步限制访问。

### Q: 可以同时使用 localStorage 和 Supabase 吗？
A: 可以！建议实现降级策略：优先使用 Supabase，失败时使用 localStorage 作为备份。

### Q: 如何查看数据库中的数据？
A: 在 Supabase 项目中，点击左侧菜单 "Table Editor"，可以直接查看和编辑数据。

### Q: 数据能实时同步吗？
A: 可以！Supabase 支持实时订阅功能，可以监听数据变化并自动更新。

## 下一步

完成配置后，你可以：
1. 测试多设备数据同步
2. 配置更严格的 RLS 策略
3. 添加实时更新功能
4. 使用 Supabase Auth 替代当前的认证方式

## 技术支持

如有问题，请查看：
- [Supabase 官方文档](https://supabase.com/docs)
- [Supabase JavaScript 库](https://supabase.com/docs/reference/javascript/introduction)
