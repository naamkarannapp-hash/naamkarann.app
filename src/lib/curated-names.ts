import type { NameResult, NameFormValues } from './types';

export const curatedNamesDatabase: Omit<NameResult, 'id'>[] = [
  // Sanskrit / Hindu Names
  {
    name: 'Aarav',
    meaning: 'Peaceful, calm, and filled with melodic wisdom.',
    pronunciation: 'AA-ruhv',
    origin: 'Sanskrit',
    category: 'Modern Classic',
    gender: 'boy',
    gradient: 'linear-gradient(135deg, #1A52E1 0%, #9C27B0 100%)',
  },
  {
    name: 'Ananya',
    meaning: 'Matchless, unique, and divine goddess representation.',
    pronunciation: 'Uh-NAHN-yuh',
    origin: 'Sanskrit',
    category: 'Spiritual',
    gender: 'girl',
    gradient: 'linear-gradient(135deg, #f857a6 0%, #ff5858 100%)',
  },
  {
    name: 'Advik',
    meaning: 'Unique, one of a kind, illuminated with grace.',
    pronunciation: 'UHD-veek',
    origin: 'Sanskrit',
    category: 'Modern Classic',
    gender: 'boy',
    gradient: 'linear-gradient(135deg, #4776E6 0%, #8E54E9 100%)',
  },
  {
    name: 'Ishaan',
    meaning: 'Lord Shiva, the supreme sun and guardian of the northeast.',
    pronunciation: 'ee-SHAHN',
    origin: 'Sanskrit',
    category: 'Vedic',
    gender: 'boy',
    gradient: 'linear-gradient(135deg, #fc4a1a 0%, #f7b733 100%)',
  },
  {
    name: 'Saanvi',
    meaning: 'Goddess Lakshmi, one who is surrounded by auspiciousness.',
    pronunciation: 'SAHN-vee',
    origin: 'Sanskrit',
    category: 'Spiritual',
    gender: 'girl',
    gradient: 'linear-gradient(135deg, #654ea3 0%, #eaafc8 100%)',
  },
  {
    name: 'Reyansh',
    meaning: 'Ray of celestial light, a part of Lord Vishnu.',
    pronunciation: 'ray-YAHN-sh',
    origin: 'Sanskrit',
    category: 'Celestial',
    gender: 'boy',
    gradient: 'linear-gradient(135deg, #0052D4 0%, #4364F7 50%, #6FB1FC 100%)',
  },
  {
    name: 'Kiara',
    meaning: 'Bright, clear, and radiant starlight.',
    pronunciation: 'kee-AHR-uh',
    origin: 'Hindi',
    category: 'Modern Classic',
    gender: 'girl',
    gradient: 'linear-gradient(135deg, #3A1C71 0%, #D76D77 50%, #FFAF7B 100%)',
  },
  {
    name: 'Vihaan',
    meaning: 'Dawn, morning sunrise, and the beginning of a new golden era.',
    pronunciation: 'vee-HAHN',
    origin: 'Sanskrit',
    category: 'Nature',
    gender: 'boy',
    gradient: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)',
  },
  {
    name: 'Mira',
    meaning: 'Ocean of peace, devoted soul, and boundless love.',
    pronunciation: 'MEE-ruh',
    origin: 'Hindi',
    category: 'Spiritual',
    gender: 'girl',
    gradient: 'linear-gradient(135deg, #134E5E 0%, #71B280 100%)',
  },
  {
    name: 'Arjun',
    meaning: 'Bright, shining, heroic, and noble archer of truth.',
    pronunciation: 'AHR-joon',
    origin: 'Sanskrit',
    category: 'Heritage',
    gender: 'boy',
    gradient: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)',
  },
  {
    name: 'Tara',
    meaning: 'Guiding star of the cosmos, savior, and divine glow.',
    pronunciation: 'TAH-ruh',
    origin: 'Sanskrit',
    category: 'Celestial',
    gender: 'girl',
    gradient: 'linear-gradient(135deg, #4A00E0 0%, #8E2DE2 100%)',
  },
  {
    name: 'Kavya',
    meaning: 'Poetic brilliance, literary wisdom, and artistically gifted.',
    pronunciation: 'KAHV-yuh',
    origin: 'Sanskrit',
    category: 'Wisdom',
    gender: 'girl',
    gradient: 'linear-gradient(135deg, #5C258D 0%, #4389A2 100%)',
  },
  {
    name: 'Kabir',
    meaning: 'The great leader, saintly poet of divine harmony.',
    pronunciation: 'kuh-BEER',
    origin: 'Hindi',
    category: 'Wisdom',
    gender: 'boy',
    gradient: 'linear-gradient(135deg, #2b5876 0%, #4e4376 100%)',
  },
  {
    name: 'Dia',
    meaning: 'Divine light, brightness, and sacred lamp.',
    pronunciation: 'DEE-uh',
    origin: 'Hindi',
    category: 'Modern Classic',
    gender: 'girl',
    gradient: 'linear-gradient(135deg, #f7b733 0%, #fc4a1a 100%)',
  },
  {
    name: 'Samar',
    meaning: 'Evening conversation under the stars, companion of peace.',
    pronunciation: 'SUH-mahr',
    origin: 'Hindi',
    category: 'Nature',
    gender: 'neutral',
    gradient: 'linear-gradient(135deg, #0F2027 0%, #203A43 50%, #2C5364 100%)',
  },
  {
    name: 'Arya',
    meaning: 'Noble, honorable, and revered soul.',
    pronunciation: 'AHR-yuh',
    origin: 'Sanskrit',
    category: 'Royal',
    gender: 'neutral',
    gradient: 'linear-gradient(135deg, #8E2DE2 0%, #4A00E0 100%)',
  },
  {
    name: 'Rhea',
    meaning: 'Flowing river, graceful melody, and gentle protector.',
    pronunciation: 'RAY-uh',
    origin: 'Sanskrit',
    category: 'Nature',
    gender: 'girl',
    gradient: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)',
  },
  {
    name: 'Yuvaan',
    meaning: 'Youthful vigor, lord of vitality, and joyful life force.',
    pronunciation: 'yoo-VAHN',
    origin: 'Sanskrit',
    category: 'Modern Classic',
    gender: 'boy',
    gradient: 'linear-gradient(135deg, #1A52E1 0%, #9C27B0 100%)',
  },
  {
    name: 'Avani',
    meaning: 'Earth mother, sustaining life and ground of harmony.',
    pronunciation: 'uh-VAH-nee',
    origin: 'Sanskrit',
    category: 'Nature',
    gender: 'girl',
    gradient: 'linear-gradient(135deg, #134E5E 0%, #71B280 100%)',
  },
  {
    name: 'Devansh',
    meaning: 'Part of god, divine radiance and spiritual blessing.',
    pronunciation: 'day-VAHN-sh',
    origin: 'Sanskrit',
    category: 'Spiritual',
    gender: 'boy',
    gradient: 'linear-gradient(135deg, #4776E6 0%, #8E54E9 100%)',
  },
];

export function generateCuratedFallbackNames(values: Partial<NameFormValues>): NameResult[] {
  let list = [...curatedNamesDatabase];

  if (values.gender && values.gender !== 'Neutral') {
    const targetGender = values.gender.toLowerCase();
    list = list.filter((item) => item.gender === targetGender || item.gender === 'neutral');
  }

  if (values.startingLetters && values.startingLetters.trim() !== '') {
    const prefix = values.startingLetters.trim().toLowerCase();
    const matching = list.filter((item) => item.name.toLowerCase().startsWith(prefix));
    if (matching.length > 0) {
      list = matching;
    }
  }

  // Shuffle and pick 12 to 16
  const shuffled = list.sort(() => 0.5 - Math.random());
  const selected = shuffled.slice(0, Math.min(16, Math.max(10, shuffled.length)));

  return selected.map((item, index) => ({
    id: `${item.name.toLowerCase()}-${index}-${Date.now()}`,
    ...item,
  }));
}
