function displayFields(form,customHTML){ 
    log.info('DISPLAY FIELDS PAG NOTAS')
    var mobile = form.getMobile() != null && form.getMobile() ? true : false
    var inicio = 5
    var aprov = 8
    var contabilidade = 10
    var financeiro = 27
    var revisao = 20
    var revisao2 = 12
    var atual = getValue("WKNumState");
    var user = getValue("WKUser");
    form.setValue('userAtual', user)
    var parcelas = form.getValue('hd_parcelas')
    var mail = getMail(user)
    mail == 'ygor.lima@redeoba.com.br' ? mail = 'lucas.pereira@redeoba.com.br' : mail = mail
	var esconder = []
    form.setValue("hdn_state", atual)

    if(atual == inicio || atual == 0){
        esconder.push('div_aprovacao', 'div_impostos_obs', 'obs_fiscal', 'div_impostos', 'obs_aprovadores', 'div_aprovações')
        form.setValue('hdn_usercode', user)
        form.setValue('hdn_mail', mail)
        var dtsChapa = DatasetFactory.getDataset("dsGetChapaAD", ['a', mail], null, null)
        var objeto = JSON.parse(dtsChapa.getValue(0, 'Retorno'));
        var chapa = objeto.onPremisesSamAccountName
    }else if(atual == aprov){
        if(mobile == true){
            esconder.push('targa_aprovacao_sim', 'targa_aprovacao_nao')
        }
        form.setValue('hdn_aprovacao', '')
        form.setValue('txta_aprovacao_obs', '')
        esconder.push('div_impostos', 'obs_fiscal', 'obs_aprovadores')
        if(parcelas == '' || parcelas == 'false'){
            esconder.push('div_parcelas')
        }
        form.setValue('trava_obs', '')
    }else if(atual == contabilidade){
        if(mobile == true){
            esconder.push('targa_impostos_sim', 'targa_impostos_nao')
        }
        form.setValue("usercodeLanc", user)
        form.setValue('txta_impostos_obs', '')
        form.setValue('emailLanc', mail)
        var obsAprov = form.getValue('hdn_obs')
        form.setValue('txta_obs_aprovadores', obsAprov)
        esconder.push('div_aprovacao', 'obs_fiscal')
        if(parcelas == '' || parcelas == 'false'){
            esconder.push('div_parcelas')
        }
        form.setValue('trava_obs', '')
    }else if(atual == financeiro){
        var obsAprov = form.getValue('hdn_obs')
        form.setValue('txta_obs_aprovadores', obsAprov)
        esconder.push('div_aprovacao', 'div_impostos_obs', 'obs_fiscal')
        form.setValue('txta_obs_fiscal', getValue('txta_impostos_obs'))
        if(parcelas == '' || parcelas == 'false'){
            esconder.push('div_parcelas')
        }
    }else if(atual == revisao){
        form.setValue('contadorAprov', 0)
        form.setValue('trava_obs', '')
        var obsAprov = form.getValue('hdn_obs')
        form.setValue('txta_obs_aprovadores', obsAprov)
        esconder.push('div_aprovacao', 'div_impostos', 'div_aprovações')
        form.setValue('txta_obs_fiscal', form.getValue('txta_impostos_obs'))
    }else if(atual == revisao2){
        form.setValue('contadorAprov', 0)
        form.setValue('trava_obs', '')
        var obsAprov = form.getValue('hdn_obs')
        form.setValue('txta_obs_aprovadores', obsAprov)
        esconder.push('div_impostos', 'div_aprovacao', 'obs_fiscal', 'div_aprovações')
    }
    if(atual != inicio || atual != 0 || atual !=  revisao || atual != revisao2){
        form.setValue('slct_fornec_tipo_pessoa' ,form.getValue('hdn_slct_fornec_tipo_pessoa'))
    }
    for(var i = 0; i < esconder.length; i++){
        form.setVisibleById(esconder[i], false);
    }
    customHTML.append("<script>var FORM_MODE = '" + form.getFormMode() + "'</script>");

}function getMail(user){
    try{
        return fluigAPI.getUserService().getCurrent().getEmail();
    }catch(error){
        var c1 = DatasetFactory.createConstraint('colleaguePK.colleagueId', user, user, ConstraintType.MUST)
        var dts = DatasetFactory.getDataset('colleague', null, [c1], null)
        return dts.getValue(0, 'mail')
    }
}
