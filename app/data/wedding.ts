export type DetailId = 'date' | 'time' | 'venue'
export type TimelineId = 'arrival' | 'ceremony' | 'dinner' | 'dance'
export type StoryId = 'firstMeeting' | 'proposal' | 'promise'

export type WeddingImage = {
  id: string
  src: string
  width: number
  height: number
  objectPosition?: string
}

export const weddingEvent = {
  dateTimeIso: '2026-10-12T17:30:00+07:00',
  timeZone: 'Asia/Ho_Chi_Minh',
  replyByIso: '2026-09-20T23:59:59+07:00',
  calendar: {
    year: 2026,
    month: 10,
    day: 12
  },
  mapUrl:
    'https://www.google.com/maps/search/?api=1&query=The%20Garden%20Pavilion%2C%2012%20Nguyen%20Van%20Huong%2C%20Thao%20Dien%2C%20Ho%20Chi%20Minh',
  heroImage: {
    id: 'hero',
    src: '/images/wedding-hero.png',
    width: 1536,
    height: 1024,
    objectPosition: 'center center'
  }
} as const

export const detailItems: Array<{ id: DetailId; icon: 'calendar' | 'clock' | 'map' }> = [
  { id: 'date', icon: 'calendar' },
  { id: 'time', icon: 'clock' },
  { id: 'venue', icon: 'map' }
]

export const timelineItems: Array<{ id: TimelineId; time: string }> = [
  { id: 'arrival', time: '17:00' },
  { id: 'ceremony', time: '17:45' },
  { id: 'dinner', time: '18:30' },
  { id: 'dance', time: '20:00' }
]

export const storyItems: StoryId[] = ['firstMeeting', 'proposal', 'promise']

export const albumImages: WeddingImage[] = [
  {
    id: 'rings',
    src: '/images/wedding-hero.png',
    width: 1536,
    height: 1024,
    objectPosition: '58% 72%'
  },
  {
    id: 'florals',
    src: '/images/wedding-hero.png',
    width: 1536,
    height: 1024,
    objectPosition: '20% 34%'
  },
  {
    id: 'invitation',
    src: '/images/wedding-hero.png',
    width: 1536,
    height: 1024,
    objectPosition: '62% 78%'
  },
  {
    id: 'garden',
    src: '/images/wedding-hero.png',
    width: 1536,
    height: 1024,
    objectPosition: '78% 30%'
  },
  {
    id: 'table',
    src: '/images/wedding-hero.png',
    width: 1536,
    height: 1024,
    objectPosition: '50% 52%'
  },
  {
    id: 'vows',
    src: '/images/wedding-hero.png',
    width: 1536,
    height: 1024,
    objectPosition: '44% 80%'
  }
]
