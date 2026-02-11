import { Outlet } from 'react-router-dom';
import { Toaster } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { Sidebar } from '@/components/layout/sidebar';

export default function App() {
  return (
    <TooltipProvider>
      <div className="flex h-screen scanlines">
        <Sidebar />
        <main className="flex-1 min-w-0 overflow-auto cyber-grid-bg">
          <Outlet />
        </main>
      </div>
      <Toaster />
    </TooltipProvider>
  );
}
