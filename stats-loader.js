/**
 * Stats Loader - Charge et affiche automatiquement les stats sur les cartes de jeux
 * À inclure dans index.html
 */

(function() {
    'use strict';
    
    const statsManager = new StatsManager();
    let allStats = {};

    /**
     * Initialisation au chargement de la page
     */
    async function init() {
        console.log('🔄 Chargement des stats en temps réel...');
        
        // Afficher un état de chargement
        showLoadingState();
        
        try {
            // Récupérer toutes les stats
            allStats = await statsManager.getAllGamesStats();
            
            // Injecter les stats dans les cartes
            injectStatsIntoCards();
            
            console.log('✅ Stats chargées avec succès');
        } catch (error) {
            console.error('❌ Erreur lors du chargement des stats:', error);
            showErrorState();
        }
    }

    /**
     * Affiche un état de chargement sur les cartes
     */
    function showLoadingState() {
        const cards = document.querySelectorAll('[data-game-id]');
        
        cards.forEach(card => {
            const statsContainer = card.querySelector('.stats-container') || createStatsContainer(card);
            statsContainer.innerHTML = `
                <div class="text-xs text-white/40 mt-2 animate-pulse">
                    Chargement des stats...
                </div>
            `;
        });
    }

    /**
     * Affiche un état d'erreur
     */
    function showErrorState() {
        const cards = document.querySelectorAll('[data-game-id]');
        
        cards.forEach(card => {
            const statsContainer = card.querySelector('.stats-container');
            if (statsContainer) {
                statsContainer.innerHTML = `
                    <div class="text-xs text-red-400/60 mt-2">
                        Stats temporairement indisponibles
                    </div>
                `;
            }
        });
    }

    /**
     * Crée un conteneur pour les stats dans une carte
     */
    function createStatsContainer(card) {
        // Trouver la div de description qui apparaît au hover
        const hoverDiv = card.querySelector('.absolute.bottom-0.left-0.right-0.p-4');
        
        if (!hoverDiv) {
            console.warn('Conteneur hover non trouvé pour la carte');
            return null;
        }

        // Créer le conteneur de stats
        const statsContainer = document.createElement('div');
        statsContainer.className = 'stats-container';
        
        // L'insérer avant le dernier élément (les tags)
        const tagsDiv = hoverDiv.querySelector('.flex.flex-wrap.gap-1\\.5');
        if (tagsDiv) {
            hoverDiv.insertBefore(statsContainer, tagsDiv);
        } else {
            hoverDiv.appendChild(statsContainer);
        }
        
        return statsContainer;
    }

    /**
     * Injecte les stats dans les cartes de jeux
     */
    function injectStatsIntoCards() {
        const cards = document.querySelectorAll('[data-game-id]');
        
        if (cards.length === 0) {
            console.warn('Aucune carte de jeu trouvée. Assurez-vous d\'ajouter data-game-id aux cartes.');
            return;
        }

        cards.forEach(card => {
            const gameId = card.getAttribute('data-game-id');
            const stats = allStats[gameId];
            
            // Injecter le badge Trending si applicable
            const trendingBadge = statsManager.generateTrendingBadge(stats);
            if (trendingBadge) {
                const imageContainer = card.querySelector('.relative.h-64');
                if (imageContainer) {
                    // Vérifier si le badge Featured existe déjà
                    const existingBadge = imageContainer.querySelector('.absolute.top-3.left-3');
                    if (existingBadge) {
                        // Remplacer le badge Featured par Trending
                        existingBadge.outerHTML = trendingBadge;
                    } else {
                        // Ajouter le badge Trending
                        imageContainer.insertAdjacentHTML('afterbegin', trendingBadge);
                    }
                }
            }
            
            // Injecter les stats dans le conteneur
            let statsContainer = card.querySelector('.stats-container');
            if (!statsContainer) {
                statsContainer = createStatsContainer(card);
            }
            
            if (statsContainer) {
                statsContainer.innerHTML = statsManager.generateStatsHTML(stats);
            }
        });
    }

    /**
     * Rafraîchir les stats périodiquement (toutes les 5 minutes)
     */
    function startAutoRefresh() {
        setInterval(async () => {
            console.log('🔄 Rafraîchissement automatique des stats...');
            try {
                allStats = await statsManager.getAllGamesStats();
                injectStatsIntoCards();
                console.log('✅ Stats rafraîchies');
            } catch (error) {
                console.error('❌ Erreur lors du rafraîchissement:', error);
            }
        }, 5 * 60 * 1000); // 5 minutes
    }

    /**
     * Lancement de l'initialisation
     */
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            init();
            startAutoRefresh();
        });
    } else {
        init();
        startAutoRefresh();
    }

})();
