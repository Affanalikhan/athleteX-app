import { PerformanceMetric, MetricType } from '../models';

class PerformanceService {
  private readonly METRICS_KEY = 'athletex_performance_metrics';

  async addMetric(athleteId: string, metricData: Omit<PerformanceMetric, 'id' | 'athleteId'>): Promise<PerformanceMetric> {
    const id = this.generateId();
    const metric: PerformanceMetric = {
      id,
      athleteId,
      ...metricData,
      timestamp: new Date()
    };

    const metrics = this.getMetrics();
    metrics.push(metric);
    this.setMetrics(metrics);
    
    return metric;
  }

  async getAthleteMetrics(athleteId: string): Promise<PerformanceMetric[]> {
    const metrics = this.getMetrics();
    return metrics
      .filter(m => m.athleteId === athleteId)
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  }

  async getMetricsByType(athleteId: string, metricType: MetricType): Promise<PerformanceMetric[]> {
    const metrics = this.getMetrics();
    return metrics
      .filter(m => m.athleteId === athleteId && m.metricType === metricType)
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  }

  async updateMetric(metricId: string, updates: Partial<PerformanceMetric>): Promise<void> {
    const metrics = this.getMetrics();
    const index = metrics.findIndex(m => m.id === metricId);
    if (index >= 0) {
      metrics[index] = { ...metrics[index], ...updates };
      this.setMetrics(metrics);
    }
  }

  async deleteMetric(metricId: string): Promise<void> {
    const metrics = this.getMetrics();
    const filtered = metrics.filter(m => m.id !== metricId);
    this.setMetrics(filtered);
  }

  getMetricDisplayInfo(metricType: MetricType) {
    const metricInfo = {
      [MetricType.TIMING_100M]: {
        label: '100m Sprint',
        unit: 'seconds',
        format: (value: number) => `${value}s`,
        betterDirection: 'lower'
      },
      [MetricType.TIMING_200M]: {
        label: '200m Sprint',
        unit: 'seconds',
        format: (value: number) => `${value}s`,
        betterDirection: 'lower'
      },
      [MetricType.TIMING_800M]: {
        label: '800m Run',
        unit: 'seconds',
        format: (value: number) => `${Math.floor(value / 60)}:${(value % 60).toFixed(1).padStart(4, '0')}`,
        betterDirection: 'lower'
      },
      [MetricType.LONG_JUMP]: {
        label: 'Long Jump',
        unit: 'meters',
        format: (value: number) => `${value}m`,
        betterDirection: 'higher'
      },
      [MetricType.SHOT_PUT_DISTANCE]: {
        label: 'Shot Put',
        unit: 'meters',
        format: (value: number) => `${value}m`,
        betterDirection: 'higher'
      }
    };

    return metricInfo[metricType] || {
      label: metricType,
      unit: '',
      format: (value: number) => value.toString(),
      betterDirection: 'higher'
    };
  }

  calculatePersonalBest(metrics: PerformanceMetric[], metricType: MetricType): number | null {
    const typeMetrics = metrics.filter(m => m.metricType === metricType);
    if (typeMetrics.length === 0) return null;

    const info = this.getMetricDisplayInfo(metricType);
    const values = typeMetrics.map(m => m.value);
    
    return info.betterDirection === 'higher' 
      ? Math.max(...values)
      : Math.min(...values);
  }

  calculateProgress(metrics: PerformanceMetric[], metricType: MetricType, days: number = 30): number {
    const typeMetrics = metrics
      .filter(m => m.metricType === metricType)
      .sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());

    if (typeMetrics.length < 2) return 0;

    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);

    const recentMetrics = typeMetrics.filter(m => m.timestamp >= cutoffDate);
    if (recentMetrics.length < 2) return 0;

    const oldest = recentMetrics[0];
    const newest = recentMetrics[recentMetrics.length - 1];
    
    const info = this.getMetricDisplayInfo(metricType);
    const change = newest.value - oldest.value;
    
    // Return positive percentage for improvement
    return info.betterDirection === 'higher' 
      ? (change / oldest.value) * 100
      : -(change / oldest.value) * 100;
  }

  getChartData(metrics: PerformanceMetric[], metricType: MetricType) {
    const typeMetrics = metrics
      .filter(m => m.metricType === metricType)
      .sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime())
      .slice(-10); // Last 10 entries

    return {
      labels: typeMetrics.map(m => m.timestamp.toLocaleDateString()),
      datasets: [{
        label: this.getMetricDisplayInfo(metricType).label,
        data: typeMetrics.map(m => m.value),
        borderColor: 'rgb(75, 192, 192)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        tension: 0.1
      }]
    };
  }

  // Helper methods
  private getMetrics(): PerformanceMetric[] {
    try {
      const stored = localStorage.getItem(this.METRICS_KEY);
      return stored ? JSON.parse(stored).map((m: any) => ({
        ...m,
        timestamp: new Date(m.timestamp)
      })) : [];
    } catch {
      return [];
    }
  }

  private setMetrics(metrics: PerformanceMetric[]): void {
    localStorage.setItem(this.METRICS_KEY, JSON.stringify(metrics));
  }

  private generateId(): string {
    return 'pm_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }
}

const performanceService = new PerformanceService();
export default performanceService;
