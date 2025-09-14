import { Athlete } from '../models';

class AthleteService {
  private readonly ATHLETES_KEY = 'athletex_athletes';

  async createProfile(userId: string, athleteData: Partial<Athlete>): Promise<Athlete> {
    const athlete: Athlete = {
      id: userId,
      name: '',
      email: '',
      phoneNumber: '',
      age: 0,
      gender: 'other' as const,
      weight: 0,
      height: 0,
      sportsPlayed: [],
      country: '',
      state: '',
      city: '',
      pinCode: '',
      profilePictureUrl: '',
      createdAt: new Date(),
      updatedAt: new Date(),
      ...athleteData
    };

    const athletes = this.getAthletes();
    const existingIndex = athletes.findIndex(a => a.id === userId);
    
    if (existingIndex >= 0) {
      athletes[existingIndex] = athlete;
    } else {
      athletes.push(athlete);
    }
    
    this.setAthletes(athletes);
    return athlete;
  }

  async getProfile(userId: string): Promise<Athlete | null> {
    const athletes = this.getAthletes();
    const athlete = athletes.find(a => a.id === userId);
    return athlete || null;
  }

  async updateProfile(userId: string, updates: Partial<Athlete>): Promise<void> {
    const athletes = this.getAthletes();
    const index = athletes.findIndex(a => a.id === userId);
    
    if (index >= 0) {
      athletes[index] = {
        ...athletes[index],
        ...updates,
        updatedAt: new Date()
      };
      this.setAthletes(athletes);
    }
  }

  async uploadProfilePicture(userId: string, file: File): Promise<string> {
    // For demo purposes, create a data URL from the file
    const dataURL = await this.fileToDataURL(file);
    await this.updateProfile(userId, { profilePictureUrl: dataURL });
    return dataURL;
  }

  async deleteProfilePicture(userId: string): Promise<void> {
    await this.updateProfile(userId, { profilePictureUrl: '' });
  }

  async getAllAthletes(): Promise<Athlete[]> {
    return this.getAthletes();
  }

  async getAthleteById(athleteId: string): Promise<Athlete | null> {
    const athletes = this.getAthletes();
    return athletes.find(a => a.id === athleteId) || null;
  }

  // Helper methods
  private getAthletes(): Athlete[] {
    try {
      const stored = localStorage.getItem(this.ATHLETES_KEY);
      return stored ? JSON.parse(stored).map((a: any) => ({
        ...a,
        createdAt: new Date(a.createdAt),
        updatedAt: new Date(a.updatedAt)
      })) : [];
    } catch {
      return [];
    }
  }

  private setAthletes(athletes: Athlete[]): void {
    localStorage.setItem(this.ATHLETES_KEY, JSON.stringify(athletes));
  }

  private fileToDataURL(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }
}

const athleteService = new AthleteService();
export default athleteService;
