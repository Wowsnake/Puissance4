class P4{
    constructor(selector){ //Constructeur dans lequel on appellera les classes
        this.colonne = 7;
        this.ligne = 6;
        this.selector = selector;
        this.joueur = 'rouge'; //Initialisation à la couleur rouge
        this.drawGame(); 
        this.ecoute();
        this.verifWin();
        
    }

    drawGame(){ //Fonction permettant d'afficher le jeu
        const $jeu = $(this.selector); //Le jeu doit être égal à ce qu'on lui a passé en paramètre dans l'appel de la classe
        
        //Double boucle afin d'afficher les éléments (lignes et colonnes)
        for(let lgn = 0; lgn < this.ligne; lgn++){ //
            const $lgn = $('<div>').addClass('lgn');
            for(let col = 0; col < this.colonne; col++){
                const $col = $('<div>').addClass('col empty').attr("data-col", col).attr("data-lgn", lgn); //Définition d'une colonne. Ajout de la classe col empty pour ensuite déterminer la couleur de la case et un attribut pour stocker sa position
                $lgn.append($col); //Affichage de la colonne dans la ligne
            }
            $jeu.append($lgn);
        }
    }

    ecoute(){ 
        const $jeu = $(this.selector);
        const that =this;
        function derniereCase(col) { //Cherche la derniere case disponible
            const $cells = $(`.col[data-col='${col}']`); //On stock toutes les cellules qui ont la data-col que lui
            for(let i = $cells.length-1; i>=0; i--){ // Boucle permettant de parcourir un tableau à partir du bas
                const $cell = $($cells[i]); //Stock la variable actuelle dans cells
                if($cell.hasClass('empty')){ //Si la cellule est vide il retourne la cellule
                    return $cell;
                }
            }
            return null;
        }

        $jeu.on('mouseenter', '.col.empty' , function(){ //Fonction dans laquelle on va récuperer la colonne de l'objet sur lequel on passe la souris
            const $col = $(this).data('col');
            const $derniere = derniereCase($col);
            if($derniere != null){ //Si ce n'est pas vide il nous affiche la classe
                $derniere.addClass(`p${that.joueur}`);
            }
        });

        $jeu.on('mouseleave', '.col' , function(){ //Fonction dans laquelle on retire la classe à l'objet sélectionné
            $('.col').removeClass(`p${that.joueur}`);
        });

        $jeu.on('click', '.col.empty', function(){ //Fonction qui se lance au clic de la souris
            const col = $(this).data('col');
            const $derniere = derniereCase(col);
            $derniere.addClass(`${that.joueur}`).removeClass(`empty p${that.joueur}`).data('joueur', `${that.joueur}`); //Attribut permettant de savoir à qui appartient quelle case
            $("#click")[0].play();
            const gagnant = that.verifWin($derniere.data('lgn'), $derniere.data('col')); //Verification du gagnant
            that.joueur = (that.joueur === 'rouge') ? 'jaune' : 'rouge'; //Switch de joueur; si le joueur est rouge on switch à jaune sinon le contraire
            if(gagnant){ //Quand un joueur gagne la partie on affiche un message le lui indiquant
                $("#victoire")[0].play();
                console.log(`Les ${gagnant} ont gagné la partie.`);
                window.alert(`L'équipe ${gagnant} remporte la partie.`)
                $('#recommencer').css('visibility', "visible");
                return;
            }
        });
    }


    


    verifWin(lgn, col){ //On vérifie les conditions pour qu'il y ait un gagnant
        const that = this;
        function $getCell(i, j){ //Fonction qui à partir des coordonnées de la grille va renvoyer l'élément HTML correspondant
            return $(`.col[data-lgn='${i}'][data-col='${j}']`);
        }

        function verifDirection(direction) { //Fontion qui vérifie à partir d'un tableau de point, va compter le nombre de pions du même joueur
            let total = 0;
            let i = lgn + direction.i;
            let j = col + direction.j;
            let $next = $getCell(i,j);
            while(i >=0 && i < that.ligne && j >= 0 && j <that.colonne && $next.data('joueur') === that.joueur){ //Tant que les lignes sont positives et que les lignes sont inférieures au nombre défini au début et idem pour les colonnes et que le pion appartienne au même joueur
                total++;
                i += direction.i; //Actualisation de la ligne à la suivante
                j += direction.j; //Actualisation de la colonne à la suivante
                $next = $getCell(i, j);
            }
            return total;
        }

        function verifWin(directionA, directionB) { //Fonction vérifiant le gagnant
            const total = 1 + verifDirection(directionA) + verifDirection(directionB); //Vérification de la première et deuxième direction permettant d'avoir un puissance 4
            if(total >=4){ //Si il y a puissance 4 on retourne le joueur actuel sinon rien
                return that.joueur;
            }else{
                return null;
            }
        }

        function verifHori(){ //Fonction vérifiant si il y un puissance 4 dans la direction horizontale
            return verifWin({i: 0, j: -1}, {i: 0, j: 1})
        }

        function verifVerti(){ //Fonction vérifiant si il y a un puissance 4 dans la direction verticale
            return verifWin({i: -1, j: 0}, {i: 1, j: 0})
        }
        function verifDiag1() { //Fonction vérifiant si il y un puissance 4 dans la diagonale droite
            return verifWin({i: 1, j: 1}, {i: -1, j: -0})
        }

        function verifDiag2() { //Fonction vérifiant si il y un puissance 4 dans la diagonale gauche
            return verifWin({i: 1, j: -1}, {i: -1, j: 1})
        }

        return verifHori() || verifVerti() || verifDiag1() || verifDiag2();
    }
}