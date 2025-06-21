
import type { LucideIcon } from 'lucide-react';

export type TopicDifficulty = 'Easy' | 'Medium' | 'Hard';

export interface Topic {
  id: string;
  name: string;
  description: string;
  completed: boolean;
  markedForRevision?: boolean;
  solutionCode?: string;
  icon?: LucideIcon;
  iconName?: string;
  difficulty?: TopicDifficulty;
  notes?: string;
  companies?: string[];
  originalCategoryId?: string; // Used in company view to reference original category
  originalCategoryName?: string; // Used in company view
}

export interface Category {
  id: string;
  name: string;
  icon: LucideIcon;
  iconName?: string;
  topics: Topic[];
}

// This type can be used for data passed to the accordion,
// which could be categories or company-grouped data.
export interface DataGroup {
  id: string;
  name: string;
  icon: LucideIcon;
  iconName?: string;
  topics: Topic[];
}
