'use client'
import { MapPin, Users, Calendar, Award } from 'lucide-react'
import { KecamatanMap } from '@/components/profil/KecamatanMap'
import { useLang } from '@/contexts/LanguageContext'

export default function ProfilPage() {
  const { t } = useLang()

  const DATA_WILAYAH = [
    { label: t('Luas Wilayah', 'Area'), value: '368 km²' },
    { label: t('Jumlah Penduduk', 'Population'), value: '512.408 jiwa' },
    { label: t('Kecamatan', 'Districts'), value: t('7 Kecamatan', '7 Districts') },
    { label: t('Desa / Kelurahan', 'Villages / Urban Wards'), value: t('64 Desa / 6 Kelurahan', '64 Villages / 6 Urban Wards') },
    { label: t('Desa Adat (Pakraman)', 'Traditional Villages (Pakraman)'), value: t('278 Desa', '278 Villages') },
    { label: t('Ibu Kota', 'Capital'), value: 'Gianyar' },
  ]

  const MISI = [
    t('Meningkatkan kualitas sumber daya manusia yang berakhlak mulia, berbudaya, dan berdaya saing', 'Improve the quality of human resources with noble character, cultural values, and competitiveness'),
    t('Memperkuat perekonomian daerah berbasis pertanian, pariwisata, dan UMKM yang berkelanjutan', 'Strengthen the regional economy based on sustainable agriculture, tourism, and SMEs'),
    t('Mewujudkan pembangunan infrastruktur yang merata dan berkualitas', 'Realize equitable and high-quality infrastructure development'),
    t('Meningkatkan kualitas pelayanan publik yang transparan, akuntabel, dan inovatif', 'Improve the quality of public services that are transparent, accountable, and innovative'),
    t('Menjaga keamanan, ketertiban, dan keharmonisan masyarakat berbasis nilai budaya Bali', 'Maintain public security, order, and harmony based on Balinese cultural values'),
  ]

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-gray-800 dark:text-slate-100 mb-2">{t('Profil Daerah', 'Regional Profile')}</h1>
      <p className="text-gray-500 dark:text-slate-400 mb-8">{t('Kabupaten Gianyar, Provinsi Bali', 'Gianyar Regency, Bali Province')}</p>

      {/* Sejarah */}
      <section className="mb-10">
        <h2 className="text-xl font-bold text-gray-800 dark:text-slate-100 mb-4 flex items-center gap-2">
          <Calendar size={20} className="text-blue-700" /> {t('Sejarah Singkat', 'Brief History')}
        </h2>
        <div className="bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700 rounded-2xl p-6 shadow-sm space-y-3 text-gray-600 dark:text-slate-300 leading-relaxed">
          <p>{t('Kabupaten Gianyar merupakan salah satu kabupaten di Provinsi Bali yang memiliki sejarah panjang dan kaya budaya. Kerajaan Gianyar didirikan sekitar tahun 1771 oleh I Dewa Manggis Sakti, dan menjadi salah satu kerajaan penting di Bali.', 'Gianyar Regency is one of the regencies in Bali Province with a long history and rich culture. The Kingdom of Gianyar was founded around 1771 by I Dewa Manggis Sakti, and became one of the important kingdoms in Bali.')}</p>
          <p>{t('Pada masa penjajahan Belanda, Gianyar memilih untuk menyerahkan diri kepada Belanda pada tahun 1900 (vertragt) sebagai strategi untuk melindungi rakyatnya dari peperangan antar kerajaan. Hal ini menyebabkan Gianyar menjadi kabupaten yang relatif lebih berkembang dibanding wilayah lain di Bali pada masa itu.', 'During the Dutch colonial era, Gianyar chose to submit to the Dutch in 1900 (vertragt) as a strategy to protect its people from inter-kingdom warfare. This caused Gianyar to become a relatively more developed regency compared to other areas in Bali at that time.')}</p>
          <p>{t('Setelah kemerdekaan Indonesia, Gianyar resmi menjadi kabupaten dengan ibu kota di Kota Gianyar. Kini kabupaten ini dikenal sebagai pusat seni dan budaya Bali, serta menjadi destinasi wisata kelas dunia terutama di kawasan Ubud.', 'After Indonesian independence, Gianyar officially became a regency with its capital in Gianyar City. Today the regency is known as the center of Balinese arts and culture, and has become a world-class tourist destination, especially in the Ubud area.')}</p>
        </div>
      </section>

      {/* Visi Misi */}
      <section className="mb-10">
        <h2 className="text-xl font-bold text-gray-800 dark:text-slate-100 mb-4 flex items-center gap-2">
          <Award size={20} className="text-yellow-600" /> {t('Visi & Misi', 'Vision & Mission')}
        </h2>
        <div className="bg-gradient-to-br from-blue-900 to-blue-700 text-white rounded-2xl p-6 mb-4">
          <p className="text-sm text-blue-300 mb-2 font-medium uppercase tracking-wide">{t('Visi', 'Vision')}</p>
          <p className="text-lg font-bold leading-snug">&quot;{t('Terwujudnya Gianyar yang Bahagia, Sejahtera, Aman, dan Berprestasi Berlandaskan Tri Hita Karana', 'Realizing a Happy, Prosperous, Safe, and Accomplished Gianyar Based on Tri Hita Karana')}&quot;</p>
        </div>
        <div className="bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700 rounded-2xl p-6 shadow-sm">
          <p className="text-sm text-gray-500 dark:text-slate-400 mb-3 font-medium uppercase tracking-wide">{t('Misi', 'Mission')}</p>
          <ol className="space-y-3 text-sm text-gray-700 dark:text-slate-300">
            {MISI.map((m, i) => (
              <li key={i} className="flex gap-3">
                <span className="w-6 h-6 bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-300 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">{i + 1}</span>
                {m}
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Data Wilayah */}
      <section className="mb-10">
        <h2 className="text-xl font-bold text-gray-800 dark:text-slate-100 mb-4 flex items-center gap-2">
          <MapPin size={20} className="text-red-600" /> {t('Data Wilayah', 'Regional Data')}
        </h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {DATA_WILAYAH.map(d => (
            <div key={d.label} className="bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700 rounded-xl p-4 shadow-sm">
              <p className="text-xs text-gray-400 dark:text-slate-400 mb-1">{d.label}</p>
              <p className="font-bold text-gray-800 dark:text-slate-100">{d.value}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Kecamatan */}
      <section>
        <h2 className="text-xl font-bold text-gray-800 dark:text-slate-100 mb-1 flex items-center gap-2">
          <Users size={20} className="text-green-600" /> {t('7 Kecamatan', '7 Districts')}
        </h2>
        <p className="text-sm text-gray-400 dark:text-slate-400 mb-4">{t('Klik kecamatan untuk melihat peta daerahnya', 'Click a district to view its map')}</p>
        <KecamatanMap />
      </section>
    </div>
  )
}
