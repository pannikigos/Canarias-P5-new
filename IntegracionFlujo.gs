function procesarFormularioNuevo(respuestas) {
    const { nombreAlumno, correoAlumno, nombreEmpresa } = respuestas[0];
    const respuestasAbiertas = respuestas.slice(1, 5).map(res => res); // Extracting open responses
    const superPrompt = crearSuperPromptIA(nombreAlumno, correoAlumno, nombreEmpresa, respuestasAbiertas);
    const jsonResponse = solicitarJSONConFallbackIA_(superPrompt);
    const mappedResponses = mapearRespuestasDe5A18(jsonResponse);
    guardarRespuestasEnSlides(mappedResponses);
}

function mapearRespuestasDe5A18(respuestasDeIA) {
    const mapped = {};
    for (let i = 0; i <= 17; i++) {
        mapped[i] = respuestasDeIA[`id_${i}`] || '' ; // Adjusting to original fields
    }
    // Perform transformations as needed (arrays to strings, objects to paragraphs, etc)
    return mapped;
}

function procesarFormulario(respuestas) {
    if (respuestas.length === 5) {
        // New 5-question system
        procesarFormularioNuevo(respuestas);
    } else {
        // Existing 18-question system logic
        // Call existing procesarFormulario() logic
    }
}