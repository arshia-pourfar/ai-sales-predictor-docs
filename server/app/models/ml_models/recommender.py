# app/models/ml_models/recommender.py

class ProductRecommender:
    def __init__(self):
        self.products = {
            "premium": {
                "گیمینگ": [
                    {"name": "ماوس گیمینگ حرفه‌ای", "price": 8500000, "reason": "مناسب گیمرهای حرفه‌ای", "discount": "۱۰٪"},
                    {"name": "کیبورد مکانیکال RGB", "price": 12000000, "reason": "پرطرفدارترین", "discount": "۱۵٪"},
                ],
                "موبایل": [
                    {"name": "گوشی پرچمدار", "price": 35000000, "reason": "جدیدترین مدل", "discount": "۵٪"},
                ],
                "لپ‌تاپ": [
                    {"name": "لپ‌تاپ گیمینگ", "price": 65000000, "reason": "قدرتمندترین", "discount": "۸٪"},
                ],
            },
            "mid_range": {
                "گیمینگ": [
                    {"name": "ماوس گیمینگ میان‌رده", "price": 3500000, "reason": "ارزش خرید بالا", "discount": "۲۰٪"},
                ],
                "موبایل": [
                    {"name": "گوشی میان‌رده", "price": 15000000, "reason": "محبوب‌ترین", "discount": "۱۲٪"},
                ],
            },
            "budget": {
                "عمومی": [
                    {"name": "هدفون اقتصادی", "price": 800000, "reason": "پرفروش هفته", "discount": "۲۵٪"},
                    {"name": "قاب گوشی", "price": 200000, "reason": "تخفیف ویژه", "discount": "۳۰٪"},
                ],
            },
        }
    
    def get_recommendations(self, profile: dict, intent: dict, limit: int = 5) -> list:
        """
        پیشنهاد محصول بر اساس پروفایل و intent
        """
        budget = intent.get("estimated_budget", "mid_range")
        interests = profile.get("interests", ["عمومی"])
        
        recommendations = []
        
        for interest in interests:
            if budget in self.products and interest in self.products[budget]:
                recommendations.extend(self.products[budget][interest])
        
        # اگر هیچی پیدا نشد، از budget استفاده کن
        if not recommendations:
            for cat in self.products.get(budget, {}):
                recommendations.extend(self.products[budget][cat])
        
        return recommendations[:limit]