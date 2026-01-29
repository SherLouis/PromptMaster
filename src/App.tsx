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
        <div className="flex flex-col h-screen bg-[#020617] text-slate-200 overflow-hidden font-sans relative selection:bg-indigo-500/30 selection:text-indigo-200">
            {/* Background Gradients */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
                <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-[100px]" />
                <div className="absolute bottom-[-10%] left-[-10%] w-[400px] h-[400px] bg-blue-600/10 rounded-full blur-[100px]" />
            </div>

            <header className="!pt-8 !pb-3 flex items-center justify-between z-20 relative shrink-0 w-full box-border" style={{ paddingLeft: '32px', paddingRight: '32px' }}>
                <div className="flex items-center gap-4">
                    {view !== 'goals' && (
                        <button
                            onClick={() => setView(view === 'editor' ? 'list' : 'goals')}
                            className="!p-2 hover:bg-slate-800/80 rounded-sm transition-all border border-white/5 group bg-slate-900/50 backdrop-blur-sm"
                        >
                            <ChevronLeft size={22} className="text-slate-400 group-hover:text-white transition-colors" />
                        </button>
                    )}
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-indigo-500 flex items-center justify-center shadow-lg shadow-indigo-500/20">
                            <Sparkles size={18} className="text-white fill-white" />
                        </div>
                        <h1 className="text-lg font-bold tracking-tight text-white">PromptMaster</h1>
                    </div>
                </div>

                {view === 'list' && (
                    <button
                        onClick={handleCreateNew}
                        className="!px-6 !py-2.5 bg-indigo-500/10 text-indigo-400 hover:bg-indigo-500/20 rounded-md transition-all border border-indigo-500/20 flex items-center gap-2 group"
                    >
                        <Plus size={18} className="group-hover:scale-110 transition-transform" />
                        <span className="text-sm font-semibold">New</span>
                    </button>
                )}
            </header>

            <main className="flex-1 overflow-y-auto py-6 custom-scrollbar box-border" style={{ paddingLeft: '32px', paddingRight: '32px' }}>
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
                            <div className="flex-1 flex flex-col justify-center">
                                <div className="space-y-2 mb-8 text-center">
                                    <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-400 tracking-tight">Pick a Goal</h2>
                                    <p className="text-slate-400 text-sm font-medium">What do you want to create today?</p>
                                </div>

                                <div className="grid grid-cols-2 gap-3 mb-6 w-full">
                                    {GOALS.map((goal) => (
                                        <button
                                            key={goal.label}
                                            onClick={() => {
                                                setSelectedGoal(goal.label);
                                                setView('list');
                                            }}
                                            className="group relative flex flex-col items-center justify-center p-4 rounded-2xl bg-slate-800/30 border border-white/5 hover:bg-slate-800/60 hover:border-indigo-500/30 transition-all duration-300 h-28 hover:shadow-lg hover:shadow-indigo-500/10"
                                        >
                                            <div
                                                className="w-10 h-10 rounded-xl mb-3 flex items-center justify-center transition-transform group-hover:scale-110 duration-300 bg-slate-900/50 group-hover:bg-transparent"
                                                style={{ color: goal.color, boxShadow: `0 0 20px -5px ${goal.color}30` }}
                                            >
                                                <goal.icon size={20} strokeWidth={2} />
                                            </div>
                                            <span className="text-sm font-medium text-slate-300 group-hover:text-white transition-colors">{goal.label}</span>
                                        </button>
                                    ))}
                                </div>

                                <button
                                    onClick={handleCreateNew}
                                    className="w-full p-4 rounded-lg bg-gradient-to-r from-indigo-500/10 to-purple-500/10 hover:from-indigo-500/20 hover:to-purple-500/20 border border-indigo-500/20 hover:border-indigo-500/40 text-indigo-300 hover:text-indigo-200 transition-all flex items-center justify-center gap-2 group relative overflow-hidden"
                                >
                                    <div className="absolute inset-0 bg-indigo-500/10 opacity-0 group-hover:opacity-100 transition-opacity blur-xl" />
                                    <PlusCircle size={18} className="group-hover:scale-110 transition-transform" />
                                    <span className="font-semibold text-sm">Create Blank Template</span>
                                </button>
                            </div>
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
                                    className="modern-input !pl-12 !py-4"
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
                            {/* Editor Header */}
                            <div className="flex flex-col gap-4">
                                <div className="flex items-start justify-between gap-4">
                                    <div className="flex-1 min-w-0 pr-2">
                                        {isDesignMode ? (
                                            <input
                                                className="bg-transparent text-2xl font-bold text-white w-full border-none focus:outline-none focus:ring-0 p-0 placeholder-slate-600 focus:placeholder-slate-700 transition-colors leading-tight"
                                                value={activeTemplate.title}
                                                onChange={(e) => setActiveTemplate({ ...activeTemplate, title: e.target.value })}
                                                placeholder="Template Title"
                                            />
                                        ) : (
                                            <h2 className="text-2xl font-bold text-white transition-colors leading-tight break-words">{activeTemplate.title}</h2>
                                        )}
                                    </div>
                                    <div className="flex gap-2 shrink-0 pt-1">
                                        <button
                                            onClick={() => setIsDesignMode(!isDesignMode)}
                                            className={`px-4 py-2 rounded-full text-xs font-bold border transition-all flex items-center gap-2 ${isDesignMode
                                                ? 'bg-indigo-500 text-white border-indigo-500 shadow-lg shadow-indigo-500/25'
                                                : 'bg-slate-800 text-slate-400 border-slate-700 hover:bg-slate-700 hover:text-white'
                                                }`}
                                        >
                                            <Settings size={16} className={isDesignMode ? "animate-spin-slow" : ""} />
                                            <span>Editor</span>
                                        </button>
                                    </div>
                                </div>

                                <div className="min-w-0">
                                    {isDesignMode ? (
                                        <input
                                            className="bg-transparent text-sm text-slate-500 w-full border-none focus:outline-none focus:ring-0 p-0 placeholder-slate-700 font-medium"
                                            value={activeTemplate.description}
                                            onChange={(e) => setActiveTemplate({ ...activeTemplate, description: e.target.value })}
                                            placeholder="Describe what this template does..."
                                        />
                                    ) : (
                                        <p className="text-sm text-slate-400 leading-relaxed font-medium break-words">{activeTemplate.description}</p>
                                    )}
                                </div>
                            </div>

                            <div className="space-y-6">
                                {activeTemplate.sections.map((section, idx) => (
                                    <div key={section.id} className="relative group animate-in slide-in-from-bottom-2 duration-300">

                                        {/* Design Mode Header for Section */}
                                        {isDesignMode && (
                                            <div className="glass-card p-4 mb-3 border-slate-700/50">
                                                <div className="flex items-center justify-between mb-4">
                                                    <div className="flex items-center gap-3 flex-1">
                                                        <span className="text-xs font-mono text-slate-500 bg-slate-900 px-2 py-1 rounded">#{idx + 1}</span>
                                                        <input
                                                            value={section.label}
                                                            onChange={(e) => {
                                                                const newSections = [...activeTemplate.sections];
                                                                newSections[idx].label = e.target.value;
                                                                setActiveTemplate({ ...activeTemplate, sections: newSections });
                                                            }}
                                                            className="bg-transparent border-b border-slate-700 focus:border-indigo-500 px-0 py-1 text-base font-bold text-white focus:outline-none transition-all w-full placeholder-slate-600"
                                                            placeholder="Section Label (e.g. 'Topic')"
                                                        />
                                                    </div>
                                                    <div className="flex items-center gap-1 ml-2">
                                                        <button onClick={() => moveSection(idx, 'up')} disabled={idx === 0} className="p-2 hover:bg-white/10 rounded-lg text-slate-400 disabled:opacity-30"><MoveUp size={16} /></button>
                                                        <button onClick={() => moveSection(idx, 'down')} disabled={idx === activeTemplate.sections.length - 1} className="p-2 hover:bg-white/10 rounded-lg text-slate-400 disabled:opacity-30"><MoveDown size={16} /></button>
                                                        <div className="w-px h-4 bg-white/10 mx-2" />
                                                        <button onClick={() => deleteSection(idx)} className="p-2 hover:bg-red-500/20 text-slate-400 hover:text-red-400 rounded-lg transition-colors"><Trash2 size={16} /></button>
                                                    </div>
                                                </div>

                                                <div className="space-y-3">
                                                    <div className="flex bg-slate-900/80 p-1 rounded-xl border border-white/5 w-fit">
                                                        <button
                                                            onClick={() => {
                                                                const newSections = [...activeTemplate.sections];
                                                                newSections[idx].type = 'text';
                                                                setActiveTemplate({ ...activeTemplate, sections: newSections });
                                                            }}
                                                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${section.type === 'text' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20' : 'text-slate-400 hover:text-slate-200'}`}
                                                        >
                                                            <AlignLeft size={16} />
                                                            Static Text
                                                        </button>
                                                        <button
                                                            onClick={() => {
                                                                const newSections = [...activeTemplate.sections];
                                                                newSections[idx].type = 'input';
                                                                setActiveTemplate({ ...activeTemplate, sections: newSections });
                                                            }}
                                                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${section.type === 'input' ? 'bg-pink-600 text-white shadow-lg shadow-pink-500/20' : 'text-slate-400 hover:text-slate-200'}`}
                                                        >
                                                            <Type size={16} />
                                                            User Input
                                                        </button>
                                                    </div>

                                                    {section.type === 'text' ? (
                                                        <textarea
                                                            className="w-full bg-slate-900/50 rounded-xl p-4 text-sm text-slate-300 border border-white/5 focus:outline-none focus:border-indigo-500/50 min-h-[100px] resize-y"
                                                            value={section.value}
                                                            onChange={(e) => {
                                                                const newSections = [...activeTemplate.sections];
                                                                newSections[idx].value = e.target.value;
                                                                setActiveTemplate({ ...activeTemplate, sections: newSections });
                                                            }}
                                                            placeholder="Write the instructions for the AI here..."
                                                        />
                                                    ) : (
                                                        <div className="relative">
                                                            <input
                                                                className="w-full bg-slate-900/50 rounded-xl px-4 py-3 text-sm text-slate-300 border border-white/5 focus:outline-none focus:border-pink-500/50"
                                                                placeholder="Placeholder text for the user..."
                                                                value={section.placeholder || ''}
                                                                onChange={(e) => {
                                                                    const newSections = [...activeTemplate.sections];
                                                                    newSections[idx].placeholder = e.target.value;
                                                                    setActiveTemplate({ ...activeTemplate, sections: newSections });
                                                                }}
                                                            />
                                                            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-slate-500 font-bold tracking-wider">PLACEHOLDER</div>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        )}

                                        {/* Usage Mode Content Area */}
                                        {!isDesignMode && (
                                            <div className="relative transition-all rounded-xl overflow-hidden mb-6">
                                                <div className="flex items-center gap-3 mb-3">
                                                    <div className={`w-1.5 h-6 rounded-full ${section.type === 'text' ? 'bg-indigo-500' : 'bg-pink-500'}`} />
                                                    <label className="text-sm font-bold text-slate-200 tracking-wide">
                                                        {section.label}
                                                    </label>
                                                    {section.type === 'text' && (
                                                        <span className="text-[10px] uppercase tracking-wider font-bold text-slate-600 bg-slate-900/50 px-2 py-1 rounded border border-white/5">Context</span>
                                                    )}
                                                </div>

                                                {section.type === 'text' ? (
                                                    <div className="relative group/input pl-4 border-l-2 border-slate-800">
                                                        <div className="text-slate-400 text-sm italic leading-relaxed whitespace-pre-wrap font-medium font-mono opacity-80">
                                                            {section.value}
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <div className="relative group/input">
                                                        <textarea
                                                            className="modern-input min-h-[120px] text-base resize-none bg-slate-800/50 hover:bg-slate-800/80 focus:bg-slate-800 border-slate-700/50 focus:border-pink-500/50 transition-all placeholder:text-slate-600"
                                                            placeholder={section.placeholder || "Enter value..."}
                                                            value={section.value}
                                                            onChange={(e) => {
                                                                const newSections = [...activeTemplate.sections];
                                                                newSections[idx].value = e.target.value;
                                                                setActiveTemplate({ ...activeTemplate, sections: newSections });
                                                            }}
                                                        />
                                                        <div className="absolute right-3 bottom-3 pointer-events-none opacity-0 group-hover-within:opacity-100 transition-opacity">
                                                            <PenTool size={14} className="text-pink-500/50" />
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                ))}

                                {isDesignMode && (
                                    <button
                                        onClick={addSection}
                                        className="w-full py-4 border border-dashed border-slate-700 hover:border-indigo-500/50 hover:bg-slate-800/30 rounded-xl text-slate-400 font-semibold transition-all flex items-center justify-center gap-2 group"
                                    >
                                        <div className="w-8 h-8 rounded-full bg-indigo-500/10 flex items-center justify-center group-hover:bg-indigo-500/20 transition-colors">
                                            <Plus size={18} className="text-indigo-400" />
                                        </div>
                                        <span>Add New Section</span>
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
                                            className="btn-premium flex-1 group text-lg py-5"
                                        >
                                            {copied ? <Check size={24} /> : <Copy size={24} className="group-hover:rotate-12 transition-transform" />}
                                            {copied ? 'Copied!' : 'Copy Prompt'}
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
