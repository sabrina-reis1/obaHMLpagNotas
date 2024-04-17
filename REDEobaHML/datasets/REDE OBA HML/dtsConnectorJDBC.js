function defineStructure() {

}
function onSync(lastSyncDate) {

}
function createDataset(fields, constraints, sortFields) {
    var newDataset = DatasetBuilder.newDataset();
    newDataset.addColumn("BANCO");
    newDataset.addColumn("JDBC");
    newDataset.addColumn("HAMBIENTE");
    if(fields != null){
        var jdbc = {
            rm : 'rmtst',//hml RMPROD
            rmtst : 'rmtst',
            dw : 'dwdb novo',//hml dwdb
            c5 : 'c5db',
            c5S : 'con5Service',
            fluig : 'AppDS',
            fluig2 : 'FluigDSRO',
            c5Int : 'SP_C5DB',
            c503 : 'C5TST03'
        }
        newDataset.addRow([fields[0], jdbc[fields[0]], 'HML']) //TROCAR DE ACORDO COM O HAMBIENTE (HML OU PROD)
    }else{
        newDataset.addRow(['NULL', 'NULL', 'NULL'])
    }
    return newDataset
}function onMobileSync(user) {

}