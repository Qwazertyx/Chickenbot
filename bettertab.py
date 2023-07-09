import datetime

with open('data/output.txt', 'r') as file:
    data = eval(file.read())

with open('data/generalinfo.txt', 'w') as file:
    for entry in data:
        timestamp = entry[0]
        percentage = entry[1]
        date = datetime.datetime.fromtimestamp(timestamp / 1000).strftime('%H:%M %d/%m/%Y')
        percentage_formatted = '{:.2f}'.format(percentage)  # Formater le pourcentage avec deux décimales
        line = f"date : {date} | pourcentage : {percentage_formatted}%\n"
        file.write(line)

