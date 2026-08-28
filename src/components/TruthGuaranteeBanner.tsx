import { ShieldCheck, CheckCircle2, Award, Sparkles, Check } from 'lucide-react';

export function TruthGuaranteeBanner() {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-emerald-200/80 bg-gradient-to-r from-emerald-50/90 via-teal-50/60 to-emerald-50/90 p-5 sm:p-6 text-emerald-950 shadow-xs">
      {/* Background soft glow accent */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-100/40 rounded-full blur-3xl pointer-events-none -z-0" />

      <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
        <div className="flex items-start gap-4">
          <div className="w-11 h-11 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-md shadow-emerald-600/20">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <h4 className="font-extrabold text-emerald-950 text-sm sm:text-base tracking-tight">
                Strict Factual Integrity Protocol
              </h4>
              <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-600 text-white shadow-2xs">
                Zero Hallucinations
              </span>
            </div>
            <p className="text-xs sm:text-sm text-emerald-800/90 leading-relaxed max-w-2xl">
              We never fabricate past companies, degrees, dates, unheld certifications, or exaggerated metrics. Your authentic career achievements are reframed with high-impact power verbs and recruiter keywords.
            </p>
          </div>
        </div>

        {/* 3 Trust Pillars */}
        <div className="flex flex-wrap md:flex-col lg:flex-row items-stretch gap-2.5 shrink-0 w-full md:w-auto">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/80 border border-emerald-200/70 text-xs font-semibold text-emerald-900 shadow-2xs">
            <Check className="w-3.5 h-3.5 text-emerald-600" />
            <span>100% Real History</span>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/80 border border-emerald-200/70 text-xs font-semibold text-emerald-900 shadow-2xs">
            <Award className="w-3.5 h-3.5 text-emerald-600" />
            <span>Google XYZ Impact</span>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/80 border border-emerald-200/70 text-xs font-semibold text-emerald-900 shadow-2xs">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            <span>ATS-Friendly Syntax</span>
          </div>
        </div>
      </div>
    </div>
  );
}
