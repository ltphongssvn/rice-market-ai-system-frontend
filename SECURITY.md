# Security Best Practices Implementation

~/code/ltphongssvn/AC215_ERP_FOR_SMES/SECURITY.md

## Secret Management Implementation

### 1. Pre-commit Secret Detection Setup

**Installation:**
```bash
uv pip install pre-commit detect-secrets
```

**Configuration (.pre-commit-config.yaml):**
```yaml
repos:
  - repo: https://github.com/Yelp/detect-secrets
    rev: v1.5.0
    hooks:
      - id: detect-secrets
        args: ['--baseline', '.secrets.baseline']
        exclude: .*\.lock|.*\.log|.*\.pyc
```

**Activation:**
```bash
detect-secrets scan > .secrets.baseline
pre-commit install
```

### 2. Secrets Remediation Performed

| File | Issue | Fix |
|------|-------|-----|
| `src/services/rag-orchestrator/src/core/tests/verify_openai_integration.py` | Hardcoded OpenAI API key | Replaced with `os.getenv('OPENAI_API_KEY')` |
| `src/services/nl-sql-service/docker-compose.yml` | Hardcoded PostgreSQL password | Changed to `${POSTGRES_PASSWORD:-localdev123}` |
| `src/services/start_all_microservices.py` | Hardcoded database password | Changed to `os.getenv("POSTGRES_PASSWORD", "postgres")` |

### 3. Environment Variables Required

Create `.env` file (never commit):
```bash
OPENAI_API_KEY=your_key_here
GOOGLE_API_KEY=your_key_here
POSTGRES_PASSWORD=your_password_here
PGADMIN_PASSWORD=your_password_here
WANDB_API_KEY=your_key_here
```

### 4. Pre-commit Workflow

Every commit now automatically:
1. Scans for secrets using detect-secrets
2. Blocks commit if new secrets found
3. Updates `.secrets.baseline` for allowed patterns

**Manual scan:**
```bash
pre-commit run --all-files
```

### 5. Team Guidelines

- Never commit `.env` files
- Use environment variables for all credentials
- Run `pre-commit install` after cloning
- Review `.secrets.baseline` changes carefully
- Rotate any accidentally exposed keys immediately

## Verification
```bash
$ pre-commit run --all-files
Detect secrets...........................................................Passed
```

All secrets removed and pre-commit protection active.
