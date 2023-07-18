import datetime
import json

path = 'Chickenbot/data/'

import time

def add_last_data(lastData: int):
    totalData:list[str, str] = json.load(open("Chickenbot/data/output.json", "r"))
    totalData.append([time.time(), lastData])
    json.dump(totalData, open("Chickenbot/data/output.json", "w"))

#lecture des donees
with open(path + 'output.json', 'r') as file:
    output_data = eval(file.read())

lastpercent = 1
lastdate = 'error'
lastdatepoupi = 'error'
data = json.load(open("cryptoBot/walletData.json", "r"))
totalpartuser = data["Totalpartusers"]
wallet = data["ActualWallet"]
lastpercentage = data["LastMovement"]
add_last_data(lastpercentage)

#gestion de general info
with open(path + 'generalinfo.txt', 'w') as file:
    for entry in output_data:
        timestamp = entry[0]
        percentage = entry[1]
        date = datetime.datetime.fromtimestamp(timestamp).strftime('%H:%M %d/%m/%Y')
        percentage_formatted = '{:.2f}'.format(percentage)  # Formater le pourcentage avec deux décimales
        lastpercent = percentage_formatted
        lastdate = date
        line = f"date : {date} | % : {percentage_formatted}% | value : {wallet}$ \n"
        file.write(line)

#check de la derniere mise a jour pour ne pas dupliquer les donees
with open(path + 'poupi.txt', 'r') as file:
    lines = file.readlines()
    if lines:
        lastline = lines[-1]
        lastdatepoupi = lastline.split(' | ')[0].split(':')[1].strip()

#ecriture de la derniere info en date vers les .txt individuels
users = data["Users"]
for user in users :
    name = user["name"]
    value = user["value"]
    if lastdate != lastdatepoupi:
        open(path + name + ".txt", 'w')
        with open(path + name + ".txt", 'a') as file:
            indivwallet = value / totalpartuser * wallet
            line = f"date : {lastdate} | % : {lastpercent}% | value : {indivwallet} \n"
            file.write(line)
