const { app, BrowserWindow } = require('electron')
const path = require('path')

function createWindow () {
    const mainWindow = new BrowserWindow({
        fullscreen: true,
        fullscreenable: false,
        autoHideMenuBar: true,
        icon:'resources/duco.ico',
        webPreferences: {
            /*preload: path.join(__dirname, 'preload.js')*/
        },

    })
    mainWindow.maximize();
    mainWindow.loadFile('index.html');
    mainWindow.show();
    mainWindow.webContents.session.clearStorageData();
}

app.whenReady().then(() => {
    createWindow();

})


app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') app.quit()
})