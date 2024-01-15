import nest
import numpy as np

nest.set_verbosity("M_WARNING")
nest.ResetKernel()

# parameters
dt = 50
dtfl = float(dt)
weight = 20.0
delay = 1.0

# initialise nodes
neuron = nest.Create("iaf_psc_alpha")
neuron1 = nest.Create("iaf_psc_alpha")
neuron2 = nest.Create("iaf_psc_alpha")
neuron3 = nest.Create("hh_cond_beta_gap_traub")
neuron4 = nest.Create("iaf_psc_alpha")
multimeter = nest.Create("multimeter", params={"record_from": ["V_m"]})
multimeter1 = nest.Create("multimeter", params={"record_from": ["V_m"]})
multimeter2 = nest.Create("multimeter", params={"record_from": ["V_m"]})
multimeter3 = nest.Create("multimeter", params={"record_from": ["V_m"]})
multimeter4 = nest.Create("multimeter", params={"record_from": ["V_m"]})

# initialise connections
nest.Connect(multimeter, neuron)
nest.Connect(neuron1, neuron2, syn_spec={"weight": weight, "delay": delay})
nest.Connect(multimeter1, neuron1)
nest.Connect(multimeter2, neuron2)
nest.Connect(multimeter3, neuron3)
nest.Connect(multimeter4, neuron4)


def simulation(Iin):
    # Input parameters
    neuron.I_e = Iin
    # NEST simulation
    nest.Simulate(dtfl)
    mms = multimeter.get('events')
    Vms = list(mms['V_m'])
    ts = list(mms['times'])
    # Ims = [Iin] * len(ts)
    return Vms, ts


def placeholder(Iin):
    # Input parameters
    neuron.I_e = Iin
    # NEST simulation
    nest.Simulate(dtfl)
    mms = multimeter.get('events')
    Vms = list(mms['V_m'])
    ts = list(mms['times'])
    # Ims = [Iin] * len(ts)
    return Vms, ts


def getMemPot(Vdevice):
    # helper function to get the voltage array
    dm = Vdevice.get("events")
    return dm["V_m"]


def two_neuron_volt(current):
    # Input parameters
    neuron1.I_e = current
    # NEST simulation
    nest.Simulate(dtfl)
    Vms1 = list(getMemPot(multimeter1))
    Vms2 = list(getMemPot(multimeter2))
    mms2 = multimeter1.get('events')
    ts2 = list(mms2['times'])
    # Ims = np.append(Ims, [I_input] * (len(ts) - len(Ims)))
    return Vms1, Vms2, ts2


def simulationHH(current, mempotential, g_K):
    # Input parameters
    neuron3.I_e = current
    neuron3.C_m = mempotential
    neuron3.g_K = g_K
    # NEST simulation
    nest.Simulate(dtfl)
    mms3 = multimeter3.get('events')
    Vms3 = list(mms3['V_m'])
    ts3 = list(mms3['times'])
    # Ims = [Iin] * len(ts)
    return Vms3, ts3
