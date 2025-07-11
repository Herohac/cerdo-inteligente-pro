import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { 
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { 
  Plus, 
  Heart, 
  Calendar as CalendarIcon, 
  AlertCircle,
  TrendingUp,
  Baby,
  Clock
} from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

interface CerdaReproductiva {
  id: string;
  arete: string;
  raza: string;
  fechaNacimiento: string;
  numeroPartos: number;
  fechaUltimoParto?: string;
  fechaUltimoCelo?: string;
  fechaProximoCelo?: string;
  estadoReproductivo: 'Abierta' | 'Gestante' | 'Lactando' | 'Destete' | 'Servicio';
  fechaServicio?: string;
  fechaProbableParto?: string;
  numeroLechones: number;
  observaciones?: string;
}

interface EventoReproductivo {
  id: string;
  cerdaId: string;
  arete: string;
  tipo: 'Celo' | 'Servicio' | 'Diagnóstico' | 'Parto' | 'Destete';
  fecha: string;
  descripcion: string;
  estado: 'Programado' | 'Realizado' | 'Perdido';
}

const initialCerdas: CerdaReproductiva[] = [
  {
    id: '1',
    arete: 'H001',
    raza: 'Yorkshire',
    fechaNacimiento: '2022-03-15',
    numeroPartos: 3,
    fechaUltimoParto: '2024-05-20',
    fechaUltimoCelo: '2024-06-25',
    fechaProximoCelo: '2024-07-16',
    estadoReproductivo: 'Abierta',
    numeroLechones: 28,
    observaciones: 'Excelente madre, alta producción de leche'
  },
  {
    id: '2',
    arete: 'H002',
    raza: 'Landrace',
    fechaNacimiento: '2022-08-10',
    numeroPartos: 2,
    fechaServicio: '2024-06-15',
    fechaProbableParto: '2024-10-08',
    estadoReproductivo: 'Gestante',
    numeroLechones: 22,
    observaciones: 'Primera gestación confirmada por ultrasonido'
  },
  {
    id: '3',
    arete: 'H003',
    raza: 'Duroc',
    fechaNacimiento: '2023-01-20',
    numeroPartos: 1,
    fechaUltimoParto: '2024-06-10',
    estadoReproductivo: 'Lactando',
    numeroLechones: 11,
    observaciones: 'Primeriza, adaptándose bien'
  }
];

const initialEventos: EventoReproductivo[] = [
  {
    id: '1',
    cerdaId: '1',
    arete: 'H001',
    tipo: 'Celo',
    fecha: '2024-07-16',
    descripcion: 'Celo esperado según ciclo',
    estado: 'Programado'
  },
  {
    id: '2',
    cerdaId: '2',
    arete: 'H002',
    tipo: 'Parto',
    fecha: '2024-10-08',
    descripcion: 'Parto programado - 114 días gestación',
    estado: 'Programado'
  },
  {
    id: '3',
    cerdaId: '3',
    arete: 'H003',
    tipo: 'Destete',
    fecha: '2024-07-25',
    descripcion: 'Destete a 21 días',
    estado: 'Programado'
  }
];

export function ReproductivoView() {
  const [cerdas, setCerdas] = useState<CerdaReproductiva[]>(initialCerdas);
  const [eventos, setEventos] = useState<EventoReproductivo[]>(initialEventos);
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'cerdas' | 'eventos' | 'calendario'>('cerdas');
  const { toast } = useToast();

  const [newEvento, setNewEvento] = useState<Partial<EventoReproductivo>>({
    tipo: 'Celo',
    fecha: format(new Date(), 'yyyy-MM-dd'),
    estado: 'Programado'
  });

  const getEstadoBadgeVariant = (estado: string) => {
    switch (estado) {
      case 'Abierta': return 'secondary';
      case 'Gestante': return 'default';
      case 'Lactando': return 'default';
      case 'Destete': return 'outline';
      case 'Servicio': return 'default';
      default: return 'secondary';
    }
  };

  const getEventoBadgeVariant = (tipo: string) => {
    switch (tipo) {
      case 'Celo': return 'secondary';
      case 'Servicio': return 'default';
      case 'Diagnóstico': return 'outline';
      case 'Parto': return 'default';
      case 'Destete': return 'secondary';
      default: return 'secondary';
    }
  };

  const calcularDiasGestacion = (fechaServicio: string) => {
    const hoy = new Date();
    const servicio = new Date(fechaServicio);
    const diffTime = hoy.getTime() - servicio.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const calcularProximoCelo = (fechaUltimoCelo: string) => {
    const ultimoCelo = new Date(fechaUltimoCelo);
    ultimoCelo.setDate(ultimoCelo.getDate() + 21); // Ciclo de 21 días
    return format(ultimoCelo, 'yyyy-MM-dd');
  };

  const handleAddEvento = () => {
    if (!newEvento.cerdaId || !newEvento.tipo || !newEvento.fecha) {
      toast({
        title: "Error",
        description: "Por favor complete todos los campos obligatorios",
        variant: "destructive"
      });
      return;
    }

    const cerda = cerdas.find(c => c.id === newEvento.cerdaId);
    if (!cerda) return;

    const evento: EventoReproductivo = {
      id: Date.now().toString(),
      cerdaId: newEvento.cerdaId!,
      arete: cerda.arete,
      tipo: newEvento.tipo as EventoReproductivo['tipo'],
      fecha: newEvento.fecha!,
      descripcion: newEvento.descripcion || '',
      estado: 'Programado'
    };

    setEventos([...eventos, evento]);
    setNewEvento({
      tipo: 'Celo',
      fecha: format(new Date(), 'yyyy-MM-dd'),
      estado: 'Programado'
    });
    setIsDialogOpen(false);
    
    toast({
      title: "Evento Programado",
      description: `${evento.tipo} programado para cerda ${cerda.arete}`,
    });
  };

  const eventosProximos = eventos.filter(evento => {
    const fechaEvento = new Date(evento.fecha);
    const hoy = new Date();
    const diasDiferencia = Math.ceil((fechaEvento.getTime() - hoy.getTime()) / (1000 * 60 * 60 * 24));
    return diasDiferencia >= 0 && diasDiferencia <= 7 && evento.estado === 'Programado';
  });

  return (
    <div className="p-6 space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Control Reproductivo</h1>
          <p className="text-muted-foreground">
            Gestión integral del ciclo reproductivo y alertas automáticas
          </p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="animate-scale-in">
              <Plus className="h-4 w-4 mr-2" />
              Nuevo Evento
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Programar Evento Reproductivo</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>Cerda</Label>
                <Select 
                  value={newEvento.cerdaId} 
                  onValueChange={(value) => setNewEvento({...newEvento, cerdaId: value})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar cerda" />
                  </SelectTrigger>
                  <SelectContent>
                    {cerdas.map(cerda => (
                      <SelectItem key={cerda.id} value={cerda.id}>
                        {cerda.arete} - {cerda.raza}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Tipo de Evento</Label>
                  <Select 
                    value={newEvento.tipo} 
                    onValueChange={(value) => setNewEvento({...newEvento, tipo: value as EventoReproductivo['tipo']})}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Celo">Celo</SelectItem>
                      <SelectItem value="Servicio">Servicio</SelectItem>
                      <SelectItem value="Diagnóstico">Diagnóstico</SelectItem>
                      <SelectItem value="Parto">Parto</SelectItem>
                      <SelectItem value="Destete">Destete</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Fecha</Label>
                  <Input
                    type="date"
                    value={newEvento.fecha}
                    onChange={(e) => setNewEvento({...newEvento, fecha: e.target.value})}
                  />
                </div>
              </div>

              <div>
                <Label>Descripción</Label>
                <Input
                  value={newEvento.descripcion}
                  onChange={(e) => setNewEvento({...newEvento, descripcion: e.target.value})}
                  placeholder="Detalles del evento..."
                />
              </div>

              <div className="flex gap-2 pt-4">
                <Button onClick={handleAddEvento} className="flex-1">
                  Programar Evento
                </Button>
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancelar
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Heart className="h-8 w-8 text-success" />
              <div>
                <div className="text-2xl font-bold text-success">
                  {cerdas.filter(c => c.estadoReproductivo === 'Gestante').length}
                </div>
                <p className="text-sm text-muted-foreground">Gestantes</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Baby className="h-8 w-8 text-primary" />
              <div>
                <div className="text-2xl font-bold text-primary">
                  {cerdas.filter(c => c.estadoReproductivo === 'Lactando').length}
                </div>
                <p className="text-sm text-muted-foreground">Lactando</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <TrendingUp className="h-8 w-8 text-warning" />
              <div>
                <div className="text-2xl font-bold text-warning">
                  {Math.round(cerdas.reduce((sum, c) => sum + c.numeroLechones, 0) / cerdas.reduce((sum, c) => sum + c.numeroPartos, 0) || 0)}
                </div>
                <p className="text-sm text-muted-foreground">Lechones/Parto</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <AlertCircle className="h-8 w-8 text-destructive" />
              <div>
                <div className="text-2xl font-bold text-destructive">{eventosProximos.length}</div>
                <p className="text-sm text-muted-foreground">Alertas Semana</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Navigation Tabs */}
      <div className="flex gap-2 border-b border-border">
        <Button 
          variant={activeTab === 'cerdas' ? 'default' : 'ghost'}
          onClick={() => setActiveTab('cerdas')}
        >
          Cerdas Reproductivas
        </Button>
        <Button 
          variant={activeTab === 'eventos' ? 'default' : 'ghost'}
          onClick={() => setActiveTab('eventos')}
        >
          Eventos Programados
        </Button>
        <Button 
          variant={activeTab === 'calendario' ? 'default' : 'ghost'}
          onClick={() => setActiveTab('calendario')}
        >
          Calendario
        </Button>
      </div>

      {/* Content based on active tab */}
      {activeTab === 'cerdas' && (
        <Card>
          <CardHeader>
            <CardTitle>Cerdas Reproductivas ({cerdas.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Arete</TableHead>
                  <TableHead>Raza</TableHead>
                  <TableHead>Edad</TableHead>
                  <TableHead>Partos</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Último Evento</TableHead>
                  <TableHead>Próximo Evento</TableHead>
                  <TableHead>Lechones Total</TableHead>
                  <TableHead>Productividad</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {cerdas.map((cerda) => {
                  const edad = Math.floor((new Date().getTime() - new Date(cerda.fechaNacimiento).getTime()) / (1000 * 60 * 60 * 24 * 365));
                  const productividad = cerda.numeroPartos > 0 ? (cerda.numeroLechones / cerda.numeroPartos).toFixed(1) : '0';
                  
                  return (
                    <TableRow key={cerda.id} className="hover:bg-muted/50">
                      <TableCell className="font-mono font-semibold">{cerda.arete}</TableCell>
                      <TableCell>{cerda.raza}</TableCell>
                      <TableCell>{edad} años</TableCell>
                      <TableCell>{cerda.numeroPartos}</TableCell>
                      <TableCell>
                        <Badge variant={getEstadoBadgeVariant(cerda.estadoReproductivo)}>
                          {cerda.estadoReproductivo}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {cerda.fechaUltimoParto && (
                          <span className="text-sm">
                            Parto: {format(new Date(cerda.fechaUltimoParto), 'dd/MM/yyyy')}
                          </span>
                        )}
                        {cerda.fechaServicio && (
                          <span className="text-sm">
                            Servicio: {format(new Date(cerda.fechaServicio), 'dd/MM/yyyy')}
                            <br />
                            <span className="text-xs text-muted-foreground">
                              {calcularDiasGestacion(cerda.fechaServicio)} días
                            </span>
                          </span>
                        )}
                      </TableCell>
                      <TableCell>
                        {cerda.fechaProximoCelo && (
                          <span className="text-sm text-warning">
                            Celo: {format(new Date(cerda.fechaProximoCelo), 'dd/MM/yyyy')}
                          </span>
                        )}
                        {cerda.fechaProbableParto && (
                          <span className="text-sm text-success">
                            Parto: {format(new Date(cerda.fechaProbableParto), 'dd/MM/yyyy')}
                          </span>
                        )}
                      </TableCell>
                      <TableCell className="text-center">{cerda.numeroLechones}</TableCell>
                      <TableCell className="text-center font-semibold">
                        {productividad} lech/parto
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {activeTab === 'eventos' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-warning" />
                Eventos Próximos (7 días)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {eventosProximos.map((evento) => (
                  <div key={evento.id} className="p-3 bg-accent rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <Badge variant={getEventoBadgeVariant(evento.tipo)}>
                            {evento.tipo}
                          </Badge>
                          <span className="font-semibold">{evento.arete}</span>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">
                          {evento.descripcion}
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium">
                          {format(new Date(evento.fecha), 'dd/MM/yyyy')}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {format(new Date(evento.fecha), 'EEEE', { locale: es })}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                {eventosProximos.length === 0 && (
                  <p className="text-center text-muted-foreground py-4">
                    No hay eventos programados para los próximos 7 días
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Todos los Eventos</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Cerda</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Fecha</TableHead>
                    <TableHead>Estado</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {eventos.slice(0, 10).map((evento) => (
                    <TableRow key={evento.id}>
                      <TableCell className="font-mono">{evento.arete}</TableCell>
                      <TableCell>
                        <Badge variant={getEventoBadgeVariant(evento.tipo)}>
                          {evento.tipo}
                        </Badge>
                      </TableCell>
                      <TableCell>{format(new Date(evento.fecha), 'dd/MM/yyyy')}</TableCell>
                      <TableCell>
                        <Badge variant={evento.estado === 'Realizado' ? 'default' : 'secondary'}>
                          {evento.estado}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      )}

      {activeTab === 'calendario' && (
        <Card>
          <CardHeader>
            <CardTitle>Calendario Reproductivo</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                className="rounded-md border"
              />
              <div>
                <h3 className="font-semibold mb-4">Eventos del Mes</h3>
                <div className="space-y-2">
                  {eventos.filter(evento => {
                    const fechaEvento = new Date(evento.fecha);
                    const hoy = new Date();
                    return fechaEvento.getMonth() === hoy.getMonth() && 
                           fechaEvento.getFullYear() === hoy.getFullYear();
                  }).map((evento) => (
                    <div key={evento.id} className="p-2 bg-accent rounded text-sm">
                      <div className="flex items-center gap-2">
                        <Badge variant={getEventoBadgeVariant(evento.tipo)} className="text-xs">
                          {evento.tipo}
                        </Badge>
                        <span className="font-medium">{evento.arete}</span>
                        <span className="text-muted-foreground">
                          {format(new Date(evento.fecha), 'dd/MM')}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}