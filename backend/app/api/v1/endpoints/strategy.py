from fastapi import APIRouter, Body, HTTPException
from app.models.request_models import StrategyRequestBody
from app.models.response_models import StrategyResponse
from app.services.ai_service import AIService
from app.services import data_aggregator

router = APIRouter()
ai_service = AIService()

@router.get("/health", status_code=200, include_in_schema=False)
def health_check():
    return {"status": "ok"}

@router.post(
    "/generate",
    response_model=StrategyResponse, # This ensures our output matches the model
    summary="Generate a Full Content Strategy"
)
async def generate_strategy(
    body: StrategyRequestBody = Body(...)
) -> StrategyResponse:
    """
    Accepts user criteria and generates a complete, 30-day content strategy
    powered by AI and contextual data.
    """
    try:
        # Step 1: Get contextual data (currently mocked)
        context_data = data_aggregator.get_context_data(body)

        # Step 2: Call the AI service with the user request and context
        ai_response_dict = await ai_service.generate_strategy_from_ai(body, context_data)
        
        # Step 3: Validate the AI's response against our Pydantic model
        # This is a critical quality check. If the AI returns bad JSON, this will fail.
        validated_response = StrategyResponse(**ai_response_dict)
        
        return validated_response

    except Exception as e:
        # Catch potential errors from the AI call or validation
        print(f"Error during strategy generation: {e}")
        raise HTTPException(
            status_code=500,
            detail="An error occurred while generating the content strategy."
        )