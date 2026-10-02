import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import Icon from '@/components/common/Icon'
import { productsSearchPath } from '@/constants/routes'
import '@/styles/components/SearchBar.css'

interface SearchBarProps {
  onClose: () => void
}

function SearchBar({ onClose }: SearchBarProps) {
  const [keyword, setKeyword] = useState('')
  const navigate = useNavigate()

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const value = keyword.trim()
    if (!value) return
    navigate(productsSearchPath(value))
    onClose()
  }

  return (
    <div className="search-bar">
      <form className="search-bar__form" role="search" onSubmit={handleSubmit}>
        <label htmlFor="header-search" className="visually-hidden">
          Tìm kiếm sản phẩm
        </label>
        <input
          id="header-search"
          className="search-bar__input"
          type="search"
          placeholder="Tìm kiếm sản phẩm"
          value={keyword}
          onChange={(event) => setKeyword(event.target.value)}
          autoFocus
        />
        <button type="submit" className="search-bar__submit" aria-label="Tìm kiếm">
          <Icon name="search" size={18} />
        </button>
      </form>
      <button type="button" className="search-bar__close" aria-label="Đóng tìm kiếm" onClick={onClose}>
        <Icon name="close" size={22} />
      </button>
    </div>
  )
}

export default SearchBar
