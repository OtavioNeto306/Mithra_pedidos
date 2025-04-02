import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, ChevronLeft, ChevronRight, Home, Settings, LogOut, ShoppingCart, Shield } from 'lucide-react';
import { cn } from "@/lib/utils";
import { useAuth } from '@/utils/auth';
import { Button } from '@/components/ui/button';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();
  const { logout, user } = useAuth();

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: Home },
    { name: 'Pedidos', path: '/dashboard?tab=pedidos', icon: ShoppingCart },
    { name: 'Settings', path: '/settings', icon: Settings },
  ];

  // Adiciona o item de permissões apenas para usuários com grau 'S'
  if (user?.GRAU === 'S') {
    navItems.push({ name: 'Permissões', path: '/permissions', icon: Shield });
  }

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="h-screen flex overflow-hidden bg-background">
      {/* Sidebar */}
      <div
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out md:relative md:translate-x-0",
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="h-full flex flex-col">
          <div className="flex items-center justify-between h-16 px-4 border-b">
            <div className="flex items-center">
              <span className="text-xl font-semibold">Mithra</span>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="md:hidden p-2 rounded-md hover:bg-gray-100 transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto">
            {navItems.map((item) => {
              // Check if this is the Pedidos link and if we're on the dashboard with the pedidos tab
              const isPedidosActive = item.name === 'Pedidos' && 
                location.pathname === '/dashboard' && 
                location.search.includes('tab=pedidos');
                
              const isActive = location.pathname === item.path || 
                (item.path.includes('#') && location.hash === item.path.split('#')[1]) ||
                isPedidosActive;
              
              return (
                <a
                  key={item.name}
                  href={item.path}
                  onClick={(e) => {
                    e.preventDefault();
                    navigate(item.path);
                  }}
                  className={cn(
                    "flex items-center px-4 py-3 text-sm rounded-lg transition-all group",
                    isActive 
                      ? "bg-primary/10 text-primary" 
                      : "text-gray-700 hover:bg-gray-100"
                  )}
                >
                  <item.icon
                    size={18}
                    className={cn(
                      "mr-3",
                      isActive ? "text-primary" : "text-gray-500 group-hover:text-gray-700"
                    )}
                  />
                  {item.name}
                </a>
              );
            })}
          </nav>

          <div className="p-4 border-t">
            <Button
              variant="outline"
              className="w-full justify-start text-red-500 hover:text-red-700 hover:bg-red-50"
              onClick={handleLogout}
            >
              <LogOut size={18} className="mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top navigation */}
        <header className="bg-white shadow-sm z-10">
          <div className="px-4 h-16 flex items-center justify-between">
            <button
              onClick={() => setSidebarOpen(true)}
              className={cn(
                "p-2 rounded-md hover:bg-gray-100 transition-colors",
                sidebarOpen ? "md:hidden" : ""
              )}
            >
              <Menu size={20} />
            </button>
            <div className="flex items-center space-x-4">
              <button
                className="md:hidden p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
                onClick={() => setSidebarOpen(!sidebarOpen)}
              >
                {sidebarOpen ? <ChevronLeft size={18} /> : <ChevronRight size={18} />}
              </button>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-auto bg-gray-50">
          <div className="p-6 animate-fade-in">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;
