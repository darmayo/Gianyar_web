'use client'
// ============================================================
// GianyarMap — Peta interaktif Kabupaten Gianyar
// Menggunakan Leaflet.js + OpenStreetMap (bebas API key)
// ============================================================

import { useEffect, useRef } from 'react'
import 'leaflet/dist/leaflet.css'
import type { Map, LayerGroup } from 'leaflet'

export interface LokasiMarker {
  nama: string
  kategori: string
  lat: number
  lng: number
  deskripsi?: string
  mapsUrl?: string
}

interface GianyarMapProps {
  markers?: LokasiMarker[]
  height?: number
  zoom?: number
  center?: [number, number]
  className?: string
}

// ── Warna pin per kategori ──────────────────────────────────
const KATEGORI_COLOR: Record<string, string> = {
  Pemerintahan: '#1d4ed8',
  Wisata:       '#16a34a',
  Ekonomi:      '#d97706',
  Kesehatan:    '#dc2626',
  Pendidikan:   '#7c3aed',
  Ibadah:       '#0891b2',
  Infrastruktur:'#475569',
  UMKM:         '#b45309',
}

function makeIcon(color: string, L: typeof import('leaflet')) {
  return L.divIcon({
    className: '',
    iconSize: [28, 36],
    iconAnchor: [14, 36],
    popupAnchor: [0, -36],
    html: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 36" width="28" height="36">
      <path d="M14 0C6.27 0 0 6.27 0 14c0 9.33 14 22 14 22S28 23.33 28 14C28 6.27 21.73 0 14 0z"
        fill="${color}" stroke="white" stroke-width="2"/>
      <circle cx="14" cy="14" r="5" fill="white" opacity="0.9"/>
    </svg>`,
  })
}

export default function GianyarMap({
  markers = [],
  height = 480,
  zoom = 11,
  center = [-8.5278, 115.3301],
  className = '',
}: GianyarMapProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const leafletMap = useRef<Map | null>(null)
  const markerGroup = useRef<LayerGroup | null>(null)

  useEffect(() => {
    if (!mapRef.current) return

    // Flag untuk mencegah inisialisasi setelah cleanup (React StrictMode
    // menjalankan effect dua kali; import() bersifat async sehingga cleanup
    // bisa selesai sebelum .then() dipanggil)
    let destroyed = false

    import('leaflet').then((L) => {
      if (destroyed || !mapRef.current) return

      // Jika container sudah punya instance Leaflet (race condition),
      // hapus dulu agar tidak throw "Map container is already initialized"
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const container = mapRef.current as any
      if (container._leaflet_id) {
        leafletMap.current?.remove()
        leafletMap.current = null
        delete container._leaflet_id
      }

      if (leafletMap.current) return // sudah diinisialisasi oleh run kedua

      // ── Anti-fingerprinting: sembunyikan versi Leaflet ────
      try {
        Object.defineProperty(L, 'version', { get: () => '', configurable: true })
      } catch { /* ignore */ }

      // Fix icon path default Leaflet yang rusak di webpack/Next.js
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      delete (L.Icon.Default.prototype as any)._getIconUrl
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
        iconUrl:       'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
        shadowUrl:     'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
      })

      const map = L.map(mapRef.current!, {
        center,
        zoom,
        maxBounds: L.latLngBounds(
          L.latLng(-8.75, 115.08),
          L.latLng(-8.25, 115.55)
        ),
        maxBoundsViscosity: 0.8,
        scrollWheelZoom: true,
        zoomControl: true,
      })

      leafletMap.current = map

      // ── Tile Layer OpenStreetMap ──────────────────────────
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener">OpenStreetMap</a> contributors',
        maxZoom: 18,
        minZoom: 9,
      }).addTo(map)

      // ── Batas Kabupaten Gianyar ───────────────────────────
      const batasGianyar: [number, number][] = [
        [-8.333, 115.237],
        [-8.350, 115.340],
        [-8.390, 115.430],
        [-8.480, 115.441],
        [-8.648, 115.380],
        [-8.620, 115.197],
        [-8.450, 115.197],
        [-8.360, 115.210],
      ]

      L.polygon(batasGianyar, {
        color: '#1d4ed8',
        weight: 2,
        opacity: 0.7,
        fillColor: '#3b82f6',
        fillOpacity: 0.06,
        dashArray: '6 4',
      }).addTo(map).bindTooltip('Kabupaten Gianyar', {
        permanent: false,
        direction: 'center',
        className: 'font-semibold text-blue-800',
      })

      // ── Marker layer group ────────────────────────────────
      const group = L.layerGroup().addTo(map)
      markerGroup.current = group

      for (const loc of markers) {
        const color = KATEGORI_COLOR[loc.kategori] ?? '#6b7280'
        const icon = makeIcon(color, L)
        const popup = buildPopup(loc, color)
        L.marker([loc.lat, loc.lng], { icon })
          .bindPopup(popup, { maxWidth: 240 })
          .addTo(group)
      }

      if (markers.length > 1) {
        const bounds = L.latLngBounds(markers.map(m => [m.lat, m.lng] as [number, number]))
        map.fitBounds(bounds, { padding: [40, 40], maxZoom: 13 })
      }
    })

    return () => {
      destroyed = true
      leafletMap.current?.remove()
      leafletMap.current = null
      // Bersihkan _leaflet_id agar container bisa dipakai ulang
      // eslint-disable-next-line react-hooks/exhaustive-deps
      const container = mapRef.current
      if (container) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        delete (container as any)._leaflet_id
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Update marker saat props berubah
  useEffect(() => {
    if (!leafletMap.current || !markerGroup.current) return
    import('leaflet').then((L) => {
      markerGroup.current!.clearLayers()
      for (const loc of markers) {
        const color = KATEGORI_COLOR[loc.kategori] ?? '#6b7280'
        const icon = makeIcon(color, L)
        L.marker([loc.lat, loc.lng], { icon })
          .bindPopup(buildPopup(loc, color), { maxWidth: 240 })
          .addTo(markerGroup.current!)
      }
    })
  }, [markers])

  return (
    <div
      ref={mapRef}
      style={{ height, width: '100%' }}
      className={`rounded-2xl overflow-hidden ${className}`}
      aria-label="Peta interaktif Kabupaten Gianyar"
      role="application"
    />
  )
}

function buildPopup(loc: LokasiMarker, color: string) {
  return `
    <div style="font-family:sans-serif;min-width:180px">
      <p style="font-weight:700;font-size:13px;margin:0 0 4px">${loc.nama}</p>
      <span style="font-size:11px;background:${color}22;color:${color};padding:2px 6px;border-radius:99px;font-weight:600">
        ${loc.kategori}
      </span>
      ${loc.deskripsi ? `<p style="font-size:12px;color:#4b5563;margin:6px 0 4px">${loc.deskripsi}</p>` : ''}
      ${loc.mapsUrl ? `<a href="${loc.mapsUrl}" target="_blank" rel="noopener"
        style="font-size:11px;color:#1d4ed8;text-decoration:none;display:inline-flex;align-items:center;gap:4px;margin-top:4px">
        🗺 Buka di Google Maps
      </a>` : ''}
    </div>`
}
