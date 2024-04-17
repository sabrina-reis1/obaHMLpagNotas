function beforeCancelProcess(colleagueId,processId){
    var seqNota = hAPI.getCardValue('seqnota')
    var c1 = DatasetFactory.createConstraint('seqnota', seqNota, seqNota, ConstraintType.MUST)
    DatasetFactory.getDataset('dts_setNroPagNotas_MFX', null, [c1], null)
}