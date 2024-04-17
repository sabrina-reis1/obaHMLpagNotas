function defineStructure() {

}
function onSync(lastSyncDate) {
    

}
function createDataset(fields, constraints, sortFields) {
    log.info("====> DTS CONTA DEBITO CC <===")
    var newDataset = DatasetBuilder.newDataset();
    var jdbc = getJDBC('c503')
    var dataSource = "/jdbc/"+jdbc;
    var ic = new javax.naming.InitialContext();
    var ds = ic.lookup(dataSource);
    var created = false; 
    var qWhere = " WHERE 1 = 1 "
  //WHERE HE.NROEMPRESA = '99' AND H.CODREDUZIDO = '5035' AND HISTPA.CODIGOREF = '310000'
    if(constraints){
        for(var i = 0; i < constraints.length; i++){
            if(constraints[i].fieldName == 'CONTA_DEBITO'){
                qWhere += " AND HISTPA.CODIGOREF = '"+constraints[i].initialValue+"' " 
            }
            else if(constraints[i].fieldName == 'EMPRESA'){
                qWhere += " AND HE.NROEMPRESA = '"+constraints[i].initialValue+"' " 
            }
            else if(constraints[i].fieldName == 'NATUREZA'){
                qWhere += " AND H.CODREDUZIDO = '"+constraints[i].initialValue+"' " 
            }
        }
    }

    var myQuery = "SELECT H.CODREDUZIDO AS COD_MODELO, H.DESCRICAO AS DESC_MODELO, HC.TIPO AS CONTA_DEBITO_CREDITO, PL.CONTA, PL.DESCRICAO,H.SITUACAO,HISTPA.SEQHISTORICOCONTAPARAM,HC.HISTORICOCOMPLETO,HISTPA.VALOR,HISTPA.CODIGOREF AS CENTRORESULTADO FROM CONSINCO.ABA_HISTORICO H INNER JOIN CONSINCO.ABA_HISTORICOCONTA HC ON H.SEQHISTORICO = HC.SEQHISTORICO INNER JOIN CONSINCO.ABA_PLANOCONTA PL ON HC.SEQPLANOCONTA = PL.SEQPLANOCONTA INNER JOIN CONSINCO.ABA_HISTORICOCONTAPARAM HISTPA ON HISTPA.SEQHISTORICOCONTA=HC.SEQHISTORICOCONTA INNER JOIN CONSINCO.ABA_HISTORICOEMPRESA HE ON HE.SEQHISTORICO = H.SEQHISTORICO "+qWhere
    log.info('QUERY dts_validaCCC = '+myQuery)

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
        log.error("ERRO==============> dts_validaCCC " + e.message);
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
    log.info('OKpASSOU = '+myQuery)
    return newDataset;
}

function getJDBC(banco){
    var dts = DatasetFactory.getDataset('dtsConnectorJDBC', [banco], null, null)
    if(dts.values.length > 0){
        return dts.getValue(0,'JDBC')
    }else {
        throw('JDBC INCORRETO!')
    }
}

function onMobileSync(user) {

}