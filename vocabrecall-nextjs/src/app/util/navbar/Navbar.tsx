import Link from "next/link";
import styles from './navbar.module.css';

export default async function Navbar(){
  return (
    <div className={styles.fake}>
      <nav className={styles.navbar}>
        <div className={styles.navbargroup}>
          <Link href="/" className={styles.navItem}>
            🏠
          </Link>
          <Link href="/cards" className={styles.navItem}>
            🃏
          </Link>
        </div>
        <div className={styles.navbargroup}>
          <Link href="/settings" className={`${styles.navItem} ${styles.gear}`}>
            ⚙️
          </Link>
        </div>
      </nav>
    </div>
    
  );
  
};
