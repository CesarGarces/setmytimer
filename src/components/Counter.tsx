import { useState, useEffect, useRef } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Switch,
  Box,
  Input,
  IconButton,
  MenuItem,
  Select,
  SelectChangeEvent,
} from "@mui/material";
import NotificationsIcon from "@mui/icons-material/Notifications";
import NotificationsOffIcon from "@mui/icons-material/NotificationsOff";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import "./Counter.css";

export default function Counter() {
  const [time, setTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [selectedAudio, setSelectedAudio] = useState("/alarm-sound-1.mp3");
  const [customTimers, setCustomTimers] = useState<number[]>([]);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    audioRef.current = new Audio(selectedAudio);
  }, [selectedAudio]);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isRunning && time > 0) {
      interval = setInterval(() => {
        setTime((prevTime) => prevTime - 1);
      }, 1000);
    } else if (time === 0 && isRunning) {
      setIsRunning(false);

      if (!isMuted && audioRef.current) {
        audioRef.current.play();
      }
    }

    return () => clearInterval(interval);
  }, [isRunning, time, isMuted, selectedAudio]);

  const formatTime = (seconds: number) => {
    const days = Math.floor(seconds / (3600 * 24));
    const hours = Math.floor((seconds % (3600 * 24)) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    return `${days.toString().padStart(2, "0")}:${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const handleStart = () => {
    if (time > 0) {
      setIsRunning(true);
    }
  };

  const handlePause = () => setIsRunning(false);

  const handleReset = () => {
    setIsRunning(false);
    setTime(0);
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  };

  const setQuickTime = (seconds: number) => {
    setTime(seconds);
  };

  const handleCustomTime = (days: number, hours: number, minutes: number, seconds: number) => {
    const totalSeconds = days * 86400 + hours * 3600 + minutes * 60 + seconds;
    setTime(totalSeconds);
    setShowModal(false);
  };

  const handleSaveCustomTime = (days: number, hours: number, minutes: number, seconds: number) => {
    const totalSeconds = days * 86400 + hours * 3600 + minutes * 60 + seconds;
    setCustomTimers([...customTimers, totalSeconds]);
    setShowModal(false);
  };

  const toggleMute = () => {
    setIsMuted((prevMuted) => {
      const newMuted = !prevMuted;
      if (audioRef.current) {
        if (newMuted) {
          audioRef.current.pause();
          audioRef.current.currentTime = 0;
        }
      }
      return newMuted;
    });
  };

  const handleAudioChange = (event: SelectChangeEvent<string>) => {
    setSelectedAudio(event.target.value as string);
  };

  const handleDeleteCustomTimer = (index: number) => {
    setCustomTimers((prevTimers) => prevTimers.filter((_, i) => i !== index));
  };

  return (
    <div className="container">
      <Box className="box">
        <h1 className="title">{formatTime(time)}</h1>
        <div className="button-group">
          <Button color="success" variant="contained" onClick={handleStart} disabled={isRunning || time === 0}>
            Iniciar
          </Button>
          <Button color="warning" variant="contained" onClick={handlePause} disabled={!isRunning}>
            Pausar
          </Button>
          <Button variant="contained" onClick={handleReset}>Reiniciar</Button>
          <Button variant="outlined" onClick={() => setShowModal(true)}>
            Personalizar
          </Button>
          <div className="switch-group">
            <Switch id="mute-mode" checked={!isMuted} onChange={toggleMute} />
            <IconButton>
              {isMuted ? <NotificationsOffIcon /> : <NotificationsIcon />}
            </IconButton>
            <Select
              value={selectedAudio}
              onChange={handleAudioChange}
              displayEmpty
              inputProps={{ 'aria-label': 'Select Audio' }}
              style={{ marginLeft: 10 }}
            >
              <MenuItem value="/alarm-sound-1.mp3">Audio 1</MenuItem>
              <MenuItem value="/alarm-sound-2.mp3">Audio 2</MenuItem>
            </Select>
          </div>
        </div>
        <div className="grid">
          <div className="seconds">
            <h3>Segundos</h3>
            <Button variant="outlined" onClick={() => setQuickTime(30)}>30 segundos</Button>
            <Button variant="outlined" onClick={() => setQuickTime(60)}>60 segundos</Button>
          </div>
          <div className="minutes">
            <h3>Minutos</h3>
            <Button variant="outlined" onClick={() => setQuickTime(60)}>1 minuto</Button>
            <Button variant="outlined" onClick={() => setQuickTime(120)}>2 minutos</Button>
          </div>
          <div className="hours">
            <h3>Horas</h3>
            <Button variant="outlined" onClick={() => setQuickTime(3600)}>1 hora</Button>
            <Button variant="outlined" onClick={() => setQuickTime(7200)}>2 horas</Button>
          </div>
          <div className="days">
            <h3>Días</h3>
            <Button variant="outlined" onClick={() => setQuickTime(86400)}>1 día</Button>
            <Button variant="outlined" onClick={() => setQuickTime(172800)}>2 días</Button>
          </div>
        </div>

        <div className="custom-timers">
          <h3>Cronómetros Personalizados</h3>
          {customTimers.map((timer, index) => (
            <div key={index} className="custom-timer">
              <Button variant="outlined" onClick={() => setTime(timer)}>
                Personalizado {index + 1}: {formatTime(timer)}
              </Button>
              <IconButton onClick={() => handleDeleteCustomTimer(index)} aria-label="delete" color="error">
                <HighlightOffIcon />
              </IconButton>
            </div>
          ))}
        </div>
      </Box>

      <Dialog open={showModal} onClose={() => setShowModal(false)}>
        <DialogTitle>Establecer tiempo personalizado</DialogTitle>
        <DialogContent>
          <CustomTimeForm onSet={handleCustomTime} onSave={handleSaveCustomTime} />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowModal(false)}>Cerrar</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

function CustomTimeForm({
  onSet,
  onSave,
}: {
  onSet: (d: number, h: number, m: number, s: number) => void;
  onSave: (d: number, h: number, m: number, s: number) => void;
}) {
  const [days, setDays] = useState(0);
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);

  const handleSet = (e: React.FormEvent) => {
    e.preventDefault();
    onSet(days, hours, minutes, seconds);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(days, hours, minutes, seconds);
  };

  return (
    <form className="form">
      <div className="form-group">
        <Box>Días</Box>
        <Input
          id="days"
          type="number"
          inputProps={{ min: 0, max: 365 }}
          value={days}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setDays(parseInt(e.target.value))}
        />
      </div>
      <div className="form-group">
        <Box>Horas</Box>
        <Input
          id="hours"
          type="number"
          inputProps={{ min: 0, max: 23 }}
          value={hours}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setHours(parseInt(e.target.value))}
        />
      </div>
      <div className="form-group">
        <Box>Minutos</Box>
        <Input
          id="minutes"
          type="number"
          inputProps={{ min: 0, max: 59 }}
          value={minutes}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setMinutes(parseInt(e.target.value))}
        />
      </div>
      <div className="form-group">
        <Box>Segundos</Box>
        <Input
          id="seconds"
          type="number"
          inputProps={{ min: 0, max: 59 }}
          value={seconds}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSeconds(parseInt(e.target.value))}
        />
      </div>
      <Button disabled={!days && !hours && !minutes && !seconds} type="submit" variant="contained" color="success" onClick={handleSet}>
        Establecer
      </Button>
      <Button disabled={!days && !hours && !minutes && !seconds} type="submit" variant="contained" color="primary" onClick={(e: React.FormEvent) => { handleSave(e); handleSet(e); }}>
        Guardar
      </Button>
    </form>
  );
}