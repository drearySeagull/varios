$(document).ready(function () {

    //Añadir clase para destacar la selección
    $('.seleccion').on('click', function(event){
        event.preventDefault();
        //La cantidad de fotos maximas a mostrar debe ser minimo 15
        //si no la api falla
        var maxFoto = 40;
        var query;
        var contador = 0, actual = 0;
        var opciones;
        $('.seleccion .active').removeClass('active');
        $(this).addClass('active').siblings().removeClass('active');
        $(this).css("border", "2px solid #40678c").addClass("active").siblings().css("border", "2px solid rgba(0, 0, 0, 0)");
        //Asignar valor a value en input tipo hidden con name categoría
        if($(this).hasClass("active")){
            var nombre = $(this).children(".titulo_cat").attr("id");
            console.log(nombre);
            $("input[name='categoria']").val(nombre);
        }
        //El switch se debe a que la pagina de la api es en ingles por lo que se debe de traducir
        switch(nombre){
            case "Restaurante":
                query = "restaurant";
                break;
            case "Fotografia":
                query = "Photography";
                break;
            case "Moda": 
                query = "fashion";
                break;
        }
        opciones = $(".opcion-fondo");
        opciones.children().remove();
        $.ajax({
            beforeSend: function (xhr){
                xhr.setRequestHeader ("Authorization", "563492ad6f91700001000001f253bdda591f4ec682182bca770e5033");
            },
            url: "https://api.pexels.com/v1/search?query="+query+"&per_page="+maxFoto+"&page=1",
            type: "get",
            dataType: "json",
            success: function(data){
                while(contador < maxFoto){
                    if(actual == 4){
                        opciones.append(
                            "<div class='imagenesDefecto clear'><img src='"+data["photos"][contador]["src"]["small"]+"' id='fotoPred"+contador+"' name='fotoPred"+contador+"' value='"+data["photos"][contador]["src"]["large2x"]+"'></img></div>"
                        );
                        actual = 0;
                    }else{
                        opciones.append(
                            "<div class='imagenesDefecto'><img src='"+data["photos"][contador]["src"]["small"]+"' id='fotoPred"+contador+"' name='fotoPred"+contador+"' value='"+data["photos"][contador]["src"]["large2x"]+"'></img></div>"
                        );
                    }
                    actual++;
                    contador++;
                }
                $('.imagenesDefecto').on('click', function(){
                    var fondo = $(this).children("img").attr("value");
                    $(this).css("border", "2px solid #40678c").addClass("active").siblings().css("border", "2px solid rgba(0, 0, 0, 0)");
                    if($(this).hasClass("active")){
                        $("input[name='fondoPred']").val(fondo);
                        $(".fondop").children("img").attr({"src": fondo});
                        $(".fondop").children("img").addClass("fondoImg").removeClass("fondoColor");
                        $("#classPreview").val("fondoImg");
                    }
                });
            },
            error: function(data) {
                alert(data.mensaje + "No");
            }
        });
    });

    $(".caracteristicas").on("click", function(event){
        $(this).css("border", "2px solid #40678c").siblings().css("border", "2px solid rgba(0, 0, 0, 0)");
    });


    $(".eligeDisenio").on("click", function(){
        $(this).css("border", "2px solid #40678c").siblings("div").css("border", "2px solid rgba(0, 0, 0, 0)");
        var disenio = $(this).children("img").attr("value");
        $("input[name='disenio']").val(disenio);
        $(".marco").attr("src", "preview/" + disenio + ".png");
        switch(disenio){
            case "1":
                $(".preview").children(".menLat").remove();
                $(".preview").append("<div class='menLat'> </div>");
                $(".menLat").css("background-color", $("#colFondo").val());

                $(".preview").children(".menSup").remove();
                $(".preview").append("<div class='menSup'> </div>");
                $(".menSup").css("background-color", $("#colFondo").val());
            break;
            case "2":
                $(".preview").children(".menLat").remove();
                $(".preview").children(".menSup").remove();
                $(".preview").append("<div class='menSup'> </div>");
                $(".menSup").css("background-color", $("#colFondo").val());
            break;
        }
    });


    //Pedir fotos a pexels.com con su api que nos devuelve el siguiente body
    /*
        PAra tener la api hay que registrarse y en el footer buscar "api"
        https://www.pexels.com
        poner authorization
        url de peticion --> https://api.pexels.com/v1/search?query=example+query&per_page=15&page=1
        per_page --> por defecto 15
        page --> por defecto 1
    {
      page: 1,
      per_page: 15,
      total_results: 236,
      url: "https://www.pexels.com/search/example%20query/",
      next_page: "https://api.pexels.com/v1/search/?page=2&per_page=15&query=example+query"
      photos: [{
        width: 1000,
        height: 1000,
        url: "https://www.pexels.com/photo/12345",
        photographer: "Name",
        src: {
          original: "https://*.jpg",
          large: "https://*.jpg",
          large2x: "https://*.jpg",
          medium: "https://*.jpg",
          small: "https://*.jpg",
          portrait: "https://*.jpg",
          landscape: "https://*.jpg",
          tiny: "https://*.jpg"
        }, (NEXT PHOTOS)]
      }
    }
    */

    //Desactivar submit hasta que no se escriba el nombre de la app, poner hasta que no tenga fondo y no haya categoria
    if($('.tituloApp input[type="submit"]').attr("name") == "siguiente"){
        $('.tituloApp input[type="submit"]').attr('disabled','disabled');
    }

   /* $('input[name="nombreApp"]').keypress(function(){
        if($('input[name="nombreApp"]').val().length > 3){
            $('.tituloApp input[type="submit"]').removeAttr('disabled');
        }
    });*/

    $('input[name="nombreApp"]').keypress(function(){
        if($('input[name="nombreApp"]').val().length >= 3){
            $('.tituloApp input[type="submit"]').removeAttr('disabled');
        }
    });
   

    //Pop Up login
    $("#registrar").hide();

    $("#loginBtn").on("click", function(){
        $("#login").show();
        $("#registrar").hide();
        $("#registrarBtn").addClass('disable');
        $("#loginBtn").removeClass('disable');
    });

    $("#registrarBtn").on("click", function(){
        $("#registrarBtn").removeClass('disable');
        $("#login").hide();
        $("#loginBtn").addClass('disable');
        $("#registrar").show();
    });

    //Mostrar y ocultar detalles
    $(".pagina1").on("click", function(){
        $(".detalle").children("div").css("display", "none");
        $(".detalle-home").css("display", "inline");
    });

    $(".pagina2").on("click", function(){
        $(".detalle").children("div").css("display", "none");
        $(".detalle-acerca").css("display", "inline");
    });
    $(".pagina3").on("click", function(){
        $(".detalle").children("div").css("display", "none");
        $(".detalle-contacto").css("display", "inline");
    });
    $(".pagina4").on("click", function(){
        $(".detalle").children("div").css("display", "none");
        $(".detalle-politica").css("display", "inline");
    });
    $(".pagina5").on("click", function(){
        $(".detalle").children("div").css("display", "none");
        $(".detalle-galeria").css("display", "inline");
    });
     $(".pagina6").on("click", function(){
        $(".detalle").children("div").css("display", "none");
        $(".detalle-equipo").css("display", "inline");
    });
     $(".pagina7").on("click", function(){
        $(".detalle").children("div").css("display", "none");
        $(".detalle-localizacion").css("display", "inline");
    }); 
     $(".pagina8").on("click", function(){
        $(".detalle").children("div").css("display", "none");
        $(".detalle-enlaces").css("display", "inline");
    });
      $(".pagina9").on("click", function(){
        $(".detalle").children("div").css("display", "none");
        $(".detalle-especial").css("display", "inline");
    });

    $(".detalle-politica").hide();
    $(".detalle-acerca").hide();
    $(".detalle-especial").hide();
    $(".detalle-galeria").hide();
    $(".detalle-equipo").hide();
    $(".detalle-localizacion").hide();
    $(".detalle-enlaces").hide();
    $("#calle").hide();
    $(".interrogacion").hover(function(){
        $("#calle").show();
    
    }, function(){
       $("#calle").hide(); 
    });

    //Mostrar hexadecimal color seleccionado
    $("input[name=color]").change(function(){
        $('#colorseleccionado').val($(this).val());
        $("input[name='fondoPred']").val($(this).val());
        $(".fondop").children("img").addClass("fondoColor").removeClass("fondoImg");
        $(".fondop").children("img").css("background-color", $(this).val());
        $(".fondop").children("img").attr({"src": ""});
        $("#classPreview").val("fondoColor");
    });

    $("input[name=colorText]").change(function(){
        $('#colorTexto').val($(this).val());
        $("input[name='colorTxt']").val($(this).val());
    });
    $("input[name=colorFondoText]").change(function(){
        $('#colorFondo').val($(this).val());
        $("input[name='colorFondoTxt']").val($(this).val());
    });


    /*
    if($('#fondop').val() == ""){
        $("input[name=color]").change(function(){
            $('#colorSeleccionado').val($(this).val());
        });
    }
    else {
        $("input[name=color]").change(function(){
            $('#colorSeleccionado').val("");
        });
    }
    */

    $(".opcion1").on("click", function(){
        $(".opciones").children("div").css("display", "none");
        $(".opcion-fondo").css("display", "inherit");
    });

    $(".opcion2").on("click", function(){
        $(".opciones").children("div").css("display", "none");
        $(".opcion-color").css("display", "inherit");
    });

    $(".opcion3").on("click", function(){
        $(".opciones").children("div").css("display", "none");
        $(".opcion-personaliza").css("display", "inherit");
    });


    $(".detalle-opcion1").on("click", function(){
        $(".col-3").children("div").css("display", "none");
        $(".detalle-texto").css("display", "inherit");
    });
    $(".detalle-opcion2").on("click", function(){
        $(".col-3").children("div").css("display", "none");
        $(".detalle-fondo").css("display", "inherit");
    });

        /*Detalles de paginas para insertarlas en la Session*/
     $('.detalle-contacto form input[type="submit"]').click(function(event){
        event.preventDefault();
        var nombre = $("#nombreCont").val();
        var telefono = $("#telefonoCont").val();
        var fax = $("#faxCont").val();
        var correo = $("#correoCont").val();
        var direccion = $("#direccionCont").val();

        var datos = {"nombre": nombre, "tlf": telefono, "fax": fax,
         "correo": correo, "dir": direccion}
        $.ajax({
            url: "addDataToSeasson.php?pagina=contacto",
            type: "post",
            success: function(data){
                var datos = JSON.parse(data);
                alertas(datos.status, datos.mensaje);
            },
            error: function(data) {
                alert(data.mensaje + "No");
            },
            data: datos
        });
     });

     $('.detalle-home form input[type="submit"]').click(function(event){
        event.preventDefault();
        var datos = $("#home").serializeArray();
        var formData = new FormData($("#home")[0]);
        $.each(datos,function(key,input){
            formData.append(input.name,input.value);
        });
        $.ajax({
            url: "addDataToSeasson.php?pagina=home",
            type: "post", 
            contentType: false,
            processData: false,
            success: function(data){
                var datos = JSON.parse(data);
                alertas(datos.status, datos.mensaje);
                $(".pagina1").unbind("click");
            },
            error: function(data) {
                alert(data + "No");
            },
            data: formData
        });
     });

    $('.detalle-equipo form input[type="submit"]').click(function(event){
        event.preventDefault();
        var datos = $("#equipo").serializeArray();
        var formData = new FormData($("#equipo")[0]);
        $.each(datos,function(key,input){
            formData.append(input.name,input.value);
        });
        $.ajax({
            url: "addDataToSeasson.php?pagina=equipo",
            type: "post", 
            contentType: false,
            processData: false,
            success: function(data){
                var datos = JSON.parse(data);
                alertas(datos.status, datos.mensaje);
            },
            error: function(data) {
                alert(data + "No");
            },
            data: formData
        });
     });


     $('.detalle-acerca form input[type="submit"]').click(function(event){
        event.preventDefault();
        var descripcion = CKEDITOR.instances["editorAcerca"].getData();
        var datos = {"desc": descripcion}
        $.ajax({
            url: "addDataToSeasson.php?pagina=acerca",
            type: "post",
            success: function(data){
                var datos = JSON.parse(data);
                alertas(datos.status, datos.mensaje);
                $(".pagina2").unbind("click");
            },
            error: function(data) {
                alert(data + "No");
            },
            data: datos
        });
     });


     $('.detalle-politica form input[type="submit"]').click(function(event){
        event.preventDefault();
        var descripcion = CKEDITOR.instances["editorPolitica"].getData();
        var datos = {"desc": descripcion}
        $.ajax({
            url: "addDataToSeasson.php?pagina=politica",
            type: "post",
            success: function(data){
                var datos = JSON.parse(data);
                alertas(datos.status, datos.mensaje);
                $(".pagina4").unbind("click");
            },
            error: function(data) {
                alert(data + "No");
            },
            data: datos
        });
     });


     $('.detalle-localizacion form input[type="submit"]').click(function(event){
        event.preventDefault();
        var localiza = $("#localizacionEmpresa").val();
        var localizacion = {"loc": localiza};
        $.ajax({
            url: "addDataToSeasson.php?pagina=localizacion",
            type: "post",
            success: function(data){
                alert("asdasd");
                var datos = JSON.parse(data);
                $("#muestraCalle").children().remove();
                $("#muestraCalle").append("<span>" + datos.calle + "</span>");
                $("#muestraCalle").append("<input type='button' name='confirmaLoc' id='confirmaLoc' value='Confirmar'>");
                $("#muestraCalle").append("<input type='button' name='cancelaLoc' id='cancelaLoc' value='Cancelar'>");
                $("#muestraCalle").append("<input type='hidden' name='direccion' id='direccion' value='"+datos.calle+"'>");
                $("#muestraCalle").append("<input type='hidden' name='longitud' id='longitud' value='"+datos.lng+"'>");
                $("#muestraCalle").append("<input type='hidden' name='latitud' id='latitud' value='"+datos.lat+"'>");

                $("#confirmaLoc").on("click", function(){
                    var dir = $("#direccion").val();
                    var long = $("#longitud").val();
                    var lat = $("#latitud").val();
                    var calleNueva = {"calle": dir, "long": long, "lat": lat};
                    $.ajax({
                        url: "addDataToSeasson.php?pagina=confirmaLocalizacion",
                        type: "post",
                        success: function(data){
                            $("#muestraCalle").children().remove();
                            var datos = JSON.parse(data);
                            alertas(datos.status, datos.mensaje);
                        },
                        data: calleNueva
                    });
                });
                $("#cancelaLoc").on("click", function(){
                    $("#muestraCalle").children().remove();
                    $("#localizacionEmpresa").val("");
                    $("#muestraCalle").append("<span>No se ha guardado</span>");
                });
            },
            error: function(data) {
                alert(data + "No");
            },
            data: localizacion
        });
     });

    $('.detalle-enlaces form input[type="submit"]').click(function(event){
        event.preventDefault();
        var enlace = $("#enlace").val();
        var datos = {"enlace": enlace};
        $.ajax({
            url: "addDataToSeasson.php?pagina=enlace",
            type: "post",
            success: function(data){
                var datos = JSON.parse(data);
                alertas(datos.status, datos.mensaje);
            },
            error: function(data) {
                alert(data + "No");
            },
            data: datos
        });
    });
    
     $('.detalle-especial form input[type="submit"]').click(function(event){
        event.preventDefault();
        var descripcion = CKEDITOR.instances["editorEspecial"].getData();
        var nombre = $("#nombreEspecial").val();
        var datos = {"nombre": nombre, "desc": descripcion}
        $.ajax({
            url: "addDataToSeasson.php?pagina=especial",
            type: "post",
            success: function(data){
                var datos = JSON.parse(data);
                alertas(datos.status, datos.mensaje);
            },
            error: function(data) {
                alert(data + "No");
            },
            data: datos
        });
     });

     function alertas(status, mensaje){
        var zonaMensaje = $(".pagina_aniadida");
        zonaMensaje.children().remove();

        switch(status){
            case "ok":
                zonaMensaje.append("<span>" + mensaje + "</span>");
                zonaMensaje.addClass("correcto").removeClass("medias").removeClass("fallo");
            break;
            case "fallo":
                zonaMensaje.append("<span>" + mensaje + "</span>");
                zonaMensaje.addClass("fallo").removeClass("medias correcto");
            break;
            case "falta dato":
                zonaMensaje.append("<span>" + mensaje + "</span>");
                zonaMensaje.addClass("medias").removeClass("correcto fallo");
            break;
            case "fallo mover":
                zonaMensaje.append("<span>" + mensaje + "</span>");
                zonaMensaje.addClass("fallo").removeClass("medias correcto");
            break;
            case "correcto":
                $("#usuarioR").val("");
                $("#contraseniaR").val("");
                $("#correo").val("");
                $("#usuario").val("");
                $("#contrasenia").val("");
                $(".menu").find("li").remove();
                $(".menu").find("ul").append("<li><a href='sesion.php?dc=ok' id='desconectar'>Desconectar</a></li>");
                $(".datos-sesion").animate({marginTop: "5%"}, 3000, function(){
                     $(".datos-sesion").animate({marginTop: "-5%"}, 3000);
                });
                $(".datos-sesion").append("<span>"+mensaje+"</span>");
            break;
            case "fail sesion":

            break;

        }
     }

/*FIN DETALLES*/

    /* Ajax para iniciar sesion */
    $(".login form input[type='submit']").click(function(event){
        //alert("Pulsado login");
        event.preventDefault();
        var usuario = $("#usuario").val();
        var contrasenia = $("#contrasenia").val();
        alert(usuario);

        if(usuario != "" && contrasenia != ""){
            var datos = {"usuario": usuario, "contrasenia": contrasenia}
            $.ajax({
                url: "sesion.php?login=ok",
                type: "post",
                success: function(data){
                    window.history.back();
                    var datos = JSON.parse(data);
                    alertas(datos.status, datos.mensaje);
                },
                error: function(data){

                },
                data: datos
            });
        }else{
            alertas("fail sesion", "No puede haber campos vacios")
        }
    });

    $(".registrar form input[type='submit']").click(function(event){
        //alert("Pulsado registrar");
        event.preventDefault();
        var usuario = $("#usuarioR").val();
        var contrasenia = $("#contraseniaR").val();
        var contraseniaRepeat = $("#contraseniaRepeat").val();
        var correo = $("#correo").val();
        
        if(contrasenia === contraseniaRepeat){
            var datos = {"usuario": usuario, "contrasenia": contrasenia, "correo": correo}
            $.ajax({
                url: "sesion.php?registrar=ok",
                type: "post",
                success: function(data){
                    var datos = JSON.parse(data);
                    alertas(datos.status, datos.mensaje);
                    window.history.back();
                },
                error: function(data){

                },
                data: datos
            });
        }else{
            alertas("fail sesion", "No puede haber campos vacios")
        }        
    });

    $(".popup-cerrar").click(function(){
            window.history.back();
    });

    $('#archivo').on("change",function () {
        var file = this.files[0];
        $("input[name='fondoPred']").val("");
        $(".fondop").children("img").addClass("fondoImg").removeClass("fondoColor");
        $(".fondop").children("img").attr({"src": "img/imagenesUsuarios/" + file.name});
        $(".fondo").children("img").css("background-color", "");
        $("#classPreview").val("fondoImg");
    });

    /* PREVIEW */

    $(".homePreview").hide();
    $(".pagina1").on("click", function(){
        $(".acercaPreview").hide();
        $(".contactoPreview").hide();
        $(".especialPreview").hide();
        $(".galeriaPreview").hide();
        $(".politicaPreview").hide();

        $(".marco").attr("src", "preview/1-1.png");
        $(".preview").children(".menLat").remove();
        $(".preview").children(".menSup").remove();
        $(".preview").append("<div class='menSup'> </div>");
        $(".menSup").css("background-color", $("#colFondo").val());
        $(".homePreview").show();
        $(".tituloPreviewPag").css("color", $("#colTextFondo").val());
    });

    $("#nombreEmpresa").change(function(){
        $(".nombreEmpresaPreview").children().remove();
        $(".nombreEmpresaPreview").append("<span>"+$(this).val()+"</span>");
        $(".nombreEmpresaPreview").css("color", $("#colTextFondo").val()); 
    });

    $("#direccionEmpresa").change(function(){
        $(".dirEmpresaPreview").children().remove();
        $(".dirEmpresaPreview").append("<span>"+$(this).val()+"</span>");
        $(".dirEmpresaPreview").css("color", $("#colTextFondo").val()); 
    });

    $('#logoEmpresa').on("change",function(){
        var file = this.files[0];
        $(".fotoEmpresaPreview").attr({"src": "img/logos/" + file.name});
    });
    
    $(".acercaPreview").hide();
    $(".pagina2").on("click", function(){
        $(".homePreview").hide();
        $(".especialPreview").hide();
        $(".contactoPreview").hide();
        $(".galeriaPreview").hide();
        $(".politicaPreview").hide();

        $(".marco").attr("src", "preview/1-1.png");
        $(".preview").children(".menSup").remove();
        $(".preview").append("<div class='menSup'> </div>");
        $(".menSup").css("background-color", $("#colFondo").val());
        $(".acercaPreview").show();
        $(".tituloPreviewPag").css("color", $("#colTextFondo").val());
    });

    $(".politicaPreview").hide();
    $(".pagina4").on("click", function(){
        $(".homePreview").hide();
        $(".acercaPreview").hide();
        $(".especialPreview").hide();
        $(".contactoPreview").hide();
        $(".galeriaPreview").hide();

        $(".marco").attr("src", "preview/1-1.png");
        $(".preview").children(".menSup").remove();
        $(".preview").append("<div class='menSup'> </div>");
        $(".menSup").css("background-color", $("#colFondo").val());
        $(".politicaPreview").show();
        $(".tituloPreviewPag").css("color", $("#colTextFondo").val());
    });


    $(".especialPreview").hide();
    $(".pagina9").on("click", function(){
        $(".homePreview").hide();
        $(".acercaPreview").hide();
        $(".politicaPreview").hide();
        $(".contactoPreview").hide();
        $(".galeriaPreview").hide();

        $(".marco").attr("src", "preview/1-1.png");
        $(".preview").children(".menSup").remove();
        $(".preview").append("<div class='menSup'> </div>");
        $(".menSup").css("background-color", $("#colFondo").val());
        $(".especialPreview").show();
        $(".tituloPreviewPag").css("color", $("#colTextFondo").val());
    });

    $("#nombreEspecial").on("change", function(){
        $(".tituloPreviewPag").children().remove();
        $(".tituloPreviewPag").append("<span> " + $("#nombreEspecial").val() + "</span>");
    });


    $(".contactoPreview").hide();
    $(".pagina3").on("click", function(){
        $(".homePreview").hide();
        $(".acercaPreview").hide();
        $(".politicaPreview").hide();
        $(".especialPreview").hide();
        $(".galeriaPreview").hide();

        $(".marco").attr("src", "preview/1-1.png");
        $(".preview").children(".menSup").remove();
        $(".preview").append("<div class='menSup'> </div>");
        $(".menSup").css("background-color", $("#colFondo").val());
        $(".contactoPreview").show();
        $(".tituloPreviewPag").css("color", $("#colTextFondo").val());
    });

    $("#nombreCont").on("change", function(){
        $(".dato1").children().remove();
        $(".dato1").append("<span>" + $(this).val()+ "</span>");
    });
    $("#correoCont").on("change", function(){
        $(".dato2").children().remove();
        $(".dato2").append("<span>" + $(this).val()+ "</span>");
    });
    $("#telefonoCont").on("change", function(){
        $(".dato3").children().remove();
        $(".dato3").append("<span>" + $(this).val()+ "</span>");
    });
    $("#faxCont").on("change", function(){
        $(".dato4").children().remove();
        $(".dato4").append("<span>" + $(this).val()+ "</span>");
    });
    $("#direccionCont").on("change", function(){
        $(".dato5").children().remove();
        $(".dato5").append("<span>" + $(this).val()+ "</span>");
    });

    $(".galeriaPreview").hide();
    $(".pagina5").on("click", function(){
        $(".homePreview").hide();
        $(".acercaPreview").hide();
        $(".politicaPreview").hide();
        $(".especialPreview").hide();
        $(".contactoPreview").hide();

        $(".marco").attr("src", "preview/1-1.png");
        $(".preview").children(".menSup").remove();
        $(".preview").append("<div class='menSup'> </div>");
        $(".menSup").css("background-color", $("#colFondo").val());
        $(".galeriaPreview").show();
        $(".tituloPreviewPag").css("color", $("#colTextFondo").val());
    });

    $('#galery').change(function (){
        var file = this.files;
        var totalImg = file.length;
        var padre = $(".filas");
        var todasFilasCrear = Math.ceil(totalImg / 2);
        console.log(todasFilasCrear);

        //Filahijos son los divs con la clase Fila
        var filasHijos = padre.children("div.fila:last-child");
        //cantidad de divs con la clase fila
        var totalFilasHijos = filasHijos.length;

        for (var i = 0, img = 0; i < todasFilasCrear; i++, img += 2) {
            if(totalFilasHijos != 0){
                console.log("asdners");
                //divs con la clase imagenGaleriaPreviewdw
                var imgFila = filasHijos.children();
                console.log(imgFila);
                //cantidad de divs con la clase imagenGaleriaPreview
                var imgXFilaTotal = imgFila.length;
                console.log(imgXFilaTotal);

                if(imgXFilaTotal <= 1){
                    console.log("entra 1Foto linea");
                    filasHijos.append("<img class='imagenGaleriaPreview' src='img/galerias/"+file[img].name+"' alt=''></div>");
                    i--;
                }
                else{
                    console.log("entra con mayor 1 Foto");
                    console.log(totalImg -1);
                    if((totalImg-1) % 2 == 0){
                       if(i < todasFilasCrear -1){
                            padre.append("<div class='fila'><img class='imagenGaleriaPreview' src='img/galerias/"+file[img].name+"' alt=''><img class='imagenGaleriaPreview' src='img/galerias/"+file[img + 1].name+"' alt=''></div>");       
                        }
                        else if(i == todasFilasCrear -1){
                            padre.append("<div class='fila'><img class='imagenGaleriaPreview' src='img/galerias/"+file[img].name+"' alt=''></div>");       
                        }
                    }else if((totalImg-1) % 2 == 1){
                        if(i < todasFilasCrear -1){
                            padre.append("<div class='fila'><img class='imagenGaleriaPreview' src='img/galerias/"+file[img].name+"' alt=''><img class='imagenGaleriaPreview' src='img/galerias/"+file[img + 1].name+"' alt=''></div>");       
                        }
                        else if(i == todasFilasCrear -1){
                            padre.append("<div class='fila'><img class='imagenGaleriaPreview' src='img/galerias/"+file[img].name+"' alt=''></div>");       
                        }
                    }
                }
            }//Else entra la primera vez que se meten imagenes
            else{
                console.log("entra aki?¿?");
                if(totalImg % 2 == 0){
                    padre.append("<div class='fila'><img class='imagenGaleriaPreview' src='img/galerias/"+file[img].name+"' alt=''><img class='imagenGaleriaPreview' src='img/galerias/"+file[img + 1].name+"' alt=''></div>");
                
                }else if(totalImg % 2 == 1){
                    if(i < todasFilasCrear -1){
                        padre.append("<div class='fila'><img class='imagenGaleriaPreview' src='img/galerias/"+file[img].name+"' alt=''><img class='imagenGaleriaPreview' src='img/galerias/"+file[img + 1].name+"' alt=''></div>");       
                    }
                    else if(i == todasFilasCrear -1){
                        padre.append("<div class='fila'><img class='imagenGaleriaPreview' src='img/galerias/"+file[img].name+"' alt=''></div>");       
                    }
                }
            }
        } 
    });



    /*La instancia del ckeditor debe estar lo ultimo porque en la primera pagina falla y no carga lo de detras*/
    CKEDITOR.instances["editorAcerca"].on('change', function() {
        $(".textoAcercaPreview").children().remove();
        $(".textoAcercaPreview").append(this.getData());
    });
    CKEDITOR.instances["editorPolitica"].on('change', function() {
        $(".politicaTextPreview").children().remove();
        $(".politicaTextPreview").append(this.getData());
    });
    CKEDITOR.instances["editorEspecial"].on('change', function() {
        $(".especialTextPreview").children().remove();
        $(".especialTextPreview").append(this.getData());
    });
});
