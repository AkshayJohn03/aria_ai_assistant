import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Select from '../../../components/ui/Select';
import { Checkbox } from '../../../components/ui/Checkbox';

const AudioSettings = () => {
  const [microphoneDevice, setMicrophoneDevice] = useState('default');
  const [speakerDevice, setSpeakerDevice] = useState('default');
  const [speechLanguage, setSpeechLanguage] = useState('en-US');
  const [voiceOutput, setVoiceOutput] = useState(true);
  const [inputVolume, setInputVolume] = useState(75);
  const [outputVolume, setOutputVolume] = useState(80);
  const [noiseReduction, setNoiseReduction] = useState(true);
  const [autoGainControl, setAutoGainControl] = useState(true);
  const [echoCancellation, setEchoCancellation] = useState(true);
  const [isRecording, setIsRecording] = useState(false);
  const [isTesting, setIsTesting] = useState(false);

  const languageOptions = [
    { value: 'en-US', label: 'English (US)' },
    { value: 'en-GB', label: 'English (UK)' },
    { value: 'es-ES', label: 'Spanish (Spain)' },
    { value: 'fr-FR', label: 'French (France)' },
    { value: 'de-DE', label: 'German (Germany)' },
    { value: 'it-IT', label: 'Italian (Italy)' },
    { value: 'pt-BR', label: 'Portuguese (Brazil)' },
    { value: 'ja-JP', label: 'Japanese (Japan)' },
    { value: 'ko-KR', label: 'Korean (South Korea)' },
    { value: 'zh-CN', label: 'Chinese (Simplified)' }
  ];

  const deviceOptions = [
    { value: 'default', label: 'Default Device' },
    { value: 'device1', label: 'Built-in Microphone' },
    { value: 'device2', label: 'USB Headset' },
    { value: 'device3', label: 'Bluetooth Headphones' }
  ];

  const speakerOptions = [
    { value: 'default', label: 'Default Speakers' },
    { value: 'speakers1', label: 'Built-in Speakers' },
    { value: 'speakers2', label: 'USB Headset' },
    { value: 'speakers3', label: 'Bluetooth Headphones' }
  ];

  useEffect(() => {
    // Load saved audio preferences
    const savedMic = localStorage.getItem('aria-microphone-device') || 'default';
    const savedSpeaker = localStorage.getItem('aria-speaker-device') || 'default';
    const savedLanguage = localStorage.getItem('aria-speech-language') || 'en-US';
    const savedVoiceOutput = localStorage.getItem('aria-voice-output') !== 'false';
    const savedInputVolume = parseInt(localStorage.getItem('aria-input-volume')) || 75;
    const savedOutputVolume = parseInt(localStorage.getItem('aria-output-volume')) || 80;
    const savedNoiseReduction = localStorage.getItem('aria-noise-reduction') !== 'false';
    const savedAutoGain = localStorage.getItem('aria-auto-gain') !== 'false';
    const savedEchoCancel = localStorage.getItem('aria-echo-cancellation') !== 'false';

    setMicrophoneDevice(savedMic);
    setSpeakerDevice(savedSpeaker);
    setSpeechLanguage(savedLanguage);
    setVoiceOutput(savedVoiceOutput);
    setInputVolume(savedInputVolume);
    setOutputVolume(savedOutputVolume);
    setNoiseReduction(savedNoiseReduction);
    setAutoGainControl(savedAutoGain);
    setEchoCancellation(savedEchoCancel);
  }, []);

  const handleMicrophoneTest = async () => {
    setIsRecording(true);
    try {
      // Simulate microphone test
      await new Promise(resolve => setTimeout(resolve, 3000));
    } catch (error) {
      console.error('Microphone test failed:', error);
    } finally {
      setIsRecording(false);
    }
  };

  const handleSpeakerTest = async () => {
    setIsTesting(true);
    try {
      // Simulate speaker test
      await new Promise(resolve => setTimeout(resolve, 2000));
    } catch (error) {
      console.error('Speaker test failed:', error);
    } finally {
      setIsTesting(false);
    }
  };

  const saveSetting = (key, value) => {
    localStorage.setItem(`aria-${key}`, value.toString());
  };

  return (
    <div className="space-y-8">
      {/* Microphone Settings */}
      <div>
        <h3 className="text-lg font-semibold text-text-primary mb-2">Microphone Input</h3>
        <p className="text-sm text-text-secondary mb-4">Configure voice input settings</p>
        
        <div className="space-y-4">
          <Select
            label="Microphone Device"
            options={deviceOptions}
            value={microphoneDevice}
            onChange={(value) => {
              setMicrophoneDevice(value);
              saveSetting('microphone-device', value);
            }}
          />

          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              Input Volume: {inputVolume}%
            </label>
            <div className="flex items-center space-x-4">
              <Icon name="Mic" size={16} className="text-text-secondary" />
              <input
                type="range"
                min="0"
                max="100"
                value={inputVolume}
                onChange={(e) => {
                  const value = parseInt(e.target.value);
                  setInputVolume(value);
                  saveSetting('input-volume', value);
                }}
                className="flex-1 h-2 bg-muted rounded-lg appearance-none cursor-pointer"
              />
              <Icon name="MicIcon" size={16} className="text-text-secondary" />
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Button
              variant={isRecording ? "destructive" : "outline"}
              size="sm"
              onClick={handleMicrophoneTest}
              iconName={isRecording ? "Square" : "Mic"}
              iconPosition="left"
              disabled={isRecording}
            >
              {isRecording ? 'Recording...' : 'Test Microphone'}
            </Button>
            {isRecording && (
              <div className="flex items-center space-x-2 text-sm text-text-secondary">
                <div className="w-2 h-2 bg-destructive rounded-full animate-pulse"></div>
                <span>Speak now to test your microphone</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Speech Recognition */}
      <div>
        <h3 className="text-lg font-semibold text-text-primary mb-2">Speech Recognition</h3>
        <p className="text-sm text-text-secondary mb-4">Language and processing options</p>
        
        <div className="space-y-4">
          <Select
            label="Recognition Language"
            description="Primary language for speech-to-text conversion"
            options={languageOptions}
            value={speechLanguage}
            onChange={(value) => {
              setSpeechLanguage(value);
              saveSetting('speech-language', value);
            }}
            searchable
          />

          <div className="space-y-3">
            <Checkbox
              label="Noise Reduction"
              description="Filter background noise during recording"
              checked={noiseReduction}
              onChange={(e) => {
                setNoiseReduction(e.target.checked);
                saveSetting('noise-reduction', e.target.checked);
              }}
            />
            
            <Checkbox
              label="Auto Gain Control"
              description="Automatically adjust microphone sensitivity"
              checked={autoGainControl}
              onChange={(e) => {
                setAutoGainControl(e.target.checked);
                saveSetting('auto-gain', e.target.checked);
              }}
            />
            
            <Checkbox
              label="Echo Cancellation"
              description="Prevent audio feedback during playback"
              checked={echoCancellation}
              onChange={(e) => {
                setEchoCancellation(e.target.checked);
                saveSetting('echo-cancellation', e.target.checked);
              }}
            />
          </div>
        </div>
      </div>

      {/* Speaker Settings */}
      <div>
        <h3 className="text-lg font-semibold text-text-primary mb-2">Audio Output</h3>
        <p className="text-sm text-text-secondary mb-4">Configure voice output and speakers</p>
        
        <div className="space-y-4">
          <Checkbox
            label="Enable Voice Output"
            description="Allow AI responses to be spoken aloud"
            checked={voiceOutput}
            onChange={(e) => {
              setVoiceOutput(e.target.checked);
              saveSetting('voice-output', e.target.checked);
            }}
          />

          {voiceOutput && (
            <>
              <Select
                label="Speaker Device"
                options={speakerOptions}
                value={speakerDevice}
                onChange={(value) => {
                  setSpeakerDevice(value);
                  saveSetting('speaker-device', value);
                }}
              />

              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">
                  Output Volume: {outputVolume}%
                </label>
                <div className="flex items-center space-x-4">
                  <Icon name="VolumeX" size={16} className="text-text-secondary" />
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={outputVolume}
                    onChange={(e) => {
                      const value = parseInt(e.target.value);
                      setOutputVolume(value);
                      saveSetting('output-volume', value);
                    }}
                    className="flex-1 h-2 bg-muted rounded-lg appearance-none cursor-pointer"
                  />
                  <Icon name="Volume2" size={16} className="text-text-secondary" />
                </div>
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={handleSpeakerTest}
                iconName={isTesting ? "Loader" : "Volume2"}
                iconPosition="left"
                disabled={isTesting}
                loading={isTesting}
              >
                {isTesting ? 'Testing...' : 'Test Speakers'}
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Audio Quality */}
      <div className="pt-6 border-t border-border">
        <h3 className="text-lg font-semibold text-text-primary mb-2">Audio Quality</h3>
        <p className="text-sm text-text-secondary mb-4">Current audio status and diagnostics</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-muted rounded-lg">
            <div className="flex items-center space-x-2 mb-2">
              <Icon name="Mic" size={16} className="text-success" />
              <span className="text-sm font-medium text-text-primary">Microphone Status</span>
            </div>
            <p className="text-xs text-text-secondary">Connected and ready</p>
            <div className="mt-2 flex items-center space-x-2">
              <div className="w-2 h-2 bg-success rounded-full"></div>
              <span className="text-xs text-success">Active</span>
            </div>
          </div>

          <div className="p-4 bg-muted rounded-lg">
            <div className="flex items-center space-x-2 mb-2">
              <Icon name="Volume2" size={16} className="text-success" />
              <span className="text-sm font-medium text-text-primary">Speaker Status</span>
            </div>
            <p className="text-xs text-text-secondary">Output device ready</p>
            <div className="mt-2 flex items-center space-x-2">
              <div className="w-2 h-2 bg-success rounded-full"></div>
              <span className="text-xs text-success">Active</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AudioSettings;