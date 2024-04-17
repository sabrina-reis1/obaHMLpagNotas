package snippet;

public class Snippet {
	SELECT 
	 tp.COD_EMPRESA, 
	 tp.NUM_PROCES, 
	 tp.ASSIGN_START_DATE, 
	 tp.ASSIGN_END_DATE, 
	 tp.START_DATE,  
	 tp.END_DATE, 
	 tp.DSL_OBS_TAR,
	 tp.NUM_SEQ_ESCOLHID,
	 ep.NOM_ESTADO,
	 ep.DES_ESTADO
	
	FROM fluig_mfx.estado_proces ep
	JOIN tar_proces tp on tp.NUM_SEQ_ESCOLHID = ep.NUM_SEQ
	WHERE ep.COD_DEF_PROCES = 'Apontamento de Horas'
	AND tp.COD_EMPRESA = 1
	ORDER BY tp.START_DATE DESC
}

