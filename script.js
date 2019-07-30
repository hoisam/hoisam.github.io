var listPlayerData=[];
var curSelectedPlayer;
$(document).ready(function () {   
    if(typeof(localStorage.listPlayerData)!='undefined'){
        try {
            listPlayerData=JSON.parse(localStorage.listPlayerData);
            console.log(localStorage.listPlayerData);    
            showListDetail();
            $('.content-section p').html(localStorage.log);
        } catch (error) {
            localStorage.removeItem(listPlayerData);
            $("#init-list-name").modal('show');
        }
    }else{
        $("#init-list-name").modal('show');
    }    
});
function showListDetail(){
    $('.list-detail').html(Mustache.to_html($("#item-detail").html(), {listPlayerData:listPlayerData}));
    $('.list-detail button').click(function(){
        curSelectedPlayer=$(this).index();
        $("#modal-transfers .modal-title").html(listPlayerData[curSelectedPlayer].name+" nhận tiền từ:")
        $("#modal-transfers .modal-body").html('');
        for (let index = 0; index < listPlayerData.length; index++) {
            if(index!=curSelectedPlayer){
                $("#modal-transfers .modal-body").append(Mustache.to_html($("#item-player-pay").html(), {idx:index,name:listPlayerData[index].name}));
            }
        }
        
        $("#modal-transfers .modal-body .input-group").click(function(){
            focusPlayerTransfers($(this).index());
        });
        
        $("#modal-transfers .modal-footer button").click(function(){
            var activeRow= $($("#modal-transfers .modal-body .active")[0]).parents()[1];
            $(activeRow).find('input').val($(this).html());
            focusPlayerTransfers(($(activeRow).index()+1)%(listPlayerData.length-1));
        });
        $("#modal-transfers").modal('show');
    });
}
function focusPlayerTransfers(index){
    
    $("#modal-transfers .modal-body button").removeClass('active');
    $("#modal-transfers .modal-body").children().eq(index).find("button").addClass('active');
    $("#modal-transfers .modal-body").children().eq(index).find("input").select();
}
function TryParseInt(str,defaultValue) {
    var retValue = defaultValue;
    if(str !== null) {
        if(str.length > 0) {
            if (!isNaN(str)) {
                retValue = parseInt(str);
            }
        }
    }
    return retValue;
}
$("#modal-transfers .transfers-done").click(function(){
    var rows=$("#modal-transfers .modal-body .input-group");
    var curLog=localStorage.log;
    var mon=null;
    for (let index = 0; index < rows.length; index++) {
        mon=TryParseInt($(rows[index]).find('input').val(), null);
        if(mon==null){
            break;
        }
        listPlayerData[$(rows[index]).attr('idx')].money-=mon;
        listPlayerData[curSelectedPlayer].money+=mon;
        if(mon>0){
            curLog="<label>" + listPlayerData[$(rows[index]).attr('idx')].name+"→"+listPlayerData[curSelectedPlayer].name+":"+$(rows[index]).find('input').val()+"</label>"+curLog;
        }
    }
    if(mon!=null){
        curLog="<hr>"+curLog;
        localStorage.log=curLog;
        localStorage.listPlayerData=JSON.stringify(listPlayerData);
        location.reload();
    }else{
        alert("Vui lòng nhập đúng");
    }
    
});
$('#modal-transfers').on('shown.bs.modal', function (e) {
    focusPlayerTransfers(0);
});

$('#init-list-name').on('show.bs.modal', function (e) {
    $("#init-list-name .txt-name-add").val('');
    $("#init-list-name .btn-add").attr('disabled', true);
    showListName();
});

$('.txt-name-add').on('input', function () {
    if ($(this).val() != '') {
        $("#init-list-name .btn-add").attr('disabled', false);
    } else {
        $("#init-list-name .btn-add").attr('disabled', true);
    }
});

$('.txt-name-add').keypress(function(event){
    var keycode = (event.keyCode ? event.keyCode : event.which);
    if(keycode == '13'){
        InitAddName($('.txt-name-add').val());
    }
});

$("#init-list-name .btn-add").click(function() {
    InitAddName($('#init-list-name .txt-name-add').val());
});
$(".reset-btn").click(function() {
    if (confirm("Chắc chứ?")) {
        localStorage.clear()
        location.reload();
    }
});

function InitAddName(name){
    listPlayerData.push({name:name,money:0});
    $("#init-list-name .txt-name-add").val('');
    $("#init-list-name .btn-add").attr('disabled', true);
    $('#init-list-name .txt-name-add').focus();
    showListName();
}

function showListName(){
    $('#init-list-name .list-name').html(Mustache.to_html($("#item-name-init").html(), {listPlayerData:listPlayerData}));
    $("#init-list-name .btn-del-name").click(function() {
        listPlayerData.splice($($(this).parents()[1]).index(),1);
        showListName();
    });
    $("#init-list-name .txt-name").change(function(){
        listPlayerData[$($(this).parent()).index()]=$(this).val();
    });
}

$("#init-list-name .btn-done").click(function(){
    console.log("Save Data");
    localStorage.listPlayerData=JSON.stringify(listPlayerData);
    location.reload();
});