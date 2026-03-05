
# Número Aventuras 🎮🔢

¡Bienvenido a **Número Aventuras**! Una aplicación web educativa diseñada para que niños de 6 a 10 años aprendan a comparar números (mayor que, menor que, igual a) de una forma divertida y visual.

## ✨ Características
- **Optimizado para Tablets:** Sistema de "Tocar y Colocar" (Tap-to-Place) para una experiencia fluida sin necesidad de ratón.
- **Juego Interactivo:** Arrastra o toca los símbolos para comparar números.
- **Sonidos Dinámicos:** Feedback auditivo instantáneo.
- **Dificultad Ajustable:** Configura rangos hasta 100 o 1000.
- **PWA Ready:** Instalación directa desde el navegador sin tiendas de apps.

## 🚀 Instalación en Tablet (Recomendado)
No necesitas un archivo `.apk` para que funcione como una aplicación nativa. 
1. Abre la web en **Chrome** (en Android) o **Safari** (en iPad).
2. Toca el menú de opciones (tres puntos en Chrome o el icono de compartir en Safari).
3. Selecciona **"Añadir a la pantalla de inicio"** o **"Instalar aplicación"**.
4. La app aparecerá en tu escritorio, se abrirá a pantalla completa y tendrá un rendimiento óptimo.

## 📱 ¿Cómo crear una APK? (Opcional)
Si prefieres tener un archivo `.apk` instalable por cualquier motivo, puedes usar **Capacitor**:
1. Descarga el código a tu PC.
2. Instala Capacitor en el proyecto: `npm install @capacitor/core @capacitor/cli @capacitor/android`.
3. Inicializa Capacitor: `npx cap init`.
4. Crea la build del proyecto: `npm run build`.
5. Añade Android: `npx cap add android`.
6. Genera la APK con Android Studio: `npx cap open android`.

## 🛠️ Ejecución Local
1. `npm install`
2. `npm run dev`
Abra [http://localhost:9002](http://localhost:9002).
