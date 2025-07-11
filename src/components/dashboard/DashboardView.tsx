import { StatCard } from "./StatCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  PiggyBank, 
  Heart, 
  TrendingUp, 
  AlertTriangle,
  Calendar,
  Activity,
  Target,
  Utensils
} from "lucide-react";

export function DashboardView() {
  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground">
            Resumen general de tu granja porcina
          </p>
        </div>
        <div className="text-sm text-muted-foreground">
          Última actualización: Hoy, 10:30 AM
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Animales"
          value="1,247"
          description="En inventario activo"
          icon={PiggyBank}
          trend={{ value: 8, isPositive: true }}
        />
        <StatCard
          title="Cerdas Gestantes"
          value="85"
          description="En diferentes etapas"
          icon={Heart}
          variant="success"
          trend={{ value: 12, isPositive: true }}
        />
        <StatCard
          title="ICA Promedio"
          value="2.8"
          description="Índice de conversión"
          icon={TrendingUp}
          variant="warning"
        />
        <StatCard
          title="Alertas Sanitarias"
          value="3"
          description="Requieren atención"
          icon={AlertTriangle}
          variant="destructive"
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Próximos Eventos */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-primary" />
              Próximos Eventos
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-accent rounded-lg">
              <div>
                <p className="font-medium">Partos Programados</p>
                <p className="text-sm text-muted-foreground">Próximos 7 días</p>
              </div>
              <Badge variant="secondary">12</Badge>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-accent rounded-lg">
              <div>
                <p className="font-medium">Vacunaciones Pendientes</p>
                <p className="text-sm text-muted-foreground">Esta semana</p>
              </div>
              <Badge variant="secondary">28</Badge>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-accent rounded-lg">
              <div>
                <p className="font-medium">Destetes Programados</p>
                <p className="text-sm text-muted-foreground">Próximos 10 días</p>
              </div>
              <Badge variant="secondary">45</Badge>
            </div>
            
            <Button variant="outline" className="w-full">
              Ver Calendario Completo
            </Button>
          </CardContent>
        </Card>

        {/* Indicadores de Producción */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-primary" />
              Indicadores del Mes
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Lechones Nacidos Vivos</span>
                <span className="text-2xl font-bold text-success">156</span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Mortalidad (%)</span>
                <span className="text-2xl font-bold text-destructive">2.1%</span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Peso Promedio (kg)</span>
                <span className="text-2xl font-bold text-foreground">95.2</span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Ganancia Diaria (g)</span>
                <span className="text-2xl font-bold text-success">720</span>
              </div>
            </div>
            
            <Button variant="outline" className="w-full">
              <Target className="h-4 w-4 mr-2" />
              Ver Análisis Detallado
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Bottom Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Distribución por Etapa */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Distribución por Etapa</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm">Lactancia</span>
              <Badge variant="outline">234</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Destete</span>
              <Badge variant="outline">156</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Crecimiento</span>
              <Badge variant="outline">298</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Engorde</span>
              <Badge variant="outline">421</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Reproductores</span>
              <Badge variant="outline">138</Badge>
            </div>
          </CardContent>
        </Card>

        {/* Consumo de Alimento */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Utensils className="h-5 w-5" />
              Consumo Semanal
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="text-center">
              <div className="text-3xl font-bold text-primary">2,850 kg</div>
              <p className="text-sm text-muted-foreground">Alimento total</p>
            </div>
            <div className="grid grid-cols-2 gap-4 text-center">
              <div>
                <div className="text-xl font-semibold">1,120 kg</div>
                <p className="text-xs text-muted-foreground">Iniciador</p>
              </div>
              <div>
                <div className="text-xl font-semibold">890 kg</div>
                <p className="text-xs text-muted-foreground">Crecimiento</p>
              </div>
              <div>
                <div className="text-xl font-semibold">620 kg</div>
                <p className="text-xs text-muted-foreground">Engorde</p>
              </div>
              <div>
                <div className="text-xl font-semibold">220 kg</div>
                <p className="text-xs text-muted-foreground">Gestación</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Alertas Rápidas */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-destructive">
              <AlertTriangle className="h-5 w-5" />
              Alertas Activas
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
              <p className="font-medium text-destructive">Tratamiento Vencido</p>
              <p className="text-sm text-muted-foreground">Corral 3B - Revisar</p>
            </div>
            
            <div className="p-3 bg-warning/10 border border-warning/20 rounded-lg">
              <p className="font-medium text-warning">Stock Bajo</p>
              <p className="text-sm text-muted-foreground">Alimento iniciador &lt; 5%</p>
            </div>
            
            <div className="p-3 bg-warning/10 border border-warning/20 rounded-lg">
              <p className="font-medium text-warning">Celo Detectado</p>
              <p className="text-sm text-muted-foreground">Cerda #A241 - Programar</p>
            </div>
            
            <Button size="sm" variant="outline" className="w-full">
              Ver Todas las Alertas
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}