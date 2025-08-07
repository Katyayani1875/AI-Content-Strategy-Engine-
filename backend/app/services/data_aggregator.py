# This is a MOCKED service.
# In a real application (Week 2-3), this file would contain functions
# that query MongoDB to get real, scraped data.

def get_context_data(request_body) -> dict:
    """
    Simulates fetching trend and competitor data from a database.
    This allows us to build and test the AI service without waiting for the scrapers.
    """
    print("--- MOCK DATA AGGREGATOR: Using simulated data for AI context. ---")
    
    # Example data that might be returned from a real database query
    mock_trends = [
        {"trend": "Glass Skin Routine", "platform": "tiktok", "volume": "high"},
        {"trend": "Acne Patches Review", "platform": "youtube", "volume": "medium"},
        {"trend": "Skincare ingredient checker", "platform": "reddit", "volume": "medium"}
    ]

    mock_competitor_analysis = [
        {
            "name": "glossier",
            "key_themes": ["minimalism", "natural look", "community features", "aesthetic vlogs"],
            "posting_frequency": "3-4 times/week"
        },
        {
            "name": "theordinary",
            "key_themes": ["science-backed", "ingredient deep-dives", "affordability", "no-frills education"],
            "posting_frequency": "2-3 times/week"
        }
    ]

    return {
        "trends": mock_trends,
        "competitor_analysis": mock_competitor_analysis
    }