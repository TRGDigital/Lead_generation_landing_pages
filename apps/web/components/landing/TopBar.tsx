interface TopBarProps {
  tagline: string
}

export default function TopBar({ tagline }: TopBarProps) {
  return (
    <div className="bg-brand-accent text-white text-sm py-2.5 text-center px-4 font-medium tracking-wide">
      {tagline}
    </div>
  )
}
