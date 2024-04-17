/*function travas(status, motivo){
    if(status == 'true'){
        if(motivo == 'date'){
            $('#fundo-alert').show()
            $('#fundo-alert-2').show()
        }else if(motivo == 'aprov'){
            $('#fundo-alert').show()
            $('#fundo-alert-3').show()
        }
    }else{
        $('#fundo-alert').hide()
        $('#fundo-alert-2').hide()
        $('#fundo-alert-3').hide()
    }
}*/
var nfIntegrada = false
function validaParams() {
    var url = (window.parent.location.href).split('&')
    if (window.parent.location.href.indexOf('CNPJ') != -1 && window.parent.location.href.indexOf('NOTA') != -1) {
        for (var i = 0; i < url.length; i++) {
            if (url[i].indexOf('CNPJ') != -1) {
                var cnpj = url[i].split('=')[1]
            } else if (url[i].indexOf('NOTA') != -1) {
                var nota = url[i].split('=')[1]
            }
        }
        engatilhaZoom(cnpj, nota)
        $('#hd_paramsWg').val('true')
    }
}
function engatilhaZoom(cnpj, nota) {
    if (cnpj) {
        var tipoPessoa = validaTipoPessoa(cnpj)
        $('#slct_fornec_tipo_pessoa').val(tipoPessoa)
        $('#hdn_slct_fornec_tipo_pessoa').val(tipoPessoa)
        if (tipoPessoa == 'juridica') {
            var doc = formataCNPJ(cnpj)
        } else if (tipoPessoa == 'fisica') {
            var doc = formataCPF(cnpj)
        }
        $('#txt_fornec_doc').val(doc)
        var retorno = verificaDoc(doc)
        if (retorno == 'error') {
            $('#slct_fornec_tipo_pessoa').val('')
            $('#hdn_slct_fornec_tipo_pessoa').val('')
            $('#txt_fornec_doc').val('')
            window['ztxt_solicitacao_fornecedor'].clear()
            window['ztxt_solicitacao_nota'].clear()
            $('#txt_dadosnf_dataemissao').val('')
            $('#txt_dadosnf_datavenct').val('')
            $('#txt_dadosnf_numeronf').val('')
            $('#txt_dadosnf_valorbruto').val('')
            $('#txt_dadosnf_valorliquido').val('')
            $('#hd_impostos').val('')
            $('#txt_ccusto_valornf').val('')
            $('#nivelAprov').val('')
            limpaHiddens()
            limpacampos()
            resetTable()
            impostos()
            validaVl('txt_dadosnf_valorbruto', $('#txt_dadosnf_valorbruto').val(), $('#txt_dadosnf_valorbruto')[0].parentNode)
            resetCamposNF()
        }
    }
    if (nota) {
        var c1 = DatasetFactory.createConstraint('cnpj', cnpj, cnpj, ConstraintType.MUST)
        var c2 = DatasetFactory.createConstraint('nroNf', nota, nota, ConstraintType.MUST)
        var constraints = new Array(c1, c2)
        var dts = DatasetFactory.getDataset('dts_NFS_MFX', null, constraints, null).values
        if (dts.length > 0) {
            if (dts[0].NUMERONF == 'null' || dts[0].VLRSERVICOS == 'null') {
                FLUIGC.toast({
                    title: 'AVISO',
                    message: 'Os dados da NF estão incompletos!',
                    type: 'Danger'
                });
            } else {
                $('#txt_dadosnf_dataemissao').val(dts[0]['NOTAEMISSAO'].split('/').reverse().join('-'))
                $('#hd_dataEmissao').val(dts[0]['NOTAEMISSAO'])
                $('#txt_dadosnf_numeronf').val(dts[0]['NUMERONF'])
                $('#seqnota').val(dts[0]['SEQNOTA'])
                var vlBruto = formataIntMoeda(dts[0]['VLRSERVICOS'].replace('.', ','))
                var vlRetencoes = dts[0].VLROUTRASRETENCOES
                if (formataMoedaInt(vlRetencoes) == 0 || vlRetencoes == 'null' || vlRetencoes == '') {
                    var impostos = [
                        dts[0].VLRCOFINS,
                        dts[0].VLRCSLL,
                        dts[0].VLRINSS,
                        dts[0].VLRIR,
                        dts[0].VLRISS,
                        dts[0].VLRPIS
                    ]
                } else {
                    var impostos = [
                        dts[0].VLRCOFINS,
                        dts[0].VLRCSLL,
                        dts[0].VLRINSS,
                        dts[0].VLRIR,
                        dts[0].VLRPIS
                    ]
                }
                //var vlLiquido = calculaVlLiquido(impostos, vlRetencoes, formataMoedaInt(dts[0]['VLRSERVICOS'].replace('.', ',')))
                var vlLiquido = formataMoedaInt(dts[0]['VALORLIQUIDONFSE'].replace('.', ','))
                $('#txt_dadosnf_valorbruto').val(vlBruto)
                nivelAprov(vlBruto)
                $('#txt_dadosnf_valorliquido').val(formataIntMoeda(vlLiquido))
                $('#txt_ccusto_valornf').val(vlBruto)
                var dateSplitada = dts[0]['DATACOMPETENCIA'].split('/')
                $('#txt_dadosnf_datacompetancia').val(dateSplitada[1] + '/' + dateSplitada[2])
                $('#hd_datacompetencia').val(dateSplitada[1] + '/' + dateSplitada[2])
                validaVl('txt_dadosnf_valorbruto', $('#txt_dadosnf_valorbruto').val(), $('#txt_dadosnf_valorbruto')[0].parentNode)
                validaInput($('#txt_dadosnf_datacompetancia')[0], $('#txt_dadosnf_datacompetancia')[0].parentNode)
                resetCamposNF()
                validaDate($('#txt_dadosnf_dataemissao')[0], $('#txt_dadosnf_dataemissao')[0].parentNode, 'txt_dadosnf_dataemissao')
                populaHiddensImpostos(dts[0])
                $('#div_ztxt_nota').hide()
                $('#div_ztxt_fornecedor').hide()
                $('#div_txtfornec').show()
                $('#div_txtnota').show()
                $('#txt_solicitacao_nota').val(dts[0]['NUMERONF'])
                $('#txt_solicitacao_fornecedor').val(dts[0]['RAZAOSOCIAL_PRESTADOR'])
                $('#sw_solicitacao_lancarM').attr('disabled', true)
                var divPai = $('#ztxt_solicitacao_nota')[0].parentNode
                $(divPai).removeClass('has-error').addClass('has-success')
                $("#txt_dadosnf_valorliquido").attr('readonly', false)
            }
        } else {
            FLUIGC.toast({
                title: 'AVISO',
                message: 'NF não encontrada na base de dados',
                type: 'Danger'
            });
        }
    }
}


function verificaView() {
    if (FORM_MODE == 'VIEW') {
        //btns
        $('#targa_aprovacao_sim').hide()
        $('#targa_aprovacao_nao').hide()
        $('#targa_impostos_sim').hide()
        $('#targa_impostos_nao').hide()
        $('#btn_ccusto_upload').attr('disabled', true)
        $('#btn_ccusto_novo').attr('disabled', true)
        $('#btn_parcelas_gerar').attr('disabled', true)
        $('#btn_parcelas_recalcular').attr('disabled', true)
        $('#btn_ccusto_limpar').attr('disabled', true)
        $('#btn_parcelas_limpar').attr('disabled', true)
        $('#btn_impostos_revisao').attr('disabled', true)
        $('#btn_impostos_sim').attr('disabled', true)
        $('#btn_aprovacao_sim').attr('disabled', true)
        $('#btn_aprovacao_revisao').attr('disabled', true)
        $('.btn-trash').hide()
        $('.btn-edit').hide()
        //select 
        var tipoPag = $('#hd_slct_dadosnf_tipopg').val()
        $('#slct_dadosnf_tipopg').text(tipoPag[0].toUpperCase() + tipoPag.substring(1))
        //zoom
        $('.input-group').attr('style', 'box-shadow: none !important')
        $('.input-group-addon').attr('style', 'display: none !important')

        //progress bar
        var state = $('#hdn_state').val()

        if (state == '0' || state == '5') {
            $('#title_solic').show()
            $('#inicio').show().addClass('progress-bar-warning')
        } else if (state == '8' || state == '10') {
            $('#title_aprov').show()
            $('#inicio').show().addClass('progress-bar-success').removeClass('progress-bar-warning')
            $('#aprov').show().addClass('progress-bar-warning')
        } else if (state == '27') {
            $('#title_compleT').show()
            $('#inicio').show().addClass('progress-bar-success').removeClass('progress-bar-warning')
            $('#aprov').show().addClass('progress-bar-success').removeClass('progress-bar-warning')
            $('#compleT').show().addClass('progress-bar-warning')
        } else if (state == '12' || state == '20') {
            $('#title_revisao').show()
            $('#inicio').show().addClass('progress-bar-success').removeClass('progress-bar-warning')
            $('#aprov').show().addClass('progress-bar-success').removeClass('progress-bar-warning')
            $('#revisao').show().addClass('progress-bar-warning')
        } else if (state == '29') {
            $('#div_logErro').show().removeClass('has-error').addClass('has-success')
            $('#title_fim').show()
            $('#inicio').show().addClass('progress-bar-success').removeClass('progress-bar-warning')
            $('#aprov').show().addClass('progress-bar-success').removeClass('progress-bar-warning')
            $('#fim').show().addClass('progress-bar-success').removeClass('progress-bar-warning')
        }

        //zoom fornec, pedidos e nf
        var zoomFornec = $('#ztxt_solicitacao_fornecedor').val()
        var fornec = $('txt_solicitacao_fornecedor').val()
        if (zoomFornec == '' && fornec == '') {
            if (zoomFornec != '') {
                $('#div_zfornecedor').show()
            } else {
                $('#div_txtfornec').show()
            }
        } else {
            $('#div_zfornecedor').hide()
        }


        var swPedido = $('#sw_solicitacao_pedido')[0].checked
        swPedido == false ? $('#div_zpedido').hide() : $('#div_zpedido').show()

        var swNF = $('#sw_solicitacao_lancarM')[0].checked
        if (swNF == false) {
            if ($('#ztxt_solicitacao_nota').val() != '') {
                $('#div_ztxt_nota').show()
                $('#div_txtnota').hide()
                $('#div_chaveAcesso').hide()
            } else {
                $('#div_ztxt_nota').hide()
                $('#div_txtnota').show()
                $('#div_chaveAcesso').hide()
            }
        } else {
            $('#div_ztxt_nota').hide()
            $('#div_txtnota').hide()
            $('#div_chaveAcesso').show()
        }

        $('#txt_dadosnf_datavenct').text($('#hd_datavenct').val().split('/').reverse().join('-'))
        $('#txt_dadosnf_dataemissao').text($('#hd_dataEmissao').val().split('/').reverse().join('-'))

        /*if($('#txta_parcelas_obs').val() == ''){
           $($('#txta_parcelas_obs')[0].parentNode).hide()
        }
        if($('#txta_aprovacao_obs').val() == ''){
           $($('#txta_aprovacao_obs')[0].parentNode).hide()
        }*/
    }
}

var novaSolicComBaseNesta = false;
var numeroNota = [];
function reiniciaDataVencNovaSolicDuplicada(){
    var elemento = window.parent.$(".workflowview-new");
    var observer = new MutationObserver(function(mutationsList) {
        mutationsList.forEach(function(mutation) {
            if (mutation.attributeName === 'style') {
                if (elemento.is(":visible")) {
                    if(novaSolicComBaseNesta){
                        if(numeroNota.indexOf($("#txt_dadosnf_numeronf").val()) == -1){
                            numeroNota.push($("#txt_dadosnf_numeronf").val());
                        }
                        // console.log("O elemento tornou-se visível após novaSolicComBaseNesta.");
                        if( $("#sw_ccusto_parcelas").prop('checked') ){
                            $("#sw_ccusto_parcelas").click()

                            FLUIGC.toast({
                                title: 'ATENÇÃO',
                                message: '<br> Favor adicionar as parcelas novamente caso necessário!',
                                type: 'warning',
                                timeout: 8000
                            });
                        }
                    }
                } else {
                    if( window.parent.$('li[data-reset-process-instance-id=""]').length ){
                        novaSolicComBaseNesta = true;
                    }
                }
            }
        });
    });
    // Configure o MutationObserver para observar alterações nos atributos do elemento
    observer.observe(elemento[0], { attributes: true });
}

$(document).ready(function () {

    reiniciaDataVencNovaSolicDuplicada()
    verificaNFVencida()
    verificaView()
    // var status = $('#verificaTrava').val()
    // var motivo = $('#motivoTrava').val()
    // travas(status, motivo)

    var dadosNfTipoPg = $('#hd_slct_dadosnf_tipopg').val()
    if (dadosNfTipoPg == 'deposito') {
        $('#panel-banco').show('smooth')
    } else {
        $('#panel-banco').hide('smooth')
    }

    var state = $('#hdn_state').val()
    $('#atual_prazo').val(dataAtual().split('/').reverse().join('-'))

    if($('#sw_ccusto_aprovador').val() != 'on'){
        $('#div_inputCCA').hide()
    }else{
        $('#div_inputCCA').show()
    }

    if (state == '0' || state == '5') {
        $('#div_parcelas').hide()
        //$('#div_swparcelas').hide()
        $('#div_chaveAcesso').hide()
        $('#targa_aprovacao_sim').hide()
        $('#targa_aprovacao_nao').hide()
        $('#targa_impostos_sim').hide()
        $('#targa_impostos_nao').hide()
        $('#div_cc_paifilho').hide()
        validaParams()
        $('#txt_dadosnf_dataemissao').val($('#hd_dataEmissao').val().split('/').reverse().join('-'))
        $('#txt_dadosnf_dataemissao').attr('readonly', true)
        $('#slct_fornec_tipo_pessoa').attr('disabled', true)
        $('#btn_parcelas_gerar').attr('disabled', true)
        getSolicitante()
        $('#hdn_sw_pedido').val('off')
        $('#div_zpedido').hide()
        $('#btn-dateEmissao').click()
        $('#title_solic').show()
        $('#inicio').show().addClass('progress-bar-warning')
        $('#txt_dadosnf_datavenct').attr('readonly', true)
        // calendarVenct('txt_dadosnf_datavenct', $('#txt_dadosnf_datavenct')[0].parentNode, 'disabled')
        $('#txt_dadosnf_dataentrada').attr('readonly', true)
        //calendarEntrada('txt_dadosnf_dataentrada', $('#btn-dateEntrada')[0].parentNode, 'disabled')
        //calendarVenctParcelas('txt_parcelas_vencimentoinicial', $('#txt_parcelas_vencimentoinicial')[0].parentNode, 'disabled')
        $('#btn-dataVenctP').attr('disabled', true)
    } else if (state == 8 || state == '8') {
        bloqueiacampos()
        var tr = $('#tbccusto tbody tr')
        if ($('#sw_solicitacao_pedido')[0].checked == false) {
            $('#div_zpedido').hide()
        }
        resetClass()
        populaDate()

        // if($('#txt_dadosnf_codAcesso').val().trim() != ''){
        // }else{
        //     populaDate()
        // }
        $('#txt_dadosnf_dataentrada').attr('readonly', true)
        // calendarEntrada('txt_dadosnf_dataentrada', $('#btn-dateEntrada')[0].parentNode, 'disabled')
        $('#txta_aprovacao_obs').val('')
        $('#btn_ccusto_download').attr('disabled', true)
        $('#slct_fornec_tipo_pessoa').attr('disabled', true)
        $('#targa_aprovacao_sim').hide()
        $('#targa_aprovacao_nao').hide()
        $('#targa_impostos_sim').hide()
        $('#targa_impostos_nao').hide()
        $('#btn_ccusto_novo').attr('disabled', true)
        $('#btn_ccusto_limpar').attr('disabled', true)
        $('#btn_parcelas_limpar').attr('disabled', true)
        $('#title_aprov').show()
        $('#inicio').show().addClass('progress-bar-success').removeClass('progress-bar-warning')
        $('#aprov').show().addClass('progress-bar-warning')
    } else if (state == 10 || state == '10') {
        $('#txt_dadosnf_dataentrada').attr('readonly', false)
        // calendarEntrada('txt_dadosnf_dataentrada', $('#btn-dateEntrada')[0].parentNode, 'enable')
        $('#hdn_contabilidade').val('')
        if ($('#statusIntegracao').val() == 'false') {
            contabilidadeAjuste()
        } else {
            bloqueiacampos('contabilidade')
            var tr = $('#tbccusto tbody tr')
            resetClass()
            populaDate()
            getUserLanc()
            //bloqueiaImpostos()
            $('.sw-impostos').attr('disabled', false)
            if ($('#txt_dadosnf_ccusto').val() == 'Despesa') {
                $('#txt_outrosicms').val($('#txt_dadosnf_valorbruto').val()).attr('readonly', true)
            }
            if ($('#hdn_sw_lancarM').val() == 'off' || $('#hdn_sw_lancarM').val() == '') {
                impostos('popula')
            }
            if ($('#sw_solicitacao_pedido')[0].checked == false) {
                $('#div_zpedido').hide()
            }
            //$('#txta_impostos_obs').val('')
            $('#slct_fornec_tipo_pessoa').attr('disabled', true)
            $($('#txt_dadosnf_dataentrada')[0].parentNode).addClass('has-error').removeClass('has-success')
            $('#btn_ccusto_download').attr('disabled', true)
            $('#targa_aprovacao_sim').hide()
            $('#targa_aprovacao_nao').hide()
            $('#targa_impostos_sim').hide()
            $('#targa_impostos_nao').hide()
            $('#btn_ccusto_novo').attr('disabled', true)
            $('#btn_ccusto_limpar').attr('disabled', true)
            $('#btn_parcelas_limpar').attr('disabled', true)
            $('#title_aprov').show()
            $('#inicio').show().addClass('progress-bar-success').removeClass('progress-bar-warning')
            $('#aprov').show().addClass('progress-bar-warning')
            $('#txt_dadosnf_dataemissao').attr('readonly', false)
            //calendarEmissao('txt_dadosnf_dataemissao', $('#btn-dateEmissao')[0].parentNode, 'hide')
            $('#txt_dadosnf_valorliquido').attr('readonly', true)
        }
    } else if (state == 27 || state == '27') {
        bloqueiacampos()
        var tr = $('#tbccusto tbody tr')
        resetClass()
        populaDate()
        
    
        $('#slct_fornec_tipo_pessoa').attr('disabled', true)
        $('#targa_aprovacao_sim').hide()
        $('#targa_aprovacao_nao').hide()
        $('#targa_impostos_sim').hide()
        $('#targa_impostos_nao').hide()
        $('#btn_ccusto_novo').attr('disabled', true)
        $('#btn_ccusto_download').attr('disabled', true)
        $('#btn_ccusto_limpar').attr('disabled', true)
        $('#btn_parcelas_limpar').attr('disabled', true)
        $('#txta_obs_fiscal').val($('#txta_impostos_obs').val())
        $('#title_compleT').show()
        $('#inicio').show().addClass('progress-bar-success').removeClass('progress-bar-warning')
        $('#aprov').show().addClass('progress-bar-success').removeClass('progress-bar-warning')
        $('#compleT').show().addClass('progress-bar-warning')
        $('#txt_dadosnf_dataentrada').attr('readonly', true)
        // calendarEntrada('txt_dadosnf_dataentrada', $('#btn-dateEntrada')[0].parentNode, 'disabled')
    } else if (state == 12 || state == 20) {
        limpa_pai_filho('tbaprovacoes')
        if ($("#aprovadoresCC").val().indexOf(';') != -1) {
            var arr = $("#aprovadoresCC").val().split(';')
            $('#aprovAtual').val(arr[0])
        } else {
            $('#aprovAtual').val($("#aprovadoresCC").val())
        }

        if ($('#txt_solicitacao_fornecedor').val() != '') {
            $('#div_ztxt_fornecedor').hide()
            $('#div_txtfornec').show()
        }
        bloqueiacampos('revisao')
        resetClass()
        getSolicitante()
        if ($('#hd_parcelas').val() == 'false' || $('#hd_parcelas').val() == '') {
            $('#div_parcelas').hide()
        }
        if ($('#hdn_sw_pedido').val() == 'off' || $('#hdn_sw_pedido').val() == '') {
            $('#div_zpedido').hide()
        }
        if ($('#hdn_sw_lancarM').val() == 'on') {
            $('#div_znota').hide()
            desbloqueiaCamposNF()
        } else {
            $('#slct_fornec_tipo_pessoa').attr('disabled', true).val($('#hdn_slct_fornec_tipo_pessoa').val())
        }
        //$('#txt_dadosnf_datavenct').val('')
        //$('#hd_datavenct').val('')
        $('#txta_parcelas_obs').attr('readonly', false)
        $('#txta_obs_fiscal').attr('readonly', true)
        $('#btn_ccusto_novo').attr('disabled', true)
        $('#title_revisao').show()
        $('#inicio').show().addClass('progress-bar-success').removeClass('progress-bar-warning')
        $('#aprov').show().addClass('progress-bar-success').removeClass('progress-bar-warning')
        $('#revisao').show().addClass('progress-bar-warning')
        //calendarVenct('txt_parcelas_vencimentoinicial', $('#txt_parcelas_vencimentoinicial')[0].parentNode, 'disabled')
        $('#btn-dataVenctP').attr('disabled', true)
        var hdVenctInicial = $('#hd_venctInicial').val();
        if(hdVenctInicial.indexOf('/') != -1){
            $('#txt_parcelas_vencimentoinicial').val(hdVenctInicial);
        }else{
            $('#txt_parcelas_vencimentoinicial').val( converteDataInicial(hdVenctInicial) );
        }
        $('#txt_parcelas_qntparcelas').attr('readonly', true)
        if($('#txt_dadosnf_codAcesso').val().trim() != ''){
            populaDate(null, 'danfe')
        }else{
            populaDate()
        }
        var tipoLanc = $('#txtz_ccusto_tipolancamento').val()
        if (tipoLanc.length > 0) {
            var tr = $('#tbccusto tbody tr')
            for (var i = 1; i < tr.length; i++) {
                var index = (tr[i].childNodes[3].childNodes[0].id).split('___')[1]
                $('#txt_ccusto_desc___' + index).attr('readonly', true)
                $('#txt_ccusto_valor___' + index).attr('readonly', true)
            }
        }
    }

    $('.validaParcelas').change(function(){
        const id = this.id
        const divPai = this.parentNode

        if (id == 'txt_parcelas_qntparcelas') {
            var qntParcelas = $('#' + id).val()
            var venctInicial = $('#txt_parcelas_vencimentoinicial').val()
            if (qntParcelas != '' && venctInicial != '') {
                $('#btn_parcelas_gerar').attr('disabled', false)
            } else {
                $('#btn_parcelas_gerar').attr('disabled', true)
                limpa_pai_filho('tbparcelas', 'btn')
            }
            if (qntParcelas != '') {
                $(divPai).removeClass('has-error').addClass('has-success')
            } else {
                $(divPai).removeClass('has-success').addClass('has-error')
            }
        }
        else if (id == 'txt_parcelas_vencimentoinicial') {
            var venctInicial = $('#' + id).val()
            var qntParcelas = $('#txt_parcelas_qntparcelas').val()
            $('#hd_venctInicial').val(venctInicial)
            if (qntParcelas != '' && venctInicial != '') {
                $('#btn_parcelas_gerar').attr('disabled', false)
            } else {
                $('#btn_parcelas_gerar').attr('disabled', true)
                limpa_pai_filho('tbparcelas')
            }
        }
    })

    $('#sw_ccusto_aprovador').click(function(){
        if(this.checked){
            $('#div_inputCCA').show('smooth')
        }else{
            $('#div_inputCCA').hide('smooth')
        }
        $($('#ztxt_ccusto_ccaprov').parent()).find('span[class*=__remove]').click()        
    })

    $('.editParcela').change(function(){
        const valueHidden = formataMoedaInt(this.value)
        $($(this).parent()).find('[id*=hd_parcelas_valor]').val(valueHidden)
    })

    $('.fluig-message-page .links li[data-reset-process-instance-id]').click(function(){
        setReadOnly('txt_dadosnf_datavenct', false)
    })
})

function converteDataInicial(dt){
    
    return dt.split('-').reverse().join('/');

}

$(document).on("change", ".validaNF", function () {
    var state = $('#hdn_state').val()
    if (state == '5' || state == '0') {
        var numeroNF = $('#txt_dadosnf_numeronf').val()
        var docFornec = $('#txt_fornec_doc').val()
        var dataEmissao = $('#hd_dataEmissao').val()
        var serie = $('#nroserie').val()
        var valorBruto = $('#txt_dadosnf_valorbruto').val()
        if (numeroNF != '' && docFornec != '' && dataEmissao != '' && serie != '' && valorBruto != '') {
            var constNF = DatasetFactory.createConstraint('NF', numeroNF, numeroNF, ConstraintType.MUST)
            var constFornec = DatasetFactory.createConstraint('FORNEC', docFornec, docFornec, ConstraintType.MUST)
            var constDate = DatasetFactory.createConstraint('DATA_EMISSAO', dataEmissao, dataEmissao, ConstraintType.MUST)
            var constSerie = DatasetFactory.createConstraint('SERIE', serie, serie, ConstraintType.MUST)
            var constSerie = DatasetFactory.createConstraint('VALORBRUTO', valorBruto, valorBruto, ConstraintType.MUST)
            var constraints = new Array(constNF, constFornec, constDate, constSerie)
            var dts = DatasetFactory.getDataset('dts_validaNFduplicada_MFX', null, constraints, null).values

            if (dts.length > 0) {
                $('#numeroNF').text(dts[0].TXT_DADOSNF_NUMERONF)
                $('#docFornec').text(dts[0].TXT_FORNEC_DOC)
                $('#dataEmissao').text(dts[0].HD_DATAEMISSAO)
                $('#serie').text(dts[0].NROSERIE)
                $('#btn_numprocess').val(dts[0].HD_NUMPROCESS)
                $('#valorBruto').text(dts[0].TXT_DADOSNF_VALORBRUTO)
                $('#fundo-alert-2').show('slow')
                $('#fundo-alert').show('slow')
            }
        }
    }
});

function dataAtual() {
    var data = new Date();
    var dia = data.getDate();
    var mes = data.getMonth() + 1;
    var ano = data.getFullYear();

    dia = (dia <= 9 ? "0" + dia : dia);
    mes = (mes <= 9 ? "0" + mes : mes);

    var newData = dia + "/" + mes + "/" + ano;

    return newData;
}

function formataDateAmericana (dataString){
    const partesData = dataString.split("/"); 
    const dia = partesData[0];
    const mes = partesData[1]; 
    const ano = partesData[2]; 
    return new Date(`${ano}-${mes}-${dia}`);
}

function formataData (dataString){
    const regEx = /^\d{4}-\d{2}-\d{2}$/;
    let formatada = dataString
    if(dataString.match(regEx)){
        formatada = dataString.split('-').reverse().join('/')
    }
    return formatada
}
function verificaNFVencida(){
    var data = new Date();
    var dia = data.getDate();
    var mes = data.getMonth() + 1;
    var ano = data.getFullYear();

    dia = (dia <= 9 ? "0" + dia : dia);
    mes = (mes <= 9 ? "0" + mes : mes);

    let dataAtual = dia + "/" + mes + "/" + ano;

    let dataFormatadaAtual = formataDateAmericana(dataAtual)
    let dataVenc = $('#txt_dadosnf_datavenct').val()
    let dataFormatadaVenc = formataDateAmericana(dataVenc)

    if(dataFormatadaAtual > dataFormatadaVenc || dataAtual == dataVenc) {
        $('label').addClass('error')
        $('option').addClass('error')
        $('.has-success').addClass('has-error')
        $('#title_etapa').text('Etapa (EXPIRADA)').addClass('error')
    }else{
        $('label').removeClass('error')
        $('option').removeClass('error')
        $('.has-success').removeClass('has-error')
        $('#title_etapa').text('Etapa').removeClass('error')
    }
}

function acessarSolic(value) {
    window.open(`https://fluig.redeoba.com.br/portal/p/01/pageworkflowview?app_ecm_workflowview_detailsProcessInstanceID=${value}`, "_blank")
}
function contabilidadeAjuste() {
    $('#statusIntegracao').val('')

    if ($('#txt_solicitacao_fornecedor').val() != '') {
        $('#div_ztxt_fornecedor').hide()
        $('#div_txtfornec').show()
    }
    bloqueiacampos('revisao')
    resetClass()
    if ($('#hd_parcelas').val() == 'false' || $('#hd_parcelas').val() == '') {
        $('#div_parcelas').hide()
    }
    if ($('#hdn_sw_pedido').val() == 'off' || $('#hdn_sw_pedido').val() == '') {
        $('#div_zpedido').hide()
    }
    if ($('#hdn_sw_lancarM').val() == 'on') {
        $('#div_znota').hide()
        desbloqueiaCamposNF()
    } else {
        $('#slct_fornec_tipo_pessoa').attr('disabled', true).val($('#hdn_slct_fornec_tipo_pessoa').val())
    }
    //$('#txt_dadosnf_datavenct').val('')
    //$('#hd_datavenct').val('')
    $('#txta_parcelas_obs').attr('readonly', false)
    $('#txta_obs_fiscal').attr('readonly', true)
    $('#btn_ccusto_novo').attr('disabled', true)
    $('#targa_impostos_sim').hide()
    $('#targa_impostos_nao').hide()
    $('#title_revisao').show()
    $('#inicio').show().addClass('progress-bar-success').removeClass('progress-bar-warning')
    $('#aprov').show().addClass('progress-bar-success').removeClass('progress-bar-warning')
    $('#revisao').show().addClass('progress-bar-warning')
    //calendarVenct('txt_parcelas_vencimentoinicial', $('#txt_parcelas_vencimentoinicial')[0].parentNode, 'disabled')
    $('#btn-dataVenctP').attr('disabled', true)
    var hdVenctInicial = $('#hd_venctInicial').val();
    if(hdVenctInicial.indexOf('/') != -1){
        $('#txt_parcelas_vencimentoinicial').val(hdVenctInicial);
    }else{
        $('#txt_parcelas_vencimentoinicial').val( converteDataInicial(hdVenctInicial) );
    }
    $('#txt_parcelas_qntparcelas').attr('readonly', true)
    populaDate('revisao')
    var tipoLanc = $('#txtz_ccusto_tipolancamento').val()
    if (tipoLanc.length > 0) {
        var tr = $('#tbccusto tbody tr')
        for (var i = 1; i < tr.length; i++) {
            var index = (tr[i].childNodes[3].childNodes[0].id).split('___')[1]
            $('#txt_ccusto_desc___' + index).attr('readonly', true)
            $('#txt_ccusto_valor___' + index).attr('readonly', true)
        }
    }
}
function validaDataCompetencia(value) {
    $('#hd_datacompetencia').val(value)
}
function bloqueiaImpostos() {
    var swLancM = $('#hdn_sw_lancarM').val()
    //var baseCalculo = $('#basecalculo').val()
    if (swLancM == 'on') {
        var vlBruto = $('#txt_dadosnf_valorbruto').val()
        for (var i = 0; i < $('.sw-impostos').length; i++) {
            $('.sw-impostos')[i].checked = false
        }
        $('.sw-impostos').attr('disabled', false)

    } else {
        $('#spaninssJ').css('cursor', 'default')
        $('#spaninssF').css('cursor', 'default')
        $('#spanirrfF').css('cursor', 'default')
        $('#spanirrfJ').css('cursor', 'default')
        $('#spancsll').css('cursor', 'default')
        $('#spancofins').css('cursor', 'default')
        $('#spanpis').css('cursor', 'default')
        $('#spaniss').css('cursor', 'default')
        $('#spanipi').css('cursor', 'default')
        $('#spanicms').css('cursor', 'default')

    }
}
function validaGuia(value) {
    $('#hd_guiaImposto').val(value)
}
/*function validaTipo(value){
    $('#hd_slct_solicitacao_tipo').val(value)
}*/
function populaDate(state, danfe) {
    if(!danfe){
        $('#txt_dadosnf_dataemissao').attr('readonly', true)
    }
    $('#txt_dadosnf_dataemissao').val(($('#hd_dataEmissao').val()).split('/').reverse().join('-'))
    $('#txt_dadosnf_datavenct').val(($('#hd_datavenct').val()).split('/').reverse().join('-'))
    if (state) {
        $('#txt_dadosnf_datavenct').attr('readonly', false)
    } else {
        $('#txt_dadosnf_datavenct').attr('readonly', true)
    }
}
function resetClass() {
    var el = $('.has-error')
    for (var i = 0; i < el.length; i++) {
        $(el[i]).addClass('has-success').removeClass('has-error');
    }
}
function validaTipoPgt(value) {
    $('#hd_slct_dadosnf_tipopg').val(value)
    if (value == 'deposito') {
        $('#panel-banco').show('smooth')
    } else {
        $('#panel-banco').hide('smooth')
    }
}
function desbloqueiaCamposNF() {
    $('#slct_fornec_tipo_pessoa').attr('disabled', false).val($('#hdn_slct_fornec_tipo_pessoa').val())
    $('#txt_fornec_doc').attr('readonly', false)
    $('#txt_dadosnf_dataemissao').attr('readonly', false)
    $('#txt_dadosnf_numeronf').attr('readonly', false)
    $('#txt_dadosnf_valorbruto').attr('readonly', false)
    $('#txt_dadosnf_valorliquido').attr('readonly', false)
}
function bloqueiacampos(state) {
    if (state != 'revisao') {
        var tr = $('#tbccusto tbody tr')

        for (var i = 1; i < tr.length; i++) {
            var index = (tr[i].childNodes[3].childNodes[0].id).split('___')[1]
            $('#txt_ccusto_desc___' + index).attr('readonly', true)
            $('#txt_ccusto_valor___' + index).attr('readonly', true)
        }
        $('#btn_parcelas_edit').attr('disabled', true)
        $('#img_parcelas_trash').attr('disabled', true)
        $('#btn_parcelas_gerar').attr('disabled', true)
        $('#btn_parcelas_recalcular').attr('disabled', true)
        $('.btn-trash').hide()
        $('.btn-edit').hide()
        if (state != 'contabilidade') {
            $('#btn-dateEmissao').click()
        }
        $('#txt_dadosnf_datavenct').attr('readonly', true)
        $('#txt_dadosnf_dataemissao').attr('readonly', true)
        // calendarVenct('txt_dadosnf_datavenct', $('#txt_dadosnf_datavenct')[0].parentNode, 'disabled')
        $('#slct_dadosnf_tipopg').attr('disabled', true).val($('#hd_slct_dadosnf_tipopg').val())
        $('#slct_dadosnf_guia').attr('disabled', true).val($('#hd_guiaImposto').val())
        //$('#slct_solicitacao_tipo').attr('disabled', true).val($('#hd_slct_solicitacao_tipo').val())
        $('#btn-dataVenctP').attr('disabled', true)
        /* setTimeout(function(){
                 window['modelo'].disable(true)
         },1500)*/

        if ($('#txt_solicitacao_fornecedor').val() == '') {
            $('#div_ztxt_fornecedor').show()
            $('#div_txtfornec').hide()
        } else {
            $('#div_ztxt_fornecedor').hide()
            $('#div_txtfornec').show()
        }
    } else if (state == 'revisao') {
        $('#sw_solicitacao_lancarM').attr('disabled', true)
        if ($('#hdn_sw_lancarM').val() != 'on') {
            $('#txt_dadosnf_dataentrada').attr('readonly', false)
        }
        // calendarVenct('txt_dadosnf_datavenct', $('#txt_dadosnf_datavenct')[0].parentNode, 'enable')
    }
    var hdVenctInicial = $('#hd_venctInicial').val();
    if(hdVenctInicial.indexOf('/') != -1){
        $('#txt_parcelas_vencimentoinicial').val(hdVenctInicial);
    }else{
        $('#txt_parcelas_vencimentoinicial').val( converteDataInicial(hdVenctInicial) );
    }
    setReadOnly('txt_parcelas_vencimentoinicial', true)
    if ($('#hd_origem').val() == 'true') {
        $('#divMunicipios').show()
        //setReadOnly('nroserie', true)
    }
    if ($('#hdn_sw_lancarM').val() == 'on') {
        $('#div_ztxt_nota').hide()
        $('#div_txtnota').hide()
        $('#div_chaveAcesso').show()
        $('#div_znota').hide()
    } else {
        if ($('#ztxt_solicitacao_nota').val().length == 0) {
            $('#div_txtnota').show()
            $('#div_ztxt_nota').hide()
        } else {
            $('#div_txtnota').hide()
            $('#div_ztxt_nota').show()
        }
        $('#div_chaveAcesso').hide()
    }
    $('#btn_ccusto_upload').attr('disabled', true)
    var tr = $('#tbparcelas tbody tr')
    for (var e = 1; e < tr.length; e++) {
        var index = (tr[e].childNodes[5].childNodes[0].id).split('___')[1]
        $('#txt_parcelas_valor___' + index).attr('readonly', true)
        $('#txt_parcelas_vencimento___' + index).attr('readonly', true).val($('#hd_vencimento___' + index).val())
        //calendarVenctParcelas('txt_parcelas_vencimento___'+index, $('#txt_parcelas_vencimento___'+index)[0].parentNode, 'disabled') 
    }
    //calendarVenctParcelas('txt_parcelas_vencimentoinicial', $('#txt_parcelas_vencimentoinicial')[0].parentNode, 'disabled')
    $('#slct_dadosnf_guia').val($('#hd_guiaImposto').val())
    $('#slct_dadosnf_tipopg').val($('#hd_slct_dadosnf_tipopg').val())
    $('#divNatureza').show()
    if ($('#basecalculo').val() == 'true') {
        $('#img_basecalculo').attr('src', 'img/basecalculo_true.png')
    } else {
        $('#img_basecalculo').attr('src', 'img/basecalculo_false.png')
    }
}
function novo() {
    var add = wdkAddChild("tbccusto")
    return add
}
function delet(el, table) {
    if (table == 'tbcusto') {
        var tr = $('#tbccusto tbody tr')
        if (tr.length == 0) {
            $('#btn_ccusto_upload').attr('disabled', false)
            limpadivcalculo()
        }
        limpadivcalculo()
        $('#btn_ccusto_novo').attr('disabled', false)

        var valorrest = formataMoedaInt($('#txt_ccusto_valorrest').val())
        var valorinserido = formataMoedaInt($('#txt_ccusto_valorinserido').val())
        var id = ((el.parentNode.parentNode).children)[2].children[0].id
        var index = id.split('___')[1]
        var valor = formataMoedaInt($('#hdn_parcelas_valor___' + index).val())
        $('#txt_ccusto_valorrest').val(formataIntMoeda(valorrest + valor))
        $('#txt_ccusto_valorinserido').val(formataIntMoeda(valorinserido - valor))
    }
    var remov = fnWdkRemoveChild(el);
}
function validaInputVenct(value, id, obj, divPai) {
    if (value != '') {
        verificaNFVencida()
        var prazo = $('#hd_prazo').val()
        var state = $('#hdn_state').val()
        state == '12' || state == '20' ? prazo = 'Nao' : ''
        if (prazo == 'Sim') {
            const dtsPrazo = DatasetFactory.getDataset('fsPrazoLancamentoNota').values
            if(dtsPrazo.length > 0){
                const prazoDias = parseInt(dtsPrazo[0].prazoDias)
                var dataAtual = $('#txt_solicitacao_data').val()
                var min = new Date(dataAtual.split('/').reverse().join('/'))
                min.setDate(min.getDate() + prazoDias)
                var data = new Date(value.split('/').reverse().join('/'))
                var dataAtual = $('#txt_solicitacao_data').val()
                var dateAtual = new Date(dataAtual.split('/').reverse().join('/'))
                if (data < min) {
                    FLUIGC.toast({
                        title: 'AVISO',
                        message: `O dia minimo para a data de vencimento é de ${prazoDias} dias depois do lançamento da NF!`,
                        type: 'Danger'
                    });
                    $('#' + id).val('')
                    $('#hd_datavenct').val('')
                    $('#txt_parcelas_vencimentoinicial').val('')
                    $('#hd_venctInicial').val('')
                    hideParcelas()
                } else if (data < dateAtual) {
                    FLUIGC.toast({
                        title: 'AVISO',
                        message: 'Data selecionada antessede a data atual!',
                        type: 'Danger'
                    });
                } else {
                    $('#hd_datavenct').val(value.split('-').reverse().join('/'))
                    $('#hd_venctInicial').val(value.split('-').reverse().join('/'))
                    var state = $('#hdn_state').val()
                    if ((state == '20' || state == '12') && $('#sw_ccusto_parcelas')[0].checked == true) {
                        $('#hd_datavenct').val(value.split('-').reverse().join('/'))
                        $('#txt_parcelas_vencimentoinicial').val(value.split('-').reverse().join('/'))
                        $('#hd_venctInicial').val(value.split('-').reverse().join('/'))
                        var tr = $('#tbparcelas tbody tr')
                        if (tr.length > 1) {
                            $('#txt_parcelas_vencimento___1').val(value.split('-').reverse().join('/'))
                            $('#hd_vencimento___1').val(value.split('-').reverse().join('/'))
                        }
                    } else if ($('#txt_ccusto_valorinserido').val() == $('#txt_dadosnf_valorbruto').val() && $('#hd_venctInicial').val() != '') {
                        //$('#div_swparcelas').show('smooth, swing')
                        $('#txt_dadosnf_datavenct').attr('readonly', true)

                        //calendarVenct('txt_dadosnf_datavenct', $('#txt_dadosnf_datavenct')[0].parentNode, 'disabled')
                    }
                }
            }
        } else {
            $('#hd_datavenct').val(value.split('-').reverse().join('/'))
            $('#hd_venctInicial').val(value.split('-').reverse().join('/'))
            var state = $('#hdn_state').val()
            if ((state == '20' || state == '12') && $('#sw_ccusto_parcelas')[0].checked == true) {
                $('#txt_parcelas_vencimentoinicial').val(value.split('-').reverse().join('/'))
                var tr = $('#tbparcelas tbody tr')
                if (tr.length > 1) {
                    $('#txt_parcelas_vencimento___1').val(value.split('-').reverse().join('/'))
                    $('#hd_vencimento___1').val(value.split('-').reverse().join('/'))
                }
            } else if ($('#txt_ccusto_valorinserido').val() == $('#txt_dadosnf_valorbruto').val() && $('#hd_venctInicial').val() != '') {
                //$('#div_swparcelas').show('smooth, swing')
                $('#txt_dadosnf_datavenct').attr('readonly', true)

                //calendarVenct('txt_dadosnf_datavenct', $('#txt_dadosnf_datavenct')[0].parentNode, 'disabled')
            }
        }
    } else {
        var state = $('#hdn_state').val()
        $('#hd_datavenct').val('')
        $('#txt_parcelas_vencimentoinicial').val('')
        $('#hd_venctInicial').val('')
        var tr = $('#tbparcelas tbody tr')
        if (state != '20' && state != '12') {
            hideParcelas()
        } else if (tr.length > 1) {
            $('#txt_parcelas_vencimento___1').val('')
            $('#hd_vencimento___1').val('')
        }
    }
    validaInput(obj, divPai)

}
function hideParcelas() {
    $('#sw_ccusto_parcelas')[0].checked = false
    $('#sw_ccusto_parcelas').change()
}

function validaDate(obj, divPai, value) {
    if (value != 'txt_dadosnf_dataemissao') {
        const dataFormatada = value.split('-').reverse().join('/')
        $('#hd_dataEmissao').val(dataFormatada)
        validaInput(obj, divPai)
        //('#txt_parcelas_vencimentoinicial').val(value)
        //$('#hd_venctInicial').val(value)
        if ($('#txt_dadosnf_codAcesso').val().length == 0) {
            var dateSplitada = dataFormatada.split('/')
            var dateCompetencia = dateSplitada[1] + '/' + dateSplitada[2]
            $('#hd_datacompetencia').val(dateCompetencia)
            $('#txt_dadosnf_datacompetancia').val(dateCompetencia).change()
        }
    }
}
function calendarEmissao(id, divPai, mod) {
    var checkSw = $('#sw_solicitacao_lancarM')[0].checked
    var calendarEmi = FLUIGC.calendar('#' + id);
    if (checkSw != false) {
        if (mod == 'show') {
            calendarEmi.show()
        }
        calendarEmi.enable()
        $(divPai).addClass('has-success').removeClass('has-error');
        $(`#${id}`).attr('readonly', false)
    } else {
        calendarEmi.disable()
    }
}
function calendarEntrada(id, divPai, mod) {
    var calendarEntrada = FLUIGC.calendar('#' + id);
    if (mod == 'show') {
        calendarEntrada.show()
    } else if (mod == 'enable') {
        calendarEntrada.enable()
        $('#' + id).attr('disabled', false).attr('readonly', false)
        $('#btn-dateEntrada').attr('disabled', false)
    } else {
        calendarEntrada.disable()
        $('#' + id).attr('disabled', true)
        $('#btn-dateEntrada').attr('disabled', true)
    }
}
function dataEntrada(value, divPai) {
    if (value.trim() == '') {
        $('#hd_dataEntrada').val('')
        $(divPai).addClass('has-error').removeClass('has-success')
    } else {
        $('#hd_dataEntrada').val(value.split('-').reverse().join('/'))
        $(divPai).addClass('has-success').removeClass('has-error')
    }
}
/*function calendarVenctParcelas(id, divPai, mod){
    var data = FLUIGC.calendar('#'+id);
    if(mod == 'disabled'){
        data.disable()
        $('#btn-dataVenctP').attr('disabled', true)
    }else if(mod == 'enable'){
        data.enable()
        $('#btn-dataVenctP').attr('disabled', false)
    }else{
        data.enable()
        data.show()
        //$(divPai).addClass('has-success').removeClass('has-error');
    }
}*/
function calendarVenct(id, divPai, mod) {
    var prazo = $('#hd_prazo').val()
    if (prazo == 'Sim') {
        var dia = new Date();
        dia.setDate(dia.getDate() + 15);
        var calendarVenct = FLUIGC.calendar('#' + id, {
            minDate: dia
        }
        );
    } else {
        var calendarVenct = FLUIGC.calendar('#' + id)
    }

    if (mod == 'disabled') {
        calendarVenct.disable()
        $('#btn-dateVenct').attr('disabled', true)
    } else if (mod == 'enable') {
        calendarVenct.enable()
        $('#btn-dateVenct').attr('disabled', false)
    } else {
        calendarVenct.enable()
        calendarVenct.show()
        $(divPai).addClass('has-success').removeClass('has-error');
    }
}
function btnswitch(obj, divPai) {
    if (obj.id == 'sw_solicitacao_pedido') {
        if ($('#' + divPai).css('display') == 'none') {
            // $('#ztxt_solicitacao_pedido').attr('readonly', false)
            //window["ztxt_solicitacao_pedido"].disable(false)
            //filterPedidos[0].disable(false)
            $('#' + divPai).show('smooth');
            if ($('#txt_solicitacao_fornecedor').val() != '') {
                var doc = $('#txt_fornec_doc').val().replaceAll('.', '').replaceAll('/', '').replaceAll('-', '').trim()
                getFornec(doc, true)
            }
            $('#hdn_sw_pedido').val('on')
            $($('#' + obj.id)[0].parentNode).addClass('has-error').removeClass('has-success')
            window['ztxt_ccusto_ccaprov'].clear()
            window['ztxt_ccusto_ccaprov'].disable(true)
            // window['ztxt_solicitacao_pedido'].disable(false)
            // filterPedidos[0].disable(false)
        } else {
            //window["ztxt_solicitacao_pedido"].disable(true)
            //filterPedidos[0].disable(true)
            //filterPedidos[0].removeAll()
            window["ztxt_solicitacao_pedido"].clear()
            //var divPai = $("#div_ztxt_pedido")
            $('#' + divPai).hide('smooth');
            $($('#' + obj.id)[0].parentNode).addClass('has-success').removeClass('has-error')
            $('#hdn_sw_pedido').val('off')
            window['ztxt_ccusto_ccaprov'].clear()
            window['ztxt_ccusto_ccaprov'].disable(false)
            //window['ztxt_solicitacao_pedido'].disable(true)
            //filterPedidos[0].disable(true)
        }
    }
    else if (obj.id == 'sw_solicitacao_lancarM') {
        if ($('#' + divPai).css('display') != 'none') {
            var fornec = $('#ztxt_solicitacao_fornecedor').val()
            var pedido = $('#ztxt_solicitacao_pedido').val()
            pedido.length == 0 ? limpacampos() : limpacampos('true')
            if (fornec.length == 0 && pedido.length == 0) {
                resetFornec()
                $('#slct_fornec_tipo_pessoa').attr('disabled', false)
                limpaHiddens()
            } else {
                $('#hd_guiaImposto').val('')
                $('#hd_datavenct').val('')
                $('#hd_datacompetencia').val('')
                $('#hd_dataEmissao').val('')
                $('#hd_slct_dadosnf_tipopg').val('')
                $('#seqnota').val('')
            }
            window["ztxt_solicitacao_nota"].clear()
            $('#' + divPai).hide('smooth');
            $('#div_chaveAcesso').show('smooth')
            $('#hdn_sw_lancarM').val('on')
            limpaChaveAcesso()
            $($('#' + obj.id)[0].parentNode).addClass('has-error').removeClass('has-success')
            $('#hd_impostos').val('')
            $('#txt_dadosnf_dataemissao').attr('readonly', false).val('')
            $('#txt_dadosnf_datavenct').val('')
            //$('#txt_dadosnf_datacompetancia').attr('readonly', false).val('')
            if (pedido.length == 0) {
                $('#txt_dadosnf_valorbruto').attr('readonly', false).val('')
                $('#txt_dadosnf_numeronf').attr('readonly', false).val('')
            } else {
                if ($('#txt_dadosnf_numeronf').val() == '') {
                    $('#txt_dadosnf_numeronf').attr('readonly', false).val('')
                }
            }
            $('#txt_dadosnf_valorliquido').attr('readonly', false).val('')
            $('#txt_ccusto_valornf').val('')
            validaVl('txt_dadosnf_valorbruto', $('#txt_dadosnf_valorbruto').val(), $('#txt_dadosnf_valorbruto')[0].parentNode)
            //calendarEmissao('txt_dadosnf_dataemissao', $('#btn-dateEmissao')[0].parentNode, 'hide')
            $('#txt_dadosnf_dataemissao').val('')
            $('#txt_dadosnf_dataemissao').attr('readonly', false)
            $('#hd_dataEmissao').val('')
        } else {
            // filterNF.disable(false)
            //$('#modelo').attr('readonly', true)
            limpaHiddens()
            var fornec = $('#ztxt_solicitacao_fornecedor').val()
            var pedido = $('#ztxt_solicitacao_pedido').val()
            pedido.length == 0 ? limpacampos() : limpacampos('true')
            if (fornec.length == 0 && pedido.length == 0) {
                $('#txt_fornec_doc').attr('readonly', true)
                $('#slct_fornec_tipo_pessoa').attr('disabled', true)
                window['ztxt_solicitacao_fornecedor'].clear()
                window['ztxt_solicitacao_fornecedor'].disable(false)
                resetFornec()
                $('#txt_dadosnf_valorbruto').attr('readonly', true).val('')
                $('#txt_dadosnf_numeronf').attr('readonly', true).val('')
            } else {
                if ($('#txt_dadosnf_numeronf').val() == '') {
                    $('#txt_dadosnf_numeronf').attr('readonly', false).val('')
                }
            }
            window["ztxt_solicitacao_nota"].clear()
            window["ztxt_solicitacao_nota"].disable(false)
            $('#ztxt_solicitacao_nota').attr('disabled', false)
            limpaChaveAcesso()
            //var divPai = $("#div_ztxt_nota")
            $('#div_chaveAcesso').hide('smooth')
            $('#' + divPai).show('smooth');
            $($('#' + obj.id)[0].parentNode).addClass('has-success').removeClass('has-error')
            $('#hdn_sw_lancarM').val('off')
            $('#txt_dadosnf_dataemissao').attr('readonly', true).val('')
            $('#txt_dadosnf_datavenct').val('')
            $('#hd_dataEmissao').val('')
            $('#txt_dadosnf_datacompetancia').attr('readonly', true).val('')
            $('#hd_impostos').val('')
            $('#txt_dadosnf_valorliquido').attr('readonly', true).val('')
            $('#txt_ccusto_valornf').val('')
            validaVl('txt_dadosnf_valorbruto', $('#txt_dadosnf_valorbruto').val(), $('#txt_dadosnf_valorbruto')[0].parentNode)
            //calendarEmissao('txt_dadosnf_dataemissao', $('#btn-dateEmissao')[0].parentNode, 'hide')
            $('#txt_dadosnf_dataemissao').attr('readonly', false)

        }
    }
    else if (obj.id == 'sw_ccusto_parcelas') {
        if (obj.checked == true) {

            if(!$("#txt_dadosnf_datavenct").val() == ''){
                if(formataMoedaInt($('#txt_ccusto_valorrest').val()) == 0 && formataMoedaInt($('#txt_ccusto_valorinserido').val()) != 0){
                    $('#div_parcelas').show('smooth')
                    $('.div_calculo').hide()
                    $('#txt_parcelas_valornf').val($('#txt_dadosnf_valorliquido').val())
                    $('#txt_parcelas_valorrest').val($('#txt_ccusto_valorrest').val())
                    $('#txt_parcelas_valorinserido').val($('#txt_dadosnf_valorliquido').val())
                    $('#hd_parcelas').val('true')
                    //calendarVenct('txt_parcelas_vencimentoinicial', $('#txt_parcelas_vencimentoinicial')[0].parentNode, 'enable')
                    $('#txt_dadosnf_datavenct').attr('readonly', true)
                    // calendarVenct('txt_dadosnf_datavenct', $('#txt_dadosnf_datavenct')[0].parentNode, 'disabled')
                    $('#txt_parcelas_qntparcelas').val('').attr('readonly', false)
                    //$('#txt_parcelas_vencimentoinicial').val($('#hd_dataEmissao').val())
                    //$('#hd_venctInicial').val($('#hd_dataEmissao').val())
                    var hdVenctInicial = $('#hd_venctInicial').val();
                    if(hdVenctInicial.indexOf('/') != -1){
                        $('#txt_parcelas_vencimentoinicial').val(hdVenctInicial);
                    }else{
                        $('#txt_parcelas_vencimentoinicial').val( converteDataInicial(hdVenctInicial) );
                    }
                    $('#btn_parcelas_gerar').attr('disabled', true)
                }else{
                    FLUIGC.toast({
                        title: 'AVISO',
                        message: 'Ainda há valor restante.',
                        type: 'Danger'
                    });
    
                    $('#sw_ccusto_parcelas')[0].checked = false
                }
            }else{
                FLUIGC.toast({
                    title: 'AVISO',
                    message: 'Selecione a data de vencimento.',
                    type: 'Danger'
                });

                $('#sw_ccusto_parcelas')[0].checked = false
            }



        } else {
            $('#div_parcelas').hide('smooth')
            $('.div_calculo').hide()
            $('#txt_parcelas_qntparcelas').val('')
            $('#txt_parcelas_vencimentoinicial').val('')
            $('#txt_dadosnf_datavenct').attr('readonly', false)
            // calendarVenct('txt_dadosnf_datavenct', $('#txt_dadosnf_datavenct')[0].parentNode, 'enable')
            $('#hd_parcelas').val('false')
            $($('#txt_parcelas_qntparcelas')[0].parentNode).removeClass('has-success').addClass('has-error')
            //$($('#txt_parcelas_vencimentoinicial')[0].parentNode).removeClass('has-success').addClass('has-error')
        }
    }
}
function limpaHiddens() {
    $('#hd_guiaImposto').val('')
    $('#hd_datavenct').val('')
    $('#hd_datacompetencia').val('')
    $('#hd_dataEmissao').val('')
    $('#hd_slct_dadosnf_tipopg').val('')
    //$('#hd_slct_solicitacao_tipo').val('')
    $('#seqnota').val('')
    $('#seqpessoa').val('')
    $('#hdn_slct_fornec_tipo_pessoa').val('')
}
function limpacampos(pedido) {
    $('#txt_dadosnf_dataemissao').val('')
    $('#slct_dadosnf_tipopg').val('Selecione')
    $('#slct_dadosnf_guia').val('Selecione')
    $('#txt_dadosnf_datavenct').val('')
    $('#txt_parcelas_vencimentoinicial').val('')
    $('#hd_venctInicial').val('')
    if (!pedido) {
        limpaNat()
    }
    $('#txt_dadosnf_ccusto').val('')
    $('#txt_dadosnf_datacompetancia').val('')
}
function limpaNat() {
    window['ztxt_dadosnf_natureza'].clear()
    $('#nroplanilha').val('')
    $('#contacredito').val('')
    $('#contadebito').val('')
    $('#modelo').val('')
    $('#especie').val('')
    $('#nroserie').val('')
    $('#divNatureza').hide('smooth')
    $('#divMunicipios').hide('smooth')
    $('#tipoCt').val('')
    window['ztxt_municOrig'].clear()
    window['ztxt_municDenst'].clear()
    window['ztxt_estOrig'].clear()
    window['ztxt_estDenst'].clear()
    $($('#ztxt_estOrig')[0].parentNode).addClass('has-error').removeClass('has-success')
    $($('#ztxt_estDenst')[0].parentNode).addClass('has-error').removeClass('has-success')
}
function validaVenc(date, item) {
    var verificainvalido = false
    var dateEmissao = item['Data de Emissão'].split('/')
    var dateCompetencia = new Date(dateEmissao[1] + '/' + dateEmissao[0] + '/' + dateEmissao[2])
    dateCompetencia.setDate(dateCompetencia.getDate() + 10)
    var dataAtual2 = new Date();

    // var dateCompetencia = (Date.parse(dateEmissao).setDate(date.getDate() + 10)).split('/')
    if (dataAtual2 > dateCompetencia) {
        alert('competencia')
    }

    function alert(motivo) {
        if (motivo == 'competencia') {
            FLUIGC.toast({
                title: 'AVISO',
                message: 'A NF ultrapassou a data de competencia',
                type: 'Danger'
            });
        }
        verificainvalido = true
        window['ztxt_solicitacao_nota'].clear()
        removedZoomItem(item)
    }
    if (verificainvalido == true) {
        return 'invalido'
    }
}
function validaTipoPessoa(doc) {
    var documento = doc.replace('-', '').trim()
    if (documento.length == 11) {
        return 'fisica'
    } else if (documento.length >= 12) {
        return 'juridica'
    } else {
        return ''
    }
}
// function calculaVlLiquido(impostos, vlRetencoes, vlBruto){
//     if(impostos && vlRetencoes && vlBruto){
//         if(typeof(vlBruto) == 'number'){
//             var vlLiquido = vlBruto
//         }else{
//             var vlLiquido = formataMoedaInt(vlBruto.replace('.',','))
//         }
//         for(var i = 0; i < impostos.length; i++){
//             vlLiquido = vlLiquido - formataMoedaInt(impostos[i].replace('.',','))
//         }
//         return vlLiquido
//     }
//    /*var vlLiquido = formataMoedaInt(liquido.replace('.', ','))
//    var vlImpostos = formataMoedaInt(impostos.replace('.', ','))
//    var bruto = formataIntMoeda(vlLiquido + vlImpostos)
//     return bruto*/
// }
function formataCNPJ(cnpj) {
    //realizar a formatação..
    return cnpj.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, "$1.$2.$3/$4-$5")
}
function formataCPF(cpf) {
    //realizar a formatação...
    return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
}
function strMoeda(value) {
    value == 'null' ? retorno = 'R$ 0,00' : retorno = formataIntMoeda(parseFloat(value))
    return retorno
}
function impostos(mod, item) {
    if (mod) {
        var tipoPessoa = $('#hdn_slct_fornec_tipo_pessoa').val()
        var impostos = $('#hd_impostos').val()
        var obj = JSON.parse(impostos)
        var Arrayimpostos = new Array()
        //icms não está vindo da tabela da sistax
        popula('icms', obj.valoricms)
        //ipi seria somente para nf de produto (nao vem da sistax tbm)  
        popula('ipi', obj.valoripi)
        //iss
        popula('iss', obj.valoriss)
        //csll
        popula('csll', obj.valorcsll)
        //pis
        popula('pis', obj.valorpis)
        //confins
        popula('cofins', obj.valorcofins)
        //
        Arrayimpostos.push(obj.valoricms, obj.valorip, obj.valoriss, obj.valorcsll, obj.valorpis, obj.valorcofins)
        //irrf fisica e juridica
        if (tipoPessoa == 'juridica') {
            popula('irrfJ', obj.hd_valorirrfJ)
            popula('irrfF', obj.hd_valorirrfF)
        } else if (tipoPessoa == 'fisica') {
            popula('irrfF', obj.hd_valorirrfF)
            popula('irrfJ', obj.hd_valorirrfJ)
        }
        Arrayimpostos.push(obj.hd_valorirrfF, obj.hd_valorirrfJ)

        //inss fisica e juridica
        if (tipoPessoa == 'juridica') {
            popula('inssJ', obj.valorinssJ)
            popula('inssF', obj.hd_valorinssF)
        } else if (tipoPessoa == 'fisica') {
            popula('inssF', obj.hd_valorinssF)
            popula('inssJ', obj.valorinssJ)
        }
        Arrayimpostos.push(obj.hd_valorinssF, obj.valorinssJ)
        //deducoes
        if (obj.valordeducao == '0') {
            var valorTotal = 0
            for (var i = 0; i < Arrayimpostos.length; i++) {
                var valor = Arrayimpostos[i]
                if (valor == 'null' || valor == '0' || valor == undefined) {
                    valor = 0
                }
                valorTotal = valorTotal + parseFloat(valor)
            }
            $('#txt_valordeducao').val(strMoeda(valorTotal))
            obj.valordeducao = String(valorTotal)
            var JSONstring = JSON.stringify(obj)
            $('#hd_impostos').val(JSONstring)
        }
    } else {
        var idsImpostos = ['icms', 'ipi', 'iss', 'csll', 'pis', 'cofins', 'irrfJ', 'irrfF', 'inssF', 'inssJ']
        idsImpostos.forEach(limpaImpostos)
        $('#txt_valordeducao').val('')
    }
    function popula(imposto, value) {
        var baseCalculo = $('#basecalculo').val()
        var vlBruto = formataMoedaInt($('#txt_dadosnf_valorbruto').val())
        if (value != 'null' && value != '0' && value != undefined) {
            $('#txt_valor' + imposto).val(strMoeda(value))
            if (imposto != 'inss') {
                var aliq = aliquota(parseFloat(value), vlBruto)
                $('#txt_aliq' + imposto).val(aliq)
                $('#txt_base' + imposto).val($('#txt_dadosnf_valorbruto').val())
            }
            /*var vlDeducoes = $('#txt_valordeducao').val()
            if(vlDeducoes == '' || vlDeducoes == undefined || vlDeducoes == null){
                vlDeducoes = 0
            }else{
                vlDeducoes = formataMoedaInt(vlDeducoes)
            }
            var total = formataMoedaInt(value)+vlDeducoes
            $('#txt_valordeducao').val(total)*/
        } else {
            $('#txt_aliq' + imposto).val('0%')
            $('#txt_valor' + imposto).val('R$ 0,00')
            if (imposto == 'icms') {
                $('#txt_isento' + imposto).val('R$ 0,00')
                if(formataMoedaInt($('#txt_outrosicms').val()) == 0){
                    $('#txt_base' + imposto).val('R$ 0,00')
                }else{
                    $('#txt_base' + imposto).val($('#txt_dadosnf_valorbruto').val())
                }
            } else if (imposto == 'ipi') {
                $('#txt_isento' + imposto).val('R$ 0,00')
                $('#txt_outros' + imposto).val('R$ 0,00')
                $('#txt_base' + imposto).val('R$ 0,00')
            }else{
                $('#txt_base' + imposto).val('R$ 0,00')

            }
        }
    }
    function aliquota(imposto, vlBruto) {
        var aliq = ((imposto * 100) / vlBruto)
        return aliq.toFixed(2) + '%'
    }
}
function populaHiddensImpostos(item) {
    var tipoPessoa = $('#hdn_slct_fornec_tipo_pessoa').val()
    var impostos = {
        valoricms: '0',
        valoripi: '0',
        valoriss: item['VLRISS'],
        valorpis: item['VLRPIS'],
        valorcofins: item['VLRCOFINS'],
        valorcsll: item['VLRCSLL'],
        valordeducao: item['VLRDEDUCOES'],
    }
    if (tipoPessoa == 'juridica') {
        impostos['valorinssJ'] = item['VLRINSS']
        impostos['hd_valorirrfJ'] = item['VLRIR']
        impostos['hd_valorirrfF'] = '0'
        impostos['hd_valorinssF'] = '0'
    } else if (tipoPessoa == 'fisica') {
        impostos['hd_valorinssF'] = item['VLRINSS']
        impostos['hd_valorirrfF'] = item['VLRIR']
        impostos['hd_valorirrfJ'] = '0'
        impostos['valorinssJ'] = '0'
    }
    var JSONstring = JSON.stringify(impostos)
    $('#hd_impostos').val(JSONstring)
}
function limpaImpostos(imposto) {
    var baseCalculo = $('#basecalculo').val()
    $('#txt_base' + imposto).val('')
    $('#txt_aliq' + imposto).val('')
    $('#txt_valor' + imposto).val('')
    $('#hd_valor' + imposto).val('')
    if (imposto == 'icms' || imposto == 'ipi') {
        $('#txt_isento' + imposto).val('')
        if (baseCalculo != 'true' || imposto == 'ipi') {
            $('#txt_outros' + imposto).val('')
        }
    }
}

function balanceCalculation(field, value){
    let infoBalance = {
        order           : $('#ztxt_solicitacao_pedido').val(),
        invoice         : $('#ztxt_solicitacao_nota').val(),
        grossValue      : $("#txt_dadosnf_valorbruto").val(),
        balance         : ''
    }

    if (infoBalance.order.length > 0 && infoBalance.invoice.length > 0) {
        field == 'pedido' ? infoBalance.balance = parseFloat(value) - parseFloat(infoBalance.grossValue) : infoBalance.balance = parseFloat(infoBalance.grossValue) - parseFloat(value)

        if (infoBalance.balance != '' && infoBalance.grossValue > 0) {
            $("#field_balance").show('smooth')
            $("#txt_ccusto_saldo").val(infoBalance.balance)
        }
    }
}

function setSelectedZoomItem(selectedItem) {
    var value = $('#' + selectedItem.inputName).val()
    var divpai = $('#' + selectedItem.inputName)[0].parentNode
    if (value.length > 0) {
        $(divpai).addClass('has-success').removeClass('has-error');

        if (selectedItem.inputName == 'ztxt_solicitacao_nota') {
            var nroNota = selectedItem.NUMERONF
            window['ztxt_solicitacao_nota'].setValue(nroNota)
            var fornec = $('#txt_fornec_doc').val()
            if (fornec == '') {
                getFornec(selectedItem['DOC_PRESTADOR'], true)
                setFornec(selectedItem['DOC_PRESTADOR'])
            }
            window['ztxt_solicitacao_fornecedor'].disable(true)
            var pedido = $('#ztxt_solicitacao_pedido').val()
            if (pedido.length > 0) {
                var retorno = verificaNotaPedido(selectedItem, 'nota')
                if (retorno[0] == 'error') {
                    FLUIGC.toast({
                        title: 'AVISO',
                        message: 'Os dados da nota selecionado não são compativeis com os dados do pedido',
                        type: 'Danger'
                    });
                }
            }

            $('#txt_dadosnf_dataemissao').val(selectedItem['NOTAEMISSAO'].split('/').reverse().join('-'))
            $('#hd_dataEmissao').val(selectedItem['NOTAEMISSAO'])
            $('#txt_dadosnf_numeronf').val(selectedItem['NUMERONF'])
            $('#seqnota').val(selectedItem['SEQNOTA'])
            var vlBruto = formataIntMoeda(selectedItem['VLRSERVICOS'].replace('.', ','))
            var vlRetencoes = selectedItem.VLROUTRASRETENCOES
            if (formataMoedaInt(vlRetencoes) == 0 || vlRetencoes == 'null' || vlRetencoes == '') {
                var impostos = [
                    selectedItem.VLRCOFINS,
                    selectedItem.VLRCSLL,
                    selectedItem.VLRINSS,
                    selectedItem.VLRIR,
                    selectedItem.VLRISS,
                    selectedItem.VLRPIS
                ]
            } else {
                var impostos = [
                    selectedItem.VLRCOFINS,
                    selectedItem.VLRCSLL,
                    selectedItem.VLRINSS,
                    selectedItem.VLRIR,
                    selectedItem.VLRPIS
                ]
            }
            var vlLiquido = selectedItem['VALORLIQUIDONFSE']
            $('#txt_dadosnf_valorbruto').val(vlBruto)
            nivelAprov(vlBruto)
            $('#txt_dadosnf_valorliquido').val(formataIntMoeda(vlLiquido))
            $('#txt_ccusto_valornf').val(vlBruto)
            var dateSplitada = selectedItem['DATACOMPETENCIA'].split('/')
            $('#txt_dadosnf_datacompetancia').val(dateSplitada[1] + '/' + dateSplitada[2])
            $('#hd_datacompetencia').val(dateSplitada[1] + '/' + dateSplitada[2])
            validaVl('txt_dadosnf_valorbruto', $('#txt_dadosnf_valorbruto').val(), $('#txt_dadosnf_valorbruto')[0].parentNode)
            validaInput($('#txt_dadosnf_datacompetancia')[0], $('#txt_dadosnf_datacompetancia')[0].parentNode)
            resetCamposNF()
            validaDate($('#txt_dadosnf_dataemissao')[0], $('#txt_dadosnf_dataemissao')[0].parentNode, 'txt_dadosnf_dataemissao')
            populaHiddensImpostos(selectedItem)
        } else if (selectedItem.inputName == 'ztxt_solicitacao_pedido') {
            var pedido = selectedItem.ID
            window['ztxt_solicitacao_pedido'].setValue(pedido)
            var fornec = $('#txt_fornec_doc').val()
            if (fornec == '') {
                getFornec(selectedItem['DOC'], true)
                setFornec(selectedItem['DOC'])
            }
            window['ztxt_solicitacao_fornecedor'].disable(true)
            //$("#field_balance").show('smooth')
            var nota = $('#ztxt_solicitacao_nota').val()
            if (nota.length > 0) {
                var retorno = verificaNotaPedido(selectedItem, 'pedido')
                if (retorno[0] == 'error') {
                    FLUIGC.toast({
                        title: 'AVISO',
                        message: 'Os dados do pedido selecionado não são compativeis com os dados da NF',
                        type: 'Danger'
                    });
                } else {
                    $('#hd_pedidos').val('true')
                }
            } else {
                $('#hd_pedidos').val('true')
                if (selectedItem['VALORTOTAL'] != 'null') {
                    $('#txt_dadosnf_valorbruto').val(selectedItem['VALORTOTAL']).change()
                    setReadOnly('txt_dadosnf_valorbruto', true)
                }
                var nroNF = selectedItem['NUMERONF']
                var serie = selectedItem['SERIENF']
                var codhistorico = selectedItem['IDNATUREZADESPESA'].trim()
                nroNF != 'null' ? $('#txt_dadosnf_numeronf').val(nroNF).change() : setReadOnly('txt_dadosnf_numeronf', false)
                serie != 'null' ? $('#nroserie').val(serie).change() : setReadOnly('nroserie', false)
                var c1 = DatasetFactory.createConstraint('CODNAT', codhistorico, codhistorico, ConstraintType.MUST)
                var dts = DatasetFactory.getDataset('dts_buscaNatureza_MFX', null, [c1], null).values
                if (dts.length > 0) {
                    $('#txt_dadosnf_ccusto').val(dts[0].TIPO)
                    validaInput($('#txt_dadosnf_ccusto')[0], $('#txt_dadosnf_ccusto')[0].parentNode)
                    $('#codhistorico').val(dts[0].CODHISTORICO)
                    $('#basecalculo').val(dts[0].BASECALCULO)
                    window['ztxt_dadosnf_natureza'].setValue(dts[0].NATUREZA)
                    $($('#ztxt_dadosnf_natureza')[0].parentNode).removeClass('has-error').addClass('has-success')
                    natureza(dts[0])
                    $('#txt_dadosnf_datavenct').attr('readonly', false)
                    // calendarVenct('txt_dadosnf_datavenct', $('#txt_dadosnf_datavenct')[0].parentNode, 'enable')
                } else {
                    FLUIGC.toast({
                        title: 'AVISO',
                        message: 'Natureza não cadastrada na Widget de parametros!',
                        type: 'Warning'
                    });
                }
            }
        } else if (selectedItem.inputName == 'ztxt_dadosnf_natureza') {
            $('#txt_dadosnf_ccusto').val(selectedItem.TIPO)
            validaInput($('#txt_dadosnf_ccusto')[0], $('#txt_dadosnf_ccusto')[0].parentNode)
            $('#codhistorico').val(selectedItem.CODHISTORICO)
            $('#basecalculo').val(selectedItem.BASECALCULO)
            natureza(selectedItem)
            $('#txt_dadosnf_datavenct').attr('readonly', false)
            // calendarVenct('txt_dadosnf_datavenct', $('#txt_dadosnf_datavenct')[0].parentNode, 'enable')
            $('#nroserie').change()
        } else if (selectedItem.inputName == 'ztxt_ccusto_ccaprov') {
            buscaAprov(selectedItem.TXT_CODIGO_CC, 'ztxt_ccusto_ccaprov')
        } else if (selectedItem.inputName.indexOf('txtz_ccusto_cc') != -1) {
            var id = selectedItem.inputName.split('___')[1]
            var validacao = verificaCCduplicados(selectedItem.CENTROCUSTO)
            if (validacao == 'duplicado') {
                window['txtz_ccusto_cc___' + id].clear()
                FLUIGC.toast({
                    title: 'AVISO',
                    message: 'Centro de custo já adicionado na tabela!',
                    type: 'Danger'
                });
                $($('#txtz_ccusto_cc___' + id)[0].parentNode).removeClass('has-success').addClass('has-error')
            } else {
                $('#hdn_codcusto___' + id).val(selectedItem.CENTROCUSTO)
                // if($('#hd_pedidos').val() != 'true'){
                //     if($('#ztxt_ccusto_ccaprov').val().length == 0){
                //         var retorno = buscaAprov(selectedItem.CENTROCUSTO, selectedItem.inputName)          
                //         if(retorno == 'error'){
                //             $('#hdn_codcusto___'+id).val('')                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              
                //         }else{
                //         } 
                //     } 
                // }
            }
        } else if (selectedItem.inputName == 'txtz_ccusto_tipolancamento') {
            limpaHiddensAprov()
            rateio(selectedItem.txt_desc, selectedItem['metadata#id'])
            var tpLanc = DatasetFactory.getDataset('Cadastro Tipo de Lançamento', null, [DatasetFactory.createConstraint('documentid', selectedItem['documentid'], selectedItem['documentid'], ConstraintType.MUST)], null).values
            if ($('#hd_pedidos').val() != 'true') {
                var c1 = DatasetFactory.createConstraint('codcusto', tpLanc[0]['txt_ccaprov'], tpLanc[0]['txt_ccaprov'], ConstraintType.MUST)
                var dts = DatasetFactory.getDataset('dts_getHierarquiaPagNotas_MFX', null, [c1], null).values
                window['ztxt_ccusto_ccaprov'].setValue(dts[0].CENTROCUSTO)
                var retorno = buscaAprov(dts[0]['TXT_CODIGO_CC'], 'ztxt_ccusto_ccaprov')
                if (retorno.indexOf('ERRO:') != -1) {
                    window['txtz_ccusto_tipolancamento'].clear()
                    limpa_pai_filho('tbcusto')
                }
            }
        } else if (selectedItem.inputName == 'ztxt_solicitacao_filial') {
            $('#nroempresa').val(selectedItem['NROEMPRESA'])
            $('#docFilial').val(selectedItem['CNPJ'])
            var cds = ['100', '97', '99', '94', '70', '27']
            var validaCd = false
            for (var i = 0; i < cds.length; i++) {
                if (selectedItem['NOMEREDUZIDO'].indexOf(cds[i]) != -1) {
                    $('#txt_solicitacao_tipo').val('Matriz')
                    validaCd = true
                    $('#aprovContabilidade').val('Pool:Group:ContabilidadeMatriz_PagNotas')
                }
            }
            if (validaCd == false) {
                $('#txt_solicitacao_tipo').val('Loja')
                $('#aprovContabilidade').val('Pool:Group:ContabilidadeLoja_PagNotas')
            }
            $($('#txt_solicitacao_tipo')[0].parentNode).removeClass('has-error').addClass('has-success')
        }
        else if (selectedItem.inputName == 'ztxt_solicitacao_fornecedor') {
            var fornec = selectedItem.FANTASIA
            window['ztxt_solicitacao_fornecedor'].setValue(fornec)
            if (selectedItem.inputName)
                getFornec(selectedItem['CNPJ'], true)
            setFornec(selectedItem['CNPJ'])
        } else if (selectedItem.inputName == 'ztxt_estOrig') {
            realodMunicipio('origem', selectedItem.UF)
            $('#div_muncipOrigem').show('smooth')
        } else if (selectedItem.inputName == 'ztxt_estDenst') {
            realodMunicipio('destino', selectedItem.UF)
            $('#div_muncipDest').show('smooth')
        }
    } else {
        $(divpai).addClass('has-error').removeClass('has-success');
    }
}
function realodMunicipio(zoom, uf) {
    if (zoom == 'origem') {
        reloadZoomFilterValues('ztxt_municOrig', 'ESTADO,' + uf.trim())
    } else if (zoom == 'destino') {
        reloadZoomFilterValues('ztxt_municDenst', 'ESTADO,' + uf.trim())
    }
}
function verificaNotaPedido(item, zoom) {
    var typePessoa = $('#hdn_slct_fornec_tipo_pessoa').val()
    if (zoom == 'pedido') {
        var nota = $('#ztxt_solicitacao_nota').val()[0]
        if (nota) {
            if (typePessoa == 'juridica') {
                if (formataCNPJ(item.DOC) == formataCNPJ($('#txt_fornec_doc').val())) {
                    var vlBrutoPedido = parseInt(item.VALORTOTAL)
                    var vlBrutoNF = formataMoedaInt($('#txt_dadosnf_valorbruto').val())
                } else {
                    return ['error', 'CNPJ']
                }
            } else {
                if (formataCPF(item.DOC) == formataCPF($('#txt_fornec_doc').val())) {
                    var vlBrutoPedido = parseInt(item.VALORTOTAL)
                    var vlBrutoNF = formataMoedaInt($('#txt_dadosnf_valorbruto').val())
                } else {
                    return ['error', 'CNPJ']
                }
            }
            if (vlBrutoPedido != vlBrutoNF) {
                return ['error', 'Valor']
            }
        } else {
            return ['error', 'Dados']
        }
    } else if (zoom = 'nota') {
        var pedido = $('#ztxt_solicitacao_pedido').val()[0]
        var c1 = DatasetFactory.createConstraint('ID', pedido, pedido, ConstraintType.MUST)
        var dts = DatasetFactory.getDataset('dts_getPedidosPagNotas_MFX', null, [c1], null).values
        if (dts.length > 0) {
            if (typePessoa == 'juridica') {
                if (formataCNPJ(item.DOC_PRESTADOR) == formataCNPJ(dts[0].DOC)) {
                    var vlBrutoPedido = parseInt(dts[0].VALORTOTAL)
                    var vlBrutoNF = parseInt(item.VLRSERVICOS)
                } else {
                    return ['error', 'CNPJ']
                }
            } else {
                if (formataCPF(item.DOC_PRESTADOR) == formataCPF(dts[0].DOC)) {
                    var vlBrutoPedido = parseInt(dts[0].VALORTOTAL)
                    var vlBrutoNF = parseInt(item.VLRSERVICOS)
                } else {
                    return ['error', 'CNPJ']
                }
            }
            if (vlBrutoPedido != vlBrutoNF) {
                return ['error', 'Valor']
            }
        } else {
            return ['error', 'Dados']
        }
    }
}
function verificaCCduplicados(codCusto) {
    var tr = $('#tbccusto tbody tr')
    var valida = false
    for (var i = 1; i < tr.length; i++) {
        var codcusto = tr[i].childNodes[7].childNodes[1].childNodes[6].value
        if (codcusto == codCusto) {
            valida = true
            i = tr.length
        }
    }
    if (valida == true) {
        return 'duplicado'
    }
}
function setFornec(cnpj) {
    var tipoPessoa = validaTipoPessoa(cnpj)
    $('#slct_fornec_tipo_pessoa').val(tipoPessoa).attr('disabled', true)
    $('#hdn_slct_fornec_tipo_pessoa').val(tipoPessoa)
    if (tipoPessoa == 'juridica') {
        var doc = formataCNPJ(cnpj)
    } else if (tipoPessoa == 'fisica') {
        var doc = formataCPF(cnpj)
    }
    $('#txt_fornec_doc').val(doc)
    var retorno = verificaDoc(doc)
    if (retorno == 'error') {
        $('#slct_fornec_tipo_pessoa').val('')
        $('#hdn_slct_fornec_tipo_pessoa').val('')
        $('#txt_fornec_doc').val('')
        window['ztxt_solicitacao_fornecedor'].clear()
        var retorno = true
    }
    if (retorno) {
        return 'error'
    }
}
function getChapa(mail) {
    var dsChapa = DatasetFactory.getDataset("dsGetChapaAD", ['a', mail], null, null).values
    var objeto = JSON.parse(dsChapa[0].retorno);
    return objeto.onPremisesSamAccountName
}
function getFornec(cnpj, mod) {
    if (cnpj && mod) {
        reloadZoomFilterValues("ztxt_solicitacao_nota", "cnpj," + cnpj);
        reloadZoomFilterValues("ztxt_solicitacao_pedido", "DOC," + cnpj);
    } else {
        reloadZoomFilterValues("ztxt_solicitacao_nota", null, null);
        reloadZoomFilterValues("ztxt_solicitacao_pedido", null, null);
    }
}
function buscaAprov(codccusto, id, beforeSend) {
    if (codccusto) {
        var c1 = DatasetFactory.createConstraint('codcusto', codccusto.trim(), codccusto.trim(), ConstraintType.MUST)
        var dts = DatasetFactory.getDataset('dts_getHierarquiaPagNotas_MFX', null, [c1], null).values
        if (dts.length > 0) {
            var mail = $('#hdn_mail').val()
            var chapa = getChapa(mail)
            var arr = ['CHAPAAPROV1', 'CHAPAAPROV2', 'CHAPASUBST_APROV1', 'CHAPASUBST_APROV2']
            var valida = false
            for (var i = 0; i < arr.length; i++) {
                var result = (dts.filter(a => a[arr[i]].trim() == chapa))
                if (result.length > 0) {
                    i = arr.length
                    valida = true
                }
            }
            if (valida == false) {
                var reponssePopulaDados = beforeSend != null ? populaDadosAprov(dts, beforeSend) : populaDadosAprov(dts)
                return reponssePopulaDados
            } else {
                if(!beforeSend){
                    FLUIGC.toast({
                        title: 'AVISO',
                        message: 'Você é aprovador desse centro de custo, portanto não pode lançar notas para o mesmo',
                        type: 'Danger'
                    });
                }
                window[id].clear()
                window[id].disable(false)
                id.indexOf('txtz_ccusto_cc___') != -1 ? $('#hdn_codcusto___'+id.split('___')[1]).val('') : '' 
                // if (id == 'ztxt_ccusto_ccaprov') {
                //     var tr = $('#tbccusto tbody tr')
                //     for (var i = 1; i < tr.length; i++) {
                //         var codcusto = tr[i].childNodes[7].childNodes[1].childNodes[6].value.trim()
                //         if (codcusto == codccusto.trim()) {
                //             var idCcusto = tr[i].childNodes[7].childNodes[1].childNodes[3].id
                //             var idLinha = idCcusto.split('___')[1]
                //             $('#hdn_codcusto___'+idLinha).val('')
                //             window[idCcusto].clear()
                //             window[idCcusto].disable(false)
                //             i = tr.length
                //             $('#' + tr[i].childNodes[7].childNodes[1].childNodes[6].id).val('')
                //         }
                //     }
                // }
                return 'ERRO: Você é aprovador desse centro de custo, portanto não pode lançar notas para o mesmo'
            }
        } else {
            if(!beforeSend){
                FLUIGC.toast({
                    title: 'AVISO',
                    message: 'Centro de custo não possui aprovador por favor cadastre na widget de Hierarquia',
                    type: 'Danger'
                });
            }

            window['ztxt_ccusto_ccaprov'].clear()
            limpaHiddensAprov()
            
            return 'ERRO: Centro de custo não possui aprovador por favor cadastre na widget de Hierarquia'
        }
    }
}
function validaSubst(item) {
    var constraints = new Array()
    var arr = ['CHAPAAPROV1', 'CHAPAAPROV2']

    for (var i = 0; i < arr.length; i++) {
        constraints.push(DatasetFactory.createConstraint('CHAPA', item[0][arr[i]], item[0][arr[i]], ConstraintType.MUST))
    }
    var dts = DatasetFactory.getDataset('dts_AusenciaAprovadorPagNotas_MFX', null, constraints, null).values
    if (dts.length > 0) {
        var result = ''
        for (var i = 0; i < dts.length; i++) {
            if (dts[i].CHAPA) {
                result += i + ';' + dts[i].CHAPA + '/'
            }
        }
        if (result == '') {
            return false
        } else {
            return result
        }
    }
}
function populaDadosAprov(item, beforeSend) {
    try{
        var nivel = $('#nivelAprov').val()
        if (nivel == 'nv1') {
            $('#contadorAprov').val(0)
            if (item[0]['CHAPASUBST_APROV1'] != 'null' || item[0]['LOGINSUBST_APROV1'] != 'null') {
                var login = item[0].LOGINSUBST_APROV1
                var chapa = item[0].CHAPASUBST_APROV1
            } else {
                var login = item[0].LOGINAPROV1
                var chapa = item[0].CHAPAAPROV1
            }

            var colleagueId = ''
            if (login != 'null' && login != '') {
                colleagueId = buscaColleagueID(login)
            } else if (chapa != 'null' && chapa != '') {
                colleagueId = buscaFluigFuncionarios(chapa)
            } else {
                if(!beforeSend){
                    FLUIGC.toast({
                        title: 'AVISO',
                        message: 'Erro no registro de Hierarquia, por favor verifique o cadastro do centro de custo selecionado',
                        type: 'Danger'
                    });
                }
                window['ztxt_ccusto_ccaprov'].clear()
                //limpa_pai_filho('tbcusto')
                limpaHiddensAprov()
                var error = 'ERRO: Erro no registro de Hierarquia, por favor verifique o cadastro do centro de custo selecionado'
            }

            if (error == undefined) {
                if (colleagueId != 'null' && colleagueId != null) {
                    $('#aprovadoresCC').val(colleagueId)
                } else {
                    if(!beforeSend){
                        FLUIGC.toast({
                            title: 'AVISO',
                            message: 'Não foi possivel localizar um dos aprovadores no fluig',
                            type: 'Danger'
                        });
                    }

                    limpaHiddensAprov()
                    var error = 'ERRO: Não foi possivel localizar um dos aprovadores no fluig'
                }
            }else{
                return error
            }
        } else if (nivel == 'nv2' || nivel == 'nv3') {
            $('#contadorAprov').val(0)
            var quantAprovadores
            nivel == 'nv2' ? quantAprovadores = 2 : quantAprovadores = 3
            for (var i = 1; i <= quantAprovadores; i++) {
                if (item[0]['CHAPASUBST_APROV' + i] != 'null' || item[0]['LOGINSUBST_APROV' + i] != 'null') {
                    var login = item[0]['LOGINSUBST_APROV' + i]
                    var chapa = item[0]['CHAPASUBST_APROV' + i]
                } else {
                    var login = item[0]['LOGINAPROV' + i]
                    var chapa = item[0]['CHAPAAPROV' + i]
                }
                if (login != 'null' && login != '') {
                    colleagueId = buscaColleagueID(login)
                } else if (chapa != 'null' && chapa != '') {
                    colleagueId = buscaFluigFuncionarios(chapa)
                } else {
                    if(!beforeSend){
                        FLUIGC.toast({
                            title: 'AVISO',
                            message: 'Erro no registro de Hierarquia, por favor verifique o cadastro do centro de custo selecionado',
                            type: 'Danger'
                        });
                    }
                    window['ztxt_ccusto_ccaprov'].clear()
                    //limpa_pai_filho('tbcusto')
                    limpaHiddensAprov()
                    var error = 'ERRO : Erro no registro de Hierarquia, por favor verifique o cadastro do centro de custo selecionado'
                }
                if (error == undefined) {
                    if (colleagueId != 'null' && colleagueId != null) {
                        var aprovadores = $('#aprovadoresCC').val()
                        if (aprovadores == undefined || aprovadores == '') {
                            $('#aprovadoresCC').val(colleagueId)
                        } else {
                            if($('#aprovadoresCC').val().indexOf(colleagueId) == -1){
                                $('#aprovadoresCC').val(aprovadores + ';' + colleagueId)
                            }
                        }
                        $('#aprov' + i).val(colleagueId)
                        if (i == 1) {
                            $('#aprovAtual').val(colleagueId)
                        }
                    } else {
                        if(!beforeSend){
                            FLUIGC.toast({
                                title: 'AVISO',
                                message: 'Não foi possivel localizar um dos aprovadores no fluig',
                                type: 'Danger'
                            });
                        }
                        window['ztxt_ccusto_ccaprov'].clear()
                        limpa_pai_filho('tbcusto')
                        limpaHiddensAprov()
                        var error = 'ERRO: Não foi possivel localizar um dos aprovadores no fluig'
                    }
                }else{
                    return error
                }
            }
        }
    }catch(e){
        FLUIGC.toast({
            title: 'AVISO',
            message: 'Houve um erro ao buscar os aprovadores do centro de custo, por favor validar o cadastro de Hierarquia',
            type: 'Danger'
        });
    }
    //}
}
function limpaHiddensAprov() {
    $('#aprov1').val('')
    $('#aprov2').val('')
    $('#aprov3').val('')
    $('#contadorAprov').val('')
    $('#aprovadoresCC').val('')
    $('#qntAprov').val('')
}
function buscaColleagueID(login) {
    if (login) {
        var c1 = DatasetFactory.createConstraint('login', login, login, ConstraintType.MUST)
        var colleague = DatasetFactory.getDataset('colleague', null, [c1], null).values
        return colleague[0]['colleaguePK.colleagueId']
    }
}
function buscaFluigFuncionarios(chapa) {
    var c1 = DatasetFactory.createConstraint('chapa', chapa, chapa, ConstraintType.MUST)
    var dts = DatasetFactory.getDataset('dts_getFluigFuncPagNotas_MFX', null, [c1], null).values
    return dts[0].USER_CODE
}
function nivelAprov(vlBruto) {
    var valor = formataMoedaInt(vlBruto)
    if (valor <= 20000) {
        $('#nivelAprov').val('nv1')
    } else if (valor > 20000 && valor < 100000) {
        $('#nivelAprov').val('nv2')
    } else {
        $('#nivelAprov').val('nv3')
    }
}
function natureza(item, pedido) {
    if (item) {
        if ($('#hd_pedidos').val() != 'false') {
            preencher(item)
        } else if (item.PACOTEIRO != 'null') {
            $('#pacoteiro').val(item.CODPACOTEIRO)
            preencher(item)
        } else {
            window['ztxt_dadosnf_natureza'].clear()
            $('#divNatureza').hide('smooth')
            $('#divMunicipios').hide('smooth')
            $('#nroserie').val('')
            $('#pacoteiro').val('')
            $('#especie').val('')
            $('#hd_origem').val('false')
            $('#modelo').val('')
            $('#contacredito').val('')
            $('#contadebito').val('')
            $('#nroplanilha').val('')
            $('#hd_prazo').val('')
            $('#tipoCt').val('')
            window['ztxt_municOrig'].clear()
            window['ztxt_municDenst'].clear()
            window['ztxt_estOrig'].clear()
            window['ztxt_estDenst'].clear()
            $($('#ztxt_estOrig')[0].parentNode).addClass('has-error').removeClass('has-success')
            $($('#ztxt_estDenst')[0].parentNode).addClass('has-error').removeClass('has-success')

            FLUIGC.toast({
                title: 'AVISO',
                message: 'A Natureza escolhida não possui pacoteiro cadastrado',
                type: 'Danger'
            });
        }
    } else {
        $('#divNatureza').hide('smooth')
        $('#divMunicipios').hide('smooth')
        $('#nroserie').val('')
        $('#pacoteiro').val('')
        $('#especie').val('')
        $('#hd_origem').val('false')
        $('#modelo').val('')
        $('#contacredito').val('')
        $('#contadebito').val('')
        $('#nroplanilha').val('')
        $('#hd_prazo').val('')
        $('#tipoCt').val('')
        window['ztxt_municOrig'].clear()
        window['ztxt_municDenst'].clear()
        window['ztxt_estOrig'].clear()
        window['ztxt_estDenst'].clear()
        $($('#ztxt_estOrig')[0].parentNode).addClass('has-error').removeClass('has-success')
        $($('#ztxt_estDenst')[0].parentNode).addClass('has-error').removeClass('has-success')
    }

    function preencher(item, pedido) {
        $('#divNatureza').show('smooth')
        if ($('#txt_dadosnf_codAcesso').val() != '') {
            var chave = $('#txt_dadosnf_codAcesso').val()
            $("#nroserie").val(chave.substring(22, 25));
        } else if (item.SERIE == 'U') {
            $('#nroserie').val(item.SERIE)
            //setReadOnly('nroserie', true)
            $($('#nroserie')[0].parentNode).removeClass('has-error').addClass('has-success')
        } else {
            setReadOnly('nroserie', false)
            $($('#nroserie')[0].parentNode).addClass('has-error').removeClass('has-success')
        }
        $('#especie').val(item.ESPECIE)
        if (item.VARIACAOMODELO) {
            var constraints
            var modelos = item.VARIACAOMODELO.split(',')
            for (var i = 0; i < modelos.length; i++) {
                if (i == 0) {
                    constraints = 'CODMODELO,' + modelos[i].trim()
                } else {
                    constraints += ',CODMODELO,' + modelos[i].trim()
                }
            }
            if (constraints) {
                reloadZoomFilterValues("modelo", constraints);
            }
        }
        $('#contacredito').val(item.CONTACREDITO)
        $('#contadebito').val(item.CONTADEBITO)
        $('#nroplanilha').val(item.CODHISTORICO)
        $('#hd_prazo').val(item.TEMPRAZO)
        if (item.BASECALCULO == 'true') {
            $('#img_basecalculo').attr('src', 'img/basecalculo_true.png')
        } else {
            $('#img_basecalculo').attr('src', 'img/basecalculo_false.png')
        }
        /*if($('#hdn_sw_lancarM').val() == 'on'){
            $('#modelo').attr('readonly', false)
        }*/
        if (item.ORIGEM == 'true') {
            $('#divMunicipios').show()
            $('#tipoCt').val('0 - CT-e Normal')
            $('#hd_origem').val('true')
            $('#div_muncipOrigem').hide()
            $('#div_muncipDest').hide()
        }
    }
}
function validaVLiquido(value, id) {
    if ($('#hdn_state').val() != '10' && $('#hdn_state').val() != '12') {
        var valorBruto = formataMoedaInt($('#txt_dadosnf_valorbruto').val())
        var valorLiquido = formataMoedaInt(value)
        if (valorLiquido > valorBruto) {
            $('#' + id).val('')
            FLUIGC.toast({
                title: 'AVISO',
                message: 'O valor liquido não pode ser maior que o valor Bruto',
                type: 'Danger'
            });
            $('#btn_parcelas_limpar').click()
            $('#btn_ccusto_limpar').click()
        } else {
            if (value == 0 || value == 'R$ 0,00') {
                value = ''
            }
            validaVl(id, value, $('#' + id)[0].parentNode)
        }
    }else{
        $('#txt_parcelas_valornf').val(formataIntMoeda(value))
        gerarParcelas()
        FLUIGC.toast({
            title: 'AVISO',
            message: 'Parcelas atualizadas conforme o novo valor liquido',
            type: 'Warning'
        });
    }
}
function rateio(TipoLancamento, id) {
    var tr = $('#tbparcelas tbody tr')
    if (tr.length > 0) {
        limpa_pai_filho('tbcusto', 'tipolanc')
    }
    var c1 = DatasetFactory.createConstraint('metaId', id, id, ConstraintType.MUST)
    var dts = DatasetFactory.getDataset('dts_RateioTipoLancamento', null, [c1], null).values
    var valorTotal = formataMoedaInt($('#txt_ccusto_valornf').val())
    for (var i = 0; i < dts.length; i++) {
        var idLinha = novo()
        window['txtz_ccusto_cc___' + idLinha].setValue(dts[i]['Centro de custo'])
        $('#hdn_codcusto___' + idLinha).val(dts[i]['Cod Centro de custo'])
        window['txtz_ccusto_cc___' + idLinha].disable(true)
        var divPai = $("#txtz_ccusto_cc___" + idLinha)[0].parentNode
        $(divPai).removeClass('has-error').addClass('has-success')
        $('#txt_ccusto_desc___' + idLinha).val(TipoLancamento).attr('readonly', true)
        var percentual = dts[i]['Percentual'].split('%')[0]
        var valorPercentual = valorTotal * (parseFloat(percentual) / 100)
        $('#txt_ccusto_valor___' + idLinha).val(formataIntMoeda(valorPercentual)).attr('readonly', true)
        $('#hdn_parcelas_valor___' + idLinha).val(valorPercentual)
    }
    $('#btn_ccusto_novo').attr('disabled', true)
    $('#txt_ccusto_valorinserido').val($('#txt_ccusto_valornf').val())
    $('#txt_ccusto_valorrest').val('R$ 00,00')
    $('.btn-trash').hide()
    window['ztxt_ccusto_ccaprov'].disable(true)
    if ($('#hd_venctInicial').val() != '') {
        //$('#div_swparcelas').show('smooth, swing')
    }
}
function removedZoomItem(removedItem) {
    var value = $('#' + removedItem.inputName).val()
    var divpai = $('#' + removedItem.inputName)[0].parentNode
    if (value.length == 0 && removedItem.inputName != 'txtz_ccusto_tipolancamento' && removedItem.inputName != 'ztxt_ccusto_ccaprov') {
        $(divpai).addClass('has-error').removeClass('has-success');
    }
    if (removedItem.inputName == 'ztxt_dadosnf_natureza') {
        $('#txt_dadosnf_ccusto').val('')
        $('#codhistorico').val('')
        $('#basecalculo').val('')
        $('#divMunicipios').show()
        $(divpai).addClass('has-error').removeClass('has-success');
        var divPaiTipoCC = $('#txt_dadosnf_ccusto')[0].parentNode
        $(divPaiTipoCC).addClass('has-error').removeClass('has-success');
        natureza()
        $('#txt_dadosnf_datavenct').val('')
        $('#txt_dadosnf_datavenct').change().blur()
        $('#txt_dadosnf_datavenct').attr('readonly', true)
        // calendarVenct('txt_dadosnf_datavenct', $('#txt_dadosnf_datavenct')[0].parentNode, 'disabled')
    } else if (removedItem.inputName == 'ztxt_solicitacao_nota') {
        $(divpai).addClass('has-error').removeClass('has-success');
        $('#txt_dadosnf_dataemissao').val('')
        $('#txt_dadosnf_datavenct').val('')
        $('#txt_dadosnf_numeronf').val('')
        $('#txt_dadosnf_valorbruto').val('')
        $('#txt_dadosnf_ccusto').val('')
        $('#codhistorico').val('')
        $('#basecalculo').val('')
        natureza()
        $('#txt_dadosnf_valorliquido').val('')
        $('#hd_impostos').val('')
        $('#txt_ccusto_valornf').val('')
        $('#nivelAprov').val('')
        limpaHiddens()
        limpacampos()
        resetTable()
        impostos()
        validaVl('txt_dadosnf_valorbruto', $('#txt_dadosnf_valorbruto').val(), $('#txt_dadosnf_valorbruto')[0].parentNode)
        resetCamposNF()
        if ($('#ztxt_solicitacao_fornecedor').val().length == 0 && $('#ztxt_solicitacao_pedido').val().length == 0) {
            getFornec()
            resetFornec()
            window['ztxt_solicitacao_fornecedor'].disable(false)
        }
    } else if (removedItem.inputName == 'txtz_ccusto_tipolancamento') {
        limpa_pai_filho('tbcusto')
        $('#aprov1').val('')
        $('#aprov2').val('')
        $('#aprov3').val('')
        $('#aprovadoresCC').val('')
        window['ztxt_ccusto_ccaprov'].clear()
        window['ztxt_ccusto_ccaprov'].disable(false).clear()

    } else if (removedItem.inputName == 'ztxt_solicitacao_filial') {
        $('#nroempresa').val('')
        $('#txt_solicitacao_tipo').val('')
        $('#docFilial').val('')
        $('#aprovContabilidade').val('')
        $($('#txt_solicitacao_tipo')[0].parentNode).removeClass('has_success').addClass('has-error')
    } else if (removedItem.inputName == 'ztxt_ccusto_ccaprov') {
        $('#aprov1').val('')
        $('#aprov2').val('')
        $('#aprov3').val('')
        $('#aprovadoresCC').val('')
    } else if (removedItem.inputName == 'ztxt_solicitacao_fornecedor') {
        if ($('#ztxt_solicitacao_nota').val().length == 0 && $('#ztxt_solicitacao_pedido').val().length == 0) {
            getFornec()
            resetFornec()
        }
    } else if (removedItem.inputName.indexOf('txtz_ccusto_cc') != -1) {
        var id = removedItem.inputName.split('___')[1]
        $('#hdn_codcusto___' + id).val('')
    } else if (removedItem.inputName == 'ztxt_estOrig') {
        window['ztxt_municOrig'].clear()
        $('#div_muncipOrigem').hide()
    } else if (removedItem.inputName == 'ztxt_estDenst') {
        window['ztxt_municDenst'].clear()
        $('#div_muncipDest').hide()
    } else if (removedItem.inputName == 'ztxt_solicitacao_pedido') {
        $('#hd_pedidos').val('false')
        //$("#field_balance").hide('smooth')
        setReadOnly('txt_dadosnf_numeronf', true)
        if ($('#ztxt_solicitacao_fornecedor').val().length == 0 && $('#ztxt_solicitacao_nota').val().length == 0) {
            getFornec()
            resetFornec()
            window['ztxt_solicitacao_fornecedor'].disable(false)
            $('#txt_dadosnf_valorbruto').val('').change()
            $('#txt_dadosnf_numeronf').val('').change()
        }
        limpaNat()
    }
}
function resetTable() {
    window['txtz_ccusto_tipolancamento'].clear()
    limpa_pai_filho('tbcusto')
    window['ztxt_ccusto_ccaprov'].clear()
    $('#txt_ccusto_valornf').val('')
}
function resetFornec() {
    $('#txt_fornec_doc').val('')
    $('#slct_fornec_tipo_pessoa').val('')
    $('#txt_fornec_fornc').val('')
    $('#txt_fornec_endereco').val('')
    $('#txt_fornec_numero').val('')
    $('#txt_fornec_bairro').val('')
    $('#txt_fornec_seqpessoa').val('')
    $('#txt_fornec_cidade').val('')
    $('#txt_fornec_uf').val('')
    $('#hdn_slct_fornec_tipo_pessoa').val('')
    var divpai = $('#txt_fornec_doc')[0].parentNode
    $(divpai).addClass('has-error').removeClass('has-success');
}
function resetCamposNF() {
    validaInput($('#txt_dadosnf_dataemissao')[0], $('#txt_dadosnf_dataemissao')[0].parentNode)
    validaInput($('#txt_dadosnf_datavenct')[0], $('#txt_dadosnf_datavenct')[0].parentNode)
    validaInput($('#txt_dadosnf_numeronf')[0], $('#txt_dadosnf_numeronf')[0].parentNode)
    validaInput($('#txt_dadosnf_valorbruto')[0], $('#txt_dadosnf_valorbruto')[0].parentNode)
    validaInput($('#txt_dadosnf_valorliquido')[0], $('#txt_dadosnf_valorliquido')[0].parentNode)
}
function validaInput(obj, divPai) {
    var valor = obj.value;

    if (valor.trim().length <= 0) {
        $(divPai).addClass('has-error').removeClass('has-success');
    }
    else {
        $(divPai).addClass('has-success').removeClass('has-error');
    }
}
function validaSelect(obj, divPai) {
    var valor = obj.value;

    if (valor.trim() == 'Selecione') {
        $(divPai).addClass('has-error').removeClass('has-success');
    } else {
        $(divPai).addClass('has-success').removeClass('has-error');
    }

    if (obj.id == 'slct_fornec_tipo_pessoa') {
        $('#hdn_slct_fornec_tipo_pessoa').val(valor)
    }
}
function getSolicitante() {
    var user = $('#hdn_usercode').val()
    var mail = $('#hdn_mail').val()

    var chapa = getChapa(mail)
    var c1 = DatasetFactory.createConstraint('CHAPA', chapa, chapa, ConstraintType.MUST)
    var dados = DatasetFactory.getDataset('dts_getDadosCabecalho_MFX', null, [c1], null).values
    var filial = DatasetFactory.getDataset('dts_getFilialConsinco_MFX', null, [c1], null).values
    if (dados.length > 0) {
        $('#txt_solicitacao_solicitante').val(dados[0]['NOME'])
        $('#txt_solicitacao_secao').val(dados[0]['SECAO'])
        $('#txt_solicitacao_email').val(mail)
        var date = dataAtual()
        $('#txt_solicitacao_data').val(date)
        $('#chapa').val(chapa)
        $('#codfilal').val(filial[0]['NROEMPRESA'])
        $('#filal').val(filial[0]['FANTASIA'])
    } else {
        FLUIGC.modal({
            title: 'Usuário não encontrado no RM:',
            content: '<p>Contate a equipe de TI</p>',
            id: 'modal_user',
            size: 'large',
            actions: [{
                'label': 'Ok',
                'bind': 'data-ok-req',
                'classType': 'btn btn-warning btn-block',
                'autoClose': true
            }]
        }, function (err, data) {
            if (err) {
                // do error handling
            } else {
                // do something with data
            }
        });
    }
}
function getUserLanc() {
    var user = $('#usercodeLanc').val()
    var mail = $('#emailLanc').val()

    var chapa = getChapa(mail)
    var c1 = DatasetFactory.createConstraint('CHAPA', chapa, chapa, ConstraintType.MUST)
    var dados = DatasetFactory.getDataset('dts_getDadosCabecalho_MFX', null, [c1], null).values
    var filial = DatasetFactory.getDataset('dts_getFilialConsinco_MFX', null, [c1], null).values

    if (dados.length > 0) {
        $('#nomeLanc').val(dados[0]['NOME'])
        $('#secaoLanc').val(dados[0]['SECAO'])
        var date = dataAtual()
        $('#dataLanc').val(date)
        $('#chapaLanc').val(chapa)
        $('#funcaoLanc').val(dados[0]['FUNCAO'])
        $('#secaoLanc').val(dados[0]['SECAO'])
        $('#filialLanc').val(filial[0]['NROEMPRESA'])
        $('#codFilialLanc').val(filial[0]['FANTASIA'])
    }
}

function btnAprov(state) {
    if (state == 'Aprovacao') {
        $('#hdn_aprovacao').val('sim')
        $('#targa_aprovacao_nao').hide('smooth', 'swing')
        $('#targa_aprovacao_sim').show('smooth', 'swing')
        $('#trava_obs').val('')
        var colleagueId = $('#aprovAtual').val()
        var tr = $('#tbaprovacoes tbody tr')
        var valida = false
        for (var i = 1; i < tr.length; i++) {
            var userCode = tr[i].childNodes[5].childNodes[0].value
            if (userCode == colleagueId) {
                valida = true
            }
        }
        if (valida == false) {
            var aprovador = getName(colleagueId)
            var add = wdkAddChild("tbaprovacoes")
            $('#labelAprov___' + add).val(aprovador)
            $('#hd_user___' + add).val(colleagueId)
        }
    } else if (state == 'Contabilidade') {
        $('#hdn_contabilidade').val('')
        $('#targa_impostos_nao').hide('smooth,swing')
        $('#targa_impostos_sim').show('smooth, swing')
        $('#trava_obs').val('')
    }
}
function btnReprov(state) {
    if (state == 'Aprovacao') {
        if ($('#hdn_aprovacao').val() == 'sim') {
            var endPosition = $('#tbaprovacoes tbody tr').length - 1
            var linha = $('#tbaprovacoes tbody tr')[endPosition]
            fnWdkRemoveChild(linha)
        }
        $('#hdn_aprovacao').val('nao')
        $('#targa_aprovacao_sim').hide('smooth, swing')
        $('#targa_aprovacao_nao').show('smooth, swing')
        $($('#txta_aprovacao_obs')[0].parentNode).addClass('has-error').removeClass('has-success')
    } else if (state == 'Contabilidade') {
        if ($('#hdn_contabilidade').val() == 'nao') {
            $('#hdn_contabilidade').val('')
            $('#targa_impostos_nao').hide('smooth, swing')
            $($('#txta_impostos_obs')[0].parentNode).addClass('has-success').removeClass('has-error')
        } else {
            $('#hdn_contabilidade').val('nao')
            $('#targa_impostos_sim').hide('smooth, swing')
            $('#targa_impostos_nao').show('smooth, swing')
            $($('#txta_impostos_obs')[0].parentNode).addClass('has-error').removeClass('has-success')
        }
    }
}
function pegaCSV(inputFile) {

    var loader = "<div id='loader-excel' style='position: absolute;width: 100px;margin: auto 40%;z-index: 100;'><img src='/style-guide/images/loading-flat-spinner-medium.gif'></div>";
    $("#loader-excel-2").prepend(loader);

    var leitorDeCSV = new FileReader();
    leitorDeCSV.onload = leCSV;

    var extPermitidas = ['csv'];
    var extArquivo = inputFile.value.split('.').pop();

    if (typeof extPermitidas.find(function (ext) { return extArquivo == ext; }) == 'undefined') {
        alert('Extensão "' + extArquivo + '" não permitida!');
    } else {
        var file = inputFile.files[0];
        leitorDeCSV.readAsText(file);
    }
}
function leCSV(evt) {
    $('#btn_ccusto_upload').attr('disabled', true)
    let fileArr = evt.target.result.trim().split('\n');
    console.log('fileArr = ' + fileArr);
    console.log('fileArr.length = ' + fileArr.length);
    let c1 = DatasetFactory.createConstraint("unidade", "SP", "SP", ConstraintType.MUST)
    let dts_cc = DatasetFactory.getDataset("get_papeis_aprovadores_novo3", null, [c1], null).values
    let valorTotal = 0;

    for (var i = 1; i < fileArr.length; i++) {

        let infoTableCSV = {
            fileLine    : "",
            desc        : "",
            codCCusto   : "",
            valor       : "",
            indice      : ""
        }

        if (fileArr[i].indexOf(';') != -1) {
            
            infoTableCSV.fileLine = fileArr[i].split(';');   
            if (infoTableCSV.fileLine[1].trim() != "") {
                infoTableCSV.desc       = infoTableCSV.fileLine[0].replace('"', '')
                infoTableCSV.codCCusto  = infoTableCSV.fileLine[1].replace('"', '')
                infoTableCSV.valor      = infoTableCSV.fileLine[2].replace('"', '')
                infoTableCSV.indice     = novo()
            }
        }else{
            infoTableCSV.fileLine = fileArr[i].split(',');
            if (infoTableCSV.fileLine[1].trim() != "") {
                infoTableCSV.desc       = infoTableCSV.fileLine[0].replace('"', '')
                infoTableCSV.codCCusto  = infoTableCSV.fileLine[1].replace('"', '')
                infoTableCSV.valor      = infoTableCSV.fileLine[2].replace('"', '') //+ ',' + fileLine[3].replace('"', '')
                infoTableCSV.indice     = novo()
            }
        }   

        $("#txt_ccusto_desc___" + infoTableCSV.indice).val(infoTableCSV.desc);
        $("#txt_ccusto_valor___" + infoTableCSV.indice).val(infoTableCSV.valor);
        //i == 1 ? $("#hdn_parcelas_valor___" + infoTableCSV.indice).val(0) : $("#hdn_parcelas_valor___" + infoTableCSV.indice).val(infoTableCSV.valor);
        let el = $("#txt_ccusto_valor___" + infoTableCSV.indice)[0]
        let returnValidacao = verificaValorNF(formataMoedaInt(infoTableCSV.valor.replace('R$', '')), el, 'upload')
        
        let objCC = dts_cc.filter(a => a.CC.trim() == infoTableCSV.codCCusto);
        if (objCC.length == 0) {
            limpa_pai_filho('tbcusto')
            FLUIGC.toast({
                title: 'AVISO',
                message: 'O Centro de Custo ' + infoTableCSV.desc + ' não foi encontrada na base de dados.',
                type: 'Danger'
            });
            break
        }else{
            setZoomData('txtz_ccusto_cc___' + infoTableCSV.indice, objCC[0].Papel)
            $("#hdn_codcusto___" + infoTableCSV.indice).val(objCC[0].CC)
        }
        if (returnValidacao == 'break') {
            limpa_pai_filho('tbcusto')
            break
        }
    }
}
function setZoomData(id, value) {
    window[id].setValue(value);
}
function validaVl(id, value, divPai, id) {
    var valorSecundario
    if (id == 'txt_dadosnf_valorbruto') {
        valorSecundario = $('#txt_dadosnf_valorliquido').val()
    } else {
        valorSecundario = $('#txt_dadosnf_valorbruto').val()
    }

    if (value != '' && valorSecundario != '') {
        $('#div_cc_paifilho').show('smooth, swing')
        var div = $('#txt_ccusto_valornf')[0].parentNode
        $(div).addClass('has-success').removeClass('has-error');
        if (value.indexOf('R$') != -1) {
            var valorformatado = value
        } else {
            var valorformatado = formataIntMoeda(value)
        }
        if (id == 'txt_dadosnf_valorbruto') {
            $('#txt_ccusto_valornf').val(valorformatado)
        }
        $(divPai).addClass('has-success').removeClass('has-error');
    } else if (value != '') {
        $(divPai).addClass('has-success').removeClass('has-error');
    } else {
        $('#btn_parcelas_limpar').click()
        $('#btn_ccusto_limpar').click()
        window['ztxt_ccusto_ccaprov'].disable(false)
        window['ztxt_ccusto_ccaprov'].clear()
        $('#div_cc_paifilho').hide('smooth, swing')
        $(divPai).addClass('has-error').removeClass('has-success');
        var div = $('#txt_ccusto_valornf')[0].parentNode
        $(div).addClass('has-error').removeClass('has-success');
    }
}
function recaulculainput(id) {
    var valorhdn = $('#hdn_recalcular_valor').val()

    if (valorhdn) {
        if (valorhdn.indexOf(id) != -1) {

        } else {
            $('#hdn_recalcular_id').val($('#hdn_recalcular_id').val() + '-' + id)
        }
    } else {
        $('#hdn_recalcular_id').val(id)
    }

}
function verificaValorNF(value, el, mod) {
    var id = (el.id).split('___')[1]
    var valoranterior = formataMoedaInt($('#hdn_parcelas_valor___' + id).val())
    $('#txt_ccusto_valorinserido').val(formataIntMoeda(formataMoedaInt($('#txt_ccusto_valorinserido').val()) - valoranterior))
    var valoranteriorinserido = formataMoedaInt($('#txt_ccusto_valorinserido').val())
    var valorrest = formataMoedaInt($('#txt_ccusto_valorrest').val())
    var valortotaltxt = $('#txt_ccusto_valornf').val()
    var valortotal = formataMoedaInt(valortotaltxt)
    var valor = formataMoedaInt(value)

    if (parseFloat(parseFloat(valoranteriorinserido + valor).toFixed(2)) > valortotal) {
        if (mod == 'upload') {
            FLUIGC.toast({
                title: 'AVISO',
                message: 'Os valores da planilha ultrapassaram o valor total da NF',
                type: 'Danger'
            });
            limpadivcalculo()
            $('#btn_ccusto_novo').attr('disabled', false)
            return 'break'
        } else {
            FLUIGC.toast({
                title: 'AVISO',
                message: 'O valor inserido ultrapassou o valor total da NF',
                type: 'Warning'
            });
            $('#txt_ccusto_valorrest').val(formataIntMoeda(valorrest + valoranterior))
            $('#btn_ccusto_novo').attr('disabled', false)
            limpadivcalculo()
            delet(el)
        }
    } else {

        if (valor == 0) {
            var valorrest = formataMoedaInt($('#txt_ccusto_valorrest').val())
            var valorinserido = formataMoedaInt($('#txt_ccusto_valorinserido').val())
            var index = (el.id).split('___')[1]
            var valor = formataMoedaInt($('#hdn_parcelas_valor___' + index).val())
            $('#txt_ccusto_valorrest').val(formataIntMoeda(valorrest + valor))
            // $('#txt_ccusto_valorinserido').val(formataIntMoeda(valorinserido-valor))
            $('#hdn_parcelas_valor___' + index).val(0)
        } else {
            $('#txt_ccusto_valorinserido').val(valoranteriorinserido + valor)
            var valorinseridoantehdn = valoranteriorinserido + valor
            var rest = valortotal - parseFloat(valorinseridoantehdn.toFixed(2));
            var valorrest = formataIntMoeda(rest)
            var valorinserido = formataIntMoeda(valorinseridoantehdn)
            var valorformatado = formataIntMoeda(value)
            $('#txt_ccusto_valorrest').val(valorrest)
            $('#txt_ccusto_valorinserido').val(valorinserido)
            $('#' + el.id).val(valorformatado)
            var index = (el.id).split('___')[1]
            $('#hdn_parcelas_valor___' + index).val(formataMoedaInt(valorformatado))
        }
        var valorrest = formataMoedaInt($('#txt_ccusto_valorrest').val())
        if (valorrest == 0 && $('#hd_venctInicial').val() != '') {
            //$('#div_swparcelas').show('smooth, swing')
            $('#btn_ccusto_novo').attr('disabled', true)
            setReadOnly('', true)
        } else {
            limpadivcalculo()
            $('#btn_ccusto_novo').attr('disabled', false)
        }
    }
}
function limpadivcalculo() {
    //$('#div_swparcelas').hide('smooth, swing')
    $('#sw_ccusto_parcelas')[0].checked = false
    $('.div_calculo').hide()
    $('#div_parcelas').hide()
    $('#txt_parcelas_qntparcelas').val('')
    $('#txt_parcelas_vencimentoinicial').val('')
}
function limpa_pai_filho(table, mod) {
    if (table == 'tbcusto') {
        var tr = $('#tbccusto tbody tr')
        $('#txt_ccusto_valorinserido').val(0)
        $('#txt_ccusto_valorrest').val(0)
        $('#btn_ccusto_upload').attr('disabled', false)
        $('#fileCSV').val('')
        limpadivcalculo()
        $('#btn_ccusto_upload').attr('disabled', false)
        $('#btn_ccusto_novo').attr('disabled', false)
        if (mod != 'tipolanc') {
            window['txtz_ccusto_tipolancamento'].clear()
        }
        window['ztxt_ccusto_ccaprov'].clear()
        window['ztxt_ccusto_ccaprov'].disable(false)
    } else if (table == 'tbparcelas') {
        //calendarVenct('txt_parcelas_vencimentoinicial', $('#txt_parcelas_vencimentoinicial')[0].parentNode, 'enable')
        $('#txt_parcelas_qntparcelas').attr('readonly', false)
        $('#hd_gerarParcelas').val('false')
        var tr = $('#tbparcelas tbody tr')
        if (mod == 'btn') {
            $('.div_calculo').hide('smooth', 'swing')
        }
    } else if (table == 'tbaprovacoes') {
        var tr = $('#tbaprovacoes tbody tr')
    }
    for (var i = 1; i < tr.length; i++) {
        delet(tr[i])
    }
}
function gerarParcelas() {
    var tr = $('#tbparcelas tbody tr')
    if (tr.length > 1) {
        limpa_pai_filho('tbparcelas')
    }
    var qnt = formataMoedaInt($('#txt_parcelas_qntparcelas').val())
    var valortotal = formataMoedaInt($('#txt_dadosnf_valorliquido').val())
    $('#txt_parcelas_qntparcelas').attr('readonly', true)
    $('#txt_dadosnf_datavenct').attr('readonly', true)
    $('#hd_gerarParcelas').val('true')
    
    const parcelas = calcularParcelasComPercentual(valortotal, qnt)
    parcelas.forEach((element, index) => {
        var add = wdkAddChild("tbparcelas")

        //Data de vencimento
        if(index == 0){
            var dataformatada = $('#txt_parcelas_vencimentoinicial').val()
            $($('#txt_parcelas_valor___' + add)).addClass('primeira-parcela')
        }else{
            var dataInput = $('#hdn_date').val()
            var dataarray = dataInput.split('/')
            var date = new Date(parseInt(dataarray[2]), parseInt(dataarray[1]) - 1, parseInt(dataarray[0]))
            date.setDate(date.getDate() + 30);
            var dataformatada = formataDate(date)
        }

        $('#txt_parcelas_valor___' + add).val(formataIntMoeda(element.valor)).attr('readonly', true)
        $('#txt_parcelas_vencimento___' + add).val(dataformatada).attr('readonly', true)
        $('#hd_vencimento___' + add).val(dataformatada)
        $('#hdn_date').val(dataformatada)
        $('#hdn_valorparcela_inicial').val(formataIntMoeda(element.valor))
        $('#hd_parcelas_valor___' + add).val(element.valor)
        $('#txt_parcelas_percentual___' + add).val(`${element.percentual}%`)
    })

    $('.div_calculo').show('smooth', 'swing')
    $('#btn_parcelas_recalcular').attr('disabled', true)

    // var valorparcela = valortotal / qnt
    // var percentualdecimal = valorparcela / valortotal
    // var percentual = percentualdecimal * 100
   
    // var resto = 0
    // for (var i = 0; i < qnt; i++) {
    //     var add = wdkAddChild("tbparcelas")
    //     if (i == 0) {
    //         var dataformatada = $('#txt_parcelas_vencimentoinicial').val()
    //         $($('#txt_parcelas_valor___' + add)).addClass('primeira-parcela')
    //     } else {
    //         var dataInput = $('#hdn_date').val()

    //         var dataarray = dataInput.split('/')
    //         var date = new Date(parseInt(dataarray[2]), parseInt(dataarray[1]) - 1, parseInt(dataarray[0]))
    //         if (i != 0) {
    //             date.setDate(date.getDate() + 30);
    //         }
    //         var dataformatada = formataDate(date)
    //     }

    //     var valorArrendondado = formataMoedaInt(formataValParcelas(valorparcela))
    //     var valorStr = valorparcela.toString()
    //     if (valorStr.indexOf('.') != -1) {
    //         resto = resto + parseFloat('0.00' + (valorStr.split('.')[1]).substring(2, valorStr.split('.')[1].length))
    //     }
    //     if (i != qnt - 1) {
    //         $('#txt_parcelas_valor___' + add).val(formataValParcelas(valorparcela)).attr('readonly', true)
    //         $('#hd_parcelas_valor___' + add).val(valorArrendondado)
    //         var splitPercentual = percentual.toString().split('.')
    //         splitPercentual.length > 1 ? $('#txt_parcelas_percentual___' + add).val(splitPercentual[0] + '.' + splitPercentual[1].substring(0, 2) + '%') : $('#txt_parcelas_percentual___' + add).val(percentual + '%')
    //     } else {
    //         var valorUltimaParcela = (valorArrendondado + resto)
    //         $('#txt_parcelas_valor___' + add).val(formataValParcelas(valorUltimaParcela)).attr('readonly', true)
    //         var sliptPonto = valorUltimaParcela.toString().split('.')
    //         sliptPonto.length > 1 ? $('#hd_parcelas_valor___' + add).val(sliptPonto[0] + '.' + sliptPonto[1].substring(0, 2)) : $('#hd_parcelas_valor___' + add).val(valorArrendondado)
    //         var percentualdecimal = $('#hd_parcelas_valor___' + add).val() / valortotal
    //         var percentualUltima = percentualdecimal * 100
    //         var splitPercentual = percentualUltima.toString().split('.')
    //         splitPercentual.length > 1 ? $('#txt_parcelas_percentual___' + add).val(splitPercentual[0] + '.' + splitPercentual[1].substring(0, 2) + '%') : $('#txt_parcelas_percentual___' + add).val(percentualUltima + '%')
    //     }
    //     $('#txt_parcelas_vencimento___' + add).val(dataformatada).attr('readonly', true)
    //     $('#hd_vencimento___' + add).val(dataformatada)
    //     $('#hdn_date').val(dataformatada)
    // }
}

function calcularParcelasComPercentual(valorTotal, quantidadeParcelas) {
    if (quantidadeParcelas <= 0) {
      return "Quantidade de parcelas inválida";
    }
  
    let parcelas = [];
    let valorParcela = Math.floor(valorTotal * 100) / (quantidadeParcelas * 100);
    let valorRestante = valorTotal;
  
    for (let i = 0; i < quantidadeParcelas - 1; i++) {
      let valorParcelaArredondado = parseFloat(valorParcela.toFixed(2));
      parcelas.push({
        valor: valorParcelaArredondado,
        percentual: ((valorParcelaArredondado / valorTotal) * 100).toFixed(2),
      });
      valorRestante -= valorParcelaArredondado;
    }
  
    parcelas.push({
      valor: parseFloat(valorRestante.toFixed(2)),
      percentual: ((valorRestante / valorTotal) * 100).toFixed(2),
    });
  
    return parcelas;
}

function formataValParcelas(value) {
    if (value % 1 == 0) {
        var formatado = formataIntMoeda(value)
    } else {
        var valor = String(value.toLocaleString('pt-BR'))
        var array = valor.split(',')
        var formatado = 'R$ ' + array[0] + ',' + array[1].substring(0, 2)
    }
    return formatado
}
function validaParcela(value, id) {
    var index = id.split('___')[1]
    $('#hd_vencimento___' + index).val(value)
}
function formataDate(date) {
    var data = new Date(date),
        dia = data.getDate().toString().padStart(2, '0'),
        mes = (data.getMonth() + 1).toString().padStart(2, '0'),
        ano = data.getFullYear();
    var datafinal = dia + "/" + mes + "/" + ano;
    return datafinal
}
function recalcular() {
    $('#btn_parcelas_recalcular').attr('disabled', true)
    var tr = $('#tbparcelas tbody tr')
    var valoralterado
    var valortotalalterado = 0
    var idsrestantes = []
    var valortotal = formataMoedaInt($('#txt_parcelas_valornf').val())
    for (var i = 1; i < tr.length; i++) {
        var input = tr[i].childNodes[3].childNodes[0].readOnly
        var valor = tr[i].childNodes[3].childNodes[0].value
        var index = (tr[i].childNodes[3].childNodes[0].id).split('___')[1]
        if (input == false) {
            valoralterado = formataMoedaInt(valor)
            var percentual = (valoralterado * 100) / valortotal
            $('#txt_parcelas_percentual___' + index).val(percentual.toFixed(1) + '%')
            var span = tr[i].childNodes[1].childNodes[0]
            resetatable(index, span)
            valortotalalterado = valortotalalterado + valoralterado

        } else {
            idsrestantes.push(index)
            $('#txt_parcelas_percentual___' + index).val('')
            $('#txt_parcelas_valor___' + index).val('')
        }
    }
    if (valortotalalterado > valortotal) {
        limpa_pai_filho('tbparcelas')
        $('.div_calculo').hide()
        FLUIGC.toast({
            title: 'AVISO',
            message: 'Os valores alterados aultrapassaram o valor da NF',
            type: 'Danger'
        });
    } else if (valortotalalterado == valortotal) {
        for (var c = 0; c < idsrestantes.length; c++) {
            delet($('#btn_parcelas_edit___' + idsrestantes[c])[0].parentNode.parentNode)
        }
    } else {
        var valorrestante = valortotal - valortotalalterado
        var qntrest = idsrestantes.length
        var valorparcela = formataIntMoeda(valorrestante / qntrest)
        var percentualparcela = (formataMoedaInt(valorparcela) * 100) / valortotal
        for (var a = 0; a < idsrestantes.length; a++) {
            $('#txt_parcelas_percentual___' + idsrestantes[a]).val(percentualparcela.toFixed(1) + '%')
            $('#txt_parcelas_valor___' + idsrestantes[a]).val(valorparcela)
        }
    }
}
function edit(el) {
    var index = (((el.parentNode.parentNode).children)[2].children[0].id).split('___')[1]
    $('#txt_parcelas_valor___' + index).attr('readonly', false)
    if (($('#txt_parcelas_valor___' + index)[0].className).indexOf('primeira-parcela') == -1) {
        $('#txt_parcelas_vencimento___' + index).attr('readonly', false)
    }
    //('txt_parcelas_vencimento___'+index, $('#txt_parcelas_vencimento___'+index)[0].parentNode, 'enable') 
    $(el).addClass('has-error');
}
function formataMoedaInt(value) {
    if (typeof value != 'number'){
        if (value == '') {
            var valor = 'R$ 0,00'
        } else {
            var valor = value
        }
        if (valor.indexOf('.') != -1 && valor.indexOf(',') != -1) {
            var result = parseFloat(valor.replaceAll('.', '').replaceAll(',', '.').replaceAll('R$', '').trim())
        } else if (valor.indexOf('.') != -1 && valor.indexOf(',') == -1) {
            var result = parseFloat(valor)
        } else {
            var result = parseFloat(valor.replaceAll('.', '').replaceAll(',', '.').replaceAll('R$', ''))
        }
        return result
    }else{
        return value
    }
}
function formataIntMoeda(value) {
    if (value == '') {
        var valor = 0
    } else {
        var valor = value
    }
    const formato = { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' }
    if (typeof valor === 'string' || valor instanceof String) {
        var valorformat = formataMoedaInt(valor)
        if (valorformat >= 0) {
            var valor = (valorformat.toLocaleString('pt-BR', formato));
        } else {
            valor = ''
        }
    } else {
        valor == undefined ? valor = '' : valor = (valor.toLocaleString('pt-BR', formato));
    }

    return valor
}
function formatacampo(value, mod, id, obj, divPai, imposto) {
    var valor
    if (mod == 'moeda') {
        valor = formataIntMoeda(value)
        $(divPai).addClass('has-success').removeClass('has-error');
    } else if (mod == 'int') {
        valor = formataMoedaInt(value)
        $(divPai).addClass('has-success').removeClass('has-error');
    }
    if (valor == 'R$ NaN') {
        valor = ''
        $(divPai).addClass('has-error').removeClass('has-success');
    }
    $('#' + id).val(valor)
    if (id == 'txt_dadosnf_valorbruto') {
        $('#btn_ccusto_limpar').click()
        if (valor != '' && valor != 'R$ 0,00') {
            $('#txt_ccusto_valornf').val(valor)
            validaVl('txt_dadosnf_valorbruto', $('#txt_dadosnf_valorbruto').val(), $('#txt_dadosnf_valorbruto')[0].parentNode, id)
            nivelAprov(valor)
        } else {
            $('#txt_ccusto_valornf').val('')
            validaVl('txt_dadosnf_valorbruto', '', $('#txt_dadosnf_valorbruto')[0].parentNode, id)
            $('#nivelAprov').val('')
        }
    } else if (id.indexOf('txt_parcelas_valor___') != -1) {
        $('#btn_parcelas_recalcular').attr('disabled', false)
    }

    if (imposto == 'base') {
        valorBase()
    }
    if (divPai) {
        validaInput(obj, divPai)
    }
}
function editBase(id, divPai) {
    var swLancM = $('#hdn_sw_lancarM').val()
    var baseCalculo = $('#basecalculo').val()
    
    if ($('#' + id)[0].readOnly == true) {
        $('#' + id).attr('readonly', false)
        $(divPai).addClass('has-warning').removeClass('has-info').removeClass('has-success')
        var index = id.split('base')[1]
        $('#checkbox' + index)[0].checked = true
        //checkImpostos(true, 'checkbox'+index)
        $('#txt_valor' + index).attr('readonly', false)
        //$('#txt_aliq'+index).attr('readonly', false)
    } else {
        $('#' + id).attr('readonly', true)
        $(divPai).addClass('has-success').removeClass('has-warning')
    }
}
function valorBase(value, id) {
    var valor = formataIntMoeda(value)
    if (valor != '') {
        $('#' + id).val(valor)
    } else {
        $('#' + id).val('R$ 0,00')
    }
    var index = id.split('base')[1]
    $('#txt_aliq' + index).val('')
    $('#txt_valor' + index).val('').change()
    if (id.indexOf('icms') != -1 || id.indexOf('ipi') != -1) {
        $('#txt_isento' + index).val('').change()
        $('#txt_outros' + index).val('').change()
    }
    // if($('#txt_aliq'+index).val() != ''){
    //     var aliquota = parseInt($('#txt_aliq'+index).val().replace('%'))
    //     var idAliq = $('#txt_aliq'+index)[0].id
    //     calculaImposto(idAliq, aliquota, 'aliquota')
    //     //ajustar
    // }
}
function checkImpostos(check, id) {
    var baseCalculo = $('#basecalculo').val()
    var index = id.split('box')[1]
    var swLancM = $('#hdn_sw_lancarM').val()
    if (check == true) {
        redOnlyCampos(false)
        //if (swLancM == 'on') {
        if ($('#txt_base' + index).val() == $('#txt_dadosnf_valorbruto').val() || $('#txt_base' + index).val().trim() == '' || $('#txt_base' + index).val().trim() == 'R$ 0,00') {
            $('#txt_base' + index).val($('#txt_dadosnf_valorbruto').val())
            //$('input[id^=txt_base').val($('#txt_dadosnf_valorbruto').val())

        }
        //}
    } else {
        redOnlyCampos(true)
        var vlHd = $('#hd_impostos').val()
        // var objJSON = JSON.parse(vlHd)
        // if(objJSON['txt_valor'+index]){
        //     var valorAtt = parseInt(objJSON['txt_valor'+index])
        //     var deducoesAnt = formataMoedaInt($('#txt_valordeducao').val())
        //     var deducoes =  deducoesAnt - valorAtt
        //     objJSON['valordeducao'] = deducoes
        //     objJSON['txt_valor'+index] = 0
        //     $('#txt_valordeducao').val(formataIntMoeda(deducofones))
        //     var JSONstring = JSON.stringify(objJSON)
        //     $('#hd_impostos').val(JSONstring)
        // }
        //$('#txt_base'+index).val($('#txt_dadosnf_valorbruto').val())
        $($('#txt_base' + index)[0].parentNode).removeClass('has-success').removeClass('has-warning').addClass('has-info')
        let valorTotalImposto
        if (index =='icms') {
            valorTotalImposto = ((formataMoedaInt($('#txt_valoricms').val())) + formataMoedaInt($('#txt_isentoicms').val()) + formataMoedaInt($('#txt_outrosicms').val()))
        } else if (index ='ipi') {
            valorTotalImposto = ((formataMoedaInt($('#txt_valoripi').val())) + formataMoedaInt($('#txt_isentoipi').val()) + formataMoedaInt($('#txt_outrosipi').val()))
        } else {
            valorTotalImposto = formataMoedaInt(obj.value)
        }

        if(valorTotalImposto == 0){
            $('#txt_base' + index).val(formataIntMoeda(0))
        }
    }
    function redOnlyCampos(mod) {
        $('#txt_valor' + index).attr('readonly', mod)
        if (index == 'icms' || index == 'ipi') {
            $('#txt_isento' + index).attr('readonly', mod)
            if (index == 'ipi') {
                $('#txt_outros' + index).attr('readonly', mod)
            }
        }
    }
}
function calculaImposto(obj) {
    var idsImpostos = ['icms', 'ipi', 'iss', 'csll', 'pis', 'cofins', 'irrfJ', 'irrfF', 'inssF', 'inssJ']
    var valordeducao = 0
    var swLancM = $('#hdn_sw_lancarM').val()
    for (var i = 0; i < idsImpostos.length; i++) {
        var valorTotal = 0
        if (idsImpostos[i].indexOf('icms') != -1) {
            valorTotal = (formataMoedaInt($('#txt_valoricms').val()) +
                formataMoedaInt($('#txt_isentoicms').val()))

        } else if (idsImpostos[i].indexOf('ipi') != -1) {
            valorTotal = (formataMoedaInt($('#txt_valoripi').val()) +
                formataMoedaInt($('#txt_isentoipi').val()) +
                formataMoedaInt($('#txt_outrosipi').val()))
        } else {
            valorTotal = (formataMoedaInt($('#txt_valor' + idsImpostos[i]).val()))
        }
        valordeducao = valordeducao + valorTotal
    }
    if (obj.id.indexOf('valor') != -1) {
        var index = (obj.id).split('valor')[1]
    } else if (obj.id.indexOf('isento') != -1) {
        var index = (obj.id).split('isento')[1]
    } else if (obj.id.indexOf('outros') != -1) {
        var index = (obj.id).split('outros')[1]
    }
    formataMoedaInt($('#txt_base' + index).val()) == 0 ? $('#txt_base' + index).val($('#txt_dadosnf_valorbruto').val()) : ''

    var valorTotalImposto
    if (obj.id.indexOf('icms') != -1) {
        valorTotalImposto = ((formataMoedaInt($('#txt_valoricms').val())) + formataMoedaInt($('#txt_isentoicms').val()) + formataMoedaInt($('#txt_outrosicms').val()))
    } else if (obj.id.indexOf('ipi') != -1) {
        valorTotalImposto = ((formataMoedaInt($('#txt_valoripi').val())) + formataMoedaInt($('#txt_isentoipi').val()) + formataMoedaInt($('#txt_outrosipi').val()))
    } else {
        valorTotalImposto = formataMoedaInt(obj.value)
    }
    var base = formataMoedaInt($('#txt_base' + index).val())
    var aliq = porcentagemAliq(base, valorTotalImposto)
    $('#txt_aliq' + index).val(aliq + '%')
    //if (swLancM == 'on') {
        if (valorTotalImposto == 0) {
            $('#txt_base' + index).val(formataIntMoeda(0))
            $('#txt_ali' + index).val('0%')
            //$('input[id^=txt_base').val(formataIntMoeda(0))
        }
    //}
    $('#txt_valordeducao').val(formataIntMoeda(valordeducao))

    let valorLiquido = (formataMoedaInt($('#txt_dadosnf_valorbruto').val()) - valordeducao)
    $('#txt_dadosnf_valorliquido').val(formataIntMoeda(valorLiquido))
    $('#txt_parcelas_valornf').val(formataIntMoeda(valorLiquido))
    gerarParcelas()
    FLUIGC.toast({
        title: 'AVISO',
        message: 'Parcelas atualizadas conforme o novo valor liquido',
        type: 'Warning'
    });
    //$('#txt_valordeducao').change()
}
function porcentagemAliq(valorBase, valorImposto) {
    if (valorBase == 0 && valorImposto == 0) {
        return 0
    } else {
        var valorTotal = parseFloat(valorBase);
        var valorParcial = parseFloat(valorImposto);
        var totalPorcentagem = 100;
        var porcentagemAlta = (totalPorcentagem * valorParcial) / valorTotal

        if (porcentagemAlta - Math.floor(porcentagemAlta) >= 0.99) {
            porcentagemAlta = Math.ceil(porcentagemAlta);
        }

        return porcentagemAlta.toFixed(2);

        // var porcentagem = porcentagemAlta.toString()
        
        // if (porcentagem.indexOf('.') != -1) {
        //     var inteiro = porcentagem.split('.')[0]
        //     var decimal = porcentagem.split('.')[1]

        //     return inteiro + '.' + decimal.substring(0, 2)
        // } else {
        //     return Math.floor(porcentagemAlta);
        // }
    }
}
/*
if(mod == 'aliquota'){
        var index = id.split('aliq')[1]
        var percentual = value
        if(percentual != '' && percentual != undefined && percentual != null){
            percentual = parseInt(percentual)
            var valor = aliquotaPvalor(percentual, id)
        }else{
            percentual = 0
            var valor = aliquotaPvalor(percentual, id)
            var valor = 0
        }
        var idVl = 'txt_valor'+index
        var vlHd = $('#hd_impostos').val()
        if(vlHd == ''){
            var valorDeducoes = 0
        }else{
            var objJSON = JSON.parse(vlHd)
            if(objJSON['valordeducao']){
                var valorDeducoes = objJSON['valordeducao']
            }else{
                var valorDeducoes = 0
            }
        }
            if(vlHd != ''){
                if(objJSON[idVl]){
                    var vlAnt = objJSON[idVl]
                    var deducoesAtt = subtrair(vlAnt, valorDeducoes)
                    objJSON[idVl] = valor
                    if(valor != '' || valor != undefined || valor != null || valor != 'R$ 0,00'){
                        var deducoes = soma(valor, deducoesAtt)
                    }
                }else{
                    objJSON[idVl] = valor
                    var deducoes = soma(valor, valorDeducoes)
                }
                objJSON['valordeducao'] = deducoes
                populaHdJSON(objJSON)
            }else{
                var impostos = {}
                impostos[idVl] = valor
                var deducoes = soma(valor, valorDeducoes)
                impostos['deducoes'] = deducoes
                populaHdJSON(impostos)
            }   

    }else if(mod == 'valor'){
        var index = id.split('_')[1]
        var valor = value
        if(valor == '' || valor == undefined || valor == null){
            valor = 0
        }else{
            if(typeof valor == "string"){
                valor = formataMoedaInt(valor)
            }
        }
    
        var vlHd = $('#hd_impostos').val()
        if(vlHd == ''){
            var valorDeducoes = 0
        }else{
            var objJSON = JSON.parse(vlHd)
            if(objJSON['valordeducao']){
                var valorDeducoes = parseFloat(objJSON['valordeducao'])
            }else{
                var valorDeducoes = 0
            }
        }
            if(vlHd != ''){
                if(objJSON[index]){
                    var vlAnt = objJSON[index]
                    var deducoesAtt = subtrair(vlAnt, valorDeducoes)
                    objJSON[index] = valor
                    if(valor != '' || valor != undefined || valor != null || valor != 'R$ 0,00'){
                        var deducoes = soma(valor, deducoesAtt)
                    }
                }else{
                    objJSON[index] = valor
                    var deducoes = soma(valor, valorDeducoes)
                }
                objJSON['valordeducao'] = deducoes
                populaHdJSON(objJSON)
                valorPaliquota(valor, id)
            }else{
                var impostos = {}
                impostos[id] = valor
                var deducoes = soma(valor, valorDeducoes)
                impostos['deducoes'] = deducoes
                populaHdJSON(impostos)
                valorPaliquota(valor, id) 
            }   
    }

    function aliquotaPvalor(percentual, id){
        var index = id.split('aliq')[1]
        var vlBruto = formataMoedaInt($('#txt_base'+index).val())
        var vl = vlBruto*(percentual/100)
        $('#txt_aliq'+index).val(percentual.toFixed(1)+'%')
        $('#txt_valor'+index).val(formataIntMoeda(vl))
        return vl
    }
    function populaHdJSON(obj){
        var JSONstring = JSON.stringify(obj)
        $('#hd_impostos').val(JSONstring)
    }

    function soma(valor, deducoes){
        var vl = valor + deducoes
        $('#txt_valordeducao').val(formataIntMoeda(vl))
        return vl
    }        

    function subtrair(valor, deducoes){
        var vl = deducoes - valor
        $('#txt_valordeducao').val(formataIntMoeda(vl))
        return vl
    }
    function valorPaliquota(value, id){
        var index = id.split('valor')[1]
        var vlBruto = formataMoedaInt($('#txt_base'+index).val())
        var percentual = (value/vlBruto)*100
        $('#txt_aliq'+index).val(percentual.toFixed(1)+'%')
        $('#txt_valor'+index).val(formataIntMoeda(value))
        return percentual
    } */
function resetatable(id, el) {
    $('#txt_parcelas_valor___' + id).attr('readonly', true)
    $('#txt_parcelas_percentual___' + id).attr('readonly', true)
    $('#txt_parcelas_vencimento___' + id).attr('readonly', true)
    $(el).addClass('has-success').removeClass('has-error');
}
function getName(colleagueID) {
    var c1 = DatasetFactory.createConstraint('colleaguePK.colleagueId', colleagueID, colleagueID, ConstraintType.MUST)
    var colleague = DatasetFactory.getDataset('colleague', null, [c1], null).values
    var name = colleague[0].colleagueName
    return name
}
function validaOBS(value, divPai) {
    if ($('#hdn_aprovacao').val() == 'nao') {
        if (value.length == 0) {
            $(divPai).addClass('has-error').removeClass('has-success')
        } else {
            $(divPai).addClass('has-success').removeClass('has-error')
        }
    }
}
function getChaveAcesso(chave) {
    if (chave.length == 44) {
        var anomes = chave.substring(2, 6);
        var mes = anomes[2] + anomes[3];
        var ano = "20" + anomes[0] + anomes[1];
        $("#txt_dadosnf_datacompetancia").val(mes + '/' + ano).change().blur();
        setReadOnly('txt_dadosnf_datacompetancia', true);
        $("#txt_dadosnf_numeronf").val(parseInt(chave.substring(25, 34))).change().attr('readonly', true)
        setReadOnly('txt_dadosnf_numeronf', true)
        $("#slct_fornec_tipo_pessoa").val("juridica");
        $("#slct_fornec_tipo_pessoa").change();
        $("#txt_fornec_doc").val(chave.substring(6, 20))
        $("#txt_fornec_doc").change();

        setReadOnly('txt_fornec_doc', true);
    } else {
        FLUIGC.toast({
            title: 'AVISO',
            message: 'Chave invalida!',
            type: 'Danger'
        });
        limpaChaveAcesso()
    }
}
// function recalculaValor(valor){
//     var vlDeducoes = formataMoedaInt(valor)
//     var vlLBruto = formataMoedaInt($('#txt_dadosnf_valorbruto').val())
//     var vlLiquidoAtt = vlLBruto -  vlDeducoes
//     $('#txt_dadosnf_valorliquido').val(formataIntMoeda(vlLiquidoAtt))
// }
function limpaChaveAcesso() {
    $('#txt_dadosnf_datacompetancia').val('')
    var fornec = $('#ztxt_solicitacao_fornecedor').val()
    var pedido = $('#ztxt_solicitacao_pedido').val()
    if (fornec.length == 0 && pedido.length == 0) {
        resetFornec()
        $('#slct_fornec_tipo_pessoa').attr('disabled', false)
        $('#txt_dadosnf_numeronf').val('')
    }
    $('#txt_dadosnf_codAcesso').val('')
}
function setReadOnly(id, status) {
    if(id != ''){
        $('#' + id).attr('readonly', status)
    }
}

var beforeSendValidate = function (numState, nextState) {
    if(numState == 5){
        if(numeroNota.indexOf($("#txt_dadosnf_numeronf").val()) != -1){
            throw 'Solicitação duplicada! Por favor alterar o número da nota.'
        }
    }
    if (numState == 5 || numState == 12 || numState == 20 || (numState == 10 && $('#txta_logError').val() != '')) {
        $('#tbparcelas_index').val('')
        $('#tbccusto_index').val('')
        var aprov = $('#ztxt_ccusto_ccaprov').val()
        if (aprov.length == 0) {
            $('#aprovadoresCC').val('')
            var tr = $('#tbccusto tbody tr')
            for (var i = 1; i < tr.length; i++) {
                var index = (tr[i].childNodes[7].childNodes[1].childNodes[3].id).split('___')[1]
                var codcusto = $('#hdn_codcusto___' + index).val()
                if (codcusto != '') {
                    var reponseBuscaAprov = buscaAprov(codcusto, 'txtz_ccusto_cc___' + index, 'beforeSend')
                    if(reponseBuscaAprov != undefined){
                        if(reponseBuscaAprov.indexOf('ERRO:') != -1){
                            throw(reponseBuscaAprov)
                        }
                    }
                }
            }
            var aprovadores = $("#aprovadoresCC").val().split(';')
            $('#aprov1').val('')
            $('#aprov2').val('')
            $('#aprov3').val('')
            $('#aprovAtual').val(aprovadores[0])
            var aprovadores = $('#aprovadoresCC').val()
            if (aprovadores.indexOf($('#pacoteiro').val()) == -1) {
                $('#aprovadoresCC').val($('#aprovadoresCC').val() + ';' + $('#pacoteiro').val())
            }
        } else {
            var aprovadores = $('#aprovadoresCC').val()
            if (aprovadores.indexOf($('#pacoteiro').val()) == -1) {
                $('#aprovadoresCC').val($('#aprovadoresCC').val() + ';' + $('#pacoteiro').val())
            }
            var aprovAtual = $("#aprovadoresCC").val().split(';')[0]
            $('#aprovAtual').val(aprovAtual)
        }
        var aprovadores = $("#aprovadoresCC").val().split(';')
        $('#qntAprov').val(aprovadores.length)

        //setPrazo
        var str = $('#txt_solicitacao_data').val()
        var date = new Date(str.split('/').reverse().join('/'))
        date.setDate(date.getDate() + 15)

        var prazo = formataDate(date)
        $('#prazo').val(prazo)

        var tr = $('#tbparcelas tbody tr')
        for (var i = 1; i < tr.length; i++) {
            var className = $('#tbparcelas tbody tr')[i].childNodes[1].childNodes[0].className
            if (className.indexOf('has-error') != -1) {
                recalcular()
                i = tr.length
            }
        }
    
        if(tr.length == 1){
            if($('#sw_ccusto_parcelas')[0].checked == false){
                $('#sw_ccusto_parcelas').click()
            }
            $('#txt_parcelas_qntparcelas').val('1')
            gerarParcelas()
        }
        // if ($('#hd_parcelas').val() != 'true') {
        //     $('#sw_ccusto_parcelas')[0].checked = true
        //     $('#sw_ccusto_parcelas').change()
        //     $('#txt_parcelas_qntparcelas').val('1').change().blur()
        //     $('#btn_parcelas_gerar').click()
        // }
        // }

        //Validar linha debito
    } else if (numState == 8) {

        if ($('#hdn_aprovacao').val() == 'nao') {
            if ($('#txta_aprovacao_obs').val() == '') {
                var divPai = $('#txta_aprovacao_obs')[0].parentNode
                $(divPai).addClass('has-error').removeClass('has-success')
                $('#trava_obs').val('true')
            } else {
                $('#trava_obs').val('false')
                var obs = $('#txta_aprovacao_obs').val()
                var user = $("#userAtual").val()
                var obsAnt = $('#hdn_obs').val()
                if (obs != '') {
                    var observacoes = obsAnt + '\n' + getName(user) + ': ' + obs
                    $('#hdn_obs').val(observacoes)
                }
            }
        }
    }
    else if (numState == 10) {
        const returnParamsIntegracao = validaParamsIntegracao()

        if(returnParamsIntegracao == null){
            let valBruto = formataMoedaInt($('#txt_dadosnf_valorbruto').val())
            let valLiquido = formataMoedaInt($('#txt_dadosnf_valorliquido').val())
            let valorDeducoes = formataMoedaInt($('#txt_valordeducao').val())
            //throw`<div><h2>ALERTA!</h2></div>`
    
            
            if ($('#hdn_contabilidade').val() == 'nao') {
                if ($('#txta_impostos_obs').val() == '') {
                    var divPai = $('#txta_impostos_obs')[0].parentNode
                    $(divPai).addClass('has-error').removeClass('has-success')
                    $('#trava_obs').val('true')
                } else {
                    $('#trava_obs').val('false')
                }
            } else {
                let arrTable = Array.from($('[id*=hdn_codcusto___]'))
    
                //let filial = $('#nroempresa').val()
                //var constFilial = DatasetFactory.createConstraint('CODFILIAL', filial, filial, ConstraintType.MUST)
        
                const contaDebito = $('#contadebito').val()
                const empresa = $('#nroempresa').val() == '901' ? '901' : '99'
                const constContaDebito = DatasetFactory.createConstraint('CONTA_DEBITO', contaDebito, contaDebito, ConstraintType.MUST)
                const constEmpresa = DatasetFactory.createConstraint('EMPRESA', empresa, empresa, ConstraintType.MUST)
                const dtsValidaCC = DatasetFactory.getDataset('dts_validaCCContaDebito_MFX', null, [constContaDebito, constEmpresa], null).values
                let validaContaD = true
    
                if(dtsValidaCC.length > 0){
                    if(dtsValidaCC[0].TEMCENTROCUSTO == 'N'){
                        validaContaD = false
                    }
                } 
    
                let nat = $('#codhistorico').val()
                var constNat = DatasetFactory.createConstraint('CODNAT', nat, nat, ConstraintType.MUST)
        
                arrTable.forEach(element => {
                    let codcusto = element.value
                    var constCusto = DatasetFactory.createConstraint('CODCUSTO', codcusto, codcusto, ConstraintType.MUST)
                    var constraints = [constNat, constCusto]
                    var dts = DatasetFactory.getDataset('dts_validaLinhaDebito_MFX', null, constraints, null).values
                    var dtsCredito = DatasetFactory.getDataset('dts_validaLinhaDebito_MFX', null, [constNat], null).values
    
                    //validar linha credito    
    
                    let pis = formataMoedaInt($('#txt_valorpis').val())
                    let cofins = formataMoedaInt($('#txt_valorcofins').val())
                    let csll = formataMoedaInt($('#txt_valorcsll').val())
                    let iss = formataMoedaInt($('#txt_valoriss').val())
                    let irrf = Array.from($('[id*=txt_valorirrf]'))
                    let inss = Array.from($('[id*=txt_valorinss]'))
                    
                    let valuesIrrf = irrf.filter(element => formataMoedaInt(element.value) != 0)
                    let valuesInss = inss.filter(element => formataMoedaInt(element.value) != 0)
                    let contaCredit, imposto
    
                    if(validaContaD == true){
                        if(dts.length == 0){
                            throw('Linha de débito do centro de custo: '+codcusto+' não criada no Consinco')
                        }
                    }
    
                    if(cofins != 0 || pis != 0 || csll != 0){
                        contaCredit = '21402001'
                        imposto = true
    
                        let validaConta = validaContaCredit(imposto, dtsCredito, contaCredit)
                        if(validaConta == 'error'){
                            throw('Linha de credito do Cofins/PIS/CSLL não criada no Consinco')
                        }
    
                    }else if(iss != 0){
                        contaCredit = '21402007' 
                        imposto = true
    
                        let validaConta = validaContaCredit(imposto, dtsCredito, contaCredit)
                        if(validaConta == 'error'){
                            throw('Linha de credito do ISS não criada no Consinco')
                        }
    
                    }else if(valuesIrrf.length > 0){
                        contaCredit = '21402006'
                        imposto = true
    
                        let validaConta = validaContaCredit(imposto, dtsCredito, contaCredit)
                        if(validaConta == 'error'){
                            throw('Linha de credito do IRRF não criada no Consinco')
                        }
    
                    }else if(valuesInss.length > 0){
                        contaCredit = '21402017'
                        imposto = true
    
                        let validaConta = validaContaCredit(imposto, dtsCredito, contaCredit)
                        if(validaConta == 'error'){
                            throw('Linha de credito do INSS não criada no Consinco')
                        }
    
                    }
                    
                    function validaContaCredit(imposto, dts, contaCredit){
                        if(imposto == true){
                            let validateCredit = dts.filter(element => element.CONTACREDITO == contaCredit)
                            if(validateCredit.length == 0){
                                return 'error'
                            }
                        }
                    }
    
                })
                
                var dataEntrada = $('#hd_dataEntrada').val()
                var trava_obs = $('#trava_obs').val()
                if (trava_obs == 'true') {
                    throw ("É necessário prencher o campo de observação!")
                } else if (dataEntrada == '') {
                    throw ("É necessário prencher o campo data de entrada!")
                } else if(parseFloat((valBruto - valLiquido).toFixed(2)) != valorDeducoes){
                    throw ("Por favor revisar os impostos e o valor liquido!")
                }else{        
                    var retorno = nfIntegrada == false ? getParams() : null;
    
                    if (retorno != null) {
                        contabilidadeAjuste()
                        if (retorno[0] == 'return') {
                            var SEQINCONCISTENCIA = retorno[0]
                            var dtsError = retorno[1]
                            throw (`INCONCISTENCIA = ${SEQINCONCISTENCIA}\nERROR -- ${dtsError[0]['error']}\nLINHA ${dtsError[0]['line']}--${seqnota}`)
                        } else {
                            var SEQINCONCISTENCIA = retorno[0]
                            var seqnota = retorno[1]
                            var c1 = DatasetFactory.createConstraint('SEQINCONCISTENCIA', SEQINCONCISTENCIA, SEQINCONCISTENCIA, ConstraintType.MUST)
                            var dtsInconcistencia = DatasetFactory.getDataset('dts_getInconcistencia_MFX', null, [c1], null).values
    
                            if (dtsInconcistencia.length > 0) {
    
                                var alerts = '';
    
                                for (let i = 0; i < dtsInconcistencia.length; i++) {
                                    let msg = dtsInconcistencia[0]['MENSAGEM'].replace('/n', '\n');
    
                                    if (dtsInconcistencia[0].MENSAGEM.indexOf('já existe no banco de dados.') != -1) {
                                        let valor = $('#hd_avancarAtv').val();
                                        if (valor == '' || valor == 'nao') {
                                            alerts = `<p><b>CAMPO</b> : ${dtsInconcistencia[i]['CAMPOVALIDADOR'].trim()}</p> <p><b>MSG</b> : ${msg}</p> <p><b>COD VALIDADOR</b> : ${dtsInconcistencia[i]['CODVALIDADOR'].trim()}</p> <p><b>SEQNOTA</b> : ${seqnota}</p>\n`
                                            mostrarMensagemErro(alerts);
                                            return false;
                                        }
                                    } else {
                                        alerts = `<p><b>CAMPO</b> : ${dtsInconcistencia[i]['CAMPOVALIDADOR'].trim()}</p> <p><b>MSG</b> : ${msg}</p> <p><b>COD VALIDADOR</b> : ${dtsInconcistencia[i]['CODVALIDADOR'].trim()}</p> <p><b>SEQNOTA</b> : ${seqnota}</p>\n`
                                        throw `<div> <h2>ALERTA!</h2> <div>${alerts}</div> </div>`
                                    }
                                }
                            }
                        }
                    }
                }
            }   
        }
        else{
            throw(returnParamsIntegracao)
        }
    }
}

function validaParamsIntegracao(){
    //valida se os centros de custos foram adicionados
    const linesCC = Array.from($('#tbccusto tbody tr'))
    linesCC.shift()

    if(linesCC.length == 0){
        $('#btn_ccusto_novo').attr('disabled', false)

        return 'Nenhum Centro de Custo foi adicionado no rateio!'
    }

    //valida se as parcelas foram adicionadas
    const linesParcelas = Array.from($('#tbparcelas tbody tr'))
    linesParcelas.shift()

    if(linesParcelas.length == 0){
        $('#btn_parcelas_gerar').attr('disabled', false)
        $('#btn_parcelas_limpar').attr('disabled', false)

        return 'Nenhuma parcela foi adicionada!'
    }
}

function mostrarMensagemErro(alerts) {

    const modalOptions = {
        title: 'Alerta',
        content: alerts,
        id: 'fluig-modal-validador',
        actions: [{
            'label': 'Confirmar',
            'bind': 'data-open-modal-confirmar',
            'autoClose': true
        },
        {
            'label': 'Cancelar',
            'bind': 'data-open-modal-cancelar',
            'autoClose': true
        }]
    };

    const modal = FLUIGC.modal(modalOptions);
}

$(document).on('click', '[data-open-modal-confirmar]', function (ev) {
    nfIntegrada = true
});

function sleep(milliseconds) {
    var start = new Date().getTime();
    for (var i = 0; i < 1e7; i++) {
        if ((new Date().getTime() - start) > milliseconds) {
            break;
        }
    }
}
//Script somente para vizualizar os objs json que serão feitos na atividade de serviço
function getParams() {
    
    var prNumeroNF = $("#txt_dadosnf_numeronf").val().trim();//ok
    prNumeroNF != null && prNumeroNF != '' ? prNumeroNF = prNumeroNF : console.log('Numero NF')

    //prSerie E prSubSerie
    var prSerie = $("#nroserie").val().trim()
    prSerie == '' ? null : prSerie = prSerie.trim()
    var prSubSerie = null

    //prSeqpessoa
    var prSeqpessoa = $('#seqpessoa').val().trim();//ok
    prSeqpessoa == '' ? 0 : prSeqpessoa = prSeqpessoa.trim()

    //prEmpresa
    var prEmpresa = $("#nroempresa").val().trim();
    prEmpresa == '' ? 0 : prEmpresa = parseInt(prEmpresa)

    //prCodHistorico
    var prCodHistorico = $("#codhistorico").val().trim()
    prCodHistorico == '' ? 0 : prCodHistorico = parseInt(prCodHistorico)

    //prDataEmissao
    var prDataEmissao =  formataData($("#hd_dataEmissao").val().trim()) 
    prDataEmissao != '' && prDataEmissao != null ? prDataEmissao = prDataEmissao.trim() : prDataEmissao = null

    //prDataEntrada  
    var prDataEntrada = formataData($("#hd_dataEntrada").val().trim())//data de lançamento ** incluir no form
    prDataEntrada != '' && prDataEntrada != null ? prDataEmissao = prDataEmissao : prDataEntrada = null

    //prUsuarioLacto
    var prUsuarioLacto = $("#chapaLanc").val().trim()
    prUsuarioLacto != '' && prUsuarioLacto != null ? prUsuarioLacto = prUsuarioLacto.trim() : prUsuarioLacto = null

    //VALOR BRUTO
    var prValorPrincipal = $("#txt_dadosnf_valorbruto").val();
    prValorPrincipal != '' && prValorPrincipal != null ? prValorPrincipal = formataMoedaInt(prValorPrincipal) : prValorPrincipal = 0;

    //VALOR LIQUIDO
    var prValorLiquido = $("#txt_dadosnf_valorliquido").val();
    prValorLiquido != '' && prValorLiquido != null ? prValorLiquido = formataMoedaInt(prValorLiquido) : prValorLiquido = 0;

    // Impostos
    //TIPO PESSOA
    var tipoDoc = $('#hdn_slct_fornec_tipo_pessoa').val()

    //INSS
    var idVlrInss
    var idAliqInss
    tipoDoc == 'juridica' ? idVlrInss = 'txt_valorinssJ' : idVlrInss = 'txt_valorinssF'
    tipoDoc == 'juridica' ? idAliqInss = 'txt_aliqinssJ' : idAliqInss = 'txt_aliqinssF'
    var prVlrinss = $('#' + idVlrInss).val()
    var prAliqinss = $('#' + idAliqInss).val()

    prVlrinss != '' && prVlrinss != null ? prVlrinss = formataMoedaInt(prVlrinss) : prVlrinss = 0
    prAliqinss != '' && prAliqinss != null ? prAliqinss = parseFloat(prAliqinss.replace('%', '')) : prAliqinss = 0

    //IR OU IRRF
    var idVlrIr
    var idAliqIr
    tipoDoc == 'juridica' ? idVlrIr = 'txt_valorirrfJ' : idVlrIr = 'txt_valorirrfF'
    tipoDoc == 'juridica' ? idAliqIr = 'txt_aliqirrfJ' : idAliqIr = 'txt_aliqirrfF'
    var prVlrir = $('#' + idVlrIr).val()
    var prAliqir = $('#' + idAliqIr).val()

    prVlrir != '' && prVlrir != null ? prVlrir = formataMoedaInt(prVlrir) : prVlrir = 0
    prAliqir != '' && prAliqir != null ? prAliqir = parseFloat(prAliqir.replace('%', '')) : prAliqir = 0

    //ISSST
    var PRALIQISSST = 0
    var PRVLRISSST = 0

    //PIS
    var prVlrpis = $("#txt_valorpis").val()
    var prAliqpis = $("#txt_aliqpis").val()

    prVlrpis != '' && prVlrpis != null ? prVlrpis = formataMoedaInt(prVlrpis) : prVlrpis = 0
    prAliqpis != '' && prAliqpis != null ? prAliqpis = parseFloat(prAliqpis.replace('%', '')) : prAliqpis = 0

    //COFINS
    var prVlrcofins = $("#txt_valorcofins").val()
    var prAliqcofins = $("#txt_aliqcofins").val()

    prVlrcofins != '' && prVlrcofins != null ? prVlrcofins = formataMoedaInt(prVlrcofins) : prVlrcofins = 0
    prAliqcofins != '' && prAliqcofins != null ? prAliqcofins = parseFloat(prAliqcofins.replace('%', '')) : prAliqcofins = 0

    //CSSLL
    var prVlrcssll = $("#txt_valorcsll").val()
    var prAliqcssll = $("#txt_aliqcsll").val()

    prVlrcssll != '' && prVlrcssll != null ? prVlrcssll = formataMoedaInt(prVlrcssll) : prVlrcssll = 0
    prAliqcssll != '' && prAliqcssll != null ? prAliqcssll = parseFloat(prAliqcssll.replace('%', '')) : prAliqcssll = 0

    //ICMS
    var prVlricms = $("#txt_valoricms").val()
    var prAliqicms = $("#txt_aliqicms").val()

    prVlricms != '' && prVlricms != null ? prVlricms = formataMoedaInt(prVlricms) : prVlricms = 0
    prAliqicms != '' && prAliqicms != null ? prAliqicms = parseFloat(prAliqicms.replace('%', '')) : prAliqicms = 0

    //ISS
    var prVlriss = $("#txt_valoriss").val()
    var prAliqiss = $("#txt_aliqiss").val()

    prVlriss != '' && prVlriss != null ? prVlriss = formataMoedaInt(prVlriss) : prVlriss = 0
    prAliqiss != '' && prAliqiss != null ? prAliqiss = parseFloat(prAliqiss.replace('%', '')) : prAliqiss = 0

    //SESTSENAT
    var prAliqsestsenat = 0
    var prVlrsestsenat = 0

    //IPI
    var prVlripi = $("#txt_valoripi").val()
    var prAliqipi = $("#txt_aliqipi").val()

    prVlripi != '' && prVlripi != null ? prVlripi = formataMoedaInt(prVlripi) : prVlripi = 0
    prAliqipi != '' && prAliqipi != null ? prAliqipi = parseFloat(prAliqipi.replace('%', '')) : prAliqipi = 0

    //PISCRED
    var prAliqpiscred = 0
    var prVlrpiscred = 0
    var prAliqcofinscred = 0
    var prVlrcofinscred = 0
    var prAliqicmsrettransp = 0
    var prVlricmsrettransp = 0

    // -----------Base -----------------
    var prVlrvlrbasepis = $("#txt_basepis").val()
    prVlrvlrbasepis != '' && prVlrvlrbasepis != null ? prVlrvlrbasepis = formataMoedaInt(prVlrvlrbasepis) : prVlrvlrbasepis = 0

    var prVlrbasecofins = $("#txt_basecofins").val()
    prVlrbasecofins != '' && prVlrbasecofins != null ? prVlrbasecofins = formataMoedaInt(prVlrbasecofins) : prVlrbasecofins = 0

    var prVlrbasepiscred
    prVlrvlrbasepis != '' && prVlrvlrbasepis != null ? prVlrbasepiscred = prValorPrincipal : prVlrbasepiscred = 0

    var prVlrbasecofinscred
    prVlrbasecofins != '' && prVlrbasecofins != null ? prVlrbasecofinscred = prValorPrincipal : prVlrbasecofinscred = 0

    //VLR BASE INSS
    var idBaseInss
    tipoDoc == 'juridica' ? idBaseInss = 'txt_baseinssJ' : idBaseInss = 'txt_baseinssF'
    var prVlrbaseinss = $('#' + idBaseInss).val()
    prVlrbaseinss != '' && prVlrbaseinss != null ? prVlrbaseinss = formataMoedaInt(prVlrbaseinss) : prVlrbaseinss = 0

    //VLR BASE IRRF
    var idBaseIr
    tipoDoc == 'juridica' ? idBaseIr = 'txt_baseirrfJ' : idBaseIr = 'txt_baseirrfF'
    var prVlrbaseir = $('#' + idBaseIr).val()
    prVlrbaseir != '' && prVlrbaseir != null ? prVlrbaseir = formataMoedaInt(prVlrbaseir) : prVlrbaseir = 0

    var prVlrbasesestsenat = 0

    //VRL BASE CSLL
    var prVlrbasecsll = $("#txt_basecsll").val()
    prVlrbasecsll != '' && prVlrbasecsll != null ? prVlrbasecsll = formataMoedaInt(prVlrbasecsll) : prVlrbasecsll = 0

    //issst e issqn  
    var prVlrbaseissst = 0
    var prVlrbaseissqn = $("#txt_baseiss").val()
    prVlrbaseissqn != '' && prVlrbaseissqn != null ? prVlrbaseissqn = formataMoedaInt(prVlrbaseissqn) : prVlrbaseissqn = 0


    //VLR BASE ICMS
    var prVlrbaseicms = $("#txt_baseicms").val()
    prVlrbaseicms != '' && prVlrbaseicms != null ? prVlrbaseicms = formataMoedaInt(prVlrbaseicms) : prVlrbaseicms = 0

    //VLR BASE IPI
    var prVlrbaseipi = $("#txt_baseipi").val()
    prVlrbaseipi != '' && prVlrbaseipi != null ? prVlrbaseipi = formataMoedaInt(prVlrbaseipi) : prVlrbaseipi = 0

    // -- isento
    var prVlrisento = 0

    var prVlrisentoipi = $("#txt_isentoipi").val()
    prVlrisentoipi != '' && prVlrisentoipi != null ? prVlrisentoipi = formataMoedaInt(prVlrisentoipi) : prVlrisentoipi = 0

    // -- outros
    var prVlroutrosipi = $("#txt_outrosipi").val()
    prVlroutrosipi != '' && prVlroutrosipi != null ? prVlroutrosipi = formataMoedaInt(prVlroutrosipi) : prVlroutrosipi = 0

    var prVlroutras = prValorPrincipal
    //prVlroutras != '' && prVlroutras != null ? prVlroutras = formataMoedaInt(prVlroutras) : prVlroutras = 0

    var prVlroutrasopdesc = 0

    //-- desconto, acrescimos, liqnota
    var prVlrdescontos = 0
    var prVlracrescimos = 0

    // -- datas
    // -- tributo
    var prTributicms = 0
    var prTributpis = 0
    var prTributcofins = 0
    var prTributpiscred = 0
    var prTributcofinscred = 0
    var prValorFinanceiro = 0
    var obs = $("#txta_parcelas_obs").val()
    if (obs == '') {
        var prObservacao = 'Solicitação: ' + $("#hd_numProcess").val().trim()
    } else {
        var prObservacao = 'Solicitação: ' + $("#hd_numProcess").val().trim() + ' - ' + obs
    }
    var prCstpiscred = 0
    var prCstcofinscred = 0
    var prNfe = 0
    var prCodChave = null
    // var prCodChave = $('txt_dadosnf_codAcesso').trim()
    // prCodChave == '' ? prCodChave = null : prCodChave = prCodChave
    var prnfechaveacessoservico = $('#txt_dadosnf_codAcesso').val().trim()
    prnfechaveacessoservico == '' || prnfechaveacessoservico == 'null' ? prnfechaveacessoservico = null : prnfechaveacessoservico = prnfechaveacessoservico
    var prQtdParcela = $("#txt_parcelas_qntparcelas").val().trim()
    prQtdParcela != '' && prQtdParcela != null ? prQtdParcela = prQtdParcela : prQtdParcela = 0
    var prCodModelo = $("#modelo").val()[0]
    var prVlrTforn = 0
    var prVlrServTrib = 0
    var prVlrCobTer = 0
    var prVlrDespAcess = 0
    var prAliqinssPesFis = 0
    var prVlrinssPesFis = 0
    var prVlrBaseinssPesFis = 0
    var prAliqinssPat = 0
    var prVlrBaseinssPat = 0
    var prVlrinssPat = 0
    var prAliqirPesFis = 0
    var prVlrbaseirPesFis = 0
    var prVlrirPesFis = 0
    var prCodRecDarfPisRet = 0
    var prCodRecDarfCofinsRet = 0
    var prCodRecDarfCSLLRet = 0
    var prCodRecDarfIrrf = 0
    var prCodRecDarfIrrfPesFis = 0
    var prPrazoPagamento = formataData($("#hd_datavenct").val().trim())
    var prSeqnota = '?' //$("seqnota").trim()           
    var pr_codsitdoc = 0
    var pr_obsFinanceiro = prObservacao
    var pr_seqinconsistencia = '?'

    var parametros = prNumeroNF + "," +
        "'" + prSerie + "'," +
        prSubSerie + "," +
        prSeqpessoa + "," +
        prEmpresa + "," +
        prCodHistorico + "," +
        "'" + prDataEmissao + "'," +
        "'" + prDataEntrada + "'," +
        "'" + prUsuarioLacto + "'," +
        prValorPrincipal + "," +
        prValorLiquido + "," +
        //impostos
        prAliqinss + "," +
        prVlrinss + "," +
        prAliqir + "," +
        prVlrir + "," +
        PRALIQISSST + "," +
        PRVLRISSST + "," +
        prAliqpis + "," +
        prVlrpis + "," +
        prAliqcofins + "," +
        prVlrcofins + "," +
        prAliqcssll + "," +
        prVlrcssll + "," +
        prAliqicms + "," +
        prVlricms + "," +
        prAliqiss + "," +
        prVlriss + "," +
        prAliqsestsenat + "," +
        prVlrsestsenat + "," +
        prAliqipi + "," +
        prVlripi + "," +
        prAliqpiscred + "," +
        prVlrpiscred + "," +
        prAliqcofinscred + "," +
        prVlrcofinscred + "," +
        prAliqicmsrettransp + "," +
        prVlricmsrettransp + "," +
        prVlrvlrbasepis + "," +
        prVlrbasecofins + "," +
        prVlrbasepiscred + "," +
        prVlrbasecofinscred + "," +
        prVlrbaseinss + "," +
        prVlrbaseir + "," +
        prVlrbasesestsenat + "," +
        prVlrbasecsll + "," +
        prVlrbaseissst + "," +
        prVlrbaseissqn + "," +
        prVlrbaseicms + "," +
        prVlrbaseipi + "," +
        //isento
        prVlrisento + "," +
        prVlrisentoipi + "," +
        prVlroutrosipi + "," +
        prVlroutras + "," +
        prVlroutrasopdesc + "," +
        prVlrdescontos + "," +
        prVlracrescimos + "," +
        //tributos
        "'" + prTributicms + "'," +
        "'" + prTributpis + "'," +
        "'" + prTributcofins + "'," +
        "'" + prTributpiscred + "'," +
        "'" + prTributcofinscred + "'," +
        prValorFinanceiro + "," +
        "'" + prObservacao + "'," +
        "'" + prCstpiscred + "'," +
        "'" + prCstcofinscred + "'," +
        "'" + prNfe + "'," +
        prCodChave + "," +
        "'" + prnfechaveacessoservico + "'," +
        prQtdParcela + "," +
        "'" + prCodModelo + "'," +
        prVlrTforn + "," +
        prVlrServTrib + "," +
        prVlrCobTer + "," +
        prVlrDespAcess + "," +
        prAliqinssPesFis + "," +
        prVlrinssPesFis + "," +
        prVlrBaseinssPesFis + "," +
        prAliqinssPat + "," +
        prVlrBaseinssPat + "," +
        prVlrinssPat + "," +
        prAliqirPesFis + "," +
        prVlrbaseirPesFis + "," +
        prVlrirPesFis + "," +
        "'" + prCodRecDarfPisRet + "'," +
        "'" + prCodRecDarfCofinsRet + "'," +
        "'" + prCodRecDarfCSLLRet + "'," +
        "'" + prCodRecDarfIrrf + "'," +
        "'" + prCodRecDarfIrrfPesFis + "'," +
        "'" + prPrazoPagamento + "'," +
        prSeqnota + "," +
        "'" + pr_codsitdoc + "'," +
        "'" + pr_obsFinanceiro + "'," +
        pr_seqinconsistencia

    var objNF = {
        prNumeroNF: parseInt(prNumeroNF),
        prSerie: prSerie,
        prSubSerie: prSubSerie,
        prSeqpessoa: parseInt(prSeqpessoa),
        prEmpresa: parseInt(prEmpresa),
        prCodHistorico: parseInt(prCodHistorico),
        prDataEmissao: prDataEmissao,
        prDataEntrada: prDataEntrada,
        prUsuarioLacto: prUsuarioLacto,
        prValorPrincipal: parseFloat(prValorPrincipal),
        prValorLiquido: parseFloat(prValorLiquido),
        prAliqinss: parseFloat(prAliqinss),
        prVlrinss: parseFloat(prVlrinss),
        prAliqir: parseFloat(prAliqir),
        prVlrir: parseFloat(prVlrir),
        PRALIQISSST: parseFloat(PRALIQISSST),
        PRVLRISSST: parseFloat(PRVLRISSST),
        prAliqpis: parseFloat(prAliqpis),
        prVlrpis: parseFloat(prVlrpis),
        prAliqcofins: parseFloat(prAliqcofins),
        prVlrcofins: parseFloat(prVlrcofins),
        prAliqcssll: parseFloat(prAliqcssll),
        prVlrcssll: parseFloat(prVlrcssll),
        prAliqicms: parseFloat(prAliqicms),
        prVlricms: parseFloat(prVlricms),
        prAliqiss: parseFloat(prAliqiss),
        prVlriss: parseFloat(prVlriss),
        prAliqsestsenat: parseFloat(prAliqsestsenat),
        prVlrsestsenat: parseFloat(prVlrsestsenat),
        prAliqipi: parseFloat(prAliqipi),
        prVlripi: parseFloat(prVlripi),
        prAliqpiscred: parseFloat(prAliqpiscred),
        prVlrpiscred: parseFloat(prVlrpiscred),
        prAliqcofinscred: parseFloat(prAliqcofinscred),
        prVlrcofinscred: parseFloat(prVlrcofinscred),
        prAliqicmsrettransp: parseFloat(prAliqicmsrettransp),
        prVlricmsrettransp: parseFloat(prVlricmsrettransp),
        prVlrvlrbasepis: parseFloat(prVlrvlrbasepis),
        prVlrbasecofins: parseFloat(prVlrbasecofins),
        prVlrbasepiscred: parseFloat(prVlrbasepiscred),
        prVlrbasecofinscred: parseFloat(prVlrbasecofinscred),
        prVlrbaseinss: parseFloat(prVlrbaseinss),
        prVlrbaseir: parseFloat(prVlrbaseir),
        prVlrbasesestsenat: parseFloat(prVlrbasesestsenat),
        prVlrbasecsll: parseFloat(prVlrbasecsll),
        prVlrbaseissst: parseFloat(prVlrbaseissst),
        prVlrbaseissqn: parseFloat(prVlrbaseissqn),
        prVlrbaseicms: parseFloat(prVlrbaseicms),
        prVlrbaseipi: parseFloat(prVlrbaseipi),
        prVlrisento: parseFloat(prVlrisento),
        prVlrisentoipi: parseFloat(prVlrisentoipi),
        prVlroutrosipi: parseFloat(prVlroutrosipi),
        prVlroutras: parseFloat(prVlroutras),
        prVlroutrasopdesc: parseFloat(prVlroutrasopdesc),
        prVlrdescontos: parseFloat(prVlrdescontos),
        prVlracrescimos: parseFloat(prVlracrescimos),
        prTributicmspr: prTributicms,
        prTributpis: prTributpis,
        prTributcofins: prTributcofins,
        prTributpiscred: prTributpiscred,
        prTributcofinscred: prTributcofinscred,
        prValorFinanceiro: parseFloat(prValorFinanceiro),
        prObservacao: prObservacao,
        prCstpiscred: prCstpiscred,
        prCstcofinscred: prCstcofinscred,
        prNfe: prNfe,
        prCodChave: prCodChave,
        prnfechaveacessoservico: prnfechaveacessoservico,
        prQtdParcela: parseInt(prQtdParcela),
        prCodModelo: prCodModelo,
        prVlrTforn: parseFloat(prVlrTforn),
        prVlrServTrib: parseFloat(prVlrServTrib),
        prVlrCobTer: parseFloat(prVlrCobTer),
        prVlrDespAcess: parseFloat(prVlrDespAcess),
        prAliqinssPesFis: parseFloat(prAliqinssPesFis),
        prVlrinssPesFis: parseFloat(prVlrinssPesFis),
        prVlrBaseinssPesFis: parseFloat(prVlrBaseinssPesFis),
        prAliqinssPat: parseFloat(prAliqinssPat),
        prVlrBaseinssPat: parseFloat(prVlrBaseinssPat),
        prVlrinssPat: parseFloat(prVlrinssPat),
        prAliqirPesFis: parseFloat(prAliqirPesFis),
        prVlrbaseirPesFis: parseFloat(prVlrbaseirPesFis),
        prVlrirPesFis: parseFloat(prVlrirPesFis),
        prCodRecDarfPisRet: prCodRecDarfPisRet,
        prCodRecDarfCofinsRet: prCodRecDarfCofinsRet,
        prCodRecDarfCSLLRet: prCodRecDarfCSLLRet,
        prCodRecDarfIrrf: prCodRecDarfIrrf,
        prCodRecDarfIrrfPesFis: prCodRecDarfIrrfPesFis,
        prPrazoPagamento: prPrazoPagamento,
        prSeqnota: prSeqnota,
        pr_codsitdoc: pr_codsitdoc,
        pr_obsFinanceiro: pr_obsFinanceiro,
        pr_seqinconsistenci: pr_seqinconsistencia
    }

    console.log(objNF)

    var error = false
    var c1 = DatasetFactory.createConstraint('parametros', parametros, parametros, ConstraintType.MUST)
    var dts = DatasetFactory.getDataset('dts_IntegraC5PagNotas_MFX', null, [c1], null).values


    if (dts[0]['SEQINCONSISTENCIA'] != null) {
        $('#statusIntegracao').val('false')
        error = true
        return [dts[0]['SEQINCONSISTENCIA'], 'SEM SEQNOTA']

    } else if (dts[0]['error'] != null) {
        $('#statusIntegracao').val('false')
        error = true
        return ['return', dts]
    } else {
        prSeqnota = dts[0]['SEQNOTA']
    }

    if (error == false) {
        var prNroempresa = $('#nroempresa').val()

        //CONTA & INDENTCAPITIS & ACRECIMOS & DESCONTOS
        var prConta = $('#contadebito').val()
        var prIdentcapitis = 0

        //USUARIO ALTERAÇÃO
        // var prUsualteracao = $("#chapaLanc").trim()
        // if ((prUsualteracao == "") && (prUsualteracao == null)) {
        //     errorValue('Usuario alteração')
        // }else{
        //     prUsualteracao = prUsualteracao.trim()
        // }

        var prUsualteracao = null
        //VALOR IMPOSTOS
        var prVlrimpostos = $('#txt_valordeducao').val()
        prVlrimpostos != '' && prVlrimpostos != null ? prVlrimpostos = formataMoedaInt(prVlrimpostos) : prVlrimpostos = 0

        //INTEGRA PARCELAS
        var tr = $('#tbparcelas tbody tr')

        //var parcelas = hdindexParcelas.split(';')
        var resto = 0

        for (var i = 1; i < tr.length; i++) {
            var parcelas = tr.length - 1
            var index = (tr[i].childNodes[3].childNodes[0].id).split('___')[1]
            var prValor = parseFloat($('#hd_parcelas_valor___' + index).val())
            var date = $('#hd_vencimento___' + index).val()
            var dataSplit = date.split('/')
            var dia = dataSplit[0]
            var mes
            switch (parseInt(dataSplit[1])) {
                case 1:
                    mes = 'Jan'
                    break;
                case 2:
                    mes = 'Feb'
                    break;
                case 3:
                    mes = 'Mar'
                    break;
                case 4:
                    mes = 'Apr'
                    break;
                case 5:
                    mes = 'May'
                    break;
                case 6:
                    mes = 'June'
                    break;
                case 7:
                    mes = 'July'
                    break;
                case 8:
                    mes = 'Aug'
                    break;
                case 9:
                    mes = 'Sep'
                    break;
                case 10:
                    mes = 'Oct'
                    break;
                case 11:
                    mes = 'Nov'
                    break;
                case 12:
                    mes = 'Dec'
                    break;
            }
            var ano = dataSplit[2]
            var prDtavencto = dia + '-' + mes + '-' + ano
            var prNroparcela = i + 1
            if (prVlrimpostos > 0) {
                if (prVlrimpostos > 0) {
                    if (parcelas > 1) {
                        var valorImpostoParcela = (prVlrimpostos / parcelas)
                        var valorStr = valorImpostoParcela.toString()
                        resto = resto + parseFloat('0.00' + (valorStr.split('.')[1]).substring(2, (valorStr.split('.')[1]).length))
                        var valorArrendondado = parseFloat(valorStr.substring(0, 4))
                        if (i == (parcelas - 1)) {
                            var valorUltimaImposto = (valorArrendondado + resto)
                            var split = valorUltimaImposto.toString().split('.')
                            var prVlrimpostosParcela = parseFloat(split[0] + '.' + split[1].substring(0, 2))
                        } else {
                            var prVlrimpostosParcela = parseFloat(valorArrendondado)
                        }
                    } else {
                        var prVlrimpostosParcela = prVlrimpostos
                    }
                } else {
                    prVlrimpostosParcela = 0
                }
            } else {
                prVlrimpostosParcela = 0
            }
            var prValorParcela = prValor + prVlrimpostosParcela
            var prValorLiquidoParcela = prValorParcela - prVlrimpostosParcela

            var parametrosParcelas = prSeqnota + "," + prConta + ",'" + prDtavencto + "'," + prNroempresa + "," + prValorParcela + "," + prIdentcapitis + "," + prVlrdescontos + "," + prVlracrescimos + "," + prNroparcela + "," + prUsualteracao + "," + prValorLiquidoParcela + "," + prVlrimpostosParcela + ",'" + prObservacao + "'," + prVlroutrasopdesc + ",?"

            var c1 = DatasetFactory.createConstraint('parametros', parametrosParcelas, parametrosParcelas, ConstraintType.MUST)
            var dtsVenct = DatasetFactory.getDataset('dts_IntegraC5Venct_MFX', null, [c1], null).values

            if (dtsVenct[0]['SEQINCONSISTENCIA'] != null) {
                $('#statusIntegracao').val('false')
                error = true
                i = parcelas.length
                return [dtsVenct[0]['SEQINCONSISTENCIA'], prSeqnota]
            } else if (dtsVenct[0]['error'] != null) {
                $('#statusIntegracao').val('false')
                error = true
                return ['return', dtsVenct]
            }

            var objParcela = {
                prSeqNota: prSeqnota,
                prConta: prConta,
                prDtavencto: prDtavencto,
                prNroempresa: prNroempresa,
                prValorParcela: prValorParcela,
                prIdentcapitis: prIdentcapitis,
                prVlrdescontos: prVlrdescontos,
                prVlracrescimos: prVlracrescimos,
                prNroparcela: prNroparcela,
                prUsualteracao: prUsualteracao,
                prValorLiquidoParcela: prValorLiquidoParcela,
                prVlrimpostosParcela: prVlrimpostosParcela,
                prObservacao: prObservacao,
                prVlroutrasopdesc: prVlroutrasopdesc,
                output: '?'
            }

            console.log(objParcela)
        }
    }
    if (error == false) {
        var tr = $('#tbccusto tbody tr')
        for (var i = 1; i < tr.length; i++) {
            var index = (tr[i].childNodes[3].childNodes[0].id).split('___')[1]
            var pr_valor = $('#hdn_parcelas_valor___' + index).val()
            pr_valor != '' && pr_valor ? pr_valor = parseFloat(pr_valor) : pr_valor = 0;
            var pr_centroCusto = $('#hdn_codcusto___' + index).val()

            var parametrosRateio = prSeqnota + "," + prNroempresa + ",'" + prUsuarioLacto + "'," + pr_valor + "," + prValorPrincipal + "," + prNumeroNF + ",'" + prCodHistorico + "'," + pr_centroCusto + "," + null + ",'" + prObservacao + "', ?"

            var c1 = DatasetFactory.createConstraint('parametros', parametrosRateio, parametrosRateio, ConstraintType.MUST)
            var dtsRateio = DatasetFactory.getDataset('dts_IntegraC5Rateio_MFX', null, [c1], null).values

            if (dtsRateio[0]['SEQINCONSISTENCIA'] != null) {
                $('#statusIntegracao').val('false')
                error = true
                return [dtsRateio[0]['SEQINCONSISTENCIA'], prSeqnota]
            } else if (dtsRateio[0]['error'] != null) {
                $('#statusIntegracao').val('false')
                error = true
                return ['return', dtsRateio]
            }

            var objRateio = {
                prSeqNota: prSeqnota,
                prNroempresa: prNroempresa,
                prUsuarioLacto: prUsuarioLacto,
                pr_valor: pr_valor,
                prValorPrincipal: prValorPrincipal,
                prNumeroNF: prNumeroNF,
                prCodHistorico: prCodHistorico,
                prUsuarioLacto: prUsuarioLacto,
                pr_centroCusto: pr_centroCusto,
                pr_nroconta: 'null',
                prObservacao: prObservacao,
                output: '?'
            }
            console.log(objRateio)
        }
    }

    if (error == false) {
        var tipoCusto = $('#txt_dadosnf_ccusto').val()

        var parametroImpostos = prSeqnota + "," + prNroempresa + ",'" + prUsuarioLacto + "'," + prValorPrincipal + ",'" + prObservacao + "', ?"
        var c1 = DatasetFactory.createConstraint('parametros', parametroImpostos, parametroImpostos, ConstraintType.MUST)
        var dtsImpostos = DatasetFactory.getDataset('dts_IntegraC5Impostos_MFX', null, [c1], null).values

        if (dtsImpostos[0]['SEQINCONSISTENCIA'] != null) {
            $('#statusIntegracao').val('false')
            error = true
            return [dtsImpostos[0]['SEQINCONSISTENCIA'], prSeqnota]
        } else if (dtsImpostos[0]['error'] != null) {
            $('#statusIntegracao').val('false')
            error = true
            return ['return', dtsImpostos]
        }

        if ((prVlrimpostos != 0 && prVlrimpostos != '' && prVlrimpostos) || tipoCusto == 'Despesa') {
            var objImpostos = {
                prSeqNota: prSeqnota,
                prNroempresa: prNroempresa,
                prUsuarioLacto: prUsuarioLacto,
                prValorPrincipal: prValorPrincipal,
                prObservacao: prObservacao,
                output: '?'
            }
        }
        console.log(objImpostos)
    }

    if (error == false) {
        //INTEGRA FINAL
        var parametroNF = prSeqnota + ",?"
        var c1 = DatasetFactory.createConstraint('parametros', parametroNF, parametroNF, ConstraintType.MUST)
        var dtsFinal = DatasetFactory.getDataset('dts_IntegraC5final_MF', null, [c1], null).values

        if (dtsFinal[0]['SEQINCONSISTENCIA'] != null) {
            $('#statusIntegracao').val('false')
            error = true
            return [dtsFinal[0]['SEQINCONSISTENCIA'], prSeqnota]
        } else if (dtsFinal[0]['error'] != null) {
            $('#statusIntegracao').val('false')
            error = true
            return ['return', dtsFinal]
        } else {
            $('#txta_logError').val('INTEGRADO COM SUCESSO!\nSEQNOTA: ' + prSeqnota)
        }
    }
}
