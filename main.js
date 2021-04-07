$('#jeu').ready(function(){
    //On charge le fichier de la classe puissance 4 
    const p4 = new P4('#jeu');

    $('#recommencer').on('click', function() { //Fonction qui vide la grille et en régénère une autre
        $('#jeu').empty();
        p4.drawGame();
        $('#recommencer').css('visibility', 'hidden');
    })
});