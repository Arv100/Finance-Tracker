"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  BarChart3,
  CreditCard,
  DollarSign,
  Home,
  PieChart,
  Settings,
  Wallet,
} from "lucide-react";

interface SidebarProps {
  onNavigate?: () => void;
}

interface SidebarNavItem {
  title: string;
  href: string;
  icon: React.ReactNode;
}

export function DashboardSidebar({ onNavigate }: SidebarProps) {
  const pathname = usePathname();

  const navItems: SidebarNavItem[] = [
    {
      title: "Overview",
      href: "/dashboard",
      icon: <Home className="h-5 w-5" />,
    },
    // {
    //   title: "Transactions",
    //   href: "/dashboard/transactions",
    //   icon: <CreditCard className="h-5 w-5" />,
    // },
    // {
    //   title: "Income",
    //   href: "/dashboard/income",
    //   icon: <DollarSign className="h-5 w-5" />,
    // },
    // {
    //   title: "Expenses",
    //   href: "/dashboard/expenses",
    //   icon: <Wallet className="h-5 w-5" />,
    // },
    // {
    //   title: "Reports",
    //   href: "/dashboard/reports",
    //   icon: <BarChart3 className="h-5 w-5" />,
    // },
    // {
    //   title: "Budget",
    //   href: "/dashboard/budget",
    //   icon: <PieChart className="h-5 w-5" />,
    // },
    // {
    //   title: "Settings",
    //   href: "/dashboard/settings",
    //   icon: <Settings className="h-5 w-5" />,
    // },
  ];

  return (
    <aside className="bg-background h-screen border-r border-border">
      <div className="flex h-full flex-col px-3 py-4">
        <div className="px-3 py-2">
          <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">
            Dashboard
          </h2>
          <div className="space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={onNavigate}
                className={cn(
                  "flex items-center rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground transition-colors",
                  pathname === item.href
                    ? "bg-accent text-accent-foreground"
                    : "transparent"
                )}
              >
                {item.icon}
                <span className="ml-3">{item.title}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </aside>
  );
}
