import nest


def initialiseNetwork():
    nest.set_verbosity("M_WARNING")
    nest.ResetKernel()
    # parameters
    delay = 0.1
    defaultWeight = 1.0
    neuronpop = nest.Create("iaf_psc_alpha", 9)

    multimeters = nest.Create("multimeter", 9, params={"record_from": ["V_m"]})
    nest.Connect(multimeters, neuronpop, "one_to_one")

    synapse0 = nest.Connect(neuronpop[0], neuronpop[1], syn_spec={"weight": defaultWeight, "delay": delay})
    synapse1 = nest.Connect(neuronpop[0], neuronpop[3], syn_spec={"weight": defaultWeight, "delay": delay})
    synapse2 = nest.Connect(neuronpop[1], neuronpop[2], syn_spec={"weight": defaultWeight, "delay": delay})
    synapse3 = nest.Connect(neuronpop[1], neuronpop[4], syn_spec={"weight": defaultWeight, "delay": delay})
    synapse4 = nest.Connect(neuronpop[2], neuronpop[5], syn_spec={"weight": defaultWeight, "delay": delay})
    synapse5 = nest.Connect(neuronpop[3], neuronpop[4], syn_spec={"weight": defaultWeight, "delay": delay})
    synapse6 = nest.Connect(neuronpop[3], neuronpop[6], syn_spec={"weight": defaultWeight, "delay": delay})
    synapse7 = nest.Connect(neuronpop[4], neuronpop[5], syn_spec={"weight": defaultWeight, "delay": delay})
    synapse8 = nest.Connect(neuronpop[4], neuronpop[7], syn_spec={"weight": defaultWeight, "delay": delay})
    synapse9 = nest.Connect(neuronpop[5], neuronpop[8], syn_spec={"weight": defaultWeight, "delay": delay})
    synapse10 = nest.Connect(neuronpop[6], neuronpop[7], syn_spec={"weight": defaultWeight, "delay": delay})
    synapse11= nest.Connect(neuronpop[7], neuronpop[8], syn_spec={"weight": defaultWeight, "delay": delay})

    # # create spike recorders
    # sr0 = nest.Create("spike_recorder")
    # nest.Connect(neuronpop[0], sr0)
    # sr1 = nest.Create("spike_recorder")
    # nest.Connect(neuronpop[1], sr1)
    # sr2 = nest.Create("spike_recorder")
    # nest.Connect(neuronpop[2], sr2)
    # sr3 = nest.Create("spike_recorder")
    # nest.Connect(neuronpop[3], sr3)
    # sr4 = nest.Create("spike_recorder")
    # nest.Connect(neuronpop[4], sr4)
    # sr5 = nest.Create("spike_recorder")
    # nest.Connect(neuronpop[5], sr5)
    # sr6 = nest.Create("spike_recorder")
    # nest.Connect(neuronpop[6], sr6)
    # sr7 = nest.Create("spike_recorder")
    # nest.Connect(neuronpop[7], sr7)
    # sr8 = nest.Create("spike_recorder")
    # nest.Connect(neuronpop[8], sr8)

    return neuronpop, multimeters

def network(neuronpop, multimeters, dtfl, currents, memCap, weights):
    # parameters
    delay = 0.1

    # get connections
    synapse0 = nest.GetConnections(source=neuronpop[0], target=neuronpop[1])
    synapse1 = nest.GetConnections(source=neuronpop[0], target=neuronpop[3])
    synapse2 = nest.GetConnections(source=neuronpop[1], target=neuronpop[2])
    synapse3 = nest.GetConnections(source=neuronpop[1], target=neuronpop[4])
    synapse4 = nest.GetConnections(source=neuronpop[2], target=neuronpop[5])
    synapse5 = nest.GetConnections(source=neuronpop[3], target=neuronpop[4])
    synapse6 = nest.GetConnections(source=neuronpop[3], target=neuronpop[6])
    synapse7 = nest.GetConnections(source=neuronpop[4], target=neuronpop[5])
    synapse8 = nest.GetConnections(source=neuronpop[4], target=neuronpop[7])
    synapse9 = nest.GetConnections(source=neuronpop[5], target=neuronpop[8])
    synapse10 = nest.GetConnections(source=neuronpop[6], target=neuronpop[7])
    synapse11 = nest.GetConnections(source=neuronpop[7], target=neuronpop[8])

    # update weight values of connections
    nest.SetStatus(synapse0, {'weight': weights[0]})
    nest.SetStatus(synapse1, {'weight': weights[6]})
    nest.SetStatus(synapse2, {'weight': weights[1]})
    nest.SetStatus(synapse3, {'weight': weights[8]})
    nest.SetStatus(synapse4, {'weight': weights[10]})
    nest.SetStatus(synapse5, {'weight': weights[2]})
    nest.SetStatus(synapse6, {'weight': weights[7]})
    nest.SetStatus(synapse7, {'weight': weights[3]})
    nest.SetStatus(synapse8, {'weight': weights[9]})
    nest.SetStatus(synapse9, {'weight': weights[11]})
    nest.SetStatus(synapse10, {'weight': weights[4]})
    nest.SetStatus(synapse11, {'weight': weights[5]})

    # initialise currents into each neuron
    neuronpop[0].I_e = currents[0]
    neuronpop[1].I_e = currents[1]
    neuronpop[2].I_e = currents[2]
    neuronpop[3].I_e = currents[3]
    neuronpop[4].I_e = currents[4]
    neuronpop[5].I_e = currents[5]
    neuronpop[6].I_e = currents[6]
    neuronpop[7].I_e = currents[7]
    neuronpop[8].I_e = currents[8]

    # initialise the membrane capacitance of each neuron
    neuronpop[0].C_m = memCap[0]
    neuronpop[1].C_m = memCap[1]
    neuronpop[2].C_m = memCap[2]
    neuronpop[3].C_m = memCap[3]
    neuronpop[4].C_m = memCap[4]
    neuronpop[5].C_m = memCap[5]
    neuronpop[6].C_m = memCap[6]
    neuronpop[7].C_m = memCap[7]
    neuronpop[8].C_m = memCap[8]

    # run simulation
    nest.Simulate(dtfl)

    # # determine which neurons have spiked
    # if sr0.n_events > 0:
    #     spiked[0] = True
    # if sr1.n_events > 0:
    #     spiked[1] = True
    # if sr2.n_events > 0:
    #     spiked[2] = True
    # if sr3.n_events > 0:
    #     spiked[3] = True
    # if sr4.n_events > 0:
    #     spiked[4] = True
    # if sr5.n_events > 0:
    #     spiked[5] = True
    # if sr6.n_events > 0:
    #     spiked[6] = True
    # if sr7.n_events > 0:
    #     spiked[7] = True
    # if sr8.n_events > 0:
    #     spiked[8] = True

    # collect voltage and time measurements
    Vms0 = list(multimeters.get('events')[0]['V_m'])
    Vms1 = list(multimeters.get('events')[1]['V_m'])
    Vms2 = list(multimeters.get('events')[2]['V_m'])
    Vms3 = list(multimeters.get('events')[3]['V_m'])
    Vms4 = list(multimeters.get('events')[4]['V_m'])
    Vms5 = list(multimeters.get('events')[5]['V_m'])
    Vms6 = list(multimeters.get('events')[6]['V_m'])
    Vms7 = list(multimeters.get('events')[7]['V_m'])
    Vms8 = list(multimeters.get('events')[8]['V_m'])
    t = list(multimeters.get('events')[8]['times'])

    return Vms0, Vms1, Vms2, Vms3, Vms4, Vms5, Vms6, Vms7, Vms8, t