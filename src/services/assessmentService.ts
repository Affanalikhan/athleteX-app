import { AssessmentTest, TestType } from '../models';

class AssessmentService {
  private readonly ASSESSMENTS_KEY = 'athletex_assessments';

  // Dummy AI scoring function
  private calculateScore(testType: TestType, videoFile: File): number {
    // This is a simplified dummy scoring algorithm
    // In a real application, this would involve AI/ML processing
    
    const baseScores = {
      [TestType.SPEED]: Math.random() * 30 + 60, // 60-90 score
      [TestType.AGILITY]: Math.random() * 25 + 55, // 55-80 score
      [TestType.STRENGTH]: Math.random() * 35 + 50, // 50-85 score
      [TestType.ENDURANCE]: Math.random() * 40 + 45, // 45-85 score
      [TestType.FLEXIBILITY]: Math.random() * 35 + 40, // 40-75 score
      [TestType.BALANCE]: Math.random() * 30 + 50, // 50-80 score
    };

    // Add some variation based on file size (simulating analysis)
    const sizeVariation = (videoFile.size / (1024 * 1024)) * 0.5; // MB to variation
    
    return Math.round((baseScores[testType] + sizeVariation) * 100) / 100;
  }

  async uploadVideo(athleteId: string, testType: TestType, videoFile: File): Promise<string> {
    // For demo purposes, create a blob URL that can be used to display the video
    const videoUrl = URL.createObjectURL(videoFile);
    return videoUrl;
  }

  async createAssessment(
    athleteId: string, 
    testType: TestType, 
    videoFile: File, 
    notes: string = ''
  ): Promise<AssessmentTest> {
    // Upload video (demo version - just creates blob URL)
    const videoUrl = await this.uploadVideo(athleteId, testType, videoFile);

    // Calculate dummy AI score
    const score = this.calculateScore(testType, videoFile);

    // Create assessment document
    const id = this.generateId();
    const assessment: AssessmentTest = {
      id,
      athleteId,
      testType,
      videoUrl,
      score,
      timestamp: new Date(),
      notes
    };

    const assessments = this.getAssessments();
    assessments.push(assessment);
    this.setAssessments(assessments);

    return assessment;
  }

  async getAthleteAssessments(athleteId: string): Promise<AssessmentTest[]> {
    const assessments = this.getAssessments();
    return assessments
      .filter(a => a.athleteId === athleteId)
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  }

  async getAllAssessments(): Promise<AssessmentTest[]> {
    const assessments = this.getAssessments();
    return assessments.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  }

  async getAssessmentById(assessmentId: string): Promise<AssessmentTest | null> {
    const assessments = this.getAssessments();
    return assessments.find(a => a.id === assessmentId) || null;
  }

  async updateAssessmentNotes(assessmentId: string, notes: string): Promise<void> {
    const assessments = this.getAssessments();
    const index = assessments.findIndex(a => a.id === assessmentId);
    if (index >= 0) {
      assessments[index] = { ...assessments[index], notes };
      this.setAssessments(assessments);
    }
  }

  getScoreDisplayText(testType: TestType, score: number): string {
    // For the new fitness-based tests, scores are percentages or ratings
    return `${Math.round(score)}/100`;
  }

  // Helper methods
  private getAssessments(): AssessmentTest[] {
    try {
      const stored = localStorage.getItem(this.ASSESSMENTS_KEY);
      return stored ? JSON.parse(stored).map((a: any) => ({
        ...a,
        timestamp: new Date(a.timestamp)
      })) : [];
    } catch {
      return [];
    }
  }

  private setAssessments(assessments: AssessmentTest[]): void {
    localStorage.setItem(this.ASSESSMENTS_KEY, JSON.stringify(assessments));
  }

  private generateId(): string {
    return 'asmt_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }
}

const assessmentService = new AssessmentService();
export default assessmentService;
