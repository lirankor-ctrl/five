"use client";

import { cn } from "@/lib/cn";
import type { Role } from "@/lib/organizations/types";

type Props = {
  role: Role;
  memberName: string;
  onChange: (next: Role) => void;
};

const ROLES: Array<{ id: Role; label: string; hint: string }> = [
  { id: "admin", label: "Admin", hint: "Org-wide view" },
  { id: "manager", label: "Manager", hint: "Team view" },
  { id: "employee", label: "Employee", hint: "Your actions" },
];

/**
 * A small role picker. Switching role re-frames the console without
 * touching the data model — this is a demo affordance, not a permission
 * boundary. The real auth boundary lives at the future server layer.
 */
export function RoleSwitcher({ role, memberName, onChange }: Props) {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <div className="rounded-full border border-line bg-surface p-1">
        {ROLES.map((r) => {
          const active = r.id === role;
          return (
            <button
              key={r.id}
              type="button"
              onClick={() => onChange(r.id)}
              className={cn(
                "inline-flex h-8 items-center rounded-full px-3 text-[12px] font-light transition-colors",
                active
                  ? "bg-ink text-paper"
                  : "text-ink-soft hover:text-ink",
              )}
            >
              {r.label}
            </button>
          );
        })}
      </div>
      <p className="text-[12px] font-light uppercase tracking-[0.22em] text-ink-mute">
        you · {memberName}
      </p>
    </div>
  );
}
