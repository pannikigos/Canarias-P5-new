function env_() {
  const props = PropertiesService.getScriptProperties().getProperties();
  return {
    API_KEY: props.API_KEY || '',
    GEMINI_API_KEY: props.GEMINI_API_KEY || '',
    GROQ_API_KEY: props.GROQ_API_KEY || '',
    ID_PLANTILLA_SLIDES: props.ID_PLANTILLA_SLIDES || '',
    ID_SHEET: props.ID_SHEET || '',
    URL_PROYECTO: props.URL_PROYECTO || '',
  };
}
