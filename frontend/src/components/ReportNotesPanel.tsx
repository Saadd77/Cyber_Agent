import React, { useState } from 'react';
import { FileText, Plus, Search, Filter, Edit3, Trash2, Target, Calendar, Tag, Save, X } from 'lucide-react';

interface Note {
  id: string;
  targetUrl: string;
  title: string;
  content: string;
  severity: 'info' | 'low' | 'medium' | 'high' | 'critical';
  category: 'vulnerability' | 'observation' | 'recommendation' | 'exploit' | 'general';
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
  testType: string;
}

export const ReportNotesPanel: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterSeverity, setFilterSeverity] = useState<string>('all');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingNote, setEditingNote] = useState<Note | null>(null);

  const [newNote, setNewNote] = useState({
    targetUrl: '',
    title: '',
    content: '',
    severity: 'info' as const,
    category: 'general' as const,
    tags: [] as string[],
    testType: 'Web Penetration'
  });

  const [tagInput, setTagInput] = useState('');

  const [notes, setNotes] = useState<Note[]>([
    {
      id: '1',
      targetUrl: 'https://example.com',
      title: 'SQL Injection Vulnerability Found',
      content: 'Discovered SQL injection vulnerability in login form. The application does not properly sanitize user input in the username field. Payload: \' OR 1=1-- successfully bypassed authentication.',
      severity: 'high',
      category: 'vulnerability',
      tags: ['sql-injection', 'authentication', 'login'],
      createdAt: new Date('2025-01-15T14:30:00'),
      updatedAt: new Date('2025-01-15T14:30:00'),
      testType: 'Web Penetration'
    },
    {
      id: '2',
      targetUrl: '192.168.1.100',
      title: 'Open SSH Port with Weak Configuration',
      content: 'SSH service running on port 22 with password authentication enabled. Recommend implementing key-based authentication and disabling password auth.',
      severity: 'medium',
      category: 'observation',
      tags: ['ssh', 'configuration', 'hardening'],
      createdAt: new Date('2025-01-15T13:15:00'),
      updatedAt: new Date('2025-01-15T13:15:00'),
      testType: 'Network Penetration'
    },
    {
      id: '3',
      targetUrl: 'https://api.example.com',
      title: 'API Rate Limiting Bypass',
      content: 'Successfully bypassed rate limiting by rotating User-Agent headers and using different IP addresses. API should implement more robust rate limiting mechanisms.',
      severity: 'medium',
      category: 'exploit',
      tags: ['api', 'rate-limiting', 'bypass'],
      createdAt: new Date('2025-01-15T12:00:00'),
      updatedAt: new Date('2025-01-15T12:00:00'),
      testType: 'Web Penetration'
    },
    {
      id: '4',
      targetUrl: 'https://shop.example.com',
      title: 'Implement HTTPS Everywhere',
      content: 'Some pages still accessible via HTTP. Recommend implementing HSTS headers and redirecting all HTTP traffic to HTTPS to prevent man-in-the-middle attacks.',
      severity: 'low',
      category: 'recommendation',
      tags: ['https', 'hsts', 'security-headers'],
      createdAt: new Date('2025-01-14T16:45:00'),
      updatedAt: new Date('2025-01-14T16:45:00'),
      testType: 'Web Penetration'
    }
  ]);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'text-red-400 bg-red-400/10 border-red-400/30';
      case 'high': return 'text-orange-400 bg-orange-400/10 border-orange-400/30';
      case 'medium': return 'text-yellow-400 bg-yellow-400/10 border-yellow-400/30';
      case 'low': return 'text-blue-400 bg-blue-400/10 border-blue-400/30';
      case 'info': return 'text-gray-400 bg-gray-400/10 border-gray-400/30';
      default: return 'text-gray-400 bg-gray-400/10 border-gray-400/30';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'vulnerability': return 'text-red-400 bg-red-400/10';
      case 'exploit': return 'text-purple-400 bg-purple-400/10';
      case 'observation': return 'text-blue-400 bg-blue-400/10';
      case 'recommendation': return 'text-green-400 bg-green-400/10';
      case 'general': return 'text-gray-400 bg-gray-400/10';
      default: return 'text-gray-400 bg-gray-400/10';
    }
  };

  const filteredNotes = notes.filter(note => {
    const matchesSearch = note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         note.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         note.targetUrl.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         note.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesSeverity = filterSeverity === 'all' || note.severity === filterSeverity;
    const matchesCategory = filterCategory === 'all' || note.category === filterCategory;
    
    return matchesSearch && matchesSeverity && matchesCategory;
  });

  const handleCreateNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (newNote.title.trim() && newNote.content.trim()) {
      const note: Note = {
        id: Date.now().toString(),
        ...newNote,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      setNotes(prev => [note, ...prev]);
      setNewNote({
        targetUrl: '',
        title: '',
        content: '',
        severity: 'info',
        category: 'general',
        tags: [],
        testType: 'Web Penetration'
      });
      setTagInput('');
      setShowCreateForm(false);
    }
  };

  const handleUpdateNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingNote && editingNote.title.trim() && editingNote.content.trim()) {
      setNotes(prev => prev.map(note => 
        note.id === editingNote.id 
          ? { ...editingNote, updatedAt: new Date() }
          : note
      ));
      setEditingNote(null);
    }
  };

  const handleDeleteNote = (id: string) => {
    setNotes(prev => prev.filter(note => note.id !== id));
  };

  const addTag = (noteId?: string) => {
    if (tagInput.trim()) {
      if (noteId) {
        // Adding tag to existing note being edited
        if (editingNote && editingNote.id === noteId) {
          setEditingNote(prev => prev ? {
            ...prev,
            tags: [...prev.tags, tagInput.trim()]
          } : null);
        }
      } else {
        // Adding tag to new note
        setNewNote(prev => ({
          ...prev,
          tags: [...prev.tags, tagInput.trim()]
        }));
      }
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove: string, noteId?: string) => {
    if (noteId) {
      if (editingNote && editingNote.id === noteId) {
        setEditingNote(prev => prev ? {
          ...prev,
          tags: prev.tags.filter(tag => tag !== tagToRemove)
        } : null);
      }
    } else {
      setNewNote(prev => ({
        ...prev,
        tags: prev.tags.filter(tag => tag !== tagToRemove)
      }));
    }
  };

  const NoteForm = ({ note, isEditing = false }: { note: any, isEditing?: boolean }) => (
    <form onSubmit={isEditing ? handleUpdateNote : handleCreateNote} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Target URL/IP</label>
          <input
            type="text"
            value={note.targetUrl}
            onChange={(e) => isEditing 
              ? setEditingNote(prev => prev ? { ...prev, targetUrl: e.target.value } : null)
              : setNewNote(prev => ({ ...prev, targetUrl: e.target.value }))
            }
            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-red-400 focus:ring-1 focus:ring-red-400"
            placeholder="https://example.com or 192.168.1.1"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Test Type</label>
          <select
            value={note.testType}
            onChange={(e) => isEditing 
              ? setEditingNote(prev => prev ? { ...prev, testType: e.target.value } : null)
              : setNewNote(prev => ({ ...prev, testType: e.target.value }))
            }
            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-red-400"
          >
            <option value="Web Penetration">Web Penetration</option>
            <option value="Network Penetration">Network Penetration</option>
            <option value="Mobile Testing">Mobile Testing</option>
            <option value="API Testing">API Testing</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">Title</label>
        <input
          type="text"
          value={note.title}
          onChange={(e) => isEditing 
            ? setEditingNote(prev => prev ? { ...prev, title: e.target.value } : null)
            : setNewNote(prev => ({ ...prev, title: e.target.value }))
          }
          className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-red-400 focus:ring-1 focus:ring-red-400"
          placeholder="Brief description of the finding"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">Content</label>
        <textarea
          value={note.content}
          onChange={(e) => isEditing 
            ? setEditingNote(prev => prev ? { ...prev, content: e.target.value } : null)
            : setNewNote(prev => ({ ...prev, content: e.target.value }))
          }
          className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-red-400 focus:ring-1 focus:ring-red-400"
          placeholder="Detailed description, steps to reproduce, impact, recommendations..."
          rows={4}
          required
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Severity</label>
          <select
            value={note.severity}
            onChange={(e) => isEditing 
              ? setEditingNote(prev => prev ? { ...prev, severity: e.target.value as any } : null)
              : setNewNote(prev => ({ ...prev, severity: e.target.value as any }))
            }
            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-red-400"
          >
            <option value="info">Info</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
            <option value="critical">Critical</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Category</label>
          <select
            value={note.category}
            onChange={(e) => isEditing 
              ? setEditingNote(prev => prev ? { ...prev, category: e.target.value as any } : null)
              : setNewNote(prev => ({ ...prev, category: e.target.value as any }))
            }
            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-red-400"
          >
            <option value="general">General</option>
            <option value="vulnerability">Vulnerability</option>
            <option value="exploit">Exploit</option>
            <option value="observation">Observation</option>
            <option value="recommendation">Recommendation</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">Tags</label>
        <div className="flex flex-wrap gap-2 mb-2">
          {note.tags.map((tag: string, index: number) => (
            <span key={index} className="px-2 py-1 bg-red-400/20 text-red-400 rounded-full text-sm flex items-center space-x-1">
              <span>{tag}</span>
              <button
                type="button"
                onClick={() => removeTag(tag, isEditing ? note.id : undefined)}
                className="text-red-400 hover:text-red-300"
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          ))}
        </div>
        <div className="flex space-x-2">
          <input
            type="text"
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag(isEditing ? note.id : undefined))}
            className="flex-1 px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-red-400 focus:ring-1 focus:ring-red-400"
            placeholder="Add tags (press Enter)"
          />
          <button
            type="button"
            onClick={() => addTag(isEditing ? note.id : undefined)}
            className="px-3 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
          >
            <Tag className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="flex space-x-3">
        <button
          type="button"
          onClick={() => isEditing ? setEditingNote(null) : setShowCreateForm(false)}
          className="flex-1 py-2 px-4 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="flex-1 py-2 px-4 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors flex items-center justify-center space-x-2"
        >
          <Save className="h-4 w-4" />
          <span>{isEditing ? 'Update Note' : 'Save Note'}</span>
        </button>
      </div>
    </form>
  );

  return (
    <div className="bg-gray-800 border border-gray-700 rounded-lg p-6 h-full flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <FileText className="h-6 w-6 text-red-400" />
          <h2 className="text-xl font-semibold text-white">Report Notes</h2>
        </div>
        
        <button
          onClick={() => setShowCreateForm(true)}
          className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors flex items-center space-x-2"
        >
          <Plus className="h-5 w-5" />
          <span>Add Note</span>
        </button>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search notes, targets, or tags..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-red-400 focus:ring-1 focus:ring-red-400"
          />
        </div>
        
        <div className="flex gap-2">
          <select
            value={filterSeverity}
            onChange={(e) => setFilterSeverity(e.target.value)}
            className="px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-red-400"
          >
            <option value="all">All Severity</option>
            <option value="critical">Critical</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
            <option value="info">Info</option>
          </select>
          
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-red-400"
          >
            <option value="all">All Categories</option>
            <option value="vulnerability">Vulnerability</option>
            <option value="exploit">Exploit</option>
            <option value="observation">Observation</option>
            <option value="recommendation">Recommendation</option>
            <option value="general">General</option>
          </select>
        </div>
      </div>

      {/* Notes List */}
      <div className="flex-1 overflow-y-auto space-y-4">
        {filteredNotes.map((note) => (
          <div key={note.id} className="bg-gray-700 rounded-lg p-4">
            {editingNote?.id === note.id ? (
              <NoteForm note={editingNote} isEditing={true} />
            ) : (
              <>
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <Target className="h-4 w-4 text-gray-400" />
                      <span className="text-sm text-gray-400">{note.targetUrl}</span>
                      <span className="text-sm text-gray-500">•</span>
                      <span className="text-sm text-gray-400">{note.testType}</span>
                    </div>
                    <h3 className="text-lg font-semibold text-white mb-2">{note.title}</h3>
                    <div className="flex items-center space-x-2 mb-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getSeverityColor(note.severity)}`}>
                        {note.severity.toUpperCase()}
                      </span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(note.category)}`}>
                        {note.category}
                      </span>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => setEditingNote(note)}
                      className="p-2 rounded hover:bg-gray-600 transition-colors"
                    >
                      <Edit3 className="h-4 w-4 text-gray-400" />
                    </button>
                    <button
                      onClick={() => handleDeleteNote(note.id)}
                      className="p-2 rounded hover:bg-gray-600 transition-colors"
                    >
                      <Trash2 className="h-4 w-4 text-red-400" />
                    </button>
                  </div>
                </div>

                <p className="text-gray-300 mb-3 whitespace-pre-wrap">{note.content}</p>

                {note.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-3">
                    {note.tags.map((tag, index) => (
                      <span key={index} className="px-2 py-1 bg-red-400/20 text-red-400 rounded-full text-xs">
                        {tag}
                      </span>
                    ))}
                  </div>
                )}

                <div className="flex items-center justify-between text-sm text-gray-500">
                  <div className="flex items-center space-x-1">
                    <Calendar className="h-4 w-4" />
                    <span>Created: {note.createdAt.toLocaleString()}</span>
                  </div>
                  {note.updatedAt.getTime() !== note.createdAt.getTime() && (
                    <span>Updated: {note.updatedAt.toLocaleString()}</span>
                  )}
                </div>
              </>
            )}
          </div>
        ))}
      </div>

      {/* Create Note Modal */}
      {showCreateForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setShowCreateForm(false)}>
          <div className="bg-gray-800 border border-gray-700 rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold text-white">Add New Note</h3>
              <button 
                onClick={() => setShowCreateForm(false)}
                className="text-gray-400 hover:text-white"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            <NoteForm note={newNote} />
          </div>
        </div>
      )}

      {/* Summary Stats */}
      <div className="mt-6 grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="bg-gray-700 rounded-lg p-3 text-center">
          <div className="text-lg font-bold text-white">{notes.length}</div>
          <div className="text-xs text-gray-400">Total Notes</div>
        </div>
        <div className="bg-gray-700 rounded-lg p-3 text-center">
          <div className="text-lg font-bold text-red-400">
            {notes.filter(n => n.severity === 'critical').length}
          </div>
          <div className="text-xs text-gray-400">Critical</div>
        </div>
        <div className="bg-gray-700 rounded-lg p-3 text-center">
          <div className="text-lg font-bold text-orange-400">
            {notes.filter(n => n.severity === 'high').length}
          </div>
          <div className="text-xs text-gray-400">High</div>
        </div>
        <div className="bg-gray-700 rounded-lg p-3 text-center">
          <div className="text-lg font-bold text-purple-400">
            {notes.filter(n => n.category === 'vulnerability').length}
          </div>
          <div className="text-xs text-gray-400">Vulnerabilities</div>
        </div>
        <div className="bg-gray-700 rounded-lg p-3 text-center">
          <div className="text-lg font-bold text-blue-400">
            {new Set(notes.map(n => n.targetUrl)).size}
          </div>
          <div className="text-xs text-gray-400">Targets</div>
        </div>
      </div>
    </div>
  );
};