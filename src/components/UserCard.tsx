import { useState } from 'react';
import { MoreVertical, Mail, Phone, MapPin, Calendar, Edit, Trash2 } from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { User, Label } from '@/data/mockUsers';
import { LabelManager } from './LabelManager';

interface UserCardProps {
  user: User;
  onEditUser: (user: User) => void;
  onDeleteUser: (userId: string) => void;
  onUpdateLabels: (userId: string, labels: Label[]) => void;
  availableLabels: Label[];
}

const statusColors = {
  active: 'bg-success text-success-foreground',
  inactive: 'bg-muted text-muted-foreground',
  pending: 'bg-warning text-warning-foreground',
};

const labelColors = {
  blue: 'bg-blue-100 text-blue-800 border-blue-200',
  green: 'bg-green-100 text-green-800 border-green-200',
  yellow: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  purple: 'bg-purple-100 text-purple-800 border-purple-200',
  red: 'bg-red-100 text-red-800 border-red-200',
  gray: 'bg-gray-100 text-gray-800 border-gray-200',
};

export function UserCard({ user, onEditUser, onDeleteUser, onUpdateLabels, availableLabels }: UserCardProps) {
  const [showLabelManager, setShowLabelManager] = useState(false);

  const handleSaveLabels = (newLabels: Label[]) => {
    onUpdateLabels(user.id, newLabels);
    setShowLabelManager(false);
  };

  return (
    <>
      <Card className="bg-gradient-card hover:shadow-md transition-all duration-300 border-border">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-3">
              <Avatar className="w-12 h-12">
                <AvatarImage src={user.avatar} alt={user.name} />
                <AvatarFallback className="bg-primary text-primary-foreground">
                  {user.name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              <div>
                <h3 className="font-semibold text-foreground text-lg">{user.name}</h3>
                <p className="text-muted-foreground text-sm">{user.role} at {user.company}</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Badge className={statusColors[user.status]}>
                {user.status}
              </Badge>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="h-8 w-8 p-0">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="bg-popover">
                  <DropdownMenuItem onClick={() => onEditUser(user)}>
                    <Edit className="mr-2 h-4 w-4" />
                    Edit User
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={() => setShowLabelManager(true)}
                    className="text-primary"
                  >
                    <Edit className="mr-2 h-4 w-4" />
                    Manage Labels
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={() => onDeleteUser(user.id)}
                    className="text-destructive"
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete User
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center text-sm text-muted-foreground">
              <Mail className="w-4 h-4 mr-2" />
              {user.email}
            </div>
            <div className="flex items-center text-sm text-muted-foreground">
              <Phone className="w-4 h-4 mr-2" />
              {user.phone}
            </div>
            <div className="flex items-center text-sm text-muted-foreground">
              <MapPin className="w-4 h-4 mr-2" />
              {user.location}
            </div>
            <div className="flex items-center text-sm text-muted-foreground">
              <Calendar className="w-4 h-4 mr-2" />
              Last contact: {new Date(user.lastContact).toLocaleDateString()}
            </div>
          </div>
          
          {user.labels.length > 0 && (
            <div className="space-y-2">
              <p className="text-sm font-medium text-foreground">Labels:</p>
              <div className="flex flex-wrap gap-2">
                {user.labels.map((label) => (
                  <Badge
                    key={label.id}
                    variant="outline"
                    className={labelColors[label.color]}
                  >
                    {label.name}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <LabelManager
        isOpen={showLabelManager}
        onClose={() => setShowLabelManager(false)}
        currentLabels={user.labels}
        availableLabels={availableLabels}
        onSave={handleSaveLabels}
        userName={user.name}
      />
    </>
  );
}