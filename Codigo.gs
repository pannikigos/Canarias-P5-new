function onOpen() {
  try {
    inicializarProveedorIA_();
  } catch (e) {
    console.warn('No se pudo inicializar proveedor IA en onOpen: ' + e.message);
  }

  let ui = SlidesApp.getUi();
  ui.createMenu('Formulario')
    .addItem('Abrir Formulario', 'mostrarFormulario')
    .addItem('Administrar Keys', 'mostrarPanelKeys')
    .addSeparator()
    .addToUi();
}

function doGet(e) {
  try {
    try {
      inicializarProveedorIA_();
    } catch (eInit) {
      console.warn('No se pudo inicializar proveedor IA en doGet: ' + eInit.message);
    }

    return HtmlService
    .createTemplateFromFile('Frontend/Index')
    .evaluate()
    .setTitle('Formulario - Plan de Transformación Digital')
    .setFaviconUrl('https://eadic.com/favicon.ico')
    .addMetaTag('viewport', 'width=device-width, initial-scale=1')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL)
    .setSandboxMode(HtmlService.SandboxMode);
  }
  catch (err) {
    return HtmlService.createHtmlOutput("Error al cargar el archivo: " + err.toString());
  }
}

function mostrarFormulario() {
  try {

    let urlPublicada = env_().URL_PROYECTO;


    if (!urlPublicada) {
      SlidesApp.getUi().alert("Error: Primero debes desplegar el script como 'Aplicación Web'.");
      return;
    }

    const html = HtmlService.createHtmlOutput(
      `<html>
          <body style="font-family: sans-serif; text-align: center; padding: 20px;">
            <p>El formulario de IA está listo.</p>
            <a href="${urlPublicada}" target="_blank" 
              style="background-color: #4285f4; color: white; padding: 10px 20px; 
                      text-decoration: none; border-radius: 4px; font-weight: bold;"
              onclick="google.script.host.close()">
               IR AL FORMULARIO
            </a>
          </body>
        </html>`
    )
      .setWidth(300)
      .setHeight(150);

    SlidesApp.getUi().showModalDialog(html, "Asistente de Transformación");
  } catch (error) {
    console.error("Error al mostrar el formulario: " + error.message);
    SlidesApp.getUi().alert("No se pudo cargar el archivo Frontend/Index. Revisa el nombre.");
  }
}

function include(filename) {
  try {
    return HtmlService.createHtmlOutputFromFile(filename).getContent();
  } catch (error) {
    console.log(error);
  }
}

function procesarFormulario(datosDelForm) {
  try {
    // Esto nos dirá en el log si el formulario envió algo
    console.log("DATOS RECIBIDOS DEL FORM:", JSON.stringify(datosDelForm));

    // 1. Obtenemos la IA
    const respuestasIA = optimizarRespuestasConIA(datosDelForm);

    if (!respuestasIA) {
      throw new Error("La IA de Procesamiento Masivo devolvió un valor nulo u ocurrió un fallo de conexión crítico.");
    }

    // 2. Guardamos en Sheets y creamos las Slides
    const slideUrl = guardarRespuestasEnSlides(respuestasIA);

    return { success: true, url: slideUrl, mensaje: "Procesado correctamente" };
  } catch (e) {
    console.error("Error en procesarFormulario: " + e.message);
    throw new Error(e.message);
  }
}

function mostrarPanelKeys() {
  try {
    const props = PropertiesService.getScriptProperties();
    let keys = props.getProperties();

    // Generar ID_PLANTILLA_SLIDES si no existe
    if (!keys.ID_PLANTILLA_SLIDES) {
      const presentation = SlidesApp.getActivePresentation();
      keys.ID_PLANTILLA_SLIDES = presentation.getId();
      props.setProperty('ID_PLANTILLA_SLIDES', keys.ID_PLANTILLA_SLIDES);
    }

    // Generar ID_SHEET si no existe
    if (!keys.ID_SHEET) {
      const plantillaFile = DriveApp.getFileById(keys.ID_PLANTILLA_SLIDES);
      const carpetaPlantilla = plantillaFile.getParents().hasNext()
        ? plantillaFile.getParents().next()
        : DriveApp.getRootFolder();

      const sheet = SpreadsheetApp.create('Nuevo Sheet para Formulario plan de transformación digital');
      const sheetFile = DriveApp.getFileById(sheet.getId());
      carpetaPlantilla.addFile(sheetFile);
      DriveApp.getRootFolder().removeFile(sheetFile);

      keys.ID_SHEET = sheet.getId();
      props.setProperty('ID_SHEET', keys.ID_SHEET);
    }

    // Para URL_PROYECTO, no se puede generar automáticamente
    if (!keys.URL_PROYECTO) {
      keys.URL_PROYECTO = ''; // Dejar vacío
    }

    if (!keys.GEMINI_API_KEY) {
      keys.GEMINI_API_KEY = keys.API_KEY || '';
    }
    if (!keys.GROQ_API_KEY) {
      keys.GROQ_API_KEY = '';
    }

    // Crear el HTML del modal
    const htmlContent = `
      <html>
        <head>
          <style>
            :root {
              --bg: #f4f6fb;
              --card: #ffffff;
              --text: #111827;
              --muted: #6b7280;
              --border: #e5e7eb;
              --accent: #2d67f6;
              --accent-soft: rgba(45, 103, 246, 0.14);
              --success: #10b981;
            }

            * {
              box-sizing: border-box;
            }

            body {
              margin: 0;
              padding: 0;
              background: linear-gradient(135deg, #eef2ff 0%, #f8fafc 100%);
              color: var(--text);
              font-family: 'Inter', system-ui, sans-serif;
            }

            .wrapper {
              max-width: 520px;
              margin: 0 auto;
              padding: 24px;
            }

            .card {
              background: var(--card);
              border: 1px solid var(--border);
              border-radius: 18px;
              box-shadow: 0 32px 80px rgba(15, 23, 42, 0.08);
              padding: 28px;
            }

            h2 {
              margin: 0 0 8px;
              font-size: 1.5rem;
              letter-spacing: -0.03em;
            }

            p.description {
              margin: 0 0 20px;
              color: var(--muted);
              line-height: 1.6;
            }

            .grid {
              display: grid;
              gap: 16px;
            }

            .field {
              display: grid;
              gap: 6px;
            }

            label {
              font-size: 0.95rem;
              font-weight: 600;
            }

            input {
              width: 100%;
              border: 1px solid var(--border);
              border-radius: 12px;
              padding: 12px 14px;
              font-size: 0.96rem;
              background: #fff;
              transition: border-color 0.2s ease, box-shadow 0.2s ease;
            }

            input:focus {
              outline: none;
              border-color: var(--accent);
              box-shadow: 0 0 0 4px rgba(45, 103, 246, 0.12);
            }

            input[readonly] {
              background: #f9fafb;
              color: #374151;
            }

            .hint {
              font-size: 0.85rem;
              color: var(--muted);
            }

            .link {
              display: inline-flex;
              align-items: center;
              color: var(--accent);
              text-decoration: none;
              font-weight: 600;
              margin-top: 6px;
            }

            .link:hover {
              text-decoration: underline;
            }

            .buttons {
              display: flex;
              flex-wrap: wrap;
              gap: 12px;
              margin-top: 24px;
            }

            .button-primary,
            .button-secondary {
              border: none;
              border-radius: 999px;
              padding: 12px 22px;
              font-size: 0.98rem;
              font-weight: 700;
              cursor: pointer;
              transition: transform 0.2s ease, box-shadow 0.2s ease, background-color 0.2s ease;
            }

            .button-primary {
              background: var(--accent);
              color: white;
              box-shadow: 0 14px 30px rgba(45, 103, 246, 0.18);
            }

            .button-primary:hover {
              transform: translateY(-1px);
              background: #2350d0;
            }

            .button-secondary {
              background: #f8fafc;
              color: #374151;
              border: 1px solid #d1d5db;
            }

            .button-secondary:hover {
              background: #eef2ff;
            }

            .tag {
              display: inline-flex;
              gap: 8px;
              align-items: center;
              margin-top: 6px;
              padding: 6px 10px;
              border-radius: 999px;
              background: var(--accent-soft);
              color: var(--accent);
              font-size: 0.82rem;
              font-weight: 600;
            }
          </style>
        </head>
        <body>
          <div class="wrapper">
            <div class="card">
              <h2>Administrar Keys del Proyecto</h2>
              <p class="description">Revisa y actualiza los valores principales del proyecto. El ID de la plantilla y el ID del sheet se generan automáticamente si faltan.</p>

              <div class="grid">
                <div class="field">
                  <label for="gemini_api_key">GEMINI_API_KEY</label>
                  <input type="text" id="gemini_api_key" value="${keys.GEMINI_API_KEY || ''}" placeholder="Ingresa tu API Key de Gemini">
                  <a href="https://aistudio.google.com/app/apikey" target="_blank" class="link">Ir a Google AI Studio</a>
                </div>

                <div class="field">
                  <label for="groq_api_key">GROQ_API_KEY</label>
                  <input type="text" id="groq_api_key" value="${keys.GROQ_API_KEY || ''}" placeholder="Ingresa tu API Key de Groq (fallback)">
                  <a href="https://console.groq.com/keys" target="_blank" class="link">Ir a Groq Console</a>
                </div>

                <div class="field">
                  <label for="api_key">API_KEY (legacy/fallback)</label>
                  <input type="text" id="api_key" value="${keys.API_KEY || ''}" placeholder="Opcional: compatibilidad con lógica antigua">
                </div>

                <div class="field">
                  <label for="id_plantilla">ID_PLANTILLA_SLIDES</label>
                  <input type="text" id="id_plantilla" value="${keys.ID_PLANTILLA_SLIDES}" readonly>
                  <span class="tag">Generado automáticamente</span>
                </div>

                <div class="field">
                  <label for="id_sheets">ID_SHEET</label>
                  <input type="text" id="id_sheets" value="${keys.ID_SHEET}" readonly>
                  <span class="tag">Generado automáticamente</span>
                </div>

                <div class="field">
                  <label for="url_proyecto">URL_PROYECTO</label>
                  <input type="text" id="url_proyecto" value="${keys.URL_PROYECTO}" placeholder="URL de la aplicación web desplegada">
                  <span class="hint">Si está vacío, despliega el proyecto usando 'Implementar > Nueva implementación' y copia la URL aquí.</span>
                </div>
              </div>

              <div class="buttons">
                <button type="button" class="button-primary" onclick="guardarKeys()">Guardar cambios</button>
                <button type="button" class="button-secondary" onclick="google.script.host.close()">Cerrar</button>
              </div>
            </div>
          </div>

          <script>
            function guardarKeys() {
              const geminiApiKey = document.getElementById('gemini_api_key').value;
              const groqApiKey = document.getElementById('groq_api_key').value;
              const apiKey = document.getElementById('api_key').value;
              const urlProyecto = document.getElementById('url_proyecto').value;
              google.script.run
                .withSuccessHandler(() => google.script.host.close())
                .guardarKeys({
                  GEMINI_API_KEY: geminiApiKey,
                  GROQ_API_KEY: groqApiKey,
                  API_KEY: apiKey,
                  URL_PROYECTO: urlProyecto
                });
            }
          </script>
        </body>
      </html>
    `;

    const html = HtmlService.createHtmlOutput(htmlContent)
      .setWidth(500)
      .setHeight(400);

    SlidesApp.getUi().showModalDialog(html, 'Administrar Keys');
  } catch (error) {
    console.error('Error en mostrarPanelKeys: ' + error.message);
    SlidesApp.getUi().alert('Error: ' + error.message);
  }
}

function guardarKeys(keys) {
  const props = PropertiesService.getScriptProperties();
  if (keys.GEMINI_API_KEY !== undefined) {
    props.setProperty('GEMINI_API_KEY', keys.GEMINI_API_KEY);
  }
  if (keys.GROQ_API_KEY !== undefined) {
    props.setProperty('GROQ_API_KEY', keys.GROQ_API_KEY);
  }
  if (keys.API_KEY !== undefined) {
    props.setProperty('API_KEY', keys.API_KEY);
  }
  if (keys.URL_PROYECTO !== undefined) {
    props.setProperty('URL_PROYECTO', keys.URL_PROYECTO);
  }
  SlidesApp.getUi().alert('Keys guardadas correctamente.');
}
