# O-PLUS TV · app de Android

1. Crea un repositorio nuevo en GitHub (por ejemplo `oplus-android`) y sube TODO el contenido de esta carpeta
   (incluida `.github/workflows/build-apk.yml`).
2. Entra a la pestaña **Actions**. La compilación arranca sola (o pulsa "Compilar APK" > Run workflow). Tarda unos 5-10 minutos.
3. Cuando termine con una palomita verde, abre esa ejecución y descarga **OPLUS-TV-apk** (abajo, en Artifacts). Descomprime el zip: dentro está `app-debug.apk`.
4. Pasa el APK al celular, ábrelo y permite "instalar apps desconocidas" cuando Android lo pida.

Para actualizar la app: cambia `www/index.html` en el repositorio y GitHub genera un APK nuevo solo.
Los canales NO necesitan APK nuevo: se siguen administrando desde el panel.

## Notas
- La app va en vertical; solo gira a horizontal al usar el botón de pantalla completa (esquina del video).
- Si cambias `appId` en `capacitor.config.json`, cambia también la línea `package` de los dos archivos de `native/`
  y la carpeta destino en el paso "Código nativo" del workflow (`com/oplustv/app`).
- `www/app.css` y `www/app.js` son la "piel" exclusiva de la app; la página web no los usa.
- Las librerías del reproductor (hls.js, Plyr, mpegts.js) y la tipografía Poppins van DENTRO de la app (`www/vendor/`), así que
  la app abre aunque el internet esté lento. Solo los canales, la lista (Firebase) y la guía necesitan conexión.
- Pantalla completa: la app gira a horizontal, esconde las barras del sistema y el video se ajusta SIN recortarse (`object-fit: contain`).
  Mientras gira se muestra una cortina negra para que nunca se vea el video "ampliado" a medio giro.
  En pantalla completa un toque en el video muestra/oculta los controles (nombre del canal, canal anterior/siguiente y salir); no pausa.
- La barra inferior (En vivo · Favoritos · Guía · Buscar) se ve siempre y solo se esconde en pantalla completa.
- Si la app pasa más de 45 s en segundo plano, al volver reconecta el canal en vivo.
- Cambios en `native/*.java` requieren compilar un APK nuevo (GitHub Actions lo hace al subir los cambios).

