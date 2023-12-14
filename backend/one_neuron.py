import nest
import numpy as np

nest.set_verbosity("M_WARNING")
nest.ResetKernel()

# initialise simulation
dt = 100
dtfl = float(dt)
neuron = nest.Create("iaf_psc_alpha")
multimeter = nest.Create("multimeter", params={"record_from": ["V_m"]})
nest.Connect(multimeter, neuron)


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
