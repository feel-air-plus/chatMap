var milkcocoa = new MilkCocoa("******.mlkcca.com");
var locationDataStore = milkcocoa.dataStore("location");
var chatDataStore = milkcocoa.dataStore("chat");
var textArea, board, chatMessage;

window.onload = function(){
    textArea = document.getElementById("msg");
    var lat = "";//緯度
    var lng = "";//経度
    var map = new GMaps({
        div: "#map",//id名
        lat: lat,
        lng: lng,
        zoom: 18,//縮尺
        panControl : false,
        streetViewControl : false,
        overviewMapControl: false
    });
    //画面描画時に現在地を取得
    this.getGeolocate();

    setInterval(function(){
      this.getGeolocate();
    },10000);//10秒ごとに位置情報送信

    locationDataStore.on('send', function(data) {
        var lat = data.value.lat, lng = data.value.lng;
        var img = '../img/azarashi.png';
        map.removeMarkers();
        map.setCenter(lat, lng);
        map.addMarker({
          lat: lat,
          lng: lng,
          title: 'I’m here',
          icon:img,
          click: function(e) {
            alert('Don’t touch me');
          },
        });
        map.drawOverlay({
          lat: lat,
          lng: lng,
          layer: 'overlayLayer',
          content: '<div id="chatMessage"></div>',
          verticalAlign: 'top',
          horizontalAlign: 'center',
        });
        // console.log('recieve',data.value);
    });
};

function getGeolocate(){
  GMaps.geolocate({
    success: function(position) {
      locationDataStore.send({
          lat : position.coords.latitude,
          lng : position.coords.longitude,
      });
    },
    error: function(error) {
      console.log('geolocate error '+error.message);
    },
    not_supported: function() {
      console.log("geolocate not support");
    },
  });
};

function clickEvent(){
  var chatMessage = textArea.value;
  var userId = $("#userId")[0].value;
  textArea.value = "";
  if(chatMessage == "" || userId == ""){
    return;
  }
  chatDataStore.push(
    { 
      userId  : userId,
      message : chatMessage,
      date    : dateFormatYYYYMMDDHHNNSS(new Date())
    },
    function(err, pushed){
      // console.log("chatMessage pushed");
    },
    function(err) {
      console.log("chatMessage push failed "+err);
    }
  )
};

$(function() {
  chatDataStore.on("push", function(e) {
    var user = e.value.userId;
    if($('.'+user).text()){
      //同一ユーザが既に投稿済みの文言を削除する
      $('.'+user).remove();
    }
    var userMessage = $('<div class='
      + user
      + '>'
      + '</div>').appendTo($("#chatMessage")).show();
    userMessage.css({
      // "width":"95%",
      // "display":"block",
      // "text-align":"center",
      // "color":"#fff",
      // "font-size":"16px",
      // "line-height":"20px",
      // "opacity":0.7,
      // "background":"#4477aa",
      // "border-radius":"4px",
      // "box-shadow":"2px 2px 10px #333",
      // "text-shadow":"1px 1px 1px #666",
      // "padding":"0 4px",
    })
    $('.'+user).addClass("overlay");
    $('.'+user).text(user+": "+e.value.message);
  });

  dateFormatYYYYMMDDHHNNSS = function(date){
    var YYYY = date.getYear();
    if (YYYY < 1900){YYYY += 1900}
    var MM = String(date.getMonth()+1);
    if (MM.length < 2){MM = "0" + MM}
    var DD = String(date.getDate());
    if (DD.length < 2){DD = "0" + DD}
    var HH = String(date.getHours());
    if (HH.length < 2){HH = "0" + HH}
    var NN = String(date.getMinutes());
    if (NN.length < 2){NN = "0" + NN}
    var SS = String(date.getSeconds());
    if (SS.length < 2){SS = "0" + SS}
    return Number(String(YYYY) + MM + DD + HH + NN + SS);
  }
});
