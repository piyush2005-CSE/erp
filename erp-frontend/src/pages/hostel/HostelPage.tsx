import { useState } from 'react'
import {
  Home,
  Users,
  BedDouble,
  Search,
  CheckCircle,
  Sparkles,
  Wind,
  Bath,
  DoorOpen,
  X,
  ChevronDown
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

interface HostelRoom {
  id: number
  hostelName: string
  roomNumber: string
  floor: number
  roomType: 'SINGLE' | 'DOUBLE' | 'TRIPLE' | 'DORM'
  capacity: number
  occupied: number
  monthlyRent: number
  hasAc: boolean
  hasAttachedBath: boolean
  residents: string[]
}

const INITIAL_ROOMS: HostelRoom[] = [
  {
    id: 1,
    hostelName: 'Boys Hostel Block A',
    roomNumber: 'A-101',
    floor: 1,
    roomType: 'DOUBLE',
    capacity: 2,
    occupied: 2,
    monthlyRent: 450,
    hasAc: true,
    hasAttachedBath: true,
    residents: ['Alex Morgan (CS2026-001)', 'Rahul Sharma (CS2026-008)'],
  },
  {
    id: 2,
    hostelName: 'Boys Hostel Block A',
    roomNumber: 'A-102',
    floor: 1,
    roomType: 'DOUBLE',
    capacity: 2,
    occupied: 1,
    monthlyRent: 450,
    hasAc: true,
    hasAttachedBath: true,
    residents: ['David Chen (CS2026-014)'],
  },
  {
    id: 3,
    hostelName: 'Boys Hostel Block A',
    roomNumber: 'A-201',
    floor: 2,
    roomType: 'SINGLE',
    capacity: 1,
    occupied: 1,
    monthlyRent: 650,
    hasAc: true,
    hasAttachedBath: true,
    residents: ['Michael Torres (CS2026-003)'],
  },
  {
    id: 4,
    hostelName: 'Girls Hostel Block B',
    roomNumber: 'B-101',
    floor: 1,
    roomType: 'DOUBLE',
    capacity: 2,
    occupied: 2,
    monthlyRent: 450,
    hasAc: true,
    hasAttachedBath: true,
    residents: ['Emily Watson (CS2026-002)', 'Priya Patel (CS2026-019)'],
  },
  {
    id: 5,
    hostelName: 'Girls Hostel Block B',
    roomNumber: 'B-102',
    floor: 1,
    roomType: 'TRIPLE',
    capacity: 3,
    occupied: 2,
    monthlyRent: 350,
    hasAc: false,
    hasAttachedBath: true,
    residents: ['Sophia Taylor (CS2026-022)', 'Amina Khan (CS2026-031)'],
  },
  {
    id: 6,
    hostelName: 'Girls Hostel Block B',
    roomNumber: 'B-201',
    floor: 2,
    roomType: 'SINGLE',
    capacity: 1,
    occupied: 0,
    monthlyRent: 650,
    hasAc: true,
    hasAttachedBath: true,
    residents: [],
  },
]

export default function HostelPage() {
  const [rooms, setRooms] = useState<HostelRoom[]>(INITIAL_ROOMS)
  const [activeTab, setActiveTab] = useState<'rooms' | 'allocations'>('rooms')
  const [selectedHostel, setSelectedHostel] = useState('ALL')
  const [search, setSearch] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)

  // Allocation Form State
  const [newStudentName, setNewStudentName] = useState('')
  const [newStudentRoll, setNewStudentRoll] = useState('')
  const [newRoomId, setNewRoomId] = useState(rooms[1]?.id || 1)

  const handleAllocate = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newStudentName || !newStudentRoll) return

    setRooms((prev) =>
      prev.map((r) => {
        if (r.id === Number(newRoomId) && r.occupied < r.capacity) {
          return {
            ...r,
            occupied: r.occupied + 1,
            residents: [...r.residents, `${newStudentName} (${newStudentRoll})`],
          }
        }
        return r
      })
    )
    setIsModalOpen(false)
    setNewStudentName('')
    setNewStudentRoll('')
  }

  const handleVacate = (roomId: number, residentIndex: number) => {
    setRooms((prev) =>
      prev.map((r) => {
        if (r.id === roomId) {
          const updated = [...r.residents]
          updated.splice(residentIndex, 1)
          return {
            ...r,
            occupied: Math.max(0, r.occupied - 1),
            residents: updated,
          }
        }
        return r
      })
    )
  }

  const filteredRooms = rooms.filter((r) => {
    const matchesHostel = selectedHostel === 'ALL' || r.hostelName === selectedHostel
    const matchesSearch =
      !search ||
      r.roomNumber.toLowerCase().includes(search.toLowerCase()) ||
      r.residents.some((res) => res.toLowerCase().includes(search.toLowerCase()))
    return matchesHostel && matchesSearch
  })

  const totalCapacity = rooms.reduce((sum, r) => sum + r.capacity, 0)
  const totalOccupied = rooms.reduce((sum, r) => sum + r.occupied, 0)
  const totalVacant = totalCapacity - totalOccupied
  const totalRevenue = rooms.reduce((sum, r) => sum + r.occupied * r.monthlyRent, 0)

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Hostel & Housing</h1>
          <p className="text-muted-foreground mt-1">
            Manage residential blocks, room allocations, occupancy, and boarding services.
          </p>
        </div>
        <Button
          onClick={() => setIsModalOpen(true)}
          className="bg-brand-600 hover:bg-brand-700 shadow-sm"
        >
          <BedDouble className="mr-2 h-4 w-4" />
          Allocate Bed
        </Button>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          {
            label: 'Total Rooms',
            value: rooms.length,
            icon: <Home className="h-4 w-4 text-blue-500" />,
            bg: 'bg-blue-500/10',
          },
          {
            label: 'Resident Students',
            value: totalOccupied,
            icon: <Users className="h-4 w-4 text-emerald-500" />,
            bg: 'bg-emerald-500/10',
          },
          {
            label: 'Available Vacancies',
            value: `${totalVacant} Beds`,
            icon: <DoorOpen className="h-4 w-4 text-purple-500" />,
            bg: 'bg-purple-500/10',
          },
          {
            label: 'Est. Monthly Dues',
            value: `$${totalRevenue.toLocaleString()}`,
            icon: <Sparkles className="h-4 w-4 text-orange-500" />,
            bg: 'bg-orange-500/10',
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
            variant={activeTab === 'rooms' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setActiveTab('rooms')}
            className={activeTab === 'rooms' ? 'bg-brand-600' : ''}
          >
            <Home className="mr-1.5 h-3.5 w-3.5" />
            Rooms & Occupancy
          </Button>
          <Button
            variant={activeTab === 'allocations' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setActiveTab('allocations')}
            className={activeTab === 'allocations' ? 'bg-brand-600' : ''}
          >
            <Users className="mr-1.5 h-3.5 w-3.5" />
            Resident Roster
          </Button>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <select
              className="appearance-none pl-3 pr-8 py-1.5 text-xs rounded-lg border border-border bg-card shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
              value={selectedHostel}
              onChange={(e) => setSelectedHostel(e.target.value)}
            >
              <option value="ALL">All Residential Blocks</option>
              <option value="Boys Hostel Block A">Boys Hostel Block A</option>
              <option value="Girls Hostel Block B">Girls Hostel Block B</option>
            </select>
            <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground pointer-events-none" />
          </div>

          <div className="flex items-center space-x-2 bg-card p-1.5 rounded-lg border border-border shadow-sm max-w-xs">
            <Search className="h-3.5 w-3.5 text-muted-foreground ml-1 shrink-0" />
            <Input
              type="text"
              placeholder="Search room # or student..."
              className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0 bg-transparent text-xs h-7"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Main Content */}
      {activeTab === 'rooms' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredRooms.map((room) => {
            const isFull = room.occupied >= room.capacity
            const occupancyPct = (room.occupied / room.capacity) * 100

            return (
              <div
                key={room.id}
                className="rounded-2xl border border-border bg-card p-5 shadow-sm hover:shadow-md transition-all space-y-4"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-lg text-foreground">{room.roomNumber}</h3>
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-brand-100 text-brand-700 dark:bg-brand-950 dark:text-brand-300">
                        Floor {room.floor}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5">{room.hostelName}</p>
                  </div>

                  <span
                    className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                      isFull
                        ? 'bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300'
                        : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                    }`}
                  >
                    {isFull ? 'Occupied' : `${room.capacity - room.occupied} Vacant`}
                  </span>
                </div>

                {/* Progress bar */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>Bed Occupancy</span>
                    <span className="font-medium text-foreground">
                      {room.occupied} / {room.capacity} beds
                    </span>
                  </div>
                  <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all duration-300 ${
                        isFull ? 'bg-rose-500' : 'bg-brand-600'
                      }`}
                      style={{ width: `${occupancyPct}%` }}
                    />
                  </div>
                </div>

                {/* Room Amenities */}
                <div className="flex items-center gap-3 text-xs text-muted-foreground pt-1 border-t border-border/60">
                  <span className="flex items-center gap-1 font-medium text-foreground">
                    ${room.monthlyRent}/mo
                  </span>
                  <span>•</span>
                  {room.hasAc && (
                    <span className="flex items-center gap-1 text-blue-600">
                      <Wind className="h-3.5 w-3.5" /> AC
                    </span>
                  )}
                  {room.hasAttachedBath && (
                    <span className="flex items-center gap-1 text-indigo-600">
                      <Bath className="h-3.5 w-3.5" /> Bath
                    </span>
                  )}
                  <span className="capitalize px-1.5 py-0.5 rounded bg-muted text-[10px]">
                    {room.roomType.toLowerCase()}
                  </span>
                </div>

                {/* Current Residents */}
                <div className="space-y-2 pt-1">
                  <p className="text-xs font-semibold text-muted-foreground">Current Residents</p>
                  {room.residents.length === 0 ? (
                    <p className="text-xs text-muted-foreground italic">No students allocated yet.</p>
                  ) : (
                    <div className="space-y-1.5">
                      {room.residents.map((res, idx) => (
                        <div
                          key={idx}
                          className="flex items-center justify-between p-2 rounded-lg bg-muted/30 text-xs"
                        >
                          <span className="font-medium truncate max-w-[200px]">{res}</span>
                          <button
                            onClick={() => handleVacate(room.id, idx)}
                            className="text-muted-foreground hover:text-destructive text-[11px] underline"
                          >
                            Vacate
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      ) : (
        /* Resident Roster Table */
        <div className="rounded-xl border border-border bg-card overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-muted/50 text-muted-foreground uppercase text-xs">
                <tr>
                  <th className="px-6 py-4 font-medium">Resident Info</th>
                  <th className="px-6 py-4 font-medium">Hostel Block</th>
                  <th className="px-6 py-4 font-medium">Room #</th>
                  <th className="px-6 py-4 font-medium">Monthly Dues</th>
                  <th className="px-6 py-4 font-medium">Status</th>
                  <th className="px-6 py-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {rooms.flatMap((room) =>
                  room.residents.map((res, idx) => (
                    <tr key={`${room.id}-${idx}`} className="hover:bg-muted/30 transition-colors">
                      <td className="px-6 py-4">
                        <div className="font-medium text-foreground">{res}</div>
                        <div className="text-xs text-muted-foreground">Admitted AY 2026-2027</div>
                      </td>
                      <td className="px-6 py-4 text-muted-foreground">{room.hostelName}</td>
                      <td className="px-6 py-4 font-mono text-xs font-medium text-brand-600">
                        {room.roomNumber}
                      </td>
                      <td className="px-6 py-4 font-medium">${room.monthlyRent} / mo</td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300">
                          <CheckCircle className="mr-1 h-3 w-3" /> Active
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleVacate(room.id, idx)}
                          className="h-7 text-xs border-destructive/40 text-destructive hover:bg-destructive/10"
                        >
                          Vacate Bed
                        </Button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Allocate Room Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-card border border-border rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-muted/30">
              <h2 className="text-lg font-semibold">Allocate Hostel Bed</h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-muted-foreground hover:text-foreground rounded-lg p-1 hover:bg-muted"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleAllocate} className="p-6 space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-medium">Student Full Name *</label>
                <Input
                  required
                  value={newStudentName}
                  onChange={(e) => setNewStudentName(e.target.value)}
                  placeholder="e.g. Jason Scott"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium">Student Roll Number *</label>
                <Input
                  required
                  value={newStudentRoll}
                  onChange={(e) => setNewStudentRoll(e.target.value)}
                  placeholder="CS2026-045"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium">Select Available Room *</label>
                <select
                  className="w-full px-3 py-2 text-sm rounded-lg border border-border bg-card shadow-sm"
                  value={newRoomId}
                  onChange={(e) => setNewRoomId(Number(e.target.value))}
                >
                  {rooms
                    .filter((r) => r.occupied < r.capacity)
                    .map((r) => (
                      <option key={r.id} value={r.id}>
                        {r.roomNumber} ({r.hostelName}) — {r.capacity - r.occupied} bed(s) available ($
                        {r.monthlyRent}/mo)
                      </option>
                    ))}
                </select>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-border">
                <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" className="bg-brand-600 hover:bg-brand-700">
                  Confirm Allotment
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
