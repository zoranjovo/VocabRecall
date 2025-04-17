import { getSession } from '@/app/util/session';
import { redirect } from 'next/navigation';
import styles from './settingspage.module.css';
import Backup from './items/backup/Backup';
import ThemeSelector from "@/app/util/themes/themeSelector";

export default async function SettingsPage(){
  const session = await getSession();
  if(!session){ redirect('/login'); }

  return(
    <div className={styles.page}>
      <h1 className={styles.title}>Settings</h1>
      <div className={styles.contentContainer}>

        <div className={styles.contentBox}>
          <p className={styles.itemHeader}>Theme</p>
          <div className='p-2'>
            <ThemeSelector/>
          </div>
        </div>

        <div className={styles.contentBox}>
          <p className={styles.itemHeader}>Backup/Restore</p>
          <Backup/>
        </div>

      </div>
    </div>
  )
}