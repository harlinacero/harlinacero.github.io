import { describe, it, expect, afterEach, vi } from 'vitest';
import { readPreference, writePreference } from '../../assets/js/storage.js';

describe('storage', () => {
  afterEach(() => {
    vi.restoreAllMocks();
    localStorage.clear();
  });

  it('should return the stored value when storage works', () => {
    // Arrange
    writePreference('hac.lang', 'es');

    // Act
    const value = readPreference('hac.lang');

    // Assert
    expect(value).toBe('es');
  });

  it('should return null when nothing is stored', () => {
    // Arrange / Act
    const value = readPreference('hac.lang');

    // Assert
    expect(value).toBeNull();
  });

  it('should return null and not throw when storage access throws', () => {
    // Arrange
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new DOMException('denied', 'SecurityError');
    });

    // Act
    const read = () => readPreference('hac.lang');

    // Assert
    expect(read).not.toThrow();
    expect(read()).toBeNull();
  });

  it('should return false and not throw when writing to storage throws', () => {
    // Arrange
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new DOMException('quota', 'QuotaExceededError');
    });

    // Act
    const write = () => writePreference('hac.lang', 'en');

    // Assert
    expect(write).not.toThrow();
    expect(write()).toBe(false);
  });

  it('should return true when writing succeeds', () => {
    // Arrange / Act
    const ok = writePreference('hac.lang', 'en');

    // Assert
    expect(ok).toBe(true);
  });
});
