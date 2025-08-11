import React from 'react'
import { doctorAgent } from './DoctorAgentCard'
import Image from 'next/image'

type Props = {
  doctorAgent: doctorAgent
  setSelectedDoctor: (doctor: doctorAgent) => void
  selectedDoctor?: doctorAgent
}

function SuggestedDoctorsCard({ doctorAgent, setSelectedDoctor, selectedDoctor }: Props) {
  const isSelected = selectedDoctor?.id === doctorAgent.id

  return (
    <div
      className={`flex flex-col items-center justify-between rounded-2xl shadow p-5 cursor-pointer hover:border-blue-500 ${
        isSelected ? 'border border-blue-500' : 'border'
      }`}
      onClick={() => setSelectedDoctor(doctorAgent)}
    >
      <Image
        src={doctorAgent?.image}
        alt={doctorAgent?.specialist}
        width={50}
        height={50}
        className="rounded-full object-cover"
      />
      <h2 className="font-bold text-sm mt-2">{doctorAgent.specialist}</h2>
      <p className="text-xs text-center line-clamp-2">{doctorAgent?.description}</p>
    </div>
  )
}

export default SuggestedDoctorsCard
