# app/services/profile_builder.py

from typing import Dict
from datetime import datetime

class ProfileBuilder:
    def __init__(self):
        self.user_profiles = {}  # در واقعیت از دیتابیس میاد
    
    def build(self, api_key: str, session_data: Dict, intent: Dict) -> Dict:
        """
        ساخت پروفایل کاربر بر اساس داده‌های session
        """
        
        # استخراج اطلاعات از session
        clicks = session_data.clicks if hasattr(session_data, 'clicks') else session_data.get('clicks', [])
        device = session_data.device if hasattr(session_data, 'device') else session_data.get('device', {})
        
        # تشخیص علایق از کلیک‌ها
        interests = self._extract_interests(clicks)
        
        # تشخیص بودجه از رفتار
        budget = self._estimate_budget(intent, session_data)
        
        # ساخت پروفایل
        profile = {
            "api_key": api_key,
            "session_id": session_data.session_id if hasattr(session_data, 'session_id') else session_data.get('session_id'),
            "interests": interests,
            "budget_range": budget,
            "device_type": "mobile" if "Mobile" in device.get("user_agent", "") else "desktop",
            "engagement_score": self._calculate_engagement(session_data),
            "last_seen": datetime.now().isoformat(),
            "purchase_history": [],  # از دیتابیس پر میشه
            "preferred_categories": interests[:3],
            "price_sensitivity": "high" if intent.get("purchase_probability", 0) < 0.5 else "low"
        }
        
        # ذخیره پروفایل (در واقعیت توی دیتابیس)
        self.user_profiles[api_key] = profile
        
        return profile
    
    def _extract_interests(self, clicks: list) -> list:
        """استخراج علایق از کلیک‌ها"""
        interests = set()
        
        category_keywords = {
            "گیمینگ": ["gaming", "گیم", "mouse", "keyboard", "هدفون"],
            "موبایل": ["mobile", "گوشی", "phone", "apple", "samsung"],
            "لپ‌تاپ": ["laptop", "لپتاپ", "notebook", "macbook"],
            "لوازم جانبی": ["case", "قاب", "charger", "شارژر", "کابل"],
        }
        
        for click in clicks:
            text = (click.get("text", "") + " " + click.get("className", "")).lower()
            for category, keywords in category_keywords.items():
                if any(kw in text for kw in keywords):
                    interests.add(category)
        
        return list(interests) if interests else ["عمومی"]
    
    def _estimate_budget(self, intent: Dict, session_data) -> str:
        """تخمین بودجه کاربر"""
        purchase_prob = intent.get("purchase_probability", 0)
        duration = session_data.duration_seconds if hasattr(session_data, 'duration_seconds') else session_data.get('duration_seconds', 0)
        clicks = session_data.total_clicks if hasattr(session_data, 'total_clicks') else session_data.get('total_clicks', 0)
        
        if purchase_prob > 0.8 and duration > 120:
            return "premium"
        elif purchase_prob > 0.5 or clicks > 10:
            return "mid_range"
        else:
            return "budget"
    
    def _calculate_engagement(self, session_data) -> float:
        """محاسبه امتیاز تعامل کاربر"""
        duration = session_data.duration_seconds if hasattr(session_data, 'duration_seconds') else session_data.get('duration_seconds', 0)
        clicks = session_data.total_clicks if hasattr(session_data, 'total_clicks') else session_data.get('total_clicks', 0)
        scroll = session_data.max_scroll_depth if hasattr(session_data, 'max_scroll_depth') else session_data.get('max_scroll_depth', 0)
        
        score = min(
            (duration / 300) * 0.3 +  # زمان (حداکثر ۵ دقیقه)
            (clicks / 20) * 0.4 +     # کلیک (حداکثر ۲۰ تا)
            (scroll / 100) * 0.3,     # اسکرول (حداکثر ۱۰۰٪)
            1.0
        )
        
        return round(score, 2)