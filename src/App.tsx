import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { NotificationProvider, useNotification } from './context/NotificationContext';
import { Navigation } from './components/Navigation';
import { NewMatchToast } from './components/NewMatchToast';
import { LoginPage } from './pages/LoginPage';
import { DashboardPage } from './pages/DashboardPage';
import { FinderPage } from './pages/FinderPage';
import { InboxPage } from './pages/InboxPage';
import { GirlProfilePage } from './pages/GirlProfilePage';
import { PipelinePage } from './pages/PipelinePage';
import { PresidentialSuitePage } from './pages/PresidentialSuitePage';
import { MatchmakingLandingPage } from './pages/MatchmakingLandingPage';
import { MatchmakingApplyPage } from './pages/MatchmakingApplyPage';
import { AdminClientsPage } from './pages/AdminClientsPage';
import { AdminMatchesPage } from './pages/AdminMatchesPage';
import { AdminChatsPage } from './pages/AdminChatsPage';
import { PrivateChatPage } from './pages/PrivateChatPage';
import { SwipeDeckPage } from './pages/SwipeDeckPage';
import { VideoCallPage } from './pages/VideoCallPage';
import { AutonomousAgentsHubPage } from './pages/AutonomousAgentsHubPage';
import { ClientPortalPage } from './pages/ClientPortalPage';
import { AiHunterPage } from './pages/AiHunterPage';
import { JoinCirclePage } from './pages/JoinCirclePage';
import { AdminMarketerPage } from './pages/AdminMarketerPage';
import { MarketplacePage } from './pages/MarketplacePage';
import { PricingPage } from './pages/PricingPage';
import { LoveChannelPage } from './pages/LoveChannelPage';
import { AdminSocialCommandPage } from './pages/AdminSocialCommandPage';
import { SocialSharePreviewPage } from './pages/SocialSharePreviewPage';
import { LoveTvPage } from './pages/LoveTvPage';
import { AdminLoveTvPage } from './pages/AdminLoveTvPage';
import { OnboardingModal } from './components/OnboardingModal';
import { AddGirlModal } from './components/AddGirlModal';
import { SupabaseModal } from './components/SupabaseModal';
import { DeployModal } from './components/DeployModal';
import { Girl, PipelineStage } from './types';
import { getGirls, saveGirl, updateGirlStage, resetToSeedData } from './lib/storage';

function MainAppContent({
  girls,
  setGirls,
}: {
  girls: Girl[];
  setGirls: React.Dispatch<React.SetStateAction<Girl[]>>;
}) {
  const { isAuthenticated, isLoading } = useAuth();
  const {
    activeToast,
    threshold,
    dismissToast,
    simulateNewHighMatch,
    isMuted,
    toggleMute,
    triggerToastForGirl,
  } = useNotification();

  // Route State: e.g. '/', '/finder', '/inbox', '/inbox/g-1', '/girls/g-1', '/pipeline', '/login'
  const [currentPath, setCurrentPath] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      return window.location.pathname || '/';
    }
    return '/';
  });

  const [selectedGirlId, setSelectedGirlId] = useState<string | undefined>(undefined);

  // Modals
  const [isAddGirlOpen, setIsAddGirlOpen] = useState(false);
  const [isSupabaseOpen, setIsSupabaseOpen] = useState(false);
  const [isDeployOpen, setIsDeployOpen] = useState(false);
  const [isOnboardingOpen, setIsOnboardingOpen] = useState(false);

  // Sync window pathname on back/forward
  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname || '/');
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Parse path
  useEffect(() => {
    if (currentPath.startsWith('/inbox/')) {
      const id = currentPath.replace('/inbox/', '');
      setSelectedGirlId(id);
    } else if (currentPath.startsWith('/girls/')) {
      const id = currentPath.replace('/girls/', '');
      setSelectedGirlId(id);
    }
  }, [currentPath]);

  const navigate = (path: string) => {
    setCurrentPath(path);
    if (typeof window !== 'undefined') {
      window.history.pushState({}, '', path);
    }
  };

  const handleUpdateStage = (id: string, stage: PipelineStage) => {
    updateGirlStage(id, stage);
    setGirls(getGirls());
  };

  const handleAddGirl = (newGirl: Girl) => {
    saveGirl(newGirl);
    setGirls(getGirls());

    // Check if new girl triggers the high match score toast in Found stage
    if (newGirl.stage === 'Found' && newGirl.match_score >= threshold) {
      triggerToastForGirl(newGirl);
    }
  };

  const handleResetData = () => {
    if (window.confirm('Reset all girls, memories, and chat history back to high-value seed demo data?')) {
      resetToSeedData();
      setGirls(getGirls());
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#07090e] flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-amber-400 border-t-transparent animate-spin" />
      </div>
    );
  }

  // Public and VIP member routes (accessible without admin credentials)
  const isPublicMatchmakingRoute = 
    currentPath === '/matchmaking' || 
    currentPath === '/apply' || 
    currentPath === '/swipe' ||
    currentPath === '/agents' ||
    currentPath === '/video-call' ||
    currentPath.startsWith('/chat/') ||
    currentPath.startsWith('/client') ||
    currentPath.startsWith('/join') ||
    currentPath.startsWith('/marketplace') ||
    currentPath.startsWith('/pricing') ||
    currentPath.startsWith('/love-channel') ||
    currentPath.startsWith('/social-share') ||
    currentPath.startsWith('/love-tv');

  // Not authenticated and trying to access protected CRM or Admin? Show Login Page
  if (!isAuthenticated && !isPublicMatchmakingRoute) {
    return <LoginPage onSuccess={() => navigate(currentPath || '/')} onNavigate={navigate} />;
  }

  // Determine current page component
  const renderCurrentPage = () => {
    // Love TV - AI Live Reality Show (/love-tv)
    if (currentPath === '/love-tv' || currentPath.startsWith('/love-tv')) {
      return <LoveTvPage onNavigate={navigate} />;
    }

    // Love TV Executive Studio (/admin/love-tv)
    if (currentPath === '/admin/love-tv' || currentPath === '/admin/tv') {
      return <AdminLoveTvPage onNavigate={navigate} />;
    }

    // Social Media Viral Command Center (/admin/social-command)
    if (currentPath === '/admin/social-command' || currentPath === '/social-command') {
      return <AdminSocialCommandPage onNavigate={navigate} />;
    }

    // 9:16 Social Story Share Preview with QR Code (/social-share)
    if (currentPath.startsWith('/social-share')) {
      return <SocialSharePreviewPage onNavigate={navigate} />;
    }

    // Private Love Channel for Couples (/love-channel)
    if (currentPath === '/love-channel' || currentPath.startsWith('/love-channel')) {
      return <LoveChannelPage onNavigate={navigate} />;
    }

    // Membership Plans & Freemium Smart Paywall (/pricing)
    if (currentPath.startsWith('/pricing')) {
      return <PricingPage onNavigate={navigate} />;
    }

    // Public Global Girl Discovery & Join Funnel (/join and /join/:city)
    if (currentPath.startsWith('/join')) {
      return <JoinCirclePage onNavigate={navigate} />;
    }

    // Digital Products Marketplace & Money Engine
    if (currentPath === '/marketplace' || currentPath.startsWith('/marketplace')) {
      return <MarketplacePage onNavigate={navigate} />;
    }

    // AI Marketer & Viral Content Engine
    if (currentPath === '/admin/marketer' || currentPath === '/marketer') {
      return <AdminMarketerPage onNavigate={navigate} />;
    }

    // Client-Facing Portal (Accessible without admin login)
    if (currentPath.startsWith('/client')) {
      return <ClientPortalPage onNavigate={navigate} />;
    }

    // AI Girls Hunter & Scouter
    if (currentPath === '/hunter' || currentPath === '/admin/hunter') {
      return <AiHunterPage onNavigate={navigate} />;
    }

    // Autonomous Multi-Agent & Elite Dating Routes
    if (currentPath === '/swipe') {
      return <SwipeDeckPage onNavigate={navigate} />;
    }

    if (currentPath === '/agents') {
      return <AutonomousAgentsHubPage onNavigate={navigate} />;
    }

    if (currentPath === '/video-call') {
      return <VideoCallPage onNavigate={navigate} />;
    }

    // Mode 2: Elite Private Matchmaking Routes
    if (currentPath === '/matchmaking') {
      return <MatchmakingLandingPage onNavigate={navigate} />;
    }

    if (currentPath === '/apply') {
      return <MatchmakingApplyPage onNavigate={navigate} />;
    }

    if (currentPath.startsWith('/chat/')) {
      const matchId = currentPath.replace('/chat/', '');
      return <PrivateChatPage matchId={matchId} onNavigate={navigate} />;
    }

    if (currentPath === '/admin/clients') {
      return <AdminClientsPage onNavigate={navigate} />;
    }

    if (currentPath === '/admin/matches') {
      return <AdminMatchesPage onNavigate={navigate} />;
    }

    if (currentPath === '/admin/chats') {
      return <AdminChatsPage onNavigate={navigate} />;
    }

    // Mode 1: Private Dating CRM Routes
    if (currentPath === '/finder') {
      return (
        <FinderPage
          girls={girls}
          onUpdateStage={handleUpdateStage}
          onNavigate={navigate}
          onOpenAddGirlModal={() => setIsAddGirlOpen(true)}
        />
      );
    }

    if (currentPath === '/presidential') {
      return (
        <PresidentialSuitePage
          girls={girls}
          onNavigate={navigate}
          onRefreshGirls={() => setGirls(getGirls())}
          onUpdateStage={handleUpdateStage}
        />
      );
    }

    if (currentPath.startsWith('/inbox')) {
      return (
        <InboxPage
          girlId={selectedGirlId}
          girls={girls}
          onSelectGirl={(id) => {
            setSelectedGirlId(id);
            navigate(`/inbox/${id}`);
          }}
          onNavigate={navigate}
        />
      );
    }

    if (currentPath.startsWith('/girls/')) {
      const id = currentPath.replace('/girls/', '') || selectedGirlId || girls[0]?.id;
      return (
        <GirlProfilePage
          girlId={id}
          girls={girls}
          onBack={() => navigate('/finder')}
          onNavigate={navigate}
          onUpdateStage={handleUpdateStage}
        />
      );
    }

    if (currentPath === '/pipeline') {
      return (
        <PipelinePage
          girls={girls}
          onUpdateStage={handleUpdateStage}
          onNavigate={navigate}
          onOpenAddGirlModal={() => setIsAddGirlOpen(true)}
        />
      );
    }

    // Default: Dashboard ('/')
    return (
      <DashboardPage
        girls={girls}
        onNavigate={navigate}
        onOpenDeployModal={() => setIsDeployOpen(true)}
        onOpenSupabaseModal={() => setIsSupabaseOpen(true)}
        onSimulateAlert={simulateNewHighMatch}
        threshold={threshold}
      />
    );
  };

  return (
    <div className="min-h-screen bg-[#06080f] text-slate-100 flex flex-col relative selection:bg-amber-500/30 selection:text-amber-200">
      <Navigation
        currentPath={currentPath}
        onNavigate={navigate}
        onOpenDeployModal={() => setIsDeployOpen(true)}
        onOpenSupabaseModal={() => setIsSupabaseOpen(true)}
        onOpenAddGirlModal={() => setIsAddGirlOpen(true)}
        onResetData={handleResetData}
        onSimulateAlert={simulateNewHighMatch}
        threshold={threshold}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        {renderCurrentPage()}
      </main>

      {/* High-Value Match Alert Toast Notification */}
      {activeToast && (
        <NewMatchToast
          key={activeToast.id}
          girl={activeToast}
          threshold={threshold}
          onViewDossier={(id) => navigate(`/girls/${id}`)}
          onChatAI={(id) => navigate(`/inbox/${id}`)}
          onDismiss={dismissToast}
          isMuted={isMuted}
          onToggleMute={toggleMute}
        />
      )}

      {/* Modals */}
      <AddGirlModal
        isOpen={isAddGirlOpen}
        onClose={() => setIsAddGirlOpen(false)}
        onAdd={handleAddGirl}
      />

      <SupabaseModal
        isOpen={isSupabaseOpen}
        onClose={() => setIsSupabaseOpen(false)}
      />

      <DeployModal
        isOpen={isDeployOpen}
        onClose={() => setIsDeployOpen(false)}
      />

      <OnboardingModal
        isOpen={isOnboardingOpen}
        onClose={() => setIsOnboardingOpen(false)}
        onComplete={(profile) => {
          console.log('VIP Member onboarded:', profile);
          navigate('/swipe');
        }}
      />
    </div>
  );
}

function MainApp() {
  const [girls, setGirls] = useState<Girl[]>([]);

  useEffect(() => {
    setGirls(getGirls());
  }, []);

  return (
    <NotificationProvider girls={girls}>
      <MainAppContent girls={girls} setGirls={setGirls} />
    </NotificationProvider>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <MainApp />
    </AuthProvider>
  );
}
