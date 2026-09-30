$routes = @(
  '/',
  '/login',
  '/signup',
  '/onboarding',
  '/robots.txt',
  '/sitemap.xml',
  '/app/org/acme/overview',
  '/app/org/acme/my-work',
  '/app/org/acme/inbox',
  '/app/org/acme/strategy',
  '/app/org/acme/goals',
  '/app/org/acme/okrs',
  '/app/org/acme/roadmap',
  '/app/org/acme/calendar',
  '/app/org/acme/product',
  '/app/org/acme/projects',
  '/app/org/acme/projects/proj-1',
  '/app/org/acme/tasks',
  '/app/org/acme/engineering',
  '/app/org/acme/releases',
  '/app/org/acme/marketing',
  '/app/org/acme/brand',
  '/app/org/acme/distribution',
  '/app/org/acme/sales',
  '/app/org/acme/customers',
  '/app/org/acme/finance',
  '/app/org/acme/operations',
  '/app/org/acme/processes',
  '/app/org/acme/people',
  '/app/org/acme/documents',
  '/app/org/acme/wiki',
  '/app/org/acme/analytics',
  '/app/org/acme/reports',
  '/app/org/acme/automations',
  '/app/org/acme/flow-ai',
  '/app/org/acme/insights',
  '/app/org/acme/integrations',
  '/app/org/acme/settings',
  '/app/org/acme/admin',
  '/api/v1/health',
  '/api/v1/projects'
)

$results = @()
foreach ($r in $routes) {
  try {
    $resp = Invoke-WebRequest -Uri "http://localhost:3000$r" -UseBasicParsing -TimeoutSec 10
    $results += [PSCustomObject]@{
      Route = $r
      Status = $resp.StatusCode
      Bytes = $resp.Content.Length
    }
  } catch {
    $code = if ($_.Exception.Response) { [int]$_.Exception.Response.StatusCode } else { 500 }
    $results += [PSCustomObject]@{
      Route = $r
      Status = $code
      Bytes = 0
    }
  }
}

$results | Format-Table -AutoSize
$failures = $results | Where-Object { $_.Status -ne 200 }
if ($failures.Count -eq 0) {
  Write-Host "ALL $($results.Count) ROUTES VERIFIED HTTP 200 OK!" -ForegroundColor Green
  exit 0
} else {
  Write-Host "FAILED ROUTES DETECTED: $($failures.Count)" -ForegroundColor Red
  exit 1
}
