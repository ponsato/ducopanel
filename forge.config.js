const path = require('path');
const fs = require('fs');
const packageJson = require('./package.json');

const { version } = packageJson;
const iconDir = path.resolve(__dirname, 'assets', 'icons');
// TODO win-certificate.pfx for autoupdate
/*if (process.env['WINDOWS_CODESIGN_FILE']) {
    const certPath = path.join(__dirname, 'win-certificate.pfx');
    const certExists = fs.existsSync(certPath);

    if (certExists) {
        process.env['WINDOWS_CODESIGN_FILE'] = certPath;
    }
}*/

const config = {
    packagerConfig: {
        name: 'ducopanel',
        executableName: 'ducopanel',
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
                    name: 'ducopanel',
                    authors: 'DuinoCoin Community',
                    exe: 'ducopanel.exe',
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
};

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

module.exports = config;
