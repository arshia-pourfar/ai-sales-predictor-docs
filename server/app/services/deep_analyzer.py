import numpy as np
from typing import Dict, List

class DeepAnalyzer:
    
    def analyze_mouse(self, path: List[Dict], hovers: List[Dict]) -> Dict:
        """تحلیل عمیق حرکات موس"""
        if not path or len(path) < 5:
            return {"pattern": "unknown", "avg_speed": 0, "hesitation_ratio": 0}
        
        speeds = []
        for i in range(1, len(path)):
            dx = path[i]["x"] - path[i-1]["x"]
            dy = path[i]["y"] - path[i-1]["y"]
            dt = max(path[i]["time"] - path[i-1]["time"], 1)
            speed = np.sqrt(dx**2 + dy**2) / dt
            speeds.append(speed)
        
        avg_speed = np.mean(speeds)
        max_speed = np.max(speeds)
        
        # تشخیص توقف (hesitation)
        slow_moves = sum(1 for s in speeds if s < 0.05)
        hesitation_ratio = slow_moves / len(speeds)
        
        # تشخیص الگو
        if hesitation_ratio > 0.4 and len(hovers) > 3:
            pattern = "مقایسه‌گر دقیق"
        elif max_speed > 1.5:
            pattern = "مرور سریع"
        elif hesitation_ratio > 0.2:
            pattern = "مقایسه‌گر"
        else:
            pattern = "مرورگر عادی"
        
        return {
            "pattern": pattern,
            "avg_speed": round(avg_speed, 3),
            "max_speed": round(max_speed, 3),
            "hesitation_ratio": round(hesitation_ratio, 2),
            "total_hovers": len(hovers)
        }
    
    def analyze_clicks(self, clicks: List[Dict]) -> Dict:
        """تحلیل کلیک‌ها"""
        if not clicks:
            return {"unique_targets": 0, "price_related": 0, "review_related": 0}
        
        # تعداد المان‌های یکتا
        unique_targets = len(set(c.get("text", "") for c in clicks))
        
        # کلیک‌های مرتبط با قیمت
        price_keywords = ["price", "قیمت", "تومان", "تخفیف", "discount", "$"]
        price_related = sum(
            1 for c in clicks 
            if any(kw in (c.get("text", "") + c.get("className", "")).lower() for kw in price_keywords)
        )
        
        # کلیک‌های مرتبط با نظرات
        review_keywords = ["review", "نظر", "rating", "امتیاز", "ستاره"]
        review_related = sum(
            1 for c in clicks 
            if any(kw in (c.get("text", "") + c.get("className", "")).lower() for kw in review_keywords)
        )
        
        return {
            "unique_targets": unique_targets,
            "price_related": price_related,
            "review_related": review_related,
            "total_clicks": len(clicks)
        }