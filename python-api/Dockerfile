# Use the official Python 3.12 image as the base image
FROM python:3.12-slim

# Set environment variables
ENV PYTHONUNBUFFERED=1
ENV PYTHONDONTWRITEBYTECODE=1

RUN apt-get update -y && apt-get install -y gcc && rm -rf /var/lib/apt/lists/*

# Copy requirements.txt
COPY requirements.txt ${LAMBDA_TASK_ROOT}

# Install the specified packages
RUN pip install -r requirements.txt

# Copy function code
COPY src src
# Copy models. These are large files downloaded from an s3 bucket s3://influential-data-cloud-search2-embeddings/models
# Make sure to downloaded these prior to the build. Reference README.md for more details.
COPY models models

EXPOSE 8000

CMD python src/service.py; \
    tail -f /dev/null;

