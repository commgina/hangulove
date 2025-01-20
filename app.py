from flask import Flask, render_template, request, jsonify
import json
import random


app = Flask(__name__)

with open('data/dictionary.json', 'r', encoding='utf-8') as file:
    vocabulario = json.load(file)

@app.route('/')
def index():
    return render_template('index.html')


@app.route('/get-word', methods=['GET'])
def get_word():
    palabra = random.choice(vocabulario)
    return jsonify(palabra)

@app.route('/check-word', methods=['POST'])
def check_word():
    data = request.json
    user_input = data.get("input")
    correct_word = data.get("correct_word")
    return jsonify({"correct": user_input == correct_word})

if __name__ == '__main__':
    app.run(debug=True)
