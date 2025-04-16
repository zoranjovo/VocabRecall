"use client";

import { useState } from 'react';
import Dropdown from '@/app/util/dropdown/Dropdown';
import styles from './backup.module.css';
import { notify } from '@/app/util/notify';
import Loading from '@/app/util/loading'
import axios from 'axios';


const descriptions: Record<string, string> = {
  'Server': 'Creates a backup file on the server inside the prisma/backups directory.',
  'JSON': 'Downloads all data in JSON format.',
  'SQLITE': 'Downloads all data in a .sqlite file.',
}
const options: string[] = ['Server', 'JSON', 'SQLITE'];
type optionsType = typeof options[number];

export default function Backup(){
  const [selected, setSelected] = useState<optionsType>('Server');
  const [loading, setLoading] = useState<boolean>(false);


  const handleBtn = async () => {
    setLoading(true);
    try {

      if(selected === 'Server'){
        const res = await axios.get('/api/backup/server');
        if(res.status === 200){ notify('success', 'Created backup on server.'); }

      } else if(selected === 'JSON'){
        const res = await axios.get('/api/backup/json');
        const blob = new Blob([JSON.stringify(res.data, null, 2)], { type: 'application/json' });

        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'backup.json';
        link.click();
        URL.revokeObjectURL(url);
        notify('success', 'Downloaded JSON backup.');

      } else if(selected === 'SQLITE'){
        const res = await axios.get('/api/backup/dbfile', { responseType: 'blob' });

        const url = URL.createObjectURL(res.data);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'backup.sqlite';
        link.click();
        URL.revokeObjectURL(url);
        notify('success', 'Downloaded SQLITE backup.');
      }

    } catch(err: any){
      if(err.response.status === 429){
        notify('warn', 'Please wait 1 minute between creating backups.');
      } else {
        console.error(err);
        notify('error', 'Error backing up');
      }
      
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className='p-2'>
      <div className='flex items-center gap-5 mb-3 mt-2'>
        <p>Type</p>
        <div className='w-min'>
          <Dropdown
            options={ options }
            selected={ selected }
            onSelect={ (opt) => setSelected(opt) }
          />
        </div>
      </div>
      <p>{descriptions[selected]}</p>
      <div className={styles.btnContainer}>
        { loading ? (
          <Loading/>
        ) : (
          <button onClick={ handleBtn }>{ selected === 'Server' ? 'Backup' : 'Download' }</button>
        )}
        
      </div>
      
    </div>
  )
}