let modelPath = "https://huggingface.co/rhasspy/piper-voices/resolve/v1.0.0/de/de_DE/karlsson/low/de_DE-karlsson-low.onnx";
let model;  // To store the loaded ONNX model

// Load the ONNX model
async function loadModel() {
    model = await onnx.InferenceSession.create(modelPath);
    console.log("ONNX model loaded successfully.");
}

// Convert the text input to speech using the ONNX model
async function textToSpeech(text) {
    if (!model) {
        console.error("Model is not loaded.");
        return;
    }

    // Preprocess text into the format expected by the model (this might vary depending on the model)
    let inputTextTensor = new onnx.Tensor(new TextEncoder().encode(text), 'string', [1]);  // Example tensor creation

    // Make the inference call to the model
    const output = await model.run([inputTextTensor]);

    // Get the audio data from the output
    const audioData = output.values[0];  // The specific key may vary depending on the model

    // Convert audio data into a playable format
    const audioBlob = new Blob([audioData], { type: 'audio/wav' });
    const audioUrl = URL.createObjectURL(audioBlob);

    // Create an audio element and play it
    let audio = new Audio(audioUrl);
    audio.play();

    // Optional: Create a download link for the audio
    const downloadLink = document.createElement('a');
    downloadLink.href = audioUrl;
    downloadLink.download = 'generated_speech.wav';
    downloadLink.textContent = 'Download Audio';
    document.body.appendChild(downloadLink);
}

// Handle the click event to generate audio
document.getElementById("generateButton").addEventListener("click", () => {
    const inputText = document.getElementById("inputText").value;
    if (inputText.trim() !== "") {
        textToSpeech(inputText);
    } else {
        alert("Please enter some text.");
    }
});

// Load the ONNX model when the page is ready
window.onload = loadModel;
