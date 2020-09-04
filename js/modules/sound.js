var Sound = /*#__PURE__*/function () {
  function Sound(parentNode) {
    this.parentNode = parentNode;
    var soundCol = Object.keys(Sound.sounds);
    soundCol.forEach(function (sound) {
      this.handleAudio(this.parentNode, Sound.sounds[sound]);
    }, this);
  }

  var _proto = Sound.prototype;

  _proto.getSoundState = function getSoundState() {
    var soundState = {};
    soundState.isSoundOn = Boolean(JSON.parse(localStorage.getItem('isSoundOn')));
    soundState.isMusicOn = Boolean(JSON.parse(localStorage.getItem('isMusicOn')));
    return soundState;
  };

  _proto.getSound = function getSound() {
    var soundtrack = {};
    var sounds = document.querySelectorAll('audio');
    sounds.forEach(function (sound) {
      var name = sound.getAttribute('id').substring(6);
      soundtrack[name] = sound;
    });
    return soundtrack;
  };

  _proto.handleAudio = function handleAudio(parent, sound) {
    var audio = document.createElement('audio');
    audio.setAttribute('id', "audio-" + sound);

    if (sound.includes('Main')) {
      audio.setAttribute('loop', 'loop');
    }

    audio.setAttribute('preload', 'auto');
    var srcMp3 = document.createElement('source');
    srcMp3.setAttribute('src', "./sounds/" + sound + ".mp3");
    srcMp3.setAttribute('type', 'audio/mpeg');
    var srcOgg = document.createElement('source');
    srcOgg.setAttribute('src', "./sounds/" + sound + ".ogg");
    srcOgg.setAttribute('type', 'audio/ogg');
    audio.appendChild(srcMp3);
    audio.appendChild(srcOgg);
    parent.appendChild(audio);
  };

  return Sound;
}();

Sound.sounds = {
  'main': 'tetrisMain',
  'pause': 'pause',
  'rotate': 'blockRotate',
  'whoosh': 'whoosh',
  'fall': 'fall',
  'clear': 'clear',
  'gameover': 'gameover',
  'success': 'success'
};
export { Sound as default };