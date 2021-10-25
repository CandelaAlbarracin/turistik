CREATE DATABASE turistik;

USE turistik;

CREATE TABLE usuarios{
    idusuario:INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    nombre: VARCHAR(70),
    apellido:VARCHAR(70),
    email:VARCHAR(50),
    contrasena:VARCHAR(60),
    tipo:VARCHAR(1) --'A': Administrador, 'T':turista, 'E':Emprendedor
};

CREATE TABLE administradores{
    idadministrador:INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    dni:INT(10),
    id_usuario:INT,
    CONSTRAINT fk_usuarios FOREIGN KEY (id_usuario) REFERENCES usuarios(idusuario)
};

CREATE TABLE denuncias{
    nroDenuncia:INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    motivo:VARCHAR(50),
    descripcion:TEXT,
    --id_administrador:INT
    --CONSTRAINT fk_administrador FOREIGN KEY (id_administrador) REFERENCES administradores(idadministrador)
};

CREATE TABLE emprendedores{
    idemprendedor:INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    dni:INT(10),
    cuil:VARCHAR(15),
    categoriaafip:VARCHAR(30),
    id_usuario:INT,
    CONSTRAINT fk_usuario FOREIGN KEY (id_usuario) REFERENCES usuarios(idusuario)
};

CREATE TABLE localidades{
    idlocalidad:INT(3) NOT NULL AUTO_INCREMENT PRIMARY KEY,
    nombrelocalidad:VARCHAR(100),
    departamento:VARCHAR(50)
};

CREATE TABLE emprendimientos{
    idemprendimiento: INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    ubicacion:VARCHAR(100),
    estadosolicitud:VARCHAR(1),
    nombreemprendimiento:VARCHAR(60),
    descripcion:TEXT,
    categoria:VARCHAR(1),
    id_emprendedor:INT,
    id_localidad:INT(3),
    CONSTRAINT fk_emprendedores FOREIGN KEY (id_emprendedor) REFERENCES emprendedores(idemprendedor),
    CONSTRAINT fk_localidades FOREIGN KEY (id_localidad) REFERENCES localidades(idlocalidad)
};

CREATE TABLE sitio{
    idcalificacion:INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    id_usuario:INT,
    id_emprendimiento:INT,
    puntuacion:INT(1),
    comentario:TEXT,
    CONSTRAINT fk_usuarios FOREIGN KEY (id_usuario) REFERENCES usuarios(idusuario),
    CONSTRAINT fk_emprendimientos FOREIGN KEY (id_emprendimiento) REFERENCES emprendimientos(idemprendimiento)
};

CREATE TABLE contacto{
    idcontacto:INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    telefono:VARCHAR(20),
    facebook:VARCHAR(254),
    instagram:VARCHAR(254),
    youtube:VARCHAR(254),
    id_emprendimiento:INT,
    CONSTRAINT fk_emprendimientos FOREIGN KEY (id_emprendimiento) REFERENCES emprendimientos(idemprendedimiento)
};

CREATE TABLE alojamientos{
    idalojamiento: INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    id_emprendimiento:INT,
    precionoche:FLOAT,
    capacidadhabitaciones:INT(3),
    capacidadestacionamientos:INT(3),
    tipoalojamiento:VARCHAR(50),
    piscina:BOOLEAN,
    CONSTRAINT fk_emprendimientos FOREIGN KEY (id_emprendimiento) REFERENCES emprendimientos(id_emprendimiento)
};

CREATE TABLE reservas{
    idreservas:INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    id_alojamiento:INT,
    id_usuario:INT,
    fechainicio:DATE,
    fechafin:DATE,
    horario:TIME,
    fechareserva:timestamp NOT NULL DEFAULT current_timestamp, 
    CONSTRAINT fk_alojamientos FOREIGN KEY (id_alojamiento) REFERENCES alojamientos(idalojamiento),
    CONSTRAINT fk_usuarios FOREIGN KEY (id_usuario) REFERENCES usuarios(idusuario)
};

CREATE TABLE tours{
    idtour:INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    id_emprendimiento: INT,
    encargados:VARCHAR(512),
    dificultad: VARCHAR(50),
    fecha:DATE,
    CONSTRAINT fk_emprendimientos FOREIGN KEY (id_emprendimiento) REFERENCES emprendimientos(idemprendimiento)
};

CREATE TABLE restaurantes{
    idrestaurante:INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    id_emprendimiento:INT,
    cantidadmesas:INT(3),
    horarios:VARCHAR(512),
    CONSTRAINT fk_emprendimientos FOREIGN KEY (id_emprendimiento) REFERENCES emprendimientos(idemprendedimiento)
};

CREATE TABLE platos{
    idplatos: INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    id_restaurante:INT,
    categoria:VARCHAR(60),
    descripcionplato:VARCHAR(100),
    CONSTRAINT fk_restaurantes FOREIGN KEY (id_restaurante) REFERENCES restaurantes(idrestaurante)
};

CREATE TABLE gastronomia{
    idgastronomia:INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    tipogastronomia:VARCHAR(60)
    id_restaurante:INT,
    CONSTRAINT fk_restaurantes FOREIGN KEY (id_restaurante) REFERENCES restaurantes(idrestaurante)
};
