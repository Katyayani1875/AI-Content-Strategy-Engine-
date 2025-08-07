# Use an official Python runtime as a parent image
FROM python:3.11-slim

# Set the working directory in the container
WORKDIR /code

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

# Install system dependencies
RUN apt-get update && apt-get install -y --no-install-recommends gcc && rm -rf /var/lib/apt/lists/*

# Install Python dependencies
COPY ./requirements.txt /code/requirements.txt
RUN pip install --no-cache-dir --upgrade -r /code/requirements.txt

# Copy the application code into the container
COPY ./app /code/app

# Command to run the application
# The port 8000 is the default for uvicorn. Railway/Render will map it automatically.
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]