let gameManager = {
  // фабрика объектов на карте
  factory: {},
  // объекты на карте
  entities: [],
  // индефикатор выстрела
  fireNum: 0,
  // указатель на объект игрока
  player: null,
  // отложенное уничтожение
  laterKill: [],
  // интервал
  inter: null,
  // инициализация игрока
  initPlayer: function (obj) {
    this.player = obj;
  },
  // убийство
  kill: function (obj) {
    this.laterKill.push(obj);
  },
  // обновление
  update: function (ctx) {
    if (!this.player) {
      return;
    }

    // для все объектов на карте
    this.entities.forEach(function (e) {
      try {
        e.update();
      } catch (ex) {}
    });

    // убийство объектов
    for (let i = 0; i < this.laterKill.length; i++) {
      let idx = this.entities.indexOf(this.laterKill[i]);
      if (idx > -1) this.entities.splice(idx, 1);
      if (this.laterKill[i].name === "player") {
        specifications.check = true;
        gameManager.entities = []
        gameManager.stop();
      }
    }
    // проверка что всех убили
    if (this.laterKill.length > 0)
      this.laterKill.length = 0;

    mapManager.draw(ctx);
    mapManager.centerAt(this.player.pos_x, this.player.pos_y);

    this.draw(ctx);
    specifications.characteristic(this.player.lifetime, this.player.dmg, this.player.speed);
  },
  // отрисовка
  draw: function (ctx) {
    for (let e = 0; e < this.entities.length; e++)
      this.entities[e].draw(ctx);
  },
  loadAll: function (ctx, mapName) {
    // загрузка карты и анализ
    mapManager.loadMap(mapName);
    // загрузка спрайтов и анализ
    spriteManager.loadAtlas("img/sprites.json", "img/spritesheet.png"); ///////
    this.factory["player"] = Player;
    this.factory["Rocket"] = Rocket;
    this.factory["spam4"] = Spam4;
    this.factory["spam3"] = Spam3;
    this.factory["enemy"] = Enemy;
    this.factory["heal"] = Heal;
    this.factory["damage"] = DamageBonus;
    this.factory["speed"] = SpeedBonus;
    this.factory["door"] = Door;
    // разбор сущностей
    mapManager.parseEntities();
    // отрисовка карты
    mapManager.draw(ctx);
    // настройка событий
    eventsManager.setup(ctx.canvas);
  },
  play: function (ctx) {
    gameManager.stop();
    gameManager.inter = setInterval(() => gameManager.update(ctx), 18)
  },
  stop: function () {
      if (gameManager.inter) {
        clearInterval(gameManager.inter);
        gameManager.inter = null;
      }
    if (specifications.check !== null) {
      //level_caller(2, 'youcanbemylastone.json')
      document.getElementById("menu").style.display = "block";
      add_res(specifications.try_counter, this.player.lifetime * this.player.speed * this.player.dmg, specifications.level);
    }

  },
};

