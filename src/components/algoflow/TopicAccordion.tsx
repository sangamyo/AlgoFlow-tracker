
'use client';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button, buttonVariants } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import type { DataGroup, TopicDifficulty } from '@/app/algoflow/types';
import { CheckCircle2, Circle, FileText as DefaultTopicIcon, Trash2, Bookmark, FileCode, NotebookText, icons as lucideIcons, Building2 } from "lucide-react";
import type { LucideIcon } from 'lucide-react';
import { cn } from "@/lib/utils";

interface TopicAccordionProps {
  dataGroups: DataGroup[];
  onTopicCompletionChange: (groupId: string, topicId: string, completed: boolean) => void;
  onTopicRevisionChange: (groupId: string, topicId: string, marked: boolean) => void;
  onTopicDelete: (groupId: string, topicId: string, topicName: string) => void;
  onGroupDelete?: (groupId: string, groupName: string) => void; // Optional for company view
  onOpenSolutionModal: (groupId: string, topicId: string, topicName: string, currentSolution?: string) => void;
  onOpenNotesModal: (groupId: string, topicId: string, topicName: string, currentNotes?: string) => void;
  onOpenCompanyModal: (groupId: string, topicId: string, topicName: string, currentCompanies: string[]) => void;
  viewType: 'categories' | 'companies';
}

const getIcon = (name: string | undefined, defaultIcon: LucideIcon = DefaultTopicIcon): LucideIcon => {
  if (name && lucideIcons[name as keyof typeof lucideIcons]) {
    return lucideIcons[name as keyof typeof lucideIcons] as LucideIcon;
  }
  return defaultIcon;
};

const getDifficultyBadgeVariant = (difficulty?: TopicDifficulty): "default" | "secondary" | "destructive" | "outline" => {
  switch (difficulty) {
    case 'Easy':
      return 'default';
    case 'Medium':
      return 'secondary';
    case 'Hard':
      return 'destructive';
    default:
      return 'outline';
  }
};
const getDifficultyBadgeClass = (difficulty?: TopicDifficulty): string => {
    switch (difficulty) {
      case 'Easy':
        return 'bg-green-500 hover:bg-green-600 text-white border-transparent';
      case 'Medium':
        return 'bg-yellow-500 hover:bg-yellow-600 text-black border-transparent';
      case 'Hard':
        return 'bg-red-500 hover:bg-red-600 text-white border-transparent';
      default:
        return 'bg-gray-300 text-gray-700 border-transparent';
    }
};


export function TopicAccordion({
  dataGroups,
  onTopicCompletionChange,
  onTopicRevisionChange,
  onTopicDelete,
  onGroupDelete,
  onOpenSolutionModal,
  onOpenNotesModal,
  onOpenCompanyModal,
  viewType,
}: TopicAccordionProps) {
  if (!dataGroups || dataGroups.length === 0) {
    return (
      <div className="p-4 md:p-8 text-center text-muted-foreground">
        <p>No {viewType === 'categories' ? 'categories' : 'companies'} or matching topics found. Try a different search or add new content!</p>
      </div>
    );
  }
  return (
    <div className="p-4 md:p-8">
      <Accordion type="multiple" defaultValue={dataGroups.map(g => g.id)} className="w-full space-y-4">
        {dataGroups.map((group) => {
          const completedInGroup = group.topics.filter(t => t.completed).length;
          const totalInGroup = group.topics.length;
          const GroupIcon = group.icon;

          return (
            <AccordionItem value={group.id} key={group.id} className="bg-card border border-border rounded-lg shadow-lg overflow-hidden">
              <AccordionTrigger className="px-6 py-4 hover:bg-secondary/50 transition-colors">
                <div className="flex items-center gap-3 w-full">
                  {onGroupDelete && viewType === 'categories' && (
                     <span
                        role="button"
                        tabIndex={0}
                        onClick={(e) => {
                          e.stopPropagation(); 
                          onGroupDelete(group.id, group.name);
                        }}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            e.stopPropagation();
                            onGroupDelete(group.id, group.name);
                          }
                        }}
                        aria-label={`Delete ${viewType === 'categories' ? 'category' : 'group'} ${group.name}`}
                        className={cn(
                          buttonVariants({ variant: "destructive", size: "icon" }),
                          "flex-shrink-0 h-7 w-7 p-0 inline-flex items-center justify-center mr-1"
                        )}
                      >
                        <Trash2 className="h-4 w-4" />
                      </span>
                  )}
                  <div className="flex items-center gap-3 flex-grow min-w-0">
                    <GroupIcon className="h-6 w-6 text-primary flex-shrink-0" />
                    <span className="text-xl font-headline font-semibold truncate">{group.name}</span>
                  </div>

                  <Badge variant={totalInGroup > 0 && completedInGroup === totalInGroup ? "default" : "secondary"} className="ml-auto flex-shrink-0">
                    {completedInGroup} / {totalInGroup}
                  </Badge>
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-6 py-4 bg-background/50 border-t border-border">
                {group.topics.length === 0 ? (
                   <p className="text-sm text-muted-foreground text-center py-2">No topics in this {viewType === 'categories' ? 'category' : 'company group'} yet.</p>
                ) : (
                <ul className="space-y-3">
                  {group.topics.map((topic) => {
                    const TopicIcon = getIcon(topic.iconName, DefaultTopicIcon) ;
                    const hasSolution = topic.solutionCode && topic.solutionCode.trim() !== '';
                    const hasNotes = topic.notes && topic.notes.trim() !== '';
                    const hasCompanies = topic.companies && topic.companies.length > 0;
                    
                    // For actions, use the original category ID if in company view, otherwise the group's ID.
                    // topic.originalCategoryId is guaranteed to be present for topics in companyViewData.
                    const actionGroupId = viewType === 'companies' ? topic.originalCategoryId! : group.id;

                    return (
                    <li key={topic.id} className="flex flex-col p-3 rounded-md hover:bg-secondary/30 transition-colors border border-transparent hover:border-primary/20">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3 flex-grow overflow-hidden">
                                {topic.completed ? <CheckCircle2 className="h-5 w-5 text-accent flex-shrink-0" /> : <Circle className="h-5 w-5 text-muted-foreground flex-shrink-0" />}
                                <TopicIcon className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                                <div className="flex-grow min-w-0">
                                <div className="flex items-center gap-2 flex-wrap">
                                    <span className={`text-md font-medium ${topic.completed ? 'line-through text-muted-foreground' : 'text-foreground'}`}>
                                    {topic.name}
                                    </span>
                                    {topic.difficulty && (
                                    <Badge variant={getDifficultyBadgeVariant(topic.difficulty)} className={cn("px-1.5 py-0.5 text-xs whitespace-nowrap", getDifficultyBadgeClass(topic.difficulty))}>
                                        {topic.difficulty}
                                    </Badge>
                                    )}
                                </div>
                                <p className={`text-xs truncate ${topic.completed ? 'text-muted-foreground/70' : 'text-muted-foreground'}`}>{topic.description}</p>
                                {viewType === 'companies' && topic.originalCategoryName && (
                                   <p className="text-xs text-muted-foreground/80 mt-0.5">
                                        From Category: <Badge variant="outline" className="text-xs px-1 py-0">{topic.originalCategoryName}</Badge>
                                    </p>
                                )}
                                </div>
                            </div>
                            <div className="flex items-center gap-0.5 sm:gap-1 ml-1 sm:ml-2 flex-shrink-0">
                                <Checkbox
                                id={`${group.id}-${topic.id}-checkbox`} // Keep group.id for unique checkbox ID even in company view
                                checked={topic.completed}
                                onCheckedChange={(checked) => onTopicCompletionChange(actionGroupId, topic.id, !!checked)}
                                aria-labelledby={`label-${group.id}-${topic.id}-checkbox`}
                                className="h-5 w-5 rounded data-[state=checked]:bg-accent data-[state=checked]:border-accent border-primary/50"
                                />
                                <span id={`label-${group.id}-${topic.id}-checkbox`} className="sr-only">Mark {topic.name} as {topic.completed ? 'incomplete' : 'complete'}</span>
                                <Button
                                variant="ghost"
                                size="icon"
                                className={cn(
                                    "h-8 w-8 text-muted-foreground hover:text-primary",
                                    topic.markedForRevision && "text-primary"
                                )}
                                onClick={() => onTopicRevisionChange(actionGroupId, topic.id, !topic.markedForRevision)}
                                aria-label={`Mark topic ${topic.name} for revision`}
                                >
                                <Bookmark className={cn("h-4 w-4", topic.markedForRevision ? "fill-primary" : "")} />
                                </Button>
                                <Button
                                variant="ghost"
                                size="icon"
                                className={cn(
                                    "h-8 w-8 text-muted-foreground hover:text-primary",
                                    hasNotes && "text-primary"
                                )}
                                onClick={() => onOpenNotesModal(actionGroupId, topic.id, topic.name, topic.notes)}
                                aria-label={`View or edit notes for ${topic.name}`}
                                >
                                <NotebookText className={cn("h-4 w-4", hasNotes ? "fill-primary/20" : "")} />
                                </Button>
                                <Button
                                variant="ghost"
                                size="icon"
                                className={cn(
                                    "h-8 w-8 text-muted-foreground hover:text-primary",
                                    hasSolution && "text-primary"
                                )}
                                onClick={() => onOpenSolutionModal(actionGroupId, topic.id, topic.name, topic.solutionCode)}
                                aria-label={`View or edit solution for ${topic.name}`}
                                >
                                <FileCode className={cn("h-4 w-4", hasSolution ? "fill-primary/20" : "")} />
                                </Button>
                                <Button
                                variant="ghost"
                                size="icon"
                                className={cn(
                                    "h-8 w-8 text-muted-foreground hover:text-primary",
                                    hasCompanies && "text-primary"
                                )}
                                onClick={() => onOpenCompanyModal(actionGroupId, topic.id, topic.name, topic.companies || [])}
                                aria-label={`Manage companies for ${topic.name}`}
                                >
                                <Building2 className={cn("h-4 w-4", hasCompanies ? "fill-primary/20" : "")}/>
                                </Button>
                                <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-muted-foreground hover:text-destructive"
                                onClick={() => onTopicDelete(actionGroupId, topic.id, topic.name)}
                                aria-label={`Delete topic ${topic.name}`}
                                >
                                <Trash2 className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                        {hasCompanies && (
                            <div className="mt-2 pl-8">
                                <p className="text-xs text-muted-foreground">
                                    <span className="font-medium">Companies:</span> {topic.companies?.join(', ')}
                                </p>
                            </div>
                        )}
                    </li>
                  )})}
                </ul>
                )}
              </AccordionContent>
            </AccordionItem>
          );
        })}
      </Accordion>
    </div>
  );
}

