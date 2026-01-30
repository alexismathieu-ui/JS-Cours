(() => {
    const REFRESH_MS = 10000;
    const FETCH_TIMEOUT_MS = 7000;

    const state = {
        server: localStorage.getItem("tp10_server") || "http://13.38.137.68:8000/",
        players: [],
        selectedPlayer: null,
        refreshTimer: null,
        isRefreshing: false,
    };

    // DOM helpers
    function el(tag, attrs = {}, children = []) {
        const node = document.createElement(tag);
        for (const [k, v] of Object.entries(attrs)) {
            if (k === "class") node.className = v;
            else if (k === "text") node.textContent = v;
            else if (k.startsWith("on") && typeof v === "function") node.addEventListener(k.slice(2), v);
            else node.setAttribute(k, v);
        }
        for (const child of children) node.append(child);
        return node;
    }

    function ensureUI() {
        const root =
            document.getElementById("dashboardRoot") ||
            el("div", { id: "dashboardRoot", class: "dashboard-root" });

        if (!root.isConnected) document.body.prepend(root);

        // Controls
        let controls = document.getElementById("controls");
        if (!controls) {
            controls = el("div", { id: "controls", class: "controls" });
            root.append(controls);
        }

        let serverInput = document.getElementById("serverInput");
        if (!serverInput) {
            const label = el("label", { for: "serverInput", text: "Serveur (IP:PORT) : " });
            serverInput = el("input", {
                id: "serverInput",
                type: "text",
                placeholder: "127.0.0.1:8000",
                value: state.server,
            });
            const btn = el("button", { id: "serverBtn", type: "button", text: "Connecter" });

            btn.addEventListener("click", () => {
                const raw = serverInput.value.trim();
                if (!raw) return setStatus("Adresse serveur vide.", "error");
                setServer(raw);
            });

            serverInput.addEventListener("keydown", (e) => {
                if (e.key === "Enter") document.getElementById("serverBtn")?.click();
            });

            controls.append(label, serverInput, btn);
        } else {
            serverInput.value = state.server;
        }

        let status = document.getElementById("status");
        if (!status) {
            status = el("div", { id: "status", class: "status" });
            controls.append(status);
        }

        // Main layout
        let main = document.getElementById("main");
        if (!main) {
            main = el("div", { id: "main", class: "main" });
            root.append(main);
        }

        // Players
        let playersPanel = document.getElementById("playersPanel");
        if (!playersPanel) {
            playersPanel = el("div", { id: "playersPanel", class: "panel" }, [
                el("h2", { text: "Joueurs" }),
            ]);
            main.append(playersPanel);
        }

        let playersSelect = document.getElementById("playersSelect");
        if (!playersSelect) {
            playersSelect = el("select", { id: "playersSelect" });
            playersPanel.append(playersSelect);
        }

        playersSelect.onchange = async () => {
            const name = playersSelect.value || null;
            state.selectedPlayer = name;
            if (!name) {
                renderStats(null);
                return;
            }
            await refreshSelectedStats();
        };

        // Stats
        let statsPanel = document.getElementById("statsPanel");
        if (!statsPanel) {
            statsPanel = el("div", { id: "statsPanel", class: "panel" }, [
                el("h2", { text: "Statistiques" }),
            ]);
            main.append(statsPanel);
        }

        let statsBox = document.getElementById("playerStats");
        if (!statsBox) {
            statsBox = el("div", { id: "playerStats", class: "stats-box" });
            statsPanel.append(statsBox);
        }

        // Ranking
        let rankingPanel = document.getElementById("rankingPanel");
        if (!rankingPanel) {
            rankingPanel = el("div", { id: "rankingPanel", class: "panel" }, [
                el("h2", { text: "Classement" }),
            ]);
            main.append(rankingPanel);
        }

        let rankingTable = document.getElementById("rankingTable");
        if (!rankingTable) {
            rankingTable = el("table", { id: "rankingTable", class: "ranking-table" });
            rankingPanel.append(rankingTable);
        }

        return { root };
    }

    function setStatus(message, kind = "info") {
        const status = document.getElementById("status");
        if (!status) return;
        status.textContent = message || "";
        status.dataset.kind = kind;
    }

    // Server / fetch 
    function normalizeServer(raw) {
        // Accept "IP:PORT" or full URL.
        let s = raw.trim();
        if (!s) return "";
        if (!/^https?:\/\//i.test(s)) s = `http://${s}`;
        s = s.replace(/\/+$/, "");
        return s;
    }

    function setServer(raw) {
        const normalized = normalizeServer(raw);
        if (!normalized) return;

        state.server = normalized.replace(/^https?:\/\//i, ""); // store as IP:PORT for display
        localStorage.setItem("tp10_server", state.server);

        const input = document.getElementById("serverInput");
        if (input) input.value = state.server;

        setStatus(`Serveur: ${state.server}`, "info");
        refreshAll(true).catch(() => {});
    }

    async function fetchJson(path, params = {}) {
        const base = normalizeServer(state.server);
        const url = new URL(base + path);

        for (const [k, v] of Object.entries(params)) {
            if (v !== undefined && v !== null) url.searchParams.set(k, String(v));
        }

        const controller = new AbortController();
        const t = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);

        try {
            const res = await fetch(url, { method: "GET", signal: controller.signal });
            if (!res.ok) {
                const text = await res.text().catch(() => "");
                throw new Error(`HTTP ${res.status} ${res.statusText}${text ? ` - ${text}` : ""}`);
            }
            return await res.json();
        } finally {
            clearTimeout(t);
        }
    }

    // API functions (required) 
    async function loadPlayers() {
        // /api/listPlayers
        const json = await fetchJson("/api/listPlayers");
        
        // On récupère le tableau
        const rawList = Array.isArray(json) ? json : json?.players || json?.data || json?.result || [];
        
        if (!Array.isArray(rawList)) return [];

        // CORRECTION ICI : Si c'est un objet, on cherche son nom, sinon on prend la valeur directe
        return rawList.map(p => {
            if (typeof p === 'object' && p !== null) {
                return p.name || p.id || p.username || "Inconnu";
            }
            return String(p);
        });
    }

    async function loadPlayerStats(name) {
        // /api/stats?name=PLAYER_NAME
        if (!name) throw new Error("Nom joueur manquant");
        const json = await fetchJson("/api/stats", { name });
        // Stats can be direct object or nested
        return json?.stats || json?.data || json;
    }

    async function loadRanking() {
        // On prend la liste des noms de joueurs
        const players = state.players.slice();
        
        // On récupère les stats pour chaque joueur
        const statsList = await Promise.all(
            players.map(async (name) => {
                try {
                    const stats = await loadPlayerStats(name);
                    // stats contient maintenant ton objet : { name, totalKills, totalDeaths... }
                    return { name, stats };
                } catch (e) {
                    return { name, stats: null, error: e };
                }
            })
        );

        // Transformation des données pour le tableau
        const rows = statsList.map(({ name, stats }) => {
            // ICI : On utilise EXACTEMENT les clés de ton JSON
            const kills = num(stats?.totalKills);     
            const deaths = num(stats?.totalDeaths);   
            const ratio = num(stats?.kdRatio);
            
            // Si le nom dans le JSON est différent ou plus complet, on le prend
            const displayName = stats?.name || name;

            return { name: displayName, kills, deaths, ratio };
        });

        // Tri du classement (Bonus : Par Ratio K/D décroissant) [cite: 59]
        rows.sort((a, b) => {
            // Si les ratios sont différents, le plus grand d'abord
            if (b.ratio !== a.ratio) return b.ratio - a.ratio;
            // Sinon celui qui a le plus de kills
            return b.kills - a.kills;
        });

        return rows;
    }

    // Rendering 
    function renderPlayers(players) {
        const select = document.getElementById("playersSelect");
        if (!select) return;

        const prev = state.selectedPlayer;
        select.innerHTML = "";

        select.append(el("option", { value: "", text: "-- Choisir un joueur --" }));

        for (const name of players) {
            select.append(el("option", { value: name, text: name }));
        }

        // Restore selection if still present
        if (prev && players.includes(prev)) {
            select.value = prev;
        } else {
            state.selectedPlayer = select.value || null;
            renderStats(null);
        }
    }

    function renderStats(stats) {
        const box = document.getElementById("playerStats");
        if (!box) return;

        box.innerHTML = "";

        // Si aucun joueur n'est sélectionné ou si les stats sont vides
        if (!stats || !stats.name) {
            box.append(el("div", { class: "muted", text: "Aucun joueur sélectionné." }));
            return;
        }

        // On crée les cartes de stats en utilisant tes clés JSON exactes
        const fields = [
            { label: "Joueur", value: stats.name },
            { label: "Kills", value: stats.totalKills },
            { label: "Morts", value: stats.totalDeaths },
            { label: "Ratio K/D", value: stats.kdRatio?.toFixed(2) },
            { label: "Dernier Rang", value: stats.lastGameRank },
            { label: "Classement Moyen", value: stats.overallRanking?.toFixed(1) }
        ];

        fields.forEach(f => {
            // Création d'un bloc div pour chaque statistique (conforme à ton CSS)
            const statCard = el("div", { class: "stat-card" }, [
                el("span", { text: `${f.label} : ` }),
                el("strong", { text: String(f.value ?? "0") })
            ]);
            box.append(statCard);
        });
    }

    function renderRanking(rows) {
        const table = document.getElementById("rankingTable");
        if (!table) return;

        table.innerHTML = "";

        // Création de l'en-tête
        const thead = el("thead", {}, [
            el("tr", {}, [
                el("th", { text: "#" }),          // Position
                el("th", { text: "Joueur" }),     // Nom
                el("th", { text: "Kills" }),      // Kills
                el("th", { text: "Morts" }),      // Morts
                el("th", { text: "Ratio K/D" }),  // Ratio
            ]),
        ]);

        const tbody = el("tbody");
        
        rows.forEach((r, idx) => {
            tbody.append(
                el("tr", {}, [
                    el("td", { text: String(idx + 1) }), // Position
                    el("td", { text: r.name }),          // Nom du joueur
                    el("td", { text: fmt(r.kills) }),    // Nombre de kills
                    el("td", { text: fmt(r.deaths) }),   // Nombre de morts
                    el("td", { text: r.ratio.toFixed(2) }), // Ratio avec 2 décimales
                ])
            );
        });

        table.append(thead, tbody);
    }

    //  Refresh logic 
    async function refreshSelectedStats() {
        const name = state.selectedPlayer;
        if (!name) return;

        try {
            setStatus(`Chargement stats: ${name}...`, "info");
            const stats = await loadPlayerStats(name);
            renderStats(stats);
            setStatus(`OK (stats: ${name})`, "ok");
        } catch (e) {
            renderStats(null);
            setStatus(`Erreur stats (${name}): ${errMsg(e)}`, "error");
        }
    }

    async function refreshAll(force = false) {
        if (state.isRefreshing && !force) return;
        state.isRefreshing = true;

        try {
            setStatus("Chargement joueurs...", "info");
            const players = await loadPlayers();
            state.players = players;
            renderPlayers(players);

            setStatus("Chargement classement...", "info");
            const ranking = await loadRanking();
            renderRanking(ranking);

            // If a player is selected, refresh stats too
            if (state.selectedPlayer) await refreshSelectedStats();
            else setStatus("OK", "ok");
        } catch (e) {
            setStatus(`Erreur réseau/API: ${errMsg(e)}`, "error");
        } finally {
            state.isRefreshing = false;
        }
    }

    // Utils 
    function num(v) {
        const n = Number(v);
        return Number.isFinite(n) ? n : 0;
    }

    function fmt(v) {
        const n = Number(v);
        if (Number.isFinite(n)) return String(n);
        return v == null ? "0" : String(v);
    }

    function errMsg(e) {
        if (!e) return "Erreur inconnue";
        if (e.name === "AbortError") return "Timeout";
        return e.message || String(e);
    }

    //  Refresh logic 
async function refreshSelectedStats() {
        const name = state.selectedPlayer;
        if (!name) return;

        try {
            setStatus(`Chargement stats: ${name}...`, "info");
            const stats = await loadPlayerStats(name);
            renderStats(stats);
            setStatus(`OK (stats: ${name})`, "ok");
        } catch (e) {
            renderStats(null);
            setStatus(`Erreur stats (${name}): ${errMsg(e)}`, "error");
        }
    }

    // AJOUT: refresh auto (classement + stats du joueur sélectionné)
    async function refreshAuto(force = false) {
        if (state.isRefreshing && !force) return;
        state.isRefreshing = true;

        try {
            // On recharge aussi la liste des joueurs pour que le classement reste correct si elle change
            const players = await loadPlayers();
            state.players = players;
            renderPlayers(players);

            setStatus("Chargement classement...", "info");
            const ranking = await loadRanking();
            renderRanking(ranking);

            if (state.selectedPlayer) await refreshSelectedStats();
            else setStatus("OK", "ok");
        } catch (e) {
            setStatus(`Erreur réseau/API: ${errMsg(e)}`, "error");
        } finally {
            state.isRefreshing = false;
        }
    }

    async function refreshAll(force = false) {
        // Optionnel: garde refreshAll pour le 1er chargement, et délègue au refreshAuto
        return refreshAuto(force);
    }


    //  Boot 
    document.addEventListener("DOMContentLoaded", async () => {
        ensureUI();
        setStatus(`Serveur: ${state.server}`, "info");

        // First load
        await refreshAll(true);

        // Auto refresh
        if (state.refreshTimer) clearInterval(state.refreshTimer);
        state.refreshTimer = setInterval(() => {
            refreshAuto(false).catch(() => {});
        }, REFRESH_MS);
    });

    // Expose for debugging if needed
    window.TP10 = {
        loadPlayers,
        loadPlayerStats,
        loadRanking,
        refreshAuto,
    };
})();
