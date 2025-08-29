export default function AdminLayout({ children }: { children: React.ReactNode }) {
  if (process.env.NEXT_PUBLIC_ENABLE_ADMIN !== "true") {
    return (
      <div className="p-10 text-center text-gray-600">
        <div className="mx-auto max-w-md rounded-2xl border bg-white p-8 shadow-sm">
          <h2 className="mb-2 text-lg font-semibold">Admin disabled</h2>
          <p className="text-sm text-gray-500">
            Set <code className="rounded bg-gray-100 px-1 py-0.5">NEXT_PUBLIC_ENABLE_ADMIN=true</code> in
            <span className="font-mono"> .env.local</span> to enable the dashboard.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container max-w-6xl py-8">
      {children}
    </div>
  );
}
