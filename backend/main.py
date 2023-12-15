from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse, StreamingResponse, Response, JSONResponse
# from one_neuron import simulation

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)



@app.get("/")
async def root():
    return {"message": "Hello World"}


# @app.get("/hello/{current}")
# async def get_voltage(current: int):
#     [voltage, times] = simulation(current)
#     return {"voltage": voltage, "times": times}

@app.get("/api/model")
async def get_display_model():
    model_path = "./data/mask.obj"
    file_res = FileResponse(model_path, media_type="application/octet-stream", filename="mask.obj")
    return file_res
