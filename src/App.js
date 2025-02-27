import React, { useState, useEffect } from 'react';
import * as Tone from 'tone';
import { AudioProvider } from './contexts/AudioContext';
import { ProjectProvider } from './contexts/ProjectContext';
import { CollaborationProvider } from './contexts/CollaborationContext';
import TransportControls from './components/TransportControls';
import Mixer from './components/Mixer';
import Sequencer from './components/Sequencer';
import PianoRoll from './components/PianoRoll';
import Visualizer from './components/Visualizer';
import Automation from './components/Automation';
import Effect from './components/Effect';
import Collaboration from './components/Collaboration';
import Export from './components/Export';
import Customization from './components/Customization';
import './App.css';

// Error Boundary to catch crashes
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    console.error("Error caught in ErrorBoundary:", error, info);
  }

  render() {
    if (this.state.hasError) {
      return <h2>Something went wrong.</h2>;
    }
    return this.props.children;
  }
}

const App = () => {
  const [tracks, setTracks] = useState([
    { name: 'Track 1', synth: new Tone.Synth(), effects: [new Tone.Reverb()] },
    { name: 'Track 2', synth: new Tone.Synth(), effects: [new Tone.Delay()] },
  ]);

  useEffect(() => {
    Tone.start();
    tracks.forEach(track => {
      track.synth.toDestination();
      track.effects.forEach(effect => effect.toDestination());
    });
  }, [tracks]);

  const addTrack = () => {
    const newTrack = {
      name: `Track ${tracks.length + 1}`,
      synth: new Tone.Synth(),
      effects: [new Tone.Chorus()],
    };
    setTracks([...tracks, newTrack]);
  };

  const removeTrack = (index) => {
    setTracks(tracks.filter((_, i) => i !== index));
  };

  return (
    <ErrorBoundary>
      <AudioProvider>
        <ProjectProvider>
          <CollaborationProvider>
            <div className="app">
              <header className="app-header">
                <h1>Advanced Music Remixer</h1>
                <button onClick={addTrack}>Add Track</button>
              </header>
              <main>
                <section className="controls">
                  <TransportControls />
                  <Mixer tracks={tracks} />
                  {tracks.map((track, index) => (
                    <div key={index} className="track-controls">
                      <h2>{track.name}</h2>
                      <Sequencer synth={track.synth} />
                      <PianoRoll synth={track.synth} />
                      {track.effects.map((effect, effectIndex) => {
                        const effectType = effect?.constructor?.name || "Unknown Effect";
                        return (
                          <Effect key={effectIndex} effectType={effectType} track={track} />
                        );
                      })}
                      <button onClick={() => removeTrack(index)}>Remove Track</button>
                    </div>
                  ))}
                  <Visualizer audioBuffer={null} />
                  <Automation parameter="filterFrequency" />
                  <Collaboration />
                  <Export tracks={tracks} />
                  <Customization />
                </section>
              </main>
            </div>
          </CollaborationProvider>
        </ProjectProvider>
      </AudioProvider>
    </ErrorBoundary>
  );
};

export default App;
