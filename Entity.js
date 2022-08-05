// расширяем
let Entity = {
  pos_x: 0,
  pos_y: 0,
  size_x: 0,
  size_y: 0,
  extends: function (extendsProto) {
    // создание нового обьекта
    let object = Object.create(this);
    for (let property in extendsProto) {
      // если нет в родительском
      if (this.hasOwnProperty(property) || typeof object[property] === "undefined") {
        object[property] = extendsProto[property];
      }
    }
    return object;
  },
};
// игрок
let Player = Entity.extends({
  lifetime: 150,
  move_x: 0,
  move_y: -1,
  speed: 3,
  fire_rate: 0,
  what_draw: "in1",
  type: "player",
  dmg: 50,

  draw: function (ctx) {
    spriteManager.drawSprite(ctx, this.what_draw, this.pos_x, this.pos_y);
  },
  update: function () {

    if (this.fire_rate > 0) {
      this.fire_rate--;
    }

    this.move_y = 0;
    this.move_x = 0;

    if (eventsManager.action["down"]) {
      this.move_y = 1;
      this.what_draw = "in3";

    } else if (eventsManager.action["up"]) {
      this.move_y = -1;
      this.what_draw = "in1";

    } else if (eventsManager.action["left"]) {
      this.move_x = -1;
      this.what_draw = "in4";

    } else if (eventsManager.action["right"]) {
      this.move_x = 1;
      this.what_draw = "in2";
    }
    else if (eventsManager.action["fire"]) {
      this.fire();
    }
    physicManager.update(this);
  },
  onTouchEntity: function (obj) {
    if (obj.type === "heal") {
      obj.kill();
      this.lifetime += 100;
    }
    else if (obj.type === "speed") {
      obj.kill();
      this.speed += 1;
    }
    else if (obj.type === "damage") {
      obj.kill();
      this.dmg += 50;
    }
    else if (obj.type === "door") {
      obj.kill();
      specifications.check = true;
      gameManager.entities = []
      gameManager.stop()
    }
    specifications.characteristic(this.lifetime, this.dmg, this.speed);
  },

  kill: function () {
    gameManager.laterKill.push(this);
  },

  fire: function () {
    if (this.fire_rate > 0) {
      return;
    }

    let bullet = Object.create(Rocket);
    bullet.name = "bullet" + (++gameManager.fireNum);
    bullet.whose = this
    bullet.move_x = this.move_x;
    bullet.move_y = this.move_y;

    // место появления снаряда
    switch (this.what_draw) {
      // влево
      case "in4": {
        bullet.pos_x = this.pos_x - bullet.size_x;
        bullet.pos_y = this.pos_y + this.size_y / 2 - bullet.size_y / 2;
        bullet.move_x = -1;
        break;

      }
      // вправо
      case "in2": {
        bullet.pos_x = this.pos_x + this.size_x;
        bullet.pos_y = this.pos_y + this.size_y / 2 - bullet.size_y / 2;
        bullet.move_x = 1;
        break;

      }
      // вверх
      case "in1": {
        bullet.pos_x = this.pos_x + this.size_x / 2 - bullet.size_x / 2;
        bullet.pos_y = this.pos_y - bullet.size_y;
        bullet.move_y = -1;
        break;
      }
      // вниз
      case "in3": {
        bullet.pos_x = this.pos_x + this.size_x / 2 - bullet.size_x / 2;
        bullet.pos_y = this.pos_y + this.size_y;
        bullet.move_y = 1;
      }
    }

    gameManager.entities.push(bullet);
    this.fire_rate = 20;
  },
  damage: function (damage) {
    this.lifetime -= damage;
    if (this.lifetime <= 0) {
      this.lifetime = 0;
      this.kill();
    }
    specifications.characteristic(this.lifetime, this.dmg, this.speed);
  },
});
// турели
let Spam3 = Entity.extends({

  lifetime: 100,
  move_x: 0,
  move_y:0,
  speed: 0,
  fire_rate: 0,
  type: "spam3",
  dmg: 20,

  draw: function (ctx) {
    spriteManager.drawSprite(ctx, "spam3", this.pos_x, this.pos_y);
  },
  update: function () {
    if (this.fire_rate > 0) {
      this.fire_rate--;
    } else {
      this.fire();
    }
  },
  onTouchEntity: function (obj) {},
  onTouchMap: function () {},
  kill: function () {
    gameManager.laterKill.push(this);
  },
  fire: function () {
    if (this.fire_rate > 0) {
      return;
    }
    let bullet = Object.create(Rocket);
    bullet.name = "bullet" + ++gameManager.fireNum;
    bullet.whaw_shoot = "ats3"
    bullet.whose = "enemy"
    bullet.speed = 2;
    bullet.pos_x = this.pos_x + this.size_x / 2 - bullet.size_x / 2;
    bullet.pos_y = this.pos_y + this.size_y;
    bullet.move_y = 1;
    gameManager.entities.push(bullet);
    this.fire_rate = 100;
  },
});

let Spam4 = Entity.extends({

  lifetime: 100,
  move_x: 0,
  move_y:0,
  speed: 0,
  fire_rate: 0,
  type: "spam4",
  dmg: 20,

  draw: function (ctx) {
    spriteManager.drawSprite(ctx, "spam4", this.pos_x, this.pos_y);
  },
  update: function () {
    if (this.fire_rate > 0) {
      this.fire_rate--;
    } else {
      this.fire();
    }
  },
  onTouchEntity: function (obj) {},
  onTouchMap: function () {},
  kill: function () {
    gameManager.laterKill.push(this);
  },
  fire: function () {
    if (this.fire_rate > 0) {
      return;
    }
    let bullet = Object.create(Rocket);
    bullet.name = "bullet" + ++gameManager.fireNum;
    bullet.whose = this
    bullet.whaw_shoot = "ats4"
    bullet.speed = 2;
    bullet.pos_x = this.pos_x - bullet.size_x;
    bullet.pos_y = this.pos_y + this.size_y / 2 - bullet.size_y / 2;
    bullet.move_x = -1;
    gameManager.entities.push(bullet);
    this.fire_rate = 100;
  },
});
// враги
let Enemy = Entity.extends({
  lifetime: 200,
  move_x: 1,
  move_y: 0,
  speed: 1,
  size_x: 32,
  size_y: 32,
  what_draw: "en4",
  type: "enemy",
  fire_rate: 0,
  dmg: 40,

  draw: function (ctx) {
    spriteManager.drawSprite(ctx, this.what_draw, this.pos_x, this.pos_y);
  },

  update: function () {
    if (this.fire_rate > 0) {
      this.fire_rate--;
    }

    let player = gameManager.player;
    let flag = false
    // стрелять по игроку
    if (Math.abs(this.pos_x - player.pos_x) <= 20 && Math.abs(this.pos_y - player.pos_y) <= 250) {
      // вверх
      if(this.pos_y > player.pos_y && (mapManager.getTilesetIdx(this.pos_x, this.pos_y - this.size_y) == 389)) {
        this.move_x = 0
        this.what_draw = "en1"
        this.fire();
        this.move_x = 1
        flag = true
      }
      // вниз
      else if(this.pos_y <= player.pos_y  && mapManager.getTilesetIdx(this.pos_x, this.pos_y + this.size_y + 16) == 389){
        this.move_x = 0
        this.what_draw = "en3"
        this.fire();
        this.move_x = 1
        flag = true
      }
    }
    // стрелять по игроку
    else if (Math.abs(this.pos_y - player.pos_y) <= 20 && Math.abs(this.pos_x - player.pos_x) <= 250)  {
      // проверка лева
      let i = 0
      let flag_left = true
      while ((this.pos_x - i) > player.pos_x ) {
        if (mapManager.getTilesetIdx(this.pos_x - i, this.pos_y) != 389) {
          flag_left = false
          break
        }
        i = i + 1;
      }
      let j = 0
      let flag_righ = true
      // проверка права
      while ((this.pos_x + j) < player.pos_x ) {
        if (mapManager.getTilesetIdx(this.pos_x + j, this.pos_y) != 389) {
          flag_righ = false
          break
        }
        j = j + 1;
      }

      // лево
      if(this.pos_x > player.pos_x && flag_left) {
        this.move_x = 0
        this.what_draw = "en4"
        this.fire();
        this.move_x = 1
        flag = true
      }
      // право
      else if(this.pos_x <= player.pos_x && flag_righ) {
        this.move_x = 0
        this.what_draw = "en2"
        this.fire();
        this.move_x = 1
        flag = true
      }
    }
    if(!flag){
      if (this.move_x) {
        // право
        if(this.move_x === 1) {
          this.what_draw = "en2"
        }
        // лево
        else {
          this.what_draw = "en4"
        }
      }
      physicManager.update(this);
    }
  },

  onTouchEntity: function (obj) {
    this.move_x = -this.move_x;
    this.move_y = -this.move_y;
  },

  onTouchMap: function () {
    this.move_x = -this.move_x;
    this.move_y = -this.move_y;
  },

  kill: function () {
    gameManager.laterKill.push(this);
  },

  fire: function () {
    if (this.fire_rate > 0) {
      return;
    }

    let bullet = Object.create(Rocket);
    bullet.name = "bullet" + (++gameManager.fireNum);
    bullet.whose = this
    bullet.move_x = this.move_x;
    bullet.move_y = this.move_y;
    bullet.whaw_shoot = "enatc"

    // место появления снаряда
    switch (this.what_draw) {
        // влево
      case "en4": {
        bullet.pos_x = this.pos_x - bullet.size_x;
        bullet.pos_y = this.pos_y + this.size_y / 2 - bullet.size_y / 2;
        bullet.move_x = -1;
        break;

      }
        // вправо
      case "en2": {
        bullet.pos_x = this.pos_x + this.size_x;
        bullet.pos_y = this.pos_y + this.size_y / 2 - bullet.size_y / 2;
        bullet.move_x = 1;
        break;

      }
        // вверх
      case "en1": {
        bullet.pos_x = this.pos_x + this.size_x / 2 - bullet.size_x / 2;
        bullet.pos_y = this.pos_y - bullet.size_y;
        bullet.move_y = -1;
        break;
      }
        // вниз
      case "en3": {
        bullet.pos_x = this.pos_x + this.size_x / 2 - bullet.size_x / 2;
        bullet.pos_y = this.pos_y + this.size_y;
        bullet.move_y = 1;
      }
    }

    gameManager.entities.push(bullet);
    this.fire_rate = 50;

  },

  damage: function (damage) {
    this.lifetime -= damage;
    if (this.lifetime <= 0) {
      this.kill();
    }
  },
});

//снаряд
let Rocket = Entity.extends({
  move_x: 0,
  move_y: 0,
  speed: 4,
  size_x: 20,
  size_y: 20,
  whaw_shoot: "atp",
  type: "bullet",
  whose: null,

  draw: function (ctx) {
    spriteManager.drawSprite(ctx, this.whaw_shoot, this.pos_x, this.pos_y);
  },
  update: function () {
    physicManager.update(this);
  },
  onTouchEntity: function (obj) {
    this.kill();
    if(obj.type === "bullet")
      obj.kill()
    else if(obj.type === "player") {
      obj.damage(this.whose.dmg)
    }
    else if(obj.type === "enemy") {
      obj.damage(this.whose.dmg)
    }
  },
  onTouchMap: function () {
    this.kill();
  },
  kill: function () {
    gameManager.laterKill.push(this);
  },
});
// бонусы
let Heal = Entity.extends({
  size_x: 28,
  size_y: 32,
  type: "heal",
  draw: function (ctx) {spriteManager.drawSprite(ctx, "heal", this.pos_x, this.pos_y);},
  kill: function () {gameManager.laterKill.push(this);},
  update: function () {},
});

let DamageBonus = Entity.extends({
  size_x: 23,
  size_y: 32,
  type: "damage",
  draw: function (ctx) {spriteManager.drawSprite(ctx, "damage", this.pos_x, this.pos_y);},
  kill: function () {gameManager.laterKill.push(this);},
  update: function () {},
});

let SpeedBonus = Entity.extends({
  size_x: 25,
  size_y: 32,
  type: "speed",
  draw: function (ctx) {spriteManager.drawSprite(ctx, "speed", this.pos_x, this.pos_y);},
  kill: function () {gameManager.laterKill.push(this);},
  update: function () {},
});

let Door = Entity.extends({
  size_x: 25,
  size_y: 32,
  type: "door",
  draw: function (ctx) {spriteManager.drawSprite(ctx, "atp", this.pos_x, this.pos_y);},
  kill: function () {gameManager.laterKill.push(this);},
  update: function () {},
});
