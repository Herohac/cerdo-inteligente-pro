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
  Search, 
  Filter, 
  Edit, 
  Eye, 
  ArrowUpDown,
  QrCode,
  Calendar
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Animal {
  id: string;
  arete: string;
  raza: string;
  sexo: 'Macho' | 'Hembra';
  fechaNacimiento: string;
  peso: number;
  etapa: 'Lactancia' | 'Destete' | 'Crecimiento' | 'Engorde' | 'Reproductor';
  corral: string;
  padre?: string;
  madre?: string;
  estado: 'Activo' | 'Vendido' | 'Muerto';
}

const initialAnimals: Animal[] = [
  {
    id: '1',
    arete: 'A001',
    raza: 'Yorkshire',
    sexo: 'Hembra',
    fechaNacimiento: '2024-01-15',
    peso: 180,
    etapa: 'Reproductor',
    corral: 'C-1A',
    estado: 'Activo'
  },
  {
    id: '2',
    arete: 'A002',
    raza: 'Landrace',
    sexo: 'Macho',
    fechaNacimiento: '2024-03-20',
    peso: 85,
    etapa: 'Engorde',
    corral: 'C-3B',
    estado: 'Activo'
  },
  {
    id: '3',
    arete: 'A003',
    raza: 'Duroc',
    sexo: 'Hembra',
    fechaNacimiento: '2024-05-10',
    peso: 45,
    etapa: 'Crecimiento',
    corral: 'C-2A',
    estado: 'Activo'
  }
];

export function InventarioView() {
  const [animals, setAnimals] = useState<Animal[]>(initialAnimals);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterEtapa, setFilterEtapa] = useState<string>('todos');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();

  const [newAnimal, setNewAnimal] = useState<Partial<Animal>>({
    arete: '',
    raza: '',
    sexo: 'Hembra',
    fechaNacimiento: '',
    peso: 0,
    etapa: 'Lactancia',
    corral: '',
    estado: 'Activo'
  });

  const filteredAnimals = animals.filter(animal => {
    const matchesSearch = animal.arete.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         animal.raza.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesEtapa = filterEtapa === 'todos' || animal.etapa === filterEtapa;
    return matchesSearch && matchesEtapa;
  });

  const handleAddAnimal = () => {
    if (!newAnimal.arete || !newAnimal.raza || !newAnimal.fechaNacimiento) {
      toast({
        title: "Error",
        description: "Por favor complete todos los campos obligatorios",
        variant: "destructive"
      });
      return;
    }

    const animal: Animal = {
      id: Date.now().toString(),
      arete: newAnimal.arete!,
      raza: newAnimal.raza!,
      sexo: newAnimal.sexo as 'Macho' | 'Hembra',
      fechaNacimiento: newAnimal.fechaNacimiento!,
      peso: newAnimal.peso || 0,
      etapa: newAnimal.etapa as Animal['etapa'],
      corral: newAnimal.corral || '',
      estado: 'Activo'
    };

    setAnimals([...animals, animal]);
    setNewAnimal({
      arete: '',
      raza: '',
      sexo: 'Hembra',
      fechaNacimiento: '',
      peso: 0,
      etapa: 'Lactancia',
      corral: '',
      estado: 'Activo'
    });
    setIsDialogOpen(false);
    
    toast({
      title: "Animal Registrado",
      description: `Animal ${animal.arete} agregado exitosamente`,
    });
  };

  const getEtapaBadgeVariant = (etapa: string) => {
    switch (etapa) {
      case 'Lactancia': return 'default';
      case 'Destete': return 'secondary';
      case 'Crecimiento': return 'outline';
      case 'Engorde': return 'default';
      case 'Reproductor': return 'default';
      default: return 'secondary';
    }
  };

  const getEdadEnDias = (fechaNacimiento: string) => {
    const hoy = new Date();
    const nacimiento = new Date(fechaNacimiento);
    const diffTime = Math.abs(hoy.getTime() - nacimiento.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  return (
    <div className="p-6 space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Gestión de Inventario Animal</h1>
          <p className="text-muted-foreground">
            Control total de fichas individuales y trazabilidad
          </p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="animate-scale-in">
              <Plus className="h-4 w-4 mr-2" />
              Nuevo Animal
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Registrar Nuevo Animal</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Arete/ID *</Label>
                  <Input
                    value={newAnimal.arete}
                    onChange={(e) => setNewAnimal({...newAnimal, arete: e.target.value})}
                    placeholder="A001"
                  />
                </div>
                <div>
                  <Label>Sexo</Label>
                  <Select 
                    value={newAnimal.sexo} 
                    onValueChange={(value) => setNewAnimal({...newAnimal, sexo: value as 'Macho' | 'Hembra'})}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Hembra">Hembra</SelectItem>
                      <SelectItem value="Macho">Macho</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div>
                <Label>Raza *</Label>
                <Select 
                  value={newAnimal.raza} 
                  onValueChange={(value) => setNewAnimal({...newAnimal, raza: value})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar raza" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Yorkshire">Yorkshire</SelectItem>
                    <SelectItem value="Landrace">Landrace</SelectItem>
                    <SelectItem value="Duroc">Duroc</SelectItem>
                    <SelectItem value="Hampshire">Hampshire</SelectItem>
                    <SelectItem value="Pietrain">Pietrain</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Fecha de Nacimiento *</Label>
                  <Input
                    type="date"
                    value={newAnimal.fechaNacimiento}
                    onChange={(e) => setNewAnimal({...newAnimal, fechaNacimiento: e.target.value})}
                  />
                </div>
                <div>
                  <Label>Peso (kg)</Label>
                  <Input
                    type="number"
                    value={newAnimal.peso}
                    onChange={(e) => setNewAnimal({...newAnimal, peso: Number(e.target.value)})}
                    placeholder="0"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Etapa</Label>
                  <Select 
                    value={newAnimal.etapa} 
                    onValueChange={(value) => setNewAnimal({...newAnimal, etapa: value as Animal['etapa']})}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Lactancia">Lactancia</SelectItem>
                      <SelectItem value="Destete">Destete</SelectItem>
                      <SelectItem value="Crecimiento">Crecimiento</SelectItem>
                      <SelectItem value="Engorde">Engorde</SelectItem>
                      <SelectItem value="Reproductor">Reproductor</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Corral</Label>
                  <Input
                    value={newAnimal.corral}
                    onChange={(e) => setNewAnimal({...newAnimal, corral: e.target.value})}
                    placeholder="C-1A"
                  />
                </div>
              </div>

              <div className="flex gap-2 pt-4">
                <Button onClick={handleAddAnimal} className="flex-1">
                  Registrar Animal
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
            <div className="text-2xl font-bold text-primary">{animals.length}</div>
            <p className="text-sm text-muted-foreground">Total Animales</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-success">
              {animals.filter(a => a.sexo === 'Hembra' && a.etapa === 'Reproductor').length}
            </div>
            <p className="text-sm text-muted-foreground">Reproductoras</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-warning">
              {animals.filter(a => a.etapa === 'Engorde').length}
            </div>
            <p className="text-sm text-muted-foreground">En Engorde</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-earth">
              {Math.round(animals.reduce((sum, a) => sum + a.peso, 0) / animals.length || 0)} kg
            </div>
            <p className="text-sm text-muted-foreground">Peso Promedio</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filtros y Búsqueda</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar por arete o raza..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={filterEtapa} onValueChange={setFilterEtapa}>
              <SelectTrigger className="w-48">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todas las Etapas</SelectItem>
                <SelectItem value="Lactancia">Lactancia</SelectItem>
                <SelectItem value="Destete">Destete</SelectItem>
                <SelectItem value="Crecimiento">Crecimiento</SelectItem>
                <SelectItem value="Engorde">Engorde</SelectItem>
                <SelectItem value="Reproductor">Reproductor</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Animals Table */}
      <Card>
        <CardHeader>
          <CardTitle>Inventario de Animales ({filteredAnimals.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>
                  <Button variant="ghost" size="sm">
                    Arete <ArrowUpDown className="ml-1 h-3 w-3" />
                  </Button>
                </TableHead>
                <TableHead>Raza</TableHead>
                <TableHead>Sexo</TableHead>
                <TableHead>Edad (días)</TableHead>
                <TableHead>Peso (kg)</TableHead>
                <TableHead>Etapa</TableHead>
                <TableHead>Corral</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAnimals.map((animal) => (
                <TableRow key={animal.id} className="hover:bg-muted/50">
                  <TableCell className="font-mono font-semibold">{animal.arete}</TableCell>
                  <TableCell>{animal.raza}</TableCell>
                  <TableCell>
                    <Badge variant={animal.sexo === 'Macho' ? 'default' : 'secondary'}>
                      {animal.sexo}
                    </Badge>
                  </TableCell>
                  <TableCell>{getEdadEnDias(animal.fechaNacimiento)}</TableCell>
                  <TableCell>{animal.peso} kg</TableCell>
                  <TableCell>
                    <Badge variant={getEtapaBadgeVariant(animal.etapa)}>
                      {animal.etapa}
                    </Badge>
                  </TableCell>
                  <TableCell>{animal.corral}</TableCell>
                  <TableCell>
                    <Badge variant={animal.estado === 'Activo' ? 'default' : 'destructive'}>
                      {animal.estado}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <Button variant="ghost" size="sm">
                        <Eye className="h-3 w-3" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Edit className="h-3 w-3" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <QrCode className="h-3 w-3" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}