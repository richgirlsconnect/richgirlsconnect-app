import React, { useState } from 'react';
import { X, Rocket, Copy, Check, ExternalLink, Terminal, ShieldAlert } from 'lucide-react';

interface DeployModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DeployModal: React.FC<DeployModalProps> = ({ isOpen, onClose }) => {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  if (!isOpen) return null;

  const copySnippet = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const gitSnippet = `git init
git add .
git commit -m "Deploy RichConnect AI CRM"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/richconnect-ai.git
git push -u origin main`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm">
      <div className="luxury-card rounded-2xl max-w-2xl w-full p-6 space-y-5 max-h-[90vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-amber-500/20 pb-3">
          <div className="flex items-center space-x-2">
            <Rocket className="w-5 h-5 text-amber-400" />
            <h3 className="text-base font-serif-luxury font-bold text-slate-100">
              How to Push to GitHub & Deploy to Vercel (Free Tier)
            </h3>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step 1 */}
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <span className="w-6 h-6 rounded-full bg-amber-500/20 text-amber-300 font-bold text-xs flex items-center justify-center border border-amber-500/40">
              1
            </span>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200">
              Push Repository to GitHub
            </h4>
          </div>
          <p className="text-xs text-slate-400 ml-8">
            Create a private repository on GitHub, then run these commands in your project root:
          </p>

          <div className="ml-8 relative">
            <pre className="p-3.5 rounded-xl bg-[#05070a] border border-slate-800 text-[11px] font-mono text-amber-200 overflow-x-auto">
              {gitSnippet}
            </pre>
            <button
              onClick={() => copySnippet(gitSnippet, 1)}
              className="absolute top-2.5 right-2.5 px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-xs text-slate-300 flex items-center space-x-1"
            >
              {copiedIndex === 1 ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
              <span>{copiedIndex === 1 ? 'Copied' : 'Copy'}</span>
            </button>
          </div>
        </div>

        {/* Step 2 */}
        <div className="space-y-2 pt-2 border-t border-slate-800">
          <div className="flex items-center space-x-2">
            <span className="w-6 h-6 rounded-full bg-amber-500/20 text-amber-300 font-bold text-xs flex items-center justify-center border border-amber-500/40">
              2
            </span>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200">
              Import to Vercel & Configure Environment Variables
            </h4>
          </div>
          <p className="text-xs text-slate-400 ml-8">
            Go to <a href="https://vercel.com/new" target="_blank" rel="noopener noreferrer" className="text-amber-400 underline">vercel.com/new</a>, import your repo, and paste these environment variables:
          </p>

          <div className="ml-8 overflow-hidden rounded-xl border border-slate-800">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-900 text-slate-300 uppercase text-[10px]">
                <tr>
                  <th className="p-2.5">Variable Key</th>
                  <th className="p-2.5">Value / Description</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80 bg-black/40 text-slate-300 font-mono text-[11px]">
                <tr>
                  <td className="p-2.5 text-amber-300 font-bold">MY_PRIVATE_PASSWORD</td>
                  <td className="p-2.5 font-sans text-xs">Your private password (e.g. royalty2026)</td>
                </tr>
                <tr>
                  <td className="p-2.5 text-amber-300 font-bold">GEMINI_API_KEY</td>
                  <td className="p-2.5 font-sans text-xs">Your Google Gemini API Key</td>
                </tr>
                <tr>
                  <td className="p-2.5 text-slate-300">NEXT_PUBLIC_SUPABASE_URL</td>
                  <td className="p-2.5 font-sans text-xs">Supabase Project URL (optional)</td>
                </tr>
                <tr>
                  <td className="p-2.5 text-slate-300">NEXT_PUBLIC_SUPABASE_ANON_KEY</td>
                  <td className="p-2.5 font-sans text-xs">Supabase Public Anon Key (optional)</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Step 3 */}
        <div className="space-y-2 pt-2 border-t border-slate-800">
          <div className="flex items-center space-x-2">
            <span className="w-6 h-6 rounded-full bg-amber-500/20 text-amber-300 font-bold text-xs flex items-center justify-center border border-amber-500/40">
              3
            </span>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200">
              Deploy & Access Private Vault
            </h4>
          </div>
          <p className="text-xs text-slate-400 ml-8 leading-relaxed">
            Click <strong>Deploy</strong> on Vercel. Your build will use <code className="text-amber-400 font-mono">vercel.json</code> and <code className="text-amber-400 font-mono">next.config.mjs</code>. 
            Once live, open your URL, unlock with your private passcode, and enjoy your AI-powered CRM!
          </p>
        </div>

        <div className="flex justify-between items-center text-xs text-slate-500 pt-3 border-t border-slate-800">
          <a
            href="https://vercel.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-amber-400 hover:underline flex items-center space-x-1"
          >
            <span>Open Vercel Dashboard</span>
            <ExternalLink className="w-3 h-3" />
          </a>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg text-slate-300 hover:bg-slate-800"
          >
            Got It
          </button>
        </div>

      </div>
    </div>
  );
};
