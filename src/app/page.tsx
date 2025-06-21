
'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import type { User } from 'firebase/auth';
import { AlgoFlowHeader } from '@/components/algoflow/AlgoFlowHeader';
import { StatsDisplay } from '@/components/algoflow/StatsDisplay';
import { TopicAccordion } from '@/components/algoflow/TopicAccordion';
import { initialCategoriesData } from './algoflow/data';
import type { Category, Topic, TopicDifficulty, DataGroup } from './algoflow/types';
import { useToast } from "@/hooks/use-toast";
import { Button } from '@/components/ui/button';
import { RefreshCcw, PlusCircle, FileText, FolderPlus, Folder as FolderIcon, Trash2, icons as lucideIcons, Bookmark, FileCode, Search, NotebookText, Workflow, Building2, XIcon } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { onAuthStateChangedWrapper } from '@/lib/firebase/auth';
import { loadUserRoadmap, saveUserRoadmap } from '@/lib/firebase/firestore';


import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from "@/components/ui/badge";


const LOCAL_STORAGE_KEY = 'algoFlowData_v2_anonymous';

const getCategoryIcon = (name: string | undefined): LucideIcon => {
  if (name && lucideIcons[name as keyof typeof lucideIcons]) {
    return lucideIcons[name as keyof typeof lucideIcons] as LucideIcon;
  }
  return FolderIcon;
};

const getTopicIcon = (name: string | undefined): LucideIcon => {
  if (name && lucideIcons[name as keyof typeof lucideIcons]) {
    return lucideIcons[name as keyof typeof lucideIcons] as LucideIcon;
  }
  return FileText;
};

const defaultFormattedCategories = initialCategoriesData.map(cat => ({
  ...cat,
  icon: getCategoryIcon(cat.iconName),
  topics: cat.topics.map(topic => ({
    ...topic,
    icon: getTopicIcon(topic.iconName),
    markedForRevision: topic.markedForRevision || false,
    solutionCode: topic.solutionCode || '',
    difficulty: topic.difficulty || 'Medium',
    notes: topic.notes || '',
    companies: topic.companies || [],
  }))
}));


export default function AlgoFlowPage() {
  const { toast } = useToast();
  const router = useRouter();

  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [categoriesData, setCategoriesData] = useState<Category[]>([]);

  const [overallProgress, setOverallProgress] = useState(0);
  const [streak, setStreak] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeView, setActiveView] = useState<'categories' | 'companies'>('categories');


  const [isAddTopicModalOpen, setIsAddTopicModalOpen] = useState(false);
  const [newTopicCategoryId, setNewTopicCategoryId] = useState<string>('');
  const [newTopicName, setNewTopicName] = useState('');
  const [newTopicDescription, setNewTopicDescription] = useState('');
  const [newTopicDifficulty, setNewTopicDifficulty] = useState<TopicDifficulty>('Medium');

  const [isAddCategoryModalOpen, setIsAddCategoryModalOpen] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newCategoryIconName, setNewCategoryIconName] = useState('');

  const [isDeleteTopicAlertOpen, setIsDeleteTopicAlertOpen] = useState(false);
  const [topicToDelete, setTopicToDelete] = useState<{ categoryId: string, topicId: string, topicName: string } | null>(null);

  const [isDeleteCategoryAlertOpen, setIsDeleteCategoryAlertOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<{ id: string, name: string } | null>(null);

  const [isSolutionModalOpen, setIsSolutionModalOpen] = useState(false);
  const [selectedTopicForSolution, setSelectedTopicForSolution] = useState<{ categoryId: string; topicId: string; topicName: string; } | null>(null);
  const [solutionCodeInput, setSolutionCodeInput] = useState('');

  const [isNotesModalOpen, setIsNotesModalOpen] = useState(false);
  const [selectedTopicForNotes, setSelectedTopicForNotes] = useState<{ categoryId: string; topicId: string; topicName: string; } | null>(null);
  const [notesInput, setNotesInput] = useState('');

  const [isCompanyModalOpen, setIsCompanyModalOpen] = useState(false);
  const [selectedTopicForCompanies, setSelectedTopicForCompanies] = useState<{ categoryId: string; topicId: string; topicName: string; currentCompanies: string[] } | null>(null);
  const [companyInput, setCompanyInput] = useState('');
  const [currentCompaniesListInModal, setCurrentCompaniesListInModal] = useState<string[]>([]);


  const initializeData = (data: Category[]): Category[] => {
    return data.map(cat => ({
      ...cat,
      icon: getCategoryIcon(cat.iconName),
      iconName: cat.iconName || 'FolderIcon',
      topics: cat.topics.map(topic => ({
        ...topic,
        icon: getTopicIcon(topic.iconName),
        iconName: topic.iconName || 'FileText',
        markedForRevision: topic.markedForRevision || false,
        difficulty: topic.difficulty || 'Medium',
        notes: topic.notes || '',
        solutionCode: topic.solutionCode || '',
        companies: topic.companies || [],
      }))
    }));
  };

  useEffect(() => {
    setIsLoadingAuth(true);
    setIsLoadingData(true); 

    const unsubscribe = onAuthStateChangedWrapper(async (user) => {
      setCurrentUser(user);
      setIsLoadingAuth(false); 

      if (user) {
        const firestoreData = await loadUserRoadmap(user.uid);
        if (typeof firestoreData === 'string') {
          const lowerError = firestoreData.toLowerCase();
          if (lowerError.includes('offline') || lowerError.includes('network error') || lowerError.includes('failed to get document')) {
            toast({
              variant: "destructive",
              title: "Offline Mode",
              description: "Could not load data from the cloud. Displaying cached or default data. Please check your internet connection.",
              duration: 5000
            });
          } else {
            toast({ variant: "destructive", title: "Error Loading Data", description: firestoreData });
          }
          if (categoriesData.length === 0) {
            setCategoriesData(initializeData(defaultFormattedCategories));
          }
        } else if (firestoreData === null) { 
          setCategoriesData(initializeData(defaultFormattedCategories));
        } else { 
          setCategoriesData(initializeData(firestoreData));
        }
      } else {
        if (typeof window !== 'undefined') {
            const savedData = localStorage.getItem(LOCAL_STORAGE_KEY);
            if (savedData) {
                try {
                    const parsedData = JSON.parse(savedData) as Category[];
                    setCategoriesData(initializeData(parsedData));
                } catch (error) {
                    console.error("Error parsing anonymous data from local storage:", error);
                    setCategoriesData(initializeData(defaultFormattedCategories));
                }
            } else {
                setCategoriesData(initializeData(defaultFormattedCategories));
            }
        } else {
             setCategoriesData(initializeData(defaultFormattedCategories));
        }
      }
      setIsLoadingData(false); 
    });
    return () => unsubscribe();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [toast]);


 useEffect(() => {
    // This effect handles redirection based on authentication state
    // It runs after the initial render and whenever isLoadingAuth or currentUser changes
    if (typeof window !== 'undefined' && !isLoadingAuth && !currentUser) {
      router.push('/login');
    }
  }, [isLoadingAuth, currentUser, router]);


 useEffect(() => {
    if (isLoadingData || isLoadingAuth || categoriesData.length === 0) {
      return;
    }

    const saveOperation = async () => {
      if (currentUser) {
        const error = await saveUserRoadmap(currentUser.uid, categoriesData);
        if (error) {
          const lowerError = error.toLowerCase();
          if (lowerError.includes('offline') || lowerError.includes('network error')) {
            toast({ variant: "destructive", title: "Offline Mode", description: "Could not save data to the cloud. Changes are saved locally and will sync when online.", duration: 5000 });
          } else {
            toast({ variant: "destructive", title: "Error Saving Data to Cloud", description: error, duration: 3000 });
          }
        }
      } else {
        if (typeof window !== 'undefined') {
          const dataToStore = categoriesData.map(cat => ({
              ...cat,
              icon: undefined,
              iconName: cat.iconName || (cat.icon as any)?.displayName?.replace('Icon', '') || 'Folder',
              topics: cat.topics.map(topic => ({
                  ...topic,
                  icon: undefined,
                  iconName: topic.iconName || (topic.icon as any)?.displayName?.replace('Icon', '') || 'FileText'
              }))
          }));
          localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(dataToStore));
        }
      }
    };

    const handler = setTimeout(saveOperation, 1000);
    return () => clearTimeout(handler);

  }, [categoriesData, currentUser, isLoadingAuth, isLoadingData, toast]);


  const calculateProgress = useCallback(() => {
    if (categoriesData.length === 0) return 0;
    let completedCount = 0;
    let totalCount = 0;
    categoriesData.forEach(category => {
      category.topics.forEach(topic => {
        totalCount++;
        if (topic.completed) {
          completedCount++;
        }
      });
    });
    return totalCount > 0 ? (completedCount / totalCount) * 100 : 0;
  }, [categoriesData]);

  useEffect(() => {
    setOverallProgress(calculateProgress());
  }, [categoriesData, calculateProgress]);


  useEffect(() => {
    if (typeof window !== 'undefined' && !isLoadingData) {
      const completedToday = categoriesData.some(cat => cat.topics.some(t => t.completed)); 
      let currentStreak = localStorage.getItem('algoflow_streak') ? parseInt(localStorage.getItem('algoflow_streak')!) : 0;
      const today = new Date().toDateString();
      const lastCompletionDate = localStorage.getItem('algoflow_last_completion_date');

      if (completedToday && lastCompletionDate !== today) { 
          currentStreak++;
          localStorage.setItem('algoflow_streak', currentStreak.toString());
          localStorage.setItem('algoflow_last_completion_date', today);
      } else if (!lastCompletionDate && completedToday) { 
          currentStreak = 1;
          localStorage.setItem('algoflow_streak', '1');
          localStorage.setItem('algoflow_last_completion_date', today);
      }
      setStreak(currentStreak);
    }
  }, [categoriesData, isLoadingData]);


  const handleTopicCompletionChange = (categoryId: string, topicId: string, completed: boolean) => {
    setCategoriesData(prevData =>
      prevData.map(category =>
        category.id === categoryId
          ? {
            ...category,
            topics: category.topics.map(topic =>
              topic.id === topicId ? { ...topic, completed } : topic
            ),
          }
          : category
      )
    );
    let topicName = "Unknown Topic";
    const category = categoriesData.find(c => c.id === categoryId);
    if (category) {
        const topic = category.topics.find(t => t.id === topicId);
        if (topic) {
            topicName = topic.name;
        }
    }

    toast({
      title: `Topic ${completed ? 'Completed' : 'Marked Incomplete'}`,
      description: `${topicName} status updated.`,
      duration: 3000,
    });
  };

  const handleTopicRevisionChange = (categoryId: string, topicId: string, marked: boolean) => {
    let topicName = '';
    setCategoriesData(prevData =>
      prevData.map(category => {
        if (category.id === categoryId) {
          return {
            ...category,
            topics: category.topics.map(topic => {
              if (topic.id === topicId) {
                topicName = topic.name;
                return { ...topic, markedForRevision: marked };
              }
              return topic;
            }),
          };
        }
        return category;
      })
    );
    toast({
      title: `Revision Status Updated`,
      description: `Topic "${topicName}" ${marked ? 'marked' : 'unmarked'} for revision.`,
      duration: 3000,
    });
  };

  const resetProgress = () => {
    setIsLoadingData(true);
    const resetData = initializeData(defaultFormattedCategories);
    setCategoriesData(resetData);
    setStreak(0);
    if (typeof window !== 'undefined') {
      localStorage.setItem('algoflow_streak', '0');
      localStorage.removeItem('algoflow_last_completion_date');
      if (!currentUser) {
        localStorage.removeItem(LOCAL_STORAGE_KEY);
      }
    }
    toast({ title: "Progress Reset", description: "All topics have been reset to default.", duration: 3000 });
    setTimeout(() => setIsLoadingData(false), 50); 
  };


  const handleAddTopic = () => {
    if (!newTopicCategoryId || !newTopicName.trim()) {
      toast({ variant: "destructive", title: "Error", description: "Please select a category and enter a topic name.", duration: 3000 });
      return;
    }
    setCategoriesData(prevData => {
      return prevData.map(category => {
        if (category.id === newTopicCategoryId) {
          const categoryIdParts = category.id.split('-');
          const prefix = categoryIdParts[0] + (categoryIdParts.length > 1 && categoryIdParts[1].length > 0 ? categoryIdParts[1][0] : '');
          const newTopic: Topic = {
            id: `${prefix}-${category.topics.length + 1}-${Date.now()}`,
            name: newTopicName.trim(),
            description: newTopicDescription.trim(),
            completed: false,
            markedForRevision: false,
            solutionCode: '',
            notes: '',
            companies: [],
            difficulty: newTopicDifficulty,
            icon: getTopicIcon(undefined),
            iconName: 'FileText',
          };
          return { ...category, topics: [...category.topics, newTopic] };
        }
        return category;
      });
    });
    toast({ title: "Topic Added", description: `"${newTopicName.trim()}" has been added.`, duration: 3000 });
    setNewTopicCategoryId(''); setNewTopicName(''); setNewTopicDescription(''); setNewTopicDifficulty('Medium');
    setIsAddTopicModalOpen(false);
  };

  const handleAddCategory = () => {
    if (!newCategoryName.trim()) {
      toast({ variant: "destructive", title: "Error", description: "Please enter a category name.", duration: 3000 });
      return;
    }
    const newCategoryId = newCategoryName.trim().toLowerCase().replace(/\s+/g, '-') + `-${Date.now()}`;
    const selectedIconName = newCategoryIconName.trim() || 'Folder';
    const newCategory: Category = {
      id: newCategoryId,
      name: newCategoryName.trim(),
      icon: getCategoryIcon(selectedIconName),
      iconName: selectedIconName,
      topics: [],
    };
    setCategoriesData(prevData => [...prevData, newCategory]);
    toast({ title: "Category Added", description: `"${newCategory.name}" has been added.`, duration: 3000 });
    setNewCategoryName(''); setNewCategoryIconName('');
    setIsAddCategoryModalOpen(false);
  };

  const handleRequestDeleteTopic = (categoryId: string, topicId: string, topicName: string) => {
    // This categoryId is the original category ID, even if called from company view, thanks to actionGroupId logic
    setTopicToDelete({ categoryId, topicId, topicName });
    setIsDeleteTopicAlertOpen(true);
  };

  const handleConfirmDeleteTopic = () => {
    if (!topicToDelete) return;
    // topicToDelete.categoryId already holds the original category ID
    setCategoriesData(prevData =>
      prevData.map(category =>
        category.id === topicToDelete.categoryId
          ? { ...category, topics: category.topics.filter(topic => topic.id !== topicToDelete.topicId) }
          : category
      )
    );
    toast({ title: "Topic Deleted", description: `"${topicToDelete.topicName}" has been removed.`, duration: 3000 });
    setIsDeleteTopicAlertOpen(false); setTopicToDelete(null);
  };

  const handleRequestDeleteCategory = (categoryId: string, categoryName: string) => {
    setCategoryToDelete({ id: categoryId, name: categoryName });
    setIsDeleteCategoryAlertOpen(true);
  };

  const handleConfirmDeleteCategory = () => {
    if (!categoryToDelete) return;
    setCategoriesData(prevData => prevData.filter(category => category.id !== categoryToDelete.id));
    toast({ title: "Category Deleted", description: `"${categoryToDelete.name}" and all its topics removed.`, duration: 3000 });
    setIsDeleteCategoryAlertOpen(false); setCategoryToDelete(null);
  };

  const handleOpenSolutionModal = (categoryId: string, topicId: string, topicName: string, currentSolution?: string) => {
    // categoryId is original category ID
    setSelectedTopicForSolution({ categoryId, topicId, topicName });
    setSolutionCodeInput(currentSolution || '');
    setIsSolutionModalOpen(true);
  };

  const handleSaveSolution = () => {
    if (!selectedTopicForSolution) return;
    // selectedTopicForSolution.categoryId is original category ID
    const { categoryId, topicId, topicName } = selectedTopicForSolution;
    setCategoriesData(prevData =>
      prevData.map(category =>
        category.id === categoryId
          ? { ...category, topics: category.topics.map(topic => topic.id === topicId ? { ...topic, solutionCode: solutionCodeInput } : topic) }
          : category
      )
    );
    toast({ title: "Solution Saved", description: `Solution for "${topicName}" updated.`, duration: 3000 });
    setIsSolutionModalOpen(false); setSelectedTopicForSolution(null); setSolutionCodeInput('');
  };

  const handleOpenNotesModal = (categoryId: string, topicId: string, topicName: string, currentNotes?: string) => {
    // categoryId is original category ID
    setSelectedTopicForNotes({ categoryId, topicId, topicName });
    setNotesInput(currentNotes || '');
    setIsNotesModalOpen(true);
  };

  const handleSaveNotes = () => {
    if (!selectedTopicForNotes) return;
    // selectedTopicForNotes.categoryId is original category ID
    const { categoryId, topicId, topicName } = selectedTopicForNotes;
    setCategoriesData(prevData =>
      prevData.map(category =>
        category.id === categoryId
          ? { ...category, topics: category.topics.map(topic => topic.id === topicId ? { ...topic, notes: notesInput } : topic) }
          : category
      )
    );
    toast({ title: "Notes Saved", description: `Notes for "${topicName}" updated.`, duration: 3000 });
    setIsNotesModalOpen(false); setSelectedTopicForNotes(null); setNotesInput('');
  };

  const handleOpenCompanyModal = (categoryId: string, topicId: string, topicName: string, currentCompanies: string[] = []) => {
    // categoryId is original category ID
    setSelectedTopicForCompanies({ categoryId, topicId, topicName, currentCompanies });
    setCurrentCompaniesListInModal([...currentCompanies]);
    setCompanyInput('');
    setIsCompanyModalOpen(true);
  };

  const handleAddCompanyToModalList = () => {
    if (companyInput.trim() && !currentCompaniesListInModal.includes(companyInput.trim())) {
      setCurrentCompaniesListInModal(prev => [...prev, companyInput.trim()]);
      setCompanyInput('');
    } else if (currentCompaniesListInModal.includes(companyInput.trim())) {
      toast({ variant: "destructive", title: "Company Exists", description: "This company is already in the list.", duration: 2000 });
    }
  };

  const handleRemoveCompanyFromModalList = (companyToRemove: string) => {
    setCurrentCompaniesListInModal(prev => prev.filter(company => company !== companyToRemove));
  };

  const handleSaveCompaniesForTopic = () => {
    if (!selectedTopicForCompanies) return;
    // selectedTopicForCompanies.categoryId is original category ID
    const { categoryId, topicId, topicName } = selectedTopicForCompanies;
    setCategoriesData(prevData =>
      prevData.map(category =>
        category.id === categoryId
          ? {
              ...category,
              topics: category.topics.map(topic =>
                topic.id === topicId ? { ...topic, companies: [...currentCompaniesListInModal] } : topic
              ),
            }
          : category
      )
    );
    toast({ title: "Companies Updated", description: `Company list for "${topicName}" saved.`, duration: 3000 });
    setIsCompanyModalOpen(false);
    setSelectedTopicForCompanies(null);
    setCurrentCompaniesListInModal([]);
  };

  const companyViewData: DataGroup[] = useMemo(() => {
    if (activeView !== 'companies') return [];
    const companyMap = new Map<string, Topic[]>();
    categoriesData.forEach(category => {
      category.topics.forEach(topic => {
        if (topic.companies && topic.companies.length > 0) {
          topic.companies.forEach(companyName => {
            if (!companyMap.has(companyName)) {
              companyMap.set(companyName, []);
            }
            const topicWithContext: Topic = {
              ...topic,
              originalCategoryId: category.id,
              originalCategoryName: category.name,
            };
            companyMap.get(companyName)!.push(topicWithContext);
          });
        }
      });
    });
    return Array.from(companyMap.entries()).map(([companyName, topics]) => ({
      id: companyName.toLowerCase().replace(/\s+/g, '-') + '-companygroup',
      name: companyName,
      icon: Building2, // Default icon for company groups
      iconName: 'Building2', // Store icon name for consistency
      topics,
    })).sort((a, b) => a.name.localeCompare(b.name));
  }, [categoriesData, activeView]);


  const filteredDataGroups: DataGroup[] = useMemo(() => {
    const sourceData = activeView === 'categories' ? categoriesData : companyViewData;
    if (!searchTerm.trim()) return sourceData as DataGroup[];

    const lowercasedFilter = searchTerm.toLowerCase();
    return sourceData
      .map(group => ({
        ...group,
        topics: group.topics.filter(
          topic => topic.name.toLowerCase().includes(lowercasedFilter) ||
                   (topic.description && topic.description.toLowerCase().includes(lowercasedFilter)) ||
                   (topic.companies && topic.companies.some(company => company.toLowerCase().includes(lowercasedFilter))) ||
                   (activeView === 'companies' && group.name.toLowerCase().includes(lowercasedFilter)) 
        ),
      }))
      .filter(group => group.topics.length > 0);
  }, [categoriesData, companyViewData, searchTerm, activeView]);


  if (isLoadingAuth) {
    return (
      <div className="flex flex-col min-h-screen bg-background items-center justify-center p-4">
        <Workflow className="h-16 w-16 text-primary animate-pulse mb-4" />
        <p className="text-xl text-muted-foreground">Loading AlgoFlow...</p>
      </div>
    );
  }


  if (!currentUser && !isLoadingAuth) {
    // This state indicates we've checked auth, there's no user,
    // and the useEffect for redirection hasn't fired yet or is in progress.
    // Show a loading/redirecting message. The useEffect will handle the actual push.
    return (
      <div className="flex flex-col min-h-screen bg-background items-center justify-center p-4">
        <Workflow className="h-16 w-16 text-primary animate-pulse mb-4" />
        <p className="text-xl text-muted-foreground">Redirecting to login...</p>
      </div>
    );
  }


  return (
    <div className="flex flex-col min-h-screen bg-background">
      <AlgoFlowHeader currentUserEmail={currentUser?.email} isLoadingAuth={isLoadingAuth} />
      <main className="flex-grow container mx-auto">
        {isLoadingData && currentUser ? ( 
            <div className="p-4 md:p-8">
                <Skeleton className="h-24 w-full mb-4 rounded-lg" />
                <Skeleton className="h-12 w-full mb-2 rounded-lg" />
                <Skeleton className="h-12 w-full mb-2 rounded-lg" />
                <Skeleton className="h-12 w-full rounded-lg" />
            </div>
        ) : (
          <>
            <StatsDisplay overallProgress={overallProgress} streak={streak} />
            <div className="px-4 md:px-8 mb-4 flex flex-col sm:flex-row justify-between items-center gap-4">
                <div className="flex-grow w-full sm:w-auto">
                    <Tabs value={activeView} onValueChange={(value) => setActiveView(value as 'categories' | 'companies')} className="w-full max-w-xs sm:max-w-none">
                        <TabsList className="grid w-full grid-cols-2 sm:w-auto">
                            <TabsTrigger value="categories">Categories</TabsTrigger>
                            <TabsTrigger value="companies">Companies</TabsTrigger>
                        </TabsList>
                    </Tabs>
                </div>
                <div className="relative w-full sm:w-auto sm:max-w-xs">
                    <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                    type="search"
                    placeholder="Search topics or companies..."
                    className="pl-8 w-full"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            <div className="px-4 md:px-8 mb-4 flex flex-col sm:flex-row justify-end items-center gap-2">
              <div className="flex gap-2 mt-2 sm:mt-0 flex-wrap justify-end">
                {activeView === 'categories' && (
                  <Dialog open={isAddCategoryModalOpen} onOpenChange={setIsAddCategoryModalOpen}>
                    <DialogTrigger asChild><Button variant="outline"><FolderPlus className="mr-2 h-4 w-4" /> Add Category</Button></DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                      <DialogHeader><DialogTitle>Add New Category</DialogTitle><DialogDescription>Fill in the details for the new category.</DialogDescription></DialogHeader>
                      <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4"><Label htmlFor="category-name" className="text-right">Name</Label><Input id="category-name" value={newCategoryName} onChange={(e) => setNewCategoryName(e.target.value)} className="col-span-3" placeholder="e.g., Advanced Algorithms"/></div>
                        <div className="grid grid-cols-4 items-center gap-4"><Label htmlFor="category-icon" className="text-right">Icon Name</Label><Input id="category-icon" value={newCategoryIconName} onChange={(e) => setNewCategoryIconName(e.target.value)} className="col-span-3" placeholder="e.g., Folder (Lucide)"/></div>
                        <p className="text-xs text-muted-foreground col-span-4 px-1 text-center">Enter icon name from <a href="https://lucide.dev/icons/" target="_blank" rel="noopener noreferrer" className="underline text-primary">lucide.dev</a>. Defaults to &apos;Folder&apos;.</p>
                      </div>
                      <DialogFooter><DialogClose asChild><Button variant="outline">Cancel</Button></DialogClose><Button type="submit" onClick={handleAddCategory}>Save Category</Button></DialogFooter>
                    </DialogContent>
                  </Dialog>
                )}
                <Dialog open={isAddTopicModalOpen} onOpenChange={setIsAddTopicModalOpen}>
                  <DialogTrigger asChild><Button variant="outline"><PlusCircle className="mr-2 h-4 w-4" /> Add Topic</Button></DialogTrigger>
                  <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader><DialogTitle>Add New Topic</DialogTitle><DialogDescription>Fill in details for the new topic.</DialogDescription></DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="grid grid-cols-4 items-center gap-4"><Label htmlFor="category" className="text-right">Category</Label><Select value={newTopicCategoryId} onValueChange={setNewTopicCategoryId}><SelectTrigger className="col-span-3"><SelectValue placeholder="Select category" /></SelectTrigger><SelectContent>{categoriesData.map((category) => (<SelectItem key={category.id} value={category.id}>{category.name}</SelectItem>))}</SelectContent></Select></div>
                      <div className="grid grid-cols-4 items-center gap-4"><Label htmlFor="topic-name" className="text-right">Name</Label><Input id="topic-name" value={newTopicName} onChange={(e) => setNewTopicName(e.target.value)} className="col-span-3" placeholder="e.g., Depth First Search"/></div>
                      <div className="grid grid-cols-4 items-center gap-4"><Label htmlFor="topic-description" className="text-right">Description</Label><Textarea id="topic-description" value={newTopicDescription} onChange={(e) => setNewTopicDescription(e.target.value)} className="col-span-3" placeholder="Briefly describe topic"/></div>
                      <div className="grid grid-cols-4 items-center gap-4"><Label htmlFor="topic-difficulty" className="text-right">Difficulty</Label><Select value={newTopicDifficulty} onValueChange={(value) => setNewTopicDifficulty(value as TopicDifficulty)}><SelectTrigger className="col-span-3"><SelectValue placeholder="Select difficulty" /></SelectTrigger><SelectContent><SelectItem value="Easy">Easy</SelectItem><SelectItem value="Medium">Medium</SelectItem><SelectItem value="Hard">Hard</SelectItem></SelectContent></Select></div>
                    </div>
                    <DialogFooter><DialogClose asChild><Button variant="outline">Cancel</Button></DialogClose><Button type="submit" onClick={handleAddTopic}>Save Topic</Button></DialogFooter>
                  </DialogContent>
                </Dialog>
                <Button onClick={resetProgress} variant="outline"><RefreshCcw className="mr-2 h-4 w-4" /> Reset Progress</Button>
              </div>
            </div>
            <TopicAccordion
              dataGroups={filteredDataGroups}
              onTopicCompletionChange={handleTopicCompletionChange}
              onTopicRevisionChange={handleTopicRevisionChange}
              onTopicDelete={handleRequestDeleteTopic}
              onGroupDelete={activeView === 'categories' ? handleRequestDeleteCategory : undefined}
              onOpenSolutionModal={handleOpenSolutionModal}
              onOpenNotesModal={handleOpenNotesModal}
              onOpenCompanyModal={handleOpenCompanyModal}
              viewType={activeView}
            />
          </>
        )}
      </main>

      <AlertDialog open={isDeleteTopicAlertOpen} onOpenChange={setIsDeleteTopicAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader><AlertDialogTitle>Are you sure?</AlertDialogTitle><AlertDialogDescription>This will permanently delete: <strong>{topicToDelete?.topicName}</strong>.</AlertDialogDescription></AlertDialogHeader>
          <AlertDialogFooter><AlertDialogCancel onClick={() => setTopicToDelete(null)}>Cancel</AlertDialogCancel><AlertDialogAction onClick={handleConfirmDeleteTopic} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">Delete</AlertDialogAction></AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={isDeleteCategoryAlertOpen} onOpenChange={setIsDeleteCategoryAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader><AlertDialogTitle>Delete Category?</AlertDialogTitle><AlertDialogDescription>This will permanently delete <strong>{categoryToDelete?.name}</strong> and all its topics.</AlertDialogDescription></AlertDialogHeader>
          <AlertDialogFooter><AlertDialogCancel onClick={() => setCategoryToDelete(null)}>Cancel</AlertDialogCancel><AlertDialogAction onClick={handleConfirmDeleteCategory} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">Delete Category</AlertDialogAction></AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Dialog open={isSolutionModalOpen} onOpenChange={setIsSolutionModalOpen}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader><DialogTitle>Solution for: {selectedTopicForSolution?.topicName}</DialogTitle><DialogDescription>Add or edit your code solution.</DialogDescription></DialogHeader>
          <div className="grid gap-4 py-4"><Label htmlFor="solution-code" className="sr-only">Solution Code</Label><Textarea id="solution-code" value={solutionCodeInput} onChange={(e) => setSolutionCodeInput(e.target.value)} className="col-span-4 min-h-[300px] font-mono text-sm" placeholder="Paste your solution code here..."/></div>
          <DialogFooter><DialogClose asChild><Button variant="outline" onClick={() => {setSelectedTopicForSolution(null); setSolutionCodeInput('');}}>Cancel</Button></DialogClose><Button type="submit" onClick={handleSaveSolution}>Save Solution</Button></DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isNotesModalOpen} onOpenChange={setIsNotesModalOpen}>
        <DialogContent className="sm:max-w-xl">
          <DialogHeader><DialogTitle>Notes for: {selectedTopicForNotes?.topicName}</DialogTitle><DialogDescription>Add or edit personal notes.</DialogDescription></DialogHeader>
          <div className="grid gap-4 py-4"><Label htmlFor="notes-input" className="sr-only">Notes</Label><Textarea id="notes-input" value={notesInput} onChange={(e) => setNotesInput(e.target.value)} className="col-span-4 min-h-[200px] text-sm" placeholder="Type your notes here..."/></div>
          <DialogFooter><DialogClose asChild><Button variant="outline" onClick={() => {setSelectedTopicForNotes(null); setNotesInput('');}}>Cancel</Button></DialogClose><Button type="submit" onClick={handleSaveNotes}>Save Notes</Button></DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isCompanyModalOpen} onOpenChange={(isOpen) => {
        setIsCompanyModalOpen(isOpen);
        if (!isOpen) {
          setSelectedTopicForCompanies(null);
          setCurrentCompaniesListInModal([]);
        }
      }}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Manage Companies for: {selectedTopicForCompanies?.topicName}</DialogTitle>
            <DialogDescription>Add or remove companies associated with this topic.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="flex items-center gap-2">
              <Input
                id="company-name"
                placeholder="Enter company name"
                value={companyInput}
                onChange={(e) => setCompanyInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') { handleAddCompanyToModalList(); e.preventDefault(); } }}
              />
              <Button type="button" onClick={handleAddCompanyToModalList}>Add</Button>
            </div>
            {currentCompaniesListInModal.length > 0 && (
              <div className="space-y-2 mt-2 max-h-48 overflow-y-auto pr-2">
                <Label>Associated Companies:</Label>
                {currentCompaniesListInModal.map(company => (
                  <div key={company} className="flex items-center justify-between gap-2 p-2 border rounded-md">
                    <span className="text-sm">{company}</span>
                    <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => handleRemoveCompanyFromModalList(company)}>
                      <XIcon className="h-4 w-4 text-destructive" />
                      <span className="sr-only">Remove {company}</span>
                    </Button>
                  </div>
                ))}
              </div>
            )}
             {currentCompaniesListInModal.length === 0 && (
                <p className="text-sm text-muted-foreground text-center mt-2">No companies added yet.</p>
            )}
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button type="submit" onClick={handleSaveCompaniesForTopic}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>


      <footer className="py-6 text-center text-muted-foreground text-sm">
        <p>&copy; {new Date().getFullYear()} AlgoFlow. Keep learning!</p>
      </footer>
    </div>
  );
}

