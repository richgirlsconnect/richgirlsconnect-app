import React, { useState } from 'react';
import { 
  Crown, 
  Sparkles, 
  BookOpen, 
  Download, 
  CreditCard, 
  Check, 
  CheckCircle2, 
  DollarSign, 
  TrendingUp, 
  Loader2, 
  AlertCircle, 
  FileText, 
  Headphones, 
  Video, 
  Star, 
  ArrowRight, 
  Lock, 
  Eye, 
  Plus, 
  ShoppingBag,
  ShieldCheck,
  Search
} from 'lucide-react';
import { 
  getDigitalProducts, 
  saveDigitalProduct, 
  recordProductSale, 
  getRevenueRecords, 
  DigitalProduct, 
  RevenueRecord 
} from '../lib/marketplaceStorage';

const PRESET_TOPICS = [
  "The Rich Girl's Guide to Finding Your Dream Man",
  "How to Build Lasting Relationships Where Others Fail",
  "Secrets to Succeeding in Dating, Marriage & High-Value Relationships",
  "Lagos to Monaco: How African Queens Attract Global Millionaires",
  "Texting That Makes Millionaires Obsessed"
];

interface MarketplacePageProps {
  onNavigate: (path: string) => void;
}

export const MarketplacePage: React.FC<MarketplacePageProps> = ({ onNavigate }) => {
  const [products, setProducts] = useState<DigitalProduct[]>(() => getDigitalProducts());
  const [revenueRecords, setRevenueRecords] = useState<RevenueRecord[]>(() => getRevenueRecords());
  const [filterType, setFilterType] = useState<'all' | 'ebook' | 'course' | 'audio'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Reader Preview Modal
  const [previewProduct, setPreviewProduct] = useState<DigitalProduct | null>(null);

  // Checkout Modal States
  const [checkoutProduct, setCheckoutProduct] = useState<DigitalProduct | null>(null);
  const [buyerName, setBuyerName] = useState('Lady Genevieve');
  const [buyerEmail, setBuyerEmail] = useState('genevieve@luxury.com');
  const [selectedGateway, setSelectedGateway] = useState<'Stripe' | 'Paystack'>('Stripe');
  const [isProcessingCheckout, setIsProcessingCheckout] = useState(false);
  const [purchasedProductIds, setPurchasedProductIds] = useState<Set<string>>(new Set());

  // AI Create Product Modal States
  const [showAiCreateModal, setShowAiCreateModal] = useState(false);
  const [aiTopic, setAiTopic] = useState(PRESET_TOPICS[0]);
  const [aiProductType, setAiProductType] = useState<'ebook' | 'course' | 'audio'>('ebook');
  const [aiPrice, setAiPrice] = useState(49);
  const [isGeneratingProduct, setIsGeneratingProduct] = useState(false);

  // Revenue Totals
  const totalRevenue = revenueRecords.reduce((acc, r) => acc + (r.amount || 0), 0);
  const productRevenue = revenueRecords.filter(r => r.source === 'digital_product').reduce((acc, r) => acc + (r.amount || 0), 0);
  const appFeeRevenue = revenueRecords.filter(r => r.source === 'application_fee').reduce((acc, r) => acc + (r.amount || 0), 0);
  const retainerRevenue = revenueRecords.filter(r => r.source === 'client_retainer').reduce((acc, r) => acc + (r.amount || 0), 0);

  const handleAiCreateProduct = async () => {
    setIsGeneratingProduct(true);
    try {
      const res = await fetch('/api/products/ai-create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic: aiTopic,
          productType: aiProductType,
          targetPrice: Number(aiPrice) || 49
        })
      });

      const data = await res.json();
      if (data.title) {
        const newProduct: DigitalProduct = {
          id: `prod-${Date.now()}`,
          title: data.title,
          subtitle: data.subtitle,
          price: Number(data.price) || 49,
          type: data.type || aiProductType,
          description: data.description,
          cover_url: data.cover_url || "https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=600&q=80",
          file_url: `https://richconnect.luxury/downloads/${data.title.toLowerCase().replace(/[^a-z0-9]/g, '-')}.pdf`,
          sales: 0,
          created_at: new Date().toISOString(),
          key_benefits: data.key_benefits,
          chapters_outline: data.chapters_outline,
          full_chapter_sample: data.full_chapter_sample
        };

        await saveDigitalProduct(newProduct);
        setProducts(getDigitalProducts());
        setShowAiCreateModal(false);
      }
    } catch (err) {
      console.error('Error generating AI product:', err);
    } finally {
      setIsGeneratingProduct(false);
    }
  };

  const handleCompletePurchase = () => {
    if (!checkoutProduct) return;
    setIsProcessingCheckout(true);

    setTimeout(() => {
      recordProductSale(checkoutProduct.id, buyerName, selectedGateway);
      setRevenueRecords(getRevenueRecords());
      setPurchasedProductIds(prev => new Set(prev).add(checkoutProduct.id));
      setIsProcessingCheckout(false);
      setProducts(getDigitalProducts());
    }, 1200);
  };

  const filteredProducts = products.filter(p => {
    const matchesType = filterType === 'all' || p.type === filterType;
    const matchesSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          p.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesType && matchesSearch;
  });

  return (
    <div className="space-y-8 pb-16">
      
      {/* Header & Brand */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-amber-500/20">
        <div>
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center text-slate-950 font-bold shadow-md">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <h1 className="text-xl sm:text-2xl font-bold font-serif-luxury text-slate-100">
              RichConnect Digital Marketplace
            </h1>
            <span className="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
              Money Engine Active
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl">
            Sovereign relationship publications, audio masterclasses, and messaging compendiums for ambitious women and discerning gentlemen.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => setShowAiCreateModal(true)}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:brightness-110 text-slate-950 font-bold text-xs flex items-center space-x-1.5 shadow-md shadow-amber-500/20 cursor-pointer"
          >
            <Sparkles className="w-4 h-4" />
            <span>AI Create Product</span>
          </button>
        </div>
      </div>

      {/* Revenue Analytics Bar */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="luxury-card rounded-2xl p-4 border border-amber-500/30 space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Total Gross Revenue</span>
            <DollarSign className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-emerald-400">
            ${totalRevenue.toLocaleString()}
          </div>
          <p className="text-[10px] text-slate-400">Multi-Channel Income Stream</p>
        </div>

        <div className="luxury-card rounded-2xl p-4 border border-slate-800 space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Girl Application Fees ($99)</span>
            <Sparkles className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-xl font-bold font-mono text-white">
            ${appFeeRevenue.toLocaleString()}
          </div>
          <p className="text-[10px] text-slate-400">{Math.round(appFeeRevenue / 99)} Paid Candidate Inquiries</p>
        </div>

        <div className="luxury-card rounded-2xl p-4 border border-slate-800 space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Digital Product Sales ($19-$197)</span>
            <BookOpen className="w-4 h-4 text-pink-400" />
          </div>
          <div className="text-xl font-bold font-mono text-white">
            ${productRevenue.toLocaleString()}
          </div>
          <p className="text-[10px] text-slate-400">Ebooks, Audio &amp; Masterclasses</p>
        </div>

        <div className="luxury-card rounded-2xl p-4 border border-slate-800 space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Client Retainers ($2,500+)</span>
            <Crown className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-xl font-bold font-mono text-amber-300">
            ${retainerRevenue.toLocaleString()}
          </div>
          <p className="text-[10px] text-slate-400">Private Matchmaking VIP Intake</p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 text-xs">
        {/* Type Filter Tabs */}
        <div className="flex items-center space-x-1.5 p-1 rounded-xl bg-slate-900 border border-slate-800 overflow-x-auto">
          <button
            onClick={() => setFilterType('all')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-all cursor-pointer ${
              filterType === 'all' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            All Products ({products.length})
          </button>
          <button
            onClick={() => setFilterType('ebook')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-all cursor-pointer ${
              filterType === 'ebook' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            E-Books
          </button>
          <button
            onClick={() => setFilterType('course')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-all cursor-pointer ${
              filterType === 'course' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            Masterclasses
          </button>
          <button
            onClick={() => setFilterType('audio')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-all cursor-pointer ${
              filterType === 'audio' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            Audio Guides
          </button>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search guides, topics..."
            className="w-full pl-9 pr-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white outline-none focus:border-amber-500 text-xs"
          />
        </div>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProducts.map((prod) => {
          const isPurchased = purchasedProductIds.has(prod.id);

          return (
            <div
              key={prod.id}
              className="luxury-card rounded-2xl overflow-hidden border border-slate-800 hover:border-amber-500/40 flex flex-col justify-between transition-all shadow-xl group"
            >
              {/* Cover & Badges */}
              <div className="relative h-48 w-full overflow-hidden bg-slate-950">
                <img
                  src={prod.cover_url}
                  alt={prod.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 filter brightness-90"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0a0e19] via-transparent to-black/30" />
                
                <div className="absolute top-3 left-3 flex items-center space-x-1.5">
                  <span className={`text-[10px] font-mono uppercase tracking-wider px-2.5 py-0.5 rounded-full font-bold shadow-md ${
                    prod.type === 'ebook' ? 'bg-amber-500 text-slate-950' :
                    prod.type === 'course' ? 'bg-emerald-500 text-slate-950' :
                    'bg-pink-500 text-white'
                  }`}>
                    {prod.type.toUpperCase()}
                  </span>
                </div>

                <div className="absolute top-3 right-3">
                  <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-lg bg-black/80 backdrop-blur-md text-amber-300 border border-amber-500/40">
                    ${prod.price}
                  </span>
                </div>

                <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-[11px] text-slate-300">
                  <span className="flex items-center space-x-1 text-emerald-400 font-medium">
                    <Star className="w-3.5 h-3.5 fill-current" />
                    <span>4.9 (Top Rated)</span>
                  </span>
                  <span className="font-mono text-slate-400">{prod.sales} copies downloaded</span>
                </div>
              </div>

              {/* Product Info */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-4 text-xs">
                <div className="space-y-1.5">
                  <h3 className="font-bold text-base font-serif-luxury text-white group-hover:text-amber-300 transition-colors leading-snug">
                    {prod.title}
                  </h3>
                  {prod.subtitle && (
                    <p className="text-[11px] text-amber-400/90 font-medium leading-tight">
                      {prod.subtitle}
                    </p>
                  )}
                  <p className="text-slate-300 text-xs line-clamp-3 leading-relaxed pt-1">
                    {prod.description}
                  </p>
                </div>

                {prod.key_benefits && (
                  <div className="space-y-1 border-t border-slate-800/80 pt-3">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">What You Will Master:</span>
                    <ul className="space-y-0.5 text-[11px] text-slate-300">
                      {prod.key_benefits.slice(0, 2).map((benefit, bIdx) => (
                        <li key={bIdx} className="flex items-start space-x-1.5">
                          <Check className="w-3 h-3 text-emerald-400 shrink-0 mt-0.5" />
                          <span>{benefit}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Actions */}
                <div className="pt-2 border-t border-slate-800 flex items-center justify-between gap-2">
                  <button
                    onClick={() => setPreviewProduct(prod)}
                    className="px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs font-semibold flex items-center space-x-1 cursor-pointer"
                  >
                    <Eye className="w-3.5 h-3.5 text-amber-400" />
                    <span>Excerpt</span>
                  </button>

                  {isPurchased ? (
                    <a
                      href={prod.file_url}
                      target="_blank"
                      rel="noreferrer"
                      className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center space-x-1.5 shadow-md shadow-emerald-500/20 cursor-pointer"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Download PDF</span>
                    </a>
                  ) : (
                    <button
                      onClick={() => setCheckoutProduct(prod)}
                      className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-400 to-amber-600 hover:brightness-110 text-slate-950 font-bold text-xs flex items-center space-x-1.5 shadow-md shadow-amber-500/20 cursor-pointer"
                    >
                      <span>Buy Now &bull; ${prod.price}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>

            </div>
          );
        })}
      </div>

      {/* Excerpt Reader Modal */}
      {previewProduct && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0b0e17] border border-amber-500/50 rounded-2xl max-w-2xl w-full p-6 shadow-2xl space-y-4 max-h-[85vh] overflow-y-auto text-xs">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <span className="text-[10px] uppercase font-mono text-amber-400 font-bold">Chapter Preview</span>
                <h3 className="font-bold text-white text-base font-serif-luxury">{previewProduct.title}</h3>
              </div>
              <button 
                onClick={() => setPreviewProduct(null)}
                className="text-slate-400 hover:text-white text-xl cursor-pointer"
              >
                &times;
              </button>
            </div>

            {previewProduct.chapters_outline && (
              <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2">
                <span className="font-bold text-amber-300 text-xs">Table of Contents:</span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
                  {previewProduct.chapters_outline.map(ch => (
                    <div key={ch.chapter_number} className="text-slate-300">
                      <strong>Ch {ch.chapter_number}:</strong> {ch.title}
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="bg-[#070912] p-5 rounded-xl border border-slate-800 text-slate-200 whitespace-pre-wrap leading-relaxed text-xs">
              {previewProduct.full_chapter_sample || 
                `Chapter 1: The Sovereign Mindset Shift\n\nMost women are taught to chase or perform. In sovereign circles, performance is immediately recognized as insecurity. A man who has built enterprises or inherited generational legacy doesn't want another person auditioning for his approval. He desires a sanctuary of calm, sharp intellect, and radiant confidence...\n\nWhen you master this polarity, courtship shifts completely from uncertainty to deep, chivalrous devotion.`}
            </div>

            <div className="pt-2 flex items-center justify-between">
              <span className="text-slate-400 text-xs">Full edition: ${previewProduct.price} &bull; Instant Download</span>
              <button
                onClick={() => {
                  const target = previewProduct;
                  setPreviewProduct(null);
                  setCheckoutProduct(target);
                }}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-bold text-xs cursor-pointer"
              >
                Unlock Full Book (${previewProduct.price})
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Stripe / Paystack Digital Product Checkout Modal */}
      {checkoutProduct && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0b0e17] border border-amber-500/50 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4 text-xs">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center space-x-2">
                <Lock className="w-4 h-4 text-emerald-400" />
                <h3 className="font-bold text-white text-sm">Instant Digital Delivery</h3>
              </div>
              <button 
                onClick={() => setCheckoutProduct(null)}
                className="text-slate-400 hover:text-white text-lg cursor-pointer"
              >
                &times;
              </button>
            </div>

            {purchasedProductIds.has(checkoutProduct.id) ? (
              <div className="space-y-4 text-center py-4">
                <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 mx-auto flex items-center justify-center">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <div className="space-y-1">
                  <h4 className="font-bold text-white text-base">Payment Confirmed!</h4>
                  <p className="text-xs text-slate-300">Your digital asset is ready for instant download.</p>
                </div>
                <a
                  href={checkoutProduct.file_url}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center justify-center space-x-2 shadow-lg"
                >
                  <Download className="w-4 h-4" />
                  <span>Download "{checkoutProduct.title}" (PDF)</span>
                </a>
              </div>
            ) : (
              <>
                <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-1 text-xs">
                  <div className="flex justify-between text-slate-300">
                    <span className="font-semibold text-white">{checkoutProduct.title}</span>
                    <span className="font-bold font-mono text-emerald-400">${checkoutProduct.price}.00</span>
                  </div>
                  <p className="text-[11px] text-slate-400">{checkoutProduct.subtitle || checkoutProduct.type}</p>
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Your Full Name</label>
                    <input
                      type="text"
                      value={buyerName}
                      onChange={(e) => setBuyerName(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white outline-none focus:border-amber-500"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Email for Delivery</label>
                    <input
                      type="email"
                      value={buyerEmail}
                      onChange={(e) => setBuyerEmail(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white outline-none focus:border-amber-500"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-slate-300 font-semibold">Select Payment Gateway:</label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setSelectedGateway('Stripe')}
                      className={`p-2.5 rounded-xl border font-bold flex items-center justify-center space-x-1.5 transition-all cursor-pointer ${
                        selectedGateway === 'Stripe'
                          ? 'bg-amber-500/20 text-amber-300 border-amber-500'
                          : 'bg-slate-900 text-slate-400 border-slate-800'
                      }`}
                    >
                      <CreditCard className="w-4 h-4" />
                      <span>Stripe</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setSelectedGateway('Paystack')}
                      className={`p-2.5 rounded-xl border font-bold flex items-center justify-center space-x-1.5 transition-all cursor-pointer ${
                        selectedGateway === 'Paystack'
                          ? 'bg-amber-500/20 text-amber-300 border-amber-500'
                          : 'bg-slate-900 text-slate-400 border-slate-800'
                      }`}
                    >
                      <CreditCard className="w-4 h-4" />
                      <span>Paystack</span>
                    </button>
                  </div>
                </div>

                <button
                  type="button"
                  disabled={isProcessingCheckout}
                  onClick={handleCompletePurchase}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 hover:brightness-110 text-slate-950 font-bold text-xs transition-all flex items-center justify-center space-x-2 cursor-pointer disabled:opacity-50"
                >
                  {isProcessingCheckout ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Authorizing ${checkoutProduct.price} with {selectedGateway}...</span>
                    </>
                  ) : (
                    <>
                      <Lock className="w-3.5 h-3.5" />
                      <span>Confirm &amp; Download (${checkoutProduct.price})</span>
                    </>
                  )}
                </button>
              </>
            )}
          </div>
        </div>
      )}

      {/* AI Create Product Modal */}
      {showAiCreateModal && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0b0e17] border border-amber-500/50 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4 text-xs">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center space-x-2">
                <Sparkles className="w-5 h-5 text-amber-400" />
                <h3 className="font-bold text-white text-sm font-serif-luxury">
                  AI Product Generator (Gemini 3.8 Flash)
                </h3>
              </div>
              <button 
                onClick={() => setShowAiCreateModal(false)}
                className="text-slate-400 hover:text-white text-lg cursor-pointer"
              >
                &times;
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Select Topic or Type Custom</label>
                <input
                  type="text"
                  value={aiTopic}
                  onChange={(e) => setAiTopic(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white outline-none focus:border-amber-500 mb-1.5"
                />
                <div className="space-y-1">
                  <span className="text-[10px] text-slate-400">Popular High-Ticket Topics:</span>
                  <div className="flex flex-wrap gap-1">
                    {PRESET_TOPICS.map((top, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setAiTopic(top)}
                        className="text-[9px] px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-amber-300 transition-colors text-left"
                      >
                        {top.slice(0, 32)}...
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Format Type</label>
                  <select
                    value={aiProductType}
                    onChange={(e) => setAiProductType(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white outline-none focus:border-amber-500"
                  >
                    <option value="ebook">E-Book (PDF Guide)</option>
                    <option value="course">Masterclass Course</option>
                    <option value="audio">Audio Masterclass</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Price ($USD)</label>
                  <input
                    type="number"
                    value={aiPrice}
                    onChange={(e) => setAiPrice(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white outline-none focus:border-amber-500"
                  />
                </div>
              </div>
            </div>

            <button
              type="button"
              disabled={isGeneratingProduct}
              onClick={handleAiCreateProduct}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 hover:brightness-110 text-slate-950 font-bold text-xs transition-all flex items-center justify-center space-x-2 cursor-pointer disabled:opacity-50"
            >
              {isGeneratingProduct ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Drafting Curriculum, Chapters &amp; Cover with Gemini...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Generate &amp; Publish to Marketplace</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
