import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Search,
    Plus,
    ChevronLeft,
    Copy,
    Check,
    Trash2,
    Sparkles,
    BookOpen,
    Code2,
    Briefcase,
    PenTool,
    GraduationCap,
    Command,
    PlusCircle,
    MoreVertical,
    History,
    Layout,
    Settings,
    Eye,
    MoveUp,
    MoveDown,
    X,
    Type,
    AlignLeft
} from 'lucide-react';
import { PromptTemplate, Goal } from './types';
import { storage } from './storage';

const GOALS: { label: Goal; icon: any; color: string }[] = [
    { label: 'General', icon: Sparkles, color: '#f59e0b' },
    { label: 'Learning', icon: GraduationCap, color: '#10b981' },
    { label: 'Coding', icon: Code2, color: '#6366f1' },
    { label: 'Creative Writing', icon: PenTool, color: '#ec4899' },
    { label: 'Business', icon: Briefcase, color: '#3b82f6' },
    { label: 'Academic', icon: BookOpen, color: '#8b5cf6' },
];

export default function App() {
    const [templates, setTemplates] = useState<PromptTemplate[]>([]);
    const [selectedGoal, setSelectedGoal] = useState<Goal | null>(null);
    const [view, setView] = useState<'goals' | 'list' | 'editor'>('goals');
    const [activeTemplate, setActiveTemplate] = useState<PromptTemplate | null>(null);
    const [isDesignMode, setIsDesignMode] = useState(false);
    const [search, setSearch] = useState('');
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        loadTemplates();
    }, []);

    async function loadTemplates() {
        const all = await storage.getTemplates();
        setTemplates(all);
    }

    const filteredTemplates = templates.filter(t => {
        const matchesGoal = !selectedGoal || t.goal === selectedGoal;
        const matchesSearch = t.title.toLowerCase().includes(search.toLowerCase());
        return matchesGoal && matchesSearch;
    });

    const handleSelectTemplate = (template: PromptTemplate) => {
        // Ensure legacy templates have a type
        const updatedSections = template.sections.map(s => ({
            ...s,
            type: s.type || 'text'
        }));
        setActiveTemplate({ ...template, sections: updatedSections });
        setIsDesignMode(false);
        setView('editor');
    };

    const handleCreateNew = () => {
        setActiveTemplate({
            id: Date.now().toString(),
            title: 'Untitled Prompt',
            goal: selectedGoal || 'General',
            description: 'Describe usage...',
            sections: [
                { id: '1', type: 'text', label: 'System Persona', value: 'You are an expert AI assistant.', placeholder: 'System instructions...' },
                { id: '2', type: 'input', label: 'User Topic', value: '', placeholder: 'Enter prompt topic...' }
            ],
            isCustom: true
        });
        setIsDesignMode(true);
        setView('editor');
    };

    const handleCopy = () => {
        if (!activeTemplate) return;
        if (!activeTemplate) return;
        const prompt = activeTemplate.sections
            .map(s => s.value)
            .join('\n\n');

        navigator.clipboard.writeText(prompt);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleSaveCustom = async () => {
        if (!activeTemplate) return;
        await storage.saveCustomTemplate(activeTemplate);
        await loadTemplates();
        if (!activeTemplate) return;
        await storage.saveCustomTemplate(activeTemplate);
        await loadTemplates();
        if (isDesignMode) setIsDesignMode(false);
        else setView('list');
    };

    const addSection = () => {
        if (!activeTemplate) return;
        const newSection = {
            id: Date.now().toString(),
            type: 'input' as const,
            label: 'New Variable',
            value: '',
            placeholder: '...'
        };
        setActiveTemplate({
            ...activeTemplate,
            sections: [...activeTemplate.sections, newSection]
        });
    };

    const deleteSection = (idx: number) => {
        if (!activeTemplate) return;
        const newSections = [...activeTemplate.sections];
        newSections.splice(idx, 1);
        setActiveTemplate({ ...activeTemplate, sections: newSections });
    };

    const moveSection = (idx: number, direction: 'up' | 'down') => {
        if (!activeTemplate) return;
        const newSections = [...activeTemplate.sections];
        if (direction === 'up' && idx > 0) {
            [newSections[idx], newSections[idx - 1]] = [newSections[idx - 1], newSections[idx]];
        } else if (direction === 'down' && idx < newSections.length - 1) {
            [newSections[idx], newSections[idx + 1]] = [newSections[idx + 1], newSections[idx]];
        }
        setActiveTemplate({ ...activeTemplate, sections: newSections });
    };

    const handleDeleteTemplate = async (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        await storage.deleteTemplate(id);
        await loadTemplates();
    };

    const pageVariants = {
        initial: { opacity: 0, scale: 0.98, y: 10 },
        animate: { opacity: 1, scale: 1, y: 0 },
        exit: { opacity: 0, scale: 0.98, y: -10 }
    };

    return (
        <div className="flex flex-col h-screen bg-[#020617] text-slate-200 overflow-hidden font-sans">
            <header className="px-6 py-4 flex items-center justify-between border-b border-white/5 bg-slate-900/50 backdrop-blur-xl z-20">
                <div className="flex items-center gap-3">
                    {view !== 'goals' && (
                        <button
                            onClick={() => setView(view === 'editor' ? 'list' : 'goals')}
                            className="p-2 hover:bg-white/5 rounded-xl transition-all border border-white/5"
                        >
                            <ChevronLeft size={18} />
                        </button>
                    )}
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-indigo-500 flex items-center justify-center shadow-lg shadow-indigo-500/20">
                            <Sparkles size={18} className="text-white fill-white" />
                        </div>
                        <h1 className="text-lg font-bold tracking-tight text-white">PromptMaster</h1>
                    </div>
                </div>

                {view === 'list' && (
                    <button
                        onClick={handleCreateNew}
                        className="p-2 bg-indigo-500/10 text-indigo-400 hover:bg-indigo-500/20 rounded-xl transition-all border border-indigo-500/20 flex items-center gap-2"
                    >
                        <Plus size={18} />
                        <span className="text-xs font-semibold mr-1">New</span>
                    </button>
                )}
            </header>

            <main className="flex-1 overflow-y-auto px-6 py-4 custom-scrollbar">
                <AnimatePresence mode="wait">
                    {view === 'goals' && (
                        <motion.div
                            key="goals"
                            variants={pageVariants}
                            initial="initial"
                            animate="animate"
                            exit="exit"
                            className="flex flex-col h-full"
                        >
                            <div className="space-y-1 mb-6 flex-shrink-0">
                                <h2 className="text-2xl font-bold text-white tracking-tight">What's your goal?</h2>
                                <p className="text-slate-400 text-sm">Choose a category to get started.</p>
                            </div>

                            <div className="grid grid-cols-3 gap-3 mb-4 w-full">
                                {GOALS.map((goal) => (
                                    <button
                                        key={goal.label}
                                        onClick={() => {
                                            setSelectedGoal(goal.label);
                                            setView('list');
                                        }}
                                        className="group relative flex flex-col items-center justify-center p-3 rounded-2xl bg-slate-800/40 border border-white/5 hover:bg-slate-700/60 hover:border-indigo-500/30 transition-all duration-300 aspect-square"
                                    >
                                        <div
                                            className="w-10 h-10 rounded-xl mb-2 flex items-center justify-center transition-transform group-hover:scale-110 duration-300"
                                            style={{ backgroundColor: `${goal.color}15`, color: goal.color }}
                                        >
                                            <goal.icon size={22} strokeWidth={1.5} />
                                        </div>
                                        <span className="text-xs font-semibold text-slate-100 group-hover:text-white transition-colors tracking-wide">{goal.label}</span>
                                    </button>
                                ))}
                            </div>

                            <button
                                onClick={handleCreateNew}
                                className="w-full p-4 mt-auto rounded-xl bg-slate-800/50 hover:bg-slate-800 border-2 border-dashed border-slate-700 hover:border-indigo-500/50 hover:text-indigo-400 text-slate-400 transition-all flex items-center justify-center gap-2 group flex-shrink-0"
                            >
                                <Plus size={18} className="group-hover:scale-110 transition-transform" />
                                <span className="font-medium text-sm">Create from scratch</span>
                            </button>
                        </motion.div>
                    )}

                    {view === 'list' && (
                        <motion.div
                            key="list"
                            variants={pageVariants}
                            initial="initial"
                            animate="animate"
                            exit="exit"
                            className="space-y-5"
                        >
                            <div className="relative group">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-400 transition-colors" size={18} />
                                <input
                                    type="text"
                                    placeholder={`Search ${selectedGoal}...`}
                                    className="modern-input pl-11"
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                />
                            </div>

                            <div className="space-y-3">
                                {filteredTemplates.map((template) => {
                                    const goalInfo = GOALS.find(g => g.label === template.goal);
                                    const Icon = goalInfo?.icon || Layout;
                                    return (
                                        <div
                                            key={template.id}
                                            onClick={() => handleSelectTemplate(template)}
                                            className="template-card cursor-pointer group"
                                        >
                                            <div className="w-12 h-12 rounded-2xl bg-slate-800/80 flex items-center justify-center shrink-0 border border-white/5 transition-all group-hover:bg-slate-700/80" style={{ color: goalInfo?.color }}>
                                                <Icon size={24} />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex justify-between items-start">
                                                    <h3 className="font-bold text-white group-hover:text-indigo-400 transition-colors truncate pr-2 text-sm">
                                                        {template.title}
                                                    </h3>
                                                </div>
                                                <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5 font-medium leading-relaxed">
                                                    {template.description}
                                                </p>
                                            </div>
                                            {template.isCustom ? (
                                                <button
                                                    onClick={(e) => handleDeleteTemplate(template.id, e)}
                                                    className="p-2 text-slate-600 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-all"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            ) : (
                                                <div className="p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <Layout size={16} className="text-slate-600" />
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </motion.div>
                    )}

                    {view === 'editor' && activeTemplate && (
                        <motion.div
                            key="editor"
                            variants={pageVariants}
                            initial="initial"
                            animate="animate"
                            exit="exit"
                            className="space-y-6 pb-24"
                        >
                            {/* Editor Header */}
                            <div className="flex items-center justify-between gap-4">
                                <div className="flex-1 min-w-0">
                                    {isDesignMode ? (
                                        <input
                                            className="bg-transparent text-xl font-bold text-white w-full border-none focus:outline-none focus:ring-0 p-0 placeholder-slate-600"
                                            value={activeTemplate.title}
                                            onChange={(e) => setActiveTemplate({ ...activeTemplate, title: e.target.value })}
                                            placeholder="Template Title"
                                        />
                                    ) : (
                                        <h2 className="text-xl font-bold text-white truncate">{activeTemplate.title}</h2>
                                    )}
                                    {isDesignMode ? (
                                        <input
                                            className="bg-transparent text-xs text-slate-500 w-full border-none focus:outline-none focus:ring-0 p-0 mt-1"
                                            value={activeTemplate.description}
                                            onChange={(e) => setActiveTemplate({ ...activeTemplate, description: e.target.value })}
                                            placeholder="Description"
                                        />
                                    ) : (
                                        <p className="text-xs text-slate-500 truncate">{activeTemplate.description}</p>
                                    )}
                                </div>
                                <div className="flex gap-2 shrink-0">
                                    <button
                                        onClick={() => setIsDesignMode(!isDesignMode)}
                                        className={`p-2 rounded-lg border transition-all ${isDesignMode ? 'bg-indigo-500/20 border-indigo-500 text-indigo-400' : 'bg-slate-800 border-slate-700 text-slate-400'}`}
                                        title={isDesignMode ? "Preview Mode" : "Design Mode"}
                                    >
                                        {isDesignMode ? <Eye size={18} /> : <Settings size={18} />}
                                    </button>
                                </div>
                            </div>

                            <div className="space-y-4">
                                {activeTemplate.sections.map((section, idx) => (
                                    <div key={section.id} className={`group relative transition-all ${isDesignMode ? 'p-4 rounded-xl border border-dashed border-slate-700 bg-slate-900/50 hover:border-slate-600' : ''}`}>

                                        {/* Design Mode Controls */}
                                        {isDesignMode && (
                                            <div className="flex items-center justify-between mb-3 pb-3 border-b border-white/5">
                                                <div className="flex items-center gap-2">
                                                    <span className="text-[10px] bg-slate-800 text-slate-400 px-1.5 py-0.5 rounded font-mono">#{idx + 1}</span>
                                                    <div className="flex bg-slate-950/50 p-1 rounded-lg border border-white/5">
                                                        <button
                                                            onClick={() => {
                                                                const newSections = [...activeTemplate.sections];
                                                                newSections[idx].type = 'text';
                                                                setActiveTemplate({ ...activeTemplate, sections: newSections });
                                                            }}
                                                            className={`p-1.5 rounded-md transition-all flex items-center gap-1.5 ${section.type === 'text' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20' : 'text-slate-500 hover:text-slate-300 hover:bg-white/5'}`}
                                                            title="Static Text (Instructions for AI)"
                                                        >
                                                            <AlignLeft size={14} />
                                                            <span className="text-[10px] font-semibold pr-1">Static</span>
                                                        </button>
                                                        <button
                                                            onClick={() => {
                                                                const newSections = [...activeTemplate.sections];
                                                                newSections[idx].type = 'input';
                                                                setActiveTemplate({ ...activeTemplate, sections: newSections });
                                                            }}
                                                            className={`p-1.5 rounded-md transition-all flex items-center gap-1.5 ${section.type === 'input' ? 'bg-pink-600 text-white shadow-lg shadow-pink-500/20' : 'text-slate-500 hover:text-slate-300 hover:bg-white/5'}`}
                                                            title="User Input (Variable)"
                                                        >
                                                            <Type size={14} />
                                                            <span className="text-[10px] font-semibold pr-1">Input</span>
                                                        </button>
                                                    </div>
                                                    <input
                                                        value={section.label}
                                                        onChange={(e) => {
                                                            const newSections = [...activeTemplate.sections];
                                                            newSections[idx].label = e.target.value;
                                                            setActiveTemplate({ ...activeTemplate, sections: newSections });
                                                        }}
                                                        className="bg-transparent border-none text-xs font-semibold text-slate-300 focus:outline-none focus:text-white transition-colors"
                                                        placeholder="Label..."
                                                    />
                                                </div>
                                                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <button onClick={() => moveSection(idx, 'up')} disabled={idx === 0} className="p-1.5 hover:bg-white/5 rounded text-slate-500 disabled:opacity-30"><MoveUp size={14} /></button>
                                                    <button onClick={() => moveSection(idx, 'down')} disabled={idx === activeTemplate.sections.length - 1} className="p-1.5 hover:bg-white/5 rounded text-slate-500 disabled:opacity-30"><MoveDown size={14} /></button>
                                                    <div className="w-px h-3 bg-white/10 mx-1" />
                                                    <button onClick={() => deleteSection(idx)} className="p-1.5 hover:bg-red-500/20 text-slate-500 hover:text-red-400 rounded transition-colors"><X size={14} /></button>
                                                </div>
                                            </div>
                                        )}

                                        {/* Use Mode / Content Editor */}
                                        <div className="space-y-3">
                                            {!isDesignMode && (
                                                <div className="flex items-center gap-2 mb-2">
                                                    <div className={`w-1.5 h-1.5 rounded-full ${section.type === 'text' ? 'bg-indigo-400' : 'bg-pink-400'}`} />
                                                    <label className="text-sm font-semibold text-slate-200 tracking-tight">
                                                        {section.label}
                                                    </label>
                                                </div>
                                            )}

                                            {/* Logic for rendering based on Type and Mode */}
                                            {section.type === 'text' ? (
                                                <div className="relative group/input">
                                                    <textarea
                                                        className={`w-full bg-slate-950/30 rounded-2xl p-4 text-sm text-slate-300 border border-white/5 focus:outline-none resize-none field-sizing-content leading-relaxed code-font transition-all ${!isDesignMode ? 'read-only:cursor-text hover:bg-slate-950/50 hover:border-white/10' : 'focus:border-indigo-500/50'}`}
                                                        value={section.value}
                                                        onChange={(e) => {
                                                            const newSections = [...activeTemplate.sections];
                                                            newSections[idx].value = e.target.value;
                                                            setActiveTemplate({ ...activeTemplate, sections: newSections });
                                                        }}
                                                        placeholder="Enter instructions for the AI..."
                                                        rows={Math.max(3, section.value.split('\n').length)}
                                                    />
                                                    {!isDesignMode && <div className="absolute right-3 top-3 pointer-events-none opacity-50"><Sparkles size={14} className="text-indigo-400" /></div>}
                                                </div>
                                            ) : (
                                                <div className="relative group/input">
                                                    <textarea
                                                        className={`modern-input min-h-[50px] text-sm resize-none ${isDesignMode ? 'border-dashed border-pink-500/30 bg-pink-500/5' : 'bg-slate-800/50 hover:bg-slate-800/80 focus:bg-slate-800'}`}
                                                        placeholder={isDesignMode ? "Example value (optional)..." : section.placeholder || "Type here..."}
                                                        value={section.value}
                                                        onChange={(e) => {
                                                            const newSections = [...activeTemplate.sections];
                                                            newSections[idx].value = e.target.value;
                                                            setActiveTemplate({ ...activeTemplate, sections: newSections });
                                                        }}
                                                    />
                                                    {isDesignMode && <div className="absolute right-3 bottom-3 text-[10px] text-pink-400/70 font-bold tracking-wider">VARIABLE</div>}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}

                                {isDesignMode && (
                                    <button
                                        onClick={addSection}
                                        className="w-full py-3 border border-dashed border-slate-700 rounded-xl text-slate-500 text-xs font-semibold hover:border-indigo-500/50 hover:text-indigo-400 hover:bg-slate-800/50 transition-all flex items-center justify-center gap-2"
                                    >
                                        <PlusCircle size={14} />
                                        Add Section
                                    </button>
                                )}
                            </div>

                            <div className="fixed bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-[#020617] via-[#020617] to-transparent z-30 flex gap-3">
                                {isDesignMode ? (
                                    <button
                                        onClick={handleSaveCustom}
                                        className="btn-premium flex-1"
                                    >
                                        <Check size={18} />
                                        Save Template
                                    </button>
                                ) : (
                                    <>
                                        <button
                                            onClick={handleCopy}
                                            className="btn-premium flex-1 group"
                                        >
                                            {copied ? <Check size={18} /> : <Copy size={18} className="group-hover:rotate-12 transition-transform" />}
                                            {copied ? 'Copied!' : 'Copy Prompt'}
                                        </button>
                                        <button
                                            onClick={handleSaveCustom}
                                            className="btn-ghost"
                                            title="Save current values as new default"
                                        >
                                            <History size={18} />
                                        </button>
                                    </>
                                )}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </main>
        </div>
    );
}
