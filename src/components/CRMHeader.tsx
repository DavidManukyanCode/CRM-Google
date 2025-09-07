import { Search, Plus, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface CRMHeaderProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  onAddUser: () => void;
  onToggleFilters: () => void;
  totalUsers: number;
}

export function CRMHeader({ 
  searchTerm, 
  onSearchChange, 
  onAddUser, 
  onToggleFilters, 
  totalUsers 
}: CRMHeaderProps) {
  return (
    <header className="bg-card border-b border-border p-6 shadow-sm">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold text-foreground">CRM Dashboard</h1>
            <p className="text-muted-foreground mt-1">
              Manage your customer relationships effectively
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button onClick={onAddUser} className="bg-primary hover:bg-primary-hover text-primary-foreground">
              <Plus className="w-4 h-4 mr-2" />
              Add User
            </Button>
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 items-center">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex items-center gap-3">
            <Button 
              variant="outline" 
              onClick={onToggleFilters}
              className="border-border hover:bg-secondary-hover"
            >
              <Filter className="w-4 h-4 mr-2" />
              Filters
            </Button>
            <span className="text-sm text-muted-foreground">
              {totalUsers} users total
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}