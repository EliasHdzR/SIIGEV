
# Sistema Integral de Información y Gestión Educativa (SIIGEV)

## Objetivo General

Desarrollar un sistema integral de gestión educativa virtual utilizando
tecnologías y frameworks web modernos, que permita facilitar la
administración de clases, la comunicación entre profesores y alumnos, y
la gestión de materiales y tareas académicas, emulando las
funcionalidades principales de Google Classroom.

## Objetivos Específicos

- Implementar una plataforma con arquitectura frontend-backend desacoplada que soporte la creación y administración de clases virtuales.
  
- Desarrollar una aplicación frontend o dos aplicaciones frontend independientes: una para profesores y otra para alumnos, utilizando frameworks modernos como React, Vue o Angular.
  
- Implementar una o dos aplicaciones backend que proporcionen APIs RESTful utilizando tecnologías como Node.js con Express, Python con FastAPI, PHP con Laravel, Slim y otro framework de PHP, etc.
  
- Desarrollar un sistema de autenticación y control de acceso que diferencie roles entre profesores y alumnos.
  
- Crear un módulo de comunicación que permita a los profesores publicar avisos y a los alumnos consultarlos.
  
- Diseñar un sistema de gestión de tareas que facilite la asignación, entrega y evaluación de actividades académicas.
  
- Implementar un repositorio digital para compartir y organizar materiales de clase.
  
- Garantizar una experiencia de usuario intuitiva y responsiva, adaptable a diferentes dispositivos.
  
- Asegurar la interoperabilidad entre los diferentes componentes del sistema, independientemente de las tecnologías utilizadas en su implementación.

## Restricciones Tecnológicas

### Frontend

- Se desarrollará una o dos aplicaciones frontend independientes:

  - Aplicación para maestros: Interfaz dedicada a la gestión de clases, materiales y evaluación.
  - Aplicación para alumnos: Interfaz enfocada en la participación, consulta y entrega de actividades.

- La aplicación frontend o ambas aplicaciones deben implementarse utilizando frameworks modernos como React, Vue, Angular o similares.

- Se permite usar distintos frameworks para cada aplicación frontend, esto para el caso que haya determinado tener dos aplicaciones frontend.

- Deberán consumir las APIs expuestas por el backend a través de peticiones HTTP.

- Implementación de diseño responsivo para garantizar la compatibilidad con dispositivos móviles y de escritorio. No es necesario un diseño muy bonito o muy elaborado, pero debe ser responsivo (optar por un diseño minimalista).

### Backend

- Se permite desarrollar una o dos aplicaciones backend:

  - Opción 1 - Backend unificado: Una sola aplicación que maneje toda la lógica de negocio.
  - Opción 2 - Backend separado:

    - Uno para la gestión de los maestros
    - Otro para el uso de los alumnos

- Se pueden utilizar diferentes tecnologías para cada aplicación backend:

  - Node.js con Express
  - Python con FastAPI, Fask, Django...
  - Java con Spring Boot
  - PHP con Laravel, Slim, etc.
  - u otras tecnologías similares

- Implementación de REST API para la comunicación con la aplicación o aplicaciones frontend

### Base de Datos

- Libertad para elegir entre bases de datos relacionales (MySQL, PostgreSQL) o NoSQL (MongoDB, Firebase).

- En caso de implementar backends separados, se debe garantizar la consistencia de los datos entre ambos sistemas.

## Casos de Uso para Maestros

### 1. Creación de Clase

**Descripción:** El profesor puede crear un nuevo espacio virtual para
una materia específica.

**Flujo Principal:**

- El profesor accede a la opción \"Crear clase\" desde su panel principal.

- Completa un formulario con la información básica: nombre de la clase, descripción, código del grupo, carrera (este debe ser de un catálogo previamente predefinido), cuatrimestre.

- Se confirma la creación y se redirecciona al espacio de la nueva clase.

**Implementación técnica:**

- Formulario desarrollado con componentes del framework seleccionado.

- Petición POST a la API del backend.



### 2. Agregar Alumnos a la Clase

**Descripción:** El profesor puede incorporar estudiantes a su clase
creada.

**Flujo principal:**

- En el espacio de la clase, el profesor accede a la sección \"Alumnos\".

- Puede registrar alumnos mediante: matrícula o buscando por el nombre del alumno.

- El maestro ve quienes son los alumnos que están registrados en la clase.

**Implementación técnica:**

- Todos los alumnos ya deben estar registrados en la base de datos, por lo que solo se quiere funcionalidad de búsqueda de alumnos, que debe estar implementada en un endpoint de la REST API (backend).

- Al estar el alumno registrado, la clase le debe aparecer en su listado/consulta de clases.

- Validación de que no se agregue más de una vez el alumno a la clase.



### 3. Agregar Avisos

**Descripción:** El profesor puede comunicar información relevante a
todos los alumnos de la clase.

**Flujo principal:**

- En la página principal de la clase, el profesor selecciona \"Crear Aviso\"

- Redacta el contenido del mensaje con opciones de formato de texto

- Puede adjuntar varios archivos, mas no es necesario.

- El sistema notifica a los estudiantes sobre el nuevo aviso agregando este a la página principal de la clase del alumno.

**Implementación técnica:**

- Editor de texto básico (un textarea) para redactar el texto simple del aviso.

- Gestión de almacenamiento de archivos del aviso

- Llamada a la funcionalidad backend para guardar el aviso



### 4. Registrar un Tema de Tareas/Materia de Clase

**Descripción:** El profesor organiza el contenido en temas o unidades.

**Flujo principal:**

- Accede a la sección \"Contenido\" dentro de la clase.

- Selecciona \"Crear nuevo tema\".

- Asigna nombre y descripción del tema.

- El tema queda disponible para agregar materiales y tareas asociadas.

**Implementación técnica:**

- Interfaz para agregar el tema

- Manejo de relaciones entre entidades en el backend



### 5. Agregar Tarea

**Descripción:** El profesor asigna actividades evaluables a los
estudiantes.

**Flujo principal:**

- Dentro de del Contenido de la clase, seleccionar la opción de "Crear Tarea"

- Configura título e instrucciones detalladas (texto simple), además de seleccionar el tema al que pertenece la tarea. Es obligatorio poner el título de la tarea y las instrucciones, así como el tema, ya que cada tarea debe pertenecer a un tema en específico.

- Establece fecha y hora límite de entrega (obligatorio). Validación que la fecha y hora de entrega sean mayores que la fecha actual.

- Adjunta archivos (en una tarea puede haber o no archivos) que sean necesarios para la tarea.

- Publica la tarea en la página principal de la clase en la parte del alumno. También la tarea puede ser vista en el contenido de la materia.

**Implementación técnica:**

- Llamada a endpoint de la REST API, para guardar la tarea así como los archivos adjuntos de esta tarea. Esto puede ser una sola llamada o varias llamadas para guardar cada uno de los archivos.



### 6. Publicar Material de Clase

**Descripción:** El profesor comparte recursos didácticos con los
alumnos.

**Flujo principal:**

- Dentro del contenido de la materia selecciona \"Agregar material\".

- Se selecciona el tema al que pertenece el material, así como se asigna el título y una descripción del material.

- Sube el archivo o los archivos. No es obligatorio

- Publica el material y el sistema notifica a los estudiantes en la página principal de la clase en el apartado del alumno.

**Implementación técnica:**

- Integración con servicios de almacenamiento, guardar los archivos llamando a un endpoint

- Llamada al endpoint (backend) para guardar los datos.



### 7. Revisar/Calificar Tarea

**Descripción:** El profesor evalúa las entregas de los estudiantes.

**Flujo principal:**

- Accede a la sección \"Tareas pendientes de calificación\"

- Selecciona una tarea específica para ver todas las entregas

- Para cada entrega puede:

  - Visualizar o descargar los archivos enviados.
  - Asignar una calificación del 0 al 100.

- Confirma la calificación, que se registra automáticamente.

- El alumno puede ver la calificación en su sección de contenido/tareas

**Implementación técnica:**

- Visualizar el o los archivos entregados por el alumno: el PDF, o imagen.

- Llamada al endpoint específico en el backend para marcar como calificada la tarea así como la asignación de la calificación especificada por el maestro.

## Casos de Uso para Alumnos

### 1. Consultar Clases en las que está Registrado

**Descripción:** El estudiante visualiza todas las clases en las que
está inscrito.

**Flujo principal:**

- Al iniciar sesión, el alumno accede a su panel principal

- Visualiza un tablero con todas sus clases activas. Además en el tablero principal se listan las tareas pendientes de entregar de todas las clases y de estas tareas las fecha-hora límite de entrega.

**Implementación técnica:**

- Dashboard con componentes tipo tarjeta para mostrar las clases, así como en tablero principal mostrar las tareas pendientes de entregar.

- Consulta a la API del backend para alumnos.



### 2. Consultar Avisos (Detalle o página principal de la materia)

**Descripción:** El alumno revisa las comunicaciones de una materia
específica.

**Flujo principal:**

- En su página principal, el alumno visualiza una sección de \"Avisos\"

- Ve un listado cronológico de todos los avisos de sus clases mostrando primero los más recientes.

- Dentro de estos avisos están tanto los avisos generales como los relacionados a la asignación de una nueva tarea por parte del maestro.

**Implementación técnica:**

- Llamada a endpoint del backend para consultar los avisos y mostrarlos en la página principal.



### 3. Consultar Contenido de la Clase

**Descripción:** El estudiante accede al contenido y actividades de una
clase específica, que son las tareas y material de clase.

**Flujo principal:**

- Dentro de una clase, navega a la sección \"Contenido/Temas\".

- Visualiza la estructura organizada por temas/unidades.

- Para cada tema puede ver:

  - Materiales disponibles.
  - Tareas asignadas con sus fechas de entrega.
  - Estado de cada elemento (pendiente, entregado, calificado y su calificación).
  - Descarga o accede a los materiales publicados.

**Implementación técnica:**

- Visualización del archivo (PDF o imagen).

- Llamada al backend al endpoint correspondiente para obtener el contenido (tareas y material didáctico).

- Agrupación del contenido por los temas especificados y que dentro de cada grupo se muestre primero los materiales o tareas más recientes.



### 4. Entregar Tarea

**Descripción:** El alumno envía su trabajo para evaluación por parte
del maestro.

**Flujo principal:**

- Accede a la tarea desde la lista de pendientes o sección de Contenido de la clase.

- Revisa los detalles, instrucciones y anexos (en caso de haber).

- Visualiza la fecha límite y tiempo restante para la entrega

- Adjunta los archivos requeridos o completa la actividad en línea

- Puede guardar borradores antes de la entrega final

- Confirma la entrega

- Recibe notificación cuando su trabajo sea calificado en el detalle de la tarea.

**Implementación técnica:**

- Implementación en frontend de carga de archivos.

- Validación de formatos permitidos: PDF e imágenes.

- Llamada a los endpoints necesarios en el backend para guardar los archivos y marcar la tarea como entregada.

- Validación de que no se puede entregar tareas una vez pasada la fecha-hora límite.

- El alumno puede deshacer la entrega y volver a subir los archivos siempre y cuando la tarea no haya sido calificada ni haya pasado la fecha-hora límite.
