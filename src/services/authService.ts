import { User } from '../models';

class AuthService {
  private readonly CURRENT_USER_KEY = 'athletex_current_user';

  // Super simple login - any username/password works
  async signUp(email: string, password: string, displayName: string): Promise<User> {
    const uid = this.generateId();
    const user: User = {
      id: uid,
      uid,
      email: email || 'user@example.com',
      displayName: displayName || 'User',
      role: 'athlete'
    };
    
    this.setCurrentUser(user);
    return user;
  }

  async signIn(email: string, password: string): Promise<User> {
    // Accept any login credentials
    const uid = this.generateId();
    const user: User = {
      id: uid,
      uid,
      email: email || 'user@example.com',
      displayName: email.split('@')[0] || 'User',
      role: 'athlete'
    };
    
    this.setCurrentUser(user);
    return user;
  }

  async signOut(): Promise<void> {
    localStorage.removeItem(this.CURRENT_USER_KEY);
  }

  setupRecaptcha(): void {
    // no-op
  }

  async sendOTP(phoneNumber: string): Promise<void> {
    // no-op - just pretend it worked
  }

  async verifyOTP(otp: string, displayName: string): Promise<User> {
    // Accept any OTP
    const uid = this.generateId();
    const user: User = {
      id: uid,
      uid,
      email: '',
      displayName: displayName || 'Phone User',
      role: 'athlete'
    };
    
    this.setCurrentUser(user);
    return user;
  }

  async getCurrentUser(): Promise<User | null> {
    return this.getCurrent();
  }

  onAuthStateChanged(callback: (user: User | null) => void): () => void {
    const user = this.getCurrent();
    callback(user);
    return () => {};
  }

  // Helper methods
  private setCurrentUser(user: User): void {
    localStorage.setItem(this.CURRENT_USER_KEY, JSON.stringify(user));
  }

  private getCurrent(): User | null {
    try {
      const stored = localStorage.getItem(this.CURRENT_USER_KEY);
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  }

  private generateId(): string {
    return 'user_' + Math.random().toString(36).substr(2, 9);
  }
}

const authService = new AuthService();
export default authService;
