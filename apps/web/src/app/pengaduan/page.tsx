import { redirect } from 'next/navigation'

// /pengaduan → redirect ke /pengaduan/buat
export default function PengaduanRedirect() {
  redirect('/pengaduan/buat')
}
