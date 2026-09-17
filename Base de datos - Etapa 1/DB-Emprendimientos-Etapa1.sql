/* ============================================================
   PLATAFORMA B2B
   Inteligencia de Ubicación y Vinculación Comercial
   SQL SERVER
   ============================================================ */

CREATE DATABASE PlataformaB2B;
GO

USE PlataformaB2B;
GO


/* ============================================================
   1. CATÁLOGOS
   ============================================================ */

CREATE TABLE Roles (
    IdRol INT IDENTITY(1,1) PRIMARY KEY,
    Nombre VARCHAR(50) NOT NULL UNIQUE,
    Descripcion VARCHAR(250) NULL
);
GO

INSERT INTO Roles (Nombre, Descripcion)
VALUES
('Administrador', 'Administrador general del sistema'),
('Empresa', 'Usuario perteneciente a una empresa cliente'),
('Analista', 'Usuario encargado de realizar análisis');
GO


CREATE TABLE Sectores (
    IdSector INT IDENTITY(1,1) PRIMARY KEY,
    Nombre VARCHAR(150) NOT NULL UNIQUE,
    Descripcion VARCHAR(500) NULL,
    Activo BIT NOT NULL DEFAULT 1
);
GO


CREATE TABLE Giros (
    IdGiro INT IDENTITY(1,1) PRIMARY KEY,
    IdSector INT NOT NULL,
    Nombre VARCHAR(200) NOT NULL,
    Descripcion VARCHAR(500) NULL,
    Activo BIT NOT NULL DEFAULT 1,

    CONSTRAINT FK_Giros_Sectores
        FOREIGN KEY (IdSector)
        REFERENCES Sectores(IdSector),

    CONSTRAINT UQ_Giro_Sector
        UNIQUE (IdSector, Nombre)
);
GO


/* ============================================================
   2. GEOGRAFÍA
   ============================================================ */

CREATE TABLE Estados (
    IdEstado INT IDENTITY(1,1) PRIMARY KEY,
    Clave VARCHAR(2) NOT NULL UNIQUE,
    Nombre VARCHAR(100) NOT NULL UNIQUE
);
GO


CREATE TABLE Municipios (
    IdMunicipio INT IDENTITY(1,1) PRIMARY KEY,
    IdEstado INT NOT NULL,
    Clave VARCHAR(3) NOT NULL,
    Nombre VARCHAR(150) NOT NULL,

    CONSTRAINT FK_Municipios_Estados
        FOREIGN KEY (IdEstado)
        REFERENCES Estados(IdEstado),

    CONSTRAINT UQ_Municipio_Estado
        UNIQUE (IdEstado, Clave)
);
GO


CREATE TABLE Localidades (
    IdLocalidad INT IDENTITY(1,1) PRIMARY KEY,
    IdMunicipio INT NOT NULL,
    Clave VARCHAR(10) NULL,
    Nombre VARCHAR(150) NOT NULL,

    -- Coordenada central de la localidad
    Ubicacion GEOGRAPHY NULL,

    CONSTRAINT FK_Localidades_Municipios
        FOREIGN KEY (IdMunicipio)
        REFERENCES Municipios(IdMunicipio)
);
GO


/* ============================================================
   3. EMPRESAS CLIENTES
   ============================================================ */

CREATE TABLE Empresas (
    IdEmpresa INT IDENTITY(1,1) PRIMARY KEY,

    NombreComercial VARCHAR(200) NOT NULL,
    RazonSocial VARCHAR(250) NULL,
    RFC VARCHAR(13) NULL,

    IdSector INT NULL,
    IdGiro INT NULL,

    Telefono VARCHAR(30) NULL,
    Correo VARCHAR(150) NULL,
    SitioWeb VARCHAR(250) NULL,

    FechaRegistro DATETIME2 NOT NULL DEFAULT GETDATE(),
    Activo BIT NOT NULL DEFAULT 1,

    CONSTRAINT FK_Empresas_Sector
        FOREIGN KEY (IdSector)
        REFERENCES Sectores(IdSector),

    CONSTRAINT FK_Empresas_Giro
        FOREIGN KEY (IdGiro)
        REFERENCES Giros(IdGiro),

    CONSTRAINT UQ_Empresas_RFC
        UNIQUE (RFC)
);
GO


/* ============================================================
   4. USUARIOS
   ============================================================ */

CREATE TABLE Usuarios (
    IdUsuario INT IDENTITY(1,1) PRIMARY KEY,

    IdEmpresa INT NULL,
    IdRol INT NOT NULL,

    Nombre VARCHAR(100) NOT NULL,
    Apellido VARCHAR(100) NULL,

    Correo VARCHAR(150) NOT NULL,
    PasswordHash VARCHAR(500) NOT NULL,

    FechaRegistro DATETIME2 NOT NULL DEFAULT GETDATE(),
    UltimoAcceso DATETIME2 NULL,

    Activo BIT NOT NULL DEFAULT 1,

    CONSTRAINT FK_Usuarios_Empresas
        FOREIGN KEY (IdEmpresa)
        REFERENCES Empresas(IdEmpresa),

    CONSTRAINT FK_Usuarios_Roles
        FOREIGN KEY (IdRol)
        REFERENCES Roles(IdRol),

    CONSTRAINT UQ_Usuarios_Correo
        UNIQUE (Correo)
);
GO


/* ============================================================
   5. PREFERENCIAS DE EXPANSIÓN
   ============================================================ */

CREATE TABLE PreferenciasExpansion (
    IdPreferencia INT IDENTITY(1,1) PRIMARY KEY,

    IdEmpresa INT NOT NULL,

    PresupuestoMinimo DECIMAL(18,2) NULL,
    PresupuestoMaximo DECIMAL(18,2) NULL,

    RadioAnalisisKm DECIMAL(10,2) NULL,

    NumeroUnidadesDeseadas INT NULL,

    PrioridadCompetencia DECIMAL(5,2) NULL,
    PrioridadPoblacion DECIMAL(5,2) NULL,
    PrioridadProveedores DECIMAL(5,2) NULL,
    PrioridadAccesibilidad DECIMAL(5,2) NULL,

    FechaActualizacion DATETIME2 NOT NULL DEFAULT GETDATE(),

    CONSTRAINT FK_Preferencias_Empresas
        FOREIGN KEY (IdEmpresa)
        REFERENCES Empresas(IdEmpresa)
);
GO


/* ============================================================
   6. DENUE
   ============================================================ */

CREATE TABLE EstablecimientosDENUE (
    IdEstablecimiento BIGINT IDENTITY(1,1) PRIMARY KEY,

    IdEstado INT NOT NULL,
    IdMunicipio INT NOT NULL,
    IdLocalidad INT NULL,

    -- Información del establecimiento
    Nombre VARCHAR(250) NULL,
    RazonSocial VARCHAR(250) NULL,

    CodigoActividad VARCHAR(20) NULL,
    ActividadEconomica VARCHAR(300) NULL,

    Sector VARCHAR(150) NULL,

    -- Dirección
    Calle VARCHAR(200) NULL,
    NumeroExterior VARCHAR(30) NULL,
    NumeroInterior VARCHAR(30) NULL,
    Colonia VARCHAR(150) NULL,
    CodigoPostal VARCHAR(10) NULL,

    -- Coordenadas
    Latitud DECIMAL(10,7) NULL,
    Longitud DECIMAL(10,7) NULL,

    Ubicacion GEOGRAPHY NULL,

    -- Información adicional DENUE
    TipoVialidad VARCHAR(100) NULL,
    CorredorIndustrial VARCHAR(200) NULL,
    TipoEstablecimiento VARCHAR(100) NULL,

    FechaActualizacion DATE NULL,

    CONSTRAINT FK_DENUE_Estado
        FOREIGN KEY (IdEstado)
        REFERENCES Estados(IdEstado),

    CONSTRAINT FK_DENUE_Municipio
        FOREIGN KEY (IdMunicipio)
        REFERENCES Municipios(IdMunicipio),

    CONSTRAINT FK_DENUE_Localidad
        FOREIGN KEY (IdLocalidad)
        REFERENCES Localidades(IdLocalidad)
);
GO


CREATE SPATIAL INDEX IX_DENUE_Ubicacion
ON EstablecimientosDENUE(Ubicacion);
GO


CREATE INDEX IX_DENUE_Estado
ON EstablecimientosDENUE(IdEstado);
GO

CREATE INDEX IX_DENUE_Municipio
ON EstablecimientosDENUE(IdMunicipio);
GO

CREATE INDEX IX_DENUE_Actividad
ON EstablecimientosDENUE(CodigoActividad);
GO


/* ============================================================
   7. ANÁLISIS
   ============================================================ */

CREATE TABLE Analisis (
    IdAnalisis INT IDENTITY(1,1) PRIMARY KEY,

    IdEmpresa INT NOT NULL,
    IdUsuario INT NOT NULL,

    Nombre VARCHAR(200) NOT NULL,
    Descripcion VARCHAR(500) NULL,

    FechaInicio DATETIME2 NOT NULL DEFAULT GETDATE(),
    FechaFinalizacion DATETIME2 NULL,

    Estado VARCHAR(30) NOT NULL DEFAULT 'En proceso',

    CONSTRAINT FK_Analisis_Empresa
        FOREIGN KEY (IdEmpresa)
        REFERENCES Empresas(IdEmpresa),

    CONSTRAINT FK_Analisis_Usuario
        FOREIGN KEY (IdUsuario)
        REFERENCES Usuarios(IdUsuario),

    CONSTRAINT CK_Analisis_Estado
        CHECK (Estado IN ('En proceso', 'Completado', 'Error'))
);
GO


/* ============================================================
   8. ESCENARIOS DE EXPANSIÓN
   ============================================================ */

CREATE TABLE EscenariosExpansion (
    IdEscenario INT IDENTITY(1,1) PRIMARY KEY,

    IdAnalisis INT NOT NULL,

    Nombre VARCHAR(200) NOT NULL,
    Descripcion VARCHAR(500) NULL,

    Presupuesto DECIMAL(18,2) NULL,
    NumeroUnidades INT NULL,

    RadioBusquedaKm DECIMAL(10,2) NULL,

    FechaCreacion DATETIME2 NOT NULL DEFAULT GETDATE(),

    CONSTRAINT FK_Escenarios_Analisis
        FOREIGN KEY (IdAnalisis)
        REFERENCES Analisis(IdAnalisis)
);
GO


/* ============================================================
   9. UBICACIONES RECOMENDADAS
   ============================================================ */

CREATE TABLE UbicacionesRecomendadas (
    IdUbicacion INT IDENTITY(1,1) PRIMARY KEY,

    IdEscenario INT NOT NULL,

    IdEstado INT NOT NULL,
    IdMunicipio INT NOT NULL,
    IdLocalidad INT NULL,

    NombreUbicacion VARCHAR(250) NULL,

    Ubicacion GEOGRAPHY NOT NULL,

    -- Resultado del algoritmo
    Puntuacion DECIMAL(8,2) NOT NULL,

    PuntuacionCompetencia DECIMAL(8,2) NULL,
    PuntuacionPoblacion DECIMAL(8,2) NULL,
    PuntuacionProveedores DECIMAL(8,2) NULL,
    PuntuacionAccesibilidad DECIMAL(8,2) NULL,

    CompetidoresCercanos INT NULL,
    ProveedoresCercanos INT NULL,

    CuotaPresenciaEstimada DECIMAL(8,2) NULL,

    Ranking INT NULL,

    FechaCalculo DATETIME2 NOT NULL DEFAULT GETDATE(),

    CONSTRAINT FK_Ubicaciones_Escenario
        FOREIGN KEY (IdEscenario)
        REFERENCES EscenariosExpansion(IdEscenario),

    CONSTRAINT FK_Ubicaciones_Estado
        FOREIGN KEY (IdEstado)
        REFERENCES Estados(IdEstado),

    CONSTRAINT FK_Ubicaciones_Municipio
        FOREIGN KEY (IdMunicipio)
        REFERENCES Municipios(IdMunicipio),

    CONSTRAINT FK_Ubicaciones_Localidad
        FOREIGN KEY (IdLocalidad)
        REFERENCES Localidades(IdLocalidad)
);
GO


CREATE SPATIAL INDEX IX_Ubicaciones_Ubicacion
ON UbicacionesRecomendadas(Ubicacion);
GO


/* ============================================================
   10. PROVEEDORES B2B
   ============================================================ */

CREATE TABLE Proveedores (
    IdProveedor INT IDENTITY(1,1) PRIMARY KEY,

    NombreComercial VARCHAR(250) NOT NULL,
    RazonSocial VARCHAR(250) NULL,
    RFC VARCHAR(13) NULL,

    Descripcion VARCHAR(1000) NULL,

    Telefono VARCHAR(30) NULL,
    Correo VARCHAR(150) NULL,
    SitioWeb VARCHAR(250) NULL,

    Calle VARCHAR(200) NULL,
    NumeroExterior VARCHAR(30) NULL,
    Colonia VARCHAR(150) NULL,
    CodigoPostal VARCHAR(10) NULL,

    IdEstado INT NULL,
    IdMunicipio INT NULL,
    IdLocalidad INT NULL,

    Ubicacion GEOGRAPHY NULL,

    Activo BIT NOT NULL DEFAULT 1,

    FechaRegistro DATETIME2 NOT NULL DEFAULT GETDATE(),

    CONSTRAINT FK_Proveedores_Estado
        FOREIGN KEY (IdEstado)
        REFERENCES Estados(IdEstado),

    CONSTRAINT FK_Proveedores_Municipio
        FOREIGN KEY (IdMunicipio)
        REFERENCES Municipios(IdMunicipio),

    CONSTRAINT FK_Proveedores_Localidad
        FOREIGN KEY (IdLocalidad)
        REFERENCES Localidades(IdLocalidad)
);
GO


CREATE SPATIAL INDEX IX_Proveedores_Ubicacion
ON Proveedores(Ubicacion);
GO


/* ============================================================
   11. RELACIÓN PROVEEDORES - SECTORES
   ============================================================ */

CREATE TABLE ProveedorSector (
    IdProveedor INT NOT NULL,
    IdSector INT NOT NULL,

    EsPrincipal BIT NOT NULL DEFAULT 0,

    CONSTRAINT PK_ProveedorSector
        PRIMARY KEY (IdProveedor, IdSector),

    CONSTRAINT FK_ProveedorSector_Proveedor
        FOREIGN KEY (IdProveedor)
        REFERENCES Proveedores(IdProveedor),

    CONSTRAINT FK_ProveedorSector_Sector
        FOREIGN KEY (IdSector)
        REFERENCES Sectores(IdSector)
);
GO


/* ============================================================
   12. RELACIÓN PROVEEDORES - GIROS
   ============================================================ */

CREATE TABLE ProveedorGiro (
    IdProveedor INT NOT NULL,
    IdGiro INT NOT NULL,

    ProductoServicio VARCHAR(300) NULL,

    CONSTRAINT PK_ProveedorGiro
        PRIMARY KEY (IdProveedor, IdGiro),

    CONSTRAINT FK_ProveedorGiro_Proveedor
        FOREIGN KEY (IdProveedor)
        REFERENCES Proveedores(IdProveedor),

    CONSTRAINT FK_ProveedorGiro_Giro
        FOREIGN KEY (IdGiro)
        REFERENCES Giros(IdGiro)
);
GO


/* ============================================================
   13. PROVEEDORES RECOMENDADOS
   ============================================================ */

CREATE TABLE ProveedoresRecomendados (
    IdRecomendacion INT IDENTITY(1,1) PRIMARY KEY,

    IdUbicacion INT NOT NULL,
    IdProveedor INT NOT NULL,

    DistanciaKm DECIMAL(10,2) NULL,

    Puntuacion DECIMAL(8,2) NULL,

    Motivo VARCHAR(500) NULL,

    Ranking INT NULL,

    FechaCalculo DATETIME2 NOT NULL DEFAULT GETDATE(),

    CONSTRAINT FK_ProvRec_Ubicacion
        FOREIGN KEY (IdUbicacion)
        REFERENCES UbicacionesRecomendadas(IdUbicacion),

    CONSTRAINT FK_ProvRec_Proveedor
        FOREIGN KEY (IdProveedor)
        REFERENCES Proveedores(IdProveedor)
);
GO


/* ============================================================
   14. REPORTES
   ============================================================ */

CREATE TABLE Reportes (
    IdReporte INT IDENTITY(1,1) PRIMARY KEY,

    IdAnalisis INT NOT NULL,
    IdUsuario INT NOT NULL,

    Nombre VARCHAR(200) NOT NULL,

    RutaArchivo VARCHAR(500) NULL,

    FechaGeneracion DATETIME2 NOT NULL DEFAULT GETDATE(),

    CONSTRAINT FK_Reportes_Analisis
        FOREIGN KEY (IdAnalisis)
        REFERENCES Analisis(IdAnalisis),

    CONSTRAINT FK_Reportes_Usuario
        FOREIGN KEY (IdUsuario)
        REFERENCES Usuarios(IdUsuario)
);
GO