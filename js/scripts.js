var order = new Array();
var custname="";

function showOrder(){
    $("#cart").empty();
    $.each(order,function(index,product){
        var html=""
                +'<div class="item">'
                    +'<div class="ui-grid-d" >'
                        +'<div class="ui-block-a"><img src="http://www.ceramicalquds.com/media/item_collection/nbdQjPnHUA.jpg" alt="Italian Tile" style="margin:auto;"></div>'
                            +'<div class="ui-block-b ui-grid-solo">'
                                +'<div class="ui-block-a ui-grid-solo">'
                                    +'<label class="ui-block-a plabel"></label>'
                                    +'<label class="ui-block-a plabel">الوحدة</label>'
                                +'</div>'
                            +'<div class="ui-block-a ui-grid-solo">'
                                +'<label class="ui-block-a pval">{{unit}}</label>'
                            +'</div>'
                        +'</div>'
                        +'<div class="ui-block-c ui-grid-solo" >'
                            +'<label class="ui-block-a plabel"></label>'
                            +'<label class="ui-block-a plabel">السعر</label>'
                            +'<label class="ui-block-a pval">{{price}}</label>'
                        +'</div>'
                        +'<div class="ui-block-d ui-grid-solo">'
                            +'<label class="ui-block-a plabel"></label>'
                            +'<label class="ui-block-a plabel">الكمية</label>'
                            +'<label class="ui-block-a pval">{{amount}}</label>'
                        +'</div>'
                        +'<div class="ui-block-d ui-grid-solo">'
                            +'<label class="ui-block-a plabel"></label>'
                            +'<label class="ui-block-a plabel">رقم الصنف</label>'
                            +'<label class="ui-block-a pval">{{productid}}</label>'
                            +'<button class="dbtn" data-role="none"><i class="fa fa-trash"></i></button>'                              
                        +'</div>'
                    +'</div>'                        
                +'</div>'
                +'<hr class="order">';
        $('#cart').append(Mustache.render(html,product));
    })
}

function showOrderPrint(){
    $("#orderTable").empty();
    var current_datetime = new Date();
    $("#curdate").text(current_datetime.getFullYear() + "-" + (current_datetime.getMonth() + 1) + "-" + current_datetime.getDate());
    var tableheadhtml=""
        +'<colgroup>'
            +'<col span="1" style="width: 20%;">'
            +'<col span="1" style="width: 10%;">'
            +'<col span="1" style="width: 10%;">'
            +'<col span="1" style="width: 10%;">'
            +'<col span="1" style="width: 40%;">'
            +'<col span="1" style="width: 10%;">'
        +'</colgroup>'
        +'<tr>'
            +'<th>الإجمالي</th>'
            +'<th>الكمية</th>'
            +'<th>السعر</th>'
            +'<th>الوحدة</th>'
            +'<th>البيان</th>'
            +'<th>الرقم</th>'
        +'</tr>';
    $("#orderTable").append(Mustache.render(tableheadhtml,order));
    var total=0
    $.each(order,function(index,product){   
        var prodtotal = product.amount*product.price;     
        var tablecontenthtml=""
            +'<tr>'
                +'<td>'+prodtotal+'</td>'
                +'<td>{{amount}}</td>'
                +'<td>{{price}}</td>'
                +'<td>{{unit}}</td>'
                +'<td>{{productid}}:{{desc}} </td>'
                +'<td>'+ ++index +'</td>'
            +'</tr>';
            total +=prodtotal;
        $("#orderTable").append(Mustache.render(tablecontenthtml,product));        
    });
    var tablefooterhtml=""
        +'<tr dir="rtl">'            
            +'<td id="totalamount">'+total+'</td>'
            +'<td colspan="5">المجموع:</td>'
        +'</tr>';
    $("#orderTable").append(Mustache.render(tablefooterhtml,null));
    
}

function handleproduct(product){
    $("#oprice").html(product.price);
    $("#desc").html(product.title).append("\n"+product.width).append("\n"+product.height);
    $("#prodimage").attr('src',product.pic); 
}

function requestProductInfo(e){
    var product={};
    var ccode =$("#productid").val();
    var url =  "http://ceramicalquds.com/api/item_collection/?code="+ccode+"&format=json";

    $.ajax({
        url: url,
        crossOrigin:true,
        headers: {  
            'Access-Control-Allow-Credentials' : true,  
            'Access-Control-Allow-Origin': 'http://ceramicalquds.com/',  
            'Access-Control-Allow-Methods':'GET',  
            'Access-Control-Allow-Headers':'application/json',
            'SameSite':'none',  
        },
        jsonpCallback:"handleproduct",
        type: "GET",
        contentType: "application/x-www-form-urlencoded",
        dataType: "jsonp",                
        // beforeSend : function(xhr){
        //     xhr.setRequestHeader("Access-Control-Allow-Origin", "http://ceramicalquds.com/");
        //     xhr.setRequestHeader("Content-type","application/x-www-form-urlencoded");
        // },
        success : function(result) {
            var object =   $.parseJSON(result);   
            product["productid"] = object[0].code;
            product["desc"] = object[0].desc;
            product["title"] = object[0].title;
            product["price"] = object[0].oprice;
            product["pic"] = object[0].pic;
            product["available"] = object[0].available;
            product["width"] = object[0].width;
            product["height"] = object[0].height;
        },
        complete: function(data){
            console.log("Completed");
        }

    });
   
    
}

function processData(data,status){
    $("#elem").html($("#template").render(data))
}


//home page events
$(document).one('pageinit','#home',function(){

    $('#addproduct').on("tap",function (e) { 
        e.preventDefault();
        var amount = $('#amount').val();
        var price = $('#price').val();
        var oprice= $('#oprice').html();
        if(price=='')
            price = oprice;
        var productid = $('#productid').val();
        console.log(productid);
        if(productid=='' || productid==null){
            $.mobile.toast({
                message: "يجب عليك ادخال رقم الصنف", // Your messages
                classOnOpen: 'animated bounceInUp' // Animate.css animations
            });
            
            return;
        }

        var product = {
            productid:productid,
            amount:parseInt(amount),
            price:parseFloat(price),
            oprice:parseFloat(oprice),
            unit:"متر",
        };

        order.push(product);
        $.mobile.toast({
            message: 'تم اضافة الصنف بنجاح', // Your messages
            classOnOpen: 'animated bounceInUp', // Animate.css animations
            duration:3000,
        });
        $("#productid").val("");
        showOrder();
        showOrderPrint();
    });

    $("#productid").bind('input propertychange', function() {
        var searchedProduct = requestProductInfo(this.value);
        if(searchedProduct!=null){
            $("#oprice").html(searchedProduct.price);
            $("#desc").html(searchedProduct.desc);     
        }    
    });

   

    $("#price").bind('input propertychange', function() {
        var modprice = $("#price").val();
        if(modprice=='')
            $("#oprice").css("text-decoration-line","none");
        else
            $("#oprice").css("text-decoration-line","line-through");
    });  
});

$(document).one('pageinit','#orders',function(){
    
    $.mobile.keepNative = ".dbtn";
    $("#neworder").bind("tap",function(e){
        alert("new Order");
    });

    $("#cart").on("tap","button.dbtn",function(e){
        e.preventDefault();
        var index = $("#cart .dbtn").index(this);
        order.splice(index, 1)
        console.log(index);
        showOrder();
        showOrderPrint();
    });

    $("#custname").bind('input propertychange', function() {
        var custname = $("#custname").val();
        $("#toname").text(custname);
    });

});

$(document).one('pageinit','#print',function(){

    $("#showOrder").on("tap",function(e){

        var url="http://www.africau.edu/images/default/sample.pdf";
        //$("#viewdiv").attr("src",url);
        
        var doc = new jsPDF();
        doc.text("Hello world!", 10, 10);
        //doc.save("a4.pdf");
        //var data = doc.output('datauri')
        //url = "a4.pdf";
        $.mobile.toast({
            message: "انتظر من فضلك", // Your messages
            classOnOpen: 'animated bounceInUp' // Animate.css animations
        });

        $("#viewdiv").attr("src",doc.output("datauristring"));
        $('#viewdiv').attr('src', $('#viewdiv').attr('src'));
    });

    $("#printOrder").on("tap",function(e){
        $("#orderview").print();
    });
    
});