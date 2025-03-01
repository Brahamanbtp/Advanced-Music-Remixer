import React, { useEffect, Suspense, lazy, useState } from 'react';
import * as Tone from 'tone';
import { AudioProvider } from './contexts/AudioContext';
import { ProjectProvider } from './contexts/ProjectContext';
import { CollaborationProvider } from './contexts/CollaborationContext';
import { TrackProvider, useTrack } from './contexts/TrackContext';
import './App.css';

// Lazy Loading Components for Performance Optimization
const TransportControls = lazy(() => import('./components/TransportControls'));
const Mixer = lazy(() => import('./components/Mixer'));
const Sequencer = lazy(() => import('./components/Sequencer'));
const PianoRoll = lazy(() => import('./components/PianoRoll'));
const Visualizer = lazy(() => import('./components/Visualizer'));
const Automation = lazy(() => import('./components/Automation'));
const Effect = lazy(() => import('./components/Effect'));
const Collaboration = lazy(() => import('./components/Collaboration'));
const Export = lazy(() => import('./components/Export'));
const Customization = lazy(() => import('./components/Customization'));

// 🎛 Error Boundary for Handling Crashes
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    console.error("❌ Error caught in ErrorBoundary:", error, info);
  }

  render() {
    if (this.state.hasError) {
      return <h2>🚨 Something went wrong: {this.state.error?.message}</h2>;
    }
    return this.props.children;
  }
}

// 🎼 Main App Component
const App = () => {
  const [audioBuffer, setAudioBuffer] = useState(null);

  useEffect(() => {
    // Ensure Tone.js AudioContext is started
    const startAudio = async () => {
      try {
        await Tone.start();
        console.log("🔊 Tone.js AudioContext started!");
      } catch (error) {
        console.error("🚨 Error starting Tone.js:", error);
      }
    };

    startAudio();

    const loadAudio = async () => {
      try {
        const url = '/audio/sample.mp3'; // ✅ Update path if needed
        const response = await fetch(url);

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const contentType = response.headers.get("content-type");
        if (!contentType || !contentType.includes("audio")) {
          throw new Error("🚨 Fetched file is not an audio file.");
        }

        const arrayBuffer = await response.arrayBuffer();
        const audioCtx = Tone.getContext().rawContext;

        audioCtx.decodeAudioData(
          arrayBuffer,
          (buffer) => {
            console.log('✅ Audio loaded successfully:', buffer);
            setAudioBuffer(buffer);
          },
          (error) => {
            console.error("❌ Decoding failed:", error);
          }
        );
      } catch (error) {
        console.error('🚨 Error loading audio:', error);
      }
    };

    loadAudio();
  }, []);

  return (
    <ErrorBoundary>
      <AudioProvider>
        <ProjectProvider>
          <CollaborationProvider>
            <TrackProvider>
              <div className="app">
                <header className="app-header">
                  <h1>🎵 Advanced Music Remixer</h1>
                </header>

                <Suspense fallback={<p>⏳ Loading...</p>}>
                  <MainContent audioBuffer={audioBuffer} />
                </Suspense>
              </div>
            </TrackProvider>
          </CollaborationProvider>
        </ProjectProvider>
      </AudioProvider>
    </ErrorBoundary>
  );
};

// 🎛 MainContent Component - Organized Logic
const MainContent = ({ audioBuffer }) => {
  const { tracks, setTracks, addTrack, removeTrack } = useTrack();

  return (
    <main>
      <section className="controls">
        <TransportControls />
        <button onClick={addTrack} className="add-track-btn">➕ Add Track</button>
        <Mixer tracks={tracks} setTracks={setTracks} />

        {tracks.length > 0 ? (
          tracks.map((track, index) => (
            <TrackControls key={index} index={index} track={track} removeTrack={removeTrack} />
          ))
        ) : (
          <p className="no-tracks">⚠️ No tracks added yet!</p>
        )}

        <Visualizer audioBuffer={audioBuffer} />
        <Automation parameter="filterFrequency" />
        <Collaboration />
        <Export tracks={tracks} />
        <Customization />
      </section>
    </main>
  );
};

// 🎚 Track Controls Component
const TrackControls = ({ index, track, removeTrack }) => (
  <div className="track-controls">
    <h2>{track.name}</h2>
    <Sequencer synth={track.synth} />
    <PianoRoll synth={track.synth} />
    {track.effects.map((effect, effectIndex) => (
      <Effect key={effectIndex} effectType={effect.constructor.name.toLowerCase()} track={track} />
    ))}
    <button onClick={() => removeTrack(index)} className="remove-track-btn">❌ Remove Track</button>
  </div>
);

export default App;
