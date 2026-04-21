function guardarEnSheets(respuestasOriginales, respuestasOptimizadas) {
  try {
    const config = env_();
    const ss = SpreadsheetApp.openById(config.ID_SHEET);
    let sheet = ss.getSheets()[0]; 
    const preguntas = obtenerPreguntas();

    // 1. FORZAR ENCABEZADOS DESDE CERO
    // Borramos lo viejo para que la estructura sea 100% nueva y correcta
    sheet.clear(); 
    
    const cabecera = ["Fecha / Hora"];
    // Bloque IA (17 columnas)
    preguntas.forEach(p => cabecera.push("IA: " + p.texto));
    // Bloque ORIGINAL (17 columnas)
    preguntas.forEach(p => cabecera.push("ORIGINAL: " + p.texto));
    
    // Escribimos la cabecera
    sheet.getRange(1, 1, 1, cabecera.length)
         .setValues([cabecera])
         .setBackground("#040025")
         .setFontColor("white")
         .setFontWeight("bold");

    // 2. CONSTRUIR LA FILA DE DATOS
    const filaFinal = [new Date()];

    // Convertimos los objetos a arrays planos para no depender de si el ID es string o número
    const valoresIA = preguntas.map(p => respuestasOptimizadas[p.id] || respuestasOptimizadas[String(p.id)] || "Sin respuesta");
    const valoresOrg = preguntas.map(p => respuestasOriginales[p.id] || respuestasOriginales[String(p.id)] || "");

    // Unimos todo en la fila: [Fecha, IA1...IA17, Org1...Org17]
    const filaParaInsertar = filaFinal.concat(valoresIA).concat(valoresOrg);

    // 3. INSERTAR Y DAR FORMATO
    sheet.appendRow(filaParaInsertar);
    
    // Congelar cabecera y ajustar texto
    sheet.setFrozenRows(1);
    sheet.getRange(2, 1, sheet.getLastRow(), cabecera.length).setWrap(true);
    
    console.log("Insertadas " + filaParaInsertar.length + " columnas correctamente.");

  } catch (err) {
    console.error("Error definitivo: " + err.message);
  }
}
