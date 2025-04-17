import styles from './checkbox.module.css';
import { Check } from 'lucide-react'

export default function Checkbox({
  label,
  value,
  setValue,
  labelColourOverride,
  primaryColourOverride,
}: { 
  label: string;
  value: boolean;
  setValue: (val: boolean) => void;
  labelColourOverride?: string;
  primaryColourOverride?: string;
}){

  return (
    <label className={styles.checkbox}>
      <input
        type="checkbox"
        checked={value}
        onChange={() => setValue(!value)}
        className={styles.checkboxinput}
        style={ primaryColourOverride ? { backgroundColor: primaryColourOverride } : {} }
      />
      <span className={styles.checkboxbox}>{value && <Check/>}</span>
      {label && <span className={styles.checkboxlabel} style={ labelColourOverride ? { color: labelColourOverride } : {} }>{label}</span>}
    </label>
  );
}

