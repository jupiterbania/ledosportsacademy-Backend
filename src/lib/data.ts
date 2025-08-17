
export interface Photo {
  id: number;
  url: string;
  isSliderPhoto: boolean;
  uploadedAt: string;
  'data-ai-hint'?: string;
  description?: string;
}

export interface Event {
  id: number;
  title: string;
  description: string;
  date: string;
  photoUrl:string;
  'data-ai-hint'?: string;
  redirectUrl?: string;
}

export interface Member {
  id: number;
  name: string;
  email: string;
  photoUrl: string;
  joinDate: string;
}

export interface Donation {
    id: number;
    title: string;
    amount?: number;
    item?: string;
    date: string;
}

export interface Collection {
    id: number;
    title: string;
    amount: number;
    date: string;
}

export interface Expense {
    id: number;
    title: string;
    amount: number;
    date: string;
}

export interface Achievement {
    id: number;
    title: string;
    description: string;
    date: string;
    photoUrl: string;
    'data-ai-hint'?: string;
}

export const photos: Photo[] = [
  { id: 1, url: 'https://placehold.co/1200x600.png', isSliderPhoto: true, uploadedAt: '2023-10-26T10:00:00Z', 'data-ai-hint': 'community event', description: 'A vibrant photo of our latest community event.' },
  { id: 2, url: 'https://placehold.co/1200x600.png', isSliderPhoto: true, uploadedAt: '2023-10-25T11:00:00Z', 'data-ai-hint': 'team celebration', description: 'The team celebrating their recent victory.' },
  { id: 3, url: 'https://placehold.co/1200x600.png', isSliderPhoto: true, uploadedAt: '2023-10-24T12:00:00Z', 'data-ai-hint': 'outdoor activity', description: 'Enjoying a beautiful day with an outdoor activity.' },
  { id: 4, url: 'https://placehold.co/1200x600.png', isSliderPhoto: true, uploadedAt: '2023-10-23T13:00:00Z', 'data-ai-hint': 'group meeting', description: 'An important group meeting to plan for the future.' },
  { id: 5, url: 'https://placehold.co/1200x600.png', isSliderPhoto: true, uploadedAt: '2023-10-22T14:00:00Z', 'data-ai-hint': 'workshop session', description: 'Members participating in an interactive workshop.' },
  { id: 6, url: 'https://placehold.co/600x400.png', isSliderPhoto: false, uploadedAt: '2023-10-21T15:00:00Z', 'data-ai-hint': 'charity drive' },
  { id: 7, url: 'https://placehold.co/600x400.png', isSliderPhoto: false, uploadedAt: '2023-10-20T16:00:00Z', 'data-ai-hint': 'sports day' },
  { id: 8, url: 'https://placehold.co/600x400.png', isSliderPhoto: false, uploadedAt: '2023-10-19T17:00:00Z', 'data-ai-hint': 'annual dinner' },
  { id: 9, url: 'https://placehold.co/600x400.png', isSliderPhoto: false, uploadedAt: '2023-10-18T18:00:00Z', 'data-ai-hint': 'member award' },
  { id: 10, url: 'https://placehold.co/600x400.png', isSliderPhoto: false, uploadedAt: '2023-10-17T19:00:00Z', 'data-ai-hint': 'conference talk' },
];

export const events: Event[] = [
  { id: 1, title: 'Annual General Meeting', description: 'Join us for our annual general meeting to discuss the future of the club.', date: '2023-09-15', photoUrl: 'https://placehold.co/600x400.png', 'data-ai-hint': 'formal meeting', redirectUrl: 'https://example.com/agm-details' },
  { id: 2, title: 'Charity Bake Sale', description: 'Help us raise funds for a good cause while enjoying delicious treats.', date: '2023-10-20', photoUrl: 'https://placehold.co/600x400.png', 'data-ai-hint': 'bake sale', redirectUrl: 'https://example.com/bake-sale-info' },
  { id: 3, title: 'Holiday Party', description: 'Celebrate the holiday season with fellow club members.', date: '2023-12-10', photoUrl: 'https://placehold.co/600x400.png', 'data-ai-hint': 'holiday party' },
  { id: 4, title: 'Tech Workshop', description: 'A hands-on workshop on the latest technologies.', date: '2024-01-05', photoUrl: 'https://placehold.co/600x400.png', 'data-ai-hint': 'tech workshop', redirectUrl: 'https://example.com/tech-workshop-signup' },
  { id: 5, title: 'Spring Picnic', description: 'Enjoy a day out in the sun with food, games, and fun.', date: '2024-04-22', photoUrl: 'https://placehold.co/600x400.png', 'data-ai-hint': 'picnic park' },
];

export const members: Member[] = [
    { id: 1, name: 'Alice Johnson', email: 'alice.j@example.com', photoUrl: 'https://placehold.co/100x100.png', joinDate: '2022-03-12' },
    { id: 2, name: 'Bob Williams', email: 'bob.w@example.com', photoUrl: 'https://placehold.co/100x100.png', joinDate: '2022-05-20' },
    { id: 3, name: 'Charlie Brown', email: 'charlie.b@example.com', photoUrl: 'https://placehold.co/100x100.png', joinDate: '2023-01-10' },
    { id: 4, name: 'Diana Miller', email: 'diana.m@example.com', photoUrl: 'https://placehold.co/100x100.png', joinDate: '2023-06-01' },
    { id: 5, name: 'Ethan Davis', email: 'ethan.d@example.com', photoUrl: 'https://placehold.co/100x100.png', joinDate: '2023-09-18' },
];

export const donations: Donation[] = [
    { id: 1, title: 'Corporate Sponsorship', amount: 500, date: '2023-08-01' },
    { id: 2, title: 'Member Contribution', amount: 50, date: '2023-09-15' },
    { id: 3, title: 'Old Laptops for Charity', item: '5 Laptops', date: '2023-11-01' },
];

export const collections: Collection[] = [
    { id: 1, title: 'Bake Sale Fundraiser', amount: 350, date: '2023-10-20' },
    { id: 2, title: 'Membership Dues', amount: 1200, date: '2024-01-01' },
];

export const expenses: Expense[] = [
    { id: 1, title: 'Venue Rental for AGM', amount: 150, date: '2023-09-14' },
    { id: 2, title: 'Holiday Party Supplies', amount: 200, date: '2023-12-05' },
];

export const achievements: Achievement[] = [
    { id: 1, title: 'Club of the Year', description: 'Awarded by the regional committee for outstanding performance.', date: '2022-12-31', photoUrl: 'https://placehold.co/600x400.png', 'data-ai-hint': 'award trophy' },
    { id: 2, title: '10 Years Anniversary', description: 'Celebrating a decade of community and service.', date: '2023-05-20', photoUrl: 'https://placehold.co/600x400.png', 'data-ai-hint': 'celebration confetti' },
    { id: 3, title: 'Regional Tournament Champions', description: 'Won the annual regional tournament.', date: '2023-08-15', photoUrl: 'https://placehold.co/600x400.png', 'data-ai-hint': 'sports trophy' },
];


export const getSliderPhotos = () => photos.filter(p => p.isSliderPhoto).slice(0, 5);

export const getRecentPhotos = () => [...photos]
  .sort((a, b) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime())
  .slice(0, 5);

export const getAllPhotos = () => [...photos]
  .sort((a, b) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime());

export const getRecentEvents = () => [...events]
  .filter(event => new Date(event.date) < new Date())
  .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  .slice(0, 3);

export const getAllEvents = () => [...events]
  .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

export const getAllMembers = () => [...members]
    .sort((a, b) => new Date(b.joinDate).getTime() - new Date(a.joinDate).getTime());

export const getAllDonations = () => [...donations]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

export const getAllCollections = () => [...collections]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

export const getAllExpenses = () => [...expenses]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

export const getRecentAchievements = () => [...achievements]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 3);

export const getAllAchievements = () => [...achievements]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
