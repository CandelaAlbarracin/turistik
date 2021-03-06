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

CREATE TABLE denuncias(
    nroDenuncia INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    motivo VARCHAR(50),
    descripcion TEXT,
    id_emprendimiento INT,
    CONSTRAINT
    fk_emprendimientos
    FOREIGN KEY (id_emprendimiento) REFERENCES emprendimientos(idemprendimiento)
);
--probar con fk_emprendimientos1 si no deja crearla 

CREATE TABLE imagenes(
    idimagen INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    link VARCHAR(255),
    tipo VARCHAR(1),
    id_emprendimiento INT,
    CONSTRAINT fk_emprendimientos FOREIGN KEY (id_emprendimiento) REFERENCES emprendimientos(idemprendimiento)
);



CREATE TABLE `calificaciones` (
  `idcalificacion` int NOT NULL AUTO_INCREMENT,
  `id_usuario` int DEFAULT NULL,
  `id_emprendimiento` int DEFAULT NULL,
  `puntuacion` int DEFAULT NULL,
  `comentario` text,
  PRIMARY KEY (`idcalificacion`),
  KEY `fk_usuarios` (`id_usuario`),
  KEY `fk_emprendimientos` (`id_emprendimiento`)
);
 --probar fk_usuarios1
 --probar con fk_emprendimientos3

CREATE TABLE `contacto` (
  `idcontacto` int NOT NULL AUTO_INCREMENT,
  `telefono` varchar(20) DEFAULT NULL,
  `facebook` varchar(254) DEFAULT NULL,
  `instagram` varchar(254) DEFAULT NULL,
  `youtube` varchar(254) DEFAULT NULL,
  `id_emprendimiento` int DEFAULT NULL,
  PRIMARY KEY (`idcontacto`),
  KEY `fk_emprendimientos` (`id_emprendimiento`)
);
--probar con fk_emprendimitos5

CREATE TABLE `alojamientos` (
  `idalojamiento` int NOT NULL AUTO_INCREMENT,
  `id_emprendimiento` int DEFAULT NULL,
  `precionoche` float DEFAULT NULL,
  `capacidadhabitaciones` int DEFAULT NULL,
  `capacidadestacionamientos` int DEFAULT NULL,
  `tipoalojamiento` varchar(50) DEFAULT NULL,
  `piscina` tinyint(1) DEFAULT NULL,
  `vista` varchar(20) DEFAULT NULL,
  `hornobarro` tinyint(1) DEFAULT NULL,
  `animalesautoctonos` tinyint(1) DEFAULT NULL,
  PRIMARY KEY (`idalojamiento`),
  KEY `fk_emprendimientos` (`id_emprendimiento`)
)
--probar con fk_emprendimientos6

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
--probar con fk_usuarios2

CREATE TABLE tours(
    idtour INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    id_emprendimiento  INT,
    encargados VARCHAR(512),
    dificultad  VARCHAR(50),
    fecha DATE,
    CONSTRAINT 
    fk_emprendimientos FOREIGN KEY (id_emprendimiento) REFERENCES emprendimientos(idemprendimiento)
);
--probar con fk_emprendimientos10 

CREATE TABLE restaurantes(
    idrestaurante INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    id_emprendimiento INT,
    cantidadmesas INT(3),
    horarios VARCHAR(512),
    CONSTRAINT 
    fk_emprendimientos FOREIGN KEY (id_emprendimiento) REFERENCES emprendimientos(idemprendimiento)
);
  --probar con fk_emprendimientos8

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
    CONSTRAINT 
    fk_restaurantes FOREIGN KEY (id_restaurante) REFERENCES restaurantes(idrestaurante)
);
    --probar con fk_restaurantes1

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
    CONSTRAINT
    --probar fk_actividades3
    fk_actividades FOREIGN KEY (id_actividad) REFERENCES actividades(idactividades),
    CONSTRAINT 
    --probar fk_alojamientos2
    fk_alojamientos FOREIGN KEY (id_alojamiento) REFERENCES alojamientos(idalojamiento)
);

INSERT INTO `turistik`.`actividades` (`idactividades`, `nombre`, `introduccion`, `descripcion`) VALUES ('1', 'Trabajar con cuero', 'Aprende a hacer incre??bles billeteras, carteras y mucho m??s con cuero', 'La artesania o trabajo en cuero es una manualidad con una parte artesanal y otra artistica y creativa que consiste en realizar objetos con cuero curtido o utilizar el cuero como elemento art??stico o decorativo. Requiere la aplicaci??n de diferentes pasos como son:  el dise??o de la pieza, el corte, el moldeado, la pintura, el cosido y algunos m??s. A trav??s de ellos se manejan t??cnicas concretas (algunas de ellas agrupadas bajo el nombre de MARROQUINERIA) como:  labrado, calado, modelado, moldeado, te??ido y repujado.  El cuero admite otras manualidades como la combinaci??n con joyeria o el bordado en cuero.LA AFICION DE TRABAJAR EL CUERO ESTA INDICADA  EN PERSONAS AMANTES DE LA ARTESANIA Y MANUALIDADES CON ESPIRITU CREATIVO.');
INSERT INTO `turistik`.`actividades` (`idactividades`, `nombre`, `introduccion`, `descripcion`) VALUES ('2', 'Cocinar comida t??pica', 'Disfruta de los sabores aut??ctonos preparados por tus propias manos', 'Los paisajes y su gente son marca registrada de Jujuy y el norte argentino, pero tambi??n la cocina juje??a, con sabores ??nicos y t??cnicas culinarias que se mantienen de generaci??n a generaci??n en sus recetas.\"Un factor determinante en la agricultura juje??a es el clima y las diferentes alturas sobre el nivel del mar, lo que propicia diversidad en el desarrollo gastron??mico\", aseguran. Considerando las cuatro regiones de Jujuy a continuaci??n te describimos las comidas t??picas de cada una: Puna: Aqu?? hay que degustar la calapurca, cocida con piedras ardientes, una sopa majada, la tistincha o tijtincha, una cazuela de cordero o de llama, el huascha locro, los embutidos y diferentes picantes, de pollo, de lengua, de mondongo. As?? como probar las diferentes formas y sabores de las papas que se cultivan con m??todos ancestrales sin pesticidas ni qu??micos. Quebrada: Aqu?? es sorprendente la variedad de papas, ma??ces, habas, humitas, tamales, empanadas, locro con verdeo, cazuelas de llama y cordero. Y los postres como dulce de cayote con quesillo, el anchi de pel??n, o la tradicional mazamorra, aportan dulzor, mientras tortillas fritas y api de ma??z son ideales para un tentempi??. Yungas: La exuberancia de las frutas tropicales: maracuy??, papaya, palta, pl??tano, acerola, pitaya, anan??, y el placer en platos inolvidables: humitas y tamales, tartas, yagua, ensaladas variedad con frutas y verduras, chicharr??n de pollo y de chancho, api, anchi, arroz con leche, o mazamorra, comparten una gran paleta de sabores. Valles:Junto a los diques, la especialidad es el soufl?? de pejerrey, la trucha y los bu??uelos con miel de ca??a de la zona. Imposible perderse de los quesillos con cayote, escabeches, asados, cabeza guateada, milanesa de quesillo, bollos o tortillas,  helados con productos nativos fusionan lo tradicional con la cocina gourmet.');
INSERT INTO `turistik`.`actividades` (`idactividades`, `nombre`, `introduccion`) VALUES ('3', 'Cuidar de animales', 'Cuida y dale cari??o a nuestros animales aut??ctonos');
INSERT INTO `turistik`.`actividades` (`idactividades`, `nombre`, `introduccion`) VALUES ('4', 'Conocer acerca de un pueblo originario', 'Descubre las historias y culturas m??s antiguas de nuestros pueblos');
INSERT INTO `turistik`.`actividades` (`idactividades`, `nombre`, `introduccion`) VALUES ('5', 'Agricultura', 'Trabaja la tierra, sembrando o cosechando frutas y verduras');
INSERT INTO `turistik`.`actividades` (`idactividades`, `nombre`, `introduccion`) VALUES ('6', 'Trabajar con telas', 'Aprende a hacer tejidos, te??idos, bordados y muchas actividades m??s');
INSERT INTO `turistik`.`actividades` (`idactividades`, `nombre`, `introduccion`) VALUES ('7', 'Artesan??as con Barro', 'Aprende a hacer vasijas, vasos, platos y m??s con barro');

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

create table sitiosguardados(
	idguardado INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    id_emprendimiento INT,
    id_usuario INT,
    CONSTRAINT 
    
    fk_emprendimiento
    FOREIGN KEY (id_emprendimiento) REFERENCES emprendimientos(idemprendimiento),
    CONSTRAINT 
    
    fk_usuario FOREIGN KEY (id_usuario) REFERENCES usuarios(idusuario)
);
--fk_emprendimiento12
--fk_usuario6

rename table sitio to calificaciones;

--fk_actividades9
create table toursofrecidos (
	idtoursofrecidos INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    id_tour INT,
    id_actividad INT,
    CONSTRAINT 
    fk_actividades9 FOREIGN KEY (id_actividad) REFERENCES actividades(idactividades),
    CONSTRAINT fk_tours FOREIGN KEY (id_tour) REFERENCES tours(idtour)
);

alter table tours add duracion time;
alter table tours add recomendaciones TEXT;
alter table tours add precio float;
alter table tours drop encargados;
alter table tours drop fecha;

INSERT INTO `turistik`.`tours` (`idtour`, `id_emprendimiento`, `dificultad`, `duracion`, `recomendaciones`) VALUES ('1', '6', 'Media', '04:00', 'llevar sombrero, abrigo,  zapatos de trekking y protecci??n solar.');

INSERT INTO `turistik`.`toursofrecidos` (`idtoursofrecidos`, `id_tour`, `id_actividad`) VALUES ('1', '1', '15');
