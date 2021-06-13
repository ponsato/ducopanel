const { app, BrowserWindow } = require('electron')
const path = require('path')

function createWindow () {
    const mainWindow = new BrowserWindow({
        fullscreen: true,
        fullscreenable: false,
        autoHideMenuBar: true,
        icon:'resources/duco.ico',
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
            enableRemoteModule: false,
            preload: path.join(__dirname, 'js/serialports.js'),
            webSecurity: false
        },

    })
    mainWindow.maximize();
    mainWindow.loadFile('index.html');
    mainWindow.show();
    mainWindow.webContents.session.clearStorageData();
}

app.allowRendererProcessReuse=false

app.whenReady().then(() => {
    createWindow();

})


app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') app.quit()
})