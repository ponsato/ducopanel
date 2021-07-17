# DucoPanel

This development tries to unify all the web tools and official documentation of https://duinocoin.com into a desktop application, which will also be able to detect the miners connected to the USB ports to run the official miner AVR_miner.py, creating the necessary configuration file to make it work.
It will also include the PC_miner.py miner to be able to mine from the pc.
On the other hand, we will try to include Arduino Cli to upload the official code to the arduino boards that are connected (Uno, nano and due, for now).

For this we will use https://www.electronjs.org

## Requirements

It is necessary to have Python 3 and Arduino CLI installed in the environment, both with global variables declared.

You can download them from the following links:
- https://www.python.org/downloads/
- https://arduino.github.io/arduino-cli/latest/installation/
- https://support.shotgunsoftware.com/hc/en-us/articles/114094235653-Setting-global-environment-variables-on-Windows

## To use

To clone and run this repository you'll need [Git](https://git-scm.com) and [Node.js](https://nodejs.org/en/download/) (which comes with [npm](http://npmjs.com)) installed on your computer. From your command line:

```bash
# Clone this repository
git clone git@github.com:ponsato/ducopanel.git
# Go into the repository
cd ducopanel
# Install dependencies
npm install
# Run the app
npm start
```
A windows window will open with the development mode, and you are ready to start writing code.

Learn more about Electron and its API in the [documentation](http://electron.atom.io/docs/).

## Precompile app

To precompile the application in an .exe that we can run in any computer (for now only windows, later linux and mac), we have to place ourselves in the root of the project and run it:
```bash
npm run make
```
In the /out folder, a folder will be created with the name of the project and the corresponding architecture (x64, linux, etc.), where the executable file will be located among other files. This is a precompiled version, when everything is ready I will update the documentation with the steps to obtain a production version for each of the operating systems.

This folder with all the contents of the application can be packed and run on any other device with the corresponding operating system. In this way, the result of the development can be tested without the need for a production version.

## Windows installer

In order to get a windows installer, you have previously had to get a precompiled version with the above command.

You can then run the following command (be careful with the architecture you are using):

```bash
electron-installer-windows --src out\ducopanel-win32-x64\ --dest dist/installers/ --config config.json
```

The installation will be carried out on the following route:

C:\Users\user\AppData\Roaming\ducopanel

## Downloads

⚠️ NOTICE: .exe binaries may be detected as a virus by your antivirus software. This is a false positive caused by pyinstallers bootloader, read about it [here](https://stackoverflow.com/questions/43777106/program-made-with-pyinstaller-now-seen-as-a-trojan-horse-by-avg). Duino-Coin is not a virus.

You can download the installer for the latest version for Windows 64-bit here:

- [ducopanel-1.0.0-setup.exe](https://tomaszafra.es/ducopanel/installers/ducopanel-1.0.0-setup.exe)
- [ducopanel-1.0.0-setup.msi](https://tomaszafra.es/ducopanel/installers/ducopanel-1.0.0-setup.msi)



