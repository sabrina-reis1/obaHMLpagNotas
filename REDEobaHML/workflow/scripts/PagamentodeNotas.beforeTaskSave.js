function beforeTaskSave(colleagueId,nextSequenceId,userList){
    if(nextSequenceId == 6){
        var anexos   = hAPI.listAttachments();
            var temAnexo = false;

            if (anexos.size() > 0) {
                temAnexo = true;
            }

            if (!temAnexo) {
                throw "É preciso anexar a NF para continuar o processo!";
            }
    }
}