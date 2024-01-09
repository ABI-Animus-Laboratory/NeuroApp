from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse, StreamingResponse, Response, JSONResponse
from one_neuron import simulation
import json
from fastapi import HTTPException
from one_neuron import two_neuron_volt
from one_neuron import simulationHH


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
    if len(times) >= 499:
        voltage_new = voltage[-499:]
        times_new = times[-499:]
    else:
        voltage_new = voltage
        times_new = times
    # Create a list of dictionaries with "y" and "x" keys
    voltage_data = [{"y": v, "x": t} for v, t in zip(voltage_new, times_new)]
    return voltage_data


@app.get("/single/{current}/{mempotential}/{g_K}")
async def get_voltage(current: int, mempotential: int, g_K: int):
    [v, times] = simulationHH(current, mempotential, g_K)
    if len(times) >= 499:
        v_new = v[-499:]
        times_new = times[-499:]
    else:
        v_new = v
        times_new = times
    # Create a list of dictionaries with "y" and "x" keys
    voltage_data = [{"y": v, "x": t} for v, t in zip(v_new, times_new)]
    return voltage_data


@app.get("/synapse/{current}")
async def get_voltage(current: int):
    [v1, v2, times] = two_neuron_volt(current)
    if len(times) >= 499:
        v1_new = v1[-499:]
        v2_new = v2[-499:]
        times_new = times[-499:]
    else:
        voltage_new1 = v1
        voltage_new2 = v2
        times_new = times
    # Create a list of dictionaries with "y" and "x" keys
    data1 = [{"y": v1, "x": t} for v1, t in zip(v1_new, times_new)]
    data2 = [{"y": v2, "x": t} for v2, t in zip(v2_new, times_new)]
    data = {"data1": data1, "data2": data2}
    return data



@app.get("/api/model")
async def get_display_model():
    model_path = "./data/mask.obj"
    file_res = FileResponse(model_path, media_type="application/octet-stream", filename="mask.obj")
    return file_res
