let currentWord = null; // Para guardar la palabra actual
let currentQuizWord = null;

function speakText(text, lang) {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang; // Configurar idioma
    window.speechSynthesis.speak(utterance);
}

// Función para obtener una nueva palabra desde el servidor
function getNewWord() {
    $.get('/get-word', function(data) {
        currentWord = data; // Guardar la palabra actual
        
        $("#korean-word").text(data.korean); // Mostrar la palabra en coreano
        $("#translation").text(data.spanish); // Mostrar la traducción
        speakText(data.korean, 'ko-KR');
        
        setTimeout(() => {
            if (!speechSynthesis.speaking) {
                speakText(data.spanish, 'es-US');
            }
        }, 2000);
        
        $("#user-input").val(""); // Limpiar el campo de texto
        $("#result").text(""); // Limpiar el resultado
    });
}

// Función para obtener una nueva palabra para el quiz (coreano o español)
function getQuizWord() {
    // Determinamos el tipo de quiz con base en la URL
    const quizType = window.location.pathname.includes('coreano') ? 'coreano' : 'espanol';

    $.get('/get-quiz-word?type=coreano', function(data) {
        currentQuizWord = data; // Guardar la palabra actual
        if (quizType === 'coreano') {
            $("#quiz-spanish-word").text(data.spanish);  // Mostrar la traducción al español
            speakText(data.spanish, 'es-US');
            $("#quiz-korean-word").text("");  // Limpiar la palabra coreana
        } else {
            $("#quiz-korean-word").text(data.korean);  // Mostrar la palabra en coreano
            speakText(data.korean, 'ko-KR');
            $("#quiz-spanish-word").text("");  // Limpiar la traducción
        }
        $("#quiz-user-input").val("");  // Limpiar el campo de texto
        $("#quiz-result").text("");  // Limpiar el resultado
    });
}

// Función para verificar la respuesta del quiz (coreano o español)
function checkQuizAnswer() {
    const userInput = $("#quiz-user-input").val().trim().toLowerCase(); // Obtener la respuesta del usuario
    let correctAnswer = (window.location.pathname.includes('coreano')) ? currentQuizWord.korean.toLowerCase() : currentQuizWord.spanish.toLowerCase(); 

    if (userInput === correctAnswer) {
        $("#quiz-result").text("¡Correcto! 🎉");
        getQuizWord();  // Cargar una nueva palabra si la respuesta es correcta
    } else {
        $("#quiz-result").text("Incorrecto. 😢 Intenta de nuevo.");
    }
}

// Función para verificar si el usuario ingresó la palabra correcta
function checkWord() {
    const userInput = $("#user-input").val(); // Obtener el texto del usuario

    $.ajax({
        url: '/check-word', // Ruta en el servidor Flask
        method: 'POST',     // Método POST
        contentType: 'application/json', // Especificar el tipo de contenido
        data: JSON.stringify({
            input: userInput,           // Lo que escribió el usuario
            correct_word: currentWord.korean // La palabra correcta
        }),
        success: function(response) {
            if (response.correct) {
                getNewWord(); // Cargar una nueva palabra
            } else {
                $("#result").text("Incorrecto. 😢 Intenta de nuevo."); // Si es incorrecto
            }
        },
        error: function() {
            $("#result").text("Ocurrió un error al verificar la palabra."); // Error en la solicitud
        }
    });
}

// Cargar la primera palabra cuando se carga la página
$(document).ready(function() {
    if (window.location.pathname === '/quiz-coreano' || window.location.pathname === '/quiz-espanol') {
        getQuizWord();  // Llamar a la función para cargar la palabra del quiz
    } else {
        getNewWord(); // Llamar a la función para cargar la palabra en la página principal
    }
});
