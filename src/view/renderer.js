function openChild(){
    api.open();
}

api.send("Oi, sou o renderer.js!");

api.on((event, message) => {
  console.log(message);
});

function info() {
    api.info()
}

function warning() {
    api.warning()
}

function select() {
    api.select()
}