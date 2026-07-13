# Levantamientos Topográficos V 1.2

Aplicación web para registrar observaciones topográficas en GMS, calcular coordenadas Este/Norte y organizar diferentes objetos dentro de un mismo levantamiento.

## Uso

Abra `index.html` directamente o inicie un servidor local desde esta carpeta:

```powershell
python -m http.server 5175
```

Después abra `http://127.0.0.1:5175` en el navegador.

## Funciones principales

- Coordenadas iniciales E0/N0 y punto BM fijo en esa posición.
- Cálculo por radiación o poligonal.
- Conversión de GMS a azimut decimal, rumbo y proyecciones.
- Zonas independientes de tipo polígono, línea o puntos.
- Color, descripción, visibilidad, referencia y cierre por zona.
- Validación de numeración, coordenadas duplicadas, filas incompletas y figuras cruzadas.
- Área y perímetro por polígono; longitud por línea.
- Reordenamiento y renumeración de puntos.
- Deshacer y rehacer cambios, incluido el borrado de valores.
- Guardado local compatible con proyectos de la versión anterior.
- Importación y exportación CSV con información de zonas.
- Exportación de coordenadas TXT en tabla y cálculos separados por zona.
- Exportación de la gráfica como imagen e informe para impresión o PDF.
- Gráfica cuadrada con leyenda, zoom y desplazamiento.
- Interfaz técnica oscura con barra de herramientas agrupada.
- Panel lateral de configuración y edición rápida de la zona activa.
- Resultados compactos debajo de la gráfica.
- Menús plegables y distribución en dos columnas para celulares.
