import type { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  Icon: LucideIcon;
  color: string;
}

export default function StatCard({
  title,
  value,
  Icon,
  color,
}: StatCardProps) {
  return (
    <div className="rounded-xl border bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <p className="text-sm text-slate-500">{title}</p>
        <Icon className={color} size={22} />
      </div>

      <h2 className="mt-4 text-3xl font-bold">{value}</h2>
    </div>
  );
}