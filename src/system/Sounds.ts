import iSoundData from "./interfaces/iSoundData";

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
    this.sounds[name].muted = false;
    this.sounds[name].load();
  };

  loadSounds(soundsData: iSoundData[]): void {
    soundsData.forEach((soundData: iSoundData) => {
      sounds.load(soundData.name, soundData.volume, new Audio(soundData.source));
    });
  };

  play(name: string): void {
    if (this.soundsOn === true) {
      if (!this.sounds[name].ended) {
        const soundCopy: HTMLAudioElement = this.sounds[name].cloneNode() as HTMLAudioElement;
        soundCopy.volume = this.sounds[name].volume;
        const promise: Promise<void> = soundCopy.play();
        promise.then(() => {
          soundCopy.remove();
        });
      }
      this.sounds[name].play();
    }
  };

}

const sounds: Sounds = new Sounds();
export default sounds;