CREATE DATABASE turistik;

USE turistik;

CREATE TABLE usuarios{
    idusuario:INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    nombre: VARCHAR(70),
    apellido:VARCHAR(70),
    email:VARCHAR(50)
    tipo:VARCHAR(1)
};

CREATE TABLE administradores{
    idadministrador:INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    dni:INT(10),
    --cargo:VARCHAR(25),
    --permisos:VARCHAR(40)
    id_usuario:INT,
    CONSTRAINT fk_usuarios FOREIGN KEY (id_usuario) REFERENCES usuarios(idusuario)
};

CREATE TABLE denuncias{
    nroDenuncia:INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    descripcion:VARCHAR(500),
    id_administrador:INT
    CONSTRAINT fk_administrador FOREIGN KEY (id_administrador) REFERENCES administradores(idadministrador)
};

CREATE TABLE emprendedores{
    idemprendedor:INT NOT NULL AUTO_INCREMENT,
    dni:INT(10),
    cuil:VARCHAR(15),
    categoria_afip:VARCHAR(30),
    id_usuario:INT,
    CONSTRAINT fk_usuario FOREIGN KEY (id_usuario) REFERENCES usuarios(idusuario)
};

CREATE TABLE emprendimientos{
    idemprendimiento: INT NOT NULL AUTO_INCREMENT,
    ubicacion:VARCHAR(100),
    estado_solicitud:VARCHAR(1),
    nombre_emprendimiento:VARCHAR(50),
    descripcion:VARCHAR(500),
    categoria:VARCHAR(1)
    id_emprendedor:INT,
    CONSTRAINT fk_emprendedores FOREIGN KEY (id_emprendedor) REFERENCES emprendedores(idemprendedor)
};

CREATE TABLE sitio{
    idcalificacion:INT NOT NULL AUTO_INCREMENT;
    id_usuario:INT,
    id_emprendimiento:INT,
    puntuacion:INT,
    comentario:VARCHAR(500),
    CONSTRAINT fk_usuarios FOREIGN KEY (id_usuario) REFERENCES usuarios(idusuario),
    CONSTRAINT fk_emprendimientos FOREIGN KEY (id_emprendimiento) REFERENCES emprendimientos(idemprendedor)
};

