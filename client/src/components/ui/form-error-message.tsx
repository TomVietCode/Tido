export default function FormErrorMessage({ error }: { error: any }) {
  return (
    <div className="min-h-4 px-1">
      {error && (
        <p className="text-xs text-destructive animate-in fade-in slide-in-from-top-1">
          {error.message}
        </p>
      )}
  </div>
  )
}