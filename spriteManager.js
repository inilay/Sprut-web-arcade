let spriteManager = {
    // рисунок с объектами
    image: new Image(),
    // массив объектов для отображения
    sprites: [],
    imgLoaded: false, 
    jsonLoaded: false,
    // загрузка данных
    loadAtlas: function (atlasJson, atlasImg) {
      let request = new XMLHttpRequest();
      request.onreadystatechange = function () {
        if (request.readyState === 4 && request.status === 200) {
          spriteManager.parseAtlas(request.responseText);
        }
      };
      request.open("GET", atlasJson, true);
      request.send();
      this.loadImg(atlasImg);
    },
    // загрузка изображения
    loadImg: function (imgName) {
      this.image.onload = function () {
        spriteManager.imgLoaded = true;
      };
      this.image.src = imgName;
    },
    // парсим атлас
    parseAtlas: function (atlasJSON) {
      let atlas = JSON.parse(atlasJSON);
        for (let i = 0; i < atlas.length; i++) {
          let frame = atlas[i];
          this.sprites.push({name: frame.name, x: frame.x, y: frame.y, w: frame.width, h: frame.height});
      }
      this.jsonLoaded = true;
    },

    drawSprite: function (ctx, name, x, y) {
      // если не удалось загрузить
      if (!this.imgLoaded || !this.jsonLoaded) {
        setTimeout(() => {
          spriteManager.drawSprite(ctx, name, x, y);
        }, 100);
      }
      else {
        let sprite = this.getSprite(name);
        // не рисуем за пределами видимой зоны
        if (!mapManager.isVisible(x, y, sprite.w, sprite.h)) {
            return;
        }
        // сдвигаем видимую зону
        x -= mapManager.view.x;
        y -= mapManager.view.y;
        // отрисовываем
        ctx.drawImage(this.image, sprite.x, sprite.y, sprite.w, sprite.h, x, y, sprite.w, sprite.h);
      }
    },
    // возвращает спрайт по имени
    getSprite: function (name) {
      for (let i = 0; i < this.sprites.length; i++) {
        let s = this.sprites[i];
        // нашли совпадение
        if (s.name === name) {
          return s;
        }
      }
      return null;
    },
  };