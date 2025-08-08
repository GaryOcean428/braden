# QA & System Optimization Configuration

## Overview
This document outlines the QA tools and scripts implemented as part of the Comprehensive QA & System Optimization Initiative.

## Phase 1: Critical Infrastructure (Completed)

### ✅ Dependency Management
- **npm audit**: `npm run audit:deps` - Vulnerability scanning
- **Current vulnerabilities**: 8 (1 low, 4 moderate, 3 high)
- **Dependency deduplication**: Manual - no duplicate files found

### ✅ Code Quality Tools

#### Linting & Formatting
- **ESLint**: Fixed configuration issues, 89 problems found (67 errors, 22 warnings)
- **Prettier**: Automated formatting applied to all files
- **Scripts**: `npm run lint`, `npm run prettier`

#### Code Duplication Analysis
- **Tool**: jscpd
- **Command**: `npm run audit:duplicates`
- **Current status**: 41 clones found (2.94% duplication)
- **Output**: `./reports/duplication/html/`

#### Test Coverage
- **Tool**: Vitest with coverage
- **Command**: `npm run test:coverage`
- **Current coverage**: Tests running, some failures to fix
- **Config**: Coverage reporting to `coverage/` directory

### ✅ Component Analysis
Large components identified (>200 lines):
- `sidebar.tsx`: 761 lines
- `SiteSettingsManager.tsx`: 599 lines
- `chart.tsx`: 363 lines
- `Debug.tsx`: 274 lines
- `carousel.tsx`: 260 lines

### ✅ Automated Scripts
- **Health check**: `npm run health-check` or `./scripts/health-check.sh`
- **Bundle analysis**: `npm run analyze` (configured)
- **Unused code detection**: `npm run audit:unused`

## Available Commands

```bash
# Development
npm run dev              # Start development server
npm run build           # Production build
npm run preview         # Preview production build

# Quality Assurance
npm run lint            # ESLint code analysis
npm run prettier        # Format code with Prettier
npm run test            # Run tests
npm run test:coverage   # Run tests with coverage
npm run audit:deps      # Check for vulnerabilities
npm run audit:duplicates # Find code duplication
npm run audit:unused    # Find unused imports/exports
npm run analyze         # Bundle size analysis
npm run health-check    # Complete health check

# Bundle size limits (configured in .bundlesize)
# - JavaScript: 400 kB max
# - CSS: 50 kB max
```

## Configuration Files

### `.jscpd.json`
Code duplication detection configuration:
- Minimum 10 lines, 50 tokens
- HTML and console reports
- Excludes tests and build artifacts

### `.bundlesize`
Bundle size monitoring configuration:
- JavaScript files: 400 kB limit
- CSS files: 50 kB limit

### `vite.config.ts`
Updated with test coverage configuration:
- v8 coverage provider
- HTML, JSON, and text reports
- Excludes test files and build artifacts

## Next Steps (Phase 2-4)

### High Priority
1. **Fix failing tests** - Currently 4 failed, 5 passed
2. **Component modularization** - Break down large components (>200 lines)
3. **Reduce code duplication** - Address 41 identified clones
4. **Error boundaries** - Implement comprehensive error handling

### Medium Priority  
1. **Bundle optimization** - Current bundle size analysis
2. **Performance testing** - Lighthouse integration
3. **TypeScript strict mode** - Fix `any` types (67+ instances)

### Ongoing
1. **Documentation** - API documentation generation
2. **CI/CD enhancement** - Parallel jobs, better caching
3. **Monitoring** - Automated quality metrics

## Quality Metrics Targets

- ✅ **Linting**: ESLint configuration working
- ✅ **Code duplication**: <5% (currently 2.94% ✅)
- 🟡 **Test coverage**: >95% (in progress)
- 🟡 **Bundle size**: <400kB JS, <50kB CSS (configured)
- 🟡 **Component size**: <200 lines (5 components exceed this)
- 🔴 **TypeScript strict**: 0 `any` types (currently 67+ errors)