 function mValor(v){
     v=v.replace(/\D/g,"");
     v=v.replace(/(\d)(\d{8})$/,"$1.$2");
     v=v.replace(/(\d)(\d{5})$/,"$1.$2");   			
     v=v.replace(/(\d)(\d{2})$/,"$1,$2");  
     return v;
 }
 function mCpf(v){
     v=v.replace(/\D/g,"");                    
     v=v.replace(/(\d{3})(\d)/,"$1.$2");      
     v=v.replace(/(\d{3})(\d)/,"$1.$2");       
     v=v.replace(/(\d{3})(\d{1,2})$/,"$1-$2"); 
     v = v.substring(0,14);
     return v;
 }
 function mCnpj(v){
     v=v.replace(/\D/g,"");                   
     v=v.replace(/^(\d{2})(\d)/,"$1.$2");     
     v=v.replace(/^(\d{2})\.(\d{3})(\d)/,"$1.$2.$3"); 
     v=v.replace(/\.(\d{3})(\d)/,".$1/$2");           
     v=v.replace(/(\d{4})(\d)/,"$1-$2"); 
     v = v.substring(0,18);
     return v;
 }
 
 function replaceAll(string, token, newtoken) {
     while (string.indexOf(token) != -1) {
             string = string.replace(token, newtoken);
     }
     return string;
 }
 $(document).ready(function(){
    ///// Valida��es Valor class='mValor' ///// 
    $(document).on('keyup', '.mValor',function(){
        if($(this).val().indexOf('R$') == -1){
            var valor = mValor($(this).val());
            $(this).val(valor);
        }
     });
    ///// Valida��es CPF class='mCpf' ///// 
    $(document).on('keyup', '.mCpf',function(){
           var valor = mCpf($(this).val());
           $(this).val(valor);
    });
    $(document).on('blur', '.mCpf',function(){
           var valor = mCpf($(this).val());
           $(this).val(valor);
    });
    ///// Valida��es CNPJ class='mCnpj' ///// 
    $(document).on('keyup', '.mCnpj',function(){
           var valor = mCnpj($(this).val());
           $(this).val(valor);
    });
    $(document).on('blur', '.mCnpj',function(){
           var valor = mCnpj($(this).val());
           $(this).val(valor);
    }); 
 });