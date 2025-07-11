import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { 
  PiggyBank, 
  Calendar,
  TrendingUp,
  Stethoscope,
  BarChart3,
  Home,
  Plus,
  Bell
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface NavigationProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
}

const navigationItems = [
  { id: 'dashboard', label: 'Dashboard', icon: Home },
  { id: 'inventario', label: 'Inventario', icon: PiggyBank },
  { id: 'reproductivo', label: 'Reproductivo', icon: Calendar },
  { id: 'engorde', label: 'Engorde', icon: TrendingUp },
  { id: 'sanidad', label: 'Sanidad', icon: Stethoscope },
  { id: 'reportes', label: 'Reportes', icon: BarChart3 },
];

export function Navigation({ activeSection, onSectionChange }: NavigationProps) {
  return (
    <nav className="w-64 bg-card border-r border-border h-screen flex flex-col">
      <div className="p-6 border-b border-border">
        <h1 className="text-2xl font-bold text-primary flex items-center gap-2">
          <PiggyBank className="h-8 w-8" />
          PorciSoft
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Gestión Porcina Integral
        </p>
      </div>

      <div className="p-4 border-b border-border">
        <Button className="w-full" size="sm">
          <Plus className="h-4 w-4 mr-2" />
          Nuevo Registro
        </Button>
      </div>

      <div className="flex-1 p-4">
        <div className="space-y-1">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeSection === item.id;
            
            return (
              <Button
                key={item.id}
                variant={isActive ? "default" : "ghost"}
                className={cn(
                  "w-full justify-start",
                  isActive && "bg-gradient-to-r from-primary to-primary/80"
                )}
                onClick={() => onSectionChange(item.id)}
              >
                <Icon className="h-4 w-4 mr-3" />
                {item.label}
                {item.id === 'reproductivo' && (
                  <Badge variant="secondary" className="ml-auto">
                    3
                  </Badge>
                )}
              </Button>
            );
          })}
        </div>
      </div>

      <div className="p-4 border-t border-border">
        <div className="flex items-center gap-3 p-3 bg-accent rounded-lg">
          <div className="h-10 w-10 bg-primary rounded-full flex items-center justify-center">
            <span className="text-primary-foreground font-semibold">JR</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">Juan Rodríguez</p>
            <p className="text-xs text-muted-foreground">Administrador</p>
          </div>
          <Button variant="ghost" size="sm">
            <Bell className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </nav>
  );
}