"use client"

import Image from 'next/image';
import React, { useState } from 'react'
import AddNewSessionDialog from './AddNewSessionDialog';

function HistoryList() {
    const [historylist, setHistorylist] = useState([]);
  return (
    <div className='mt-10'>
        {historylist.length==0?
        <div className='flex items-center flex-col justify-center p-8 border border-dashed rounded-2xl border-2'>
            <Image src={'/3736765.jpg'} alt='empty' width={150} height={150}/>
            <h2 className='font-bold text-xl mt-5'>No Recent Consultations</h2>
            <p>It looks like you haven't consulted with any doctors yet!</p>
            <AddNewSessionDialog/>
        </div>

        :<div>List</div>
        }
    </div>
  )
}

export default HistoryList