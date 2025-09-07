import { useState, useMemo } from 'react';
import { CRMHeader } from '@/components/CRMHeader';
import { UserCard } from '@/components/UserCard';
import { mockUsers, mockLabels, User, Label } from '@/data/mockUsers';
import { toast } from '@/hooks/use-toast';

const Index = () => {
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [labels, setLabels] = useState<Label[]>(mockLabels);
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  // Filter users based on search term
  const filteredUsers = useMemo(() => {
    if (!searchTerm) return users;
    
    return users.filter(user => 
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.labels.some(label => label.name.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  }, [users, searchTerm]);

  const handleAddUser = () => {
    toast({
      title: "Add User",
      description: "User creation form would open here. Backend integration needed.",
    });
  };

  const handleEditUser = (user: User) => {
    toast({
      title: "Edit User",
      description: `Editing ${user.name}. Integration with user management system needed.`,
    });
  };

  const handleDeleteUser = (userId: string) => {
    const user = users.find(u => u.id === userId);
    setUsers(users.filter(u => u.id !== userId));
    toast({
      title: "User Deleted",
      description: `${user?.name} has been removed from the system.`,
      variant: "destructive",
    });
  };

  const handleUpdateLabels = (userId: string, newLabels: Label[]) => {
    setUsers(users.map(user => 
      user.id === userId 
        ? { ...user, labels: newLabels }
        : user
    ));
    
    // Add any new labels to the global labels list
    const existingLabelIds = labels.map(l => l.id);
    const newGlobalLabels = newLabels.filter(label => !existingLabelIds.includes(label.id));
    if (newGlobalLabels.length > 0) {
      setLabels([...labels, ...newGlobalLabels]);
    }

    toast({
      title: "Labels Updated",
      description: "User labels have been successfully updated.",
    });
  };

  const handleToggleFilters = () => {
    setShowFilters(!showFilters);
    toast({
      title: "Filters",
      description: "Advanced filtering options would be implemented here.",
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <CRMHeader
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        onAddUser={handleAddUser}
        onToggleFilters={handleToggleFilters}
        totalUsers={users.length}
      />
      
      <main className="max-w-7xl mx-auto p-6">
        {filteredUsers.length === 0 ? (
          <div className="text-center py-12">
            <div className="bg-muted rounded-lg p-8 max-w-md mx-auto">
              <h3 className="text-lg font-semibold text-foreground mb-2">No users found</h3>
              <p className="text-muted-foreground mb-4">
                {searchTerm ? 'Try adjusting your search criteria.' : 'Get started by adding your first user.'}
              </p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredUsers.map((user) => (
              <UserCard
                key={user.id}
                user={user}
                onEditUser={handleEditUser}
                onDeleteUser={handleDeleteUser}
                onUpdateLabels={handleUpdateLabels}
                availableLabels={labels}
              />
            ))}
          </div>
        )}
        
        {filteredUsers.length > 0 && (
          <div className="mt-8 text-center text-muted-foreground">
            Showing {filteredUsers.length} of {users.length} users
          </div>
        )}
      </main>
    </div>
  );
};

export default Index;