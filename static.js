let currentWord = null; // Para guardar la palabra actual

// Función para obtener una nueva palabra desde el servidor
function getNewWord() {
    $.get('/get-word', function(data) {
        currentWord = data; // Guardar la palabra actual
        $("#korean-word").text(data.korean); // Mostrar la palabra en coreano
        $("#translation").text(data.spanish); // Mostrar la traducción
        $("#user-input").val(""); // Limpiar el campo de texto
        $("#result").text(""); // Limpiar el resultado
    });
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


// Llamar a la función para cargar la primera palabra al inicio
$(document).ready(function() {
    getNewWord();
});
