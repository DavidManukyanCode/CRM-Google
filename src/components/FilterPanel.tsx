import { useState } from 'react';
import { X, Calendar, User, Building } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Label as UserLabel } from '@/data/mockUsers';

export interface FilterOptions {
  status: string[];
  labels: string[];
  company: string;
  role: string;
  dateRange: {
    from: string;
    to: string;
  };
}

interface FilterPanelProps {
  isOpen: boolean;
  onClose: () => void;
  filters: FilterOptions;
  onFiltersChange: (filters: FilterOptions) => void;
  availableLabels: UserLabel[];
  // TODO: Backend Integration - These would come from API calls
  availableCompanies?: string[];
  availableRoles?: string[];
}

const statusOptions = [
  { value: 'active', label: 'Active', color: 'bg-success' },
  { value: 'inactive', label: 'Inactive', color: 'bg-muted' },
  { value: 'pending', label: 'Pending', color: 'bg-warning' },
];

export function FilterPanel({ 
  isOpen, 
  onClose, 
  filters, 
  onFiltersChange,
  availableLabels,
  availableCompanies = [], // TODO: Backend Integration - Fetch from API
  availableRoles = [] // TODO: Backend Integration - Fetch from API
}: FilterPanelProps) {
  const [localFilters, setLocalFilters] = useState<FilterOptions>(filters);

  if (!isOpen) return null;

  const handleStatusChange = (status: string) => {
    const newStatus = localFilters.status.includes(status)
      ? localFilters.status.filter(s => s !== status)
      : [...localFilters.status, status];
    
    setLocalFilters({ ...localFilters, status: newStatus });
  };

  const handleLabelChange = (labelId: string) => {
    const newLabels = localFilters.labels.includes(labelId)
      ? localFilters.labels.filter(l => l !== labelId)
      : [...localFilters.labels, labelId];
    
    setLocalFilters({ ...localFilters, labels: newLabels });
  };

  const handleApplyFilters = () => {
    // TODO: Backend Integration - Send filter request to API
    // const filteredUsers = await api.getUsers(localFilters);
    onFiltersChange(localFilters);
    onClose();
  };

  const handleClearFilters = () => {
    const emptyFilters: FilterOptions = {
      status: [],
      labels: [],
      company: '',
      role: '',
      dateRange: { from: '', to: '' }
    };
    setLocalFilters(emptyFilters);
    onFiltersChange(emptyFilters);
  };

  return (
    <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm">
      <div className="fixed right-0 top-0 h-full w-full max-w-md border-l bg-background shadow-lg">
        <Card className="h-full rounded-none border-0">
          <CardHeader className="border-b">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Advanced Filters
              </CardTitle>
              <Button variant="ghost" size="sm" onClick={onClose}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          
          <CardContent className="space-y-6 p-6 overflow-y-auto">
            {/* Status Filter */}
            <div className="space-y-3">
              <Label className="text-sm font-medium">Status</Label>
              <div className="flex flex-wrap gap-2">
                {statusOptions.map((status) => (
                  <Button
                    key={status.value}
                    variant={localFilters.status.includes(status.value) ? "default" : "outline"}
                    size="sm"
                    onClick={() => handleStatusChange(status.value)}
                    className="text-xs"
                  >
                    <div className={`w-2 h-2 rounded-full mr-2 ${status.color}`} />
                    {status.label}
                  </Button>
                ))}
              </div>
            </div>

            <Separator />

            {/* Labels Filter */}
            <div className="space-y-3">
              <Label className="text-sm font-medium">Labels</Label>
              <div className="flex flex-wrap gap-2">
                {availableLabels.map((label) => (
                  <Button
                    key={label.id}
                    variant={localFilters.labels.includes(label.id) ? "default" : "outline"}
                    size="sm"
                    onClick={() => handleLabelChange(label.id)}
                    className="text-xs"
                  >
                    {label.name}
                  </Button>
                ))}
              </div>
            </div>

            <Separator />

            {/* Company Filter */}
            <div className="space-y-3">
              <Label className="text-sm font-medium">Company</Label>
              <Input
                placeholder="Filter by company..."
                value={localFilters.company}
                onChange={(e) => setLocalFilters({ 
                  ...localFilters, 
                  company: e.target.value 
                })}
              />
              {/* TODO: Backend Integration - Replace with Select for available companies */}
              {/* <Select
                value={localFilters.company}
                onValueChange={(value) => setLocalFilters({ ...localFilters, company: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select company..." />
                </SelectTrigger>
                <SelectContent>
                  {availableCompanies.map((company) => (
                    <SelectItem key={company} value={company}>
                      {company}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select> */}
            </div>

            <Separator />

            {/* Role Filter */}
            <div className="space-y-3">
              <Label className="text-sm font-medium">Role</Label>
              <Input
                placeholder="Filter by role..."
                value={localFilters.role}
                onChange={(e) => setLocalFilters({ 
                  ...localFilters, 
                  role: e.target.value 
                })}
              />
              {/* TODO: Backend Integration - Replace with Select for available roles */}
            </div>

            <Separator />

            {/* Date Range Filter */}
            <div className="space-y-3">
              <Label className="text-sm font-medium flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Last Contact Date Range
              </Label>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label className="text-xs text-muted-foreground">From</Label>
                  <Input
                    type="date"
                    value={localFilters.dateRange.from}
                    onChange={(e) => setLocalFilters({
                      ...localFilters,
                      dateRange: { ...localFilters.dateRange, from: e.target.value }
                    })}
                  />
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">To</Label>
                  <Input
                    type="date"
                    value={localFilters.dateRange.to}
                    onChange={(e) => setLocalFilters({
                      ...localFilters,
                      dateRange: { ...localFilters.dateRange, to: e.target.value }
                    })}
                  />
                </div>
              </div>
            </div>
          </CardContent>

          {/* Action Buttons */}
          <div className="border-t p-4 space-y-2">
            <Button 
              onClick={handleApplyFilters}
              className="w-full"
            >
              Apply Filters
            </Button>
            <Button 
              variant="outline"
              onClick={handleClearFilters}
              className="w-full"
            >
              Clear All Filters
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}