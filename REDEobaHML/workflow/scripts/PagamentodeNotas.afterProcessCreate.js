function afterProcessCreate(processId){
    log.info('AFTER_PROCESS_CREATE')
    log.info('----PROCESSID----'+processId)
    hAPI.setCardValue('hd_numProcess', processId)
    var process = String(processId)
    var seqNota = hAPI.getCardValue('seqnota')
    if(seqNota != ''){
        var c1 = DatasetFactory.createConstraint('seqnota', seqNota, seqNota, ConstraintType.MUST)
        var dts = DatasetFactory.getDataset('dts_setNroPagNotas_MFX', [process], [c1], null).values
        log.info('----DTS----'+dts.getValue(0, 'RetornoExecute'))
    }
}