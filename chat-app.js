(function() {
  var messageList = document.getElementById("message-list"),
    newMessageName = document.getElementById("new-message-name"),
    newMessageInput = document.getElementById("new-message-input"),
    newMessageSubmit = document.getElementById("new-message-submit"),
    newMessageForm = document.getElementById("new-message-form"),
    socket = new WebSocket("ws://james-toshiba:3000"),
    lastUpdate,
    currentTime = Date.now(),
    name = newMessageName.value;

  newMessageName.addEventListener("input", function(event) {
    name = event.target.value;
  });
  newMessageSubmit.addEventListener("click", function(event) {
    var message = {
      name: name,
      content: newMessageInput.value
    };
    newMessageInput.value = "";
    if(message.content) {
      socket.send(JSON.stringify(message));
    }
  });
  newMessageForm.addEventListener("submit", function(event) {
    event.preventDefault();
  });
  socket.addEventListener("message", function(event) {
    var data = parseJSON(event.data);
    if(data.currentTime) {
      currentTime = data.currentTime;
    }
    if(data.messages) {
      updateMessageList(data.messages);
    }
  });

  function parseJSON(jsonString) {
    var data;
    try {
      data = JSON.parse(jsonString);
    } catch(e) {
      return null;
    }
    return data;
  }

  function updateMessageList(messages) {
    var tempElement;
    clearChildren(messageList);
    messages.forEach(function(message) {
      tempElement = document.createElement("li");
      tempElement.innerHTML = message.name + ": " + message.content;
      messageList.appendChild(tempElement);
    });
    tempElement = null;
  }

  function clearChildren(element) {
    while(element.firstChild) {
      element.removeChild(element.firstChild);
    }
  }
})();
