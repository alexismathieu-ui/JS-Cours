// Taille d'une frame dans la spritesheet
const FRAME_WIDTH = 64;
const FRAME_HEIGHT = 64;

const FRAME_WIDTH_ATTACK = 192;
const FRAME_HEIGHT_ATTACK = 192;

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
        this.clear();
        this.drawBackground();

        for (const id in this.game.players) {
            const player = this.game.players[id];
            player.animate(); // met à jour walkSpriteIndex
            this.drawPlayer(player);
        }
    }

    drawPlayer(player) {
        const sprite = this.loadSprite(player);
        if (!sprite) return;

        const canvasX = player.renderX * this.width;
        const canvasY = player.renderY * this.height;

        let frameX, frameY;
        let srcW, srcH;
        let dstW, dstH;

        if (player.isAttacking) {
            // Animation d’attaque (192x192)
            frameX = player.attackSpriteIndex * FRAME_WIDTH_ATTACK;
            frameY = FRAME_Y_BY_ATTACK_DIRECTION[player.direction];

            srcW = FRAME_WIDTH_ATTACK;
            srcH = FRAME_HEIGHT_ATTACK;

            dstW = FRAME_WIDTH_ATTACK;
            dstH = FRAME_HEIGHT_ATTACK;

        } else {
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
            frameX = Math.min(player.deathSpriteIndex, 9) * FRAME_WIDTH;
            frameY = FRAME_Y_DEATH;
            srcW = FRAME_WIDTH;
            srcH = FRAME_HEIGHT;
            dstW = FRAME_WIDTH;
            dstH = FRAME_HEIGHT;
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

        // fond HP
        this.ctx.fillStyle = "black";
        this.ctx.fillRect(
            x - BAR_WIDTH / 2,
            y - OFFSET_Y,
            BAR_WIDTH,
            BAR_HEIGHT
        );

        // vie
        this.ctx.fillStyle = "red";
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
            this.ctx.font = "12px Arial";
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
}
