function afterTaskSave(colleagueId,nextSequenceId,userList){
    log.info('AFTER TASK SAVE NEXTSEQUENCE '+nextSequenceId)
    if(nextSequenceId == 14){
        var aprovadores =  new Array();
        var i = 1;
        while(hAPI.getCardValue('txt_IdAprovador___'+i) != null){
            aprovadores.push(hAPI.getCardValue('txt_IdAprovador___'+i));
            i++;
        }
        var controle = parseInt(hAPI.getCardValue('contadorAprov')) + 1
        var qntAprov = hAPI.getCardValue('qntAprov')
        if(parseInt(qntAprov) > 1){
            if(parseInt(controle) < parseInt(qntAprov)){
                hAPI.setCardValue('aprovAtual', aprovadores[controle])
                hAPI.setCardValue('contadorAprov', controle)
            }else{
                hAPI.setCardValue('aprovAtual', '')
            }
        }else{
            hAPI.setCardValue('aprovAtual', '')
        }
        log.info('CONTROLE ++'+controle)
        log.info('qntAprov ++'+qntAprov)
        log.info('aprovAtual ++'+hAPI.getCardValue('contadorAprov'))
    }else if(nextSequenceId == 12 || nextSequenceId == 20){
        hAPI.setCardValue('contadorAprov', 0)

        var dados = getDados(hAPI.getCardValue('hdn_usercode'))
        sendEmail(dados)
    }else if(nextSequenceId == 8){
        log.info("ENTROU NO STATE 8")
        if(hAPI.getCardValue('aprovAtual')){
            var dados = getDados(hAPI.getCardValue('aprovAtual'))
            sendEmail(dados)
        }
    }
}
function sendEmail(dados){
    log.info("ENTROU NO SEND EMAIL <---")

    var fnEmail = MFLoadLib(["com.MF.fluig.js.ds.CustomEmail"]);
    try {
        var numProcess = getValue("WKNumProces")
        var nome = dados.getValue(0,'colleagueName')
        var email =  dados.getValue(0,'mail')
        log.info("EMAIL TO ---> " + email)
        var NF = hAPI.getCardValue('txt_dadosnf_numeronf')
        var mensagem, msgsubject;
        //email = 'erik.hinojosa@grupomfx.com'
        msgsubject = "Aprovação de pagamento"
        mensagem = "A solicitação de número " + numProcess + " foi classificada para você. Acesse-a para analisar a solicitação do pagamento da Nota: "+NF+"."
        
        fnEmail.mail.sendCustomEmail({
            companyId: getValue("WKCompany"),
            subject: msgsubject,
            from: "tarefa@redeoba.com.br",
            to: email,
            templateId: "templateEmailOba",
            templateDialect: "pt_BR",
            templateHtml: "templateEmailOba.html",
            dados: {
                "CABECALHO": 'Pagamento de Notas',
                "NOME": nome,
                "MENSAGEM": mensagem, 
                //url de HML :http://fluighmg.redeoba.com.br/portal/p/01/pageworkflowview?app_ecm_workflowview_detailsProcessInstanceID=
                //url de PROD :http://fluig.redeoba.com.br/portal/p/01/pageworkflowview?app_ecm_workflowview_detailsProcessInstanceID=
                "BOTAO": '<a href="http://fluighmg.redeoba.com.br/portal/p/01/pageworkflowview?app_ecm_workflowview_detailsProcessInstanceID=' + numProcess + '">Acessar minha Tarefa</a>  ', // mudar em prod
                "RODAPE": "Mensagem automática"
            }
        });

    } catch (e) {
        log.error("*** afterStateLeave - ERRO AO ENVIAR EMAIL! " + e);
    }
}
function getDados(user){
    var c1 = DatasetFactory.createConstraint('colleaguePK.colleagueId', user, user, ConstraintType.MUST)
    var dts = DatasetFactory.getDataset('colleague', null, [c1], null)
    return dts
}
function MFLoadLib(e) { var t = {}; if (e == null) { return t } var n = function (e, t) { for (var n = 0; n < e.length; n++) { if (e[n] == t) return true } return false }; var r = DatasetFactory.getDataset("ds_customJS", null, null, null); for (var i = 0; i < r.rowsCount; i++) { var s = r.getValue(i, "lib"); if (n(e, s)) { var o = r.getValue(i, "src"); var u = r.getValue(i, "name"); try { var a = new Function("lib", "return " + o); t[u] = a(t) } catch (f) { log.error("*** Erro ao compilar lib " + s + ":" + f) } } } return t }
