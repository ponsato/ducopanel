# DucoPanel

Desktop App to manage all your AVR miners in a simple way, being able to upload the code to any Arduino board (through [Arduino-Cli](https://arduino.github.io/arduino-cli/latest/installation/)), mine with all the boards or with the ones you choose, mine with the PC (choosing the cores you want), and much more.

You can also connect to your official wallet and perform any operation without leaving the application, as well as see the live status of the network and servers.

This development makes everything related to [DuinoCoin](https://duinocoin.com) even easier, based exclusively on the official tools.

[ElectronJs](https://www.electronjs.org) has been used for this purpose.

![N|Solid](https://i.ibb.co/ThhFqD9/ducopanel-pi.png)

## Requirements

It is necessary to have Python 3 and Arduino CLI installed in the environment, both with global enviroment variables declared.

You can download them from the following links:
- [Python 3](https://www.python.org/downloads/)

Or execute this command:

```bash
sudo apt install python3 python3-pip
```

For Linux, you have to run the following command to avoid having to grant read permissions to the USB ports every time the computer is restarted:

```bash
sudo usermod -aG dialout username
```

This will add the current user to the dialout group. Login and out it to take effect.

## Arduino-Cli

It is necessary to install Arduino-Cli and create an enviroment variable for it to be able to upload code to the arduino boards. For that, in Linux you have to follow the following commands:

```bash
curl -fsSL https://raw.githubusercontent.com/arduino/arduino-cli/master/install.sh | BINDIR=~/local/bin sh

export PATH=$PATH:/local/bin

sudo reboot
```

Once finished you have to install the arduino avr library with the following command:

```bash
arduino-cli core install arduino:avr
```

In windows follow these steps:

- [Arduino Cli](https://arduino.github.io/arduino-cli/latest/installation/)
- [Setting global enviroment variables](https://support.shotgunsoftware.com/hc/en-us/articles/114094235653-Setting-global-environment-variables-on-Windows)


## To use

To clone and run this repository you'll need [Git](https://git-scm.com) and [Node.js](https://nodejs.org/en/download/) (which comes with [npm](http://npmjs.com)) installed on your computer. From your command line:

```bash
# Clone this repository
git clone https://github.com/ponsato/ducopanel.git
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

## Installer

You can then run the following command (be careful with the architecture you are using):

For Windows:

```bash
npm run-script build
```

For Linux:

```bash
npm run-script buildLinux
```

For Linux Arm (raspberry Pi):

```bash
npm run-script buildLinuxArm
```

The installation files shall be created in:
```bash
/dist/installers/
```

To close Ducopanel, or any of the windows that open internally, press alt + F4.

To uninstall it, do it as you would uninstall any other program.

## Downloads

⚠️ NOTICE: .exe binaries may be detected as a virus by your antivirus software. This is a false positive caused by pyinstallers bootloader, read about it [here](https://stackoverflow.com/questions/43777106/program-made-with-pyinstaller-now-seen-as-a-trojan-horse-by-avg). Duino-Coin is not a virus.

You can download the installer for the latest version for Windows and Debian 64-bit here:

- [Ducopanel-1.273.0-setup.exe](https://github.com/ponsato/ducopanel/releases/download/1.273.0/Ducopanel-1.273.0-setup.exe)
- [Ducopanel-1.273.0-setup.msi](https://github.com/ponsato/ducopanel/releases/download/1.273.0/Ducopanel-1.273.0-setup.msi)
- [ducopanel_1.273.0_amd64.deb](https://github.com/ponsato/ducopanel/releases/download/1.273.0/ducopanel_1.273.0_amd64.deb)
- [ducopanel_1.273.0_arm64.deb](https://github.com/ponsato/ducopanel/releases/download/1.273.0/ducopanel_1.273.0_arm64.deb)
