
import { db, isConfigComplete } from './firebase';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, query, orderBy, limit, where, writeBatch, getDoc, serverTimestamp, FieldValue } from 'firebase/firestore';

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
  isAdmin?: boolean;
  isSuperAdmin?: boolean;
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

export interface AdminRequest extends BaseDocument {
  name: string;
  email: string;
  photoUrl: string;
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
  requestedAt: FieldValue;
}

export interface Notification extends BaseDocument {
  title: string;
  description: string;
  link?: string;
  imageUrl?: string;
  createdAt: FieldValue;
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

export const getRecentPhotos = async (count: number = 2) => {
    if (!isConfigComplete) return [];
    const q = query(collection(db, "photos"), orderBy("uploadedAt", "desc"), limit(count));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Photo));
};

// Events
export const getAllEvents = () => getCollection<Event>('events', 'date', 'desc');
export const addEvent = (data: Omit<Event, 'id'>) => addDocument<Event>('events', data);
export const updateEvent = (id: string, data: Partial<Event>) => updateDocument<Event>('events', id, data);
export const deleteEvent = (id: string) => deleteDocument('events', id);

export const getRecentEvents = async (count: number = 2) => {
    if (!isConfigComplete) return [];
    const q = query(
        collection(db, "events"), 
        orderBy("date", "desc"), 
        limit(count)
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

export const getMemberByEmail = async (email: string): Promise<Member | null> => {
    if (!isConfigComplete) return null;
    const q = query(collection(db, "members"), where("email", "==", email), limit(1));
    const snapshot = await getDocs(q);
    if (snapshot.empty) {
        return null;
    }
    const memberDoc = snapshot.docs[0];
    const memberData = { id: memberDoc.id, ...memberDoc.data() } as Member;

    if (memberData.email === process.env.NEXT_PUBLIC_ADMIN_EMAIL) {
        memberData.isSuperAdmin = true;
        memberData.isAdmin = true;
    }

    if (memberData.isAdmin) {
        const adminRequestQ = query(collection(db, "adminRequests"), where("email", "==", email), where("status", "==", "approved"), limit(1));
        const adminRequestSnap = await getDocs(adminRequestQ);
        if(adminRequestSnap.empty && !memberData.isSuperAdmin) {
            memberData.isAdmin = false;
        }
    }
    
    return memberData;
};

export const updateMemberByEmail = async (email: string, data: Partial<Omit<Member, 'id' | 'email'>>) => {
    if (!isConfigComplete) return;
    const member = await getMemberByEmail(email);
    if (member) {
        await updateMember(member.id, data);
    } else {
        throw new Error("Member not found");
    }
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

export const getRecentAchievements = async (count: number = 2) => {
    if (!isConfigComplete) return [];
    const q = query(collection(db, "achievements"), orderBy("date", "desc"), limit(count));
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

// Admin Requests
export const addAdminRequest = async (data: Omit<AdminRequest, 'id' | 'status' | 'requestedAt'>) => {
    if (!isConfigComplete) throw new Error("Firebase not configured");
    const requestData = {
        ...data,
        status: 'pending' as const,
        requestedAt: serverTimestamp(),
    };
    return await addDocument<Omit<AdminRequest,'id'>>('adminRequests', requestData);
};

export const getAdminRequestByEmail = async (email: string): Promise<AdminRequest | null> => {
    if (!isConfigComplete) return null;
    const q = query(collection(db, "adminRequests"), where("email", "==", email), limit(1));
    const snapshot = await getDocs(q);
    if (snapshot.empty) return null;
    const docData = snapshot.docs[0];
    return { id: docData.id, ...docData.data() } as AdminRequest;
}

export const getAllAdminRequests = () => getCollection<AdminRequest>('adminRequests', 'requestedAt', 'desc');

export const updateAdminRequestStatus = async (id: string, status: 'approved' | 'rejected') => {
    if (!isConfigComplete) return;
    const requestRef = doc(db, 'adminRequests', id);
    
    const requestSnap = await getDoc(requestRef);
    if (!requestSnap.exists()) return;
    const requestData = requestSnap.data() as AdminRequest;
    
    const member = await getMemberByEmail(requestData.email);
    if (member) {
        await updateMember(member.id, { isAdmin: status === 'approved' });
        await updateDoc(requestRef, { status });
    }
};

// Notifications
export const getAllNotifications = () => getCollection<Notification>('notifications', 'createdAt', 'desc');
export const addNotification = (data: Omit<Notification, 'id' | 'createdAt'>) => addDocument<Omit<Notification, 'id'>>('notifications', { ...data, createdAt: serverTimestamp() });
export const deleteNotification = (id: string) => deleteDocument('notifications', id);


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
