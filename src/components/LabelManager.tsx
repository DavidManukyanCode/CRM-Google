import { useState, useEffect } from 'react';
import { X, Plus, Check } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Label as LabelType } from '@/data/mockUsers';

interface LabelManagerProps {
  isOpen: boolean;
  onClose: () => void;
  currentLabels: LabelType[];
  availableLabels: LabelType[];
  onSave: (labels: LabelType[]) => void;
  userName: string;
}

const labelColors = ['blue', 'green', 'yellow', 'purple', 'red', 'gray'] as const;

const colorStyles = {
  blue: 'bg-blue-100 text-blue-800 border-blue-200 hover:bg-blue-200',
  green: 'bg-green-100 text-green-800 border-green-200 hover:bg-green-200',
  yellow: 'bg-yellow-100 text-yellow-800 border-yellow-200 hover:bg-yellow-200',
  purple: 'bg-purple-100 text-purple-800 border-purple-200 hover:bg-purple-200',
  red: 'bg-red-100 text-red-800 border-red-200 hover:bg-red-200',
  gray: 'bg-gray-100 text-gray-800 border-gray-200 hover:bg-gray-200',
};

export function LabelManager({ 
  isOpen, 
  onClose, 
  currentLabels, 
  availableLabels, 
  onSave, 
  userName 
}: LabelManagerProps) {
  const [selectedLabels, setSelectedLabels] = useState<LabelType[]>(currentLabels);
  const [newLabelName, setNewLabelName] = useState('');
  const [newLabelColor, setNewLabelColor] = useState<typeof labelColors[number]>('blue');
  const [showCreateForm, setShowCreateForm] = useState(false);

  useEffect(() => {
    setSelectedLabels(currentLabels);
  }, [currentLabels, isOpen]);

  const toggleLabel = (label: LabelType) => {
    const isSelected = selectedLabels.find(l => l.id === label.id);
    if (isSelected) {
      setSelectedLabels(selectedLabels.filter(l => l.id !== label.id));
    } else {
      setSelectedLabels([...selectedLabels, label]);
    }
  };

  const createNewLabel = () => {
    if (newLabelName.trim()) {
      const newLabel: LabelType = {
        id: Date.now().toString(),
        name: newLabelName.trim(),
        color: newLabelColor,
      };
      setSelectedLabels([...selectedLabels, newLabel]);
      setNewLabelName('');
      setShowCreateForm(false);
    }
  };

  const handleSave = () => {
    onSave(selectedLabels);
  };

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-card">
        <DialogHeader>
          <DialogTitle className="text-foreground">
            Manage Labels for {userName}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Available Labels */}
          <div>
            <Label className="text-sm font-medium text-foreground mb-3 block">
              Available Labels
            </Label>
            <div className="grid grid-cols-2 gap-2">
              {availableLabels.map((label) => {
                const isSelected = selectedLabels.find(l => l.id === label.id);
                return (
                  <Badge
                    key={label.id}
                    variant="outline"
                    className={`cursor-pointer transition-all ${colorStyles[label.color]} ${
                      isSelected ? 'ring-2 ring-primary' : ''
                    }`}
                    onClick={() => toggleLabel(label)}
                  >
                    <span className="flex items-center gap-2">
                      {isSelected && <Check className="w-3 h-3" />}
                      {label.name}
                    </span>
                  </Badge>
                );
              })}
            </div>
          </div>

          {/* Create New Label */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <Label className="text-sm font-medium text-foreground">
                Create New Label
              </Label>
              {!showCreateForm && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowCreateForm(true)}
                  className="border-border hover:bg-secondary-hover"
                >
                  <Plus className="w-4 h-4 mr-1" />
                  New
                </Button>
              )}
            </div>
            
            {showCreateForm && (
              <div className="space-y-3 p-4 bg-muted rounded-lg">
                <Input
                  placeholder="Label name"
                  value={newLabelName}
                  onChange={(e) => setNewLabelName(e.target.value)}
                  className="bg-background"
                />
                <div className="flex items-center gap-2">
                  <Label className="text-sm">Color:</Label>
                  <div className="flex gap-1">
                    {labelColors.map((color) => (
                      <button
                        key={color}
                        className={`w-6 h-6 rounded-full border-2 ${
                          newLabelColor === color ? 'border-foreground' : 'border-border'
                        } ${colorStyles[color].split(' ')[0]}`}
                        onClick={() => setNewLabelColor(color)}
                      />
                    ))}
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" onClick={createNewLabel} className="bg-primary hover:bg-primary-hover">
                    Create
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    onClick={() => setShowCreateForm(false)}
                    className="border-border hover:bg-secondary-hover"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* Selected Labels Preview */}
          {selectedLabels.length > 0 && (
            <div>
              <Label className="text-sm font-medium text-foreground mb-3 block">
                Selected Labels ({selectedLabels.length})
              </Label>
              <div className="flex flex-wrap gap-2">
                {selectedLabels.map((label) => (
                  <Badge
                    key={label.id}
                    variant="outline"
                    className={`${colorStyles[label.color]} cursor-pointer`}
                    onClick={() => toggleLabel(label)}
                  >
                    <span className="flex items-center gap-1">
                      {label.name}
                      <X className="w-3 h-3" />
                    </span>
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t border-border">
            <Button variant="outline" onClick={onClose} className="border-border hover:bg-secondary-hover">
              Cancel
            </Button>
            <Button onClick={handleSave} className="bg-primary hover:bg-primary-hover text-primary-foreground">
              Save Labels
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}