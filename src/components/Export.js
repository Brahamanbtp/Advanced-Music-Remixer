import React, { useState } from 'react';
import * as Tone from 'tone';

const Export = ({ tracks }) => {
  const [isExporting, setIsExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);

  const exportProject = async () => {
    setIsExporting(true);
    setExportProgress(0);

    const duration = Tone.Transport.seconds;

    try {
      // Render offline with progress updates
      const buffer = await Tone.Offline(({ transport }) => {
        tracks.forEach(track => {
          track.synth.toDestination();
        });
        transport.start();
      }, duration, (progress) => {
        setExportProgress(progress);
      });

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
    } catch (error) {
      console.error('Error exporting project:', error);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="export">
      <h4>Export Project</h4>
      <button onClick={exportProject} disabled={isExporting}>
        {isExporting ? 'Exporting...' : 'Export as WAV'}
      </button>
      {isExporting && (
        <progress value={exportProgress} max="1">
          {Math.round(exportProgress * 100)}%
        </progress>
      )}
    </div>
  );
};

export default Export;
