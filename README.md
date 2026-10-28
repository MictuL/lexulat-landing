# LEXULAT · Landing

Sitio estático (HTML, CSS y JavaScript sin dependencias). No requiere compilación.

## Estructura

```
lexulat-landing/
├── index.html                       Página principal (intro + comunicado)
├── css/
│   └── styles.css                   Hoja de estilo
├── js/
│   ├── main.js                      Menú (Manuales) y panel de términos
│   └── intro.js                     Intro: cargador, terreno de puntos y botón Entrar
└── assets/
    ├── img/
    │   ├── fondo-terreno.jpg        Fondo de la portada
    │   ├── axen-broker-blanco.png   Endoso "by AXEN Broker" del pie
    │   ├── favicon.png              Ícono de pestaña
    │   └── apple-touch-icon.png     Ícono para iPhone / iPad
    └── logos/
        ├── lexulat-logo-completo.svg  Referencia (el sitio usa los logos en línea)
        └── lexulat-logotipo.svg       Referencia
```

## Publicar

Sube la carpeta completa respetando la estructura. En Vercel: nuevo proyecto → framework "Other" → sin comando de build → directorio raíz `lexulat-landing`.

## Notas

- La tipografía Archivo se carga desde Google Fonts.
- Los logos van dentro de `index.html` como SVG para poder animar sus letras.
- El panel de Términos y condiciones sigue en el código sin enlace visible; se abre con `#terminos`.
