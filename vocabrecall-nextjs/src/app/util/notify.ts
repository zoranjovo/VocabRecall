'use client'

import { toast, Slide } from 'react-toastify';

export const notify = (type: 'warn' | 'success' | 'error', msg: string) => {
  const currentTheme: string | null = typeof window !== 'undefined' ? localStorage.getItem('notify') : 'light';
  const notificationTheme: 'light' | 'dark' = currentTheme === 'light' || currentTheme === 'dark' ? currentTheme : 'light';

  if(type === 'warn'){
    toast.warn(msg, {
      position: "top-right",
      autoClose: 4000,
      hideProgressBar: false,
      closeOnClick: false,
      pauseOnHover: true,
      draggable: true,
      theme: notificationTheme,
      transition: Slide,
    });
  } else if(type === 'success'){
    toast.success(msg, {
      position: "top-right",
      autoClose: 4000,
      hideProgressBar: false,
      closeOnClick: false,
      pauseOnHover: true,
      draggable: true,
      theme: notificationTheme,
      transition: Slide,
    });
  } else if(type === 'error'){
    toast.error(msg, {
      position: "top-right",
      autoClose: 4000,
      hideProgressBar: false,
      closeOnClick: false,
      pauseOnHover: true,
      draggable: true,
      theme: notificationTheme,
      transition: Slide,
    });
  }
}