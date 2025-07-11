import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
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
  Plus, 
  TrendingUp, 
  Scale, 
  Utensils,
  BarChart3,
  Calculator,
  Target
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Lote {
  id: string;
  numero: string;
  fechaInicio: string;
  cantidadAnimales: number;
  pesoPromedio: number;
  pesoTotal: number;
  consumoAlimento: number;
  tipoAlimento: string;
  ica: number;
  gananciaPromedioDiaria: number;
  etapa: 'Destete' | 'Crecimiento' | 'Engorde';
  estado: 'Activo' | 'Finalizado';
  observaciones?: string;
}

interface RegistroAlimentacion {
  id: string;
  loteId: string;
  fecha: string;
  tipoAlimento: string;
  cantidad: number;
  costo: number;
  responsable: string;
}

interface RegistroPeso {
  id: string;
  loteId: string;
  fecha: string;
  pesoPromedio: number;
  muestrasAnimales: number;
  responsable: string;
}

const initialLotes: Lote[] = [
  {
    id: '1',
    numero: 'L-2024-001',
    fechaInicio: '2024-05-15',
    cantidadAnimales: 45,
    pesoPromedio: 85.2,
    pesoTotal: 3834,
    consumoAlimento: 12450,
    tipoAlimento: 'Engorde Premium',
    ica: 2.8,
    gananciaPromedioDiaria: 720,
    etapa: 'Engorde',
    estado: 'Activo',
    observaciones: 'Excelente desarrollo, listo para venta en 2 semanas'
  },
  {
    id: '2',
    numero: 'L-2024-002',
    fechaInicio: '2024-06-01',
    cantidadAnimales: 38,
    pesoPromedio: 52.5,
    pesoTotal: 1995,
    consumoAlimento: 6840,
    tipoAlimento: 'Crecimiento Plus',
    ica: 2.6,
    gananciaPromedioDiaria: 650,
    etapa: 'Crecimiento',
    estado: 'Activo'
  },
  {
    id: '3',
    numero: 'L-2024-003',
    fechaInicio: '2024-06-20',
    cantidadAnimales: 42,
    pesoPromedio: 28.8,
    pesoTotal: 1210,
    consumoAlimento: 2890,
    tipoAlimento: 'Iniciador',
    ica: 2.4,
    gananciaPromedioDiaria: 580,
    etapa: 'Destete',
    estado: 'Activo'
  }
];

const initialAlimentacion: RegistroAlimentacion[] = [
  {
    id: '1',
    loteId: '1',
    fecha: '2024-07-15',
    tipoAlimento: 'Engorde Premium',
    cantidad: 125,
    costo: 62.5,
    responsable: 'Juan Pérez'
  },
  {
    id: '2',
    loteId: '2',
    fecha: '2024-07-15',
    tipoAlimento: 'Crecimiento Plus',
    cantidad: 95,
    costo: 52.25,
    responsable: 'María González'
  }
];

const initialPesos: RegistroPeso[] = [
  {
    id: '1',
    loteId: '1',
    fecha: '2024-07-15',
    pesoPromedio: 85.2,
    muestrasAnimales: 10,
    responsable: 'Juan Pérez'
  },
  {
    id: '2',
    loteId: '2',
    fecha: '2024-07-15',
    pesoPromedio: 52.5,
    muestrasAnimales: 8,
    responsable: 'María González'
  }
];

export function EngordeView() {
  const [lotes, setLotes] = useState<Lote[]>(initialLotes);
  const [alimentacion, setAlimentacion] = useState<RegistroAlimentacion[]>(initialAlimentacion);
  const [pesos, setPesos] = useState<RegistroPeso[]>(initialPesos);
  const [isLoteDialogOpen, setIsLoteDialogOpen] = useState(false);
  const [isAlimentacionDialogOpen, setIsAlimentacionDialogOpen] = useState(false);
  const [isPesoDialogOpen, setIsPesoDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'lotes' | 'alimentacion' | 'pesos' | 'analisis'>('lotes');
  const { toast } = useToast();

  const [newLote, setNewLote] = useState<Partial<Lote>>({
    numero: '',
    fechaInicio: new Date().toISOString().split('T')[0],
    cantidadAnimales: 0,
    pesoPromedio: 0,
    tipoAlimento: 'Iniciador',
    etapa: 'Destete',
    estado: 'Activo'
  });

  const [newAlimentacion, setNewAlimentacion] = useState<Partial<RegistroAlimentacion>>({
    fecha: new Date().toISOString().split('T')[0],
    tipoAlimento: 'Engorde Premium',
    cantidad: 0,
    costo: 0,
    responsable: 'Juan Pérez'
  });

  const [newPeso, setNewPeso] = useState<Partial<RegistroPeso>>({
    fecha: new Date().toISOString().split('T')[0],
    pesoPromedio: 0,
    muestrasAnimales: 0,
    responsable: 'Juan Pérez'
  });

  const calcularICA = (consumoAlimento: number, pesoTotal: number) => {
    return pesoTotal > 0 ? (consumoAlimento / pesoTotal).toFixed(2) : '0.00';
  };

  const calcularDiasEngorde = (fechaInicio: string) => {
    const inicio = new Date(fechaInicio);
    const hoy = new Date();
    const diffTime = hoy.getTime() - inicio.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const handleAddLote = () => {
    if (!newLote.numero || !newLote.cantidadAnimales || !newLote.pesoPromedio) {
      toast({
        title: "Error",
        description: "Por favor complete todos los campos obligatorios",
        variant: "destructive"
      });
      return;
    }

    const lote: Lote = {
      id: Date.now().toString(),
      numero: newLote.numero!,
      fechaInicio: newLote.fechaInicio!,
      cantidadAnimales: newLote.cantidadAnimales!,
      pesoPromedio: newLote.pesoPromedio!,
      pesoTotal: newLote.cantidadAnimales! * newLote.pesoPromedio!,
      consumoAlimento: 0,
      tipoAlimento: newLote.tipoAlimento!,
      ica: 0,
      gananciaPromedioDiaria: 0,
      etapa: newLote.etapa!,
      estado: 'Activo',
      observaciones: newLote.observaciones
    };

    setLotes([...lotes, lote]);
    setNewLote({
      numero: '',
      fechaInicio: new Date().toISOString().split('T')[0],
      cantidadAnimales: 0,
      pesoPromedio: 0,
      tipoAlimento: 'Iniciador',
      etapa: 'Destete',
      estado: 'Activo'
    });
    setIsLoteDialogOpen(false);
    
    toast({
      title: "Lote Creado",
      description: `Lote ${lote.numero} registrado exitosamente`,
    });
  };

  const handleAddAlimentacion = () => {
    if (!newAlimentacion.loteId || !newAlimentacion.cantidad) {
      toast({
        title: "Error",
        description: "Por favor complete todos los campos obligatorios",
        variant: "destructive"
      });
      return;
    }

    const registro: RegistroAlimentacion = {
      id: Date.now().toString(),
      loteId: newAlimentacion.loteId!,
      fecha: newAlimentacion.fecha!,
      tipoAlimento: newAlimentacion.tipoAlimento!,
      cantidad: newAlimentacion.cantidad!,
      costo: newAlimentacion.costo || 0,
      responsable: newAlimentacion.responsable!
    };

    setAlimentacion([...alimentacion, registro]);
    
    // Actualizar consumo en el lote
    setLotes(lotes.map(lote => 
      lote.id === newAlimentacion.loteId 
        ? { ...lote, consumoAlimento: lote.consumoAlimento + newAlimentacion.cantidad! }
        : lote
    ));

    setNewAlimentacion({
      fecha: new Date().toISOString().split('T')[0],
      tipoAlimento: 'Engorde Premium',
      cantidad: 0,
      costo: 0,
      responsable: 'Juan Pérez'
    });
    setIsAlimentacionDialogOpen(false);
    
    toast({
      title: "Alimentación Registrada",
      description: `${registro.cantidad} kg registrados exitosamente`,
    });
  };

  const getEtapaBadgeVariant = (etapa: string) => {
    switch (etapa) {
      case 'Destete': return 'secondary';
      case 'Crecimiento': return 'outline';
      case 'Engorde': return 'default';
      default: return 'secondary';
    }
  };

  const getICAStatus = (ica: number) => {
    if (ica <= 2.5) return { variant: 'default' as const, text: 'Excelente' };
    if (ica <= 3.0) return { variant: 'secondary' as const, text: 'Bueno' };
    if (ica <= 3.5) return { variant: 'outline' as const, text: 'Regular' };
    return { variant: 'destructive' as const, text: 'Malo' };
  };

  const promedioICA = lotes.length > 0 ? 
    (lotes.reduce((sum, lote) => sum + lote.ica, 0) / lotes.length).toFixed(2) : '0.00';

  const totalAnimales = lotes.reduce((sum, lote) => sum + lote.cantidadAnimales, 0);
  const pesoTotalGranja = lotes.reduce((sum, lote) => sum + lote.pesoTotal, 0);
  const consumoTotalSemanal = alimentacion
    .filter(reg => {
      const fecha = new Date(reg.fecha);
      const semanaAtras = new Date();
      semanaAtras.setDate(semanaAtras.getDate() - 7);
      return fecha >= semanaAtras;
    })
    .reduce((sum, reg) => sum + reg.cantidad, 0);

  return (
    <div className="p-6 space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Engorde y Nutrición</h1>
          <p className="text-muted-foreground">
            Control de lotes, ICA y optimización alimentaria
          </p>
        </div>
        
        <div className="flex gap-2">
          <Dialog open={isLoteDialogOpen} onOpenChange={setIsLoteDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Plus className="h-4 w-4 mr-2" />
                Nuevo Lote
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Crear Nuevo Lote</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Número de Lote *</Label>
                    <Input
                      value={newLote.numero}
                      onChange={(e) => setNewLote({...newLote, numero: e.target.value})}
                      placeholder="L-2024-004"
                    />
                  </div>
                  <div>
                    <Label>Fecha de Inicio</Label>
                    <Input
                      type="date"
                      value={newLote.fechaInicio}
                      onChange={(e) => setNewLote({...newLote, fechaInicio: e.target.value})}
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Cantidad de Animales *</Label>
                    <Input
                      type="number"
                      value={newLote.cantidadAnimales}
                      onChange={(e) => setNewLote({...newLote, cantidadAnimales: Number(e.target.value)})}
                    />
                  </div>
                  <div>
                    <Label>Peso Promedio (kg) *</Label>
                    <Input
                      type="number"
                      step="0.1"
                      value={newLote.pesoPromedio}
                      onChange={(e) => setNewLote({...newLote, pesoPromedio: Number(e.target.value)})}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Etapa</Label>
                    <Select 
                      value={newLote.etapa} 
                      onValueChange={(value) => setNewLote({...newLote, etapa: value as Lote['etapa']})}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Destete">Destete</SelectItem>
                        <SelectItem value="Crecimiento">Crecimiento</SelectItem>
                        <SelectItem value="Engorde">Engorde</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Tipo de Alimento</Label>
                    <Select 
                      value={newLote.tipoAlimento} 
                      onValueChange={(value) => setNewLote({...newLote, tipoAlimento: value})}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Iniciador">Iniciador</SelectItem>
                        <SelectItem value="Crecimiento Plus">Crecimiento Plus</SelectItem>
                        <SelectItem value="Engorde Premium">Engorde Premium</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label>Observaciones</Label>
                  <Input
                    value={newLote.observaciones}
                    onChange={(e) => setNewLote({...newLote, observaciones: e.target.value})}
                    placeholder="Notas adicionales..."
                  />
                </div>

                <div className="flex gap-2 pt-4">
                  <Button onClick={handleAddLote} className="flex-1">
                    Crear Lote
                  </Button>
                  <Button variant="outline" onClick={() => setIsLoteDialogOpen(false)}>
                    Cancelar
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>

          <Dialog open={isAlimentacionDialogOpen} onOpenChange={setIsAlimentacionDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Utensils className="h-4 w-4 mr-2" />
                Registrar Alimentación
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Registrar Alimentación</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label>Lote</Label>
                  <Select 
                    value={newAlimentacion.loteId} 
                    onValueChange={(value) => setNewAlimentacion({...newAlimentacion, loteId: value})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar lote" />
                    </SelectTrigger>
                    <SelectContent>
                      {lotes.filter(l => l.estado === 'Activo').map(lote => (
                        <SelectItem key={lote.id} value={lote.id}>
                          {lote.numero} - {lote.cantidadAnimales} animales
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Fecha</Label>
                    <Input
                      type="date"
                      value={newAlimentacion.fecha}
                      onChange={(e) => setNewAlimentacion({...newAlimentacion, fecha: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label>Cantidad (kg) *</Label>
                    <Input
                      type="number"
                      value={newAlimentacion.cantidad}
                      onChange={(e) => setNewAlimentacion({...newAlimentacion, cantidad: Number(e.target.value)})}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Tipo de Alimento</Label>
                    <Select 
                      value={newAlimentacion.tipoAlimento} 
                      onValueChange={(value) => setNewAlimentacion({...newAlimentacion, tipoAlimento: value})}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Iniciador">Iniciador</SelectItem>
                        <SelectItem value="Crecimiento Plus">Crecimiento Plus</SelectItem>
                        <SelectItem value="Engorde Premium">Engorde Premium</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Costo ($)</Label>
                    <Input
                      type="number"
                      step="0.01"
                      value={newAlimentacion.costo}
                      onChange={(e) => setNewAlimentacion({...newAlimentacion, costo: Number(e.target.value)})}
                    />
                  </div>
                </div>

                <div className="flex gap-2 pt-4">
                  <Button onClick={handleAddAlimentacion} className="flex-1">
                    Registrar
                  </Button>
                  <Button variant="outline" onClick={() => setIsAlimentacionDialogOpen(false)}>
                    Cancelar
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Scale className="h-8 w-8 text-primary" />
              <div>
                <div className="text-2xl font-bold text-primary">{totalAnimales}</div>
                <p className="text-sm text-muted-foreground">Animales en Engorde</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Calculator className="h-8 w-8 text-success" />
              <div>
                <div className="text-2xl font-bold text-success">{promedioICA}</div>
                <p className="text-sm text-muted-foreground">ICA Promedio</p>
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
                  {Math.round(pesoTotalGranja / totalAnimales || 0)} kg
                </div>
                <p className="text-sm text-muted-foreground">Peso Promedio</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Utensils className="h-8 w-8 text-earth" />
              <div>
                <div className="text-2xl font-bold text-earth">{consumoTotalSemanal} kg</div>
                <p className="text-sm text-muted-foreground">Consumo Semanal</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Navigation Tabs */}
      <div className="flex gap-2 border-b border-border">
        <Button 
          variant={activeTab === 'lotes' ? 'default' : 'ghost'}
          onClick={() => setActiveTab('lotes')}
        >
          Lotes de Engorde
        </Button>
        <Button 
          variant={activeTab === 'alimentacion' ? 'default' : 'ghost'}
          onClick={() => setActiveTab('alimentacion')}
        >
          Registro Alimentación
        </Button>
        <Button 
          variant={activeTab === 'analisis' ? 'default' : 'ghost'}
          onClick={() => setActiveTab('analisis')}
        >
          Análisis ICA
        </Button>
      </div>

      {/* Content based on active tab */}
      {activeTab === 'lotes' && (
        <Card>
          <CardHeader>
            <CardTitle>Lotes de Engorde ({lotes.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Lote</TableHead>
                  <TableHead>Animales</TableHead>
                  <TableHead>Días</TableHead>
                  <TableHead>Peso Prom.</TableHead>
                  <TableHead>Peso Total</TableHead>
                  <TableHead>Consumo</TableHead>
                  <TableHead>ICA</TableHead>
                  <TableHead>Etapa</TableHead>
                  <TableHead>Estado</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {lotes.map((lote) => {
                  const icaCalculado = Number(calcularICA(lote.consumoAlimento, lote.pesoTotal));
                  const icaStatus = getICAStatus(icaCalculado);
                  
                  return (
                    <TableRow key={lote.id} className="hover:bg-muted/50">
                      <TableCell className="font-mono font-semibold">{lote.numero}</TableCell>
                      <TableCell>{lote.cantidadAnimales}</TableCell>
                      <TableCell>{calcularDiasEngorde(lote.fechaInicio)}</TableCell>
                      <TableCell>{lote.pesoPromedio} kg</TableCell>
                      <TableCell>{lote.pesoTotal} kg</TableCell>
                      <TableCell>{lote.consumoAlimento} kg</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <span className="font-semibold">{calcularICA(lote.consumoAlimento, lote.pesoTotal)}</span>
                          <Badge variant={icaStatus.variant} className="text-xs">
                            {icaStatus.text}
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={getEtapaBadgeVariant(lote.etapa)}>
                          {lote.etapa}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={lote.estado === 'Activo' ? 'default' : 'secondary'}>
                          {lote.estado}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {activeTab === 'alimentacion' && (
        <Card>
          <CardHeader>
            <CardTitle>Registro de Alimentación</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Fecha</TableHead>
                  <TableHead>Lote</TableHead>
                  <TableHead>Tipo Alimento</TableHead>
                  <TableHead>Cantidad (kg)</TableHead>
                  <TableHead>Costo ($)</TableHead>
                  <TableHead>Responsable</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {alimentacion.slice(0, 20).map((registro) => {
                  const lote = lotes.find(l => l.id === registro.loteId);
                  return (
                    <TableRow key={registro.id}>
                      <TableCell>{new Date(registro.fecha).toLocaleDateString()}</TableCell>
                      <TableCell className="font-mono">{lote?.numero}</TableCell>
                      <TableCell>{registro.tipoAlimento}</TableCell>
                      <TableCell className="font-semibold">{registro.cantidad} kg</TableCell>
                      <TableCell>${registro.costo.toFixed(2)}</TableCell>
                      <TableCell>{registro.responsable}</TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {activeTab === 'analisis' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Análisis de Eficiencia
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="font-semibold mb-3">ICA por Lote</h3>
                <div className="space-y-3">
                  {lotes.map((lote) => {
                    const ica = Number(calcularICA(lote.consumoAlimento, lote.pesoTotal));
                    const icaStatus = getICAStatus(ica);
                    
                    return (
                      <div key={lote.id} className="flex items-center justify-between p-3 bg-accent rounded-lg">
                        <div>
                          <span className="font-medium">{lote.numero}</span>
                          <p className="text-sm text-muted-foreground">{lote.cantidadAnimales} animales</p>
                        </div>
                        <div className="text-right">
                          <div className="text-xl font-bold">{calcularICA(lote.consumoAlimento, lote.pesoTotal)}</div>
                          <Badge variant={icaStatus.variant} className="text-xs">
                            {icaStatus.text}
                          </Badge>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                Objetivos y Metas
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="font-semibold mb-3">Benchmarks de la Industria</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span>ICA Objetivo Destete:</span>
                    <Badge variant="outline">≤ 2.2</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>ICA Objetivo Crecimiento:</span>
                    <Badge variant="outline">≤ 2.8</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>ICA Objetivo Engorde:</span>
                    <Badge variant="outline">≤ 3.2</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Ganancia Diaria Objetivo:</span>
                    <Badge variant="outline">≥ 650g</Badge>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-3">Rendimiento Actual</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span>ICA Promedio Granja:</span>
                    <Badge variant={Number(promedioICA) <= 2.8 ? 'default' : 'destructive'}>
                      {promedioICA}
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Lotes con ICA ≤ 2.8:</span>
                    <Badge variant="secondary">
                      {lotes.filter(l => Number(calcularICA(l.consumoAlimento, l.pesoTotal)) <= 2.8).length}/{lotes.length}
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Costo Alimento/kg Carne:</span>
                    <Badge variant="outline">$2.45</Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}