import { render, screen } from '@testing-library/react';
import App from './App';

describe('App Component', () => {
  test('renders the main header', () => {
    render(<App />);
    const headerElement = screen.getByText(/Advanced Music Remixer/i);
    expect(headerElement).toBeInTheDocument();
  });

  test('renders the transport controls', () => {
    render(<App />);
    const transportControls = screen.getByText(/Play/i);
    expect(transportControls).toBeInTheDocument();
  });

  test('renders the mixer component', () => {
    render(<App />);
    const mixerElement = screen.getByText(/Mixer/i);
    expect(mixerElement).toBeInTheDocument();
  });

  test('renders the sequencer component', () => {
    render(<App />);
    const sequencerElement = screen.getByText(/Sequencer/i);
    expect(sequencerElement).toBeInTheDocument();
  });

  test('renders the piano roll component', () => {
    render(<App />);
    const pianoRollElement = screen.getByText(/Piano Roll/i);
    expect(pianoRollElement).toBeInTheDocument();
  });

  test('renders the visualizer component', () => {
    render(<App />);
    const visualizerElement = screen.getByText(/Visualizer/i);
    expect(visualizerElement).toBeInTheDocument();
  });

  test('renders the automation component', () => {
    render(<App />);
    const automationElement = screen.getByText(/Automation/i);
    expect(automationElement).toBeInTheDocument();
  });

  test('renders the effect component', () => {
    render(<App />);
    const effectElement = screen.getByText(/Reverb/i);
    expect(effectElement).toBeInTheDocument();
  });

  test('renders the collaboration component', () => {
    render(<App />);
    const collaborationElement = screen.getByText(/Collaboration/i);
    expect(collaborationElement).toBeInTheDocument();
  });

  test('renders the export component', () => {
    render(<App />);
    const exportElement = screen.getByText(/Export/i);
    expect(exportElement).toBeInTheDocument();
  });

  test('renders the customization component', () => {
    render(<App />);
    const customizationElement = screen.getByText(/Customization/i);
    expect(customizationElement).toBeInTheDocument();
  });
});
