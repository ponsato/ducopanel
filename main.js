const { app, BrowserWindow } = require('electron')
const path = require('path')


function createWindow () {
    const mainWindow = new BrowserWindow({
        fullscreen: true,
        fullscreenable: false,
        autoHideMenuBar: true,
        icon:'resources/duco.ico',
        backgroundColor: '#363636',
        darkTheme: true,
        frame: false,
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
            enableRemoteModule: false,
            preload: path.join(__dirname, 'js/serialports.js'),
            webSecurity: false
        },

    });
    mainWindow.removeMenu();
    mainWindow.on('menu', function (e){
        e.preventDefault();
    });
    mainWindow.webContents.session.clearStorageData();
    mainWindow.webContents.session.clearCache();
    mainWindow.maximize();
    mainWindow.loadFile('index.html');
    mainWindow.show();
    mainWindow.webContents.setWindowOpenHandler(({ url }) => {
        return { action: 'allow' }
    });
    mainWindow.webContents.on("devtools-opened", () => { mainWindow.webContents.closeDevTools(); });
}

app.whenReady().then(() => {
    app.allowRendererProcessReuse = false
    createWindow();
})

app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') app.quit()
})