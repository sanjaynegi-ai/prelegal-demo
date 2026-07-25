from fastapi import FastAPI

app = FastAPI(title="prelegal-demo")


@app.get("/")
def read_root():
    return {"status": "ok"}
