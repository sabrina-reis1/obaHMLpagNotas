function defineStructure() {

}
function onSync(lastSyncDate) {

}
function createDataset(fields, constraints, sortFields) {
    log.info("====> DTS GETNATUREZA <===")
    var newDataset = DatasetBuilder.newDataset();
    var jdbc = getJDBC('c5')
    var dataSource = "/jdbc/"+jdbc;
    var ic = new javax.naming.InitialContext();
    var ds = ic.lookup(dataSource);
    var created = false; 
    var whereEmpresa = " pp.parametro='T' AND (PE.NROEMPRESA = '99' OR PE.NROEMPRESA = '901') "
    var whereNat = '' 
    var whereCodCusto = ''
    var whereLimit = ''
    if(constraints){
        for(var i = 0; i < constraints.length; i++){
            if(constraints[i].fieldName == 'CODFILIAL'){
                whereEmpresa = "pp.parametro='T' AND PE.NROEMPRESA = '"+constraints[i].initialValue+"' " 
            }
            else if(constraints[i].fieldName == 'CODNAT'){
                whereNat = "And	CT_PLANILHALINHA.NROPLANILHA = '"+constraints[i].initialValue+"' " 
            }
            else if(constraints[i].fieldName == 'CODCUSTO'){
                whereCodCusto = "AND p.conta = '"+constraints[i].initialValue +"' "
            }
        }
    }else{
        whereLimit = 'AND rownum <= 10 '
    }

    
    var myQuery = "select * from consinco.aba_planoconta p inner join consinco.aba_planocontaparametro pp on p.seqplanoconta = pp.seqplanoconta inner join consinco.aba_planocontaempresa pe on pe.seqplanoconta = p.seqplanoconta WHERE "+
            whereEmpresa +         
            whereNat+
            whereCodCusto+
            whereLimit
     //+ "Order By NROPLANILHA, NROLINHA "

    log.info('queyyy '+myQuery)
    try {
        var conn = ds.getConnection();
        var stmt = conn.createStatement();
        var rs = stmt.executeQuery(myQuery);
        var columnCount = rs.getMetaData().getColumnCount();
        while (rs.next()) {
            if (!created) {
                for (var i = 1; i <= columnCount; i++) {
                    newDataset.addColumn(rs.getMetaData().getColumnName(i));
                }
                created = true;
            }
            var Arr = new Array();
            for (var i = 1; i <= columnCount; i++) {
                var obj = rs.getObject(rs.getMetaData().getColumnName(i));
                if (null != obj) {
                    Arr[i - 1] = rs.getObject(rs.getMetaData().getColumnName(i)).toString();
                } else {
                    Arr[i - 1] = "null";
                }
            }
            newDataset.addRow(Arr);
        }
    } catch (e) {
        log.error("ERRO==============> " + e.message);
    } finally {
        if (rs != null) {
            rs.close();
        }
        if (stmt != null) {
            stmt.close();
        }
        if (conn != null) {
            conn.close();
        }
    }
    return newDataset;
}function getJDBC(banco){
    var dts = DatasetFactory.getDataset('dtsConnectorJDBC', [banco], null, null)
    if(dts.values.length > 0){
        return dts.getValue(0,'JDBC')
    }else {
        throw('JDBC INCORRETO!')
    }
}function onMobileSync(user) {

}