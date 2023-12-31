//fix focus on select2
//$.fn.modal.Constructor.prototype.enforceFocus = function() {};
//


function disconnect(){
    Swal.fire({
title: 'Confirmation',
text: 'Êtes-vous sûr de vouloir vous déconnecter ?',
icon: 'question',
showCancelButton: true,
cancelButtonText: 'Non',
cancelButtonColor: '#dc3545',
confirmButtonColor: '#198754',
confirmButtonText: 'Oui'
}).then((result) => {
                    if (result.isConfirmed) {
                        window.location.replace('logout');
                    }
                });
}

function showTime(){
var date = new Date();
var d = date.getDate();
var M = date.getMonth()+1;
var y = date.getFullYear();
var h = date.getHours(); // 0 - 23
var m = date.getMinutes(); // 0 - 59
var s = date.getSeconds(); // 0 - 59



d = (d < 10) ? "0" + d : d;
M = (M < 10) ? "0" + M : M;
h = (h < 10) ? "0" + h : h;
m = (m < 10) ? "0" + m : m;
s = (s < 10) ? "0" + s : s;

var time = d+"/"+ M + "/"+ y+ "  " + h + ":" + m + ":" + s ;
document.getElementById("ClockDisplay").innerText = time;
document.getElementById("ClockDisplay").textContent = time;

setTimeout(showTime, 1000);

}

function IsJsonString(str) {
    try {
        JSON.parse(str);
    } catch (e) {
        return false;
    }
    return true;
}

function ShowPic(src){
    $("#show-img").attr('src',src);
    $("#popup").modal('show');
}

function returnItem(data){
    var item = '<div class="row border w-100 m-0"  >';
    item += '    <input id="search_pro_id_' + data.id + '" type="hidden" value=\''+JSON.stringify(data)+'\' />';
    item += '    <div class="col-lg-1 p-0">';
    item += '      <img src="assets/img/products/products_s/' + data.image_produit +
        '" onclick="ShowPic(\'assets/img/products/products_b/'+data.image_produit+'\')" class="img-thumbnail img-xs showpicbig">';
    item += '     </div><div class="col-lg-8">';
    item += '                <p style=" word-wrap: break-word;white-space:pre-wrap;" class="my-3" >' + data.text +'</p>';
    item += '    </div>';
    item += '    <div class="col-lg-2 p-0  justify-content-center align-self-center">';
    item += '           ' + data.prix_produit + ' MAD';
    item += '    </div>'
    item += '    <div class="col-lg-1 p-0  justify-content-center align-self-center">';
    item += '            <button onclick ="add_fromSearch('+data.id+')" class="btn btn-success"><i class="fa fa-plus"></i></button>';
    item += '    </div>';
    item += '</div>';
    return item;
}

function add_fromSearch(data){
    data = $("#search_pro_id_"+data).val();
    $('#products_list').val('');
    hideList();
    $('.pro-found').hide();
    addProduct(JSON.parse(data));

}

function showList(data){
    var list = $('#inputholder');
    if(typeof(data)=="undefined"){

            return;
    }
    $('#list_autocomplete').html('');
    for(var i=0;i<data.length;i++){
        $('#list_autocomplete').html($('#list_autocomplete').html()+returnItem(data[i]));
    }
    $('#list_autocomplete').css({
        "display" : "block",
        "padding-right" : "0px !important",
        "padding-top" : "0px !important",
        'overflow-y': 'scroll',
        'overflow-x': 'hidden',
        'max-height' : '600px' ,
        "width" : $(list).width(),
        "min-width" : $(list).width(),
        "top" : $(list).offset().top+$(list).height()+10,
        "left" : $(list).offset().left
    });
}

function hideList(){
    $('#list_autocomplete').css({
        "display" : "none"
    }); 
}

//DATE FORMAT
$.fn.dataTable.moment( 'DD/MM/YYYY' );

var products_pipline =  $.fn.dataTable.pipeline = function (opts) {
    // Configuration options
    var conf = $.extend({
        pages: 5, // number of pages to cache
        url: '', // script url
        data: null, // function or object with parameters to send to the server
        // matching how `ajax.data` works in DataTables
        method: 'GET' // Ajax HTTP method
    }, opts);

    // Private variables for storing the cache
    var cacheLower = -1;
    var cacheUpper = null;
    var cacheLastRequest = null;
    var cacheLastJson = null;

    return function (request, drawCallback, settings) {
        var ajax = false;
        var requestStart = request.start;
        var drawStart = request.start;
        var requestLength = request.length;
        var requestEnd = requestStart + requestLength;

        if (settings.clearCache) {
            // API requested that the cache be cleared
            ajax = true;
            settings.clearCache = false;
        } else if (cacheLower < 0 || requestStart < cacheLower || requestEnd > cacheUpper) {
            // outside cached data - need to make a request
            ajax = true;
        } else if (JSON.stringify(request.order) !== JSON.stringify(cacheLastRequest.order) ||
            JSON.stringify(request.columns) !== JSON.stringify(cacheLastRequest.columns) ||
            JSON.stringify(request.search) !== JSON.stringify(cacheLastRequest.search)
        ) {
            // properties changed (ordering, columns, searching)
            ajax = true;
        }

        // Store the request for checking next time around
        cacheLastRequest = $.extend(true, {}, request);

        if (ajax) {
            // Need data from the server
            if (requestStart < cacheLower) {
                requestStart = requestStart - (requestLength * (conf.pages - 1));

                if (requestStart < 0) {
                    requestStart = 0;
                }
            }

            cacheLower = requestStart;
            cacheUpper = requestStart + (requestLength * conf.pages);

            request.start = requestStart;
            request.length = requestLength * conf.pages;

            // Provide the same `data` options as DataTables.
            if (typeof conf.data === 'function') {
                // As a function it is executed with the data object as an arg
                // for manipulation. If an object is returned, it is used as the
                // data object to submit
                var d = conf.data(request);
                if (d) {
                    $.extend(request, d);
                }
            } else if ($.isPlainObject(conf.data)) {
                // As an object, the data given extends the default
                $.extend(request, conf.data);
            }

            return $.ajax({
                "type": conf.method,
                "url": conf.url,
                "data": request,
                "dataType": "json",
                "cache": false,
                "success": function (json) {
                    cacheLastJson = $.extend(true, {}, json);

                    if (cacheLower != drawStart) {
                        json.data.splice(0, drawStart - cacheLower);
                    }
                    if (requestLength >= -1) {
                        json.data.splice(requestLength, json.data.length);
                    }

                    drawCallback(json);
                }
            });
        } else {
            json = $.extend(true, {}, cacheLastJson);
            json.draw = request.draw; // Update the echo for each response
            json.data.splice(0, requestStart - cacheLower);
            json.data.splice(requestLength, json.data.length);

            drawCallback(json);
        }
    }
};

var stock_pipline =  $.fn.dataTable.pipeline = function (opts) {
    // Configuration options
    var conf = $.extend({
        pages: 5, // number of pages to cache
        url: '', // script url
        data: null, // function or object with parameters to send to the server
        // matching how `ajax.data` works in DataTables
        method: 'GET' // Ajax HTTP method
    }, opts);

    // Private variables for storing the cache
    var cacheLower = -1;
    var cacheUpper = null;
    var cacheLastRequest = null;
    var cacheLastJson = null;

    return function (request, drawCallback, settings) {
        var ajax = false;
        var requestStart = request.start;
        var drawStart = request.start;
        var requestLength = request.length;
        var requestEnd = requestStart + requestLength;

        if (settings.clearCache) {
            // API requested that the cache be cleared
            ajax = true;
            settings.clearCache = false;
        } else if (cacheLower < 0 || requestStart < cacheLower || requestEnd > cacheUpper) {
            // outside cached data - need to make a request
            ajax = true;
        } else if (JSON.stringify(request.order) !== JSON.stringify(cacheLastRequest.order) ||
            JSON.stringify(request.columns) !== JSON.stringify(cacheLastRequest.columns) ||
            JSON.stringify(request.search) !== JSON.stringify(cacheLastRequest.search)
        ) {
            // properties changed (ordering, columns, searching)
            ajax = true;
        }

        // Store the request for checking next time around
        cacheLastRequest = $.extend(true, {}, request);

        if (ajax) {
            // Need data from the server
            if (requestStart < cacheLower) {
                requestStart = requestStart - (requestLength * (conf.pages - 1));

                if (requestStart < 0) {
                    requestStart = 0;
                }
            }

            cacheLower = requestStart;
            cacheUpper = requestStart + (requestLength * conf.pages);

            request.start = requestStart;
            request.length = requestLength * conf.pages;

            // Provide the same `data` options as DataTables.
            if (typeof conf.data === 'function') {
                // As a function it is executed with the data object as an arg
                // for manipulation. If an object is returned, it is used as the
                // data object to submit
                var d = conf.data(request);
                if (d) {
                    $.extend(request, d);
                }
            } else if ($.isPlainObject(conf.data)) {
                // As an object, the data given extends the default
                $.extend(request, conf.data);
            }
            
            return $.ajax({
                "type": conf.method,
                "url": conf.url,
                "data": request,
                "dataType": "json",
                "cache": false,
                "success": function (json) {
                    cacheLastJson = $.extend(true, {}, json);

                    if (cacheLower != drawStart) {
                        json.data.splice(0, drawStart - cacheLower);
                    }
                    if (requestLength >= -1) {
                        json.data.splice(requestLength, json.data.length);
                    }

                    drawCallback(json);
                }
            });
        } else {
            json = $.extend(true, {}, cacheLastJson);
            json.draw = request.draw; // Update the echo for each response
            json.data.splice(0, requestStart - cacheLower);
            json.data.splice(requestLength, json.data.length);

            drawCallback(json);
        }
    }
};


    //
    // Pipelining function for DataTables. To be used to the `ajax` option of DataTables
    //

    // Register an API method that will empty the pipelined data, forcing an Ajax
    // fetch on the next draw (i.e. `table.clearPipeline().draw()`)
$.fn.dataTable.Api.register('clearPipeline()', function () {
    return this.iterator('table', function (settings) {
        settings.clearCache = true;
    });
});

function RefreshDataTable(name){
    $(name).DataTable().clearPipeline();
    $(name).DataTable().ajax.reload(null, false);
}

function readURL(input,img) {
    if (input.files && input.files[0]) {
        var reader = new FileReader();

        reader.onload = function (e) {
            $('#'+img)
                .attr('src', e.target.result)
        };

        reader.readAsDataURL(input.files[0]);
    }
}

jQuery.download = function(url, data, method) {
    //url and data options required
    if (url && data) {
        //data can be string of parameters or array/object
        data = typeof data == 'string' ? data : jQuery.param(data);
        //split params into form inputs
        var inputs = '';
        jQuery.each(data.split('&'), function() {
            var pair = this.split('=');
            inputs += '<input type="hidden" name="' + pair[0] +
                '" value="' + pair[1] + '" />';
        });
        //send request
        jQuery('<form target="_blank"  action="' + url +
                '" method="' + (method || 'post') + '">' + inputs + '</form>')
            .appendTo('body').submit().remove();
    };
};

var FRENCH_DATATABLE_LOCAL ={ 
	"emptyTable":     "aucune donnée disponible",
	"info":           "Affichage de _START_ à _END_ sur _TOTAL_ entrées",
	"infoEmpty":      "Affiche 0 à 0 de 0 entrées",
	"infoFiltered":   "(filtré de _MAX_ entrées totales)",
	"infoPostFix":    "",
	"thousands":      ",",
	"lengthMenu":     "Affichage de  _MENU_ entrées",
	"loadingRecords": "Chargement...",
	"processing":     "En traitement...",
	"search":         "Chercher:",
	"zeroRecords":    "Aucun enregistrements correspondants trouvés",
	"paginate": {
		"first":      "Premier",
		"last":       "Dernier",
		"next":       "Suivant",
		"previous":   "Précédent"
	}
};

//CAISSE FUNCS

function getProduct(filter) {
    $(".pro-found").hide();
    if (filter == "")
        return;
        $(".pro-found").html('<div class="spinner-border text-info" role="status"><span class="sr-only">Chargement...</span></div>');
        $(".pro-found").show();
    $.post("products", {
        "cli" : G_pricetype,
        "filter": filter
    }, function (data) {
        if (IsJsonString(data)) {
            $(".pro-found").hide();
            var parsed_data = JSON.parse(data);

            if (Array.isArray(parsed_data)) {

                if (parsed_data.length == 1) {
                    addProduct(parsed_data[0]);
                    $('#products_list').val("");
                } else
                    showList(parsed_data);

            } else {
                
                $(".pro-found").html(data + " produits trouvés");
                $(".pro-found").show();
            }


        } else {}
    });
}



function setRemise() {
    var remise = $("#remise_txt").val();

    if (isNaN(parseFloat(remise))) {
        $('#remise').popover("hide");
        return;
    }
    remise = Number(parseFloat(remise).toFixed(2));


    $('#remise').popover("hide");
    if (100 >= remise) {
        PERC_remise = remise;
        G_remise = Number(((G_soustotal / 100) * remise).toFixed(2));
        $("#remise").html(remise + " %");
        G_total = G_soustotal - G_remise;
        G_total =  Number(G_total.toFixed(2));
        $("#total_txt").html(G_total + " MAD");
    }
}

function quantityPopver(id) {

$('#qnt_txt_' + id).popover({
    html: true,
    sanitize: false,
    content: '<div class="input-group mb-3"><input type="text" id="qnt_pop_txt_' + id +
        '" class="form-control" placeholder="0" value="' +
        $("#qnt_" + id).val() +
        '" ><div+id class="input-group-prepend"><button class="btn btn-success" type="button" onclick="setQuantitePOP(' +
        id +
        ')"><i class="fa fa-check"></i></button></div></div><div class="btn-group-vertical ml-4 w-100"a role=group><div class=btn-group><button class="btn btn-outline-secondary py-3"onclick="document.getElementById(\'qnt_pop_txt_' +
        id + '\').value=document.getElementById(\'qnt_pop_txt_' + id +
        '\').value + \'1\';"type=button>1</button> <button class="btn btn-outline-secondary py-3"onclick="document.getElementById(\'qnt_pop_txt_' +
        id + '\').value=document.getElementById(\'qnt_pop_txt_' + id +
        '\').value + \'2\';"type=button>2</button> <button class="btn btn-outline-secondary py-3"onclick="document.getElementById(\'qnt_pop_txt_' +
        id + '\').value=document.getElementById(\'qnt_pop_txt_' + id +
        '\').value + \'3\';"type=button>3</button></div><div class=btn-group><button class="btn btn-outline-secondary py-3"onclick="document.getElementById(\'qnt_pop_txt_' +
        id + '\').value=document.getElementById(\'qnt_pop_txt_' + id +
        '\').value + \'4\';"type=button>4</button> <button class="btn btn-outline-secondary py-3"onclick="document.getElementById(\'qnt_pop_txt_' +
        id + '\').value=document.getElementById(\'qnt_pop_txt_' + id +
        '\').value + \'5\';"type=button>5</button> <button class="btn btn-outline-secondary py-3"onclick="document.getElementById(\'qnt_pop_txt_' +
        id + '\').value=document.getElementById(\'qnt_pop_txt_' + id +
        '\').value + \'6\';"type=button>6</button></div><div class=btn-group><button class="btn btn-outline-secondary py-3"onclick="document.getElementById(\'qnt_pop_txt_' +
        id + '\').value=document.getElementById(\'qnt_pop_txt_' + id +
        '\').value + \'7\';"type=button>7</button> <button class="btn btn-outline-secondary py-3"onclick="document.getElementById(\'qnt_pop_txt_' +
        id + '\').value=document.getElementById(\'qnt_pop_txt_' + id +
        '\').value + \'8\';"type=button>8</button> <button class="btn btn-outline-secondary py-3"onclick="document.getElementById(\'qnt_pop_txt_' +
        id + '\').value=document.getElementById(\'qnt_pop_txt_' + id +
        '\').value + \'9\';"type=button>9</button></div><div class=btn-group><button class="btn btn-outline-secondary py-3"onclick="document.getElementById(\'qnt_pop_txt_' +
        id + '\').value=document.getElementById(\'qnt_pop_txt_' + id +
        '\').value.slice(0, -1);"type=button><i class="fa fa-caret-square-left"></i></button> <button class="btn btn-outline-secondary py-3"onclick="document.getElementById(\'qnt_pop_txt_' +
        id + '\').value=document.getElementById(\'qnt_pop_txt_' + id +
        '\').value + \'0\';"type=button>0</button> <button class="btn btn-outline-secondary py-3"onclick="document.getElementById(\'qnt_pop_txt_' +
        id + '\').value=document.getElementById(\'qnt_pop_txt_' + id +
        '\').value=\'\';"type=button><i class="fa fa-times-circle"></i></button></div></div>',

});
$('#qnt_txt_' + id).popover('show');
}

function setMoney() {
var money = $("#money_txt").val();
console.log(money);
if (isNaN(parseFloat(money))) {
    $('#money').popover("hide");
    return;
}
money = parseFloat(money);
G_money = Number(money.toFixed(2));

$("#money").html(money + " MAD");
$('#money').popover("hide");
G_rendu = Number((G_money - G_total).toFixed(2));
$("#rendu_txt").html(G_rendu + " MAD");
}

function setTotal() {
    $("#total_txt").html(G_total + " MAD");
    $("#soustotal_txt").html(G_soustotal + " MAD");
}

function removeProduct(id) {
    var qnt = $("#qnt_" + id).val();
    var price = $("#price_" + id).val();
    $("#pro_id_" + id).remove();
    audio_delete.play();

    var index = G_products.findIndex(x => x.id == id)
    if (index > -1) {
        G_products.splice(index, 1);
        updateEverytyhing();
    }

    updateEverytyhing();
}

function recalculate_remise_prod (id){
    var remise = parseFloat($("#remise_txt_chng_"+id).val());
    if(isNaN(remise))
        return;
    remise=Number(remise.toFixed(2));
    var index = G_products.findIndex(x => x.id == id);
    var prix=0;
    if (index !== -1) {
        G_products[index].remise_prix =remise;
        prix =   G_products[index].pph;
        prix = prix-((prix/100)*remise);
        G_products[index].price = prix;
    }
    updateEverytyhing();
    $("#prix_txt_chng_"+id).val(prix);
}
function recalculate_prod_remise (id){
    var prix = $("#prix_txt_chng_"+id).val();
    if(isNaN(prix))
        return;
    var index = G_products.findIndex(x => x.id == id);
    var remise=0;
    if (index !== -1) {
        G_products[index].price = prix;
       var  pph =   G_products[index].pph;
        remise =100/((pph/(pph-prix)));
        remise=Number(remise.toFixed(2));
        G_products[index].remise_prix =remise;
    }
    updateEverytyhing();
    $("#remise_txt_chng_"+id).val(remise);
}
function addProduct(data) {
hideList();
//
//GET PREMUPTIONS
//

var index = G_products.findIndex(x => x.id == data.id)
if (index === -1) {
    
            //SET STUFF

            G_products.push({
                id: data.id,
                quantite: 1,
                remise_prix: data.remise_prix,
                id_produit_super: data.id_produit_super,
                pph: data.pph,
                price: data.prix_produit,
                prix_achat: data.prix_achat,
                name: data.text.substring(data.text.indexOf('|') + 1).trim(),
                id_move : 0
            });
            updateEverytyhing();

            var item = '<tr class="item-product" id="pro_id_' + data.id + '" >';
item += '<input id="qnt_' + data.id + '" type="hidden" value="1" />';
item += '<input id="price_' + data.id + '" type="hidden"  value="' + data.prix_produit + '" />';
item += '    <td class="titletd">';
item += '        <figure class="media">';
item += '            <div class="img-wrap"><img src="assets/img/products/products_s/' + data.image_produit +
    '" onclick="ShowPic(\'assets/img/products/products_b/' + data.image_produit +
    '\')" class="img-thumbnail img-xs showpicbig"></div>';
item += '            <figcaption class="m-auto media-body">';
item += '                <p style="margin: auto word-wrap: break-word;white-space:pre-wrap;">' + data.text +
    '</p>';
item += '            </figcaption>';
item += '        </figure>';
item += '    </td>';
item += '    <td class="text-center">';
item += '        <div class="m-btn-group m-btn-group--pill btn-group mr-2" role="group" aria-label="">';
item += '            <button type="button" onclick="Dec(' + data.id +
    ')" class="m-btn btn btn-outline-primary"><i class="fa fa-minus"></i></button>';
item += '            <button type="button"  id="qnt_txt_' + data.id +
    '" class="m-btn btn btn-primary" onclick="quantityPopver(' + data.id + ')" >1</button>';
item += '            <button type="button" onclick="Inc(' + data.id +
    ')" class="m-btn btn btn-outline-primary"><i class="fa fa-plus"></i></button>';
item += '        </div>';
item += '    </td>';
item += '    <td>';
item += '        <div class="price-wrap">';
var rd="readonly";
if(G_pricetype=="para"|| G_pricetype=="pharma"){
   rd="";
 }
item += '            <var ><input onchange="recalculate_prod_remise('+data.id+')" '+rd+' type="number" class="form-control product_remise_caisse" style="width:100px;font-size:12px;display: inline;" id="prix_txt_chng_' + data.id + '"  value="' + data.prix_produit + '" > MAD</var>';
//item += '            <var id="price_txt' + data.id + '">' + data.prix_produit + ' MAD</var>';
if(G_pricetype=="para"|| G_pricetype=="pharma"){
   item += '           </br> <var >Remise : <input onchange="recalculate_remise_prod('+data.id+')" type="number" class="form-control remise_product_caisse" style="width:70px;font-size:12px;display: inline;" id="remise_txt_chng_' + data.id + '"  value="' + data.remise_prix + '" > %</var>';
}
item += '        </div>';
item += '    </td>';
item += '    <td class="text-center">';


item += '<div id="date_per_div_'+data.id+'" ><div class="spinner-border text-info" role="status"><span class="sr-only">Chargement...</span></div></div>';

/*
if(data.dates.length>0){
    item += '     <select class="form-control btn btn-dark date_select" onchange="onDateSelect('+data.id+')" id="date_select_'+data.id+'" >';
    for(var i=0;i<data.dates.length;i++){
    console.log("WE ARE HERE : "+data.dates[i].id_mouvement);
        item += '<option value="'+data.dates[i].id_mouvement+'" >'+data.dates[i].date_p+'</option>';
    }
    item += '    <select>';
}else{
    item += '<div class="alert alert-danger" role="alert">Repture de stock !!!</div>';
}*/

item += '    </td>';

item += '    <td class="text-right">';
item += '        <a href="#" class="btn btn-outline-danger" onclick="removeProduct(' + data.id +
    ')"> <i class="fa fa-trash"></i></a>';
item += '    </td>';
item += '</tr>';
audio_ping.play();
$("#items_holder").append(item);
getPerDates(data.id);
} else {
    Inc(data.id);
    audio_ping.play();
    updateEverytyhing();
    return;
}

}
function getPerDates(id){
    $.post("products", {
        "perumptions": id,
        cli : G_pricetype
    }, function (sub_data) {
            var dates = JSON.parse(sub_data);
            var item="";
            if(dates.length>0){

                var index = G_products.findIndex(x => x.id == id);
                G_products[index].id_move = dates[0].id_mouvement;
                item += '     <select class="form-control btn btn-dark date_select" onchange="onDateSelect('+id+')" id="date_select_'+id+'" >';
                var sl="selected";
                for(var i=0;i<dates.length;i++){
                    item += '<option '+sl+' value="'+dates[i].id_mouvement+'|'+dates[i].prix_achat+'" >'+dates[i].date_p+'</option>';
                    sl="";
                }
                item += '    <select>';
                
            }else{
                item += '<div class="alert alert-danger" role="alert">Repture de stock !!!</div>';
            }   
            $("#date_per_div_"+id).html(item);
            onDateSelect(id);
        });
}

function updateEverytyhing() {
G_soustotal = 0;
G_products.forEach(element => G_soustotal += (element.price * element.quantite));
G_soustotal = Number(G_soustotal.toFixed(2));
G_total = G_soustotal;
setTotal();
if (G_soustotal > G_remise) {
    G_total = Number((G_soustotal - G_remise).toFixed(2));
    $("#total_txt").html(G_total + " MAD");
}
if (G_money > 0) {
    G_rendu = Number((G_money - G_total).toFixed(2));
    $("#rendu_txt").html(G_rendu + " MAD");
}


}

function endTransactionBL(){


var type_facture = $("#type_facture").val();
var type_paiment = $("#type_paiment").val();
var reception = $("#reception").val();
var montant_paye = $("#montant_paye").val();
var ramassage = $("#ramassage").val();
var client_txt = $("#client_txt").val();


if (typeof type_facture === 'undefined' || type_facture === '') {
    console.log(type_facture);
    return;
} else if (typeof type_paiment === 'undefined' || type_paiment === '') {

    return;
}else if (typeof reception === 'undefined' || reception === '') {

    return;
} else if (typeof ramassage === 'undefined' || ramassage === '') {

    return;
}else if (typeof montant_paye === 'undefined' || montant_paye === '') {
    return;
} else if (typeof client_txt === 'undefined' || client_txt === '') {
    console.log(client_txt);
    return;
}

$.post("transaction", {
    type_facture: type_facture,
    type_paiment: type_paiment,
    reception: reception,
    montant_paye: montant_paye,
    ramassage: ramassage,
    client_txt: client_txt,
    remise: PERC_remise,
    client : G_pricetype,
    payement : T_PAYEMENT,
    products: JSON.stringify(G_products)
}, function (data) {

  window.location="print/"+data.trim();
});
}

function endTransaction() {
//print ticket
//end printing ticket
if(is_DEVIS){
    $("#devis_cmpl").modal();
    return;
}
if(G_pricetype=="para" ||G_pricetype=="pharma" ){
    $("#bl_cmpl").modal();
    return;
}
audio_register.play();
$.post("transaction", {
    do_print: 1,
    remise: PERC_remise,
    client : G_pricetype,
    payement : T_PAYEMENT,
    products: JSON.stringify(G_products)
}, function (data) {

  window.location="print/"+data.trim();
});

}

function openDrawer() {

var originalContents = document.body.innerHTML;
document.body.innerHTML = "Ouverture de la caisse...";
window.print();
window.location.reload(true);
}

function cancelTransaction() {
audio_cancel.play();
//print ticket
//end printing ticket
G_total = 0;
G_remise = 0;
G_soustotal = 0;
G_money = 0;
G_rendu = 0;
G_products.splice(0, G_products.length);
$("#items_holder").html('');
updateEverytyhing();
}

function Inc(id) {
var index = G_products.findIndex(x => x.id == id)
if (index === -1) {
    console.log("object doesnt exists");
} else {
    G_products[index].quantite++;
    setQuantite(id, G_products[index].quantite);
    $("#price_txt" + G_products[index].id).html((G_products[index].quantite * G_products[index].price) +
        " MAD");
    audio_ping.play();
}

}

function Dec(id) {
var index = G_products.findIndex(x => x.id == id)
if (index === -1) {
    console.log("object doesnt exists");
} else {
    G_products[index].quantite--;
    if (G_products[index].quantite < 1)
        G_products[index].quantite = 1;
    setQuantite(id, G_products[index].quantite);
    console.log("#price_txt" + G_products[index].id);
    $("#price_txt" + G_products[index].id).html((G_products[index].quantite * G_products[index].price) +
        " MAD");
    audio_delete.play();
}

}

function setQuantite(id, quantite) {
$("#qnt_" + id).val(quantite);
$("#qnt_txt_" + id).html(quantite);
updateEverytyhing();
}

function setQuantitePOP(id) {
var quantite = $("#qnt_pop_txt_" + id).val();
$('#qnt_txt_' + id).popover('hide');
console.log(id);
var index = G_products.findIndex(x => x.id == id);
if (index === -1) {
    console.log("object doesnt exists");
} else {
    G_products[index].quantite = quantite;
    setQuantite(id, G_products[index].quantite);
    $("#price_txt" + G_products[index].id).html((G_products[index].quantite * G_products[index].price) +
        " MAD");
    audio_ping.play();
}
}
//END CAISSE FUNCS

function materialColor() {
    var colors = [
  
  "#ffebee",
  "#ffcdd2",
  "#ef9a9a",
  "#e57373",
  "#ef5350",
  "#f44336",
  "#e53935",
  "#d32f2f",
  "#c62828",
  "#b71c1c",
  "#f44336",
  "#ff8a80",
  "#ff5252",
  "#ff1744",
  "#d50000"
  ,
  
  "#fce4ec",
  "#f8bbd0",
  "#f48fb1",
  "#f06292",
  "#ec407a",
  "#e91e63",
  "#d81b60",
  "#c2185b",
  "#ad1457",
  "#880e4f",
  "#e91e63",
  "#ff80ab",
  "#ff4081",
  "#f50057",
  "#c51162"
  ,
  
  "#f3e5f5",
  "#e1bee7",
  "#ce93d8",
  "#ba68c8",
  "#ab47bc",
  "#9c27b0",
  "#8e24aa",
  "#7b1fa2",
  "#6a1b9a",
  "#4a148c",
  "#9c27b0",
  "#ea80fc",
  "#e040fb",
  "#d500f9",
  "#aa00ff"
  ,
  
  "#ede7f6",
  "#d1c4e9",
  "#b39ddb",
  "#9575cd",
  "#7e57c2",
  "#673ab7",
  "#5e35b1",
  "#512da8",
  "#4527a0",
  "#311b92",
  "#673ab7",
  "#b388ff",
  "#7c4dff",
  "#651fff",
  "#6200ea"
  ,
  
  "#e8eaf6",
  "#c5cae9",
  "#9fa8da",
  "#7986cb",
  "#5c6bc0",
  "#3f51b5",
  "#3949ab",
  "#303f9f",
  "#283593",
  "#1a237e",
  "#3f51b5",
  "#8c9eff",
  "#536dfe",
  "#3d5afe",
  "#304ffe"
  ,
  
  "#e3f2fd",
  "#bbdefb",
  "#90caf9",
  "#64b5f6",
  "#42a5f5",
  "#2196f3",
  "#1e88e5",
  "#1976d2",
  "#1565c0",
  "#0d47a1",
  "#2196f3",
  "#82b1ff",
  "#448aff",
  "#2979ff",
  "#2962ff"
  ,
  
  "#e1f5fe",
  "#b3e5fc",
  "#81d4fa",
  "#4fc3f7",
  "#29b6f6",
  "#03a9f4",
  "#039be5",
  "#0288d1",
  "#0277bd",
  "#01579b",
  "#03a9f4",
  "#80d8ff",
  "#40c4ff",
  "#00b0ff",
  "#0091ea"
  ,
  
  "#e0f7fa",
  "#b2ebf2",
  "#80deea",
  "#4dd0e1",
  "#26c6da",
  "#00bcd4",
  "#00acc1",
  "#0097a7",
  "#00838f",
  "#006064",
  "#00bcd4",
  "#84ffff",
  "#18ffff",
  "#00e5ff",
  "#00b8d4"
  ,
  
  "#e0f2f1",
  "#b2dfdb",
  "#80cbc4",
  "#4db6ac",
  "#26a69a",
  "#009688",
  "#00897b",
  "#00796b",
  "#00695c",
  "#004d40",
  "#009688",
  "#a7ffeb",
  "#64ffda",
  "#1de9b6",
  "#00bfa5"
  ,
  
  "#e8f5e9",
  "#c8e6c9",
  "#a5d6a7",
  "#81c784",
  "#66bb6a",
  "#4caf50",
  "#43a047",
  "#388e3c",
  "#2e7d32",
  "#1b5e20",
  "#4caf50",
  "#b9f6ca",
  "#69f0ae",
  "#00e676",
  "#00c853"
  ,
  
  "#f1f8e9",
  "#dcedc8",
  "#c5e1a5",
  "#aed581",
  "#9ccc65",
  "#8bc34a",
  "#7cb342",
  "#689f38",
  "#558b2f",
  "#33691e",
  "#8bc34a",
  "#ccff90",
  "#b2ff59",
  "#76ff03",
  "#64dd17"
  ,
  
  "#f9fbe7",
  "#f0f4c3",
  "#e6ee9c",
  "#dce775",
  "#d4e157",
  "#cddc39",
  "#c0ca33",
  "#afb42b",
  "#9e9d24",
  "#827717",
  "#cddc39",
  "#f4ff81",
  "#eeff41",
  "#c6ff00",
  "#aeea00"
  ,
  
  "#fffde7",
  "#fff9c4",
  "#fff59d",
  "#fff176",
  "#ffee58",
  "#ffeb3b",
  "#fdd835",
  "#fbc02d",
  "#f9a825",
  "#f57f17",
  "#ffeb3b",
  "#ffff8d",
  "#ffff00",
  "#ffea00",
  "#ffd600"
  ,
  
  "#fff8e1",
  "#ffecb3",
  "#ffe082",
  "#ffd54f",
  "#ffca28",
  "#ffc107",
  "#ffb300",
  "#ffa000",
  "#ff8f00",
  "#ff6f00",
  "#ffc107",
  "#ffe57f",
  "#ffd740",
  "#ffc400",
  "#ffab00"
  ,
  
  "#fff3e0",
  "#ffe0b2",
  "#ffcc80",
  "#ffb74d",
  "#ffa726",
  "#ff9800",
  "#fb8c00",
  "#f57c00",
  "#ef6c00",
  "#e65100",
  "#ff9800",
  "#ffd180",
  "#ffab40",
  "#ff9100",
  "#ff6d00"
  ,
  
  "#fbe9e7",
  "#ffccbc",
  "#ffab91",
  "#ff8a65",
  "#ff7043",
  "#ff5722",
  "#f4511e",
  "#e64a19",
  "#d84315",
  "#bf360c",
  "#ff5722",
  "#ff9e80",
  "#ff6e40",
  "#ff3d00",
  "#dd2c00"
  ,
  
  "#efebe9",
  "#d7ccc8",
  "#bcaaa4",
  "#a1887f",
  "#8d6e63",
  "#795548",
  "#6d4c41",
  "#5d4037",
  "#4e342e",
  "#3e2723",
  "#795548"
  ,
  
  "#fafafa",
  "#f5f5f5",
  "#eeeeee",
  "#e0e0e0",
  "#bdbdbd",
  "#9e9e9e",
  "#757575",
  "#616161",
  "#424242",
  "#212121",
  "#9e9e9e"
  ,
  
  "#eceff1",
  "#cfd8dc",
  "#b0bec5",
  "#90a4ae",
  "#78909c",
  "#607d8b",
  "#546e7a",
  "#455a64",
  "#37474f",
  "#263238",
  "#607d8b"
  ,
  
  "#000000"
  ,
  
  "#ffffff"
  ];
  
    var color = colors[Math.floor(Math.random() * colors.length)];
    return color;
  }