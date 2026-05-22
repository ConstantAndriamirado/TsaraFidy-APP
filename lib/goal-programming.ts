/**
 * Goal Programming Algorithm Configuration and Calculation
 * This file contains the optimization algorithm for ranking candidates.
 * 
 * You can modify the weights, formulas, and constraints below to change
 * how candidates are scored and ranked.
 */

// ==================== CONFIGURATION ====================
// Modify these values to change the optimization behavior

export const GOAL_PROGRAMMING_CONFIG = {
  // Weight for experience score (0-1)
  experienceWeight: 0.4,
  
  // Weight for rating score (0-1)
  ratingWeight: 0.6,
  
  // Maximum years of experience for normalization
  maxExperienceYears: 20,
  
  // Maximum rating score
  maxRatingScore: 5,
  
  // Bonus for candidates with "Shortlisted" status
  shortlistedBonus: 0.15,
  
  // Penalty for candidates with "Rejected" status
  rejectedPenalty: 0,
};

// ==================== TYPES ====================

export interface Candidate {
  id: string;
  first_name: string;
  last_name: string;
  experience_years?: number;
  rating?: number;
  status: string;
}

export interface CandidateScore {
  candidate: Candidate;
  experienceScore: number;
  ratingScore: number;
  finalScore: number;
  rank: number;
}

// ==================== MAIN OPTIMIZATION FUNCTION ====================

/**
 * Calculate Goal Programming scores for candidates
 * 
 * Algorithm breakdown:
 * 1. Normalize experience score: (years / maxYears) * 100
 * 2. Normalize rating score: (rating / maxRating) * 100
 * 3. Calculate weighted score: (experience * experienceWeight) + (rating * ratingWeight)
 * 4. Apply status bonuses/penalties
 * 5. Rank candidates by final score (descending)
 * 
 * @param candidates Array of candidates to score
 * @param config Optional override for configuration
 * @returns Ranked array of candidates with scores
 */
export function optimizeCandidates(
  candidates: Candidate[],
  config: typeof GOAL_PROGRAMMING_CONFIG = GOAL_PROGRAMMING_CONFIG
): CandidateScore[] {
  // Filter out rejected candidates (optional - can be changed)
  const activeCandidates = candidates.filter(c => c.status !== 'Rejected');
  
  if (activeCandidates.length === 0) {
    return [];
  }

  // Step 1: Calculate scores for each candidate
  const scores: CandidateScore[] = activeCandidates.map((candidate) => {
    const experienceScore = calculateExperienceScore(candidate, config);
    const ratingScore = calculateRatingScore(candidate, config);
    
    // Step 2: Apply weighted formula
    let finalScore = 
      (experienceScore * config.experienceWeight) +
      (ratingScore * config.ratingWeight);
    
    // Step 3: Apply status bonuses/penalties
    finalScore = applyStatusAdjustment(finalScore, candidate.status, config);
    
    // Ensure score is between 0 and 100
    finalScore = Math.max(0, Math.min(100, finalScore));
    
    return {
      candidate,
      experienceScore,
      ratingScore,
      finalScore,
      rank: 0, // Will be set after sorting
    };
  });

  // Step 4: Sort by final score (descending)
  scores.sort((a, b) => b.finalScore - a.finalScore);
  
  // Step 5: Assign ranks
  scores.forEach((score, index) => {
    score.rank = index + 1;
  });

  return scores;
}

// ==================== HELPER FUNCTIONS ====================

/**
 * Calculate experience score (0-100)
 * Normalizes years of experience to a 0-100 scale
 */
function calculateExperienceScore(
  candidate: Candidate,
  config: typeof GOAL_PROGRAMMING_CONFIG
): number {
  const years = candidate.experience_years || 0;
  
  // Normalize: (years / maxYears) * 100
  const normalizedScore = (years / config.maxExperienceYears) * 100;
  
  // Cap at 100
  return Math.min(100, normalizedScore);
}

/**
 * Calculate rating score (0-100)
 * Normalizes rating to a 0-100 scale
 */
function calculateRatingScore(
  candidate: Candidate,
  config: typeof GOAL_PROGRAMMING_CONFIG
): number {
  const rating = candidate.rating || 0;
  
  // Normalize: (rating / maxRating) * 100
  const normalizedScore = (rating / config.maxRatingScore) * 100;
  
  // Cap at 100
  return Math.min(100, normalizedScore);
}

/**
 * Apply status-based adjustments to the score
 * Different statuses can boost or reduce the score
 */
function applyStatusAdjustment(
  score: number,
  status: string,
  config: typeof GOAL_PROGRAMMING_CONFIG
): number {
  let adjustedScore = score;
  
  switch (status) {
    case 'Shortlisted':
      // Boost shortlisted candidates
      adjustedScore += config.shortlistedBonus * 100;
      break;
      
    case 'Rejected':
      // Reduce rejected candidates (or they're already filtered)
      adjustedScore *= (1 - config.rejectedPenalty);
      break;
      
    case 'In Review':
      // No adjustment for "In Review"
      break;
      
    case 'New':
      // No adjustment for "New"
      break;
      
    default:
      // No adjustment for unknown status
      break;
  }
  
  return adjustedScore;
}

/**
 * Export a summary of the algorithm configuration
 * Useful for displaying to users how scoring works
 */
export function getAlgorithmSummary(): string {
  const config = GOAL_PROGRAMMING_CONFIG;
  
  return `Goal Programming Optimization:
    - Experience Weight: ${(config.experienceWeight * 100).toFixed(0)}%
    - Rating Weight: ${(config.ratingWeight * 100).toFixed(0)}%
    - Shortlisted Bonus: +${(config.shortlistedBonus * 100).toFixed(0)} points
    - Max Experience: ${config.maxExperienceYears} years
    - Max Rating: ${config.maxRatingScore} stars`;
}
