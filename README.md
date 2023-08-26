# Mongo Incidencias

Este archivo funciona para generar peticiones(get) controladas usando middleware de tipos de datos, cantidad de datos, limite de peticiones por token.

##### ¿Cómo usarlo?:

1-clonar el repositorio.

2- instalar node, instalar las dependencias con el comando:

```
npm install
```

3-verificar las variables de entorno en el archivo . env.example (conexion del servidor y de la base de datos en Atlas):

```
My_server={"hostname":"127.10.10.10", "port":"5000"}
ATLAS_USER="nombreusuario"
ATLAS_PASSWORD="contraseña"
ATLAS_DB="Incidencias"
```

4- conectar la base de datos con la extension de visual estudio ( **MongoDB for VS Code** ) la de la hojita verde.

-ingresamos a la extensión oprimimos conectar nos pedirá el link de conexion de la base de datos la cuál encontraremos en la pagina Atlas(ingresamos con el correo, en la parte izquierda la opcion Database, luego en la opción connect, MongoDB for VS code, opción 3)

-Obtenemos un link de esta manera:

| mongodb+srv://nombreusuario:`<password>`@cluster0.vzylork.mongodb.net/ |
| ------------------------------------------------------------------------ |

en el cuál cambiaremos el usuario,la `<password>` y damos enter

nos saldrá una hoja de color verde que nos indica conexión exitosa.

-seguido de ello corremos el archivo db/base_datos.mongodb en la parte superior derecha encontramos un comando de un trinagulo que nos indica la opción Mongo Run.

5-corremos el archivo app.js con el comando

```
npm run dev
```

 en la terminal nos saldrá el puerto de conexión del servidor.

6-con ese puerto realizamos las peticiones:

En todas las solicitudes se debe implementar un token, este token va de acuerdo al rol, en este caso está configurado de la siguiente forma en la base de datos en la coleccion roles:

```
 {
    Id_rol:1,
    nombre_rol: "administrador",
    acceso_rol: ["incidencia", "trainer", "rol"]
  },
  {
    Id_rol:2,
    nombre_rol: "trainer",
    acceso_rol: ["incidencia"]
  }
```

Nota1: el token tiene una duración de 1 minuto, se puede modificar en el archivo middlewares/middlewareJWT.js crearToken/.setExpirationTime('1m')
Nota 2: si generamos el Token administrador: tiene acceso a todas las colecciones y metodos de cada una.
Por el contrario el rol trainer solo tendrá acceso a la coleccion incidencia.

para obtener un toquen se debe hacer la siguiente manera:
para obtener el token para administrador:

```
http://127.10.10.10:5000/token/administrador
```

para obtener el token de trainer:

```
http://127.10.10.10:5000/token/trainer
```

en la parte derecha del thunderCliet nos saldrá un token con unas caracteristicas similaresa este:

```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2wiOiJhZG1pbmlzdHJhZG9yIiwiaWF0IjoxNjkzMDU3MTM1LCJleHAiOjE2OTMwNTc3MzV9.1BKQm5PuIf1y03YexnSevyyqhsYPOqQF92sxL63mkCk
```

este token tiene la informacion codificada del rol :

![1693057222487](image/README/1693057222487.png)

como podemos ver, el token anterior hace referencia al administrador, este token se utilizará en los HTTP Headers con el header Authorization.

si realizas una solicitud con un token que ya caducó con el tiempo, saldrá el siguiente mensaje:

```
{
  "mensaje": "Token inválido"
}
```

si realizas la generación del token con un rol que no existe saldrá el siguiente mensaje:

```
{
  "mensaje": "Rol no encontrado"
}
```

si realizamos una solicitud con un token incorrecto nos saldrá el siguiente mensaje:

```
{
  "mensaje": "Acceso no autorizado a la colección"
}
```

si generamos una solicitud sin dar en los headers la Autorizacion del token nos saldrá un mensaje de la siguiente forma:

```
{
  "mensaje": "Token no proporcionado"
}
```

Nota: cada solicitud tiene un limite de 5 peticiones máximo en 30 segundos.

#### Apartado de las versiones:

Este proyecto cuenta con dos versiones v1 y v2, la versión v1 cuenta con dos metodos get para solicitar la información de manera simple a las colecciones tanto incidencia como trainer.

Por otra parte la version 2 cuenta con un crud completo de colecciones incidencia, trainer y rol. En esta version se podrá realizar una busqueda de información tanto global como especifica por medio del ID del documento a buscar.

estas versiones se hacen con el fin de controlar que usuario puede tener acceso a actividades de importancia como insercion, modificación o eliminación de datos.

#### DTO en las colecciones:

Es de gran importancia verificar la información que el usuario está proporcionando a la hora de insertar o actualizar datos, para ello se creó un DTO con la libreria de express: express-validator en esta encontrarémos basicamente dos mensajes en caso de que la información sea obligatoria o no tenga el formato adecuado:

```
 {
    "type": "field",
    "msg": "el Email_corporativo es obligatorio",
    "path": "Email_corporativo",
    "location": "body"
  },
  {
    "type": "field",
    "msg": "el Email_corporativo debe ser string",
    "path": "Email_corporativo",
    "location": "body"
  },
```

#### paso a paso de realización de una consulta:

1- pedimos el token del rol en este caso rol trainer:
http://127.10.10.10:5000/token/trainer

2- seleccionamos los headers:

![1693058446406](image/README/1693058446406.png)

en este caso podemos ver que seleccionamos accept-version : 2.0.0
y Authorization ponemos el token

cambiamos la url por : http://127.10.10.10:5000/trainer/trainer:
![1693058677230](image/README/1693058677230.png)
como podemos observar el rol trainer no tiene acceso a a la coleccion trainer

ahora cambiamos la url por: http://127.10.10.10:5000/incidencia/incidencia
![1693058772932](image/README/1693058772932.png)
acá si tiene acceso

http://127.10.10.10:5000/incidencia/incidencia = obtener todas las incdencias

http://127.10.10.10:5000/incidencia/incidencia/2= obtener una incidencia especifica por su "Id_incidencia"

http://127.10.10.10:5000/trainer/trainer= obtener todos los trainer

http://127.10.10.10:5000/trainer/trainer/1 =obtener trainer por "Id_trainer"
