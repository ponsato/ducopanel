import sys
import subprocess
from configparser import ConfigParser

MINER_VER = '2.74'  # Version number
RESOURCES_DIR = 'Duino-Coin AVR Miner ' + str(MINER_VER)

config = ConfigParser()

try:
    subprocess.call(['arduino-cli'], shell=True)
except Exception as e:
    print (e)
    print('arduino-cli is not installed. Please follow this tutorial https://siytek.com/arduino-cli-raspberry-pi/ and then try the script again, or visite https://arduino.github.io/arduino-cli/latest/installation/ and https://www.youtube.com/watch?v=1jMWsFER-Bc.')
    sys.exit()

try:
    config.read(RESOURCES_DIR + '/Settings.cfg')
    avrport = config['AVR Miner']['avrport']
    board = config['AVR Miner']['avrboard']
    import os
    BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
except Exception as e:
    print(f'Cannot get config: {e}')
    sys.exit()

try:
    if board == 'uno':
        script = 'arduino-cli compile --fqbn arduino:avr:uno ' + BASE_DIR + '/miner/Arduino_Code/Arduino_Code.ino'
    elif board == 'nano':
        script = 'arduino-cli compile --fqbn arduino:avr:nano ' + BASE_DIR + '/miner/Arduino_Code/Arduino_Code.ino'
    elif board == 'mega':
    	script = 'arduino-cli compile --fqbn arduino:avr:mega ' + BASE_DIR + '/miner/Arduino_Code/Arduino_Code.ino'
    elif board == 'due':
        script = 'arduino-cli compile --fqbn arduino:avr:due ' + BASE_DIR + '/miner/Arduino_Code/Arduino_Code.ino'
    else:
    	print('no board selected')
    subprocess.call(script, shell=True)
except Exception as e:
    print(f'Cannot compile: {e}')
    sys.exit()

ports = avrport.split(',')
for port in ports:
    try:
        if board == 'uno':
            upload = f'arduino-cli upload -p ' + port + ' --fqbn arduino:avr:uno ' + BASE_DIR + '/miner/Arduino_Code/Arduino_Code.ino'
        elif board == 'nano':
            upload = f'arduino-cli upload -p ' + port + ' --fqbn arduino:avr:nano ' + BASE_DIR + '/miner/Arduino_Code/Arduino_Code.ino'
        elif board == 'mega':
            upload = f'arduino-cli upload -p ' + port + ' --fqbn arduino:avr:mega ' + BASE_DIR + '/miner/Arduino_Code/Arduino_Code.ino'
        elif board == 'due':
            upload = f'arduino-cli upload -p ' + port + ' --fqbn arduino:avr:due ' + BASE_DIR + '/miner/Arduino_Due_Code/Arduino_Due_Code.ino'
        else:
            print('no board selected')
        subprocess.call(upload, shell=True)
        print(f'If no errors have been displayed, the code has been uploaded correctly to {port}')
    except Exception as e:
        print(f'Error uploading to {port}: {e}')
        sys.exit()