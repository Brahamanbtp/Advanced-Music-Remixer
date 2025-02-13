import React from 'react';
import * as Tone from 'tone';

const Export = ({ tracks }) => {
  const exportProject = async () => {
    const duration = Tone.Transport.seconds;
    const offlineContext = new OfflineAudioContext(2, duration * 44100, 44100);
    const renderer = new Tone.OfflineRenderer(offlineContext);

    // Connect all tracks to the offline context
    tracks.forEach(track => {
      track.synth.connect(offlineContext.destination);
    });

    await renderer.render();
    const wav = renderer.toWave();

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
