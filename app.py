import pandas as pd
import numpy as np
from flask import Flask, request, jsonify
import tensorflow as tf
from tensorflow.keras.preprocessing.text import Tokenizer
from tensorflow.keras.preprocessing.sequence import pad_sequences
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import Embedding, LSTM, Dense


# Load dataset (CSV should be in the same folder as this file)
data = pd.read_csv('Disease,Symptoms,Ayurvedic Treatment.csv')

training_sentences = data['Symptoms'].astype(str).tolist()
training_labels = data['Disease'].astype(str).tolist()


tokenizer = Tokenizer(num_words=10000, oov_token="<OOV>")
tokenizer.fit_on_texts(training_sentences)
word_index = tokenizer.word_index

training_sequences = tokenizer.texts_to_sequences(training_sentences)
max_sequence_len = max([len(x) for x in training_sequences]) if training_sequences else 1
padded = pad_sequences(training_sequences, maxlen=max_sequence_len, padding='post')


label_tokenizer = Tokenizer()
label_tokenizer.fit_on_texts(training_labels)
label_word_index = label_tokenizer.word_index
training_label_seq = label_tokenizer.texts_to_sequences(training_labels)
training_label_seq = np.array([item[0] for item in training_label_seq]) if len(training_label_seq) > 0 else np.array([])


# Build a simple model (this training code can be heavy; keep as-is if intended)
model = Sequential([
    Embedding(10000, 16, input_length=max_sequence_len),
    LSTM(32),
    Dense(24, activation='relu'),
    Dense(len(label_word_index) + 1, activation='softmax')
])

model.compile(loss='sparse_categorical_crossentropy', optimizer='adam', metrics=['accuracy'])

if padded.size and training_label_seq.size:
    # Only fit if training data is available
    model.fit(padded, training_label_seq, epochs=30)


app = Flask(__name__)


@app.route('/', methods=['GET'])
def index():
    """Simple health/info endpoint so visiting root URL doesn't return 404.
    Explains how to call the prediction endpoint.
    """
    return jsonify({
        'status': 'ok',
        'message': 'Prakriti prediction API. POST JSON {"Symptoms":"your symptoms text"} to /predict'
    })


@app.route('/predict', methods=['POST'])
def predict():
    req_data = request.get_json() or {}
    Symptoms = req_data.get('Symptoms', '')

    if not Symptoms:
        return jsonify({'error': 'Symptoms field is required'}), 400

    input_seq = tokenizer.texts_to_sequences([Symptoms])
    padded_input_seq = pad_sequences(input_seq, maxlen=max_sequence_len, padding='post')

    predictions = model.predict(padded_input_seq)
    predicted_label = int(np.argmax(predictions))

    # label_tokenizer.index_word maps integer -> label; it may not contain index 0
    Disease = label_tokenizer.index_word.get(predicted_label)

    if Disease is None:
        return jsonify({
            'error': 'Model predicted an unknown label',
            'predicted_label': predicted_label
        }), 400

    # perform case-insensitive, trimmed match against CSV disease column
    matches = data[data['Disease'].astype(str).str.strip().str.lower() == str(Disease).strip().lower()]
    if matches.empty:
        return jsonify({
            'error': 'No treatment information found for predicted disease',
            'Disease': Disease
        }), 404

    Treatment = matches['Treatment'].values[0]
    Procedure = matches['Procedure'].values[0]
    Precautions = matches['Precautions'].values[0]

    return jsonify({
        'Disease': Disease,
        'Treatment': Treatment,
        'Procedure': Procedure,
        'Precautions': Precautions
    })


if __name__ == '__main__':
    app.run(debug=True)
