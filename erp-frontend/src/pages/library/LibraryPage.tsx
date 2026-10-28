import { useState } from 'react'
import {
  Library,
  BookOpen,
  Search,
  RotateCcw,
  AlertCircle,
  Plus,
  CheckCircle,
  Clock,
  BookMarked,
  X,
  ChevronDown
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

interface Book {
  id: number
  title: string
  author: string
  isbn: string
  category: string
  totalCopies: number
  availableCopies: number
  location: string
  edition: string
}

interface BorrowRecord {
  id: number
  bookTitle: string
  borrowerName: string
  borrowerRoll: string
  issueDate: string
  dueDate: string
  returnDate?: string
  status: 'ISSUED' | 'OVERDUE' | 'RETURNED'
  fineAmount: number
}

const INITIAL_BOOKS: Book[] = [
  {
    id: 1,
    title: 'Introduction to Algorithms (CLRS)',
    author: 'Thomas H. Cormen, Charles E. Leiserson',
    isbn: '978-0262033848',
    category: 'Computer Science',
    totalCopies: 12,
    availableCopies: 7,
    location: 'Shelf CS-04',
    edition: '3rd Edition',
  },
  {
    id: 2,
    title: 'Operating System Concepts',
    author: 'Abraham Silberschatz, Peter B. Galvin',
    isbn: '978-1118063330',
    category: 'Computer Science',
    totalCopies: 10,
    availableCopies: 3,
    location: 'Shelf CS-02',
    edition: '9th Edition',
  },
  {
    id: 3,
    title: 'Linear Algebra and Its Applications',
    author: 'Gilbert Strang',
    isbn: '978-0030105678',
    category: 'Mathematics',
    totalCopies: 8,
    availableCopies: 5,
    location: 'Shelf MA-01',
    edition: '4th Edition',
  },
  {
    id: 4,
    title: 'University Physics with Modern Physics',
    author: 'Hugh D. Young, Roger A. Freedman',
    isbn: '978-0321973610',
    category: 'Physics',
    totalCopies: 6,
    availableCopies: 1,
    location: 'Shelf PH-03',
    edition: '14th Edition',
  },
  {
    id: 5,
    title: 'Clean Code: A Handbook of Agile Software Craftsmanship',
    author: 'Robert C. Martin',
    isbn: '978-0132350884',
    category: 'Computer Science',
    totalCopies: 15,
    availableCopies: 11,
    location: 'Shelf CS-08',
    edition: '1st Edition',
  },
  {
    id: 6,
    title: 'Microeconomics',
    author: 'Paul Krugman, Robin Wells',
    isbn: '978-1319066659',
    category: 'Economics',
    totalCopies: 5,
    availableCopies: 4,
    location: 'Shelf EC-02',
    edition: '5th Edition',
  },
]

const INITIAL_RECORDS: BorrowRecord[] = [
  {
    id: 1,
    bookTitle: 'Operating System Concepts',
    borrowerName: 'Alex Morgan',
    borrowerRoll: 'CS2026-001',
    issueDate: '2026-10-10',
    dueDate: '2026-10-24',
    status: 'OVERDUE',
    fineAmount: 4.5,
  },
  {
    id: 2,
    bookTitle: 'Introduction to Algorithms (CLRS)',
    borrowerName: 'Emily Watson',
    borrowerRoll: 'CS2026-002',
    issueDate: '2026-10-20',
    dueDate: '2026-11-03',
    status: 'ISSUED',
    fineAmount: 0,
  },
  {
    id: 3,
    bookTitle: 'University Physics with Modern Physics',
    borrowerName: 'David Chen',
    borrowerRoll: 'CS2026-014',
    issueDate: '2026-10-14',
    dueDate: '2026-10-28',
    status: 'ISSUED',
    fineAmount: 0,
  },
]

const CATEGORIES = ['ALL', 'Computer Science', 'Mathematics', 'Physics', 'Economics']

export default function LibraryPage() {
  const [books, setBooks] = useState<Book[]>(INITIAL_BOOKS)
  const [records, setRecords] = useState<BorrowRecord[]>(INITIAL_RECORDS)
  const [activeTab, setActiveTab] = useState<'catalog' | 'circulation'>('catalog')
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('ALL')
  const [isAddBookModalOpen, setIsAddBookModalOpen] = useState(false)
  const [isIssueModalOpen, setIsIssueModalOpen] = useState(false)

  // New Book Form
  const [newTitle, setNewTitle] = useState('')
  const [newAuthor, setNewAuthor] = useState('')
  const [newIsbn, setNewIsbn] = useState('')
  const [newCategory, setNewCategory] = useState('Computer Science')
  const [newCopies, setNewCopies] = useState(5)
  const [newLocation, setNewLocation] = useState('Shelf CS-01')

  // Issue Book Form
  const [selectedBookId, setSelectedBookId] = useState(books[0]?.id || 1)
  const [issueStudentName, setIssueStudentName] = useState('')
  const [issueStudentRoll, setIssueStudentRoll] = useState('')

  const handleAddBook = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newTitle || !newAuthor) return

    const newBook: Book = {
      id: Date.now(),
      title: newTitle,
      author: newAuthor,
      isbn: newIsbn || `978-${Math.floor(1000000000 + Math.random() * 9000000000)}`,
      category: newCategory,
      totalCopies: Number(newCopies),
      availableCopies: Number(newCopies),
      location: newLocation,
      edition: 'Latest Edition',
    }
    setBooks([newBook, ...books])
    setIsAddBookModalOpen(false)
    setNewTitle('')
    setNewAuthor('')
    setNewIsbn('')
  }

  const handleIssueBook = (e: React.FormEvent) => {
    e.preventDefault()
    if (!issueStudentName || !issueStudentRoll) return

    const book = books.find((b) => b.id === selectedBookId)
    if (!book || book.availableCopies <= 0) return

    // Decrement available copies
    setBooks((prev) =>
      prev.map((b) => (b.id === selectedBookId ? { ...b, availableCopies: b.availableCopies - 1 } : b))
    )

    // Add circulation record
    const today = new Date().toISOString().split('T')[0]
    const dueDate = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]

    const newRecord: BorrowRecord = {
      id: Date.now(),
      bookTitle: book.title,
      borrowerName: issueStudentName,
      borrowerRoll: issueStudentRoll,
      issueDate: today,
      dueDate: dueDate,
      status: 'ISSUED',
      fineAmount: 0,
    }
    setRecords([newRecord, ...records])
    setIsIssueModalOpen(false)
    setIssueStudentName('')
    setIssueStudentRoll('')
  }

  const handleReturnBook = (recordId: number) => {
    const record = records.find((r) => r.id === recordId)
    if (!record) return

    // Return copy to stock
    setBooks((prev) =>
      prev.map((b) => (b.title === record.bookTitle ? { ...b, availableCopies: b.availableCopies + 1 } : b))
    )

    // Update record
    setRecords((prev) =>
      prev.map((r) =>
        r.id === recordId
          ? {
              ...r,
              status: 'RETURNED',
              returnDate: new Date().toISOString().split('T')[0],
            }
          : r
      )
    )
  }

  const filteredBooks = books.filter((b) => {
    const matchesCat = category === 'ALL' || b.category === category
    const matchesSearch =
      !search ||
      b.title.toLowerCase().includes(search.toLowerCase()) ||
      b.author.toLowerCase().includes(search.toLowerCase()) ||
      b.isbn.includes(search)
    return matchesCat && matchesSearch
  })

  const totalAvailable = books.reduce((sum, b) => sum + b.availableCopies, 0)
  const activeIssued = records.filter((r) => r.status === 'ISSUED' || r.status === 'OVERDUE').length
  const overdueCount = records.filter((r) => r.status === 'OVERDUE').length

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Library & Media Center</h1>
          <p className="text-muted-foreground mt-1">
            Browse collection catalogs, track circulation records, and manage book loans.
          </p>
        </div>
        <div className="flex items-center gap-2.5">
          <Button
            variant="outline"
            onClick={() => setIsIssueModalOpen(true)}
            className="shadow-sm"
          >
            <BookMarked className="mr-1.5 h-4 w-4" />
            Issue Book
          </Button>
          <Button
            onClick={() => setIsAddBookModalOpen(true)}
            className="bg-brand-600 hover:bg-brand-700 shadow-sm"
          >
            <Plus className="mr-1.5 h-4 w-4" />
            Add Title
          </Button>
        </div>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          {
            label: 'Total Catalog Titles',
            value: books.length,
            icon: <BookOpen className="h-4 w-4 text-blue-500" />,
            bg: 'bg-blue-500/10',
          },
          {
            label: 'Available Copies',
            value: totalAvailable,
            icon: <CheckCircle className="h-4 w-4 text-emerald-500" />,
            bg: 'bg-emerald-500/10',
          },
          {
            label: 'Currently Issued',
            value: activeIssued,
            icon: <Library className="h-4 w-4 text-orange-500" />,
            bg: 'bg-orange-500/10',
          },
          {
            label: 'Overdue Returns',
            value: overdueCount,
            icon: <AlertCircle className="h-4 w-4 text-red-500" />,
            bg: 'bg-red-500/10',
          },
        ].map((stat, i) => (
          <div key={i} className="rounded-xl border bg-card p-4 shadow-sm flex items-center gap-3">
            <div className={`p-2 rounded-lg ${stat.bg} shrink-0`}>{stat.icon}</div>
            <div>
              <p className="text-xs text-muted-foreground">{stat.label}</p>
              <p className="text-xl font-bold">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* View Switcher and Filters */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-border pb-4">
        <div className="flex items-center gap-2">
          <Button
            variant={activeTab === 'catalog' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setActiveTab('catalog')}
            className={activeTab === 'catalog' ? 'bg-brand-600' : ''}
          >
            <BookOpen className="mr-1.5 h-3.5 w-3.5" />
            Book Catalog
          </Button>
          <Button
            variant={activeTab === 'circulation' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setActiveTab('circulation')}
            className={activeTab === 'circulation' ? 'bg-brand-600' : ''}
          >
            <RotateCcw className="mr-1.5 h-3.5 w-3.5" />
            Borrowing Records ({activeIssued})
          </Button>
        </div>

        {activeTab === 'catalog' && (
          <div className="flex items-center gap-3">
            <div className="relative">
              <select
                className="appearance-none pl-3 pr-8 py-1.5 text-xs rounded-lg border border-border bg-card shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat === 'ALL' ? 'All Subjects' : cat}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground pointer-events-none" />
            </div>

            <div className="flex items-center space-x-2 bg-card p-1.5 rounded-lg border border-border shadow-sm max-w-xs">
              <Search className="h-3.5 w-3.5 text-muted-foreground ml-1 shrink-0" />
              <Input
                type="text"
                placeholder="Search title, author, ISBN..."
                className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0 bg-transparent text-xs h-7"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>
        )}
      </div>

      {/* Main Tab Content */}
      {activeTab === 'catalog' ? (
        <div className="rounded-xl border border-border bg-card overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-muted/50 text-muted-foreground uppercase text-xs">
                <tr>
                  <th className="px-6 py-4 font-medium">Book Details</th>
                  <th className="px-6 py-4 font-medium">ISBN</th>
                  <th className="px-6 py-4 font-medium">Category</th>
                  <th className="px-6 py-4 font-medium">Location</th>
                  <th className="px-6 py-4 font-medium">Availability</th>
                  <th className="px-6 py-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredBooks.map((book) => {
                  const isAvailable = book.availableCopies > 0
                  const availabilityPct = (book.availableCopies / book.totalCopies) * 100

                  return (
                    <tr key={book.id} className="hover:bg-muted/30 transition-colors">
                      <td className="px-6 py-4">
                        <div className="font-semibold text-foreground">{book.title}</div>
                        <div className="text-xs text-muted-foreground mt-0.5">
                          By {book.author} • {book.edition}
                        </div>
                      </td>
                      <td className="px-6 py-4 font-mono text-xs text-brand-600">{book.isbn}</td>
                      <td className="px-6 py-4">
                        <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-muted">
                          {book.category}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-muted-foreground text-xs font-mono">
                        {book.location}
                      </td>
                      <td className="px-6 py-4">
                        <div className="space-y-1">
                          <div className="flex items-center justify-between text-xs">
                            <span
                              className={`font-semibold ${
                                isAvailable ? 'text-emerald-600' : 'text-rose-600'
                              }`}
                            >
                              {book.availableCopies} available
                            </span>
                            <span className="text-muted-foreground">/ {book.totalCopies}</span>
                          </div>
                          <div className="h-1.5 w-24 bg-muted rounded-full overflow-hidden">
                            <div
                              className={`h-full ${isAvailable ? 'bg-emerald-500' : 'bg-rose-500'}`}
                              style={{ width: `${availabilityPct}%` }}
                            />
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <Button
                          size="sm"
                          variant="outline"
                          disabled={!isAvailable}
                          onClick={() => {
                            setSelectedBookId(book.id)
                            setIsIssueModalOpen(true)
                          }}
                          className="h-8 text-xs border-brand-600 text-brand-600 hover:bg-brand-50"
                        >
                          Issue
                        </Button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* Circulation Table */
        <div className="rounded-xl border border-border bg-card overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-muted/50 text-muted-foreground uppercase text-xs">
                <tr>
                  <th className="px-6 py-4 font-medium">Borrower</th>
                  <th className="px-6 py-4 font-medium">Book Title</th>
                  <th className="px-6 py-4 font-medium">Issue Date</th>
                  <th className="px-6 py-4 font-medium">Due Date</th>
                  <th className="px-6 py-4 font-medium">Status & Fines</th>
                  <th className="px-6 py-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {records.map((record) => (
                  <tr key={record.id} className="hover:bg-muted/30 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-medium text-foreground">{record.borrowerName}</div>
                      <div className="text-xs text-muted-foreground font-mono">{record.borrowerRoll}</div>
                    </td>
                    <td className="px-6 py-4 font-medium text-foreground">{record.bookTitle}</td>
                    <td className="px-6 py-4 text-xs text-muted-foreground">{record.issueDate}</td>
                    <td className="px-6 py-4 text-xs font-medium">{record.dueDate}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        {record.status === 'ISSUED' && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300">
                            <Clock className="mr-1 h-3 w-3" /> Issued
                          </span>
                        )}
                        {record.status === 'OVERDUE' && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300">
                            <AlertCircle className="mr-1 h-3 w-3" /> Overdue ($
                            {record.fineAmount})
                          </span>
                        )}
                        {record.status === 'RETURNED' && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300">
                            <CheckCircle className="mr-1 h-3 w-3" /> Returned
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      {record.status !== 'RETURNED' ? (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleReturnBook(record.id)}
                          className="h-8 text-xs border-emerald-600 text-emerald-600 hover:bg-emerald-50"
                        >
                          Mark Returned
                        </Button>
                      ) : (
                        <span className="text-xs text-muted-foreground">Closed</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add Title Modal */}
      {isAddBookModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-card border border-border rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-muted/30">
              <h2 className="text-lg font-semibold">Add New Library Book</h2>
              <button
                onClick={() => setIsAddBookModalOpen(false)}
                className="text-muted-foreground hover:text-foreground rounded-lg p-1 hover:bg-muted"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleAddBook} className="p-6 space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-medium">Book Title *</label>
                <Input
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Artificial Intelligence: A Modern Approach"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium">Author(s) *</label>
                <Input
                  required
                  value={newAuthor}
                  onChange={(e) => setNewAuthor(e.target.value)}
                  placeholder="Stuart Russell, Peter Norvig"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-medium">Category</label>
                  <select
                    className="w-full px-3 py-2 text-sm rounded-lg border border-border bg-card shadow-sm"
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                  >
                    <option value="Computer Science">Computer Science</option>
                    <option value="Mathematics">Mathematics</option>
                    <option value="Physics">Physics</option>
                    <option value="Economics">Economics</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-medium">Total Copies</label>
                  <Input
                    type="number"
                    min="1"
                    value={newCopies}
                    onChange={(e) => setNewCopies(Number(e.target.value))}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-medium">ISBN Number</label>
                  <Input
                    value={newIsbn}
                    onChange={(e) => setNewIsbn(e.target.value)}
                    placeholder="978-0136042594"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-medium">Shelf / Rack</label>
                  <Input
                    value={newLocation}
                    onChange={(e) => setNewLocation(e.target.value)}
                    placeholder="Shelf CS-05"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-border">
                <Button type="button" variant="outline" onClick={() => setIsAddBookModalOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" className="bg-brand-600 hover:bg-brand-700">
                  Save Book
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Issue Book Modal */}
      {isIssueModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-card border border-border rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-muted/30">
              <h2 className="text-lg font-semibold">Issue Book to Student</h2>
              <button
                onClick={() => setIsIssueModalOpen(false)}
                className="text-muted-foreground hover:text-foreground rounded-lg p-1 hover:bg-muted"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleIssueBook} className="p-6 space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-medium">Select Book *</label>
                <select
                  className="w-full px-3 py-2 text-sm rounded-lg border border-border bg-card shadow-sm"
                  value={selectedBookId}
                  onChange={(e) => setSelectedBookId(Number(e.target.value))}
                >
                  {books.map((b) => (
                    <option key={b.id} value={b.id} disabled={b.availableCopies <= 0}>
                      {b.title} ({b.availableCopies} available)
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium">Borrower Full Name *</label>
                <Input
                  required
                  value={issueStudentName}
                  onChange={(e) => setIssueStudentName(e.target.value)}
                  placeholder="e.g. Alex Morgan"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium">Borrower Roll / Student ID *</label>
                <Input
                  required
                  value={issueStudentRoll}
                  onChange={(e) => setIssueStudentRoll(e.target.value)}
                  placeholder="CS2026-001"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-border">
                <Button type="button" variant="outline" onClick={() => setIsIssueModalOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" className="bg-brand-600 hover:bg-brand-700">
                  Confirm Loan (14 Days)
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
