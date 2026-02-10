import { Github, Twitter, Globe, ExternalLink } from "lucide-react";

export function Footer() {
  return (
    <footer className="w-full border-t border-border/40 bg-background/50 backdrop-blur-sm py-4 mt-auto">
      <div className="container flex flex-col md:flex-row justify-between items-center gap-4 px-6">
        
        {/* Sol Kısım: Copyright & Version */}
        <div className="flex items-center gap-3 text-[12px] text-muted-foreground">
          <span className="font-medium text-foreground/80">© 2026 KeyType</span>
          <span className="w-1 h-1 rounded-full bg-border" />
          <span>v1.2.0-stable</span>
        </div>

        {/* Orta Kısım: Linkler */}
        <div className="flex items-center gap-6">
          <a href="/dashboard/help" className="text-[12px] text-muted-foreground hover:text-primary transition-colors flex items-center gap-1">
            Help Center <ExternalLink className="w-3 h-3" />
          </a>
          <a href="#" className="text-[12px] text-muted-foreground hover:text-primary transition-colors">Privacy</a>
          <a href="#" className="text-[12px] text-muted-foreground hover:text-primary transition-colors">Terms</a>
        </div>

        {/* Sağ Kısım: Sosyal Medya & Durum */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3 border-r border-border pr-4 mr-1">
            <Github className="w-4 h-4 text-muted-foreground hover:text-foreground cursor-pointer transition-colors" />
            <Twitter className="w-4 h-4 text-muted-foreground hover:text-foreground cursor-pointer transition-colors" />
            <Globe className="w-4 h-4 text-muted-foreground hover:text-foreground cursor-pointer transition-colors" />
          </div>
          {/* Sistem Durumu Lambası */}
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-[11px] font-bold uppercase tracking-tighter text-green-500">Systems Online</span>
          </div>
        </div>

      </div>
    </footer>
  );
}