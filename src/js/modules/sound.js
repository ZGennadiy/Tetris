export default class Sound {
  static sounds = {
    'main': 'tetrisMain',
    'pause': 'pause',
    'rotate': 'blockRotate',
    'whoosh': 'whoosh',
    'fall': 'fall',
    'clear': 'clear',
    'gameover': 'gameover',
    'success': 'success'
  };


  constructor(parentNode
    //   , {
    //   main,
    //   pause,
    //   rotate,
    //   whoosh,
    //   fall,
    //   clear,
    //   gameover,
    //   success
    // }
  ) {
    this.parentNode = parentNode;

    const soundCol = Object.keys(Sound.sounds);
    soundCol.forEach(function (sound) {
      this.handleAudio(this.parentNode, Sound.sounds[sound]);
    }, this);
    // [main, pause, rotate, whoosh, fall, clear, gameover, success].forEach(function (sound) {
    //   this.handleAudio(this.parentNode, sound);
    // }, this);

  }

  getSoundState() {
    const soundState = {};
    soundState.isSoundOn = Boolean(JSON.parse(localStorage.getItem('isSoundOn')));
    soundState.isMusicOn = Boolean(JSON.parse(localStorage.getItem('isMusicOn')));

    return soundState;
  }

  getSound() {
    const soundtrack = {};
    const sounds = document.querySelectorAll('audio');
    sounds.forEach((sound) => {
      const name = sound.getAttribute('id').substring(6);
      soundtrack[name] = sound;
    });
    return soundtrack;
  }

  handleAudio(parent, sound) {
    const audio = document.createElement('audio');
    audio.setAttribute('id', `audio-${sound}`);

    if (sound.includes('Main')) {
      audio.setAttribute('loop', 'loop');
    }

    audio.setAttribute('preload', 'auto');

    const srcMp3 = document.createElement('source');
    srcMp3.setAttribute('src', `./sounds/${sound}.mp3`);
    srcMp3.setAttribute('type', 'audio/mpeg');

    const srcOgg = document.createElement('source');
    srcOgg.setAttribute('src', `./sounds/${sound}.ogg`);
    srcOgg.setAttribute('type', 'audio/ogg');

    audio.appendChild(srcMp3);
    audio.appendChild(srcOgg);

    parent.appendChild(audio);
  }
}