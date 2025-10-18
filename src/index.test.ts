import { sort } from './index';

describe('sort', () => {
  describe('STANDARD stack (neither heavy nor bulky)', () => {
    it('should return STANDARD for small, light package', () => {
      expect(sort(10, 10, 10, 5)).toBe('STANDARD');
    });

    it('should return STANDARD for package just under thresholds', () => {
      expect(sort(149, 10, 10, 19)).toBe('STANDARD');
    });

    it('should return STANDARD for minimal dimensions and mass', () => {
      expect(sort(1, 1, 1, 1)).toBe('STANDARD');
    });
  });

  describe('SPECIAL stack (heavy OR bulky, but not both)', () => {
    describe('bulky but not heavy', () => {
      it('should return SPECIAL when one dimension is >= 150cm', () => {
        expect(sort(150, 10, 10, 10)).toBe('SPECIAL');
      });

      it('should return SPECIAL when width is >= 150cm', () => {
        expect(sort(200, 50, 50, 15)).toBe('SPECIAL');
      });

      it('should return SPECIAL when height is >= 150cm', () => {
        expect(sort(50, 150, 50, 15)).toBe('SPECIAL');
      });

      it('should return SPECIAL when length is >= 150cm', () => {
        expect(sort(50, 50, 160, 15)).toBe('SPECIAL');
      });

      it('should return SPECIAL when volume >= 1,000,000 cm³', () => {
        expect(sort(100, 100, 100, 10)).toBe('SPECIAL');
      });

      it('should return SPECIAL when volume equals exactly 1,000,000 cm³', () => {
        expect(sort(100, 100, 100, 19)).toBe('SPECIAL');
      });
    });

    describe('heavy but not bulky', () => {
      it('should return SPECIAL when mass is >= 20kg', () => {
        expect(sort(10, 10, 10, 20)).toBe('SPECIAL');
      });

      it('should return SPECIAL when mass is exactly 20kg', () => {
        expect(sort(50, 50, 50, 20)).toBe('SPECIAL');
      });

      it('should return SPECIAL when mass is very heavy', () => {
        expect(sort(10, 10, 10, 100)).toBe('SPECIAL');
      });
    });
  });

  describe('REJECTED stack (both heavy AND bulky)', () => {
    it('should return REJECTED when heavy and one dimension >= 150cm', () => {
      expect(sort(150, 10, 10, 20)).toBe('REJECTED');
    });

    it('should return REJECTED when heavy and volume >= 1,000,000 cm³', () => {
      expect(sort(100, 100, 100, 20)).toBe('REJECTED');
    });

    it('should return REJECTED when very heavy and very bulky', () => {
      expect(sort(200, 200, 200, 50)).toBe('REJECTED');
    });

    it('should return REJECTED at exact thresholds (mass=20kg, dimension=150cm)', () => {
      expect(sort(150, 100, 100, 20)).toBe('REJECTED');
    });

    it('should return REJECTED at exact thresholds (mass=20kg, volume=1,000,000)', () => {
      expect(sort(100, 100, 100, 20)).toBe('REJECTED');
    });
  });

  describe('edge cases', () => {
    it('should handle mass at boundary (19.99kg)', () => {
      expect(sort(200, 10, 10, 19.99)).toBe('SPECIAL');
    });

    it('should handle dimension at boundary (149.99cm)', () => {
      expect(sort(149.99, 10, 10, 25)).toBe('SPECIAL');
    });

    it('should handle volume just under threshold', () => {
      expect(sort(99, 99, 99, 25)).toBe('SPECIAL');
    });

    it('should throw IllegalMeasurementError for zero width', () => {
      expect(() => sort(0, 10, 10, 10)).toThrow('Measurement, width, must be greater than zero');
    });

    it('should throw IllegalMeasurementError for zero height', () => {
      expect(() => sort(10, 0, 10, 10)).toThrow('Measurement, height, must be greater than zero');
    });

    it('should throw IllegalMeasurementError for zero length', () => {
      expect(() => sort(10, 10, 0, 10)).toThrow('Measurement, length, must be greater than zero');
    });

    it('should throw IllegalMeasurementError for zero mass', () => {
      expect(() => sort(10, 10, 10, 0)).toThrow('Measurement, mass, must be greater than zero');
    });

    it('should throw IllegalMeasurementError for negative width', () => {
      expect(() => sort(-5, 10, 10, 10)).toThrow('Measurement, width, must be greater than zero');
    });

    it('should throw IllegalMeasurementError for negative height', () => {
      expect(() => sort(10, -5, 10, 10)).toThrow('Measurement, height, must be greater than zero');
    });

    it('should throw IllegalMeasurementError for negative length', () => {
      expect(() => sort(10, 10, -5, 10)).toThrow('Measurement, length, must be greater than zero');
    });

    it('should throw IllegalMeasurementError for negative mass', () => {
      expect(() => sort(10, 10, 10, -20)).toThrow('Measurement, mass, must be greater than zero');
    });
  });
});
