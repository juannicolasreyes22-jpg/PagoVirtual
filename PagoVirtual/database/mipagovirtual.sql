CREATE DATABASE IF NOT EXISTS mipagovirtual
 CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE mipagovirtual;

CREATE TABLE roles (
 id INT AUTO_INCREMENT PRIMARY KEY,
 nombre VARCHAR(30) NOT NULL UNIQUE
);

INSERT INTO roles(nombre) VALUES ('alumno'),('administrador'),('docente');

CREATE TABLE usuarios (
 id BIGINT AUTO_INCREMENT PRIMARY KEY,
 rol_id INT NOT NULL,
 nombre VARCHAR(100) NOT NULL,
 apellido VARCHAR(100) NOT NULL,
 dni VARCHAR(15) NOT NULL UNIQUE,
 email VARCHAR(150) UNIQUE,
 telefono VARCHAR(30),
 password_hash VARCHAR(255) NOT NULL,
 activo BOOLEAN NOT NULL DEFAULT TRUE,
 creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
 CONSTRAINT fk_usuarios_rol FOREIGN KEY (rol_id) REFERENCES roles(id)
);

CREATE TABLE actividades (
 id BIGINT AUTO_INCREMENT PRIMARY KEY,
 nombre VARCHAR(100) NOT NULL,
 categoria VARCHAR(80),
 descripcion TEXT,
 dias VARCHAR(120),
 hora_inicio TIME,
 hora_fin TIME,
 lugar VARCHAR(120),
 activo BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE TABLE inscripciones (
 id BIGINT AUTO_INCREMENT PRIMARY KEY,
 usuario_id BIGINT NOT NULL,
 actividad_id BIGINT NOT NULL,
 fecha_inscripcion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
 estado ENUM('pendiente','aprobada','rechazada','cancelada') DEFAULT 'pendiente',
 observaciones TEXT,
 FOREIGN KEY (usuario_id) REFERENCES usuarios(id),
 FOREIGN KEY (actividad_id) REFERENCES actividades(id)
);

CREATE TABLE pagos (
 id BIGINT AUTO_INCREMENT PRIMARY KEY,
 usuario_id BIGINT NOT NULL,
 concepto VARCHAR(120) NOT NULL,
 importe DECIMAL(12,2) NOT NULL,
 medio_pago ENUM('transferencia','tarjeta','efectivo') NOT NULL,
 estado ENUM('pendiente','aprobado','rechazado','anulado') DEFAULT 'pendiente',
 referencia VARCHAR(120),
 fecha_pago DATETIME,
 creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
 FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
);

CREATE TABLE movimientos_cuenta (
 id BIGINT AUTO_INCREMENT PRIMARY KEY,
 usuario_id BIGINT NOT NULL,
 pago_id BIGINT NULL,
 tipo ENUM('cargo','pago','ajuste') NOT NULL,
 descripcion VARCHAR(200) NOT NULL,
 importe DECIMAL(12,2) NOT NULL,
 fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
 FOREIGN KEY (usuario_id) REFERENCES usuarios(id),
 FOREIGN KEY (pago_id) REFERENCES pagos(id)
);


