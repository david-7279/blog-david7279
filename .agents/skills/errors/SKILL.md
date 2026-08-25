---
name: errors
description: Diagnoses and resolves application, build, runtime, TypeScript, lint, test, dependency, and configuration errors in software projects. Use when the user provides an error message, stack trace, failing command, compiler output, test failure, or unexpected technical behavior and wants to identify the root cause and fix it. Do not use it for general code reviews, feature implementation without an error, or documentation-only changes.
---

# Error Diagnosis and Resolution

## Workflow

1. Capture the exact failure.
    - Read the complete error message, stack trace, command output, and relevant code.
    - Preserve the original error text when identifying the root cause.
    - Do not infer missing details when the repository or error output can provide them.

2. Identify the failure category.
    - Classify the failure as one or more of:
        - syntax or compile error
        - type error
        - lint or formatting error
        - test failure
        - runtime error
        - dependency or package-manager error
        - build or bundler error
        - environment or configuration error
        - database or network error
    - Use the project's actual tooling and terminology.

3. Inspect the project context.
    - Check the relevant source file and surrounding code.
    - Inspect the nearest configuration files, package manifest, lockfile, and scripts when relevant.
    - Follow existing project conventions before introducing a new pattern.
    - If the failure depends on a framework, library, runtime, or tool version, verify the installed version before proposing version-specific changes.

4. Trace the root cause.
    - Start from the first meaningful failure rather than the final cascading error.
    - Distinguish the root cause from secondary symptoms.
    - Identify the smallest change that explains the failure.
    - Avoid speculative fixes when evidence is insufficient.

5. Apply the smallest correct fix.
    - Modify only the files required to resolve the root cause.
    - Preserve existing behavior unless the requested fix requires a behavior change.
    - Do not rewrite unrelated code.
    - Prefer the project's existing dependencies and abstractions over introducing new ones.

6. Validate the fix.
    - Run the narrowest relevant validation first.
    - Then run the project's broader validation when practical:
        - type checking
        - linting
        - targeted tests
        - build
    - Re-run the failing command when possible.
    - Confirm that the original failure is resolved and that no new errors were introduced.

7. Report the result.
    - State the root cause.
    - State the change made.
    - State the validation performed and its result.
    - If validation cannot be completed, state exactly what remains unverified.

## Evidence Rules

- Treat compiler, runtime, test, and tool output as primary evidence.
- Prefer repository files over assumptions.
- Check package versions before relying on version-specific behavior.
- Do not claim a command succeeded unless it was actually executed or its successful output is available.
- Do not hide unrelated failures discovered during validation.

## Dependency and Configuration Failures

1. Inspect `package.json`, lockfiles, runtime versions, environment configuration, and project scripts before changing dependencies.
2. Determine whether the failure is caused by:
    - incompatible versions
    - missing dependencies
    - duplicate dependencies
    - incorrect configuration
    - invalid environment variables
    - stale generated artifacts
    - package-manager state
3. Prefer correcting the underlying compatibility or configuration issue over adding workarounds.
4. Do not upgrade or downgrade packages broadly unless the evidence shows that version compatibility is the root cause.

## Framework and Tooling Failures

1. Identify the framework and build/test tooling actually used by the project.
2. Read the relevant configuration before modifying it.
3. Preserve established project architecture.
4. When behavior differs between versions, verify the project's installed version and use documentation or repository evidence appropriate to that version.

## Test Failures

1. Determine whether the test assertion failed or the test environment failed.
2. Inspect the failing test and the implementation it exercises.
3. Fix production code when the behavior is incorrect.
4. Fix the test when the expectation or setup is incorrect.
5. Do not weaken assertions merely to make the suite pass.

## Error Handling

- If the error is incomplete, identify the exact missing evidence required to continue.
- If multiple root causes remain plausible, test or inspect evidence that distinguishes them before changing code.
- If a requested fix would conceal a deeper problem, prefer the root-cause fix and explain the trade-off.
- If the issue is caused by an external service, distinguish application-side failures from service-side failures.
- If a safe fix cannot be determined from the available evidence, stop before making speculative changes.