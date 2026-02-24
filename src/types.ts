export type SectionType = 'text' | 'input' | 'select';

export interface PromptSection {
    id: string;
    type?: SectionType;
    label: string;
    value: string;
    placeholder: string;
    options?: string[];
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
