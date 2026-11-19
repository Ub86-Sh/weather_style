import { useEffect, useState } from 'react'

const now = {
  city: 'Москва',
  temp: 0,
  feelsLike: -5,
  condition: 'Пасмурно',
  wind: 4,
  precip: 0,
}

const plan = [
  { title: 'Сегодня подойдёт', text: 'Лучше одеться в несколько слоёв. Закройте шею и не забудьте тёплую обувь.' },
]

const items = [
  { emoji: '🧥', label: 'Куртка' },
  { emoji: '🧣', label: 'Шарф' },
  { emoji: '🧤', label: 'Перчатки' },
  { emoji: '👢', label: 'Тёплая обувь' },
]

function Reveal({ children, delay = 0 }) {
  const [show, setShow] = useState(false)
  useEffect(() => {
    const t = setTimeout(() => setShow(true), delay)
    return () => clearTimeout(t)
  }, [delay])
  return (
    <div className={`transition-all duration-700 ${show ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
      {children}
    </div>
  )
}

export default function App() {
  const [saved, setSaved] = useState(false)

  return (
    <div className="min-h-screen px-5 py-6 max-w-md mx-auto" style={{ animation: 'fadeScreen 0.8s ease-out' }}>
      <header className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-pink-300 text-xl">👚</span>
          <span className="serif text-xl text-pink-100">по погоде<span className="text-pink-300">.</span></span>
        </div>
        <div className="glass px-4 py-2 text-sm">{now.city} ▾</div>
      </header>

      <Reveal>
        <div className="mt-10 flex items-start justify-between">
          <h1 className="serif text-4xl text-pink-100 leading-tight">Можно<br />выходить.</h1>
          <span className="text-5xl text-pink-300" style={{ animation: 'float 4s ease-in-out infinite' }}>🦋</span>
        </div>
        <p className="mt-3 text-sm text-pink-100/70">Посмотрим за окно и подберём, что надеть.</p>
      </Reveal>

      <Reveal delay={200}>
        <div className="glass mt-8 p-6">
          <p className="text-sm text-pink-100/60">Сейчас на улице</p>
          <div className="mt-2 flex items-end justify-between">
            <div>
              <div className="serif text-7xl text-pink-100">{now.temp}°</div>
              <p className="mt-2 text-pink-100/80">{now.condition}</p>
            </div>
            <div className="text-right text-sm space-y-2">
              <p>Ощущается {now.feelsLike}°</p>
              <p>Ветер {now.wind} м/с</p>
              <p>Осадки {now.precip}%</p>
            </div>
          </div>
          <div className="mt-6 flex justify-center">
            <div
              className="text-8xl"
              style={{ animation: 'float 3s ease-in-out infinite' }}
            >
              🧍‍♀️
            </div>
          </div>
          <p className="mt-2 text-xs text-pink-100/60 text-center">Ваш образ для прогулки</p>
        </div>
      </Reveal>

      <Reveal delay={400}>
        <div className="glass mt-6 p-6">
          <div className="flex items-baseline justify-between">
            <h2 className="serif text-2xl text-pink-100">{plan[0].title}</h2>
            <span className="text-xs text-pink-100/60">Для прогулки</span>
          </div>
          <p className="mt-3 text-sm text-pink-100/80">{plan[0].text}</p>

          <div className="mt-5 grid grid-cols-4 gap-2 text-center">
            {items.map((i) => (
              <div key={i.label} className="glass p-2 hover:scale-110 transition-transform">
                <div className="text-2xl">{i.emoji}</div>
                <div className="text-[10px] mt-1 text-pink-100/70">{i.label}</div>
              </div>
            ))}
          </div>

          <button
            onClick={() => setSaved((s) => !s)}
            className="mt-6 w-full rounded-full bg-pink-300 text-neutral-900 py-3 font-medium hover:scale-105 active:scale-95 transition-transform"
          >
            {saved ? 'Образ сохранён ♥' : 'Сохранить образ ♡'}
          </button>
        </div>
      </Reveal>
    </div>
  )
}

