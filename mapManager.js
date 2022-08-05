let mapManager = {
  mapData: null, // карта
  tLayer: null,  // блоки карты
  xCount: 0,    // кол-во блоков по гор
  yCount: 0,    // кол-во блоков по вер
  tSize: { x: 32, y: 32 }, // размер блока
  mapSize: { x: 20, y: 25}, // размер карты
  tilesets: [], // массив описаний блоков карты
  imgLoadCount: 0,
  imgLoaded: false,
  jsonLoaded: false,
  view: { x: 0, y: 0, w: 720, h: 540 },
  // загружаем карту
  loadMap: function (path) {
    this.jsonLoaded = false;
    let request = new XMLHttpRequest();
    // выполняется после запроса
    request.onreadystatechange = function () {
      if (request.readyState === 4 && request.status === 200) {
        mapManager.parseMap(request.responseText);
      }
    };
    // отправляем запрос
    request.open("GET", path, true);
    request.send();
  },
  // получаем данные о карте
  parseMap: function (tilesJSON) {
    // парсим джейсон
    this.mapData = JSON.parse(tilesJSON);
    // ширина карты в тайлах
    this.xCount = this.mapData.width;
    // высота карты в тайлах
    this.yCount = this.mapData.height;
    // ширина блока в пикселях
    this.tSize.x = this.mapData.tilewidth;
    // высота блока в пикселях
    this.tSize.y = this.mapData.tileheight;
    // размеры карты в пикселях
    this.mapSize.x = this.xCount * this.tSize.x;
    this.mapSize.y = this.yCount * this.tSize.y;
    // слой блоков
    this.tLayer = this.mapData.layers[0];
    // проходим по всей карте
    for (let i = 0; i < this.mapData.tilesets.length; i++) {
      // для хранения изображения тайлов
      // в данном случае одна картинка
      let img = new Image();
      // при загрузке
      img.onload = function () {
        mapManager.imgLoadCount++;
        // если все изображения загружены
        if (mapManager.imgLoadCount === mapManager.mapData.tilesets.length) {
          mapManager.imgLoaded = true;
        }
      };
      // путь к изображению
      img.src = this.mapData.tilesets[i].image;
      // забираем tilesets с карты
      let t = this.mapData.tilesets[i];
      // создаем свой объект tilesets
      let ts = {
        // начало нумерации
        firstgid: t.firstgid,
        // объект рисунка
        image: img,
        // имя
        name: t.name,
        // количество блоков по горизонтале
        xCount: Math.floor(t.imagewidth / mapManager.tSize.x),
        // количество блоков по вертикале
        yCount: Math.floor(t.imageheight / mapManager.tSize.y),
      };
      // сохраняем в массив
      this.tilesets.push(ts);
    }
    this.jsonLoaded = true;
  },

  // отрисовывает карту
  draw: function (ctx) {
    // если не удалось загрузить
    if (!this.imgLoaded || !this.jsonLoaded) {
      setTimeout(function () {mapManager.draw(ctx);}, 100);
    } else {
      // обходим всю карту цифры в массиве data
      for (let i = 0; i < this.tLayer.data.length; i++) {
        // отрисовываем каждый тайл по цифре в массиве
        if (this.tLayer.data[i] !== 0) {
          // берем блок по индексу this.tLayer.data[i] - цифра массива data
          let tile = this.getTile(this.tLayer.data[i]);
          // вычисляем значения в пикселях
          let pX = (i % this.xCount) * this.tSize.x;
          let pY = Math.floor(i / this.xCount) * this.tSize.y;
          // не отрисовываем лишние
          if (!this.isVisible(pX, pY, this.tSize.x, this.tSize.y)) {
            continue;
          }
          // место куда будет помещен тайл
          // сдвигаем видимую зону
          pX -= this.view.x;
          pY -= this.view.y;
          // отрисовываем
          ctx.drawImage(tile.img, tile.px, tile.py, this.tSize.x, this.tSize.y, pX, pY, this.tSize.x, this.tSize.y);
        }
      }
    }
  },

  // возвращает блок
  getTile: function (tileIndex) {
    // блок
    let tile = {
      // изображение
      img: null,
      // координаты в изображении
      px: 0,
      py: 0,
    };
    // передаем цирфу из массива data
    let tileset = this.getTileset(tileIndex);
    // сохраняем изображение
    tile.img = tileset.image;
    // индекс блока
    let id = tileIndex - tileset.firstgid;
    // блок прямоугольный, остаток от деления = х
    let x = id % tileset.xCount;
    // округление дает y
    let y = Math.floor(id / tileset.xCount);
    // координаты в пикселях
    tile.px = x * mapManager.tSize.x;
    tile.py = y * mapManager.tSize.y;
    // возвращает блок
    return tile;
  },
  // получение блока по индексу
  getTileset(tileIndex) {
    // перебираем тайлы
    for (let i = mapManager.tilesets.length - 1; i >= 0; i--) {
      // если индекс первого блока меньше или равен искомому
      // mapManager.tilesets[i].firstgid число с которого начинается нумерация
      if (mapManager.tilesets[i].firstgid <= tileIndex)
        // возвращает блок из карты
        return mapManager.tilesets[i];
    }
    return null;
  },
  // проверяем на невидимую зону
  isVisible: function (x, y, width, height) {
    return !(x + width < this.view.x || y + height < this.view.y || x > this.view.x + this.view.w ||
        y > this.view.y + this.view.h);
  },
  // разбор объектов на карте
  parseEntities: function () {
    // если не загрузились
    if (!mapManager.imgLoaded || !mapManager.jsonLoaded) {
      setTimeout(function () {mapManager.parseEntities();}, 100);
    } else
      // перебераем все слои
      for (let j = 0; j < this.mapData.layers.length; j++) {
        // ищим слой объектов
        if (this.mapData.layers[j].type === "objectgroup") {
          let entities = this.mapData.layers[j];
          // перебираем слой объектов
          for (let i = 0; i < entities.objects.length; i++) {
            // создаем объекты
            let e = entities.objects[i];
            try {
              // создаем экземпляр объекта
              let obj = Object.create(gameManager.factory[e.type]);
              obj.name = e.name;
              obj.pos_x = e.x;
              obj.pos_y = e.y;
              obj.size_x = e.width;
              obj.size_y = e.height;
              // помещаем в массив объектов
              gameManager.entities.push(obj);
              if (obj.name === "player")
                // инициализируем параметры игрока
                gameManager.initPlayer(obj);
            } catch (ex) {
              console.log("((");
            }
          }
        }
      }
  },
  // возвращает цифру блока из массива data
  getTilesetIdx: function (x, y) {
    let idx = Math.floor(y / this.tSize.y) * this.xCount + Math.floor(x / this.tSize.x);
    return this.tLayer.data[idx];
  },
  // центрирование относительно положения игрока
  centerAt: function (x, y) {
    if (x < this.view.w / 2)
      this.view.x = 0;
    else if (x > this.mapSize.x - this.view.w / 2)
      this.view.x = this.mapSize.x - this.view.w;
    else
      this.view.x = x - this.view.w / 2;
    if (y < this.view.h / 2)
      this.view.y = 0;
    else if (y > this.mapSize.y - this.view.h / 2)
      this.view.y = this.mapSize.y - this.view.h;
    else
      this.view.y = y - this.view.h / 2;
  },
};