import React, { useState } from 'react';
import { 
  Crown, 
  Search, 
  Kanban, 
  MessageSquare, 
  ShieldCheck, 
  Database, 
  Rocket, 
  PlusCircle, 
  LogOut, 
  ExternalLink,
  RotateCcw,
  Menu,
  X,
  Award,
  Bell,
  Sparkles,
  Heart,
  Video,
  Cpu,
  Users,
  Compass,
  User,
  Globe2,
  ShoppingBag,
  TrendingUp,
  Flame,
  Tv
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface NavigationProps {
  currentPath: string;
  onNavigate: (path: string) => void;
  onOpenDeployModal: () => void;
  onOpenSupabaseModal: () => void;
  onOpenAddGirlModal: () => void;
  onResetData: () => void;
  onSimulateAlert?: () => void;
  threshold?: number;
  unreadCount?: number;
}

export const Navigation: React.FC<NavigationProps> = ({
  currentPath,
  onNavigate,
  onOpenDeployModal,
  onOpenSupabaseModal,
  onOpenAddGirlModal,
  onResetData,
  onSimulateAlert,
  threshold = 94,
  unreadCount = 2,
}) => {
  const { logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isMode2 = 
    currentPath.startsWith('/matchmaking') || 
    currentPath.startsWith('/apply') || 
    currentPath.startsWith('/admin') || 
    currentPath.startsWith('/chat');

  interface NavItem {
    name: string;
    path: string;
    icon: any;
    highlight?: boolean;
    badge?: number | string;
  }

  const mode1Items: NavItem[] = [
    { name: 'Love TV', path: '/love-tv', icon: Tv, badge: 'LIVE', highlight: true },
    { name: 'Discover', path: '/swipe', icon: Heart },
    { name: 'Social Command', path: '/admin/social-command', icon: Flame, badge: 'Viral' },
    { name: 'Love Channel', path: '/love-channel', icon: Heart, badge: 'Couples' },
    { name: 'Join Circle', path: '/join', icon: Globe2, badge: 'Worldwide' },
    { name: 'Marketplace', path: '/marketplace', icon: ShoppingBag, badge: '$' },
    { name: 'Pricing', path: '/pricing', icon: Sparkles, badge: 'Plans' },
    { name: 'TV Studio', path: '/admin/love-tv', icon: Tv },
    { name: 'AI Marketer', path: '/admin/marketer', icon: TrendingUp },
    { name: 'AI Hunter', path: '/hunter', icon: Compass, badge: 'Scouter' },
    { name: 'AI Agents', path: '/agents', icon: Cpu, badge: '3' },
    { name: 'Video Suite', path: '/video-call', icon: Video },
    { name: 'Dashboard', path: '/', icon: Crown },
    { name: 'Finder', path: '/finder', icon: Search },
    { name: 'Presidential', path: '/presidential', icon: Award },
    { name: 'Pipeline', path: '/pipeline', icon: Kanban },
    { name: 'Inbox', path: '/inbox', icon: MessageSquare, badge: unreadCount },
    { name: 'Client Portal', path: '/client', icon: User },
  ];

  const mode2Items: NavItem[] = [
    { name: 'Love TV', path: '/love-tv', icon: Tv, badge: 'LIVE', highlight: true },
    { name: 'Discover', path: '/swipe', icon: Heart },
    { name: 'Social Command', path: '/admin/social-command', icon: Flame, badge: 'Viral' },
    { name: 'Love Channel', path: '/love-channel', icon: Heart, badge: 'Couples' },
    { name: 'Join Circle', path: '/join', icon: Globe2, badge: 'Worldwide' },
    { name: 'Marketplace', path: '/marketplace', icon: ShoppingBag, badge: '$' },
    { name: 'Pricing', path: '/pricing', icon: Sparkles, badge: 'Plans' },
    { name: 'TV Studio', path: '/admin/love-tv', icon: Tv },
    { name: 'AI Marketer', path: '/admin/marketer', icon: TrendingUp },
    { name: 'AI Hunter', path: '/hunter', icon: Compass, badge: 'Scouter' },
    { name: 'AI Agents Hub', path: '/agents', icon: Cpu },
    { name: 'Matchmaking', path: '/matchmaking', icon: Sparkles },
    { name: 'Apply Form', path: '/apply', icon: PlusCircle },
    { name: 'Private Clients', path: '/admin/clients', icon: Users },
    { name: 'AI Matches', path: '/admin/matches', icon: Award },
    { name: 'Chat Monitor', path: '/admin/chats', icon: MessageSquare },
    { name: 'Client Portal', path: '/client', icon: User },
  ];

  const activeNavItems: NavItem[] = isMode2 ? mode2Items : mode1Items;

  return (
    <header className="sticky top-0 z-40 w-full border-b border-amber-500/25 bg-[#080b13]/95 backdrop-blur-md shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo & Brand + Mode Pill Toggle */}
          <div className="flex items-center space-x-3 sm:space-x-4">
            <div 
              onClick={() => onNavigate(isMode2 ? '/matchmaking' : '/')}
              className="flex items-center space-x-2.5 cursor-pointer group"
            >
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-400 via-amber-600 to-amber-900 p-0.5 shadow-md shadow-amber-900/30 group-hover:shadow-amber-500/30 transition-all">
                <div className="w-full h-full bg-[#0a0d14] rounded-[10px] flex items-center justify-center">
                  <Crown className="w-4 h-4 text-amber-400 group-hover:scale-110 transition-transform" />
                </div>
              </div>
              <div>
                <div className="flex items-center space-x-1.5">
                  <span className="font-serif-luxury text-base font-bold tracking-wider text-slate-100">
                    RICH<span className="gold-gradient-text">CONNECT</span>
                  </span>
                </div>
              </div>
            </div>

            {/* Mode Switcher Pills */}
            <div className="hidden sm:flex items-center p-0.5 rounded-lg bg-slate-900/90 border border-slate-800 text-[11px]">
              <button
                onClick={() => onNavigate('/')}
                className={`px-2.5 py-1 rounded-md transition-all font-medium cursor-pointer ${
                  !isMode2
                    ? 'bg-amber-500/20 text-amber-300 font-bold border border-amber-500/30 shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
                title="Mode 1: Personal VIP Dating CRM & Presidential Suite"
              >
                Mode 1: CRM
              </button>
              <button
                onClick={() => onNavigate('/matchmaking')}
                className={`px-2.5 py-1 rounded-md transition-all font-medium flex items-center space-x-1 cursor-pointer ${
                  isMode2
                    ? 'bg-gradient-to-r from-amber-500/25 to-amber-600/25 text-amber-300 font-bold border border-amber-500/40 shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
                title="Mode 2: Elite Private Matchmaking Agency"
              >
                <Sparkles className="w-3 h-3 text-amber-400" />
                <span>Mode 2: Matchmaking</span>
              </button>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-1">
            {activeNavItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentPath === item.path || (item.path !== '/' && currentPath.startsWith(item.path));
              return (
                <button
                  key={item.path}
                  onClick={() => onNavigate(item.path)}
                  className={`relative flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                    isActive
                      ? 'bg-amber-500/15 text-amber-300 border border-amber-500/30 shadow-sm shadow-amber-500/10'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-amber-400' : 'text-slate-400'}`} />
                  <span>{item.name}</span>
                  {item.badge ? (
                    <span className="ml-1 px-1.5 py-0.2 text-[10px] font-bold rounded-full bg-amber-500 text-slate-950">
                      {item.badge}
                    </span>
                  ) : null}
                </button>
              );
            })}
          </nav>

          {/* Action Tools */}
          <div className="hidden lg:flex items-center space-x-2">
            {onSimulateAlert && (
              <button
                onClick={onSimulateAlert}
                className="flex items-center space-x-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 transition-all cursor-pointer group"
                title={`Trigger / Test New Match Alert (Threshold ≥ ${threshold}%)`}
              >
                <Bell className="w-3.5 h-3.5 text-amber-400 group-hover:scale-110 transition-transform" />
                <span className="hidden xl:inline">Match Alert</span>
                <span className="px-1.5 py-0.2 rounded text-[10px] bg-amber-400/20 text-amber-300 font-mono font-bold">
                  ≥{threshold}%
                </span>
              </button>
            )}

            <button
              onClick={onOpenAddGirlModal}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 transition-all"
              title="Add a custom girl profile with IG link & notes"
            >
              <PlusCircle className="w-3.5 h-3.5 text-amber-400" />
              <span>Add Profile</span>
            </button>

            <button
              onClick={onOpenSupabaseModal}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-900/80 hover:bg-slate-800 text-slate-300 border border-slate-700/60 transition-all"
              title="Supabase Tables & SQL Migration"
            >
              <Database className="w-3.5 h-3.5 text-emerald-400" />
              <span>Supabase SQL</span>
            </button>

            <button
              onClick={onOpenDeployModal}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-gradient-to-r from-amber-500/20 to-amber-600/20 hover:from-amber-500/30 hover:to-amber-600/30 text-amber-200 border border-amber-500/40 transition-all shadow-sm"
              title="Vercel & GitHub Deployment Guide"
            >
              <Rocket className="w-3.5 h-3.5 text-amber-400" />
              <span>Vercel Deploy</span>
            </button>

            <button
              onClick={logout}
              className="p-2 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-colors"
              title="Lock Private CRM / Logout"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden items-center space-x-2">
            <button
              onClick={() => onOpenAddGirlModal()}
              className="p-2 rounded-lg bg-amber-500/15 text-amber-400 border border-amber-500/30"
            >
              <PlusCircle className="w-4 h-4" />
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-amber-500/20 bg-[#0a0d14] px-4 pt-2 pb-4 space-y-2">
          {/* Mobile Mode Switcher */}
          <div className="grid grid-cols-2 gap-2 pb-2 border-b border-slate-800">
            <button
              onClick={() => {
                onNavigate('/');
                setMobileMenuOpen(false);
              }}
              className={`py-1.5 rounded-lg text-xs font-semibold ${
                !isMode2 ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' : 'bg-slate-900 text-slate-400'
              }`}
            >
              Mode 1: CRM
            </button>
            <button
              onClick={() => {
                onNavigate('/matchmaking');
                setMobileMenuOpen(false);
              }}
              className={`py-1.5 rounded-lg text-xs font-semibold ${
                isMode2 ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' : 'bg-slate-900 text-slate-400'
              }`}
            >
              Mode 2: Matchmaking
            </button>
          </div>

          {activeNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPath === item.path || (item.path !== '/' && currentPath.startsWith(item.path));
            return (
              <button
                key={item.path}
                onClick={() => {
                  onNavigate(item.path);
                  setMobileMenuOpen(false);
                }}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg text-sm font-medium ${
                  isActive
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                    : 'text-slate-300 hover:bg-slate-800'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-amber-400' : 'text-slate-400'}`} />
                  <span>{item.name}</span>
                </div>
                {item.badge ? (
                  <span className="px-2 py-0.5 text-xs font-bold rounded-full bg-amber-500 text-slate-950">
                    {item.badge}
                  </span>
                ) : null}
              </button>
            );
          })}

          <div className="pt-3 border-t border-slate-800 grid grid-cols-2 gap-2">
            <button
              onClick={() => {
                onOpenSupabaseModal();
                setMobileMenuOpen(false);
              }}
              className="flex items-center justify-center space-x-2 py-2 rounded-lg text-xs bg-slate-900 border border-slate-700 text-slate-200"
            >
              <Database className="w-3.5 h-3.5 text-emerald-400" />
              <span>Supabase SQL</span>
            </button>
            <button
              onClick={() => {
                onOpenDeployModal();
                setMobileMenuOpen(false);
              }}
              className="flex items-center justify-center space-x-2 py-2 rounded-lg text-xs bg-amber-500/20 border border-amber-500/40 text-amber-300"
            >
              <Rocket className="w-3.5 h-3.5 text-amber-400" />
              <span>Vercel Deploy</span>
            </button>
          </div>

          <div className="pt-2 flex justify-between items-center text-xs text-slate-400 px-1">
            <button 
              onClick={() => {
                onResetData();
                setMobileMenuOpen(false);
              }}
              className="flex items-center space-x-1 text-slate-400 hover:text-amber-300"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset Seed Demo</span>
            </button>
            <button 
              onClick={logout}
              className="text-red-400 hover:underline flex items-center space-x-1"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Lock CRM</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
