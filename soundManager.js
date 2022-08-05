let soundManager = {
  // звуковые эффекты
  clips: {},
  // аудиоконтекст
  context: null,
  // главный узел
  gainNode: null,
  // чек загрузки
  loaded: false,
  // инициализация менеджера звука
  init: function () {
    this.context = new AudioContext();
    this.gainNode = this.context.createGain ?
        this.context.createGain() : this.context.createGainNode();
    // подключение к динамикам
    this.gainNode.connect(this.context.destination);
  },
  // загрузка аудиофайла
  load: function (path, callback) {
    // проверяем что все загруженно
    if (this.clips[path]) {
      // вызываем загруженное
      callback(this.clips[path]);
      return;
    }
    // клип буффер
    let clip = {path: path, buffer: null, loaded: false};
    clip.play = function (volume, loop) {
      soundManager.play(path, {looping: loop ? loop : false,
        volume: volume ? volume : 1,
      });
    };
    this.clips[path] = clip;
    let request = new XMLHttpRequest();
    request.open("GET", path, true);
    request.responseType = "arraybuffer";
    request.onload = function () {
      soundManager.context.decodeAudioData(request.response,
          function (buffer) {
        clip.buffer = buffer;
        clip.loaded = true;
        callback(clip);
      });
    };
    request.send();
  },
  // загрузка массива звуков
  loadArray: function (array) {
    for (let i = 0; i < array.length; i++) {
      soundManager.load(array[i], function () {
        if (array.length === Object.keys(soundManager.clips).length) {
          for (let sd in soundManager.clips)
            if (!soundManager.clips[sd].loaded) return;
          soundManager.loaded = true;
        }
      });
    }
  },
  // проигрывание файла
  play: function (path, settings) {
    if (!soundManager.loaded) {
      setTimeout(() => soundManager.play(path, settings), 1000);
      return;
    }

    let looping = false;
    let volume = 1;
    // если настройки были поменяны
    if (settings) {
      if (settings.looping)
        looping = settings.looping;
      if (settings.volume)
        volume = settings.volume;
    }
    let sd = this.clips[path];
    // получаем звуковой эффект
    if (sd === null)
      return false;
    let sound = soundManager.context.createBufferSource();
    sound.buffer = sd.buffer;
    sound.connect(soundManager.gainNode);
    sound.loop = looping;
    soundManager.gainNode.gain.value = volume;
    sound.start(0);
    return true;
  },

};