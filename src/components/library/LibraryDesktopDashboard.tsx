import React, { useState, useEffect } from 'react';
import {
  BookOpen,
  RefreshCw,
  RotateCcw,
  Users,
  Calendar,
  CreditCard,
  Layers,
  BarChart3,
  Bell,
  Settings,
  Search,
  Scan,
  Plus,
  ArrowRight,
  LogOut,
  GraduationCap,
  Sparkles,
  CheckCircle2,
  Clock,
  BookMarked,
  Filter,
  Check,
  X
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { CURRENT_LIBRARY } from '../../data/mockData';
import { api } from '../../lib/api';

export const LibraryDesktopDashboard: React.FC = () => {
  const { logout } = useAuth();
  const [activeSection, setActiveSection] = useState<'dashboard' | 'books' | 'requests' | 'issuereturn'>('dashboard');

  const [books, setBooks] = useState<any[]>([]);
  const [bookQuery, setBookQuery] = useState('');
  const [procurementRequests, setProcurementRequests] = useState<any[]>([]);
  const [recentLoans, setRecentLoans] = useState<any[]>([
    { id: '1', student: 'Abhishek Gupta', book: 'Clean Code: A Handbook of Agile Software Craftsmanship', type: 'Issue', date: '26 Aug 2026', due: '09 Sep 2026', status: 'ISSUED' },
    { id: '2', student: 'Priya Sharma', book: 'Data Structures and Algorithm Analysis in C', type: 'Issue', date: '25 Aug 2026', due: '08 Sep 2026', status: 'ISSUED' },
    { id: '3', student: 'Rohan Deshmukh', book: 'Artificial Intelligence: A Modern Approach', type: 'Return', date: '26 Aug 2026', due: 'Returned on time', status: 'RETURNED' }
  ]);

  // Add Book Modal
  const [showAddBookModal, setShowAddBookModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newAuthor, setNewAuthor] = useState('');
  const [newCategory, setNewCategory] = useState('Computer Science');
  const [newCopies, setNewCopies] = useState(4);
  const [newShelf, setNewShelf] = useState('A-14');
  const [newIsbn, setNewIsbn] = useState('978-0131103627');

  // Scanner Simulation
  const [isScanning, setIsScanning] = useState(false);
  const [scannedMessage, setScannedMessage] = useState<string | null>(null);

  const loadLibraryData = () => {
    api.library.getBooks(bookQuery).then((res) => {
      if (res?.books) setBooks(res.books);
    }).catch(console.warn);

    api.library.getRequests().then((res) => {
      if (res?.requests) setProcurementRequests(res.requests);
    }).catch(console.warn);
  };

  useEffect(() => {
    loadLibraryData();
  }, []);

  const handleStartScanning = () => {
    setIsScanning(true);
    setScannedMessage(null);
    setTimeout(() => {
      setIsScanning(false);
      setScannedMessage('Scanned Barcode: ISBN 978-0132350884 ("Clean Code") — Verified in Shelf A-12.');
    }, 1200);
  };

  const handleAddBook = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newAuthor.trim()) return;

    try {
      await api.library.addBook({
        title: newTitle,
        author: newAuthor,
        category: newCategory,
        available_copies: Number(newCopies),
        total_copies: Number(newCopies),
        shelf_location: newShelf,
        isbn: newIsbn,
        cover_image_url: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400&auto=format&fit=crop&q=80'
      });
      alert(`"${newTitle}" added to Sathaye Central Library catalog!`);
      setShowAddBookModal(false);
      setNewTitle('');
      setNewAuthor('');
      loadLibraryData();
    } catch (err: any) {
      alert(err.message || 'Failed to add book');
    }
  };

  const handleApproveRequest = async (reqId: string, status: string) => {
    try {
      await api.library.updateRequestStatus(reqId, status);
      alert(`Request marked as ${status}!`);
      loadLibraryData();
    } catch (err: any) {
      alert(err.message || 'Failed to update request');
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 flex">
      {/* Left Sidebar matching lib.png */}
      <aside className="w-64 bg-white border-r border-slate-200 flex flex-col justify-between shrink-0">
        <div>
          {/* Brand */}
          <div className="p-5 border-b border-slate-100 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-600 flex items-center justify-center text-white font-bold shadow-md shadow-purple-500/20">
              <BookOpen className="w-6 h-6" />
            </div>
            <div>
              <h2 className="font-bold text-sm text-slate-900 tracking-tight leading-tight">Smart Sathaye Campus</h2>
              <p className="text-[10px] font-semibold text-slate-400 tracking-wider">CENTRAL LIBRARY PORTAL</p>
            </div>
          </div>

          {/* Navigation */}
          <nav className="p-3 space-y-1">
            {[
              { id: 'dashboard', label: 'Library Overview', icon: BookOpen },
              { id: 'books', label: 'Catalog & Book Inventory', icon: Layers },
              { id: 'requests', label: 'Student Requests & Desks', icon: BookMarked },
              { id: 'issuereturn', label: 'Quick Issue & RFID Scan', icon: RotateCcw }
            ].map((item) => {
              const Icon = item.icon;
              const isActive = activeSection === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveSection(item.id as any)}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    isActive
                      ? 'bg-purple-600 text-white shadow-sm shadow-purple-500/30'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom Cicero Quote card */}
        <div className="p-4 border-t border-slate-100">
          <div className="rounded-2xl bg-gradient-to-b from-purple-50/70 to-slate-100 p-3.5 border border-purple-100 mb-3">
            <p className="text-[11px] italic text-slate-700 font-serif leading-snug">
              “A room without books is a body without a soul.”
            </p>
            <p className="text-[10px] font-semibold text-purple-700 mt-1.5">— Marcus Tullius Cicero</p>
          </div>

          <button
            onClick={logout}
            className="w-full flex items-center justify-center gap-2 py-2 px-3 text-xs font-semibold text-rose-600 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {/* Top Header */}
        <header className="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between sticky top-0 z-20">
          <div className="relative w-96">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search books, authors, ISBN, shelf..."
              value={bookQuery}
              onChange={(e) => {
                setBookQuery(e.target.value);
                api.library.getBooks(e.target.value).then((res) => {
                  if (res?.books) setBooks(res.books);
                });
              }}
              className="w-full pl-10 pr-12 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
            />
          </div>

          <div className="flex items-center gap-4">
            <button className="relative p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 px-1 py-0.2 bg-rose-500 text-[9px] font-bold text-white rounded-full">
                {procurementRequests.filter((r) => r.status === 'PENDING').length}
              </span>
            </button>

            <div className="h-6 w-px bg-slate-200" />

            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-slate-800 text-white font-bold flex items-center justify-center text-xs">
                SL
              </div>
              <div className="text-left leading-tight hidden sm:block">
                <p className="text-xs font-bold text-slate-900">{CURRENT_LIBRARY.name}</p>
                <p className="text-[10px] text-slate-500">{CURRENT_LIBRARY.designation}</p>
              </div>
            </div>
          </div>
        </header>

        {/* Library Dashboard Body */}
        <main className="p-6 space-y-6 max-w-[1600px] mx-auto w-full">
          {/* Welcome Banner */}
          <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                Welcome, Sneha! <span className="text-2xl">👋</span>
              </h1>
              <p className="text-xs text-slate-500 mt-0.5">Sathaye Central Library • 12,000+ Volume Automated Repository</p>
            </div>

            <div className="flex items-center gap-6">
              <div className="text-right">
                <p className="text-xs font-bold text-slate-800">Tuesday, 26 August 2026</p>
                <p className="text-[11px] text-slate-500 font-medium">Library Timings: 8:00 AM – 8:00 PM</p>
              </div>

              <div className="max-w-xs bg-purple-50/80 border border-purple-200/80 rounded-xl p-2.5 hidden lg:block">
                <p className="text-[11px] italic text-purple-950 font-serif leading-tight">
                  “The more that you read, the more things you will know...”
                </p>
                <p className="text-[10px] text-purple-700 font-semibold mt-0.5">— Dr. Seuss</p>
              </div>
            </div>
          </div>

          {/* Top 5 Metric Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
                <BookOpen className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-xl font-black text-slate-900">{books.length || 12486}</h3>
                <p className="text-[11px] text-slate-500">Cataloged Books</p>
                <p className="text-[10px] text-emerald-600 font-bold mt-0.5">Live database sync</p>
              </div>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-xl font-black text-slate-900">3,850</h3>
                <p className="text-[11px] text-slate-500">Active Borrowers</p>
                <p className="text-[10px] text-emerald-600 font-bold mt-0.5">Students & Faculty</p>
              </div>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                <RefreshCw className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-xl font-black text-slate-900">186</h3>
                <p className="text-[11px] text-slate-500">Active Loans</p>
                <p className="text-[10px] text-indigo-600 font-bold mt-0.5">14 due today</p>
              </div>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center shrink-0">
                <BookMarked className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-xl font-black text-slate-900">{procurementRequests.filter((r) => r.status === 'PENDING').length}</h3>
                <p className="text-[11px] text-slate-500">Procurement Requests</p>
                <p className="text-[10px] text-rose-600 font-bold mt-0.5">Submitted by students</p>
              </div>
            </div>
          </div>

          {/* VIEW: DASHBOARD OVERVIEW */}
          {activeSection === 'dashboard' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Activity table */}
              <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200/90 shadow-xs p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-slate-900">Recent Circulation Activity</h3>
                  <button
                    onClick={() => setActiveSection('books')}
                    className="text-xs text-purple-600 font-semibold hover:underline cursor-pointer"
                  >
                    View Catalog →
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-slate-100 text-slate-400 font-semibold text-[11px]">
                        <th className="pb-3 pl-2">Student Name</th>
                        <th className="pb-3">Book Title</th>
                        <th className="pb-3">Date</th>
                        <th className="pb-3">Due / Return Date</th>
                        <th className="pb-3 pr-2">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {recentLoans.map((row) => (
                        <tr key={row.id} className="hover:bg-slate-50">
                          <td className="py-3 pl-2 font-bold text-slate-900">{row.student}</td>
                          <td className="py-3 text-slate-700 max-w-xs truncate">{row.book}</td>
                          <td className="py-3 text-slate-500">{row.date}</td>
                          <td className="py-3 text-slate-600">{row.due}</td>
                          <td className="py-3 pr-2">
                            <span
                              className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                                row.status === 'ISSUED'
                                  ? 'bg-blue-100 text-blue-800'
                                  : 'bg-emerald-100 text-emerald-800'
                              }`}
                            >
                              {row.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Quick Actions & Barcode Scan */}
              <div className="space-y-6">
                <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-5 space-y-4">
                  <h3 className="text-sm font-bold text-slate-900">Desk Operations</h3>

                  <button
                    onClick={handleStartScanning}
                    disabled={isScanning}
                    className="w-full py-3 px-4 rounded-xl bg-purple-50 hover:bg-purple-100 border border-purple-200 text-purple-700 font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
                  >
                    <Scan className={`w-4 h-4 ${isScanning ? 'animate-pulse' : ''}`} />
                    <span>{isScanning ? 'Reading RFID / Barcode...' : 'Scan Book Barcode'}</span>
                  </button>

                  {scannedMessage && (
                    <div className="p-3 bg-purple-50/70 border border-purple-200 rounded-xl text-xs text-purple-900 font-medium">
                      ✓ {scannedMessage}
                    </div>
                  )}

                  <button
                    onClick={() => setShowAddBookModal(true)}
                    className="w-full py-2.5 px-4 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-xs transition-all cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add Book to Catalog</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* VIEW: BOOKS CATALOG */}
          {activeSection === 'books' && (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold text-slate-900">Book Inventory & Catalog Search</h2>
                  <p className="text-xs text-slate-500">Manage copies, assign shelf locations, and catalog new acquisitions</p>
                </div>
                <button
                  onClick={() => setShowAddBookModal(true)}
                  className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-xs cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add New Book</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {books.map((b) => (
                  <div key={b.id} className="p-4 rounded-2xl border border-slate-200 bg-white shadow-2xs flex gap-4 items-center">
                    <img
                      src={b.cover_image_url || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400&auto=format&fit=crop&q=80'}
                      alt={b.title}
                      className="w-16 h-22 rounded-lg object-cover shadow-2xs shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-sm text-slate-900 truncate">{b.title}</h4>
                      <p className="text-xs text-slate-500 truncate">{b.author}</p>
                      <p className="text-[11px] text-slate-400 mt-1">Shelf: {b.shelf_location || 'A-12'}</p>
                      <span className="text-xs font-bold text-emerald-600 block mt-1">
                        {b.available_copies} / {b.total_copies || b.available_copies} copies ready
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* VIEW: STUDENT REQUESTS */}
          {activeSection === 'requests' && (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold text-slate-900">Student Procurement Requests & Complaints</h2>
                  <p className="text-xs text-slate-500">Books requested by students or reports of damaged/missing editions</p>
                </div>
                <button
                  onClick={loadLibraryData}
                  className="px-3.5 py-1.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer"
                >
                  Refresh
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-500 font-bold border-b border-slate-200">
                    <tr>
                      <th className="p-3">Type</th>
                      <th className="p-3">Book Title / Topic</th>
                      <th className="p-3">Author</th>
                      <th className="p-3">Student Name</th>
                      <th className="p-3">Notes</th>
                      <th className="p-3">Status</th>
                      <th className="p-3 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {procurementRequests.map((req) => (
                      <tr key={req.id} className="hover:bg-slate-50">
                        <td className="p-3 font-bold uppercase text-[10px] text-purple-700">{req.type}</td>
                        <td className="p-3 font-bold text-slate-900">{req.title}</td>
                        <td className="p-3 text-slate-600">{req.author || 'N/A'}</td>
                        <td className="p-3 font-medium">{req.student_name}</td>
                        <td className="p-3 text-slate-500 max-w-xs truncate">{req.notes || '-'}</td>
                        <td className="p-3">
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                              req.status === 'APPROVED'
                                ? 'bg-emerald-100 text-emerald-800'
                                : req.status === 'REJECTED'
                                ? 'bg-rose-100 text-rose-800'
                                : 'bg-amber-100 text-amber-800'
                            }`}
                          >
                            {req.status}
                          </span>
                        </td>
                        <td className="p-3 text-right space-x-1.5">
                          {req.status === 'PENDING' && (
                            <>
                              <button
                                onClick={() => handleApproveRequest(req.id, 'APPROVED')}
                                className="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 font-bold text-xs cursor-pointer"
                              >
                                Approve
                              </button>
                              <button
                                onClick={() => handleApproveRequest(req.id, 'REJECTED')}
                                className="px-2.5 py-1 rounded-lg bg-rose-50 text-rose-700 hover:bg-rose-100 font-bold text-xs cursor-pointer"
                              >
                                Reject
                              </button>
                            </>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* VIEW: QUICK ISSUE & RFID SCAN */}
          {activeSection === 'issuereturn' && (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-6">
              <h2 className="text-lg font-bold text-slate-900">Circulation Counter & RFID Desk</h2>
              <div className="max-w-xl space-y-4">
                <button
                  onClick={handleStartScanning}
                  className="w-full py-4 rounded-2xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-sm cursor-pointer"
                >
                  <Scan className="w-5 h-5" />
                  <span>Tap Student Smart Card or Scan Book</span>
                </button>

                {scannedMessage && (
                  <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-xs text-emerald-900 font-medium">
                    ✓ {scannedMessage}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Add Book Modal */}
          {showAddBookModal && (
            <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
              <form onSubmit={handleAddBook} className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-slate-200 space-y-4">
                <h3 className="text-lg font-bold text-slate-900">Catalog New Book</h3>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Book Title</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Introduction to Algorithms"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Author</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Thomas H. Cormen"
                    value={newAuthor}
                    onChange={(e) => setNewAuthor(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">Total Copies</label>
                    <input
                      type="number"
                      required
                      value={newCopies}
                      onChange={(e) => setNewCopies(Number(e.target.value))}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">Shelf Location</label>
                    <input
                      type="text"
                      value={newShelf}
                      onChange={(e) => setNewShelf(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowAddBookModal(false)}
                    className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 font-semibold text-xs cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-xs cursor-pointer"
                  >
                    Save to Catalog
                  </button>
                </div>
              </form>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};
