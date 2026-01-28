import { PromptTemplate } from './types';
import { DEFAULT_TEMPLATES } from './data/defaultTemplates';

const STORAGE_KEY = 'prompt_master_templates';

export const storage = {
    async getTemplates(): Promise<PromptTemplate[]> {
        if (typeof chrome !== 'undefined' && chrome.storage) {
            const data = await chrome.storage.local.get(STORAGE_KEY);
            const customTemplates = (data[STORAGE_KEY] as PromptTemplate[]) || [];
            return [...DEFAULT_TEMPLATES, ...customTemplates];
        }

        // Fallback for local development
        const local = localStorage.getItem(STORAGE_KEY);
        const customTemplates = local ? JSON.parse(local) : [];
        return [...DEFAULT_TEMPLATES, ...customTemplates];
    },

    async saveCustomTemplate(template: PromptTemplate): Promise<void> {
        const templates = await this.getCustomTemplates();
        const index = templates.findIndex(t => t.id === template.id);

        if (index >= 0) {
            templates[index] = { ...template, isCustom: true };
        } else {
            templates.push({ ...template, isCustom: true });
        }

        if (typeof chrome !== 'undefined' && chrome.storage) {
            await chrome.storage.local.set({ [STORAGE_KEY]: templates });
        } else {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(templates));
        }
    },

    async getCustomTemplates(): Promise<PromptTemplate[]> {
        if (typeof chrome !== 'undefined' && chrome.storage) {
            const data = await chrome.storage.local.get(STORAGE_KEY);
            return (data[STORAGE_KEY] as PromptTemplate[]) || [];
        }
        const local = localStorage.getItem(STORAGE_KEY);
        return local ? JSON.parse(local) : [];
    },

    async deleteTemplate(id: string): Promise<void> {
        let templates = await this.getCustomTemplates();
        templates = templates.filter(t => t.id !== id);

        if (typeof chrome !== 'undefined' && chrome.storage) {
            await chrome.storage.local.set({ [STORAGE_KEY]: templates });
        } else {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(templates));
        }
    }
};
