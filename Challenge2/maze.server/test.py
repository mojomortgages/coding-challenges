import requests

url = 'http://localhost:3002/10/10/jacob/'

move = requests.get(url + 'start')

# while "completed" not in move.json()["error"]:

for x in range(5):
    if move.json()["tile"][3] == 1:
        move = requests.get(url + 'left')
    elif move.json()["tile"][0] == 1:
        move = requests.get(url + 'up')
    elif move.json()["tile"][1] == 1:
        move = requests.get(url + 'right')
    else:
        move = requests.get(url + 'down')

'''
move1 = requests.get(url + 'up')
if "completed" in move1.json()["error"]:
    print("Completed")
else:
    print("not yet")
'''

# resp = requests.get(url + 'down')
# data = resp.json()  # Check the JSON Response Content documentation below

print(move.json()["tile"])
