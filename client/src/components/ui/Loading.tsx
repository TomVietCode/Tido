export default function Loading({
  message = "Đang tải...",
}: {
  message?: string;
}) {
  return (
    <div className="flex min-h-[400px] w-full items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-slate-200 border-t-primary"></div>
        <p className="text-sm font-medium text-slate-600">{message}</p>
      </div>
    </div>
  );
}
