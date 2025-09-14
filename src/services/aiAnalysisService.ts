import { TestType, SportType, AssessmentTest } from '../models';

interface AIInsight {
  category: 'strength' | 'weakness' | 'improvement' | 'risk';
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  icon: string;
}

interface PerformanceMetrics {
  overallRating: 'excellent' | 'good' | 'average' | 'below_average' | 'poor';
  percentile: number;
  strengths: string[];
  weaknesses: string[];
  riskFactors: string[];
}

interface TrainingRecommendation {
  category: 'strength' | 'flexibility' | 'endurance' | 'technique' | 'recovery';
  title: string;
  description: string;
  exercises: string[];
  priority: 'high' | 'medium' | 'low';
  duration: string;
}

interface AssessmentAnalysis {
  insights: AIInsight[];
  performanceMetrics: PerformanceMetrics;
  recommendations: TrainingRecommendation[];
  progressTracking: {
    currentScore: number;
    previousScore?: number;
    improvement: number;
    trend: 'improving' | 'declining' | 'stable';
  };
  benchmarkComparison: {
    peerAverage: number;
    sportAverage: number;
    eliteLevel: number;
  };
}

class AIAnalysisService {
  private getPerformanceRating(score: number): PerformanceMetrics['overallRating'] {
    if (score >= 90) return 'excellent';
    if (score >= 75) return 'good';
    if (score >= 60) return 'average';
    if (score >= 45) return 'below_average';
    return 'poor';
  }

  private calculatePercentile(score: number, testType: TestType): number {
    // Simulated percentile calculation based on test type and score
    const basePercentile = Math.min(95, Math.max(5, score));
    const testMultiplier = {
      [TestType.SPEED]: 1.1,
      [TestType.AGILITY]: 1.0,
      [TestType.STRENGTH]: 0.95,
      [TestType.ENDURANCE]: 1.05,
      [TestType.FLEXIBILITY]: 0.9,
      [TestType.BALANCE]: 1.0
    };
    
    return Math.round(basePercentile * (testMultiplier[testType] || 1.0));
  }

  private generateInsights(assessment: AssessmentTest, allAssessments: AssessmentTest[]): AIInsight[] {
    const insights: AIInsight[] = [];
    const score = assessment.score;
    
    // Performance-based insights
    if (score >= 85) {
      insights.push({
        category: 'strength',
        title: 'Exceptional Performance',
        description: `Outstanding ${assessment.testType.toLowerCase()} performance! You're in the top 15% of athletes.`,
        priority: 'high',
        icon: '🏆'
      });
    } else if (score >= 70) {
      insights.push({
        category: 'strength',
        title: 'Strong Performance',
        description: `Good ${assessment.testType.toLowerCase()} results. You're performing above average.`,
        priority: 'medium',
        icon: '💪'
      });
    } else if (score < 50) {
      insights.push({
        category: 'weakness',
        title: 'Area for Improvement',
        description: `Your ${assessment.testType.toLowerCase()} needs attention. Focus on targeted training.`,
        priority: 'high',
        icon: '⚠️'
      });
    }

    // Test-specific insights
    switch (assessment.testType) {
      case TestType.SPEED:
        if (score < 60) {
          insights.push({
            category: 'improvement',
            title: 'Speed Development Opportunity',
            description: 'Consider sprint intervals and explosive power training to improve acceleration.',
            priority: 'high',
            icon: '⚡'
          });
        }
        break;
        
      case TestType.FLEXIBILITY:
        if (score < 55) {
          insights.push({
            category: 'risk',
            title: 'Injury Prevention Focus',
            description: 'Limited flexibility may increase injury risk. Daily stretching is recommended.',
            priority: 'high',
            icon: '🚨'
          });
        }
        break;
        
      case TestType.ENDURANCE:
        if (score >= 80) {
          insights.push({
            category: 'strength',
            title: 'Excellent Cardiovascular Fitness',
            description: 'Your endurance levels are exceptional. Consider competing in longer events.',
            priority: 'medium',
            icon: '❤️'
          });
        }
        break;
    }

    // Progress-based insights
    if (allAssessments.length > 1) {
      const previousTests = allAssessments
        .filter(a => a.testType === assessment.testType && a.id !== assessment.id)
        .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
        
      if (previousTests.length > 0) {
        const improvement = score - previousTests[0].score;
        if (improvement > 5) {
          insights.push({
            category: 'improvement',
            title: 'Positive Progress',
            description: `You've improved by ${improvement.toFixed(1)} points since your last test!`,
            priority: 'medium',
            icon: '📈'
          });
        } else if (improvement < -5) {
          insights.push({
            category: 'weakness',
            title: 'Performance Decline',
            description: `Performance has decreased by ${Math.abs(improvement).toFixed(1)} points. Review training program.`,
            priority: 'high',
            icon: '📉'
          });
        }
      }
    }

    return insights;
  }

  private generateRecommendations(assessment: AssessmentTest): TrainingRecommendation[] {
    const recommendations: TrainingRecommendation[] = [];
    const score = assessment.score;

    // Test-specific recommendations
    switch (assessment.testType) {
      case TestType.SPEED:
        if (score < 70) {
          recommendations.push({
            category: 'strength',
            title: 'Sprint Power Development',
            description: 'Focus on explosive power and acceleration techniques',
            exercises: [
              '20m Sprint Intervals',
              'Box Jumps (3x8)',
              'Resistance Band Sprints',
              'Hill Sprints (6x30s)'
            ],
            priority: 'high',
            duration: '3-4 weeks'
          });
        }
        break;

      case TestType.AGILITY:
        if (score < 65) {
          recommendations.push({
            category: 'technique',
            title: 'Agility Enhancement Program',
            description: 'Improve directional changes and reaction time',
            exercises: [
              'Cone Drills (T-Test, 5-10-5)',
              'Ladder Drills (20 minutes)',
              'Reaction Ball Training',
              'Plyometric Jumps'
            ],
            priority: 'high',
            duration: '4-6 weeks'
          });
        }
        break;

      case TestType.STRENGTH:
        if (score < 60) {
          recommendations.push({
            category: 'strength',
            title: 'Strength Building Protocol',
            description: 'Progressive overload program for muscle development',
            exercises: [
              'Compound Lifts (Squats, Deadlifts)',
              'Progressive Weight Training',
              'Functional Movement Patterns',
              'Core Stabilization'
            ],
            priority: 'high',
            duration: '6-8 weeks'
          });
        }
        break;

      case TestType.ENDURANCE:
        if (score < 65) {
          recommendations.push({
            category: 'endurance',
            title: 'Cardiovascular Conditioning',
            description: 'Improve aerobic capacity and stamina',
            exercises: [
              'Interval Running (30/30s)',
              'Long Steady Runs (45-60min)',
              'Cycling Cross-Training',
              'Swimming Sessions'
            ],
            priority: 'medium',
            duration: '6-8 weeks'
          });
        }
        break;

      case TestType.FLEXIBILITY:
        if (score < 60) {
          recommendations.push({
            category: 'flexibility',
            title: 'Mobility Enhancement',
            description: 'Daily stretching and mobility work',
            exercises: [
              'Dynamic Warm-up (10 minutes)',
              'Static Stretching (15 minutes)',
              'Foam Rolling (10 minutes)',
              'Yoga Sessions (2x/week)'
            ],
            priority: 'high',
            duration: '4-6 weeks'
          });
        }
        break;

      case TestType.BALANCE:
        if (score < 65) {
          recommendations.push({
            category: 'technique',
            title: 'Balance and Stability Training',
            description: 'Improve proprioception and stability',
            exercises: [
              'Single-leg Stands (3x30s)',
              'Balance Board Training',
              'Bosu Ball Exercises',
              'Stability Ball Workouts'
            ],
            priority: 'medium',
            duration: '3-4 weeks'
          });
        }
      }

    // General recommendations based on score
    if (score >= 80) {
      recommendations.push({
        category: 'recovery',
        title: 'Performance Maintenance',
        description: 'Maintain current level with recovery-focused training',
        exercises: [
          'Active Recovery Sessions',
          'Maintenance Training (2x/week)',
          'Sleep Optimization',
          'Nutrition Planning'
        ],
        priority: 'medium',
        duration: 'Ongoing'
      });
    }

    return recommendations;
  }

  async analyzeAssessment(
    assessment: AssessmentTest, 
    allAssessments: AssessmentTest[] = [],
    athleteSports: SportType[] = []
  ): Promise<AssessmentAnalysis> {
    // Simulate AI processing delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    const score = assessment.score;
    const insights = this.generateInsights(assessment, allAssessments);
    const recommendations = this.generateRecommendations(assessment);
    
    // Calculate performance metrics
    const performanceMetrics: PerformanceMetrics = {
      overallRating: this.getPerformanceRating(score),
      percentile: this.calculatePercentile(score, assessment.testType),
      strengths: this.getStrengths(score, assessment.testType),
      weaknesses: this.getWeaknesses(score, assessment.testType),
      riskFactors: this.getRiskFactors(score, assessment.testType)
    };

    // Calculate progress tracking
    const previousTests = allAssessments
      .filter(a => a.testType === assessment.testType && a.id !== assessment.id)
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
      
    const progressTracking = {
      currentScore: score,
      previousScore: previousTests.length > 0 ? previousTests[0].score : undefined,
      improvement: previousTests.length > 0 ? score - previousTests[0].score : 0,
      trend: this.getTrend(score, previousTests) as 'improving' | 'declining' | 'stable'
    };

    // Generate benchmark comparison
    const benchmarkComparison = {
      peerAverage: this.getPeerAverage(assessment.testType, athleteSports),
      sportAverage: this.getSportAverage(assessment.testType, athleteSports),
      eliteLevel: this.getEliteLevel(assessment.testType)
    };

    return {
      insights,
      performanceMetrics,
      recommendations,
      progressTracking,
      benchmarkComparison
    };
  }

  private getStrengths(score: number, testType: TestType): string[] {
    const strengths: string[] = [];
    
    if (score >= 80) {
      strengths.push(`Excellent ${testType.toLowerCase()} performance`);
      strengths.push('Consistent technique');
    }
    if (score >= 85) {
      strengths.push('Elite-level capability');
      strengths.push('Competition readiness');
    }
    
    return strengths;
  }

  private getWeaknesses(score: number, testType: TestType): string[] {
    const weaknesses: string[] = [];
    
    if (score < 60) {
      weaknesses.push(`Below average ${testType.toLowerCase()}`);
    }
    if (score < 50) {
      weaknesses.push('Needs significant improvement');
      weaknesses.push('May limit overall performance');
    }
    
    return weaknesses;
  }

  private getRiskFactors(score: number, testType: TestType): string[] {
    const risks: string[] = [];
    
    if (testType === TestType.FLEXIBILITY && score < 50) {
      risks.push('Increased injury risk');
      risks.push('Limited range of motion');
    }
    if (testType === TestType.BALANCE && score < 55) {
      risks.push('Fall risk during activities');
    }
    if (score < 40) {
      risks.push('Performance limitations');
    }
    
    return risks;
  }

  private getTrend(currentScore: number, previousTests: AssessmentTest[]): string {
    if (previousTests.length === 0) return 'stable';
    
    const lastScore = previousTests[0].score;
    const difference = currentScore - lastScore;
    
    if (difference > 3) return 'improving';
    if (difference < -3) return 'declining';
    return 'stable';
  }

  private getPeerAverage(testType: TestType, sports: SportType[]): number {
    // Simulated peer averages
    const baseAverages = {
      [TestType.SPEED]: 68,
      [TestType.AGILITY]: 65,
      [TestType.STRENGTH]: 70,
      [TestType.ENDURANCE]: 72,
      [TestType.FLEXIBILITY]: 60,
      [TestType.BALANCE]: 66
    };
    
    return baseAverages[testType] + Math.random() * 6 - 3;
  }

  private getSportAverage(testType: TestType, sports: SportType[]): number {
    // Simulated sport-specific averages
    return this.getPeerAverage(testType, sports) + 5;
  }

  private getEliteLevel(testType: TestType): number {
    const eliteLevels = {
      [TestType.SPEED]: 88,
      [TestType.AGILITY]: 85,
      [TestType.STRENGTH]: 90,
      [TestType.ENDURANCE]: 92,
      [TestType.FLEXIBILITY]: 82,
      [TestType.BALANCE]: 87
    };
    
    return eliteLevels[testType];
  }
}

const aiAnalysisService = new AIAnalysisService();
export default aiAnalysisService;
export type { AssessmentAnalysis, AIInsight, TrainingRecommendation, PerformanceMetrics };
