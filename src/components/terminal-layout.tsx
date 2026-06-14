'use client';

import { useEffect, useState } from "react";
import PromptHeader from "./prompt-header";
import StatusBar from "./status-bar";
import CommandPalette from "./command-palette";
import type { Palette, Theme } from "@/lib/types";
import { getPalette } from "@/lib/palette";

const CRON_MESSAGES = [
  "[CRON] backup completed",
  "[WATCH] skills.json changed",
  "[SYS] memory usage: 42%",
  "[NET] connection stable",
  "[CRON] index rebuilt",
  "[SYS] uptime check passed",
  "[WATCH] services.json synced",
];

export default function TerminalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [palette, setPalette] = useState<Palette>("dawn");
  const [theme, setTheme] = useState<Theme>("terminal");
  const [uptime, setUptime] = useState("");
  const [cronLog, setCronLog] = useState("");
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [processJitter, setProcessJitter] = useState(false);

  useEffect(() => {
    const initialPalette = getPalette(new Date().getHours());
    const html = document.documentElement;
    const currentTheme = (html.getAttribute("data-theme") as Theme) ?? "terminal";
    setPalette(initialPalette);
    setTheme(currentTheme);
    html.setAttribute("data-palette", initialPalette);
  }, []);

  const setPaletteWithCookie = (p: Palette) => {
    setPalette(p);
    document.documentElement.setAttribute("data-palette", p);
    document.cookie = `palette=${p};path=/;max-age=3600`;
  };

  const toggleTheme = () => {
    const next: Theme = theme === "terminal" ? "retrowave" : "terminal";
    setTheme(next);
    document.documentElement.setAttribute("data-theme", next);
    document.cookie = `theme=${next};path=/;max-age=3600`;
  };

  useEffect(() => {
    const interval = setInterval(() => {
      const hour = new Date().getHours();
      const p = getPalette(hour);
      setPaletteWithCookie(p);
    }, 60_000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const start = new Date("2016-08-01");
    const tick = () => {
      const diff = Date.now() - start.getTime();
      const days = Math.floor(diff / 86_400_000);
      const hours = Math.floor((diff % 86_400_000) / 3_600_000);
      const mins = Math.floor((diff % 3_600_000) / 60_000);
      const years = Math.floor(days / 365);
      const remDays = days % 365;
      const months = Math.floor(remDays / 30);
      const finalDays = remDays % 30;
      setUptime(`${years}y ${months}m ${finalDays}d ${hours}h ${mins}m`);
    };
    tick();
    const timer = setInterval(tick, 60_000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const cron = setInterval(() => {
      const msg = CRON_MESSAGES[Math.floor(Math.random() * CRON_MESSAGES.length)];
      setCronLog(msg);
    }, 30_000);
    return () => clearInterval(cron);
  }, []);

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour >= 0 && hour < 6) {
      setProcessJitter(true);
      const shuffle = setInterval(() => {
        setProcessJitter((prev) => !prev);
      }, 5_000);
      return () => clearInterval(shuffle);
    }
  }, []);

  const handleCmdK = () => setPaletteOpen((prev) => !prev);

  return (
    <div className="flex flex-col min-h-screen">
      <CommandPalette
        open={paletteOpen}
        onClose={() => setPaletteOpen(false)}
        theme={theme}
        onToggleTheme={toggleTheme}
        email="tiwari.nitesh294@gmail.com"
      />
      <PromptHeader palette={palette} theme={theme} onCmdK={handleCmdK} />
      <main className="flex-1 p-4 md:p-6 lg:p-8 max-w-5xl mx-auto w-full">
        {children}
      </main>
      <StatusBar uptime={uptime} cronLog={cronLog} palette={palette} theme={theme} processJitter={processJitter} />
      <div className="scanline" aria-hidden="true" />
    </div>
  );
}
