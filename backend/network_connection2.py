import nest


def network(conn01, conn03, conn12, conn14, conn25, conn34, conn36, conn45, conn47, conn58, conn67, conn78, n):
    nest.set_verbosity("M_WARNING")
    nest.ResetKernel()
    # parameters
    weight = 20.0
    delay = 1.0
    spiked = [False, False, False, False, False, False, False, False, False]
    neuronpop = nest.Create("iaf_psc_alpha", 9)
    if conn01:
        nest.Connect(neuronpop[0], neuronpop[1], syn_spec={"weight": weight, "delay": delay})
    if conn03:
        nest.Connect(neuronpop[0], neuronpop[3], syn_spec={"weight": weight, "delay": delay})
    if conn12:
        nest.Connect(neuronpop[1], neuronpop[2], syn_spec={"weight": weight, "delay": delay})
    if conn14:
        nest.Connect(neuronpop[1], neuronpop[4], syn_spec={"weight": weight, "delay": delay})
    if conn25:
        nest.Connect(neuronpop[2], neuronpop[5], syn_spec={"weight": weight, "delay": delay})
    if conn34:
        nest.Connect(neuronpop[3], neuronpop[4], syn_spec={"weight": weight, "delay": delay})
    if conn36:
        nest.Connect(neuronpop[3], neuronpop[6], syn_spec={"weight": weight, "delay": delay})
    if conn45:
        nest.Connect(neuronpop[4], neuronpop[5], syn_spec={"weight": weight, "delay": delay})
    if conn47:
        nest.Connect(neuronpop[4], neuronpop[7], syn_spec={"weight": weight, "delay": delay})
    if conn58:
        nest.Connect(neuronpop[5], neuronpop[8], syn_spec={"weight": weight, "delay": delay})
    if conn67:
        nest.Connect(neuronpop[6], neuronpop[7], syn_spec={"weight": weight, "delay": delay})
    if conn78:
        nest.Connect(neuronpop[7], neuronpop[8], syn_spec={"weight": weight, "delay": delay})

    # nest.Connect(neuronpop1, neuronpop1, conn1)
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

    neuronpop[n].I_e = 1000
    neuronpop[1].V_th = -69.9
    neuronpop[2].V_th = -69.9
    neuronpop[3].V_th = -69.9
    neuronpop[4].V_th = -69.9
    neuronpop[5].V_th = -69.9
    neuronpop[6].V_th = -69.9
    neuronpop[7].V_th = -69.9
    neuronpop[8].V_th = -69.9

    multimeters = nest.Create("multimeter", 9, params={"record_from": ["V_m"]})
    nest.Connect(multimeters, neuronpop)

    nest.Simulate(3000)

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

    return spiked
