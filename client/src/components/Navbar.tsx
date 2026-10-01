import React from "react";
import { HeartPulse } from "lucide-react";
import { Link } from "wouter";
import { useAuth } from "@/contexts/AuthContext";

interface NavbarProps {
  onReset: () => void;
  searchQuery?: string;
  setSearchQuery?: (q: string) => void;
  selectedConditionId?: string | null;
}

export const Navbar: React.FC<NavbarProps> = ({
  onReset,
  searchQuery,
  setSearchQuery,
  selectedConditionId,
}) => {
  const { session, profile, isAdmin, signOut } = useAuth();
  return (
    <header className="sticky top-0 z-40 w-full glass-panel border-b border-slate-200/80 shadow-xs transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between gap-4">
        {/* Brand */}
        <button
          onClick={onReset}
          className="flex items-center text-left group transition hover:opacity-90 cursor-pointer"
        >
          <HeartPulse className="mr-1.5 h-4 w-4 text-teal-600 transition-colors duration-200 group-hover:text-emerald-700 sm:h-[18px] sm:w-[18px]" aria-hidden="true" />
          <span className="font-display text-[17px] font-extrabold tracking-[-0.04em] text-teal-700 transition-colors duration-200 group-hover:text-emerald-700 sm:text-[19px]">
            Hi <span className="text-emerald-600">Care</span>
          </span>
        </button>
        <div className="flex items-center gap-2 text-xs font-bold">
          {session ? (
            <>
              <span className="hidden max-w-[140px] truncate text-slate-500 sm:inline">{profile?.name || session.user.email}</span>
              {isAdmin && <Link href="/admin" className="rounded-lg border border-teal-200 bg-teal-50 px-2.5 py-1.5 text-teal-700">관리자</Link>}
              <button onClick={signOut} className="rounded-lg border border-slate-200 px-2.5 py-1.5 text-slate-600 hover:bg-slate-100 cursor-pointer">로그아웃</button>
            </>
          ) : (
            <Link href="/login" className="rounded-lg bg-teal-700 px-3 py-1.5 text-white hover:bg-teal-800">로그인</Link>
          )}
        </div>
      </div>
    </header>
  );
};
