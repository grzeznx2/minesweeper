import React from 'react'
import { Face as EFace } from '../../types'
import './Face.scss'

interface FaceProps {
  face: EFace
}

const Face: React.FC<FaceProps> = ({ face }) => {
  return (
    <div className="face">
      <span role="img" aria-label="face">
        {face}
      </span>
    </div>
  )
}

export default Face
