import React, { useEffect, useState, useContext, useCallback, useRef } from 'react';
import * as Tone from 'tone';
import { AudioContext } from '../contexts/AudioContext';
import PianoRoll from './PianoRoll';
import Waveform from './Waveform';
import Spectrogram from './Spectrogram';

const Track = ({ name, synth, reverb, delay }) => {
  const { automation, addAutomationPoint } = useContext(AudioContext);
  const [sequence, setSequence] = useState(['C4', 'E4', 'G4', 'B4']);
  const [recording, setRecording] = useState(false);
  const [recordedSequence, setRecordedSequence] = useState([]);
  const [audioBuffer, setAudioBuffer] = useState(null);
  const midiAccessRef = useRef(null);
  const sequenceRef = useRef(sequence);

  // Update sequence reference for better reactivity
  useEffect(() => {
    sequenceRef.current = sequence;
  }, [sequence]);

  const loopCallback = useCallback((time) => {
    sequenceRef.current.forEach((note, index) => {
      synth.triggerAttackRelease(note, '8n', time + index * 0.5);
    });
  }, [synth]);

  useEffect(() => {
    const loop = new Tone.Part(loopCallback, sequence.map((_, i) => i * 0.5)).start(0);
    Tone.Transport.start();

    return () => {
      loop.dispose();
    };
  }, [loopCallback]);

  useEffect(() => {
    if (recording) {
      const recordNote = (note) => {
        setRecordedSequence((prev) => [...prev, note]);
      };

      const handleMidiMessage = (event) => {
        const [command, note, velocity] = event.data;
        if (command === 144 && velocity > 0) {
          const noteName = Tone.Frequency(note, 'midi').toNote();
          recordNote(noteName);
        }
      };

      if (!midiAccessRef.current) {
        navigator.requestMIDIAccess().then((access) => {
          midiAccessRef.current = access;
          for (let input of access.inputs.values()) {
            input.onmidimessage = handleMidiMessage;
          }
        });
      }

      return () => {
        if (midiAccessRef.current) {
          for (let input of midiAccessRef.current.inputs.values()) {
            input.onmidimessage = null;
          }
        }
      };
    }
  }, [recording]);

  const toggleEffect = (effect) => {
    effect.wet.value = effect.wet.value === 1 ? 0 : 1;
  };

  const toggleRecording = () => {
    setRecording((prev) => !prev);
    if (recording) {
      setSequence(recordedSequence);
      setRecordedSequence([]);
    }
  };

  const captureAudioBuffer = async () => {
    const offlineContext = new OfflineAudioContext(2, Tone.Transport.seconds * 44100, 44100);
    const renderer = new Tone.Renderer(offlineContext);
    await renderer.render();
    setAudioBuffer(renderer.toWave());
  };

  return (
    <div className="track">
      <h3>🎵 {name}</h3>
      <button onClick={() => synth.triggerAttackRelease('C4', '8n')}>Play C4</button>
      <button onClick={() => toggleEffect(reverb)}>Toggle Reverb</button>
      <button onClick={() => toggleEffect(delay)}>Toggle Delay</button>

      <PianoRoll synth={synth} />

      <div className="sequencer">
        <h4>🎼 Sequencer</h4>
        <input
          type="text"
          value={sequence.join(' ')}
          onChange={(e) => setSequence(e.target.value.split(' '))}
        />
        <button onClick={toggleRecording}>{recording ? '⏹ Stop Recording' : '🎤 Start Recording'}</button>
      </div>

      <div className="effect-controls">
        <h4>🎛 Effect Controls</h4>
        <label>
          Reverb Wet
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={reverb.wet.value}
            onChange={(e) => (reverb.wet.value = e.target.value)}
          />
        </label>
        <label>
          Delay Wet
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={delay.wet.value}
            onChange={(e) => (delay.wet.value = e.target.value)}
          />
        </label>
      </div>

      <div className="automation">
        <h4>📈 Automation</h4>
        {automation.map((auto, index) => (
          <div key={index}>
            <label>
              {auto.parameter}
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={auto.value}
                onChange={(e) => addAutomationPoint(auto.parameter, Tone.now(), e.target.value)}
              />
            </label>
          </div>
        ))}
      </div>

      <div className="visualizations">
        <h4>🎧 Visualizations</h4>
        {audioBuffer && (
          <>
            <Waveform audioBuffer={audioBuffer} />
            <Spectrogram audioBuffer={audioBuffer} />
          </>
        )}
        <button onClick={captureAudioBuffer}>📡 Capture Audio Buffer</button>
      </div>
    </div>
  );
};

export default Track;
