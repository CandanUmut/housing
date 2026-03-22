export type Verdict = 'strong' | 'mixed' | 'weak';

export interface Reform {
  id: string;
  name: { en: string; tr: string };
  evidence: { en: string; tr: string };
  verdict: Verdict;
  details: { en: string; tr: string };
  location: string;
}

export const reforms: Reform[] = [
  {
    id: 'upzoning',
    name: { en: 'Upzoning', tr: 'İmar artışı' },
    evidence: { en: 'Strong', tr: 'Güçlü' },
    verdict: 'strong',
    details: {
      en: 'Minneapolis eliminated single-family zoning; rents fell 17-34% below comparable cities',
      tr: 'Minneapolis tek aile imar planını kaldırdı; kiralar karşılaştırılabilir şehirlerin %17-34 altına düştü',
    },
    location: 'Minneapolis, MN',
  },
  {
    id: 'housing-first',
    name: { en: 'Housing First', tr: 'Önce Konut' },
    evidence: { en: 'Strong', tr: 'Güçlü' },
    verdict: 'strong',
    details: {
      en: 'Finland achieved a 72% reduction in homelessness by providing permanent housing before treatment',
      tr: 'Finlandiya tedaviden önce kalıcı konut sağlayarak evsizlikte %72 azalma sağladı',
    },
    location: 'Finland',
  },
  {
    id: 'community-land-trusts',
    name: { en: 'Community Land Trusts', tr: 'Topluluk Arazi Vakıfları' },
    evidence: { en: 'Strong', tr: 'Güçlü' },
    verdict: 'strong',
    details: {
      en: 'CLT homeowners had zero foreclosures during the Great Recession while maintaining permanent affordability',
      tr: 'CLT ev sahipleri Büyük Durgunluk sırasında kalıcı satın alınabilirliği korurken sıfır haciz yaşadı',
    },
    location: 'Burlington, VT & nationwide',
  },
  {
    id: 'vacancy-taxes',
    name: { en: 'Vacancy Taxes', tr: 'Boş konut vergileri' },
    evidence: { en: 'Strong (limited)', tr: 'Güçlü (sınırlı)' },
    verdict: 'strong',
    details: {
      en: 'Vancouver\'s vacancy tax reduced empty homes by 58-67%, returning units to the housing market',
      tr: 'Vancouver\'ın boş konut vergisi boş evleri %58-67 azaltarak birimleri konut piyasasına geri kazandırdı',
    },
    location: 'Vancouver, BC',
  },
  {
    id: 'rent-stabilization',
    name: { en: 'Rent Stabilization', tr: 'Kira istikrarı' },
    evidence: { en: 'Mixed', tr: 'Karma' },
    verdict: 'mixed',
    details: {
      en: 'Helps current tenants stay in their homes but may discourage new construction and reduce overall supply',
      tr: 'Mevcut kiracıların evlerinde kalmasına yardımcı olur ancak yeni inşaatı caydırabilir ve genel arzı azaltabilir',
    },
    location: 'New York, NY & various US cities',
  },
  {
    id: 'foreign-buyer-bans',
    name: { en: 'Foreign Buyer Bans', tr: 'Yabancı alıcı yasakları' },
    evidence: { en: 'Weak', tr: 'Zayıf' },
    verdict: 'weak',
    details: {
      en: 'Foreign buyers account for less than 3% of transactions; bans have minimal impact on affordability',
      tr: 'Yabancı alıcılar işlemlerin %3\'ünden azını oluşturur; yasakların satın alınabilirlik üzerinde minimum etkisi vardır',
    },
    location: 'Canada & New Zealand',
  },
  {
    id: 'institutional-investor-bans',
    name: { en: 'Institutional Investor Bans', tr: 'Kurumsal yatırımcı yasakları' },
    evidence: { en: 'Weak', tr: 'Zayıf' },
    verdict: 'weak',
    details: {
      en: 'Institutional investors own only 1.4% of housing stock; bans address a small fraction of the problem',
      tr: 'Kurumsal yatırımcılar konut stokunun sadece %1,4\'üne sahiptir; yasaklar sorunun küçük bir kısmını ele alır',
    },
    location: 'US (proposed)',
  },
  {
    id: 'rent-control-no-supply',
    name: { en: 'Rent Control without Supply', tr: 'Arz olmadan kira kontrolü' },
    evidence: { en: 'Weak', tr: 'Zayıf' },
    verdict: 'weak',
    details: {
      en: 'Strict rent control without new construction incentives reduces rental supply by up to 15%',
      tr: 'Yeni inşaat teşvikleri olmadan sıkı kira kontrolü kiralık arzını %15\'e kadar azaltır',
    },
    location: 'San Francisco, CA',
  },
];
