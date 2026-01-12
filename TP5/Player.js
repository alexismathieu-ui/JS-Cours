class Player {
  constructor(id, name, skinID, positionX, positionY) {
    this.id = id;
    this.name = name;
    this.skinID = skinID;
    this.positionX = positionX;
    this.positionY = positionY;
    this.level = 1;
    this.health = 100;
    this.damage = 20;
    this.speed = 1;
    this.kill = false;
    this.killCount = 0;
    this.cooldown = 2;
    this.Isalive = true;
    this.regenActive = false;
    this.regen = 5;
    this.MaxHealth = 100;
    this.MaxCooldown = 2;
    this.HealthBar = 100;
    this.direction = right;
    this.Isattack = false;
  }
  update(updateData) {
    this.health = updateData.health;
    this.cooldown = updateData.cooldown;
    this.damage = updateData.damage;
    this.speed = updateData.speed;
    this.level = updateData.level;
    this.killCount = updateData.killCount;
    this.positionX = updateData.positionX;
    this.positionY = updateData.positionY;
    this.kill = false;
    this.MaxHealth = updateData.MaxHealth;
    this.MaxCooldown = updateData.MaxCooldown;
    this.Isalive = false;
    this.direction = updateData.direction;
    this.Isattack = updateData.attack;
  }
}
