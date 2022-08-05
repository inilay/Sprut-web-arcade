let physicManager = {
  update: function (obj) {
    if (obj.move_x === 0 && obj.move_y === 0) {
      return "stop";
    }
    let newX = obj.pos_x + Math.floor(obj.move_x * obj.speed);
    let newY = obj.pos_y + Math.floor(obj.move_y * obj.speed);
    // анализ пространства на карте по направлению движения
    let ts;
    // вверх ^ лево <-
    if (mapManager.getTilesetIdx(newX , newY) !== 389) {
      ts = mapManager.getTilesetIdx(newX, newY);
    }
    // право ->
    else if (mapManager.getTilesetIdx(newX + obj.size_x, newY) !== 389) {
      ts = mapManager.getTilesetIdx(newX + obj.size_x, newY);
    }
    // низ !
    else if (mapManager.getTilesetIdx(newX, newY + obj.size_y) !== 389) {
      ts = mapManager.getTilesetIdx(newX, newY + obj.size_y);
    }
    // диагональ
    else if (mapManager.getTilesetIdx(newX + obj.size_x, newY + obj.size_y) !== 389) {
      ts = mapManager.getTilesetIdx(newX + obj.size_x, newY + obj.size_y);
    }
    else ts = 389;

    // объект на пути
    let e = this.entityAtXY(obj, newX, newY);
    // столкновение с препятствием
    if (e !== null && obj.onTouchEntity) {
      obj.onTouchEntity(e);
    }
    // столкновение с объектом
    if (ts !==389 && obj.onTouchMap) {
      obj.onTouchMap(ts);
    }

    // перемещение на новое место
    if (ts === 389 && e === null) {
      obj.pos_x = newX;
      obj.pos_y = newY;
    }
    else {
      return "break";
    }
    return "move";
  },

  // поиск объекта по координатам
  entityAtXY: function (obj, x, y) {
    for(let i = 0; i <gameManager.entities.length; i++) {
      let e = gameManager.entities[i];
      if(e.name !== obj.name) {
        if(x + obj.size_x < e.pos_x ||
            y + obj.size_y < e.pos_y ||
            x > e.pos_x + e.size_x ||
            y > e.pos_y + e.size_y)
          continue;
        return e;
      }
    }
    return null;
  },
};
