
const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:8000";

// -------------------- TYPES --------------------

export interface AnalyzeReviewInput {
  review: string;
  business_name?: string;
}

export interface Aspect {
  aspect: string;
  sentiment: "Positive" | "Negative" | "Neutral";
  reason: string;
}

export interface ReviewAnalysis {
  id: string;
  review: string;
  business_name: string | null;
  sentiment: "Positive" | "Negative";
  confidence: number;
  summary: string;
  aspects: Aspect[];
  key_issues: string[];
  positive_points: string[];
  recommendations: string[];
}

export interface AuthUser {
  id: string;
  name: string;
  email: string;
}

export interface SignupInput {
  name: string;
  email: string;
  password: string;
}

export interface LoginInput {
  email: string;
  password: string;
}

// -------------------- API REQUEST --------------------

async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    credentials: "include",
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw new Error(
      errorData?.detail || `API request failed: ${response.status}`
    );
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json();
}

// -------------------- AUTHENTICATION --------------------

// Signup
export function signup(input: SignupInput) {
  return apiRequest<{ message: string; user: AuthUser }>("/auth/signup", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(input),
  });
}

// Login
export function login(input: LoginInput) {
  return apiRequest<{ message: string; user: AuthUser }>("/auth/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(input),
  });
}

// Get currently logged-in user
export function getCurrentUser() {
  return apiRequest<{ user: AuthUser }>("/auth/me");
}

// Logout
export function logout() {
  return apiRequest<{ message: string }>("/auth/logout", {
    method: "POST",
  });
}

// -------------------- REVIEW ANALYSIS --------------------

// Analyze a single customer review
export function analyzeReview(
  input: AnalyzeReviewInput
): Promise<ReviewAnalysis> {
  return apiRequest<ReviewAnalysis>("/analyze", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(input),
  });
}

// Fetch dashboard statistics
export function getDashboardStats() {
  return apiRequest<{
    total_reviews: number;
    positive_count: number;
    negative_count: number;
    positive_percentage: number;
    negative_percentage: number;
    top_aspects: {
      aspect: string;
      positive: number;
      negative: number;
      neutral: number;
    }[];
  }>("/dashboard/stats");
}

// Fetch business insights
export function getInsights() {
  return apiRequest<{
    recurring_issues: { issue: string; count: number }[];
    popular_positive_points: { point: string; count: number }[];
  }>("/insights");
}

// Fetch review history
export function getReviews(limit = 50) {
  return apiRequest<{
    total: number;
    reviews: ReviewAnalysis[];
  }>(`/reviews?limit=${limit}`);
}

// Upload CSV file
export function analyzeCsv(file: File) {
  const formData = new FormData();
  formData.append("file", file);

  return apiRequest<{
    total_processed: number;
    results: ReviewAnalysis[];
  }>("/analyze-csv", {
    method: "POST",
    body: formData,
  });
}
