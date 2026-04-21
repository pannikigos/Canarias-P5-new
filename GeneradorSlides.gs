// -------------------------------------------------------------
// Test de inyección de datos en diapositiva, probar si no reconoce sl sheets
// -------------------------------------------------------------

function testInyeccionSlide() {
  
  const ID_PLANTILLA = PropertiesService.getScriptProperties().getProperty('ID_PLANTILLA_SLIDES');
  
  if (!ID_PLANTILLA) {
     console.error("Error Arquitectónico: Falta configurar ID_PLANTILLA_SLIDES en Propiedades del Script");
     return;
  }
  
  Logger.log("Iniciando prueba de concepto (PoC) aislada...");
  
  // 2. Agarramos la plantilla y hacemos la copia intocable
  const plantilla = DriveApp.getFileById(ID_PLANTILLA);
  const carpeta = plantilla.getParents().hasNext()
    ? plantilla.getParents().next()
    : DriveApp.getRootFolder();
  
  const fechaHoy = Utilities.formatDate(new Date(), Session.getScriptTimeZone(), "dd/MM/yyyy HH:mm");
  const nombreArchivo = "TEST Arquitectura - " + fechaHoy;
  
  Logger.log("1. Copiando archivo...");
  const nuevaPresen = plantilla.makeCopy(nombreArchivo, carpeta);
  
  // 3. Entramos al archivo y probamos la inyección de 1 solo dato
  Logger.log("2. Abriendo copia e inyectando dato atómico...");
  const slideEditado = SlidesApp.openById(nuevaPresen.getId());
  
  slideEditado.replaceAllText('{{FECHA}}', fechaHoy);
  
  // 4. Cerramos la puerta
  slideEditado.saveAndClose();
  Logger.log("¡TEST SUPERADO! Diapositiva aislada generada: " + nuevaPresen.getUrl());
}

// -------------------------------------------------------------
// Función prinpical (Mantenida acá abajo para cuando la apruebes)
// -------------------------------------------------------------
function generarPresentacionDeUltimaFila() {
  const ID_PLANTILLA = PropertiesService.getScriptProperties().getProperty('ID_PLANTILLA_SLIDES');
  
  if (!ID_PLANTILLA) return console.error("Falta ID_PLANTILLA_SLIDES");
  
  const idSheet = env_().ID_SHEET;
  const excel = SpreadsheetApp.openById(idSheet);
  const hoja = excel.getSheets()[0]; // Selecciona la primera pestaña de la hoja de cálculo
  const ultimaFila = hoja.getLastRow();
  
  if (ultimaFila < 2) return console.log("No hay datos");
  
  const datosUltimaFila = hoja.getRange(ultimaFila, 1, 1, hoja.getLastColumn()).getValues()[0];
  
  // Parseo específico y quirúrgico para el FODA
  let fodaOp = "N/A";
  let fodaAm = "N/A";
  try {
    if (datosUltimaFila[4]) {
      const parsedFoda = JSON.parse(String(datosUltimaFila[4]).trim());
      // Si fue un objeto directo
      if (parsedFoda.Oportunidad) fodaOp = parsedFoda.Oportunidad;
      if (parsedFoda.Amenaza) fodaAm = parsedFoda.Amenaza;
      
      // Si por alguna razón Gemini devolvió un array [ {Oportunidad:...}, {Amenaza:...} ]
      if (Array.isArray(parsedFoda)) {
         fodaOp = parsedFoda.map(i => i.Oportunidad).filter(Boolean).map(t => '• ' + t).join('\n') || "N/A";
         fodaAm = parsedFoda.map(i => i.Amenaza).filter(Boolean).map(t => '• ' + t).join('\n') || "N/A";
      }
    }
  } catch(e) { /* Si no es JSON lo dejamos ir */ }
  
  // Procesamiento Just-in-Time del Mapa de Experiencia (Llamada a IA)
  const mapaObj = normalizarMapaExperiencia(datosUltimaFila[9] || "") || {};
  
  // Función auxiliar de arquitecto: las IA a veces devuelven "Descubrimiento" o "TAREAS" en mayúscula, 
  // esto rompe el código JavaScript porque busca minúsculas estricto. Forzamos todo el árbol a minúsculas:
  const normalizeKeys = (obj) => {
    if (typeof obj !== 'object' || obj === null) return obj;
    if (Array.isArray(obj)) return obj.map(normalizeKeys);
    return Object.keys(obj).reduce((acc, key) => {
      acc[key.toLowerCase().trim()] = normalizeKeys(obj[key]);
      return acc;
    }, {});
  };
  
  const mapaMinusculas = normalizeKeys(mapaObj);

  const etapas = ['descubrimiento', 'consideracion', 'compra', 'servicio', 'postventa'];
  const sufijos = ['DESC', 'CONS', 'COMP', 'SERV', 'POST'];

  const mapaPlano = {};
  for (let i = 0; i < 5; i++) {
    const et = etapas[i];
    const suf = sufijos[i];
    const dataEtapa = mapaMinusculas[et] || {};
    mapaPlano[`{{T_${suf}}}`] = dataEtapa.tareas || "N/A";
    mapaPlano[`{{D_${suf}}}`] = dataEtapa.dudas || "N/A";
    mapaPlano[`{{C_${suf}}}`] = dataEtapa.contacto || "N/A";
    mapaPlano[`{{E_${suf}}}`] = dataEtapa.emociones || "N/A";
    mapaPlano[`{{I_${suf}}}`] = dataEtapa.influencias || "N/A";
    mapaPlano[`{{W_${suf}}}`] = dataEtapa.debilidades || "N/A";
  }
  
  // =====================================================================
  // MEGA-CALL 1: Empatía + Canvas + LTD (3 diagramas en 1 sola llamada)
  // =====================================================================
  console.log("MEGA-CALL 1: Procesando Empatía + Canvas + LTD + Tests...");
  const megaDiagramas = normalizarDiagramas(
    datosUltimaFila[8] || "",   // Empatía
    datosUltimaFila[10] || "",   // Canvas
    datosUltimaFila[11] || "",  // LTD
    datosUltimaFila[6] || "",   // Test Diagnóstico (Principales Áreas de Actuación)
    datosUltimaFila[3] || "",   // Test Madurez Digital (Propia + Competencia)
    datosUltimaFila[7] || ""    // Buyer Persona
  ) || {};

  // Empatía
  const empatiaObj = normalizeKeys(megaDiagramas.empatia || {});
  const piensaSiente = empatiaObj.que_piensa_siente || {};
  const empatiaPlano = {
    '{{EMP_1}}': empatiaObj.con_quien_empatizamos || "N/A",
    '{{EMP_2}}': empatiaObj.que_necesita_hacer || "N/A",
    '{{EMP_3}}': empatiaObj.que_ve || "N/A",
    '{{EMP_4}}': empatiaObj.que_dice || "N/A",
    '{{EMP_5}}': empatiaObj.que_hace || "N/A",
    '{{EMP_6}}': empatiaObj.que_escucha || "N/A",
    '{{EMP_7_ESF}}': piensaSiente.esfuerzos || "N/A",
    '{{EMP_7_RES}}': piensaSiente.resultados || "N/A",
    '{{EMP_7_OTR}}': piensaSiente.otros || "N/A"
  };

  // Canvas (BMC)
  const canvasObj = normalizeKeys(megaDiagramas.canvas || {});
  const canvasPlano = {
    '{{BMC_1}}': canvasObj.segmentos_mercado || "N/A",
    '{{BMC_2}}': canvasObj.propuesta_valor || "N/A",
    '{{BMC_3}}': canvasObj.canales || "N/A",
    '{{BMC_4}}': canvasObj.relaciones_clientes || "N/A",
    '{{BMC_5}}': canvasObj.flujos_ingresos || "N/A",
    '{{BMC_6}}': canvasObj.actividades_clave || "N/A",
    '{{BMC_7}}': canvasObj.recursos_clave || "N/A",
    '{{BMC_8}}': canvasObj.socios_clave || "N/A",
    '{{BMC_9}}': canvasObj.estructura_costes || "N/A"
  };

  // LTD
  const ltdObj = normalizeKeys(megaDiagramas.ltd || {});
  const ltdPlano = {
    '{{LTD_1}}': ltdObj.cliente_centro || "N/A",
    '{{LTD_2}}': ltdObj.tecnologias || "N/A",
    '{{LTD_3}}': ltdObj.nube_datos || "N/A",
    '{{LTD_4}}': ltdObj.negocio_digital || "N/A",
    '{{LTD_5}}': ltdObj.ingenieria_procesos || "N/A",
    '{{LTD_6}}': ltdObj.cultura_liderazgo || "N/A",
    '{{LTD_7}}': ltdObj.marketing_digital || "N/A"
  };

  // Buyer Persona (10 bloques)
  const bpObj = normalizeKeys(megaDiagramas.buyer_persona || {});
  const buyerPlano = {
    '{{BP_NOMBRE}}': bpObj.nombre || "N/A",
    '{{BP_PERFIL_PERSONAL}}': bpObj.perfil_personal || "N/A",
    '{{BP_PERFIL_PROFESIONAL}}': bpObj.perfil_profesional || "N/A",
    '{{BP_HABITOS}}': bpObj.habitos || "N/A",
    '{{BP_OBJETIVOS_RETOS}}': bpObj.objetivos_retos || "N/A",
    '{{BP_HOBBIES}}': bpObj.hobbies_intereses || "N/A",
    '{{BP_PRODUCTO}}': bpObj.producto_servicio || "N/A",
    '{{BP_FRUSTRACIONES}}': bpObj.frustraciones || "N/A",
    '{{BP_DONDE}}': bpObj.donde_encontrarle || "N/A",
    '{{BP_VENTAJAS}}': bpObj.ventajas || "N/A",
    '{{BP_AYUDA}}': bpObj.como_ayudar || "N/A"
  };

  // =====================================================================
  // MEGA-CALL 2: Herramientas + Objetivos + Plan Acción + Inversión
  // =====================================================================
  console.log("MEGA-CALL 2: Procesando Herramientas + Objetivos + Plan + Inversión + Diagnóstico...");
  const megaTablas = normalizarTablas(
    datosUltimaFila[12] || "",   // Herramientas
    datosUltimaFila[13] || "",   // Objetivos
    datosUltimaFila[14] || "",   // Plan Acción
    datosUltimaFila[16] || "",   // Inversión
    datosUltimaFila[5] || "",     // Diagnóstico Externo (Otras Empresas)
    datosUltimaFila[18] || "",    // Formación Necesaria
    fodaOp,                        // FODA Oportunidades
    fodaAm,                        // FODA Amenazas
    datosUltimaFila[17] || "",    // Gestión del Cambio (Equipo Líder)
    datosUltimaFila[2] || ""      // Diagnóstico Interno (Fortalezas/Debilidades)
  ) || {};

  // Herramientas
  const herramientasPuras = megaTablas.herramientas || [];
  const herramientasPlano = {};
  for (let i = 1; i <= 4; i++) {
    const item = herramientasPuras[i-1] || {};
    herramientasPlano[`{{HT_${i}_1}}`] = item.ambito || "";
    herramientasPlano[`{{HT_${i}_2}}`] = item.herramienta || "";
    herramientasPlano[`{{HT_${i}_3}}`] = item.nivel || "";
    herramientasPlano[`{{HT_${i}_4}}`] = item.presupuesto || "";
    herramientasPlano[`{{HT_${i}_5}}`] = item.prioridad || "";
  }

  // Objetivos
  const objetivosPuros = megaTablas.objetivos || [];
  const objetivosPlano = {};
  for (let i = 1; i <= 5; i++) {
    const item = objetivosPuros[i-1] || {};
    objetivosPlano[`{{OBJ_${i}_1}}`] = item.fecha || "";
    objetivosPlano[`{{OBJ_${i}_2}}`] = item.objetivo || "";
    objetivosPlano[`{{OBJ_${i}_3}}`] = item.kpi || "";
  }

  // Plan de Acción
  const planPuro = megaTablas.plan_accion || [];
  const planPlano = {};
  for (let i = 1; i <= 6; i++) {
    const item = planPuro[i-1] || {};
    planPlano[`{{PA_${i}_1}}`] = item.ambito || "";
    planPlano[`{{PA_${i}_2}}`] = item.iniciativa || "";
    planPlano[`{{PA_${i}_3}}`] = item.tareas || "";
    planPlano[`{{PA_${i}_4}}`] = item.plazo || "";
    planPlano[`{{PA_${i}_5}}`] = item.responsable || "";
    planPlano[`{{PA_${i}_6}}`] = item.presupuesto || "";
  }

  // Inversión
  const invObj = normalizeKeys(megaTablas.inversion || {});
  const inversionPlano = {
    '{{INV_CORTO}}': invObj.corto_plazo_descripcion || "N/A",
    '{{INV_MEDIO}}': invObj.medio_plazo_descripcion || "N/A",
    '{{INV_LARGO}}': invObj.largo_plazo_descripcion || "N/A",
    '{{INV_CORTO_MONTO}}': invObj.corto_plazo_monto || "",
    '{{INV_MEDIO_MONTO}}': invObj.medio_plazo_monto || "",
    '{{INV_LARGO_MONTO}}': invObj.largo_plazo_monto || ""
  };

  // Diagnóstico Externo (4 columnas x 7 filas)
  const dxPuro = megaTablas.diagnostico_externo || [];
  const dxPlano = {};
  for (let i = 1; i <= 7; i++) {
    const item = dxPuro[i-1] || {};
    dxPlano[`{{DX_${i}_1}}`] = item.empresa_innovadora || "";
    dxPlano[`{{DX_${i}_2}}`] = item.modelo_negocio || "";
    dxPlano[`{{DX_${i}_3}}`] = item.estrategia_digital || "";
    dxPlano[`{{DX_${i}_4}}`] = item.producto_servicio || "";
  }

  // Formación Necesaria (3 columnas x 5 filas)
  const fmPuro = megaTablas.formacion || [];
  const fmPlano = {};
  for (let i = 1; i <= 5; i++) {
    const item = fmPuro[i-1] || {};
    fmPlano[`{{FM_${i}_1}}`] = item.curso || "";
    fmPlano[`{{FM_${i}_2}}`] = item.departamento || "";
    fmPlano[`{{FM_${i}_3}}`] = item.duracion || "";
  }

  // FODA (2 columnas x 8 filas)
  const fodaIA = megaTablas.foda || {};
  const opArr = fodaIA.oportunidades || [];
  const amArr = fodaIA.amenazas || [];
  const fodaPlano = {};
  for (let i = 1; i <= 8; i++) {
    fodaPlano[`{{FODA_OP_${i}}}`] = opArr[i-1] || "";
    fodaPlano[`{{FODA_AM_${i}}}`] = amArr[i-1] || "";
  }

  // Equipo Líder del Cambio (4 miembros x 2 campos)
  const gcPuro = megaTablas.equipo_lider || [];
  const gcPlano = {};
  for (let i = 1; i <= 4; i++) {
    const item = gcPuro[i-1] || {};
    gcPlano[`{{GC_${i}_N}}`] = item.nombre || "Por definir";
    gcPlano[`{{GC_${i}_D}}`] = item.descripcion || "N/A";
  }

  // Fortalezas y Debilidades (2 columnas x 8 filas)
  const fdIA = megaTablas.fortalezas_debilidades || {};
  const fortArr = fdIA.fortalezas || [];
  const debArr = fdIA.debilidades || [];
  const fdPlano = {};
  for (let i = 1; i <= 8; i++) {
    fdPlano[`{{FD_F_${i}}}`] = fortArr[i-1] || "";
    fdPlano[`{{FD_D_${i}}}`] = debArr[i-1] || "";
  }
  
  const datosMapa = {
    '{{FECHA}}': datosUltimaFila[0],
    '{{ALUMNO}}': datosUltimaFila[1] || "Alumno",
    ...fdPlano, // Fortalezas y Debilidades (2x6)
    '{{MADUREZ_PROPIA}}': (megaDiagramas.madurez || {}).madurez_propia || datosUltimaFila[3],
    '{{MADUREZ_COMPETENCIA}}': (megaDiagramas.madurez || {}).madurez_competencia || datosUltimaFila[3],
    ...fodaPlano, // FODA Oportunidades y Amenazas (2x8)
    ...dxPlano, // Diagnóstico Externo (Otras Empresas - 4x7)
    '{{TEST_2}}': megaDiagramas.test_diagnostico || datosUltimaFila[6],
    ...buyerPlano, // Buyer Persona (10 bloques)
    ...empatiaPlano, // Inyectamos placeholders dinámicos del Mapa de Empatía
    ...mapaPlano, // Inyectamos placeholders dinámicos del Mapa de Experiencia
    ...canvasPlano, // Lienzo de Modelo de Negocio (BMC)
    ...ltdPlano, // Inyectamos placeholders dinámicos del Lienzo de Transformación Digital (LTD)
    ...herramientasPlano, // Inyectamos placeholders de la tabla de Herramientas

    // Procesamiento de Objetivos y KPI (Extracto IA 100%)
    ...objetivosPlano, // Inyectamos placeholders de Objetivos y KPI
    ...planPlano, // Inyectamos placeholders del Plan de Acción

    // Matriz de Priorización (2x2: Impacto vs Esfuerzo/Coste)
    // El dato viene como "ALTO-BAJO", "ALTO BAJO", "alto-bajo", etc.
    ...(() => {
      const raw = (datosUltimaFila[15] || "").toUpperCase().trim().replace(/["']/g, "");
      console.log("DEBUG MATRIZ RAW: [" + raw + "]");
      
      // Extraemos las 2 partes: IMPACTO y ESFUERZO (separador: guión, espacio, coma, slash)
      const partes = raw.split(/[\s\-\/,]+/);
      const impacto = partes[0] || "";
      const esfuerzo = partes[1] || "";
      
      const esAA = impacto === "ALTO" && esfuerzo === "ALTO";
      const esAB = impacto === "ALTO" && esfuerzo === "BAJO";
      const esBA = impacto === "BAJO" && esfuerzo === "ALTO";
      const esBB = impacto === "BAJO" && esfuerzo === "BAJO";
      const hayMatch = esAA || esAB || esBA || esBB;
      
      if (!hayMatch) {
        console.warn("MATRIZ SIN MATCH - Valor crudo: [" + raw + "] Partes: [" + impacto + "] [" + esfuerzo + "]");
      }
      
      return {
        '{{MAT_AA}}': esAA ? "★ SELECCIONADO" : " ",
        '{{MAT_AB}}': esAB ? "★ SELECCIONADO" : " ",
        '{{MAT_BA}}': esBA ? "★ SELECCIONADO" : " ",
        '{{MAT_BB}}': esBB ? "★ SELECCIONADO" : " "
      };
    })(),

    // Procesamiento de Inversión Necesaria (Extracto IA 100%)
    ...inversionPlano, // 3 plazos + 3 montos
    ...gcPlano, // Equipo Líder del Cambio (4 miembros)
    ...fmPlano, // Formación Necesaria (3x5)
  };

  const plantillaFile = DriveApp.getFileById(ID_PLANTILLA);
  const carpeta = plantillaFile.getParents().hasNext()
    ? plantillaFile.getParents().next()
    : DriveApp.getRootFolder();
  
  const nombreAlumno = String(datosUltimaFila[1] || "Alumno").trim();
  const nombreAlumnoSeguro = nombreAlumno.replace(/[^a-zA-Z0-9 ñÑáéíóúÁÉÍÓÚ_-]/g, "").substring(0, 50) || "Alumno";
  const fechaGeneracion = datosUltimaFila[0] instanceof Date ? Utilities.formatDate(datosUltimaFila[0], Session.getScriptTimeZone(), "dd/MM/yyyy") : "Reciente";
  const nombreArchivo = `Plan Transformación Digital - ${nombreAlumnoSeguro} - ${fechaGeneracion}`;
  const nuevaPresen = plantillaFile.makeCopy(nombreArchivo, carpeta);
  const slideEditado = SlidesApp.openById(nuevaPresen.getId());
  
  for (const [placeholder, valor] of Object.entries(datosMapa)) {
      slideEditado.replaceAllText(placeholder, formatearValorParaSlide(valor));
  }
  
  slideEditado.saveAndClose();
  const urlFinal = nuevaPresen.getUrl();
  console.log("Diapositiva final generada: " + urlFinal);
  return urlFinal;
}

// -------------------------------------------------------------
// Función Auxiliar: Parsea JSON y anida viñetas prolijamente
// -------------------------------------------------------------
function formatearValorParaSlide(valorBruto) {
  if (valorBruto === null || valorBruto === undefined || valorBruto === '') return "N/A";
  
  if (valorBruto instanceof Date) {
    return Utilities.formatDate(valorBruto, Session.getScriptTimeZone(), "dd/MM/yyyy HH:mm");
  }
  
  let textoString = String(valorBruto).trim();
  
  // Detectar heurísticamente si es texto en formato JSON
  if ((textoString.startsWith('{') && textoString.endsWith('}')) || 
      (textoString.startsWith('[') && textoString.endsWith(']'))) {
    try {
      const objeto = JSON.parse(textoString);
      return procesarJsonRecursivo(objeto);
    } catch (e) {
       return textoString; // Si el parseo falla, devuelve el string original crudo
    }
  }
  return textoString;
}

function procesarJsonRecursivo(obj) {
  if (Array.isArray(obj)) {
    return obj.map(item => {
      if (typeof item === 'object' && item !== null) {
        let bloque = '';
        for (const [key, value] of Object.entries(item)) {
           // Si el value anidado de vuelta es objeto, no quiero que explote, uso String
           bloque += `▪ ${key}:\n  ↳ ${typeof value === 'object' ? JSON.stringify(value) : value}\n`;
        }
        return bloque;
      }
      return `• ${item}`;
    }).join('\n');
  } 
  
  if (typeof obj === 'object' && obj !== null) {
     let bloque = '';
     for (const [key, value] of Object.entries(obj)) {
       bloque += `• ${key}:\n  ↳ ${typeof value === 'object' ? JSON.stringify(value) : value}\n\n`;
     }
     return bloque.trim();
  }
  
  return String(obj);
}

function extraerJsonDesdeTextoIA_(textoIA) {
  let texto = String(textoIA || '').trim();
  texto = texto.replace(/^```json\s*/, '').replace(/```$/, '').trim();
  const inicio = texto.indexOf('{');
  const fin = texto.lastIndexOf('}') + 1;
  if (inicio === -1 || fin === -1) {
    throw new Error('No se encontró JSON en la respuesta del modelo.');
  }
  return JSON.parse(texto.substring(inicio, fin));
}

function llamarGeminiTextoIA_(prompt, esperaMs) {
  const cfg = obtenerConfigIA_();
  if (!cfg.geminiKey) {
    throw new Error('Falta GEMINI_API_KEY/API_KEY para ejecutar Gemini.');
  }

  if (esperaMs && esperaMs > 0) {
    Utilities.sleep(esperaMs);
  }

  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${cfg.geminiKey}`;
  const payload = { contents: [{ parts: [{ text: prompt }] }] };

  const response = UrlFetchApp.fetch(url, {
    method: 'post',
    contentType: 'application/json',
    payload: JSON.stringify(payload),
    muteHttpExceptions: true
  });

  const codigo = response.getResponseCode();
  const resText = response.getContentText();
  const resJson = JSON.parse(resText);

  if (esRespuestaAltaDemandaGemini_(codigo, resJson)) {
    const err = new Error('Gemini no disponible por alta demanda.');
    err.esAltaDemanda = true;
    throw err;
  }

  if (!resJson.candidates || !resJson.candidates[0].content) {
    throw new Error('Gemini devolvió respuesta inválida: ' + resText);
  }

  return resJson.candidates[0].content.parts[0].text.trim();
}

function llamarGroqTextoIA_(prompt) {
  const cfg = obtenerConfigIA_();
  if (!cfg.groqKey) {
    throw new Error('Falta GROQ_API_KEY para ejecutar fallback.');
  }

  const payload = {
    model: 'llama-3.3-70b-versatile',
    messages: [{ role: 'user', content: prompt }],
    temperature: 0.2
  };

  const response = UrlFetchApp.fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'post',
    contentType: 'application/json',
    headers: {
      Authorization: `Bearer ${cfg.groqKey}`
    },
    payload: JSON.stringify(payload),
    muteHttpExceptions: true
  });

  const resText = response.getContentText();
  const resJson = JSON.parse(resText);

  if (!resJson.choices || !resJson.choices[0].message) {
    throw new Error('Groq devolvió respuesta inválida: ' + resText);
  }

  return resJson.choices[0].message.content.trim();
}

function solicitarJSONConFallbackIA_(prompt, etiquetaLog, esperaMsGemini) {
  const proveedor = obtenerProveedorIAActivo_();
  console.log(etiquetaLog + ' | Proveedor activo: ' + proveedor);

  let textoIA = '';
  if (proveedor === PROVEEDOR_IA_GROQ) {
    textoIA = llamarGroqTextoIA_(prompt);
    return extraerJsonDesdeTextoIA_(textoIA);
  }

  try {
    textoIA = llamarGeminiTextoIA_(prompt, esperaMsGemini);
    return extraerJsonDesdeTextoIA_(textoIA);
  } catch (eGemini) {
    if (eGemini.esAltaDemanda && forzarProveedorGroq_('Alta demanda detectada durante ' + etiquetaLog)) {
      textoIA = llamarGroqTextoIA_(prompt);
      return extraerJsonDesdeTextoIA_(textoIA);
    }
    throw eGemini;
  }
}

// -------------------------------------------------------------
// Normalizador de IA para el Mapa de Experiencia del Cliente
// (Movido acá para no chocar con los cambios de IA.js)
// -------------------------------------------------------------
function normalizarMapaExperiencia(textoUsuario) {
  const prompt = `Actúa como un Diseñador de Experiencia de Usuario (UX) experto.
  Lee los siguientes datos sin procesar sobre un Customer Journey: "${textoUsuario}".
  
  Tu objetivo es extraer, deducir o resumir la información para encajarla exactamente en una matriz de 5 Etapas (descubrimiento, consideracion, compra, servicio, postventa) por 6 Capas (tareas, dudas, contacto, emociones, influencias, debilidades).
  Sé muy cortito y al pie, formato bullet o resumen directo para que entre en una tabla de PPT. Si un dato no existe, INFIERELO.
  
  Devuelve ÚNICAMENTE un objeto JSON válido con la siguiente estructura exacta, sin Markdown ni bloques de código:
  {
    "descubrimiento": { "tareas": "", "dudas": "", "contacto": "", "emociones": "", "influencias": "", "debilidades": "" },
    "consideracion": { "tareas": "", "dudas": "", "contacto": "", "emociones": "", "influencias": "", "debilidades": "" },
    "compra": { "tareas": "", "dudas": "", "contacto": "", "emociones": "", "influencias": "", "debilidades": "" },
    "servicio": { "tareas": "", "dudas": "", "contacto": "", "emociones": "", "influencias": "", "debilidades": "" },
    "postventa": { "tareas": "", "dudas": "", "contacto": "", "emociones": "", "influencias": "", "debilidades": "" }
  }`;
  try {
    return solicitarJSONConFallbackIA_(prompt, 'Mapa de Experiencia', 4000);
  } catch (e) {
    console.error('Error en normalizarMapaExperiencia: ' + e.message);
    return null;
  }
}

// =================================================================
// MEGA-FUNCIÓN 1: Diagramas (Empatía + Canvas + LTD en 1 llamada)
// =================================================================
function normalizarDiagramas(textoEmpatia, textoCanvas, textoLTD, textoTest, textoMadurez, textoBuyer) {
  const prompt = `Eres un Consultor Senior de Estrategia Digital. Vas a procesar 3 bloques de información del MISMO cliente y devolver un JSON unificado con 3 secciones.

=== BLOQUE 1: MAPA DE EMPATÍA ===
Datos del cliente: "${textoEmpatia}"
Extrae 7 bloques del Mapa de Empatía. Redacta párrafos profesionales (130-180 caracteres cada uno). Si falta info, INFIÉRELA.

=== BLOQUE 2: BUSINESS MODEL CANVAS ===
Datos del cliente: "${textoCanvas}"
Extrae los 9 bloques del Canvas de Modelo de Negocio. Redacta párrafos profesionales (150-300 caracteres cada uno). Si falta info, INFIÉRELA.

=== BLOQUE 3: LIENZO TRANSFORMACIÓN DIGITAL ===
Datos del cliente: "${textoLTD}"
Extrae los 7 pilares del Lienzo de Transformación Digital. Redacta párrafos profesionales (250-300 caracteres cada uno). Si falta info, INFIÉRELA.

=== BLOQUE 4: TEST DIAGNÓSTICO DIGITAL - PRINCIPALES ÁREAS DE ACTUACIÓN ===
Datos del cliente: "${textoTest}"
Reescribe este texto como un análisis ejecutivo profesional de las principales áreas de actuación. Elimina el ruido coloquial, dale tono de informe C-Level. Redacta un texto cohesivo de entre 800 y 1100 caracteres que cuente una historia estratégica clara.

=== BLOQUE 5: TEST DE MADUREZ DIGITAL ===
Datos del cliente: "${textoMadurez}"
Separa este texto en DOS análisis profesionales:
1. MADUREZ PROPIA: Análisis del nivel de madurez digital interno de la empresa (800-1000 caracteres, tono ejecutivo)
2. MADUREZ COMPETENCIA: Análisis comparativo con la competencia y el mercado (800-1000 caracteres, tono ejecutivo)
Si solo hay un párrafo, inférelo y repártelo entre ambos bloques.

=== BLOQUE 6: BUYER PERSONA ===
Datos del cliente: "${textoBuyer}"
Extrae y organiza la información en los 10 bloques de un perfil de Buyer Persona profesional.
REGLA CRÍTICA: En TODOS los campos (excepto "nombre") escribe en TERCERA PERSONA SIN MENCIONAR EL NOMBRE. NO escribas "José es...", "Juan hace...". Escribe "Es un profesional que...", "Busca soluciones que...", "Valora la eficiencia...".
- nombre: Solo el nombre (si dice "SOY X", extrae X. Si no, infiere uno)
- perfil_personal: Localización, edad, género, personalidad, estilo de vida. SIN NOMBRE. (150-250 chars)
- perfil_profesional: Empresa, sector, cargo, responsabilidad, habilidades. SIN NOMBRE. (150-250 chars)
- habitos: Rutina diaria, medios que consume, redes sociales, formación. SIN NOMBRE. (150-250 chars)
- objetivos_retos: Metas a medio/largo plazo, obstáculos, prioridades. SIN NOMBRE. (150-250 chars)
- hobbies_intereses: Aficiones, deportes, lectura, qué le aportan. SIN NOMBRE. (150-250 chars)
- producto_servicio: Qué problema resuelve nuestro producto, proceso de compra. SIN NOMBRE. (150-250 chars)
- frustraciones: Miedos, molestias, quejas, lo que no tolera. SIN NOMBRE. (150-250 chars)
- donde_encontrarle: Canales para contactar, dónde está activo. SIN NOMBRE. (100-200 chars)
- ventajas: Ventajas sobre competencia en nuestro sector. SIN NOMBRE. (100-200 chars)
- como_ayudar: Cómo ayudarle a alcanzar objetivos. SIN NOMBRE. (100-200 chars)
Si falta info, INFIÉRELA coherentemente.

Devuelve ÚNICAMENTE un objeto JSON con esta estructura EXACTA (todo en minúsculas):
{
  "empatia": {
    "con_quien_empatizamos": "",
    "que_necesita_hacer": "",
    "que_ve": "",
    "que_dice": "",
    "que_hace": "",
    "que_escucha": "",
    "que_piensa_siente": {
      "esfuerzos": "",
      "resultados": "",
      "otros": ""
    }
  },
  "canvas": {
    "segmentos_mercado": "",
    "propuesta_valor": "",
    "canales": "",
    "relaciones_clientes": "",
    "flujos_ingresos": "",
    "actividades_clave": "",
    "recursos_clave": "",
    "socios_clave": "",
    "estructura_costes": ""
  },
  "ltd": {
    "cliente_centro": "",
    "tecnologias": "",
    "nube_datos": "",
    "negocio_digital": "",
    "ingenieria_procesos": "",
    "cultura_liderazgo": "",
    "marketing_digital": ""
  },
  "test_diagnostico": "texto pulido aquí",
  "madurez": {
    "madurez_propia": "análisis de madurez interna",
    "madurez_competencia": "análisis comparativo con competencia"
  },
  "buyer_persona": {
    "nombre": "",
    "perfil_personal": "",
    "perfil_profesional": "",
    "habitos": "",
    "objetivos_retos": "",
    "hobbies_intereses": "",
    "producto_servicio": "",
    "frustraciones": "",
    "donde_encontrarle": "",
    "ventajas": "",
    "como_ayudar": ""
  }
}`;
  try {
    return solicitarJSONConFallbackIA_(prompt, 'MEGA-CALL 1 (Diagramas)', 3000);
  } catch (e) {
    console.error('Error en normalizarDiagramas: ' + e.message);
    return {};
  }
}

// =================================================================
// MEGA-FUNCIÓN 2: Tablas (Herramientas + Objetivos + Plan + Inversión)
// =================================================================
function normalizarTablas(textoHerramientas, textoObjetivos, textoPlan, textoInversion, textoDiagnostico, textoFormacion, textoFodaOp, textoFodaAm, textoGestion, textoDiagInterno) {
  const prompt = `Eres un Director Ejecutivo (CEO) experto en planificación estratégica. Vas a procesar 4 bloques de texto del MISMO cliente y devolver un JSON unificado.

=== BLOQUE 1: HERRAMIENTAS Y TECNOLOGÍAS ===
Datos: "${textoHerramientas}"
Extrae hasta 4 herramientas con: ámbito, herramienta, nivel de implantación, presupuesto y prioridad. Si no se especifica algo, INFIÉRELO, TIENE QUE HABER, NO PUEDE QUEDAR VACIO NINGUN CAMPO Y SON 4 FILAS.

=== BLOQUE 2: OBJETIVOS Y KPI ===
Datos: "${textoObjetivos}"
Extrae hasta 5 objetivos con: fecha (Mes/Año legible), objetivo (máx 200 chars) y KPI cuantificable (máx 200 chars). NO PUEDE QUEDAR VACIO NINGUN CAMPO Y SON 5 FILAS.

=== BLOQUE 3: PLAN DE ACCIÓN ===
Datos: "${textoPlan}"
Extrae EXACTAMENTE 6 iniciativas con: ámbito del lienzo TD, iniciativa (máx 150 chars), tareas (máx 200 chars), plazo, responsable y presupuesto. 
Si no hay suficientes iniciativas en el texto, INFIERE iniciativas estratégicas adicionales coherentes con el sector. DEBEN SER 6 FILAS.

=== BLOQUE 4: INVERSIÓN NECESARIA ===
Datos: "${textoInversion}"
Organiza en 3 horizontes temporales: corto, medio y largo plazo. Para CADA uno: descripción profesional (250-300 chars) + monto estimado. Si no hay montos, pon "A estimar".

=== BLOQUE 5: DIAGNÓSTICO EXTERNO - OTRAS EMPRESAS ===
Datos: "${textoDiagnostico}"
Extrae e identifica hasta 7 empresas o iniciativas innovadoras del sector. Para CADA una, proporciona:
1. EMPRESA INNOVADORA: Nombre o descripción de la empresa/iniciativa (máx 150 chars)
2. MODELO DE NEGOCIO: Cómo genera valor (máx 150 chars)
3. ESTRATEGIA DIGITAL: Qué tecnologías o enfoque digital usa (máx 150 chars)
4. PRODUCTO O SERVICIO: Qué ofrece concretamente (máx 150 chars)
Si no hay suficientes empresas explícitas, INFIERE empresas competidoras o referentes del mismo sector. DEBEN SER 7 FILAS OBLIGATORIAS.

=== BLOQUE 6: FORMACIÓN NECESARIA ===
Datos: "${textoFormacion}"
A partir de los impulsores o necesidades descritas, infiere los cursos o programas de formación que el equipo necesitaría. Genera EXACTAMENTE 5 filas con:
1. CURSO/PROGRAMA: Nombre del curso o programa formativo (máx 100 chars)
2. DEPARTAMENTO/PERSONAS: A quién va dirigido (máx 100 chars)
3. DURACIÓN: Estimación temporal (ej "40 horas", "3 meses", "1 semana")
Si no hay info suficiente, INFIÉRELO basado en el contexto tecnológico del cliente. DEBEN SER 5 FILAS.

=== BLOQUE 7: FODA - OPORTUNIDADES Y AMENAZAS ===
Oportunidad original: "${textoFodaOp}"
Amenaza original: "${textoFodaAm}"
A partir de cada párrafo, genera EXACTAMENTE 8 puntos específicos y distintos para oportunidades y 8 para amenazas.
Cada punto debe ser una frase profesional concisa (máx 100 caracteres) que identifique un aspecto específico.
Si no hay suficiente info, INFIERE oportunidades y amenazas coherentes con el contexto del cliente. DEBEN SER 8 FILAS OBLIGATORIAS por columna.

=== BLOQUE 8: EQUIPO LÍDER DEL CAMBIO ===
Datos: "${textoGestion}"
Identifica hasta 4 personas o roles que lideran la transformación digital. Para CADA uno:
1. NOMBRE: Nombre de la persona SI se menciona. Si NO se menciona un nombre propio, pon "Por definir"
2. DESCRIPCION: Rol, responsabilidad y cómo impulsa el cambio (máx 200 chars)
Si no se identifican 4 personas, completa con "N/A" en descripción y "Por definir" en nombre. DEBEN SER 4 MIEMBROS.

=== BLOQUE 9: DIAGNÓSTICO INTERNO - FORTALEZAS Y DEBILIDADES ===
Datos: "${textoDiagInterno}"
A partir del texto, extrae e identifica EXACTAMENTE 6 fortalezas y 6 debilidades de la organización.
Cada punto debe ser una frase profesional concisa (máx 120 caracteres) en tono ejecutivo.
Si no hay suficientes puntos explícitos, INFIERE fortalezas y debilidades coherentes con el contexto descrito. DEBEN SER 8 FILAS OBLIGATORIAS por columna.

Devuelve ÚNICAMENTE un objeto JSON con esta estructura EXACTA:
{
  "herramientas": [
    { "ambito": "", "herramienta": "", "nivel": "", "presupuesto": "", "prioridad": "" }
  ],
  "objetivos": [
    { "fecha": "", "objetivo": "", "kpi": "" }
  ],
  "plan_accion": [
    { "ambito": "", "iniciativa": "", "tareas": "", "plazo": "", "responsable": "", "presupuesto": "" }
  ],
  "inversion": {
    "corto_plazo_descripcion": "",
    "corto_plazo_monto": "",
    "medio_plazo_descripcion": "",
    "medio_plazo_monto": "",
    "largo_plazo_descripcion": "",
    "largo_plazo_monto": ""
  },
  "diagnostico_externo": [
    { "empresa_innovadora": "", "modelo_negocio": "", "estrategia_digital": "", "producto_servicio": "" }
  ],
  "formacion": [
    { "curso": "", "departamento": "", "duracion": "" }
  ],
  "foda": {
    "oportunidades": ["punto1", "punto2", "punto3", "punto4", "punto5", "punto6", "punto7", "punto8"],
    "amenazas": ["punto1", "punto2", "punto3", "punto4", "punto5", "punto6", "punto7", "punto8"]
  },
  "equipo_lider": [
    { "nombre": "", "descripcion": "" }
  ],
  "fortalezas_debilidades": {
    "fortalezas": ["punto1", "punto2", "punto3", "punto4", "punto5", "punto6", "punto7", "punto8"],
    "debilidades": ["punto1", "punto2", "punto3", "punto4", "punto5", "punto6", "punto7", "punto8"]
  }
}`;
  try {
    return solicitarJSONConFallbackIA_(prompt, 'MEGA-CALL 2 (Tablas)', 5000);
  } catch (e) {
    console.error('Error en normalizarTablas: ' + e.message);
    return {};
  }
}

// -------------------------------------------------------------
// Función de Resiliencia: Reintentos Automáticos para la API de Gemini
// -------------------------------------------------------------
function fetchConReintentos(url, options, maxReintentos = 3) {
  let ultimaRespuesta = null;
  
  for (let intento = 1; intento <= maxReintentos; intento++) {
    ultimaRespuesta = UrlFetchApp.fetch(url, options);
    const codigoHTTP = ultimaRespuesta.getResponseCode();
    
    // Si responde perfecto (200), cortamos el bucle y devolvemos la respuesta
    if (codigoHTTP === 200) {
      return ultimaRespuesta;
    }
    
    // Si tira Error 503 (Servidores Caídos por Demanda) o 429 (Límite de Ráfaga)
    if (codigoHTTP === 503 || codigoHTTP === 429) {
      console.warn(`Llamada a IA falló con \${codigoHTTP}. Intento \${intento}/\${maxReintentos}. Reintentando en 8 segundos...`);
      if (intento < maxReintentos) {
        Utilities.sleep(8000); // Dormimos 8 segundos cruzando los dedos para que Gemini se despierte
        continue;
      }
    } else {
      // Si es otro error (ej. 400 Bad Request, 403 Api Key), no tiene sentido reintentar
      break;
    }
  }
  
  // Si llegamos acá es porque agotó todos los reintentos o hubo un error fatal. 
  // Lo devolvemos igual para que el parseo principal falle controlado.
  return ultimaRespuesta;
}
