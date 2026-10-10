# Implementation Plan - Dravyaguna-AI Backend

## Current Status
The backend has a strong foundation:
- ✅ Database schema with migrations (herbs, vocabulary, users, audit log, translation cache, RAG cache)
- ✅ Authentication (JWT + bcrypt, 4 roles)
- ✅ Scoring engine with LEFT JOIN LATERAL SQL (single query, ~7ms target)
- ✅ Basic security (Helmet, CORS, rate limiting, structured logging)
- ✅ Data import script
- ✅ Load testing infrastructure

## Missing Features to Implement

### 1. Multi-Language Support (HIGH PRIORITY)
**Architecture:**
- Original content tagged with `original_language` (already in schema)
- On-demand translation with caching via `translation_cache` table
- Primary: Sarvam AI (supports en-IN, hi-IN, mr-IN, sa-IN)
- Fallback: Google Cloud Translation or Microsoft Azure Translator
- Language detection for queries
- Translation quality transparency (machine_translated vs verified_translation)

**Implementation:**
```
backend/src/services/translation/
  - translationService.js (main service with cache-or-translate logic)
  - sarvamProvider.js (Sarvam AI API integration)
  - googleProvider.js (Google Cloud Translation fallback)
  - azureProvider.js (Azure Translator fallback)
  - languageDetector.js (detect query language)

backend/src/routes/translation.routes.js
  - GET /api/translations/:content_type/:content_id/:field/:lang
  - POST /api/translations/verify (admin/domain_expert only)
```

**Flow:**
1. Request herb in language X
2. Check `translation_cache` for (content_type, content_id, field, target_language)
3. If cache hit: return cached translation with status
4. If cache miss: call Sarvam AI → store in cache → return
5. If Sarvam fails: try Google → Azure
6. Admin/domain_expert can mark translation as "verified_translation"

### 2. RAG Layer for Natural-Language Explanations (HIGH PRIORITY)
**Architecture:**
- Retrieve actual herb data from database (scoring breakdown, attributes, references)
- Augment LLM prompt with retrieved context only
- Generate explanation grounded in real data
- Cache explanations per herb+filter-combination
- Swappable LLM provider via environment variable

**Implementation:**
```
backend/src/services/rag/
  - ragService.js (main service with cache-or-generate logic)
  - anthropicProvider.js (Anthropic integration - primary)
  - openaiProvider.js (OpenAI integration - fallback)
  - promptBuilder.js (build grounded prompts)

backend/src/routes/rag.routes.js
  - POST /api/explain (herb_id + filters → AI explanation)
```

**Flow:**
1. Given herb_id and search filters
2. Retrieve herb's structured data + scoring breakdown from DB
3. Check `rag_explanation_cache` for cache_key (herb_id + filters_hash)
4. If cache hit: return cached explanation
5. If cache miss: build prompt with retrieved context → call LLM → cache → return
6. Response includes `"ai_generated": true` flag

**Guardrails:**
- Ranking never passes through LLM (stays in deterministic engine)
- LLM instructed to not add dosages/contraindications beyond retrieved data
- Cite classical references when present

### 3. Herb CRUD Endpoints (HIGH PRIORITY)
**Implementation:**
```
backend/src/routes/herbs.routes.js
  - GET /api/herbs (list with pagination, status filter)
  - GET /api/herbs/:id (full profile, language-aware)
  - POST /api/herbs (create - editor+)
  - PUT /api/herbs/:id (update - editor+)
  - POST /api/herbs/:id/verify (verify - domain_expert/admin only)
  - DELETE /api/herbs/:id (delete - admin only)

backend/src/services/herbs/herbService.js
  - getHerbById (with translation layer integration)
  - createHerb
  - updateHerb
  - verifyHerb
  - deleteHerb
  - listHerbs
```

**Language-aware retrieval:**
- GET /api/herbs/:id?lang=hi-IN
- Check if herb.original_language === hi-IN → return original
- Else check translation_cache → return cached or trigger translation

### 4. Vocabulary Management Endpoints (MEDIUM PRIORITY)
**Implementation:**
```
backend/src/routes/vocabulary.routes.js
  - GET /api/vocabulary/:type (list terms - e.g., karma, indication)
  - POST /api/vocabulary/:type (add term - editor+)
  - PUT /api/vocabulary/:type/:id (update term - editor+)
  - DELETE /api/vocabulary/:type/:id (delete term - admin only)

backend/src/services/vocabulary/vocabularyService.js
```

**Supports "Others" growth pattern:**
- Admin can add new Karma/Indication terms via API
- Terms immediately searchable without code deployment

### 5. Search Analytics Endpoints (MEDIUM PRIORITY)
**Implementation:**
```
backend/src/routes/analytics.routes.js
  - GET /api/analytics/search/summary (total, zero-result, weak-match)
  - GET /api/analytics/search/recent (recent query log)
  - GET /api/analytics/search/by-language (breakdown by language)

backend/src/services/analytics/analyticsService.js
```

### 6. Audit Log Endpoints (MEDIUM PRIORITY)
**Implementation:**
```
backend/src/routes/audit.routes.js
  - GET /api/audit/log (with filters: entity_type, actor_id, date range)

backend/src/services/audit/auditService.js
  - logAuditEvent (called by all write operations)
```

### 7. Object Storage for Herb Images (MEDIUM PRIORITY)
**Implementation:**
```
backend/src/services/storage/
  - storageService.js (abstract interface)
  - supabaseStorageProvider.js (Supabase Storage)
  - s3Provider.js (AWS S3)

backend/src/routes/upload.routes.js
  - POST /api/upload/herb-image (upload image, return URL)
```

**Environment variables:**
```
STORAGE_PROVIDER=supabase|s3
SUPABASE_STORAGE_URL=
SUPABASE_STORAGE_KEY=
AWS_S3_BUCKET=
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
AWS_REGION=
```

### 8. Password Reset Flow (LOW PRIORITY - INFRA NEEDED)
**Implementation:**
```
backend/src/routes/auth.routes.js (extend)
  - POST /api/auth/password-reset/request (send email with token)
  - POST /api/auth/password-reset/confirm (reset password with token)

backend/src/services/auth/passwordResetService.js
```

**Infrastructure needed:**
- SMTP configuration (SendGrid, AWS SES, etc.)
- Email templates
- Production secrets manager for SMTP credentials

### 9. Frontend Integration (HIGH PRIORITY)
**Tasks:**
1. Replace mock data in all 17 React pages with real API calls
2. Add authentication state management (store JWT, handle 401s)
3. Add language selection UI component
4. Wire translation layer to herb detail pages
5. Wire RAG explanations to "View more" in info-icon

**API Contract (stable, documented):**
- All responses include `lang` field indicating response language
- Machine-translated content includes `"machine_translated": true`
- AI-generated content includes `"ai_generated": true`
- Role-based 403 responses consistent across endpoints

### 10. Info-Icon Frontend Component (MEDIUM PRIORITY)
**Implementation:**
```
src/components/InfoIcon.jsx
  - Props: term, herbId (optional), context (filters used)
  - Desktop: hover shows tooltip with short definition
  - Mobile: tap toggles tooltip
  - "View more" button:
    - If herbId provided: call /api/explain (RAG)
    - Else: show stored definition from vocabulary
  - Keyboard accessible (Tab, Escape)
  - AI-generated content labeled
```

## File Structure Additions

```
backend/src/
  services/
    translation/
      - translationService.js
      - sarvamProvider.js
      - googleProvider.js
      - azureProvider.js
      - languageDetector.js
    rag/
      - ragService.js
      - openaiProvider.js
      - anthropicProvider.js
      - promptBuilder.js
    herbs/
      - herbService.js
    vocabulary/
      - vocabularyService.js
    analytics/
      - analyticsService.js
    audit/
      - auditService.js
    storage/
      - storageService.js
      - supabaseStorageProvider.js
      - s3Provider.js
  routes/
    - herbs.routes.js
    - translation.routes.js
    - rag.routes.js
    - vocabulary.routes.js
    - analytics.routes.js
    - audit.routes.js
    - upload.routes.js
  middleware/
    - requireRole.js (move from auth.js)
    - auditLogger.js (auto-log write operations)

frontend/src/
  components/
    - InfoIcon.jsx
  utils/
    - api.js (centralized API client with auth handling)
    - translations.js (translation layer integration)
```

## SQL Scoring Engine Verification

The existing `buildSearchQuery.js` uses LEFT JOIN LATERAL correctly:
- Single aggregate SQL query (no N+1 pattern)
- Computes weighted score directly in SQL
- Returns transparent breakdown per parameter group
- Configurable weights via `scoring_weights` table

**Performance target:** ~7ms at 300+ herbs
- Verified via loadtest:search script
- If slower, run explain:search to analyze query plan

## Translation Caching Flow

1. **Cache check:**
   ```sql
   SELECT translated_text, status, cached_at
   FROM translation_cache
   WHERE content_type = $1
     AND content_id = $2
     AND field_name = $3
     AND target_language = $4
   ```

2. **Cache miss → translate:**
   - Call Sarvam AI API with source text and target language
   - Store result with status='machine_translated'
   - Return immediately

3. **Verification:**
   - Admin/domain_expert calls POST /api/translations/verify
   - Update status to 'verified_translation'
   - Store verified_by user_id

4. **Cache invalidation:**
   - On herb update, delete relevant translation_cache entries
   - Next request triggers fresh translation

## RAG Caching Flow

1. **Cache key:** `herb_id + sha256(filters_json)`
2. **Cache check:**
   ```sql
   SELECT explanation_text, created_at
   FROM rag_explanation_cache
   WHERE cache_key = $1
   ```
3. **Cache miss → generate:**
   - Retrieve herb data + scoring breakdown
   - Build prompt with retrieved context
   - Call LLM (OpenAI/Anthropic based on env)
   - Store with cache_key
   - Return with `"ai_generated": true`

## Environment Variables (Additions to .env.example)

```
# Translation
SARVAM_API_KEY=
GOOGLE_TRANSLATE_API_KEY=
AZURE_TRANSLATOR_KEY=
AZURE_TRANSLATOR_REGION=

# RAG / LLM
LLM_PROVIDER=openai|anthropic
OPENAI_API_KEY=
OPENAI_MODEL=gpt-4
ANTHROPIC_API_KEY=
ANTHROPIC_MODEL=claude-3-opus-20240229

# Object Storage
STORAGE_PROVIDER=supabase|s3
SUPABASE_STORAGE_URL=
SUPABASE_STORAGE_KEY=
AWS_S3_BUCKET=
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
AWS_REGION=

# Email (password reset - production only)
SMTP_HOST=
SMTP_PORT=
SMTP_USER=
SMTP_PASSWORD=
SMTP_FROM=
```

## Security Status

**Done:**
- ✅ Environment variables for secrets
- ✅ Input validation (Zod schemas)
- ✅ Parameterized queries (pg library)
- ✅ Rate limiting on login
- ✅ Helmet.js for security headers
- ✅ CORS restricted to frontend origin
- ✅ Role-based access control (server-side)
- ✅ Bcrypt password hashing
- ✅ JWT authentication

**Needs infrastructure:**
- ⏳ Production secrets manager (AWS Secrets Manager, etc.)
- ⏳ HTTPS (provided by hosting platform)
- ⏳ SMTP for password reset emails
- ⏳ Error tracking (Sentry integration before launch)

## Testing Plan

1. **Scoring math verification:**
   - Seed Ashwagandha, Guduchi, Shatavari, Haridra
   - Run detailed search with known filters
   - Manually verify match percentage calculation

2. **Load testing:**
   - Scale to 300+ herbs via scaleHerbsForBenchmark.js
   - Run loadtest:search
   - Verify p95 < 50ms (target ~7ms)

3. **Role restrictions:**
   - Test clinician token gets 403 on admin endpoints
   - Test editor cannot verify herbs
   - Test only domain_expert/admin can verify translations

4. **Weights cache invalidation:**
   - Update weight via API
   - Run search immediately
   - Verify new weight reflected

5. **Translation flow:**
   - Request herb in uncached language
   - Verify translation API called and cached
   - Request same herb+language again
   - Verify served from cache (no API call)

6. **RAG flow:**
   - Request explanation for herb+filters
   - Verify LLM called with retrieved context
   - Request same combination again
   - Verify served from cache

## Production Hosting Recommendations

**Backend:**
- Render, Railway, Fly.io, or AWS ECS
- Environment separation (dev/staging/production)
- Managed PostgreSQL (Supabase, RDS, Azure Database)

**Database:**
- Supabase (recommended for built-in storage + backups)
- Daily backups with 7-30 day retention
- Point-in-time recovery enabled

**Images:**
- Supabase Storage (if using Supabase DB)
- AWS S3 + CloudFront (if using AWS)
- Store only URLs in herbs.image_url

**Scaling boundary:**
- In-memory caches (weights, translation, RAG) work for single instance
- Move to Redis when scaling to multiple instances behind load balancer
- Documented in code comments as known future step

## Implementation Order

1. Herb CRUD endpoints (list, get, create, update, verify, delete)
2. Multi-language support (translation service + endpoints)
3. RAG layer (explanation service + endpoint)
4. Vocabulary management endpoints
5. Search analytics endpoints
6. Audit log endpoints
7. Object storage for images
8. Frontend API integration (all 17 pages)
9. Info-icon component
10. Password reset flow (last - needs SMTP infrastructure)
