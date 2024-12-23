from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse, StreamingResponse, Response, JSONResponse
from one_neuronV2 import simulation
import nest
import json
from fastapi import HTTPException
from one_neuronV2 import two_neuron_volt
from one_neuronV2 import simulationHH
from one_neuronV2 import placeholder
from one_neuronV2 import clearNetwork
from one_neuronV2 import initialiseLeaky
from one_neuronV2 import initialiseSynapse
from one_neuronV2 import initialiseHH
from network_connection import network
from network_connection import initialiseNetwork
from pydantic import BaseModel
from typing import Dict

# Global variable to store initialized values
dict1 = None
dict2 = None
dict3 = None
dict4 = None

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class NeuronMultimeterModel(BaseModel):
    neuron: Dict
    multimeter: Dict


class SynapseModel(BaseModel):
    neuron1: Dict
    neuron2: Dict
    multimeter1: Dict
    multimeter2: Dict


class HHModel(BaseModel):
    neuronhh: Dict
    multimeterhh: Dict


class networkModel(BaseModel):
    neuronpop: Dict
    multimeters: Dict


@app.get("/single/initialiseLeaky")
async def callInitialiseLeaky():
    global dict1
    global dict2
    global dict3
    global dict4
    dict2 = None
    dict3 = None
    dict4 = None
    if dict1 is None:
        neuron, multimeter = initialiseLeaky()
        dict1 = {"neuron": neuron, "multimeter": multimeter}
    return dict1


@app.get("/single/initialiseSynapse")
async def callInitialiseSynapse():
    global dict1
    global dict2
    global dict3
    global dict4
    dict1 = None
    dict3 = None
    dict4 = None
    if dict2 is None:
        neuron1, neuron2, multimeter1, multimeter2 = initialiseSynapse()
        dict2 = {"neuron1": neuron1, "neuron2": neuron2, "multimeter1": multimeter1, "multimeter2": multimeter2}
    return dict2


@app.get("/single/initialiseHH")
async def callInitialiseHH():
    global dict1
    global dict2
    global dict3
    global dict4
    dict1 = None
    dict2 = None
    dict4 = None
    if dict3 is None:
        neuron, multimeter = initialiseHH()
        dict3 = {"neuron": neuron, "multimeter": multimeter}
    return dict3


@app.get("/single/initialiseNetwork")
async def callInitialiseNetwork():
    global dict1
    global dict2
    global dict3
    global dict4
    dict1 = None
    dict2 = None
    dict3 = None
    if dict4 is None:
        neuronpop, multimeters = initialiseNetwork()
        dict4 = {"neuronpop": neuronpop, "multimeters": multimeters}
    return dict4


@app.get("/single/clearNetwork")
async def callClearNetwork():
    clearNetwork()
    dict1 = None
    dict2 = None


@app.get("/single/{dtfl}/{current}/{neuron}/{multimeter}")
async def get_leaky_voltage(
        dtfl: float,
        current: int,
        nm: NeuronMultimeterModel = Depends(callInitialiseLeaky)
):
    # Access the "neuron" and "multimeter" dictionaries using dot notation
    neuron_dict = nm.get("neuron", {})
    multimeter_dict = nm.get("multimeter", {})
    neuronSim = neuron_dict[0]
    multimeterSim = multimeter_dict[0]

    [voltage, times] = simulation(neuronSim, multimeterSim, dtfl, current)
    if len(times) >= 99:
        voltage_new = voltage[-99:]
    else:
        voltage_new = voltage
    times_new = []
    for i in range(1, 100):
        times_new.append(i)
    max_val = (voltage_new[-1])
    # Create a list of dictionaries with "y" and "x" keys
    voltage_data = [{"y": v, "x": t} for v, t in zip(voltage_new, times_new)]
    return {"data": voltage_data, "value": max_val}


@app.get("/fourth/{current}")
async def get_fourth_voltage(current: int):
    [voltage, times] = placeholder(current)
    if len(times) >= 499:
        voltage_new = voltage[-499:]
    else:
        voltage_new = voltage
    times_new = []
    for i in range(1, 500):
        times_new.append(i)
    max_val = max(voltage_new)
    # Create a list of dictionaries with "y" and "x" keys
    voltage_data = [{"y": v, "x": t} for v, t in zip(voltage_new, times_new)]
    return {"data": voltage_data, "value": max_val}


@app.get("/single/{dtfl}/{current}/{mempotential}/{g_K}/{neuron3}/{multimeter3}")
async def get_hh_voltage(
        dtfl: float,
        current: int,
        mempotential: float,
        g_K: float,
        nm3: HHModel = Depends(callInitialiseHH)
):
    neuronhh_dict = nm3.get("neuron", {})
    multimeterhh_dict = nm3.get("multimeter", {})
    neuronSim = neuronhh_dict[0]
    multimeterSim = multimeterhh_dict[0]

    [v, times] = simulationHH(neuronSim, multimeterSim, dtfl, current, mempotential, g_K)
    if len(times) >= 99:
        v_new = v[-99:]
    else:
        v_new = v
    times_new = []
    for i in range(1, 100):
        times_new.append(i)
    max_val = (v_new[-1])
    # Create a list of dictionaries with "y" and "x" keys
    voltage_data = [{"y": v, "x": t} for v, t in zip(v_new, times_new)]
    return {"data": voltage_data, "value": max_val}


@app.get("/synapse/{dtfl}/{current}/{neuron1}/{multimeter1}/{multimeter2}")
async def get_synapse_voltage(
        dtfl: float,
        current: int,
        nm2: SynapseModel = Depends(callInitialiseSynapse)
):
    neuron1_dict = nm2.get("neuron1", {})
    neuron2_dict = nm2.get("neuron2", {})
    multimeter1_dict = nm2.get("multimeter1", {})
    multimeter2_dict = nm2.get("multimeter2", {})
    neuronSim1 = neuron1_dict[0]
    multimeterSim1 = multimeter1_dict[0]
    multimeterSim2 = multimeter2_dict[0]

    [v1, v2, times] = two_neuron_volt(neuronSim1, multimeterSim1, multimeterSim2, dtfl, current)
    if len(times) >= 99:
        v1_new = v1[-99:]
        v2_new = v2[-99:]
    else:
        v1_new = v1
        v2_new = v2
    times_new = []
    for i in range(1, 100):
        times_new.append(i)
    max_val = (v1_new[-1])
    max_val2 = (v2_new[-1])
    # Create a list of dictionaries with "y" and "x" keys
    data1 = [{"y": v1, "x": t} for v1, t in zip(v1_new, times_new)]
    data2 = [{"y": v2, "x": t} for v2, t in zip(v2_new, times_new)]
    data = {"data1": data1, "data2": data2, "value": max_val, "value2": max_val2}
    return data


@app.get(
    "/network/{dtfl}/{currents}/{memCap}/{weights}/{neuronpop}/{multimeters}")
async def get_network_voltage(
        dtfl: float,
        currents: str,
        memCap: str,
        weights: str,
        nm4: networkModel = Depends(callInitialiseNetwork)
):
    neuronpop_dict = nm4.get("neuronpop", {})
    multimeters_dict = nm4.get("multimeters", {})
    neuronpopSim = neuronpop_dict
    multimetersSim = multimeters_dict
    print(neuronpopSim)
    print(multimetersSim)

    currents_list = list(map(float, currents.split(',')))
    memCap_list = list(map(float, memCap.split(',')))
    weights_list = list(map(float, weights.split(',')))

    [v0, v1, v2, v3, v4, v5, v6, v7, v8, t] = network(neuronpopSim, multimetersSim, dtfl, currents_list, memCap_list,
                                                      weights_list)

    if len(t) >= 99:
        v0_new = v0[-99:]
        v1_new = v1[-99:]
        v2_new = v2[-99:]
        v3_new = v3[-99:]
        v4_new = v4[-99:]
        v5_new = v5[-99:]
        v6_new = v6[-99:]
        v7_new = v7[-99:]
        v8_new = v8[-99:]
    else:
        v0_new = v0
        v1_new = v1
        v2_new = v2
        v3_new = v3
        v4_new = v4
        v5_new = v5
        v6_new = v6
        v7_new = v7
        v8_new = v8
    times_new = []
    for i in range(1, 100):
        times_new.append(i)
    max0 = (v0_new[-1])
    max1 = (v1_new[-1])
    max2 = (v2_new[-1])
    max3 = (v3_new[-1])
    max4 = (v4_new[-1])
    max5 = (v5_new[-1])
    max6 = (v6_new[-1])
    max7 = (v7_new[-1])
    max8 = (v8_new[-1])

    data0 = [{"y": volt0, "x": times} for volt0, times in zip(v0_new, times_new)]
    data1 = [{"y": volt1, "x": times} for volt1, times in zip(v1_new, times_new)]
    data2 = [{"y": volt2, "x": times} for volt2, times in zip(v2_new, times_new)]
    data3 = [{"y": volt3, "x": times} for volt3, times in zip(v3_new, times_new)]
    data4 = [{"y": volt4, "x": times} for volt4, times in zip(v4_new, times_new)]
    data5 = [{"y": volt5, "x": times} for volt5, times in zip(v5_new, times_new)]
    data6 = [{"y": volt6, "x": times} for volt6, times in zip(v6_new, times_new)]
    data7 = [{"y": volt7, "x": times} for volt7, times in zip(v7_new, times_new)]
    data8 = [{"y": volt8, "x": times} for volt8, times in zip(v8_new, times_new)]
    data = {"data0": data0, "data1": data1, "data2": data2, "data3": data3, "data4": data4,
            "data5": data5, "data6": data6, "data7": data7, "data8": data8, "max0": max0, "max1": max1, "max2": max2,
            "max3": max3, "max4": max4, "max5": max5, "max6": max6, "max7": max7, "max8": max8}
    return data
