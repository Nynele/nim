'use client';

class LofiSynth {
  private ctx: AudioContext;
  private analyser: AnalyserNode;
  private isPlaying = false;
  private sequenceIntervalId: any = null;
  private bassOscs: OscillatorNode[] = [];
  private padOscs: OscillatorNode[] = [];
  private gainNode: GainNode;
  private filterNode: BiquadFilterNode;
  private noiseNode: ScriptProcessorNode | null = null;
  private delayNode: DelayNode;
  private feedbackNode: GainNode;
  private chordIndex = 0;
  private volume = 0.8; // Added volume control field

  // Chord progression (Dm9 - Am7 - Bbmaj7 - C7)
  private chords = [
    [73.42, 174.61, 220.00, 261.63, 329.63],   // Dm9: D2, F3, A3, C4, E4
    [110.00, 130.81, 164.81, 196.00, 261.63], // Am7: A2, C3, E3, G3, C4
    [116.54, 146.83, 174.61, 220.00, 293.66], // Bbmaj7: Bb2, D3, F3, A3, D4
    [65.41, 164.81, 196.00, 233.08, 329.63]   // C7: C2, E3, G3, Bb3, E4
  ];

  constructor(ctx: AudioContext, analyser: AnalyserNode) {
    this.ctx = ctx;
    this.analyser = analyser;

    // Main gain and lowpass filter for lofi warmth
    this.gainNode = this.ctx.createGain();
    this.gainNode.gain.setValueAtTime(0.0, this.ctx.currentTime);

    this.filterNode = this.ctx.createBiquadFilter();
    this.filterNode.type = 'lowpass';
    this.filterNode.frequency.setValueAtTime(550, this.ctx.currentTime); // muffled underwater sound

    // Delay/echo effect for spacey vibe
    this.delayNode = this.ctx.createDelay();
    this.delayNode.delayTime.setValueAtTime(0.4, this.ctx.currentTime);
    this.feedbackNode = this.ctx.createGain();
    this.feedbackNode.gain.setValueAtTime(0.4, this.ctx.currentTime);

    // Connect nodes
    this.gainNode.connect(this.filterNode);
    this.filterNode.connect(this.analyser);
    this.filterNode.connect(this.delayNode);
    this.delayNode.connect(this.feedbackNode);
    this.feedbackNode.connect(this.delayNode);
    this.feedbackNode.connect(this.analyser);
  }

  public setVolume(vol: number) {
    this.volume = vol;
    if (this.isPlaying) {
      this.gainNode.gain.setTargetAtTime(0.65 * this.volume, this.ctx.currentTime, 0.1);
    }
  }

  public start() {
    if (this.isPlaying) return;
    this.isPlaying = true;

    // Fade in main volume based on current volume setting
    this.gainNode.gain.setTargetAtTime(0.65 * this.volume, this.ctx.currentTime, 1.5);

    // Start sequence loop
    this.chordIndex = 0;
    this.playNextChord();
    this.startSequencer();
    this.startCrackleNoise();
  }

  public stop() {
    if (!this.isPlaying) return;
    this.isPlaying = false;

    // Fade out main volume
    this.gainNode.gain.setTargetAtTime(0.0, this.ctx.currentTime, 0.5);

    // Stop loops
    if (this.sequenceIntervalId) {
      clearInterval(this.sequenceIntervalId);
      this.sequenceIntervalId = null;
    }
    
    // Stop active oscillators
    this.stopActiveOscillators();
    
    if (this.noiseNode) {
      this.noiseNode.disconnect();
      this.noiseNode = null;
    }
  }

  private stopActiveOscillators() {
    this.bassOscs.forEach(o => { try { o.stop(); } catch(e){} });
    this.padOscs.forEach(o => { try { o.stop(); } catch(e){} });
    this.bassOscs = [];
    this.padOscs = [];
  }

  private startSequencer() {
    let step = 0;

    this.sequenceIntervalId = setInterval(() => {
      if (!this.isPlaying) return;
      
      step = (step + 1) % 5;
      if (step === 0) {
        this.chordIndex = (this.chordIndex + 1) % this.chords.length;
        this.playNextChord();
      }

      // Play soft drum kick on beat 1 and 3 (every 2.5 seconds roughly)
      if (step === 0 || step === 2) {
        this.playKick();
      }
      
      // Play a soft rimshot on beat 2 and 4
      if (step === 1 || step === 3) {
        this.playRimshot();
      }

      // Generative solo note: 30% chance to play a random pentatonic melody note
      if (Math.random() < 0.4) {
        this.playMelodyNote();
      }
    }, 1200); // Sequence speed
  }

  private playNextChord() {
    const now = this.ctx.currentTime;
    
    // Fade out and clean old oscillators
    const oldPadOscs = [...this.padOscs];
    const oldBassOscs = [...this.bassOscs];
    
    this.padOscs = [];
    this.bassOscs = [];

    const chord = this.chords[this.chordIndex];
    
    // Bass note
    const bassFreq = chord[0];
    const bassOsc = this.ctx.createOscillator();
    const bassGain = this.ctx.createGain();
    
    bassOsc.type = 'triangle';
    bassOsc.frequency.setValueAtTime(bassFreq, now);
    
    bassGain.gain.setValueAtTime(0, now);
    bassGain.gain.linearRampToValueAtTime(0.35, now + 1.5);
    bassGain.gain.setValueAtTime(0.35, now + 5.0);
    bassGain.gain.exponentialRampToValueAtTime(0.001, now + 6.0);

    bassOsc.connect(bassGain);
    bassGain.connect(this.gainNode);
    bassOsc.start(now);
    this.bassOscs.push(bassOsc);

    // Pad notes (the chord tones, played on triangle oscillators)
    for (let i = 1; i < chord.length; i++) {
      const freq = chord[i];
      const detune = (Math.random() - 0.5) * 8; // detune in cents
      
      const osc = this.ctx.createOscillator();
      const padGain = this.ctx.createGain();
      
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, now);
      osc.detune.setValueAtTime(detune, now);
      
      // Add vibrato/warble LFO
      const lfo = this.ctx.createOscillator();
      const lfoGain = this.ctx.createGain();
      lfo.frequency.value = 4.5 + Math.random();
      lfoGain.gain.value = 5.0;
      
      lfo.connect(lfoGain);
      lfoGain.connect(osc.detune);
      lfo.start(now);
      
      padGain.gain.setValueAtTime(0, now);
      padGain.gain.linearRampToValueAtTime(0.18, now + 1.2 + Math.random() * 0.5);
      padGain.gain.setValueAtTime(0.18, now + 4.8);
      padGain.gain.exponentialRampToValueAtTime(0.001, now + 6.0);
      
      osc.connect(padGain);
      padGain.connect(this.gainNode);
      
      osc.start(now);
      this.padOscs.push(osc);
      
      // Cleanup vibrato
      setTimeout(() => {
        try { lfo.stop(); } catch(e){}
      }, 6000);
    }

    // Stop old oscillators after fade out
    setTimeout(() => {
      oldPadOscs.forEach(o => { try { o.stop(); } catch(e){} });
      oldBassOscs.forEach(o => { try { o.stop(); } catch(e){} });
    }, 1500);
  }

  private playKick() {
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(110, now);
    osc.frequency.exponentialRampToValueAtTime(0.01, now + 0.15);

    gain.gain.setValueAtTime(0.40, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);

    osc.connect(gain);
    gain.connect(this.analyser); // Bypasses LP filter for full punch
    
    osc.start(now);
    osc.stop(now + 0.3);
  }

  private playRimshot() {
    const now = this.ctx.currentTime;
    const bufferSize = this.ctx.sampleRate * 0.04;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }
    
    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;
    
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.value = 1000;
    filter.Q.value = 4.0;

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.08, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.analyser);

    noise.start(now);
    noise.stop(now + 0.05);
  }

  private playMelodyNote() {
    const now = this.ctx.currentTime;
    // D minor pentatonic scale
    const scale = [293.66, 349.23, 392.00, 440.00, 523.25, 587.33, 698.46];
    const freq = scale[Math.floor(Math.random() * scale.length)];

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, now);

    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(0.07, now + 0.15);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 1.5);

    osc.connect(gain);
    gain.connect(this.filterNode);
    
    osc.start(now);
    osc.stop(now + 1.6);
  }

  private startCrackleNoise() {
    if (typeof window === 'undefined') return;
    const now = this.ctx.currentTime;
    const bufferSize = 4096;
    
    try {
      this.noiseNode = this.ctx.createScriptProcessor(bufferSize, 1, 1);
      this.noiseNode.onaudioprocess = (e) => {
        const output = e.outputBuffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
          let crackle = 0;
          if (Math.random() < 0.00015) {
            crackle = (Math.random() * 2 - 1) * 0.15;
          }
          const hiss = (Math.random() * 2 - 1) * 0.015;
          output[i] = hiss + crackle;
        }
      };

      const noiseFilter = this.ctx.createBiquadFilter();
      noiseFilter.type = 'bandpass';
      noiseFilter.frequency.value = 1000;
      noiseFilter.Q.value = 0.5;

      const noiseGain = this.ctx.createGain();
      noiseGain.gain.setValueAtTime(0.08, now);

      this.noiseNode.connect(noiseFilter);
      noiseFilter.connect(noiseGain);
      noiseGain.connect(this.analyser);
    } catch(err) {
      console.warn("ScriptProcessorNode failed:", err);
    }
  }
}

export class AudioManager {
  private static instance: AudioManager | null = null;
  
  public audio: HTMLAudioElement | null = null;
  public audioContext: AudioContext | null = null;
  public analyser: AnalyserNode | null = null;
  public dataArray: Uint8Array = new Uint8Array(0);
  
  private source: MediaElementAudioSourceNode | null = null;
  private lofiSynth: LofiSynth | null = null;
  private isInitialized = false;

  public youtubeVideoId: string | null = null;
  private discordSyncIntervalId: any = null;
  private youtubeSearchOffset = 0;
  public currentBpm = 95;
  public coverUrl: string | null = null;
  public coverColors: { primary: string; secondary: string } | null = null;
  public youtubeCurrentTime = 0;
  public lastYoutubeTimeUpdate = 0;
  public volume = 80;
  private loadedPlaylistQuery: string | null = null;

  public labels = {
    syncing:          'Syncing with Discord...',
    connecting:       'Connecting to Discord presence...',
    searchingAlt:     (n: number) => `Searching alternate version #${n}...`,
    searching:        (t: string) => `Searching "${t}" on YouTube...`,
    ytmSynced:        'Synced with YouTube Music',
    ytmAlt:           (n: number) => `YTM (Alt Version #${n})`,
    spotifySynced:    'Synced with Spotify',
    spotifyAlt:       (n: number) => `Spotify (Alt Version #${n})`,
    albumSynced:      'Most Listened Album',
    albumAlt:         (n: number) => `Album (Alt Version #${n})`,
    noMusicTitle:     'No Music Detected',
    noMusicArtist:    'Open Spotify or YouTube Music on Discord',
    searchFailed:     'Failed to find song on YouTube',
    syncErrorTitle:   'Sync Error',
    syncErrorArtist:  'Failed to sync with Discord',
  };

  // Tracks which simple string label key is currently shown as tracks[0].artist
  private currentArtistLabelKey: string | null = null;

  public setLabels(labels: Partial<typeof this.labels>) {
    Object.assign(this.labels, labels);
    // Immediately re-apply the active label so the widget reflects the new language
    if (this.currentArtistLabelKey) {
      const val = (this.labels as any)[this.currentArtistLabelKey];
      if (typeof val === 'string') {
        this.tracks[0].artist = val;
        this.notifyListeners();
      }
    }
  }

  public tracks: {
    id: string;
    title: string;
    artist: string;
    url: string;
    youtubeVideoId?: string | null;
  }[] = [
    {
      id: 'live',
      title: 'Live Discord Music',
      artist: 'Syncing with Discord...',
      url: '',
      youtubeVideoId: null
    }
  ];
  public currentTrackIndex = 0;
  public isPlaying = false; // Starts paused on mount
  public previousDiscordTrack: { title: string; artist: string; coverUrl: string | null; youtubeVideoId: string | null } | null = null;

  private archiveLiveTrack(newTitle: string) {
    const oldTitle = this.tracks[0]?.title;
    if (!oldTitle || oldTitle === newTitle) return;

    const oldArtist = this.tracks[0]?.artist;
    const oldCoverUrl = this.coverUrl;
    const oldYoutubeVideoId = this.youtubeVideoId;

    const isOldTitleValid = oldTitle !== 'Live Discord Music' &&
      oldTitle !== 'Syncing...' &&
      oldTitle !== 'Syncing with Discord...' &&
      oldTitle !== this.labels.noMusicTitle &&
      oldTitle !== this.labels.syncErrorTitle &&
      oldTitle !== 'Search Failed' &&
      oldTitle !== 'Connecting to Discord presence...';

    if (isOldTitleValid) {
      this.previousDiscordTrack = {
        title: oldTitle,
        artist: oldArtist || '',
        coverUrl: oldCoverUrl,
        youtubeVideoId: oldYoutubeVideoId
      };
      this.saveCache();
      this.notifyListeners();
    }
  }
  
  private listeners: (() => void)[] = [];

  private constructor() {
    if (typeof window !== 'undefined') {
      try {
        const savedVolume = localStorage.getItem('portfolio_audio_volume');
        if (savedVolume !== null) {
          const parsed = parseInt(savedVolume, 10);
          if (!isNaN(parsed)) {
            this.volume = parsed;
          }
        }
      } catch (e) {
        console.warn("Failed to load volume setting:", e);
      }

      this.audio = new Audio();
      this.audio.crossOrigin = "anonymous";
      this.audio.volume = this.volume / 100;
      
      // Load cached track info and cover colors immediately to prevent flashes on reload
      try {
        const cached = localStorage.getItem('portfolio-music-cache');
        if (cached) {
          const cacheData = JSON.parse(cached);
          if (cacheData) {
            if (cacheData.title) this.tracks[0].title = cacheData.title;
            if (cacheData.artist) this.tracks[0].artist = cacheData.artist;
            if (cacheData.youtubeVideoId) this.youtubeVideoId = cacheData.youtubeVideoId;
            if (cacheData.coverUrl) this.coverUrl = cacheData.coverUrl;
            if (cacheData.coverColors) {
              this.coverColors = cacheData.coverColors;
              this.updateThemeColors(cacheData.coverColors.primary, cacheData.coverColors.secondary);
            }
            if (cacheData.previousDiscordTrack) {
              this.previousDiscordTrack = cacheData.previousDiscordTrack;
            }
          }
        }
      } catch (e) {
        console.warn("Failed to load cached music data:", e);
      }
      
      this.audio.addEventListener('play', () => {
        this.isPlaying = true;
        this.notifyListeners();
      });
      this.audio.addEventListener('pause', () => {
        this.isPlaying = false;
        this.notifyListeners();
      });
      this.audio.addEventListener('ended', () => {
        this.nextTrack();
      });
      this.audio.addEventListener('error', (e) => {
        console.warn("Audio element error, ignoring since we use YouTube embed:", e);
      });

      // Listen for message events from YouTube iframe player
      window.addEventListener('message', (event) => {
        if (!event.origin.includes('youtube.com') && !event.origin.includes('youtube-nocookie.com')) return;
        try {
          let data = event.data;
          if (typeof data === 'string') {
            data = JSON.parse(data);
          }
          if (data && data.event === 'infoDelivery' && data.info) {
            if (typeof data.info.currentTime === 'number') {
              this.youtubeCurrentTime = data.info.currentTime;
              this.lastYoutubeTimeUpdate = Date.now();
            }
            if (typeof data.info.playerState === 'number') {
              const state = data.info.playerState;
              if (state === 0) {
                // Video ended, skip to next search offset
                this.nextTrack();
              } else {
                const newIsPlaying = (state === 1 || state === 3);
                if (this.isPlaying !== newIsPlaying) {
                  this.isPlaying = newIsPlaying;
                  this.notifyListeners();
                }
              }
            }
          }
        } catch (e) {
          // Ignore non-JSON or other postMessage errors
        }
      });

      // Listen for theme changes to recalculate cover colors with proper contrast
      try {
        const observer = new MutationObserver((mutations) => {
          mutations.forEach((mutation) => {
            if (mutation.attributeName === 'data-mui-color-scheme') {
              if (this.coverColors) {
                this.updateThemeColors(this.coverColors.primary, this.coverColors.secondary);
              }
            }
          });
        });
        observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-mui-color-scheme'] });
      } catch (e) {
        console.warn("Theme observer registration failed:", e);
      }
    }
  }

  public static getInstance(): AudioManager {
    if (!AudioManager.instance) {
      AudioManager.instance = new AudioManager();
    }
    return AudioManager.instance;
  }

  public initialize() {
    if (this.isInitialized || typeof window === 'undefined') return;

    try {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      this.audioContext = new AudioContextClass();
      this.analyser = this.audioContext.createAnalyser();
      this.analyser.fftSize = 64; // Small bin size for faster response
      
      const bufferLength = this.analyser.frequencyBinCount;
      this.dataArray = new Uint8Array(bufferLength);
      
      // Initialize synth
      this.lofiSynth = new LofiSynth(this.audioContext, this.analyser);
      this.lofiSynth.setVolume(this.volume / 100);
      
      // Connect standard Audio node
      if (this.audio) {
        this.source = this.audioContext.createMediaElementSource(this.audio);
        this.source.connect(this.analyser);
      }
      
      // Connect analyser to speakers
      this.analyser.connect(this.audioContext.destination);
      
      this.isInitialized = true;
    } catch (e) {
      console.error("AudioManager initialization error:", e);
    }
  }

  public play() {
    if (typeof window === 'undefined') return;
    this.initialize();
    
    if (this.audioContext && this.audioContext.state === 'suspended') {
      this.audioContext.resume();
    }
    
    if (this.youtubeVideoId) {
      this.isPlaying = true;
      this.notifyListeners();
      if (this.lofiSynth) this.lofiSynth.stop();
      if (this.audio) this.audio.pause();
      
      // Send postMessage command to play YouTube video inside the iframe
      const iframe = document.getElementById('yt-player') as HTMLIFrameElement;
      iframe?.contentWindow?.postMessage(JSON.stringify({ event: 'command', func: 'playVideo' }), '*');
      iframe?.contentWindow?.postMessage(JSON.stringify({ event: 'command', func: 'setVolume', args: [this.volume] }), '*');
    } else {
      this.isPlaying = false;
      this.notifyListeners();
    }
    
    // Start polling for live updates
    this.startDiscordSyncPolling();
  }

  public pause() {
    this.isPlaying = false;
    this.notifyListeners();
    
    if (this.lofiSynth) {
      this.lofiSynth.stop();
    }
    if (this.audio) {
      this.audio.pause();
    }

    // Pause YouTube Player
    if (typeof window !== 'undefined') {
      const iframe = document.getElementById('yt-player') as HTMLIFrameElement;
      iframe?.contentWindow?.postMessage(JSON.stringify({ event: 'command', func: 'pauseVideo' }), '*');
    }

    // Stop live polling when paused
    this.stopDiscordSyncPolling();
  }

  public togglePlay() {
    if (this.isPlaying) {
      this.pause();
    } else {
      this.play();
    }
  }

  public setVolume(vol: number) {
    this.volume = vol;
    if (typeof window !== 'undefined') {
      localStorage.setItem('portfolio_audio_volume', String(vol));
    }
    if (this.audio) {
      this.audio.volume = vol / 100;
    }
    if (this.lofiSynth) {
      this.lofiSynth.setVolume(vol / 100);
    }
    if (typeof window !== 'undefined') {
      const iframe = document.getElementById('yt-player') as HTMLIFrameElement;
      iframe?.contentWindow?.postMessage(JSON.stringify({ event: 'command', func: 'setVolume', args: [vol] }), '*');
    }
    this.notifyListeners();
  }

  public setTrack(index: number) {
    if (index < 0 || index >= this.tracks.length) return;
    const wasPlaying = this.isPlaying;
    this.pause();
    
    this.currentTrackIndex = index;
    
    // If it's a playlist track, it has a videoId
    const track = this.tracks[index];
    if (track.youtubeVideoId) {
      this.youtubeVideoId = track.youtubeVideoId;
    }
    
    this.notifyListeners();
    
    if (wasPlaying) {
      this.play();
    }
  }

  public nextTrack() {
    if (this.tracks.length > 1) {
      // Go to next track in playlist
      this.currentTrackIndex = (this.currentTrackIndex + 1) % this.tracks.length;
      const track = this.tracks[this.currentTrackIndex];
      this.youtubeVideoId = track.youtubeVideoId || null;
      this.notifyListeners();
      if (this.isPlaying) {
        setTimeout(() => this.play(), 100);
      }
    } else {
      // Cycle search offset from 0 to 4 to skip to next search results (different versions/videos of the song)
      this.youtubeSearchOffset = (this.youtubeSearchOffset + 1) % 5;
      this.syncDiscordMusic(false);
    }
  }

  public prevTrack() {
    if (this.tracks.length > 1) {
      // Go to previous track in playlist
      this.currentTrackIndex = (this.currentTrackIndex - 1 + this.tracks.length) % this.tracks.length;
      const track = this.tracks[this.currentTrackIndex];
      this.youtubeVideoId = track.youtubeVideoId || null;
      this.notifyListeners();
      if (this.isPlaying) {
        setTimeout(() => this.play(), 100);
      }
    }
  }

  public resetSearchOffset() {
    this.youtubeSearchOffset = 0;
    this.syncDiscordMusic(false);
  }

  private startDiscordSyncPolling() {
    if (typeof window === 'undefined') return;
    if (this.discordSyncIntervalId) return;

    this.discordSyncIntervalId = setInterval(() => {
      if (this.tracks[0]?.id === 'live' && this.isPlaying) {
        this.syncDiscordMusic(true);
      }
    }, 15000); // Check every 15 seconds
  }

  private stopDiscordSyncPolling() {
    if (this.discordSyncIntervalId) {
      clearInterval(this.discordSyncIntervalId);
      this.discordSyncIntervalId = null;
    }
  }

  public async syncDiscordMusic(silent = false) {
    if (typeof window === 'undefined') return;

    const DISCORD_ID = '799251427839049818';
    if (!silent && this.loadedPlaylistQuery === null) {
      this.tracks[0].artist = this.labels.connecting;
      this.notifyListeners();
    }

    try {
      const res = await fetch(`https://api.lanyard.rest/v1/users/${DISCORD_ID}`);
      const json = await res.json();
      
      if (json.success && json.data) {
        const data = json.data;
        let query = '';
        let songTitle = '';
        let isYTM = false;
        let detailsUrl = '';
        let largeImage = '';
        let artistName = '';
        
        // 1. Check YouTube Music custom activity
        const ytActivity = data.activities?.find((a: any) => a.name === 'YouTube Music');
        // 2. Check Spotify activity
        const spotifyActive = data.listening_to_spotify && data.spotify;
        
        // 3. Find live "Most Listened Album" activity if present
        const liveMostListened = data.activities?.find((a: any) => a.name === 'Most Listened Album');
        
        // Cache the live "Most Listened Album" activity in localStorage when it is active
        if (liveMostListened && liveMostListened.details && typeof window !== 'undefined') {
          try {
            localStorage.setItem('portfolio-most-listened-cache', JSON.stringify({
              activity: liveMostListened,
              timestamp: Date.now()
            }));
          } catch (e) {
            console.warn("Failed to cache most listened album:", e);
          }
        }

        // Check "Most Listened Album" activity as a fallback (live first, then cached up to 24h)
        let mostListenedActivity = (ytActivity || spotifyActive)
          ? null
          : liveMostListened;

        if (!ytActivity && !spotifyActive && !mostListenedActivity && typeof window !== 'undefined') {
          try {
            const cachedStr = localStorage.getItem('portfolio-most-listened-cache');
            if (cachedStr) {
              const cached = JSON.parse(cachedStr);
              // Valid for 24 hours
              if (cached && cached.activity && (Date.now() - cached.timestamp < 24 * 60 * 60 * 1000)) {
                mostListenedActivity = cached.activity;
              }
            }
          } catch (e) {
            console.warn("Failed to retrieve cached most listened album:", e);
          }
        }

        if (mostListenedActivity && mostListenedActivity.details) {
          const mlQuery = mostListenedActivity.details;
          if (this.loadedPlaylistQuery === mlQuery) {
            // Already playing this playlist/album. Keep playing.
            return;
          }
        }

        if (ytActivity) {
          songTitle = ytActivity.details || 'YouTube Music Track';
          query = `${ytActivity.details || ''} ${ytActivity.state || ''}`.trim();
          isYTM = true;
          detailsUrl = ytActivity.details_url || '';
          largeImage = ytActivity.assets?.large_image || '';
          artistName = ytActivity.state || '';
        } 
        else if (spotifyActive) {
          songTitle = data.spotify.song;
          query = `${data.spotify.song} ${data.spotify.artist}`;
          artistName = data.spotify.artist;
        }
        else if (mostListenedActivity && mostListenedActivity.details) {
          songTitle = mostListenedActivity.details;
          let parsedArtistName = mostListenedActivity.state || '';
          
          if (parsedArtistName.toLowerCase().startsWith('by ')) {
            parsedArtistName = parsedArtistName.substring(3).trim();
          }
          
          if (!parsedArtistName) {
            const parts = songTitle.split(' - ');
            if (parts.length > 1) {
              parsedArtistName = parts[1].trim();
            }
          }
          
          artistName = parsedArtistName;
          query = `${songTitle} ${artistName}`.trim();
        }
        
        if (query) {
          // If "Most Listened Album" is active, search for and load the playlist
          if (mostListenedActivity && mostListenedActivity.details) {
            const loaded = await this.searchAndLoadPlaylist(query, artistName);
            if (loaded) {
              if (this.tracks[0]) {
                this.currentBpm = this.guessBpm(this.tracks[0].title, this.tracks[0].artist);
              }
              if (this.isPlaying) {
                const wasLofi = this.youtubeVideoId === null;
                if (wasLofi && this.lofiSynth) {
                  this.lofiSynth.stop();
                }
                setTimeout(() => this.play(), 100);
              }
              return;
            }
          }

          // If we had a loaded playlist but now we are playing a single track, clear it
          if (this.loadedPlaylistQuery !== null) {
            this.loadedPlaylistQuery = null;
            this.tracks = [
              {
                id: 'live',
                title: songTitle,
                artist: 'Syncing with Discord...',
                url: ''
              }
            ];
            this.currentTrackIndex = 0;
          }

          // If songTitle changed, reset search offset and update BPM!
          if (this.tracks[0].title !== songTitle) {
            this.archiveLiveTrack(songTitle);
            this.youtubeSearchOffset = 0;
            
            // Set initial guessed BPM immediately
            this.currentBpm = this.guessBpm(songTitle, artistName);
            
            // Asynchronously fetch exact BPM
            this.fetchSongBpm(songTitle, artistName).then(bpm => {
              if (bpm) {
                this.currentBpm = bpm;
                this.notifyListeners();
              }
            });
          }

          // Resolve cover art URL
          let resolvedCoverUrl = '';
          if (ytActivity && largeImage) {
            if (largeImage.startsWith('mp:external/')) {
              resolvedCoverUrl = largeImage.replace('mp:external/', 'https://media.discordapp.net/external/');
            } else {
              resolvedCoverUrl = `https://cdn.discordapp.com/app-assets/${ytActivity.application_id}/${largeImage}.png`;
            }
          } else if (spotifyActive && data.spotify.album_art_url) {
            resolvedCoverUrl = data.spotify.album_art_url;
          } else if (mostListenedActivity) {
            const img = mostListenedActivity.assets?.large_image;
            if (img) {
              if (img.startsWith('mp:external/')) {
                resolvedCoverUrl = img.replace('mp:external/', 'https://media.discordapp.net/external/');
              } else {
                resolvedCoverUrl = `https://cdn.discordapp.com/app-assets/${mostListenedActivity.application_id}/${img}.png`;
              }
            }
          }

          if (resolvedCoverUrl && this.coverUrl !== resolvedCoverUrl) {
            this.coverUrl = resolvedCoverUrl;
            this.extractColors(resolvedCoverUrl).then(colors => {
              if (colors) {
                this.coverColors = colors;
                this.updateThemeColors(colors.primary, colors.secondary);
                this.saveCache();
                this.notifyListeners();
              }
            });
          }

          // If silent mode and the title is exactly the same, skip updating to avoid resetting iframe
          if (silent && this.tracks[0].title === songTitle && this.youtubeVideoId) {
            return;
          }

          this.tracks[0].title = songTitle;
          
          const artistLabel = isYTM
            ? (this.youtubeSearchOffset > 0 ? this.labels.ytmAlt(this.youtubeSearchOffset + 1) : this.labels.ytmSynced)
            : (spotifyActive
                ? (this.youtubeSearchOffset > 0 ? this.labels.spotifyAlt(this.youtubeSearchOffset + 1) : this.labels.spotifySynced)
                : (this.youtubeSearchOffset > 0 ? this.labels.albumAlt(this.youtubeSearchOffset + 1) : this.labels.albumSynced));

          if (!silent) {
            this.tracks[0].artist = this.youtubeSearchOffset > 0
              ? this.labels.searchingAlt(this.youtubeSearchOffset + 1)
              : this.labels.searching(songTitle);
            this.notifyListeners();
          }

          // Try to extract the YouTube videoId directly from details_url or assets (only if offset is 0)
          let extractedVideoId = '';
          if (isYTM && this.youtubeSearchOffset === 0) {
            if (detailsUrl) {
              const urlMatch = detailsUrl.match(/[?&]v=([^&#]+)/);
              if (urlMatch) {
                extractedVideoId = urlMatch[1];
              } else {
                const embedMatch = detailsUrl.match(/(?:embed\/|v\/|vi\/|youtu\.be\/|youtube\.com\/watch\?v=|youtube\.com\/watch\?.+&v=)([^&#\?]+)/);
                if (embedMatch) {
                  extractedVideoId = embedMatch[1];
                }
              }
            }
            if (!extractedVideoId && largeImage) {
              const imgMatch = largeImage.match(/vi\/([a-zA-Z0-9_-]+)/);
              if (imgMatch) {
                extractedVideoId = imgMatch[1];
              }
            }
          }

          if (extractedVideoId) {
            this.youtubeVideoId = extractedVideoId;
            this.tracks[0].artist = artistName || artistLabel;
            this.currentArtistLabelKey = artistName ? null : (isYTM ? 'ytmSynced' : (spotifyActive ? 'spotifySynced' : 'albumSynced'));
            this.saveCache();
            this.notifyListeners();
            if (this.isPlaying) {
              if (this.lofiSynth) this.lofiSynth.stop();
              setTimeout(() => this.play(), 100);
            }
          } else {
            // Fallback to keyless Invidious search
            const videoId = await this.searchYouTubeTrack(query, this.youtubeSearchOffset);
            if (videoId) {
              this.youtubeVideoId = videoId;
              this.tracks[0].artist = artistName || artistLabel;
              this.currentArtistLabelKey = artistName ? null : (isYTM ? 'ytmSynced' : (spotifyActive ? 'spotifySynced' : 'albumSynced'));
              this.saveCache();
              this.notifyListeners();
              if (this.isPlaying) {
                if (this.lofiSynth) this.lofiSynth.stop();
                setTimeout(() => this.play(), 100);
              }
            } else {
              this.archiveLiveTrack('Search Failed');
              this.tracks[0].title = 'Search Failed';
              this.tracks[0].artist = this.labels.searchFailed;
              this.currentArtistLabelKey = 'searchFailed';
              this.saveCache();
              this.notifyListeners();
            }
          }
        } else {
          // Keep playing the current music if it's already active and valid, even if presence disappears
          const currentTitle = this.tracks[0]?.title;
          const isCurrentTrackValid = currentTitle &&
            currentTitle !== 'Live Discord Music' &&
            currentTitle !== 'Syncing...' &&
            currentTitle !== 'Syncing with Discord...' &&
            currentTitle !== this.labels.noMusicTitle &&
            currentTitle !== this.labels.syncErrorTitle &&
            currentTitle !== 'Search Failed' &&
            currentTitle !== 'Connecting to Discord presence...';

          if (isCurrentTrackValid && this.isPlaying) {
            return;
          }

          this.archiveLiveTrack(this.labels.noMusicTitle);
          // Clear playlist if it was loaded
          if (this.loadedPlaylistQuery !== null) {
            this.loadedPlaylistQuery = null;
            this.tracks = [
              {
                id: 'live',
                title: this.labels.noMusicTitle,
                artist: this.labels.noMusicArtist,
                url: ''
              }
            ];
            this.currentTrackIndex = 0;
          }
          this.tracks[0].title = this.labels.noMusicTitle;
          this.tracks[0].artist = this.labels.noMusicArtist;
          this.currentArtistLabelKey = 'noMusicArtist';
          this.youtubeVideoId = null;
          this.coverUrl = null;
          this.coverColors = null;
          this.resetThemeColors();
          this.isPlaying = false;
          this.notifyListeners();
        }
      }
    } catch (err) {
      console.error("Lanyard fetch failed:", err);
      if (!silent) {
        this.archiveLiveTrack(this.labels.syncErrorTitle);
        this.tracks[0].title = this.labels.syncErrorTitle;
        this.tracks[0].artist = this.labels.syncErrorArtist;
        this.currentArtistLabelKey = 'syncErrorArtist';
        this.notifyListeners();
      }
    }
  }

  private async searchAndLoadPlaylist(query: string, artistName: string): Promise<boolean> {
    try {
      const res = await fetch('https://api.invidious.io/instances.json');
      const instances = await res.json();
      
      const activeInstances = instances
        .filter((item: any) => item[1].cors && item[1].api && item[1].type === 'https')
        .map((item: any) => item[1].uri);

      const fallbackInstances = [
        'https://invidious.projectsegfau.lt',
        'https://inv.tux.im',
        'https://invidious.no-logs.com',
        'https://invidious.lunar.icu'
      ];
      
      const searchList = [...new Set([...fallbackInstances, ...activeInstances])];

      for (const instance of searchList) {
        try {
          const searchUrl = `${instance}/api/v1/search?q=${encodeURIComponent(query)}&type=playlist`;
          const response = await fetch(searchUrl, { signal: AbortSignal.timeout(4000) });
          if (!response.ok) continue;
          
          const results = await response.json();
          if (Array.isArray(results) && results.length > 0) {
            const playlists = results.filter((item: any) => item.type === 'playlist' && item.playlistId);
            if (playlists.length > 0) {
              const playlistId = playlists[0].playlistId;
              
              const playlistUrl = `${instance}/api/v1/playlists/${playlistId}`;
              const playlistRes = await fetch(playlistUrl, { signal: AbortSignal.timeout(4000) });
              if (!playlistRes.ok) continue;
              
              const playlistData = await playlistRes.json();
              if (playlistData && Array.isArray(playlistData.videos) && playlistData.videos.length > 0) {
                this.tracks = playlistData.videos.map((v: any, index: number) => ({
                  id: v.videoId || `track-${index}`,
                  title: v.title || 'Unknown Title',
                  artist: v.author || artistName || 'Unknown Artist',
                  url: '',
                  youtubeVideoId: v.videoId
                }));
                this.loadedPlaylistQuery = query;
                this.currentTrackIndex = 0;
                this.youtubeVideoId = this.tracks[0].youtubeVideoId || null;
                this.notifyListeners();
                return true;
              }
            }
          }
        } catch (err) {
          console.warn(`Playlist search failed on instance ${instance}:`, err);
        }
      }
    } catch (e) {
      console.error("Playlist loading failed:", e);
    }
    return false;
  }

  private guessBpm(title: string, artist: string): number {
    const full = `${title} ${artist}`.toLowerCase();
    
    // Heuristics for NYNELE's favorite tracks / most listened
    if (full.includes('ado') || full.includes('new genesis') || full.includes('film red')) {
      return 127; // "New Genesis" is exactly 127 BPM
    }
    if (full.includes('bad bunny') || full.includes('badbunny') || full.includes('bunny')) {
      return 115; // Bad Bunny mid-tempo tracks average 115 BPM
    }
    if (full.includes('lofi') || full.includes('lo-fi') || full.includes('chill') || full.includes('synth')) {
      return 85; // Standard lofi bpm
    }
    if (full.includes('trap') || full.includes('rap') || full.includes('hip hop')) {
      return 90; // Classic hip-hop tempo
    }
    if (full.includes('edm') || full.includes('dance') || full.includes('house') || full.includes('electronic')) {
      return 128; // Standard EDM bpm
    }
    
    return 95; // Default fallback
  }

  private async fetchSongBpm(title: string, artist: string): Promise<number | null> {
    try {
      // 1. Search MusicBrainz for Recording ID
      const query = `recording:${encodeURIComponent(title)} AND artist:${encodeURIComponent(artist)}`;
      const searchUrl = `https://musicbrainz.org/ws/2/recording/?query=${encodeURIComponent(query)}&fmt=json`;
      
      const searchRes = await fetch(searchUrl, {
        headers: {
          'User-Agent': 'PortfolioMusicSync/1.0.0 (nyneletwitch@gmail.com)'
        },
        signal: AbortSignal.timeout(3000)
      });
      if (!searchRes.ok) return null;
      
      const searchJson = await searchRes.json();
      const recording = searchJson.recordings?.[0];
      if (!recording || !recording.id) return null;
      
      const mbid = recording.id;
      
      // 2. Query AcousticBrainz for BPM
      const analysisUrl = `https://acousticbrainz.org/api/v1/${mbid}/low-level`;
      const analysisRes = await fetch(analysisUrl, { signal: AbortSignal.timeout(3000) });
      if (!analysisRes.ok) return null;
      
      const analysisJson = await analysisRes.json();
      const bpm = analysisJson.rhythm?.bpm;
      if (bpm && typeof bpm === 'number') {
        return Math.round(bpm);
      }
    } catch (e) {
      console.warn("BPM fetch failed:", e);
    }
    return null;
  }

  private async extractColors(url: string): Promise<{ primary: string; secondary: string } | null> {
    return new Promise((resolve) => {
      if (typeof window === 'undefined') return resolve(null);
      
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.src = url;
      
      img.onload = () => {
        try {
          const canvas = document.createElement('canvas');
          canvas.width = 16;
          canvas.height = 16;
          const ctx = canvas.getContext('2d');
          if (!ctx) return resolve(null);
          
          ctx.drawImage(img, 0, 0, 16, 16);
          const imgData = ctx.getImageData(0, 0, 16, 16).data;
          
          const colors: { r: number; g: number; b: number; sat: number; val: number }[] = [];
          for (let i = 0; i < imgData.length; i += 4) {
            const r = imgData[i];
            const g = imgData[i+1];
            const b = imgData[i+2];
            const a = imgData[i+3];
            if (a < 200) continue; // Skip semi-transparent
            
            const max = Math.max(r, g, b);
            const min = Math.min(r, g, b);
            const d = max - min;
            const sat = max === 0 ? 0 : d / max;
            const val = max / 255;
            
            colors.push({ r, g, b, sat, val });
          }
          
          if (colors.length === 0) return resolve(null);
          
          // Sort by saturation to find vibrant tones
          colors.sort((a, b) => b.sat - a.sat);
          
          // Find primary vibrant color
          let primary = colors.find(c => c.val > 0.45 && c.sat > 0.25);
          if (!primary) primary = colors[0];
          
          // Find distinct secondary color
          let secondary = colors.find(c => {
            const dist = Math.abs(c.r - primary.r) + Math.abs(c.g - primary.g) + Math.abs(c.b - primary.b);
            return dist > 180 && c.val > 0.35;
          });
          if (!secondary) {
            secondary = {
              r: Math.min(255, Math.round(primary.r * 0.75 + 30)),
              g: Math.min(255, Math.round(primary.g * 0.75 + 30)),
              b: Math.min(255, Math.round(primary.b * 0.85 + 40)),
              sat: primary.sat,
              val: primary.val
            };
          }
          
          resolve({
            primary: `rgb(${primary.r}, ${primary.g}, ${primary.b})`,
            secondary: `rgb(${secondary.r}, ${secondary.g}, ${secondary.b})`
          });
        } catch (e) {
          console.warn("Dynamic color extraction failed:", e);
          resolve(null);
        }
      };
      
      img.onerror = () => {
        resolve(null);
      };
    });
  }

  private updateThemeColors(primaryRgb: string, secondaryRgb: string) {
    if (typeof document === 'undefined') return;
    
    const primMatch = primaryRgb.match(/\d+/g);
    const secMatch = secondaryRgb.match(/\d+/g);
    
    if (primMatch && secMatch) {
      const pR_raw = Number(primMatch[0]);
      const pG_raw = Number(primMatch[1]);
      const pB_raw = Number(primMatch[2]);
      const sR_raw = Number(secMatch[0]);
      const sG_raw = Number(secMatch[1]);
      const sB_raw = Number(secMatch[2]);
      
      const root = document.documentElement;
      
      // Detect dynamic scheme mode
      const isDark = document.documentElement.getAttribute('data-mui-color-scheme') === 'dark' || 
                     document.documentElement.classList.contains('dark') ||
                     (typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches);
      
      // Helper function for RGB to HSL
      const rgbToHsl = (r: number, g: number, b: number) => {
        r /= 255; g /= 255; b /= 255;
        const max = Math.max(r, g, b);
        const min = Math.min(r, g, b);
        let h = 0; let s = 0;
        const l = (max + min) / 2;
        if (max !== min) {
          const d = max - min;
          s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
          switch (max) {
            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
            case g: h = (b - r) / d + 2; break;
            case b: h = (r - g) / d + 4; break;
          }
          h /= 6;
        }
        return { h: h * 360, s: s * 100, l: l * 100 };
      };
      
      // Helper function for HSL to RGB
      const hslToRgb = (h: number, s: number, l: number) => {
        h /= 360; s /= 100; l /= 100;
        let r = l; let g = l; let b = l;
        if (s !== 0) {
          const hue2rgb = (p: number, q: number, t: number) => {
            if (t < 0) t += 1;
            if (t > 1) t -= 1;
            if (t < 1/6) return p + (q - p) * 6 * t;
            if (t < 1/2) return q;
            if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
            return p;
          };
          const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
          const p = 2 * l - q;
          r = hue2rgb(p, q, h + 1/3);
          g = hue2rgb(p, q, h);
          b = hue2rgb(p, q, h - 1/3);
        }
        return {
          r: Math.round(r * 255),
          g: Math.round(g * 255),
          b: Math.round(b * 255)
        };
      };
      
      // Helper to adjust color and compute contrast
      const adjustColorForTheme = (r: number, g: number, b: number, isDarkTheme: boolean) => {
        const hsl = rgbToHsl(r, g, b);
        if (isDarkTheme) {
          // Adjust lightness for readability on dark backgrounds (pastel/light tone)
          if (hsl.l < 68) {
            hsl.l = 74;
          } else if (hsl.l > 85) {
            hsl.l = 80;
          }
        } else {
          // Adjust lightness for readability on light backgrounds (deep/dark tone)
          if (hsl.l > 38) {
            hsl.l = 30;
          } else if (hsl.l < 15) {
            hsl.l = 22;
          }
        }
        const mainRgb = hslToRgb(hsl.h, hsl.s, hsl.l);
        
        // Calculate contrast text
        const brightness = (mainRgb.r * 299 + mainRgb.g * 587 + mainRgb.b * 114) / 1000;
        let contrastRgb = { r: 255, g: 255, b: 255 };
        if (brightness > 155) {
          // Dark contrast text for bright background (e.g. #16121a or similar dark color matching the hue)
          contrastRgb = hslToRgb(hsl.h, Math.max(15, hsl.s * 0.4), 10);
        } else {
          // Light contrast text
          contrastRgb = { r: 255, g: 255, b: 255 };
        }
        
        return { main: mainRgb, contrast: contrastRgb };
      };
      
      const pAdjusted = adjustColorForTheme(pR_raw, pG_raw, pB_raw, isDark);
      const sAdjusted = adjustColorForTheme(sR_raw, sG_raw, sB_raw, isDark);
      
      const rgbToHex = (r: number, g: number, b: number) => 
        "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
        
      const pMainHex = rgbToHex(pAdjusted.main.r, pAdjusted.main.g, pAdjusted.main.b);
      const pContrastHex = rgbToHex(pAdjusted.contrast.r, pAdjusted.contrast.g, pAdjusted.contrast.b);
      
      const sMainHex = rgbToHex(sAdjusted.main.r, sAdjusted.main.g, sAdjusted.main.b);
      const sContrastHex = rgbToHex(sAdjusted.contrast.r, sAdjusted.contrast.g, sAdjusted.contrast.b);
      
      // Update variables on document root
      root.style.setProperty('--mui-palette-primary-main', pMainHex);
      root.style.setProperty('--mui-palette-primary-contrastText', pContrastHex);
      root.style.setProperty('--mui-palette-primary-mainChannel', `${pAdjusted.main.r} ${pAdjusted.main.g} ${pAdjusted.main.b}`);
      root.style.setProperty('--mui-palette-primary-contrastTextChannel', `${pAdjusted.contrast.r} ${pAdjusted.contrast.g} ${pAdjusted.contrast.b}`);
      
      root.style.setProperty('--mui-palette-secondary-main', sMainHex);
      root.style.setProperty('--mui-palette-secondary-contrastText', sContrastHex);
      root.style.setProperty('--mui-palette-secondary-mainChannel', `${sAdjusted.main.r} ${sAdjusted.main.g} ${sAdjusted.main.b}`);
      root.style.setProperty('--mui-palette-secondary-contrastTextChannel', `${sAdjusted.contrast.r} ${sAdjusted.contrast.g} ${sAdjusted.contrast.b}`);
    }
  }

  public resetThemeColors() {
    if (typeof document === 'undefined') return;
    const root = document.documentElement;
    root.style.removeProperty('--mui-palette-primary-main');
    root.style.removeProperty('--mui-palette-primary-contrastText');
    root.style.removeProperty('--mui-palette-primary-mainChannel');
    root.style.removeProperty('--mui-palette-primary-contrastTextChannel');
    root.style.removeProperty('--mui-palette-secondary-main');
    root.style.removeProperty('--mui-palette-secondary-contrastText');
    root.style.removeProperty('--mui-palette-secondary-mainChannel');
    root.style.removeProperty('--mui-palette-secondary-contrastTextChannel');
    this.previousDiscordTrack = null;

    try {
      localStorage.removeItem('portfolio-music-cache');
    } catch (e) {
      console.warn("Failed to remove cached music data:", e);
    }
  }

  private saveCache() {
    if (typeof window === 'undefined') return;
    try {
      const cacheData = {
        title: this.tracks[0].title,
        artist: this.tracks[0].artist,
        youtubeVideoId: this.youtubeVideoId,
        coverUrl: this.coverUrl,
        coverColors: this.coverColors,
        previousDiscordTrack: this.previousDiscordTrack
      };
      localStorage.setItem('portfolio-music-cache', JSON.stringify(cacheData));
    } catch (e) {
      console.warn("Failed to save music cache:", e);
    }
  }

  private async searchYouTubeTrack(query: string, offset = 0): Promise<string | null> {
    try {
      // 1. Fetch active Invidious instances with CORS and API enabled
      const res = await fetch('https://api.invidious.io/instances.json');
      const instances = await res.json();
      
      const activeInstances = instances
        .filter((item: any) => item[1].cors && item[1].api && item[1].type === 'https')
        .map((item: any) => item[1].uri);

      // Known stable CORS-enabled fallbacks at the beginning
      const fallbackInstances = [
        'https://invidious.projectsegfau.lt',
        'https://inv.tux.im',
        'https://invidious.no-logs.com',
        'https://invidious.lunar.icu'
      ];
      
      const searchList = [...new Set([...fallbackInstances, ...activeInstances])];

      // 2. Try querying search endpoint on each instance sequentially
      for (const instance of searchList) {
        try {
          const searchUrl = `${instance}/api/v1/search?q=${encodeURIComponent(query)}&type=video`;
          const response = await fetch(searchUrl, { signal: AbortSignal.timeout(4000) });
          if (!response.ok) continue;
          
          const results = await response.json();
          if (Array.isArray(results) && results.length > 0) {
            const videos = results.filter((item: any) => item.type === 'video' && item.videoId);
            if (videos.length > offset) {
              return videos[offset].videoId;
            }
          }
        } catch (err) {
          console.warn(`Search failed on instance ${instance}:`, err);
        }
      }
    } catch (e) {
      console.error("Invidious instances fetch failed:", e);
    }
    
    return null;
  }

  public getAudioData() {
    if (!this.isPlaying) {
      return { bass: 0, mid: 0, treble: 0, intensity: 0 };
    }

    // If playing YouTube Music via iframe, generate a simulated visualizer beat
    if (this.youtubeVideoId !== null) {
      let time = Date.now() * 0.001;
      if (this.youtubeVideoId && this.lastYoutubeTimeUpdate > 0) {
        const elapsed = (Date.now() - this.lastYoutubeTimeUpdate) * 0.001;
        const cappedElapsed = Math.min(2.0, elapsed);
        time = this.youtubeCurrentTime + cappedElapsed;
      }
      
      // Dynamic tempo match based on current BPM
      const bpm = this.currentBpm || 95;
      const beatDuration = 60 / bpm;
      const timeInMeasure = time % (beatDuration * 4); // 4-beat signature
      const currentBeat = Math.floor(timeInMeasure / beatDuration); // 0, 1, 2, 3
      const beatProgress = (timeInMeasure % beatDuration) / beatDuration; // 0.0 to 1.0

      // Sharp onset, exponential decay: e^(-k * progress) for punchy simulation
      const kick = Math.exp(-8.0 * beatProgress);
      const snare = (currentBeat === 1 || currentBeat === 3) ? Math.exp(-5.5 * beatProgress) : 0;

      // Hi-hat on eighth notes (every half-beat)
      const eighthProgress = (time % (beatDuration / 2)) / (beatDuration / 2);
      const hihat = Math.exp(-12.0 * eighthProgress);

      // Bass is driven by the kick downbeats
      const bass = 0.12 + kick * 0.68;
      // Mid is driven by snare drum and chord pad motion
      const mid = 0.18 + snare * 0.45 + (1.0 - beatProgress) * 0.12;
      // Treble represents cymbals/high-hat shimmer
      const treble = 0.15 + hihat * 0.25 + snare * 0.20 + Math.abs(Math.sin(time * 8.0)) * 0.08;
      
      const intensity = (bass + mid + treble) / 3.0;

      return { bass, mid, treble, intensity };
    }
    
    if (!this.analyser) {
      return { bass: 0, mid: 0, treble: 0, intensity: 0 };
    }
    
    this.analyser.getByteFrequencyData(this.dataArray);
    
    let bassSum = 0;
    let midSum = 0;
    let trebleSum = 0;
    let totalSum = 0;
    
    for (let i = 0; i < this.dataArray.length; i++) {
      const val = this.dataArray[i] / 255.0;
      totalSum += val;
      if (i < 5) bassSum += val;
      else if (i < 16) midSum += val;
      else trebleSum += val;
    }
    
    return {
      bass: bassSum / 5,
      mid: midSum / 11,
      treble: trebleSum / 15,
      intensity: totalSum / this.dataArray.length
    };
  }

  public subscribe(callback: () => void) {
    this.listeners.push(callback);
    return () => {
      this.listeners = this.listeners.filter(l => l !== callback);
    };
  }

  private notifyListeners() {
    this.listeners.forEach(l => l());
  }
}
