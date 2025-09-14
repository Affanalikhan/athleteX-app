import { Athlete, AssessmentTest, TestType } from '../models';

interface VideoFrame {
  timestamp: number; // milliseconds
  frameNumber: number;
  keypoints: Keypoint[];
  metadata: {
    width: number;
    height: number;
    quality: 'high' | 'medium' | 'low';
  };
}

interface Keypoint {
  id: number;
  name: string; // e.g., 'nose', 'left_shoulder', 'right_knee'
  x: number;
  y: number;
  confidence: number; // 0-1
  visible: boolean;
}

interface MovementPhase {
  name: string; // e.g., 'preparation', 'execution', 'recovery'
  startTime: number;
  endTime: number;
  duration: number;
  keyEvents: string[];
  quality: 'excellent' | 'good' | 'fair' | 'poor';
}

interface BiomechanicalAnalysis {
  jointAngles: {
    [jointName: string]: {
      angle: number;
      optimalRange: [number, number];
      deviation: number;
      quality: 'excellent' | 'good' | 'fair' | 'poor';
    };
  };
  movementSymmetry: {
    leftRight: number; // 0-1, 1 being perfect symmetry
    anteriorPosterior: number;
    medialLateral: number;
    overallSymmetry: number;
    asymmetryFlags: string[];
  };
  velocityProfile: {
    peak: number;
    average: number;
    smoothness: number; // 0-1, 1 being perfectly smooth
    accelerationPattern: 'explosive' | 'gradual' | 'inconsistent';
  };
  balanceStability: {
    centerOfMass: { x: number; y: number }[];
    sway: number;
    stability: 'excellent' | 'good' | 'fair' | 'poor';
    instabilityEvents: Array<{ time: number; severity: number; cause: string }>;
  };
}

interface ExerciseValidation {
  exerciseRecognized: boolean;
  correctExercise: string;
  detectedExercise: string;
  confidence: number;
  formErrors: Array<{
    type: 'posture' | 'range_of_motion' | 'timing' | 'technique';
    description: string;
    severity: 'critical' | 'major' | 'minor';
    timeRange: [number, number];
    suggestion: string;
  }>;
  repetitionCount: {
    detected: number;
    expected: number;
    accuracy: number;
    incompleteReps: number[];
  };
  paceAnalysis: {
    averageRepDuration: number;
    consistency: number; // 0-1
    optimalPace: number;
    paceRecommendation: string;
  };
}

interface VideoQualityMetrics {
  resolution: { width: number; height: number };
  frameRate: number;
  duration: number;
  lighting: {
    average: number;
    consistency: number;
    adequacy: 'excellent' | 'good' | 'fair' | 'poor';
    shadows: boolean;
    overexposure: boolean;
  };
  cameraStability: {
    shake: number; // 0-1, 0 being no shake
    steadiness: 'excellent' | 'good' | 'fair' | 'poor';
    tracking: boolean; // whether camera follows subject
  };
  subjectVisibility: {
    fullBodyVisible: number; // percentage of time
    keyJointsVisible: number;
    occlusion: Array<{ time: number; bodyPart: string; severity: number }>;
  };
  audioQuality?: {
    present: boolean;
    clarity: number;
    backgroundNoise: number;
  };
}

interface MovementAnalysisResult {
  videoId: string;
  analysisTimestamp: Date;
  processingTime: number; // milliseconds
  
  // Core Analysis Results
  videoQuality: VideoQualityMetrics;
  exerciseValidation: ExerciseValidation;
  biomechanicalAnalysis: BiomechanicalAnalysis;
  movementPhases: MovementPhase[];
  
  // Performance Metrics
  technicalScore: {
    form: number; // 0-100
    consistency: number;
    efficiency: number;
    overall: number;
  };
  
  // Detailed Insights
  strengths: string[];
  weaknesses: string[];
  recommendations: Array<{
    category: 'technique' | 'form' | 'pacing' | 'setup';
    priority: 'high' | 'medium' | 'low';
    description: string;
    specificFeedback: string;
  }>;
  
  // Red Flags for Integrity
  integrityFlags: Array<{
    type: 'video_editing' | 'incorrect_exercise' | 'assisted_movement' | 'environmental' | 'technical';
    severity: 'critical' | 'high' | 'medium' | 'low';
    description: string;
    confidence: number;
    evidence: string[];
  }>;
  
  // Comparison Data
  normativeComparison: {
    percentile: number;
    ageGroupAverage: number;
    eliteComparison: number;
    improvementPotential: number;
  };
}

class VideoAnalysisEngine {
  private modelCache: Map<string, any> = new Map();
  private processingQueue: Map<string, { progress: number; stage: string }> = new Map();

  // Main analysis entry point
  async analyzeVideo(
    videoFile: File,
    assessment: AssessmentTest,
    athlete: Athlete,
    options: {
      detailedBiomechanics?: boolean;
      integrityCheck?: boolean;
      performanceMetrics?: boolean;
      qualityAssessment?: boolean;
    } = {}
  ): Promise<MovementAnalysisResult> {
    
    const videoId = `${assessment.id}_${Date.now()}`;
    const startTime = Date.now();
    
    console.log(`🎥 Starting video analysis for ${athlete.name}'s ${assessment.testType} assessment...`);
    
    try {
      // Initialize processing
      this.updateProcessingStatus(videoId, 0, 'Initializing video processing...');
      
      // Step 1: Extract video frames and metadata
      const videoMetadata = await this.extractVideoMetadata(videoFile);
      const frames = await this.extractKeyFrames(videoFile, assessment.testType);
      this.updateProcessingStatus(videoId, 15, 'Extracting keyframes and metadata...');
      
      // Step 2: Detect human pose in each frame
      const poseData = await this.detectPoseSequence(frames, assessment.testType);
      this.updateProcessingStatus(videoId, 35, 'Analyzing body pose and movement...');
      
      // Step 3: Video quality assessment
      const videoQuality = options.qualityAssessment !== false 
        ? await this.assessVideoQuality(videoFile, frames, poseData)
        : this.getBasicQualityMetrics(videoMetadata);
      this.updateProcessingStatus(videoId, 50, 'Evaluating video quality...');
      
      // Step 4: Exercise validation and recognition
      const exerciseValidation = await this.validateExercise(
        poseData, 
        assessment.testType, 
        videoMetadata.duration
      );
      this.updateProcessingStatus(videoId, 65, 'Validating exercise execution...');
      
      // Step 5: Biomechanical analysis
      const biomechanicalAnalysis = options.detailedBiomechanics !== false
        ? await this.performBiomechanicalAnalysis(poseData, assessment.testType)
        : this.getBasicBiomechanics(poseData);
      this.updateProcessingStatus(videoId, 80, 'Analyzing biomechanics...');
      
      // Step 6: Movement phase detection
      const movementPhases = await this.detectMovementPhases(
        poseData, 
        exerciseValidation, 
        assessment.testType
      );
      
      // Step 7: Generate technical scores
      const technicalScore = await this.calculateTechnicalScores(
        exerciseValidation,
        biomechanicalAnalysis,
        movementPhases,
        videoQuality
      );
      this.updateProcessingStatus(videoId, 90, 'Calculating performance scores...');
      
      // Step 8: Generate insights and recommendations
      const insights = await this.generateInsights(
        exerciseValidation,
        biomechanicalAnalysis,
        technicalScore,
        athlete,
        assessment
      );
      
      // Step 9: Integrity analysis (if enabled)
      const integrityFlags = options.integrityCheck !== false
        ? await this.detectIntegrityIssues(videoFile, poseData, exerciseValidation, videoQuality)
        : [];
      
      // Step 10: Normative comparison
      const normativeComparison = await this.compareToNorms(
        technicalScore,
        athlete,
        assessment.testType
      );
      
      this.updateProcessingStatus(videoId, 100, 'Analysis complete!');
      
      const processingTime = Date.now() - startTime;
      
      const result: MovementAnalysisResult = {
        videoId,
        analysisTimestamp: new Date(),
        processingTime,
        videoQuality,
        exerciseValidation,
        biomechanicalAnalysis,
        movementPhases,
        technicalScore,
        strengths: insights.strengths,
        weaknesses: insights.weaknesses,
        recommendations: insights.recommendations,
        integrityFlags,
        normativeComparison
      };
      
      console.log(`✅ Video analysis complete in ${processingTime}ms`);
      return result;
      
    } catch (error) {
      console.error('Video analysis failed:', error);
      this.updateProcessingStatus(videoId, -1, `Analysis failed: ${error}`);
      throw error;
    } finally {
      // Clean up processing status
      setTimeout(() => this.processingQueue.delete(videoId), 60000);
    }
  }

  // Extract video metadata and basic properties
  private async extractVideoMetadata(videoFile: File): Promise<{
    duration: number;
    width: number;
    height: number;
    frameRate: number;
    fileSize: number;
    format: string;
  }> {
    // Simulate video metadata extraction
    // In real implementation, use libraries like FFmpeg.js or video processing APIs
    
    return new Promise((resolve) => {
      setTimeout(() => {
        // Mock metadata based on file properties
        const metadata = {
          duration: 30000 + Math.random() * 60000, // 30-90 seconds
          width: 1920,
          height: 1080,
          frameRate: 30,
          fileSize: videoFile.size,
          format: videoFile.type || 'video/mp4'
        };
        resolve(metadata);
      }, 500);
    });
  }

  // Extract key frames for analysis
  private async extractKeyFrames(videoFile: File, testType: TestType): Promise<VideoFrame[]> {
    // Simulate frame extraction
    // Real implementation would use canvas/WebGL for frame extraction
    
    const frameCount = testType === TestType.SPEED ? 60 : 90; // More frames for complex exercises
    const frames: VideoFrame[] = [];
    
    for (let i = 0; i < frameCount; i++) {
      frames.push({
        timestamp: (i / frameCount) * 30000, // Spread over 30 seconds
        frameNumber: i,
        keypoints: this.generateMockKeypoints(),
        metadata: {
          width: 1920,
          height: 1080,
          quality: Math.random() > 0.8 ? 'high' : Math.random() > 0.5 ? 'medium' : 'low'
        }
      });
    }
    
    return frames;
  }

  // Generate mock human pose keypoints
  private generateMockKeypoints(): Keypoint[] {
    const keypointNames = [
      'nose', 'left_eye', 'right_eye', 'left_ear', 'right_ear',
      'left_shoulder', 'right_shoulder', 'left_elbow', 'right_elbow',
      'left_wrist', 'right_wrist', 'left_hip', 'right_hip',
      'left_knee', 'right_knee', 'left_ankle', 'right_ankle'
    ];
    
    return keypointNames.map((name, id) => ({
      id,
      name,
      x: Math.random() * 1920,
      y: Math.random() * 1080,
      confidence: 0.7 + Math.random() * 0.3,
      visible: Math.random() > 0.1 // 90% visibility chance
    }));
  }

  // Detect pose sequence across all frames
  private async detectPoseSequence(frames: VideoFrame[], testType: TestType): Promise<VideoFrame[]> {
    // Simulate pose detection processing
    console.log(`🤖 Running pose detection on ${frames.length} frames...`);
    
    // Add some processing delay for realism
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // In real implementation, this would use TensorFlow.js PoseNet or similar
    // For now, return frames with enhanced keypoint data
    return frames.map(frame => ({
      ...frame,
      keypoints: frame.keypoints.map(kp => ({
        ...kp,
        confidence: Math.max(0.5, kp.confidence + Math.random() * 0.2)
      }))
    }));
  }

  // Assess video quality metrics
  private async assessVideoQuality(
    videoFile: File, 
    frames: VideoFrame[], 
    poseData: VideoFrame[]
  ): Promise<VideoQualityMetrics> {
    
    // Calculate lighting consistency
    const lightingScores = frames.map(() => 0.6 + Math.random() * 0.4);
    const avgLighting = lightingScores.reduce((a, b) => a + b) / lightingScores.length;
    const lightingConsistency = 1 - (Math.max(...lightingScores) - Math.min(...lightingScores));
    
    // Camera stability analysis
    const cameraShake = Math.random() * 0.3; // Low shake for good videos
    
    // Subject visibility calculation
    const visibilityScores = poseData.map(frame => 
      frame.keypoints.filter(kp => kp.visible && kp.confidence > 0.7).length / frame.keypoints.length
    );
    const avgVisibility = visibilityScores.reduce((a, b) => a + b) / visibilityScores.length;
    
    return {
      resolution: { width: frames[0]?.metadata.width || 1920, height: frames[0]?.metadata.height || 1080 },
      frameRate: 30,
      duration: frames.length > 0 ? frames[frames.length - 1].timestamp : 30000,
      lighting: {
        average: avgLighting,
        consistency: lightingConsistency,
        adequacy: avgLighting > 0.8 ? 'excellent' : avgLighting > 0.6 ? 'good' : avgLighting > 0.4 ? 'fair' : 'poor',
        shadows: Math.random() < 0.3,
        overexposure: Math.random() < 0.1
      },
      cameraStability: {
        shake: cameraShake,
        steadiness: cameraShake < 0.1 ? 'excellent' : cameraShake < 0.2 ? 'good' : cameraShake < 0.3 ? 'fair' : 'poor',
        tracking: Math.random() > 0.3
      },
      subjectVisibility: {
        fullBodyVisible: avgVisibility * 100,
        keyJointsVisible: (avgVisibility * 0.9) * 100,
        occlusion: Math.random() < 0.2 ? [
          { time: Math.random() * 30000, bodyPart: 'left_arm', severity: Math.random() * 0.5 }
        ] : []
      },
      audioQuality: {
        present: Math.random() > 0.5,
        clarity: 0.7 + Math.random() * 0.3,
        backgroundNoise: Math.random() * 0.4
      }
    };
  }

  private getBasicQualityMetrics(metadata: any): VideoQualityMetrics {
    return {
      resolution: { width: metadata.width, height: metadata.height },
      frameRate: metadata.frameRate,
      duration: metadata.duration,
      lighting: {
        average: 0.75,
        consistency: 0.8,
        adequacy: 'good',
        shadows: false,
        overexposure: false
      },
      cameraStability: {
        shake: 0.15,
        steadiness: 'good',
        tracking: true
      },
      subjectVisibility: {
        fullBodyVisible: 85,
        keyJointsVisible: 90,
        occlusion: []
      }
    };
  }

  // Validate exercise execution and recognition
  private async validateExercise(
    poseData: VideoFrame[], 
    expectedExercise: TestType, 
    duration: number
  ): Promise<ExerciseValidation> {
    
    console.log(`🏃‍♂️ Validating ${expectedExercise} exercise execution...`);
    
    // Simulate exercise recognition
    const recognitionConfidence = 0.75 + Math.random() * 0.2;
    const exerciseRecognized = recognitionConfidence > 0.6;
    
    // Generate form errors based on exercise type
    const formErrors = this.generateFormErrors(expectedExercise, poseData);
    
    // Count repetitions (for exercises that have reps)
    const repCount = this.countRepetitions(expectedExercise, poseData);
    
    // Analyze pacing
    const paceAnalysis = this.analyzePacing(expectedExercise, poseData, duration);
    
    return {
      exerciseRecognized,
      correctExercise: expectedExercise,
      detectedExercise: exerciseRecognized ? expectedExercise : this.getAlternativeExercise(expectedExercise),
      confidence: recognitionConfidence,
      formErrors,
      repetitionCount: repCount,
      paceAnalysis
    };
  }

  private generateFormErrors(testType: TestType, poseData: VideoFrame[]): ExerciseValidation['formErrors'] {
    const errors: ExerciseValidation['formErrors'] = [];
    const errorTypes = ['posture', 'range_of_motion', 'timing', 'technique'] as const;
    
    // Generate 0-3 random errors based on exercise complexity
    const errorCount = Math.floor(Math.random() * 3);
    
    for (let i = 0; i < errorCount; i++) {
      const errorType = errorTypes[Math.floor(Math.random() * errorTypes.length)];
      const startTime = Math.random() * 20000;
      const duration = 2000 + Math.random() * 5000;
      
      errors.push({
        type: errorType,
        description: this.getErrorDescription(testType, errorType),
        severity: Math.random() < 0.2 ? 'critical' : Math.random() < 0.5 ? 'major' : 'minor',
        timeRange: [startTime, startTime + duration],
        suggestion: this.getErrorSuggestion(testType, errorType)
      });
    }
    
    return errors;
  }

  private getErrorDescription(testType: TestType, errorType: string): string {
    const errors = {
      [TestType.STRENGTH]: {
        posture: 'Body not in straight line - sagging hips detected',
        range_of_motion: 'Insufficient range of motion detected',
        timing: 'Inconsistent rep timing - rushing through movement',
        technique: 'Improper form detected'
      },
      [TestType.SPEED]: {
        posture: 'Forward lean angle suboptimal for acceleration',
        range_of_motion: 'Limited knee drive height',
        timing: 'Inconsistent stride frequency',
        technique: 'Arm swing not coordinated with leg movement'
      },
      [TestType.BALANCE]: {
        posture: 'Body alignment issues detected',
        range_of_motion: 'Head position too low',
        timing: 'Unable to maintain position for full duration',
        technique: 'Weight not evenly distributed'
      },
      [TestType.AGILITY]: {
        posture: 'Body position not optimal for direction changes',
        range_of_motion: 'Limited range in cutting movements',
        timing: 'Inconsistent movement timing',
        technique: 'Improper cutting technique'
      },
      [TestType.ENDURANCE]: {
        posture: 'Form deterioration noted during prolonged activity',
        range_of_motion: 'Range of motion decreasing over time',
        timing: 'Pacing inconsistency',
        technique: 'Technique breakdown under fatigue'
      },
      [TestType.FLEXIBILITY]: {
        posture: 'Alignment issues during stretching',
        range_of_motion: 'Limited range of motion achieved',
        timing: 'Insufficient hold time',
        technique: 'Improper stretching technique'
      }
    };
    
    return errors[testType]?.[errorType as keyof typeof errors[TestType.STRENGTH]] || 
           'Form issue detected requiring attention';
  }

  private getErrorSuggestion(testType: TestType, errorType: string): string {
    const suggestions = {
      [TestType.STRENGTH]: {
        posture: 'Engage core muscles to maintain proper body alignment',
        range_of_motion: 'Focus on full range of motion, maintain control',
        timing: 'Slow down - focus on controlled movements',
        technique: 'Maintain proper form throughout the movement'
      },
      [TestType.SPEED]: {
        posture: 'Maintain slight forward lean, drive with leg power',
        range_of_motion: 'Focus on driving knees up toward chest',
        timing: 'Maintain consistent cadence throughout',
        technique: 'Coordinate arm swing - opposite arm to leg'
      },
      [TestType.BALANCE]: {
        posture: 'Focus on core engagement and proper alignment',
        range_of_motion: 'Keep head in neutral position',
        timing: 'Build endurance gradually, maintain form over time',
        technique: 'Distribute weight evenly and focus on stability'
      },
      [TestType.AGILITY]: {
        posture: 'Stay low with athletic position during direction changes',
        range_of_motion: 'Use full body range for efficient cutting',
        timing: 'Practice consistent movement patterns',
        technique: 'Focus on quick, efficient directional changes'
      },
      [TestType.ENDURANCE]: {
        posture: 'Maintain form even when fatigued',
        range_of_motion: 'Focus on maintaining full range despite fatigue',
        timing: 'Work on consistent pacing strategies',
        technique: 'Practice maintaining technique under fatigue'
      },
      [TestType.FLEXIBILITY]: {
        posture: 'Maintain proper alignment during stretches',
        range_of_motion: 'Gradually increase range of motion',
        timing: 'Hold stretches for adequate duration',
        technique: 'Focus on proper stretching technique and breathing'
      }
    };
    
    return suggestions[testType]?.[errorType as keyof typeof suggestions[TestType.STRENGTH]] || 
           'Focus on proper form and technique';
  }

  private countRepetitions(testType: TestType, poseData: VideoFrame[]): ExerciseValidation['repetitionCount'] {
    // For exercises with repetitions
    if ([TestType.STRENGTH, TestType.AGILITY].includes(testType)) {
      const detectedReps = 8 + Math.floor(Math.random() * 15); // 8-22 reps
      const expectedReps = 15; // Standard expectation
      
      return {
        detected: detectedReps,
        expected: expectedReps,
        accuracy: Math.min(1, detectedReps / expectedReps),
        incompleteReps: Math.random() < 0.3 ? [Math.floor(Math.random() * detectedReps)] : []
      };
    }
    
    return {
      detected: 1,
      expected: 1,
      accuracy: 1,
      incompleteReps: []
    };
  }

  private analyzePacing(testType: TestType, poseData: VideoFrame[], duration: number): ExerciseValidation['paceAnalysis'] {
    const repCount = this.countRepetitions(testType, poseData).detected;
    const avgRepDuration = repCount > 1 ? duration / repCount : duration;
    
    // Calculate consistency (lower variance = higher consistency)
    const consistency = 0.7 + Math.random() * 0.3;
    
    const optimalPace = this.getOptimalPace(testType);
    const recommendation = this.getPaceRecommendation(testType, avgRepDuration, optimalPace);
    
    return {
      averageRepDuration: avgRepDuration,
      consistency,
      optimalPace,
      paceRecommendation: recommendation
    };
  }

  private getOptimalPace(testType: TestType): number {
    const paces = {
      [TestType.STRENGTH]: 3000,     // 3 seconds per rep
      [TestType.AGILITY]: 2000,      // 2 seconds per movement
      [TestType.BALANCE]: 30000,     // 30 seconds hold
      [TestType.SPEED]: 10000,       // 10 seconds for sprint
      [TestType.ENDURANCE]: 60000,   // 1 minute for endurance test
      [TestType.FLEXIBILITY]: 20000  // 20 seconds hold for flexibility
    };
    
    return paces[testType] || 3000;
  }

  private getPaceRecommendation(testType: TestType, actual: number, optimal: number): string {
    const ratio = actual / optimal;
    
    if (ratio < 0.7) {
      return 'Slow down - focus on control and form rather than speed';
    } else if (ratio > 1.3) {
      return 'Increase tempo - you have room to move faster while maintaining form';
    } else {
      return 'Good pacing - maintain this tempo';
    }
  }

  private getAlternativeExercise(expected: TestType): string {
    const alternatives = {
      [TestType.STRENGTH]: 'modified_strength_exercise',
      [TestType.SPEED]: 'jog',
      [TestType.BALANCE]: 'modified_balance_exercise',
      [TestType.AGILITY]: 'basic_movement_pattern',
      [TestType.ENDURANCE]: 'low_intensity_cardio',
      [TestType.FLEXIBILITY]: 'basic_stretch'
    };
    
    return alternatives[expected] || 'unknown_exercise';
  }

  // Perform detailed biomechanical analysis
  private async performBiomechanicalAnalysis(
    poseData: VideoFrame[], 
    testType: TestType
  ): Promise<BiomechanicalAnalysis> {
    
    console.log(`🔬 Performing biomechanical analysis for ${testType}...`);
    
    // Calculate joint angles over time
    const jointAngles = this.calculateJointAngles(poseData, testType);
    
    // Analyze movement symmetry
    const movementSymmetry = this.analyzeSymmetry(poseData);
    
    // Calculate velocity and acceleration profiles
    const velocityProfile = this.analyzeVelocityProfile(poseData);
    
    // Assess balance and stability
    const balanceStability = this.analyzeBalance(poseData);
    
    return {
      jointAngles,
      movementSymmetry,
      velocityProfile,
      balanceStability
    };
  }

  private calculateJointAngles(poseData: VideoFrame[], testType: TestType): BiomechanicalAnalysis['jointAngles'] {
    const joints = {
      knee: { angle: 120 + Math.random() * 40, optimalRange: [90, 160] },
      hip: { angle: 110 + Math.random() * 30, optimalRange: [90, 150] },
      elbow: { angle: 140 + Math.random() * 20, optimalRange: [120, 170] },
      shoulder: { angle: 160 + Math.random() * 20, optimalRange: [150, 180] }
    };
    
    const result: BiomechanicalAnalysis['jointAngles'] = {};
    
    Object.entries(joints).forEach(([joint, data]) => {
      const deviation = Math.min(
        Math.abs(data.angle - data.optimalRange[0]),
        Math.abs(data.angle - data.optimalRange[1])
      );
      
      result[joint] = {
        angle: data.angle,
        optimalRange: data.optimalRange as [number, number],
        deviation,
        quality: deviation < 10 ? 'excellent' : deviation < 20 ? 'good' : deviation < 30 ? 'fair' : 'poor'
      };
    });
    
    return result;
  }

  private analyzeSymmetry(poseData: VideoFrame[]): BiomechanicalAnalysis['movementSymmetry'] {
    const leftRight = 0.8 + Math.random() * 0.2; // Generally good symmetry
    const anteriorPosterior = 0.85 + Math.random() * 0.15;
    const medialLateral = 0.9 + Math.random() * 0.1;
    
    const overallSymmetry = (leftRight + anteriorPosterior + medialLateral) / 3;
    
    const asymmetryFlags = [];
    if (leftRight < 0.8) asymmetryFlags.push('Left-right imbalance detected');
    if (anteriorPosterior < 0.8) asymmetryFlags.push('Forward-backward compensation');
    if (medialLateral < 0.85) asymmetryFlags.push('Side-to-side deviation');
    
    return {
      leftRight,
      anteriorPosterior,
      medialLateral,
      overallSymmetry,
      asymmetryFlags
    };
  }

  private analyzeVelocityProfile(poseData: VideoFrame[]): BiomechanicalAnalysis['velocityProfile'] {
    return {
      peak: 2.5 + Math.random() * 2, // m/s
      average: 1.2 + Math.random() * 1,
      smoothness: 0.7 + Math.random() * 0.3,
      accelerationPattern: Math.random() < 0.6 ? 'explosive' : Math.random() < 0.8 ? 'gradual' : 'inconsistent'
    };
  }

  private analyzeBalance(poseData: VideoFrame[]): BiomechanicalAnalysis['balanceStability'] {
    const centerOfMass = poseData.map(() => ({
      x: 960 + (Math.random() - 0.5) * 100, // Center with some variation
      y: 540 + (Math.random() - 0.5) * 50
    }));
    
    const sway = Math.random() * 20; // cm
    const stability = sway < 5 ? 'excellent' : sway < 10 ? 'good' : sway < 15 ? 'fair' : 'poor';
    
    return {
      centerOfMass,
      sway,
      stability,
      instabilityEvents: Math.random() < 0.3 ? [
        { time: Math.random() * 30000, severity: Math.random(), cause: 'Balance correction' }
      ] : []
    };
  }

  private getBasicBiomechanics(poseData: VideoFrame[]): BiomechanicalAnalysis {
    return {
      jointAngles: {
        knee: { angle: 135, optimalRange: [90, 160], deviation: 10, quality: 'good' },
        hip: { angle: 125, optimalRange: [90, 150], deviation: 15, quality: 'good' }
      },
      movementSymmetry: {
        leftRight: 0.85,
        anteriorPosterior: 0.9,
        medialLateral: 0.88,
        overallSymmetry: 0.88,
        asymmetryFlags: []
      },
      velocityProfile: {
        peak: 3.2,
        average: 1.8,
        smoothness: 0.8,
        accelerationPattern: 'gradual'
      },
      balanceStability: {
        centerOfMass: [{ x: 960, y: 540 }],
        sway: 8,
        stability: 'good',
        instabilityEvents: []
      }
    };
  }

  // Detect movement phases
  private async detectMovementPhases(
    poseData: VideoFrame[], 
    validation: ExerciseValidation, 
    testType: TestType
  ): Promise<MovementPhase[]> {
    
    const totalDuration = poseData[poseData.length - 1]?.timestamp || 30000;
    
    // Define phases based on exercise type
    switch (testType) {
      case TestType.STRENGTH:
        return [
          {
            name: 'preparation',
            startTime: 0,
            endTime: 2000,
            duration: 2000,
            keyEvents: ['assume_position', 'stabilize'],
            quality: 'good'
          },
          {
            name: 'execution',
            startTime: 2000,
            endTime: totalDuration - 2000,
            duration: totalDuration - 4000,
            keyEvents: ['repetitions', 'form_maintenance'],
            quality: validation.formErrors.length < 2 ? 'good' : 'fair'
          },
          {
            name: 'completion',
            startTime: totalDuration - 2000,
            endTime: totalDuration,
            duration: 2000,
            keyEvents: ['final_position', 'rest'],
            quality: 'good'
          }
        ];
        
      case TestType.SPEED:
        return [
          {
            name: 'start',
            startTime: 0,
            endTime: 1000,
            duration: 1000,
            keyEvents: ['reaction', 'acceleration'],
            quality: 'good'
          },
          {
            name: 'acceleration',
            startTime: 1000,
            endTime: 4000,
            duration: 3000,
            keyEvents: ['stride_frequency_increase', 'body_angle_adjustment'],
            quality: 'excellent'
          },
          {
            name: 'maximum_velocity',
            startTime: 4000,
            endTime: totalDuration,
            duration: totalDuration - 4000,
            keyEvents: ['peak_speed', 'stride_maintenance'],
            quality: 'good'
          }
        ];
        
      default:
        return [
          {
            name: 'execution',
            startTime: 0,
            endTime: totalDuration,
            duration: totalDuration,
            keyEvents: ['exercise_performance'],
            quality: 'good'
          }
        ];
    }
  }

  // Calculate technical performance scores
  private async calculateTechnicalScores(
    validation: ExerciseValidation,
    biomechanics: BiomechanicalAnalysis,
    phases: MovementPhase[],
    quality: VideoQualityMetrics
  ): Promise<MovementAnalysisResult['technicalScore']> {
    
    // Form score based on validation and biomechanics
    let formScore = 85; // Start with good baseline
    
    // Deduct for form errors
    validation.formErrors.forEach(error => {
      const deduction = error.severity === 'critical' ? 20 : error.severity === 'major' ? 10 : 5;
      formScore -= deduction;
    });
    
    // Adjust for biomechanical quality
    const bioQuality = Object.values(biomechanics.jointAngles).reduce((avg, joint) => {
      const score = joint.quality === 'excellent' ? 100 : joint.quality === 'good' ? 85 : 
                   joint.quality === 'fair' ? 70 : 50;
      return avg + score;
    }, 0) / Object.values(biomechanics.jointAngles).length;
    
    formScore = (formScore + bioQuality) / 2;
    
    // Consistency score
    const consistencyScore = Math.min(100, validation.paceAnalysis.consistency * 100 + 
                                           biomechanics.movementSymmetry.overallSymmetry * 100) / 2;
    
    // Efficiency score
    const efficiencyScore = Math.min(100, 
      (biomechanics.velocityProfile.smoothness * 50) + 
      (validation.repetitionCount.accuracy * 50)
    );
    
    // Overall score (weighted average)
    const overall = (formScore * 0.5) + (consistencyScore * 0.3) + (efficiencyScore * 0.2);
    
    return {
      form: Math.max(0, Math.min(100, formScore)),
      consistency: Math.max(0, Math.min(100, consistencyScore)),
      efficiency: Math.max(0, Math.min(100, efficiencyScore)),
      overall: Math.max(0, Math.min(100, overall))
    };
  }

  // Generate insights and recommendations
  private async generateInsights(
    validation: ExerciseValidation,
    biomechanics: BiomechanicalAnalysis,
    scores: MovementAnalysisResult['technicalScore'],
    athlete: Athlete,
    assessment: AssessmentTest
  ): Promise<{
    strengths: string[];
    weaknesses: string[];
    recommendations: MovementAnalysisResult['recommendations'];
  }> {
    
    const strengths: string[] = [];
    const weaknesses: string[] = [];
    const recommendations: MovementAnalysisResult['recommendations'] = [];
    
    // Analyze strengths
    if (scores.form > 85) {
      strengths.push('Excellent form and technique execution');
    }
    if (biomechanics.movementSymmetry.overallSymmetry > 0.9) {
      strengths.push('Outstanding movement symmetry and balance');
    }
    if (validation.paceAnalysis.consistency > 0.8) {
      strengths.push('Consistent pacing throughout the exercise');
    }
    if (biomechanics.velocityProfile.smoothness > 0.8) {
      strengths.push('Smooth, controlled movement patterns');
    }
    
    // Analyze weaknesses and generate recommendations
    if (scores.form < 70) {
      weaknesses.push('Form and technique need improvement');
      recommendations.push({
        category: 'technique',
        priority: 'high',
        description: 'Focus on proper form execution',
        specificFeedback: 'Practice basic movement patterns with slower tempo'
      });
    }
    
    if (biomechanics.movementSymmetry.overallSymmetry < 0.8) {
      weaknesses.push('Movement asymmetries detected');
      recommendations.push({
        category: 'form',
        priority: 'medium',
        description: 'Address movement imbalances',
        specificFeedback: 'Include unilateral exercises and mobility work'
      });
    }
    
    validation.formErrors.forEach(error => {
      if (error.severity === 'critical' || error.severity === 'major') {
        weaknesses.push(error.description);
        recommendations.push({
          category: 'technique',
          priority: error.severity === 'critical' ? 'high' : 'medium',
          description: error.description,
          specificFeedback: error.suggestion
        });
      }
    });
    
    return { strengths, weaknesses, recommendations };
  }

  // Detect potential integrity issues in the video
  private async detectIntegrityIssues(
    videoFile: File,
    poseData: VideoFrame[],
    validation: ExerciseValidation,
    quality: VideoQualityMetrics
  ): Promise<MovementAnalysisResult['integrityFlags']> {
    
    const flags: MovementAnalysisResult['integrityFlags'] = [];
    
    // Check for video quality issues
    if (quality.lighting.adequacy === 'poor') {
      flags.push({
        type: 'technical',
        severity: 'medium',
        description: 'Poor lighting conditions may affect analysis accuracy',
        confidence: 0.8,
        evidence: ['Low light levels detected', 'Inconsistent illumination']
      });
    }
    
    // Check for exercise recognition issues
    if (!validation.exerciseRecognized || validation.confidence < 0.7) {
      flags.push({
        type: 'incorrect_exercise',
        severity: 'high',
        description: 'Exercise type recognition uncertainty',
        confidence: 1 - validation.confidence,
        evidence: [
          `Expected: ${validation.correctExercise}`,
          `Detected: ${validation.detectedExercise}`,
          `Confidence: ${(validation.confidence * 100).toFixed(1)}%`
        ]
      });
    }
    
    // Check for camera stability issues
    if (quality.cameraStability.steadiness === 'poor') {
      flags.push({
        type: 'technical',
        severity: 'medium',
        description: 'Significant camera movement detected',
        confidence: 0.9,
        evidence: ['Excessive camera shake', 'Unstable recording conditions']
      });
    }
    
    // Check for subject visibility issues
    if (quality.subjectVisibility.fullBodyVisible < 70) {
      flags.push({
        type: 'environmental',
        severity: 'high',
        description: 'Subject not fully visible throughout recording',
        confidence: 0.95,
        evidence: [`Only ${quality.subjectVisibility.fullBodyVisible.toFixed(1)}% full body visibility`]
      });
    }
    
    // Check for unusual movement patterns (potential assistance)
    const movementConsistency = poseData.reduce((consistency, frame, index) => {
      if (index === 0) return consistency;
      const prevFrame = poseData[index - 1];
      
      // Calculate movement between frames
      const movement = frame.keypoints.reduce((total, kp, kpIndex) => {
        const prevKp = prevFrame.keypoints[kpIndex];
        const distance = Math.sqrt(
          Math.pow(kp.x - prevKp.x, 2) + Math.pow(kp.y - prevKp.y, 2)
        );
        return total + distance;
      }, 0);
      
      return consistency + movement;
    }, 0) / (poseData.length - 1);
    
    if (movementConsistency > 500) { // Threshold for unusual movement
      flags.push({
        type: 'assisted_movement',
        severity: 'medium',
        description: 'Unusual movement patterns detected',
        confidence: 0.6,
        evidence: ['Inconsistent movement velocity', 'Potential external assistance']
      });
    }
    
    return flags;
  }

  // Compare performance to normative data
  private async compareToNorms(
    scores: MovementAnalysisResult['technicalScore'],
    athlete: Athlete,
    testType: TestType
  ): Promise<MovementAnalysisResult['normativeComparison']> {
    
    // Simulate normative database lookup
    const ageGroupData = this.getNormativeData(athlete.age, athlete.gender, testType);
    
    const percentile = this.calculatePercentile(scores.overall, ageGroupData);
    const improvementPotential = Math.max(0, 95 - percentile); // Room to reach 95th percentile
    
    return {
      percentile,
      ageGroupAverage: ageGroupData.mean,
      eliteComparison: scores.overall / ageGroupData.elite * 100,
      improvementPotential
    };
  }

  private getNormativeData(age: number, gender: string, testType: TestType): {
    mean: number;
    stdDev: number;
    elite: number;
  } {
    // Mock normative data - in real implementation, this would come from a database
    const baseData = {
      [TestType.STRENGTH]: { mean: 75, stdDev: 15, elite: 95 },
      [TestType.SPEED]: { mean: 80, stdDev: 12, elite: 98 },
      [TestType.BALANCE]: { mean: 70, stdDev: 18, elite: 92 },
      [TestType.AGILITY]: { mean: 72, stdDev: 16, elite: 94 },
      [TestType.ENDURANCE]: { mean: 68, stdDev: 20, elite: 90 },
      [TestType.FLEXIBILITY]: { mean: 73, stdDev: 14, elite: 93 }
    };
    
    const data = baseData[testType] || baseData[TestType.STRENGTH];
    
    // Adjust for age and gender (simplified)
    const ageAdjustment = age < 25 ? 5 : age > 35 ? -5 : 0;
    const genderAdjustment = gender === 'male' ? 3 : -3;
    
    return {
      mean: data.mean + ageAdjustment + genderAdjustment,
      stdDev: data.stdDev,
      elite: data.elite + ageAdjustment + genderAdjustment
    };
  }

  private calculatePercentile(score: number, normData: { mean: number; stdDev: number }): number {
    // Simple percentile calculation using normal distribution
    const zScore = (score - normData.mean) / normData.stdDev;
    
    // Convert z-score to percentile (approximation)
    if (zScore >= 3) return 99.9;
    if (zScore >= 2) return 97.7;
    if (zScore >= 1.5) return 93.3;
    if (zScore >= 1) return 84.1;
    if (zScore >= 0.5) return 69.1;
    if (zScore >= 0) return 50;
    if (zScore >= -0.5) return 30.9;
    if (zScore >= -1) return 15.9;
    if (zScore >= -1.5) return 6.7;
    if (zScore >= -2) return 2.3;
    return 0.1;
  }

  // Utility methods
  private updateProcessingStatus(videoId: string, progress: number, stage: string): void {
    this.processingQueue.set(videoId, { progress, stage });
  }

  getProcessingStatus(videoId: string): { progress: number; stage: string } | null {
    return this.processingQueue.get(videoId) || null;
  }

  // Batch video analysis
  async analyzeBatchVideos(
    requests: Array<{
      videoFile: File;
      assessment: AssessmentTest;
      athlete: Athlete;
      options?: any;
    }>,
    onProgress?: (completed: number, total: number) => void
  ): Promise<MovementAnalysisResult[]> {
    
    console.log(`🎬 Starting batch video analysis for ${requests.length} videos...`);
    
    const results: MovementAnalysisResult[] = [];
    
    for (let i = 0; i < requests.length; i++) {
      const { videoFile, assessment, athlete, options } = requests[i];
      
      try {
        const result = await this.analyzeVideo(videoFile, assessment, athlete, options);
        results.push(result);
        
        if (onProgress) {
          onProgress(i + 1, requests.length);
        }
        
      } catch (error) {
        console.error(`Failed to analyze video for ${athlete.name}:`, error);
        // Continue with next video
      }
    }
    
    console.log(`✅ Batch analysis complete. Processed ${results.length}/${requests.length} videos.`);
    return results;
  }
}

const videoAnalysisEngine = new VideoAnalysisEngine();
export default videoAnalysisEngine;
export type { 
  MovementAnalysisResult, 
  VideoFrame, 
  Keypoint, 
  BiomechanicalAnalysis,
  ExerciseValidation,
  VideoQualityMetrics,
  MovementPhase
};
