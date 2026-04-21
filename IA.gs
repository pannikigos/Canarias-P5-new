const PROVEEDOR_IA_GEMINI = 'gemini';
const PROVEEDOR_IA_GROQ = 'groq';
let proveedorIAActivo_ = null;

function obtenerConfigIA_() {
  const config = env_();
  return {
    geminiKey: config.GEMINI_API_KEY || config.API_KEY || '',
    groqKey: config.GROQ_API_KEY || '',
  };
}

function puedeUsarGroq_() {
  return !!obtenerConfigIA_().groqKey;
}

function esRespuestaAltaDemandaGemini_(codigoHTTP, resJson) {
  const status = ((resJson || {}).error || {}).status || '';
  const mensaje = (((resJson || {}).error || {}).message || '').toLowerCase();
  return codigoHTTP === 503 ||
    status === 'UNAVAILABLE' ||
    mensaje.indexOf('high demand') !== -1 ||
    mensaje.indexOf('spikes in demand') !== -1;
}

function forzarProveedorGroq_(motivo) {
  if (!puedeUsarGroq_()) return false;
  proveedorIAActivo_ = PROVEEDOR_IA_GROQ;
  console.warn('Fallback a Groq activado. Motivo: ' + (motivo || 'N/A'));
  return true;
}

function inicializarProveedorIA_() {
  if (proveedorIAActivo_) return proveedorIAActivo_;

  const cfg = obtenerConfigIA_();
  if (!cfg.geminiKey) {
    if (puedeUsarGroq_()) {
      proveedorIAActivo_ = PROVEEDOR_IA_GROQ;
      return proveedorIAActivo_;
    }
    proveedorIAActivo_ = PROVEEDOR_IA_GEMINI;
    return proveedorIAActivo_;
  }

  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${cfg.geminiKey}`;
  const payload = {
    contents: [{
      parts: [{ text: 'Health check de disponibilidad. Responde OK.' }]
    }],
    generationConfig: {
      maxOutputTokens: 8,
      temperature: 0
    }
  };

  try {
    const response = UrlFetchApp.fetch(url, {
      method: 'post',
      contentType: 'application/json',
      payload: JSON.stringify(payload),
      muteHttpExceptions: true
    });

    const codigo = response.getResponseCode();
    const texto = response.getContentText();
    let json = {};
    try {
      json = JSON.parse(texto);
    } catch (e) {
      json = {};
    }

    if (codigo === 200 && json.candidates && json.candidates[0].content) {
      proveedorIAActivo_ = PROVEEDOR_IA_GEMINI;
      return proveedorIAActivo_;
    }

    if (esRespuestaAltaDemandaGemini_(codigo, json) && puedeUsarGroq_()) {
      proveedorIAActivo_ = PROVEEDOR_IA_GROQ;
      console.warn('Gemini con alta demanda en health check. Se usará Groq.');
      return proveedorIAActivo_;
    }

    proveedorIAActivo_ = PROVEEDOR_IA_GEMINI;
    return proveedorIAActivo_;
  } catch (e) {
    if (puedeUsarGroq_()) {
      proveedorIAActivo_ = PROVEEDOR_IA_GROQ;
      console.warn('Health check Gemini falló por excepción. Se usará Groq.');
      return proveedorIAActivo_;
    }
    proveedorIAActivo_ = PROVEEDOR_IA_GEMINI;
    return proveedorIAActivo_;
  }
}

function obtenerProveedorIAActivo_() {
  return inicializarProveedorIA_();
}

function construirContextoOptimizacion_(respuestasUsuario) {
  const preguntas = obtenerPreguntas();
  let contextoGlobal = "Actúa como Consultor Estratégico Senior experto en Transformación Digital.\n";
  contextoGlobal += "Tu tarea es tomar las respuestas de un diagnóstico empresarial y transformarlas en respuestas profesionales, redactadas con un tono ejecutivo y estratégico.\n\n";
  contextoGlobal += "REGLAS DE PROCESAMIENTO:\n";
  contextoGlobal += "- Si recibes un JSON de tabla o matriz, sintetiza los hallazgos en un párrafo profesional.\n";
  contextoGlobal += "- Si recibes un Business Model Canvas, redacta un análisis estratégico de ese modelo.\n";
  contextoGlobal += "- No inventes datos que no estén en la respuesta original, solo eleva el lenguaje.\n\n";
  contextoGlobal += "REGLA DE SALIDA ESTRICTA: Responde ÚNICAMENTE con un objeto JSON plano donde las llaves sean los IDs (del 1 al 17) en formato string, y el valor sea el texto de la respuesta optimizada.\n\n";

  preguntas.forEach(p => {
    let original = respuestasUsuario[p.id] || respuestasUsuario[String(p.id)];

    if (original && original !== '' && original !== '[]' && original !== '{}') {
      let representacionTexto = '';
      if (typeof original === 'string' && (original.startsWith('{') || original.startsWith('['))) {
        try {
          const parsed = JSON.parse(original);
          representacionTexto = JSON.stringify(parsed, null, 2);
        } catch (e) {
          representacionTexto = original;
        }
      } else {
        representacionTexto = original;
      }

      contextoGlobal += `--- PREGUNTA ID ${p.id} (${p.titulo || 'Sin Título'}) ---\n`;
      contextoGlobal += `RESPUESTA DEL USUARIO:\n${representacionTexto}\n\n`;
    }
  });

  return { contextoGlobal, preguntas };
}

function optimizarConGemini_(contextoGlobal) {
  const cfg = obtenerConfigIA_();
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${cfg.geminiKey}`;
  const payload = {
    contents: [{
      parts: [{ text: `${contextoGlobal}\n\nIMPORTANTE: Devuelve solo el JSON puro. Sin bloques de código, sin texto adicional.` }]
    }]
  };

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
    const err = new Error('Gemini con alta demanda.');
    err.esAltaDemanda = true;
    throw err;
  }

  if (!resJson.candidates || !resJson.candidates[0].content) {
    throw new Error('La API no devolvió contenido válido.');
  }

  return resJson.candidates[0].content.parts[0].text.trim();
}

function optimizarConGroq_(contextoGlobal) {
  const cfg = obtenerConfigIA_();
  const url = 'https://api.groq.com/openai/v1/chat/completions';
  const payload = {
    model: 'llama-3.3-70b-versatile',
    messages: [{ role: 'user', content: `${contextoGlobal}\n\nIMPORTANTE: Devuelve solo el JSON puro. Sin bloques de código, sin texto adicional.` }],
    temperature: 0.2
  };

  const response = UrlFetchApp.fetch(url, {
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
    throw new Error('La API de Groq no devolvió contenido válido: ' + resText);
  }
  return resJson.choices[0].message.content.trim();
}

function limpiarYParsearJSONPlano_(textoCrudo) {
  let textoLimpio = String(textoCrudo || '').trim();
  textoLimpio = textoLimpio.replace(/^```json\s*/, '').replace(/```$/, '').trim();

  const inicioJson = textoLimpio.indexOf('{');
  const finJson = textoLimpio.lastIndexOf('}') + 1;
  if (inicioJson !== -1 && finJson !== -1) {
    textoLimpio = textoLimpio.substring(inicioJson, finJson);
  }
  return JSON.parse(textoLimpio);
}

function mapearRespuestasOptimizadas_(objetoIA, respuestasUsuario, preguntas) {
  const respuestasOptimizadas = {};
  preguntas.forEach(p => {
    const optimizada = objetoIA[p.id] || objetoIA[String(p.id)];
    if (optimizada) {
      respuestasOptimizadas[p.id] = optimizada;
    } else {
      const original = respuestasUsuario[p.id];
      respuestasOptimizadas[p.id] = original ? `(Original) ${original}` : 'Sin respuesta';
    }
  });
  return respuestasOptimizadas;
}

function devolverOriginales_(respuestasUsuario, preguntas) {
  const respuestasOptimizadas = {};
  preguntas.forEach(p => {
    const val = respuestasUsuario[p.id];
    respuestasOptimizadas[p.id] = val ? String(val) : '';
  });
  return respuestasOptimizadas;
}

function optimizarRespuestasConIA(respuestasUsuario) {
  const armado = construirContextoOptimizacion_(respuestasUsuario);
  const contextoGlobal = armado.contextoGlobal;
  const preguntas = armado.preguntas;

  try {
    const proveedor = obtenerProveedorIAActivo_();
    let textoRespuesta = '';

    if (proveedor === PROVEEDOR_IA_GROQ) {
      textoRespuesta = optimizarConGroq_(contextoGlobal);
    } else {
      try {
        textoRespuesta = optimizarConGemini_(contextoGlobal);
      } catch (eGemini) {
        if (eGemini.esAltaDemanda && forzarProveedorGroq_('Gemini alta demanda en optimizarRespuestasConIA')) {
          textoRespuesta = optimizarConGroq_(contextoGlobal);
        } else {
          throw eGemini;
        }
      }
    }

    const objetoIA = limpiarYParsearJSONPlano_(textoRespuesta);
    return mapearRespuestasOptimizadas_(objetoIA, respuestasUsuario, preguntas);
  } catch (e) {
    console.error('Fallo en procesamiento de IA: ' + e.message);
    return devolverOriginales_(respuestasUsuario, preguntas);
  }
}
