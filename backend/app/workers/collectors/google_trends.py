import pandas as pd
from pytrends.request import TrendReq
from app.schemas.trend import GoogleTrendData, GoogleTrendPoint, GoogleTrendRisingQuery

def fetch_google_trends(topic: str) -> GoogleTrendData:
    try:
        pytrends = TrendReq(hl='en-US', tz=360)
        pytrends.build_payload([topic], cat=0, timeframe='today 3-m', geo='', gprop='')
        
        # 1. Interest Over Time
        iot_df = pytrends.interest_over_time()
        if iot_df.empty:
            interest_over_time = []
        else:
            iot_df = iot_df.reset_index()
            interest_over_time = [
                GoogleTrendPoint(date=row.date.strftime('%Y-%m-%d'), value=row[topic])
                for _, row in iot_df.iterrows()
            ]

        # 2. Rising Queries
        rising_df = pytrends.related_queries().get(topic, {}).get('rising')
        if rising_df is None or rising_df.empty:
            rising_queries = []
        else:
            rising_queries = [
                GoogleTrendRisingQuery(query=row.query, value=row.value)
                for _, row in rising_df.head(5).iterrows() # Get top 5
            ]

        return GoogleTrendData(interest_over_time=interest_over_time, rising_queries=rising_queries)
    except Exception as e:
        print(f"Error fetching Google Trends data: {e}")
        # Return empty data on failure
        return GoogleTrendData(interest_over_time=[], rising_queries=[])