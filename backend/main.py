from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse, StreamingResponse, Response, JSONResponse
from one_neuron import simulation
import json
from fastapi import HTTPException


app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


def save_voltage_data(json_data):
    file_path = "/Users/chrisneville-dowler/NeuroApp/frontend/static/ECG/NormalECG.json"

    try:
        with open(file_path, "w") as file:
            json.dump(json_data, file, indent=2)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error saving data: {str(e)}")


@app.get("/")
async def root():
    return {"message": "Hello World"}


@app.get("/hello/{current}")
async def get_voltage(current: int):
    [voltage, times] = simulation(current)

    # Create a list of dictionaries with "y" and "x" keys
    voltage_data = [{"y": v, "x": t} for v, t in zip(voltage, times)]
    # Save voltage data to JSON file
    save_voltage_data(voltage_data)

    return {"voltage": voltage, "times": times}


@app.get("/api/model")
async def get_display_model():
    model_path = "./data/mask.obj"
    file_res = FileResponse(model_path, media_type="application/octet-stream", filename="mask.obj")
    return file_res
