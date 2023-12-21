from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse, StreamingResponse, Response, JSONResponse
from one_neuron import simulation
import json
from fastapi import HTTPException
from two_neuron import two_neuron_volt


app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# def save_voltage_data(json_data):
#     file_path = "/Users/chrisneville-dowler/NeuroApp/frontend/static/ECG/NormalECG.json"
#
#     try:
#         with open(file_path, "w") as file:
#             json.dump(json_data, file, indent=2)
#     except Exception as e:
#         raise HTTPException(status_code=500, detail=f"Error saving data: {str(e)}")
#

@app.get("/")
async def root():
    return {"message": "Hello World"}


@app.get("/single/{current}")
async def get_voltage(current: int):
    [voltage, times] = simulation(current)
    # Create a list of dictionaries with "y" and "x" keys
    voltage_data = [{"y": v, "x": t} for v, t in zip(voltage, times)]
    return voltage_data


@app.get("/synapse/{current}")
async def get_voltage(current: int):
    [v1, v2, times] = two_neuron_volt(current)
    # Create a list of dictionaries with "y" and "x" keys
    data1 = [{"y": v, "x": t} for v, t in zip(v1, times)]
    data2 = [{"y": v, "x": t} for v, t in zip(v2, times)]
    data = {"data1": data1, "data2": data2}
    return data



@app.get("/api/model")
async def get_display_model():
    model_path = "./data/mask.obj"
    file_res = FileResponse(model_path, media_type="application/octet-stream", filename="mask.obj")
    return file_res
