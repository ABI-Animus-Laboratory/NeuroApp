import nest
import numpy as np

# nest.ResetKernel()

def getMemPot(Vdevice):
    # helper function to get the voltage array
    dm = Vdevice.get("events")
    return dm["V_m"]


def two_neuron_volt(current):
    nest.set_verbosity("M_WARNING")
    # initialise simulation
    dt2 = 500
    dtfl2 = float(dt2)
    # Ims = np.empty(0)
    weight = 20.0
    delay = 1.0
    neuron1 = nest.Create("iaf_psc_alpha")
    neuron2 = nest.Create("iaf_psc_alpha")
    multimeter1 = nest.Create("multimeter", params={"record_from": ["V_m"]})
    multimeter2 = nest.Create("multimeter", params={"record_from": ["V_m"]})
    nest.Connect(neuron1, neuron2, syn_spec={"weight": weight, "delay": delay})
    nest.Connect(multimeter1, neuron1)
    nest.Connect(multimeter2, neuron2)
    # Input parameters
    neuron1.I_e = current
    # NEST simulation
    nest.Simulate(dtfl2)
    Vms1 = list(getMemPot(multimeter1))
    Vms2 = list(getMemPot(multimeter2))
    mms = multimeter1.get('events')
    ts2 = list(mms['times'])
    # Ims = np.append(Ims, [I_input] * (len(ts) - len(Ims)))
    return Vms1, Vms2, ts2
