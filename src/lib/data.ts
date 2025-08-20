
import { db, isConfigComplete } from './firebase';
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
  title?: string;
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
  phone?: string;
  dob?: string;
  bloodGroup?: string;
}

export interface Donation extends BaseDocument {
    title: string;
    donorName?: string;
    description?: string;
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
  if (!isConfigComplete) return [];
  const q = query(collection(db, collectionName), orderBy(orderField, orderDirection));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as T));
}

async function addDocument<T>(collectionName: string, data: Omit<T, 'id'>): Promise<T & BaseDocument> {
  if (!isConfigComplete) {
    console.error("Firebase not configured, cannot add document.");
    throw new Error("Firebase not configured");
  }
  const docRef = await addDoc(collection(db, collectionName), data);
  return { id: docRef.id, ...data } as T & BaseDocument;
}

async function updateDocument<T>(collectionName: string, id: string, data: Partial<T>) {
  if (!isConfigComplete) {
    console.error("Firebase not configured, cannot update document.");
    return;
  }
  const docRef = doc(db, collectionName, id);
  await updateDoc(docRef, data);
}

async function deleteDocument(collectionName: string, id: string) {
  if (!isConfigComplete) {
     console.error("Firebase not configured, cannot delete document.");
     return;
  }
  const docRef = doc(db, collectionName, id);
  await deleteDoc(docRef);
}


// Photos
export const getAllPhotos = () => getCollection<Photo>('photos', 'uploadedAt');
export const addPhoto = (data: Omit<Photo, 'id'>) => addDocument<Photo>('photos', data);
export const updatePhoto = (id: string, data: Partial<Photo>) => updateDocument<Photo>('photos', id, data);
export const deletePhoto = (id: string) => deleteDocument('photos', id);

export const getRecentPhotos = async () => {
    if (!isConfigComplete) return [];
    const q = query(collection(db, "photos"), orderBy("uploadedAt", "desc"), limit(6));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Photo));
};

// Events
export const getAllEvents = () => getCollection<Event>('events', 'date', 'desc');
export const addEvent = (data: Omit<Event, 'id'>) => addDocument<Event>('events', data);
export const updateEvent = (id: string, data: Partial<Event>) => updateDocument<Event>('events', id, data);
export const deleteEvent = (id: string) => deleteDocument('events', id);

export const getRecentEvents = async () => {
    if (!isConfigComplete) return [];
    const q = query(
        collection(db, "events"), 
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

export const checkIfMemberExists = async (email: string): Promise<boolean> => {
    if (!isConfigComplete) return false;
    const q = query(collection(db, "members"), where("email", "==", email), limit(1));
    const snapshot = await getDocs(q);
    return !snapshot.empty;
};


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
    if (!isConfigComplete) return [];
    const q = query(collection(db, "achievements"), orderBy("date", "desc"), limit(3));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Achievement));
};

// Slideshow Items
export const getSlideshowItems = async (): Promise<SlideshowItem[]> => {
    if (!isConfigComplete) return [];
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
            title: p.title || '',
            description: p.description || '',
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
const sampleData: Record<string, any[]> = {};

export async function seedDatabase() {
    if (!isConfigComplete) {
        console.error("Firebase not configured, cannot seed database.");
        throw new Error("Firebase not configured");
    }
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
