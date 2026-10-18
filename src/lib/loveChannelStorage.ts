import { supabase } from './supabase';

export interface LoveChannelMemory {
  id: string;
  type: 'photo_story' | 'dream_date' | 'meme' | 'timeline_movie' | 'voice_note';
  title: string;
  description: string;
  partnerAName: string;
  partnerBName: string;
  mediaUrl: string;
  thumbnailUrl?: string;
  locationTag?: string;
  quoteOverlay?: string;
  slides?: Array<{ url: string; caption: string; duration: number }>;
  audioVibe?: string;
  lovePointsAwarded: number;
  isPro?: boolean;
  watermark: string;
  createdAt: string;
}

export interface LoveChannel {
  id: string;
  couple_id: string;
  partnerA: {
    name: string;
    avatar: string;
    location: string;
    instagram?: string;
  };
  partnerB: {
    name: string;
    avatar: string;
    location: string;
    wealthTier?: string;
  };
  memories: LoveChannelMemory[];
  love_points: number;
  is_pro: boolean;
  pro_plan_expires?: string;
  anniversary_date?: string;
  created_at: string;
}

export interface RedemptionItem {
  id: string;
  title: string;
  category: 'discount' | 'ebook' | 'physical_gift' | 'platform_credit';
  pointsCost: number;
  valueDescription: string;
  iconName: string;
}

export const LOVE_REDEMPTIONS: RedemptionItem[] = [
  {
    id: 'rew-ebook',
    title: 'Free eBook: "Keep Love Alive Where Others Fail"',
    category: 'ebook',
    pointsCost: 300,
    valueDescription: 'Instant unlock of full digital relationship playbook ($49 value)',
    iconName: 'BookOpen'
  },
  {
    id: 'rew-diamond-discount',
    title: '20% Off Diamond Empire Membership',
    category: 'discount',
    pointsCost: 500,
    valueDescription: 'Save $60 on annual sovereign matchmaking tier',
    iconName: 'Crown'
  },
  {
    id: 'rew-platform-credits',
    title: '$10 Platform Concierge Credits',
    category: 'platform_credit',
    pointsCost: 1000,
    valueDescription: 'Converts directly into booking & video suite credit',
    iconName: 'CreditCard'
  },
  {
    id: 'rew-flower-delivery',
    title: 'Real Luxury Rose Box & Champagne Concierge Delivery',
    category: 'physical_gift',
    pointsCost: 2000,
    valueDescription: 'Delivered to her residence in London, Dubai, Lagos, or Monaco',
    iconName: 'Heart'
  }
];

const INITIAL_LOVE_CHANNELS: LoveChannel[] = [
  {
    id: 'lc-sienna-james',
    couple_id: 'match-1',
    partnerA: {
      name: 'Sienna Laurent',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80',
      location: 'Monaco / London',
      instagram: '@sienna.ldp'
    },
    partnerB: {
      name: 'Lord James Sterling',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80',
      location: 'London (Mayfair)',
      wealthTier: '$45M+ Private Equity'
    },
    love_points: 2450,
    is_pro: true,
    pro_plan_expires: '2027-01-01T00:00:00.000Z',
    anniversary_date: 'May 14',
    created_at: '2026-05-14T10:00:00.000Z',
    memories: [
      {
        id: 'mem-1',
        type: 'dream_date',
        title: 'Virtual Sunset Rendezvous on Dubai Yacht',
        description: 'Pixar-style 3D animated memory of us sailing by Burj Al Arab at golden hour.',
        partnerAName: 'Sienna',
        partnerBName: 'James',
        mediaUrl: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1000&q=80',
        thumbnailUrl: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=600&q=80',
        locationTag: 'Dubai Marina & Palm Jumeirah',
        quoteOverlay: '"In a world of billions, you are my sovereign peace."',
        audioVibe: 'Lo-Fi Candlelight Waves',
        lovePointsAwarded: 50,
        isPro: true,
        watermark: 'RichConnect Private Memory - Not for Public Sharing',
        createdAt: '2026-09-20T18:30:00.000Z'
      },
      {
        id: 'mem-2',
        type: 'photo_story',
        title: 'Our Mayfair Art Gallery & Cap d\'Antibes Story',
        description: 'Ken Burns animated slideshow with soft Parisian piano transitions.',
        partnerAName: 'Sienna',
        partnerBName: 'James',
        mediaUrl: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&w=1000&q=80',
        thumbnailUrl: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&w=600&q=80',
        locationTag: 'London & Monaco',
        quoteOverlay: '"Art brought us into the same room; loyalty built the empire."',
        slides: [
          {
            url: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&w=800&q=80',
            caption: 'First private salon in Mayfair',
            duration: 4
          },
          {
            url: 'https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=800&q=80',
            caption: 'Summer weekend at Port Hercules, Monaco',
            duration: 4
          },
          {
            url: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=800&q=80',
            caption: 'Late dinner in Paris Le Marais',
            duration: 4
          }
        ],
        audioVibe: 'Parisian Accordion & Soft Piano',
        lovePointsAwarded: 100,
        isPro: true,
        watermark: 'RichConnect Private Memory - Not for Public Sharing',
        createdAt: '2026-10-02T14:15:00.000Z'
      },
      {
        id: 'mem-3',
        type: 'meme',
        title: 'When He Says "I’ll Be Ready in 5 Minutes"',
        description: 'Cute chibi couple meme about our time management quirks in London traffic.',
        partnerAName: 'Sienna',
        partnerBName: 'James',
        mediaUrl: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=800&q=80',
        thumbnailUrl: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=600&q=80',
        quoteOverlay: '"Five minutes in London means the driver hasn\'t even turned on the Maybach engine yet 😂"',
        lovePointsAwarded: 30,
        isPro: false,
        watermark: 'RichConnect Private Memory - Not for Public Sharing',
        createdAt: '2026-10-10T09:45:00.000Z'
      }
    ]
  },
  {
    id: 'lc-amara-david',
    couple_id: 'match-2',
    partnerA: {
      name: 'Amara Adeleke',
      avatar: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&w=600&q=80',
      location: 'Lagos (Banana Island)',
      instagram: '@amara.queens'
    },
    partnerB: {
      name: 'David O. Sterling',
      avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=600&q=80',
      location: 'Lagos & London',
      wealthTier: '$60M+ Infrastructure'
    },
    love_points: 1850,
    is_pro: false,
    anniversary_date: 'August 22',
    created_at: '2026-08-22T12:00:00.000Z',
    memories: [
      {
        id: 'mem-amara-1',
        type: 'dream_date',
        title: 'Virtual Sunset on Maldives Private Atoll',
        description: 'Animated Pixar-style beach walk under glowing bioluminescent waves.',
        partnerAName: 'Amara',
        partnerBName: 'David',
        mediaUrl: 'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?auto=format&fit=crop&w=1000&q=80',
        thumbnailUrl: 'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?auto=format&fit=crop&w=600&q=80',
        locationTag: 'Maldives Private Villa',
        quoteOverlay: '"You are my answered prayer and my dynasty foundation."',
        audioVibe: 'Lo-Fi Candlelight Waves',
        lovePointsAwarded: 50,
        isPro: false,
        watermark: 'RichConnect Private Memory - Not for Public Sharing',
        createdAt: '2026-09-12T16:00:00.000Z'
      }
    ]
  }
];

const STORAGE_KEY_CHANNELS = 'rc_love_channels_v1';
const STORAGE_KEY_ACTIVE_CHANNEL = 'rc_active_love_channel_id';

export const getLoveChannels = (): LoveChannel[] => {
  if (typeof window === 'undefined') return INITIAL_LOVE_CHANNELS;
  try {
    const raw = localStorage.getItem(STORAGE_KEY_CHANNELS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY_CHANNELS, JSON.stringify(INITIAL_LOVE_CHANNELS));
      return INITIAL_LOVE_CHANNELS;
    }
    return JSON.parse(raw);
  } catch (err) {
    console.error('Failed to parse love channels:', err);
    return INITIAL_LOVE_CHANNELS;
  }
};

export const getActiveLoveChannelId = (): string => {
  if (typeof window === 'undefined') return INITIAL_LOVE_CHANNELS[0].id;
  return localStorage.getItem(STORAGE_KEY_ACTIVE_CHANNEL) || INITIAL_LOVE_CHANNELS[0].id;
};

export const setActiveLoveChannelId = (id: string) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEY_ACTIVE_CHANNEL, id);
  }
};

export const getLoveChannelById = (id: string): LoveChannel | undefined => {
  const channels = getLoveChannels();
  return channels.find(c => c.id === id) || channels[0];
};

export const saveLoveChannel = async (channel: LoveChannel): Promise<LoveChannel> => {
  const channels = getLoveChannels();
  const index = channels.findIndex(c => c.id === channel.id);
  let updated: LoveChannel[];
  if (index >= 0) {
    updated = [...channels];
    updated[index] = channel;
  } else {
    updated = [channel, ...channels];
  }

  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEY_CHANNELS, JSON.stringify(updated));
  }

  // Attempt Supabase sync
  try {
    await supabase.from('love_channels').upsert({
      id: channel.id,
      couple_id: channel.couple_id,
      memories: channel.memories,
      love_points: channel.love_points,
      created_at: channel.created_at
    });
  } catch (err) {
    console.warn('Supabase love_channels sync notice:', err);
  }

  return channel;
};

export const addMemoryToLoveChannel = async (
  channelId: string, 
  memory: LoveChannelMemory
): Promise<LoveChannel | null> => {
  const channel = getLoveChannelById(channelId);
  if (!channel) return null;

  const updatedMemories = [memory, ...channel.memories];
  const updatedChannel: LoveChannel = {
    ...channel,
    memories: updatedMemories,
    love_points: channel.love_points + (memory.lovePointsAwarded || 50)
  };

  return await saveLoveChannel(updatedChannel);
};

export const awardLovePoints = async (
  channelIdOrPoints: string | number, 
  pointsOrReason?: number | string, 
  _reason?: string
): Promise<LoveChannel | null> => {
  let targetChannelId: string;
  let pointsToAdd: number;

  if (typeof channelIdOrPoints === 'string') {
    targetChannelId = channelIdOrPoints;
    pointsToAdd = typeof pointsOrReason === 'number' ? pointsOrReason : 50;
  } else {
    targetChannelId = getActiveLoveChannelId();
    pointsToAdd = channelIdOrPoints;
  }

  const channel = getLoveChannelById(targetChannelId);
  if (!channel) return null;

  const updatedChannel: LoveChannel = {
    ...channel,
    love_points: channel.love_points + pointsToAdd
  };

  return await saveLoveChannel(updatedChannel);
};

export const redeemLovePoints = async (
  channelId: string, 
  rewardId: string
): Promise<{ success: boolean; message: string; channel?: LoveChannel }> => {
  const channel = getLoveChannelById(channelId);
  if (!channel) return { success: false, message: 'Love channel not found.' };

  const reward = LOVE_REDEMPTIONS.find(r => r.id === rewardId);
  if (!reward) return { success: false, message: 'Reward not found.' };

  if (channel.love_points < reward.pointsCost) {
    return { 
      success: false, 
      message: `Insufficient Love Points. You have ${channel.love_points} pts; reward requires ${reward.pointsCost} pts.` 
    };
  }

  const updatedChannel: LoveChannel = {
    ...channel,
    love_points: channel.love_points - reward.pointsCost
  };

  await saveLoveChannel(updatedChannel);
  return { 
    success: true, 
    message: `Redeemed ${reward.title}! Our private concierge will coordinate your reward immediately.`, 
    channel: updatedChannel 
  };
};

export const upgradeLoveChannelPro = async (
  channelId: string
): Promise<LoveChannel | null> => {
  const channel = getLoveChannelById(channelId);
  if (!channel) return null;

  const updatedChannel: LoveChannel = {
    ...channel,
    is_pro: true,
    pro_plan_expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
  };

  return await saveLoveChannel(updatedChannel);
};
