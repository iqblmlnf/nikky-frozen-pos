// src/components/layout/Sidebar.tsx

import { LogOut } from "lucide-react";

import { cn } from "../../lib/cn";
import { Avatar, Logo } from "../ui";
import { NAV_ITEMS } from "../../constants/navigation";
import type { Page, Role } from "../../types";

interface SidebarProps {
  currentPage: Page;
  onNavigate: (page: Page) => void;
  role: Role;
  isOpen: boolean;
  onClose: () => void;
  currentUser: {
    name: string;
    email: string;
    initials: string;
    role: string;
  };
}

export function Sidebar({
  currentPage,
  onNavigate,
  role,
  isOpen,
  onClose,
  currentUser,
}: SidebarProps) {
  const handleLogout = () => {
    sessionStorage.removeItem("user");
    window.location.reload();
  };

  const visibleItems = NAV_ITEMS.filter((item) => item.roles.includes(role));

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-20 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={cn(
          "fixed top-0 left-0 h-full w-60 bg-white border-r border-gray-100 flex flex-col z-30 transition-transform duration-300 shadow-xl shadow-blue-900/5",
          "lg:translate-x-0 lg:static lg:z-auto lg:shadow-none",
          isOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        {/* Logo */}
        <div className="p-5 border-b border-gray-100">
          <Logo size="sm" />
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto">
          {visibleItems.map((item) => {
            const active = currentPage === item.id;

            // Lucide Icon Component
            const Icon = item.icon;

            return (
              <button
                key={item.id}
                onClick={() => {
                  onNavigate(item.id);
                  onClose();
                }}
                className={cn(
                  "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all text-left transform duration-200 hover:scale-[1.02] active:scale-[0.98]",
                  active
                    ? "bg-blue-600 text-white shadow-sm shadow-blue-300/50"
                    : "text-gray-600 hover:bg-blue-50 hover:text-blue-700",
                )}
              >
                <span
                  className={cn(
                    "flex-shrink-0",
                    active ? "text-white" : "text-gray-400",
                  )}
                >
                  <Icon className="w-4 h-4" />
                </span>

                <span className="flex-1">{item.label}</span>

                {item.badge && (
                  <span
                    className={cn(
                      "text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center",
                      active
                        ? "bg-white/25 text-white"
                        : "bg-red-500 text-white",
                    )}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* User Profile */}
        <div className="p-3 border-t border-gray-100">
          <div className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors group">
            <Avatar initials={currentUser.initials} size="sm" />

            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-900 truncate">
                {currentUser.name}
              </p>

              <p className="text-xs text-gray-400 truncate capitalize">
                {currentUser.role.replace("_", " ")}
              </p>
            </div>

            <button
              onClick={handleLogout}
              title="Logout"
              className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
            >
              <LogOut className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
