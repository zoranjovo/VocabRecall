import styles from './checkbox.module.css';
import { Check } from 'lucide-react'

export default function Checkbox({ label, value, setValue }: { label: string, value: boolean, setValue: (val: boolean) => void }) {

  return (
    <label className={styles.checkbox}>
      <input
        type="checkbox"
        checked={value}
        onChange={() => setValue(!value)}
        className={styles.checkboxinput}
      />
      <span className={styles.checkboxbox}>{value && <Check/>}</span>
      {label && <span className={styles.checkboxlabel}>{label}</span>}
    </label>
  );
}
