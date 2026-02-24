import { PromptTemplate } from '../types';

export const DEFAULT_TEMPLATES: PromptTemplate[] = [
    {
        id: 'learn-subject',
        title: 'Master a New Subject',
        goal: 'Learning',
        description: 'Break down complex topics into easy-to-understand explanations.',
        sections: [
            { id: 'instructions', label: 'Instructions', type: 'text', value: 'Act as a world-class tutor. Your goal is to explain the following subject to me in a way that matches my specified level of understanding. Please also adopt the tone requested below and format your response clearly.', placeholder: '' },
            { id: 'subject_label', label: 'Subject Label', type: 'text', value: 'Subject to learn:', placeholder: '' },
            { id: 'subject', label: 'Subject', type: 'input', value: '', placeholder: 'What do you want to learn?' },
            { id: 'level_label', label: 'Level Label', type: 'text', value: 'My current level of understanding:', placeholder: '' },
            { id: 'level', label: 'My Level', type: 'select', value: 'Beginner', placeholder: '', options: ['5-year-old', 'Beginner', 'Intermediate', 'Advanced', 'Undergraduate', 'Postgraduate', 'Expert'] },
            { id: 'tone_label', label: 'Tone Label', type: 'text', value: 'Desired tone:', placeholder: '' },
            { id: 'tone', label: 'Tone', type: 'select', value: 'Encouraging and clear', placeholder: '', options: ['Encouraging and clear', 'Academic and formal', 'Casual and friendly', 'Humorous and engaging', 'Strict and concise'] }
        ]
    },
    {
        id: 'code-refactor',
        title: 'Code Refactoring',
        goal: 'Coding',
        description: 'Improve code quality, readability, and performance.',
        sections: [
            { id: 'instructions', label: 'Instructions', type: 'text', value: 'Review the provided code and refactor it based on the main focus below. Adhere strictly to the stated constraints. Explain the changes you made and provide the refactored code in a markdown block.', placeholder: '' },
            { id: 'focus_label', label: 'Focus Label', type: 'text', value: 'Main Focus of Refactoring:', placeholder: '' },
            { id: 'focus', label: 'Main Focus', type: 'select', value: 'Readability', placeholder: '', options: ['Readability', 'Performance', 'Modernization', 'Security', 'DRY (Don\'t Repeat Yourself)'] },
            { id: 'constraints_label', label: 'Constraints Label', type: 'text', value: 'Constraints to follow:', placeholder: '' },
            { id: 'constraints', label: 'Constraints', type: 'input', value: 'Maintain current functionality', placeholder: 'Any specific rules?' },
            { id: 'code_label', label: 'Code Label', type: 'text', value: 'Code to refactor:', placeholder: '' },
            { id: 'code', label: 'Code to Refactor', type: 'input', value: '', placeholder: 'Paste your code here...' }
        ]
    },
    {
        id: 'email-writer',
        title: 'Professional Email',
        goal: 'Business',
        description: 'Draft polished emails for any professional context.',
        sections: [
            { id: 'instructions', label: 'Instructions', type: 'text', value: 'Draft a professional email based on the context provided below. Ensure the language is appropriate for the recipient and matches the requested tone. Provide a clear subject line and the email body.', placeholder: '' },
            { id: 'recipient_label', label: 'Recipient Label', type: 'text', value: 'Recipient:', placeholder: '' },
            { id: 'recipient', label: 'Recipient', type: 'input', value: '', placeholder: 'Who are you emailing?' },
            { id: 'tone_label', label: 'Tone Label', type: 'text', value: 'Tone:', placeholder: '' },
            { id: 'tone', label: 'Tone', type: 'select', value: 'Professional and polite', placeholder: '', options: ['Professional and polite', 'Assertive and direct', 'Friendly and warm', 'Apologetic and sincere', 'Persuasive and confident'] },
            { id: 'context_label', label: 'Context Label', type: 'text', value: 'Context/Purpose of the email:', placeholder: '' },
            { id: 'context', label: 'Context', type: 'input', value: '', placeholder: 'What is this email about?' }
        ]
    },
    {
        id: 'short-story',
        title: 'Short Story Starter',
        goal: 'Creative Writing',
        description: 'Generate a compelling opening for a short story.',
        sections: [
            { id: 'instructions', label: 'Instructions', type: 'text', value: 'Write the compelling opening (first 2-3 paragraphs) of a short story based on the parameters specified below. Incorporate the genre, setting, and main conflict while establishing the specified tone.', placeholder: '' },
            { id: 'genre_label', label: 'Genre Label', type: 'text', value: 'Genre:', placeholder: '' },
            { id: 'genre', label: 'Genre', type: 'select', value: 'Science Fiction', placeholder: '', options: ['Science Fiction', 'Fantasy', 'Mystery', 'Romance', 'Horror', 'Historical Fiction', 'Thriller'] },
            { id: 'tone_label', label: 'Tone Label', type: 'text', value: 'Tone:', placeholder: '' },
            { id: 'tone', label: 'Tone', type: 'select', value: 'Atmospheric', placeholder: '', options: ['Atmospheric', 'Humorous', 'Dark and gritty', 'Poetic', 'Fast-paced and action-packed'] },
            { id: 'setting_label', label: 'Setting Label', type: 'text', value: 'Setting:', placeholder: '' },
            { id: 'setting', label: 'Setting', type: 'input', value: '', placeholder: 'Where does it take place?' },
            { id: 'conflict_label', label: 'Conflict Label', type: 'text', value: 'Main Conflict:', placeholder: '' },
            { id: 'conflict', label: 'Main Conflict', type: 'input', value: '', placeholder: 'What is the primary struggle?' }
        ]
    },
    {
        id: 'research-assistant',
        title: 'Research Assistant',
        goal: 'Academic',
        description: 'Summarize papers or extract key findings from text.',
        sections: [
            { id: 'instructions', label: 'Instructions', type: 'text', value: 'Act as a research assistant. Analyze the provided source text below and deliver the requested objective. Adjust your analysis depth to the specified level.', placeholder: '' },
            { id: 'objective_label', label: 'Objective Label', type: 'text', value: 'Objective:', placeholder: '' },
            { id: 'objective', label: 'Objective', type: 'select', value: 'Summary', placeholder: '', options: ['Executive Summary', 'Detailed Summary', 'Critique & Limitations', 'Key Findings Extraction', 'Methodology Breakdown'] },
            { id: 'depth_label', label: 'Depth Label', type: 'text', value: 'Depth of analysis:', placeholder: '' },
            { id: 'depth', label: 'Depth', type: 'select', value: 'Undergraduate', placeholder: '', options: ['High School', 'Undergraduate', 'Graduate', 'PhD level', 'Layperson'] },
            { id: 'text_label', label: 'Text Label', type: 'text', value: 'Source Text:', placeholder: '' },
            { id: 'text', label: 'Source Text', type: 'input', value: '', placeholder: 'Paste the text or abstract here...' }
        ]
    },
    {
        id: 'subreddit-finder',
        title: 'Target Audience Subreddits',
        goal: 'Business',
        description: 'Find active subreddits where your target audience discusses their problems.',
        sections: [
            { id: 'instructions', label: 'Instructions', type: 'text', value: 'Find active subreddits where the target audience specified below discusses their problems. Include member count, activity level, and what problems people discuss there. Focus on communities with real conversations, not just meme dumps.', placeholder: '' },
            { id: 'audience_label', label: 'Audience Label', type: 'text', value: 'Target Audience:', placeholder: '' },
            { id: 'audience', label: 'Target Audience', type: 'input', value: '', placeholder: 'e.g. startup founders, software engineers' }
        ]
    },
    {
        id: 'pain-point-researcher',
        title: 'Pain Point Researcher',
        goal: 'Business',
        description: 'Act like an expert market researcher specializing in user pain points.',
        sections: [
            { id: 'instructions', label: 'Instructions', type: 'text', value: 'Act like an expert market researcher specializing in user pain points from social media. Uncover frequent frustrations, complaints, and unmet needs about the specified problem below.\n\nFocus on recent authentic user posts on X (Twitter) and Reddit. Ignore ads.\n\nStep-by-step process:\n1. Search X deeply:\n - Use x_semantic_search for complaint-focused queries (e.g., "frustrations with problem").\n - Use x_keyword_search with negative terms.\n2. Search Reddit deeply:\n - Use web_search site:reddit.com with: "problem".\n - For top 5-8 relevant threads, use browse_page: "Extract OP and top comments. Focus on complaints and quotes."\n\nOnly include well-supported pain points.', placeholder: '' },
            { id: 'problem_label', label: 'Problem Label', type: 'text', value: 'Problem Area:', placeholder: '' },
            { id: 'problem', label: 'Problem', type: 'input', value: '', placeholder: 'e.g. tracking personal expenses' }
        ]
    },
    {
        id: 'general-role',
        title: 'Assume a Role',
        goal: 'General',
        description: 'Assume a role and perform a task.',
        sections: [
            { id: 'instructions', label: 'Instructions', type: 'text', value: 'Act as a ', placeholder: '' },
            { id: 'role', label: 'Role', type: 'input', value: '', placeholder: 'e.g. expert in the field' },
            { id: 'goal', label: 'Goal', type: 'text', value: 'Your goal is to perform the following task: ', placeholder: '' },
            { id: 'task', label: 'Task', type: 'input', value: '', placeholder: 'e.g. provide a comprehensive analysis of the current state of the field' }
        ]
    }
];
