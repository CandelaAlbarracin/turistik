CREATE DATABASE turistik;

USE turistik;

CREATE TABLE usuarios(
    idusuario INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    nombre  VARCHAR(70),
    apellido VARCHAR(70),
    email VARCHAR(50),
    contrasena VARCHAR(60),
    tipo VARCHAR(1)
);

CREATE TABLE administradores(
    idadministrador INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    dni INT(10),
    id_usuario INT,
    CONSTRAINT fk_usuarios FOREIGN KEY (id_usuario) REFERENCES usuarios(idusuario)
);

CREATE TABLE denuncias(
    nroDenuncia INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    motivo VARCHAR(50),
    descripcion TEXT,
    id_emprendimiento INT,
    CONSTRAINT fk_emprendimientos FOREIGN KEY (id_emprendimiento) REFERENCES emprendimientos(idemprendedimiento)
);

CREATE TABLE emprendedores(
    idemprendedor INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    dni INT(10),
    cuil VARCHAR(15),
    categoriaafip VARCHAR(30),
    id_usuario INT,
    CONSTRAINT fk_usuario FOREIGN KEY (id_usuario) REFERENCES usuarios(idusuario)
);

CREATE TABLE localidades(
    idlocalidad INT(3) NOT NULL AUTO_INCREMENT PRIMARY KEY,
    nombrelocalidad VARCHAR(100),
    departamento VARCHAR(50)
);

CREATE TABLE imagenes(
    idimagen INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    link VARCHAR(255),
    tipo VARCHAR(1),
    id_emprendimiento INT,
    CONSTRAINT fk_emprendimientos FOREIGN KEY (id_emprendimiento) REFERENCES emprendimientos(idemprendedimiento)
);

CREATE TABLE emprendimientos(
    idemprendimiento  INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    ubicacion VARCHAR(100),
    estadosolicitud VARCHAR(1),
    nombreemprendimiento VARCHAR(60),
    descripcion TEXT,
    categoria VARCHAR(1),
    id_emprendedor INT,
    id_localidad INT(3),
    CONSTRAINT fk_emprendedores FOREIGN KEY (id_emprendedor) REFERENCES emprendedores(idemprendedor),
    CONSTRAINT fk_localidades FOREIGN KEY (id_localidad) REFERENCES localidades(idlocalidad)
);

CREATE TABLE sitio(
    idcalificacion INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    id_usuario INT,
    id_emprendimiento INT,
    puntuacion INT(1),
    comentario TEXT,
    CONSTRAINT fk_usuarios FOREIGN KEY (id_usuario) REFERENCES usuarios(idusuario),
    CONSTRAINT fk_emprendimientos FOREIGN KEY (id_emprendimiento) REFERENCES emprendimientos(idemprendimiento)
);

CREATE TABLE contacto(
    idcontacto INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    telefono VARCHAR(20),
    facebook VARCHAR(254),
    instagram VARCHAR(254),
    youtube VARCHAR(254),
    id_emprendimiento INT,
    CONSTRAINT fk_emprendimientos FOREIGN KEY (id_emprendimiento) REFERENCES emprendimientos(idemprendedimiento)
);

CREATE TABLE alojamientos(
    idalojamiento  INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    id_emprendimiento INT,
    precionoche FLOAT,
    capacidadhabitaciones INT(3),
    capacidadestacionamientos INT(3),
    tipoalojamiento VARCHAR(50),
    piscina BOOLEAN,
    CONSTRAINT fk_emprendimientos FOREIGN KEY (id_emprendimiento) REFERENCES emprendimientos(id_emprendimiento)
);

CREATE TABLE reservas(
    idreservas INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    id_alojamiento INT,
    id_usuario INT,
    fechainicio DATE,
    fechafin DATE,
    horario TIME,
    fechareserva timestamp NOT NULL DEFAULT current_timestamp, 
    CONSTRAINT fk_alojamientos FOREIGN KEY (id_alojamiento) REFERENCES alojamientos(idalojamiento),
    CONSTRAINT fk_usuarios FOREIGN KEY (id_usuario) REFERENCES usuarios(idusuario)
);

CREATE TABLE tours(
    idtour INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    id_emprendimiento  INT,
    encargados VARCHAR(512),
    dificultad  VARCHAR(50),
    fecha DATE,
    CONSTRAINT fk_emprendimientos FOREIGN KEY (id_emprendimiento) REFERENCES emprendimientos(idemprendimiento)
);

CREATE TABLE restaurantes(
    idrestaurante INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    id_emprendimiento INT,
    cantidadmesas INT(3),
    horarios VARCHAR(512),
    CONSTRAINT fk_emprendimientos FOREIGN KEY (id_emprendimiento) REFERENCES emprendimientos(idemprendedimiento)
);

CREATE TABLE platos(
    idplatos  INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    id_restaurante INT,
    categoria VARCHAR(60),
    descripcionplato VARCHAR(100),
    CONSTRAINT fk_restaurantes FOREIGN KEY (id_restaurante) REFERENCES restaurantes(idrestaurante)
);

CREATE TABLE gastronomia(
    idgastronomia INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    tipogastronomia VARCHAR(60),
    id_restaurante INT,
    CONSTRAINT fk_restaurantes FOREIGN KEY (id_restaurante) REFERENCES restaurantes(idrestaurante)
);

CREATE TABLE actividades (
  idactividades INT NOT NULL AUTO_INCREMENT,
  nombre VARCHAR(70) NULL,
  introduccion VARCHAR(120) NULL,
  descripcion TEXT NULL,
  PRIMARY KEY (idactividades));

CREATE TABLE imagenesactividades(
    idactividades INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    link VARCHAR(255),
    tipo VARCHAR(1),
    id_actividad INT,
    CONSTRAINT fk_actividades FOREIGN KEY (id_actividad) REFERENCES actividades(idactividades)
);

alter table alojamientos add vista varchar(20);
alter table alojamientos add hornobarro boolean;
alter table alojamientos add animalesautoctonos boolean;

create table actividadesofrecidas(
	idactividadesofrecidas INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    id_alojamiento INT,
    id_actividad INT,
    CONSTRAINT fk_actividades FOREIGN KEY (id_actividad) REFERENCES actividades(idactividades),
    CONSTRAINT fk_alojamientos FOREIGN KEY (id_alojamiento) REFERENCES alojamientos(idalojamientos)
);

INSERT INTO `turistik`.`actividades` (`idactividades`, `nombre`, `introduccion`, `descripcion`) VALUES ('1', 'Trabajar con cuero', 'Aprende a hacer increíbles billeteras, carteras y mucho más con cuero', 'La artesania o trabajo en cuero es una manualidad con una parte artesanal y otra artistica y creativa que consiste en realizar objetos con cuero curtido o utilizar el cuero como elemento artístico o decorativo. Requiere la aplicación de diferentes pasos como son:  el diseño de la pieza, el corte, el moldeado, la pintura, el cosido y algunos más. A través de ellos se manejan técnicas concretas (algunas de ellas agrupadas bajo el nombre de MARROQUINERIA) como:  labrado, calado, modelado, moldeado, teñido y repujado.  El cuero admite otras manualidades como la combinación con joyeria o el bordado en cuero.LA AFICION DE TRABAJAR EL CUERO ESTA INDICADA  EN PERSONAS AMANTES DE LA ARTESANIA Y MANUALIDADES CON ESPIRITU CREATIVO.');
INSERT INTO `turistik`.`actividades` (`idactividades`, `nombre`, `introduccion`, `descripcion`) VALUES ('2', 'Cocinar comida típica', 'Disfruta de los sabores autóctonos preparados por tus propias manos', 'Los paisajes y su gente son marca registrada de Jujuy y el norte argentino, pero también la cocina jujeña, con sabores únicos y técnicas culinarias que se mantienen de generación a generación en sus recetas.\"Un factor determinante en la agricultura jujeña es el clima y las diferentes alturas sobre el nivel del mar, lo que propicia diversidad en el desarrollo gastronómico\", aseguran. Considerando las cuatro regiones de Jujuy a continuación te describimos las comidas típicas de cada una: Puna: Aquí hay que degustar la calapurca, cocida con piedras ardientes, una sopa majada, la tistincha o tijtincha, una cazuela de cordero o de llama, el huascha locro, los embutidos y diferentes picantes, de pollo, de lengua, de mondongo. Así como probar las diferentes formas y sabores de las papas que se cultivan con métodos ancestrales sin pesticidas ni químicos. Quebrada: Aquí es sorprendente la variedad de papas, maíces, habas, humitas, tamales, empanadas, locro con verdeo, cazuelas de llama y cordero. Y los postres como dulce de cayote con quesillo, el anchi de pelón, o la tradicional mazamorra, aportan dulzor, mientras tortillas fritas y api de maíz son ideales para un tentempié. Yungas: La exuberancia de las frutas tropicales: maracuyá, papaya, palta, plátano, acerola, pitaya, ananá, y el placer en platos inolvidables: humitas y tamales, tartas, yagua, ensaladas variedad con frutas y verduras, chicharrón de pollo y de chancho, api, anchi, arroz con leche, o mazamorra, comparten una gran paleta de sabores. Valles:Junto a los diques, la especialidad es el souflé de pejerrey, la trucha y los buñuelos con miel de caña de la zona. Imposible perderse de los quesillos con cayote, escabeches, asados, cabeza guateada, milanesa de quesillo, bollos o tortillas,  helados con productos nativos fusionan lo tradicional con la cocina gourmet.');
INSERT INTO `turistik`.`actividades` (`idactividades`, `nombre`, `introduccion`) VALUES ('3', 'Cuidar de animales', 'Cuida y dale cariño a nuestros animales autóctonos');
INSERT INTO `turistik`.`actividades` (`idactividades`, `nombre`, `introduccion`) VALUES ('4', 'Conocer acerca de un pueblo originario', 'Descubre las historias y culturas más antiguas de nuestros pueblos');
INSERT INTO `turistik`.`actividades` (`idactividades`, `nombre`, `introduccion`) VALUES ('5', 'Agricultura', 'Trabaja la tierra, sembrando o cosechando frutas y verduras');
INSERT INTO `turistik`.`actividades` (`idactividades`, `nombre`, `introduccion`) VALUES ('6', 'Trabajar con telas', 'Aprende a hacer tejidos, teñidos, bordados y muchas actividades más');
INSERT INTO `turistik`.`actividades` (`idactividades`, `nombre`, `introduccion`) VALUES ('7', 'Artesanías con Barro', 'Aprende a hacer vasijas, vasos, platos y más con barro');

INSERT INTO `turistik`.`imagenesactividades` (`idactividades`, `link`, `tipo`, `id_actividad`) VALUES ('1', 'https://res.cloudinary.com/turistik/image/upload/v1636862768/Actividades/1609630437973_csubcl.jpg', 'P', '1');
INSERT INTO `turistik`.`imagenesactividades` (`idactividades`, `link`, `tipo`, `id_actividad`) VALUES ('2', 'https://res.cloudinary.com/turistik/image/upload/v1636862797/Actividades/jujuy1_778jpg_yg3l3l.jpg', 'P', '2');
INSERT INTO `turistik`.`imagenesactividades` (`idactividades`, `link`, `tipo`, `id_actividad`) VALUES ('3', 'https://res.cloudinary.com/turistik/image/upload/v1636862895/Actividades/llamas_aid48x.jpg', 'P', '3');
INSERT INTO `turistik`.`imagenesactividades` (`idactividades`, `link`, `tipo`, `id_actividad`) VALUES ('4', 'https://res.cloudinary.com/turistik/image/upload/v1636862927/Actividades/601646_20140731111949_b7gfps.jpg', 'P', '4');
INSERT INTO `turistik`.`imagenesactividades` (`idactividades`, `link`, `tipo`, `id_actividad`) VALUES ('5', 'https://res.cloudinary.com/turistik/image/upload/v1636863001/Actividades/productores-de-papa-de-huancavelica-duplicaron-su-produccion-16720_hr0mre.jpg', 'P', '5');
INSERT INTO `turistik`.`imagenesactividades` (`idactividades`, `link`, `tipo`, `id_actividad`) VALUES ('6', 'https://res.cloudinary.com/turistik/image/upload/v1636863074/Actividades/artesana1_xy7wgz.jpg', 'P', '6');
INSERT INTO `turistik`.`imagenesactividades` (`idactividades`, `link`, `tipo`, `id_actividad`) VALUES ('7', 'https://res.cloudinary.com/turistik/image/upload/v1636863092/Actividades/65_hurwkc.jpg', 'P', '7');
INSERT INTO `turistik`.`imagenesactividades` (`idactividades`, `link`, `tipo`, `id_actividad`) VALUES ('8', 'https://res.cloudinary.com/turistik/image/upload/v1636865266/Actividades/Bolso4-2-1024x683_hswy7b.jpg', 'S', '1');

INSERT INTO `turistik`.`actividadesofrecidas` (`idactividadesofrecidas`, `id_alojamiento`, `id_actividad`) VALUES ('1', '3', '1');
INSERT INTO `turistik`.`actividadesofrecidas` (`idactividadesofrecidas`, `id_alojamiento`, `id_actividad`) VALUES ('2', '4', '1');
INSERT INTO `turistik`.`actividadesofrecidas` (`idactividadesofrecidas`, `id_alojamiento`, `id_actividad`) VALUES ('3', '4', '2');

alter table actividades add tipo varchar(1) after nombre;
UPDATE `turistik`.`actividades` SET `tipo` = 'A' WHERE (`idactividades` = '1');
UPDATE `turistik`.`actividades` SET `tipo` = 'A' WHERE (`idactividades` = '2');
UPDATE `turistik`.`actividades` SET `tipo` = 'A' WHERE (`idactividades` = '3');
UPDATE `turistik`.`actividades` SET `tipo` = 'A' WHERE (`idactividades` = '4');
UPDATE `turistik`.`actividades` SET `tipo` = 'A' WHERE (`idactividades` = '5');
UPDATE `turistik`.`actividades` SET `tipo` = 'A' WHERE (`idactividades` = '6');
UPDATE `turistik`.`actividades` SET `tipo` = 'A' WHERE (`idactividades` = '7');

alter table imagenesactividades add publicid varchar(60);