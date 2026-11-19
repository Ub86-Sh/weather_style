import PinkButton from '../components/PinkButton.jsx'

export default function Welcome({ onNext }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-between p-8">
      <div className="mt-24 text-center">
        <h1 className="text-5xl font-serif text-pink-200 leading-tight">
          Weather<br />in style.
        </h1>
        <p className="mt-4 text-sm text-pink-100/70">
          Умный прогноз погоды<br />и рекомендации по одежде
        </p>
      </div>
      <div className="w-full max-w-xs">
        <PinkButton onClick={onNext}>Начать →</PinkButton>
      </div>
    </div>
  )
}
