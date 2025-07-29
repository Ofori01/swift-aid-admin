import React from 'react'
import { useParams } from 'react-router-dom'

const Emergency = () => {
    const {emergency_id} = useParams()
  return (
    <div>
      {emergency_id}
    </div>
  )
}

export default Emergency
