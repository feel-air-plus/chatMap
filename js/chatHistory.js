var milkcocoa = new MilkCocoa("******.mlkcca.com");
var chatDataStore = milkcocoa.dataStore("chat");

$(function() {
  chatDataStore.stream().sort("desc").next(function(err, datas) {
      datas.forEach(function(data) {
          renderMessage(data);
      });
  });

  chatDataStore.on("push", function(e) {
      renderMessage(e);
  });
  var last_message = "summary";
  function renderMessage(msg) {
      var message_html = '<p class="post-text">' + msg.value.message + '</p>';
      var date_html = '';
      date_html = '<p class="post-date">'+msg.value.date+'</p>';
      $("#"+last_message).before('<div id="'+msg.id+'" class="post">'+message_html + date_html +'</div>');
      last_message = msg.id;
  };
});
