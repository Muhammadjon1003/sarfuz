import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import MobileHeader from './MobileHeader'
import MobileBottomNav from './MobileBottomNav'
import AddTransactionDialog from '@/components/AddTransactionDialog'
import { cn } from '@/lib/utils'
import { useThemeStore } from '@/store/themeStore'

interface MobileLayoutProps {
  currentPageName: string
}

export default function MobileLayout({ currentPageName }: MobileLayoutProps) {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const { theme } = useThemeStore()

  return (
    <div className={cn(
      "min-h-screen relative selection:bg-cyan-500/30 selection:text-cyan-200 overflow-x-hidden transition-colors duration-300 flex flex-col lg:hidden",
      theme === 'dark' ? 'bg-[#040e12] text-slate-100' : 'bg-[#f0fdfa] text-slate-900'
    )}>
      {/* Background ambient lighting */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        {theme === 'dark' ? (
          <>
            <div className="absolute -top-40 -left-40 w-[30rem] h-[30rem] bg-cyan-500/10 rounded-full blur-[120px]"></div>
            <div className="absolute top-1/2 left-1/3 -translate-y-1/2 w-[25rem] h-[25rem] bg-teal-500/10 rounded-full blur-[120px]"></div>
          </>
        ) : (
          <>
            <div className="absolute -top-40 -left-40 w-[30rem] h-[30rem] bg-cyan-400/20 rounded-full blur-[120px]"></div>
            <div className="absolute top-1/2 left-1/3 -translate-y-1/2 w-[25rem] h-[25rem] bg-sky-300/20 rounded-full blur-[120px]"></div>
          </>
        )}
      </div>

      {/* Dedicated Mobile Header */}
      <MobileHeader currentPageName={currentPageName} />

      {/* Mobile Main Content */}
      <main className="p-3 sm:p-5 max-w-7xl mx-auto w-full pb-24 relative z-10 flex-1">
        <Outlet />
      </main>

      {/* Dedicated Mobile Bottom Navigation */}
      <MobileBottomNav onOpenAddDialog={() => setIsAddDialogOpen(true)} />

      {/* Global Add Transaction Dialog */}
      <AddTransactionDialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen} />
    </div>
  )
}
