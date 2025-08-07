from fastapi import APIRouter, status, HTTPException, Depends
from uuid import UUID, uuid4
from datetime import datetime
from app.schemas.trend import TrendDiscoveryRequest, JobStatusResponse, TrendResultResponse
from app.workers.tasks import discover_trends_task
from app.db.database import get_db
from app.db.models import TrendJob
from motor.motor_asyncio import AsyncIOMotorDatabase

router = APIRouter()

@router.post("/discover", response_model=JobStatusResponse, status_code=status.HTTP_202_ACCEPTED)
async def discover_trends(request: TrendDiscoveryRequest, db: AsyncIOMotorDatabase = Depends(get_db)):
    """
    Initiates an asynchronous job and creates a job entry in MongoDB.
    """
    job_id = uuid4()
    job = TrendJob(
        job_id=job_id,
        status="PENDING",
        request_payload=request.dict()
    )
    
    await db["trend_jobs"].insert_one(job.dict(by_alias=True))
    discover_trends_task.delay(str(job_id), request.topic)

    return {"job_id": job_id, "status": "PENDING", "message": "Trend discovery job has been queued."}


@router.get("/results/{job_id}", response_model=TrendResultResponse)
async def get_trend_results(job_id: UUID, db: AsyncIOMotorDatabase = Depends(get_db)):
    """
    Fetches the job results from MongoDB.
    """
    job = await db["trend_jobs"].find_one({"job_id": job_id})
    if not job:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Job not found.")

    return TrendResultResponse(**job)