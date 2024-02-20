import nest


# conn01, conn03, conn12, conn14, conn25, conn34, conn36, conn45, conn47, conn58, conn67, conn78
def network(currents, memCap, weights):
    nest.set_verbosity("M_WARNING")
    nest.ResetKernel()
    # parameters
    delay = 0.1
    spiked = [False, False, False, False, False, False, False, False, False]
    neuronpop = nest.Create("iaf_psc_alpha", 9)

    multimeters = nest.Create("multimeter", 9, params={"record_from": ["V_m"]})
    nest.Connect(multimeters, neuronpop, "one_to_one")

    nest.Connect(neuronpop[0], neuronpop[1], syn_spec={"weight": weights[0], "delay": delay})
    nest.Connect(neuronpop[0], neuronpop[3], syn_spec={"weight": weights[6], "delay": delay})
    nest.Connect(neuronpop[1], neuronpop[2], syn_spec={"weight": weights[1], "delay": delay})
    nest.Connect(neuronpop[1], neuronpop[4], syn_spec={"weight": weights[8], "delay": delay})
    nest.Connect(neuronpop[2], neuronpop[5], syn_spec={"weight": weights[10], "delay": delay})
    nest.Connect(neuronpop[3], neuronpop[4], syn_spec={"weight": weights[2], "delay": delay})
    nest.Connect(neuronpop[3], neuronpop[6], syn_spec={"weight": weights[7], "delay": delay})
    nest.Connect(neuronpop[4], neuronpop[5], syn_spec={"weight": weights[3], "delay": delay})
    nest.Connect(neuronpop[4], neuronpop[7], syn_spec={"weight": weights[9], "delay": delay})
    nest.Connect(neuronpop[5], neuronpop[8], syn_spec={"weight": weights[11], "delay": delay})
    nest.Connect(neuronpop[6], neuronpop[7], syn_spec={"weight": weights[4], "delay": delay})
    nest.Connect(neuronpop[7], neuronpop[8], syn_spec={"weight": weights[5], "delay": delay})

    # create spike recorders
    sr0 = nest.Create("spike_recorder")
    nest.Connect(neuronpop[0], sr0)
    sr1 = nest.Create("spike_recorder")
    nest.Connect(neuronpop[1], sr1)
    sr2 = nest.Create("spike_recorder")
    nest.Connect(neuronpop[2], sr2)
    sr3 = nest.Create("spike_recorder")
    nest.Connect(neuronpop[3], sr3)
    sr4 = nest.Create("spike_recorder")
    nest.Connect(neuronpop[4], sr4)
    sr5 = nest.Create("spike_recorder")
    nest.Connect(neuronpop[5], sr5)
    sr6 = nest.Create("spike_recorder")
    nest.Connect(neuronpop[6], sr6)
    sr7 = nest.Create("spike_recorder")
    nest.Connect(neuronpop[7], sr7)
    sr8 = nest.Create("spike_recorder")
    nest.Connect(neuronpop[8], sr8)

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
    nest.Simulate(500.0)

    # determine which neurons have spiked
    if sr0.n_events > 0:
        spiked[0] = True
    if sr1.n_events > 0:
        spiked[1] = True
    if sr2.n_events > 0:
        spiked[2] = True
    if sr3.n_events > 0:
        spiked[3] = True
    if sr4.n_events > 0:
        spiked[4] = True
    if sr5.n_events > 0:
        spiked[5] = True
    if sr6.n_events > 0:
        spiked[6] = True
    if sr7.n_events > 0:
        spiked[7] = True
    if sr8.n_events > 0:
        spiked[8] = True
    print(spiked)

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

    return spiked, Vms0, Vms1, Vms2, Vms3, Vms4, Vms5, Vms6, Vms7, Vms8, t
