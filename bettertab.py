import datetime

path = 'data/'  # Chemin du dossier "data"

#lecture des donees
with open(path + 'output.json', 'r') as file:
    data = eval(file.read())

lastpercent = 1
lastdate = 'error'
lastdatepoupi = 'error'

#gestion de general info
with open(path + 'generalinfo.txt', 'w') as file:
    for entry in data:
        timestamp = entry[0]
        percentage = entry[1]
        date = datetime.datetime.fromtimestamp(timestamp / 1000).strftime('%H:%M %d/%m/%Y')
        percentage_formatted = '{:.2f}'.format(percentage)  # Formater le pourcentage avec deux décimales
        lastpercent = percentage_formatted
        lastdate = date
        line = f"date : {date} | pourcentage : {percentage_formatted}%\n"
        file.write(line)

#check de la derniere mise a jour pour ne pas dupliquer les donees
with open('poupi.txt', 'r') as file:
    lines = file.readlines()
    if lines:
        lastline = lines[-1]
        lastdatepoupi = lastline.split(' | ')[0].split(':')[1].strip()

#ecriture de la derniere info en date vers les .txt individuels
if (lastdate != lastdatepoupi)
    with open(path + 'poupi.txt', 'a') as file:
        line = f"date : {lastdate} | pourcentage : {lastpercent}%\n"
        file.write(line)
    with open(path + 'val.txt', 'a') as file:
        line = f"date : {lastdate} | pourcentage : {lastpercent}%\n"
        file.write(line)
    with open(path + 'vico.txt', 'a') as file:
        line = f"date : {lastdate} | pourcentage : {lastpercent}%\n"
        file.write(line)

