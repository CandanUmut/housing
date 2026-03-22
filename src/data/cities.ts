export interface CityData {
  name: string;
  state: string;
  medianHomePrice: number;
}

export const cities: CityData[] = [
  { name: 'San Jose', state: 'CA', medianHomePrice: 1580000 },
  { name: 'San Francisco', state: 'CA', medianHomePrice: 1350000 },
  { name: 'Los Angeles', state: 'CA', medianHomePrice: 950000 },
  { name: 'New York', state: 'NY', medianHomePrice: 680000 },
  { name: 'Miami', state: 'FL', medianHomePrice: 580000 },
  { name: 'Denver', state: 'CO', medianHomePrice: 560000 },
  { name: 'Austin', state: 'TX', medianHomePrice: 450000 },
  { name: 'Chicago', state: 'IL', medianHomePrice: 330000 },
  { name: 'Houston', state: 'TX', medianHomePrice: 320000 },
  { name: 'Pittsburgh', state: 'PA', medianHomePrice: 230000 },
];
