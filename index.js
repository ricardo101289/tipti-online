var express = require('express');
var app=express();
var bodyParser = require('body-parser');
var nodemailer = require('nodemailer');
var formidable=require('formidable');
const fs = require('fs-extra')
const port = process.env.PORT || 3000;



//especificamos el subdirectorio donde se encuentran las páginas estáticas
app.use(express.static(__dirname + '/public'));

//extended: false significa que parsea solo string (no archivos de imagenes por ejemplo)
app.use(bodyParser.urlencoded({ extended: true }));

app.post('/index.html', function (req, res) {
    processFormFieldsIndividual(req, res);

});

function processFormFieldsIndividual(req, res) {
    var cont = 0;
    var new_location = "";
    //Store the data from the fields in your data store.
    //The data store could be a file or database or any other store based
    //on your application.
    console.log("desentrañando");
    var fields = [];
    var RutaCurriculum = [];
    var NameCurriculum = [];
    var form = new formidable.IncomingForm();
    //Call back when each field in the form is parsed.
    form.on('field', function (field, value) {
        fields[field] = value;
    });
    //Call back when each file in the form is parsed.
    form.on('file', function (name, file) {
        console.log("100:  "+name);
        //console.log(file);
        fields[name] = file;
        var temp_path = fields[name].path;
        /* The file name of the uploaded file */
        var file_name = fields[name].name;
        console.log("66: "+temp_path);
        console.log("67:  "+file_name);
        console.log(__dirname);
        new_location = __dirname+"/uploads/";
        console.log(new_location);
        RutaCurriculum[name] = new_location+file_name;
        NameCurriculum[name] = file_name;

        fs.copy(temp_path, new_location + file_name, function(err) {
            if (err) {
                console.error(err);
            } else {
                console.log("success!")
            }
        });
        console.log(new_location);

        //Storing the files meta in fields array.
        //Depending on the application you can process it accordingly.
    });
    console.log("direcion universal:  "+new_location);

    //Call back at the end of the form.
    form.on('end', function () {

        /*
        var transporter = nodemailer.createTransport({
            host: 'smtp.office365.com',
            port: '587',
            auth: { user: 'ricardo.galarza@tipti.market', pass: 'Corazon2' },
            secureConnection: 'false',
            tls: { ciphers: 'SSLv3' }
        });
        */


        var transporter = nodemailer.createTransport({
            service: 'Gmail',
            auth: {
                user: 'Tipti.market.mail@gmail.com',
                pass: 'tipti2017'
            }
        });


        console.log("formulario enviado");
        //console.log(req.body);
        if ( fields['form_id'] === "formReteiler" ) {

                var mailOptions = {
                    from: fields['Email'] , to: 'ricardo101289@gmail.com, lmishelle16@gmail.com, rafael.luque@tipti.market, rluque.jara@tipti.market, pierangela@tipti.market',
                    subject: 'Queremos ser tu socio comercial',
                    text: 'Mensaje',
                    html: '<p>Nombre del Local: '+fields['nombreLocal']+'</p>' +
                    '<p>Tipo de Retailer: '+fields['tipoRetailer']+'</p>'+
                    '<p>Ciudad: '+fields['Ciudad']+'</p>'+
                    '<p>Nombre de contacto: '+fields['nombreContacto']+'</p>'+
                    '<p>Cargo: '+fields['Cargo']+'</p>'+
                    '<p>Telefono: '+fields['Telefono']+'</p>'+
                    '<p>Email: '+fields['Email']+'</p>'+
                    '<p>Mensaje: </p>'+
                    '<p>'+fields['Mensaje']+'</p>'
                };
                /*
                var mailOptions = {
                from: fields['Email'] , to: 'ricardo101289@gmail.com, rafael.luque@tipti.market, rluque.jara@tipti.market, pierangela@tipti.market',
                subject: 'Queremos ser tu socio comercial',
                text: 'Mensaje',
                html: '<p>Nombre del Local: '+fields['nombreLocal']+'</p>' +
                '<p>Tipo de Retailer: '+fields['tipoRetailer']+'</p>'+
                '<p>Ciudad: '+fields['Ciudad']+'</p>'+
                '<p>Nombre de contacto: '+fields['nombreContacto']+'</p>'+
                '<p>Cargo: '+fields['Cargo']+'</p>'+
                '<p>Telefono: '+fields['Telefono']+'</p>'+
                '<p>Email: '+fields['Email']+'</p>'+
                '<p>Mensaje: </p>'+
                '<p>'+fields['Mensaje']+'</p>'
            };
            */
        }else if ( fields['form_id'] === "formShopperjob" ) {
            console.log("for con archivos");
            var mailOptions = {
                from: fields['emailShopper'] , to: 'ricardo101289@gmail.com, lmishelle16@gmail.com, rafael.luque@tipti.market, rluque.jara@tipti.market, talento.humano@productivos.ec',
                subject: 'CURRICULUM DEL SHOPPER',
                text: 'Mensaje',
                html: '<p>Nombres: '+fields['nombreShopper']+'</p>' +
                '<p>Email: '+fields['emailShopper']+'</p>'+
                '<p>Dirección: '+fields['DireccionShopper']+'</p>'+
                '<p>Telefono: '+fields['TelefonoShopper']+'</p>'+
                '<p>Fecha de Nacimiento: '+fields['fechaNacimiento']+'</p>'+
                '<p>Provincia: '+fields['provinciaShopper']+'</p>'+
                '<p>Ciudad: '+fields['CiudadShopper']+'</p>'+
                '<p>Disponibilidad: '+fields['DisponibilidadShopper']+' Desde: '+fields['desdeShopper']+' Hasta: '+fields['hastaShopper']+'</p>'+
                '<p>Curriculum: </p>',
                attachments: [{filename: NameCurriculum['curriculumShopper'],
                                path: RutaCurriculum['curriculumShopper'] // stream this file}]
                            }, {filename: NameCurriculum['fotoShopper'],
                                path: RutaCurriculum['fotoShopper'] // stream this file}]
                            },
                            {filename: NameCurriculum['esperienciaShopper'],
                                path: RutaCurriculum['esperienciaShopper'] // stream this file}]
                            },{filename: NameCurriculum['referenciaShopper'],
                                path: RutaCurriculum['referenciaShopper'] // stream this file}]
                            },{filename: NameCurriculum['cedulaShopper'],
                                path: RutaCurriculum['cedulaShopper'] // stream this file}]
                            }]
            };
            /*
            var mailOptions = {
                from: fields['emailShopper'] , to: 'ricardo101289@gmail.com, rafael.luque@tipti.market, rluque.jara@tipti.market, talento.humano@productivos.ec',
                subject: 'CURRICULUM DEL SHOPPER',
                text: 'Mensaje',
                html: '<p>Nombres: '+fields['nombreShopper']+'</p>' +
                '<p>Email: '+fields['emailShopper']+'</p>'+
                '<p>Dirección: '+fields['DireccionShopper']+'</p>'+
                '<p>Telefono: '+fields['TelefonoShopper']+'</p>'+
                '<p>Fecha de Nacimiento: '+fields['fechaNacimiento']+'</p>'+
                '<p>Provincia: '+fields['provinciaShopper']+'</p>'+
                '<p>Ciudad: '+fields['CiudadShopper']+'</p>'+
                '<p>Disponibilidad: '+fields['DisponibilidadShopper']+' Desde: '+fields['desdeShopper']+' Hasta: '+fields['hastaShopper']+'</p>'+
                '<p>Curriculum: </p>'+
                '<p>          : '+RutaCurriculum['curriculumShopper']+'</p>'+
                '<p>            '+RutaCurriculum['fotoShopper']+'</p>'+
                '<p>            '+RutaCurriculum['esperienciaShopper']+'</p>'+
                '<p>            '+RutaCurriculum['referenciaShopper']+'</p>'+
                '<p>            '+RutaCurriculum['cedulaShopper']+'</p>'
            };
            */
            //console.log(req.body);
        }else if ( fields['form_id'] === "formSector" ) {
            console.log("form Sector");
            var mailOptions = {
                from: fields['usuario_correo'] , to: 'ricardo101289@gmail.com, lmishelle16@gmail.com, rafael.luque@tipti.market, care.team@tipti.market, rluque.jara@tipti.market',
                subject: 'SECTOR NO ENCONTRADO',
                text: 'Mensaje',
                html: '<p>Nombre de Usuario: '+fields['usuario_nombre']+'</p>' +
                '<p>Email: '+fields['usuario_correo']+'</p>'+
                '<p>Celular: '+fields['usuario_celular']+'</p>'+
                '<p>Ciudad: '+fields['usuario_Ciudad']+'</p>'+
                '<p>Sector: '+fields['usuario_sector']+'</p>'
            };
            /*
            var mailOptions = {
                from: fields['usuario_correo'] , to: 'ricardo101289@gmail.com, rafael.luque@tipti.market, saidy.larrea@tipti.market, rluque.jara@tipti.market',
                subject: 'SECTOR NO ENCONTRADO',
                text: 'Mensaje',
                html: '<p>Nombre de Usuario: '+fields['usuario_nombre']+'</p>' +
                '<p>Email: '+fields['usuario_correo']+'</p>'+
                '<p>Celular: '+fields['usuario_celular']+'</p>'+
                '<p>Ciudad: '+fields['usuario_Ciudad']+'</p>'+
                '<p>Sector: '+fields['usuario_sector']+'</p>'
            };
            */
            //console.log(req.body);
        }
        else if ( fields['form_id'] === "formContactanos" ) {
            console.log("form Sector");
            var mailOptions = {
                from: fields['usuario_correo'] , to: 'ricardo101289@gmail.com, care.team@tipti.market, lmishelle16@gmail.com, rafael.luque@tipti.market, rluque.jara@tipti.market, andrea.galiano@tipti.market, pierangela@tipti.market',
                subject: 'Contactanos',
                text: 'Mensaje',
                html: '<p>Nombre de Usuario: '+fields['usuario_nombres']+'</p>' +
                '<p>Email: '+fields['usuario_correo']+'</p>'+
                '<p>Ciudad: '+fields['usuario_Ciudad']+'</p>'+
                '<p>Comentario: '+fields['usuario_comentario']+'</p>'
            };
            /*
            var mailOptions = {
                from: fields['usuario_correo'] , to: 'ricardo101289@gmail.com, saidy.larrea@tipti.market, lmishelle16@gmail.com, rafael.luque@tipti.market, rluque.jara@tipti.market, andrea.galiano@tipti.market, pierangela@tipti.market',
                subject: 'SECTOR NO ENCONTRADO',
                text: 'Mensaje',
                html: '<p>Nombre de Usuario: '+fields['usuario_nombres']+'</p>' +
                '<p>Email: '+fields['usuario_correo']+'</p>'+
                '<p>Ciudad: '+fields['usuario_Ciudad']+'</p>'+
                '<p>Comentario: '+fields['usuario_comentario']+'</p>'
            };
            */
            //console.log(req.body);
        }
        transporter.sendMail(mailOptions, function(error, info){
            if(error){
                return console.log(error);
            }

            console.log('Mensaje enviado: ' + info.response);
        });
        res.redirect('/index.html');
    });

    form.parse(req);
}



var server=app.listen(port,function(){
    console.log('Servidor web iniciado');
});
