"use client";
import React, { useState, useEffect, useRef } from 'react';
import styles from '@/app/components/birthdaycelebration.module.css';

const BirthdayCelebration: React.FC = () => {
  const [celebrationStarted, setCelebrationStarted] = useState(false);
  const [name, setName] = useState('');
  const [birthday, setBirthday] = useState('');
  const [currentWish, setCurrentWish] = useState('');
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const wishes = [
    "May your day be filled with joy!",
    "Wishing you a fantastic year ahead!",
    "Happy Birthday! Enjoy your special day!",
    "Another year older, another year wiser!",
    "May all your dreams come true!"
  ];

  class Balloon {
    x: number;
    y: number;
    radius: number;
    color: string;
    speed: number;
    popped: boolean;
    popParticles: Array<{x: number, y: number, vx: number, vy: number}>;

    constructor(x: number, y: number) {
      this.x = x;
      this.y = y;
      this.radius = 20 + Math.random() * 20;
      this.color = `hsl(${Math.random() * 360}, 100%, 50%)`;
      this.speed = 1 + Math.random() * 2;
      this.popped = false;
      this.popParticles = [];
    }

    draw(ctx: CanvasRenderingContext2D) {
      if (!this.popped) {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.closePath();
      } else {
        this.popParticles.forEach(particle => {
          ctx.beginPath();
          ctx.arc(particle.x, particle.y, 2, 0, Math.PI * 2);
          ctx.fillStyle = this.color;
          ctx.fill();
          ctx.closePath();

          particle.x += particle.vx;
          particle.y += particle.vy;
          particle.vy += 0.1;
        });
      }
    }

    update(canvasHeight: number) {
      if (!this.popped) {
        this.y -= this.speed;
        if (this.y + this.radius < 0) {
          this.y = canvasHeight + this.radius;
        }
      }
    }

    pop() {
      this.popped = true;
      for (let i = 0; i < 20; i++) {
        this.popParticles.push({
          x: this.x,
          y: this.y,
          vx: (Math.random() - 0.5) * 5,
          vy: (Math.random() - 0.5) * 5
        });
      }
    }
  }

  class Candle {
    x: number;
    y: number;
    lit: boolean;
    flameSize: number;

    constructor(x: number, y: number) {
      this.x = x;
      this.y = y;
      this.lit = true;
      this.flameSize = 0;
    }

    draw(ctx: CanvasRenderingContext2D) {
      ctx.fillStyle = '#FFA500';
      ctx.fillRect(this.x - 5, this.y, 10, 40);

      ctx.fillStyle = '#000000';
      ctx.fillRect(this.x - 1, this.y - 5, 2, 5);

      if (this.lit) {
        ctx.beginPath();
        ctx.moveTo(this.x, this.y - 5);
        ctx.quadraticCurveTo(this.x + 5, this.y - 15 - this.flameSize, this.x, this.y - 25 - this.flameSize);
        ctx.quadraticCurveTo(this.x - 5, this.y - 15 - this.flameSize, this.x, this.y - 5);
        ctx.fillStyle = '#FFD700';
        ctx.fill();
        ctx.closePath();

        this.flameSize = Math.sin(Date.now() / 100) * 5;
      }
    }

    toggle() {
      this.lit = !this.lit;
    }
  }

  const startCelebration = () => {
    if (!name || !birthday) {
      alert("Please enter both your name and birthday.");
      return;
    }

    setCurrentWish(`Happy Birthday, ${name}! ${wishes[Math.floor(Math.random() * wishes.length)]}`);
    setCelebrationStarted(true);
  };

  useEffect(() => {
    if (!celebrationStarted || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const balloons: Balloon[] = [];
    const candles: Candle[] = [];

    const createBalloons = () => {
      for (let i = 0; i < 50; i++) {
        balloons.push(new Balloon(Math.random() * canvas.width, canvas.height + Math.random() * canvas.height));
      }
    };

    const createCandles = () => {
      const candleCount = 5;
      const spacing = canvas.width / (candleCount + 1);
      for (let i = 1; i <= candleCount; i++) {
        candles.push(new Candle(i * spacing, canvas.height - 100));
      }
    };

    createBalloons();
    createCandles();

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      balloons.forEach(balloon => {
        balloon.update(canvas.height);
        balloon.draw(ctx);
      });

      candles.forEach(candle => candle.draw(ctx));

      ctx.font = '30px Arial';
      ctx.fillStyle = '#000000';
      ctx.textAlign = 'center';
      ctx.fillText(currentWish, canvas.width / 2, 50);

      requestAnimationFrame(animate);
    };

    animate();

    const handleClick = (event: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;

      balloons.forEach(balloon => {
        if (!balloon.popped && Math.hypot(x - balloon.x, y - balloon.y) < balloon.radius) {
          balloon.pop();
        }
      });

      candles.forEach(candle => {
        if (Math.hypot(x - candle.x, y - candle.y) < 20) {
          candle.toggle();
        }
      });
    };

    canvas.addEventListener('click', handleClick);

    const changeBackgroundColor = () => {
      const colors = ['red', 'purple', 'green', 'blue', 'orange', 'pink'];
      const color1 = colors[Math.floor(Math.random() * colors.length)];
      const color2 = colors[Math.floor(Math.random() * colors.length)];
      document.body.style.background = `linear-gradient(to right, ${color1}, ${color2})`;
    };

    const intervalId = setInterval(changeBackgroundColor, 1000);

    return () => {
      canvas.removeEventListener('click', handleClick);
      clearInterval(intervalId);
    };
  }, [celebrationStarted, currentWish]);

  return (
    <div className={styles.container}>
      {!celebrationStarted ? (
        <div className={styles.userForm}>
          <h2>Enter Your Birthday Details</h2>
          <input
            type="text"
            placeholder="Your Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <input
            type="date"
            value={birthday}
            onChange={(e) => setBirthday(e.target.value)}
            required
          />
          <button onClick={startCelebration}>Celebrate!</button>
        </div>
      ) : (
        <canvas ref={canvasRef} className={styles.celebrationCanvas} />
      )}
    </div>
  );
};

export default BirthdayCelebration;
