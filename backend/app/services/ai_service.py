import google.generativeai as genai
import json
from datetime import datetime
import uuid
import re

from app.core.config import settings
from app.models.request_models import StrategyRequestBody
from app.models.response_models import StrategyResponse

# Configure the Gemini API client
genai.configure(api_key=settings.GEMINI_API_KEY)

class AIService:
    def __init__(self):
        # Set up the model with generation config for JSON output
        generation_config = {
            "temperature": 0.7,
            "top_p": 1,
            "top_k": 1,
            "max_output_tokens": 8192,
            "response_mime_type": "application/json", # Crucial for getting JSON output
        }
        self.model = genai.GenerativeModel(
            model_name="gemini-1.5-flash", # A fast and capable model
            generation_config=generation_config
        )

    def _construct_prompt(self, request_body: StrategyRequestBody, context_data: dict) -> str:
        """Constructs the detailed prompt for the Gemini LLM."""
        
        # --- THIS IS THE CRITICAL FIX ---
        # We create an example of the JSON structure we want, but without real data.
        # This is better than sending the raw, complex Pydantic schema.
        json_structure_example = {
            "key_insights": {
                "identified_trends": [{"trend": "string", "platform": "string", "volume": "string"}],
                "best_time_to_post": {"platform_name": "time range"},
                "top_performing_formats": ["string"],
                "hook_styles": ["string"]
            },
            "competitor_snapshot": [{
                "name": "string",
                "key_themes": ["string"],
                "posting_frequency": "string"
            }],
            "content_calendar": [{
                "day": "integer",
                "theme_of_day": "string",
                "post_suggestions": [{
                    "platform": "string",
                    "title_suggestion": "string",
                    "format": "string",
                    "hook": "string",
                    "cta": "string"
                }]
            }]
        }

        prompt = f"""
        You are an expert content strategist and AI assistant. Your task is to generate a complete, data-driven 30-day content strategy based on user goals and simulated real-time data.

        **USER'S GOAL:**
        - Topic: {request_body.topic}
        - Target Audience: {request_body.target_audience}
        - Focus: {', '.join(request_body.focus)}
        - Target Platforms: {', '.join(request_body.platforms)}
        - Competitors to analyze: {', '.join(request_body.competitors)}

        **SIMULATED DATA & TRENDS (Use this to inform your strategy):**
        - Identified Trends: {context_data['trends']}
        - Competitor Analysis: {context_data['competitor_analysis']}

        **YOUR DELIVERABLE:**
        You MUST provide the output as a single, valid JSON object. Do not include any text, notes, or markdown like ```json before or after the JSON object.
        Your response should start with {{ and end with }}.

        The JSON object must follow this exact structure. Populate every field with high-quality, creative, and actionable content.

        **JSON Structure to Follow:**
        ```json
        {json.dumps(json_structure_example, indent=2)}
        ```
        """
        return prompt
        # --- END OF FIX ---

    def _clean_json_response(self, text_response: str) -> str:
        """
        Cleans the text response from Gemini to ensure it's a valid JSON string.
        It removes markdown ```json ... ``` wrappers if they exist.
        """
        match = re.search(r'```json\s*(\{.*?\})\s*```', text_response, re.DOTALL)
        if match:
            return match.group(1)
        return text_response.strip()

    async def generate_strategy_from_ai(self, request_body: StrategyRequestBody, context_data: dict) -> dict:
        """Calls the Gemini API to generate the strategy and returns it as a dictionary."""
        
        prompt = self._construct_prompt(request_body, context_data)
        
        try:
            response = await self.model.generate_content_async(prompt)
            
            cleaned_response_text = self._clean_json_response(response.text)
            strategy_dict = json.loads(cleaned_response_text)

            # Add server-generated fields that the AI doesn't need to create
            strategy_dict['strategy_id'] = f"strat_{uuid.uuid4()}"
            strategy_dict['createdAt'] = datetime.utcnow().isoformat() + "Z"
            strategy_dict['request_summary'] = request_body.model_dump()

            return strategy_dict

        except Exception as e:
            print(f"An error occurred with the Gemini API call: {e}")
            if 'response' in locals():
                print("--- RAW GEMINI RESPONSE ---")
                print(response.text)
                print("---------------------------")
            raise