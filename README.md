# Appmobile Teletón #
=====================

Instrucciones setup entorno proyecto completo

## SETUP ##
Dependencias de npm

    Pueden instalarse de forma global:
        npm install
    O de forma individual:
        npm install -g gulp
        npm install -g gulp-cli
        npm install -g bower
        (pueden existir más dependencias)
Una vez estén estas, ejecutar la instalación de bower:

    bower install --force

Esto instalará las dependencias internas del proyecto.

Cuando esta haya terminado, restaurar estado de ionic

    ionic setup sass
    ionic state restore
    
## NÚMERO DE BUILD/NOMBRE APP ##

	Editar config.xml

## PRUEBAS ##

Prueba en browser

```
ionic serve
```

CUIDADO! Al emular en browser **NO** se cargarán los plugins de cordova.

Para probar en emulador
```
ionic emulate ios / android
```
Para probar en dispositivo
```
ionic run ios / android
```

## GENERAR VERSIÓN ##

	ionic build ios/android

## ANÁLISIS ESTÁTICO ##

En caso de no tener las dependencias instaladas, será necesario hacer npm install de nuevo.
