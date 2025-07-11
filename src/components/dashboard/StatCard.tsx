import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  variant?: 'default' | 'success' | 'warning' | 'destructive';
}

export function StatCard({ 
  title, 
  value, 
  description, 
  icon: Icon, 
  trend,
  variant = 'default' 
}: StatCardProps) {
  const variantClasses = {
    default: 'border-border',
    success: 'border-success/20 bg-success/5',
    warning: 'border-warning/20 bg-warning/5',
    destructive: 'border-destructive/20 bg-destructive/5'
  };

  const iconVariantClasses = {
    default: 'text-muted-foreground',
    success: 'text-success',
    warning: 'text-warning',
    destructive: 'text-destructive'
  };

  return (
    <Card className={cn('transition-all hover:shadow-md', variantClasses[variant])}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <Icon className={cn('h-5 w-5', iconVariantClasses[variant])} />
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold text-foreground">{value}</div>
        {description && (
          <p className="text-xs text-muted-foreground mt-1">
            {description}
          </p>
        )}
        {trend && (
          <div className={cn(
            "text-xs font-medium mt-2 flex items-center gap-1",
            trend.isPositive ? "text-success" : "text-destructive"
          )}>
            <span>{trend.isPositive ? '↗' : '↘'}</span>
            {Math.abs(trend.value)}% vs mes anterior
          </div>
        )}
      </CardContent>
    </Card>
  );
}