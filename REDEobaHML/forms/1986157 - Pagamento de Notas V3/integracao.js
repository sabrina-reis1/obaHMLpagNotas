//Script somente para vizualizar os objs json que serão feitos na atividade de serviço
function getParams(){
    var prNumeroNF = $("#txt_dadosnf_numeronf").val().trim();//ok
        prNumeroNF != null && prNumeroNF != '' ? prNumeroNF= prNumeroNF : console.log('Numero NF')

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
        var prDataEmissao = $("#hd_dataEmissao").val().trim();
        prDataEmissao != '' && prDataEmissao != null ? prDataEmissao = prDataEmissao.trim() : prDataEmissao = null
    
        //prDataEntrada  
        var prDataEntrada = $("#hd_dataEntrada").val().trim()//data de lançamento ** incluir no form
        prDataEntrada != '' && prDataEntrada != null ? prDataEmissao = prDataEmissao.trim() : prDataEmissao = null
    
        //prUsuarioLacto
        var prUsuarioLacto = $("#chapaLanc").val().trim()
        prUsuarioLacto != '' && prUsuarioLacto != null ? prUsuarioLacto = prUsuarioLacto.trim() : prUsuarioLacto = null
    
        //VALOR BRUTO
        var prValorPrincipal = $("#txt_dadosnf_valorbruto").val();
        prValorPrincipal != '' && prValorPrincipal != null ? prValorPrincipal = parseFloat(prValorPrincipal.replace('R$', '').replace('.', '').replace(',', '.')) : prValorPrincipal = 0;
        
        //VALOR LIQUIDO
        var prValorLiquido = $("#txt_dadosnf_valorliquido").val();
        prValorLiquido != '' && prValorLiquido != null ? prValorLiquido = parseFloat(prValorLiquido.replace('R$', '').replace('.', '').replace(',', '.')) : prValorLiquido = 0;
    
        // Impostos
        //TIPO PESSOA
        var tipoDoc = $('#hdn_slct_fornec_tipo_pessoa').val()
    
        //INSS
        var idVlrInss
        var idAliqInss
        tipoDoc == 'juridica' ? idVlrInss = 'txt_valorinssJ' : idVlrInss = 'txt_valorinssF'
        tipoDoc == 'juridica' ? idAliqInss = 'txt_aliqinssJ' : idAliqInss = 'txt_aliqinssF'
        var prVlrinss = $('#'+idVlrInss).val()
        var prAliqinss = $('#'+idAliqInss).val()

        prVlrinss != '' && prVlrinss != null ?  prVlrinss = parseFloat(prVlrinss.replace('R$', '').replace('.', '').replace(',', '.')) : prVlrinss = 0
        prAliqinss != '' && prAliqinss != null ? prAliqinss = parseFloat(prAliqinss.replace('R$', '').replace('.', '').replace(',', '.')) : prAliqinss = 0
    
        //IR OU IRRF
        var idVlrIr
        var idAliqIr
        tipoDoc == 'juridica' ? idVlrIr = 'txt_valorirrfJ' : idVlrIr = 'txt_aliqirrfJ'
        tipoDoc == 'juridica' ? idAliqIr = 'txt_valorirrfF' : idAliqIr = 'txt_aliqirrfF'
        var prVlrir = $('#'+idVlrIr).val()
        var prAliqir = $('#'+idAliqIr).val()
    
        prVlrir != '' && prVlrir != null ?  prVlrir = parseFloat(prVlrir.replace('R$', '').replace('.', '').replace(',', '.')) : prVlrir = 0
        prAliqir != '' && prAliqir != null ? prAliqir = parseFloat(prAliqir.replace('R$', '').replace('.', '').replace(',', '.')) : prAliqir = 0
    
        //ISSST
        var PRALIQISSST = 0
        var PRVLRISSST = 0

        //PIS
        var prVlrpis = $("#txt_valorpis").val()
        var prAliqpis = $("#txt_aliqpis").val()
    
        prVlrpis != '' && prVlrpis != null ? prVlrpis = parseFloat(prVlrpis.replace('R$', '').replace('.', '').replace(',', '.')) : prVlrpis = 0
        prAliqpis != '' && prAliqpis != null ? prAliqpis = parseFloat(prAliqpis.replace('R$', '').replace('.', '').replace(',', '.')) : prAliqpis = 0
    
        //COFINS
        var prVlrcofins = $("#txt_valorcofins").val()
        var prAliqcofins = $("#txt_aliqcofins").val()
    
        prVlrcofins != '' && prVlrcofins != null ? prVlrcofins = parseFloat(prVlrcofins.replace('R$', '').replace('.', '').replace(',', '.')) : prVlrcofins = 0
        prAliqcofins != '' && prAliqcofins != null ? prAliqcofins = parseFloat(prAliqcofins.replace('R$', '').replace('.', '').replace(',', '.')) : prAliqcofins = 0
    
        //CSSLL
        var prVlrcssll = $("#txt_valorcsll").val()
        var prAliqcssll = $("#txt_aliqcsll").val()
    
        prVlrcssll != '' && prVlrcssll != null ? prVlrcssll = parseFloat(prVlrcssll.replace('R$', '').replace('.', '').replace(',', '.')) : prVlrcssll = 0
        prAliqcssll != '' && prAliqcssll != null ? prAliqcssll = parseFloat(prAliqcssll.replace('R$', '').replace('.', '').replace(',', '.')) : prAliqcssll = 0
    
        //ICMS
        var prVlricms = $("#txt_valoricms").val()
        var prAliqicms = $("#txt_aliqicms").val()
    
        prVlricms != '' && prVlricms != null ? prVlricms = parseFloat(prVlricms.replace('R$', '').replace('.', '').replace(',', '.')) : prVlricms = 0
        prAliqicms != '' && prAliqicms != null ? prAliqicms = parseFloat(prAliqicms.replace('R$', '').replace('.', '').replace(',', '.')) : prAliqicms = 0
    
        //ISS
        var prVlriss = $("#txt_valoriss").val()
        var prAliqiss = $("#txt_aliqiss").val()
    
        prVlriss != '' && prVlriss != null ? prVlriss = parseFloat(prVlriss.replace('R$', '').replace('.', '').replace(',', '.')) : prVlriss = 0
        prAliqiss != '' && prAliqiss != null ? prAliqiss = parseFloat(prAliqiss.replace('R$', '').replace('.', '').replace(',', '.')) : prAliqiss = 0
    
        //SESTSENAT
        var prAliqsestsenat = 0
        var prVlrsestsenat = 0
    
        //IPI
        var prVlripi = $("#txt_valoripi").val()
        var prAliqipi = $("#txt_aliqipi").val()
    
        prVlripi != '' && prVlripi != null ? prVlripi = parseFloat(prVlripi.replace('R$', '').replace('.', '').replace(',', '.')) : prVlripi = 0
        prAliqipi != '' && prAliqipi != null ? prAliqipi = parseFloat(prAliqipi.replace('R$', '').replace('.', '').replace(',', '.')) : prAliqipi = 0
    
        //PISCRED
        var prAliqpiscred = 0
        var prVlrpiscred = 0
        var prAliqcofinscred = 0
        var prVlrcofinscred = 0
        var prAliqicmsrettransp = 0
        var prVlricmsrettransp = 0
    
        // -----------Base -----------------
        var prVlrvlrbasepis = $("#txt_basepis").val()
        prVlrvlrbasepis != '' && prVlrvlrbasepis != null ? prVlrvlrbasepis = parseFloat(prVlrvlrbasepis.replace('R$', '').replace('.', '').replace(',', '.')) : prVlrvlrbasepis = 0
        
        var prVlrbasecofins = $("#txt_basecofins").val()
        prVlrbasecofins != '' && prVlrbasecofins != null ? prVlrbasecofins = parseFloat(prVlrbasecofins.replace('R$', '').replace('.', '').replace(',', '.')) : prVlrbasecofins = 0
        
        var prVlrbasepiscred
        prVlrvlrbasepis != '' && prVlrvlrbasepis != null ? prVlrbasepiscred = prValorPrincipal : prVlrbasepiscred = 0
         
        var prVlrbasecofinscred 
        prVlrbasecofins != '' && prVlrbasecofins != null ? prVlrbasecofinscred = prValorPrincipal : prVlrbasecofinscred = 0

        //VLR BASE INSS
        var idBaseInss
        tipoDoc == 'juridica' ? idBaseInss = 'txt_baseinssJ' : idBaseInss = 'txt_baseinssF'
        var prVlrbaseinss = $('#'+idBaseInss).val()
        prVlrbaseinss != '' && prVlrbaseinss != null ? prVlrbaseinss = parseFloat(prVlrbaseinss.replace('R$', '').replace('.', '').replace(',', '.')) : prVlrbaseinss = 0
    
        //VLR BASE IRRF
        var idBaseIr
        tipoDoc == 'juridica' ? idBaseIr = 'txt_baseirrfJ' : idBaseIr = 'txt_baseirrfF'
        var prVlrbaseir = $('#'+idBaseIr).val()
        prVlrbaseir != '' && prVlrbaseir != null ? prVlrbaseir = parseFloat(prVlrbaseir.replace('R$', '').replace('.', '').replace(',', '.')) : prVlrbaseir = 0
    
        var prVlrbasesestsenat = 0
    
        //VRL BASE CSLL
        var prVlrbasecsll = $("#txt_basecsll").val()
        prVlrbasecsll != '' && prVlrbasecsll != null ? prVlrbasecsll = parseFloat(prVlrbasecsll.replace('R$', '').replace('.', '').replace(',', '.')) : prVlrbasecsll = 0
    
        //issst e issqn  
        var prVlrbaseissst = 0    
        var prVlrbaseissqn = $("#txt_baseiss").val()
        prVlrbaseissqn != '' && prVlrbaseissqn != null ? prVlrbaseissqn = parseFloat(prVlrbaseissqn.replace('R$', '').replace('.', '').replace(',', '.')) : prVlrbaseissqn = 0

    
        //VLR BASE ICMS
        var prVlrbaseicms = $("#txt_baseicms").val()
        prVlrbaseicms != '' && prVlrbaseicms != null ? prVlrbaseicms = parseFloat(prVlrbaseicms.replace('R$', '').replace('.', '').replace(',', '.')) : prVlrbaseicms = 0
    
        //VLR BASE IPI
        var prVlrbaseipi = $("#txt_baseipi").val()
        prVlrbaseipi != '' && prVlrbaseipi != null ? prVlrbaseipi = parseFloat(prVlrbaseipi.replace('R$', '').replace('.', '').replace(',', '.')) : prVlrbaseipi = 0
    
        // -- isento
        var prVlrisento = 0
        
        var prVlrisentoipi = $("#txt_isentoipi").val()
        prVlrisentoipi != '' && prVlrisentoipi != null ? prVlrisentoipi = parseFloat(prVlrisentoipi.replace('R$', '').replace('.', '').replace(',', '.')) : prVlrisentoipi = 0
    
        // -- outros
        var prVlroutrosipi = $("#txt_outrosipi").val()
        prVlroutrosipi != '' && prVlroutrosipi != null ? prVlroutrosipi = parseFloat(prVlroutrosipi.replace('R$', '').replace('.', '').replace(',', '.')) : prVlroutrosipi = 0
    
        var prVlroutras = prValorPrincipal 
        //prVlroutras != '' && prVlroutras != null ? prVlroutras = parseFloat(prVlroutras.replace('R$', '').replace('.', '').replace(',', '.')) : prVlroutras = 0
   
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
        if(obs == ''){
            var prObservacao = 'Solicitação: '+$("#hd_numProcess").val().trim()
        }else{
            var prObservacao = 'Solicitação: '+$("#hd_numProcess").val().trim()+' - '+obs
        }
        var prCstpiscred = 0        
        var prCstcofinscred  = 0    
        var prNfe = 0               
        var prCodChave = null
        // var prCodChave = $('txt_dadosnf_codAcesso').trim()
        // prCodChave == '' ? prCodChave = null : prCodChave = prCodChave
        var prnfechaveacessoservico = $('#txt_dadosnf_codAcesso').val().trim()
        prnfechaveacessoservico == '' ? prnfechaveacessoservico = null : prnfechaveacessoservico = prnfechaveacessoservico
        var prQtdParcela = $("#txt_parcelas_qntparcelas").val().trim() 
        prQtdParcela != '' && prQtdParcela != null ? prQtdParcela = prQtdParcela : prQtdParcela = 0
        var prCodModelo = $("#modelo").val()
        var prVlrTforn = 0            
        var prVlrServTrib = 0        
        var prVlrCobTer = 0          
        var prVlrDespAcess = 0        
        var prAliqinssPesFis = 0      
        var prVlrinssPesFis  = 0      
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
        var prPrazoPagamento = $("#hd_datavenct").val().trim()
        var prSeqnota = '?' //$("seqnota").trim()           
        var pr_codsitdoc = 00
        var pr_obsFinanceiro = prObservacao
        var pr_seqinconsistencia = '?'



        var objNF =     {
            prNumeroNF :              parseInt(prNumeroNF),  
            prSerie :                 string(prSerie),  
            prSubSerie :              string(prSubSerie),  
            prSeqpessoa :             parseInt(prSeqpessoa),  
            prEmpresa :               parseInt(prEmpresa),  
            prCodHistorico :          parseInt(prCodHistorico),  
            prDataEmissao :           string(prDataEmissao),
            prDataEntrada :           string(prDataEntrada), 
            prUsuarioLacto :          string(prUsuarioLacto),  
            prValorPrincipal :        parseFloat(prValorPrincipal),  
            prValorLiquido :          parseFloat(prValorLiquido),  
            prAliqinss :              parseFloat(prAliqinss),  
            prVlrinss :               parseFloat(prVlrinss),  
            prAliqir :                parseFloat(prAliqir),  
            prVlrir :                 parseFloat(prVlrir),  
            PRALIQISSST :             parseFloat(PRALIQISSST),  
            PRVLRISSST :              parseFloat(PRVLRISSST),  
            prAliqpis :               parseFloat(prAliqpis),  
            prVlrpis :                parseFloat(prVlrpis),  
            prAliqcofins :            parseFloat(prAliqcofins),  
            prVlrcofins :             parseFloat(prVlrcofins),  
            prAliqcssll :             parseFloat(prAliqcssll),  
            prVlrcssll :              parseFloat(prVlrcssll),  
            prAliqicms :              parseFloat(prAliqicms),  
            prVlricms :               parseFloat(prVlricms),  
            prAliqiss :               parseFloat(prAliqiss),  
            prVlriss :                parseFloat(prVlriss),  
            prAliqsestsenat :         parseFloat(prAliqsestsenat),  
            prVlrsestsenat :          parseFloat(prVlrsestsenat),  
            prAliqipi :               parseFloat(prAliqipi),  
            prVlripi :                parseFloat(prVlripi),  
            prAliqpiscred :           parseFloat(prAliqpiscred),  
            prVlrpiscred :            parseFloat(prVlrpiscred),  
            prAliqcofinscred :        parseFloat(prAliqcofinscred),  
            prVlrcofinscred :         parseFloat(prVlrcofinscred),  
            prAliqicmsrettransp :     parseFloat(prAliqicmsrettransp),  
            prVlricmsrettransp :      parseFloat(prVlricmsrettransp),  
            prVlrvlrbasepis :         parseFloat(prVlrvlrbasepis),  
            prVlrbasecofins :         parseFloat(prVlrbasecofins),  
            prVlrbasepiscred :        parseFloat(prVlrbasepiscred),  
            prVlrbasecofinscred :     parseFloat(prVlrbasecofinscred),  
            prVlrbaseinss :           parseFloat(prVlrbaseinss),  
            prVlrbaseir :             parseFloat(prVlrbaseir),  
            prVlrbasesestsenat :      parseFloat(prVlrbasesestsenat),  
            prVlrbasecsll :           parseFloat(prVlrbasecsll),  
            prVlrbaseissst :          parseFloat(prVlrbaseissst),  
            prVlrbaseissqn :          parseFloat(prVlrbaseissqn),  
            prVlrbaseicms :           parseFloat(prVlrbaseicms),  
            prVlrbaseipi :            parseFloat(prVlrbaseipi),  
            prVlrisento :             parseFloat(prVlrisento),  
            prVlrisentoipi :          parseFloat(prVlrisentoipi),  
            prVlroutrosipi :          parseFloat(prVlroutrosipi),  
            prVlroutras :             parseFloat(prVlroutras),  
            prVlroutrasopdesc :       parseFloat(prVlroutrasopdesc),  
            prVlrdescontos :          parseFloat(prVlrdescontos),  
            prVlracrescimos :         parseFloat(prVlracrescimos),  
            prTributicmspr :          string(prTributicms),
            prTributpis :             string(prTributpis),
            prTributcofins :          string(prTributcofins),
            prTributpiscred :         string(prTributpiscred),
            prTributcofinscred :      string(prTributcofinscred),
            prValorFinanceiro :       parseFloat(prValorFinanceiro),  
            prObservacao :            string(prObservacao),
            prCstpiscred :            string(prCstpiscred),
            prCstcofinscred :         string(prCstcofinscred),
            prNfe :                   string(prNfe),
            prCodChave :              string(prCodChave),
            prnfechaveacessoservico : string(prnfechaveacessoservico),
            prQtdParcela :            parseInt(prQtdParcela),  
            prCodModelo :             string(prCodModelo), 
            prVlrTforn :              parseFloat(prVlrTforn),  
            prVlrServTrib :           parseFloat(prVlrServTrib),  
            prVlrCobTer :             parseFloat(prVlrCobTer),  
            prVlrDespAcess :          parseFloat(prVlrDespAcess),  
            prAliqinssPesFis :        parseFloat(prAliqinssPesFis),  
            prVlrinssPesFis :         parseFloat(prVlrinssPesFis),  
            prVlrBaseinssPesFis :     parseFloat(prVlrBaseinssPesFis),  
            prAliqinssPat :           parseFloat(prAliqinssPat),  
            prVlrBaseinssPat :        parseFloat(prVlrBaseinssPat),  
            prVlrinssPat :            parseFloat(prVlrinssPat),  
            prAliqirPesFis :          parseFloat(prAliqirPesFis),  
            prVlrbaseirPesFis :       parseFloat(prVlrbaseirPesFis),  
            prVlrirPesFis :           parseFloat(prVlrirPesFis),  
            prCodRecDarfPisRet :      string(prCodRecDarfPisRet),
            prCodRecDarfCofinsRet :   string(prCodRecDarfCofinsRet),
            prCodRecDarfCSLLRet :     string(prCodRecDarfCSLLRet),
            prCodRecDarfIrrf :        string(prCodRecDarfIrrf),
            prCodRecDarfIrrfPesFis :  string(prCodRecDarfIrrfPesFis),
            prPrazoPagamento :        string(prPrazoPagamento),
            prSeqnota :               string(prSeqnota),  
            pr_codsitdoc :            string(pr_codsitdoc),
            pr_obsFinanceiro :        string(pr_obsFinanceiro),
            pr_seqinconsistenci :     string(pr_seqinconsistencia)  
        }

        console.log(objNF)

            var prNroempresa = $('#nroempresa').val()
    
            //SEQ NOTA
            var prSeqNota = dts.getValue(0, 'SEQNOTA')
            
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
            prVlrimpostos != '' && prVlrimpostos != null ? prVlrimpostos = parseFloat(prVlrimpostos.replace('R$', '').replace('.', '').replace(',', '.')) : prVlrimpostos = 0
                        
            //INTEGRA PARCELAS
            var hdindexParcelas = $('#tbparcelas_index').val().trim()
            if(hdindexParcelas != '' && hdindexParcelas != null && hdindexParcelas != undefined){
                var parcelas = hdindexParcelas.split(';')
                var resto = 0

                    for(var i = 0; i < parcelas.length; i++){
                        var prValor = parseFloat($('#hd_parcelas_valor___'+parcelas[i]).val())
                        var date = $('hd_vencimento___'+parcelas[i]).val()
                        var dataSplit = date.split('/')
                            var dia = dataSplit[0]
                            var mes
                            switch (parseInt(dataSplit[1])){
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
                                    mes = 'Sept'
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
                            var prDtavencto = dia+'-'+mes+'-'+ano
                            var prNroparcela = i + 1
                            if(prVlrimpostos > 0){
                                if(parcelas.length > 1){
                                    var valorImpostoParcela = (prVlrimpostos/parcelas.length)
                                    var valorStr = valorImpostoParcela.toString()
                                    resto = resto + parseFloat('0.00'+(valorStr.split('.')[1]).substring(2, (valorStr.split('.')[1]).length))
                                    var valorArrendondado = parseFloat(valorStr.substring(0,4))
                                    if(i == (parcelas.length-1)){
                                        var valorUltimaImposto = (valorArrendondado+resto)
                                        var split = valorUltimaImposto.toString().split('.')
                                        var prVlrimpostosParcela = parseFloat(split[0]+'.'+split[1].substring(0,2))
                                    }else{
                                        var prVlrimpostosParcela = parseFloat(valorArrendondado)
                                    }
                                }else{
                                    var prVlrimpostosParcela = prVlrimpostos
                                }
                            }else{
                                prVlrimpostosParcela = 0
                            }   
                        var prValorParcela = prValor + prVlrimpostosParcela
                        var prValorLiquidoParcela = prValorParcela - prVlrimpostosParcela

                        var objParcela = {
                            prSeqNota : prSeqNota,
                            prConta :  prConta,
                            prDtavencto : prDtavencto,
                            prNroempresa : prNroempresa,
                            prValorParcela : prValorParcela,
                            prIdentcapitis : prIdentcapitis,
                            prVlrdescontos : prVlrdescontos,
                            prVlracrescimos : prVlracrescimos,
                            prNroparcela : prNroparcela,
                            prUsualteracao : prUsualteracao,
                            prValorLiquidoParcela : prValorLiquidoParcela,
                            prVlrimpostosParcela : prVlrimpostosParcela,
                            prObservacao : prObservacao,
                            prVlroutrasopdesc : prVlroutrasopdesc,
                            output : '?'
                        }
        
                        console.log(objParcela)
                    }
                }

            var hdindexRateio = $('#tbccusto_index').val()
            if(hdindexRateio != '' && hdindexRateio != null && hdindexRateio != undefined){
                var rateio = hdindexRateio.split(';')
            
                for(var i = 0; i < rateio.length; i++){
                    var pr_valor = $('#hdn_parcelas_valor___'+rateio[i]).val()
                    pr_valor != '' && pr_valor ? pr_valor = parseFloat(pr_valor) : pr_valor = 0;
                    var pr_centroCusto = $('#hdn_codcusto___'+rateio[i]).val()
                    var objRateio = {
                        prSeqNota : prSeqNota,
                        prNroempresa : prNroempresa,
                        prUsuarioLacto : prUsuarioLacto,
                        pr_valor : pr_valor,
                        prValorPrincipal : prValorPrincipal,
                        prNumeroNF : prNumeroNF,
                        prCodHistoricoprUsuarioLacto : prCodHistoricoprUsuarioLacto,
                        pr_centroCusto : pr_centroCusto,
                        pr_nroconta : 'null',
                        prObservacao : prObservacao,
                        output : '?'
                    }
                    console.log(objRateio)
                }
            }

        var tipoCusto = $('#txt_dadosnf_ccusto').val()
            if((prVlrimpostos != 0 && prVlrimpostos != '' && prVlrimpostos) || tipoCusto == 'Despesa'){
                var objImpostos = {
                    prSeqNota : prSeqNota,
                    prNroempresa : prNroempresa,
                    prUsuarioLacto : prUsuarioLacto,
                    prValorPrincipal : prValorPrincipal,
                    prObservacao : prObservacao,
                    output : '?'
                }
            }
            console.log(objImpostos)
}