import React from 'react';
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

const App = () => {
  const tracks = [
    { name: 'Track 1', synth: new Tone.Synth().toDestination() },
    { name: 'Track 2', synth: new Tone.Synth().toDestination() },
  ];

  return (
    <AudioProvider>
      <ProjectProvider>
        <CollaborationProvider>
          <div className="app">
            <header className="app-header">
              <h1>Advanced Music Remixer</h1>
            </header>
            <main>
              <section className="controls">
                <TransportControls />
                <Mixer tracks={tracks} />
                <Sequencer synth={tracks[0].synth} />
                <PianoRoll synth={tracks[0].synth} />
                <Visualizer audioBuffer={null} /> {/* Pass actual audioBuffer when available */}
                <Automation parameter="filterFrequency" />
                <Effect effectType="reverb" track={tracks[0]} />
                <Collaboration />
                <Export tracks={tracks} />
                <Customization />
              </section>
            </main>
          </div>
        </CollaborationProvider>
      </ProjectProvider>
    </AudioProvider>
  );
};

export default App;
