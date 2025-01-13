import { useState, useEffect, useRef, useCallback } from 'react';
import cx from 'classnames';
import Synth from './Synth';

import NOTES from './notes.json';

interface Note {
  [key: string]: number;
}

const getNotesForOctave = (octave: number): Note => {
  return Object.keys(NOTES).reduce((state: Note, note) => {
    if (note.split('').pop() === String(octave))
      state[note] = NOTES[note as keyof typeof NOTES];
    return state;
  }, {});
};

const defaultPads = [
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 1, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 1, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 1, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 1, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 1, 0],
];

export default function Sequencer() {
  const [type, setType] = useState<string>('sine');
  const [pads, setPads] = useState<number[][]>(defaultPads);
  const [bpm, setBpm] = useState<number>(150);
  const [release, setRelease] = useState<number>(100);
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [steps] = useState<number>(8);
  const [playing, setPlaying] = useState<boolean>(false);
  const [octave, setOctave] = useState<number>(4);
  const [delay, setDelay] = useState<boolean>(false);
  const [notes, setNotes] = useState<Note>(getNotesForOctave(4));

  const synthRef = useRef<any>(null);
  const intervalRef = useRef<number | null>(null);

  const changeRelease = (newRelease: number) => {
    setRelease(newRelease);
  };

  const changeBPM = (newBpm: number) => {
    if (newBpm > 300 || newBpm < 60) return;
    setBpm(newBpm);
  };

  const changeWaveType = (newType: string) => {
    setType(newType);
  };

  const changeOctave = (newOctave: number) => {
    setOctave(newOctave);
    setNotes(getNotesForOctave(newOctave));
  };

  const play = useCallback(() => {
    if (!synthRef.current) {
      synthRef.current = new Synth();
    }

    const notesArray = Object.values(notes);

    setPlaying(true);

    const playStep = () => {
      setCurrentStep((prevStep) => {
        const newStep = prevStep < steps - 1 ? prevStep + 1 : 0;
        const next = pads[newStep]
          .map((pad, i) => (pad === 1 ? notesArray[i] : null))
          .filter((x) => x);

        synthRef.current.playNotes(next, {
          release,
          bpm,
          type,
          delay,
        });

        return newStep;
      });
    };

    playStep(); // Play immediately
    intervalRef.current = setInterval(playStep, (60 * 1000) / bpm / 2);
  }, [notes, pads, steps, release, bpm, type, delay]);

  const pause = useCallback(() => {
    setPlaying(false);
    setCurrentStep(0);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const togglePad = (group: number, pad: number) => {
    setPads((prevPads) => {
      const clonedPads = prevPads.slice(0);
      const padState = clonedPads[group][pad];

      clonedPads[group] = [0, 0, 0, 0, 0, 0, 0, 0];
      clonedPads[group][pad] = padState === 1 ? 0 : 1;
      return clonedPads;
    });
  };

  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (playing) {
      pause();
      play();
    }
  }, [playing, pause, play, bpm, type, release, delay]);

  return (
    <div className="bg-gray-800 rounded-lg p-4 inline-block">
      <div className="flex items-center space-x-4 mb-4 p-4">
        <button
          type="button"
          className={cx('px-4 py-2 bg-gray-700 text-white rounded-md', {
            'bg-blue-500': playing,
          })}
          onClick={() => {
            if (playing) pause();
            else play();
          }}
        >
          Play
        </button>

        <div className="relative">
          <span className="absolute -top-5 left-2 text-xs text-white opacity-30">
            BPM
          </span>
          <input
            type="number"
            min="80"
            max="300"
            step="1"
            value={bpm}
            onChange={(e) => changeBPM(Number(e.target.value))}
            className="bg-gray-700 text-white px-3 py-2 rounded-md"
          />
        </div>

        <div className="relative">
          <span className="absolute -top-5 left-2 text-xs text-white opacity-30">
            Wave
          </span>
          <select
            value={type}
            data-label="wave"
            className="bg-gray-700 text-white px-3 py-2 rounded-md"
            onChange={(e) => changeWaveType(e.target.value)}
          >
            <option>Sine</option>
            <option>Square</option>
            <option>Sawtooth</option>
            <option>Triangle</option>
          </select>
        </div>

        <div className="relative">
          <span className="absolute -top-5 left-2 text-xs text-white opacity-30">
            Octave
          </span>
          <select
            value={octave}
            data-label="octave"
            className="bg-gray-700 text-white px-3 py-2 rounded-md"
            onChange={(e) => changeOctave(Number(e.target.value))}
          >
            {[1, 2, 3, 4, 5, 6, 7].map((num) => (
              <option key={num}>{num}</option>
            ))}
          </select>
        </div>

        <div className="relative">
          <span className="absolute -top-5 left-2 text-xs text-white opacity-30">
            Release
          </span>
          <input
            type="number"
            min="0"
            max="400"
            step="1"
            value={release}
            onChange={(e) => changeRelease(Number(e.target.value))}
            className="bg-gray-700 text-white px-3 py-2 rounded-md"
          />
        </div>

        <button
          type="button"
          className={cx('px-4 py-2 bg-gray-700 text-white rounded-md', {
            'bg-blue-500': delay,
          })}
          onClick={() => {
            setDelay(!delay);
          }}
        >
          Delay
        </button>
      </div>

      <div className="flex">
        <ul className="text-right text-white opacity-30 mr-4">
          {Object.keys(notes)
            .slice(0, 8)
            .reverse()
            .map((note) => (
              <li key={`note-${note}`} className="h-16 leading-16">
                {note.slice(0, note.length - 1)}
              </li>
            ))}
        </ul>

        <div className="flex">
          {pads.map((group, groupIndex) => (
            <div key={`pad-${groupIndex}`} className="flex flex-col-reverse">
              {group.map((pad, i) => (
                <div
                  key={`pad-group-${i}`}
                  className={cx(
                    'w-14 h-14 m-1 rounded cursor-pointer transition-colors duration-100',
                    {
                      'bg-gray-600': groupIndex === currentStep,
                      'bg-blue-500': pad === 1,
                      'bg-gray-700 hover:bg-gray-600': pad === 0,
                    }
                  )}
                  onClick={() => {
                    togglePad(groupIndex, i);
                  }}
                />
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
