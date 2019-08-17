class Sounds {

  public sounds: { [index: string]: HTMLAudioElement } = {};
  public soundsOn: boolean = true;

  soundsSet(state: boolean): void {
    this.soundsOn = state;
  };

  soundsChange(): void {
    this.soundsOn = !this.soundsOn;
  };

  load(name: string, volume: number, audio: HTMLAudioElement) {
    this.sounds[name] = audio;
    this.sounds[name].volume = volume;
    this.sounds[name].load();
  };

  play(name: string): void {
    if (this.soundsOn === true)
      {
        if (!this.sounds[name].ended)
          {
            const ss: any = this.sounds[name].cloneNode();
            ss.volume = this.sounds[name].volume;
            ss.play();
          }
        this.sounds[name].play();
      }
  };

}

const sounds: Sounds = new Sounds();
export default sounds;