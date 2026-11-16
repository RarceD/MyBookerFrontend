# Build de iOS con GitHub Actions

El workflow `.github/workflows/ios-testflight.yml` genera el proyecto iOS de Capacitor, firma y exporta un `.ipa`, lo guarda como artefacto descargable de Actions y sube la misma compilación a TestFlight.

## Secretos necesarios en GitHub Actions

Añade estos valores en **Repository → Settings → Secrets and variables → Actions**:

| Secreto | Valor |
| --- | --- |
| `IOS_TEAM_ID` | Apple Developer Team ID (10 characters) |
| `IOS_CERTIFICATE_BASE64` | Base64 of the Apple Distribution `.p12` certificate |
| `IOS_CERTIFICATE_PASSWORD` | Password used when exporting the `.p12` |
| `IOS_PROVISIONING_PROFILE_BASE64` | Base64 of an App Store distribution `.mobileprovision` profile for `meApunto.online` |
| `APP_STORE_CONNECT_KEY_ID` | App Store Connect API key ID |
| `APP_STORE_CONNECT_ISSUER_ID` | App Store Connect API issuer ID |
| `APP_STORE_CONNECT_PRIVATE_KEY_BASE64` | Base64 of the API key `.p8` file |

El certificado y el perfil de aprovisionamiento deben pertenecer al mismo equipo de Apple Developer. El perfil debe ser de distribución **App Store Connect** y corresponder al bundle ID `meApunto.online`.

En macOS, genera los valores en Base64:

```sh
base64 -i Certificates.p12 | tr -d '\n'
base64 -i AppStore.mobileprovision | tr -d '\n'
base64 -i AuthKey_XXXXXXXXXX.p8 | tr -d '\n'
```

En Linux, usa `base64 -w 0 < archivo`. Copia cada resultado en el secreto correspondiente; no subas al repositorio los certificados ni las claves API.

## Ejecutar una compilación

- En **Actions → iOS TestFlight → Run workflow**, ejecuta el workflow e introduce la versión (por ejemplo, `1.2.0`), o
- Publica una etiqueta de versión como `ios-v1.2.0`.

El workflow usa el número de ejecución de GitHub como número de compilación de iOS. Cuando termine, descarga el `.ipa` en la sección **Artifacts** de esa ejecución. La compilación aparecerá en TestFlight cuando Apple termine de procesarla.
