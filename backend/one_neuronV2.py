import nest
import numpy as np

def initialiseLeaky():
    nest.set_verbosity("M_WARNING")
    nest.ResetKernel()
    nest.set(min_delay=0.5, max_delay=1.0)

    # parameters
    weight = 20.0
    delay = 1.0

    # initialise nodes
    neuron = nest.Create("iaf_psc_alpha")
    multimeter = nest.Create("multimeter", params={"record_from": ["V_m"]})

    # initialise connections
    nest.Connect(multimeter, neuron)
    return neuron, multimeter


def initialiseSynapse():
    nest.set_verbosity("M_WARNING")
    nest.ResetKernel()
    nest.set(min_delay=0.5, max_delay=1.0)

    # parameters
    weight = 100.0
    delay = 1.0

    # initialise nodes
    neuron1 = nest.Create("iaf_psc_alpha")
    neuron2 = nest.Create("iaf_psc_alpha")
    multimeter1 = nest.Create("multimeter", params={"record_from": ["V_m"]})
    multimeter2 = nest.Create("multimeter", params={"record_from": ["V_m"]})

    # initialise connections
    nest.Connect(neuron1, neuron2, syn_spec={"synapse_model": "stdp_synapse", "weight": weight, "delay": delay})
    nest.Connect(multimeter1, neuron1)
    nest.Connect(multimeter2, neuron2)
    return neuron1, neuron2, multimeter1, multimeter2


def initialiseHH():
    nest.set_verbosity("M_WARNING")
    nest.ResetKernel()
    nest.set(min_delay=0.5, max_delay=1.0)

    # parameters
    weight = 20.0
    delay = 1.0

    # initialise nodes
    neuron3 = nest.Create("hh_cond_beta_gap_traub")
    multimeter3 = nest.Create("multimeter", params={"record_from": ["V_m"]})

    # initialise connections
    nest.Connect(multimeter3, neuron3)
    return neuron3, multimeter3


def clearNetwork():
    nest.set_verbosity("M_WARNING")
    nest.ResetKernel()
    global dict
    global dict2
    dict = None
    dict2 = None


def simulation(neuron, multimeter, dtfl, Iin):
    # Input parameters
    neuron.I_e = Iin
    # NEST simulation
    nest.Simulate(dtfl)
    mms = multimeter.get('events')
    Vms = list(mms['V_m'])
    ts = list(mms['times'])
    return Vms, ts


def placeholder(neuron, multimeter, dtfl, Iin):
    # Input parameters
    neuron.I_e = Iin
    # NEST simulation
    nest.Simulate(dtfl)
    mms = multimeter.get('events')
    Vms = list(mms['V_m'])
    ts = list(mms['times'])
    return Vms, ts


def getMemPot(Vdevice):
    # helper function to get the voltage array
    dm = Vdevice.get("events")
    return dm["V_m"]


def two_neuron_volt(neuron1, multimeter1, multimeter2, dtfl, current):
    # Input parameters
    neuron1.I_e = current
    # NEST simulation
    nest.Simulate(dtfl)
    Vms1 = list(getMemPot(multimeter1))
    Vms2 = list(getMemPot(multimeter2))
    mms2 = multimeter1.get('events')
    ts2 = list(mms2['times'])
    return Vms1, Vms2, ts2


def simulationHH(neuron3, multimeter3, dtfl, current, mempotential, g_K):
    # Input parameters
    neuron3.I_e = current
    neuron3.C_m = mempotential
    neuron3.g_K = g_K
    # NEST simulation
    nest.Simulate(dtfl)
    mms3 = multimeter3.get('events')
    Vms3 = list(mms3['V_m'])
    ts3 = list(mms3['times'])
    return Vms3, ts3