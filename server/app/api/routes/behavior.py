from fastapi import APIRouter
from pydantic import BaseModel
from typing import List, Optional
from app.services.deep_analyzer import DeepAnalyzer
from app.services.profile_builder import ProfileBuilder
from app.models.ml_models.intent_classifier import IntentClassifier
from app.models.ml_models.recommender import ProductRecommender

router = APIRouter()
analyzer = DeepAnalyzer()
profile_builder = ProfileBuilder()
intent_classifier = IntentClassifier()
recommender = ProductRecommender()

class RawBehaviorData(BaseModel):
    api_key: str
    session_id: str
    page_url: str
    referrer: Optional[str] = ""
    device: dict
    duration_seconds: int
    total_clicks: int
    total_mouse_moves: int
    max_scroll_depth: float
    total_hovers: int
    clicks: List[dict] = []
    mouse_path_sample: List[dict] = []
    scroll_samples: List[dict] = []
    hover_samples: List[dict] = []

@router.post("/collect")
async def collect_behavior(data: RawBehaviorData):
    """
    دریافت داده‌های خام از Client
    تمام تحلیل‌ها اینجا انجام میشه!
    """
    
    print(f"📥 Received raw data: {data.session_id}")
    print(f"   Clicks: {data.total_clicks}, Mouse: {data.total_mouse_moves}, Hovers: {data.total_hovers}")
    
    # ===== ۱. تحلیل الگوی موس =====
    mouse_analysis = analyzer.analyze_mouse(
        path=data.mouse_path_sample,
        hovers=data.hover_samples
    )
    
    # ===== ۲. تحلیل کلیک‌ها =====
    click_analysis = analyzer.analyze_clicks(data.clicks)
    
    # ===== ۳. ساخت feature vector برای ML =====
    features = {
        "total_clicks": data.total_clicks,
        "total_hovers": data.total_hovers,
        "max_scroll_depth": data.max_scroll_depth,
        "duration_seconds": data.duration_seconds,
        "mouse_speed_avg": mouse_analysis.get("avg_speed", 0),
        "mouse_hesitation_ratio": mouse_analysis.get("hesitation_ratio", 0),
        "click_diversity": click_analysis.get("unique_targets", 0),
        "price_clicks": click_analysis.get("price_related", 0),
        "review_clicks": click_analysis.get("review_related", 0),
        "device_type": "mobile" if "Mobile" in data.device.get("user_agent", "") else "desktop",
        "time_of_day": "morning",  # از timestamp استخراج کن
    }
    
    # ===== ۴. پیش‌بینی با ML =====
    intent_result = intent_classifier.predict(features)
    # {
    #   "purchase_probability": 0.87,
    #   "decision_stage": "ready_to_buy",
    #   "estimated_budget": "premium"
    # }
    
    # ===== ۵. ساخت پروفایل کاربر =====
    user_profile = profile_builder.build(
        api_key=data.api_key,
        session_data=data,
        intent=intent_result
    )
    
    # ===== ۶. پیشنهاد محصول =====
    recommendations = recommender.get_recommendations(
        profile=user_profile,
        intent=intent_result,
        limit=5
    )
    
    # ===== ۷. برگشت نتیجه کامل =====
    return {
        "status": "success",
        "analysis": {
            "session_id": data.session_id,
            "behavior": {
                "pattern": mouse_analysis.get("pattern", "unknown"),
                "engagement_level": intent_result.get("engagement", 0),
                "attention_span": f"{data.duration_seconds}s"
            },
            "intent": {
                "purchase_probability": intent_result.get("purchase_probability", 0),
                "decision_stage": intent_result.get("decision_stage", "browsing"),
                "estimated_budget": intent_result.get("estimated_budget", "unknown"),
                "ready_to_buy": intent_result.get("purchase_probability", 0) > 0.7
            },
            "recommendations": recommendations,
            "model_version": "1.0.0",
            "analyzed_at": "2026-05-30T..."
        }
    }