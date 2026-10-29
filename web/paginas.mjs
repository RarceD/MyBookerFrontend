// Páginas comerciales de MeApunto: HTML estático en public/<ruta>/index.html, servido por el mismo nginx que la app.
// La raíz (meapunto.online/) sigue siendo el acceso de los vecinos: estas páginas viven en rutas propias del dominio.
// Solo afirmaciones comprobadas en el código de la app (src/) o en los datos de Hexenta. Nada de nombres de
// urbanizaciones ni testimonios sin su permiso. Se regeneran con `node web/generar.mjs`.

export const CONTACTO = 'mailto:meapunto.online@gmail.com?subject=Informaci%C3%B3n%20de%20MeApunto%20para%20nuestra%20comunidad';

const PASOS = `
      <h2>Cómo funciona</h2>
      <ol class="pasos">
        <li><strong>Configuramos tu urbanización.</strong> Las pistas de pádel y tenis y las salas que se pueden reservar, con las normas de la comunidad.</li>
        <li><strong>Cada vivienda recibe una carta con su código.</strong> Con él crea su cuenta en meapunto.online. Una cuenta por vivienda: si ya existe, la app lo avisa.</li>
        <li><strong>Los vecinos reservan desde el móvil.</strong> Eligen día, pista y tiempo, y ven sus próximas reservas y las de los demás.</li>
      </ol>`;

const RESUELVE = `
      <h2>Qué cambia en la comunidad</h2>
      <ul class="lista">
        <li><strong>Todos ven las reservas.</strong> Cada vecino ve las suyas y las de los demás, así que no hay discusiones por la pista.</li>
        <li><strong>Solo reservan los vecinos.</strong> Para crear la cuenta hace falta el código único de la vivienda, que llega por carta.</li>
        <li><strong>Las normas, dentro de la app.</strong> Los vecinos las consultan antes de reservar.</li>
        <li><strong>Un panel para la administración.</strong> Buscar viviendas, crear cuentas, cambiar el correo o la contraseña de un vecino y comprobar si un código está libre.</li>
        <li><strong>Una factura al año.</strong> Una cuota anual por comunidad, fácil de meter en el presupuesto de la junta.</li>
      </ul>`;

const PRUEBA = `
      <p class="prueba">Ya reservan con MeApunto seis urbanizaciones, con unas 870 viviendas.</p>`;

export const PAGINAS = [
  {
    ruta: '/comunidades/',
    palabra: 'app comunidad de vecinos',
    tituloSeo: 'App de reservas para comunidades de vecinos: pádel, tenis y salas | MeApunto',
    descripcion: 'App de reservas para comunidades de vecinos y urbanizaciones: pistas de pádel y tenis y salas, un código por vivienda y las reservas a la vista de todos. Una cuota anual.',
    h1: 'App de reservas para comunidades de vecinos',
    p1: 'MeApunto es la app de reservas para comunidades de vecinos y urbanizaciones: cada vivienda reserva las pistas de pádel y tenis y las salas desde el móvil, y todos ven quién tiene la pista y cuándo.',
    cuerpo: PRUEBA + PASOS + RESUELVE,
    preguntas: [
      ['¿Qué se puede reservar?', 'Pistas de pádel, pistas de tenis y salas de la urbanización, como un gimnasio o una sala común.'],
      ['¿Cómo se dan de alta los vecinos?', 'Cada vivienda recibe una carta con su código único y con él crea su cuenta en meapunto.online. Si la vivienda ya tiene cuenta, la app lo avisa.'],
      ['¿Hay que instalar algo?', 'No. Los vecinos entran en meapunto.online desde el navegador del móvil o del ordenador.'],
      ['¿Qué puede hacer la administración?', 'Desde su panel busca viviendas, crea cuentas, cambia el correo o la contraseña de un vecino y comprueba si un código está libre.'],
      ['¿Cuánto cuesta?', 'Una cuota anual por comunidad, con una sola factura. Escríbenos y te decimos el precio para la tuya.'],
    ],
  },
  {
    ruta: '/reservar-pista-padel-urbanizacion/',
    palabra: 'reservar pista de pádel urbanización',
    tituloSeo: 'Reservar la pista de pádel de tu urbanización desde el móvil | MeApunto',
    descripcion: 'Para reservar la pista de pádel de la urbanización sin cuadrantes ni grupos: cada vivienda reserva desde el móvil y todos ven las reservas. Así lo hacen ya seis urbanizaciones.',
    h1: 'Reservar la pista de pádel de la urbanización, desde el móvil',
    p1: 'Con MeApunto, reservar la pista de pádel de la urbanización es elegir día, pista y tiempo en el móvil. Cada vivienda reserva con su cuenta y todos ven quién juega y cuándo.',
    cuerpo: PRUEBA + `
      <h2>Para el vecino</h2>
      <ul class="lista">
        <li>Ve los días disponibles, elige pista y tiempo y confirma.</li>
        <li>Consulta sus próximas reservas y las de los demás vecinos.</li>
        <li>Borra una reserva si al final no va a jugar.</li>
        <li>Tiene a mano las normas de la pista.</li>
      </ul>` + PASOS,
    preguntas: [
      ['¿Sirve también para tenis o para otras salas?', 'Sí. Además del pádel, la comunidad puede tener pistas de tenis y salas para reservar.'],
      ['¿Cómo se evita que reserve gente de fuera?', 'Para crear la cuenta hace falta el código único de la vivienda, que llega por carta a cada casa.'],
      ['¿Se puede anular una reserva?', 'Sí, el vecino la borra desde sus próximas reservas mientras no haya pasado.'],
      ['¿Cómo lo ponemos en nuestra urbanización?', 'Escríbenos con el nombre de la comunidad y las pistas que tenéis, y te contamos cómo se hace y el precio.'],
    ],
  },
  {
    ruta: '/administradores-de-fincas/',
    palabra: 'app para administradores de fincas',
    tituloSeo: 'Reservas de pistas para las comunidades que administras | MeApunto',
    descripcion: 'Para administradores de fincas: las comunidades con pistas de pádel o tenis reservan desde el móvil, con un código por vivienda y un panel para gestionar las cuentas.',
    h1: 'Reservas de pistas para las comunidades que administras',
    p1: 'MeApunto es la app para administradores de fincas que quieren quitarse de encima las reservas de pistas: cada vivienda reserva desde el móvil con su código, y tú gestionas las cuentas desde un panel.',
    cuerpo: PRUEBA + `
      <h2>Lo que te ahorras</h2>
      <ul class="lista">
        <li><strong>Las quejas por la pista:</strong> las reservas están a la vista de todos los vecinos.</li>
        <li><strong>Las altas a mano:</strong> cada vivienda crea su cuenta con el código de su carta.</li>
        <li><strong>Las llamadas por contraseñas:</strong> el vecino la restablece solo desde la app.</li>
      </ul>` + PASOS,
    preguntas: [
      ['¿Qué tengo que hacer yo?', 'Pasarnos las pistas, las normas y las viviendas de la comunidad. Preparamos el código de cada vivienda para las cartas y lo dejamos funcionando.'],
      ['¿Y si un vecino no puede entrar?', 'Puede restablecer la contraseña desde la app. Si hace falta, desde el panel cambias su correo o su contraseña.'],
      ['¿Cómo se factura?', 'Una cuota anual por comunidad, con una sola factura.'],
      ['¿Podemos verlo antes?', 'Sí. Escríbenos y te lo enseñamos.'],
    ],
  },
  {
    ruta: '/normas-pista-padel-comunidad/',
    palabra: 'normas pista pádel comunidad',
    tituloSeo: 'Normas de la pista de pádel de una comunidad de vecinos: modelo | MeApunto',
    descripcion: 'Modelo de normas para la pista de pádel de una comunidad de vecinos: reservas, horarios, invitados, uso y cuidado de la pista. Para adaptar y aprobar en junta.',
    h1: 'Normas de la pista de pádel de una comunidad: un modelo para adaptar',
    p1: 'Estas normas de la pista de pádel de una comunidad de vecinos son un punto de partida para adaptar y aprobar en junta. Cada comunidad decide horarios, límites e invitados según sus estatutos.',
    cuerpo: `
      <p class="aviso">Es un modelo orientativo, no asesoramiento jurídico. Lo que vale en tu comunidad es lo que apruebe la junta y lo que digan sus estatutos.</p>
      <h2>Modelo de normas</h2>
      <ol class="pasos">
        <li><strong>Quién puede usarla.</strong> Los propietarios e inquilinos de las viviendas de la comunidad y sus acompañantes, según lo que apruebe la junta.</li>
        <li><strong>Reservas.</strong> La pista se reserva con antelación por el sistema que fije la comunidad. Sin reserva, se puede usar solo si está libre y hasta que llegue quien la tenga reservada.</li>
        <li><strong>Duración y límite.</strong> Cada reserva dura el tiempo que fije la comunidad, por ejemplo 60 o 90 minutos, con un máximo de reservas por vivienda y día.</li>
        <li><strong>Horario.</strong> La pista se usa dentro del horario aprobado, respetando el descanso de los vecinos.</li>
        <li><strong>Invitados.</strong> Cada vivienda puede traer invitados, con el límite que fije la comunidad, y responde de su comportamiento.</li>
        <li><strong>Anulaciones.</strong> Quien no vaya a usar su reserva la anula con tiempo para que otro vecino pueda jugar.</li>
        <li><strong>Cuidado de la pista.</strong> Calzado adecuado, sin comida ni vidrio en la pista, y dejarla limpia y con la puerta cerrada.</li>
        <li><strong>Menores.</strong> Los menores de la edad que fije la comunidad, acompañados por un adulto.</li>
        <li><strong>Incumplimientos.</strong> La junta puede suspender temporalmente las reservas de una vivienda que incumpla las normas.</li>
      </ol>
      <h2>Las normas, dentro de la app</h2>
      <p>En MeApunto las normas de la comunidad están en la propia app, a mano antes de reservar, y cada vivienda reserva con su cuenta. Así no hace falta un cuadrante en papel.</p>`,
    preguntas: [
      ['¿Quién aprueba las normas de la pista?', 'La junta de propietarios, según los estatutos de la comunidad.'],
      ['¿Se puede limitar el número de reservas por vivienda?', 'Sí, es habitual fijar un máximo por vivienda y día o por semana. Lo decide la comunidad.'],
      ['¿Cómo se reserva la pista en MeApunto?', 'Cada vivienda crea su cuenta con el código de su carta y reserva desde el móvil eligiendo día, pista y tiempo.'],
    ],
  },
];
