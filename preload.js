const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("api", {
  // index.html
  showInsertUser: () => ipcRenderer.send("open-showInsertUser"),
  showUpdateUser: (id) => ipcRenderer.send("open-showUpdateUser", id),
  response: (callback) => ipcRenderer.on("response", callback),
  selectUsers: () => ipcRenderer.send("select-users"),
  onUsersSelected: (callback) =>
    ipcRenderer.on("select-users-response", callback),
  deleteUser: (id) => ipcRenderer.send("delete-user", id),

  // formUser.html
  insertUser: (name, email, password) =>
    ipcRenderer.send("insert-user", { name, email, password }),
  onUserInserted: (callback) =>
    ipcRenderer.on("insert-user-response", callback),
  closeForm: () => ipcRenderer.send("close-form"),

  // formUpdate.html
  onSetUser: (callback) => ipcRenderer.on("set-user", callback),
  updateUser: (id, name, email, password) =>
    ipcRenderer.send("update-user", { id, name, email, password }),
  onUserUpdated: (callback) => ipcRenderer.on("update-user-response", callback),
});

window.addEventListener("DOMContentLoaded", () => {
  const dataAtual = (document.getElementById("dataAtual").innerHTML =
    obterData());
});

function obterData() {
  const data = new Date();
  const options = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  };
  return data.toLocaleDateString("pt-BR", options);
}
