import { Box, Button, Divider, Typography } from '@mui/material';
import { useNavigate } from 'react-router';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const companyName = 'MeApunto.Online';

type TPrivacyDto = {
    title: string;
    content: string;
};

const privacyData: TPrivacyDto[] = [
    {
        title: 'POLITICA DE PRIVACIDAD',
        content: 'Última actualización: Enero 2023.',
    },
    {
        title: '1. INFORMACIÓN AL USUARIO',
        content:
            companyName +
            ` , S.L., como Responsable del Tratamiento, le informa que, según lo dispuesto en el Reglamento (UE) 2016/679, de 27 de abril, (RGPD) y en la L.O. 3/2018, de 5 de diciembre, de protección de datos y garantía de los derechos digitales (LOPDGDD), trataremos su datos tal y como reflejamos en la presente Política de Privacidad.
En esta Política de Privacidad describimos cómo recogemos sus datos personales y por qué los recogemos, qué hacemos con ellos, con quién los compartimos, cómo los protegemos y sus opciones en cuanto al tratamiento de sus datos personales.
Esta Política se aplica al tratamiento de sus datos personales recogidos por la empresa para la prestación de sus servicios. Si acepta las medidas de esta Política, acepta que tratemos sus datos personales como se define en esta Política.`,
    },
    {
        title: '2. CONTACTO',
        content: `Denominación social: ${companyName}, S.L.\nDomicilio: Burgos, Burgos y nuestro email: ${companyName}@gmail.com`,
    },
    {
        title: '3. PRINCIPIOS CLAVE',
        content: `Siempre hemos estado comprometidos con prestar nuestros servicios con el más alto grado de calidad, lo que incluye tratar sus datos con seguridad y transparencia. Nuestros principios son:

Legalidad: Solo recopilaremos sus Datos personales para fines específicos, explícitos y legítimos.
Minimización de datos: Limitamos la recogida de datos de carácter personal a lo que es estrictamente relevante y necesario para los fines para los que se han recopilado.
Limitación de la Finalidad: Solo recogeremos sus datos personales para los fines declarados y solo según sus deseos.
Precisión: Mantendremos sus datos personales exactos y actualizados.
Seguridad de los Datos: Aplicamos las medidas técnicas y organizativas adecuadas y proporcionales a los riesgos para garantizar que sus datos no sufran daños.`,
    },
    {
        title: '4. RECOGIDA Y TRATAMIENTO DE SUS DATOS PERSONALES',
        content: `Las tipos de datos que se pueden solicitar y tratar son:
Datos de carácter identificativo.
También recogemos de forma automática datos sobre su visita a nuestro sitio web según se describe en la política de cookies.`,
    },
    {
        title: '5. LEGITIMIDAD',
        content: `De acuerdo con la normativa de protección de datos aplicable, sus datos personales podrán tratarse siempre que nos ha dado su consentimiento, por requerimiento legal, o por existir un interés legítimo.`,
    },
    {
        title: '7. SUS DERECHOS',
        content: `En relación con la recogida y tratamiento de sus datos personales, puede ponerse en contacto con nosotros en cualquier momento para acceder, rectificar, suprimir, limitar, solicitar portabilidad u oponerse al tratamiento de sus datos personales.\nPuede ejercer estos derechos enviando comunicación a ${companyName}@gmail.com`,
    },
    {
        title: '8. INFORMACIÓN LEGAL',
        content: `Los requisitos de esta Política complementan, y no reemplazan, cualquier otro requisito existente bajo la ley de protección de datos aplicable, que será la que prevalezca en cualquier caso.`,
    },
];

export const Privacy = () => {
    const navigate = useNavigate();

    return (
        <Box sx={{ maxWidth: 720, mx: 'auto', px: 3, py: 4 }}>
            {/* Back button */}
            <Button
                variant="outlined"
                startIcon={<ArrowBackIcon />}
                onClick={() => navigate('/')}
                sx={{ mb: 4 }}
            >
                Regresar
            </Button>

            {privacyData.map((item, idx) => (
                <Box key={item.title} sx={{ mb: 4 }}>
                    <Typography
                        variant="subtitle1"
                        fontWeight={700}
                        sx={{ mb: 1, letterSpacing: '-0.01em' }}
                    >
                        {item.title}
                    </Typography>
                    <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ whiteSpace: 'pre-line', textAlign: 'justify', lineHeight: 1.75 }}
                    >
                        {item.content}
                    </Typography>
                    {idx < privacyData.length - 1 && (
                        <Divider sx={{ mt: 3, borderColor: 'divider' }} />
                    )}
                </Box>
            ))}
        </Box>
    );
};

export default Privacy;
