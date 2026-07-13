# Levantamientos Topograficos V 1.0

Sitio web basado en `V 1.0.docx` para registrar observaciones topograficas en GMS, calcular coordenadas Este/Norte y visualizar la forma del terreno en tiempo real.

## Uso

Abra `index.html` en el navegador o ejecute un servidor local desde esta carpeta.

```powershell
python -m http.server 5173
```

Funciones incluidas:

- Coordenadas iniciales E0/N0.
- Observaciones con numero de punto, grados, minutos, segundos y distancia.
- Conversion GMS a grados decimales.
- Calculo de coordenadas Este/Norte por radiacion o poligonal.
- Grafica en canvas con etiquetas, lineas, cierre y cuadricula.
- Area y perimetro del terreno.
- Guardado automatico en el navegador.
- Importacion y exportacion CSV.
