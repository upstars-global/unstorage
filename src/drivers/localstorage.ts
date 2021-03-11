import type { DriverFactory } from '../types'

export interface LocalStorageOptions {
  base?: string
  window?: typeof window
  localStorage?: typeof window.localStorage
}

export default <DriverFactory>function (opts: LocalStorageOptions = {}) {
  if (!opts.window) {
    opts.window = typeof window !== 'undefined' ? window : undefined
  }
  if (!opts.localStorage) {
    opts.localStorage = opts.window?.localStorage
  }
  if (!opts.localStorage) {
    throw new Error('localStorage not available')
  }

  const r = (key: string) => (opts.base ? opts.base + ':' : '') + key


  let _storageListener: (ev: StorageEvent) => void

  return {
    hasItem (key) {
      return Object.prototype.hasOwnProperty.call(opts.localStorage!, r(key))
    },
    getItem (key) {
      return opts.localStorage!.getItem(r(key))
    },
    setItem (key, value) {
      return opts.localStorage!.setItem(r(key), value)
    },
    removeItem (key) {
      return opts.localStorage!.removeItem(r(key))
    },
    getKeys () {
      return Object.keys(opts.localStorage!)
    },
    clear() {
      if (!opts.base) {
        opts.localStorage!.clear()
      } else {
        for (const key of Object.keys(opts.localStorage!)) {
          opts.localStorage?.removeItem(key)
        }
      }
      if (opts.window && _storageListener) {
        opts.window.removeEventListener('storage', _storageListener)
      }
    },
    watch(callback) {
      if (opts.window) {
        _storageListener = (ev: StorageEvent) => {
          if (ev.key) {
            callback(ev.newValue ? 'update' : 'remove', ev.key)
          }
        }
        opts.window.addEventListener('storage', _storageListener)
      }
    }
  }
}
