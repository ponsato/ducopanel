# DucoPanel

This development tries to unify all the web tools and official documentation of https://duinocoin.com into a desktop application, which will also be able to detect the miners connected to the USB ports to run the official miner AVR_miner.py, creating the necessary configuration file to make it work.
It will also include the PC_miner.py miner to be able to mine from the pc.
On the other hand, we will try to include Arduino Cli to upload the official code to the arduino boards that are connected (Uno, nano and due, for now).

For this we will use https://www.electronjs.org

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