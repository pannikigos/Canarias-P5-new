function obtenerPreguntas() {
  return [
    {
      id: 0,
      numero: 1,
      texto: "Nombre y Apellidos del Alumno",
      tipo: "textarea",
      ayuda: "Escribe nombre y apellido completo del alumno"
    },
    {
      id: 1,
      numero: 2,
      texto: "Análisis FODA: Fortalezas y Debilidades",
      tipo: "textarea",
      ayuda: `¿Cómo describirías el estado actual de la empresa en términos de capacidades? Cuéntame sobre los logros más sólidos del equipo y, en contraparte, cuáles han sido los obstáculos o vacíos de conocimiento que han impedido alcanzar mejores resultados.`
    },
    {
      id: 2,
      numero: 3,
      texto: "Test de Diagnóstico Digital",
      tipo: "textarea",
      ayuda: "En una escala del 1 al 5, ¿qué tan integradas están las herramientas digitales en los procesos diarios de la empresa? Compara esa situación con los estándares del sector: ¿en qué aspectos tecnológicos llevan la delantera y en cuáles se están quedando atrás frente a sus competidores directos?",
    },
    {
      id: 3,
      numero: 4,
      texto: "Análisis FODA: Oportunidades y Amenazas",
      tipo: "textarea",
      ayuda:
        "Mirando hacia el mercado y el entorno actual, ¿qué tendencias o cambios externos podrían beneficiar el crecimiento de la empresa y cuáles representan un riesgo real que podría comprometer su estabilidad si no se gestionan a tiempo?",
    },
    {
      id: 4,
      numero: 5,
      texto: "Análisis Externo - Otras Empresas",
      tipo: "guided-textarea",
      sections: [
        {
          name: "EMPRESA INNOVADORA",
          prompt: "Describe las capacidades innovadoras de la empresa...",
          help: "Ej: Cultura de innovación, I+D, patentes, etc.",
          required: true,
          placeholder: "Escribe aquí las capacidades innovadoras..."
        },
        {
          name: "MODELO DE NEGOCIO",
          prompt: "Describe el modelo de negocio actual y propuesto...",
          help: "Ej: Propuesta de valor, segmentos de clientes, canales, etc.",
          required: true,
          placeholder: "Escribe aquí la descripción del modelo de negocio..."
        },
        {
          name: "ESTRATEGIA DIGITAL",
          prompt: "Selecciona el nivel de madurez digital",
          type: "select",
          options: ["Inicial", "En desarrollo", "Avanzado", "Transformación total"],
          required: true,
          placeholder: "Selecciona una opción..."
        },
        {
          name: "PRODUCTO O SERVICIO",
          prompt: "Describe el producto/servicio principal...",
          help: "Ej: Características, diferenciación, valor agregado, etc.",
          required: true,
          placeholder: "Escribe aquí la descripción del producto o servicio..."
        }
      ],
      allowMultipleBlocks: true,
      limits: {
        min: 1,
        max: 10
      },
      ayuda: "Define las capacidades innovadoras, el modelo de negocio (actual y propuesto) y el producto principal de la empresa, especificando su nivel de madurez digital actual."
    },
    {
      id: 5,
      numero: 6,
      texto: "Áreas de Actuación",
      tipo: "textarea",
      ayuda: "¿Cuáles son los procesos o departamentos más críticos hoy en la empresa y cómo se conectan entre sí para entregar el producto final?"
    },
    {
      id: 6,
      numero: 7,
      texto: "Perfil de Cliente - BUYER PERSONA",
      tipo: "text",
      ayuda:
        "¿Quién eres más allá del trabajo (hobbies y hábitos) y qué retos o frustraciones enfrentas hoy? Cuéntame también, de forma detallada, qué producto o servicio ofreces y que problemas se encargan de resolver",
    },
    {
      id: 7,
      numero: 8,
      texto: "Mapa de Empatía",
      tipo: "textarea",
      ayuda:
        "Defíneme al cliente: ¿quién es y qué busca lograr? Describe qué ve, escucha y hace en su entorno, y cuáles son los sentimientos o pensamientos que realmente lo mueven."
    },
    {
      id: 8,
      numero: 9,
      texto: "Mapa de Experiencia del Cliente",
      tipo: "textarea",
      ayuda:
        "¿Cómo es el viaje del cliente desde que nos conoce hasta la postventa? Describe sus acciones y dudas principales, dónde interactúa con nosotros y en qué momentos suele sentirse frustrado o influenciado por otros.",
    },
    {
      id: 9,
      numero: 10,
      texto: "Lienzo del Modelo de Negocio",
      tipo: "guided-textarea",
      sections: [
        {
          name: "SOCIOS CLAVE",
          prompt: "¿Quién te puede ayudar?",
          help: "Socios estratégicos, proveedores, alianzas clave",
          required: true
        },
        {
          name: "ACTIVIDADES CLAVE",
          prompt: "¿Qué harás para cumplir la propuesta de valor?",
          help: "Acciones principales, procesos clave",
          required: true
        },
        {
          name: "PROPUESTA DE VALOR",
          prompt: "¿Qué haces diferente de la competencia?",
          help: "Valor único que ofreces al cliente",
          required: true
        },
        {
          name: "RELACIÓN CON CLIENTES",
          prompt: "¿Cómo interactúas con tu cliente?",
          help: "Canales de comunicación, fidelización",
          required: true
        },
        {
          name: "SEGMENTO DE CLIENTES",
          prompt: "¿A quién ayudas?",
          help: "Segmentos de mercado objetivo",
          required: true
        },
        {
          name: "RECURSOS CLAVE",
          prompt: "¿Qué recursos necesitas para la propuesta de valor?",
          help: "Recursos humanos, financieros, tecnológicos, físicos",
          required: true
        },
        {
          name: "CANALES",
          prompt: "¿Cómo llegas a los clientes?",
          help: "Canales de distribución, comunicación y venta",
          required: true
        },
        {
          name: "ESTRUCTURA DE COSTOS",
          prompt: "¿Cuánto te costará? ¿Cuánto cuesta llegar a nuestro cliente?",
          help: "Costos fijos, variables, inversiones necesarias",
          required: true
        },
        {
          name: "FUENTE DE INGRESOS",
          prompt: "¿De dónde vienen nuestros ingresos? ¿Cuáles son los precios?",
          help: "Modelo de monetización, flujos de ingresos",
          required: true
        }
      ],
      allowMultipleBlocks: false,  // Solo un bloque (un solo modelo de negocio)
      limits: {
        min: 1,
        max: 1
      },
      ayuda: "Define los elementos clave del modelo de negocio detallando los socios, actividades y recursos necesarios, la diferenciación competitiva y relación con el segmento objetivo, junto con la estrategia de canales, estructura de costes y modelo de ingresos."
    },
    {
      id: 10,
      numero: 11,
      texto: "Lienzo de Transformación Digital",
      tipo: "guided-textarea",
      sections: [
        {
          name: "Cliente como Centro",
          prompt: "¿Cómo pones al cliente en el centro de la estrategia digital?",
          help: "Customer experience, personalización, omnicanalidad, CRM, fidelización",
          required: true,
          placeholder: "Ej: Implementación de CRM unificado, análisis de customer journey, encuestas NPS..."
        },
        {
          name: "Tecnologías",
          prompt: "¿Qué tecnologías clave estás adoptando o planeas adoptar?",
          help: "IA, Machine Learning, IoT, RPA, Blockchain, automatización",
          required: true,
          placeholder: "Ej: Implementación de chatbots con IA, automatización de procesos con RPA..."
        },
        {
          name: "Nube y Datos",
          prompt: "¿Cómo estás gestionando la nube y los datos?",
          help: "Cloud strategy, data lake, analytics, big data, gobierno del dato",
          required: true,
          placeholder: "Ej: Migración a Azure/AWS, implementación de data warehouse, dashboards en tiempo real..."
        },
        {
          name: "Negocio Digital",
          prompt: "¿Cómo estás digitalizando tu modelo de negocio?",
          help: "E-commerce, marketplaces, suscripciones, freemium, plataformas digitales",
          required: true,
          placeholder: "Ej: Lanzamiento de tienda online, modelo de suscripción SaaS..."
        },
        {
          name: "Ingeniería de Procesos",
          prompt: "¿Cómo estás optimizando y automatizando procesos?",
          help: "BPM, automatización, lean digital, mejora continua, workflows",
          required: true,
          placeholder: "Ej: Automatización de aprobaciones, digitalización de facturación..."
        },
        {
          name: "Cultura Digital / Liderazgo",
          prompt: "¿Cómo estás transformando la cultura y el liderazgo?",
          help: "Agile, cambio cultural, upskilling, comunicación interna, mentalidad digital",
          required: true,
          placeholder: "Ej: Implementación de metodologías ágiles, programa de capacitación digital..."
        },
        {
          name: "Marketing Digital",
          prompt: "¿Cómo estás evolucionando tu marketing al entorno digital?",
          help: "SEO/SEM, social media, content marketing, email marketing, analytics",
          required: true,
          placeholder: "Ej: Estrategia de contenidos, automatización de email marketing, campañas en redes..."
        }
      ],
      allowMultipleBlocks: false,
      limits: {
        min: 1,
        max: 1
      },
      ayuda: "Define tu estrategia de transformación digital detallando la centralidad del cliente, la adopción de tecnologías y gestión de datos, junto con la evolución del modelo de negocio, la optimización de procesos, el liderazgo cultural y el marketing digital."
    },
    {
      id: 11,
      numero: 12,
      texto: "Herramientas y Tecnologías a Mejorar o Implantar",
      tipo: "guided-textarea",
      sections: [
        {
          name: "ÁMBITO",
          type: "text",
          prompt: "¿En qué área o departamento se aplica?",
          help: "Ej: Ventas, Marketing, Operaciones, RRHH, Finanzas, IT, Atención al Cliente, Logística",
          required: true,
          placeholder: "Ej: Atención al Cliente, Ventas, Logística, IT..."
        },
        {
          name: "HERRAMIENTA / TECNOLOGÍA",
          type: "text",
          prompt: "¿Qué herramienta o tecnología específica necesitas?",
          help: "Nombre de la solución, software, plataforma o tecnología a implementar o mejorar",
          required: true,
          placeholder: "Ej: CRM Salesforce, Chatbot IA, ERP SAP, Power BI, RPA UiPath..."
        },
        {
          name: "PRESUPUESTO",
          type: "number",
          prompt: "¿Cuál es el presupuesto estimado?",
          help: "Inversión necesaria para la implementación o mejora",
          required: true,
          placeholder: "Ej: 15.000, 50.000, 100.000"
        },
        {
          name: "PRIORIDAD",
          type: "select",
          prompt: "¿Cuál es el nivel de prioridad?",
          help: "Define la urgencia e importancia de la implementación",
          options: ["Crítica", "Alta", "Media", "Baja"],
          required: true
        }
      ],
      allowMultipleBlocks: true,
      limits: {
        min: 1,
        max: 4
      },
      ayuda: "Detalla el plan de implementación tecnológica especificando el ámbito de aplicación, las herramientas necesarias, el presupuesto estimado y su nivel de prioridad."
    },
    {
      id: 12,
      numero: 13,
      texto: "Objetivos y KPI",
      tipo: "guided-textarea",
      sections: [
        {
          name: "FECHA (MES/AÑO)",
          type: "month",
          prompt: "¿Cuándo se planea alcanzar este objetivo?",
          help: "Especifica el mes y año de cumplimiento esperado",
          required: true,
          placeholder: "2026-03"
        },
        {
          name: "OBJETIVO",
          type: "textarea",
          prompt: "¿Qué objetivo específico quieres lograr?",
          help: "Define metas claras, medibles y alcanzables",
          required: true,
          placeholder: "Ej: Incrementar la retención de clientes, Reducir tiempos de respuesta, Mejorar la conversión..."
        },
        {
          name: "KPI",
          type: "text",
          prompt: "¿Qué indicador medirá el éxito?",
          help: "Define la métrica clave que permitirá evaluar el cumplimiento",
          required: true,
          placeholder: "Ej: Tasa de retención (%), Tiempo medio de respuesta (min), Tasa de conversión (%)..."
        }
      ],
      allowMultipleBlocks: true,
      limits: {
        min: 1,
        max: 5
      },
      ayuda: "Define hasta 5 objetivos estratégicos con sus respectivos KPIs y fechas de cumplimiento. Cada objetivo debe tener su propia fecha y métrica asociada."
    },
    {
      id: 13,
      numero: 14,
      texto: "Plan de Acción - Iniciativas, Tareas, Responsables, Plazos y Presupuesto",
      tipo: "guided-textarea",
      sections: [
        {
          name: "ÁMBITO DEL LIENZO DE TD",
          type: "select",
          prompt: "¿A qué área del Lienzo de Transformación Digital pertenece?",
          help: "Selecciona el ámbito estratégico al que se alinea esta iniciativa",
          options: [
            "Cliente como Centro",
            "Tecnologías",
            "Nube y Datos",
            "Negocio Digital",
            "Ingeniería de Procesos",
            "Cultura Digital/Liderazgo",
            "Marketing Digital"
          ],
          required: true,
          placeholder: "Selecciona un ámbito..."
        },
        {
          name: "INICIATIVA",
          type: "textarea",
          prompt: "¿Qué iniciativa o proyecto se va a realizar?",
          help: "Define el nombre y alcance de la iniciativa estratégica",
          required: true,
          placeholder: "Ej: Implementación de CRM unificado, Automatización de atención al cliente, Migración a la nube..."
        },
        {
          name: "TAREAS",
          type: "textarea",
          prompt: "¿Qué tareas específicas se deben ejecutar?",
          help: "Desglosa las actividades concretas necesarias para completar la iniciativa",
          required: true,
          placeholder: "Ej: 1. Análisis de requisitos\n2. Selección de proveedor\n3. Implementación piloto\n4. Capacitación\n5. Lanzamiento"
        },
        {
          name: "RESPONSABLE",
          type: "text",
          prompt: "¿Quién es el responsable de esta iniciativa?",
          help: "Persona o equipo encargado de liderar y ejecutar las tareas",
          required: true,
          placeholder: "Ej: Director de TI, Jefe de Marketing, Equipo de Innovación..."
        },
        {
          name: "PLAZO",
          type: "month",
          prompt: "¿Cuál es la fecha límite de cumplimiento?",
          help: "Especifica el mes y año en que debe completarse la iniciativa",
          required: true,
          placeholder: "2026-06"
        },
        {
          name: "PRESUPUESTO",
          type: "number",
          prompt: "¿Cuál es el presupuesto asignado?",
          help: "Inversión estimada en euros para ejecutar la iniciativa",
          required: true,
          placeholder: "Ej: 25000, 50000, 100000"
        }
      ],
      allowMultipleBlocks: true,
      limits: {
        min: 1,
        max: 6
      },
      ayuda: "Detalla el plan de acción vinculando cada iniciativa al área correspondiente de transformación digital, especificando las tareas, el responsable, la fecha límite y el presupuesto asignado."
    },
    {
      id: 14,
      numero: 15,
      texto: "Matriz de Priorización de Iniciativas",
      tipo: "matrix-checkbox",
      matrixConfig: {
        rows: [
          { label: "ALTO", value: "alto", color: "secondary" },
          { label: "BAJO", value: "bajo", color: "accent" }
        ],
        columns: [
          { label: "ALTO", value: "alto", color: "secondary" },
          { label: "BAJO", value: "bajo", color: "accent" }
        ],
        combinations: [
          { row: "alto", col: "alto", label: "ALTO-ALTO", description: "Alto impacto -alto esfuerzo/coste", color: "bg-red-500" },
          { row: "alto impacto", col: "bajo esfuerzo/coste", label: "ALTO-BAJO", description: "Prioridad media - Planificar", color: "bg-yellow-500" },
          { row: "bajo impacto", col: "alto esfuerzo/coste", label: "BAJO-ALTO", description: "Prioridad media - Monitorear", color: "bg-yellow-500" },
          { row: "bajo impacto", col: "bajo esfuerzo/coste", label: "BAJO-BAJO", description: "Baja prioridad - Revisar periódicamente", color: "bg-green-500" }
        ]
      },
      multipleSelection: false,
    },
    {
      id: 15,
      numero: 16,
      texto: "Plan de Acción - Inversión Necesaria",
      tipo: "textarea",
      ayuda: "¿Cuál es el capital estimado que necesitas para poner en marcha el plan? Por favor, desglosa la inversión necesaria para el corto, mediano y largo plazo."
    },
    {
      id: 16,
      numero: 17,
      texto: "Gestionando el Cambio",
      tipo: "textarea",
      ayuda: "Impulsores de la transformación digital en la organización"
    },
    {
      id: 17,
      numero: 18,
      texto: "Formación Necesaria",
      tipo: "textarea",
      ayuda: "¿Qué cursos o programas de capacitación son prioritarios? Dime qué personas o departamentos deben recibirlos y cuál sería la duración estimada de este plan formativo."
    }
  ];
}
