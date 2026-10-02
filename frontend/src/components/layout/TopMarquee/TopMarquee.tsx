import '@/styles/components/TopMarquee.css'

const MESSAGE = 'Chào mừng bạn tới Yarnly'
const REPEAT = 8

function TopMarquee() {
  const items = Array.from({ length: REPEAT }, (_, i) => (
    <span key={i} className="top-marquee__item">
      {MESSAGE}
    </span>
  ))

  return (
    <div className="top-marquee" role="marquee" aria-label={MESSAGE}>
      <div className="top-marquee__track" aria-hidden="true">
        {items}
        {items}
      </div>
    </div>
  )
}

export default TopMarquee
