import { db } from './firebase';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, query, orderBy, limit, where, writeBatch } from 'firebase/firestore';

// Base types
export interface BaseDocument {
  id: string;
}

// Interfaces
export interface Photo extends BaseDocument {
  url: string;
  isSliderPhoto: boolean;
  uploadedAt: string;
  'data-ai-hint'?: string;
  description?: string;
}

export interface Event extends BaseDocument {
  title: string;
  description: string;
  date: string;
  photoUrl:string;
  'data-ai-hint'?: string;
  redirectUrl?: string;
  showOnSlider?: boolean;
}

export interface Member extends BaseDocument {
  name: string;
  email: string;
  photoUrl: string;
  joinDate: string;
}

export interface Donation extends BaseDocument {
    title: string;
    amount?: number;
    item?: string;
    date: string;
}

export interface Collection extends BaseDocument {
    title: string;
    amount: number;
    date: string;
}

export interface Expense extends BaseDocument {
    title: string;
    amount: number;
    date: string;
}

export interface Achievement extends BaseDocument {
    title: string;
    description: string;
    date: string;
    photoUrl: string;
    'data-ai-hint'?: string;
}

export interface SlideshowItem {
    id: string;
    url: string;
    title?: string;
    description?: string;
    'data-ai-hint'?: string;
    date: string;
}


// Generic Firestore functions
async function getCollection<T extends BaseDocument>(collectionName: string, orderField: string = 'date', orderDirection: 'asc' | 'desc' = 'desc'): Promise<T[]> {
  const q = query(collection(db, collectionName), orderBy(orderField, orderDirection));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as T));
}

async function addDocument<T>(collectionName: string, data: Omit<T, 'id'>): Promise<T & BaseDocument> {
  const docRef = await addDoc(collection(db, collectionName), data);
  return { id: docRef.id, ...data } as T & BaseDocument;
}

async function updateDocument<T>(collectionName: string, id: string, data: Partial<T>) {
  const docRef = doc(db, collectionName, id);
  await updateDoc(docRef, data);
}

async function deleteDocument(collectionName: string, id: string) {
  const docRef = doc(db, collectionName, id);
  await deleteDoc(docRef);
}


// Photos
export const getAllPhotos = () => getCollection<Photo>('photos', 'uploadedAt');
export const addPhoto = (data: Omit<Photo, 'id'>) => addDocument<Photo>('photos', data);
export const updatePhoto = (id: string, data: Partial<Photo>) => updateDocument<Photo>('photos', id, data);
export const deletePhoto = (id: string) => deleteDocument('photos', id);

export const getRecentPhotos = async () => {
    const q = query(collection(db, "photos"), orderBy("uploadedAt", "desc"), limit(5));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Photo));
};

// Events
export const getAllEvents = () => getCollection<Event>('events', 'date', 'desc');
export const addEvent = (data: Omit<Event, 'id'>) => addDocument<Event>('events', data);
export const updateEvent = (id: string, data: Partial<Event>) => updateDocument<Event>('events', id, data);
export const deleteEvent = (id: string) => deleteDocument('events', id);

export const getRecentEvents = async () => {
    const q = query(
        collection(db, "events"), 
        where("date", "<=", new Date().toISOString().split('T')[0]),
        orderBy("date", "desc"), 
        limit(3)
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Event));
};

// Members
export const getAllMembers = () => getCollection<Member>('members', 'joinDate');
export const addMember = (data: Omit<Member, 'id'>) => addDocument<Member>('members', data);
export const updateMember = (id: string, data: Partial<Member>) => updateDocument<Member>('members', id, data);
export const deleteMember = (id: string) => deleteDocument('members', id);

// Donations
export const getAllDonations = () => getCollection<Donation>('donations');
export const addDonation = (data: Omit<Donation, 'id'>) => addDocument<Donation>('donations', data);
export const updateDonation = (id: string, data: Partial<Donation>) => updateDocument<Donation>('donations', id, data);
export const deleteDonation = (id: string) => deleteDocument('donations', id);

// Collections
export const getAllCollections = () => getCollection<Collection>('collections');
export const addCollection = (data: Omit<Collection, 'id'>) => addDocument<Collection>('collections', data);
export const updateCollection = (id: string, data: Partial<Collection>) => updateDocument<Collection>('collections', id, data);
export const deleteCollection = (id: string) => deleteDocument('collections', id);

// Expenses
export const getAllExpenses = () => getCollection<Expense>('expenses');
export const addExpense = (data: Omit<Expense, 'id'>) => addDocument<Expense>('expenses', data);
export const updateExpense = (id: string, data: Partial<Expense>) => updateDocument<Expense>('expenses', id, data);
export const deleteExpense = (id: string) => deleteDocument('expenses', id);

// Achievements
export const getAllAchievements = () => getCollection<Achievement>('achievements');
export const addAchievement = (data: Omit<Achievement, 'id'>) => addDocument<Achievement>('achievements', data);
export const updateAchievement = (id: string, data: Partial<Achievement>) => updateDocument<Achievement>('achievements', id, data);
export const deleteAchievement = (id: string) => deleteDocument('achievements', id);

export const getRecentAchievements = async () => {
    const q = query(collection(db, "achievements"), orderBy("date", "desc"), limit(3));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Achievement));
};

// Slideshow Items
export const getSlideshowItems = async (): Promise<SlideshowItem[]> => {
    const photoQuery = query(collection(db, 'photos'), where('isSliderPhoto', '==', true));
    const eventQuery = query(collection(db, 'events'), where('showOnSlider', '==', true));

    const [photoSnapshot, eventSnapshot] = await Promise.all([
        getDocs(photoQuery),
        getDocs(eventQuery)
    ]);

    const sliderPhotos: SlideshowItem[] = photoSnapshot.docs.map(doc => {
        const p = doc.data() as Omit<Photo, 'id'>;
        return {
            id: `photo-${doc.id}`,
            url: p.url,
            title: "Welcome to Club Central",
            description: p.description,
            'data-ai-hint': p['data-ai-hint'],
            date: p.uploadedAt,
        };
    });

    const sliderEvents: SlideshowItem[] = eventSnapshot.docs.map(doc => {
        const e = doc.data() as Omit<Event, 'id'>;
        return {
            id: `event-${doc.id}`,
            url: e.photoUrl,
            title: e.title,
            description: e.description,
            'data-ai-hint': e['data-ai-hint'],
            date: e.date,
        };
    });
    
    return [...sliderPhotos, ...sliderEvents].sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime());
};


// Database Seeding
const sampleData = {
    photos: [
        { url: 'https://placehold.co/1200x800.png', isSliderPhoto: true, uploadedAt: '2023-10-26T10:00:00Z', 'data-ai-hint': 'group photo', description: 'Our amazing club members.' },
        { url: 'https://placehold.co/600x400.png', isSliderPhoto: false, uploadedAt: '2023-10-25T11:00:00Z', 'data-ai-hint': 'event action' },
        { url: 'https://placehold.co/600x400.png', isSliderPhoto: true, uploadedAt: '2023-10-24T12:00:00Z', 'data-ai-hint': 'community gathering', description: 'Community outreach program.' },
        { url: 'https://placehold.co/600x400.png', isSliderPhoto: false, uploadedAt: '2023-10-23T13:00:00Z', 'data-ai-hint': 'club activity' },
        { url: 'https://placehold.co/600x400.png', isSliderPhoto: false, uploadedAt: '2023-10-22T14:00:00Z', 'data-ai-hint': 'team sport' },
        { url: 'https://placehold.co/600x400.png', isSliderPhoto: false, uploadedAt: '2023-10-21T15:00:00Z', 'data-ai-hint': 'award ceremony' },
    ],
    events: [
        { title: 'Annual Charity Gala', description: 'Join us for a night of giving back.', date: '2024-08-15', photoUrl: 'https://placehold.co/600x400.png', 'data-ai-hint': 'gala event', showOnSlider: true, redirectUrl: '' },
        { title: 'Summer Sports Fest', description: 'A day of fun and friendly competition.', date: '2024-07-20', photoUrl: 'https://placehold.co/600x400.png', 'data-ai-hint': 'sports festival', showOnSlider: false, redirectUrl: '' },
        { title: 'Tech Conference 2024', description: 'Exploring the future of technology.', date: '2024-09-10', photoUrl: 'https://placehold.co/600x400.png', 'data-ai-hint': 'tech conference', showOnSlider: true, redirectUrl: 'https://example.com' },
        { title: 'Community Clean-up Drive', description: 'Let\'s make our neighborhood cleaner.', date: '2024-06-05', photoUrl: 'https://placehold.co/600x400.png', 'data-ai-hint': 'community service', showOnSlider: false, redirectUrl: '' },
    ],
    members: [
        { name: 'Alice Johnson', email: 'alice@example.com', photoUrl: 'https://placehold.co/100x100.png', joinDate: '2022-01-15' },
        { name: 'Bob Williams', email: 'bob@example.com', photoUrl: 'https://placehold.co/100x100.png', joinDate: '2022-02-20' },
        { name: 'Charlie Brown', email: 'charlie@example.com', photoUrl: 'https://placehold.co/100x100.png', joinDate: '2022-03-10' },
        { name: 'Diana Prince', email: 'diana@example.com', photoUrl: 'https://placehold.co/100x100.png', joinDate: '2022-04-05' },
    ],
    donations: [
        { title: 'Corporate Sponsorship', amount: 50000, date: '2024-05-15' },
        { title: 'Anonymous Donor', amount: 10000, date: '2024-05-20' },
        { title: 'Bake Sale Fundraiser', item: 'Various baked goods', date: '2024-06-01' },
    ],
    collections: [
        { title: 'Membership Fees Q2', amount: 25000, date: '2024-04-30' },
        { title: 'Event Ticket Sales', amount: 15000, date: '2024-07-15' },
    ],
    expenses: [
        { title: 'Venue Rental', amount: 20000, date: '2024-07-10' },
        { title: 'Equipment Purchase', amount: 35000, date: '2024-05-25' },
    ],
    achievements: [
        { title: 'Regional Champions 2024', description: 'Our team won the regional tournament.', date: '2024-05-30', photoUrl: 'https://placehold.co/600x400.png', 'data-ai-hint': 'trophy award' },
        { title: 'Community Service Award', description: 'Recognized for our contribution to the local community.', date: '2024-06-15', photoUrl: 'https://placehold.co/600x400.png', 'data-ai-hint': 'community award' },
    ]
};

export async function seedDatabase() {
    const batch = writeBatch(db);

    for (const [collectionName, data] of Object.entries(sampleData)) {
        const collectionRef = collection(db, collectionName);
        const snapshot = await getDocs(query(collectionRef, limit(1)));
        
        // Only seed if the collection is empty
        if (snapshot.empty) {
            console.log(`Seeding ${collectionName}...`);
            data.forEach((item) => {
                const docRef = doc(collectionRef);
                batch.set(docRef, item);
            });
        } else {
            console.log(`${collectionName} is not empty. Skipping seed.`);
        }
    }

    await batch.commit();
}
