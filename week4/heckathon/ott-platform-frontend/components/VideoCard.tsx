interface VideoCardProps {
  id: string
  title: string
  thumbnail: string
  duration?: string
}

export default function VideoCard({ id, title, thumbnail, duration }: VideoCardProps) {
  return (
    <div className="video-card">
      <img src={thumbnail} alt={title} />
      <h3>{title}</h3>
      {duration && <span>{duration}</span>}
    </div>
  )
}