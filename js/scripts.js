var order = new Array();


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

function requestProductInfo(e){
    var products = [
        {
            productid:12345,
            amount:100,
            price:34,
            desc:"desc 12345",
        },
        {
            productid:23456,
            amount:200,
            price:64,
            desc:"desc 23456",
        },
        {
            productid:34567,
            amount:150,
            price:44,
            desc:"desc 34567",
        }
    ];
    var product=null;

    products.forEach(function(tproduct){

        if(tproduct.productid==e){
            product=tproduct;
            return product;
        }
        else
            return null;
    });
    return product;
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
            alert("يجب عليك ادخال رقم الصنف");
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
        showOrder();
    });

    $("#productid").bind('input propertychange', function() {
        console.log(this.value);
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
    });

});
