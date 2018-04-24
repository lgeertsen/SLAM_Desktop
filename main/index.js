// Native
const { format } = require('url')

// Packages
const electron = require('electron')
const { BrowserWindow, app, dialog, ipcMain } = require('electron')
const isDev = require('electron-is-dev')
const prepareNext = require('electron-next')
const { resolve } = require('app-root-path')


var mainWindow, secondWindow;

// Prepare the renderer once the app is ready
app.on('ready', async () => {
  await prepareNext('./renderer')

  const width = electron.screen.getPrimaryDisplay().workAreaSize.width
  const height = electron.screen.getPrimaryDisplay().workAreaSize.height

  let displays = electron.screen.getAllDisplays()
  let externalDisplay = displays.find((display) => {
    return display.bounds.x !== 0 || display.bounds.y !== 0
  })

  mainWindow = new BrowserWindow({
    width: width,
    height: height,
    frame: false,
    fullscreen: false,
    resize: false
  })

  mainWindow.maximize();
  mainWindow.setMenu(null);

  const devPath = 'http://localhost:8000/start'

  const prodPath = format({
    pathname: resolve('renderer/out/start/index.html'),
    protocol: 'file:',
    slashes: true
  })

  const url = isDev ? devPath : prodPath
  mainWindow.loadURL(url)

  // if (externalDisplay) {
  // // if(false) {
  //   secondWindow = new BrowserWindow({
  //     // width: width,
  //     // height: height,
  //     x: externalDisplay.bounds.x,
  //     y: externalDisplay.bounds.y,
  //     closable: false,
  //     focusable: false,
  //     fullscreen: true,
  //     frame: false,
  //     skipTaskbar: true,
  //   })
  //   mainWindow.focus();
  // } else {
  //   //mainWindow.webContents.send('noExternalDisplay', {})
  //   secondWindow = new BrowserWindow({
  //     width: width,
  //     height: height,
  //     closable: false,
  //     // frame: false,
  //     icon: path.join(__dirname, 'cupPong_256x256.png')
  //   })
  //
  //   const options = {
  //     type: 'info',
  //     title: 'Information',
  //     message: "Pour un meilleur fonctionnement du logiciel, veuillez brancher un écran externe ou videoprojecteur, et relancer le logiciel"
  //   }
  //   setTimeout(function() {
  //     mainWindow.focus();
  //     dialog.showMessageBox(options)
  //   }, 3000)
  // }
  //
  // secondWindow.setMenu(null);
  //
  // const devPath2 = 'http://localhost:8000/screen'
  //
  // const prodPath2 = format({
  //   pathname: resolve('renderer/out/screen/index.html'),
  //   protocol: 'file:',
  //   slashes: true
  // })
  //
  // const url2 = isDev ? devPath2 : prodPath2
  // secondWindow.loadURL(url2)

  // mainWindow.webContents.openDevTools()
  // secondWindow.webContents.openDevTools()

  if (secondWindow != null) {
    ipcMain.on('tournament', (event, tournament) => {
      secondWindow.webContents.send('tournament', tournament);
    })
  }


  mainWindow.on('closed', function () {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null
    if (secondWindow != null) {
      // secondWindow.close()
      secondWindow.destroy()
      secondWindow = null;
    }
  })

  secondWindow.on('closed', function() {
      secondWindow = null
  })
})

// Quit the app once all windows are closed
app.on('window-all-closed', app.quit)
