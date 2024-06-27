import spacy
from flask import Flask, request, jsonify, render_template

app = Flask(__name__, static_url_path='', static_folder='static')
nlp = spacy.load('en_core_web_md')

# Routes
@app.route('/')
def index():
    return render_template('index.html')

@app.route('/api/process_text', methods=['POST'])
def process_text():
    data = request.get_json()
    text = data['text']
    # Add a random word to the input text
    random_word = "random"  # You can replace this with your logic to generate a random word
    doc = nlp(text + " " + random_word)

    tokens = list(doc)

    results = []
    for token in tokens:
        results.append({
            'text': token.text,
            'has_vector': token.has_vector,
            'vector_norm': float(token.vector_norm),
            'is_oov': token.is_oov
        })

    token1, token2 = tokens[0], tokens[1]

    print(token1)
    #check if word in database
    if token1.is_oov:
        return jsonify({'error': 'Word not found'})
    else:
        similarity = token1.similarity(token2)
        return jsonify({'text': text, 'similarity': similarity})

if __name__ == '__main__':
    app.run(debug=True)