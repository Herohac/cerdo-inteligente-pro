import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Stethoscope, 
  Shield, 
  Calendar, 
  AlertTriangle,
  Syringe,
  Pill
} from "lucide-react";

export function SanidadView() {
  return (
    <div className="p-6 space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Control Sanitario</h1>
        <p className="text-muted-foreground">Plan sanitario y registro de tratamientos</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Shield className="h-8 w-8 text-success" />
              <div>
                <div className="text-2xl font-bold text-success">12</div>
                <p className="text-sm text-muted-foreground">Vacunas Aplicadas</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Syringe className="h-8 w-8 text-warning" />
              <div>
                <div className="text-2xl font-bold text-warning">5</div>
                <p className="text-sm text-muted-foreground">Tratamientos Activos</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <AlertTriangle className="h-8 w-8 text-destructive" />
              <div>
                <div className="text-2xl font-bold text-destructive">2</div>
                <p className="text-sm text-muted-foreground">Alertas Pendientes</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Plan de Vacunación</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="p-3 bg-accent rounded-lg">
                <div className="flex justify-between items-center">
                  <div>
                    <span className="font-medium">Cólera Porcino</span>
                    <p className="text-sm text-muted-foreground">Próxima aplicación</p>
                  </div>
                  <Badge variant="secondary">Jul 25</Badge>
                </div>
              </div>
              <div className="p-3 bg-accent rounded-lg">
                <div className="flex justify-between items-center">
                  <div>
                    <span className="font-medium">Desparasitación</span>
                    <p className="text-sm text-muted-foreground">Lote L-2024-001</p>
                  </div>
                  <Badge variant="outline">Jul 30</Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Tratamientos Recientes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="p-3 border rounded-lg">
                <div className="flex justify-between">
                  <span className="font-medium">Antibiótico - Cerda H001</span>
                  <Badge variant="default">Activo</Badge>
                </div>
                <p className="text-sm text-muted-foreground">Periodo resguardo: 5 días</p>
              </div>
              <div className="p-3 border rounded-lg">
                <div className="flex justify-between">
                  <span className="font-medium">Vitaminas - Lote L-2024-002</span>
                  <Badge variant="secondary">Completado</Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}