export interface ModelStats {
  affordability: number;
  quality: number;
  tenantProtection: number;
  supply: number;
  publicInvestment: number;
  inequality: number;
}

export interface GlobalModel {
  city: string;
  country: string;
  flag: string;
  heroStat: string;
  heroLabel: { en: string; tr: string };
  color: string;
  howItWorks: { en: string[]; tr: string[] };
  keyOutcome: { en: string; tr: string };
  usLesson: { en: string; tr: string };
  stats: ModelStats;
}

export const globalModels: GlobalModel[] = [
  {
    city: 'Vienna',
    country: 'Austria',
    flag: '🇦🇹',
    heroStat: '60%',
    heroLabel: { en: 'Subsidized housing', tr: 'Sübvansiyonlu konut' },
    color: '#E63946',
    howItWorks: {
      en: [
        'City owns and manages 220,000 municipal apartments',
        'Mixed-income model prevents segregation by class',
        'Rents capped at cost-recovery levels, not market rates',
        'Continuous public investment since the 1920s',
      ],
      tr: [
        'Şehir 220.000 belediye dairesine sahip ve yönetmektedir',
        'Karma gelir modeli sınıfsal ayrışmayı önler',
        'Kiralar piyasa fiyatlarına değil, maliyet karşılama seviyesine sabitlenmiştir',
        '1920\'lerden beri sürekli kamu yatırımı',
      ],
    },
    keyOutcome: {
      en: 'Residents spend an average of 21% of income on housing, compared to 30-50% in major US cities',
      tr: 'Sakinler gelirlerinin ortalama %21\'ini konuta harcarken, ABD büyük şehirlerinde bu oran %30-50\'dir',
    },
    usLesson: {
      en: 'Long-term public investment in mixed-income housing keeps costs stable across generations',
      tr: 'Karma gelirli konutlara uzun vadeli kamu yatırımı, maliyetleri nesiller boyunca istikrarlı tutar',
    },
    stats: { affordability: 8, quality: 8, tenantProtection: 9, supply: 7, publicInvestment: 10, inequality: 9 },
  },
  {
    city: 'Singapore',
    country: 'Singapore',
    flag: '🇸🇬',
    heroStat: '80%',
    heroLabel: { en: 'Live in public housing (HDB)', tr: 'Kamu konutlarında yaşıyor (HDB)' },
    color: '#457B9D',
    howItWorks: {
      en: [
        '80% of population lives in government-built HDB flats',
        '90% of HDB residents own their apartments via 99-year leases',
        'Central Provident Fund (CPF) enables purchase through mandatory savings',
        'Ethnic integration quotas prevent racial enclaves',
      ],
      tr: [
        'Nüfusun %80\'i devlet yapımı HDB dairelerinde yaşıyor',
        'HDB sakinlerinin %90\'ı 99 yıllık kiralama ile dairelerine sahip',
        'Merkezi İhtiyat Fonu (CPF) zorunlu tasarrufla satın almayı sağlar',
        'Etnik entegrasyon kotaları ırksal ayrışmayı önler',
      ],
    },
    keyOutcome: {
      en: '90% homeownership rate — one of the highest in the world',
      tr: '%90 ev sahipliği oranı — dünyadaki en yükseklerden biri',
    },
    usLesson: {
      en: 'Government-led development with ownership pathways can achieve near-universal housing access',
      tr: 'Mülkiyet yolları içeren devlet öncülüğündeki kalkınma, neredeyse evrensel konut erişimi sağlayabilir',
    },
    stats: { affordability: 7, quality: 8, tenantProtection: 6, supply: 9, publicInvestment: 9, inequality: 7 },
  },
  {
    city: 'Finland',
    country: 'Finland',
    flag: '🇫🇮',
    heroStat: '72%',
    heroLabel: { en: 'Reduction in homelessness', tr: 'Evsizlikte azalma' },
    color: '#2A9D8F',
    howItWorks: {
      en: [
        'Housing First: provide homes before addressing other issues',
        'Converted shelters and temporary housing into permanent apartments',
        'Wrap-around support services included with housing',
        'National policy commitment since 2008',
      ],
      tr: [
        'Önce Konut: diğer sorunları ele almadan önce ev sağla',
        'Barınaklar ve geçici konutlar kalıcı dairelere dönüştürüldü',
        'Konutla birlikte kapsamlı destek hizmetleri sunuluyor',
        '2008\'den beri ulusal politika taahhüdü',
      ],
    },
    keyOutcome: {
      en: 'Only country in Europe where homelessness has consistently declined',
      tr: 'Evsizliğin sürekli azaldığı tek Avrupa ülkesi',
    },
    usLesson: {
      en: 'Housing First approaches are more effective and cheaper than emergency shelter systems',
      tr: 'Önce Konut yaklaşımları, acil barınak sistemlerinden daha etkili ve ucuzdur',
    },
    stats: { affordability: 6, quality: 7, tenantProtection: 8, supply: 6, publicInvestment: 8, inequality: 8 },
  },
  {
    city: 'Tokyo',
    country: 'Japan',
    flag: '🇯🇵',
    heroStat: '150K',
    heroLabel: { en: 'Units built per year', tr: 'Yılda inşa edilen konut' },
    color: '#E9C46A',
    howItWorks: {
      en: [
        '12 zoning categories allow flexible mixed-use development',
        'National zoning laws override local NIMBY opposition',
        'Tokyo builds 130,000–150,000 units per year',
        'Minimal restrictions on density and building height',
      ],
      tr: [
        '12 imar kategorisi esnek karma kullanım geliştirmeye izin verir',
        'Ulusal imar yasaları yerel NIMBY muhalefetini geçersiz kılar',
        'Tokyo yılda 130.000–150.000 konut inşa eder',
        'Yoğunluk ve bina yüksekliği üzerinde minimum kısıtlama',
      ],
    },
    keyOutcome: {
      en: 'Rents in Tokyo have remained broadly stable despite population growth',
      tr: 'Tokyo\'da kiralar nüfus artışına rağmen genel olarak istikrarlı kalmıştır',
    },
    usLesson: {
      en: 'Liberalizing zoning at the national level prevents local obstruction of needed housing supply',
      tr: 'Ulusal düzeyde imar serbestleştirmesi, gerekli konut arzının yerel engellenmesini önler',
    },
    stats: { affordability: 7, quality: 9, tenantProtection: 5, supply: 10, publicInvestment: 4, inequality: 6 },
  },
];

export const usBaseline: ModelStats = {
  affordability: 3,
  quality: 5,
  tenantProtection: 3,
  supply: 4,
  publicInvestment: 2,
  inequality: 3,
};
