import { useEffect, useState } from "react";
import { api } from "../../lib/api";

import { Bell, Menu } from "lucide-react";

import { PAGE_TITLES } from "../../constants/pageTitles";

import type { Page } from "../../types";

interface HeaderProps {
  page: Page;
  onMenuClick: () => void;
}

export function Header({ page, onMenuClick }: HeaderProps) {
  const [showNotif, setShowNotif] = useState(false);

  const [notifications, setNotifications] = useState<any[]>([]);

  const loadNotifications = async () => {
    try {
      const res = await api.get("/products-expiring");

      setNotifications(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    loadNotifications();
  }, []);

  return (
    <header className="h-16 bg-white border-b border-gray-100 flex items-center px-4 lg:px-6 gap-4 flex-shrink-0 z-10">
      <button
        onClick={onMenuClick}
        className="lg:hidden p-2 rounded-xl hover:bg-gray-100 text-gray-500 transition-colors"
      >
        <Menu className="w-5 h-5" />
      </button>

      <div className="flex-1 min-w-0">
        <h1 className="text-lg font-bold text-gray-900 truncate">
          {PAGE_TITLES[page]}
        </h1>
      </div>

      <div className="relative">
        <button
          onClick={() => setShowNotif(!showNotif)}
          className="relative p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-xl transition-colors"
        >
          <Bell className="w-5 h-5" />

          {notifications.length > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] rounded-full w-5 h-5 flex items-center justify-center">
              {notifications.length}
            </span>
          )}
        </button>

        {showNotif && (
          <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-xl border border-gray-100 z-50 overflow-hidden">
            <div className="p-4 border-b">
              <h3 className="font-bold text-gray-900">Notifikasi Kadaluarsa</h3>
            </div>

            <div className="max-h-80 overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="p-4 text-center text-gray-500">
                  Tidak ada notifikasi
                </div>
              ) : (
                notifications.map((product: any) => (
                  <div
                    key={product.id}
                    className="p-4 border-b hover:bg-gray-50"
                  >
                    <p className="font-semibold text-gray-900">
                      {product.name}
                    </p>

                    <p className="text-sm text-red-500">
                      Kadaluarsa: {product.expiry}
                    </p>

                    <p className="text-xs text-gray-400 mt-1">
                      SKU: {product.sku}
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}

