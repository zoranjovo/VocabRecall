'use client';

import Checkbox from '../checkbox/Checkbox';
import { setTheme, getThemeNames, getAllThemes, getCurrentTheme, isDefaultTheme } from './themeProvider';
import { useState, useEffect } from 'react';
import styles from './themeselector.module.css';
import { Plus, X } from 'lucide-react';
import Dropdown from '@/app/util/dropdown/Dropdown';
import { notify } from '../notify';

interface CustomTheme {
  name: string;
  [key: string]: string;
}

export default function ThemeSelector() {
  const [themeNames, setThemeNames] = useState(getThemeNames());
  const [themes, setThemes] = useState(getAllThemes());
  const [currentTheme, setCurrentTheme] = useState<string>('dark');

  useEffect(() => {  setCurrentTheme(getCurrentTheme()); }, []);

  const updateTheme = (theme: string) => {
    setTheme(theme);
    setCurrentTheme(theme);
  }

  const useCustomTheme = () => { setAddThemeOpen(true); }

  const [addThemeOpen, setAddThemeOpen] = useState<boolean>(false);

  const dark = themes['Dark'];
  const [newThemeName, setNewThemeName] = useState<string>('');
  const [newThemeBackground, setNewThemeBackground] = useState<string>(dark['--background']);
  const [newThemeText, setNewThemeText] = useState<string>(dark['--text']);
  const [newThemeTextSecondary, setNewThemeTextSecondary] = useState<string>(dark['--text-secondary']);
  const [newThemePanel, setNewThemePanel] = useState<string>(dark['--panel']);
  const [newThemePanelH, setNewThemePanelH] = useState<string>(dark['--panel-h']);
  const [newThemeOutline, setNewThemeOutline] = useState<string>(dark['--outline']);
  const [newThemePrimary, setNewThemePrimary] = useState<string>(dark['--primary']);
  const [newThemeNotify, setNewThemeNotify] = useState<string>(dark['notify']);
  
  // save the theme that the user is currently customising
  function saveNewTheme() {
    if(typeof window === 'undefined') return;
    if(!newThemeName) return notify('warn', 'Please enter a theme name.');
  
    const themeToSave: CustomTheme = { 
      name: newThemeName,
      '--background': newThemeBackground,
      '--text': newThemeText,
      '--text-secondary': newThemeTextSecondary,
      '--panel': newThemePanel,
      '--panel-h': newThemePanelH,
      '--outline': newThemeOutline,
      '--primary': newThemePrimary,
      'notify': newThemeNotify,
    };
  
    const stored = localStorage.getItem('custom-themes');
    let customThemes: CustomTheme[] = [];
  
    if(stored){
      try {
        customThemes = JSON.parse(stored);
      } catch {
        console.error('Failed to parse custom themes');
        return;
      }
    }
    
    // check if name already exists
    const exists = customThemes.some((t) => t.name.toLowerCase() === newThemeName.toLowerCase());
    if(exists){ return notify('warn', `A theme named "${newThemeName}" already exists.`); }
  
    // add to local storage array
    customThemes.push(themeToSave);
    localStorage.setItem('custom-themes', JSON.stringify(customThemes));

    // update list
    setThemeNames(getThemeNames());
    setThemes(getAllThemes());

    notify('success', `Theme "${newThemeName}" saved successfully!`);
    setAddThemeOpen(false);
  }

  // delete a custom theme
  function deleteCustomTheme(themeName: string): void {
    if(typeof window === 'undefined') return;
  
    const stored = localStorage.getItem('custom-themes');
    if(!stored) return;
  
    try {
      const customThemes = JSON.parse(stored) as CustomTheme[];
      const filtered = customThemes.filter(t => t.name !== themeName);
      localStorage.setItem('custom-themes', JSON.stringify(filtered));
  
      // reset to default dark if the selected one is deleted
      if(currentTheme === themeName){ 
        setTheme('Dark');
        setCurrentTheme('Dark');
      }

      // update list
      setThemeNames(getThemeNames());
      setThemes(getAllThemes());

    } catch (err) {
      console.error('Failed to delete custom theme:', err);
    }
  }


  return (
    <>
    <div className={styles.container}>
      <div className={styles.left}>
        <div className={styles.selectorbox}>
          { themeNames.map((theme, index) => {
            const isDefault = isDefaultTheme(theme);
            const v = themes[theme];
            return (
              <div 
                className={styles.itembox} 
                key={ index } 
                style={{ 
                  backgroundColor: v['--panel'],
                }}>
                <Checkbox
                  label={ theme }
                  value={ currentTheme === theme }
                  setValue={ () => updateTheme(theme) }
                  labelColourOverride={ v['--text'] }
                />

                {!isDefault && (
                  <button 
                    onClick={ () => deleteCustomTheme(theme) }
                    className={styles.deleteButton}
                  >
                    <X/>
                  </button>
                )}
              </div>
            )
          })}
        </div>
        
        <div className={styles.newThemeContainer}>
          { addThemeOpen ? (
            <div className={styles.newThemeBox}>
              <input
                value={ newThemeName }
                onChange={ (e) => setNewThemeName(e.target.value) }
                placeholder='Theme Name...'
              ></input>

              <div className={styles.inputItem}>
                <label>Background</label>
                <input
                  type='color'
                  value={ newThemeBackground }
                  onChange={ (e) => setNewThemeBackground(e.target.value) }
                  className={styles.inputItemInput}
                ></input>
              </div>

              <div className={styles.inputItem}>
                <label className={styles.inputItemLabel}>Text</label>
                <input
                  type='color'
                  value={ newThemeText }
                  onChange={ (e) => setNewThemeText(e.target.value) }
                  className={styles.inputItemInput}
                ></input>
              </div>

              <div className={styles.inputItem}>
                <label className={styles.inputItemLabel}>Text Secondary</label>
                <input
                  type='color'
                  value={ newThemeTextSecondary }
                  onChange={ (e) => setNewThemeTextSecondary(e.target.value) }
                  className={styles.inputItemInput}
                ></input>
              </div>

              <div className={styles.inputItem}>
                <label className={styles.inputItemLabel}>Panel</label>
                <input
                  type='color'
                  value={ newThemePanel }
                  onChange={ (e) => setNewThemePanel(e.target.value) }
                  className={styles.inputItemInput}
                ></input>
              </div>

              <div className={styles.inputItem}>
                <label className={styles.inputItemLabel}>Panel Hover</label>
                <input
                  type='color'
                  value={ newThemePanelH }
                  onChange={ (e) => setNewThemePanelH(e.target.value) }
                  className={styles.inputItemInput}
                ></input>
              </div>

              <div className={styles.inputItem}>
                <label className={styles.inputItemLabel}>Outline</label>
                <input
                  type='color'
                  value={ newThemeOutline }
                  onChange={ (e) => setNewThemeOutline(e.target.value) }
                  className={styles.inputItemInput}
                ></input>
              </div>

              <div className={styles.inputItem}>
                <label className={styles.inputItemLabel}>Primary</label>
                <input
                  type='color'
                  value={ newThemePrimary }
                  onChange={ (e) => setNewThemePrimary(e.target.value) }
                  className={styles.inputItemInput}
                ></input>
              </div>

              <div className={styles.inputItem}>
                <label className={styles.inputItemLabel}>Notification</label>
                <Dropdown
                  options={ ['light', 'dark'] }
                  selected={ newThemeNotify }
                  onSelect={ setNewThemeNotify }
                  capitalise
                />
              </div>
              
              <div>
                <button onClick={ saveNewTheme }>Save</button>
              </div>
            </div>
          ) : (
            <button className='flex align-center gap-2' onClick={ useCustomTheme }><Plus/> Add Theme</button>
          )}
        </div>
      </div>
      <div className={styles.right}>
        <div className={styles.previewContainer} style={ addThemeOpen ? { backgroundColor: newThemeBackground, borderColor: newThemeOutline } : {} }>
          <div className={styles.previewContainerPanel} style={ addThemeOpen ? { backgroundColor: newThemePanel, borderColor: newThemeOutline } : {} }>
            <p className={styles.previewContainerText} style={ addThemeOpen ? { color: newThemeText } : {} }>Preview</p>
            <button style={ addThemeOpen ? { backgroundColor: newThemePanelH, borderColor: newThemeOutline } : {} }>Ok</button>
            <p className={styles.previewContainerSecondary} style={ addThemeOpen ? { color: newThemeTextSecondary } : {} }>VocabRecall</p>
          </div>
        </div>
      </div>
    </div>
      
    </>
  );
}

function capitaliseFirst(str: string): string {
  if(!str)return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
}