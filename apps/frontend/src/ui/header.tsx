"use client";

import { useState } from "react";
import { Menu, Truck, Wifi, Shield, Settings } from "lucide-react";
import { Button } from "@/ui/button";

export function ChatHeader() {
  const [isOnline] = useState(true);

  return (
    <header className="flex items-center justify-between border-b border-border/50 bg-card/50 px-4 py-3 backdrop-blur-sm font-mono">
      <div className="flex items-center gap-3">
        {/* Menu */}
        <Button variant="ghost" size="icon">
          <Menu className="h-5 w-5" />
          <span className="sr-only">Open menu</span>
        </Button>

        {/* Logo & Title */}
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 border border-primary/30">
              <Truck className="h-5 w-5 text-primary" />
            </div>
            <span className="absolute -bottom-0.5 -right-0.5 flex h-3 w-3">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
              <span className="relative inline-flex h-3 w-3 rounded-full bg-primary" />
            </span>
          </div>
          <div>
            <h1 className="text-lg font-bold tracking-wide text-foreground">
              Flowdock
            </h1>
            <p className="text-xs text-muted-foreground">
              Where shipments become systems
            </p>
          </div>
        </div>
      </div>

      {/* Status Indicators */}
      <div className="flex items-center">
        <div className="hidden sm:flex items-center gap-4 mr-4">
          <StatusIndicator icon={Wifi} label="NETWORK" active={isOnline} />
          <StatusIndicator icon={Shield} label="SECURE" active />
        </div>

        <Button
          variant="ghost"
          size="icon"
          className="text-muted-foreground hover:text-foreground"
        >
          <Settings className="h-5 w-5" />
          <span className="sr-only">Settings</span>
        </Button>
      </div>
    </header>
  );
}

function StatusIndicator({
  icon: Icon,
  label,
  active,
}: {
  icon: typeof Wifi;
  label: string;
  active: boolean;
}) {
  return (
    <div className="flex items-center gap-1.5">
      <Icon
        className={`h-3.5 w-3.5 ${
          active ? "text-primary" : "text-muted-foreground"
        }`}
      />
      <span className="text-[10px] text-muted-foreground uppercase tracking-wider">
        {label}
      </span>
    </div>
  );
}
