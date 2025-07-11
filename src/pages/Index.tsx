import { useState } from "react";
import { Navigation } from "@/components/ui/navigation";
import { DashboardView } from "@/components/dashboard/DashboardView";

const Index = () => {
  const [activeSection, setActiveSection] = useState('dashboard');

  const renderContent = () => {
    switch (activeSection) {
      case 'dashboard':
        return <DashboardView />;
      case 'inventario':
        return (
          <div className="p-6">
            <h1 className="text-3xl font-bold mb-4">Gestión de Inventario Animal</h1>
            <p className="text-muted-foreground">Módulo en desarrollo - Fichas individuales, trazabilidad y movimientos</p>
          </div>
        );
      case 'reproductivo':
        return (
          <div className="p-6">
            <h1 className="text-3xl font-bold mb-4">Control Reproductivo</h1>
            <p className="text-muted-foreground">Módulo en desarrollo - Ciclos, alertas y análisis de productividad</p>
          </div>
        );
      case 'engorde':
        return (
          <div className="p-6">
            <h1 className="text-3xl font-bold mb-4">Engorde y Nutrición</h1>
            <p className="text-muted-foreground">Módulo en desarrollo - Lotes, ICA y registro de alimentación</p>
          </div>
        );
      case 'sanidad':
        return (
          <div className="p-6">
            <h1 className="text-3xl font-bold mb-4">Control Sanitario</h1>
            <p className="text-muted-foreground">Módulo en desarrollo - Plan sanitario y registro de tratamientos</p>
          </div>
        );
      case 'reportes':
        return (
          <div className="p-6">
            <h1 className="text-3xl font-bold mb-4">Reportes y Análisis</h1>
            <p className="text-muted-foreground">Módulo en desarrollo - Costos, rentabilidad y dashboards</p>
          </div>
        );
      default:
        return <DashboardView />;
    }
  };

  return (
    <div className="min-h-screen bg-background flex">
      <Navigation 
        activeSection={activeSection} 
        onSectionChange={setActiveSection} 
      />
      <main className="flex-1 overflow-auto">
        {renderContent()}
      </main>
    </div>
  );
};

export default Index;
