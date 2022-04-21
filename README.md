Se realizo un backend compuesto de dos servicios distribuidos, sirviendo la funcionalidad para una red social.

Uno de ellos sirve como servicio de Usuarios, que permite tanto la autenticacion que permite el registro e inicio de sesion de usuarios
como seguir usuarios y dejarlos de seguir (Funcionalidad de Amigos).

El segundo servicio sirve como API permitiendo la creacion de publicaciones (de puro texto), 
con las funcionalidades de comentar y reaccionar a ella dando dando likes.

Se pueden acceder a ambos servicios a traves de un proxy con el que interactua el usuario.

Se implemento servicio de caching para reducir los tiempos de respuesta a las peticiones utilizando Redis

Ambos servicios cuentan con un middleware de logging utilizando Morgan, el cual envia logs a un archivo txt en la raiz del proyecto con el objetivo
de agregar esos logs en una base de datos posteriormente.

**PUERTOS DE CADA SERVICIO**

Servicio de Usuarios: 3000
Servicio de API: 4000
Proxy a los servicios: 5000

**PROYECTO EN DESARROLLO**

Victor Atencio. C.I:28.252.900.
Introduccion a Sistemas Distribuidos 2022A