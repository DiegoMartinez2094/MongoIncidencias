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

6-con ese puerto realizamos las peticiones ejemplo:

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
