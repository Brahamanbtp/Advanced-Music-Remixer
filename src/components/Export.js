import React from 'react';
import * as Tone from 'tone';

const Export = ({ tracks }) => {
  const exportProject = async () => {
    const duration = Tone.Transport.seconds;

    // Render offline
    const buffer = await Tone.Offline(({ transport }) => {
      tracks.forEach(track => {
        track.synth.toDestination();
      });
      transport.start();
    }, duration);

    // Convert buffer to WAV
    const wav = buffer.get();
    const blob = new Blob([wav], { type: 'audio/wav' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'project.wav';
    a.click();

    // Clean up
    URL.revokeObjectURL(url);
  };

  return (
    <div className="export">
      <h4>Export Project</h4>
      <button onClick={exportProject}>Export as WAV</button>
    </div>
  );
};

export default Export;
