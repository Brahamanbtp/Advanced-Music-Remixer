import React, { useState, useEffect } from 'react';
import * as Tone from 'tone';

const TransportControls = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [bpm, setBpm] = useState(120);
  const [loop, setLoop] = useState(false);
  const [position, setPosition] = useState(0);

  useEffect(() => {
    const syncPosition = () => {
      setPosition(Tone.Transport.position);
    };

    Tone.Transport.on('time', syncPosition);

    return () => {
      Tone.Transport.off('time', syncPosition);
    };
  }, []);

  const start = () => {
    Tone.start();
    Tone.Transport.start();
    setIsPlaying(true);
  };

  const stop = () => {
    Tone.Transport.stop();
    setIsPlaying(false);
  };

  const toggleLoop = () => {
    Tone.Transport.loop = !loop;
    setLoop(!loop);
  };

  const setBpmValue = (value) => {
    Tone.Transport.bpm.value = value;
    setBpm(value);
  };

  const rewind = () => {
    Tone.Transport.position = 0;
    setPosition(0);
  };

  return (
    <div className="transport-controls">
      <button onClick={isPlaying ? stop : start}>{isPlaying ? 'Stop' : 'Play'}</button>
      <button onClick={rewind}>Rewind</button>
      <button onClick={toggleLoop}>{loop ? 'Loop Off' : 'Loop On'}</button>
      <label>
        BPM
        <input
          type="number"
          value={bpm}
          onChange={(e) => setBpmValue(e.target.value)}
          min="60"
          max="240"
        />
      </label>
      <div className="position-display">
        Position: {position.toFixed(2)}
      </div>
    </div>
  );
};

export default TransportControls;