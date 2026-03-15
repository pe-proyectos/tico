# Tico — Product Requirements Document (PRD)

**Versión:** 1.0  
**Fecha:** 14 de marzo de 2026  
**Autor:** Luminari Agency  
**Estado:** Draft  
**URL actual:** https://tico.luminari.agency

---

## Tabla de Contenidos

1. [Resumen Ejecutivo](#1-resumen-ejecutivo)
2. [Análisis Competitivo](#2-análisis-competitivo)
3. [Personas de Usuario](#3-personas-de-usuario)
4. [Flujos de Usuario](#4-flujos-de-usuario-core)
5. [Features MVP (Must-Have)](#5-features-mvp-must-have)
6. [Features V2 (Nice-to-Have)](#6-features-v2-nice-to-have)
7. [Guías de Diseño UI/UX](#7-guías-de-diseño-uiux)
8. [Arquitectura Técnica](#8-arquitectura-técnica)
9. [Monetización](#9-monetización)
10. [Plan de Lanzamiento](#10-plan-de-lanzamiento)
11. [Métricas](#11-métricas-a-trackear)
12. [Riesgos y Mitigaciones](#12-riesgos-y-mitigaciones)

---

## 1. Resumen Ejecutivo

### ¿Qué es Tico?

Tico es una aplicación de transporte diseñada **exclusivamente para Chiclayo y su área metropolitana** (Lambayeque, Perú). A diferencia de plataformas globales como InDrive o DiDi, Tico opera con un modelo de **cero comisión por viaje** — los conductores conservan el 100% de cada tarifa. La monetización se basa en **planes de suscripción mensual** para conductores.

### ¿Por qué existe?

1. **InDrive cobra ~10-15% de comisión** por cada viaje en Perú. Para un taxista que gana S/50-80 al día, eso significa S/150-360 menos al mes.
2. **No existe una app local** optimizada para Chiclayo. Las apps globales no entienden las rutas locales, los nombres de barrios, ni las dinámicas de la ciudad.
3. **Los taxistas chiclayanos usan WhatsApp** para coordinar viajes con clientes regulares. Tico formaliza esto en una plataforma profesional.

### Mercado Objetivo

| Dato | Valor |
|------|-------|
| Población Chiclayo metro | ~800,000 habitantes |
| Departamento Lambayeque | ~1.3 millones |
| Taxis registrados estimados | 15,000-20,000 |
| Penetración smartphone | ~75% (Android dominante) |
| Apps de taxi activas | InDrive (dominante), DiDi (menor), apps locales mínimas |
| Tarifa promedio urbana | S/5-8 (centro), S/10-15 (periferia) |

### Propuesta de Valor

| Para Pasajeros | Para Conductores |
|----------------|------------------|
| Viajes seguros con conductores verificados | 0% comisión — todo lo que cobras es tuyo |
| Precios transparentes basados en distancia | Planes accesibles desde S/0/mes |
| App rápida y simple en español | Dashboard de ganancias en tiempo real |
| Botón de emergencia (105) | Sin penalizaciones por rechazar viajes |

---

## 2. Análisis Competitivo

### 2.1 InDrive en Chiclayo

**Market share estimado:** 60-70% del mercado de apps de taxi en Chiclayo.

| Lo que hace bien | Lo que hace mal |
|------------------|-----------------|
| Modelo de negociación de precio (pasajero propone, conductor contraoferta) | Comisión del 10-15% que irrita a conductores |
| Base grande de usuarios y conductores | Interfaz compleja con demasiadas opciones |
| Marca reconocida | Sin enfoque local — misma app para todo el mundo |
| Sistema de rating funcional | Soporte al cliente lento y genérico |
| | Conductores de fuera de Chiclayo sin conocimiento de la ciudad |

**Modelo de precio InDrive:** El pasajero propone un precio, el conductor acepta o contraoferta. Esto genera fricción y viajes que tardan más en cerrarse.

### 2.2 DiDi en Chiclayo

**Market share estimado:** 15-20%.

| Lo que hace bien | Lo que hace mal |
|------------------|-----------------|
| Interfaz limpia estilo Uber | Menor base de conductores en Chiclayo |
| Precios fijos predeterminados | Comisiones similares a InDrive (~15%) |
| Promociones frecuentes para nuevos usuarios | Promociones terminan y usuarios se van |
| | Poco arraigo en ciudades medianas |

### 2.3 Taxis Tradicionales / WhatsApp

**Market share estimado:** 20-30% (decreciendo).

| Lo que hace bien | Lo que hace mal |
|------------------|-----------------|
| Relación personal conductor-cliente | Sin tracking GPS, sin seguridad |
| Sin comisiones | Sin transparencia de precios |
| Disponibilidad inmediata en calles | No se puede rastrear al conductor |
| | Sin verificación de documentos |
| | Sin recibos ni historial |

### 2.4 Diferenciación de Tico

```
                    InDrive    DiDi    Taxis    TICO
Comisión            10-15%     ~15%    0%       0%
Verificación docs   Básica     Media   Ninguna  Completa
Enfoque local       No         No      Sí       Sí
Tracking GPS        Sí         Sí      No       Sí
Precio              Negociado  Fijo    Negociado Estimado + ajustable
UI en español       Parcial    Parcial N/A      100%
Soporte local       No         No      N/A      Sí (WhatsApp)
Costo conductor     Comisión   Comisión Nada    Suscripción opcional
```

**Ventaja clave:** Un taxista en Chiclayo que hace 40 viajes/día a S/7 promedio = S/280/día. Con InDrive pierde ~S/35/día = **S/1,050/mes en comisiones**. Con Tico PRO paga S/350/mes fijo y ahorra **S/700/mes**.

---

## 3. Personas de Usuario

### 3.1 Pasajero — "María" (Chiclayano Típico)

| Atributo | Detalle |
|----------|---------|
| Edad | 25-45 años |
| Ocupación | Empleada en tienda del centro, ama de casa, estudiante universitaria |
| Dispositivo | Android gama baja-media (Samsung A series, Xiaomi Redmi) |
| Conectividad | Datos móviles limitados (plan de 5-10GB), WiFi en casa |
| Comportamiento | Usa WhatsApp todo el día, Facebook para noticias locales |
| Dolor principal | Inseguridad al tomar taxis en la calle, no saber cuánto le van a cobrar |
| Frecuencia de uso | 3-5 viajes/semana (trabajo, compras, médico) |
| Presupuesto transporte | S/80-150/mes |

**Quote:** *"Quiero pedir un taxi desde mi celular sin tener que regatear el precio y sabiendo que el conductor está verificado."*

### 3.2 Conductor — "Carlos" (Taxista Local)

| Atributo | Detalle |
|----------|---------|
| Edad | 30-55 años |
| Situación | Propietario de su auto o alquila (S/50-70/día) |
| Dispositivo | Android gama media, a veces con soporte de celular en el auto |
| Ingresos brutos | S/60-120/día (S/1,800-3,600/mes) |
| Documentos | DNI, brevete (licencia), SOAT (seguro obligatorio), tarjeta de propiedad |
| Dolor principal | InDrive le cobra comisión, los pasajeros cancelan, tiempos muertos sin viajes |
| Horas de trabajo | 10-14 horas/día, 6 días/semana |
| Tech savviness | Bajo-medio. Sabe usar WhatsApp, Facebook, apps básicas |

**Quote:** *"Con InDrive me descuentan como S/30 diarios. Si hay una app donde no me cobren comisión, la uso mañana mismo."*

### 3.3 Administrador — "Admin Tico"

| Atributo | Detalle |
|----------|---------|
| Rol | Operador de la plataforma (equipo Luminari) |
| Necesidades | Aprobar conductores, monitorear viajes, gestionar planes, resolver disputas |
| Acceso | Panel web desktop |
| Métricas clave | Conductores activos, viajes/día, tasa de conversión free→pago |

---

## 4. Flujos de Usuario Core

### 4.1 Flujo del Pasajero

#### Onboarding (Primera vez)
```
1. Abre la app → Pantalla de bienvenida con logo Tico
2. "Ingresa tu número de WhatsApp" → +51 9XX XXX XXX
3. Recibe OTP por WhatsApp (mensaje automático)
4. Ingresa código de 6 dígitos
5. Pantalla: "¿Cómo te llamas?" → Nombre y apellido
6. Permiso de ubicación (obligatorio para funcionar)
7. → Pantalla principal: mapa con su ubicación
```

#### Solicitar Viaje
```
1. Mapa muestra ubicación actual (pin azul)
2. Toca "¿A dónde vas?" → Campo de búsqueda
3. Escribe destino → Autocompletado con Nominatim/OSM
   - Opciones: dirección, nombre de lugar, barrio conocido
   - También puede tocar en el mapa para seleccionar destino
4. Selecciona destino → Ruta dibujada en mapa
5. Muestra precio estimado: "S/ 7.00 (estimado)"
   - Puede ajustar ±S/1-2 si quiere
6. Toca "Pedir Tico" → Solicitud enviada
7. Pantalla de espera: "Buscando conductor..." (animación)
   - Muestra conductores cercanos en el mapa
   - Timer: si nadie acepta en 60s, puede reintentar o ajustar precio
```

#### Matching & En Viaje
```
8. Conductor acepta → Notificación + pantalla cambia:
   - Foto del conductor, nombre, rating ★
   - Modelo y color del auto, placa
   - "Tu conductor llega en ~4 min"
   - Tracking en tiempo real del conductor acercándose
9. Conductor llega → Notificación "Tu Tico llegó"
   - Puede llamar o enviar WhatsApp al conductor
10. Sube al auto → Conductor marca "Viaje iniciado"
11. Durante el viaje:
    - Mapa muestra ruta y progreso
    - Botón de emergencia visible (🆘 → llama al 105)
    - Puede compartir viaje en tiempo real (link por WhatsApp)
```

#### Completar & Calificar
```
12. Llega al destino → Conductor marca "Viaje completado"
13. Pantalla de resumen:
    - Ruta recorrida
    - Distancia: 3.2 km
    - Duración: 12 min
    - Precio: S/ 7.00
    - Método de pago: Efectivo
14. "¿Cómo estuvo tu viaje?" → ★★★★★ (1-5 estrellas)
    - Tags opcionales: "Amable", "Auto limpio", "Buen conductor"
    - Comentario opcional
15. "¡Gracias!" → Vuelve a pantalla principal
```

### 4.2 Flujo del Conductor

#### Onboarding & Registro
```
1. Descarga app → Selecciona "Soy Conductor"
2. Ingresa número WhatsApp → OTP → Verificación
3. Datos personales:
   - Nombre completo
   - DNI (8 dígitos)
   - Foto selfie (para verificación facial)
4. Documentos del vehículo:
   - Foto del brevete (licencia de conducir) ← sube imagen
   - Foto del SOAT vigente ← sube imagen
   - Foto de tarjeta de propiedad ← sube imagen
   - Foto del vehículo (frontal) ← sube imagen
5. Datos del vehículo:
   - Marca, modelo, año, color
   - Número de placa
6. "Documentos enviados. Te avisamos cuando estés aprobado (24-48h)"
7. Admin revisa → Aprueba o rechaza con motivo
8. Notificación WhatsApp: "¡Felicidades! Tu cuenta de conductor está activa"
```

#### Ir Online & Recibir Viajes
```
1. Abre app → Dashboard de conductor
2. Toggle "Estoy disponible" → ON (verde)
3. Mapa muestra su ubicación, GPS activo
4. Suena notificación: "Nuevo viaje"
   - Muestra: ubicación del pasajero, destino, distancia, precio
   - Timer: 15 segundos para aceptar
5. Toca "Aceptar" (o desliza)
6. Mapa muestra ruta hacia el pasajero
   - Navegación integrada o puede abrir Google Maps/Waze
7. Llega → Toca "Llegué" → Pasajero recibe notificación
8. Pasajero sube → Toca "Iniciar viaje"
9. Mapa muestra ruta al destino
10. Llega → Toca "Completar viaje"
11. Resumen: ganancia S/7.00 (100% para ti)
12. Califica al pasajero ★★★★★
```

#### Dashboard de Ganancias
```
- Vista diaria: viajes completados, ganancia total
- Vista semanal/mensual: gráfico de barras
- Contador de viajes restantes (plan FREE: "Te quedan 12 viajes hoy")
- Si llega al límite: "Mejora tu plan para seguir recibiendo viajes"
- Historial de viajes con detalle
```

### 4.3 Flujo del Administrador

#### Dashboard Principal
```
1. Login en panel web (tico.luminari.agency/admin)
2. Vista general:
   - Conductores online ahora: XX
   - Viajes activos: XX
   - Viajes hoy: XXX
   - Conductores pendientes de aprobación: X
3. Mapa en tiempo real con todos los conductores activos
```

#### Aprobación de Conductores
```
1. Sección "Pendientes" → Lista de conductores
2. Click en conductor → Ver documentos subidos:
   - DNI ← verificar que coincide con datos
   - Brevete ← verificar vigencia
   - SOAT ← verificar vigencia
   - Foto vehículo ← verificar estado
3. Aprobar / Rechazar (con motivo: "SOAT vencido", "Foto borrosa", etc.)
4. Conductor recibe notificación automática
```

#### Gestión de Planes & Trips
```
1. Ver conductores por plan (FREE / PRO / BUSINESS)
2. Ver uso de viajes vs límite
3. Gestionar pagos de suscripciones
4. Reportes: ingresos por suscripciones, conductores activos, churn
```

---

## 5. Features MVP (Must-Have)

Todo lo listado aquí **DEBE funcionar** antes de mostrar Tico a usuarios reales.

### 5.1 Autenticación
- [ ] Login/registro con OTP por WhatsApp (API de WhatsApp Business o servicio como Twilio)
- [ ] Fallback: OTP por SMS si WhatsApp falla
- [ ] Sesión persistente (JWT con refresh token)
- [ ] Roles: pasajero, conductor, admin

### 5.2 Matching en Tiempo Real
- [ ] WebSocket server (Bun native WebSockets via Elysia)
- [ ] Pasajero solicita viaje → broadcast a conductores en radio de 3km
- [ ] Conductor acepta → match instantáneo, notifica al pasajero
- [ ] Si nadie acepta en 60s → ampliar radio o notificar pasajero
- [ ] Solo un conductor puede aceptar (race condition handled server-side)
- [ ] Conductor puede rechazar sin penalización

### 5.3 Tracking GPS en Tiempo Real
- [ ] Conductor envía ubicación cada 3-5 segundos durante viaje activo
- [ ] Pasajero ve movimiento del conductor en mapa (Leaflet + OSM tiles)
- [ ] Geolocation API del browser / Capacitor Geolocation plugin
- [ ] Optimización de batería: reducir frecuencia cuando está en línea recta
- [ ] Guardar ruta completa en DB para historial

### 5.4 Registro de Conductor con Documentos
- [ ] Upload de imágenes: DNI, brevete, SOAT, tarjeta propiedad, foto vehículo
- [ ] Compresión client-side antes de subir (max 2MB por imagen)
- [ ] Almacenamiento: filesystem del servidor o S3-compatible
- [ ] Estado: pendiente → aprobado / rechazado
- [ ] Admin puede ver documentos y aprobar/rechazar

### 5.5 Estimación de Precio
- [ ] Cálculo basado en distancia (OSRM o Nominatim routing)
- [ ] Tarifa base: S/3.50
- [ ] Precio por km: S/1.50
- [ ] Precio mínimo: S/4.00
- [ ] Fórmula: `max(4.00, 3.50 + distancia_km * 1.50)`
- [ ] Mostrar como "estimado" — el precio real puede variar ±10%
- [ ] Surge pricing: NO en MVP (mantener simple y transparente)

### 5.6 Sistema de Rating
- [ ] Pasajero califica conductor (1-5 ★) después de cada viaje
- [ ] Conductor califica pasajero (1-5 ★) después de cada viaje
- [ ] Rating promedio visible en perfil
- [ ] Conductor con rating < 3.5 después de 20 viajes → alerta admin
- [ ] Tags predefinidos: "Amable", "Puntual", "Auto limpio", "Buen manejo"

### 5.7 Historial de Viajes
- [ ] Pasajero: lista de viajes pasados con fecha, ruta, precio, conductor
- [ ] Conductor: lista de viajes con ganancia, pasajero, ruta
- [ ] Detalle del viaje: mapa con ruta, timestamps

### 5.8 Notificaciones Push
- [ ] FCM (Firebase Cloud Messaging) para APK Android
- [ ] Web Push API para navegador
- [ ] Eventos:
  - Conductor acepta viaje
  - Conductor llegó al punto de recojo
  - Viaje completado
  - Documentos aprobados/rechazados
  - Límite de viajes alcanzado (plan FREE)

### 5.9 Botón de Emergencia
- [ ] Botón visible durante todo el viaje (ícono 🆘, color rojo)
- [ ] Al presionar: llama directamente al 105 (PNP Policía Nacional del Perú)
- [ ] Opción secundaria: enviar ubicación actual por WhatsApp a contacto de emergencia
- [ ] Registro en DB de cada activación (para auditoría)

### 5.10 Dashboard de Ganancias (Conductor)
- [ ] Ganancias del día, semana, mes
- [ ] Número de viajes completados vs límite del plan
- [ ] Gráfico simple de ganancias por día (últimos 7 días)
- [ ] Indicador claro de viajes restantes en plan FREE

### 5.11 Panel Admin
- [ ] Login separado con credenciales admin
- [ ] Lista de conductores pendientes con documentos
- [ ] Aprobar/rechazar conductor
- [ ] Ver viajes en tiempo real (mapa)
- [ ] Estadísticas básicas: viajes/día, conductores activos, usuarios registrados

---

## 6. Features V2 (Nice-to-Have)

Funcionalidades para después del lanzamiento, según feedback y tracción.

| Feature | Descripción | Prioridad |
|---------|-------------|-----------|
| **Viajes programados** | Agendar viaje para hora específica (ej: "mañana 6am al aeropuerto") | Alta |
| **Conductores favoritos** | Guardar y solicitar conductor específico | Alta |
| **Chat in-app** | Mensajería entre pasajero y conductor sin compartir número | Media |
| **Múltiples métodos de pago** | Yape, Plin, tarjeta (además de efectivo) | Alta |
| **Programa de referidos** | "Invita a un amigo, ambos ganan S/5 de descuento" | Media |
| **Mapa de calor** | Mostrar zonas de alta demanda a conductores | Media |
| **Viajes compartidos** | Compartir auto con otros pasajeros en ruta similar | Baja |
| **Modo oscuro** | Tema oscuro para conducción nocturna | Baja |
| **Multi-idioma** | Quechua (población rural de Lambayeque) | Baja |
| **Facturación electrónica** | Boletas/facturas automáticas (SUNAT) | Media |
| **Zona aeropuerto** | Cola virtual para taxistas en aeropuerto José Abelardo Quiñones | Alta |

---

## 7. Guías de Diseño UI/UX

### 7.1 Principios de Diseño

1. **Mobile-first:** 90%+ de usuarios estarán en Android gama baja-media. Diseñar para pantallas de 5.5-6.5".
2. **Simple sobre completo:** Menos pantallas, menos opciones, más claridad. Un taxista de 50 años debe entenderlo sin tutorial.
3. **Mapa como protagonista:** La pantalla principal ES el mapa. Todo lo demás es overlay.
4. **Acciones con una mano:** Botones grandes en zona inferior (thumb zone).
5. **Feedback inmediato:** Cada acción debe tener respuesta visual/háptica en <200ms.

### 7.2 Paleta de Colores

Objetivo: profesional, confiable, moderno. Evitar colores infantiles.

| Uso | Color | Hex | Descripción |
|-----|-------|-----|-------------|
| **Primario** | Azul oscuro | `#1A365D` | Confianza, profesionalismo |
| **Acento** | Amarillo taxi | `#F6C744` | Energía, taxis, reconocible |
| **Éxito** | Verde | `#38A169` | Conductor online, viaje completado |
| **Peligro** | Rojo | `#E53E3E` | Emergencia, errores, cancelar |
| **Fondo** | Gris claro | `#F7FAFC` | Fondo de pantallas |
| **Texto** | Gris oscuro | `#2D3748` | Texto principal |
| **Texto sec.** | Gris medio | `#718096` | Texto secundario, hints |
| **Superficie** | Blanco | `#FFFFFF` | Cards, modals, inputs |

**Gradiente de marca:** `linear-gradient(135deg, #1A365D 0%, #2C5282 100%)` — para headers y CTAs principales.

### 7.3 Tipografía

| Uso | Fuente | Peso | Tamaño |
|-----|--------|------|--------|
| Títulos | Inter | Bold (700) | 24-32px |
| Subtítulos | Inter | SemiBold (600) | 18-20px |
| Body | Inter | Regular (400) | 14-16px |
| Caption | Inter | Regular (400) | 12px |
| Botones | Inter | SemiBold (600) | 16px |

**¿Por qué Inter?** Gratis (Google Fonts), excelente legibilidad en pantallas pequeñas, soporte completo de caracteres español (ñ, tildes).

### 7.4 Pantallas Clave

#### Pasajero (14 pantallas core)

| # | Pantalla | Layout |
|---|----------|--------|
| 1 | **Splash** | Logo Tico centrado, fondo gradiente azul |
| 2 | **Login** | Input teléfono + botón "Enviar código por WhatsApp", diseño minimalista |
| 3 | **OTP** | 6 inputs para código, timer de reenvío, teclado numérico |
| 4 | **Registro nombre** | Input nombre + apellido, botón continuar |
| 5 | **Home (mapa)** | Mapa fullscreen + barra inferior "¿A dónde vas?" + menú hamburguesa |
| 6 | **Buscar destino** | Input con autocompletado, historial reciente, lugares guardados |
| 7 | **Confirmar viaje** | Mapa con ruta, card inferior: precio estimado + botón "Pedir Tico" |
| 8 | **Buscando conductor** | Mapa con animación de búsqueda, conductores cercanos como pins |
| 9 | **Conductor asignado** | Card: foto+nombre+rating+auto+placa, ETA, botones llamar/WhatsApp |
| 10 | **En viaje** | Mapa con tracking, ruta, ETA destino, botón emergencia 🆘 |
| 11 | **Viaje completado** | Resumen: ruta, distancia, tiempo, precio. Rating ★★★★★ |
| 12 | **Historial** | Lista de viajes pasados, cada uno con fecha/ruta/precio/conductor |
| 13 | **Perfil** | Nombre, teléfono, rating, contacto emergencia |
| 14 | **Menú lateral** | Historial, perfil, ayuda, sobre Tico, cerrar sesión |

#### Conductor (12 pantallas core)

| # | Pantalla | Layout |
|---|----------|--------|
| 1 | **Registro conductor** | Formulario multi-step con progreso (1/4, 2/4...) |
| 2 | **Upload documentos** | Camera/galería para cada documento, preview, estado |
| 3 | **Pendiente aprobación** | Mensaje "Revisando tus documentos" con ícono de reloj |
| 4 | **Home conductor** | Mapa + toggle online/offline + indicador plan + viajes restantes |
| 5 | **Solicitud entrante** | Modal overlay: pasajero info, pickup, destino, precio, timer 15s |
| 6 | **Navegando a pasajero** | Mapa con ruta, botón "Llegué" |
| 7 | **En viaje** | Mapa con ruta a destino, botón "Completar viaje" |
| 8 | **Viaje completado** | Resumen ganancia, rating pasajero |
| 9 | **Ganancias** | Dashboard: hoy/semana/mes, gráfico, lista viajes |
| 10 | **Mi plan** | Plan actual, uso, botón upgrade, comparación planes |
| 11 | **Perfil conductor** | Datos personales, vehículo, documentos, rating |
| 12 | **Historial viajes** | Lista detallada con filtros por fecha |

### 7.5 Componentes UI Clave

**Botón principal (CTA):**
- Ancho completo (con padding lateral 16px)
- Alto: 52px
- Border-radius: 12px
- Fondo: gradiente azul (`#1A365D` → `#2C5282`)
- Texto: blanco, Inter SemiBold 16px
- Sombra sutil: `0 4px 12px rgba(26,54,93,0.3)`
- Estado disabled: opacidad 0.5

**Card de conductor (asignado):**
- Border-radius: 16px (top)
- Slide-up desde abajo
- Foto circular 56px a la izquierda
- Nombre + rating ★ 4.8 a la derecha
- Debajo: "Toyota Yaris gris · ABC-123"
- Botones: 📞 Llamar | 💬 WhatsApp

**Solicitud de viaje (conductor):**
- Modal desde abajo, 60% de pantalla
- Timer circular de 15s (amarillo → rojo)
- Info: nombre pasajero + rating, dirección pickup, destino, distancia, precio estimado
- Botón verde grande: "ACEPTAR"
- Botón gris: "Rechazar"

### 7.6 Accesibilidad

- Contraste mínimo 4.5:1 en texto (WCAG AA)
- Targets táctiles mínimo 44x44px
- Labels en todos los inputs
- Feedback háptico en acciones principales (vibración corta)
- Soporte de font-size del sistema (no hardcodear tamaños absolutos)
- Indicadores de estado con color + ícono (no solo color, para daltonismo)

### 7.7 Referencias de Diseño

| App | Qué copiar | Qué evitar |
|-----|-----------|------------|
| **Uber** | Mapa limpio, bottom sheet, flujo de 3 toques para pedir viaje | Complejidad de opciones (UberX, Pool, Black...) |
| **InDrive** | Pantalla de negociación de precio (input claro del monto) | UI recargada, demasiados banners |
| **Bolt** | Simplicidad del flujo, confirmación visual clara | Paleta de colores demasiado verde |

---

## 8. Arquitectura Técnica

### 8.1 Stack Overview

```
┌─────────────────────────────────────────────┐
│                   FRONTEND                   │
│         React + Vite + Capacitor             │
│    (Web PWA + Android APK via Capacitor)     │
│         Leaflet + OpenStreetMap              │
└──────────────────┬──────────────────────────┘
                   │ HTTPS / WSS
                   ▼
┌─────────────────────────────────────────────┐
│                   BACKEND                    │
│            Bun + Elysia + Prisma            │
│                                             │
│  ┌──────────┐  ┌──────────┐  ┌───────────┐ │
│  │ REST API │  │WebSocket │  │  Workers   │ │
│  │ (Elysia) │  │ Server   │  │ (matching, │ │
│  │          │  │ (Bun WS) │  │  notif)    │ │
│  └──────────┘  └──────────┘  └───────────┘ │
│                                             │
│  ┌──────────────────────────────────────┐   │
│  │           Prisma ORM                  │   │
│  └──────────────┬───────────────────────┘   │
└─────────────────┼───────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────┐
│              PostgreSQL                      │
│            (Coolify managed)                 │
└─────────────────────────────────────────────┘
```

### 8.2 WebSocket Server

**Tecnología:** Bun native WebSockets (integrado en Elysia vía `@elysiajs/websocket`)

**Canales:**

| Canal | Propósito | Datos |
|-------|-----------|-------|
| `driver:{driverId}` | Solicitudes de viaje para conductor | Nuevo viaje disponible, cancelación |
| `passenger:{passengerId}` | Updates para pasajero | Conductor asignado, ubicación, llegó, completado |
| `trip:{tripId}` | Tracking de viaje activo | Ubicación GPS cada 3-5s |
| `admin:dashboard` | Monitoreo en tiempo real | Viajes activos, conductores online |

**Autenticación WS:** Token JWT enviado en el handshake (query param o primer mensaje).

**Heartbeat:** Ping/pong cada 30s para detectar conexiones muertas.

### 8.3 Geolocation Strategy

```
Conductor Online (sin viaje activo):
  → Enviar ubicación cada 15 segundos
  → Suficiente para matching

Conductor En Viaje:
  → Enviar ubicación cada 3 segundos
  → Necesario para tracking preciso en mapa

Pasajero:
  → Ubicación al solicitar viaje (una vez)
  → No necesita tracking continuo

Optimizaciones:
  → Capacitor Geolocation (nativo, mejor precisión + batería)
  → Fallback: navigator.geolocation (web)
  → Filtrar updates si distancia < 10m (evitar jitter)
  → Buffer en cliente, enviar en batch si conexión inestable
```

### 8.4 Push Notifications

| Plataforma | Tecnología | Implementación |
|------------|-----------|----------------|
| Android APK | FCM (Firebase Cloud Messaging) | Capacitor Push Notifications plugin |
| Web browser | Web Push API + VAPID | Service Worker + Push subscription |
| Fallback | WhatsApp Business API | Para notificaciones críticas (aprobación docs) |

### 8.5 Image Upload

```
Client:
  1. Seleccionar imagen (cámara o galería)
  2. Comprimir client-side (canvas resize, max 1920px, quality 0.8)
  3. POST /api/upload multipart/form-data

Server:
  1. Validar: tipo (jpg/png), tamaño (<2MB), autenticación
  2. Generar nombre único (UUID + extension)
  3. Guardar en /uploads/ (filesystem)
  4. Retornar URL: /uploads/{filename}
  5. Guardar referencia en DB (DriverDocument table)

Futuro (V2):
  → Migrar a S3-compatible (MinIO o Cloudflare R2) para escalabilidad
```

### 8.6 Database Schema (Key Tables)

```prisma
model User {
  id          String   @id @default(uuid())
  phone       String   @unique
  name        String
  role        Role     // PASSENGER, DRIVER, ADMIN
  rating      Float    @default(5.0)
  ratingCount Int      @default(0)
  createdAt   DateTime @default(now())
  
  // Relations
  driverProfile    DriverProfile?
  tripsAsPassenger Trip[]          @relation("passenger")
  tripsAsDriver    Trip[]          @relation("driver")
  ratingsGiven     Rating[]        @relation("rater")
  ratingsReceived  Rating[]        @relation("rated")
  emergencyContact String?         // WhatsApp number
}

model DriverProfile {
  id              String       @id @default(uuid())
  userId          String       @unique
  user            User         @relation(fields: [userId], references: [id])
  
  // Vehicle
  vehicleBrand    String
  vehicleModel    String
  vehicleYear     Int
  vehicleColor    String
  vehiclePlate    String
  vehiclePhoto    String?      // URL
  
  // Documents
  dniPhoto        String?      // URL
  brevetePhoto    String?      // URL
  soatPhoto       String?      // URL
  propertyCard    String?      // URL
  selfiePhoto     String?      // URL
  
  // Status
  status          DriverStatus // PENDING, APPROVED, REJECTED, SUSPENDED
  rejectionReason String?
  approvedAt      DateTime?
  
  // Subscription
  plan            Plan         @default(FREE)
  planExpiresAt   DateTime?
  tripsToday      Int          @default(0)
  tripsResetAt    DateTime     @default(now())
  
  // Online status
  isOnline        Boolean      @default(false)
  lastLatitude    Float?
  lastLongitude   Float?
  lastLocationAt  DateTime?
}

model Trip {
  id            String     @id @default(uuid())
  
  passengerId   String
  passenger     User       @relation("passenger", fields: [passengerId], references: [id])
  driverId      String?
  driver        User?      @relation("driver", fields: [driverId], references: [id])
  
  // Locations
  pickupLat     Float
  pickupLng     Float
  pickupAddress String
  destLat       Float
  destLng       Float
  destAddress   String
  
  // Pricing
  estimatedPrice Float
  finalPrice     Float?
  distanceKm     Float?
  
  // Status & Timing
  status        TripStatus  // REQUESTED, MATCHED, DRIVER_ARRIVED, IN_PROGRESS, COMPLETED, CANCELLED
  requestedAt   DateTime    @default(now())
  matchedAt     DateTime?
  arrivedAt     DateTime?
  startedAt     DateTime?
  completedAt   DateTime?
  cancelledAt   DateTime?
  cancelReason  String?
  
  // Route tracking
  routePoints   Json?       // Array of {lat, lng, timestamp}
  
  ratings       Rating[]
}

model Rating {
  id       String @id @default(uuid())
  tripId   String
  trip     Trip   @relation(fields: [tripId], references: [id])
  raterId  String
  rater    User   @relation("rater", fields: [raterId], references: [id])
  ratedId  String
  rated    User   @relation("rated", fields: [ratedId], references: [id])
  score    Int    // 1-5
  tags     String[] // ["Amable", "Puntual", ...]
  comment  String?
  createdAt DateTime @default(now())
  
  @@unique([tripId, raterId])
}

model Subscription {
  id            String   @id @default(uuid())
  driverProfileId String
  plan          Plan
  amount        Float
  startDate     DateTime
  endDate       DateTime
  paymentMethod String   // "mercadopago", "yape", "manual"
  paymentRef    String?
  status        String   // "active", "expired", "cancelled"
  createdAt     DateTime @default(now())
}

model EmergencyLog {
  id        String   @id @default(uuid())
  tripId    String
  userId    String
  latitude  Float
  longitude Float
  createdAt DateTime @default(now())
}

enum Role {
  PASSENGER
  DRIVER
  ADMIN
}

enum DriverStatus {
  PENDING
  APPROVED
  REJECTED
  SUSPENDED
}

enum Plan {
  FREE
  PRO
  BUSINESS
}

enum TripStatus {
  REQUESTED
  MATCHED
  DRIVER_ARRIVED
  IN_PROGRESS
  COMPLETED
  CANCELLED
}
```

### 8.7 API Endpoints (Key)

```
AUTH
  POST   /api/auth/request-otp     { phone }
  POST   /api/auth/verify-otp      { phone, code }
  GET    /api/auth/me
  PATCH  /api/auth/profile         { name, emergencyContact }

TRIPS (Passenger)
  POST   /api/trips                { pickupLat, pickupLng, destLat, destLng, ... }
  GET    /api/trips/:id
  POST   /api/trips/:id/cancel
  POST   /api/trips/:id/rate       { score, tags, comment }
  GET    /api/trips/history

TRIPS (Driver)
  POST   /api/trips/:id/accept
  POST   /api/trips/:id/arrive
  POST   /api/trips/:id/start
  POST   /api/trips/:id/complete
  POST   /api/trips/:id/rate       { score, tags, comment }

DRIVER
  POST   /api/driver/register      { vehicleInfo, documents... }
  PATCH  /api/driver/status        { isOnline }
  PATCH  /api/driver/location      { lat, lng }
  GET    /api/driver/earnings      ?period=day|week|month
  GET    /api/driver/plan

UPLOAD
  POST   /api/upload               multipart/form-data

ADMIN
  GET    /api/admin/drivers?status=pending
  PATCH  /api/admin/drivers/:id    { status, rejectionReason }
  GET    /api/admin/trips/active
  GET    /api/admin/stats
  GET    /api/admin/subscriptions

PRICING
  POST   /api/pricing/estimate     { pickupLat, pickupLng, destLat, destLng }

SUBSCRIPTIONS
  POST   /api/subscriptions/checkout  { plan }
  GET    /api/subscriptions/current
```

---

## 9. Monetización

### 9.1 Planes de Suscripción para Conductores

| Característica | FREE | PRO | BUSINESS |
|---------------|------|-----|----------|
| **Precio** | S/ 0/mes | S/ 350/mes | S/ 500/mes |
| **Viajes/día** | 20 | 100 | Ilimitados |
| **Comisión** | 0% | 0% | 0% |
| **Soporte** | Básico | Prioritario | Prioritario + WhatsApp directo |
| **Badge en perfil** | — | ⭐ PRO | 👑 BUSINESS |
| **Prioridad matching** | Normal | Alta | Máxima |
| **Estadísticas** | Básicas | Avanzadas | Avanzadas + exportar |
| **Posición en cola** | Normal | Preferente | Preferente |

### 9.2 Análisis de Pricing

**¿Por qué S/350 y S/500?**

Un conductor promedio en Chiclayo:
- Hace 30-50 viajes/día
- Tarifa promedio: S/7
- Ingreso bruto: S/210-350/día → S/6,300-10,500/mes

Con InDrive (12% comisión): paga S/756-1,260/mes en comisiones.

Con Tico PRO (S/350): **ahorra S/406-910/mes**.  
Con Tico BUSINESS (S/500): **ahorra S/256-760/mes**.

**El plan FREE (20 viajes/día)** permite que conductores prueben la app sin riesgo. 20 viajes cubren un medio turno, suficiente para que vean el valor.

### 9.3 Integración de Pagos

**Opción principal: MercadoPago**
- Funciona en Perú
- Acepta tarjetas, transferencias bancarias
- API bien documentada
- Puede manejar suscripciones recurrentes

**Opciones complementarias (V2):**
- **Yape:** Transferencia P2P muy popular en Perú. Pago manual + verificación.
- **Plin:** Similar a Yape, del BCP.
- **Transferencia bancaria:** Para conductores que no tienen tarjeta.

**Flujo de pago MVP:**
```
1. Conductor selecciona plan PRO o BUSINESS
2. Redirige a checkout MercadoPago
3. Paga con tarjeta o transferencia
4. Webhook confirma pago → activar plan
5. Plan dura 30 días desde activación
6. 3 días antes de vencer → notificación de renovación
```

### 9.4 Free Trial Strategy

1. **Primera semana:** Todo conductor aprobado recibe 7 días de plan PRO gratis.
2. **Día 5:** Notificación "Tu prueba gratis termina en 2 días. ¡Suscríbete al PRO!"
3. **Día 8:** Baja a plan FREE (20 viajes/día).
4. **Día 8-14:** Si hace >15 viajes/día → notificación "Hoy casi llegas al límite. Sube a PRO para no perder viajes."
5. **Límite alcanzado:** "Has completado tus 20 viajes de hoy. Mejora tu plan para seguir recibiendo solicitudes."

### 9.5 Proyección de Ingresos

| Escenario | Conductores totales | FREE | PRO | BUSINESS | Ingreso mensual |
|-----------|-------------------|------|-----|----------|-----------------|
| Lanzamiento (mes 1-2) | 50 | 45 | 4 | 1 | S/ 1,900 |
| Crecimiento (mes 3-6) | 200 | 140 | 45 | 15 | S/ 23,250 |
| Madurez (mes 6-12) | 500 | 300 | 140 | 60 | S/ 79,000 |
| Meta año 2 | 1,000 | 500 | 350 | 150 | S/ 197,500 |

---

## 10. Plan de Lanzamiento

### Fase 1: Testing Interno (Semanas 1-2)

**Objetivo:** Validar que la tecnología funciona en condiciones reales.

| Acción | Detalle |
|--------|---------|
| Reclutar 5-10 conductores de confianza | Amigos, conocidos, taxistas de confianza |
| Instalar APK en sus teléfonos | Build de Capacitor, distribución directa |
| Testing interno del equipo como pasajeros | Hacer viajes reales por Chiclayo |
| Fix bugs críticos | GPS, matching, notifications |
| Zona: solo centro de Chiclayo | Limitar radio para concentrar conductores |

**Criterio de éxito:** 50 viajes completados sin errores críticos.

### Fase 2: Beta Cerrada (Semanas 3-6)

**Objetivo:** Validar product-market fit con usuarios reales.

| Acción | Detalle |
|--------|---------|
| Ampliar a 50 conductores | Reclutamiento en paraderos de taxi |
| 200 pasajeros beta | Invitaciones por WhatsApp a conocidos |
| Zonas: Centro + Balta + Santa Victoria + La Victoria | Las zonas más transitadas |
| Plan FREE para todos los conductores | Sin restricción de viajes durante beta |
| Feedback activo | Encuesta WhatsApp semanal a conductores y pasajeros |
| Iterar diseño y UX | Basado en feedback real |

**Criterio de éxito:** 
- 70% trip completion rate
- Rating promedio > 4.0
- 80% de conductores activos al menos 3 días/semana
- Tiempo de espera promedio < 8 minutos

### Fase 3: Lanzamiento Público (Semana 7+)

**Objetivo:** Crecimiento orgánico en Chiclayo.

| Acción | Detalle |
|--------|---------|
| Publicar APK en Play Store | Nombre: "Tico - Tu taxi en Chiclayo" |
| Web app accesible en tico.luminari.agency | Para pasajeros que no quieren descargar |
| Activar planes de pago | FREE + PRO + BUSINESS |
| Marketing local | Ver plan de marketing abajo |
| Ampliar zona a toda el área metropolitana | Chiclayo + JLO + La Victoria + Lambayeque |

### Plan de Marketing

**Budget estimado: S/2,000-5,000 para lanzamiento.**

| Canal | Acción | Costo |
|-------|--------|-------|
| **WhatsApp** | Crear grupos de conductores por zona. Compartir link de descarga. | S/0 |
| **Facebook** | Posts en "Chiclayo Noticias", "Vendo/Compro Chiclayo", grupos locales. Ads segmentados Chiclayo 18-55. | S/500-1,500 |
| **Paraderos de taxi** | Flyers A5 en paraderos principales: Moshoqueque, Balta, Mercado Modelo. | S/300 (1,000 flyers) |
| **Volanteo** | Promotores en zonas de alto tráfico repartiendo volantes a pasajeros. | S/500 (2 promotores x 1 semana) |
| **Radio local** | Spot de 20s en RPP Chiclayo o radio local. | S/800-2,000 |
| **Referidos** | "Invita a un conductor → ambos reciben 1 semana PRO gratis" | S/0 (costo oportunidad) |
| **Stickers para autos** | Sticker "Pídeme por Tico" para parabrisas de conductores activos | S/200 (100 stickers) |

**Mensaje clave para conductores:** *"Gana más con Tico. 0% comisión. Todo lo que cobras es tuyo."*

**Mensaje clave para pasajeros:** *"Tu taxi seguro en Chiclayo. Pide tu Tico en segundos."*

---

## 11. Métricas a Trackear

### KPIs Principales

| Métrica | Definición | Meta mes 1 | Meta mes 6 |
|---------|-----------|------------|------------|
| **DAU** | Usuarios activos diarios (pasajeros + conductores) | 100 | 1,000 |
| **MAU** | Usuarios activos mensuales | 500 | 5,000 |
| **Viajes/día** | Viajes completados por día | 50 | 500 |
| **Trip completion rate** | Viajes completados / solicitados | >70% | >85% |
| **Tiempo espera promedio** | Desde solicitud hasta matching | <8 min | <5 min |
| **Rating promedio** | Rating de conductores | >4.0 | >4.3 |
| **Conversión free→pago** | % de conductores que pagan suscripción | 10% | 35% |
| **Churn conductores** | % de conductores que dejan la app por mes | <20% | <10% |
| **MRR** | Monthly Recurring Revenue de suscripciones | S/1,900 | S/23,000 |

### Métricas Secundarias

| Métrica | Propósito |
|---------|-----------|
| Cancelaciones por pasajero | Detectar UX problems |
| Cancelaciones por conductor | Detectar pricing problems |
| Viajes por conductor/día | Medir engagement |
| Horas online promedio/conductor | Medir oferta |
| Distancia promedio por viaje | Entender patrones de uso |
| Hora pico de demanda | Optimizar supply |
| Zonas con más demanda | Informar mapa de calor (V2) |
| Tasa de emergencias activadas | Monitorear safety |
| NPS (Net Promoter Score) | Encuesta mensual via WhatsApp |

### Herramientas de Tracking

- **Analytics:** Umami (self-hosted en umami.luminari.agency) para web analytics
- **Backend metrics:** Logs estructurados + queries SQL para métricas de negocio
- **Dashboard admin:** Métricas en tiempo real en panel admin
- **Reportes:** Exportar CSV semanal para análisis

---

## 12. Riesgos y Mitigaciones

### Riesgo 1: Baja oferta inicial de conductores

| Aspecto | Detalle |
|---------|---------|
| **Probabilidad** | Alta |
| **Impacto** | Crítico — sin conductores, los pasajeros esperan mucho y se van |
| **Mitigación** | 1) Seed con 20-30 conductores reclutados directamente antes del lanzamiento público. 2) Plan FREE generoso para bajar barrera de entrada. 3) Incentivo: primera semana PRO gratis. 4) Concentrar en zona pequeña (centro Chiclayo) para densidad. |

### Riesgo 2: Seguridad de pasajeros

| Aspecto | Detalle |
|---------|---------|
| **Probabilidad** | Media |
| **Impacto** | Crítico — un incidente de seguridad mata la reputación |
| **Mitigación** | 1) Verificación completa de documentos antes de aprobar. 2) Botón de emergencia que llama al 105. 3) Compartir viaje en tiempo real con contacto de confianza. 4) Registrar ruta GPS completa de cada viaje. 5) Selfie verificación del conductor. |

### Riesgo 3: Competencia de InDrive

| Aspecto | Detalle |
|---------|---------|
| **Probabilidad** | Alta |
| **Impacto** | Alto — InDrive tiene marca y base de usuarios |
| **Mitigación** | 1) Diferenciación clara: 0% comisión vs 12%. 2) Enfoque hiperlocal (Chiclayo only). 3) Mejor UX/UI que InDrive (su app es confusa). 4) Relación directa con conductores vía WhatsApp. 5) No competir en precio, competir en valor para el conductor. |

### Riesgo 4: Escalabilidad técnica en tiempo real

| Aspecto | Detalle |
|---------|---------|
| **Probabilidad** | Media (a largo plazo) |
| **Impacto** | Alto — si el matching falla, la app es inútil |
| **Mitigación** | 1) Bun WebSockets son extremadamente eficientes (100k+ conexiones). 2) Para MVP, un solo servidor maneja miles de conductores. 3) Geospatial queries con PostGIS si necesario. 4) Rate limiting en location updates. 5) Escalar vertical antes que horizontal. |

### Riesgo 5: Conductores no quieren pagar suscripción

| Aspecto | Detalle |
|---------|---------|
| **Probabilidad** | Media-Alta |
| **Impacto** | Alto — sin revenue no hay negocio sostenible |
| **Mitigación** | 1) Plan FREE funcional para demostrar valor primero. 2) Hacer el math visible: "Con InDrive pagas S/900/mes en comisiones, con Tico PRO pagas S/350". 3) Prioridad de matching para planes pagos (incentivo directo). 4) Trial de 7 días PRO para que sientan la diferencia. 5) Ajustar precios según feedback del mercado. |

### Riesgo 6: Fraude / cuentas falsas

| Aspecto | Detalle |
|---------|---------|
| **Probabilidad** | Media |
| **Impacto** | Medio |
| **Mitigación** | 1) Verificación manual de documentos por admin. 2) OTP por WhatsApp (vinculado a número real). 3) Selfie verification. 4) Reportar conductor/pasajero después de cada viaje. 5) Suspensión automática con rating < 3.0. |

### Riesgo 7: Regulación de transporte

| Aspecto | Detalle |
|---------|---------|
| **Probabilidad** | Baja-Media |
| **Impacto** | Alto |
| **Mitigación** | 1) Operar como plataforma tecnológica, no como empresa de transporte. 2) Exigir documentos legales completos (SOAT, brevete). 3) Monitorear regulaciones de la Municipalidad de Chiclayo. 4) Mantener relación con gremios de taxistas. |

---

## Apéndice A: Glosario

| Término | Significado |
|---------|------------|
| **DNI** | Documento Nacional de Identidad (Perú) |
| **Brevete** | Licencia de conducir (Perú) |
| **SOAT** | Seguro Obligatorio de Accidentes de Tránsito |
| **S/** | Soles peruanos (moneda) |
| **105** | Número de emergencia PNP (Policía Nacional del Perú) |
| **JLO** | José Leonardo Ortiz (distrito adyacente a Chiclayo) |
| **Moshoqueque** | Mercado mayorista más grande de Chiclayo |
| **Paradero** | Punto donde se estacionan taxis esperando pasajeros |
| **Yape/Plin** | Apps de pago P2P populares en Perú |
| **OSM** | OpenStreetMap |
| **OSRM** | Open Source Routing Machine |
| **FCM** | Firebase Cloud Messaging |

## Apéndice B: Timeline Técnico Estimado

| Semana | Milestone |
|--------|-----------|
| 1-2 | Auth (WhatsApp OTP), DB schema, upload de documentos |
| 3-4 | WebSocket server, matching engine, GPS tracking |
| 5-6 | UI pasajero completa (mapa, solicitar, tracking, rating) |
| 7-8 | UI conductor completa (dashboard, viajes, ganancias) |
| 9-10 | Panel admin, notificaciones push, emergency button |
| 11-12 | QA, testing interno (Fase 1), bug fixes |
| 13-16 | Beta cerrada (Fase 2), iteraciones |
| 17+ | Lanzamiento público (Fase 3) |

---

*Documento vivo. Última actualización: 14 de marzo de 2026.*
