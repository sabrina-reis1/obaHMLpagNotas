function verificaDoc(value){
    var tipodoc = $('#slct_fornec_tipo_pessoa').val()
    if(tipodoc == 'juridica'){
        var retorno = validaCNPJ(value)

        if(retorno == true){
            $.ajax({
                url :'',
                beforeSend: function(){
                    $('#divloading').show();
                },
                complete: function(){
                    sleep(1000);
                    consultaDoc(value);
                    $('#divloading').hide();
                },
                error:{
                    
                }
              });
        }else{
            FLUIGC.toast({
                title: 'AVISO',
                message: 'CNPJ INVALIDO!',
                type: 'Danger'
            });
            limpadados()
            window['ztxt_solicitacao_fornecedor'].disable(false)
            window['ztxt_solicitacao_nota'].clear()
            return 'error'
        }
    }else{
        var retorno = validaCPF(value)

        if(retorno == true){
            $.ajax({
                url :'',
                beforeSend: function(){
                    $('#divloading').show();
                },
                complete: function(){
                    sleep(1000);
                    consultaDoc(value);
                    $('#divloading').hide();
                },
                error:{
                    
                }
              });
        }else{
            FLUIGC.toast({
                title: 'AVISO',
                message: 'CPF INVALIDO!',
                type: 'Danger'
            });
            limpadados()
            window['ztxt_solicitacao_fornecedor'].disable(false)
            window['ztxt_solicitacao_nota'].clear()
            return 'error'
        }
    }
}
function sleep(milliseconds) {
    var start = new Date().getTime();
    for (var i = 0; i < 1e7; i++) {
      if ((new Date().getTime() - start) > milliseconds){
        break;
      }
    }
}
function limpadados(){
        $('#slct_fornec_tipo_pessoa').val('')
        $('#hdn_slct_fornec_tipo_pessoa').val('')
        $('#txt_fornec_fornc').val('')
        $('#txt_fornec_endereco').val('')
        $('#txt_fornec_numero').val('')
        $('#txt_fornec_bairro').val('')
        $('#txt_fornec_cidade').val('')
        $('#txt_fornec_uf').val('')
        $('#txt_fornec_doc').val('')
        $('#txt_fornec_seqpessoa').val('')
        var divpai = $('#txt_fornec_doc')[0].parentNode
        $(divpai).addClass('has-error').removeClass('has-success')
        if($('#hdn_sw_lancarM').val() == 'on'){
            $('#slct_fornec_tipo_pessoa').attr('disabled', false)
            $($('#slct_fornec_tipo_pessoa')[0].parentNode).addClass('has-error').removeClass('has-success')
        }else{
            $('#slct_fornec_tipo_pessoa').attr('disabled', true)
            $($('#slct_fornec_tipo_pessoa')[0].parentNode).addClass('has-success').removeClass('has-error')
        }  
}
function consultaDoc(value, mod){
    if(mod == undefined || mod == null){
        var doc =corrigeCNPJ(value)
    }

    if(doc != ''){   
        var c1 = DatasetFactory.createConstraint("DOC", doc, doc, ConstraintType.MUST);
        var fornecedor = DatasetFactory.getDataset("dts_getFornecedorPagNotas_MFX",null, [c1], null).values

        if(fornecedor.length > 0){
            $('#txt_fornec_fornc').val(fornecedor[0]['FANTASIA'])
            $('#txt_fornec_endereco').val(fornecedor[0]['ENDERECO'])
            $('#txt_fornec_numero').val(fornecedor[0]['NUMERO'])
            $('#txt_fornec_bairro').val(fornecedor[0]['BAIRRO'])
            $('#txt_fornec_cidade').val(fornecedor[0]['CIDADE'])
            $('#txt_fornec_uf').val(fornecedor[0]['UF'])
            $('#txt_fornec_seqpessoa').val(fornecedor[0]['SEQPESSOACONSINCO'])
            $('#seqpessoa').val(fornecedor[0]['SEQPESSOACONSINCO'])
            var divpai = $('#txt_fornec_doc')[0].parentNode
            $(divpai).addClass('has-success').removeClass('has-error')
            $('#slct_fornec_tipo_pessoa').attr('disabled', true)
        }else{
            FLUIGC.toast({
                title: 'AVISO',
                message: 'CNPJ/CPF NÂO ENCONTRADO, CONTATE A EQUIPE DE CADASTRO!',
                type: 'Danger',
                timeout: 5000
            });
            limpadados()
            window['ztxt_solicitacao_fornecedor'].disable(false)
            window['ztxt_solicitacao_nota'].clear()
            return 'error'
        }
    }else{
        limpadados()
    }
}
function corrigeCNPJ(cnpj){
    var valida = false
    var arr = ['.', '-', '/']
    for(var i = 0; i < arr.length; i++){
        if(cnpj.indexOf(arr[i]) != -1){
            valida = true
            i = arr.length
        }
    }
    if(valida == true){
        var cnpj = $.trim(cnpj); 
        var _cnpj = cnpj.split('-');
        var nrocnpj = _cnpj[0];
        var digcnpj = _cnpj[1];
        
        cnpj = nrocnpj.trim() + '-' + digcnpj.trim();
        
        cnpj = cnpj.split('.').join('');
        cnpj = cnpj.split('-').join('');
        cnpj = cnpj.split('/').join('');
    }	
	return cnpj;
}
function validaCNPJ(cnpj){
    cnpj = cnpj.replace(/[^\d]+/g,'');
    
    if(cnpj == '') return false;
        
    if (cnpj.length != 14)
        return false;
    
    // Elimina CNPJs invalidos conhecidos
    if (cnpj == "00000000000000" || 
        cnpj == "11111111111111" || 
        cnpj == "22222222222222" || 
        cnpj == "33333333333333" || 
        cnpj == "44444444444444" || 
        cnpj == "55555555555555" || 
        cnpj == "66666666666666" || 
        cnpj == "77777777777777" || 
        cnpj == "88888888888888" || 
        cnpj == "99999999999999")
        return false;
            
    // Valida DVs
    tamanho = cnpj.length - 2
    numeros = cnpj.substring(0,tamanho);
    digitos = cnpj.substring(tamanho);
    soma = 0;
    pos = tamanho - 7;
    for (i = tamanho; i >= 1; i--) {
        soma += numeros.charAt(tamanho - i) * pos--;
        if (pos < 2)
            pos = 9;
    }
    resultado = soma % 11 < 2 ? 0 : 11 - soma % 11;
    if (resultado != digitos.charAt(0))
        return false;
            
    tamanho = tamanho + 1;
    numeros = cnpj.substring(0,tamanho);
    soma = 0;
    pos = tamanho - 7;
    for (i = tamanho; i >= 1; i--) {
        soma += numeros.charAt(tamanho - i) * pos--;
        if (pos < 2)
            pos = 9;
    }
    resultado = soma % 11 < 2 ? 0 : 11 - soma % 11;
    if (resultado != digitos.charAt(1))
            return false;
            
    return true;
}
function validaCPF(cpf){
    cpf = cpf.replace(/[^\d]+/g,'');    
    if(cpf == '') return false; 
    // Elimina CPFs invalidos conhecidos    
    if (cpf.length != 11 || 
        cpf == "00000000000" || 
        cpf == "11111111111" || 
        cpf == "22222222222" || 
        cpf == "33333333333" || 
        cpf == "44444444444" || 
        cpf == "55555555555" || 
        cpf == "66666666666" || 
        cpf == "77777777777" || 
        cpf == "88888888888" || 
        cpf == "99999999999")
            return false;       
    // Valida 1o digito 
    add = 0;    
    for (i=0; i < 9; i ++)       
        add += parseInt(cpf.charAt(i)) * (10 - i);  
        rev = 11 - (add % 11);  
        if (rev == 10 || rev == 11)     
            rev = 0;    
        if (rev != parseInt(cpf.charAt(9)))     
            return false;       
    // Valida 2o digito 
    add = 0;    
    for (i = 0; i < 10; i ++)        
        add += parseInt(cpf.charAt(i)) * (11 - i);  
    rev = 11 - (add % 11);  
    if (rev == 10 || rev == 11) 
        rev = 0;    
    if (rev != parseInt(cpf.charAt(10))){
        
        return false; 
    }
    return true; 
}

$(document).on('change', "#slct_fornec_tipo_pessoa", function () {
    $('#txt_fornec_doc').val('').focus();
    $('#hdn_slct_fornec_tipo_pessoa').val($(this).val())
    if ($(this).val() == "juridica"){
        $('#txt_fornec_doc').removeClass("mCnpj");
        $('#txt_fornec_doc').removeClass("mCpf");
        $('#txt_fornec_doc').addClass("mCnpj");	
        $('#txt_fornec_doc').attr('readonly', false).val('')
    }else if($(this).val() == "fisica"){
        $('#txt_fornec_doc').removeClass("mCnpj");
        $('#txt_fornec_doc').removeClass("mCpf");
        $('#txt_fornec_doc').addClass("mCpf");	
        $('#txt_fornec_doc').attr('readonly', false).val('')
    }else{
        $('#txt_fornec_doc').removeClass("mCnpj");
        $('#txt_fornec_doc').removeClass("mCpf");
        $('#txt_fornec_doc').attr('readonly', true).val('')
    }
        $('#txt_fornec_fornc').val('')
        $('#txt_fornec_endereco').val('')
        $('#txt_fornec_numero').val('')
        $('#txt_fornec_bairro').val('')
        $('#txt_fornec_cidade').val('')
        $('#txt_fornec_uf').val('')
        $('#txt_fornec_seqpessoa').val('')
        $('#txt_fornec_doc').val('')
        var divpai = $('#txt_fornec_doc')[0].parentNode
        $(divpai).addClass('has-error').removeClass('has-success')
});    