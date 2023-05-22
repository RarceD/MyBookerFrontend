import { Button } from '@mui/material';
import { useNavigate } from 'react-router';
import './pagesStyles.css';

const companyName: string = "MeApunto.Online";
type TPrivacyDto = {
    title: string,
    content: string
}
const privacyData: TPrivacyDto[] = [

    {
        title: "POLITICA DE PRIVACIDAD",
        content: "Última actualización: Enero 2023."
    },


    {
        title: "1. INFORMACIÓN AL USUARIO",
        content: companyName + ` , S.L., como Responsable del Tratamiento, le informa que, según lo dispuesto en el Reglamento (UE) 2016/679, de 27 de abril, (RGPD) y en la L.O. 3/2018, de 5 de diciembre, de protección de datos y garantía de los derechos digitales (LOPDGDD), trataremos su datos tal y como reflejamos en la presente Política de Privacidad.
                En esta Política de Privacidad describimos cómo recogemos sus datos personales y por qué los recogemos, qué hacemos con ellos, con quién los compartimos, cómo los protegemos y sus opciones en cuanto al tratamiento de sus datos personales.
                Esta Política se aplica al tratamiento de sus datos personales recogidos por la empresa para la prestación de sus servicios. Si acepta las medidas de esta Política, acepta que tratemos sus datos personales como se define en esta Política.
               `
    },
    {
        title: "2. CONTACTO",
        content: `
                Denominación social: ` + companyName + `, S.L.
                Domicilio: Burgos, Burgos y nuestro email: `+ companyName + `@gmail.com
        `
    },
    {
        title: "3. PRINCIPIOS CLAVE",
        content: `
Siempre hemos estado comprometidos con prestar nuestros servicios con el más alto grado de calidad, lo que incluye tratar sus datos con seguridad y transparencia.Nuestros principios son:

    Legalidad: Solo recopilaremos sus Datos personales para fines específicos, explícitos y legítimos.
Minimización de datos: Limitamos la recogida de datos de carácter personal a lo que es estrictamente relevante y necesario para los fines para los que se han recopilado.
Limitación de la Finalidad: Solo recogeremos sus datos personales para los fines declarados y solo según sus deseos.
        Precisión: Mantendremos sus datos personales exactos y actualizados.
Seguridad de los Datos: Aplicamos las medidas técnicas y organizativas adecuadas y proporcionales a los riesgos para garantizar que sus datos no sufran daños, tales como divulgación o acceso no autorizado, la destrucción accidental o ilícita o su pérdida accidental o alteración y cualquier otra forma de tratamiento ilícito.
Acceso y Rectificación: Disponemos de medios para que acceda o rectifique sus datos cuando lo considere oportuno.
        Conservación: Conservamos sus datos personales de manera legal y apropiada y solo mientras es necesario para los fines para los que se han recopilado.
Las transferencias internacionales: cuando se dé el caso de que sus datos vayan a ser transferidos fuera de la UE / EEE se protegerán adecuadamente.
        Terceros: El acceso y transferencia de datos personales a terceros se llevan a cabo de acuerdo con las leyes y reglamentos aplicables y con las garantías contractuales adecuadas.
Marketing Directo y cookies: Cumplimos con la legislación aplicable en materia de publicidad y cookies.
        `
    },
    {
        title: "4. RECOGIDA Y TRATAMIENTO DE SUS DATOS PERSONALES",
        content: `
Las tipos de datos que se pueden solicitar y tratar son:

    Datos de carácter identificativo.
También recogemos de forma automática datos sobre su visita a nuestro sitio web  según se describe en la política de cookies.

Siempre que solicitemos sus Datos personales, le informaremos con claridad de qué datos personales recogemos y con qué fin.En general, recogemos y tratamos sus datos personales con el propósito de:

    Proporcionar información, servicios, productos, información relevante y novedades en el sector.
Envío de comunicaciones.
        `
    },
    {
        title: "5. LEGITIMIDAD",
        content: `
De acuerdo con la normativa de protección de datos aplicable, sus datos personales podrán tratarse siempre que:

    Nos ha dado su consentimiento a los efectos del tratamiento.Por supuesto podrá retirar su consentimiento en cualquier momento.
Por requerimiento legal.
Por exisitr un interés legítimo que no se vea menoscabado por sus derechos de privacidad, como por ejemplo el envío de información comercial bien por suscripción a nuestra newsletter o por su condición de cliente.
Por se necesaria para la prestación de alguno de nuestros servicios mediante relación contractual entre usted y nosotros.
        `
    },

    {
        title: "7. SUS DERECHOS",
        content: `
En relación con la recogida y tratamiento de sus datos personales, puede ponerse en contacto con nosotros en cualquier momento para:

    Acceder a sus datos personales y a cualquier otra información indicada en el Artículo 15.1 del RGPD.
Rectificar sus datos personales que sean inexactos o estén incompletos de acuerdo con el Artículo 16 del RGPD.
Suprimir sus datos personales de acuerdo con el Artículo 17 del RGPD.
Limitar el tratamiento de sus datos personales de acuerdo con el Artículo 18 del RGPD.
Solicitar la portabilidad de sus datos de acuerdo con el Artículo 20 del RGPD.
Oponerse al tratamiento de sus datos personales de acuerdo con el artículo 21 del RGPD.
Si ha otorgado su consentimiento para alguna finalidad concreta, tiene derecho a retirar el consentimiento otorgado en cualquier momento, sin que ello afecte a la licitud del tratamiento basado en el consentimiento previo a su retirada rrhh.
Puede ejercer estos derechos enviando comunicación, motivada y acreditada, a` + companyName + `@gmail.com
También tiene derecho a presentar una reclamación ante la Autoridad de control competente(www.aepd.es) si considera que el tratamiento no se ajusta a la normativa vigente.
        `
    },

    {
        title: "8. INFORMACIÓN LEGAL",
        content:
            `
        Los requisitos de esta Política complementan, y no reemplazan, cualquier otro requisito existente bajo la ley de protección de datos aplicable, que será la que prevalezca en cualquier caso.
        Esta Política está sujeta a revisiones periódicas y la empresa puede modificarla en cualquier momento.Cuando esto ocurra, le avisaremos de cualquier cambio y le pediremos que vuelva a leer la versión más reciente de nuestra Política y que confirme su aceptación.
        `
    }
]
export const Privacy = () => {
    const navigate = useNavigate();
    return (
        <>
            <div className="privacyBtnContainer">
                <Button 
                    variant="contained"
                    onClick={()=> navigate("/")}>
                    Regresar a la web
                </Button>
            </div>
            {
                privacyData.map((item: TPrivacyDto) => <div key={item.title} className="privacyContainer">
                    <div className="privacyTitle">{item.title} </div>
                    <div className="privacyContent">{item.content} </div>
                </div>)
            }
        </>
    )
}


export default Privacy;