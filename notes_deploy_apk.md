



npm run build
npm i @capacitor/ios @capacitor/android
npm install @capacitor/cli@latest @capacitor/core@latest
npm install capacitor-resources


npx cap add android
npx cap open android


// Si ya existe el android se ha de:
npx cap copy android

[] Para publicar nuevas versiones de producción se ha de buscar en android studio:
- versionName "1.1"
e incrementarlo junto con el versionCode para que nos lo detecte como diferente


// Para generar los iconos: https://stackoverflow.com/questions/61648428/how-to-replace-icon-and-splash-in-capacitor



npx cap add ios
npx cap open ios