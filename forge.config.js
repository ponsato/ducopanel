const { app } = require('electron')
const path = require('path');
const packageJson = require('./package.json');

const { version } = packageJson;

// TODO win-certificate.pfx for autoupdate
/*if (process.env['WINDOWS_CODESIGN_FILE']) {
    const certPath = path.join(__dirname, 'win-certificate.pfx');
    const certExists = fs.existsSync(certPath);

    if (certExists) {
        process.env['WINDOWS_CODESIGN_FILE'] = certPath;
    }
}*/

function notarizeMaybe() {
    if (process.platform !== 'darwin') {
        return;
    }

    if (!process.env.CI) {
        console.log(`Not in CI, skipping notarization`);
        return;
    }

    if (!process.env.APPLE_ID || !process.env.APPLE_ID_PASSWORD) {
        console.warn(
            'Should be notarizing, but environment variables APPLE_ID or APPLE_ID_PASSWORD are missing!',
        );
        return;
    }

    config.packagerConfig.osxNotarize = {
        appBundleId: 'com.electron.fiddle',
        appleId: process.env.APPLE_ID,
        appleIdPassword: process.env.APPLE_ID_PASSWORD,
        ascProvider: 'LT94ZKYDCJ',
    };
}

notarizeMaybe();

// Config
module.exports = {
    packagerConfig: {
        name: 'Ducopanel',
        executableName: 'Ducopanel',
        asar: false,
        dereference: true,
        icon: path.resolve(__dirname, 'build', 'icons', 'icon'),
        ignore: [
            ".idea",
            ".gitignore"
        ],
        win32metadata: {
            CompanyName: 'Duinocoin',
            OriginalFilename: 'Duino Coin',
        }
    },
    makers: [
        {
            name: '@electron-forge/maker-squirrel',
            platforms: ['win32'],
            config: (arch) => {
                // TODO win-certificate.pfx for autoupdate
                /*const certificateFile = process.env.CI
                    ? path.join(__dirname, 'cert.p12')
                    : process.env.WINDOWS_CERTIFICATE_FILE;

                if (!certificateFile || !fs.existsSync(certificateFile)) {
                    console.warn(
                        `Warning: Could not find certificate file at ${certificateFile}`,
                    );
                }*/

                return {
                    name: 'Ducopanel',
                    authors: 'DuinoCoin Community',
                    exe: 'Ducopanel.exe',
                    noMsi: true,
                    setupExe: `ducopanel-${version}-win32-${arch}-setup.exe`
                    // TODO win-certificate.pfx for autoupdate
                    /*certificateFile: process.env['WINDOWS_CODESIGN_FILE'],
                    certificatePassword: process.env['WINDOWS_CODESIGN_PASSWORD'],*/
                };
            },
        },
        {
            name: '@electron-forge/maker-zip',
            platforms: ['darwin'],
        },
        {
            name: '@electron-forge/maker-deb',
            platforms: ['linux'],
            config: {
                icon: {
                    scalable: 'build/icon.png',
                },
            },
        },
        {
            name: '@electron-forge/maker-rpm',
            platforms: ['linux'],
        },
    ],
    handleSquirrelEvent: function() {
        if (process.argv.length === 1) {
            return false
        }

        const ChildProcess = require('child_process')
        const path = require('path')

        const appFolder = path.resolve(process.execPath, '..')
        const rootAtomFolder = path.resolve(appFolder, '..')
        const updateDotExe = path.resolve(path.join(rootAtomFolder, 'Update.exe'))
        const exeName = path.basename(process.execPath)

        const spawn = function(command, args) {
            let spawnedProcess

            try {
                spawnedProcess = ChildProcess.spawn(command, args, { detached: true })
            } catch (error) {
                console.warn(error)
            }

            return spawnedProcess
        }

        const spawnUpdate = function(args) {
            return spawn(updateDotExe, args)
        }

        const squirrelEvent = process.argv[1]
        switch (squirrelEvent) {
            case '--squirrel-install':
            case '--squirrel-updated':
                spawnUpdate(['--createShortcut', exeName])
                setTimeout(app.quit, 1000)
                break

            case '--squirrel-uninstall':
                spawnUpdate(['--removeShortcut', exeName])
                setTimeout(app.quit, 1000)
                break

            case '--squirrel-obsolete':
                app.quit()
                break
        }
    }
};
