"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  User,
  Wrench,
  FolderOpen,
  MessageCircle,
  PenLine,
  Download,
  Mail,
  Github,
  Linkedin,
  Home,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface CommandItem {
  id: string;
  label: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  group: "navigate" | "action";
  action: () => void;
}

interface CommandPaletteProps {
  open: boolean;
  onClose: () => void;
  scrollToSection: (id: string) => void;
}

const GROUPS: { id: "navigate" | "action"; label: string }[] = [
  { id: "navigate", label: "Navigate" },
  { id: "action", label: "Quick Actions" },
];

export function CommandPalette({
  open,
  onClose,
  scrollToSection,
}: CommandPaletteProps) {
  const [query, setQuery] = useState("");
  const [selectedIdx, setSelectedIdx] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const buildItems = useCallback(
    (): CommandItem[] => [
      {
        id: "home",
        label: "Home",
        description: "Back to the top",
        icon: Home,
        group: "navigate",
        action: () => {
          window.scrollTo({ top: 0, behavior: "smooth" });
          onClose();
        },
      },
      {
        id: "about",
        label: "About",
        description: "Education & work experience",
        icon: User,
        group: "navigate",
        action: () => {
          scrollToSection("about");
          onClose();
        },
      },
      {
        id: "skills",
        label: "Skills",
        description: "Technologies & tools",
        icon: Wrench,
        group: "navigate",
        action: () => {
          scrollToSection("skills");
          onClose();
        },
      },
      {
        id: "projects",
        label: "Projects",
        description: "Selected works & case studies",
        icon: FolderOpen,
        group: "navigate",
        action: () => {
          scrollToSection("projects");
          onClose();
        },
      },
      {
        id: "writing",
        label: "Writing",
        description: "Articles on Medium",
        icon: PenLine,
        group: "navigate",
        action: () => {
          scrollToSection("writing");
          onClose();
        },
      },
      {
        id: "contact",
        label: "Contact",
        description: "Get in touch",
        icon: MessageCircle,
        group: "navigate",
        action: () => {
          scrollToSection("contact");
          onClose();
        },
      },
      {
        id: "cv",
        label: "Download CV",
        description: "Get my latest resume (PDF)",
        icon: Download,
        group: "action",
        action: () => {
          window.open(
            "/Isna Nur Amalia - CV.pdf",
            "_blank",
            "noopener,noreferrer",
          );
          onClose();
        },
      },
      {
        id: "email",
        label: "Send Email",
        description: "isnanuramalia13@gmail.com",
        icon: Mail,
        group: "action",
        action: () => {
          window.open(
            "mailto:isnanuramalia13@gmail.com?subject=Hello from your portfolio!",
          );
          onClose();
        },
      },
      {
        id: "github",
        label: "GitHub",
        description: "github.com/isnanramalia",
        icon: Github,
        group: "action",
        action: () => {
          window.open("https://github.com/isnanramalia", "_blank");
          onClose();
        },
      },
      {
        id: "linkedin",
        label: "LinkedIn",
        description: "linkedin.com/in/isnanramalia",
        icon: Linkedin,
        group: "action",
        action: () => {
          window.open("https://linkedin.com/in/isnanramalia", "_blank");
          onClose();
        },
      },
    ],
    [onClose, scrollToSection],
  );

  const allItems = buildItems();

  const filtered =
    query.trim() === ""
      ? allItems
      : allItems.filter(
          (item) =>
            item.label.toLowerCase().includes(query.toLowerCase()) ||
            item.description.toLowerCase().includes(query.toLowerCase()),
        );

  const grouped = GROUPS.map((g) => ({
    ...g,
    items: filtered.filter((item) => item.group === g.id),
  })).filter((g) => g.items.length > 0);

  const flatItems = grouped.flatMap((g) => g.items);

  useEffect(() => {
    if (open) {
      setQuery("");
      setSelectedIdx(0);
      requestAnimationFrame(() => inputRef.current?.focus());
    }
  }, [open]);

  useEffect(() => {
    setSelectedIdx(0);
  }, [query]);

  useEffect(() => {
    const el = listRef.current?.querySelector<HTMLElement>(
      `[data-idx="${selectedIdx}"]`,
    );
    el?.scrollIntoView({ block: "nearest" });
  }, [selectedIdx]);

  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      switch (e.key) {
        case "ArrowDown":
          e.preventDefault();
          setSelectedIdx((s) => Math.min(s + 1, flatItems.length - 1));
          break;
        case "ArrowUp":
          e.preventDefault();
          setSelectedIdx((s) => Math.max(s - 1, 0));
          break;
        case "Enter":
          e.preventDefault();
          flatItems[selectedIdx]?.action();
          break;
        case "Escape":
          e.preventDefault();
          onClose();
          break;
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, flatItems, selectedIdx, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* ── Backdrop ── */}
          <motion.div
            key="cmd-backdrop"
            className="fixed inset-0 z-[100] bg-black/40 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            onClick={onClose}
          />

          {/* ── Panel ── */}
          <div className="fixed inset-0 z-[101] flex items-start justify-center pt-[14vh] px-4 pointer-events-none">
            <motion.div
              key="cmd-panel"
              className="w-full max-w-lg bg-background border-2 border-border pointer-events-auto overflow-hidden relative"
              style={{
                /* Organic doodle border-radius — same family as glass-card */
                borderRadius: "22px 6px 20px 6px / 6px 20px 6px 22px",
                boxShadow:
                  "5px 5px 0 rgb(var(--foreground) / 0.05), 0 24px 60px rgba(0,0,0,0.22)",
              }}
              initial={{ opacity: 0, scale: 0.96, y: -16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: -16 }}
              transition={{ type: "spring", stiffness: 420, damping: 32 }}
            >
              {/* ── Tape decoration (like sticky note / project dialog) ── */}
              <div
                className="absolute top-0 left-1/2 -translate-x-1/2 w-14 h-4 z-10 pointer-events-none"
                style={{
                  background: "rgba(255,255,255,0.45)",
                  borderRadius: "0 0 4px 4px",
                  boxShadow: "0 2px 4px rgba(0,0,0,0.07)",
                }}
                aria-hidden="true"
              />

              {/* ── Search bar ── */}
              <div className="flex items-center gap-3 px-4 h-14 border-b border-border relative z-0">
                <Search className="w-4 h-4 text-muted-foreground shrink-0" />
                <input
                  ref={inputRef}
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search commands…"
                  className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground placeholder:font-handwritten outline-none font-handwritten"
                  style={{ outline: "none", border: "none", boxShadow: "none" }}
                  autoComplete="off"
                  spellCheck={false}
                />
                <button
                  onClick={onClose}
                  className="p-1.5 text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors"
                  style={{ borderRadius: "6px 14px 6px 14px" }}
                  aria-label="Close"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* ── Results list ── */}
              <div
                ref={listRef}
                className="max-h-[340px] overflow-y-auto overscroll-contain py-2"
              >
                {grouped.length === 0 ? (
                  <div className="py-12 text-center">
                    <div className="text-3xl mb-3">🔍</div>
                    <p className="text-sm text-muted-foreground font-handwritten">
                      Nothing found for{" "}
                      <span className="text-foreground font-bold">
                        &ldquo;{query}&rdquo;
                      </span>
                    </p>
                  </div>
                ) : (
                  grouped.map((group) => (
                    <div key={group.id}>
                      {/* Group label — handwritten label style */}
                      <p className="px-4 pt-3 pb-1.5 text-[11px] font-handwritten font-bold text-primary/60 select-none flex items-center gap-1.5">
                        <span className="opacity-60">✦</span>
                        {group.label}
                      </p>

                      {group.items.map((item) => {
                        const flatIdx = flatItems.indexOf(item);
                        const isSelected = flatIdx === selectedIdx;

                        return (
                          <motion.button
                            key={item.id}
                            data-idx={flatIdx}
                            onClick={item.action}
                            onMouseEnter={() => setSelectedIdx(flatIdx)}
                            className={cn(
                              "flex items-center gap-3 px-3 py-2.5 text-left transition-colors duration-100",
                              "focus:outline-none",
                              isSelected
                                ? "bg-primary/8 dark:bg-primary/12"
                                : "hover:bg-accent/50",
                            )}
                            style={{
                              /* Organic shape on the selected row */
                              borderRadius: isSelected
                                ? "12px 4px 12px 4px / 4px 12px 4px 12px"
                                : "8px 3px 8px 3px / 3px 8px 3px 8px",
                              /* mx-2 equivalent via left offset */
                              marginLeft: "8px",
                              marginRight: "8px",
                              width: "calc(100% - 16px)",
                            }}
                          >
                            {/* Icon box — organic shape */}
                            <div
                              className={cn(
                                "w-8 h-8 flex items-center justify-center shrink-0 transition-colors duration-100",
                                isSelected
                                  ? "bg-primary text-primary-foreground"
                                  : "bg-muted text-muted-foreground",
                              )}
                              style={{
                                borderRadius:
                                  "8px 3px 8px 3px / 3px 8px 3px 8px",
                              }}
                            >
                              <item.icon className="w-4 h-4" />
                            </div>

                            {/* Label + description */}
                            <div className="min-w-0 flex-1">
                              <p className="text-sm font-medium text-foreground leading-tight font-handwritten">
                                {item.label}
                              </p>
                              <p className="text-xs text-muted-foreground truncate leading-tight mt-0.5">
                                {item.description}
                              </p>
                            </div>

                            {/* Enter hint */}
                            <AnimatePresence>
                              {isSelected && (
                                <motion.kbd
                                  initial={{ opacity: 0, scale: 0.8 }}
                                  animate={{ opacity: 1, scale: 1 }}
                                  exit={{ opacity: 0, scale: 0.8 }}
                                  transition={{ duration: 0.1 }}
                                  className="shrink-0 px-1.5 py-0.5 text-[10px] font-mono border border-border text-muted-foreground bg-muted/60 select-none"
                                  style={{
                                    borderRadius:
                                      "3px 7px 3px 7px / 7px 3px 7px 3px",
                                  }}
                                >
                                  ↵
                                </motion.kbd>
                              )}
                            </AnimatePresence>
                          </motion.button>
                        );
                      })}
                    </div>
                  ))
                )}
              </div>

              {/* ── Footer ── */}
              <div className="px-4 py-2.5 border-t border-border flex items-center gap-4">
                {(
                  [
                    { keys: "↑↓", label: "navigate" },
                    { keys: "↵", label: "select" },
                    { keys: "esc", label: "close" },
                  ] as const
                ).map(({ keys, label }) => (
                  <span
                    key={label}
                    className="flex items-center gap-1.5 text-[10px] text-muted-foreground select-none font-handwritten"
                  >
                    <kbd
                      className="px-1.5 py-0.5 border border-border bg-muted/60 font-mono text-[9px]"
                      style={{
                        borderRadius: "3px 6px 3px 6px / 6px 3px 6px 3px",
                      }}
                    >
                      {keys}
                    </kbd>
                    {label}
                  </span>
                ))}
                <span className="ml-auto text-[10px] text-muted-foreground/50 select-none font-handwritten">
                  ⌘K
                </span>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
