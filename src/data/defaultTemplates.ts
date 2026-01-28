import { PromptTemplate } from '../types';

export const DEFAULT_TEMPLATES: PromptTemplate[] = [
    {
        id: 'learn-subject',
        title: 'Master a New Subject',
        goal: 'Learning',
        description: 'Break down complex topics into easy-to-understand explanations.',
        sections: [
            { id: 'role', label: 'Role', value: 'World-class tutor', placeholder: 'e.g. Expert physicist, Historian...' },
            { id: 'subject', label: 'Subject', value: '', placeholder: 'What do you want to learn?' },
            { id: 'level', label: 'My Level', value: 'Beginner', placeholder: 'e.g. 5-year-old, Undergraduate...' },
            { id: 'tone', label: 'Tone', value: 'Encouraging and clear', placeholder: 'e.g. Academic, Casual...' }
        ]
    },
    {
        id: 'code-refactor',
        title: 'Code Refactoring',
        goal: 'Coding',
        description: 'Improve code quality, readability, and performance.',
        sections: [
            { id: 'code', label: 'Code to Refactor', value: '', placeholder: 'Paste your code here...' },
            { id: 'constraints', label: 'Constraints', value: 'Maintain current functionality', placeholder: 'Any specific rules?' },
            { id: 'focus', label: 'Main Focus', value: 'Readability', placeholder: 'Performance, DRY, etc.' }
        ]
    },
    {
        id: 'email-writer',
        title: 'Professional Email',
        goal: 'Business',
        description: 'Draft polished emails for any professional context.',
        sections: [
            { id: 'context', label: 'Context', value: '', placeholder: 'What is this email about?' },
            { id: 'recipient', label: 'Recipient', value: '', placeholder: 'Who are you emailing?' },
            { id: 'tone', label: 'Tone', value: 'Professional and polite', placeholder: 'e.g. Assertive, Friendly...' }
        ]
    },
    {
        id: 'short-story',
        title: 'Short Story Starter',
        goal: 'Creative Writing',
        description: 'Generate a compelling opening for a short story.',
        sections: [
            { id: 'genre', label: 'Genre', value: 'Science Fiction', placeholder: 'e.g. Noir, Fantasy, Romance...' },
            { id: 'setting', label: 'Setting', value: '', placeholder: 'Where does it take place?' },
            { id: 'conflict', label: 'Main Conflict', value: '', placeholder: 'What is the primary struggle?' },
            { id: 'tone', label: 'Tone', value: 'Atmospheric', placeholder: 'e.g. Humorous, Dark, Poetic...' }
        ]
    },
    {
        id: 'research-assistant',
        title: 'Research Assistant',
        goal: 'Academic',
        description: 'Summarize papers or extract key findings from text.',
        sections: [
            { id: 'text', label: 'Source Text', value: '', placeholder: 'Paste the text or abstract here...' },
            { id: 'objective', label: 'Objective', value: 'Summary', placeholder: 'Summary, Critque, or Key Findings?' },
            { id: 'depth', label: 'Depth', value: 'Undergraduate', placeholder: 'e.g. High school, PhD level...' }
        ]
    }
];
