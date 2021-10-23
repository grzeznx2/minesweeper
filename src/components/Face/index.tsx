import React from 'react'
import { Face as EFace } from '../../types'
import './Face.scss'

interface FaceProps {
  face: EFace
  onClick: () => void
}

const Face: React.FC<FaceProps> = ({ face, onClick }) => {
  return (
    <div className="face" onClick={onClick}>
      <span role="img" aria-label="face">
        {face}
      </span>
    </div>
  )
}

export default Face
