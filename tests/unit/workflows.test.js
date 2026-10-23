// Structure checks of the publishing pipeline (AC-27, AC-28, AC-31). The live behavior is
// verified on the first pull request and the first merge to master.
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const read = (file) => readFileSync(resolve(process.cwd(), '.github/workflows', file), 'utf-8');

describe('publishing workflows', () => {
  it('should not deploy when the workflow runs on pull requests', () => {
    // Arrange
    const pr = read('pr.yml');

    // Act / Assert
    expect(pr).toMatch(/on:\s*\n\s*pull_request:/);
    expect(pr).toContain('uses: ./.github/workflows/quality.yml');
    expect(pr).not.toMatch(/deploy-pages|upload-pages-artifact|pages: write/);
  });

  it('should deploy only after the quality job succeeds on master', () => {
    // Arrange
    const deploy = read('deploy.yml');

    // Act / Assert
    expect(deploy).toMatch(/push:\s*\n\s*branches:\s*\[\s*master\s*\]/);
    expect(deploy).toMatch(/quality:\s*\n\s*uses: \.\/\.github\/workflows\/quality\.yml/);
    expect(deploy).toMatch(/deploy:\s*\n(?:.*\n)*?\s*needs: quality/);
    expect(deploy).toContain('actions/deploy-pages@');
    expect(deploy).toContain('pages: write');
    expect(deploy).toContain('id-token: write');
    expect(deploy).toMatch(/concurrency:\s*\n\s*group: pages/);
  });

  it('should run unit, e2e, link check and build in the quality workflow', () => {
    // Arrange
    const quality = read('quality.yml');

    // Act
    const steps = ['npm ci', 'npm test', 'npx playwright install --with-deps chromium', 'npm run test:e2e', 'npm run check:links', 'npm run build'];

    // Assert
    expect(quality).toContain('workflow_call');
    const positions = steps.map((step) => quality.indexOf(`run: ${step}`));
    positions.forEach((position, i) => expect(position, `missing step "${steps[i]}"`).toBeGreaterThan(-1));
    expect([...positions].sort((a, b) => a - b)).toEqual(positions);
    expect(quality).toContain('actions/upload-artifact@');
  });
});
