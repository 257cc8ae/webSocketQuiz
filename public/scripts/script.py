import csv
import json
results = {
    "level1": [],
    "level2": [],
    "level3": [],
    "level4": [],
    "level5": [],
}

with open('quiz.csv') as f:
    reader = csv.reader(f)
    for row in reader:
        if row[0] != "問題文":
            results[f"level{row[-1]}"].append({"question":row[0],"answer":row[1],"selects":[row[2],row[3],row[4]]})

r =  json.dumps(results, ensure_ascii=False)

with open("question.js", encoding='utf-8', mode='w') as f:
    f.write(f"let questions = {r}")
