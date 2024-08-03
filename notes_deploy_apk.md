# How to deploy

## Commands to generate apk

```sh
npm run build
npm i @capacitor/ios @capacitor/android
npm install @capacitor/cli@latest @capacitor/core@latest
npm install capacitor-resources
```

```sh
npx cap add android
npx cap open android
yarn run resources
```

Si ya existe el android se ha de:

```sh
yarn build
npx cap copy android
```

 Para publicar nuevas versiones de producción se ha de buscar en android studio:

```sh
- versionName "1.1"
```

E incrementarlo junto con el versionCode para que nos lo detecte como diferente

## Genate commands

Para generar los iconos: <https://stackoverflow.com/questions/61648428/how-to-replace-icon-and-splash-in-capacitor>

npx cap add ios
npx cap open ios

Upgrade dependencies dinamically:

```sh
yarn upgrade-interactive --latest
```
