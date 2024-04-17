function validateForm(form){
    log.info('VALIDATE FORM')
    var inicio = 5
    var aprov = 8
    var contabilidade = 10
    var revisao = 20
    var revisao2 = 12
    var atual = getValue("WKNumState");
	var valida = []
    var indexesCCusto = form.getChildrenIndexes("tbccusto");

    if(atual == inicio || atual == 0 || atual == revisao || atual == revisao2){
        if(form.getValue('hdn_trava') == 'on'){
            throw("Não é possivel iniciar solicitações no momento!")
        }else{

            valida.push('ztxt_solicitacao_filial', 'txt_solicitacao_tipo', 'hdn_slct_fornec_tipo_pessoa', 'txt_dadosnf_numeronf', 'slct_dadosnf_tipopg', 'txt_dadosnf_ccusto', 'hd_datavenct', 'txt_dadosnf_datacompetancia', 'ztxt_dadosnf_natureza', 'txt_ccusto_valornf', 'nroserie', 'especie', 'modelo')
            if(form.getValue('ztxt_ccusto_ccaprov').trim() == ''){
                for(var i = 0; i < indexesCCusto.length; i++){
                    var desc = form.getValue('txt_ccusto_desc___'+indexesCCusto[i])
                    var valor = form.getValue('txt_ccusto_valor___'+indexesCCusto[i])
                    var centroCusto = form.getValue('txtz_ccusto_cc___'+ indexesCCusto[i])
                    if(desc == '' || valor == '' || centroCusto == ''){
                        throw('Algum campo da tabela Centro de custo precisa ser penchido linha: '+(i+1))
                    }
                }   
            }

            if((form.getValue('hdn_sw_pedido')) == 'on'){
                valida.push('ztxt_solicitacao_pedido')
            }
            if((form.getValue('slct_dadosnf_tipopg')) == 'deposito'){
                valida.push('txt_dadosb_banco', 'txt_dadosb_agencia', 'txt_dadosb_conta')
            }
            if((form.getValue('hd_origem')) == 'true'){
                valida.push('tipoCt', 'ztxt_municOrig', 'ztxt_municDenst')
            }
            if((form.getValue('hdn_sw_lancarM')) == 'off'){
                if(form.getValue('hd_paramsWg') ==  'true'){
                    valida.push('txt_solicitacao_nota')
                }else{
                    valida.push('ztxt_solicitacao_nota')
                }
            }
            
            // valida.push('hd_venctInicial')
            //     if(form.getValue('hd_gerarParcelas') != 'true'){
            //         throw("Nenhuma parcela foi adicionada")
            //     }
            log.info('RESTANTE VAL = '+form.getValue('txt_ccusto_valorrest'))
            if((form.getValue('txt_ccusto_valorrest')) != 'R$ 0,00' && (form.getValue('txt_ccusto_valorrest')) != 'R$ 00,00' && (form.getValue('txt_ccusto_valorrest')) != '0'){
                throw("A tabela de centro de custo não atigiu o valor total da nota")
            }
            else{
                for(var i=0; i<valida.length; i++){
                    if(form.getValue(valida[i]) == null || form.getValue(valida[i]) == ""){
                      log.info("ENTROU NO IF CAMPO VAZIO")
                         throw("O campo "+valida[i]+" precisa ser prenchido")
                    }
                  }
            }
        }
    }else if(atual == aprov){
        var aprov = form.getValue('hdn_aprovacao')
        if(aprov == ''){
            throw("Para prosseguir o fluxo é necessário aprovar ou reprovar a solicitação")
        }
        var trava_obs = form.getValue('trava_obs')
        if(trava_obs == 'true'){
            throw("É necessário prencher o campo de observação!")
        }
    }else if(atual == contabilidade){
        // var aprov = form.getValue('hdn_contabilidade')
        // if(aprov == ''){
        //     throw("Para prosseguir o fluxo é necessário aprovar ou reprovar a solicitação")
        // }
    }
}


