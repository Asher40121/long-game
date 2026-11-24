#!/usr/bin/env bash
# Pre-push secrets scan: checks every file git would publish for common key patterns
# and for files that should never be committed. Exit 1 on any finding.
set -u
cd "$(git rev-parse --show-toplevel)"
fail=0
files=$(git ls-files --cached --others --exclude-standard)
patterns='sk-ant-[A-Za-z0-9_-]{10,}|ANTHROPIC_API_KEY *= *[^ #]+|gh[pousr]_[A-Za-z0-9]{20,}|AKIA[0-9A-Z]{16}|-----BEGIN [A-Z ]*PRIVATE KEY-----|xox[baprs]-[A-Za-z0-9-]{10,}|AIza[0-9A-Za-z_-]{35}'
hits=$(printf '%s\n' "$files" | grep -v '^scripts/secret-scan.sh$' | tr '\n' '\0' | xargs -0 grep -nIE "$patterns" 2>/dev/null)
if [ -n "$hits" ]; then echo "Possible secrets found:"; echo "$hits"; fail=1; fi
bad=$(printf '%s\n' "$files" | grep -E '(^|/)\.env($|\.)|\.pem$|CLAUDE\.local\.md$' | grep -v '\.env\.example$')
if [ -n "$bad" ]; then echo "Files that must not be committed:"; echo "$bad"; fail=1; fi
[ $fail -eq 0 ] && echo "Secrets scan: clean ($(printf '%s\n' "$files" | wc -l | tr -d ' ') files checked)"
exit $fail
