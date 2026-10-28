import { useState } from 'react'
import {
  Bus,
  MapPin,
  Users,
  Plus,
  Clock,
  Phone,
  Navigation,
  X,
  ShieldCheck
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

interface RouteStop {
  name: string
  time: string
}

interface TransportRoute {
  id: number
  routeName: string
  routeNumber: string
  startPoint: string
  endPoint: string
  stops: RouteStop[]
  distanceKm: number
  monthlyFee: number
  vehicleNumber: string
  driverName: string
  driverPhone: string
  capacity: number
  subscribedCount: number
}

interface Vehicle {
  id: number
  vehicleNumber: string
  vehicleType: string
  makeModel: string
  capacity: number
  driverName: string
  driverPhone: string
  status: 'ACTIVE' | 'MAINTENANCE' | 'IDLE'
  assignedRoute: string
}

const INITIAL_ROUTES: TransportRoute[] = [
  {
    id: 1,
    routeName: 'North Metro Express',
    routeNumber: 'R-01',
    startPoint: 'City Center Plaza',
    endPoint: 'Main University Campus',
    stops: [
      { name: 'City Center Plaza', time: '07:15 AM' },
      { name: 'Oakridge Crossing', time: '07:30 AM' },
      { name: 'Westfield Mall', time: '07:45 AM' },
      { name: 'Main Campus Gate 2', time: '08:10 AM' },
    ],
    distanceKm: 22.5,
    monthlyFee: 85,
    vehicleNumber: 'BUS-104',
    driverName: 'Robert Vance',
    driverPhone: '+1 555-0321',
    capacity: 45,
    subscribedCount: 42,
  },
  {
    id: 2,
    routeName: 'South Hills Suburban Route',
    routeNumber: 'R-02',
    startPoint: 'Greenwood Station',
    endPoint: 'Main University Campus',
    stops: [
      { name: 'Greenwood Station', time: '07:00 AM' },
      { name: 'Valley View Colony', time: '07:20 AM' },
      { name: 'Riverdale Junction', time: '07:40 AM' },
      { name: 'Main Campus Gate 1', time: '08:15 AM' },
    ],
    distanceKm: 31.0,
    monthlyFee: 95,
    vehicleNumber: 'BUS-108',
    driverName: 'Marcus Bell',
    driverPhone: '+1 555-0874',
    capacity: 50,
    subscribedCount: 38,
  },
  {
    id: 3,
    routeName: 'East District Shuttle',
    routeNumber: 'R-03',
    startPoint: 'Highland Park',
    endPoint: 'Main University Campus',
    stops: [
      { name: 'Highland Park', time: '07:30 AM' },
      { name: 'Technology Park', time: '07:50 AM' },
      { name: 'Main Campus Gate 1', time: '08:20 AM' },
    ],
    distanceKm: 18.2,
    monthlyFee: 75,
    vehicleNumber: 'BUS-112',
    driverName: 'Samuel Hayes',
    driverPhone: '+1 555-0499',
    capacity: 40,
    subscribedCount: 29,
  },
]

const INITIAL_VEHICLES: Vehicle[] = [
  {
    id: 1,
    vehicleNumber: 'BUS-104',
    vehicleType: 'Standard Heavy Bus',
    makeModel: 'Volvo B7R',
    capacity: 45,
    driverName: 'Robert Vance',
    driverPhone: '+1 555-0321',
    status: 'ACTIVE',
    assignedRoute: 'North Metro Express (R-01)',
  },
  {
    id: 2,
    vehicleNumber: 'BUS-108',
    vehicleType: 'Heavy Coach',
    makeModel: 'Scania Metrolink',
    capacity: 50,
    driverName: 'Marcus Bell',
    driverPhone: '+1 555-0874',
    status: 'ACTIVE',
    assignedRoute: 'South Hills Suburban Route (R-02)',
  },
  {
    id: 3,
    vehicleNumber: 'BUS-112',
    vehicleType: 'Mini Bus',
    makeModel: 'Mercedes-Benz Sprinter',
    capacity: 40,
    driverName: 'Samuel Hayes',
    driverPhone: '+1 555-0499',
    status: 'ACTIVE',
    assignedRoute: 'East District Shuttle (R-03)',
  },
  {
    id: 4,
    vehicleNumber: 'BUS-115',
    vehicleType: 'Transit Van',
    makeModel: 'Ford Transit 350',
    capacity: 25,
    driverName: 'Unassigned',
    driverPhone: '—',
    status: 'MAINTENANCE',
    assignedRoute: 'Standby / Fleet Reserve',
  },
]

export default function TransportPage() {
  const [routes, setRoutes] = useState<TransportRoute[]>(INITIAL_ROUTES)
  const [vehicles] = useState<Vehicle[]>(INITIAL_VEHICLES)
  const [activeTab, setActiveTab] = useState<'routes' | 'fleet' | 'passes'>('routes')
  const [isAddRouteModalOpen, setIsAddRouteModalOpen] = useState(false)

  // New Route Form
  const [newRouteName, setNewRouteName] = useState('')
  const [newRouteNumber, setNewRouteNumber] = useState('')
  const [newStartPoint, setNewStartPoint] = useState('')
  const [newEndPoint, setNewEndPoint] = useState('Main Campus')
  const [newMonthlyFee, setNewMonthlyFee] = useState(80)
  const [newDistance, setNewDistance] = useState(20)

  const handleAddRoute = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newRouteName || !newRouteNumber || !newStartPoint) return

    const newRoute: TransportRoute = {
      id: Date.now(),
      routeName: newRouteName,
      routeNumber: newRouteNumber,
      startPoint: newStartPoint,
      endPoint: newEndPoint,
      stops: [
        { name: newStartPoint, time: '07:20 AM' },
        { name: 'Midtown Transfer', time: '07:45 AM' },
        { name: newEndPoint, time: '08:15 AM' },
      ],
      distanceKm: Number(newDistance),
      monthlyFee: Number(newMonthlyFee),
      vehicleNumber: 'BUS-115',
      driverName: 'Assigned on Dispatch',
      driverPhone: '+1 555-0000',
      capacity: 40,
      subscribedCount: 0,
    }
    setRoutes([...routes, newRoute])
    setIsAddRouteModalOpen(false)
    setNewRouteName('')
    setNewRouteNumber('')
    setNewStartPoint('')
  }

  const totalSubscribers = routes.reduce((sum, r) => sum + r.subscribedCount, 0)

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Transport & Fleet Management</h1>
          <p className="text-muted-foreground mt-1">
            Monitor transit schedules, bus routes, fleet vehicles, and student commuter passes.
          </p>
        </div>
        <Button
          onClick={() => setIsAddRouteModalOpen(true)}
          className="bg-brand-600 hover:bg-brand-700 shadow-sm"
        >
          <Plus className="mr-1.5 h-4 w-4" />
          Add Transit Route
        </Button>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          {
            label: 'Total Fleet Vehicles',
            value: vehicles.length,
            icon: <Bus className="h-4 w-4 text-blue-500" />,
            bg: 'bg-blue-500/10',
          },
          {
            label: 'Active Daily Routes',
            value: routes.length,
            icon: <Navigation className="h-4 w-4 text-emerald-500" />,
            bg: 'bg-emerald-500/10',
          },
          {
            label: 'Student Commuters',
            value: totalSubscribers,
            icon: <Users className="h-4 w-4 text-purple-500" />,
            bg: 'bg-purple-500/10',
          },
          {
            label: 'On-Time Dispatch Rate',
            value: '98.2%',
            icon: <ShieldCheck className="h-4 w-4 text-orange-500" />,
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

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-border pb-4">
        <Button
          variant={activeTab === 'routes' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setActiveTab('routes')}
          className={activeTab === 'routes' ? 'bg-brand-600' : ''}
        >
          <Navigation className="mr-1.5 h-3.5 w-3.5" />
          Bus Routes & Stops ({routes.length})
        </Button>
        <Button
          variant={activeTab === 'fleet' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setActiveTab('fleet')}
          className={activeTab === 'fleet' ? 'bg-brand-600' : ''}
        >
          <Bus className="mr-1.5 h-3.5 w-3.5" />
          Fleet Vehicles ({vehicles.length})
        </Button>
      </div>

      {/* Content */}
      {activeTab === 'routes' ? (
        <div className="space-y-4">
          {routes.map((route) => {
            const utilization = Math.round((route.subscribedCount / route.capacity) * 100)
            return (
              <div
                key={route.id}
                className="rounded-2xl border border-border bg-card p-6 shadow-sm hover:shadow-md transition-all space-y-5"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-brand-100 text-brand-700 dark:bg-brand-950 dark:text-brand-300">
                        {route.routeNumber}
                      </span>
                      <h2 className="text-lg font-bold text-foreground">{route.routeName}</h2>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {route.startPoint} ➔ {route.endPoint} • {route.distanceKm} km • ${route.monthlyFee}
                      /month per student
                    </p>
                  </div>

                  <div className="flex items-center gap-4 text-xs">
                    <div className="text-right">
                      <p className="text-muted-foreground">Vehicle & Driver</p>
                      <p className="font-medium text-foreground">
                        {route.vehicleNumber} ({route.driverName})
                      </p>
                    </div>
                    <span className="text-muted-foreground">•</span>
                    <div className="text-right">
                      <p className="text-muted-foreground">Bus Load</p>
                      <p className="font-semibold text-brand-600">
                        {route.subscribedCount} / {route.capacity} seats ({utilization}%)
                      </p>
                    </div>
                  </div>
                </div>

                {/* Route Stops Visual Timeline */}
                <div className="pt-2">
                  <p className="text-xs font-semibold text-muted-foreground mb-3">
                    Pickup Timeline & Intermediate Stops
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                    {route.stops.map((stop, sIdx) => (
                      <div
                        key={sIdx}
                        className="relative p-3 rounded-xl border border-border/80 bg-muted/20 flex flex-col justify-between"
                      >
                        <div className="flex items-center gap-2 mb-1">
                          <MapPin className="h-3.5 w-3.5 text-brand-600 shrink-0" />
                          <span className="text-xs font-semibold text-foreground line-clamp-1">
                            {stop.name}
                          </span>
                        </div>
                        <div className="flex items-center gap-1 text-[11px] text-muted-foreground">
                          <Clock className="h-3 w-3" />
                          <span>Pickup: {stop.time}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      ) : (
        /* Fleet Vehicles Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {vehicles.map((v) => (
            <div
              key={v.id}
              className="rounded-2xl border border-border bg-card p-6 shadow-sm hover:shadow-md transition-all space-y-4"
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-lg text-foreground">{v.vehicleNumber}</h3>
                    <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-muted">
                      {v.vehicleType}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">{v.makeModel}</p>
                </div>
                <span
                  className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                    v.status === 'ACTIVE'
                      ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                      : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-950/60 dark:text-yellow-300'
                  }`}
                >
                  {v.status}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs bg-muted/20 p-3 rounded-xl">
                <div>
                  <span className="text-muted-foreground">Assigned Route:</span>
                  <p className="font-medium text-foreground mt-0.5">{v.assignedRoute}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Seating Capacity:</span>
                  <p className="font-medium text-foreground mt-0.5">{v.capacity} Passengers</p>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs pt-1 border-t border-border">
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground">Driver:</span>
                  <span className="font-medium text-foreground">{v.driverName}</span>
                </div>
                {v.driverPhone !== '—' && (
                  <span className="flex items-center gap-1 text-brand-600 font-mono">
                    <Phone className="h-3 w-3" /> {v.driverPhone}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Route Modal */}
      {isAddRouteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-card border border-border rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-muted/30">
              <h2 className="text-lg font-semibold">Add New Transit Route</h2>
              <button
                onClick={() => setIsAddRouteModalOpen(false)}
                className="text-muted-foreground hover:text-foreground rounded-lg p-1 hover:bg-muted"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleAddRoute} className="p-6 space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-medium">Route Name *</label>
                <Input
                  required
                  value={newRouteName}
                  onChange={(e) => setNewRouteName(e.target.value)}
                  placeholder="e.g. West Coast Direct"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-medium">Route Number *</label>
                  <Input
                    required
                    value={newRouteNumber}
                    onChange={(e) => setNewRouteNumber(e.target.value)}
                    placeholder="R-04"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-medium">Monthly Fee ($)</label>
                  <Input
                    type="number"
                    value={newMonthlyFee}
                    onChange={(e) => setNewMonthlyFee(Number(e.target.value))}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-medium">Starting Point *</label>
                  <Input
                    required
                    value={newStartPoint}
                    onChange={(e) => setNewStartPoint(e.target.value)}
                    placeholder="Bayview Terminal"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-medium">Destination Point *</label>
                  <Input
                    required
                    value={newEndPoint}
                    onChange={(e) => setNewEndPoint(e.target.value)}
                    placeholder="Main Campus"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium">Distance (km)</label>
                <Input
                  type="number"
                  value={newDistance}
                  onChange={(e) => setNewDistance(Number(e.target.value))}
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-border">
                <Button type="button" variant="outline" onClick={() => setIsAddRouteModalOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" className="bg-brand-600 hover:bg-brand-700">
                  Save Route
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
