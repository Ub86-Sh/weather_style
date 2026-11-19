export default function PinkButton({ children, onClick }) {
  return (
    <button
      onClick={onClick}
      className="w-full rounded-full bg-pink-300 text-neutral-900 py-3 font-medium"
    >
      {children}
    </button>
  )
}
