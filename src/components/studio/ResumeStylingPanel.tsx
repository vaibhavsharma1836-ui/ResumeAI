import React from 'react';
import { Palette, Type, LayoutGrid, Sliders, Check, Sparkles, Wand2 } from 'lucide-react';
import { StructuredResume, ResumeFont, SpacingDensity, HeaderStyle } from '../../types';

interface ResumeStylingPanelProps {
  resume: StructuredResume;
  onChange: (updated: StructuredResume) => void;
  onClose?: () => void;
}

export const COLOR_PALETTES = [
  { name: 'Indigo Pro', value: '#4f46e5', bg: 'bg-indigo-600' },
  { name: 'Classic Emerald', value: '#059669', bg: 'bg-emerald-600' },
  { name: 'Executive Navy', value: '#1e3a8a', bg: 'bg-blue-900' },
  { name: 'Crimson Tech', value: '#dc2626', bg: 'bg-red-600' },
  { name: 'Modern Teal', value: '#0d9488', bg: 'bg-teal-600' },
  { name: 'Royal Violet', value: '#7c3aed', bg: 'bg-purple-600' },
  { name: 'Amber Gold', value: '#d97706', bg: 'bg-amber-600' },
  { name: 'Slate Minimal', value: '#334155', bg: 'bg-slate-700' },
  { name: 'Charcoal Obsidian', value: '#18181b', bg: 'bg-zinc-900' },
];

export const FONT_OPTIONS: { id: ResumeFont; name: string; previewClass: string; desc: string }[] = [
  { id: 'sans', name: 'Plus Jakarta Sans', previewClass: 'font-sans', desc: 'Clean, modern tech standard' },
  { id: 'serif', name: 'Newsreader Serif', previewClass: 'font-serif-resume', desc: 'Editorial, legal & academic' },
  { id: 'outfit', name: 'Outfit Geometric', previewClass: 'font-outfit', desc: 'Contemporary, sleek & crisp' },
  { id: 'playfair', name: 'Playfair Display', previewClass: 'font-playfair', desc: 'Authoritative luxury serif' },
  { id: 'mono', name: 'JetBrains Mono', previewClass: 'font-mono-code', desc: 'Developer & systems engineering' },
];

export const SPACING_OPTIONS: { id: SpacingDensity; name: string; desc: string }[] = [
  { id: 'compact', name: 'Compact (Fit 1-Page)', desc: 'Tighter line heights and padding to fit on 1 single page' },
  { id: 'normal', name: 'Standard Balanced', desc: 'Standard comfortable spacing for general applications' },
  { id: 'spacious', name: 'Spacious / Relaxed', desc: 'Generous negative space for multi-page executive profiles' },
];

export const HEADER_STYLES: { id: HeaderStyle; name: string; desc: string }[] = [
  { id: 'accent-bar', name: 'Left Accent Bar', desc: 'Thick color bar with crisp uppercase title' },
  { id: 'underline', name: 'Underline Accent', desc: 'Classic horizontal line with accent color' },
  { id: 'pill', name: 'Pill / Badge Tag', desc: 'Rounded badge with subtle background color' },
  { id: 'shaded', name: 'Shaded Header Strip', desc: 'Full width tinted background bar' },
  { id: 'minimal', name: 'Minimal Dot', desc: 'Subtle minimalist typography without heavy lines' },
];

export const ResumeStylingPanel: React.FC<ResumeStylingPanelProps> = ({
  resume,
  onChange,
  onClose,
}) => {
  const currentAccent = resume.accentColor || '#4f46e5';
  const currentFont = resume.fontFamily || 'sans';
  const currentDensity = resume.spacingDensity || 'normal';
  const currentHeaderStyle = resume.headerStyle || 'underline';

  const handleColorChange = (color: string) => {
    onChange({ ...resume, accentColor: color });
  };

  const handleFontChange = (font: ResumeFont) => {
    onChange({ ...resume, fontFamily: font });
  };

  const handleDensityChange = (density: SpacingDensity) => {
    onChange({ ...resume, spacingDensity: density });
  };

  const handleHeaderStyleChange = (style: HeaderStyle) => {
    onChange({ ...resume, headerStyle: style });
  };

  const handleAutoFitOnePage = () => {
    onChange({
      ...resume,
      spacingDensity: 'compact',
      fontFamily: resume.fontFamily || 'sans',
    });
  };

  return (
    <div className="p-5 space-y-6 text-slate-800">
      {/* Auto-Fit 1 Page Quick Action */}
      <div className="p-3.5 bg-indigo-50/80 border border-indigo-200 rounded-xl flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center shrink-0">
            <Wand2 className="w-4 h-4" />
          </div>
          <div>
            <div className="text-xs font-bold text-indigo-950">Fit to 1 Page Optimization</div>
            <div className="text-[11px] text-indigo-700">Auto-tune density to keep your resume on a single page</div>
          </div>
        </div>
        <button
          onClick={handleAutoFitOnePage}
          className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-lg shadow-xs transition-all whitespace-nowrap"
        >
          Auto-Fit 1 Page
        </button>
      </div>

      {/* 1. Accent Color */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-900 flex items-center gap-1.5">
            <Palette className="w-3.5 h-3.5 text-indigo-600" />
            Accent Palette
          </label>
          <span className="text-[11px] text-slate-500 font-mono">{currentAccent}</span>
        </div>
        <div className="grid grid-cols-5 sm:grid-cols-9 gap-2">
          {COLOR_PALETTES.map((color) => {
            const isSelected = currentAccent.toLowerCase() === color.value.toLowerCase();
            return (
              <button
                key={color.value}
                onClick={() => handleColorChange(color.value)}
                title={color.name}
                className={`w-9 h-9 rounded-xl ${color.bg} flex items-center justify-center transition-all shadow-xs relative ${
                  isSelected ? 'ring-3 ring-indigo-500/40 scale-110' : 'hover:scale-105 opacity-90'
                }`}
              >
                {isSelected && <Check className="w-4 h-4 text-white drop-shadow-md" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Font Typography */}
      <div className="space-y-2.5">
        <label className="text-xs font-bold uppercase tracking-wider text-slate-900 flex items-center gap-1.5">
          <Type className="w-3.5 h-3.5 text-indigo-600" />
          Typography & Font
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {FONT_OPTIONS.map((font) => {
            const isSelected = currentFont === font.id;
            return (
              <button
                key={font.id}
                onClick={() => handleFontChange(font.id)}
                className={`p-3 rounded-xl border text-left transition-all flex items-center justify-between ${
                  isSelected
                    ? 'border-indigo-600 bg-indigo-50/50 shadow-xs'
                    : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                }`}
              >
                <div>
                  <div className={`text-sm font-bold text-slate-900 ${font.previewClass}`}>
                    {font.name}
                  </div>
                  <div className="text-[11px] text-slate-500">{font.desc}</div>
                </div>
                {isSelected && <Check className="w-4 h-4 text-indigo-600 shrink-0 ml-2" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Spacing Density */}
      <div className="space-y-2.5">
        <label className="text-xs font-bold uppercase tracking-wider text-slate-900 flex items-center gap-1.5">
          <Sliders className="w-3.5 h-3.5 text-indigo-600" />
          Layout Density & Spacing
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          {SPACING_OPTIONS.map((density) => {
            const isSelected = currentDensity === density.id;
            return (
              <button
                key={density.id}
                onClick={() => handleDensityChange(density.id)}
                className={`p-3 rounded-xl border text-left transition-all ${
                  isSelected
                    ? 'border-indigo-600 bg-indigo-50/50 shadow-xs'
                    : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                }`}
              >
                <div className="text-xs font-bold text-slate-900 flex items-center justify-between">
                  <span>{density.name}</span>
                  {isSelected && <Check className="w-3.5 h-3.5 text-indigo-600" />}
                </div>
                <div className="text-[11px] text-slate-500 mt-1">{density.desc}</div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 4. Section Header Style */}
      <div className="space-y-2.5">
        <label className="text-xs font-bold uppercase tracking-wider text-slate-900 flex items-center gap-1.5">
          <LayoutGrid className="w-3.5 h-3.5 text-indigo-600" />
          Section Header Design
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {HEADER_STYLES.map((style) => {
            const isSelected = currentHeaderStyle === style.id;
            return (
              <button
                key={style.id}
                onClick={() => handleHeaderStyleChange(style.id)}
                className={`p-3 rounded-xl border text-left transition-all flex items-center justify-between ${
                  isSelected
                    ? 'border-indigo-600 bg-indigo-50/50 shadow-xs'
                    : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                }`}
              >
                <div>
                  <div className="text-xs font-bold text-slate-900">{style.name}</div>
                  <div className="text-[11px] text-slate-500">{style.desc}</div>
                </div>
                {isSelected && <Check className="w-4 h-4 text-indigo-600 shrink-0 ml-2" />}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
