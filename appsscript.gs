// Google Apps Script — Esplendida Drop Registros
// Instrucciones de setup al final del archivo.

const SHEET_NAME = 'Registros';

function doPost(e) {
  try {
    const ss    = SpreadsheetApp.getActiveSpreadsheet();
    let sheet   = ss.getSheetByName(SHEET_NAME);

    // Crear hoja con encabezados si no existe
    if (!sheet) {
      sheet = ss.insertSheet(SHEET_NAME);
      const header = sheet.getRange(1, 1, 1, 4);
      header.setValues([['Fecha', 'Email', 'Producto', 'Color']]);
      header.setFontWeight('bold');
      header.setBackground('#1a1a1a');
      header.setFontColor('#C5A35C');
      sheet.setFrozenRows(1);
      sheet.setColumnWidth(1, 150);
      sheet.setColumnWidth(2, 220);
      sheet.setColumnWidth(3, 200);
      sheet.setColumnWidth(4, 120);
    }

    const data  = JSON.parse(e.postData.contents);
    const fecha = Utilities.formatDate(
      new Date(),
      'America/Argentina/Buenos_Aires',
      'dd/MM/yyyy HH:mm'
    );

    // Una fila por producto seleccionado
    data.productos.forEach(function(p) {
      sheet.appendRow([fecha, data.email, p.nombre, p.color]);
    });

    return ContentService
      .createTextOutput(JSON.stringify({ ok: true }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ ok: false, error: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// Endpoint de prueba — abrí esta URL en el browser para verificar que el deploy funciona
function doGet() {
  return ContentService
    .createTextOutput(JSON.stringify({ ok: true, status: 'Esplendida backend activo' }))
    .setMimeType(ContentService.MimeType.JSON);
}

/*
═══════════════════════════════════════════════════════
  SETUP (una sola vez, 5 minutos)
═══════════════════════════════════════════════════════

1. Crear la Google Sheet
   - Ir a sheets.google.com → crear planilla nueva → nombrarla "Esplendida Drop"
   - Compartirla con todos los que quieran ver los registros

2. Abrir Apps Script
   - En la planilla: Extensiones → Apps Script
   - Borrar el código de ejemplo y pegar TODO el contenido de este archivo

3. Hacer deploy
   - Clic en "Implementar" → "Nueva implementación"
   - Tipo: Aplicación web
   - Ejecutar como: Yo (tu cuenta de Google)
   - Quién tiene acceso: Cualquier persona
   - Clic en "Implementar" → copiar la URL que aparece

4. Pegar la URL en script.js
   - Abrir script.js
   - Reemplazar 'PASTE_APPS_SCRIPT_URL_HERE' con la URL copiada

5. Verificar
   - Abrir la URL en el browser → debería mostrar {"ok":true,"status":"Esplendida backend activo"}
   - Hacer una prueba desde la página web → verificar que aparece una fila en la planilla

Nota: si hacés cambios al script, hay que crear una nueva implementación
(no "editar" la existente) para que los cambios tomen efecto.
═══════════════════════════════════════════════════════
*/
