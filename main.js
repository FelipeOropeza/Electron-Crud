const {
  app,
  BrowserWindow,
  Menu,
  shell,
  ipcMain,
  dialog,
} = require("electron/main");
const {
  createUser,
  getUsers,
  deleteUser,
} = require("./src/prisma/UserService.js");
const path = require("node:path");

let win;
let Updatechild;

const createWindow = () => {
  win = new BrowserWindow({
    width: 800,
    height: 600,
    title: "Home",
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
    },
    // autoHideMenuBar: true,
  });

  Menu.setApplicationMenu(Menu.buildFromTemplate(template));

  win.loadFile("./src/view/index.html");
};

const InsertWindow = () => {
  const father = BrowserWindow.getFocusedWindow();
  if (father) {
    const Insertchild = new BrowserWindow({
      parent: father,
      width: 600,
      height: 500,
      autoHideMenuBar: true,
      title: "Formulario de Cadastro",
      resizable: false,
      center: true,
      modal: true,
      webPreferences: {
        preload: path.join(__dirname, "preload.js"),
      },
    });

    Insertchild.loadFile("./src/view/formUser.html");
  }
};

const UpdateWindow = (id) => {
  const father = BrowserWindow.getFocusedWindow();
  if (father) {
    Updatechild = new BrowserWindow({
      parent: father,
      width: 600,
      height: 500,
      autoHideMenuBar: true,
      title: "Formulario de Atualização",
      resizable: false,
      center: true,
      modal: true,
      webPreferences: {
        preload: path.join(__dirname, "preload.js"),
      },
    });

    Updatechild.loadFile("./src/view/formUpdate.html");

    Updatechild.webContents.on('did-finish-load', () => {
      Updatechild.webContents.send('set-id', { id: id });
    });
  }
};

app.whenReady().then(() => {
  createWindow();

  ipcMain.on("open-showInsertUser", () => {
    InsertWindow();
  });

  ipcMain.on("open-showUpdateUser", (event, id) => {
    UpdateWindow(id);
  });
  

  ipcMain.on("insert-user", async (event, user) => {
    try {
      const { name, email, password } = user;
      await createUser(name, email, password);
      await dialog.showMessageBox({
        type: "info",
        title: "Sucesso",
        message: "Usuário inserido com sucesso!",
        buttons: ["OK"],
      });

      event.sender.send("insert-user-response", { success: true });
      win.webContents.send("response", { success: true });
    } catch (error) {
      dialog.showErrorBox("Erro", error.message);
    }
  });

  ipcMain.on("delete-user", async (event, id) => {
    try {
      await deleteUser(id);
      await dialog.showMessageBox({
        type: "info",
        title: "Sucesso",
        message: "Usuário foi deletado com sucesso!",
        buttons: ["OK"],
      });

      win.webContents.send("response", { success: true });
    } catch (error) {
      dialog.showErrorBox("Erro", error.message);
    }
  });

  ipcMain.on("select-users", async (event) => {
    const users = await getUsers();
    event.sender.send("select-users-response", { users: users });
  });

  ipcMain.on("close-form", () => {
    BrowserWindow.getFocusedWindow().close();
  });

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});

const template = [
  {
    label: "Arquivo",
    submenu: [
      {
        label: "Sair",
        click: () => app.quit(),
        accelerator: "Alt+F4",
      },
    ],
  },
  {
    label: "Exibir",
    submenu: [
      {
        label: "Recarregar",
        role: "reload",
      },
      {
        label: "Ferramentas do desenvolvedor",
        role: "toggleDevTools",
      },
      {
        type: "separator",
      },
      {
        label: "Aplicar zoom",
        role: "zoomIn",
      },
      {
        label: "Reduzir",
        role: "zoomOut",
      },
      {
        label: "Restaurar o zoom padrão",
        role: "resetZoom",
      },
    ],
  },
  {
    label: "Ajuda",
    submenu: [
      {
        label: "docs",
        click: () =>
          shell.openExternal("https://www.electronjs.org/docs/latest/"),
      },
    ],
  },
];
