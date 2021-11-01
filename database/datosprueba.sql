INSERT INTO usuarios (nombre,apellido,email,contrasena,tipo) VALUES ("Bree","Hogan","velit.justo.nec@vitaenibhdonec.edu","QVC97ZLP2GL",'A'),
  ("Holmes","Logan","dolor@atrisusnunc.ca","ERN12HJS7JC",'A'),
  ("Mallory","Mccray","ultricies@per.co.uk","QYY73OEQ4GD",'U'),
  ("Chester","Mcfarland","neque@atpede.edu","PDG03BPG8JV",'U'),
  ("Candace","Gross","scelerisque@magnasedeu.net","LWE33XLC0KR",'E'),
  ("Frances","Stokes","diam@duinecurna.com","JEM46LHN8ES",'E'),
  ("Russell","Fischer","aliquet.magna.a@aodio.net","CNY27ERW4DG",'A'),
  ("Yuri","Long","luctus.curabitur@metusfacilisis.co.uk","YIF44JXB9PA",'U');

INSERT INTO administradores (dni,id_usuario) VALUES (14563896,1),(36985120,2);

INSERT INTO emprendedores (dni,cuil,categoriaafip,id_usuario) VALUES (18693452,"27-18693452-8",'IVA Responsable Inscripto',5),(26307856,"20-26307856-3","Consumidor Final",6);

/* otras categorías AFIP
IVA Responsable Inscripto
IVA Responsable no Inscripto
IVA no Responsable
IVA Sujeto Exento
Consumidor Final
Responsable Monotributo
Sujeto no Categorizado
Proveedor del Exterior
Cliente del Exterior
IVA Liberado – Ley Nº 19.640
IVA Responsable Inscripto – Agente de Percepción
Pequeño Contribuyente Eventual
Monotributista Social
Pequeño Contribuyente Eventual Social
*/
INSERT INTO localidades(nombrelocalidad,departamento) VALUES ("Abdón Castro Tolay","Cochinoca"),("Abralaite","Cochinoca"),("Abra Pampa","Cochinoca"),("Agua de Castilla","Cochinoca"),("Aguas Calientes","El Carmen"),("Aparzo","Humahuaca"),("Arrayanal", "San Pedro"),("Arroyo Colorado", "San Pedro"),("Bananal","Ledesma"),("Bárcena","Tumbaya"),("Barrios","Yavi"),("Bermejito","Ledesma"),("Caimancito","Ledesma"),("Calilegua","Ledesma"),("Cangrejillos","Yavi"),("Carahunco","Palpalá"),("Casabindo","Cochinoca"),("Casa Colorada","Rinconada"),("Caspalá","Valle Grande"),("Catua","Susques"),("Centro Forestal","Palpalá"),("Chalicán","Ledesma"),("Cianzo","Humahuaca"),("Ciénaga de Paicone","Santa Catalina"),("Cienegillas","Santa Catalina"),("Cochinoca","Cochinoca"),("Colonia San José","Tilcara"),("Coranzulí","Susques"),("Coyaguaima","Rinconada"),("Cusi Cusi","Santa Catalina"),("Don Emilio","San Pedro"),("El Acheral","San Pedro"),("El Aguilar","San Pedro"),("El Angosto","Santa Catalina"),("El Carmen","El Carmen"),("El Ceibal","San Antonio"),("El Cóndor","Yavi"),("El Fuerte","Santa Bárbara"),("El Moreno","Tumbaya"),("El Piquete","Santa Bárbara"),("El Puesto","San Pedro"),("El Quemado","San Pedro"),("El Talar","Santa Bárbara"),("El Toro","Susques"),("Fraile Pintado","Ledesma"),("Guerrero","Doctor Manuel Belgrano"),("Hipólito Yrigoyen","Humahuaca"),("Huáncar","Susques"),("Humahuaca","Humahuaca"),("Jama","Susques"),("Juella","Tilcara"),("La Almona","Doctor Manuel Belgrano"),("La Ciénaga","Santa Catalina"),("La Esperanza","San Pedro"),("Lagunillas de Farallón","Rinconada"),("La Intermedia","Yavi"),("La Manga","San Pedro"),("La Mendieta","San Pedro"),("La Quiaca","Yavi"),("La Redonda","Cochinoca"),("León","Doctor Manuel Belgrano"),("Libertad","Ledesma"),("Libertador General San Martín","Ledesma"),("Liviara","Rinconada"),("Llulluchayoc","Yavi"),("Loma Blanca","Rinconada"),("Los Alisos","San Antonio"),("Los Lapachos","El Carmen"),("Lozano","Doctor Manuel Belgrano"),("Maimará","Tilcara"),("Manantiales","El Carmen"),("Mina Providencia","Susques"),("Miraflores","San Pedro"),("Misarrumi","Santa Catalina"),("Monterrico","El Carmen"),("Nuestra Señora del Rosario","San Antonio"),("Nuevo Pirquitas","Rinconada"),("Ocloyas","Doctor Manuel Belgrano"),("Olacapato","Susques"),("Olaroz Chico","Susques"),("Oratorio","Santa Catalina"),("Orosmayo","Rinconada"),("Paicone","Santa Catalina"),("Palca de Aparzo","Humahuaca"),("Palca de Varas","Humahuaca"),("Palma Sola","Santa Bárbara"),("Palos Blancos","San Pedro"),("Palpalá","Palpalá"),("Pampa Blanca","El Carmen"),("Pampichuela","Valle Grande"),("Parapetí","San Pedro"),("Pastos Chicos","Susques"),("Paulina","Ledesma"),("Perico","El Carmen"),("Piedritas","San Pedro"),("Puente Lavayén","Santa Bárbara"),("Puerta de Colorados","Tumbaya"),("Puesto del Marquéz","Cochinoca"),("Puesto Sey","Susques"),("Puesto Viejo","El Carmen"),("Pumahuasi","Yavi"),("Purmamarca","Tumbaya"),("Quebraleña","Cochinoca"),("Quera","Cochinoca"),("Rinconada","Rinconada"),("Rinconadillas","Cochinoca"),("Rodeito","San Pedro"),("Rodero","Humahuaca"),("Rosario de Río Grande","San Pedro"),("San Antonio","San Antonio"),("San Antonio-SP","San Pedro"),("San Fancisco","Valle Grande"),("San Francisco de Alfarcito","Cochinoca"),("San Isidro","El Carmen"),("San Juancito","El Carmen"),("San Juan de Oros","Santa Catalina"),("San Juan de Quillaqués","Susques"),("San Lucas","San Pedro"),("San Pedro","San Pedro"),("San Salvador de Jujuy","Doctor Manuel Belgrano"),("Santa Ana","Valle Grande"),("Santa Ana de la Puna","Cochinoca"),("Santa Catalina","Santa Catalina"),("Santa Clara","Santa Bárbara"),("Santuario de Tres Pozos","Cochinoca"),("Sauzal","San Pedro"),("Susques","Susques"),("Tambillos","Cochinoca"),("Tesorero","Doctor Manuel Belgrano"),("Tilcara","Tilcara"),("Tres Cruces","Humahuaca"),("Tumbaya","Tumbaya"),("Tusaquillas","Cochinoca"),("Uquía","Humahuaca"),("Valle Colorado","Valle Grande"),("Valle Grande","Valle Grande"),("Vinalito","Santa Bárbara"),("Volcán","Tumbaya"),("Yala","Doctor Manuel Belgrano"),("Yavi","Yavi"),("Yavi Chico","Yavi"),("Yoscaba","Santa Catalina"),("Yuto","Ledesma");

INSERT INTO emprendimientos(ubicacion,estadosolicitud,nombreemprendimiento,descripcion,categoria,id_emprendedor,id_localidad) VALUES ("Belgrano 730","A","Dormilon","Una pequeña casita hogareña","A",1,130),("Almirante Brown 1120","A","Departamento Centrico","Excelente departamento con vista a toda la ciudad, amplio","A",2,120);

INSERT INTO denuncias (motivo,descripcion,id_emprendimiento) VALUES ('Insalubridad',"dshjsdhhsdsbdbdhsdjjanandbcbajkajjksjkdhjfhhfd",2),('Lugar Inexistente',"vgbshcjidc abahgdghagd caxhdgaghds chsdjhsahcbnsnbbv,gshjsjsghjbs",1),
('Incumplimiento de la reserva',"dfghjk dshadsjhaj uywqiuewe iqeobedbdb  cjqebhqhqeddq dqjdhqjdhkqddbbf",2),('Otro',"vbsdnns dsbwubd wubfbw f wfuhfnbwf wf hwfbw e d  dnabdwhedbewd ehfefbebf",1);


INSERT INTO alojamientos(id_emprendimiento,precionoche,capacidadhabitaciones,capacidadestacionamientos,tipoalojamiento,piscina) VALUES (1,2500,2,1,'Casa',0),(2,3200,3,1,'Departamento',1);

INSERT INTO imagenes(idimagen,link,tipo,id_emprendimiento) VALUES (1,'https://res.cloudinary.com/dc2e2mtjd/image/upload/v1635714692/alojamiento_2_e7u7hv.jpg','P',1),(2,'https://res.cloudinary.com/dc2e2mtjd/image/upload/v1635714692/alojamiento_1_gvsfmb.jpg','P',2);
