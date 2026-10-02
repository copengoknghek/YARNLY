import '@/styles/components/Loading.css'

function Loading({ text = 'Đang tải...' }: { text?: string }) {
  return (
    <div className="loading" role="status">
      <span className="loading__spinner" />
      <span className="loading__text">{text}</span>
    </div>
  )
}

export default Loading
