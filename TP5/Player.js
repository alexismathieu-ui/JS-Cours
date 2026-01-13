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
    this.isalive = true;
    this.regenActive = false;
    this.regen = 5;
    this.maxhealth = 100;
    this.maxcooldown = 2;
    this.healthbar = 100;
    this.direction = 0;
    this.isattack = false;
    this.iswalking = true;
    this.isdying = false;
    this.walkspriteduration = 2;
    this.walkspriteindex = 0;
    this.walkspritenumber = 9;
    this.attackspriteindex = 0;
    this.attackspriteduration = 2;
    this.attackspritenumber = 8;
    this.dyingspriteduration = 2;
    this.dyingspriteindex = 0;
    this.dyingspritenumber = 6;
    this.idle = 0;
    this.currentwalking = 0;
    this.currentattacking = 0;
    this.currentdying = 0;
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
    this.maxhealth = updateData.maxhealth;
    this.maxcooldown = updateData.maxcooldown;
    this.isalive = false;
    this.direction = updateData.direction;
    this.isattack = updateData.isattack;
    this.iswalking = updateData.iswalking;
    this.isdying = updateData.isdying;
    this.isalive = updateData.isalive;
    this.walkspriteduration = updateData.walkspriteduration;
    this.walkspriteindex = updateData.walkspriteindex;
    this.walkspritenumber = updateData.walkspritenumber;
    this.attackspriteindex = updateData.attackspriteindex;
    this.attackspriteduration = updateData.attackspriteduration;
    this.attackspritenumber = updateData.attackspritenumber;
    this.dyingspriteduration = updateData.dyingspriteduration;
    this.dyingspriteindex = updateData.dyingspriteindex;
    this.dyingspritenumber = updateData.dyingspritenumber;
    this.idle = updateData.idle;
    this.currentwalking = updateData.currentwalking;
    this.currentattacking = updateData.currentattacking;
    this.currentdying = updateData.currentdying;
  }

  Animate() {
    //THe player is walking
    if (this.iswalking) {
      this.currentwalking++;
      if (this.currentwalking >= this.walkspriteduration) {
        this.currentwalking = 0;
        this.walkspriteindex++;
      }
      if (this.walkspriteindex >= this.walkspritenumber) {
        this.walkspriteindex = 0;
      }
    }

    //The player is attacking
    else if (this.isattack) {
      this.currentattacking++;
      if (this.currentattacking >= this.attackspriteduration) {
        this.currentattacking = 0;
        this.attackspriteindex++;
      }
      if (this.attackspriteindex >= this.attackspritenumber) {
        this.attackspriteindex = 0;
      }
    }
    //The player is dying
    else if (this.isdying) {
      this.currentdying++;
      if (this.currentdying >= this.dyingspriteduration) {
        this.currentdying = 0;
        this.dyingspriteindex++;
      }
      if (this.dyingspriteindex >= this.dyingspritenumber) {
        this.dyingspriteindex = this.dyingspritenumber - 1;
      }
    }
    //The player is idle
    else {
      this.idle++;
      if (this.idle >= 10) {
        this.idle = 0;
      }
    }
    if (!this.iswalking) {
      this.currentwalking = 0;
      this.walkspriteindex = 0;
    }
    if (!this.isattack) {
      this.currentattacking = 0;
      this.attackspriteindex = 0;
    }
    if (!this.isdying) {
      this.currentdying = 0;
      this.dyingspriteindex = 0;
    }

    console.log("Walk animation :\n");
    console.log("iswalking = ", this.iswalking);
    console.log(
      "walkspriteindex = ",
      this.walkspriteindex,
      "/",
      this.walkspritenumber
    );
    // console.log("Attack animation :\n");
    // console.log("isattack = ", this.isattack);
    // console.log(
    //   "attackspriteindex = ",
    //   this.attackspriteindex,
    //   "/",
    //   this.attackspritenumber
    // );
    // console.log("Dying animation :\n");
    // console.log("isdying = ", this.isdying);
    // console.log(
    //   "dyingspriteindex = ",
    //   this.dyingspriteindex,
    //   "/",
    //   this.dyingspritenumber
    // );
  }
}

toto = new Player(42, "toto", 1, [0, 0]);
for (let i = 0; i < 13; i++) {
  toto.Animate();
}
