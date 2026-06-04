from fastapi import APIRouter
import numpy as np
from datetime import datetime, timedelta

router = APIRouter()

@router.get("/predict")
async def predict_sales(days: int = 7):
    """
    پیش‌بینی فروش با ML
    """
    # اینجا مدل Prophet یا XGBoost لود میشه
    dates = [(datetime.now() + timedelta(days=i)).strftime("%Y-%m-%d") for i in range(1, days+1)]
    
    # پیش‌بینی نمونه (در واقعیت از مدل میاد)
    predictions = []
    for i, date in enumerate(dates):
        predictions.append({
            "date": date,
            "predicted_sales": np.random.normal(5000000, 1000000),
            "confidence": 0.85
        })
    
    return {
        "status": "success",
        "forecast": predictions,
        "total_predicted": sum(p["predicted_sales"] for p in predictions)
    }