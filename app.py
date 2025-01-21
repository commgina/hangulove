from flask import Flask, render_template, request, jsonify
import json
import random

app = Flask(__name__)

# Cargar el vocabulario desde el archivo JSON
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

@app.route('/quiz-espanol', methods=['GET'])
def quiz_espanol():
    return render_template('quizespanol.html')

@app.route('/quiz-coreano', methods=['GET'])
def quiz_coreano():
    return render_template('quizcoreano.html')

@app.route('/about', methods=['GET'])
def about():
    return render_template('about.html')

# Ruta única para obtener palabras para el quiz, dependiendo del tipo de quiz (coreano o español)
@app.route('/get-quiz-word', methods=['GET'])
def get_quiz_word():
    quiz_type = request.args.get('type')  # Tipo de quiz (coreano o español)
    palabra = random.choice(vocabulario)  # Elegir una palabra aleatoria del vocabulario
    
    # Devolver la palabra adecuada dependiendo del tipo de quiz
    if quiz_type == 'coreano':
        return jsonify({
            'korean': palabra['korean'],  # Palabra en coreano
            'spanish': palabra['spanish']  # Traducción al español (para verificación)
        })
    elif quiz_type == 'espanol':
        return jsonify({
            'korean': palabra['korean'],  # Palabra en coreano
            'spanish': palabra['spanish']  # Traducción al español
        })
    else:
        return jsonify({'error': 'Tipo de quiz no válido'}), 400

if __name__ == '__main__':
    app.run(debug=True)
