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
          const a = document.createElement("a");
          a.href = "/IsnaNurAmalia_CV.pdf";
          a.download = "CV-Isna-Nur-Amalia.pdf";
          a.click();
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
          {/* Backdrop */}
          <motion.div
            key="cmd-backdrop"
            className="fixed inset-0 z-[100] bg-black/40 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            onClick={onClose}
          />

          {/* Palette */}
          <div className="fixed inset-0 z-[101] flex items-start justify-center pt-[14vh] px-4 pointer-events-none">
            <motion.div
              key="cmd-panel"
              className="w-full max-w-lg bg-background border border-border rounded-2xl shadow-2xl overflow-hidden pointer-events-auto"
              initial={{ opacity: 0, scale: 0.96, y: -16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: -16 }}
              transition={{ type: "spring", stiffness: 420, damping: 32 }}
            >
              {/* Search bar */}
              <div className="flex items-center gap-3 px-4 h-14 border-b border-border">
                <Search className="w-4 h-4 text-muted-foreground shrink-0" />
                <input
                  ref={inputRef}
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search commands…"
                  className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none"
                  style={{ outline: "none", border: "none", boxShadow: "none" }}
                  autoComplete="off"
                  spellCheck={false}
                />
                <button
                  onClick={onClose}
                  className="p-1 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors"
                  aria-label="Close"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Results */}
              <div
                ref={listRef}
                className="max-h-[340px] overflow-y-auto overscroll-contain py-2"
              >
                {grouped.length === 0 ? (
                  <div className="py-12 text-center">
                    <p className="text-sm text-muted-foreground">
                      No results for{" "}
                      <span className="text-foreground font-medium">
                        &ldquo;{query}&rdquo;
                      </span>
                    </p>
                  </div>
                ) : (
                  grouped.map((group) => (
                    <div key={group.id}>
                      {/* Group label */}
                      <p className="px-4 pt-3 pb-1.5 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/70 select-none">
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
                              "w-full flex items-center gap-3 px-3 mx-1 py-2.5 rounded-xl text-left transition-colors duration-75",
                              "focus:outline-none",
                              isSelected ? "bg-accent" : "hover:bg-accent/50",
                            )}
                            style={{ width: "calc(100% - 8px)" }}
                          >
                            {/* Icon */}
                            <div
                              className={cn(
                                "w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-colors duration-100",
                                isSelected
                                  ? "bg-primary text-primary-foreground"
                                  : "bg-muted text-muted-foreground",
                              )}
                            >
                              <item.icon className="w-4 h-4" />
                            </div>

                            {/* Label + description */}
                            <div className="min-w-0 flex-1">
                              <p className="text-sm font-medium text-foreground leading-tight">
                                {item.label}
                              </p>
                              <p className="text-xs text-muted-foreground truncate leading-tight mt-0.5">
                                {item.description}
                              </p>
                            </div>

                            {/* Enter hint when selected */}
                            <AnimatePresence>
                              {isSelected && (
                                <motion.kbd
                                  initial={{ opacity: 0, scale: 0.8 }}
                                  animate={{ opacity: 1, scale: 1 }}
                                  exit={{ opacity: 0, scale: 0.8 }}
                                  transition={{ duration: 0.1 }}
                                  className="shrink-0 px-1.5 py-0.5 text-[10px] font-mono rounded border border-border text-muted-foreground bg-muted/60 select-none"
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

              {/* Footer */}
              <div className="px-4 py-2.5 border-t border-border flex items-center gap-4">
                <span className="flex items-center gap-1.5 text-[10px] text-muted-foreground select-none">
                  <kbd className="px-1.5 py-0.5 rounded border border-border bg-muted/60 font-mono text-[9px]">
                    ↑↓
                  </kbd>
                  navigate
                </span>
                <span className="flex items-center gap-1.5 text-[10px] text-muted-foreground select-none">
                  <kbd className="px-1.5 py-0.5 rounded border border-border bg-muted/60 font-mono text-[9px]">
                    ↵
                  </kbd>
                  select
                </span>
                <span className="flex items-center gap-1.5 text-[10px] text-muted-foreground select-none">
                  <kbd className="px-1.5 py-0.5 rounded border border-border bg-muted/60 font-mono text-[9px]">
                    esc
                  </kbd>
                  close
                </span>
                <span className="ml-auto text-[10px] text-muted-foreground/50 select-none">
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
