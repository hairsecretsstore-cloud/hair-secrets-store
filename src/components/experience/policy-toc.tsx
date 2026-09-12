"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

type Item = { id: string; title: string };

export function PolicyToc() {
  const [items, setItems] = useState<Item[]>([]);
  const [active, setActive] = useState<string>("");

  useEffect(() => {
    const nodes = Array.from(
      document.querySelectorAll<HTMLElement>("[data-policy-section]"),
    );
    setItems(
      nodes.map((n) => ({
        id: n.id,
        title: n.dataset.policyTitle ?? n.id,
      })),
    );
    if (nodes.length) setActive(nodes[0].id);

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActive(visible[0].target.id);
      },
      { rootMargin: "-20% 0px -70% 0px", threshold: 0 },
    );
    nodes.forEach((n) => observer.observe(n));
    return () => observer.disconnect();
  }, []);

  if (items.length === 0) return <div className="hidden lg:block" />;

  return (
    <aside className="hidden lg:block">
      <nav className="sticky top-28">
        <p className="mb-4 text-[10px] uppercase tracking-[0.28em] text-brand-600">
          On this page
        </p>
        <ul className="space-y-1 border-l border-brand-100">
          {items.map((it) => (
            <li key={it.id}>
              <a
                href={`#${it.id}`}
                className={cn(
                  "-ml-px block border-l-2 py-1.5 pl-4 text-sm transition-colors",
                  active === it.id
                    ? "border-brand-500 font-medium text-espresso"
                    : "border-transparent text-muted hover:text-espresso",
                )}
              >
                {it.title}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}
