# app/models/ml_models/intent_classifier.py

import numpy as np

class IntentClassifier:
    def __init__(self):
        # در واقعیت: مدل Random Forest آموزش دیده
        # self.model = joblib.load('data/models/intent_model.pkl')
        pass
    
    def predict(self, features: dict) -> dict:
        """
        پیش‌بینی قصد خرید
        در نسخه واقعی از مدل ML استفاده میکنه
        """
        
        # Rule-based (موقت تا مدل واقعی train بشه)
        score = 0.0
        
        # کلیک‌ها
        score += min(features.get("total_clicks", 0) / 20, 1) * 0.3
        
        # hover ها (نشانه علاقه)
        score += min(features.get("total_hovers", 0) / 10, 1) * 0.25
        
        # اسکرول
        score += (features.get("max_scroll_depth", 0) / 100) * 0.2
        
        # زمان حضور
        score += min(features.get("duration_seconds", 0) / 300, 1) * 0.15
        
        # تنوع کلیک
        score += min(features.get("click_diversity", 0) / 5, 1) * 0.1
        
        purchase_probability = min(score, 0.95)
        
        # تشخیص مرحله
        if purchase_probability > 0.7:
            decision_stage = "ready_to_buy"
        elif purchase_probability > 0.4:
            decision_stage = "evaluating"
        else:
            decision_stage = "browsing"
        
        # تخمین بودجه
        if features.get("price_clicks", 0) > 3:
            budget = "premium"
        elif features.get("total_clicks", 0) > 5:
            budget = "mid_range"
        else:
            budget = "budget"
        
        return {
            "purchase_probability": round(purchase_probability, 2),
            "decision_stage": decision_stage,
            "estimated_budget": budget,
            "engagement": round(score, 2)
        }