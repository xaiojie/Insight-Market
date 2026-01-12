export default function AdminPage() {
  return (
    <div className="space-y-2">
      <h1 className="text-2xl font-semibold">后台首页</h1>
      <p className="text-slate-400 text-sm">请使用管理员账号登录后访问下列功能。</p>
      <ul className="list-disc pl-5 text-sm text-slate-300">
        <li>/admin/markets 市场管理</li>
        <li>/admin/markets/new 创建市场</li>
        <li>/admin/resolve 裁决管理</li>
        <li>/admin/users 用户管理</li>
        <li>/admin/disputes 争议管理</li>
      </ul>
    </div>
  );
}
