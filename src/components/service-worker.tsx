"use client"

import { useEffect } from 'react'

export function ServiceWorkerProvider() {
  useEffect(() => {
    if (
      typeof window !== 'undefined' &&
      'serviceWorker' in navigator &&
      process.env.NODE_ENV === 'production'
    ) {
      registerServiceWorker()
    }
  }, [])

  return null
}

async function registerServiceWorker() {
  try {
    const registration = await navigator.serviceWorker.register('/sw.js', {
      scope: '/',
    })

    console.log('Service Worker registered successfully:', registration)

    // Handle updates
    registration.addEventListener('updatefound', () => {
      const newWorker = registration.installing
      
      if (newWorker) {
        newWorker.addEventListener('statechange', () => {
          if (newWorker.state === 'installed') {
            if (navigator.serviceWorker.controller) {
              // New service worker available
              console.log('New service worker available')
              
              // You could show a notification to the user here
              // For now, we'll just log it
              showUpdateAvailable()
            } else {
              // Service worker cached for offline use
              console.log('Content cached for offline use')
              showOfflineReady()
            }
          }
        })
      }
    })

    // Check for existing service worker and updates
    if (registration.waiting) {
      showUpdateAvailable()
    }

    // Listen for controlling service worker changes
    navigator.serviceWorker.addEventListener('controllerchange', () => {
      window.location.reload()
    })

    // Register for background sync if supported
    if ('sync' in registration) {
      console.log('Background sync supported')
    }

  } catch (error) {
    console.error('Service Worker registration failed:', error)
  }
}

function showUpdateAvailable() {
  // In a real app, you might show a toast or banner
  console.log('🔄 App update available! Please refresh the page.')
  
  // Dispatch custom event that components can listen to
  window.dispatchEvent(new CustomEvent('sw-update-available'))
}

function showOfflineReady() {
  console.log('✅ App ready to work offline!')
  
  // Dispatch custom event
  window.dispatchEvent(new CustomEvent('sw-offline-ready'))
}

// Hook for components to listen to service worker events
export function useServiceWorker() {
  useEffect(() => {
    const handleUpdateAvailable = () => {
      // You could show a notification here
      console.log('Service worker update available')
    }

    const handleOfflineReady = () => {
      // You could show a notification here
      console.log('App is ready for offline use')
    }

    window.addEventListener('sw-update-available', handleUpdateAvailable)
    window.addEventListener('sw-offline-ready', handleOfflineReady)

    return () => {
      window.removeEventListener('sw-update-available', handleUpdateAvailable)
      window.removeEventListener('sw-offline-ready', handleOfflineReady)
    }
  }, [])

  const updateServiceWorker = async () => {
    if ('serviceWorker' in navigator) {
      const registration = await navigator.serviceWorker.getRegistration()
      if (registration?.waiting) {
        registration.waiting.postMessage({ type: 'SKIP_WAITING' })
      }
    }
  }

  return { updateServiceWorker }
}