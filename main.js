const { app, BrowserWindow, Menu, shell, ipcMain, dialog } = require("electron/main");
const path = require("node:path");

const createWindow = () => {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
    }
    // autoHideMenuBar: true,
  });

  Menu.setApplicationMenu(Menu.buildFromTemplate(template));

  win.loadFile("./src/view/index.html");
};

const aboutWindow = () => {
  const about = new BrowserWindow({
    width: 360,
    height: 220,
    autoHideMenuBar: true,
    resizable: false,
  });

  about.loadFile("./src/view/about.html");
}

const childWindow = () => {
  const father = BrowserWindow.getFocusedWindow();
  if(father) {
    const child = new BrowserWindow({
      parent: father,
      width: 640,
      height: 480,
      autoHideMenuBar: true,
      resizable: false,
      parent: father,
      modal: true,
    });

    child.loadFile("./src/view/child.html");
  }
}

app.whenReady().then(() => {
  createWindow();
  // aboutWindow();

  ipcMain.on("open-child", () => {
    childWindow();
  });

  ipcMain.on("renderer-message", (event, message) => {
    console.log(message);
    event.reply("main-message", "Oi, sou o main.js!");
  });

  ipcMain.on('dialog-info', () => {
    dialog.showMessageBox({
      type: 'info',
      title: 'Informação',
      message: 'Mensagem',
      buttons: ['OK']
    })
  })

  ipcMain.on('dialog-warning', () => {
    dialog.showMessageBox({
      type: 'warning',
      title: 'Aviso!',
      message: 'Confirma esta ação?',
      buttons: ['Sim', 'Não'],
      defaultId: 0
    }).then((result) => {
      console.log(result)
      if (result.response === 0) {
        console.log("Confirmado!")
      }
    })
  })

  ipcMain.on('dialog-select', () => {
    dialog.showOpenDialog({
      properties: ['openDirectory']
    }).then((result) => {
      console.log(result)
    }).catch((error) => {
      console.log(error)
    })
  })

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});

const template = [
  {
    label: 'Arquivo',
    submenu: [
      {
        label: 'Janela Secundária',
        click: () => childWindow()
      },
      {
        label: 'Sair',
        click: () => app.quit(),
        accelerator: 'Alt+F4'
      }
    ]
  },
  {
    label: 'Exibir',
    submenu: [
      {
        label: 'Recarregar',
        role: 'reload'
      },
      {
        label: 'Ferramentas do desenvolvedor',
        role: 'toggleDevTools'
      },
      {
        type: 'separator'
      },
      {
        label: 'Aplicar zoom',
        role: 'zoomIn'
      },
      {
        label: 'Reduzir',
        role: 'zoomOut'
      },
      {
        label: 'Restaurar o zoom padrão',
        role: 'resetZoom'
      }
    ]
  },
  {
    label: 'Ajuda',
    submenu: [
      {
        label: 'docs',
        click: () => shell.openExternal('https://www.electronjs.org/docs/latest/')
      },
      {
        type: 'separator'
      },
      {
        label: 'Sobre',
        click: () => aboutWindow()
      }
    ]
  }
]