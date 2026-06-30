# 📋 DOCUMENTACIÓN TÉCNICA
# DATECSA – Sistema de Gestión de Servicios de Impresión
## Universidad Santiago de Cali

---

## 1. DESCRIPCIÓN GENERAL

Sistema web de gestión de soporte técnico para el contrato de 
impresión entre DATECSA y la Universidad Santiago de Cali (USC).
Permite registrar, hacer seguimiento y gestionar todos los casos, 
toners, órdenes de servicio y notificaciones del parque de 
impresoras de la universidad.

---

## 2. INFORMACIÓN DEL SISTEMA

| Campo | Detalle |
|-------|---------|
| **Nombre** | DATECSA Sistema de Gestión de Servicios |
| **Versión** | 1.0.0 |
| **Fecha de despliegue** | Junio 2026 |
| **URL Producción** | https://datecsa-app.vercel.app |
| **URL Portal Público** | https://datecsa-app.vercel.app/reportar.html |
| **Repositorio** | https://github.com/Jesusarbelaez22/datecsa-app |
| **Estado** | Producción activa |

---

## 3. TECNOLOGÍAS UTILIZADAS

### Frontend
| Tecnología | Versión | Uso |
|-----------|---------|-----|
| HTML5 | - | Estructura de la aplicación |
| CSS3 | - | Estilos y temas (oscuro/claro) |
| JavaScript | ES2022 (Vanilla) | Lógica de la aplicación |
| Lucide Icons | Latest | Íconos SVG de la interfaz |
| Chart.js | Latest | Gráfico de dona en el dashboard |

### Backend / Base de Datos
| Tecnología | Detalle |
|-----------|---------|
| **Supabase** | Backend-as-a-Service (BaaS) |
| **PostgreSQL** | Motor de base de datos (provisto por Supabase) |
| **Supabase REST API** | Comunicación cliente-servidor via HTTP |
| **Supabase Realtime** | Actualizaciones en tiempo real |

### Hosting / Despliegue
| Servicio | Uso |
|---------|-----|
| **Vercel** | Hosting del frontend (CDN global) |
| **GitHub** | Control de versiones y CI/CD |

### Servicios Externos
| Servicio | Uso |
|---------|-----|
| **EmailJS** | Envío de correos de confirmación desde el portal público |
| **Power Automate** | Automatización KFS → Supabase (notificaciones) |

---

## 4. BASE DE DATOS (SUPABASE / POSTGRESQL)

**Proyecto:** datecsa-app  
**URL:** https://znvbjrrkndmytjwikzno.supabase.co  
**Plan:** Free tier (500MB almacenamiento, 2GB transferencia/mes)

### Tablas

#### 📋 tickets
Registra todos los casos y solicitudes de soporte.

| Columna | Tipo | Descripción |
|---------|------|-------------|
| id | int8 (PK) | Identificador único |
| fecha_inicial | date | Fecha de apertura del caso |
| hora_inicio | text | Hora de inicio de atención |
| tipo_solicitud | text | Tipo de problema reportado |
| llegada | text | Canal de llegada (CORREO, TELÉFONO, PORTAL WEB) |
| usuario | text | Nombre y correo del solicitante |
| modelo | text | Modelo de la impresora |
| serial | text | Número de serie del equipo |
| ubicacion | text | Área/dependencia del solicitante |
| fecha_final | date | Fecha de cierre del caso |
| hora_fin | text | Hora de cierre |
| observaciones | text | Descripción del trabajo realizado |
| helpdesk | text | Técnico responsable |
| prioridad | text | Normal / Alta / Crítica |
| estado | text | Abierto / En Progreso / Cerrado |
| evidencia | text | Foto en base64 (opcional) |
| created_at | timestamp | Fecha de creación del registro |

#### 🖨 inventario_equipos
Catálogo maestro de todos los equipos de la USC.

| Columna | Tipo | Descripción |
|---------|------|-------------|
| id | int8 (PK) | Identificador único |
| sede | text | Sede de la USC |
| modelo | text | Modelo de la impresora |
| serie | text (UNIQUE) | Número de serie único |
| ubicacion | text | Área/dependencia específica |
| created_at | timestamp | Fecha de registro |

#### 📦 entradas_toner
Registro de llegada de toners al inventario.

| Columna | Tipo | Descripción |
|---------|------|-------------|
| id | int8 (PK) | Identificador único |
| fecha | date | Fecha de recepción |
| modelo | text | Modelo de impresora |
| serie | text | Serie del equipo |
| referencia | text | Referencia del toner (TK-3182, etc.) |
| remision | text | Número de remisión |
| ubicacion | text | Sede destino |
| area | text | Área específica |
| recibe | text | Persona que recibe |
| os | text | Orden de servicio relacionada |
| solicitud | text | Canal de solicitud (KFS/CORREO) |
| observacion | text | Observaciones adicionales |
| created_at | timestamp | Fecha de creación |

#### ✅ toners_instalados
Registro de toners instalados en equipos.

| Columna | Tipo | Descripción |
|---------|------|-------------|
| id | int8 (PK) | Identificador único |
| fecha | date | Fecha de instalación |
| equipo | text | Modelo del equipo |
| serial | text | Serie del equipo |
| sede | text | Área/dependencia |
| referencia | text | Referencia del toner |
| contador | text | Contador de páginas al momento |
| tecnico | text | Técnico que instaló |
| observacion | text | Observaciones |
| created_at | timestamp | Fecha de creación |

#### 📋 ordenes
Órdenes de servicio técnico externo.

| Columna | Tipo | Descripción |
|---------|------|-------------|
| id | int8 (PK) | Identificador único |
| fecha_solicitud | date | Fecha de solicitud de OS |
| modelo | text | Modelo del equipo |
| serial | text | Serie del equipo |
| ubicacion | text | Ubicación del equipo |
| sede | text | Sede de la USC |
| incidente | text | Tipo de incidente |
| os | text | Número de OS aprobada |
| fecha_servicio | date | Fecha del servicio |
| responsable | text | Técnico responsable |
| trabajo | text | Trabajo realizado |
| created_at | timestamp | Fecha de creación |

#### 🔔 notificaciones
Alertas KFS de toner bajo en impresoras.

| Columna | Tipo | Descripción |
|---------|------|-------------|
| id | int8 (PK) | Identificador único |
| fecha | date | Fecha de la notificación |
| impresora | text | Serie de la impresora |
| modelo | text | Modelo de la impresora |
| ubicacion | text | Sede |
| area | text | Área específica |
| os | text | OS de aprobación de toner |
| observacion | text | Detalles adicionales |
| leido | boolean | Estado de lectura |
| created_at | timestamp | Fecha de creación |

#### 👥 usuarios
Base de datos de usuarios del sistema KFS de la USC.

| Columna | Tipo | Descripción |
|---------|------|-------------|
| id | int8 (PK) | Identificador único |
| nombre | text | Nombre completo |
| usuario | text | Nombre de usuario en el sistema |
| codigo | text | Código PIN de impresión |
| created_at | timestamp | Fecha de creación |

---

## 5. ARQUITECTURA
