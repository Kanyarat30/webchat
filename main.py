import os
import requests
from fastapi import FastAPI, File, UploadFile, Form
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from aift import setting
from aift.nlp.longan import tokenizer
from aift.multimodal import textqa
from aift.nlp.translation import en2th
from aift.nlp.translation import th2en
from dotenv import load_dotenv
from aift.nlp.translation import th2zh
from aift.nlp import text_cleansing
from aift.nlp.translation import zh2th
from aift.nlp import sentiment
from aift.nlp import similarity
from aift.nlp import soundex
from aift.multimodal import vqa
import tempfile
import shutil

# โหลดตัวแปรจาก .env
load_dotenv()

# ตั้งค่า API Key จาก .env
setting.set_api_key(os.getenv("AIFORTHAI_API_KEY"))

app = FastAPI()

# อนุญาตให้ React เรียก API
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class TextRequest(BaseModel):
    text: str

class QARequest(BaseModel):
    question: str
    document: str

@app.post("/tokenize")
async def tokenize_text(request: TextRequest):
    tokens = tokenizer.tokenize(request.text)
    return {"tokens": tokens}

@app.post("/textqa")
async def qa_text(request: TextRequest):
    response = textqa.generate(request.text)
    return {"answer": response["content"]}

@app.post("/en2th")
async def en2th_text(request: TextRequest):
    response = en2th.translate(request.text)
    return {"translate": response}

@app.post("/th2en")
async def th2en_text(request: TextRequest):
    response = th2en.translate(request.text)
    return {"translate": response}

@app.post("/th2zh")
async def th2zh_text(request: TextRequest):
    response = th2zh.translate(request.text)
    return {"translate": response}

@app.post("/cleansing")
async def text_Cleansing(request: TextRequest):
    response = text_cleansing.clean(request.text)
    return {"cleansing": response}

@app.post("/zh2th")
async def zh_Alignment(request: TextRequest):
    response = zh2th.translate(request.text)
    return {"translate": response}

@app.post("/emoji")
async def Sentiment(request: TextRequest):
    response = sentiment.analyze(request.text, engine='thaimoji')
    return {"emoji": response}

@app.post("/similarity")
async def Similarity(request: TextRequest):
    response = similarity.similarity(request.text, engine='thaiwordsim', model='thwiki')
    return {"similarity": response}

@app.post("/soundex")
async def Soundex(request: TextRequest):
    response = soundex.analyze(request.text)
    return {"soundex": response}

@app.post("/emonews")
async def Emonews(request: TextRequest):
    response = sentiment.analyze(request.text, engine='emonews')
    return {"emonews": response}

@app.post("/cyberbully")
async def Cyberbully(request: TextRequest):
    response = sentiment.analyze(request.text, engine='cyberbully')
    return {"cyberbully": response}