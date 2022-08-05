let eventsManager = {
  // массив для сопастовления клавиш действиям
  bind: [],
  // действия
  action: [],
  // настройка сопоставления
  setup: function (canvas) {
    this.bind[83] = "down";
    this.bind[68] = "right";
    this.bind[87] = "up";
    this.bind[65] = "left";
    this.bind[32] = "fire";
    // контроль событий мыши
    canvas.addEventListener("mousedown", this.onMouseDown);
    canvas.addEventListener("mouseup", this.onMouseUp);
    // контроль событий клавиатуры
    document.body.addEventListener("keydown", this.onKeyDown);
    document.body.addEventListener("keyup", this.onKeyUp);
  },
  onMouseDown: function (event) {
    eventsManager.action["fire"] = true;
  },
  onMouseUp: function (event) {
    eventsManager.action["fire"] = false;
  },
  onKeyDown: function (event) {
    let action = eventsManager.bind[event.keyCode];
    if (action) {
      eventsManager.action[action] = true;
    }
  },
  onKeyUp: function (event) {
    let action = eventsManager.bind[event.keyCode];
    if (action) {
      eventsManager.action[action] = false;
    }
  },
};
