export class PointsUtil {
  static calculatePointsEarned(amount: number): number {
    return Math.floor(amount * 0.1); // 10% of purchase amount as points
  }

  static calculatePointsValue(points: number): number {
    return points * 0.01; // 1 point = $0.01
  }
}