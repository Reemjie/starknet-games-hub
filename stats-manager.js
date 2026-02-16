/**
 * Stats Manager - Récupération des stats en temps réel depuis GrowThePie
 * Pour les jeux Starknet
 */

class StatsManager {
    constructor() {
        this.API_BASE = 'https://api.growthepie.com/v1';
        this.CACHE_DURATION = 5 * 60 * 1000; // 5 minutes
        this.cache = {
            data: null,
            timestamp: null
        };
        
        // Mapping des jeux avec leur origin_key sur GrowThePie
        this.gamesMapping = {
            'lootsurvivor': 'loot_survivor',
            'blobarena': 'blob_arena',
            'jokersofneon': 'jokers_of_neon',
            'eternum': 'eternum',
            'ponziland': 'ponzi_land',
            'pistols': 'pistols_at_dawn',
            'darkshuffle': 'dark_shuffle',
            'zkube': 'zkube'
        };
    }

    /**
     * Récupère les données depuis l'API ou le cache
     */
    async fetchFundamentals() {
        // Vérifier le cache
        const now = Date.now();
        if (this.cache.data && (now - this.cache.timestamp) < this.CACHE_DURATION) {
            return this.cache.data;
        }

        try {
            const response = await fetch(`${this.API_BASE}/fundamentals.json`);
            
            if (!response.ok) {
                throw new Error(`API Error: ${response.status}`);
            }

            const data = await response.json();
            
            // Mettre en cache
            this.cache.data = data;
            this.cache.timestamp = now;
            
            return data;
        } catch (error) {
            console.error('Erreur lors de la récupération des stats:', error);
            // Retourner le cache même expiré si erreur
            return this.cache.data || [];
        }
    }

    /**
     * Filtre les données pour un jeu spécifique et une métrique
     */
    filterData(data, originKey, metricKey) {
        return data.filter(item => 
            item.origin_key === originKey && 
            item.metric_key === metricKey
        ).sort((a, b) => new Date(b.date) - new Date(a.date));
    }

    /**
     * Récupère les stats pour un jeu spécifique
     */
    async getGameStats(gameId) {
        const originKey = this.gamesMapping[gameId];
        
        if (!originKey) {
            console.warn(`Jeu non trouvé dans le mapping: ${gameId}`);
            return null;
        }

        const data = await this.fetchFundamentals();
        
        if (!data || data.length === 0) {
            return null;
        }

        // Récupérer les dernières données pour chaque métrique
        const daa = this.filterData(data, originKey, 'daa')[0]; // Daily Active Addresses
        const txcount = this.filterData(data, originKey, 'txcount')[0]; // Transaction Count
        const tvl = this.filterData(data, originKey, 'tvl')[0]; // Total Value Locked
        
        // Calculer les tendances (comparaison avec J-7)
        const daaHistory = this.filterData(data, originKey, 'daa').slice(0, 8);
        const txHistory = this.filterData(data, originKey, 'txcount').slice(0, 8);
        
        const daaTrend = this.calculateTrend(daaHistory);
        const txTrend = this.calculateTrend(txHistory);

        return {
            activeUsers: daa ? Math.round(daa.value) : null,
            transactions: txcount ? Math.round(txcount.value) : null,
            tvl: tvl ? tvl.value : null,
            tvlEth: tvl ? (data.find(d => d.origin_key === originKey && d.metric_key === 'tvl_eth' && d.date === tvl.date)?.value || null) : null,
            trends: {
                users: daaTrend,
                transactions: txTrend
            },
            lastUpdate: daa ? daa.date : null
        };
    }

    /**
     * Calcule la tendance (% de changement sur 7 jours)
     */
    calculateTrend(history) {
        if (!history || history.length < 2) return 0;
        
        const latest = history[0].value;
        const weekAgo = history[Math.min(7, history.length - 1)].value;
        
        if (weekAgo === 0) return 0;
        
        const change = ((latest - weekAgo) / weekAgo) * 100;
        return Math.round(change * 10) / 10; // Arrondir à 1 décimale
    }

    /**
     * Formate un nombre avec séparateurs de milliers
     */
    formatNumber(num) {
        if (num === null || num === undefined) return 'N/A';
        
        if (num >= 1000000) {
            return (num / 1000000).toFixed(1) + 'M';
        } else if (num >= 1000) {
            return (num / 1000).toFixed(1) + 'K';
        }
        
        return num.toLocaleString('en-US');
    }

    /**
     * Formate le TVL en USD
     */
    formatTVL(tvl) {
        if (tvl === null || tvl === undefined) return 'N/A';
        
        if (tvl >= 1000000) {
            return '$' + (tvl / 1000000).toFixed(2) + 'M';
        } else if (tvl >= 1000) {
            return '$' + (tvl / 1000).toFixed(1) + 'K';
        }
        
        return '$' + tvl.toFixed(0);
    }

    /**
     * Génère le HTML pour afficher les stats d'un jeu
     */
    generateStatsHTML(stats) {
        if (!stats) {
            return `
                <div class="text-xs text-white/40 mt-2">
                    Stats non disponibles
                </div>
            `;
        }

        const userTrendIcon = stats.trends.users > 0 ? '📈' : stats.trends.users < 0 ? '📉' : '➡️';
        const txTrendIcon = stats.trends.transactions > 0 ? '📈' : stats.trends.transactions < 0 ? '📉' : '➡️';
        const userTrendColor = stats.trends.users > 0 ? 'text-green-400' : stats.trends.users < 0 ? 'text-red-400' : 'text-white/60';
        const txTrendColor = stats.trends.transactions > 0 ? 'text-green-400' : stats.trends.transactions < 0 ? 'text-red-400' : 'text-white/60';

        return `
            <div class="mt-3 pt-3 border-t border-gaming-border/50 grid grid-cols-2 gap-2 text-xs">
                <div class="flex items-center gap-1.5">
                    <span class="text-white/60">👥</span>
                    <span class="text-white font-semibold">${this.formatNumber(stats.activeUsers)}</span>
                    <span class="${userTrendColor} text-[10px]">
                        ${userTrendIcon} ${stats.trends.users > 0 ? '+' : ''}${stats.trends.users}%
                    </span>
                </div>
                <div class="flex items-center gap-1.5">
                    <span class="text-white/60">📊</span>
                    <span class="text-white font-semibold">${this.formatNumber(stats.transactions)}</span>
                    <span class="${txTrendColor} text-[10px]">
                        ${txTrendIcon} ${stats.trends.transactions > 0 ? '+' : ''}${stats.trends.transactions}%
                    </span>
                </div>
                ${stats.tvl !== null ? `
                <div class="flex items-center gap-1.5 col-span-2">
                    <span class="text-white/60">💰</span>
                    <span class="text-white font-semibold">TVL: ${this.formatTVL(stats.tvl)}</span>
                </div>
                ` : ''}
            </div>
        `;
    }

    /**
     * Génère un badge "Trending" si les stats sont en forte hausse
     */
    generateTrendingBadge(stats) {
        if (!stats) return '';
        
        const isTrending = stats.trends.users > 20 || stats.trends.transactions > 20;
        
        if (isTrending) {
            return `
                <div class="absolute top-3 left-3 px-2 py-1 bg-orange-500 rounded-full text-xs font-semibold z-10 flex items-center gap-1">
                    🔥 Trending
                </div>
            `;
        }
        
        return '';
    }

    /**
     * Récupère les stats pour tous les jeux
     */
    async getAllGamesStats() {
        const gameIds = Object.keys(this.gamesMapping);
        const statsPromises = gameIds.map(id => this.getGameStats(id));
        
        try {
            const results = await Promise.all(statsPromises);
            
            const statsMap = {};
            gameIds.forEach((id, index) => {
                statsMap[id] = results[index];
            });
            
            return statsMap;
        } catch (error) {
            console.error('Erreur lors de la récupération de toutes les stats:', error);
            return {};
        }
    }
}

// Export pour utilisation
if (typeof module !== 'undefined' && module.exports) {
    module.exports = StatsManager;
}
