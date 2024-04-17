function enableFields(form){ 
    var inicio = 5
    var aprov = 8
    var contabilidade = 10
    var financeiro = 27
    var atual = getValue("WKNumState");
    var desabilita= []
    var indexesCCusto = form.getChildrenIndexes("tbccusto");
    log.info('ENABLE FIELDS')
    if(atual == inicio || atual == 0){
    }else if(atual == aprov){
        desabilita.push('sw_ccusto_aprovador', 'ztxt_solicitacao_fornc', 'sw_solicitacao_pedido', 'txt_dadosnf_codAcesso', 'ztxt_solicitacao_pedido', 'ztxt_solicitacao_fornecedor', 'ztxt_solicitacao_nota', 'sw_solicitacao_lancarM', 'ztxt_solicitacao_filial', 'txt_dadosnf_numeronf', 'slct_dadosnf_ccusto', 'ztxt_dadosnf_natureza', 'txt_dadosnf_valorbruto', 'txt_dadosnf_valorliquido', 'txt_dadosb_banco', 'txt_dadosb_agencia', 'txt_dadosb_conta', 'txt_ccusto_valornf', 'txt_ccusto_valorrest', 'txt_ccusto_valorinserido', 'btn_ccusto_upload', 'ztxt_ccusto_ccaprov', 'txtz_ccusto_tipolancamento', 'sw_ccusto_parcelas', 'txt_parcelas_valornf', 'txt_parcelas_qntparcelas','txta_parcelas_obs', 'ztxt_estOrig', 'ztxt_municOrig', 'ztxt_estDenst', 'ztxt_municDenst', 'modelo')
        for(var i = 0; i < indexesCCusto.length; i++){
            desabilita.push('txtz_ccusto_cc___'+indexesCCusto[i])
        }
    }else if(atual == contabilidade){
        desabilita.push('ztxt_solicitacao_nota', 'ztxt_dadosnf_natureza')
        // if(form.getValue('statusIntegracao') != 'false'){
        //     desabilita.push('ztxt_solicitacao_fornc', 'sw_solicitacao_pedido', 'ztxt_solicitacao_pedido', 'txt_dadosnf_codAcesso','ztxt_solicitacao_fornecedor', 'ztxt_solicitacao_nota', 'sw_solicitacao_lancarM', 'ztxt_solicitacao_filial', 'txt_dadosnf_numeronf', 'slct_dadosnf_ccusto', 'ztxt_dadosnf_natureza', 'txt_dadosnf_valorbruto', 'txt_dadosnf_valorliquido', 'txt_dadosb_banco', 'txt_dadosb_agencia', 'txt_dadosb_conta', 'txt_ccusto_valornf', 'txt_ccusto_valorrest', 'txt_ccusto_valorinserido', 'btn_ccusto_upload', 'ztxt_ccusto_ccaprov', 'txtz_ccusto_tipolancamento', 'sw_ccusto_parcelas', 'txt_parcelas_valornf', 'txt_parcelas_qntparcelas', 'ztxt_estOrig', 'ztxt_municOrig', 'ztxt_estDenst', 'ztxt_municDenst', 'modelo')
        //     if(form.getValue('hdn_sw_lancarM')== 'off'){
        //         log.info('ENTROU NO IF '+ form.getValue('hdn_sw_lancarM'))
        //         desabilita.push('txt_impostos_inss', 'txt_impostos_irrf', 'txt_impostos_csll', 'txt_impostos_confins', 'txt_impostos_pis', 'txt_impostos_valordeducao', 'txt_impostos_basecalculo', 'txt_impostos_aliquota', 'txt_impostos_valoriss', 'txt_impostos_credito')
        //     }
        //     for(var i = 0; i < indexesCCusto.length; i++){
        //         desabilita.push('txtz_ccusto_cc___'+indexesCCusto[i])
        //     }sw_ccusto_parcelas
        // }
    }else if(atual == financeiro){
        desabilita.push('sw_ccusto_aprovador', 'ztxt_solicitacao_fornc', 'txt_dadosnf_codAcesso', 'sw_solicitacao_pedido', 'ztxt_solicitacao_pedido', 'txt_dadosnf_codAcesso1','ztxt_solicitacao_fornecedor', 'ztxt_solicitacao_nota', 'sw_solicitacao_lancarM', 'ztxt_solicitacao_filial', 'txt_dadosnf_numeronf', 'slct_dadosnf_ccusto', 'ztxt_dadosnf_natureza', 'txt_dadosnf_valorbruto', 'txt_dadosnf_valorliquido', 'txt_dadosb_banco', 'txt_dadosb_agencia', 'txt_dadosb_conta', 'txt_ccusto_valornf', 'txt_ccusto_valorrest', 'txt_ccusto_valorinserido', 'btn_ccusto_upload', 'ztxt_ccusto_ccaprov', 'txtz_ccusto_tipolancamento', 'sw_ccusto_parcelas', 'txt_parcelas_valornf', 'txt_parcelas_qntparcelas','txta_parcelas_obs', 'txt_impostos_inss', 'txt_impostos_irrf', 'txt_impostos_csll', 'txt_impostos_confins', 'txt_impostos_pis', 'txt_impostos_valordeducao', 'txt_impostos_basecalculo', 'txt_impostos_aliquota', 'txt_impostos_valoriss', 'txt_impostos_credito', 'txta_obs_fiscal', 'ztxt_estOrig', 'ztxt_municOrig', 'ztxt_estDenst', 'ztxt_municDenst', 'modelo')
        for(var i = 0; i < indexesCCusto.length; i++){
            desabilita.push('txtz_ccusto_cc___'+indexesCCusto[i])
        }
    }
    
     for(var i=0; i<desabilita.length; i++){
        form.setEnabled(desabilita[i], false)
    }

}