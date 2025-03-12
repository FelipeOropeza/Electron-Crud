const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("api", {
  verElectron: () => process.versions.electron,
  showInsertUser: () => ipcRenderer.send("open-showInsertUser"),
  insertUser: (name, email, password) =>
    ipcRenderer.send("insert-user", { name, email, password }),
  onUserInserted: (callback) =>
    ipcRenderer.on("insert-user-response", callback),
  selectUsers: () => ipcRenderer.send("select-users"),
  onUsersSelected: (callback) =>
    ipcRenderer.on("select-users-response", callback),
  closeForm: () => ipcRenderer.send("close-form"),
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
