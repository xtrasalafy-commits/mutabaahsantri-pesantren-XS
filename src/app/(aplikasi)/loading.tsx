export default function Loading() {
  return <div className="animate-pulse space-y-5"><div className="h-4 w-32 rounded bg-emerald-100"/><div className="h-10 w-72 rounded bg-slate-200"/><div className="grid gap-4 sm:grid-cols-4">{Array.from({ length: 4 }).map((_, index) => <div className="h-32 rounded-2xl bg-white" key={index}/>)}</div><div className="h-72 rounded-2xl bg-white"/></div>;
}
