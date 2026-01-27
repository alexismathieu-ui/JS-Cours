// Taille d'une frame dans la spritesheet
const FRAME_WIDTH = 64;
const FRAME_HEIGHT = 64;

const FRAME_WIDTH_ATTACK = 192;
const FRAME_HEIGHT_ATTACK = 192;

const FRAME_WIDTH_MAUDIT = 128;
const FRAME_HEIGHT_MAUDIT = 128;

const maudits = [7, 13, 18, 21, 24, 26, 29];

const paths_maudits = maudits.map(id => `assets/${id}.png`);

// Position de la frame dans la spritesheet
const FRAME_X = 0;
const FRAME_Y = 0;

// Position Y selon la direction
const FRAME_Y_BY_DIRECTION = {
    0: 512, // north
    1: 704, // east
    2: 640, // south
    3: 576,  // west
};
// Death animation Y Position
const FRAME_Y_DEATH = 1280;

// Position Y selon la direction d’attaque 
const FRAME_Y_BY_ATTACK_DIRECTION = {
    0: 3456, // north
    1: 4032, // east
    2: 3840, // south
    3: 3648,  // west
};

const FRAME_Y_BY_MAUDIT_ATTACK_DIRECTION = {
    0: 3456, // north
    1: 3840, // east
    2: 3712, // south
    3: 3584,  // west
};

class GameView {
    constructor(game) {
        this.game = game;
        this.canvas = document.querySelector("canvas");
        this.ctx = this.canvas.getContext("2d");
        this.width = this.canvas.width;
        this.height = this.canvas.height;

        this.loadedSprites = {};
    }

    clear() {
        this.ctx.clearRect(0, 0, this.width, this.height);
    }

    drawBackground() {
        this.ctx.fillStyle = "#91cbe2";
        this.ctx.fillRect(0, 0, this.width, this.height);
    }

    render() {
        const me = this.game.players[this.game.myPlayerId];
        const alivePlayers = this.getAlivePlayer();
        this.clear();
        this.drawBackground();

        if (alivePlayers.length === 1) {
            this.drawVictoryScreen(alivePlayers[0]);
            return;
        }

        for (const id in this.game.players) {
            const player = this.game.players[id];
            this.drawPlayer(player);
            player.animate(); // met à jour walkSpriteIndex
        }
        this.drawPlayersCounter();

        this.drawLeaderboard();

    }
    drawPlayer(player) {
        const sprite = this.loadSprite(player);
        if (!sprite) return;

        const canvasX = player.renderX * this.width;
        const canvasY = player.renderY * this.height;

        let frameX, frameY;
        let srcW, srcH;
        let dstW, dstH;

        if (player.isAttacking || player.currentAttackSpriteStep > 0 || player.attackSpriteIndex > 0) {
        if (paths_maudits.includes(player.skinPath)) {
            // Animation d'attaque maudit (128x128)
            frameX = player.attackSpriteIndex * FRAME_WIDTH_MAUDIT;
            frameY = FRAME_Y_BY_MAUDIT_ATTACK_DIRECTION[player.direction];

            srcW = FRAME_WIDTH_MAUDIT;
            srcH = FRAME_HEIGHT_MAUDIT;
            dstW = FRAME_WIDTH_MAUDIT;
            dstH = FRAME_HEIGHT_MAUDIT;

        } else {
            // Animation d’attaque (192x192)
            frameX = player.attackSpriteIndex * FRAME_WIDTH_ATTACK;
            frameY = FRAME_Y_BY_ATTACK_DIRECTION[player.direction];

            srcW = FRAME_WIDTH_ATTACK;
            srcH = FRAME_HEIGHT_ATTACK;

            dstW = FRAME_WIDTH_ATTACK;
            dstH = FRAME_HEIGHT_ATTACK;
        }
    }
        else {
            // Animation normale (64x64)
            frameX = player.walkSpriteIndex * FRAME_WIDTH;
            frameY = FRAME_Y_BY_DIRECTION[player.direction];

            srcW = FRAME_WIDTH;
            srcH = FRAME_HEIGHT;

            dstW = FRAME_WIDTH;
            dstH = FRAME_HEIGHT;
        }

        if (player.isDying) {
            // Animation de mort (64x64)
            frameX = player.deathSpriteIndex * FRAME_WIDTH;
            frameY = FRAME_Y_DEATH;
            srcW = FRAME_WIDTH;
            srcH = FRAME_HEIGHT;
            dstW = FRAME_WIDTH;
            dstH = FRAME_HEIGHT;
            if (player.deathSpriteIndex === 4) {
                frameX = 4 * FRAME_WIDTH;
            }
        }

        this.ctx.drawImage(
            sprite.image,
            frameX, frameY, srcW, srcH,
            canvasX - dstW / 2,
            canvasY - dstH / 2,
            dstW, dstH
        );

        const x = player.renderX * this.canvas.width;
        const y = player.renderY * this.canvas.height;

        // ===== HUD =====

        // dimensions
        const BAR_WIDTH = 40;
        const BAR_HEIGHT = 5;
        const OFFSET_Y = 40;

        // ratio de vie
        const hpRatio = player.hp / player.maxHp;

        let hpColor;

        if (hpRatio > 2 / 3) {
            hpColor = "lime";       // vert
        } else if (hpRatio > 1 / 3) {
            hpColor = "yellow";     // jaune
        } else {
            hpColor = "red";        // rouge
        }


        // fond HP
        this.ctx.lineWidth = 1;
        this.ctx.strokeStyle = "black";
        this.ctx.strokeRect(
            x - BAR_WIDTH / 2,
            y - OFFSET_Y,
            BAR_WIDTH,
            BAR_HEIGHT
        );

        // vie
        this.ctx.fillStyle = hpColor;
        this.ctx.fillRect(
            x - BAR_WIDTH / 2,
            y - OFFSET_Y,
            BAR_WIDTH * hpRatio,
            BAR_HEIGHT
        );

        if (player.attackCooldown > 0) {
            const cdRatio = player.currentAttackCooldown / player.attackCooldown;

            // fond cooldown
            this.ctx.fillStyle = "black";
            this.ctx.fillRect(
                x - BAR_WIDTH / 2,
                y - OFFSET_Y - 8,
                BAR_WIDTH,
                BAR_HEIGHT
            );

            // cooldown
            this.ctx.fillStyle = "cyan";
            this.ctx.fillRect(
                x - BAR_WIDTH / 2,
                y - OFFSET_Y - 8,
                BAR_WIDTH * cdRatio,
                BAR_HEIGHT
            );

            //pseudo
            this.ctx.fillStyle = "black";
            this.ctx.font = "15px Arial";
            this.ctx.textAlign = "center";

            this.ctx.fillText(
                player.name,
                x,
                y - OFFSET_Y - 15
            );

            //niveau
            this.ctx.fillStyle = "blue";
            this.ctx.font = "12px Arial";
            this.ctx.textAlign = "center";
            this.ctx.fillText(
                'Niveau ' + player.lvl,
                x,
                y - OFFSET_Y + 25
            )

        }
    }
        timerSection() {
        const minutes = Math.floor(this.game.timer / 60);
        const seconds = Math.floor(this.game.timer % 60);
        this.ctx.fillStyle = "black";
        this.ctx.font = "40px Arial";
        this.ctx.textAlign = "center";
        this.ctx.fillText(
            `Temps écoulé: ${minutes}:${seconds}`,
            800,              
            50
        );
    }
    countPlayers() {
        let alive = 0;
        let total = 0;

        for (const id in this.game.players) {
            const player = this.game.players[id];
            total++;
            if (!player.isDead) {
                alive++;
            }
        }

        return { alive, total };
    }

    drawPlayersCounter() {
        const { alive, total } = this.countPlayers();

        this.ctx.fillStyle = "black";
        this.ctx.font = "16px Arial";
        this.ctx.textAlign = "left";

        this.ctx.fillText(
            `Joueurs vivants : ${alive} / ${total}`,
            10,
            25
        );
    }

    loadSprite(player) {
        const path = player.skinPath;

        if (this.loadedSprites[path]) {
            return this.loadedSprites[path];
        }

        const img = new Image();
        img.src = path;

        const sprite = { image: img, ready: false };

        img.onload = () => {
            sprite.ready = true;
            this.loadedSprites[path] = sprite;
        };

        return sprite.ready ? sprite : null;
    }
    getSortedPlayers() {
        return Object.values(this.game.players).sort((a, b) => {
            // Vivants avant morts
            if (a.isDead !== b.isDead) {
                return a.isDead ? 1 : -1;
            }

            // Même état → tri par niveau décroissant
            return b.lvl - a.lvl;
        });
    }

    drawLeaderboard() {
        const players = this.getSortedPlayers();

        const startX = this.canvas.width - 220;
        const startY = 40;
        const lineHeight = 18;

        // fond
        this.ctx.fillStyle = "rgba(0, 0, 0, 0.6)";
        this.ctx.fillRect(startX - 10, startY - 25, 210, players.length * lineHeight + 35);

        // titre
        this.ctx.fillStyle = "white";
        this.ctx.font = "16px Arial";
        this.ctx.textAlign = "left";
        this.ctx.fillText("Classement", startX, startY - 8);

        // joueurs
        this.ctx.font = "14px Arial";

        players.forEach((player, index) => {
            this.ctx.fillStyle = player.isDead ? "#888" : "#fff";

            this.ctx.fillText(
                `${index + 1}. ${player.name} (Lv ${player.lvl})`,
                startX,
                startY + index * lineHeight +10
            );
        });
    }
    getAlivePlayer() {
        return Object.values(this.game.players).filter(p => !p.isDead)
    }

    drawVictoryScreen(winner) {
        this.clear();

        // fond sombre
        this.ctx.fillStyle = "rgba(0, 0, 0, 0.85)";
        this.ctx.fillRect(0, 0, this.width, this.height);

        // texte VICTOIRE
        this.ctx.fillStyle = "gold";
        this.ctx.font = "64px Arial";
        this.ctx.textAlign = "center";
        this.ctx.fillText(" VICTOIRE ", this.width / 2, 120);

        // nom du vainqueur
        this.ctx.fillStyle = "white";
        this.ctx.font = "32px Arial";
        this.ctx.fillText(
            `${winner.name} (Niveau ${winner.lvl})`,
            this.width / 2,
            180
        );

        // skin du vainqueur
        const sprite = this.loadSprite(winner);
        if (!sprite) return;

        const size = 256;

        this.ctx.drawImage(
            sprite.image,
            0,
            FRAME_Y_BY_DIRECTION[winner.direction],
            FRAME_WIDTH,
            FRAME_HEIGHT,
            this.width / 2 - size / 2,
            this.height / 2 - size / 2,
            size,
            size
        );
    }
}
