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

            <header className="px-6 py-5 flex items-center justify-between z-20 relative">
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
                                    className="w-full p-4 rounded-xl bg-gradient-to-r from-indigo-500/10 to-purple-500/10 hover:from-indigo-500/20 hover:to-purple-500/20 border border-indigo-500/20 hover:border-indigo-500/40 text-indigo-300 hover:text-indigo-200 transition-all flex items-center justify-center gap-2 group relative overflow-hidden"
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
                                <div className="flex gap-2 shrink-0 items-start">
                                    <button
                                        onClick={() => setIsDesignMode(!isDesignMode)}
                                        className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all flex items-center gap-2 ${isDesignMode
                                            ? 'bg-indigo-500 text-white border-indigo-500 shadow-lg shadow-indigo-500/25'
                                            : 'bg-slate-800 text-slate-400 border-slate-700 hover:bg-slate-700'
                                            }`}
                                    >
                                        <Settings size={14} className={isDesignMode ? "animate-spin-slow" : ""} />
                                        <span>Editor</span>
                                    </button>
                                </div>
                            </div>

                            <div className="space-y-6">
                                {activeTemplate.sections.map((section, idx) => (
                                    <div key={section.id} className="relative group animate-in slide-in-from-bottom-2 duration-300">

                                        {/* Design Mode Header for Section */}
                                        {isDesignMode && (
                                            <div className="flex items-center justify-between mb-2">
                                                <div className="flex items-center gap-2">
                                                    <span className="text-[10px] bg-slate-800/50 text-slate-500 px-1.5 py-0.5 rounded font-mono border border-white/5">
                                                        {idx + 1}
                                                    </span>
                                                    <input
                                                        value={section.label}
                                                        onChange={(e) => {
                                                            const newSections = [...activeTemplate.sections];
                                                            newSections[idx].label = e.target.value;
                                                            setActiveTemplate({ ...activeTemplate, sections: newSections });
                                                        }}
                                                        className="bg-transparent border-b border-transparent hover:border-slate-700 focus:border-indigo-500 px-0 py-0.5 text-xs font-bold text-slate-300 focus:outline-none focus:text-white transition-all w-32 placeholder-slate-600"
                                                        placeholder="Label..."
                                                    />
                                                </div>

                                                <div className="flex items-center gap-1">
                                                    <div className="flex bg-slate-900/50 rounded-lg p-0.5 border border-white/5 mr-2">
                                                        <button
                                                            onClick={() => {
                                                                const newSections = [...activeTemplate.sections];
                                                                newSections[idx].type = 'text';
                                                                setActiveTemplate({ ...activeTemplate, sections: newSections });
                                                            }}
                                                            className={`p-1 rounded-md transition-all ${section.type === 'text' ? 'bg-indigo-500 text-white shadow-sm' : 'text-slate-500 hover:text-slate-300'}`}
                                                            title="Static Text"
                                                        >
                                                            <AlignLeft size={12} />
                                                        </button>
                                                        <button
                                                            onClick={() => {
                                                                const newSections = [...activeTemplate.sections];
                                                                newSections[idx].type = 'input';
                                                                setActiveTemplate({ ...activeTemplate, sections: newSections });
                                                            }}
                                                            className={`p-1 rounded-md transition-all ${section.type === 'input' ? 'bg-indigo-500 text-white shadow-sm' : 'text-slate-500 hover:text-slate-300'}`}
                                                            title="User Input"
                                                        >
                                                            <Type size={12} />
                                                        </button>
                                                    </div>

                                                    <div className="flex opacity-0 group-hover:opacity-100 transition-opacity gap-1">
                                                        <button onClick={() => moveSection(idx, 'up')} disabled={idx === 0} className="p-1 hover:bg-white/10 rounded text-slate-500 disabled:opacity-30"><MoveUp size={12} /></button>
                                                        <button onClick={() => moveSection(idx, 'down')} disabled={idx === activeTemplate.sections.length - 1} className="p-1 hover:bg-white/10 rounded text-slate-500 disabled:opacity-30"><MoveDown size={12} /></button>
                                                        <button onClick={() => deleteSection(idx)} className="p-1 hover:bg-red-500/20 text-slate-500 hover:text-red-400 rounded transition-colors"><X size={12} /></button>
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        {/* Content Area */}
                                        <div className={`relative transition-all rounded-xl overflow-hidden ${isDesignMode ? 'p-1' : ''}`}>
                                            {!isDesignMode && (
                                                <div className="flex items-center gap-2 mb-2">
                                                    <div className={`w-1 h-4 rounded-full ${section.type === 'text' ? 'bg-indigo-500' : 'bg-purple-500'}`} />
                                                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                                                        {section.label}
                                                    </label>
                                                </div>
                                            )}

                                            {section.type === 'text' ? (
                                                <div className="relative group/input">
                                                    <textarea
                                                        className={`w-full bg-slate-900/40 rounded-xl p-4 text-sm text-slate-200 border border-white/5 focus:outline-none resize-none field-sizing-content leading-relaxed transition-all ${!isDesignMode ? 'read-only:cursor-text hover:bg-slate-900/60' : 'focus:border-indigo-500/50 bg-slate-900/20 border-dashed border-slate-700'}`}
                                                        value={section.value}
                                                        onChange={(e) => {
                                                            const newSections = [...activeTemplate.sections];
                                                            newSections[idx].value = e.target.value;
                                                            setActiveTemplate({ ...activeTemplate, sections: newSections });
                                                        }}
                                                        placeholder="Enter static context for the AI..."
                                                        rows={Math.max(3, section.value.split('\n').length)}
                                                    />
                                                </div>
                                            ) : (
                                                <div className="relative group/input">
                                                    <textarea
                                                        className={`modern-input min-h-[50px] text-sm resize-none ${isDesignMode ? 'border-dashed border-purple-500/30 bg-purple-500/5 focus:border-purple-500/50' : 'bg-slate-800/30 hover:bg-slate-800/50'}`}
                                                        placeholder={isDesignMode ? "Example placeholder text..." : section.placeholder || "Enter value..."}
                                                        value={section.value}
                                                        onChange={(e) => {
                                                            const newSections = [...activeTemplate.sections];
                                                            newSections[idx].value = e.target.value;
                                                            setActiveTemplate({ ...activeTemplate, sections: newSections });
                                                        }}
                                                    />
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
