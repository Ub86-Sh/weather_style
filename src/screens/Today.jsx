import GlassCard from '../components/GlassCard.jsx'
import { weather } from '../data/mock.js'

export default function Today() {
  return (
    <div className="min-h-screen p-6 max-w-sm mx-auto">
      <div className="text-center text-pink-100">{weather.city}</div>
      <div className="mt-8 text-7xl font-serif text-pink-200">+{weather.temp}°</div>
      <p className="mt-2 text-pink-100/80">Ощущается как +{weather.feelsLike}°</p>
      <p className="mt-1 text-xl">{weather.condition}</p>

      <GlassCard className="mt-8 grid grid-cols-3 text-center text-sm">
        <div>{weather.humidity}%<br /><span className="text-xs opacity-60">Влажность</span></div>
        <div>{weather.wind} м/с<br /><span className="text-xs opacity-60">Ветер</span></div>
        <div>{weather.uv}<br /><span className="text-xs opacity-60">УФ-индекс</span></div>
      </GlassCard>
    </div>
  )
}
