
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
  title?: string;
  description?: string;
}

export interface Event extends BaseDocument {
  title: string;
  description: string;
  date: string;
  photoUrl:string;
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

// Events
export const getAllEvents = () => getCollection<Event>('events', 'date', 'desc');
export const addEvent = (data: Omit<Event, 'id'>) => addDocument<Event>('events', data);
export const updateEvent = (id: string, data: Partial<Event>) => updateDocument<Event>('events', id, data);
export const deleteEvent = (id: string) => deleteDocument('events', id);

// Members
export const getAllMembers = () => getCollection<Member>('members', 'joinDate');
export const addMember = (data: Omit<Member, 'id'>) => addDocument<Member>('members', data);
export const updateMember = (id: string, data: Partial<Member>) => updateDocument<Member>('members', id, data);
export const deleteMember = (id: string) => deleteDocument('members', id);

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
    } else if (memberData.isAdmin) {
        const adminRequestQ = query(collection(db, "adminRequests"), where("email", "==", email), where("status", "==", "approved"), limit(1));
        const adminRequestSnap = await getDocs(adminRequestQ);
        if(adminRequestSnap.empty) {
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

// Admin Requests
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


export const getDashboardContent = async () => {
    if (!isConfigComplete) return { photos: [], events: [], achievements: [] };

    const photosQuery = query(collection(db, 'photos'), where('isSliderPhoto', '==', true), orderBy('uploadedAt', 'desc'), limit(5));
    const eventsQuery = query(collection(db, 'events'), where('showOnSlider', '==', true), orderBy('date', 'desc'), limit(5));
    const achievementsQuery = query(collection(db, 'achievements'), orderBy('date', 'desc'), limit(5));

    const [photosSnapshot, eventsSnapshot, achievementsSnapshot] = await Promise.all([
        getDocs(photosQuery),
        getDocs(eventsQuery),
        getDocs(achievementsQuery),
    ]);

    const photos = photosSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Photo));
    const events = eventsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Event));
    const achievements = achievementsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Achievement));

    return { photos, events, achievements };
};

    