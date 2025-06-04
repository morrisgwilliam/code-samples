import uvicorn
from fastapi import FastAPI, Request, Depends
from fastapi.middleware.cors import CORSMiddleware
import time
from fastembed.sparse.bm25 import Bm25
from qdrant_client.models import models
from fastembed.embedding import TextEmbedding


async def get_body(request: Request):
    return await request.json()

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get('/sys/alive')
async def rte_sys_alive():
    return {
        "timestamp": time.time(),
    }

@app.post("/embedding/bm25")
async def getEmbedding(request: Request, body=Depends(get_body)):
    sparse_model = Bm25("Qdrant/bm25")

    sparse_query = list(sparse_model.passage_embed(body["prompt"]))[0]

    return models.SparseVector(indices=sparse_query.indices, values=sparse_query.values)

@app.post("/embedding/paraphrase-multilingual")
async def getEmbedding(request: Request, body=Depends(get_body)):
    encoder = TextEmbedding("sentence-transformers/paraphrase-multilingual-mpnet-base-v2")

    embedding = encoder.query_embed(body["prompt"])
    response = list(embedding)[0].tolist()
    return response


################################################################################
## MAIN
################################################################################

if __name__ == '__main__':

    print("Starting service")
    uvicorn.run(app, host="0.0.0.0", port=8000)

