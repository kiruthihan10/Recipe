import pandas as pd
from numpy import array
f = pd.read_csv('ingredients v1.csv')
f = f["name"]
f.dropna()
print(f.head())
print(f.describe())
print(array(f)[-1])
print(array(f).shape)
line = ""
for ingredient in array(f):
    try:
        if "<>" in ingredient:
            print (True)
    except:
        print(ingredient)
