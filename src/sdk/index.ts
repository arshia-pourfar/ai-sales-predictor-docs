// این فایل میشه پکیج npm
export class AITracker {
    private apiKey: string;
    private sessionId: string;
    private events: any[] = [];
    private apiUrl: string;
  
    constructor(config: { apiKey: string; apiUrl?: string }) {
      this.apiKey = config.apiKey;
      this.apiUrl = config.apiUrl || 'https://api.ai-sales.com/api/v1';
      this.sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      this.init();
    }
  
    private init() {
      this.trackMouse();
      this.trackScroll();
      this.trackClicks();
      
      // ارسال خلاصه قبل از بستن صفحه
      window.addEventListener('beforeunload', () => {
        this.sendSummary();
      });
    }
  
    // ===== ردیابی موس =====
    private trackMouse() {
      let mousePath: { x: number; y: number; time: number }[] = [];
      let lastTime = Date.now();
  
      document.addEventListener('mousemove', (e) => {
        mousePath.push({ x: e.clientX, y: e.clientY, time: Date.now() });
        
        // تحلیل هر ۲ ثانیه
        if (Date.now() - lastTime > 2000) {
          this.analyzeMousePath(mousePath);
          mousePath = [];
          lastTime = Date.now();
        }
      });
    }
  
    // ===== تحلیل الگوی موس (Local ML) =====
    private analyzeMousePath(path: { x: number; y: number; time: number }[]) {
      if (path.length < 10) return;
  
      // محاسبه سرعت
      const speeds = [];
      for (let i = 1; i < path.length; i++) {
        const dx = path[i].x - path[i-1].x;
        const dy = path[i].y - path[i-1].y;
        const dt = path[i].time - path[i-1].time;
        speeds.push(Math.sqrt(dx*dx + dy*dy) / Math.max(dt, 1));
      }
  
      const avgSpeed = speeds.reduce((a, b) => a + b, 0) / speeds.length;
      const maxSpeed = Math.max(...speeds);
      
      // تشخیص توقف (hesitation)
      const hesitations = speeds.filter(s => s < 0.1).length;
      const hesitationRatio = hesitations / speeds.length;
  
      // تشخیص الگو
      let pattern = "مرورگر عادی";
      if (avgSpeed < 0.3 && hesitationRatio > 0.3) {
        pattern = "مقایسه‌گر";
      } else if (maxSpeed > 2) {
        pattern = "جویای تخفیف";
      }
  
      this.events.push({
        type: 'mouse_analysis',
        pattern,
        avgSpeed,
        hesitationRatio,
        timestamp: Date.now()
      });
    }
  
    // ===== ردیابی اسکرول =====
    private trackScroll() {
      let lastScrollTime = Date.now();
      
      window.addEventListener('scroll', () => {
        const now = Date.now();
        if (now - lastScrollTime > 1000) {
          const scrollDepth = window.scrollY / (document.body.scrollHeight - window.innerHeight);
          
          this.events.push({
            type: 'scroll',
            depth: scrollDepth,
            timestamp: now
          });
          
          lastScrollTime = now;
        }
      });
    }
  
    // ===== ردیابی کلیک =====
    private trackClicks() {
      document.addEventListener('click', (e) => {
        const target = e.target as HTMLElement;
        
        this.events.push({
          type: 'click',
          target: target.tagName,
          className: target.className,
          id: target.id,
          text: target.textContent?.substring(0, 50),
          x: e.clientX,
          y: e.clientY,
          timestamp: Date.now()
        });
      });
    }
  
    // ===== ارسال خلاصه به سرور =====
    private async sendSummary() {
      // تحلیل نهایی روی کلاینت
      const summary = this.generateSummary();
      
      try {
        await fetch(`${this.apiUrl}/behavior/track`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-API-Key': this.apiKey,
          },
          body: JSON.stringify({
            session_id: this.sessionId,
            ...summary,
            total_events: this.events.length
          }),
        });
      } catch (error) {
        console.error('Failed to send analytics:', error);
      }
    }
  
    // ===== تولید خلاصه هوشمند =====
    private generateSummary() {
      const mouseAnalyses = this.events.filter(e => e.type === 'mouse_analysis');
      const clicks = this.events.filter(e => e.type === 'click');
      const scrolls = this.events.filter(e => e.type === 'scroll');
      
      // تشخیص الگوی کلی
      const patterns = mouseAnalyses.map(m => m.pattern);
      const mainPattern = this.getMostFrequent(patterns) || "مرورگر عادی";
      
      // محاسبه interest score
      const avgHesitation = mouseAnalyses.reduce((s, m) => s + m.hesitationRatio, 0) / mouseAnalyses.length;
      const clickCount = clicks.length;
      const maxScrollDepth = Math.max(...scrolls.map(s => s.depth), 0);
      
      let interestScore = 0.3;
      if (clickCount > 5) interestScore += 0.3;
      if (maxScrollDepth > 0.7) interestScore += 0.2;
      if (avgHesitation > 0.2) interestScore += 0.2;
      interestScore = Math.min(interestScore, 1);
      
      // تشخیص hot zones
      const hotZones = new Set<string>();
      clicks.forEach(c => {
        if (c.className?.includes('price')) hotZones.add('price');
        if (c.className?.includes('review')) hotZones.add('reviews');
        if (c.className?.includes('compare')) hotZones.add('compare');
      });
      
      return {
        pattern: mainPattern,
        interest_score: interestScore,
        hot_zones: Array.from(hotZones),
      };
    }
  
    private getMostFrequent(arr: string[]): string | null {
      if (arr.length === 0) return null;
      const counts = arr.reduce((acc, val) => {
        acc[val] = (acc[val] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);
      return Object.entries(counts).sort((a, b) => b[1] - a[1])[0][0];
    }
  }
  
  // اتوماتیک استارت میشه
  if (typeof window !== 'undefined') {
    (window as any).AITracker = AITracker;
  }