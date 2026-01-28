export type SectionType = 'text' | 'input';

export interface PromptSection {
    id: string;
    type?: SectionType;
    label: string;
    value: string;
    placeholder: string;
}

export interface PromptTemplate {
    id: string;
    title: string;
    goal: string;
    description: string;
    sections: PromptSection[];
    isCustom?: boolean;
}

export type Goal = 'General' | 'Learning' | 'Coding' | 'Creative Writing' | 'Business' | 'Academic';
