"use client"

import Image from 'next/image';
import React, { useEffect, useState } from 'react'
import AddNewSessionDialog from './AddNewSessionDialog';
import axios from 'axios';
import HistoryTable from './HistoryTable';
import { SessionDetail } from '../medical-agent/[sessionId]/page';

function HistoryList() {
    const [historylist, setHistorylist] = useState<SessionDetail[]>([]);
    useEffect(()=>{
      GetHistoryList();
    },[])
    const GetHistoryList=async()=>{
      const result = await axios.get('/api/session-chat?sessionId=all');
      console.log(result.data);
      setHistorylist(result.data);

    }
  return (
    <div className='mt-10'>
        {historylist.length==0?
        <div className='flex items-center flex-col justify-center p-8 border border-dashed rounded-2xl border-2'>
            <Image src={'/3736765.jpg'} alt='empty' width={150} height={150}/>
            <h2 className='font-bold text-xl mt-5'>No Recent Consultations</h2>
            <p>It looks like you haven't consulted with any doctors yet!</p>
            <AddNewSessionDialog/>
        </div>

        :<div><HistoryTable historylist={historylist}/></div>
        }
    </div>
  )
}

export default HistoryList