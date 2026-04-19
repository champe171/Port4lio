import Image from 'next/image'
import Spinner from './Spinner'
import { useRef } from 'react'

interface Props {
  current?: string
  isUploading: boolean
  onSelect: (file: File) => void
  placeholder?: string
}

export default function ImageUploadSlot({ current, isUploading, onSelect, placeholder }: Props) {
  const inputRef = useRef<HTMLInputElement>(null)

  return (
    <div
      className="w-40 h-52 border-2 border-dashed border-gray-300 rounded flex items-center justify-center cursor-pointer relative overflow-hidden hover:border-gray-500 transition-colors"
      onClick={() => inputRef.current?.click()}
    >
      {isUploading ? (
        <Spinner />
      ) : current ? (
        <Image src={current} alt="Hero photo" fill className="object-cover" sizes="160px" />
      ) : (
        <span className="text-xs text-gray-400 text-center px-3">{placeholder || 'Upload image'}</span>
      )}
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={e => {
          const file = e.target.files?.[0]
          if (file) onSelect(file)
          e.target.value = ''
        }}
      />
    </div>
  )
}
