#!/usr/bin/env python3
##########################################
# Duino-Coin Python PC Miner (v2.5.6)
# https://github.com/revoxhere/duino-coin
# Distributed under MIT license
# © Duino-Coin Community 2019-2021
##########################################
# Import libraries
import sys
from configparser import ConfigParser
from datetime import datetime
from hashlib import sha1
from json import load as jsonload
from locale import LC_ALL, getdefaultlocale, getlocale, setlocale
from os import _exit, execl, mkdir
from os import name as osname
from platform import machine as osprocessor
from os import path, system
from os import system as ossystem
from pathlib import Path
from platform import system as plsystem
from re import sub
from signal import SIGINT, signal
from socket import socket
from statistics import mean
from subprocess import DEVNULL, Popen, check_call
from threading import Thread as thrThread
from time import ctime, sleep, strptime, time
from multiprocessing import Lock
from random import choice
import pip
import select
thread_lock = Lock()

def s_print(*a, **b):
    """Thread safe print function"""
    with thread_lock:
        print(*a, **b)

def install(package):
    try:
        pip.main(["install",  package])
    except AttributeError:
        check_call([sys.executable, '-m', 'pip', 'install', package])

    execl(sys.executable, sys.executable, *sys.argv)


def now():
    # Return datetime object
    return datetime.now()


try:
    # Check if cpuinfo is installed
    import cpuinfo
except ModuleNotFoundError:
    s_print(
        now().strftime("%H:%M:%S ")
        + "Cpuinfo is not installed. "
        + "Miner will try to install it. "
        + "If it fails, please manually install \"py-cpuinfo\"."
        + "\nIf you can\'t install it, use the Minimal-PC_Miner.")
    install("py-cpuinfo")


try:
    # Check if requests is installed
    import requests
except ModuleNotFoundError:
    s_print(
        now().strftime('%H:%M:%S ')
        + 'Requests is not installed. '
        + 'Miner will try to install it. '
        + 'If it fails, please manually install "requests" python3 package.'
        + '\nIf you can\'t install it, use the Minimal-PC_Miner.')
    install('requests')


try:
    # Check if colorama is installed
    from colorama import Back, Fore, Style, init
except ModuleNotFoundError:
    s_print(
        now().strftime("%H:%M:%S ")
        + "Colorama is not installed. "
        + "Miner will try to install it. "
        + "If it fails, please manually install \"colorama\"."
        + "\nIf you can\'t install it, use the Minimal-PC_Miner.")
    install("colorama")

try:
    # Check if pypresence is installed
    from pypresence import Presence
except ModuleNotFoundError:
    s_print(
        now().strftime("%H:%M:%S ")
        + "Pypresence is not installed. "
        + "Miner will try to install it. "
        + "If it fails, please manually install \"pypresence\"."
        + "\nIf you can\'t install it, use the Minimal-PC_Miner.")
    install("pypresence")

try:
    # Check if xxhash is installed
    import xxhash
    xxhash_enabled = True
except ModuleNotFoundError:
    s_print(
        now().strftime("%H:%M:%S ")
        + "Xxhash is not installed - "
        + "Xxhash support will be disabled")
    xxhash_enabled = False


# Global variables
MINER_VER = "2.56"  # Version number
NODE_ADDRESS = "server.duinocoin.com"
AVAILABLE_PORTS = [
    2813,  # PC (1)
    2814,  # PC (2)
    2815,   # PC (3)
    2812,  # Wallets, other miners
    2811  # Legacy
]
SOC_TIMEOUT = 45  # Socket timeout
PERIODIC_REPORT_TIME = 60
RESOURCES_DIR = "PCMiner_" + str(MINER_VER) + "_resources"
donatorrunning = False
debug = "n"
discord_presence = "y"
rig_identiier = "None"
requested_diff = "NET"
algorithm = "DUCO-S1"
config = ConfigParser()
donation_level = 0
thread = []
totalhashrate_mean = []
mining_start_time = time()

# Create resources folder if it doesn't exist
if not path.exists(RESOURCES_DIR):
    mkdir(RESOURCES_DIR)

# Check if languages file exists
if not Path(RESOURCES_DIR + "/langs.json").is_file():
    url = ("https://raw.githubusercontent.com/"
           + "revoxhere/"
           + "duino-coin/master/Resources/"
           + "PC_Miner_langs.json")
    r = requests.get(url)
    with open(RESOURCES_DIR + "/langs.json", "wb") as f:
        f.write(r.content)

# Load language file
with open(RESOURCES_DIR + "/langs.json", "r", encoding="utf8") as lang_file:
    lang_file = jsonload(lang_file)

# OS X invalid locale hack
if plsystem() == "Darwin":
    if getlocale()[0] is None:
        setlocale(LC_ALL, "en_US.UTF-8")

# Check if miner is configured, if it isn't, autodetect language
try:
    if not Path(RESOURCES_DIR + "/Miner_config.cfg").is_file():
        locale = getdefaultlocale()[0]
        if locale.startswith("es"):
            lang = "spanish"
        elif locale.startswith("pl"):
            lang = "polish"
        elif locale.startswith("fr"):
            lang = "french"
        elif locale.startswith("mt"):
            lang = "maltese"
        elif locale.startswith("ru"):
            lang = "russian"
        elif locale.startswith("de"):
            lang = "german"
        elif locale.startswith("tr"):
            lang = "turkish"
        elif locale.startswith("pr"):
            lang = "portugese"
        elif locale.startswith("it"):
            lang = "italian"
        elif locale.startswith("zh"):
            lang = "chinese_simplified"
        else:
            lang = "english"
    else:
        # Read language variable from configfile
        try:
            config.read(RESOURCES_DIR + "/Miner_config.cfg")
            lang = config["Duino-Coin-PC-Miner"]["language"]
        except Exception:
            # If it fails, fallback to english
            lang = "english"
except:
    lang = "english"

lang = "english"


def getString(string_name):
    # Get string form language file
    if string_name in lang_file[lang]:
        return lang_file[lang][string_name]
    elif string_name in lang_file["english"]:
        return lang_file["english"][string_name]
    else:
        return "String not found: " + string_name


def debug_output(text):
    # Debug output
    if debug == "y":
        s_print(now().strftime(Style.DIM + "%H:%M:%S.%f ") + "DEBUG: " + text)


def title(title):
    # Set window title
    if osname == "nt":
        # Windows systems
        system("title " + title)
    else:
        # Most standard terminals
        s_print("\33]0;" + title + "\a", end="")
        sys.stdout.flush()


def handler(signal_received, frame):
    # SIGINT handler
    if current_process().name == "MainProcess":
        s_print(
            "sys0",
            getString("sigint_detected")
            + getString("goodbye"),
            "warning")
    try:
        # Close previous socket connection (if any)
        socket.close()
    except Exception:
        pass
    _exit(0)


def calculate_uptime(start_time):
    uptime = time() - start_time
    if uptime <= 59:
        return str(round(uptime)) + " seconds"
    elif uptime == 60:
        return str(round(uptime // 60)) + " minute"
    elif uptime >= 60:
        return str(round(uptime // 60)) + " minutes"
    elif uptime == 3600:
        return str(round(uptime // 3600)) + " hour"
    elif uptime >= 3600:
        return str(round(uptime // 3600)) + " hours"


def get_prefix(diff: int):
    if diff >= 1000000000:
        diff = str(round(diff / 1000000000)) + "G"
    elif diff >= 1000000:
        diff = str(round(diff / 1000000)) + "M"
    elif diff >= 1000:
        diff = str(round(diff / 1000)) + "k"
    return str(diff)


# Enable signal handler
signal(SIGINT, handler)


def Greeting():
    # Greeting message
    global greeting
    s_print(Style.RESET_ALL)

    if requested_diff == "LOW":
        diffName = getString("low_diff_short")
    elif requested_diff == "MEDIUM":
        diffName = getString("medium_diff_short")
    else:
        diffName = getString("net_diff_short")

    current_hour = strptime(ctime(time())).tm_hour
    if current_hour < 12:
        greeting = getString("greeting_morning")
    elif current_hour == 12:
        greeting = getString("greeting_noon")
    elif current_hour > 12 and current_hour < 18:
        greeting = getString("greeting_afternoon")
    elif current_hour >= 18:
        greeting = getString("greeting_evening")
    else:
        greeting = getString("greeting_back")

    s_print(" - "
        + getString("banner")
        + " (v"
        + str(MINER_VER)
        + ") "
        + "2019-2021")

    s_print(" - "
        + "https://github.com/revoxhere/duino-coin")

    if lang != "english":
        s_print(" - "
            + lang.capitalize()
            + " translation: "
            + getString("translation_autor"))

    try:
        s_print(" - "
            + "CPU: "
            + str(threadcount)
            + "x "
            + str(cpu["brand_raw"]))
    except Exception as e:
        debug_output("Error displaying CPU message: " + str(e))

    if osname == "nt" or osname == "posix":
        s_print(" - "
            + getString("donation_level")
            + str(donation_level))

    s_print(" - "
        + getString("algorithm")
        + algorithm
        + " - "
        + diffName)

    if rig_identiier != "None":
        s_print(" - "
            + getString("rig_identifier")
            + rig_identiier)

    s_print(" - "
        + str(greeting)
        + ", "
        + str(username)
        + "!\n")

    if int(donation_level) > 0:
        if osname == "nt":
            if not Path(RESOURCES_DIR + "/Donate_executable.exe").is_file():
                url = ("https://github.com/revoxhere/"
                       + "duino-coin/blob/useful-tools/Donate_executables/"
                       + "DonateExecutableWindows.exe?raw=true")
                r = requests.get(url)
                with open(RESOURCES_DIR + "/Donate_executable.exe", "wb") as f:
                    f.write(r.content)
        elif osname == "posix":
            if osprocessor() == "aarch64":
                url = ("https://github.com/revoxhere/"
                       + "duino-coin/blob/useful-tools/Donate_executables/"
                       + "DonateExecutableAARCH64?raw=true")
            elif osprocessor() == "armv7l":
                url = ("https://github.com/revoxhere/"
                       + "duino-coin/blob/useful-tools/Donate_executables/"
                       + "DonateExecutableAARCH32?raw=true")
            else:
                url = ("https://github.com/revoxhere/"
                       + "duino-coin/blob/useful-tools/Donate_executables/"
                       + "DonateExecutableLinux?raw=true")
            if not Path(RESOURCES_DIR + "/Donate_executable").is_file():
                r = requests.get(url)
                with open(RESOURCES_DIR + "/Donate_executable", "wb") as f:
                    f.write(r.content)


def loadConfig():
    # Config loading section
    global username
    global efficiency
    global donation_level
    global debug
    global threadcount
    global requested_diff
    global rig_identiier
    global lang
    global algorithm
    global SOC_TIMEOUT
    global discord_presence
    global PERIODIC_REPORT_TIME

    # Initial configuration
    if not Path(RESOURCES_DIR + "/Miner_config.cfg").is_file():
        s_print(
            Style.BRIGHT
            + getString("basic_config_tool")
            + RESOURCES_DIR
            + getString("edit_config_file_warning"))
        s_print(
            Style.RESET_ALL
            + getString("dont_have_account")
            + Fore.YELLOW
            + getString("wallet")
            + Fore.RESET
            + getString("register_warning"))

        username = input(
            Style.RESET_ALL
            + Fore.YELLOW
            + getString("ask_username")
            + Fore.RESET
            + Style.BRIGHT)

        if xxhash_enabled:
            s_print(
                Style.RESET_ALL
                + Style.BRIGHT
                + Fore.RESET
                + "1"
                + Style.NORMAL
                + " - DUCO-S1 ("
                + getString("recommended")
                + ")")
            s_print(
                Style.RESET_ALL
                + Style.BRIGHT
                + Fore.RESET
                + "2"
                + Style.NORMAL
                + " - XXHASH")
            algorithm = input(
                Style.RESET_ALL
                + Fore.YELLOW
                + getString("ask_algorithm")
                + Fore.RESET
                + Style.BRIGHT)
        else:
            algorithm = "1"

        efficiency = input(
            Style.RESET_ALL
            + Fore.YELLOW
            + getString("ask_intensity")
            + Fore.RESET
            + Style.BRIGHT)

        threadcount = input(
            Style.RESET_ALL
            + Fore.YELLOW
            + getString("ask_threads")
            + str(cpu_count())
            + "): "
            + Fore.RESET
            + Style.BRIGHT)

        s_print(
            Style.RESET_ALL
            + Style.BRIGHT
            + Fore.RESET
            + "1"
            + Style.NORMAL
            + " - "
            + getString("low_diff"))
        s_print(
            Style.RESET_ALL
            + Style.BRIGHT
            + Fore.RESET
            + "2"
            + Style.NORMAL
            + " - "
            + getString("medium_diff"))
        s_print(
            Style.RESET_ALL
            + Style.BRIGHT
            + Fore.RESET
            + "3"
            + Style.NORMAL
            + " - "
            + getString("net_diff"))

        requested_diff = input(
            Style.RESET_ALL
            + Fore.YELLOW
            + getString("ask_difficulty")
            + Fore.RESET
            + Style.BRIGHT)

        rig_identiier = input(
            Style.RESET_ALL
            + Fore.YELLOW
            + getString("ask_rig_identifier")
            + Fore.RESET
            + Style.BRIGHT)

        if rig_identiier == "y" or rig_identiier == "Y":
            rig_identiier = input(
                Style.RESET_ALL
                + Fore.YELLOW
                + getString("ask_rig_name")
                + Fore.RESET
                + Style.BRIGHT)
        else:
            rig_identiier = "None"

        donation_level = "0"
        if osname == "nt" or osname == "posix":
            donation_level = input(
                Style.RESET_ALL
                + Fore.YELLOW
                + getString("ask_donation_level")
                + Fore.RESET
                + Style.BRIGHT)

        # Check wheter efficiency is correct
        efficiency = sub(r"\D", "", efficiency)
        if efficiency == "":
            efficiency = 95
        elif float(efficiency) > int(100):
            efficiency = 100
        elif float(efficiency) < int(1):
            efficiency = 1

        # Check wheter threadcount is correct
        threadcount = sub(r"\D", "", threadcount)
        if threadcount == "":
            threadcount = cpu_count()
        elif int(threadcount) > int(8):
            threadcount = 8
            s_print(
                Style.RESET_ALL
                + Style.BRIGHT
                + getString("max_threads_notice"))
        elif int(threadcount) < int(1):
            threadcount = 1

        # Check wheter algo setting is correct
        if algorithm == "2":
            algorithm = "XXHASH"
        else:
            algorithm = "DUCO-S1"

        # Check wheter diff setting is correct
        if requested_diff == "1":
            requested_diff = "LOW"
        elif requested_diff == "2":
            requested_diff = "MEDIUM"
        else:
            requested_diff = "MEDIUM"

        # Check wheter donation_level is correct
        donation_level = sub(r"\D", "", donation_level)
        if donation_level == "":
            donation_level = 1
        elif float(donation_level) > int(5):
            donation_level = 5
        elif float(donation_level) < int(0):
            donation_level = 0

        # Format data
        config["Duino-Coin-PC-Miner"] = {
            "username":         username,
            "efficiency":       efficiency,
            "threads":          threadcount,
            "requested_diff":   requested_diff,
            "donate":           donation_level,
            "identifier":       rig_identiier,
            "algorithm":        algorithm,
            "language":         lang,
            "debug":            "n",
            "soc_timeout":      45,
            "periodic_report":  60,
            "discord_presence": "y"
        }

        with open(RESOURCES_DIR + "/Miner_config.cfg", "w") as configfile:
            config.write(configfile)
            s_print(Style.RESET_ALL + getString("config_saved"))
    else:
        # If config already exists, load data from it
        config.read(RESOURCES_DIR + "/Miner_config.cfg")
        username = config["Duino-Coin-PC-Miner"]["username"]
        efficiency = config["Duino-Coin-PC-Miner"]["efficiency"]
        threadcount = config["Duino-Coin-PC-Miner"]["threads"]
        requested_diff = config["Duino-Coin-PC-Miner"]["requested_diff"]
        donation_level = config["Duino-Coin-PC-Miner"]["donate"]
        algorithm = config["Duino-Coin-PC-Miner"]["algorithm"]
        rig_identiier = config["Duino-Coin-PC-Miner"]["identifier"]
        debug = config["Duino-Coin-PC-Miner"]["debug"]
        SOC_TIMEOUT = int(config["Duino-Coin-PC-Miner"]["soc_timeout"])
        discord_presence = config["Duino-Coin-PC-Miner"]["discord_presence"]
        PERIODIC_REPORT_TIME = int(
            config["Duino-Coin-PC-Miner"]["periodic_report"])

    efficiency = (100 - float(efficiency)) * 0.01


def Donate():
    global donation_level
    global donatorrunning
    global donateExecutable

    if osname == "nt":
        cmd = (
            "cd "
            + RESOURCES_DIR
            + "& Donate_executable.exe "
            + "-o stratum+tcp://xmg.minerclaim.net:3333 "
            + "-u revox.donate "
            + "-p x -s 4 -e ")

    elif osname == "posix":
        cmd = (
            "cd "
            + RESOURCES_DIR
            + "&& chmod +x Donate_executable "
            + "&& ./Donate_executable "
            + "-o stratum+tcp://xmg.minerclaim.net:3333 "
            + "-u revox.donate "
            + "-p x -s 4 -e ")

    if int(donation_level) <= 0:
        s_print(
            "sys0",
            + getString("free_network_warning")
            + getString("donate_warning")
            + "https://duinocoin.com/donate"
            + getString("learn_more_donate"),
            "warning")
        sleep(10)

    elif donatorrunning == False:
        if int(donation_level) == 5:
            cmd += "80"
        elif int(donation_level) == 4:
            cmd += "60"
        elif int(donation_level) == 3:
            cmd += "40"
        elif int(donation_level) == 2:
            cmd += "20"
        elif int(donation_level) == 1:
            cmd += "10"
        if int(donation_level) > 0:
            debug_output(getString("starting_donation"))
            donatorrunning = True
            # Launch CMD as subprocess
            donateExecutable = Popen(
                cmd, shell=True, stderr=DEVNULL)
            s_print(
                "sys0",
                getString("thanks_donation"),
                "warning")


def ducos1(
        lastBlockHash,
        expectedHash,
        difficulty,
        efficiency):
    # DUCO-S1 algorithm
    # Measure starting time
    timeStart = time()
    base_hash = sha1(str(lastBlockHash).encode('ascii'))
    temp_hash = None
    # Loop from 1 too 100*diff
    for ducos1res in range(100 * int(difficulty) + 1):
        # If efficiency lower than 100% sleep to use less CPU
        if ducos1res % 1000000 == 0 and float(100 - efficiency * 100) < 100:
            sleep(float(efficiency))
        # Generate hash
        temp_hash = base_hash.copy()
        temp_hash.update(str(ducos1res).encode('ascii'))
        ducos1 = temp_hash.hexdigest()
        # Check if result was found
        if ducos1 == expectedHash:
            # Measure finish time
            timeStop = time()
            # Calculate hashrate
            timeDelta = timeStop - timeStart
            hashrate = ducos1res / timeDelta
            return [ducos1res, hashrate]


def ducos1xxh(
        lastBlockHash,
        expectedHash,
        difficulty,
        efficiency):
    # XXHASH algorithm
    # Measure starting time
    timeStart = time()
    # Loop from 1 too 100*diff
    for ducos1xxres in range(100 * int(difficulty) + 1):
        # If efficiency lower than 100% sleep to use less CPU
        if ducos1xxres % 1000000 == 0 and float(100 - efficiency * 100) < 100:
            sleep(float(efficiency))
        # Generate hash
        ducos1xx = xxhash.xxh64(
            str(lastBlockHash) + str(ducos1xxres), seed=2811)
        ducos1xx = ducos1xx.hexdigest()
        # Check if result was found
        if ducos1xx == expectedHash:
            # Measure finish time
            timeStop = time()
            # Calculate hashrate
            timeDelta = timeStop - timeStart
            hashrate = ducos1xxres / timeDelta
            return [ducos1xxres, hashrate]


def Thread(
        threadid: int,
        accepted: int,
        rejected: int,
        requested_diff: str,
        khashcount: int,
        username: str,
        efficiency: int,
        rig_identiier: str,
        algorithm: str,
        hashrates_list,
        totalhashrate_mean,
        NODE_ADDRESS: str,
        NODE_PORT: int):
    # Mining section for every thread
    start_time = time()
    report_shares = 0
    while True:
        while True:
            try:
                retry_counter = 0
                while True:
                    try:
                        if retry_counter >= 3:
                            debug_output(
                                'Error connecting after 3 retries, '
                                + 'fetching new node IP')
                            NODE_ADDRESS, NODE_PORT = fetch_pools()

                        debug_output('Connecting to node ' +
                                     str(NODE_ADDRESS) + ":" + str(NODE_PORT))
                        soc = socket()
                        soc.connect((str(NODE_ADDRESS), int(NODE_PORT)))
                        soc.settimeout(SOC_TIMEOUT)

                        server_version = soc.recv(100).decode()
                        if server_version:
                            break
                    except Exception as e:
                        retry_counter += 1
                        s_print("net0",
                                     " Error connecting to mining node: "
                                     + str(e)
                                     + ", retrying in 5s",
                                     "error")
                        sleep(5)

                if threadid == 0:
                    soc.send(bytes("MOTD", encoding="utf8"))
                    motd = soc.recv(1024).decode().rstrip("\n")

                    if "\n" in motd:
                        motd = motd.replace("\n", "\n\t\t")

                    s_print("net" + str(threadid),
                                 " MOTD: "
                                 + str(motd),
                                 "success")

                if threadid == 0:
                    if float(server_version) <= float(MINER_VER):
                        # Miner is up-to-date
                        s_print(
                            "net"
                            + str(threadid),
                            getString("connected")
                            + getString("connected_server")
                            + str(server_version)
                            + ", node: "
                            + str(NODE_ADDRESS)
                            + ":"
                            + str(NODE_PORT)
                            + ")",
                            "success")
                    else:
                        # Miner is outdated
                        s_print(
                            "sys"
                            + str(threadid),
                            getString("outdated_miner")
                            + MINER_VER
                            + ") -"
                            + getString("server_is_on_version")
                            + server_version
                            + getString("update_warning"),
                            "warning")
                        sleep(5)
                break

            except Exception as e:
                # Socket connection error
                s_print(
                    "net"
                    + str(threadid),
                    getString("connecting_error")
                    + " (net err: "
                    + str(e)
                    + ")",
                    "error")
                debug_output("Connection error: " + str(e))
                sleep(10)

        if algorithm == "XXHASH":
            using_algo = getString("using_algo_xxh")
        else:
            using_algo = getString("using_algo")

        s_print(
            "sys"
            + str(threadid),
            getString("mining_thread")
            + str(threadid)
            + getString("mining_thread_starting")
            + using_algo
            + str(int(100 - efficiency * 100))
            + "% "
            + getString("efficiency"),
            "success")

        # Mining section
        while True:
            try:
                while True:
                    # Ask the server for job
                    if algorithm == "XXHASH":
                        soc.sendall(bytes(
                            "JOBXX,"
                            + str(username)
                            + ","
                            + str(requested_diff),
                            encoding="utf8"))
                    else:
                        soc.sendall(bytes(
                            "JOB,"
                            + str(username)
                            + ","
                            + str(requested_diff),
                            encoding="utf8"))

                    # Retrieve work
                    job = soc.recv(128).decode().rstrip("\n")
                    job = job.split(",")
                    debug_output("Received: " + str(job))

                    try:
                        diff = int(job[2])
                        debug_output(str(threadid) +
                                     "Correct job received")
                        break
                    except:
                        s_print("cpu" + str(threadid),
                                     " Node message: "
                                     + job[1],
                                     "warning")
                        sleep(3)

                while True:
                    computetimeStart = time()
                    if algorithm == "XXHASH":
                        algo_back_color = Back.CYAN
                        result = ducos1xxh(job[0], job[1], diff, efficiency)
                    else:
                        algo_back_color = Back.YELLOW
                        result = ducos1(job[0], job[1], diff, efficiency)
                    computetimeStop = time()
                    computetime = computetimeStop - computetimeStart

                    debug_output("Thread "
                                 + str(threadid)
                                 + ": result found: "
                                 + str(result[0]))

                    # Convert to kH/s
                    threadhashcount = int(result[1] / 1000)
                    # Add this thread's hash counter
                    # to the global hashrate counter
                    hashrates_list[threadid] = threadhashcount
                    # Calculate total hashrate of all thrads
                    sharehashrate = 0
                    for thread in hashrates_list.keys():
                        sharehashrate += hashrates_list[thread]
                    totalhashrate_mean.append(sharehashrate)
                    # Get average from the last 20 hashrate measurements
                    totalhashrate = mean(totalhashrate_mean[-20:])

                    while True:
                        # Send result of hashing algorithm to the server
                        soc.sendall(bytes(
                            str(result[0])
                            + ","
                            + str(result[1])
                            + ","
                            + "Official PC Miner ("
                            + str(algorithm)
                            + ") v"
                            + str(MINER_VER)
                            + ","
                            + str(rig_identiier),
                            encoding="utf8"))

                        responsetimetart = now()
                        feedback = soc.recv(64).decode().rstrip("\n")
                        responsetimestop = now()

                        ping = int((responsetimestop - responsetimetart
                                    ).microseconds / 1000)

                        debug_output("Thread "
                                     + str(threadid)
                                     + ": Feedback received: "
                                     + str(feedback)
                                     + " Ping: "
                                     + str(ping))

                        if totalhashrate > 800:
                            # Format hashcount to MH/s
                            formattedhashcount = str(
                                "%03.2f" % round(totalhashrate / 1000, 2)
                                + " MH/s")
                        elif totalhashrate > 100:
                            # Format for >100 kH/s
                            formattedhashcount = str(
                                "%03.0f" % float(totalhashrate)
                                + " kH/s")
                        else:
                            # Format for small hashrates
                            formattedhashcount = str(
                                "%02.1f" % float(totalhashrate)
                                + " kH/s")

                        if (totalhashrate > 1500
                                and accepted.value % 50 == 0):
                            s_print("sys0",
                                         " " +
                                         getString("max_hashrate_notice"),
                                         "warning")

                        diff = get_prefix(diff)

                        if feedback == "GOOD":
                            # If result was correct
                            accepted.value += 1
                            title(
                                getString("duco_python_miner")
                                + str(MINER_VER)
                                + ") - "
                                + str(accepted.value)
                                + "/"
                                + str(accepted.value + rejected.value)
                                + getString("accepted_shares"))
                            with thread_lock:
                                s_print(now().strftime("%H:%M:%S ")
                                    + " cpu"
                                    + str(threadid)
                                    + " "
                                    + getString("accepted")
                                    + str(int(accepted.value))
                                    + "/"
                                    + str(int(accepted.value + rejected.value))
                                    + " ("
                                    + str(int(
                                        (accepted.value
                                            / (accepted.value + rejected.value)
                                         * 100)))
                                    + "%)"
                                    + " - "
                                    + str("%05.2f" % computetime)
                                    + "s"
                                    + " - "
                                    + str(formattedhashcount)
                                    + " diff "
                                    + str(diff)
                                    + " - "
                                    + "ping "
                                    + str("%02.0f" % int(ping))
                                    + "ms")

                        elif feedback == "BLOCK":
                            # If block was found
                            accepted.value += 1
                            title(
                                getString("duco_python_miner")
                                + str(MINER_VER)
                                + ") - "
                                + str(accepted.value)
                                + "/"
                                + str(accepted.value + rejected.value)
                                + getString("accepted_shares"))
                            with thread_lock:
                                s_print(now().strftime("%H:%M:%S ")
                                    + " cpu"
                                    + str(threadid)
                                    + " "
                                    + getString("block_found")
                                    + str(accepted.value)
                                    + "/"
                                    + str(accepted.value + rejected.value)
                                    + " ("
                                    + str(int(
                                        (accepted.value
                                            / (accepted.value + rejected.value)
                                         * 100)))
                                    + "%)"
                                    + " - "
                                    + str("%05.2f" % float(computetime))
                                    + "s"
                                    + " - "
                                    + str(formattedhashcount)
                                    + " diff "
                                    + str(diff)
                                    + " - "
                                    + "ping "
                                    + str("%02.0f" % int(ping))
                                    + "ms")

                        else:
                            # If result was incorrect
                            rejected.value += 1
                            title(
                                getString("duco_python_miner")
                                + str(MINER_VER)
                                + ") - "
                                + str(accepted.value)
                                + "/"
                                + str(accepted.value + rejected.value)
                                + getString("accepted_shares"))
                            with thread_lock:
                                s_print(now().strftime(Style.DIM + "%H:%M:%S ")
                                    + " cpu"
                                    + str(threadid)
                                    + " "
                                    + getString("rejected")
                                    + str(accepted.value)
                                    + "/"
                                    + str(accepted.value + rejected.value)
                                    + " ("
                                    + str(int(
                                        (accepted.value
                                            / (accepted.value + rejected.value)
                                         * 100)))
                                    + "%)"
                                    + " - "
                                    + str("%05.2f" % float(computetime))
                                    + "s"
                                    + " - "
                                    + str(formattedhashcount)
                                    + " diff "
                                    + str(diff)
                                    + " - "
                                    + "ping "
                                    + str("%02.0f" % int(ping))
                                    + "ms")

                        end_time = time()
                        elapsed_time = end_time - start_time
                        if (threadid == 0
                                and elapsed_time >= PERIODIC_REPORT_TIME):
                            report_shares = accepted.value - report_shares
                            uptime = calculate_uptime(mining_start_time)

                            periodic_report(start_time,
                                            end_time,
                                            report_shares,
                                            totalhashrate,
                                            uptime)
                            start_time = time()
                        break
                    break
            except Exception as e:
                s_print(
                    "net"
                    + str(threadid),
                    getString("error_while_mining")
                    + " (mining err: "
                    + str(e)
                    + ")",
                    "error")
                debug_output("Error while mining: " + str(e))
                sys.exit([arg])
                break


def periodic_report(start_time,
                    end_time,
                    shares,
                    hashrate,
                    uptime):
    seconds = round(end_time - start_time)
    s_print("sys0",
                 " Periodic mining report (BETA): "
                 + "\n\t\t- During the last "
                 + str(seconds)
                 + " seconds"
                 + "\n\t\t- You've mined "
                 + str(shares)
                 + " shares ("
                 + str(round(shares/seconds, 1))
                 + " shares/s)"
                 + "\n\t\t- With the hashrate of "
                 + str(int(hashrate)) + " kH/s"
                 + "\n\t\t- In this time period, you've solved "
                 + str(int(hashrate*seconds))
                 + " hashes"
                 + "\n\t\t- Total miner uptime: "
                 + str(uptime), "success")


def pretty_print(message_type, message, state):
    # Prints colored output messages
    # Usb/net/sys background
    if message_type.startswith("net"):
        background = Back.BLUE
    elif message_type.startswith("cpu"):
        background = Back.YELLOW
    if message_type.startswith("sys"):
        background = Back.GREEN

    # Text color
    if state == "success":
        color = Fore.GREEN
    elif state == "warning":
        color = Fore.YELLOW
    else:
        color = Fore.RED

    with thread_lock:
        s_print(Style.RESET_ALL
              + Fore.WHITE
              + now().strftime(Style.DIM + "%H:%M:%S ")
              + Style.BRIGHT
              + background
              + " "
              + message_type
              + " "
              + Back.RESET
              + color
              + Style.BRIGHT
              + message
              + Style.NORMAL
              + Fore.RESET)


def initRichPresence():
    # Initialize Discord rich presence
    global RPC
    try:
        RPC = Presence(808045598447632384)
        RPC.connect()
        debug_output("Discord rich presence initialized")
    except Exception as e:
        # Discord not launched
        debug_output("Error launching Discord RPC thread: " + str(e))


def updateRichPresence():
    # Update rich presence status
    startTime = int(time())
    while True:
        try:
            # Calculate average total hashrate with prefix
            totalhashrate = mean(totalhashrate_mean[-20:])
            if totalhashrate > 800:
                totalhashrate = str(round(totalhashrate / 1000, 2)) + " MH/s"
            else:
                totalhashrate = str(round(totalhashrate, 1)) + " kH/s"

            RPC.update(
                details="Hashrate: " + str(totalhashrate),
                start=startTime,
                state="Acc. shares: "
                + str(accepted.value)
                + "/"
                + str(rejected.value + accepted.value),
                large_image="ducol",
                large_text="Duino-Coin, "
                + "a coin that can be mined with almost everything, "
                + "including AVR boards",
                buttons=[
                    {"label": "Learn more",
                     "url": "https://duinocoin.com"},
                    {"label": "Discord Server",
                     "url": "https://discord.gg/k48Ht5y"}])
            debug_output("Rich presence updated")
        except Exception as e:
            # Discord not launched
            debug_output("Error launching Discord RPC thread: " + str(e))
        sleep(15)  # 15 seconds to respect Discord rate limit


def get_fastest_connection(server_ip: str):
    connection_pool = []
    available_connections = []

    for i in range(len(AVAILABLE_PORTS)):
        connection_pool.append(socket())
        connection_pool[i].setblocking(0)
        try:
            connection_pool[i].connect((server_ip,
                                        AVAILABLE_PORTS[i]))
            connection_pool[i].settimeout(SOC_TIMEOUT)
        except BlockingIOError as e:
            pass

    ready_connections, _, __ = select.select(connection_pool, [], [])

    while True:
        for connection in ready_connections:
            try:
                server_version = connection.recv(5).decode()
            except:
                continue
            if server_version == b'':
                continue

            available_connections.append(connection)
            connection.send(b'PING')

        ready_connections, _, __ = select.select(available_connections, [], [])
        ready_connections[0].recv(4)

        return ready_connections[0].getpeername()[1]


def fetch_pools():
    while True:
        s_print("net0",
            " "
            + getString("connection_search")
            + "...",
            "warning")

        try:
            response = requests.get(
                "https://server.duinocoin.com/getPool"
            ).json()

            s_print("net0",
                         " Retrieved mining node: "
                         + str(response["name"]),
                         "success")

            NODE_ADDRESS = response["ip"]
            NODE_PORT = response["port"]

            return NODE_ADDRESS, NODE_PORT
        except Exception as e:
            s_print("net0",
                         " Error retrieving mining node: "
                         + str(e)
                         + ", retrying in 15s",
                         "error")
            sleep(15)


if __name__ == "__main__":
    from multiprocessing import freeze_support
    freeze_support()
    cpu = cpuinfo.get_cpu_info()
    title(getString("duco_python_miner") + str(MINER_VER) + ")")

    if osname == "nt":
        # Unicode fix for windows
        ossystem("chcp 65001")

    # Colorama
    init(autoreset=True)

    try:
        from multiprocessing import (
            Manager,
            Process,
            Value,
            cpu_count,
            current_process
        )
        manager = Manager()
        # Multiprocessing globals
        khashcount = Value("i", 0)
        accepted = Value("i", 0)
        rejected = Value("i", 0)
        hashrates_list = manager.dict()
        totalhashrate_mean = manager.list()
    except Exception as e:
        s_print(
            "sys0",
            " Multiprocessing is not available. "
            + "Please check permissions and/or your python installation. "
            + "Exiting in 10s.",
            "error")
        sleep(10)
        _exit(1)

    try:
        # Load config file or create new one
        loadConfig()
        debug_output("Config file loaded")
    except Exception as e:
        s_print(
            "sys0",
            getString("load_config_error")
            + RESOURCES_DIR
            + getString("load_config_error_warning")
            + " (config load err: "
            + str(e)
            + ")",
            "error")
        debug_output("Error reading configfile: " + str(e))
        sleep(10)
        _exit(1)

    try:
        # Display greeting message
        Greeting()
        debug_output("Greeting displayed")
    except Exception as e:
        s_print(
            "sys0",
            "Error displaying greeting message"
            + Style.NORMAL
            + Fore.RESET
            + " (greeting err: "
            + str(e)
            + ")",
            "error")
        debug_output("Error displaying greeting message: " + str(e))

    try:
        # Start donation thread
        Donate()
    except Exception as e:
        debug_output("Error launching donation thread: " + str(e))

    try:
        NODE_ADDRESS, NODE_PORT = fetch_pools()
    except:
        NODE_ADDRESS = "server.duinocoin.com"
        NODE_PORT = 2813
        debug_output("Using default server port and address")

    try:
        for x in range(int(threadcount)):
            # Launch duco mining threads
            thread.append(x)
            thread[x] = Process(
                target=Thread,
                args=(
                    x,
                    accepted,
                    rejected,
                    requested_diff,
                    khashcount,
                    username,
                    efficiency,
                    rig_identiier,
                    algorithm,
                    hashrates_list,
                    totalhashrate_mean,
                    NODE_ADDRESS,
                    NODE_PORT))
            thread[x].start()
            if x > 4 and x % 4 == 0:
                # Don't launch burst of threads
                # to not get banned
                sleep(5)
            else:
                sleep(0.1)

    except Exception as e:
        s_print(
            "sys0",
            "Error launching CPU thread(s)"
            + Style.NORMAL
            + Fore.RESET
            + " (cpu launch err: "
            + str(e)
            + ")",
            "error")
        debug_output("Error launching CPU thead(s): " + str(e))

    if discord_presence == "y":
        try:
            # Discord rich presence threads
            initRichPresence()
            thrThread(
                target=updateRichPresence).start()
        except Exception as e:
            debug_output("Error launching Discord RPC thead: " + str(e))
