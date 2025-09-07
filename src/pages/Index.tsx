import { useState, useMemo } from 'react';
import { CRMHeader } from '@/components/CRMHeader';
import { UserCard } from '@/components/UserCard';
import { FilterPanel, FilterOptions } from '@/components/FilterPanel';
import { mockUsers, mockLabels, User, Label } from '@/data/mockUsers';
import { toast } from '@/hooks/use-toast';

const Index = () => {
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [labels, setLabels] = useState<Label[]>(mockLabels);
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<FilterOptions>({
    status: [],
    labels: [],
    company: '',
    role: '',
    dateRange: { from: '', to: '' }
  });

  // TODO: Backend Integration - Replace with API call
  // const fetchUsers = async () => {
  //   const response = await api.getUsers({ search: searchTerm, filters });
  //   setUsers(response.data);
  // };

  // Advanced filtering logic
  const filteredUsers = useMemo(() => {
    let filtered = users;

    // Search term filter
    if (searchTerm) {
      filtered = filtered.filter(user => 
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.labels.some(label => label.name.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Status filter
    if (filters.status.length > 0) {
      filtered = filtered.filter(user => filters.status.includes(user.status));
    }

    // Labels filter
    if (filters.labels.length > 0) {
      filtered = filtered.filter(user => 
        user.labels.some(label => filters.labels.includes(label.id))
      );
    }

    // Company filter
    if (filters.company) {
      filtered = filtered.filter(user => 
        user.company.toLowerCase().includes(filters.company.toLowerCase())
      );
    }

    // Role filter
    if (filters.role) {
      filtered = filtered.filter(user => 
        user.role.toLowerCase().includes(filters.role.toLowerCase())
      );
    }

    // Date range filter
    if (filters.dateRange.from || filters.dateRange.to) {
      filtered = filtered.filter(user => {
        const userDate = new Date(user.lastContact);
        const fromDate = filters.dateRange.from ? new Date(filters.dateRange.from) : null;
        const toDate = filters.dateRange.to ? new Date(filters.dateRange.to) : null;

        if (fromDate && userDate < fromDate) return false;
        if (toDate && userDate > toDate) return false;
        return true;
      });
    }

    return filtered;
  }, [users, searchTerm, filters]);

  const handleAddUser = () => {
    // TODO: Backend Integration - API call to create user
    // const newUser = await api.createUser(userData);
    // setUsers([...users, newUser]);
    toast({
      title: "Add User",
      description: "User creation form would open here. Backend integration needed.",
    });
  };

  const handleEditUser = (user: User) => {
    // TODO: Backend Integration - API call to update user
    // const updatedUser = await api.updateUser(user.id, userData);
    // setUsers(users.map(u => u.id === user.id ? updatedUser : u));
    toast({
      title: "Edit User",
      description: `Editing ${user.name}. Integration with user management system needed.`,
    });
  };

  const handleDeleteUser = (userId: string) => {
    const user = users.find(u => u.id === userId);
    // TODO: Backend Integration - API call to delete user
    // await api.deleteUser(userId);
    setUsers(users.filter(u => u.id !== userId));
    toast({
      title: "User Deleted",
      description: `${user?.name} has been removed from the system.`,
      variant: "destructive",
    });
  };

  const handleUpdateLabels = (userId: string, newLabels: Label[]) => {
    // TODO: Backend Integration - API call to update user labels
    // await api.updateUserLabels(userId, newLabels);
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
  };

  const handleFiltersChange = (newFilters: FilterOptions) => {
    setFilters(newFilters);
    // TODO: Backend Integration - Send filter parameters to API
    // const filteredUsers = await api.getUsers({ search: searchTerm, filters: newFilters });
    // setUsers(filteredUsers);
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

      <FilterPanel
        isOpen={showFilters}
        onClose={() => setShowFilters(false)}
        filters={filters}
        onFiltersChange={handleFiltersChange}
        availableLabels={labels}
      />
    </div>
  );
};

export default Index;