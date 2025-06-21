
'use client';

import { doc, getDoc, setDoc } from 'firebase/firestore';
import type { Category, Topic } from '@/app/algoflow/types';
import { db } from './config';
import { Folder, FileText, type LucideIcon, icons as lucideIcons } from 'lucide-react';

const getIconComponent = (name: string | undefined, defaultIcon: LucideIcon): LucideIcon => {
  if (name && lucideIcons[name as keyof typeof lucideIcons]) {
    return lucideIcons[name as keyof typeof lucideIcons] as LucideIcon;
  }
  return defaultIcon;
};

// Type for data stored in Firestore (without actual Icon components)
type FirestoreTopic = Omit<Topic, 'icon'> & { iconName?: string; markedForRevision?: boolean; companies?: string[] };
type FirestoreCategory = Omit<Category, 'icon' | 'topics'> & {
  iconName: string;
  topics: FirestoreTopic[];
};


// Function to prepare data for Firestore (convert Icon components to iconName strings)
const prepareCategoriesForFirestore = (categories: Category[]): FirestoreCategory[] => {
  return categories.map(category => ({
    id: category.id,
    name: category.name,
    iconName: category.iconName || (category.icon as any)?.displayName?.replace('Icon', '') || 'Folder',
    topics: category.topics.map(topic => ({
      id: topic.id,
      name: topic.name,
      description: topic.description,
      completed: topic.completed,
      markedForRevision: topic.markedForRevision || false,
      solutionCode: topic.solutionCode || '',
      difficulty: topic.difficulty || 'Medium',
      notes: topic.notes || '',
      companies: topic.companies || [],
      iconName: topic.iconName || (topic.icon as any)?.displayName?.replace('Icon', '') || 'FileText',
    })),
  }));
};

// Function to restore data from Firestore (convert iconName strings back to Icon components)
const restoreCategoriesFromFirestore = (firestoreCategories: FirestoreCategory[]): Category[] => {
  return firestoreCategories.map(category => ({
    ...category, // This spreads id, name, iconName (from FirestoreCategory)
    icon: getIconComponent(category.iconName, Folder),
    topics: category.topics.map(topic => ({
      ...topic, // This spreads id, name, description, completed, markedForRevision, iconName etc. (from FirestoreTopic)
      icon: getIconComponent(topic.iconName, FileText),
      markedForRevision: topic.markedForRevision || false,
      solutionCode: topic.solutionCode || '',
      difficulty: topic.difficulty || 'Medium',
      notes: topic.notes || '',
      companies: topic.companies || [],
    })),
  }));
};


export async function saveUserRoadmap(userId: string, categoriesData: Category[]): Promise<void | string> {
  try {
    const userRoadmapRef = doc(db, 'userRoadmaps', userId);
    const dataToSave = prepareCategoriesForFirestore(categoriesData);
    await setDoc(userRoadmapRef, { roadmap: dataToSave, lastUpdated: new Date() });
  } catch (error) {
    console.error("Error saving user roadmap to Firestore:", error);
    if (error instanceof Error) {
      return error.message;
    }
    return "An unknown error occurred while saving your roadmap.";
  }
}

export async function loadUserRoadmap(userId: string): Promise<Category[] | null | string> {
  try {
    const userRoadmapRef = doc(db, 'userRoadmaps', userId);
    const docSnap = await getDoc(userRoadmapRef);

    if (docSnap.exists()) {
      const data = docSnap.data();
      // Check if roadmap exists and is an array.
      // If it's an empty array, we should return it as such.
      if (data && data.roadmap && Array.isArray(data.roadmap)) {
        // data.roadmap is FirestoreCategory[]
        return restoreCategoriesFromFirestore(data.roadmap as FirestoreCategory[]);
      }
      // If roadmap field is missing or not an array, but doc exists, treat as corrupted/old format
      // or just no valid roadmap. Returning null will trigger re-initialization.
      return null;
    } else {
      // No document found, return null to indicate new user or no saved data
      return null;
    }
  } catch (error) {
    console.error("Error loading user roadmap from Firestore:", error);
    if (error instanceof Error) {
      return error.message;
    }
    return "An unknown error occurred while loading your roadmap.";
  }
}
