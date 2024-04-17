function afterTaskComplete(colleagueId,nextSequenceId,userList){
    log.info('AFTER TASK COMPLET')
    hAPI.setCardValue('hdn_state', nextSequenceId)    
}