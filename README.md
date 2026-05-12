# Esplendida — Winter Drop 01

Landing page de pre-lanzamiento para el drop de invierno de Esplendida. Los visitantes eligen los productos que les interesan y dejan su email para ser notificados cuando el drop esté disponible. Los registros se guardan automáticamente en Google Sheets.

## Stack

- HTML / CSS / JS estático (sin frameworks)
- Google Apps Script como backend (escribe a Google Sheets)
- Deploy en Vercel

## Setup

### 1. Google Sheets + Apps Script

1. Crear una planilla en [sheets.google.com](https://sheets.google.com) y nombrarla `Esplendida Drop`
2. Ir a **Extensiones → Apps Script**
3. Borrar el código default y pegar el contenido de `appsscript.gs`
4. Hacer click en **Implementar → Nueva implementación**
   - Tipo: *Aplicación web*
   - Ejecutar como: *Yo*
   - Quién tiene acceso: *Cualquier persona*
5. Copiar la URL generada

### 2. Configurar el frontend

En `script.js`, reemplazar los valores en las primeras líneas:

```js
const APPS_SCRIPT_URL   = 'TU_URL_AQUI';
const APPS_SCRIPT_TOKEN = 'esplendida-drop-2026'; // debe coincidir con TOKEN en appsscript.gs
```

### 3. Deploy en Vercel

1. Pushear el repo a GitHub
2. Ir a [vercel.com](https://vercel.com) → **Add New Project**
3. Importar el repo → Framework: **Other** → **Deploy**

Cada `git push` redeploya automáticamente.

## Estructura

```
Esplendida/
├── index.html          # Página principal
├── style.css           # Estilos
├── script.js           # Lógica + integración con Apps Script
├── appsscript.gs       # Backend (pegar en Google Apps Script)
├── vercel.json         # Config de deploy
└── Productos/          # Imágenes de productos
```

## Agregar o modificar productos

Editar el array `PRODUCTS` en `script.js`:

```js
{
  id: 'id-unico',
  name: 'Nombre del producto',
  description: 'Descripción corta.',
  image: 'Productos/imagen.png',
  variants: [                          // opcional
    { label: 'Color 1', image: 'Productos/imagen-c1.png' },
    { label: 'Color 2', image: 'Productos/imagen-c2.png' },
  ],
}
```

## Formato de datos en la planilla

| Fecha | Email | Producto | Color |
|-------|-------|----------|-------|
| 12/05/2026 20:13 | usuario@mail.com | Cartera Tote con Tachas | Natural |
| 12/05/2026 20:13 | usuario@mail.com | Bufanda | Unico |

Una fila por producto por registro.
