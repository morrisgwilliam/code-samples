# Semantic Search Engine

The purpose of this project is to expose embeddings that can be used to query QDrant Vector Collections. The embeddings are exposed via FastAPI. You provide a prompt and an embedding will be returned.

## Prerequisites

- Python (v.3.11)
- Docker
- AWS CLI

### 1. Run the service through Docker

```bash
docker compose build
docker compose up
```

You can stop the service by running

```bash
docker compose down
```

### Run Service locally

Install virtual environment

```bash
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```

Run the api server

```bash
python src/service.py; \
    tail -f /dev/null;
```

### 2. Go to [http://localhost:8000/sys/alive](http://localhost:8000/sys/alive)

This verifies the container is running properly.

## Manually Publishing and Deploying Service

### Build and Publish Container
Make sure that you have the latest version of the AWS CLI and Docker installed. For more information, see Getting Started with Amazon ECR .
Use the following steps to authenticate and push an image to your repository. For additional registry authentication methods, including the Amazon ECR credential helper, see Registry Authentication.

Retrieve an authentication token and authenticate your Docker client to your registry. Use the AWS CLI:

```bash
aws ecr get-login-password --region ${aws region} | docker login --username AWS --password-stdin ${your ECR repo}
```

Note: If you receive an error using the AWS CLI, make sure that you have the latest version of the AWS CLI and Docker installed.

Build your Docker image using the following command.

```bash
docker buildx build --platform ${platform target} -t ${your tag} .
```

After the build completes, tag your image so you can push the image to this repository:

```bash
docker tag ${your tag} ${remote tag}
```

Run the following command to push this image to your created AWS repository:

```bash
docker push ${you ecr repo}
```