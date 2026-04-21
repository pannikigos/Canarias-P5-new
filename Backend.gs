function guardarRespuestasEnSlides(respuestasOptimizadas) {
  try {
    const ssId = env_().ID_SHEET;
    const ss = SpreadsheetApp.openById(ssId);
    let sheet = ss.getSheets()[0]; 

    
    if (sheet.getRange("A1").getValue() !== "Fecha / Hora") {
      sheet.clear(); 
      configurarEncabezados(sheet);
    }

  
    const preguntas = obtenerPreguntas();
    const fila = [new Date()]; // Columna A
    
    preguntas.forEach(p => {
      
      fila.push(respuestasOptimizadas[p.id] || respuestasOptimizadas[p.id.toString()] || "");

    });

   
    sheet.appendRow(fila);
    sheet.autoResizeColumns(1, fila.length); 

    // Genera la presentación desde la plantilla con datos procesados por IA
    const slideUrl = generarPresentacionDeUltimaFila();
    
    return slideUrl;
  } catch (error) {
    console.error("Error completo: " + error.stack);
    throw new Error("Error en el proceso: " + error.message);
  }
}


function configurarEncabezados(sheet) {

  try{
      const preguntas = obtenerPreguntas();
      const encabezados = ["Fecha / Hora"];
      
      preguntas.forEach(p => {
        encabezados.push(p.texto); 
      });

      const range = sheet.getRange(1, 1, 1, encabezados.length);
      range.setValues([encabezados]);

      // Estilo visual (Tu azul corporativo)
      range.setBackground("#040025") 
          .setFontColor("white")
          .setFontWeight("bold")
          .setHorizontalAlignment("center")
          .setWrap(true);
          
      sheet.setFrozenRows(1); 
  } catch(error) {
    console.log(error)
  }


}


function actualizarPresentacion(datos) {

  try{
    const presentation = SlidesApp.getActivePresentation();
    for (let key in datos) {
      // Esto reemplaza {{1}} por el valor de la pregunta 1, etc.
      presentation.replaceAllText(`{{${key}}}`, datos[key]);
    }
  } catch(error) {
    console.log(error)
  }



}
