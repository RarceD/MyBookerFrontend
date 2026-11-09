interface AppBranding {
    name: string;
    description: string;
    logo: string;
    touchIcon: string;
    manifest: string;
}

const meApuntoBranding: AppBranding = {
    name: 'MeApunto.Online',
    description: 'MeApunto: reserva las pistas de pádel y tenis y las salas de tu urbanización desde el móvil. Acceso para vecinos con el código de su vivienda.',
    logo: '/images/logo1.png',
    touchIcon: '/logo192.png',
    manifest: '/manifest.json',
};

const appDeReservasBranding: AppBranding = {
    name: 'AppDeReservas',
    description: 'AppDeReservas: reserva las pistas de pádel y tenis y las salas de tu urbanización desde el móvil. Acceso para vecinos con el código de su vivienda.',
    logo: '/images/logo.png',
    touchIcon: '/images/logo-appdereservas-192.png',
    manifest: '/manifest.appdereservas.json',
};

export function getAppBranding(hostname: string): AppBranding {
    const normalizedHostname = hostname.toLowerCase().replace(/\.$/, '');

    if (normalizedHostname === 'appdereservas.es' || normalizedHostname.endsWith('.appdereservas.es')) {
        return appDeReservasBranding;
    }

    // MeApunto is also the default for localhost, native apps and preview domains.
    return meApuntoBranding;
}

export const APP_BRANDING = getAppBranding(window.location.hostname);
export const APP_NAME = APP_BRANDING.name;
export const getCorrectLogo = (): string => APP_BRANDING.logo;

export function applyAppBranding(): void {
    document.title = APP_NAME;

    const links = [
        { rel: 'icon', href: APP_BRANDING.logo, type: 'image/png' },
        { rel: 'apple-touch-icon', href: APP_BRANDING.touchIcon, type: 'image/png' },
        { rel: 'manifest', href: APP_BRANDING.manifest, type: 'application/manifest+json' },
    ];

    for (const { rel, href, type } of links) {
        let link = document.querySelector<HTMLLinkElement>(`link[rel~='${rel}']`);
        if (!link) {
            link = document.createElement('link');
            link.rel = rel;
            document.head.appendChild(link);
        }
        link.href = href;
        link.type = type;
    }

    const metadata = {
        author: APP_NAME,
        generator: APP_NAME,
        description: APP_BRANDING.description,
    };

    for (const [name, content] of Object.entries(metadata)) {
        const meta = document.querySelector<HTMLMetaElement>(`meta[name='${name}']`);
        if (meta) meta.content = content;
    }
}
