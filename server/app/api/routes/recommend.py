from fastapi import APIRouter
from typing import Optional

router = APIRouter()

@router.post("/personalized")
async def get_recommendations(
    user_profile: dict,
    limit: Optional[int] = 3
):
    """
    پیشنهاد محصول شخصی‌سازی شده
    """
    # منطق Collaborative Filtering
    recommendations = [
        {"product": "محصول پیشنهادی ۱", "score": 0.95, "reason": "بر اساس سلیقه شما"},
        {"product": "محصول پیشنهادی ۲", "score": 0.88, "reason": "کاربران مشابه خریدند"},
        {"product": "محصول پیشنهادی ۳", "score": 0.82, "reason": "محبوب این هفته"},
    ][:limit]
    
    return {
        "status": "success",
        "recommendations": recommendations
    }