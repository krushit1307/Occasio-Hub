import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { User, LogOut, UserPlus, LogIn, Search } from 'lucide-react';

interface HeaderProps {
  currentTab: 'vendors' | 'registration' | 'imageUpload';
  onTabChange: (tab: 'vendors' | 'registration' | 'imageUpload') => void;
  searchLocation: string;
  onLocationSearch: (location: string) => void;
}

export const Header = ({ currentTab, onTabChange, searchLocation, onLocationSearch }: HeaderProps) => {
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userEmail, setUserEmail] = useState('');

  const handleSignIn = (formData: FormData) => {
    const email = formData.get('email') as string;
    setUserEmail(email);
    setIsLoggedIn(true);
    setIsAuthOpen(false);
  };

  const handleSignUp = (formData: FormData) => {
    const email = formData.get('email') as string;
    setUserEmail(email);
    setIsLoggedIn(true);
    setIsAuthOpen(false);
  };

  const handleSignOut = () => {
    setIsLoggedIn(false);
    setUserEmail('');
  };

  return (
    <header className="sticky top-0 z-50 glass-effect border-b">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-gradient-primary rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-xl">O</span>
            </div>
            <h1 className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              Occassio
            </h1>
          </div>

          {/* Navigation */}
          <div className="flex items-center space-x-6">
            <Button
              variant={currentTab === 'vendors' ? 'default' : 'ghost'}
              onClick={() => onTabChange('vendors')}
              className="hover-lift"
            >
              Find Vendors
            </Button>
            <Button
              variant={currentTab === 'registration' ? 'default' : 'ghost'}
              onClick={() => onTabChange('registration')}
              className="hover-lift"
            >
              Become a Vendor
            </Button>
            <Button
              variant={currentTab === 'imageUpload' ? 'default' : 'ghost'}
              onClick={() => onTabChange('imageUpload')}
              className="hover-lift"
            >
              Image Upload
            </Button>

            {/* Search Location */}
            {currentTab === 'vendors' && (
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by city..."
                  value={searchLocation}
                  onChange={(e) => onLocationSearch(e.target.value)}
                  className="pl-10 w-64"
                />
              </div>
            )}

            {/* Auth Section */}
            {isLoggedIn ? (
              <div className="flex items-center space-x-2">
                <span className="text-sm text-muted-foreground">{userEmail}</span>
                <Button variant="outline" size="sm" onClick={handleSignOut} className="hover-lift">
                  <LogOut className="h-4 w-4 mr-2" />
                  Sign Out
                </Button>
              </div>
            ) : (
              <Dialog open={isAuthOpen} onOpenChange={setIsAuthOpen}>
                <DialogTrigger asChild>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm" className="hover-lift">
                      <LogIn className="h-4 w-4 mr-2" />
                      Sign In
                    </Button>
                    <Button size="sm" className="hover-lift bg-gradient-primary">
                      <UserPlus className="h-4 w-4 mr-2" />
                      Sign Up
                    </Button>
                  </div>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle>Welcome to Occassio</DialogTitle>
                  </DialogHeader>
                  <Tabs defaultValue="signin" className="w-full">
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="signin">Sign In</TabsTrigger>
                      <TabsTrigger value="signup">Sign Up</TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="signin" className="space-y-4">
                      <form onSubmit={(e) => { e.preventDefault(); handleSignIn(new FormData(e.currentTarget)); }} className="space-y-4">
                        <div>
                          <Label htmlFor="signin-email">Email</Label>
                          <Input id="signin-email" name="email" type="email" required />
                        </div>
                        <div>
                          <Label htmlFor="signin-password">Password</Label>
                          <Input id="signin-password" name="password" type="password" required />
                        </div>
                        <Button type="submit" className="w-full bg-gradient-primary">
                          Sign In
                        </Button>
                      </form>
                    </TabsContent>
                    
                    <TabsContent value="signup" className="space-y-4">
                      <form onSubmit={(e) => { e.preventDefault(); handleSignUp(new FormData(e.currentTarget)); }} className="space-y-4">
                        <div>
                          <Label htmlFor="signup-name">Full Name</Label>
                          <Input id="signup-name" name="name" required />
                        </div>
                        <div>
                          <Label htmlFor="signup-email">Email</Label>
                          <Input id="signup-email" name="email" type="email" required />
                        </div>
                        <div>
                          <Label htmlFor="signup-phone">Phone Number</Label>
                          <Input id="signup-phone" name="phone" placeholder="+91" required />
                        </div>
                        <div>
                          <Label htmlFor="signup-password">Password</Label>
                          <Input id="signup-password" name="password" type="password" required />
                        </div>
                        <Button type="submit" className="w-full bg-gradient-primary">
                          Create Account
                        </Button>
                      </form>
                    </TabsContent>
                  </Tabs>
                </DialogContent>
              </Dialog>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};